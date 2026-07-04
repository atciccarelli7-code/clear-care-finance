import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FileText,
  Hospital,
  Pill,
  Printer,
  Shield,
  Stethoscope,
  WalletCards,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSeo } from "@/lib/seo";

type PlanType = "HMO" | "PPO" | "EPO" | "POS" | "HDHP" | "Other";
type MetalLevel = "Employer" | "Bronze" | "Silver" | "Gold" | "Platinum" | "Catastrophic" | "Unknown";
type Tone = "blue" | "green" | "amber" | "slate";

type PlanInputs = {
  id: string;
  name: string;
  metalLevel: MetalLevel;
  planType: PlanType;
  premiumPerPayPeriod: number;
  payPeriodsPerYear: number;
  deductible: number;
  coinsurancePercent: number;
  outOfPocketMax: number;
  employerHsaHraAnnual: number;
  expectedDeductibleCare: number;
  visitCopaysAnnual: number;
  annualRxCost: number;
  doctorConfirmed: boolean;
  hospitalConfirmed: boolean;
  drugsConfirmed: boolean;
  priorAuthLikely: boolean;
  referralsRequired: boolean;
  plannedOutOfNetwork: boolean;
};

type PlanResult = PlanInputs & {
  annualPremium: number;
  deductibleCareCost: number;
  estimatedCostSharing: number;
  netExpectedAnnualCost: number;
  badYearCost: number;
  frictionScore: number;
  frictionLabel: string;
  flags: string[];
};

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const percent = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 0 });

const sourceLinks = [
  ["HealthCare.gov — How to pick a health insurance plan", "https://www.healthcare.gov/choose-a-plan/comparing-plans/"],
  ["HealthCare.gov — Health plan categories", "https://www.healthcare.gov/choose-a-plan/plans-categories/"],
  ["HealthCare.gov — Plan and network types", "https://www.healthcare.gov/choose-a-plan/plan-types/"],
  ["HealthCare.gov — Total health care costs", "https://www.healthcare.gov/choose-a-plan/your-total-costs/"],
  ["CMS — Summary of Benefits and Coverage resources", "https://www.cms.gov/cciio/resources/forms-reports-and-other-resources/summary-of-benefits-and-coverage-and-uniform-glossary"],
  ["HealthCare.gov — Find local help", "https://localhelp.healthcare.gov/"],
];

const quickStartScenarios = [
  {
    title: "Healthy year / low expected use",
    useWhen: "Use when you mainly need preventive care and want to avoid overpaying every paycheck.",
    enterFirst: "Premium, deductible, out-of-pocket max, employer HSA/HRA money, and doctor/hospital network checks.",
  },
  {
    title: "Medication-heavy year",
    useWhen: "Use when one medication could dominate the decision more than the deductible does.",
    enterFirst: "Drug formulary tier, annual prescription cost, preferred pharmacy, prior authorization, step therapy, and specialty pharmacy rules.",
  },
  {
    title: "Planned surgery, imaging, pregnancy, or therapy",
    useWhen: "Use when care is predictable enough that the bad-year math matters before the premium does.",
    enterFirst: "Out-of-pocket max, deductible, coinsurance, hospital network, prior authorization, and centers-of-excellence rules.",
  },
  {
    title: "Family coverage decision",
    useWhen: "Use when multiple people may hit different deductibles, networks, and medication rules.",
    enterFirst: "Family premium, family deductible, embedded individual deductible, family out-of-pocket max, pediatric providers, and spouse surcharge rules.",
  },
];

const makePlan = (id: string, name: string, overrides: Partial<PlanInputs> = {}): PlanInputs => ({
  id,
  name,
  metalLevel: "Employer",
  planType: "PPO",
  premiumPerPayPeriod: 90,
  payPeriodsPerYear: 26,
  deductible: 2000,
  coinsurancePercent: 20,
  outOfPocketMax: 6500,
  employerHsaHraAnnual: 0,
  expectedDeductibleCare: 1200,
  visitCopaysAnnual: 250,
  annualRxCost: 300,
  doctorConfirmed: false,
  hospitalConfirmed: false,
  drugsConfirmed: false,
  priorAuthLikely: false,
  referralsRequired: false,
  plannedOutOfNetwork: false,
  ...overrides,
});

