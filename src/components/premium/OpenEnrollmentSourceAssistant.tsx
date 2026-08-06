import { useRef, useState, type ChangeEvent } from "react";
import { CheckCircle2, FileSearch2, ShieldAlert, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { extractSyntheticBenefitsFacts } from "@/premium/documentExtraction";
import {
  benefitDocumentKindLabels,
  type BenefitDocumentKind,
  type ExtractedBenefitFact,
} from "@/premium/documentIntakeContracts";
import {
  applyConfirmedOpenEnrollmentFacts,
  type OpenEnrollmentSourceTarget,
} from "@/premium/openEnrollmentSource";
import type { OpenEnrollmentPilotState } from "@/premium/openEnrollmentPilot";
import { scanSensitiveData } from "@/premium/sensitiveDataDetector";

type Candidate = ExtractedBenefitFact & { selected: boolean };
const LOCAL_SOURCE_MAX_BYTES = 1024 * 1024;

const sourceCategories = [
  "benefits_guide",
  "medical_plan_summary",
  "retirement_summary",
  "leave_and_protection_summary",
  "pharmacy_or_network_reference",
  "alternate_household_plan",
] as const satisfies readonly BenefitDocumentKind[];

const findingLabels: Record<string, string> = {
  social_security_number: "a Social Security number",
  date_of_birth: "a date of birth",
  email_address: "an email address",
  phone_number: "a phone number",
  street_address: "a street address",
  employee_identifier: "an employee identifier",
  member_or_policy_identifier: "a member, policy, or group identifier",
  claim_or_eob_identifier: "a claim or EOB identifier",
  financial_account_identifier: "a financial-account identifier",
  payment_card_identifier: "a payment-card number",
  credential_or_password: "a credential or password",
  medical_record_or_diagnosis: "medical-record or diagnosis information",
  official_election_or_confirmation: "an official election or confirmation record",
  individualized_pay_statement: "an individualized pay statement",
  sensitive_filename: "a sensitive filename",
};

const formatFact = (fact: ExtractedBenefitFact) => {
  if (fact.unit === "usd") {
    const amount = fact.value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
    const cadence = fact.cadence === "per_pay_period"
      ? " per paycheck"
      : fact.cadence === "monthly"
        ? " per month"
        : fact.cadence === "annual"
          ? " per year"
          : " (cadence not found)";
    return `${amount}${cadence}`;
  }
  if (fact.unit === "percent") return `${fact.value}%`;
  return `${fact.value} year${fact.value === 1 ? "" : "s"}`;
};

export const OpenEnrollmentSourceAssistant = ({
  state,
  onStateChange,
}: {
  state: OpenEnrollmentPilotState;
  onStateChange: (state: OpenEnrollmentPilotState) => void;
}) => {
  const [sourceCategory, setSourceCategory] = useState<BenefitDocumentKind>("medical_plan_summary");
  const [target, setTarget] = useState<OpenEnrollmentSourceTarget>("a");
  const [sourceText, setSourceText] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const blockedMessage = (findingCodes: string[]) =>
    `This source was blocked locally because it appears to contain ${findingCodes.map((code) => findingLabels[code] || code).join(", ")}. Nothing was transmitted or saved.`;

  const inspectText = (text: string, fileName = "") => {
    setCandidates([]);
    setMessage("");
    setError("");
    const scan = scanSensitiveData({ text, fileName });
    if (scan.blocked) {
      setSourceText("");
      setError(blockedMessage(scan.findingCodes));
      return;
    }
    setSourceText(text.slice(0, 200_000));
  };

  const chooseFile = async (event: ChangeEvent<HTMLInputElement>) => {
    setCandidates([]);
    setMessage("");
    setError("");
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.type !== "text/plain" && !file.name.toLowerCase().endsWith(".txt")) {
      setError("Choose a plain-text (.txt) excerpt. For a PDF, copy only the relevant general plan text into the box.");
      return;
    }
    if (file.size <= 0 || file.size > LOCAL_SOURCE_MAX_BYTES) {
      setError("The text excerpt must be larger than zero bytes and no more than 1 MB.");
      return;
    }
    inspectText(await file.text(), file.name);
    setMessage("The file was read only in this browser. Review the excerpt, then analyze it locally.");
  };

  const analyze = () => {
    const text = sourceText.trim();
    if (!text) {
      setError("Paste a general plan excerpt or choose a plain-text file first.");
      return;
    }
    const result = extractSyntheticBenefitsFacts(text);
    setSourceText("");
    if (result.blocked) {
      setCandidates([]);
      setError(blockedMessage(result.findingCodes));
      return;
    }
    setError("");
    setCandidates(result.facts.map((fact) => ({ ...fact, selected: true })));
    setMessage(result.facts.length
      ? "Potential values were found and the raw excerpt was discarded. Confirm each value before adding it."
      : "No supported values were found, and the raw excerpt was discarded. Enter the values manually in the medical or retirement stage.");
  };

  const applyFacts = () => {
    const facts = candidates.filter((candidate) => candidate.selected).map(({ selected: _selected, ...fact }) => fact);
    if (!facts.length) {
      setError("Select at least one value to confirm.");
      return;
    }
    const result = applyConfirmedOpenEnrollmentFacts({ state, facts, target, sourceCategory });
    onStateChange(result.state);
    setCandidates([]);
    setError("");
    const skipped = result.skippedFactKeys.length
      ? ` ${result.skippedFactKeys.length} value could not be mapped automatically and remains a manual verification item.`
      : "";
    setMessage(`${result.appliedFactKeys.length} confirmed value${result.appliedFactKeys.length === 1 ? " was" : "s were"} added to the planning record.${skipped} No source text or file was retained. Review the source-readiness status above separately.`);
  };

  return (
    <section className="mt-6 rounded-2xl border border-primary/20 bg-primary-soft/15 p-5" aria-labelledby="pilot-source-assistant-heading">
      <div className="flex items-start gap-3">
        <FileSearch2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <h5 id="pilot-source-assistant-heading" className="font-display text-lg font-bold">Bring in general plan values—without uploading the document</h5>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Paste or choose a plain-text excerpt from a benefits guide or plan summary. It is analyzed only in this browser, screened for sensitive data, then discarded.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">Source type
          <select value={sourceCategory} onChange={(event) => setSourceCategory(event.target.value as BenefitDocumentKind)} className="mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-3 text-sm">
            {sourceCategories.map((category) => <option key={category} value={category}>{benefitDocumentKindLabels[category]}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold">Apply plan values to
          <select value={target} onChange={(event) => setTarget(event.target.value as OpenEnrollmentSourceTarget)} className="mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-3 text-sm">
            <option value="a">{state.plans.a.label || "Plan A"}</option>
            {state.compareSecondPlan && <option value="b">{state.plans.b.label || "Plan B"}</option>}
          </select>
        </label>
      </div>

      <label className="mt-4 block text-sm font-semibold">General plan excerpt
        <textarea
          value={sourceText}
          onChange={(event) => inspectText(event.target.value)}
          rows={7}
          maxLength={200_000}
          placeholder="Example: Employee premium $125 per paycheck\nAnnual deductible $1,500\nOut-of-pocket maximum $5,000"
          className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </label>
      <div className="mt-3 flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>Choose .txt excerpt</Button>
        <input ref={fileInputRef} type="file" accept=".txt,text/plain" onChange={chooseFile} aria-label="Choose a plain-text benefits excerpt" className="sr-only" />
        <Button type="button" onClick={analyze} disabled={!sourceText.trim()}>Analyze locally</Button>
        {sourceText && <Button type="button" variant="ghost" onClick={() => { setSourceText(""); setCandidates([]); setMessage(""); }}><Trash2 className="h-4 w-4" />Discard</Button>}
      </div>

      {candidates.length > 0 && (
        <div className="mt-5 rounded-xl border border-border bg-background p-4">
          <h6 className="text-sm font-bold">Review values before confirming</h6>
          <div className="mt-3 space-y-2">
            {candidates.map((candidate, index) => (
              <label key={`${candidate.key}-${index}`} className="flex items-start gap-3 rounded-lg border border-border p-3 text-sm">
                <input type="checkbox" checked={candidate.selected} onChange={(event) => setCandidates((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, selected: event.target.checked } : item))} className="mt-0.5 h-5 w-5" />
                <span><strong>{candidate.label}</strong><span className="block text-muted-foreground">{formatFact(candidate)}{candidate.lineNumber ? ` · excerpt line ${candidate.lineNumber}` : ""}</span></span>
              </label>
            ))}
          </div>
          <Button type="button" onClick={applyFacts} className="mt-4"><CheckCircle2 className="h-4 w-4" />Confirm selected values</Button>
        </div>
      )}

      {(message || error) && <div className={`mt-4 flex items-start gap-2 rounded-xl border p-3 text-sm ${error ? "border-amber-200 bg-amber-50 text-amber-950" : "border-emerald-200 bg-emerald-50 text-emerald-950"}`} role="status"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />{error || message}</div>}
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Do not include names, dates of birth, member or employee IDs, claims, diagnoses, pay statements, account numbers, credentials, or election confirmations. Official documents and the employer portal control.</p>
    </section>
  );
};
