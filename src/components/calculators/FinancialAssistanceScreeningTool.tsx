import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  Download,
  ExternalLink,
  FileText,
  HelpCircle,
  Printer,
  RefreshCcw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { SaveNavigatorAction } from "@/components/navigator/SaveNavigatorAction";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { Button } from "@/components/ui/button";
import {
  hospitalFinancialAssistancePolicies,
  hospitalPolicyBySlug,
  type HospitalFinancialAssistancePolicy,
} from "@/data/hospitalFinancialAssistancePolicies";
import { trackSiteEvent } from "@/lib/analytics";
import { trackJourneyEvent } from "@/lib/journeyAnalytics";
import {
  buildHospitalAssistanceResult,
  DEFAULT_HOSPITAL_ASSISTANCE_ANSWERS,
  HHS_2026_POVERTY_GUIDELINES,
  INCOME_BANDS,
  incomeBandOptionLabel,
  type HospitalAssistanceAnswers,
  type HospitalAssistanceScreeningResult,
  type HospitalBillStage,
  type HospitalAssistanceInsuranceStatus,
} from "@/lib/hospitalFinancialAssistance";
import { cn } from "@/lib/utils";

const TOOL_ID = "hospital-financial-assistance-finder";
const SOURCE_ROUTE = "/tools/financial-assistance-checklist";
const RETURN_MARKER = "caf_hospital_assistance_finder_seen_v1";
const JOURNEY = {
  journey_key: "hospital_financial_assistance",
  surface: "medical_bill",
  variant: "flagship_funnel_v1",
} as const;

const US_STATES = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"], ["CA", "California"],
  ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"], ["DC", "District of Columbia"], ["FL", "Florida"],
  ["GA", "Georgia"], ["HI", "Hawaii"], ["ID", "Idaho"], ["IL", "Illinois"], ["IN", "Indiana"], ["IA", "Iowa"],
  ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"], ["MD", "Maryland"],
  ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"], ["MS", "Mississippi"], ["MO", "Missouri"],
  ["MT", "Montana"], ["NE", "Nebraska"], ["NV", "Nevada"], ["NH", "New Hampshire"], ["NJ", "New Jersey"],
  ["NM", "New Mexico"], ["NY", "New York"], ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"],
  ["OK", "Oklahoma"], ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"], ["SC", "South Carolina"],
  ["SD", "South Dakota"], ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"], ["VT", "Vermont"],
  ["VA", "Virginia"], ["WA", "Washington"], ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"],
] as const;

const STEPS = [
  { id: "state", title: "State", why: "Poverty guidelines differ in Alaska and Hawaii, and hospital policies can depend on residency." },
  { id: "hospital", title: "Hospital", why: "The exact hospital or health-system policy controls the screening range, covered facilities, and application." },
  { id: "household", title: "Household size", why: "Official HHS poverty guidelines increase with household size. The hospital's own household definition still controls." },
  { id: "income", title: "Income range", why: "A broad range is enough for this screening. Do not enter tax IDs, account numbers, or uploaded documents." },
  { id: "insurance", title: "Insurance", why: "Some policies cover insured balances, some limit them, and some publish different insured and uninsured ranges." },
  { id: "stage", title: "Bill stage", why: "The next action changes when care is expected, a bill is current, the balance is overdue, or collection activity has started." },
  { id: "service_date", title: "Service date", why: "A rough month helps the user verify the correct policy version and possible application or collection deadlines." },
  { id: "review", title: "Review", why: "Check the non-identifying facts before the finder builds a source-backed action plan." },
] as const;

type StepId = typeof STEPS[number]["id"];

const statusClasses: Record<HospitalAssistanceScreeningResult["status"], string> = {
  free_range: "border-emerald-300 bg-emerald-50/80 dark:border-emerald-800 dark:bg-emerald-950/20",
  discounted_range: "border-primary/30 bg-primary-soft/35",
  hardship_review: "border-amber-300 bg-amber-50/80 dark:border-amber-800 dark:bg-amber-950/20",
  verify_policy: "border-sky-300 bg-sky-50/80 dark:border-sky-800 dark:bg-sky-950/20",
  insufficient_information: "border-border bg-muted/35",
};

