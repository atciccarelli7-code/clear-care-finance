import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  FileText,
  HeartPulse,
  PiggyBank,
  Printer,
  RefreshCw,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SourceList } from "@/components/shared/SourceList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  BENEFIT_LIMITS_2026,
  calculateEmployerBenefitsActionPlan,
  type CoverageTier,
  type EmployerBenefitsInput,
  type HsaCoverage,
  type MatchFormulaType,
  type NetworkType,
  type PayBasis,
  type PayFrequency,
  type RetirementPlanType,
  type TaxTreatment,
  type VestingStatus,
  type YesNoUnknown,
} from "@/lib/employerBenefitsActionPlan";
import { useSeo } from "@/lib/seo";

type FormState = {
  payBasis: PayBasis;
  annualSalary: string;
  hourlyRate: string;
  hoursPerWeek: string;
  payFrequency: PayFrequency;
  planType: RetirementPlanType;
  employeeContributionPercent: string;
  matchType: MatchFormulaType;
  matchRatePercent: string;
  matchCeilingPercent: string;
  vestingStatus: VestingStatus;
  taxTreatment: TaxTreatment;
  premiumPerPaycheck: string;
  deductible: string;
  outOfPocketMaximum: string;
  copayOrCoinsurance: string;
  coverageTier: CoverageTier;
  hsaEligible: YesNoUnknown;
  networkType: NetworkType;
  employeeHsa: string;
  employerHsa: string;
  hsaCoverage: HsaCoverage;
};

const initialState: FormState = {
  payBasis: "salary",
  annualSalary: "",
  hourlyRate: "",
  hoursPerWeek: "",
  payFrequency: "biweekly",
  planType: "not-sure",
  employeeContributionPercent: "",
  matchType: "not-sure",
  matchRatePercent: "",
  matchCeilingPercent: "",
  vestingStatus: "not-sure",
  taxTreatment: "not-sure",
  premiumPerPaycheck: "",
  deductible: "",
  outOfPocketMaximum: "",
  copayOrCoinsurance: "",
  coverageTier: "not-sure",
  hsaEligible: "not-sure",
  networkType: "not-sure",
  employeeHsa: "",
  employerHsa: "",
  hsaCoverage: "not-sure",
};

const steps = ["Pay", "Retirement", "Health plan", "HSA", "Action plan"];

const sources = [
  {
    name: "IRS",
    pageTitle: "401(k) limit increases to $24,500 for 2026",
    url: "https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500",
    note: `Official announcement of the ${BENEFIT_LIMITS_2026.year} elective-deferral limit for 401(k), 403(b), and most 457 plans. Reviewed July 10, 2026.`,
  },
  {
    name: "IRS",
    pageTitle: "403(b) contribution limits",
    url: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-403b-contribution-limits",
    note: `Official ${BENEFIT_LIMITS_2026.year} base employee deferral limit: $${BENEFIT_LIMITS_2026.retirementElectiveDeferral.toLocaleString()}. Catch-up and plan-specific rules can change the applicable amount. Reviewed July 10, 2026.`,
  },
  {
    name: "IRS",
    pageTitle: "Revenue Procedure 2025-19 — 2026 HSA limits",
    url: "https://www.irs.gov/pub/irs-drop/rp-25-19.pdf",
    note: `Official ${BENEFIT_LIMITS_2026.year} HSA limits: $${BENEFIT_LIMITS_2026.hsa.selfOnly.toLocaleString()} self-only and $${BENEFIT_LIMITS_2026.hsa.family.toLocaleString()} family. Employer contributions count toward the same limit.`,
  },
  {
    name: "HealthCare.gov",
    pageTitle: "Summary of Benefits and Coverage",
    url: "https://www.healthcare.gov/health-care-law-protections/summary-of-benefits-and-coverage/",
    note: "Official overview of the standardized plan document used to locate deductibles, cost-sharing, networks, and coverage examples.",
  },
];

const relatedLinks = [
  ["403(b) Paycheck Calculator", "/tools/403b-paycheck-calculator", "Run a focused contribution and paycheck estimate."],
  ["Open Enrollment Guide", "/open-enrollment", "Use the full benefits decision sequence."],
  ["Open Enrollment True Cost Calculator", "/tools/open-enrollment-true-cost-calculator", "Compare two health-plan cost structures."],
  ["How to Read an SBC", "/insurance/how-to-read-an-sbc", "Find the official health-plan numbers."],
] as const;