const defaultPlans: PlanInputs[] = [
  makePlan("plan-a", "Plan A", { planType: "PPO", premiumPerPayPeriod: 120, deductible: 1500, outOfPocketMax: 5500 }),
  makePlan("plan-b", "Plan B", { planType: "HDHP", premiumPerPayPeriod: 65, deductible: 3200, outOfPocketMax: 7000, employerHsaHraAnnual: 750 }),
  makePlan("plan-c", "Plan C", { planType: "HMO", premiumPerPayPeriod: 40, deductible: 1000, outOfPocketMax: 5000, referralsRequired: true }),
];

const Badge = ({ children, tone = "blue" }: { children: string; tone?: Tone }) => {
  const tones: Record<Tone, string> = {
    blue: "border-primary/20 bg-primary-soft text-primary",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    slate: "border-border bg-muted text-muted-foreground",
  };
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
};

const Field = ({ label, value, onChange, help, step = 1 }: { label: string; value: number; onChange: (value: number) => void; help?: string; step?: number }) => (
  <label className="block rounded-2xl border border-border bg-background/60 p-4">
    <span className="text-sm font-bold text-foreground">{label}</span>
    {help && <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{help}</span>}
    <input className={`${inputClass} mt-3`} type="number" min={0} step={step} value={value} onChange={(event) => onChange(Number(event.target.value) || 0)} />
  </label>
);

const TextField = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
  <label className="block rounded-2xl border border-border bg-background/60 p-4">
    <span className="text-sm font-bold text-foreground">{label}</span>
    <input className={`${inputClass} mt-3`} value={value} onChange={(event) => onChange(event.target.value)} />
  </label>
);

const SelectField = ({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) => (
  <label className="block rounded-2xl border border-border bg-background/60 p-4">
    <span className="text-sm font-bold text-foreground">{label}</span>
    <select className={`${inputClass} mt-3`} value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>
);

const CheckField = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) => (
  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-background/60 p-4 text-sm">
    <input className="mt-1 h-4 w-4 rounded border-border" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    <span className="font-medium leading-relaxed text-foreground">{label}</span>
  </label>
);

const Metric = ({ label, value, detail }: { label: string; value: string; detail?: string }) => (
  <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
    <div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
    <div className="mt-2 font-display text-2xl font-extrabold tracking-tight text-foreground">{value}</div>
    {detail && <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</div>}
  </div>
);

const frictionLabel = (score: number) => score <= 1 ? "Lower friction" : score <= 3 ? "Moderate friction" : "Higher verification burden";
const frictionTone = (score: number): Tone => score <= 1 ? "green" : score <= 3 ? "blue" : "amber";

const calculatePlan = (plan: PlanInputs): PlanResult => {
  const annualPremium = plan.premiumPerPayPeriod * plan.payPeriodsPerYear;
  const deductibleCareCost = Math.min(plan.expectedDeductibleCare, plan.deductible) + Math.max(0, plan.expectedDeductibleCare - plan.deductible) * (plan.coinsurancePercent / 100);
  const rawCostSharing = deductibleCareCost + plan.visitCopaysAnnual + plan.annualRxCost;
  const estimatedCostSharing = plan.outOfPocketMax > 0 ? Math.min(rawCostSharing, plan.outOfPocketMax) : rawCostSharing;
  const netExpectedAnnualCost = Math.max(0, annualPremium + estimatedCostSharing - plan.employerHsaHraAnnual);
  const badYearCost = Math.max(0, annualPremium + (plan.outOfPocketMax || estimatedCostSharing) - plan.employerHsaHraAnnual);
  const flags = [
    !plan.doctorConfirmed ? "Doctors not confirmed in network" : null,
    !plan.hospitalConfirmed ? "Hospital/system not confirmed" : null,
    !plan.drugsConfirmed ? "Medication coverage not confirmed" : null,
    plan.priorAuthLikely ? "Prior authorization likely for some care" : null,
    plan.referralsRequired ? "Specialist referrals may be required" : null,
    plan.plannedOutOfNetwork ? "Planned out-of-network care needs separate review" : null,
    plan.outOfPocketMax === 0 ? "Out-of-pocket max missing" : null,
  ].filter(Boolean) as string[];
  const networkBase = plan.planType === "PPO" ? 0 : plan.planType === "POS" || plan.planType === "HDHP" ? 1 : 2;
  const frictionScore = networkBase + Number(!plan.doctorConfirmed) + Number(!plan.hospitalConfirmed) + Number(!plan.drugsConfirmed) + Number(plan.priorAuthLikely) + Number(plan.referralsRequired) + Number(plan.plannedOutOfNetwork);
  return { ...plan, annualPremium, deductibleCareCost, estimatedCostSharing, netExpectedAnnualCost, badYearCost, frictionScore, frictionLabel: frictionLabel(frictionScore), flags };
};

