import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, ExternalLink, FileCheck2, HeartHandshake, Printer, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { MEDICARE_COVERAGE_SOURCE_REGISTRY, getStaleMedicareSources } from "@/data/medicareCoverageSources";
import { trackSiteEvent } from "@/lib/analytics";
import { buildTurning65Plan, type Turning65Answers } from "@/lib/turning65Medicare";
import { calculateMedicareCandidateCost, evaluateMedicareArchitecture, medicareProgress, verificationSummary } from "@/lib/medicareCoverageDecision";
import { useSeo } from "@/lib/seo";
import { emptyMedicareCoverageState, medicareCoverageStateSchema, medicareStageIds, type MedicareCandidate, type MedicareCoverageState, type MedicareEvidenceSource, type MedicareStageId } from "@/medicare/contracts";

const STORAGE_KEY = "caf:medicare-coverage-decision:v1";
const LazyMedicareTestCheckoutPanel = import.meta.env.VITE_PREMIUM_TEST_CHECKOUT_DISPLAY_ENABLED === "true"
  ? lazy(() => import("@/components/premium/PremiumTestCheckoutPanel").then(({ PremiumTestCheckoutPanel }) => ({ default: PremiumTestCheckoutPanel })))
  : null;
const OFFICIAL = {
  medicare: "https://www.medicare.gov/",
  planFinder: "https://www.medicare.gov/plan-compare/",
  socialSecurity: "https://www.ssa.gov/medicare/sign-up",
  ship: "https://www.shiphelp.org/",
  medicaid: "https://www.medicaid.gov/about-us/where-can-people-get-help-medicaid-chip",
};

const STAGES: Array<{ id: MedicareStageId; short: string; title: string; why: string }> = [
  { id: "situation-timing", short: "Situation", title: "Medicare situation and timing", why: "Enrollment timing can change which choices are safe to compare now." },
  { id: "coverage-architecture", short: "Architecture", title: "Coverage architecture to investigate", why: "Original Medicare and Medicare Advantage organize access, drugs, costs, and restrictions differently." },
  { id: "providers-geography", short: "Access", title: "Doctors, hospitals, specialists, and geography", why: "A low premium is a poor fit if important care is unavailable or hard to reach." },
  { id: "prescriptions-pharmacy", short: "Prescriptions", title: "Prescription and pharmacy needs", why: "Drug formularies, tiers, restrictions, and pharmacies can materially change annual cost." },
  { id: "cost-exposure", short: "Costs", title: "Cost and bad-year exposure", why: "Premium is only one part of the financial decision." },
  { id: "managed-care", short: "Tradeoffs", title: "Managed-care and benefit tradeoffs", why: "Networks, referrals, and prior authorization are part of the coverage—not fine print after the fact." },
  { id: "candidate-verification", short: "Verify", title: "Candidate verification workspace", why: "A plan comparison is only as reliable as its current official evidence." },
  { id: "decision-brief", short: "Brief", title: "Review and Medicare Decision Brief", why: "A useful conclusion keeps assumptions, unknowns, and official next steps visible." },
];

const selectClass = "mt-2 h-12 w-full rounded-xl border border-input bg-background px-3 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

type SelectOption = { value: string; label: string };
const yesNoUnsure: SelectOption[] = [
  { value: "unsure", label: "I'm not sure" },
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];
const importance: SelectOption[] = [
  { value: "unsure", label: "I'm not sure" },
  { value: "high", label: "Very important" },
  { value: "medium", label: "Somewhat important" },
  { value: "low", label: "Not very important" },
];
const tolerance: SelectOption[] = [
  { value: "unsure", label: "I'm not sure" },
  { value: "low", label: "Low tolerance" },
  { value: "medium", label: "It depends" },
  { value: "high", label: "Comfortable with it" },
];
const evidenceSources: SelectOption[] = [
  { value: "not-recorded", label: "Source not recorded" },
  { value: "medicare-plan-finder", label: "Medicare Plan Finder" },
  { value: "summary-of-benefits", label: "Summary of Benefits" },
  { value: "evidence-of-coverage", label: "Evidence of Coverage" },
  { value: "annual-notice-of-change", label: "Annual Notice of Change" },
  { value: "formulary", label: "Formulary" },
  { value: "provider-directory", label: "Provider directory" },
  { value: "insurer-confirmation", label: "Plan confirmation" },
  { value: "provider-confirmation", label: "Provider confirmation" },
  { value: "ship-counseling", label: "SHIP counseling" },
  { value: "other-official", label: "Other official source" },
];

const Field = ({ id, label, helper, value, options, onChange }: { id: string; label: string; helper?: string; value: string; options: SelectOption[]; onChange: (value: string) => void }) => (
  <div className="rounded-2xl border border-border bg-card p-4">
    <Label htmlFor={id} className="text-base font-bold">{label}</Label>
    {helper && <p id={`${id}-help`} className="mt-1 text-sm leading-relaxed text-muted-foreground">{helper}</p>}
    <select id={id} className={selectClass} value={value} aria-describedby={helper ? `${id}-help` : undefined} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  </div>
);

const MoneyField = ({ id, label, value, onChange, helper }: { id: string; label: string; value: number | null; onChange: (value: number | null) => void; helper?: string }) => (
  <div>
    <Label htmlFor={id} className="font-bold">{label}</Label>
    {helper && <p id={`${id}-help`} className="mt-1 text-sm text-muted-foreground">{helper}</p>}
    <Input id={id} className="mt-2 h-12 text-base" type="number" min="0" step="0.01" inputMode="decimal" aria-describedby={helper ? `${id}-help` : undefined} value={value ?? ""} placeholder="Not entered" onChange={(event) => onChange(event.target.value === "" ? null : Math.max(0, Number(event.target.value)))} />
  </div>
);

const ExternalAction = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
  <a href={href} target="_blank" rel="noreferrer" onClick={onClick} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-bold text-foreground hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
    {children}<ExternalLink className="h-4 w-4" />
  </a>
);