const howItWorks = [
  { icon: PiggyBank, title: "Capture before optimizing", body: "Check the exact match formula and contribution ceiling before comparing Roth, traditional, or investment choices." },
  { icon: HeartPulse, title: "Separate the health-plan numbers", body: "Annual premium is a predictable payroll cost. The deductible and out-of-pocket maximum describe different layers of cost-sharing." },
  { icon: WalletCards, title: "Count both sides of the HSA", body: "Employee and employer HSA deposits share one IRS contribution limit. Eligibility must be confirmed for the exact plan." },
] as const;

const numberOrNull = (value: string) => {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toInput = (state: FormState): EmployerBenefitsInput => ({
  pay: {
    basis: state.payBasis,
    annualSalary: numberOrNull(state.annualSalary),
    hourlyRate: numberOrNull(state.hourlyRate),
    hoursPerWeek: numberOrNull(state.hoursPerWeek),
    frequency: state.payFrequency,
  },
  retirement: {
    planType: state.planType,
    employeeContributionPercent: numberOrNull(state.employeeContributionPercent),
    matchType: state.matchType,
    matchRatePercent: numberOrNull(state.matchRatePercent),
    matchCeilingPercent: numberOrNull(state.matchCeilingPercent),
    vestingStatus: state.vestingStatus,
    taxTreatment: state.taxTreatment,
  },
  health: {
    premiumPerPaycheck: numberOrNull(state.premiumPerPaycheck),
    deductible: numberOrNull(state.deductible),
    outOfPocketMaximum: numberOrNull(state.outOfPocketMaximum),
    copayOrCoinsurance: state.copayOrCoinsurance.trim() || null,
    coverageTier: state.coverageTier,
    hsaEligible: state.hsaEligible,
    networkType: state.networkType,
  },
  hsa: {
    employeeAnnualContribution: numberOrNull(state.employeeHsa),
    employerAnnualContribution: numberOrNull(state.employerHsa),
    coverage: state.hsaCoverage,
  },
});

const money = (value: number | null, decimals = 0) =>
  value === null
    ? "Not enough information"
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: decimals, minimumFractionDigits: decimals }).format(value);

const SelectField = ({ id, label, value, onChange, options, helper }: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly (readonly [string, string])[];
  helper?: string;
}) => (
  <div className="block space-y-2 text-sm font-bold text-foreground">
    <label htmlFor={id}>{label}</label>
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-12 w-full rounded-xl border border-input bg-background px-3 text-base font-normal ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
    >
      {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
    </select>
    {helper && <p className="text-xs font-normal leading-relaxed text-muted-foreground">{helper}</p>}
  </div>
);

const NumberField = ({ id, label, value, onChange, prefix, suffix, helper, required = false }: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  helper?: string;
  required?: boolean;
}) => (
  <div className="block space-y-2 text-sm font-bold text-foreground">
    <label htmlFor={id}>{label}</label>
    <div className="relative">
      {prefix && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-normal text-muted-foreground">{prefix}</span>}
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        min="0"
        step="any"
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`h-12 rounded-xl text-base md:text-sm ${prefix ? "pl-7" : ""} ${suffix ? "pr-12" : ""}`}
      />
      {suffix && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-normal text-muted-foreground">{suffix}</span>}
    </div>
    {helper && <p className="text-xs font-normal leading-relaxed text-muted-foreground">{helper}</p>}
  </div>
);

const ResultList = ({ title, items }: { title: string; items: string[] }) => (
  <section className="space-y-3">
    <h3 className="font-display text-lg font-bold">{title}</h3>
    {items.length ? (
      <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
        {items.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><span>{item}</span></li>)}
      </ul>
    ) : <p className="text-sm text-muted-foreground">No issue identified from the entered information.</p>}
  </section>
);

