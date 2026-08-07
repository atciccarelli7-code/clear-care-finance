import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  FileCheck2,
  ListChecks,
  Printer,
  RotateCcw,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { OpenEnrollmentSourceAssistant } from "@/components/premium/OpenEnrollmentSourceAssistant";
import { trackSiteEvent } from "@/lib/analytics";
import { buildDecisionTrace } from "@/premium/decisionTrace";
import {
  OPEN_ENROLLMENT_PILOT_VERSION,
  ancillaryKeys,
  ancillaryLabels,
  buildElectionPlan,
  createOpenEnrollmentPilotState,
  documentKeys,
  documentLabels,
  estimateHealthPlan,
  getMedicalRecommendation,
  getOpenEnrollmentProgress,
  getRetirementSummary,
  isOpenEnrollmentStepComplete,
  openEnrollmentStepIds,
  type AncillaryKey,
  type DocumentKey,
  type ElectionChoice,
  type HealthPlanInput,
  type OpenEnrollmentPilotState,
  type OpenEnrollmentStepId,
} from "@/premium/openEnrollmentPilot";

const STORAGE_KEY = `caf-open-enrollment-pilot-v${OPEN_ENROLLMENT_PILOT_VERSION}`;
const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
const cardClass = "rounded-2xl border border-border bg-background p-5";

const steps: Array<{ id: OpenEnrollmentStepId; title: string; description: string }> = [
  { id: "event", title: "Enrollment event", description: "Set the decision and deadline." },
  { id: "household", title: "Household", description: "Identify who needs coverage and what matters." },
  { id: "documents", title: "Documents", description: "Confirm what is ready and what is missing." },
  { id: "medical", title: "Medical plan", description: "Compare cost exposure and verification needs." },
  { id: "accounts", title: "Accounts", description: "Review HSA, HRA, FSA, and dependent-care choices." },
  { id: "protection", title: "Other benefits", description: "Review dental, vision, disability, life, and supplements." },
  { id: "retirement", title: "Retirement", description: "Set a contribution and inspect employer value." },
  { id: "review", title: "Election plan", description: "Review, print, and prepare to submit." },
];

const money = (value: number | null) => value === null
  ? "Not available"
  : value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const safeState = (raw: Partial<OpenEnrollmentPilotState>): OpenEnrollmentPilotState => {
  const initial = createOpenEnrollmentPilotState();
  if (raw.version !== OPEN_ENROLLMENT_PILOT_VERSION) return initial;
  return {
    ...initial,
    ...raw,
    documents: { ...initial.documents, ...(raw.documents ?? {}) },
    plans: {
      a: { ...initial.plans.a, ...(raw.plans?.a ?? {}) },
      b: { ...initial.plans.b, ...(raw.plans?.b ?? {}) },
    },
    sourceAssistance: {
      a: raw.sourceAssistance?.a ?? null,
      b: raw.sourceAssistance?.b ?? null,
    },
    ancillary: { ...initial.ancillary, ...(raw.ancillary ?? {}) },
  };
};

const readState = () => {
  if (typeof window === "undefined") return createOpenEnrollmentPilotState();
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<OpenEnrollmentPilotState> | null;
    return parsed ? safeState(parsed) : createOpenEnrollmentPilotState();
  } catch {
    return createOpenEnrollmentPilotState();
  }
};

const Label = ({ htmlFor, help, children }: { htmlFor: string; help?: string; children: ReactNode }) => (
  <label htmlFor={htmlFor} className="block text-sm font-semibold">
    {children}
    {help && <span className="mt-1 block text-xs font-normal leading-relaxed text-muted-foreground">{help}</span>}
  </label>
);

const Select = ({ id, value, onChange, children }: { id: string; value: string; onChange: (value: string) => void; children: ReactNode }) => (
  <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>{children}</select>
);

const NumberInput = ({ id, value, onChange, max, step = 1 }: { id: string; value: number | null; onChange: (value: number | null) => void; max?: number; step?: number }) => (
  <input
    id={id}
    type="number"
    inputMode="decimal"
    value={value ?? ""}
    min={0}
    max={max}
    step={step}
    onChange={(event) => onChange(event.target.value === "" ? null : Number(event.target.value))}
    className={inputClass}
  />
);