const loadLocalState = () => {
  if (typeof window === "undefined") return emptyMedicareCoverageState();
  try {
    const parsed = medicareCoverageStateSchema.safeParse(JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null"));
    return parsed.success ? parsed.data : emptyMedicareCoverageState();
  } catch {
    return emptyMedicareCoverageState();
  }
};

type DecisionSystemProps = {
  initialState?: MedicareCoverageState;
  onStateChange?: (state: MedicareCoverageState) => void;
  persistenceLabel?: string;
  showProductIntro?: boolean;
};

export const MedicareCoverageDecisionSystem = ({ initialState, onStateChange, persistenceLabel = "Saved only in this browser", showProductIntro = true }: DecisionSystemProps) => {
  const [state, setState] = useState<MedicareCoverageState>(() => initialState || loadLocalState());
  const [started, setStarted] = useState(!showProductIntro);
  const activeIndex = medicareStageIds.indexOf(state.activeStage);
  const architecture = useMemo(() => evaluateMedicareArchitecture(state), [state]);
  const staleSources = getStaleMedicareSources();

  useEffect(() => {
    if (onStateChange) onStateChange(state);
    else if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, updatedAt: new Date().toISOString() }));
  }, [onStateChange, state]);

  const patchSection = <K extends keyof MedicareCoverageState>(section: K, patch: Partial<MedicareCoverageState[K]>) => {
    setState((current) => ({ ...current, [section]: { ...(current[section] as object), ...patch } }));
  };

  const updateCandidate = (index: number, patch: Partial<MedicareCandidate>) => setState((current) => ({
    ...current,
    candidates: current.candidates.map((candidate, candidateIndex) => candidateIndex === index ? { ...candidate, ...patch } : candidate),
  }));
  const updateCandidateCost = (index: number, field: keyof MedicareCandidate["cost"], value: number | null) => {
    const candidate = state.candidates[index];
    updateCandidate(index, { cost: { ...candidate.cost, [field]: value } });
  };

  const goToStage = (stage: MedicareStageId) => {
    setState((current) => ({ ...current, activeStage: stage }));
    window.requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById("medicare-decision-workspace")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      document.getElementById("medicare-stage-heading")?.focus();
    });
  };

  const completeAndContinue = () => {
    const completedStages = Array.from(new Set([...state.completedStages, state.activeStage]));
    trackSiteEvent("medicare_stage_complete", { event_category: "medicare_decision", stage_id: state.activeStage });
    if (state.activeStage === "coverage-architecture") trackSiteEvent("medicare_architecture_result", { event_category: "medicare_decision", architecture_type: architecture.result });
    if (state.activeStage === "candidate-verification") {
      const verificationState = state.candidates.every((candidate) => verificationSummary(candidate).complete) ? "complete" : "needs_sources";
      trackSiteEvent("medicare_verification_complete", { event_category: "medicare_decision", verification_state: verificationState });
    }
    if (activeIndex < STAGES.length - 1) goToStage(STAGES[activeIndex + 1].id);
    setState((current) => ({ ...current, completedStages, activeStage: activeIndex < STAGES.length - 1 ? STAGES[activeIndex + 1].id : current.activeStage }));
  };

  const reset = () => {
    const next = emptyMedicareCoverageState();
    setState(next);
    if (!onStateChange) window.localStorage.removeItem(STORAGE_KEY);
    setStarted(!showProductIntro);
  };

  if (!started) {
    return (
      <>
        <section className="border-b border-border bg-gradient-to-b from-primary-soft/60 to-background">
          <div className="container grid gap-8 py-14 md:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-primary">Independent Medicare decision organization</p>
              <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">Structure your Medicare decision before you compare plans.</h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Work through enrollment timing, Original Medicare versus Medicare Advantage, doctors, prescriptions, cost exposure, plan rules, and verification—one decision at a time.</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" variant="hero" className="min-h-12 text-base" onClick={() => { setStarted(true); trackSiteEvent("medicare_decision_start", { event_category: "medicare_decision", entry_point: "product" }); }}>Start the free guided decision <ArrowRight className="h-5 w-5" /></Button>
                <Button asChild size="lg" variant="outline" className="min-h-12 text-base"><Link to="/medicare-care-costs">Browse Medicare resources</Link></Button>
              </div>
              <p className="mt-4 text-sm font-semibold text-muted-foreground">No account required. No Medicare number, diagnoses, medication names, or insurer sales calls.</p>
            </div>
            <Card className="rounded-[2rem] border-primary/20 shadow-card">
              <CardHeader>
                <ShieldCheck className="h-10 w-10 text-primary" />
                <CardTitle className="font-display text-2xl">What this system does—and does not do</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed text-muted-foreground">
                <p><strong className="text-foreground">It does:</strong> organize priorities, explain tradeoffs, calculate only from entered facts, track verification, and create a decision brief.</p>
                <p><strong className="text-foreground">It does not:</strong> sell insurance, rank insurers, determine eligibility, enroll you, replace Medicare.gov, or guarantee coverage or savings.</p>
                <p>Specific plan enrollment stays with Medicare.gov or another independently chosen authorized channel.</p>
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="container py-12 md:py-16">
          <h2 className="font-display text-3xl font-extrabold">Eight stages, one reviewable decision</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{STAGES.map((stage, index) => <Card key={stage.id} className="rounded-2xl"><CardHeader><p className="text-xs font-bold uppercase tracking-widest text-primary">Stage {index + 1}</p><CardTitle className="text-lg">{stage.title}</CardTitle><CardDescription className="leading-relaxed">{stage.why}</CardDescription></CardHeader></Card>)}</div>
        </section>
      </>
    );
  }

  const turningAnswers: Turning65Answers = {
    birthMonth: null,
    birthYear: null,
    alreadyEnrolled: state.situation.alreadyEnrolled === "unsure" ? "unknown" : state.situation.alreadyEnrolled,
    coverageSource: state.situation.coverageSource === "spouse-employer" ? "active-employer" : state.situation.coverageSource === "unsure" ? "unknown" : state.situation.coverageSource,
    activeEmployment: state.situation.activeEmployment === "unsure" ? "unknown" : state.situation.activeEmployment,
    employerSize: state.situation.employerSize === "unsure" ? "unknown" : state.situation.employerSize,
    employmentEndingSoon: state.situation.coverageEndingSoon === "unsure" ? "unknown" : state.situation.coverageEndingSoon,
    hsaContributing: state.situation.hsaContributions === "unsure" ? "unknown" : state.situation.hsaContributions,
    spouseCoverageConcern: "unknown",
    drugCoverage: state.situation.creditableDrugCoverage === "yes" ? "creditable" : state.situation.creditableDrugCoverage === "no" ? "not-creditable" : state.situation.creditableDrugCoverage === "none" ? "none" : "unknown",
    preference: "undecided",
    limitedIncomeHelp: state.situation.limitedIncomeHelp === "unsure" ? "unknown" : state.situation.limitedIncomeHelp,
    stateCode: state.situation.stateCode,
  };
  const timingPlan = buildTurning65Plan(turningAnswers);

  return (
    <div id="medicare-decision-workspace" className="container scroll-mt-20 py-8 md:py-12">
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold text-primary">Medicare Coverage Decision System</p>
          <h1 id="medicare-stage-heading" tabIndex={-1} className="mt-1 font-display text-3xl font-extrabold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{STAGES[activeIndex].title}</h1>
          <p className="mt-2 max-w-3xl text-base leading-relaxed text-muted-foreground">Why this matters: {STAGES[activeIndex].why}</p>
        </div>
        <div className="shrink-0 text-sm text-muted-foreground"><span className="font-bold text-foreground">{persistenceLabel}</span><br />{medicareProgress(state.completedStages)}% reviewed</div>
      </div>

      <div className="mb-8" aria-live="polite">
        <div className="mb-2 flex justify-between text-sm font-bold"><span>Stage {activeIndex + 1} of 8</span><span>{STAGES[activeIndex].short}</span></div>
        <Progress value={((activeIndex + 1) / 8) * 100} aria-label={`Stage ${activeIndex + 1} of 8`} className="h-3" />
        <div className="mt-4 grid grid-cols-4 gap-2 md:grid-cols-8">{STAGES.map((stage, index) => <button key={stage.id} type="button" onClick={() => goToStage(stage.id)} aria-current={state.activeStage === stage.id ? "step" : undefined} className={`min-h-11 rounded-xl border px-2 py-2 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${state.activeStage === stage.id ? "border-primary bg-primary text-primary-foreground" : state.completedStages.includes(stage.id) ? "border-emerald-300 bg-emerald-50 text-emerald-900" : "border-border bg-background text-muted-foreground"}`}>{index + 1}<span className="sr-only">. {stage.title}</span></button>)}</div>
      </div>

      <div className="medicare-stage-content space-y-6">
        {state.activeStage === "situation-timing" && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field id="context" label="Which situation is closest?" value={state.situation.context} onChange={(value) => patchSection("situation", { context: value as MedicareCoverageState["situation"]["context"] })} options={[
                { value: "unsure", label: "I'm not sure" }, { value: "turning-65", label: "Turning 65 / first Medicare enrollment" }, { value: "retiring-after-65", label: "Retiring after 65 / losing employer coverage" }, { value: "already-enrolled", label: "Already enrolled and reconsidering coverage" }, { value: "annual-review", label: "Reviewing coverage for the next plan year" }, { value: "caregiver", label: "Helping someone else organize the decision" },
              ]} />
              <Field id="enrolled" label="Is Medicare already active?" value={state.situation.alreadyEnrolled} onChange={(value) => patchSection("situation", { alreadyEnrolled: value as "yes" | "no" | "unsure" })} options={yesNoUnsure} />
              <Field id="coverage" label="What coverage applies now?" helper="Choose a category; do not enter a member ID or plan number." value={state.situation.coverageSource} onChange={(value) => patchSection("situation", { coverageSource: value as MedicareCoverageState["situation"]["coverageSource"] })} options={[
                { value: "unsure", label: "I'm not sure" }, { value: "active-employer", label: "My active-employer coverage" }, { value: "spouse-employer", label: "Spouse's active-employer coverage" }, { value: "cobra", label: "COBRA" }, { value: "retiree", label: "Retiree coverage" }, { value: "marketplace", label: "Marketplace coverage" }, { value: "medicaid", label: "Medicaid" }, { value: "va-tricare", label: "VA or TRICARE" }, { value: "none", label: "No current coverage" }, { value: "other", label: "Another coverage source" },
              ]} />
              <Field id="employment" label="Is the employee actively working?" value={state.situation.activeEmployment} onChange={(value) => patchSection("situation", { activeEmployment: value as "yes" | "no" | "unsure" })} options={yesNoUnsure} />
              <Field id="employer-size" label="Employer size for Medicare coordination" helper="Ask the benefits administrator if uncertain." value={state.situation.employerSize} onChange={(value) => patchSection("situation", { employerSize: value as MedicareCoverageState["situation"]["employerSize"] })} options={[{ value: "unsure", label: "I'm not sure" }, { value: "under-20", label: "Fewer than 20 employees" }, { value: "20-plus", label: "20 or more employees" }, { value: "not-applicable", label: "Not applicable" }]} />
              <Field id="hsa" label="Are HSA contributions still being made?" helper="Medicare enrollment can affect HSA contribution eligibility and may involve retroactive Part A timing." value={state.situation.hsaContributions} onChange={(value) => patchSection("situation", { hsaContributions: value as "yes" | "no" | "unsure" })} options={yesNoUnsure} />
              <Field id="creditable" label="Is current prescription coverage creditable for Part D?" value={state.situation.creditableDrugCoverage} onChange={(value) => patchSection("situation", { creditableDrugCoverage: value as MedicareCoverageState["situation"]["creditableDrugCoverage"] })} options={[{ value: "unsure", label: "I'm not sure" }, { value: "yes", label: "Yes, confirmed in writing" }, { value: "no", label: "No" }, { value: "none", label: "No prescription coverage" }]} />
              <Field id="current-architecture" label="What Medicare arrangement applies now?" value={state.situation.currentArchitecture} onChange={(value) => patchSection("situation", { currentArchitecture: value as MedicareCoverageState["situation"]["currentArchitecture"] })} options={[{ value: "unsure", label: "I'm not sure" }, { value: "not-enrolled", label: "Not enrolled in Medicare" }, { value: "original", label: "Original Medicare" }, { value: "original-with-supplement", label: "Original Medicare with drug/supplemental coverage" }, { value: "medicare-advantage", label: "Medicare Advantage" }]} />
              <Field id="coverage-change-interest" label="What change are you considering?" helper="This controls whether switching protections need attention; it is not a plan recommendation." value={state.situation.coverageChangeInterest} onChange={(value) => patchSection("situation", { coverageChangeInterest: value as MedicareCoverageState["situation"]["coverageChangeInterest"] })} options={[{ value: "unsure", label: "I'm not sure" }, { value: "not-applicable", label: "Not applicable / first enrollment" }, { value: "stay-review", label: "Review my current coverage type" }, { value: "consider-original", label: "Consider switching to Original Medicare" }, { value: "consider-advantage", label: "Consider switching to Medicare Advantage" }]} />
              <Field id="income-help" label="Could help with Medicare costs be relevant?" helper="This opens a pathway to Medicaid, Medicare Savings Programs, and Extra Help. It is not an eligibility decision." value={state.situation.limitedIncomeHelp} onChange={(value) => patchSection("situation", { limitedIncomeHelp: value as "yes" | "no" | "unsure" })} options={yesNoUnsure} />
            </div>
            <Card className="border-amber-200 bg-amber-50"><CardHeader><CardTitle className="flex items-center gap-2 text-amber-950"><AlertTriangle className="h-5 w-5" />Timing orientation</CardTitle><CardDescription className="text-base leading-relaxed text-amber-950/80">{timingPlan.immediateAnswer}</CardDescription></CardHeader><CardContent><p className="font-bold text-amber-950">{timingPlan.headline}</p><ul className="mt-3 space-y-2 text-sm leading-relaxed text-amber-950/80">{timingPlan.warnings.slice(0, 4).map((warning) => <li key={warning}>• {warning}</li>)}</ul><Button asChild variant="outline" className="mt-4 bg-white"><Link to="/medicare-care-costs/turning-65">Open the detailed Turning 65 pathway</Link></Button></CardContent></Card>
          </div>
        )}

        {state.activeStage === "coverage-architecture" && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {(["providerFreedom", "specialistAccess", "travelFlexibility", "predictableCosts", "lowerFixedPremium", "integratedBenefits"] as const).map((key) => <Field key={key} id={key} label={({ providerFreedom: "How important is broad provider choice?", specialistAccess: "How important is direct specialist access?", travelFlexibility: "How important is routine care across regions?", predictableCosts: "How important are predictable costs?", lowerFixedPremium: "How important is a lower additional fixed premium?", integratedBenefits: "How important is bundled coverage and extra benefits?" } as const)[key]} value={state.priorities[key]} options={importance} onChange={(value) => patchSection("priorities", { [key]: value })} />)}
              <Field id="network-tolerance" label="How comfortable are you managing a provider network?" value={state.priorities.networkTolerance} options={tolerance} onChange={(value) => patchSection("priorities", { networkTolerance: value as "low" | "medium" | "high" | "unsure" })} />
              <Field id="referral-tolerance" label="How comfortable are you with specialist referrals?" value={state.priorities.referralTolerance} options={tolerance} onChange={(value) => patchSection("priorities", { referralTolerance: value as "low" | "medium" | "high" | "unsure" })} />
              <Field id="authorization-tolerance" label="How comfortable are you with prior authorization?" value={state.priorities.priorAuthorizationTolerance} options={tolerance} onChange={(value) => patchSection("priorities", { priorAuthorizationTolerance: value as "low" | "medium" | "high" | "unsure" })} />
            </div>
            <Card className="border-primary/20 bg-primary-soft/40"><CardHeader><CardTitle className="font-display text-2xl">{architecture.headline}</CardTitle><CardDescription>This is a coverage-structure investigation order, not an insurer or plan recommendation.</CardDescription></CardHeader><CardContent className="grid gap-5 md:grid-cols-2"><div><h3 className="font-bold">Why</h3><ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">{architecture.reasons.length ? architecture.reasons.map((reason) => <li key={reason}>• {reason}</li>) : <li>• Answer more priority questions to see the tradeoff.</li>}</ul></div><div><h3 className="font-bold">What still blocks a conclusion</h3><ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">{architecture.blockers.length ? architecture.blockers.map((blocker) => <li key={blocker}>• {blocker}</li>) : <li>• Candidate-specific provider, drug, cost, and rule verification is still required.</li>}</ul></div></CardContent></Card>
            <div className="flex flex-wrap gap-3"><Button asChild variant="outline"><Link to="/insurance/medicare-advantage-vs-medigap">Read Original Medicare vs Medicare Advantage/Medigap</Link></Button><Button asChild variant="outline"><Link to="/tools/medicare-advantage-plan-helper">Compare MA plan structures later</Link></Button></div>
          </div>
        )}

        {state.activeStage === "providers-geography" && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field id="keep-primary" label="How important is keeping the current primary doctor?" value={state.providers.keepPrimaryDoctor} options={importance} onChange={(value) => patchSection("providers", { keepPrimaryDoctor: value as MedicareCoverageState["providers"]["keepPrimaryDoctor"] })} />
              <Field id="keep-specialists" label="How important is keeping current specialists?" value={state.providers.keepSpecialists} options={importance} onChange={(value) => patchSection("providers", { keepSpecialists: value as MedicareCoverageState["providers"]["keepSpecialists"] })} />
              <Field id="keep-hospital" label="How important is a particular hospital system?" value={state.providers.keepHospitalSystem} options={importance} onChange={(value) => patchSection("providers", { keepHospitalSystem: value as MedicareCoverageState["providers"]["keepHospitalSystem"] })} />
              <Field id="travel" label="Do you travel regularly?" value={state.providers.regularTravel} options={yesNoUnsure} onChange={(value) => patchSection("providers", { regularTravel: value as "yes" | "no" | "unsure" })} />
              <Field id="split-home" label="Do you split time between regions or states?" value={state.providers.splitResidence} options={yesNoUnsure} onChange={(value) => patchSection("providers", { splitResidence: value as "yes" | "no" | "unsure" })} />
              <Field id="away-care" label="Do you expect routine care away from home?" value={state.providers.routineCareAway} options={yesNoUnsure} onChange={(value) => patchSection("providers", { routineCareAway: value as "yes" | "no" | "unsure" })} />
            </div>
            <Card><CardHeader><CardTitle>Provider-verification workflow</CardTitle><CardDescription>Names are not requested or stored here. Keep any personal list privately outside this system.</CardDescription></CardHeader><CardContent className="space-y-3 text-base leading-relaxed"><p>1. Check the current official plan directory for each category of important provider and facility.</p><p>2. Call the provider and ask whether they accept the exact coverage arrangement for the coming plan year.</p><p>3. Ask whether the treating clinician, facility, anesthesia, imaging, lab, post-acute, and other relevant groups participate.</p><p>4. Record the source and date in the candidate workspace; a directory result alone is not a guarantee.</p><div className="grid gap-4 pt-2 md:grid-cols-2"><Field id="directory" label="Official directory checked?" value={state.providers.directoryChecked} options={yesNoUnsure} onChange={(value) => patchSection("providers", { directoryChecked: value as "yes" | "no" | "unsure" })} /><Field id="provider-confirm" label="Provider confirmed directly?" value={state.providers.providerConfirmed} options={yesNoUnsure} onChange={(value) => patchSection("providers", { providerConfirmed: value as "yes" | "no" | "unsure" })} /></div></CardContent></Card>
          </div>
        )}

        {state.activeStage === "prescriptions-pharmacy" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-primary/20 bg-primary-soft/40 p-5"><h2 className="font-display text-2xl font-bold">Keep medication names out of this workspace.</h2><p className="mt-2 leading-relaxed text-muted-foreground">Use the official Medicare Plan Finder for plan-specific drug cost. This system tracks only whether the required checks are complete.</p></div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field id="recurring-rx" label="Are there recurring prescriptions?" value={state.prescriptions.recurringPrescriptions} options={yesNoUnsure} onChange={(value) => patchSection("prescriptions", { recurringPrescriptions: value as "yes" | "no" | "unsure" })} />
              <Field id="rx-cost" label="How important are prescription costs?" value={state.prescriptions.costConcern} options={importance} onChange={(value) => patchSection("prescriptions", { costConcern: value as MedicareCoverageState["prescriptions"]["costConcern"] })} />
              <Field id="specialty-rx" label="Is a specialty medication category relevant?" helper="Do not enter the medication name." value={state.prescriptions.specialtyMedication} options={yesNoUnsure} onChange={(value) => patchSection("prescriptions", { specialtyMedication: value as "yes" | "no" | "unsure" })} />
              <Field id="pharmacy-important" label="Is a particular pharmacy important?" value={state.prescriptions.pharmacyImportant} options={yesNoUnsure} onChange={(value) => patchSection("prescriptions", { pharmacyImportant: value as "yes" | "no" | "unsure" })} />
              <Field id="mail-order" label="Would mail order be acceptable?" value={state.prescriptions.mailOrderAcceptable} options={yesNoUnsure} onChange={(value) => patchSection("prescriptions", { mailOrderAcceptable: value as "yes" | "no" | "unsure" })} />
              {(["planFinderComplete", "formularyChecked", "tierChecked", "restrictionsChecked", "pharmacyChecked", "annualEstimateReviewed"] as const).map((key) => <Field key={key} id={key} label={({ planFinderComplete: "All drugs entered in Medicare Plan Finder?", formularyChecked: "Formulary checked?", tierChecked: "Tier and cost sharing checked?", restrictionsChecked: "Prior authorization, step therapy, and limits checked?", pharmacyChecked: "Preferred/in-network pharmacy checked?", annualEstimateReviewed: "Official annual drug estimate reviewed?" } as const)[key]} value={state.prescriptions[key]} options={yesNoUnsure} onChange={(value) => patchSection("prescriptions", { [key]: value })} />)}
            </div>
            <div className="flex flex-wrap gap-3"><ExternalAction href={OFFICIAL.planFinder} onClick={() => trackSiteEvent("medicare_plan_finder_handoff", { event_category: "medicare_decision", stage_id: "prescriptions-pharmacy" })}>Open Medicare Plan Finder</ExternalAction><Button asChild variant="outline"><Link to="/insurance/medication-coverage-checklist">Open CAF medication checklist</Link></Button></div>
          </div>
        )}

        {state.activeStage === "cost-exposure" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950"><h2 className="font-display text-2xl font-bold">Enter only verified plan values.</h2><p className="mt-2 leading-relaxed">Leave a field blank when it is unknown. The system will withhold scenario totals rather than inventing a value. All candidates still require the Part B premium that applies to the beneficiary.</p></div>
            {state.candidates.map((candidate, index) => {
              const costs = calculateMedicareCandidateCost(candidate);
              return <Card key={candidate.id} className="rounded-3xl"><CardHeader><CardTitle>{candidate.label}</CardTitle><div className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor={`${candidate.id}-structure`}>Coverage structure</Label><select id={`${candidate.id}-structure`} className={selectClass} value={candidate.structure} onChange={(event) => updateCandidate(index, { structure: event.target.value as MedicareCandidate["structure"] })}>{[{ value: "unsure", label: "Not selected" }, { value: "original", label: "Original Medicare" }, { value: "original-with-part-d", label: "Original Medicare + Part D" }, { value: "original-with-medigap", label: "Original Medicare + Part D/Medigap" }, { value: "medicare-advantage-hmo", label: "Medicare Advantage HMO" }, { value: "medicare-advantage-ppo", label: "Medicare Advantage PPO" }, { value: "medicare-advantage-hmo-pos", label: "Medicare Advantage HMO-POS" }, { value: "other", label: "Other structure" }].map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div><div><Label htmlFor={`${candidate.id}-year`}>Plan year</Label><select id={`${candidate.id}-year`} className={selectClass} value={candidate.planYear} onChange={(event) => updateCandidate(index, { planYear: Number(event.target.value) })}><option value="2026">2026</option><option value="2027">2027</option><option value="2028">2028</option></select></div></div></CardHeader><CardContent className="space-y-6"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <MoneyField id={`${candidate.id}-partb`} label="Part B monthly premium" value={candidate.cost.partBMonthlyPremium} onChange={(value) => updateCandidateCost(index, "partBMonthlyPremium", value)} />
                <MoneyField id={`${candidate.id}-plan-premium`} label="Additional plan monthly premium" value={candidate.cost.additionalMonthlyPremium} onChange={(value) => updateCandidateCost(index, "additionalMonthlyPremium", value)} />
                <MoneyField id={`${candidate.id}-partd`} label="Separate Part D monthly premium" value={candidate.cost.partDMonthlyPremium} onChange={(value) => updateCandidateCost(index, "partDMonthlyPremium", value)} />
                <MoneyField id={`${candidate.id}-medigap`} label="Medigap monthly premium" value={candidate.cost.medigapMonthlyPremium} onChange={(value) => updateCandidateCost(index, "medigapMonthlyPremium", value)} />
                <MoneyField id={`${candidate.id}-medical-deductible`} label="Medical deductible" value={candidate.cost.medicalDeductible} onChange={(value) => updateCandidateCost(index, "medicalDeductible", value)} />
                <MoneyField id={`${candidate.id}-drug-deductible`} label="Drug deductible" value={candidate.cost.drugDeductible} onChange={(value) => updateCandidateCost(index, "drugDeductible", value)} />
                <MoneyField id={`${candidate.id}-primary-copay`} label="Primary-care copay" helper="Evidence field; not multiplied automatically." value={candidate.cost.primaryCareCopay} onChange={(value) => updateCandidateCost(index, "primaryCareCopay", value)} />
                <MoneyField id={`${candidate.id}-specialist-copay`} label="Specialist copay" helper="Evidence field; not multiplied automatically." value={candidate.cost.specialistCopay} onChange={(value) => updateCandidateCost(index, "specialistCopay", value)} />
                <MoneyField id={`${candidate.id}-inpatient`} label="Inpatient cost sharing" helper="Enter a verified episode amount or rule value." value={candidate.cost.inpatientCostSharing} onChange={(value) => updateCandidateCost(index, "inpatientCostSharing", value)} />
                <MoneyField id={`${candidate.id}-outpatient`} label="Outpatient, imaging, or therapy cost sharing" helper="Enter one current verified value; keep details in official documents." value={candidate.cost.outpatientCostSharing} onChange={(value) => updateCandidateCost(index, "outpatientCostSharing", value)} />
                <MoneyField id={`${candidate.id}-medical-expected`} label="Expected annual medical cost sharing after deductible" helper="Use your own defensible estimate; do not guess." value={candidate.cost.expectedMedicalCostSharing} onChange={(value) => updateCandidateCost(index, "expectedMedicalCostSharing", value)} />
                <MoneyField id={`${candidate.id}-drug-expected`} label="Official expected annual drug cost, including deductible" helper="Use Medicare Plan Finder or a current official plan comparison; do not add the drug deductible twice." value={candidate.cost.expectedAnnualDrugCost} onChange={(value) => updateCandidateCost(index, "expectedAnnualDrugCost", value)} />
                <MoneyField id={`${candidate.id}-moop`} label="Medical maximum out-of-pocket" helper="Applies only where the candidate has a valid medical cap." value={candidate.cost.medicalMaximumOutOfPocket} onChange={(value) => updateCandidateCost(index, "medicalMaximumOutOfPocket", value)} />
                <MoneyField id={`${candidate.id}-other`} label="Other verified annual cost" value={candidate.cost.otherAnnualVerifiedCost} onChange={(value) => updateCandidateCost(index, "otherAnnualVerifiedCost", value)} />
              </div><div className="grid gap-3 sm:grid-cols-3">{([ ["Fixed annual premiums", costs.fixedAnnualPremiums], ["Expected-use scenario", costs.expectedUse], ["Higher-use scenario", costs.higherUse] ] as const).map(([label, value]) => <div key={label} className="rounded-2xl border border-border bg-muted/30 p-4"><p className="text-sm font-bold text-muted-foreground">{label}</p><p className="mt-2 font-display text-2xl font-extrabold">{value === null ? "Not enough data" : value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</p></div>)}</div><details><summary className="cursor-pointer font-bold">Assumptions and limitations</summary><ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">{costs.limitations.map((item) => <li key={item}>• {item}</li>)}</ul></details></CardContent></Card>;
            })}
            <Button asChild variant="outline"><Link to="/medicare-care-costs#cost-estimator">Open the detailed Medicare cost-risk estimator</Link></Button>
          </div>
        )}

        {state.activeStage === "managed-care" && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">{(["referralsReviewed", "priorAuthorizationReviewed", "stepTherapyReviewed", "postAcuteReviewed", "emergencyTravelReviewed", "extraBenefitsReviewedLast"] as const).map((key) => <Field key={key} id={key} label={({ referralsReviewed: "Referral rules reviewed?", priorAuthorizationReviewed: "Prior authorization rules reviewed?", stepTherapyReviewed: "Drug step therapy and quantity limits reviewed?", postAcuteReviewed: "SNF, rehab, home health, and post-acute rules reviewed?", emergencyTravelReviewed: "Emergency, urgent, and travel coverage reviewed?", extraBenefitsReviewedLast: "Extra benefits reviewed only after core coverage?" } as const)[key]} value={state.managedCare[key]} options={yesNoUnsure} onChange={(value) => patchSection("managedCare", { [key]: value })} />)}</div>
            <Card><CardHeader><CardTitle>Core coverage comes before extra benefits</CardTitle><CardDescription className="text-base leading-relaxed">Dental, vision, hearing, transportation, allowances, fitness, and food benefits can matter, but they do not override poor doctor, hospital, drug, cost, network, or authorization fit.</CardDescription></CardHeader><CardContent><div className="grid gap-4 md:grid-cols-3"><div className="rounded-2xl border p-4"><h3 className="font-bold">HMO</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Usually uses a network and often referrals. Emergency, urgent care, and out-of-area dialysis have distinct rules.</p></div><div className="rounded-2xl border p-4"><h3 className="font-bold">PPO</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Usually allows out-of-network covered care at higher cost, but providers still must agree to treat the member.</p></div><div className="rounded-2xl border p-4"><h3 className="font-bold">HMO-POS</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">May allow certain out-of-network services at higher cost. Exact permissions are plan-specific.</p></div></div><div className="mt-4 flex flex-wrap gap-3"><Button asChild variant="outline"><Link to="/insurance/prior-authorization-guide">Prior authorization guide</Link></Button><Button asChild variant="outline"><Link to="/tools/hospital-discharge-medicare-checklist">Post-discharge Medicare checklist</Link></Button></div></CardContent></Card>
          </div>
        )}

        {state.activeStage === "candidate-verification" && (
          <div className="space-y-6">
            <p className="rounded-2xl border border-primary/20 bg-primary-soft/40 p-5 text-base leading-relaxed">Use current Medicare Plan Finder results and the plan's official Summary of Benefits, Evidence of Coverage, Annual Notice of Change, formulary, and provider directory. Confirm high-stakes access directly with the plan and provider.</p>
            {state.candidates.map((candidate, index) => {
              const items = ["providers", "hospital-system", "formulary", "pharmacy", "authorization", "referrals", "costs", "moop", "anoc", "medigap-rights", "enrollment-timing"];
              const summary = verificationSummary(candidate);
              return <Card key={candidate.id} className="rounded-3xl"><CardHeader><CardTitle>{candidate.label} · {candidate.planYear}</CardTitle><CardDescription>{summary.resolved} of {summary.total || items.length} entries resolved · {summary.needsSource} need a source · {summary.changed} changed for next year · {summary.evidenceRecorded} {summary.evidenceRecorded === 1 ? "source" : "sources"} recorded</CardDescription></CardHeader><CardContent className="space-y-3">{items.map((item) => <div key={item} className="grid gap-3 rounded-xl border border-border p-3 md:grid-cols-[minmax(8rem,1fr)_13rem_14rem_11rem] md:items-end"><p className="pb-2 font-bold capitalize">{item.replaceAll("-", " ")}</p><div><Label htmlFor={`${candidate.id}-${item}-status`}>Status</Label><select id={`${candidate.id}-${item}-status`} className="mt-1 h-11 w-full rounded-xl border border-input bg-background px-3 text-base" value={candidate.verification[item] || "source-needed"} onChange={(event) => updateCandidate(index, { verification: { ...candidate.verification, [item]: event.target.value as MedicareCandidate["verification"][string] } })}><option value="source-needed">Source needed</option><option value="not-confirmed">Not confirmed</option><option value="confirmed">Confirmed</option><option value="changed-next-year">Changed for next year</option><option value="not-applicable">Not applicable</option></select></div><div><Label htmlFor={`${candidate.id}-${item}-source`}>Evidence source</Label><select id={`${candidate.id}-${item}-source`} className="mt-1 h-11 w-full rounded-xl border border-input bg-background px-3 text-base" value={candidate.evidenceSources[item] || "not-recorded"} onChange={(event) => updateCandidate(index, { evidenceSources: { ...candidate.evidenceSources, [item]: event.target.value as MedicareEvidenceSource } })}>{evidenceSources.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div><div><Label htmlFor={`${candidate.id}-${item}-date`}>Checked date</Label><Input id={`${candidate.id}-${item}-date`} className="mt-1 h-11 text-base" type="date" max={new Date().toISOString().slice(0, 10)} value={candidate.evidenceDates[item] || ""} onChange={(event) => updateCandidate(index, { evidenceDates: { ...candidate.evidenceDates, [item]: event.target.value } })} /></div></div>)}</CardContent></Card>;
            })}
            <div className="flex flex-wrap gap-3"><Button asChild variant="outline"><Link to="/tools/medicare-plan-verification-checklist">Open the standalone verification checklist</Link></Button><ExternalAction href={OFFICIAL.planFinder} onClick={() => trackSiteEvent("medicare_verification_start", { event_category: "medicare_decision", stage_id: "candidate-verification" })}>Check plans on Medicare.gov</ExternalAction></div>
          </div>
        )}

        {state.activeStage === "decision-brief" && (
          <article className="medicare-decision-brief space-y-6">
            <div className="rounded-3xl border-2 border-primary/20 bg-card p-6 shadow-card md:p-8">
              <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-start md:justify-between"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Medicare Decision Brief</p><h2 className="mt-2 font-display text-3xl font-extrabold">A decision receipt—not a plan recommendation</h2><p className="mt-2 text-muted-foreground">Prepared {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · Source review date: August 9, 2026</p></div><FileCheck2 className="h-10 w-10 text-primary" /></div>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <section><h3 className="font-display text-xl font-bold">Your Medicare situation</h3><p className="mt-2 leading-relaxed text-muted-foreground">Context: {state.situation.context.replaceAll("-", " ")}. Current coverage: {state.situation.coverageSource.replaceAll("-", " ")}. Current architecture: {state.situation.currentArchitecture.replaceAll("-", " ")}.</p></section>
                <section><h3 className="font-display text-xl font-bold">Coverage structure to investigate</h3><p className="mt-2 leading-relaxed text-muted-foreground">{architecture.headline}</p></section>
                <section><h3 className="font-display text-xl font-bold">Why</h3><ul className="mt-2 space-y-2 text-muted-foreground">{architecture.reasons.length ? architecture.reasons.map((reason) => <li key={reason}>• {reason}</li>) : <li>• Priorities are not complete enough to explain a direction.</li>}</ul></section>
                <section><h3 className="font-display text-xl font-bold">Important unresolved questions</h3><ul className="mt-2 space-y-2 text-muted-foreground">{architecture.blockers.length ? architecture.blockers.map((blocker) => <li key={blocker}>• {blocker}</li>) : <li>• Candidate-specific doctors, hospitals, prescriptions, cost sharing, and plan rules still require current official verification.</li>}</ul></section>
              </div>
              <section className="mt-8"><h3 className="font-display text-xl font-bold">Candidate comparison and cost picture</h3><div className="mt-3 grid gap-4 md:grid-cols-2">{state.candidates.map((candidate) => { const cost = calculateMedicareCandidateCost(candidate); const verified = verificationSummary(candidate); return <div key={candidate.id} className="rounded-2xl border border-border p-4"><h4 className="font-bold">{candidate.label}: {candidate.structure.replaceAll("-", " ")} · {candidate.planYear}</h4><dl className="mt-3 grid grid-cols-2 gap-2 text-sm"><dt>Fixed annual premiums</dt><dd className="font-bold">{cost.fixedAnnualPremiums === null ? "Incomplete" : cost.fixedAnnualPremiums.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</dd><dt>Expected use</dt><dd className="font-bold">{cost.expectedUse === null ? "Incomplete" : cost.expectedUse.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</dd><dt>Higher use</dt><dd className="font-bold">{cost.higherUse === null ? "No defensible total" : cost.higherUse.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</dd><dt>Verification</dt><dd className="font-bold">{verified.resolved}/{verified.total || 11} resolved</dd><dt>Evidence ledger</dt><dd className="font-bold">{verified.evidenceRecorded} {verified.evidenceRecorded === 1 ? "source" : "sources"} · {verified.evidenceDated} dated</dd></dl></div>; })}</div></section>
              <section className="mt-8"><h3 className="font-display text-xl font-bold">Must-verify action checklist</h3><ol className="mt-3 space-y-2 text-muted-foreground"><li>1. Resolve enrollment, employer coordination, HSA, creditable drug coverage, and Medigap timing questions first.</li><li>2. Enter every recurring prescription in Medicare Plan Finder; check formulary, tier, restrictions, pharmacy, and annual estimate.</li><li>3. Verify important provider and hospital categories in current directories and directly with the provider.</li><li>4. Confirm premiums, deductibles, copays, maximum exposure, networks, referrals, authorization, and next-year changes in official plan documents.</li><li>5. Review the final comparison with Medicare.gov or a local SHIP counselor before enrolling.</li></ol></section>
              {architecture.assistancePathway && <section className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><h3 className="font-display text-xl font-bold text-emerald-950">Cost-assistance pathway</h3><p className="mt-2 leading-relaxed text-emerald-950/80">Check Medicaid, Medicare Savings Programs, and Extra Help with the state agency and official programs. This brief does not determine eligibility or recommend a Special Needs Plan.</p></section>}
              <section className="mt-8"><h3 className="font-display text-xl font-bold">Official handoff</h3><div className="medicare-no-print mt-3 flex flex-wrap gap-3"><ExternalAction href={OFFICIAL.medicare}>Medicare.gov</ExternalAction><ExternalAction href={OFFICIAL.planFinder} onClick={() => trackSiteEvent("medicare_plan_finder_handoff", { event_category: "medicare_decision", stage_id: "decision-brief" })}>Medicare Plan Finder</ExternalAction><ExternalAction href={OFFICIAL.socialSecurity}>Social Security</ExternalAction><ExternalAction href={OFFICIAL.ship} onClick={() => trackSiteEvent("ship_handoff", { event_category: "medicare_decision", stage_id: "decision-brief" })}>Find local SHIP</ExternalAction><ExternalAction href={OFFICIAL.medicaid}>State Medicaid help</ExternalAction></div></section>
              <section className="mt-8"><h3 className="font-display text-xl font-bold">Sources</h3>{staleSources.length > 0 && <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">One or more source review dates have passed. Verify current official rules before relying on time-sensitive figures.</p>}<ul className="mt-3 space-y-3 text-sm text-muted-foreground">{MEDICARE_COVERAGE_SOURCE_REGISTRY.map((source) => <li key={source.id}><a className="font-bold text-primary underline-offset-4 hover:underline" href={source.url} target="_blank" rel="noreferrer">{source.title}</a> — {source.agency}; supports {source.supports.toLowerCase()}; last verified {source.lastVerified}; next review {source.nextReview}; {source.authority}.</li>)}</ul></section>
            </div>
            <div className="medicare-no-print flex flex-col gap-3 sm:flex-row sm:justify-end"><Button variant="outline" onClick={() => goToStage("candidate-verification")}><ArrowLeft className="h-4 w-4" />Update verification</Button><Button onClick={() => { trackSiteEvent("medicare_decision_brief_complete", { event_category: "medicare_decision", completion_type: "browser_local" }); trackSiteEvent("medicare_print", { event_category: "medicare_decision", output_type: "browser_print" }); window.print(); }}><Printer className="h-4 w-4" />Print or save as PDF</Button></div>
          </article>
        )}
      </div>

      <div className="medicare-no-print mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3"><Button type="button" variant="ghost" onClick={reset}><RotateCcw className="h-4 w-4" />Start over</Button>{activeIndex > 0 && <Button type="button" variant="outline" onClick={() => goToStage(STAGES[activeIndex - 1].id)}><ArrowLeft className="h-4 w-4" />Previous</Button>}</div>
        {activeIndex < 7 && <Button type="button" size="lg" onClick={completeAndContinue}>Mark reviewed and continue <ArrowRight className="h-4 w-4" /></Button>}
      </div>

      <aside className="medicare-no-print mt-10 rounded-2xl border border-border bg-muted/30 p-5"><div className="flex gap-3"><HeartHandshake className="mt-1 h-6 w-6 shrink-0 text-primary" /><div><h2 className="font-bold">Independent educational decision organization</h2><p className="mt-1 text-sm leading-relaxed text-muted-foreground">CAF does not sell Medicare insurance, accept insurer or broker commissions, sell leads, enroll users, or rank plans by compensation. Current official plan documents and agencies control.</p></div></div></aside>
    </div>
  );
};

const MedicareCoverageDecisionPage = () => {
  useSeo({
    title: "Medicare Coverage Decision System",
    description: "Organize Medicare enrollment timing, coverage architecture, providers, prescriptions, costs, managed-care rules, plan verification, and a printable Decision Brief without insurer sales pressure.",
    canonicalPath: "/products/medicare-coverage-decision-system",
    jsonLd: [{
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Medicare Coverage Decision System",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: "A free, independent Medicare decision-organization workflow with no plan sales or enrollment.",
    }],
  });
  useEffect(() => { trackSiteEvent("medicare_product_view", { event_category: "medicare_decision", surface_id: "public_product" }); }, []);
  return <>
    <MedicareCoverageDecisionSystem />
    {LazyMedicareTestCheckoutPanel && <div className="container pb-16"><Suspense fallback={<p role="status">Loading protected test checkout…</p>}><LazyMedicareTestCheckoutPanel productKey="medicare-coverage-decision-system" productName="Medicare Coverage Decision System" /></Suspense></div>}
  </>;
};

export default MedicareCoverageDecisionPage;