const PlanEditor = ({ plan, onChange }: { plan: PlanInputs; onChange: (plan: PlanInputs) => void }) => {
  const set = (patch: Partial<PlanInputs>) => onChange({ ...plan, ...patch });
  return (
    <Card className="rounded-3xl border-border/80 shadow-card">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge tone="slate">Manual plan entry</Badge>
            <CardTitle className="mt-3 font-display text-2xl">{plan.name || "Untitled plan"}</CardTitle>
            <CardDescription>Copy values from the SBC, employer portal, Marketplace detail page, provider directory, and drug formulary.</CardDescription>
          </div>
          <Badge tone={plan.planType === "PPO" ? "green" : plan.planType === "HMO" || plan.planType === "EPO" ? "amber" : "blue"}>{plan.planType}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 md:grid-cols-3">
          <TextField label="Plan name" value={plan.name} onChange={(name) => set({ name })} />
          <SelectField label="Category" value={plan.metalLevel} options={["Employer", "Bronze", "Silver", "Gold", "Platinum", "Catastrophic", "Unknown"]} onChange={(value) => set({ metalLevel: value as MetalLevel })} />
          <SelectField label="Network / plan type" value={plan.planType} options={["HMO", "PPO", "EPO", "POS", "HDHP", "Other"]} onChange={(value) => set({ planType: value as PlanType })} />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <Field label="Premium per paycheck" value={plan.premiumPerPayPeriod} onChange={(premiumPerPayPeriod) => set({ premiumPerPayPeriod })} />
          <Field label="Pay periods per year" value={plan.payPeriodsPerYear} onChange={(payPeriodsPerYear) => set({ payPeriodsPerYear })} />
          <Field label="Employer HSA/HRA money per year" value={plan.employerHsaHraAnnual} onChange={(employerHsaHraAnnual) => set({ employerHsaHraAnnual })} />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <Field label="Individual deductible" value={plan.deductible} onChange={(deductible) => set({ deductible })} />
          <Field label="Coinsurance after deductible (%)" value={plan.coinsurancePercent} onChange={(coinsurancePercent) => set({ coinsurancePercent })} />
          <Field label="Individual in-network out-of-pocket max" value={plan.outOfPocketMax} onChange={(outOfPocketMax) => set({ outOfPocketMax })} />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <Field label="Expected care subject to deductible" value={plan.expectedDeductibleCare} help="Labs, imaging, therapy, outpatient procedures, or other costs that may hit the deductible." onChange={(expectedDeductibleCare) => set({ expectedDeductibleCare })} />
          <Field label="Estimated annual visit copays" value={plan.visitCopaysAnnual} help="Primary care, specialist, urgent care, ER, therapy, or other copays." onChange={(visitCopaysAnnual) => set({ visitCopaysAnnual })} />
          <Field label="Estimated annual prescription cost" value={plan.annualRxCost} onChange={(annualRxCost) => set({ annualRxCost })} />
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <CheckField label="My preferred doctors are confirmed in network" checked={plan.doctorConfirmed} onChange={(doctorConfirmed) => set({ doctorConfirmed })} />
          <CheckField label="My preferred hospital / health system is confirmed" checked={plan.hospitalConfirmed} onChange={(hospitalConfirmed) => set({ hospitalConfirmed })} />
          <CheckField label="My important medications are confirmed covered" checked={plan.drugsConfirmed} onChange={(drugsConfirmed) => set({ drugsConfirmed })} />
          <CheckField label="Prior authorization is likely for important care" checked={plan.priorAuthLikely} onChange={(priorAuthLikely) => set({ priorAuthLikely })} />
          <CheckField label="Specialist referrals may be required" checked={plan.referralsRequired} onChange={(referralsRequired) => set({ referralsRequired })} />
          <CheckField label="I expect planned out-of-network care" checked={plan.plannedOutOfNetwork} onChange={(plannedOutOfNetwork) => set({ plannedOutOfNetwork })} />
        </div>
      </CardContent>
    </Card>
  );
};

const ResultCard = ({ result, isLowestExpected, isLowestBadYear }: { result: PlanResult; isLowestExpected: boolean; isLowestBadYear: boolean }) => (
  <Card className="rounded-3xl border-border/80 shadow-card">
    <CardHeader>
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="slate">{result.metalLevel}</Badge>
        <Badge tone={frictionTone(result.frictionScore)}>{result.frictionLabel}</Badge>
        {isLowestExpected && <Badge tone="green">Lowest expected cost</Badge>}
        {isLowestBadYear && <Badge tone="blue">Lowest bad-year cost</Badge>}
      </div>
      <CardTitle className="font-display text-2xl">{result.name}</CardTitle>
      <CardDescription>{result.planType} result. This is a planning estimate, not a benefit verification.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <Metric label="Expected annual cost" value={currency.format(result.netExpectedAnnualCost)} detail="Premium + estimated cost-sharing - employer HSA/HRA money" />
        <Metric label="Bad-year exposure" value={currency.format(result.badYearCost)} detail="Premium + entered OOP max - employer HSA/HRA money" />
        <Metric label="Annual premium" value={currency.format(result.annualPremium)} detail={`${currency.format(result.premiumPerPayPeriod)} × ${result.payPeriodsPerYear} pay periods`} />
        <Metric label="Estimated care cost" value={currency.format(result.estimatedCostSharing)} detail="Deductible care + copays + prescriptions, capped by OOP max if entered" />
      </div>
      <div className="rounded-2xl border border-border bg-background/60 p-4">
        <div className="mb-3 text-sm font-bold">Verification flags</div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {(result.flags.length ? result.flags : ["No major verification gaps entered. Still confirm current plan documents before enrolling."]).map((flag) => (
            <li key={flag} className="flex gap-2">
              {result.flags.length ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />}
              <span>{flag}</span>
            </li>
          ))}
        </ul>
      </div>
    </CardContent>
  </Card>
);