const EmployerBenefitsActionPlanPage = () => {
  const [state, setState] = useState<FormState>(initialState);
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useSeo({
    title: "Employer Benefits Action Plan",
    description: "Combine employer retirement, health insurance, and HSA details into a prioritized, plain-English benefits action plan without connecting an HR portal.",
    canonicalPath: "/tools/employer-benefits-action-plan",
  });

  const input = useMemo(() => toInput(state), [state]);
  const plan = useMemo(() => calculateEmployerBenefitsActionPlan(input), [input]);
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setState((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
  }, [step]);

  const employmentValid = state.payBasis === "salary"
    ? (numberOrNull(state.annualSalary) ?? 0) > 0
    : (numberOrNull(state.hourlyRate) ?? 0) > 0 && (numberOrNull(state.hoursPerWeek) ?? 0) > 0 && (numberOrNull(state.hoursPerWeek) ?? 0) <= 168;

  const resultText = useMemo(() => [
    "Employer Benefits Action Plan",
    "",
    "DO THIS FIRST",
    plan.doThisFirst,
    "",
    "Employer match check",
    `Employee contribution per paycheck: ${money(plan.retirement.employeePerPaycheck, 2)}`,
    `Employee contribution per year: ${money(plan.retirement.employeeAnnual)}`,
    `Estimated employer match: ${money(plan.retirement.estimatedEmployerMatch)}`,
    `Appears sufficient for stated match: ${plan.retirement.capturesStatedMatch === null ? "Cannot determine" : plan.retirement.capturesStatedMatch ? "Yes" : "No"}`,
    ...plan.retirement.missing.map((item) => `Missing: ${item}`),
    "",
    "Health-plan cost snapshot",
    `Annual employee premium: ${money(plan.health.annualPremium)}`,
    `Deductible: ${money(plan.health.deductible)}`,
    `Out-of-pocket maximum: ${money(plan.health.outOfPocketMaximum)}`,
    plan.health.warning,
    "",
    `HSA snapshot (${BENEFIT_LIMITS_2026.year})`,
    `Employee plus employer contributions: ${money(plan.hsa.totalContributions)}`,
    `Applicable base limit: ${money(plan.hsa.limit)}`,
    `Remaining base contribution room: ${money(plan.hsa.remainingRoom)}`,
    ...(plan.hsa.warning ? [plan.hsa.warning] : []),
    "",
    `Known annual employer-funded value: ${money(plan.knownAnnualEmployerValue)}`,
    plan.employerValueParts.length ? `Includes only: ${plan.employerValueParts.join(" and ")}.` : "No employer-funded amount could be counted reliably from the entered information.",
    "",
    "Missed-opportunity and verification flags",
    ...plan.flags.map((item) => `- ${item}`),
    "",
    "Questions for HR",
    ...plan.questionsForHr.map((item) => `- ${item}`),
    "",
    "Documents to keep",
    ...plan.documentsToKeep.map((item) => `- ${item}`),
    "",
    "What this means",
    plan.whatThisMeans,
    "",
    "Educational planning estimate only. Actual plan documents, the Summary of Benefits and Coverage, tax rules, and employer records control.",
  ].join("\n"), [plan]);

  const copyPlan = async () => {
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const submitStep = (event: React.FormEvent) => {
    event.preventDefault();
    if (step === 0 && !employmentValid) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  return (
    <>
      <PageHero
        eyebrow="Healthcare worker workplace benefits"
        title="Employer Benefits Action Plan"
        description="Enter the benefits your employer offers. The tool combines your 403(b) or 401(k), health-plan, and HSA details into one prioritized plan—without connecting to an HR portal or saving your information."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="hero"><a href="#action-plan-tool">Build my action plan</a></Button>
          <Button asChild variant="outline"><Link to="/open-enrollment">Read the open enrollment guide</Link></Button>
        </div>
      </PageHero>

      <main className="container space-y-16 py-12 md:py-16">
        <section id="action-plan-tool" className="scroll-mt-24">
          <Card className="mx-auto max-w-5xl rounded-3xl shadow-card print:shadow-none">
            <CardHeader className="space-y-4 border-b border-border/70">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <span className="font-bold text-primary">Step {step + 1} of {steps.length}</span>
                <span className="text-muted-foreground">{steps[step]}</span>
              </div>
              <Progress value={((step + 1) / steps.length) * 100} aria-label={`Step ${step + 1} of ${steps.length}: ${steps[step]}`} />
              <p className="text-xs leading-relaxed text-muted-foreground">Everything stays in local React state. Nothing is transmitted, uploaded, or saved.</p>
            </CardHeader>

            <CardContent className="p-5 md:p-8">
              {step < 4 ? (
                <form onSubmit={submitStep} className="space-y-8">
                  <div>
                    <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold outline-none md:text-3xl">
                      {step === 0 && "Start with pay and paycheck timing"}
                      {step === 1 && "Enter the retirement benefit"}
                      {step === 2 && "Add the health-plan numbers"}
                      {step === 3 && "Finish with the HSA"}
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                      {step === 0 && "Pay annualizes percentage-based contributions and converts costs to a per-paycheck view."}
                      {step === 1 && "Use the exact match wording if possible. Leave a number blank when it is not known—the result will turn it into an HR question."}
                      {step === 2 && "Premiums, deductibles, and out-of-pocket maximums are different numbers. Enter each separately from the plan documents."}
                      {step === 3 && `Employer HSA money counts toward the same ${BENEFIT_LIMITS_2026.year} IRS limit as employee contributions.`}
                    </p>
                  </div>

                  {step === 0 && (
                    <div className="grid gap-5 md:grid-cols-2">
                      <SelectField id="pay-basis" label="How are you paid?" value={state.payBasis} onChange={(value) => set("payBasis", value as PayBasis)} options={[["salary", "Annual salary"], ["hourly", "Hourly pay"]]} />
                      <SelectField id="pay-frequency" label="Pay frequency" value={state.payFrequency} onChange={(value) => set("payFrequency", value as PayFrequency)} options={[["weekly", "Weekly (52 checks)"], ["biweekly", "Every two weeks (26 checks)"], ["semimonthly", "Twice monthly (24 checks)"], ["monthly", "Monthly (12 checks)"]]} />
                      {state.payBasis === "salary" ? (
                        <NumberField id="annual-salary" label="Approximate annual salary" value={state.annualSalary} onChange={(value) => set("annualSalary", value)} prefix="$" required helper="Use gross annual pay before deductions." />
                      ) : (
                        <>
                          <NumberField id="hourly-rate" label="Hourly rate" value={state.hourlyRate} onChange={(value) => set("hourlyRate", value)} prefix="$" required />
                          <NumberField id="hours-per-week" label="Typical paid hours per week" value={state.hoursPerWeek} onChange={(value) => set("hoursPerWeek", value)} suffix="hrs" required helper="The estimate uses 52 weeks; overtime and unpaid time are not modeled." />
                        </>
                      )}
                      {!employmentValid && <p className="self-end rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">Enter valid positive pay information to continue.</p>}
                    </div>
                  )}

                  {step === 1 && (
                    <div className="grid gap-5 md:grid-cols-2">
                      <SelectField id="plan-type" label="Retirement plan type" value={state.planType} onChange={(value) => set("planType", value as RetirementPlanType)} options={[["403b", "403(b)"], ["401k", "401(k)"], ["other", "Other workplace plan"], ["not-sure", "Not sure"]]} />
                      <NumberField id="employee-contribution" label="Current employee contribution" value={state.employeeContributionPercent} onChange={(value) => set("employeeContributionPercent", value)} suffix="%" helper="Leave blank if not sure." />
                      <SelectField id="match-type" label="Employer match formula" value={state.matchType} onChange={(value) => set("matchType", value as MatchFormulaType)} options={[["percent-of-contribution", "Employer matches a percentage of what I contribute"], ["no-match", "Employer states there is no match"], ["not-sure", "Not sure"]]} helper="Example: 50% of contributions up to 6% of pay." />
                      {state.matchType === "percent-of-contribution" && (
                        <>
                          <NumberField id="match-rate" label="Employer match rate" value={state.matchRatePercent} onChange={(value) => set("matchRatePercent", value)} suffix="%" helper="Enter 50 for a 50% match; enter 100 for dollar-for-dollar." />
                          <NumberField id="match-ceiling" label="Match ceiling as a percent of pay" value={state.matchCeilingPercent} onChange={(value) => set("matchCeilingPercent", value)} suffix="%" helper="In “50% up to 6%,” the ceiling is 6%." />
                        </>
                      )}
                      <SelectField id="vesting" label="Vesting status" value={state.vestingStatus} onChange={(value) => set("vestingStatus", value as VestingStatus)} options={[["fully-vested", "Fully vested"], ["not-fully-vested", "Not fully vested"], ["not-sure", "Not sure"]]} helper="Unvested employer money is not treated as guaranteed employee-owned value." />
                      <SelectField id="tax-treatment" label="Current contribution selection" value={state.taxTreatment} onChange={(value) => set("taxTreatment", value as TaxTreatment)} options={[["traditional", "Traditional / pre-tax"], ["roth", "Roth"], ["split", "Split between traditional and Roth"], ["not-sure", "Not sure"]]} />
                    </div>
                  )}

                  {step === 2 && (
                    <div className="grid gap-5 md:grid-cols-2">
                      <NumberField id="premium" label="Employee premium per paycheck" value={state.premiumPerPaycheck} onChange={(value) => set("premiumPerPaycheck", value)} prefix="$" helper="Your payroll deduction, not the employer share. Leave blank if not sure." />
                      <NumberField id="deductible" label="Deductible" value={state.deductible} onChange={(value) => set("deductible", value)} prefix="$" helper="Use the deductible for your selected coverage tier." />
                      <NumberField id="oop-max" label="Out-of-pocket maximum" value={state.outOfPocketMaximum} onChange={(value) => set("outOfPocketMaximum", value)} prefix="$" helper="Do not add this to the deductible; premiums are separate." />
                      <div className="block space-y-2 text-sm font-bold">
                        <label htmlFor="cost-sharing">Copays or coinsurance, when known</label>
                        <Input id="cost-sharing" value={state.copayOrCoinsurance} onChange={(event) => set("copayOrCoinsurance", event.target.value)} className="h-12 rounded-xl text-base md:text-sm" placeholder="Example: $30 primary care; 20% imaging" />
                        <p className="text-xs font-normal text-muted-foreground">Leave blank if not sure.</p>
                      </div>
                      <SelectField id="coverage-tier" label="Coverage tier" value={state.coverageTier} onChange={(value) => set("coverageTier", value as CoverageTier)} options={[["employee", "Employee only"], ["employee-spouse", "Employee + spouse/partner"], ["employee-children", "Employee + children"], ["family", "Family"], ["not-sure", "Not sure"]]} />
                      <SelectField id="hsa-eligible" label="Is this exact plan HSA-eligible?" value={state.hsaEligible} onChange={(value) => set("hsaEligible", value as YesNoUnknown)} options={[["yes", "Yes"], ["no", "No"], ["not-sure", "Not sure"]]} helper="A high deductible alone does not prove HSA eligibility." />
                      <SelectField id="network-type" label="Plan or network type" value={state.networkType} onChange={(value) => set("networkType", value as NetworkType)} options={[["ppo", "PPO"], ["hmo", "HMO"], ["epo", "EPO"], ["hdhp", "HDHP / HSA-eligible option"], ["other", "Other"], ["not-sure", "Not sure"]]} />
                    </div>
                  )}

                  {step === 3 && (
                    <div className="grid gap-5 md:grid-cols-2">
                      <NumberField id="employee-hsa" label="Your planned annual HSA contribution" value={state.employeeHsa} onChange={(value) => set("employeeHsa", value)} prefix="$" helper="Use the full plan-year amount. Leave blank if not sure." />
                      <NumberField id="employer-hsa" label="Employer annual HSA contribution" value={state.employerHsa} onChange={(value) => set("employerHsa", value)} prefix="$" helper="Employer seed money counts toward the IRS limit. Leave blank if not sure." />
                      <SelectField id="hsa-coverage" label="HSA contribution-limit coverage" value={state.hsaCoverage} onChange={(value) => set("hsaCoverage", value as HsaCoverage)} options={[["self-only", "Self-only"], ["family", "Family"], ["not-sure", "Not sure"]]} helper={`For ${BENEFIT_LIMITS_2026.year}: $${BENEFIT_LIMITS_2026.hsa.selfOnly.toLocaleString()} self-only; $${BENEFIT_LIMITS_2026.hsa.family.toLocaleString()} family, before any eligible age-55 catch-up.`} />
                      <div className="rounded-2xl border border-primary/20 bg-primary-soft p-4 text-sm leading-relaxed text-primary">
                        <strong>Eligibility guardrail:</strong> the result will not show contribution room unless the plan is marked HSA-eligible and both contribution amounts are known.
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col-reverse gap-3 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep((current) => Math.max(current - 1, 0))}><ArrowLeft className="h-4 w-4" /> Back</Button>
                    <Button type="submit" disabled={step === 0 && !employmentValid}>{step === 3 ? "Generate action plan" : "Next"} <ArrowRight className="h-4 w-4" /></Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-8" aria-live="polite">
                  <div>
                    <h2 ref={headingRef} tabIndex={-1} className="font-display text-3xl font-bold outline-none">Your Employer Benefits Action Plan</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">A prioritized planning summary based only on what you entered. Verify every figure against the official employer and plan documents.</p>
                  </div>

                  <section className="rounded-2xl border border-primary/25 bg-primary-soft p-5">
                    <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary"><ClipboardCheck className="h-5 w-5" /> Do this first</div>
                    <p className="font-display text-xl font-bold leading-snug text-foreground">{plan.doThisFirst}</p>
                  </section>

                  {plan.validationIssues.length > 0 && <ResultList title="Correct before relying on the math" items={plan.validationIssues} />}

                  <div className="grid gap-5 lg:grid-cols-2">
                    <Card className="rounded-2xl shadow-sm">
                      <CardHeader><PiggyBank className="h-6 w-6 text-primary" /><CardTitle className="font-display text-xl">Employer match check</CardTitle></CardHeader>
                      <CardContent className="space-y-4 text-sm">
                        <dl className="grid gap-3 sm:grid-cols-2">
                          <div><dt className="text-muted-foreground">Employee / paycheck</dt><dd className="text-lg font-bold">{money(plan.retirement.employeePerPaycheck, 2)}</dd></div>
                          <div><dt className="text-muted-foreground">Employee / year</dt><dd className="text-lg font-bold">{money(plan.retirement.employeeAnnual)}</dd></div>
                          <div><dt className="text-muted-foreground">Estimated employer match</dt><dd className="text-lg font-bold">{money(plan.retirement.estimatedEmployerMatch)}</dd></div>
                          <div><dt className="text-muted-foreground">Captures stated match?</dt><dd className="text-lg font-bold">{plan.retirement.capturesStatedMatch === null ? "Cannot tell" : plan.retirement.capturesStatedMatch ? "Appears yes" : "Appears no"}</dd></div>
                        </dl>
                        {plan.retirement.missing.length > 0 && <p className="rounded-xl bg-muted p-3 text-muted-foreground"><strong className="text-foreground">Missing:</strong> {plan.retirement.missing.join(", ")}.</p>}
                        <ul className="space-y-2 text-xs leading-relaxed text-muted-foreground">{plan.retirement.assumptions.map((item) => <li key={item}>• {item}</li>)}</ul>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl shadow-sm">
                      <CardHeader><HeartPulse className="h-6 w-6 text-primary" /><CardTitle className="font-display text-xl">Health-plan cost snapshot</CardTitle></CardHeader>
                      <CardContent className="space-y-4 text-sm">
                        <dl className="grid gap-3 sm:grid-cols-3">
                          <div><dt className="text-muted-foreground">Annual premium</dt><dd className="text-lg font-bold">{money(plan.health.annualPremium)}</dd></div>
                          <div><dt className="text-muted-foreground">Deductible</dt><dd className="text-lg font-bold">{money(plan.health.deductible)}</dd></div>
                          <div><dt className="text-muted-foreground">OOP maximum</dt><dd className="text-lg font-bold">{money(plan.health.outOfPocketMaximum)}</dd></div>
                        </dl>
                        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 leading-relaxed text-amber-950"><AlertTriangle className="mr-2 inline h-4 w-4" />{plan.health.warning}</p>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl shadow-sm">
                      <CardHeader><WalletCards className="h-6 w-6 text-primary" /><CardTitle className="font-display text-xl">HSA snapshot · {BENEFIT_LIMITS_2026.year}</CardTitle></CardHeader>
                      <CardContent className="space-y-4 text-sm">
                        <dl className="grid gap-3 sm:grid-cols-3">
                          <div><dt className="text-muted-foreground">Employee + employer</dt><dd className="text-lg font-bold">{money(plan.hsa.totalContributions)}</dd></div>
                          <div><dt className="text-muted-foreground">Base limit</dt><dd className="text-lg font-bold">{money(plan.hsa.limit)}</dd></div>
                          <div><dt className="text-muted-foreground">Remaining room</dt><dd className="text-lg font-bold">{money(plan.hsa.remainingRoom)}</dd></div>
                        </dl>
                        {plan.hsa.warning && <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 leading-relaxed text-amber-950">{plan.hsa.warning}</p>}
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl shadow-sm">
                      <CardHeader><ShieldCheck className="h-6 w-6 text-primary" /><CardTitle className="font-display text-xl">Known annual employer-funded value</CardTitle></CardHeader>
                      <CardContent className="space-y-3">
                        <div className="font-display text-3xl font-bold text-primary">{money(plan.knownAnnualEmployerValue)}</div>
                        <p className="text-sm leading-relaxed text-muted-foreground">{plan.employerValueParts.length ? `Includes only ${plan.employerValueParts.join(" and ")}.` : "No employer-funded amount could be counted reliably from the entered information."} Employee contributions, premiums, deductibles, and unvested match are not counted as employer-owned value.</p>
                      </CardContent>
                    </Card>
                  </div>

                  <ResultList title="Missed-opportunity and verification flags" items={plan.flags} />
                  <ResultList title="Questions for HR" items={plan.questionsForHr} />
                  <ResultList title="Documents to keep" items={plan.documentsToKeep} />

                  <section className="rounded-2xl border border-border bg-muted/40 p-5">
                    <h3 className="font-display text-lg font-bold">What this means</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{plan.whatThisMeans}</p>
                  </section>

                  <div className="rounded-2xl border border-border p-4 text-xs leading-relaxed text-muted-foreground">
                    Educational planning tool only—not individualized investment, tax, medical, legal, or insurance advice. It does not select investments, insurers, or employer plans. Actual plan documents, the Summary of Benefits and Coverage, tax rules, and employer records control.
                  </div>

                  <div className="flex flex-col gap-3 border-t border-border/70 pt-6 sm:flex-row sm:flex-wrap print:hidden">
                    <Button type="button" onClick={copyPlan}><Copy className="h-4 w-4" />{copied ? "Copied" : "Copy action plan"}</Button>
                    <Button type="button" variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print action plan</Button>
                    <Button type="button" variant="outline" onClick={() => setStep(3)}><ArrowLeft className="h-4 w-4" /> Revise answers</Button>
                    <Button type="button" variant="ghost" onClick={() => { setState(initialState); setStep(0); }}><RefreshCw className="h-4 w-4" /> Start over</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section>
          <SectionHeading eyebrow="How to use it" title="Turn disconnected benefit fields into one decision order" description="An HR portal usually presents retirement, health insurance, and tax accounts on separate screens. This tool keeps the categories separate in the math, then connects the actions." centered />
          <div className="grid gap-5 md:grid-cols-3">
            {howItWorks.map(({ icon: Icon, title, body }) => (
              <Card key={title} className="rounded-3xl shadow-card"><CardHeader><Icon className="h-6 w-6 text-primary" /><CardTitle className="font-display text-xl">{title}</CardTitle><CardDescription className="leading-relaxed">{body}</CardDescription></CardHeader></Card>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Use next" title="Verify or compare one part at a time" description="These existing pages go deeper without duplicating this action plan." centered />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {relatedLinks.map(([title, href, description]) => (
              <Link key={href} to={href} className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-smooth hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card">
                <FileText className="mb-4 h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="font-display font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">Open resource <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-6 rounded-3xl border border-border bg-muted/30 p-6 md:p-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <BookOpenCheck className="mb-4 h-7 w-7 text-primary" />
            <h2 className="font-display text-2xl font-bold">Current limits, official documents</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Numeric limits are labeled {BENEFIT_LIMITS_2026.year} and centralized in one tested constant. Employer documents still control the plan formula, eligibility, vesting, and covered costs.</p>
          </div>
          <SourceList sources={sources} title="Official sources" />
        </section>
      </main>
    </>
  );
};

export default EmployerBenefitsActionPlanPage;
