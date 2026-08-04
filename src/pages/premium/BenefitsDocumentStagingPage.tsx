import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileInput,
  FileLock2,
  FileSearch2,
  LoaderCircle,
  Save,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getWorkspace,
  saveWorkspace,
  PremiumApiError,
} from "@/premium/apiClient";
import {
  emptyWorkspaceState,
  workspaceRecordSchema,
  type WorkspaceRecord,
} from "@/premium/contracts";
import { extractSyntheticBenefitsFacts } from "@/premium/documentExtraction";
import {
  benefitDocumentKindLabels,
  benefitDocumentKindSchema,
  extractedBenefitFactSchema,
  type BenefitDocumentKind,
  type ExtractedBenefitFact,
} from "@/premium/documentIntakeContracts";
import {
  applyConfirmedLocalBenefitsFacts,
  LOCAL_BENEFITS_SOURCE_MAX_BYTES,
  type BenefitsSourceTarget,
} from "@/premium/localBenefitsSource";
import { scanSensitiveData } from "@/premium/sensitiveDataDetector";
import { usePremiumAuth } from "@/premium/auth/AuthProvider";

const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
const textAreaClass = `${inputClass} min-h-52 py-3`;
const DEV_STORAGE_KEY = "caf-premium-development-demo-workspace";
const DEFAULT_DEMO_WORKSPACE_ID = "10000000-0000-4000-8000-000000000001";

const findingLabels: Record<string, string> = {
  social_security_number: "Social Security number",
  date_of_birth: "date of birth",
  email_address: "email address",
  phone_number: "phone number",
  street_address: "street address",
  employee_identifier: "employee identifier",
  member_or_policy_identifier: "member, policy, or group identifier",
  claim_or_eob_identifier: "claim or EOB identifier",
  financial_account_identifier: "financial account identifier",
  payment_card_identifier: "payment-card number",
  credential_or_password: "credential or password",
  medical_record_or_diagnosis: "medical record or diagnosis information",
  official_election_or_confirmation: "official election or confirmation record",
  individualized_pay_statement: "individualized pay statement",
  sensitive_filename: "sensitive filename",
};

type Candidate = ExtractedBenefitFact & { selected: boolean };

const readableError = (error: unknown) => error instanceof PremiumApiError
  ? error.message
  : error instanceof Error
    ? error.message
    : "The source assistant could not complete the request.";

const makeDemoRecord = (id: string): WorkspaceRecord => ({
  id: id || DEFAULT_DEMO_WORKSPACE_ID,
  title: "Local development comparison",
  status: "active",
  progressPercent: 0,
  state: emptyWorkspaceState(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const readDemoRecord = (id: string) => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(DEV_STORAGE_KEY) || "null");
    return parsed ? workspaceRecordSchema.parse(parsed) : makeDemoRecord(id);
  } catch {
    return makeDemoRecord(id);
  }
};

const writeDemoRecord = (record: WorkspaceRecord) => {
  window.localStorage.setItem(DEV_STORAGE_KEY, JSON.stringify(record));
};

const formatValue = (fact: ExtractedBenefitFact) => {
  if (fact.unit === "usd") return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(fact.value);
  if (fact.unit === "percent") return `${fact.value}%`;
  return `${fact.value} year${fact.value === 1 ? "" : "s"}`;
};

export default function BenefitsDocumentStagingPage() {
  const { workspaceId = "" } = useParams();
  const auth = usePremiumAuth();
  const [workspace, setWorkspace] = useState<WorkspaceRecord | null>(null);
  const [loadingWorkspace, setLoadingWorkspace] = useState(true);
  const [sourceCategory, setSourceCategory] = useState<BenefitDocumentKind>("benefits_guide");
  const [target, setTarget] = useState<BenefitsSourceTarget>("optionA");
  const [payPeriodsPerYear, setPayPeriodsPerYear] = useState(26);
  const [sourceText, setSourceText] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    setLoadingWorkspace(true);
    setError("");

    if (auth.isDevelopmentDemo) {
      setWorkspace(readDemoRecord(workspaceId));
      setLoadingWorkspace(false);
      return undefined;
    }

    if (!auth.accessToken || !workspaceId) {
      setLoadingWorkspace(false);
      return undefined;
    }

    void getWorkspace(auth.accessToken, workspaceId)
      .then((record) => {
        if (active) setWorkspace(record);
      })
      .catch((nextError) => {
        if (active) setError(readableError(nextError));
      })
      .finally(() => {
        if (active) setLoadingWorkspace(false);
      });

    return () => { active = false; };
  }, [auth.accessToken, auth.isDevelopmentDemo, workspaceId]);

  const selectedFacts = useMemo(
    () => candidates.filter((candidate) => candidate.selected).map(({ selected: _selected, ...fact }) => extractedBenefitFactSchema.parse(fact)),
    [candidates],
  );

  const blockedMessage = (findingCodes: string[]) => {
    const labels = findingCodes.map((code) => findingLabels[code] || code).join(", ");
    return `The source was blocked locally because it appears to contain: ${labels}. Nothing was transmitted or saved.`;
  };

  const chooseLocalTextFile = async (event: ChangeEvent<HTMLInputElement>) => {
    setError("");
    setMessage("");
    setCandidates([]);
    const file = event.target.files?.[0] || null;
    event.target.value = "";
    if (!file) return;

    if (file.type !== "text/plain" && !file.name.toLowerCase().endsWith(".txt")) {
      setError("Use a plain-text (.txt) source only. For a PDF, copy only the relevant general plan text into the box below.");
      return;
    }
    if (file.size <= 0 || file.size > LOCAL_BENEFITS_SOURCE_MAX_BYTES) {
      setError("The local text source must be larger than zero bytes and no more than 1 MB.");
      return;
    }

    const filenameScan = scanSensitiveData({ fileName: file.name });
    if (filenameScan.blocked) {
      setError(blockedMessage(filenameScan.findingCodes));
      return;
    }

    const text = await file.text();
    const contentScan = scanSensitiveData({ text });
    if (contentScan.blocked) {
      setError(blockedMessage(contentScan.findingCodes));
      return;
    }

    setSourceText(text.slice(0, 200_000));
    setMessage("The text file was read only in this browser. Review the text, then analyze it locally. The file has not been uploaded.");
  };

  const analyzeLocally = () => {
    setError("");
    setMessage("");
    setCandidates([]);
    const text = sourceText.trim();
    if (!text) {
      setError("Paste general plan text or select a plain-text source first.");
      return;
    }

    const scan = scanSensitiveData({ text });
    if (scan.blocked) {
      setSourceText("");
      setError(blockedMessage(scan.findingCodes));
      return;
    }

    const result = extractSyntheticBenefitsFacts(text);
    setSourceText("");
    if (result.blocked) {
      setError(blockedMessage(result.findingCodes));
      return;
    }
    if (!result.facts.length) {
      setMessage("No supported values were found. The raw text was discarded. Enter the values manually in the workspace and add unresolved questions to the verification list.");
      return;
    }

    setCandidates(result.facts.map((fact) => ({ ...fact, selected: true })));
    setMessage("Potential values were found locally and the raw source text was discarded. Review every value before saving; none are treated as official until you confirm them.");
  };

  const updateCandidate = (index: number, patch: Partial<Candidate>) => {
    setCandidates((current) => current.map((candidate, candidateIndex) =>
      candidateIndex === index ? extractedBenefitFactSchema.extend({ selected: extractedBenefitFactSchema.shape.confidence.transform(() => true).optional() }) && { ...candidate, ...patch } : candidate,
    ));
  };

  const saveConfirmedValues = async () => {
    if (!workspace || !selectedFacts.length) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result = applyConfirmedLocalBenefitsFacts({
        state: workspace.state,
        facts: selectedFacts,
        target,
        payPeriodsPerYear,
        sourceCategory,
      });
      if (!result.appliedFactKeys.length) {
        setError("No values could be saved. A per-pay-period premium requires a confirmed pay-period count, and every candidate must remain selected to be applied.");
        return;
      }

      let saved: WorkspaceRecord;
      if (auth.isDevelopmentDemo) {
        saved = workspaceRecordSchema.parse({
          ...workspace,
          state: result.state,
          updatedAt: new Date().toISOString(),
        });
        writeDemoRecord(saved);
      } else {
        if (!auth.accessToken) throw new Error("A secure account session is required.");
        saved = await saveWorkspace(auth.accessToken, workspace.id, result.state);
      }

      setWorkspace(saved);
      setCandidates([]);
      const skipped = result.skippedFactKeys.length
        ? ` ${result.skippedFactKeys.length} value was left unsaved because its cadence was incomplete.`
        : "";
      setMessage(`${result.appliedFactKeys.length} confirmed structured value${result.appliedFactKeys.length === 1 ? " was" : "s were"} saved to ${target === "optionA" ? "Option A" : "Option B"}.${skipped} No source text or file was retained.`);
    } catch (nextError) {
      setError(readableError(nextError));
    } finally {
      setBusy(false);
    }
  };

  if (loadingWorkspace) {
    return (
      <main id="main-content" className="container min-h-[70vh] py-12">
        <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-3xl border border-border bg-card p-8" role="status">
          <LoaderCircle className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" /> Loading the protected workspace…
        </div>
      </main>
    );
  }

  if (!workspace) {
    return (
      <main id="main-content" className="container min-h-[70vh] py-12">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8">
          <AlertTriangle className="h-7 w-7 text-amber-700" aria-hidden="true" />
          <h1 className="mt-4 font-display text-3xl font-bold">Workspace unavailable</h1>
          <p className="mt-3 text-muted-foreground">Open or create an authorized Benefits Decision System workspace before using the local source assistant.</p>
          <Button asChild variant="outline" className="mt-6"><Link to="/app/benefits-decision"><ArrowLeft className="h-4 w-4" /> Workspaces</Link></Button>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="container min-h-screen py-8 md:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-5 border-b border-border pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Premium privacy-minimized workspace</div>
            <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">Browser-local benefits source assistant</h1>
            <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
              Copy only general benefits terms or select a plain-text plan excerpt. Analysis happens in this browser. CAF saves only the values you review and confirm—not the source text, file, filename, or excerpts.
            </p>
          </div>
          <Button asChild variant="outline"><Link to={`/app/benefits-decision/${workspace.id}`}><ArrowLeft className="h-4 w-4" /> Workspace</Link></Button>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5">
            <FileLock2 className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-lg font-bold">Nothing is uploaded</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">The file selector reads only `.txt` content inside the browser. PDFs must remain on your device; paste only the relevant general plan language.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <Trash2 className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-lg font-bold">Raw text is discarded</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">After analysis, the source-text field is cleared. Raw text and excerpts are not placed in local storage, analytics, the database, or the decision brief.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-lg font-bold">You confirm every value</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Potential values are suggestions, not official interpretations. Written plan documents and the plan administrator remain controlling.</p>
          </div>
        </div>

        <div className="mt-7 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm leading-relaxed text-amber-950" role="note">
          <strong>Do not paste personal information.</strong> Exclude names, contact details, dates of birth, employee/member/policy IDs, claims, EOBs, diagnoses, medication histories, pay statements, completed elections, beneficiary records, credentials, and financial-account information.
        </div>

        <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-card md:p-8" aria-labelledby="local-source-title">
          <div className="flex items-center gap-3">
            <FileSearch2 className="h-6 w-6 text-primary" aria-hidden="true" />
            <div>
              <h2 id="local-source-title" className="font-display text-2xl font-bold">Review a general plan source locally</h2>
              <p className="text-sm text-muted-foreground">Workspace: <strong className="text-foreground">{workspace.title}</strong></p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div>
              <label htmlFor="source-category" className="text-sm font-semibold">Source category</label>
              <select id="source-category" className={inputClass} value={sourceCategory} onChange={(event) => setSourceCategory(benefitDocumentKindSchema.parse(event.target.value))}>
                {Object.entries(benefitDocumentKindLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="target-option" className="text-sm font-semibold">Apply confirmed values to</label>
              <select id="target-option" className={inputClass} value={target} onChange={(event) => setTarget(event.target.value as BenefitsSourceTarget)}>
                <option value="optionA">Option A</option>
                <option value="optionB">Option B</option>
              </select>
            </div>
            <div>
              <label htmlFor="pay-periods" className="text-sm font-semibold">Pay periods per year</label>
              <select id="pay-periods" className={inputClass} value={payPeriodsPerYear} onChange={(event) => setPayPeriodsPerYear(Number(event.target.value))}>
                <option value={12}>12 — monthly</option>
                <option value={24}>24 — semimonthly</option>
                <option value={26}>26 — biweekly</option>
                <option value={52}>52 — weekly</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="local-text-file" className="text-sm font-semibold">Optional local `.txt` source, maximum 1 MB</label>
            <input id="local-text-file" className={inputClass} type="file" accept=".txt,text/plain" onChange={(event) => void chooseLocalTextFile(event)} />
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Selecting a file does not send it to CAF. The browser reads it locally and places its text in the review box below.</p>
          </div>

          <div className="mt-6">
            <label htmlFor="source-text" className="text-sm font-semibold">General plan text</label>
            <textarea
              id="source-text"
              className={textAreaClass}
              value={sourceText}
              maxLength={200_000}
              onChange={(event) => {
                setSourceText(event.target.value);
                setCandidates([]);
                setError("");
              }}
              placeholder={'Example:\nEmployee medical premium: $120 per pay period\nAnnual deductible: $2,000\nOut-of-pocket maximum: $6,000\nEmployer HSA contribution: $750 annually\nRetirement match: 6%\nVesting: 3 years'}
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>{sourceText.length.toLocaleString()} characters held temporarily in this browser tab</span>
              {sourceText && <button type="button" className="font-semibold text-primary hover:underline" onClick={() => { setSourceText(""); setCandidates([]); setMessage("The local source text was cleared."); }}>Clear source text</button>}
            </div>
          </div>

          {(message || error) && (
            <div className={`mt-5 rounded-2xl border p-4 text-sm leading-relaxed ${error ? "border-red-300 bg-red-50 text-red-950" : "border-primary/20 bg-primary-soft/25 text-foreground"}`} role={error ? "alert" : "status"}>
              {error || message}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" onClick={analyzeLocally} disabled={!sourceText.trim()}><FileInput className="h-4 w-4" /> Analyze locally</Button>
            <Button asChild variant="outline"><Link to={`/app/benefits-decision/${workspace.id}`}>Enter values manually instead</Link></Button>
          </div>
        </section>

        {candidates.length > 0 && (
          <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-card md:p-8" aria-labelledby="candidate-values-title">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-6 w-6 text-primary" aria-hidden="true" />
              <div>
                <h2 id="candidate-values-title" className="font-display text-2xl font-bold">Confirm structured values</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Uncheck anything that is wrong or unclear. Edit the number and cadence when necessary. Saving records only these confirmed fields.</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {candidates.map((candidate, index) => (
                <div key={`${candidate.key}-${index}`} className="grid gap-4 rounded-2xl border border-border bg-background p-5 md:grid-cols-[auto_1fr_180px_180px] md:items-end">
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input type="checkbox" className="h-4 w-4" checked={candidate.selected} onChange={(event) => updateCandidate(index, { selected: event.target.checked })} />
                    Use
                  </label>
                  <div>
                    <div className="font-semibold">{candidate.label}</div>
                    <div className="mt-1 text-xs text-muted-foreground">Detected value: {formatValue(candidate)} · confidence: {candidate.confidence}</div>
                  </div>
                  <div>
                    <label htmlFor={`candidate-value-${index}`} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Confirmed value</label>
                    <input id={`candidate-value-${index}`} className={inputClass} type="number" min="0" step="0.01" value={candidate.value} onChange={(event) => updateCandidate(index, { value: Math.max(0, Number(event.target.value) || 0) })} />
                  </div>
                  <div>
                    <label htmlFor={`candidate-cadence-${index}`} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cadence</label>
                    <select id={`candidate-cadence-${index}`} className={inputClass} value={candidate.cadence || "not_applicable"} onChange={(event) => updateCandidate(index, { cadence: event.target.value as ExtractedBenefitFact["cadence"] })}>
                      <option value="annual">Annual</option>
                      <option value="monthly">Monthly</option>
                      <option value="per_pay_period">Per pay period</option>
                      <option value="not_applicable">Not applicable</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <Button type="button" className="mt-6" onClick={() => void saveConfirmedValues()} disabled={busy || selectedFacts.length === 0}>
              {busy ? <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
              Save confirmed values to {target === "optionA" ? "Option A" : "Option B"}
            </Button>
          </section>
        )}

        <div className="mt-8 rounded-2xl border border-primary/20 bg-primary-soft/20 p-5 text-sm leading-relaxed text-muted-foreground">
          <ShieldCheck className="mr-2 inline h-4 w-4 text-primary" aria-hidden="true" />
          This assistant does not determine eligibility, coverage, network status, formulary status, claim liability, or the legal meaning of plan language. Confirm material values against the current official plan documents or benefits administrator before submitting elections.
        </div>
      </div>
    </main>
  );
}