const ComparisonFrameworkTool = () => {
  const [plans, setPlans] = useState<PlanInputs[]>(defaultPlans);
  const results = useMemo(() => plans.map(calculatePlan), [plans]);
  const lowestExpected = Math.min(...results.map((plan) => plan.netExpectedAnnualCost));
  const lowestBadYear = Math.min(...results.map((plan) => plan.badYearCost));
  const updatePlan = (index: number, plan: PlanInputs) => setPlans((current) => current.map((item, itemIndex) => itemIndex === index ? plan : item));

  const tableRows: [string, (plan: PlanResult) => string][] = [
    ["Expected annual cost", (plan) => currency.format(plan.netExpectedAnnualCost)],
    ["Bad-year exposure", (plan) => currency.format(plan.badYearCost)],
    ["Annual premium", (plan) => currency.format(plan.annualPremium)],
    ["Deductible", (plan) => currency.format(plan.deductible)],
    ["Coinsurance", (plan) => percent.format(plan.coinsurancePercent / 100)],
    ["Out-of-pocket max", (plan) => plan.outOfPocketMax ? currency.format(plan.outOfPocketMax) : "Missing"],
    ["Employer HSA/HRA money", (plan) => currency.format(plan.employerHsaHraAnnual)],
    ["Verification burden", (plan) => plan.frictionLabel],
  ];

  return (
    <section id="comparison-tool" className="scroll-mt-24">
      <SectionHeading centered eyebrow="Manual comparison builder" title="Commercial insurance plan comparison framework" description="Enter the numbers from each plan's documents. The tool compares cost and friction without pretending plan data stays static." />
      <div className="space-y-6">
        {plans.map((plan, index) => <PlanEditor key={plan.id} plan={plan} onChange={(updatedPlan) => updatePlan(index, updatedPlan)} />)}
      </div>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {results.map((result) => <ResultCard key={result.id} result={result} isLowestExpected={result.netExpectedAnnualCost === lowestExpected} isLowestBadYear={result.badYearCost === lowestBadYear} />)}
      </div>
      <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-card shadow-card">
        <div className="border-b border-border bg-muted/40 p-5">
          <h3 className="font-display text-2xl font-bold">Side-by-side table</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Use this to spot the tradeoff. Then verify the actual plan documents.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[940px] w-full border-collapse text-left text-sm">
            <caption className="sr-only">Commercial health insurance plan comparison table</caption>
            <thead>
              <tr className="border-b border-border bg-background/70">
                <th scope="col" className="w-48 p-4 font-bold">Criteria</th>
                {results.map((plan) => <th key={plan.id} scope="col" className="min-w-56 p-4 align-top font-bold"><div>{plan.name}</div><div className="mt-1 text-xs font-semibold text-primary">{plan.planType} · {plan.metalLevel}</div></th>)}
              </tr>
            </thead>
            <tbody>
              {tableRows.map(([label, getValue]) => (
                <tr key={label} className="border-b border-border/70 last:border-0">
                  <th scope="row" className="bg-muted/30 p-4 align-top font-semibold text-muted-foreground">{label}</th>
                  {results.map((plan) => <td key={`${plan.id}-${label}`} className="p-4 align-top font-medium text-foreground">{getValue(plan)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

const CommercialInsuranceComparisonPage = () => {
  useSeo({
    title: "Commercial Health Insurance Comparison Framework",
    description: "A manual commercial health insurance comparison framework for employer and Marketplace plans, including premiums, deductibles, out-of-pocket maxes, network checks, medications, prior authorization, and bad-year exposure.",
    canonicalPath: "/insurance/commercial-insurance-comparison",
  });

  const verificationSteps = [
    "Open the Summary of Benefits and Coverage, plan brochure, provider directory, and drug formulary.",
    "Confirm every must-keep doctor, hospital, facility, pharmacy, and medication using the current plan year.",
    "Check whether the deductible applies before copays, whether drugs have separate deductibles, and whether family coverage has embedded individual limits.",
    "Look for prior authorization, step therapy, quantity limits, referrals, centers of excellence, and out-of-network rules.",
    "Compare a normal year and a bad year instead of choosing only by premium.",
    "Save screenshots or PDFs of the plan details used for the decision.",
  ];

  const roadmap = [
    ["Phase 1", "Manual framework", "User enters SBC and employer/Marketplace details. Lowest legal risk and highest freshness."],
    ["Phase 2", "Guided document extraction", "Let users paste plan text or upload details, then prefill fields for review."],
    ["Phase 3", "Template library", "Create plan archetypes for PPO, HMO, EPO, POS, HDHP, and high-drug-cost users."],
    ["Phase 4", "Live comparison marketplace", "Only after compliance review, data licensing/API source, clear disclosures, and non-steering monetization rules."],
  ];

  return (
    <>
      <PageHero eyebrow="Commercial insurance" title="Compare Health Insurance Plans Without Building a Stale Plan Database" description="A policy-resilient framework for employer and Marketplace plans: enter the plan facts, compare total cost and bad-year exposure, then verify networks, medications, and authorization rules.">
        <Button asChild variant="hero" size="lg"><a href="#quick-start">Start with a scenario <ArrowRight className="h-4 w-4" /></a></Button>
        <Button asChild variant="outline" size="lg"><a href="#comparison-tool">Open comparison builder</a></Button>
        <Button asChild variant="outline" size="lg"><a href="#verification-checklist">Verification checklist</a></Button>
      </PageHero>

      <main className="container space-y-16 py-12 md:space-y-20 md:py-16">
        <section className="grid gap-5 md:grid-cols-3" aria-label="Commercial insurance comparison principles">
          {[
            [FileText, "Why manual first", "Plan details change too often for a static ranking table.", "Employer benefits, Marketplace plans, provider networks, formularies, authorization rules, and cost-sharing can change by plan year, ZIP code, employer, county, and household details."],
            [WalletCards, "Core comparison", "Premium is only the entry fee.", "A useful comparison includes premium, deductible, out-of-pocket maximum, employer HSA/HRA money, expected use, prescriptions, and bad-year exposure."],
            [Stethoscope, "RN reality check", "The plan has to work when care gets complicated.", "Network access, specialty drugs, imaging, referrals, DME, therapy, procedures, and prior authorization often matter more than the cleanest-looking premium."],
          ].map(([Icon, eyebrow, title, body]) => {
            const TypedIcon = Icon as typeof FileText;
            return <Card key={title as string} className="rounded-3xl border-border/80 shadow-card"><CardHeader><div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary"><TypedIcon className="h-5 w-5" /></div><div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow as string}</div><CardTitle className="font-display text-xl leading-tight">{title as string}</CardTitle><CardDescription className="text-sm leading-relaxed">{body as string}</CardDescription></CardHeader></Card>;
          })}
        </section>

        <section className="rounded-[2rem] border border-amber-200 bg-amber-50 p-5 shadow-card md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-amber-700 shadow-sm"><AlertTriangle className="h-5 w-5" /></div><div className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-amber-800">Legal-safe product direction</div><h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-amber-950">This should not rank insurers yet.</h2><p className="mt-3 text-sm leading-relaxed text-amber-950/80 md:text-base">A NerdWallet-style destination is possible long term, but the first trustworthy version should compare user-entered plan facts. That avoids stale provider networks, outdated formularies, county-specific pricing errors, and implied individualized advice.</p></div>
            <div className="grid gap-3 sm:grid-cols-2">{["No insurer ranking or best-plan claim.", "No live quote, enrollment, or lead form gate.", "No guarantee that a doctor or drug is covered.", "Always push users back to the current SBC, provider directory, formulary, and employer/Marketplace portal."].map((item) => <div key={item} className="rounded-2xl border border-amber-200 bg-white/75 p-4 text-sm font-semibold text-amber-950 shadow-sm">{item}</div>)}</div>
          </div>
        </section>

        <section>
          <SectionHeading centered eyebrow="What the framework compares" title="A better comparison is cost plus friction" description="HealthCare.gov emphasizes plan categories, total costs, and plan/network types. This framework turns those into a practical side-by-side workflow." />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              [Calculator, "Cost math", "Premium, deductible, coinsurance, copays, prescriptions, employer HSA/HRA money, and out-of-pocket max."],
              [Hospital, "Network", "Doctors, hospitals, facilities, labs, imaging centers, pharmacies, and out-of-network rules."],
              [Pill, "Medications", "Formulary tier, preferred pharmacy, prior authorization, step therapy, quantity limits, and specialty drug exposure."],
              [ClipboardCheck, "Administrative friction", "Referrals, prior authorization, centers of excellence, medical necessity rules, and appeal process."],
            ].map(([Icon, title, body]) => { const TypedIcon = Icon as typeof Calculator; return <Card key={title as string} className="rounded-3xl border-border/80 shadow-card"><CardHeader><div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary"><TypedIcon className="h-5 w-5" /></div><div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Comparison pillar</div><CardTitle className="font-display text-xl leading-tight">{title as string}</CardTitle><CardDescription className="text-sm leading-relaxed">{body as string}</CardDescription></CardHeader></Card>; })}
          </div>
        </section>

        <section id="quick-start" className="scroll-mt-24">
          <SectionHeading centered eyebrow="Quick start" title="Do not fill every field first — start with your real-life scenario" description="This page is more useful when the user knows which inputs matter most. Start with the scenario, then use the full builder if the tradeoff is still unclear." />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {quickStartScenarios.map((scenario) => (
              <Card key={scenario.title} className="rounded-3xl border-border/80 shadow-card">
                <CardHeader>
                  <Badge tone="blue">Scenario</Badge>
                  <CardTitle className="font-display text-xl leading-tight">{scenario.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{scenario.useWhen}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-2xl border border-primary/20 bg-primary-soft/25 p-4 text-sm leading-relaxed text-foreground">
                    <div className="mb-1 font-bold">Enter first</div>
                    {scenario.enterFirst}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <ComparisonFrameworkTool />

        <section id="verification-checklist" className="scroll-mt-24 rounded-[2rem] border border-border bg-card p-5 shadow-card md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary"><ClipboardCheck className="h-5 w-5" /></div><div className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-primary">Before enrolling</div><h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Verification checklist</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">The comparison tool can narrow the question. It cannot replace current plan documents, employer benefits portals, Marketplace plan details, or direct network/formulary verification.</p><Button type="button" variant="outline" className="mt-5" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print checklist</Button></div>
            <ol className="grid gap-3">{verificationSteps.map((step, index) => <li key={step} className="flex gap-3 rounded-2xl border border-border bg-background/60 p-4 text-sm leading-relaxed text-muted-foreground"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-extrabold text-primary">{index + 1}</span><span>{step}</span></li>)}</ol>
          </div>
        </section>

        <section>
          <SectionHeading centered eyebrow="Long-term product roadmap" title="How this can become a sponsored core offering later" description="The commercial comparison product should mature in phases so monetization does not compromise trust." />
          <div className="grid gap-4 lg:grid-cols-4">{roadmap.map(([phase, title, body]) => <Card key={phase} className="rounded-3xl border-border/80 shadow-card"><CardHeader><Badge tone="blue">{phase}</Badge><CardTitle className="font-display text-xl">{title}</CardTitle><CardDescription className="text-sm leading-relaxed">{body}</CardDescription></CardHeader></Card>)}</div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Card className="rounded-3xl border-primary/20 bg-primary-soft/30 shadow-card"><CardHeader><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-primary"><Shield className="h-5 w-5" /></div><CardTitle className="font-display text-2xl">Sponsor-safe guardrails</CardTitle><CardDescription className="text-sm leading-relaxed">A sponsor can support the page only if the comparison logic stays independent, user-entered, source-backed, and clearly separated from paid placements.</CardDescription></CardHeader><CardContent><ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">{["Paid placement should never change calculator results.", "Any sponsor module should be labeled and separated from plan comparison output.", "No plan should be called best without verified current plan data and a defined methodology.", "Commercial insurance comparisons should avoid individualized enrollment advice unless reviewed for licensing/compliance requirements."].map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /><span>{item}</span></li>)}</ul></CardContent></Card>
          <Card className="rounded-3xl border-border/80 shadow-card"><CardHeader><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary"><Building2 className="h-5 w-5" /></div><CardTitle className="font-display text-2xl">Best next content cluster</CardTitle><CardDescription className="text-sm leading-relaxed">Build short supporting pages around the framework: HMO vs PPO vs EPO, HDHP vs PPO, how to read an SBC, checking prescription coverage, and what prior authorization means before surgery or imaging.</CardDescription></CardHeader><CardContent className="flex flex-col gap-3 sm:flex-row"><Button asChild variant="hero"><Link to="/open-enrollment">Open enrollment guide</Link></Button><Button asChild variant="outline"><Link to="/insurance/prior-authorization-guide">Prior authorization guide</Link></Button></CardContent></Card>
        </section>

        <section id="sources" className="scroll-mt-24">
          <SectionHeading centered eyebrow="Sources" title="Where users should verify details" description="Use the framework to organize the decision. Use current plan documents and official sources to verify live benefits." />
          <Card className="mx-auto max-w-3xl rounded-3xl border-border/80 shadow-card"><CardContent className="p-5 md:p-6"><ol className="space-y-3 text-sm text-muted-foreground">{sourceLinks.map(([title, url]) => <li key={url} className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" /><a className="font-medium text-primary underline-offset-4 hover:underline" href={url} target="_blank" rel="noreferrer">{title} <ExternalLink className="inline h-3.5 w-3.5" /></a></li>)}</ol></CardContent></Card>
        </section>
      </main>
    </>
  );
};

export default CommercialInsuranceComparisonPage;