const RadioCard = ({
  checked,
  label,
  description,
  onClick,
}: {
  checked: boolean;
  label: string;
  description?: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    role="radio"
    aria-checked={checked}
    onClick={onClick}
    className={cn(
      "flex min-h-14 w-full items-start gap-3 rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      checked ? "border-primary bg-primary-soft/45 shadow-sm" : "border-border bg-background hover:border-primary/35",
    )}
  >
    <span className={cn("mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border", checked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/50")}>{checked ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : null}</span>
    <span>
      <span className="block text-sm font-bold text-foreground">{label}</span>
      {description ? <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{description}</span> : null}
    </span>
  </button>
);

const ResultList = ({
  title,
  items,
  icon: Icon,
  tone = "default",
}: {
  title: string;
  items: string[];
  icon: typeof ClipboardCheck;
  tone?: "default" | "warning";
}) => {
  if (!items.length) return null;
  return (
    <section className={cn("rounded-2xl border p-4 shadow-sm md:p-5", tone === "warning" ? "border-amber-300 bg-amber-50/80 dark:border-amber-800 dark:bg-amber-950/20" : "border-border bg-card")}>
      <h3 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
        <Icon className={cn("h-5 w-5", tone === "warning" ? "text-amber-700 dark:text-amber-300" : "text-primary")} aria-hidden="true" /> {title}
      </h3>
      <ul className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

const policyLabel = (policy: HospitalFinancialAssistancePolicy | null) => policy?.name ?? "Hospital not in the verified launch set";

const resultAsText = (
  result: HospitalAssistanceScreeningResult,
  policy: HospitalFinancialAssistancePolicy | null,
) => [
  "COMMUNITY ACQUIRED FINANCE",
  "Hospital Financial Assistance & Medical Bill Relief Action Plan",
  `Generated: ${new Date().toLocaleDateString()}`,
  "",
  result.heading,
  result.summary,
  "",
  "POLICY FINDING",
  result.policyFinding,
  "",
  "ENTERED FACTS",
  ...result.enteredFacts.map((item) => `- ${item}`),
  "",
  "NEXT ACTIONS",
  ...result.nextActions.map((item) => `- ${item}`),
  "",
  "DOCUMENTS TO GATHER",
  ...result.documents.map((item) => `- ${item}`),
  "",
  "QUESTIONS TO ASK",
  ...result.questions.map((item) => `- ${item}`),
  "",
  "MISSING INFORMATION",
  ...(result.missingInformation.length ? result.missingInformation : ["None identified by the entered screening facts"]).map((item) => `- ${item}`),
  "",
  "INFORMATION TO VERIFY",
  ...result.verificationItems.map((item) => `- ${item}`),
  "",
  "IMPORTANT LIMITS",
  ...result.warnings.map((item) => `- ${item}`),
  "",
  `Official policy: ${policy?.policyUrl ?? "Find the official policy on the hospital website"}`,
  `Official application: ${policy?.applicationUrl ?? "Request the current application from the hospital"}`,
  `CAF policy record last reviewed: ${policy?.sourceRetrievedAt ?? "Not available"}`,
  "HHS poverty guidelines: https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines",
  "",
  "Educational screening only. The hospital must make the final eligibility determination. Verify the current policy, application, deadline, covered facility, service, and provider directly.",
].join("\n");

export const FinancialAssistanceScreeningTool = () => {
  const [answers, setAnswers] = useState<HospitalAssistanceAnswers>(DEFAULT_HOSPITAL_ASSISTANCE_ANSWERS);
  const [stepIndex, setStepIndex] = useState(0);
  const [touched, setTouched] = useState<Set<StepId>>(new Set());
  const [result, setResult] = useState<HospitalAssistanceScreeningResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const startedRef = useRef(false);
  const completedRef = useRef(false);
  const stepIdRef = useRef<StepId>(STEPS[0].id);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const currentStep = STEPS[stepIndex];

  const policiesForState = useMemo(
    () => hospitalFinancialAssistancePolicies.filter((policy) => policy.stateCode === answers.stateCode),
    [answers.stateCode],
  );
  const selectedPolicy = answers.policySlug ? hospitalPolicyBySlug.get(answers.policySlug) ?? null : null;

  useEffect(() => {
    trackSiteEvent("product_landing_view", { event_category: "decision_products", tool_id: TOOL_ID, surface_id: "tool" });
    trackJourneyEvent("journey_viewed", { ...JOURNEY, phase: "name_question", step_index: 0 });
    try {
      if (window.localStorage.getItem(RETURN_MARKER) === "true") {
        trackSiteEvent("product_return_session", { event_category: "decision_products", tool_id: TOOL_ID, return_state: "browser_marker" });
      }
      window.localStorage.setItem(RETURN_MARKER, "true");
    } catch {
      // Return-session measurement is optional and must not interrupt the tool.
    }
  }, []);

  useEffect(() => {
    stepIdRef.current = currentStep.id;
  }, [currentStep.id]);

  useEffect(() => () => {
    if (startedRef.current && !completedRef.current) {
      trackSiteEvent("tool_abandoned", {
        event_category: "decision_products",
        tool_id: TOOL_ID,
        step_id: stepIdRef.current,
      });
    }
  }, []);

  useEffect(() => {
    if (!result) return;
    resultRef.current?.focus();
    if (result.missingInformation.length) {
      trackSiteEvent("missing_information_flag_shown", {
        event_category: "decision_products",
        tool_id: TOOL_ID,
        missing_state: "shown",
      });
    }
  }, [result]);

  const markTouched = (stepId: StepId) => setTouched((current) => new Set(current).add(stepId));

  const updateAnswers = <K extends keyof HospitalAssistanceAnswers>(key: K, value: HospitalAssistanceAnswers[K]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    setResult(null);
    setCopied(false);
    setValidationMessage("");
  };

  const validateStep = () => {
    if (currentStep.id === "state" && !answers.stateCode) return "Choose a state to continue.";
    if (currentStep.id === "hospital" && !touched.has("hospital")) return "Choose a hospital, select “not listed,” or choose “I don't know.”";
    if (currentStep.id === "household" && !touched.has("household")) return "Choose a household size or “I don't know.”";
    if (currentStep.id === "income" && !touched.has("income")) return "Choose an approximate range or “I don't know.”";
    if (currentStep.id === "insurance" && !touched.has("insurance")) return "Choose an insurance status or “I don't know.”";
    if (currentStep.id === "stage" && !touched.has("stage")) return "Choose the bill stage or “I don't know.”";
    if (currentStep.id === "service_date" && !touched.has("service_date")) return "Enter an approximate month or choose “I don't know / skip.”";
    return "";
  };

  const continueStep = () => {
    const error = validateStep();
    if (error) {
      setValidationMessage(error);
      return;
    }
    if (!startedRef.current) {
      startedRef.current = true;
      trackSiteEvent("tool_started", { event_category: "decision_products", tool_id: TOOL_ID, step_id: currentStep.id });
      trackJourneyEvent("journey_started", { ...JOURNEY, phase: "name_question", step_index: 0 });
    }
    const properties: Record<string, string> = { event_category: "decision_products", tool_id: TOOL_ID, step_id: currentStep.id };
    if (currentStep.id === "hospital") properties.policy_id = answers.policySlug || "not_listed";
    trackSiteEvent("tool_step_completed", properties);
    trackJourneyEvent("journey_step_completed", {
      ...JOURNEY,
      phase: stepIndex < 2 ? "name_question" : "narrow_answer",
      step_index: stepIndex + 1,
    });
    setStepIndex((current) => Math.min(current + 1, STEPS.length - 1));
    setValidationMessage("");
  };

  const generateResult = () => {
    const nextResult = buildHospitalAssistanceResult(answers, selectedPolicy);
    setResult(nextResult);
    completedRef.current = true;
    trackSiteEvent("tool_completed", {
      event_category: "decision_products",
      tool_id: TOOL_ID,
      outcome_id: nextResult.status,
      policy_id: answers.policySlug || "not_listed",
    });
    trackJourneyEvent("journey_result_reached", { ...JOURNEY, phase: "result", step_index: STEPS.length });
  };

  const reset = () => {
    setAnswers(DEFAULT_HOSPITAL_ASSISTANCE_ANSWERS);
    setStepIndex(0);
    setTouched(new Set());
    setResult(null);
    setCopied(false);
    setValidationMessage("");
    startedRef.current = false;
    completedRef.current = false;
    trackSiteEvent("tool_result_action", { event_category: "decision_products", tool_id: TOOL_ID, action_id: "reset" });
  };

  const copyResult = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(resultAsText(result, selectedPolicy));
      setCopied(true);
      trackSiteEvent("tool_result_action", { event_category: "decision_products", tool_id: TOOL_ID, action_id: "copy_success" });
      trackJourneyEvent("journey_result_copied", { ...JOURNEY, phase: "result", step_index: STEPS.length });
    } catch {
      setCopied(false);
      trackSiteEvent("tool_result_action", { event_category: "decision_products", tool_id: TOOL_ID, action_id: "copy_blocked" });
    }
  };

  const downloadResult = () => {
    if (!result) return;
    const blob = new Blob([resultAsText(result, selectedPolicy)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `caf-hospital-financial-assistance-plan-${selectedPolicy?.slug ?? "hospital"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    trackSiteEvent("result_downloaded", { event_category: "decision_products", tool_id: TOOL_ID, outcome_id: result.status, format_id: "text" });
  };

  const printResult = () => {
    trackSiteEvent("result_printed", { event_category: "decision_products", tool_id: TOOL_ID, outcome_id: result?.status ?? "unknown" });
    trackJourneyEvent("journey_result_printed", { ...JOURNEY, phase: "result", step_index: STEPS.length });
    window.print();
  };

  const trackOfficialClick = (actionId: "policy" | "application" | "source", sourceId?: string) => {
    trackSiteEvent(actionId === "application" ? "application_clicked" : "official_source_clicked", {
      event_category: "decision_products",
      tool_id: TOOL_ID,
      policy_id: selectedPolicy?.slug ?? "not_listed",
      action_id: actionId,
      source_id: sourceId,
    });
    trackJourneyEvent("journey_handoff_opened", { ...JOURNEY, phase: "handoff", step_index: STEPS.length });
  };

  const renderStep = () => {
    if (currentStep.id === "state") {
      return (
        <div>
          <label htmlFor="assistance-state" className="block text-sm font-bold text-foreground">Where is the hospital?</label>
          <select id="assistance-state" value={answers.stateCode} onChange={(event) => {
            updateAnswers("stateCode", event.target.value);
            updateAnswers("policySlug", "");
            setTouched((current) => {
              const next = new Set(current);
              next.add("state");
              next.delete("hospital");
              return next;
            });
          }} className="mt-3 min-h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">Choose a state</option>
            {US_STATES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
          </select>
        </div>
      );
    }

    if (currentStep.id === "hospital") {
      return (
        <div>
          <label htmlFor="assistance-hospital" className="block text-sm font-bold text-foreground">Which hospital or health system issued or may issue the facility bill?</label>
          <select id="assistance-hospital" value={answers.policySlug} onChange={(event) => {
            updateAnswers("policySlug", event.target.value);
            markTouched("hospital");
          }} className="mt-3 min-h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">Choose a hospital or health system</option>
            {policiesForState.map((policy) => <option key={policy.slug} value={policy.slug}>{policy.name}</option>)}
            <option value="not-listed">Hospital not listed / I don't know</option>
          </select>
          {policiesForState.length === 0 ? <p className="mt-3 rounded-xl border border-border bg-muted/35 p-3 text-sm text-muted-foreground">This launch set does not yet contain a verified hospital record for this state. The finder will still produce a national verification plan without estimating eligibility.</p> : null}
        </div>
      );
    }

    if (currentStep.id === "household") {
      return (
        <div role="radiogroup" aria-label="Household size" className="grid gap-3 sm:grid-cols-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
            <RadioCard key={size} checked={answers.householdSize === size} label={`${size} ${size === 1 ? "person" : "people"}`} onClick={() => {
              updateAnswers("householdSize", size);
              markTouched("household");
            }} />
          ))}
          <RadioCard checked={answers.householdSize === 9} label="9 or more people" description="The guideline adds a fixed amount for each person above eight. This screening uses nine; verify the exact size directly." onClick={() => {
            updateAnswers("householdSize", 9);
            markTouched("household");
          }} />
          <RadioCard checked={touched.has("household") && answers.householdSize === null} label="I don't know" onClick={() => {
            updateAnswers("householdSize", null);
            markTouched("household");
          }} />
        </div>
      );
    }

    if (currentStep.id === "income") {
      return (
        <div role="radiogroup" aria-label="Approximate annual household income range" className="grid gap-3">
          {INCOME_BANDS.map((band) => (
            <RadioCard key={band.id} checked={answers.incomeBand === band.id && touched.has("income")} label={incomeBandOptionLabel(band, answers.householdSize, answers.stateCode)} description={band.id === "unknown" ? "The result will identify the missing information without guessing." : undefined} onClick={() => {
              updateAnswers("incomeBand", band.id);
              markTouched("income");
            }} />
          ))}
        </div>
      );
    }

    if (currentStep.id === "insurance") {
      const options: Array<[HospitalAssistanceInsuranceStatus, string, string]> = [
        ["insured", "Insured", "A health plan, Medicare, Medicaid, or another payer is involved."],
        ["uninsured", "Uninsured or self-pay", "No insurer is expected to process this hospital bill."],
        ["unknown", "I don't know", "The result will flag insurance treatment for verification."],
      ];
      return <div role="radiogroup" aria-label="Insurance status" className="grid gap-3">{options.map(([id, label, description]) => <RadioCard key={id} checked={answers.insuranceStatus === id && touched.has("insurance")} label={label} description={description} onClick={() => {
        updateAnswers("insuranceStatus", id);
        markTouched("insurance");
      }} />)}</div>;
    }

    if (currentStep.id === "stage") {
      const options: Array<[HospitalBillStage, string, string]> = [
        ["expected", "Expected", "Care is planned or a hospital bill is expected."],
        ["received", "Recently received", "A current hospital bill or statement has arrived."],
        ["overdue", "Overdue", "The hospital says the balance is past due."],
        ["collections", "In collections", "A collector is involved or collection activity has started."],
        ["unknown", "I don't know", "The result will include an account-status verification step."],
      ];
      return <div role="radiogroup" aria-label="Bill stage" className="grid gap-3">{options.map(([id, label, description]) => <RadioCard key={id} checked={answers.billStage === id && touched.has("stage")} label={label} description={description} onClick={() => {
        updateAnswers("billStage", id);
        markTouched("stage");
      }} />)}</div>;
    }

    if (currentStep.id === "service_date") {
      return (
        <div className="space-y-4">
          <div>
            <label htmlFor="service-month" className="block text-sm font-bold text-foreground">Approximate month of service</label>
            <input id="service-month" type="month" value={answers.serviceMonth} max={new Date().toISOString().slice(0, 7)} onChange={(event) => {
              updateAnswers("serviceMonth", event.target.value);
              markTouched("service_date");
            }} className="mt-3 min-h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <RadioCard checked={touched.has("service_date") && !answers.serviceMonth} label="I don't know / skip" description="The result will tell you to verify the date of service and first post-discharge bill." onClick={() => {
            updateAnswers("serviceMonth", "");
            markTouched("service_date");
          }} />
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["State", answers.stateCode || "Not known"],
            ["Hospital", policyLabel(selectedPolicy)],
            ["Household size", answers.householdSize ? String(answers.householdSize) : "Not known"],
            ["Income range", INCOME_BANDS.find((band) => band.id === answers.incomeBand)?.label ?? "Not known"],
            ["Insurance", answers.insuranceStatus === "unknown" ? "Not known" : answers.insuranceStatus],
            ["Bill stage", answers.billStage === "unknown" ? "Not known" : answers.billStage],
            ["Service month", answers.serviceMonth || "Not known"],
          ].map(([label, value]) => <div key={label} className="rounded-2xl border border-border bg-background p-4"><div className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</div><div className="mt-1 font-semibold text-foreground">{value}</div></div>)}
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
          <strong>Before continuing:</strong> this finder screens a published range. It does not decide eligibility, whether the balance is correct, or whether a provider is covered by the policy.
        </div>
      </div>
    );
  };

  if (result) {
    return (
      <div className="space-y-6" aria-live="polite">
        <section className={cn("rounded-3xl border p-5 shadow-card md:p-7", statusClasses[result.status])}>
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Published-policy screening result</p>
              <h2 ref={resultRef} tabIndex={-1} className="mt-2 font-display text-2xl font-bold leading-tight text-foreground outline-none md:text-3xl">{result.heading}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{result.summary}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Policy finding</p>
              <h3 className="mt-2 font-display text-xl font-bold">{policyLabel(selectedPolicy)}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{result.policyFinding}</p>
            </div>
            <div className="shrink-0 rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Last reviewed</strong><br />{selectedPolicy?.sourceRetrievedAt ?? "No policy record"}
            </div>
          </div>
          {result.povertyGuidelineAmount ? <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-4"><div className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">2026 HHS guideline used</div><div className="mt-1 text-xl font-bold text-foreground">${result.povertyGuidelineAmount.toLocaleString()}</div><p className="mt-1 text-xs text-muted-foreground">100% FPG for the entered household size and state.</p></div>
            <div className="rounded-xl border border-border bg-background p-4"><div className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Approximate income range</div><div className="mt-1 text-xl font-bold text-foreground">{result.estimatedIncomeRange ? `${result.estimatedIncomeRange.lower !== null ? `$${result.estimatedIncomeRange.lower.toLocaleString()}` : "Unknown"}${result.estimatedIncomeRange.upper !== null ? ` – $${result.estimatedIncomeRange.upper.toLocaleString()}` : "+"}` : "Not available"}</div><p className="mt-1 text-xs text-muted-foreground">A broad screening range, not the hospital's calculation.</p></div>
          </div> : null}
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <ResultList title="User-entered facts" items={result.enteredFacts} icon={CheckCircle2} />
          <ResultList title="Recommended next actions" items={result.nextActions} icon={ClipboardCheck} />
          <ResultList title="Documentation checklist" items={result.documents} icon={FileText} />
          <ResultList title="Questions to ask hospital billing" items={result.questions} icon={HelpCircle} />
          <ResultList title="Missing information" items={result.missingInformation} icon={Search} tone="warning" />
          <ResultList title="Information to verify" items={result.verificationItems} icon={ShieldCheck} />
          <ResultList title="Important limits and warnings" items={result.warnings} icon={AlertTriangle} tone="warning" />
        </div>

        <section className="rounded-2xl border border-primary/20 bg-primary-soft/25 p-5 md:p-6">
          <h3 className="font-display text-xl font-bold">Official policy, application, and sources</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Open the controlling hospital documents, then verify the facility, service, provider, deadline, and required documents directly.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {selectedPolicy ? <>
              <a href={selectedPolicy.policyUrl} target="_blank" rel="noreferrer" onClick={() => trackOfficialClick("policy")} className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold text-primary hover:border-primary/40">Official policy <ExternalLink className="h-4 w-4" aria-hidden="true" /></a>
              <a href={selectedPolicy.applicationUrl} target="_blank" rel="noreferrer" onClick={() => trackOfficialClick("application")} className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold text-primary hover:border-primary/40">Official application <ExternalLink className="h-4 w-4" aria-hidden="true" /></a>
              {selectedPolicy.sources.map((item, index) => <a key={`${item.url}-${index}`} href={item.url} target="_blank" rel="noreferrer" onClick={() => trackOfficialClick("source", `${selectedPolicy.slug}_${index + 1}`)} className="rounded-xl border border-border bg-background px-4 py-3 text-sm hover:border-primary/40"><span className="flex items-center justify-between gap-3 font-bold text-foreground">{item.label}<ExternalLink className="h-4 w-4 text-primary" aria-hidden="true" /></span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{item.publisher} · Retrieved {item.retrievedAt}<br />{item.supports}</span></a>)}
              {selectedPolicy.stateCode === "NC" ? <a href="https://www.ncdhhs.gov/medicaldebt" target="_blank" rel="noreferrer" onClick={() => trackOfficialClick("source", "ncdhhs_medical_debt")} className="rounded-xl border border-border bg-background px-4 py-3 text-sm hover:border-primary/40"><span className="flex items-center justify-between gap-3 font-bold text-foreground">North Carolina Medical Debt Program<ExternalLink className="h-4 w-4 text-primary" aria-hidden="true" /></span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">NCDHHS · Statewide assistance and collection standards · Retrieved 2026-08-06</span></a> : null}
            </> : null}
            <a href={HHS_2026_POVERTY_GUIDELINES.sourceUrl} target="_blank" rel="noreferrer" onClick={() => trackOfficialClick("source", "hhs_2026_fpg")} className="rounded-xl border border-border bg-background px-4 py-3 text-sm hover:border-primary/40"><span className="flex items-center justify-between gap-3 font-bold text-foreground">2026 HHS poverty guidelines<ExternalLink className="h-4 w-4 text-primary" aria-hidden="true" /></span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">HHS/ASPE · Effective 2026 · Retrieved {HHS_2026_POVERTY_GUIDELINES.retrievedAt}</span></a>
            <a href="https://www.irs.gov/charities-non-profits/billing-and-collections-section-501r6" target="_blank" rel="noreferrer" onClick={() => trackOfficialClick("source", "irs_501r6")} className="rounded-xl border border-border bg-background px-4 py-3 text-sm hover:border-primary/40"><span className="flex items-center justify-between gap-3 font-bold text-foreground">IRS billing and collection rules<ExternalLink className="h-4 w-4 text-primary" aria-hidden="true" /></span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">IRS Section 501(r)(6) · Retrieved 2026-08-06</span></a>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6 print:hidden">
          <h3 className="font-display text-xl font-bold">Supporting medical-bill actions</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ["Request and review an itemized bill", "/tools/medical-bill-review-flow"],
              ["Compare the EOB with the provider bill", "/tools/eob-to-bill-match-checker"],
              ["Understand separate facility and professional bills", "/articles/facility-fee-vs-professional-fee"],
              ["Understand multiple bills from one visit", "/articles/why-one-hospital-visit-can-create-multiple-bills"],
            ].map(([label, href]) => <Link key={href} to={href} onClick={() => trackSiteEvent("supporting_resource_clicked", { event_category: "decision_products", tool_id: TOOL_ID, destination_path: href })} className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold text-primary hover:border-primary/40">{label}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>)}
          </div>
        </section>

        <SaveNavigatorAction recommendationId="cost_financial_assistance" sourceRoute={SOURCE_ROUTE} title="Save financial-assistance review as a next step" description="Only the fixed action is saved. Hospital, state, income range, household size, insurance, bill stage, and service month are not added to My Plan." />

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap print:hidden">
          <Button type="button" onClick={copyResult}><Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy action plan"}</Button>
          <Button type="button" variant="outline" onClick={downloadResult}><Download className="h-4 w-4" /> Download plan</Button>
          <Button type="button" variant="outline" onClick={printResult}><Printer className="h-4 w-4" /> Print or save as PDF</Button>
          <Button type="button" variant="ghost" onClick={reset}><RefreshCcw className="h-4 w-4" /> Start over</Button>
        </div>
        <DisclaimerBox />
      </div>
    );
  }

  const progress = Math.round(((stepIndex + 1) / STEPS.length) * 100);
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary/15 bg-primary-soft/25 p-4 text-sm leading-relaxed text-muted-foreground md:p-5">
        <strong className="text-foreground">Private by design.</strong> Do not enter a patient name, date of birth, diagnosis, record number, account number, Social Security number, exact bill balance, or upload a bill. Answers stay in temporary browser state and are not added to My Plan or sent to analytics.
      </div>

      <div aria-label={`Step ${stepIndex + 1} of ${STEPS.length}: ${currentStep.title}`}>
        <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
          <span>Step {stepIndex + 1} of {STEPS.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Financial assistance screening progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
          <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-card md:p-7" aria-labelledby={`step-${currentStep.id}`}>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">{currentStep.title}</p>
        <h2 id={`step-${currentStep.id}`} className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">{currentStep.id === "review" ? "Review the facts before building the plan" : currentStep.id === "income" ? "Which broad annual household-income range is closest?" : currentStep.id === "household" ? "How many people are in the household?" : currentStep.id === "insurance" ? "Is the patient insured or uninsured?" : currentStep.id === "stage" ? "What stage is the bill in?" : currentStep.id === "service_date" ? "About when did the care happen?" : currentStep.id === "hospital" ? "Choose the hospital or health system" : "Choose the hospital's state"}</h2>
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-muted/35 p-3 text-xs leading-relaxed text-muted-foreground"><HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><span><strong className="text-foreground">Why this matters:</strong> {currentStep.why}</span></div>
        <div className="mt-6">{renderStep()}</div>
        {validationMessage ? <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm font-semibold text-destructive" role="alert">{validationMessage}</p> : null}
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between print:hidden">
        <Button type="button" variant="outline" disabled={stepIndex === 0} onClick={() => {
          setStepIndex((current) => Math.max(0, current - 1));
          setValidationMessage("");
        }}><ArrowLeft className="h-4 w-4" /> Back</Button>
        {currentStep.id === "review" ? <Button type="button" size="lg" onClick={generateResult}>Build my action plan <ArrowRight className="h-4 w-4" /></Button> : <Button type="button" size="lg" onClick={continueStep}>Continue <ArrowRight className="h-4 w-4" /></Button>}
      </div>
      <DisclaimerBox />
    </div>
  );
};

export default FinancialAssistanceScreeningTool;