const Choice = ({ checked, onChange, title, body }: { checked: boolean; onChange: () => void; title: string; body?: string }) => (
  <button
    type="button"
    aria-pressed={checked}
    onClick={onChange}
    className={`min-h-14 rounded-xl border p-4 text-left transition ${checked ? "border-primary bg-primary-soft/40 ring-2 ring-primary/15" : "border-border bg-background hover:border-primary/35"}`}
  >
    <span className="block text-sm font-bold">{title}</span>
    {body && <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{body}</span>}
  </button>
);

const PlanCard = ({ id, plan, onChange }: { id: "a" | "b"; plan: HealthPlanInput; onChange: (patch: Partial<HealthPlanInput>) => void }) => {
  const estimate = estimateHealthPlan(plan);
  const prefix = `pilot-plan-${id}`;
  return (
    <article className={cardClass}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Medical option {id.toUpperCase()}</div>
          <h4 className="mt-1 font-display text-xl font-bold">{plan.label || `Plan ${id.toUpperCase()}`}</h4>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${estimate ? "bg-primary-soft text-primary" : "bg-amber-50 text-amber-800"}`}>
          {estimate ? "Cost fields complete" : "Needs values"}
        </span>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor={`${prefix}-label`} help="Use a generic plan label. Do not enter member or account identifiers.">Plan label</Label>
          <input id={`${prefix}-label`} value={plan.label} maxLength={80} onChange={(event) => onChange({ label: event.target.value })} className={inputClass} />
        </div>
        {[
          ["premium", "Annual employee premium", "annualPremium"],
          ["deductible", "Deductible", "deductible"],
          ["oop", "Out-of-pocket maximum", "outOfPocketMaximum"],
          ["employer", "Employer HSA or HRA contribution", "employerAccountContribution"],
          ["allowed", "Expected covered allowed costs", "expectedAllowedCosts"],
        ].map(([suffix, label, key]) => (
          <div key={suffix}>
            <Label htmlFor={`${prefix}-${suffix}`}>{label}</Label>
            <NumberInput id={`${prefix}-${suffix}`} value={plan[key as keyof HealthPlanInput] as number | null} onChange={(value) => onChange({ [key]: value })} />
          </div>
        ))}
        <div>
          <Label htmlFor={`${prefix}-coinsurance`} help="Enter 20 for 20%.">Coinsurance percentage</Label>
          <NumberInput id={`${prefix}-coinsurance`} value={plan.coinsurancePercent} onChange={(value) => onChange({ coinsurancePercent: value })} max={100} step={0.01} />
        </div>
        <div>
          <Label htmlFor={`${prefix}-network`}>Required clinicians and facilities</Label>
          <Select id={`${prefix}-network`} value={plan.networkStatus} onChange={(value) => onChange({ networkStatus: value as HealthPlanInput["networkStatus"] })}>
            <option value="confirmed">Confirmed in network</option>
            <option value="verify">Needs verification</option>
            <option value="not-relevant">No specific network needs</option>
          </Select>
        </div>
        <div>
          <Label htmlFor={`${prefix}-rx`}>Recurring prescriptions</Label>
          <Select id={`${prefix}-rx`} value={plan.prescriptionStatus} onChange={(value) => onChange({ prescriptionStatus: value as HealthPlanInput["prescriptionStatus"] })}>
            <option value="confirmed">Coverage and rules confirmed</option>
            <option value="verify">Needs verification</option>
            <option value="not-relevant">No recurring prescriptions</option>
          </Select>
        </div>
      </div>
      {estimate && (
        <div className="mt-5 grid gap-3 rounded-xl border border-primary/15 bg-primary-soft/20 p-4 sm:grid-cols-3">
          <div><div className="text-xs text-muted-foreground">Low use</div><strong>{money(estimate.lowUse)}</strong></div>
          <div><div className="text-xs text-muted-foreground">Expected use</div><strong>{money(estimate.expectedUse)}</strong></div>
          <div><div className="text-xs text-muted-foreground">High use</div><strong>{money(estimate.highUse)}</strong></div>
        </div>
      )}
    </article>
  );
};

const electionOptions: Array<{ value: ElectionChoice; label: string }> = [
  { value: "enroll", label: "Enroll" },
  { value: "decline", label: "Decline" },
  { value: "verify", label: "Verify first" },
  { value: "not-offered", label: "Not offered" },
];

export const OpenEnrollmentPilot = () => {
  const [state, setState] = useState<OpenEnrollmentPilotState>(readState);
  const progress = getOpenEnrollmentProgress(state);
  const stepIndex = openEnrollmentStepIds.indexOf(state.currentStep);
  const currentComplete = isOpenEnrollmentStepComplete(state, state.currentStep);
  const medicalRecommendation = useMemo(() => getMedicalRecommendation(state), [state]);
  const retirementSummary = useMemo(() => getRetirementSummary(state), [state]);
  const electionPlan = useMemo(() => buildElectionPlan(state), [state]);
  const decisionTrace = useMemo(() => buildDecisionTrace(state), [state]);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* local persistence is optional */ }
  }, [state]);

  const patchPlan = (id: "a" | "b", patch: Partial<HealthPlanInput>) => setState((current) => ({
    ...current,
    plans: { ...current.plans, [id]: { ...current.plans[id], ...patch } },
  }));

  const go = (id: OpenEnrollmentStepId) => setState((current) => ({ ...current, currentStep: id }));
  const next = () => {
    if (!currentComplete) return;
    trackSiteEvent("benefits_pilot_step_completed", { event_category: "premium_system", step_id: state.currentStep });
    go(openEnrollmentStepIds[Math.min(stepIndex + 1, openEnrollmentStepIds.length - 1)]);
  };
  const back = () => go(openEnrollmentStepIds[Math.max(stepIndex - 1, 0)]);
  const reset = () => {
    if (!window.confirm("Clear this browser-local workflow and start over?")) return;
    try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* no-op */ }
    setState(createOpenEnrollmentPilotState());
  };
  const acknowledge = (checked: boolean) => {
    setState((current) => ({ ...current, finalReviewAcknowledged: checked }));
    if (checked) trackSiteEvent("benefits_pilot_completed", { event_category: "premium_system", pilot_version: OPEN_ENROLLMENT_PILOT_VERSION });
  };
  const printDecisionBrief = () => {
    trackSiteEvent("benefits_pilot_brief_printed", { event_category: "premium_system", pilot_version: OPEN_ENROLLMENT_PILOT_VERSION });
    window.print();
  };

  const renderStep = () => {
    if (state.currentStep === "event") return (
      <div>
        <h4 className="font-display text-2xl font-bold">What started this enrollment decision?</h4>
        <p className="mt-2 text-sm text-muted-foreground">Choose the trigger and the official submission deadline.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            ["annual", "Annual open enrollment"],
            ["new-hire", "New-hire enrollment"],
            ["qualifying-life-event", "Qualifying life event"],
          ].map(([value, label]) => <Choice key={value} checked={state.eventType === value} onChange={() => setState((current) => ({ ...current, eventType: value as OpenEnrollmentPilotState["eventType"] }))} title={label} />)}
        </div>
        <div className="mt-6 max-w-sm">
          <Label htmlFor="pilot-deadline" help="Use the date shown by the employer or benefits administrator.">Enrollment deadline</Label>
          <input id="pilot-deadline" type="date" value={state.deadline} onChange={(event) => setState((current) => ({ ...current, deadline: event.target.value }))} className={inputClass} />
        </div>
      </div>
    );

    if (state.currentStep === "household") return (
      <div>
        <h4 className="font-display text-2xl font-bold">Who needs coverage, and what matters most?</h4>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div><Label htmlFor="pilot-tier">Coverage tier</Label><Select id="pilot-tier" value={state.coverageTier} onChange={(value) => setState((current) => ({ ...current, coverageTier: value as OpenEnrollmentPilotState["coverageTier"] }))}><option value="undecided">Choose a tier</option><option value="employee-only">Employee only</option><option value="employee-spouse">Employee + spouse</option><option value="employee-child">Employee + child or children</option><option value="family">Family</option></Select></div>
          <div><Label htmlFor="pilot-other">Another employer plan available?</Label><Select id="pilot-other" value={state.otherCoverageAvailable} onChange={(value) => setState((current) => ({ ...current, otherCoverageAvailable: value as OpenEnrollmentPilotState["otherCoverageAvailable"] }))}><option value="unknown">Choose one</option><option value="yes">Yes</option><option value="no">No</option></Select></div>
          <div><Label htmlFor="pilot-use">Expected healthcare use</Label><Select id="pilot-use" value={state.healthcareUse} onChange={(value) => setState((current) => ({ ...current, healthcareUse: value as OpenEnrollmentPilotState["healthcareUse"] }))}><option value="uncertain">Choose one</option><option value="low">Generally low</option><option value="expected">Typical or expected</option><option value="high">Likely high</option></Select></div>
          <div><Label htmlFor="pilot-priority">Primary decision priority</Label><Select id="pilot-priority" value={state.decisionPriority} onChange={(value) => setState((current) => ({ ...current, decisionPriority: value as OpenEnrollmentPilotState["decisionPriority"] }))}><option value="undecided">Choose one</option><option value="lowest-expected-cost">Lowest expected cost</option><option value="predictable-costs">Predictable costs</option><option value="lowest-worst-case">Lowest bad-year exposure</option><option value="hsa-value">HSA value</option><option value="balanced">Balanced tradeoff</option></Select></div>
        </div>
      </div>
    );

    if (state.currentStep === "documents") return (
      <div>
        <h4 className="font-display text-2xl font-bold">Which controlling materials are ready?</h4>
        <p className="mt-2 text-sm text-muted-foreground">Missing documents do not stop the workflow. They become explicit verification tasks.</p>
        <div className="mt-6 space-y-4">
          {documentKeys.map((key) => (
            <div key={key} className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-[1fr_15rem] md:items-center">
              <div className="text-sm font-semibold">{documentLabels[key]}</div>
              <Select id={`pilot-doc-${key}`} value={state.documents[key]} onChange={(value) => setState((current) => ({ ...current, documents: { ...current.documents, [key]: value as OpenEnrollmentPilotState["documents"][DocumentKey] } }))}><option value="unknown">Choose status</option><option value="ready">Ready</option><option value="missing">Missing</option><option value="not-applicable">Not applicable</option></Select>
            </div>
          ))}
        </div>
        <OpenEnrollmentSourceAssistant state={state} onStateChange={setState} />
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950"><strong>Privacy boundary:</strong> this workflow does not accept uploads. Do not enter names, member IDs, claims, diagnoses, account numbers, credentials, or confidential documents.</div>
      </div>
    );

    if (state.currentStep === "medical") return (
      <div>
        <h4 className="font-display text-2xl font-bold">Compare medical options without hiding unknowns</h4>
        <label className="mt-5 flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={state.compareSecondPlan} onChange={(event) => setState((current) => ({ ...current, compareSecondPlan: event.target.checked, medicalElection: "undecided" }))} className="h-5 w-5 rounded border-border" />Compare a second medical plan</label>
        <div className="mt-6 grid gap-5 xl:grid-cols-2">
          <PlanCard id="a" plan={state.plans.a} onChange={(patch) => patchPlan("a", patch)} />
          {state.compareSecondPlan && <PlanCard id="b" plan={state.plans.b} onChange={(patch) => patchPlan("b", patch)} />}
        </div>
        <div className={`mt-5 rounded-2xl border p-5 ${medicalRecommendation.status === "verification-first" || medicalRecommendation.status === "incomplete" ? "border-amber-200 bg-amber-50" : "border-primary/25 bg-primary-soft/25"}`}>
          <h5 className="font-display text-xl font-bold">Current interpretation</h5>
          <p className="mt-2 text-sm leading-relaxed">{medicalRecommendation.explanation}</p>
          {medicalRecommendation.cautions.length > 0 && <ul className="mt-3 space-y-1 text-sm">{medicalRecommendation.cautions.map((item) => <li key={item}>• {item}</li>)}</ul>}
        </div>
        <div className="mt-6"><Label htmlFor="pilot-medical-election">Planned medical election</Label><Select id="pilot-medical-election" value={state.medicalElection} onChange={(value) => setState((current) => ({ ...current, medicalElection: value as OpenEnrollmentPilotState["medicalElection"] }))}><option value="undecided">Choose or mark for verification</option><option value="a">{state.plans.a.label || "Plan A"}</option>{state.compareSecondPlan && <option value="b">{state.plans.b.label || "Plan B"}</option>}<option value="waive">Waive employer medical coverage</option><option value="verify">Verify before deciding</option></Select></div>
      </div>
    );

    if (state.currentStep === "accounts") return (
      <div>
        <h4 className="font-display text-2xl font-bold">Review tax-advantaged accounts and contribution amounts</h4>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div><Label htmlFor="pilot-account">Healthcare account election</Label><Select id="pilot-account" value={state.accountElection} onChange={(value) => setState((current) => ({ ...current, accountElection: value as OpenEnrollmentPilotState["accountElection"] }))}><option value="undecided">Choose one</option><option value="hsa">HSA</option><option value="hra">HRA</option><option value="health-fsa">Healthcare FSA</option><option value="limited-fsa">Limited-purpose FSA</option><option value="none">None</option><option value="verify">Verify eligibility first</option></Select></div>
          <div><Label htmlFor="pilot-account-contribution">Annual employee account contribution</Label><NumberInput id="pilot-account-contribution" value={state.annualAccountContribution} onChange={(value) => setState((current) => ({ ...current, annualAccountContribution: value }))} /></div>
          <div><Label htmlFor="pilot-dependent-care">Dependent-care FSA</Label><Select id="pilot-dependent-care" value={state.dependentCareFsa} onChange={(value) => setState((current) => ({ ...current, dependentCareFsa: value as ElectionChoice }))}>{electionOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></div>
          <div><Label htmlFor="pilot-pay-periods">Paychecks per year</Label><NumberInput id="pilot-pay-periods" value={state.payPeriods} onChange={(value) => setState((current) => ({ ...current, payPeriods: value }))} max={53} /></div>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">The workflow organizes the election but does not determine tax eligibility. Verify HSA, HRA, FSA, and dependent-care rules in the official materials.</p>
      </div>
    );

    if (state.currentStep === "protection") return (
      <div>
        <h4 className="font-display text-2xl font-bold">Review the benefits people often click through</h4>
        <p className="mt-2 text-sm text-muted-foreground">Choose enroll, decline, verify first, or not offered for every category.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {ancillaryKeys.map((key) => (
            <div key={key} className="rounded-xl border border-border p-4">
              <Label htmlFor={`pilot-${key}`}>{ancillaryLabels[key]}</Label>
              <Select id={`pilot-${key}`} value={state.ancillary[key]} onChange={(value) => setState((current) => ({ ...current, ancillary: { ...current.ancillary, [key]: value as OpenEnrollmentPilotState["ancillary"][AncillaryKey] } }))}><option value="undecided">Choose one</option>{electionOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select>
            </div>
          ))}
        </div>
        <div className="mt-6 max-w-md"><Label htmlFor="pilot-ancillary-premium" help="Total annual payroll cost for the dental, vision, life, disability, and supplemental elections selected above.">Annual cost of selected other benefits</Label><NumberInput id="pilot-ancillary-premium" value={state.ancillaryAnnualPremium} onChange={(value) => setState((current) => ({ ...current, ancillaryAnnualPremium: value }))} /></div>
      </div>
    );

    if (state.currentStep === "retirement") return (
      <div>
        <h4 className="font-display text-2xl font-bold">Set the workplace retirement election</h4>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div><Label htmlFor="pilot-retirement-offered">Retirement plan offered?</Label><Select id="pilot-retirement-offered" value={state.retirementOffered} onChange={(value) => setState((current) => ({ ...current, retirementOffered: value as OpenEnrollmentPilotState["retirementOffered"] }))}><option value="unknown">Choose one</option><option value="yes">Yes</option><option value="no">No</option></Select></div>
          {state.retirementOffered === "yes" && <>
            <div><Label htmlFor="pilot-compensation">Eligible annual compensation</Label><NumberInput id="pilot-compensation" value={state.eligibleCompensation} onChange={(value) => setState((current) => ({ ...current, eligibleCompensation: value }))} /></div>
            <div><Label htmlFor="pilot-retirement-rate">Employee contribution percentage</Label><NumberInput id="pilot-retirement-rate" value={state.employeeContributionPercent} onChange={(value) => setState((current) => ({ ...current, employeeContributionPercent: value }))} max={100} step={0.01} /></div>
            <div><Label htmlFor="pilot-match-status">Employer match</Label><Select id="pilot-match-status" value={state.retirementMatchStatus} onChange={(value) => setState((current) => ({ ...current, retirementMatchStatus: value as OpenEnrollmentPilotState["retirementMatchStatus"] }))}><option value="unknown">Unknown</option><option value="known">Known formula</option><option value="none">No match</option></Select></div>
            {state.retirementMatchStatus === "known" && <>
              <div><Label htmlFor="pilot-match-rate" help="Enter 100 for dollar-for-dollar matching.">Match rate percentage</Label><NumberInput id="pilot-match-rate" value={state.matchRatePercent} onChange={(value) => setState((current) => ({ ...current, matchRatePercent: value }))} max={500} step={0.01} /></div>
              <div><Label htmlFor="pilot-match-limit">Compensation eligible for match percentage</Label><NumberInput id="pilot-match-limit" value={state.matchLimitPercent} onChange={(value) => setState((current) => ({ ...current, matchLimitPercent: value }))} max={100} step={0.01} /></div>
            </>}
            <div><Label htmlFor="pilot-vested">Employer contribution currently vested percentage</Label><NumberInput id="pilot-vested" value={state.vestedPercent} onChange={(value) => setState((current) => ({ ...current, vestedPercent: value }))} max={100} step={0.01} /></div>
          </>}
        </div>
        {retirementSummary && <div className="mt-6 grid gap-3 rounded-2xl border border-primary/25 bg-primary-soft/25 p-5 sm:grid-cols-3"><div><div className="text-xs text-muted-foreground">Annual employer value</div><strong>{money(retirementSummary.annualEmployerValue)}</strong></div><div><div className="text-xs text-muted-foreground">Immediately vested</div><strong>{money(retirementSummary.immediatelyVestedValue)}</strong></div><div><div className="text-xs text-muted-foreground">Conditional or unvested</div><strong>{money(retirementSummary.conditionalUnvestedValue)}</strong></div></div>}
      </div>
    );

    return (
      <div>
        <div className="hidden print:block"><div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Community Acquired Finance</div><h1 className="mt-2 font-display text-3xl font-bold">Benefits Decision Brief</h1></div>
        <div className="print:hidden"><h4 className="font-display text-2xl font-bold">Review the plan before using the employer portal</h4><p className="mt-2 text-sm text-muted-foreground">This is a planning record. It does not submit elections or replace official plan documents.</p></div>
        <section className={`mt-6 rounded-2xl border p-5 ${decisionTrace.status === "supported" ? "border-emerald-200 bg-emerald-50" : decisionTrace.status === "provisional" ? "border-primary/25 bg-primary-soft/25" : "border-amber-200 bg-amber-50"}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div><div className="text-xs font-bold uppercase tracking-[0.16em]">Decision status</div><h5 className="mt-1 font-display text-xl font-bold">{decisionTrace.label}</h5><p className="mt-2 max-w-3xl text-sm leading-relaxed">{decisionTrace.summary}</p></div>
            <div className="shrink-0 rounded-xl border border-current/15 bg-white/70 px-4 py-3 text-sm"><strong>{decisionTrace.sourceCoverage.ready}</strong> of <strong>{decisionTrace.sourceCoverage.total}</strong> source groups ready</div>
          </div>
        </section>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <section className={cardClass}><FileCheck2 className="h-5 w-5 text-primary" /><h5 className="mt-3 font-display text-xl font-bold">Planned elections</h5><dl className="mt-4 space-y-4 text-sm"><div><dt className="font-semibold">Medical</dt><dd className="text-muted-foreground">{electionPlan.medicalSelection}</dd></div><div><dt className="font-semibold">Interpretation</dt><dd className="text-muted-foreground">{electionPlan.medicalSummary}</dd></div><div><dt className="font-semibold">Healthcare account</dt><dd className="text-muted-foreground">{electionPlan.accountSelection}</dd></div><div><dt className="font-semibold">Retirement</dt><dd className="text-muted-foreground">{electionPlan.retirementSelection}</dd></div></dl></section>
          <section className={cardClass}><WalletCards className="h-5 w-5 text-primary" /><h5 className="mt-3 font-display text-xl font-bold">Payroll planning estimate</h5><div className="mt-4 grid gap-4 sm:grid-cols-2"><div><div className="text-xs text-muted-foreground">Annual selected elections</div><div className="text-2xl font-bold">{money(electionPlan.estimatedAnnualPayrollElections)}</div></div><div><div className="text-xs text-muted-foreground">Per paycheck</div><div className="text-2xl font-bold">{money(electionPlan.estimatedPerPaycheckElections)}</div></div></div><p className="mt-4 text-xs text-muted-foreground">Includes entered medical premiums, account contributions, other-benefit premiums, and retirement contributions. It is before tax effects and is not take-home pay.</p></section>
        </div>
        <section className="mt-5 rounded-2xl border border-border bg-background p-5"><h5 className="font-display text-xl font-bold">Dental, vision, protection, and supplemental choices</h5><div className="mt-4 grid gap-3 sm:grid-cols-2">{electionPlan.ancillarySelections.map((item) => <div key={item.label} className="flex justify-between gap-4 rounded-xl border border-border p-3 text-sm"><span>{item.label}</span><strong>{item.selection}</strong></div>)}</div></section>
        <section className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5"><div className="flex items-start gap-3"><ListChecks className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" /><div><h5 className="font-display text-xl font-bold text-amber-950">Resolve before submitting</h5>{electionPlan.verificationItems.length ? <ul className="mt-3 space-y-2 text-sm text-amber-950">{electionPlan.verificationItems.map((item) => <li key={item}>• {item}</li>)}</ul> : <p className="mt-3 text-sm text-amber-950">No unresolved items were generated. Still review the official confirmation screen.</p>}</div></div></section>
        <section className="mt-5 rounded-2xl border border-border bg-background p-5">
          <h5 className="font-display text-xl font-bold">Why this plan says what it says</h5>
          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            <div><h6 className="text-sm font-bold">Decision drivers</h6><ul className="mt-3 space-y-2 text-sm text-muted-foreground">{decisionTrace.drivers.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div><h6 className="text-sm font-bold">What could change it</h6><ul className="mt-3 space-y-2 text-sm text-muted-foreground">{decisionTrace.changeTriggers.map((item) => <li key={item}>• {item}</li>)}</ul></div>
          </div>
          <div className="mt-5 border-t border-border pt-5"><h6 className="text-sm font-bold">Model limits and assumptions</h6><ul className="mt-3 space-y-2 text-sm text-muted-foreground">{decisionTrace.assumptions.map((item) => <li key={item}>• {item}</li>)}</ul></div>
        </section>
        <section className="mt-5 rounded-2xl border border-border bg-background p-5">
          <h5 className="font-display text-xl font-bold">Source readiness ledger</h5>
          <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[38rem] border-collapse text-left text-sm"><thead><tr className="border-b border-border"><th className="pb-2 pr-4">Source group</th><th className="pb-2 pr-4">Status</th><th className="pb-2">Meaning</th></tr></thead><tbody>{decisionTrace.sourceLedger.map((source) => <tr key={source.key} className="border-b border-border/70 align-top"><td className="py-3 pr-4 font-semibold">{source.label}</td><td className="py-3 pr-4 capitalize">{source.status.replaceAll("-", " ")}</td><td className="py-3 text-muted-foreground">{source.implication}</td></tr>)}</tbody></table></div>
          {(state.sourceAssistance.a || state.sourceAssistance.b) && <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Browser-local source assistance contributed user-confirmed structured values to {state.sourceAssistance.a ? state.plans.a.label || "Plan A" : ""}{state.sourceAssistance.a && state.sourceAssistance.b ? " and " : ""}{state.sourceAssistance.b ? state.plans.b.label || "Plan B" : ""}. Raw excerpts and files were not retained.</p>}
        </section>
        <section className="mt-5 rounded-2xl border border-primary/25 bg-primary-soft/25 p-5"><h5 className="font-display text-xl font-bold">Final submission checklist</h5><ul className="mt-4 space-y-2 text-sm text-muted-foreground"><li>• Enter elections in the employer’s official portal.</li><li>• Review dependents, payroll costs, beneficiaries, and effective dates.</li><li>• Save the confirmation number or confirmation screen.</li><li>• Retain this plan with the controlling documents.</li></ul><label className="mt-5 flex items-start gap-3 rounded-xl border border-border bg-background p-4 text-sm"><input type="checkbox" checked={state.finalReviewAcknowledged} onChange={(event) => acknowledge(event.target.checked)} className="mt-0.5 h-5 w-5 rounded border-border" /><span>I reviewed the planned elections, unresolved items, and official submission steps.</span></label></section>
        <div className="mt-6 flex flex-wrap gap-3 print:hidden"><Button type="button" onClick={printDecisionBrief}><Printer className="h-4 w-4" />Print Benefits Decision Brief</Button><Button type="button" variant="ghost" onClick={reset}><RotateCcw className="h-4 w-4" />Start over</Button></div>
        {state.finalReviewAcknowledged && <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-950" role="status"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /><span>The planning workflow is complete. Submit only through the official employer portal and retain confirmation.</span></div>}
      </div>
    );
  };

  return (
    <section id="guided-pilot" className="scroll-mt-20 border-y border-border bg-[#f3f7f4] py-12 print:border-0 print:bg-white print:py-0" aria-labelledby="guided-pilot-heading">
      <div className="container min-w-0 print:max-w-none print:px-0">
        <div className="mx-auto max-w-7xl">
          <div className="print:hidden">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div><div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Browser-local decision system</div><h2 id="guided-pilot-heading" className="mt-2 font-display text-3xl font-bold md:text-4xl">Complete an open-enrollment election plan</h2><p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">One focused decision stage at a time. Answers remain in this browser. No account, payment, confidential document upload, or cloud storage is required.</p></div>
              <div className="min-w-[15rem] rounded-2xl border border-border bg-background p-4"><div className="flex justify-between text-sm font-semibold"><span>Useful completion</span><span>{progress}%</span></div><Progress value={progress} className="mt-3 h-2" /></div>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{steps.map((step, index) => { const active = step.id === state.currentStep; const complete = isOpenEnrollmentStepComplete(state, step.id); return <button key={step.id} type="button" onClick={() => go(step.id)} className={`rounded-xl border p-3 text-left ${active ? "border-primary bg-primary-soft/35" : "border-border bg-background"}`}><div className="flex items-center gap-2 text-sm font-bold"><span className="grid h-6 w-6 place-items-center rounded-full bg-muted text-xs">{complete ? "✓" : index + 1}</span>{step.title}</div><p className="mt-1 text-xs text-muted-foreground">{step.description}</p></button>; })}</div>
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-[17rem_1fr] print:block">
            <aside className="hidden rounded-2xl border border-border bg-background p-5 lg:block print:hidden"><ShieldCheck className="h-5 w-5 text-primary" /><h3 className="mt-3 font-display text-lg font-bold">Trust boundaries</h3><ul className="mt-4 space-y-3 text-xs leading-relaxed text-muted-foreground"><li>• Official employer, carrier, and plan documents control.</li><li>• Unknowns become verification tasks.</li><li>• No documents or sensitive identifiers are collected.</li><li>• CAF does not submit the elections.</li></ul></aside>
            <div className="rounded-[2rem] border border-border bg-white p-5 shadow-card md:p-8 print:border-0 print:p-0 print:shadow-none">
              {renderStep()}
              {state.currentStep !== "review" && <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between"><Button type="button" variant="ghost" onClick={back} disabled={stepIndex === 0}><ArrowLeft className="h-4 w-4" />Back</Button><div className="flex flex-col gap-2 sm:items-end">{!currentComplete && <p className="text-xs text-amber-800" role="status"><CircleAlert className="mr-1 inline h-3.5 w-3.5" />Answer required items or explicitly mark missing information.</p>}<Button type="button" onClick={next} disabled={!currentComplete}>Continue<ArrowRight className="h-4 w-4" /></Button></div></div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpenEnrollmentPilot;