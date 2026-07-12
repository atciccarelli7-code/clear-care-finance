import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  HeartPulse,
  Home,
  Hospital,
  Info,
  Pill,
  Printer,
  ShieldCheck,
  Stethoscope,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSeo } from "@/lib/seo";

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20";

const medicare2026 = {
  partBMonthlyPremium: 202.9,
  partBDeductible: 283,
  partADeductible: 1736,
  hospitalDailyCoinsuranceDays61To90: 434,
  snfDailyCoinsuranceDays21To100: 217,
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const preciseCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

type CoveragePath = "original" | "medigap" | "advantage";
type Tone = "blue" | "green" | "amber" | "slate";

type CalculatorInputs = {
  coveragePath: CoveragePath;
  partBMonthlyPremium: number;
  outpatientApprovedAmount: number;
  hospitalBenefitPeriods: number;
  snfCoinsuranceDays: number;
  monthlyDrugPremium: number;
  annualDrugCopays: number;
  medigapMonthlyPremium: number;
  medigapUncoveredCosts: number;
  advantageMonthlyPremium: number;
  advantageExpectedMedicalCopays: number;
  advantageMaxOutOfPocket: number;
};

type HubCard = {
  eyebrow: string;
  title: string;
  body: string;
  icon: LucideIcon;
};

const defaultInputs: CalculatorInputs = {
  coveragePath: "original",
  partBMonthlyPremium: medicare2026.partBMonthlyPremium,
  outpatientApprovedAmount: 2500,
  hospitalBenefitPeriods: 0,
  snfCoinsuranceDays: 0,
  monthlyDrugPremium: 0,
  annualDrugCopays: 0,
  medigapMonthlyPremium: 0,
  medigapUncoveredCosts: 0,
  advantageMonthlyPremium: 0,
  advantageExpectedMedicalCopays: 0,
  advantageMaxOutOfPocket: 0,
};

const sourceLinks = [
  {
    title: "Medicare.gov — Medicare costs",
    url: "https://www.medicare.gov/basics/costs/medicare-costs",
  },
  {
    title: "Medicare.gov — Compare Original Medicare and Medicare Advantage",
    url: "https://www.medicare.gov/basics/get-started-with-medicare/get-more-coverage/your-coverage-options/compare-original-medicare-medicare-advantage",
  },
  {
    title: "Medicare.gov — Long-term care coverage",
    url: "https://www.medicare.gov/coverage/long-term-care",
  },
  {
    title: "Medicare.gov — Skilled nursing facility care",
    url: "https://www.medicare.gov/coverage/skilled-nursing-facility-care",
  },
  {
    title: "Medicaid.gov — Seniors and Medicare/Medicaid enrollees",
    url: "https://www.medicaid.gov/medicaid/eligibility-policy/seniors-medicare-and-medicaid-enrollees",
  },
  {
    title: "KFF — Sources of coverage among Medicare beneficiaries",
    url: "https://www.kff.org/medicare/a-snapshot-of-sources-of-coverage-among-medicare-beneficiaries/",
  },
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

const NumberField = ({
  id,
  label,
  value,
  onChange,
  help,
  min = 0,
  step = 1,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  help?: string;
  min?: number;
  step?: number;
}) => (
  <label htmlFor={id} className="block rounded-2xl border border-border bg-background/60 p-4">
    <span className="text-sm font-bold text-foreground">{label}</span>
    {help && <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{help}</span>}
    <input
      id={id}
      className={`${inputClass} mt-3`}
      type="number"
      inputMode="decimal"
      min={min}
      step={step}
      value={value}
      onChange={(event) => onChange(Number(event.target.value) || 0)}
    />
  </label>
);

const MetricCard = ({ label, value, detail }: { label: string; value: string; detail?: string }) => (
  <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
    <div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
    <div className="mt-2 font-display text-2xl font-extrabold tracking-tight text-foreground">{value}</div>
    {detail && <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</div>}
  </div>
);

const InfoCard = ({ card }: { card: HubCard }) => {
  const Icon = card.icon;

  return (
    <Card className="rounded-3xl border-border/80 shadow-card">
      <CardHeader>
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{card.eyebrow}</div>
        <CardTitle className="font-display text-xl leading-tight">{card.title}</CardTitle>
        <CardDescription className="text-sm leading-relaxed">{card.body}</CardDescription>
      </CardHeader>
    </Card>
  );
};

const CoveragePathButton = ({
  path,
  active,
  title,
  body,
  onClick,
}: {
  path: CoveragePath;
  active: boolean;
  title: string;
  body: string;
  onClick: (path: CoveragePath) => void;
}) => (
  <button
    type="button"
    onClick={() => onClick(path)}
    className={`rounded-2xl border p-4 text-left transition-smooth ${
      active ? "border-primary bg-primary-soft text-foreground shadow-sm" : "border-border bg-card text-foreground hover:border-primary/40"
    }`}
  >
    <span className="flex items-center gap-2 text-sm font-bold">
      {active && <CheckCircle2 className="h-4 w-4 text-primary" />}
      {title}
    </span>
    <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">{body}</span>
  </button>
);

const MedicareCostEstimator = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);

  const setNumber = (field: keyof CalculatorInputs, value: number) => {
    setInputs((current) => ({ ...current, [field]: Math.max(0, value) }));
  };

  const results = useMemo(() => {
    const partBAnnualPremium = inputs.partBMonthlyPremium * 12;
    const drugPremiumAnnual = inputs.monthlyDrugPremium * 12;
    const drugTotal = drugPremiumAnnual + inputs.annualDrugCopays;
    const originalPartBShare =
      inputs.outpatientApprovedAmount > 0
        ? Math.min(inputs.outpatientApprovedAmount, medicare2026.partBDeductible) +
          Math.max(0, inputs.outpatientApprovedAmount - medicare2026.partBDeductible) * 0.2
        : 0;
    const hospitalExposure = inputs.hospitalBenefitPeriods * medicare2026.partADeductible;
    const snfExposure = inputs.snfCoinsuranceDays * medicare2026.snfDailyCoinsuranceDays21To100;
    const originalEstimate = partBAnnualPremium + drugTotal + originalPartBShare + hospitalExposure + snfExposure;
    const medigapEstimate = partBAnnualPremium + drugTotal + inputs.medigapMonthlyPremium * 12 + inputs.medigapUncoveredCosts;
    const advantageMedicalExposure =
      inputs.advantageMaxOutOfPocket > 0
        ? Math.min(inputs.advantageExpectedMedicalCopays, inputs.advantageMaxOutOfPocket)
        : inputs.advantageExpectedMedicalCopays;
    const advantageEstimate = partBAnnualPremium + drugTotal + inputs.advantageMonthlyPremium * 12 + advantageMedicalExposure;

    const activeEstimate =
      inputs.coveragePath === "original" ? originalEstimate : inputs.coveragePath === "medigap" ? medigapEstimate : advantageEstimate;

    const flags = [
      inputs.coveragePath === "advantage" && inputs.advantageMaxOutOfPocket === 0
        ? "Enter the plan's medical max out-of-pocket if you know it. That number is a key bad-year risk control."
        : null,
      inputs.coveragePath === "original" && inputs.outpatientApprovedAmount > 0
        ? "Original Medicare Part B often leaves 20% coinsurance after the deductible unless other coverage applies."
        : null,
      inputs.hospitalBenefitPeriods > 0 ? "Hospital benefit periods can create meaningful exposure under Original Medicare." : null,
      inputs.snfCoinsuranceDays > 0 ? "Skilled nursing facility coinsurance can add up quickly after day 20 when Medicare coverage rules are met." : null,
      "This estimate does not include most long-term custodial care, routine dental, routine vision, hearing aids, or uncovered services.",
    ].filter(Boolean) as string[];

    return {
      activeEstimate,
      partBAnnualPremium,
      drugTotal,
      originalPartBShare,
      hospitalExposure,
      snfExposure,
      medigapAnnualPremium: inputs.medigapMonthlyPremium * 12,
      advantageAnnualPremium: inputs.advantageMonthlyPremium * 12,
      advantageMedicalExposure,
      flags,
    };
  }, [inputs]);

  return (
    <section id="cost-estimator" className="scroll-mt-24">
      <SectionHeading
        centered
        eyebrow="Interactive estimator"
        title="Medicare out-of-pocket risk estimator"
        description="Use this simplified tool to organize the major cost categories before checking official plan documents, Medicare.gov, SHIP, or a licensed counselor."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card className="rounded-3xl border-border/80 shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-2xl">1. Choose the coverage path</CardTitle>
            <CardDescription>These are educational structures, not plan recommendations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 md:grid-cols-3">
              <CoveragePathButton
                path="original"
                active={inputs.coveragePath === "original"}
                title="Original Medicare"
                body="Parts A and B, with no Medigap assumption."
                onClick={(coveragePath) => setInputs((current) => ({ ...current, coveragePath }))}
              />
              <CoveragePathButton
                path="medigap"
                active={inputs.coveragePath === "medigap"}
                title="Original + Medigap"
                body="Adds a user-entered supplemental premium and uncovered costs."
                onClick={(coveragePath) => setInputs((current) => ({ ...current, coveragePath }))}
              />
              <CoveragePathButton
                path="advantage"
                active={inputs.coveragePath === "advantage"}
                title="Medicare Advantage"
                body="Uses plan premium, expected medical copays, and max out-of-pocket if known."
                onClick={(coveragePath) => setInputs((current) => ({ ...current, coveragePath }))}
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <NumberField
                id="part-b-premium"
                label="Part B monthly premium"
                value={inputs.partBMonthlyPremium}
                step={0.1}
                help={`Loaded with the 2026 standard premium: ${preciseCurrency.format(medicare2026.partBMonthlyPremium)}.`}
                onChange={(value) => setNumber("partBMonthlyPremium", value)}
              />
              <NumberField
                id="monthly-drug-premium"
                label="Monthly Part D / drug premium"
                value={inputs.monthlyDrugPremium}
                step={0.1}
                help="Use zero if drug coverage is bundled or unknown."
                onChange={(value) => setNumber("monthlyDrugPremium", value)}
              />
              <NumberField
                id="annual-drug-copays"
                label="Estimated annual drug copays"
                value={inputs.annualDrugCopays}
                help="Add expected pharmacy copays, coinsurance, and deductible exposure."
                onChange={(value) => setNumber("annualDrugCopays", value)}
              />
              <NumberField
                id="outpatient-approved"
                label="Original Medicare outpatient approved amount"
                value={inputs.outpatientApprovedAmount}
                help="Used to estimate Part B deductible plus 20% coinsurance for Original Medicare."
                onChange={(value) => setNumber("outpatientApprovedAmount", value)}
              />
              <NumberField
                id="hospital-benefit-periods"
                label="Hospital benefit periods"
                value={inputs.hospitalBenefitPeriods}
                help={`Each one adds the 2026 Part A deductible of ${currency.format(medicare2026.partADeductible)} in this simplified estimate.`}
                onChange={(value) => setNumber("hospitalBenefitPeriods", value)}
              />
              <NumberField
                id="snf-days"
                label="SNF coinsurance days"
                value={inputs.snfCoinsuranceDays}
                help={`For covered skilled nursing facility days 21-100, loaded at ${currency.format(medicare2026.snfDailyCoinsuranceDays21To100)} per day.`}
                onChange={(value) => setNumber("snfCoinsuranceDays", value)}
              />
              <NumberField
                id="medigap-premium"
                label="Medigap monthly premium"
                value={inputs.medigapMonthlyPremium}
                step={0.1}
                help="Only used when Original Medicare + Medigap is selected."
                onChange={(value) => setNumber("medigapMonthlyPremium", value)}
              />
              <NumberField
                id="medigap-uncovered"
                label="Other uncovered annual costs with Medigap"
                value={inputs.medigapUncoveredCosts}
                help="Use this for costs your specific Medigap policy does not cover."
                onChange={(value) => setNumber("medigapUncoveredCosts", value)}
              />
              <NumberField
                id="ma-premium"
                label="Medicare Advantage monthly premium"
                value={inputs.advantageMonthlyPremium}
                step={0.1}
                help="Only used when Medicare Advantage is selected."
                onChange={(value) => setNumber("advantageMonthlyPremium", value)}
              />
              <NumberField
                id="ma-medical-copays"
                label="Expected annual Medicare Advantage medical copays"
                value={inputs.advantageExpectedMedicalCopays}
                help="Use plan details for primary, specialist, hospital, imaging, therapy, and other medical copays."
                onChange={(value) => setNumber("advantageExpectedMedicalCopays", value)}
              />
              <NumberField
                id="ma-moop"
                label="Medicare Advantage medical max out-of-pocket"
                value={inputs.advantageMaxOutOfPocket}
                help="Enter the plan's in-network or combined limit from official plan documents."
                onChange={(value) => setNumber("advantageMaxOutOfPocket", value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="rounded-3xl border-primary/20 bg-primary-soft/30 shadow-card">
            <CardHeader>
              <Badge tone="blue">Estimated annual exposure</Badge>
              <CardTitle className="font-display text-4xl tracking-tight">{currency.format(results.activeEstimate)}</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                This is a simplified educational estimate using the inputs on this page. It is not a quote, guarantee, enrollment recommendation, or benefit verification.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <MetricCard label="Part B premium" value={currency.format(results.partBAnnualPremium)} detail="Monthly premium × 12" />
              <MetricCard label="Drug total" value={currency.format(results.drugTotal)} detail="Premiums plus entered copays" />
              {inputs.coveragePath === "original" && (
                <>
                  <MetricCard label="Part B cost share" value={currency.format(results.originalPartBShare)} detail="Deductible plus estimated 20% coinsurance" />
                  <MetricCard label="Hospital/SNF exposure" value={currency.format(results.hospitalExposure + results.snfExposure)} detail="Based on entered hospital and SNF use" />
                </>
              )}
              {inputs.coveragePath === "medigap" && (
                <>
                  <MetricCard label="Medigap premium" value={currency.format(results.medigapAnnualPremium)} detail="Entered premium × 12" />
                  <MetricCard label="Other uncovered" value={currency.format(inputs.medigapUncoveredCosts)} detail="Entered out-of-pocket estimate" />
                </>
              )}
              {inputs.coveragePath === "advantage" && (
                <>
                  <MetricCard label="Plan premium" value={currency.format(results.advantageAnnualPremium)} detail="Entered premium × 12" />
                  <MetricCard label="Medical copays" value={currency.format(results.advantageMedicalExposure)} detail="Capped by entered max if provided" />
                </>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-amber-200 bg-amber-50 shadow-card">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-amber-700 shadow-sm">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <CardTitle className="font-display text-2xl text-amber-950">What the estimate should make you ask</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm leading-relaxed text-amber-950/85">
                {results.flags.map((flag) => (
                  <li key={flag} className="flex gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

const MedicareCareCostHub = () => {
  useSeo({
    title: "Medicare, Medicaid, and Long-Term Care Cost Hub",
    description:
      "A plain-English Medicare and Medicaid decision hub with a Medicare out-of-pocket risk estimator, long-term care reminders, caregiver checklist, and source-backed patient education.",
    canonicalPath: "/medicare-care-costs",
  });

  const topCards: HubCard[] = [
    {
      eyebrow: "Coverage decision",
      title: "Separate Medicare, Medicaid, Medigap, and Medicare Advantage.",
      body: "The names blur together during real family stress. This hub organizes the programs by what problem each one is supposed to solve.",
      icon: ShieldCheck,
    },
    {
      eyebrow: "Cost risk",
      title: "Estimate predictable costs and bad-year exposure.",
      body: "Premiums are only one part of the decision. Hospital stays, skilled nursing care, drugs, and uncovered services can matter more.",
      icon: Calculator,
    },
    {
      eyebrow: "RN reality check",
      title: "Plan before discharge pressure creates panic.",
      body: "Coverage details become urgent when a patient needs rehab, home health, medication approval, equipment, or long-term care planning.",
      icon: Stethoscope,
    },
  ];

  const compareCards: HubCard[] = [
    {
      eyebrow: "Medicare",
      title: "Think age or disability-based health insurance.",
      body: "Mostly for people age 65 and older, plus some younger people with disabilities or specific conditions. It is federal insurance, but it still has premiums, deductibles, coinsurance, and coverage limits.",
      icon: HeartPulse,
    },
    {
      eyebrow: "Medicaid",
      title: "Think income/resource-based assistance.",
      body: "A joint federal-state program. Rules vary by state, and it can help eligible people with premiums, cost-sharing, and some long-term care needs Medicare usually does not cover.",
      icon: Users,
    },
    {
      eyebrow: "Medicare Advantage",
      title: "Think private plan structure with network rules.",
      body: "Often advertises low premiums and extra benefits, but the practical test is doctors, hospitals, drugs, prior authorization, post-acute care, and max out-of-pocket exposure.",
      icon: WalletCards,
    },
  ];

  const checklist = [
    "List current doctors, hospitals, pharmacies, medications, and preferred rehab or home-health providers.",
    "Check whether the patient uses Original Medicare, Medigap, Part D, Medicare Advantage, Medicaid, employer retiree coverage, or another payer.",
    "Write down premiums, deductibles, coinsurance, copays, drug costs, and the annual medical max out-of-pocket if there is one.",
    "Ask whether the service is skilled care, custodial care, emergency care, routine care, or an excluded service.",
    "For hospital discharge, verify skilled nursing facility, rehab, home health, DME, oxygen, transportation, and medication authorization rules before assuming coverage.",
    "Call SHIP, Medicare.gov, the plan, state Medicaid, or the provider billing office before acting on unclear coverage details.",
  ];

  const costBars = [
    ["Part B standard premium", "$202.90/month", 100],
    ["Part A inpatient hospital deductible", "$1,736/benefit period", 71],
    ["Hospital days 61-90", "$434/day", 18],
    ["Part B annual deductible", "$283/year", 12],
    ["Skilled nursing facility days 21-100", "$217/day", 9],
  ] as const;

  return (
    <>
      <PageHero
        eyebrow="Medicare & care costs"
        title="Medicare, Medicaid, and Long-Term Care Costs Without the Sales Pitch"
        description="A decision hub for patients, caregivers, and healthcare workers who need to understand coverage structure, cost exposure, and the long-term care gap before a crisis."
      >
        <Button asChild variant="hero" size="lg">
          <a href="#cost-estimator">Estimate Medicare cost risk <ArrowRight className="h-4 w-4" /></a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/medicare-care-costs/turning-65">Turning 65 timeline</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href="#caregiver-checklist">Open caregiver checklist</a>
        </Button>
      </PageHero>

      <main className="container space-y-16 py-12 md:space-y-20 md:py-16">
        <section className="grid gap-5 md:grid-cols-3" aria-label="What this Medicare care cost hub helps with">
          {topCards.map((card) => (
            <InfoCard key={card.title} card={card} />
          ))}
        </section>

        <section className="rounded-[2rem] border border-primary/15 bg-primary-soft/25 p-5 shadow-card md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Start with the right question</div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">Most confusion comes from mixing up three different problems.</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                Families often ask one broad question: "Will Medicare cover this?" The better question is whether the need is medical insurance, low-income assistance, or long-term custodial care planning.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
              {[
                ["Medical care", "Doctor visits, hospital care, outpatient services, skilled nursing care, prescriptions, and plan rules."],
                ["Financial assistance", "Premium help, cost-sharing help, Medicaid eligibility, Extra Help, and state-specific programs."],
                ["Long-term daily care", "Bathing, dressing, meals, toileting, supervision, transportation, and custodial support over time."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-primary/15 bg-card p-4 shadow-sm">
                  <h3 className="font-display text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <SectionHeading
            centered
            eyebrow="Program map"
            title="Medicare vs. Medicaid vs. Medicare Advantage"
            description="Use these as plain-English anchors before comparing plan details or calling a payer."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {compareCards.map((card) => (
              <InfoCard key={card.title} card={card} />
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <Card className="rounded-3xl border-border/80 shadow-card">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <Hospital className="h-5 w-5" />
              </div>
              <CardTitle className="font-display text-2xl">Common 2026 Medicare costs that surprise people</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                These are not every cost someone could owe. They are the cost categories most likely to show up in Medicare conversations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {costBars.map(([label, value, width]) => (
                <div key={label}>
                  <div className="flex items-baseline justify-between gap-4 text-sm">
                    <span className="font-bold text-foreground">{label}</span>
                    <span className="font-semibold text-muted-foreground">{value}</span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${width}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-amber-200 bg-amber-50 shadow-card">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-amber-700 shadow-sm">
                <Home className="h-5 w-5" />
              </div>
              <CardTitle className="font-display text-2xl text-amber-950">The long-term care warning</CardTitle>
              <CardDescription className="text-sm leading-relaxed text-amber-950/80">
                Medicare may cover skilled nursing facility care for a limited time when strict rules are met. It usually does not pay for long-term custodial care — help with bathing, dressing, toileting, meals, supervision, or daily living over time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Ask whether the care is skilled care or custodial care.",
                "Ask what exact Medicare rule, plan rule, or Medicaid rule applies.",
                "Ask what happens when Medicare coverage ends or the authorization is denied.",
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-amber-200 bg-white/70 p-4 text-sm font-medium text-amber-950">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <MedicareCostEstimator />

        <section id="caregiver-checklist" className="scroll-mt-24 rounded-[2rem] border border-border bg-card p-5 shadow-card md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <div className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-primary">Caregiver checklist</div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Print this before a plan call, discharge meeting, or family conversation.</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                The goal is not to memorize Medicare rules. The goal is to know what to verify before a patient or family makes a financial decision under pressure.
              </p>
              <Button type="button" variant="outline" className="mt-5" onClick={() => window.print()}>
                <Printer className="h-4 w-4" /> Print checklist
              </Button>
            </div>
            <ol className="grid gap-3">
              {checklist.map((item, index) => (
                <li key={item} className="flex gap-3 rounded-2xl border border-border bg-background/60 p-4 text-sm leading-relaxed text-muted-foreground">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-extrabold text-primary">{index + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="rounded-3xl border-primary/20 bg-primary-soft/30 shadow-card">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-primary">
                <Info className="h-5 w-5" />
              </div>
              <CardTitle className="font-display text-2xl">How this page stays safe if sponsorship comes later</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Educational sponsorship can support the site only if the tool output, source notes, and editorial judgment stay independent from advertisers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                {[
                  "No insurer ranking, enrollment steering, or plan recommendation inside the calculator.",
                  "No hidden lead form before the user can see the educational content.",
                  "Any sponsor placement should be labeled, separated from the result, and governed by the disclosure policy.",
                  "Official plan documents, Medicare.gov, Medicaid agencies, SHIP, and provider offices remain the verification sources.",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/80 shadow-card">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <Pill className="h-5 w-5" />
              </div>
              <CardTitle className="font-display text-2xl">Next related offering</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                After this hub, the logical companion is a legal-safe commercial insurance comparison framework: plan type, premium, deductible, network, drug coverage, prior authorization, and worst-case exposure — without ranking insurers or implying individualized advice.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero">
                <Link to="/insurance/medicare-advantage">Compare Medicare options</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/methodology">Read methodology</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section id="sources" className="scroll-mt-24">
          <SectionHeading
            centered
            eyebrow="Sources"
            title="Where to verify the rules"
            description="Use this hub to organize questions. Use official sources and plan documents to verify live coverage."
          />
          <Card className="mx-auto max-w-3xl rounded-3xl border-border/80 shadow-card">
            <CardContent className="p-5 md:p-6">
              <ol className="space-y-3 text-sm text-muted-foreground">
                {sourceLinks.map((source) => (
                  <li key={source.url} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <a className="font-medium text-primary underline-offset-4 hover:underline" href={source.url} target="_blank" rel="noreferrer">
                      {source.title} <ExternalLink className="inline h-3.5 w-3.5" />
                    </a>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
};

export default MedicareCareCostHub;
