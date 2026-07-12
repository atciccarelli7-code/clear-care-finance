import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCopy,
  Compass,
  FileSearch,
  HeartPulse,
  Landmark,
  Pencil,
  Printer,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SourceList } from "@/components/shared/SourceList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import type { Source } from "@/data/sources";
import {
  BENEFITS_LIMITS_2026,
  blueprintToText,
  buildBenefitsBlueprint,
  type BenefitsBlueprintAnswers,
} from "@/lib/benefitsBlueprint";
import { useSeo } from "@/lib/seo";

type DraftAnswers = Partial<Omit<BenefitsBlueprintAnswers, "age" | "targetRetirementAge">> & {
  age: string;
  targetRetirementAge: string;
};

type ChoiceOption = { value: string; label: string; helper: string };

const initialAnswers: DraftAnswers = { age: "", targetRetirementAge: "" };

const payOptions: ChoiceOption[] = [
  { value: "under-50", label: "Under $50,000", helper: "Roughly under $24 per hour at 40 hours per week." },
  { value: "50-75", label: "$50,000-$74,999", helper: "Roughly $24-$35 per hour at 40 hours per week." },
  { value: "75-100", label: "$75,000-$99,999", helper: "Roughly $36-$47 per hour at 40 hours per week." },
  { value: "100-150", label: "$100,000-$149,999", helper: "Roughly $48-$71 per hour at 40 hours per week." },
  { value: "150-plus", label: "$150,000 or more", helper: "Use this only as a broad planning range." },
  { value: "not-sure", label: "Not sure", helper: "You can still get a percentage-based blueprint." },
];

const savingOptions: ChoiceOption[] = [
  { value: "protect-paycheck", label: "Protect my paycheck", helper: "Start with a manageable election and preserve near-term cash flow." },
  { value: "balanced", label: "Balance today and retirement", helper: "Build retirement savings while keeping room for current goals." },
  { value: "accelerate", label: "Accelerate retirement savings", helper: "Prioritize a higher starting contribution if the paycheck can support it." },
  { value: "not-sure", label: "Not sure yet", helper: "Use a broad starting range and verify the paycheck impact." },
];

const riskOptions: ChoiceOption[] = [
  { value: "conservative", label: "Conservative", helper: "Large market swings would make it difficult to stay invested." },
  { value: "moderate", label: "Moderate", helper: "Some market swings are acceptable for long-term growth potential." },
  { value: "growth", label: "Growth-oriented", helper: "Large declines are acceptable if the plan stays diversified and long term." },
  { value: "not-sure", label: "Not sure", helper: "The result will focus on what to compare before choosing an investment mix." },
];

const costOptions: ChoiceOption[] = [
  { value: "lower-deductions", label: "Lower paycheck deductions", helper: "I can accept more cost when care happens if the full-year math works." },
  { value: "predictable-costs", label: "More predictable costs", helper: "I prefer fewer surprises when prescriptions, visits, or tests happen." },
  { value: "balanced", label: "A balance of both", helper: "I want to compare total annual cost and bad-year exposure." },
  { value: "not-sure", label: "Not sure", helper: "The blueprint will tell you which numbers to place side by side." },
];

const useOptions: ChoiceOption[] = [
  { value: "low", label: "Low", helper: "Mostly preventive care and few expected prescriptions or visits." },
  { value: "moderate", label: "Moderate", helper: "Several visits, tests, therapies, or prescriptions may be likely." },
  { value: "high", label: "High", helper: "Ongoing care, procedures, frequent specialists, or costly prescriptions may be likely." },
  { value: "not-sure", label: "Not sure", helper: "Use plan documents and last year's care as a reality check." },
];

const yesNoOptions: ChoiceOption[] = [
  { value: "yes", label: "Yes", helper: "This should be verified against the network, formulary, and plan rules." },
  { value: "no", label: "No", helper: "There are no regular prescriptions or specialist visits expected right now." },
  { value: "not-sure", label: "Not sure", helper: "The result will include a verification step instead of assuming." },
];

const flexibilityOptions: ChoiceOption[] = [
  { value: "essential", label: "Essential", helper: "I want broad provider choice or meaningful out-of-network benefits." },
  { value: "helpful", label: "Helpful, but negotiable", helper: "I value flexibility but will compare its cost." },
  { value: "not-important", label: "Not a major priority", helper: "I am comfortable using a defined network and care pathway." },
  { value: "not-sure", label: "Not sure", helper: "Check current doctors, hospitals, labs, and travel needs first." },
];

const hsaOptions: ChoiceOption[] = [
  { value: "yes", label: "Comfortable", helper: "I can compare higher deductible exposure and understand the HSA is not free care." },
  { value: "maybe", label: "Maybe", helper: "I want to see employer HSA money and the full annual cost first." },
  { value: "no", label: "Not comfortable", helper: "A higher deductible would make the plan difficult to use or budget for." },
  { value: "not-sure", label: "Not sure", helper: "The result will identify the HSA numbers to verify." },
];

const coverageOptions: ChoiceOption[] = [
  { value: "employee", label: "Employee only", helper: "Only the employee needs coverage through this employer." },
  { value: "employee-spouse", label: "Employee plus spouse/partner", helper: "The employee and a spouse or partner need coverage." },
  { value: "employee-children", label: "Employee plus child or children", helper: "The employee and one or more children need coverage." },
  { value: "family", label: "Family", helper: "The employee, spouse or partner, and child or children need coverage." },
  { value: "not-sure", label: "Not sure", helper: "Compare access to other coverage before choosing the tier." },
];

const matchOptions: ChoiceOption[] = [
  { value: "yes", label: "Yes", helper: "The blueprint will prioritize finding and capturing the full formula." },
  { value: "no", label: "No", helper: "The starting range will not assume free employer-match dollars." },
  { value: "not-sure", label: "Unknown", helper: "Finding the formula and vesting schedule becomes the first action." },
];

const steps = [
  "Current age",
  "Target retirement age",
  "Approximate pay range",
  "Retirement-saving priority",
  "Risk tolerance",
  "Paycheck versus cost predictability",
  "Expected healthcare use",
  "Prescriptions and specialists",
  "Provider flexibility",
  "Higher deductible and HSA comfort",
  "Coverage tier",
  "Employer retirement match",
] as const;

const sources: Source[] = [
  {
    name: "IRS",
    pageTitle: "403(b) contribution limits",
    url: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-403b-contribution-limits",
    note: `Official 2026 employee deferral limit: $${BENEFITS_LIMITS_2026.workplaceRetirementDeferral.toLocaleString()}, with separate catch-up rules for eligible participants. Reviewed July 10, 2026.`,
  },
  {
    name: "IRS",
    pageTitle: "Revenue Procedure 2025-19 — 2026 HSA limits",
    url: "https://www.irs.gov/pub/irs-drop/rp-25-19.pdf",
    note: `Official 2026 HSA limits: $${BENEFITS_LIMITS_2026.hsaSelfOnly.toLocaleString()} self-only and $${BENEFITS_LIMITS_2026.hsaFamily.toLocaleString()} family. Reviewed July 10, 2026.`,
  },
  {
    name: "HealthCare.gov",
    pageTitle: "Summary of Benefits and Coverage",
    url: "https://www.healthcare.gov/health-care-law-protections/summary-of-benefits-and-coverage/",
    note: "Official explanation of the standardized SBC used to compare job-based and individual health plans.",
  },
  {
    name: "HealthCare.gov",
    pageTitle: "Health insurance plan and network types",
    url: "https://www.healthcare.gov/choose-a-plan/plan-types/",
    note: "Official definitions for HMO, PPO, EPO, POS, and related network structures.",
  },
  {
    name: "SEC Investor.gov",
    pageTitle: "Asset allocation",
    url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/asset-allocation",
    note: "Investor education on time horizon, risk tolerance, and diversified investment mixes.",
  },
];

const relatedLinks = [
  ["403(b) Paycheck Calculator", "/tools/403b-paycheck-calculator", "Convert a contribution percentage into paycheck and annual amounts."],
  ["Open Enrollment True Cost Calculator", "/tools/open-enrollment-true-cost-calculator", "Compare actual premiums, expected care, employer money, and bad-year exposure."],
  ["Health Insurance Plan Types", "/insurance/health-insurance-plan-types", "Understand HMO, PPO, EPO, POS, and HSA-eligible structures."],
  ["How to Read an SBC", "/insurance/how-to-read-an-sbc", "Use the controlling plan summary for apples-to-apples comparisons."],
] as const;

const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

const ChoiceStep = ({
  title,
  description,
  options,
  value,
  onChange,
}: {
  title: string;
  description: string;
  options: ChoiceOption[];
  value?: string;
  onChange: (value: string) => void;
}) => (
  <fieldset className="space-y-5">
    <legend className="font-display text-2xl font-bold text-foreground md:text-3xl">{title}</legend>
    <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p>
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={`rounded-2xl border p-4 text-left transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              selected
                ? "border-primary bg-primary-soft text-foreground shadow-sm"
                : "border-border bg-background hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
            }`}
          >
            <span className="flex items-center justify-between gap-3 text-sm font-bold">
              {option.label}
              {selected && <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />}
            </span>
            <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">{option.helper}</span>
          </button>
        );
      })}
    </div>
  </fieldset>
);

const ResultList = ({ title, items }: { title: string; items: string[] }) => (
  <section className="space-y-3">
    <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-primary">{title}</h3>
    <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </section>
);

const HealthcareWorkerBenefitsBlueprintPage = () => {
  const [answers, setAnswers] = useState<DraftAnswers>(initialAnswers);
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [copied, setCopied] = useState(false);
  const focusRef = useRef<HTMLDivElement>(null);

  useSeo({
    title: "Healthcare Worker Benefits Blueprint",
    description:
      "Build a goal-first workplace benefits blueprint for retirement contributions, health-plan fit, HSA questions, coverage tier, and open enrollment.",
    canonicalPath: "/tools/healthcare-worker-benefits-blueprint",
  });

  useEffect(() => {
    focusRef.current?.focus();
  }, [showResults, step]);

  const completedAnswers = useMemo<BenefitsBlueprintAnswers | null>(() => {
    const age = Number(answers.age);
    const targetRetirementAge = Number(answers.targetRetirementAge);
    if (
      !Number.isFinite(age) ||
      !Number.isFinite(targetRetirementAge) ||
      age < 18 ||
      age > 80 ||
      targetRetirementAge <= age ||
      targetRetirementAge > 85 ||
      !answers.payRange ||
      !answers.savingPriority ||
      !answers.riskTolerance ||
      !answers.costPreference ||
      !answers.healthcareUse ||
      !answers.regularCare ||
      !answers.flexibility ||
      !answers.hsaComfort ||
      !answers.coverageTier ||
      !answers.employerMatch
    ) {
      return null;
    }
    return { ...answers, age, targetRetirementAge } as BenefitsBlueprintAnswers;
  }, [answers]);

  const blueprint = useMemo(
    () => (completedAnswers ? buildBenefitsBlueprint(completedAnswers) : null),
    [completedAnswers],
  );

  const currentStepValid = useMemo(() => {
    if (step === 0) {
      const age = Number(answers.age);
      return Number.isFinite(age) && age >= 18 && age <= 80;
    }
    if (step === 1) {
      const age = Number(answers.age);
      const target = Number(answers.targetRetirementAge);
      return Number.isFinite(target) && target > age && target <= 85;
    }
    const keys: Array<keyof DraftAnswers> = [
      "payRange",
      "savingPriority",
      "riskTolerance",
      "costPreference",
      "healthcareUse",
      "regularCare",
      "flexibility",
      "hsaComfort",
      "coverageTier",
      "employerMatch",
    ];
    return Boolean(answers[keys[step - 2]]);
  }, [answers, step]);

  const setChoice = (key: keyof DraftAnswers, value: string) => {
    setAnswers((current) => ({ ...current, [key]: value }));
  };

  const goNext = () => {
    if (!currentStepValid) return;
    if (step === steps.length - 1) {
      setShowResults(true);
      return;
    }
    setStep((current) => current + 1);
  };

  const copyResults = async () => {
    if (!blueprint) return;
    try {
      await navigator.clipboard.writeText(blueprintToText(blueprint));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const restart = () => {
    setAnswers(initialAnswers);
    setStep(0);
    setShowResults(false);
    setCopied(false);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <fieldset className="space-y-5">
            <legend className="font-display text-2xl font-bold text-foreground md:text-3xl">What is your current age?</legend>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              Age is used only to estimate the time until your target retirement. It stays in this browser session.
            </p>
            <label className="block max-w-xs space-y-2 text-sm font-bold">
              Current age
              <Input
                type="number"
                min={18}
                max={80}
                inputMode="numeric"
                value={answers.age}
                onChange={(event) => setAnswers((current) => ({ ...current, age: event.target.value }))}
                className="h-12 rounded-xl text-base"
                aria-describedby="age-help"
                autoFocus
              />
            </label>
            <p id="age-help" className="text-xs text-muted-foreground">Enter an age from 18 through 80.</p>
          </fieldset>
        );
      case 1:
        return (
          <fieldset className="space-y-5">
            <legend className="font-display text-2xl font-bold text-foreground md:text-3xl">What is your target retirement age?</legend>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              This is a planning target, not a promise. A shorter time horizon widens the suggested starting range.
            </p>
            <label className="block max-w-xs space-y-2 text-sm font-bold">
              Target retirement age
              <Input
                type="number"
                min={Math.max(19, Number(answers.age) + 1)}
                max={85}
                inputMode="numeric"
                value={answers.targetRetirementAge}
                onChange={(event) => setAnswers((current) => ({ ...current, targetRetirementAge: event.target.value }))}
                className="h-12 rounded-xl text-base"
                aria-describedby="retirement-age-help"
                autoFocus
              />
            </label>
            <p id="retirement-age-help" className="text-xs text-muted-foreground">Choose an age later than your current age and no higher than 85.</p>
          </fieldset>
        );
      case 2:
        return <ChoiceStep title="Which pay range is closest?" description="This creates a rough annual-dollar translation. The percentage range is the main result." options={payOptions} value={answers.payRange} onChange={(value) => setChoice("payRange", value)} />;
      case 3:
        return <ChoiceStep title="What is your retirement-saving priority?" description="Choose the goal that best reflects the next open-enrollment or HR-portal decision." options={savingOptions} value={answers.savingPriority} onChange={(value) => setChoice("savingPriority", value)} />;
      case 4:
        return <ChoiceStep title="How would you describe your risk tolerance?" description="This changes the characteristics to compare, not a promised return or a specific fund recommendation." options={riskOptions} value={answers.riskTolerance} onChange={(value) => setChoice("riskTolerance", value)} />;
      case 5:
        return <ChoiceStep title="Which healthcare-cost tradeoff feels more important?" description="A low premium is not the same as a low total annual cost. Choose the preference you want the blueprint to test." options={costOptions} value={answers.costPreference} onChange={(value) => setChoice("costPreference", value)} />;
      case 6:
        return <ChoiceStep title="How much healthcare use do you expect?" description="Use the coming plan year, not an ideal year. This is a broad planning category, not medical information sent anywhere." options={useOptions} value={answers.healthcareUse} onChange={(value) => setChoice("healthcareUse", value)} />;
      case 7:
        return <ChoiceStep title="Do you expect regular prescriptions or specialist visits?" description="This makes network, formulary, referral, and prior-authorization checks more important." options={yesNoOptions} value={answers.regularCare} onChange={(value) => setChoice("regularCare", value)} />;
      case 8:
        return <ChoiceStep title="How important is broad provider or out-of-network flexibility?" description="A plan name alone does not guarantee access. Always verify the actual network and rules." options={flexibilityOptions} value={answers.flexibility} onChange={(value) => setChoice("flexibility", value)} />;
      case 9:
        return <ChoiceStep title="How comfortable are you with a higher deductible and an HSA?" description="An HSA can be valuable, but the attached plan still has to fit expected care and cash flow." options={hsaOptions} value={answers.hsaComfort} onChange={(value) => setChoice("hsaComfort", value)} />;
      case 10:
        return <ChoiceStep title="Which coverage tier will you probably need?" description="This only identifies the tier to inspect. It does not compare another household member's employer coverage." options={coverageOptions} value={answers.coverageTier} onChange={(value) => setChoice("coverageTier", value)} />;
      case 11:
        return <ChoiceStep title="Do you expect an employer retirement match?" description="If the formula is unknown, finding it becomes the first action before choosing a percentage." options={matchOptions} value={answers.employerMatch} onChange={(value) => setChoice("employerMatch", value)} />;
      default:
        return null;
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Goal-first workplace benefits tool"
        title="Healthcare Worker Benefits Blueprint"
        description="Answer 12 plain-English questions before opening the HR portal. Leave with a retirement starting range, health-plan fit signals, an HSA check, and the exact numbers to find."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="hero"><a href="#blueprint">Build my blueprint</a></Button>
          <Button asChild variant="outline"><Link to="/open-enrollment">Read the open enrollment path</Link></Button>
        </div>
      </PageHero>

      <div className="container space-y-16 py-12 md:py-16">
        <section id="blueprint" className="scroll-mt-24">
          {!showResults ? (
            <Card className="mx-auto max-w-4xl rounded-3xl shadow-card">
              <CardHeader className="space-y-4 border-b border-border/70">
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <span className="font-bold text-primary">Question {step + 1} of {steps.length}</span>
                  <span className="text-muted-foreground">{steps[step]}</span>
                </div>
                <Progress value={((step + 1) / steps.length) * 100} aria-label={`Question ${step + 1} of ${steps.length}`} />
                <p className="text-xs text-muted-foreground">Your answers stay in local React state and are not transmitted or saved.</p>
              </CardHeader>
              <CardContent className="space-y-8 p-5 md:p-8">
                <div ref={focusRef} tabIndex={-1} className="outline-none">
                  {renderStep()}
                </div>
                <div className="flex flex-col-reverse gap-3 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}>
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button type="button" onClick={goNext} disabled={!currentStepValid}>
                    {step === steps.length - 1 ? "Create my blueprint" : "Next"} <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : blueprint ? (
            <div ref={focusRef} tabIndex={-1} className="mx-auto max-w-5xl space-y-6 outline-none" aria-live="polite">
              <Card className="rounded-3xl border-primary/20 shadow-card print:shadow-none">
                <CardHeader className="border-b border-border/70 bg-primary-soft/40">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-primary">
                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <CardTitle className="font-display text-3xl">Your Benefits Blueprint</CardTitle>
                  <CardDescription className="max-w-3xl text-base leading-relaxed">
                    Use this as a short list of what to compare. Actual employer plan documents and the Summary of Benefits and Coverage control.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-5 md:p-8">
                  <section className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-primary/20 bg-primary-soft p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Retirement starting range</p>
                      <p className="mt-2 font-display text-3xl font-bold">{blueprint.contributionRange.minimum}%-{blueprint.contributionRange.maximum}%</p>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        Planning range based on saving priority and time to target retirement—not individualized advice. The 2026 employee deferral cap used for your age is {formatCurrency(blueprint.applicableRetirementLimit)}.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Approximate annual range</p>
                      <p className="mt-2 font-display text-2xl font-bold">
                        {blueprint.approximateAnnualRange
                          ? `${formatCurrency(blueprint.approximateAnnualRange.minimum)}-${formatCurrency(blueprint.approximateAnnualRange.maximum)}`
                          : "Verify pay first"}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Uses the midpoint of the selected pay band. The HR portal provides the real paycheck amount.</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Coverage tier to inspect</p>
                      <p className="mt-2 font-display text-xl font-bold">{blueprint.coverageTier}</p>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Based only on who needs coverage—not price or plan quality.</p>
                    </div>
                  </section>

                  <section className="rounded-2xl border border-primary/20 bg-primary-soft/40 p-5">
                    <div className="mb-2 flex items-center gap-2 font-bold text-primary"><Landmark className="h-4 w-4" /> Match-first check</div>
                    <p className="text-sm leading-relaxed text-foreground">{blueprint.matchReminder}</p>
                  </section>

                  <ResultList title="Retirement account characteristics to compare" items={blueprint.retirementComparison} />

                  <section className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-primary">Health-plan archetypes to compare</h3>
                    <div className="grid gap-4 lg:grid-cols-3">
                      {blueprint.planArchetypes.map((plan) => (
                        <Card key={plan.id} className="rounded-2xl shadow-none">
                          <CardHeader>
                            <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">{plan.fitLabel}</p>
                            <CardTitle className="font-display text-xl">{plan.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                            <p>{plan.reason}</p>
                            <p><strong className="text-foreground">Verify:</strong> {plan.verify}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-2xl border border-border bg-muted/40 p-5">
                    <div className="mb-2 flex items-center gap-2 font-bold text-foreground"><Wallet className="h-4 w-4 text-primary" /> HSA check</div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{blueprint.hsaGuidance}</p>
                  </section>

                  <div className="grid gap-8 lg:grid-cols-2">
                    <ResultList title="Numbers to locate in the HR portal" items={blueprint.portalNumbers} />
                    <ResultList title="Five questions to ask HR" items={blueprint.hrQuestions} />
                  </div>
                  <ResultList title="What could change this blueprint?" items={blueprint.changeFactors} />

                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
                    Educational planning only. This tool does not provide financial, tax, investment, medical, or insurance advice. It does not rank insurers, employer plans, funds, or financial products. The official plan documents and SBC control.
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row print:hidden">
                    <Button type="button" onClick={copyResults}>
                      <ClipboardCopy className="h-4 w-4" /> {copied ? "Copied" : "Copy blueprint"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => window.print()}>
                      <Printer className="h-4 w-4" /> Print blueprint
                    </Button>
                    <Button type="button" variant="outline" onClick={() => { setShowResults(false); setStep(0); }}>
                      <Pencil className="h-4 w-4" /> Review answers
                    </Button>
                    <Button type="button" variant="ghost" onClick={restart}>Start over</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </section>

        <section>
          <SectionHeading
            eyebrow="How to use it"
            title="Go into the HR portal with a search list"
            description="The blueprint narrows the questions. The employer's actual contribution rules, premiums, networks, and plan documents provide the answer."
            centered
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <Card className="rounded-3xl shadow-card">
              <CardHeader>
                <Compass className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
                <CardTitle className="font-display text-xl">Start with goals</CardTitle>
                <CardDescription>Decide which tradeoffs matter before plan names, payroll deductions, and HR terminology compete for attention.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="rounded-3xl shadow-card">
              <CardHeader>
                <FileSearch className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
                <CardTitle className="font-display text-xl">Find the controlling numbers</CardTitle>
                <CardDescription>Use the SBC, retirement-plan documents, network directory, drug formulary, and employer HSA details.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="rounded-3xl shadow-card">
              <CardHeader>
                <ShieldCheck className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
                <CardTitle className="font-display text-xl">Verify before submitting</CardTitle>
                <CardDescription>Recheck the paycheck impact, match formula, coverage tier, beneficiaries, and final confirmation page.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Use next"
            title="Turn the blueprint into actual plan math"
            description="These existing pages take the next step without duplicating the questionnaire."
            centered
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {relatedLinks.map(([title, href, description]) => (
              <Link key={href} to={href} className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-smooth hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card">
                <h3 className="font-display text-lg font-bold group-hover:text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                <ArrowRight className="mt-4 h-4 w-4 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-8 rounded-[2rem] border border-border bg-card p-5 shadow-card md:p-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <HeartPulse className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="font-display text-2xl font-bold">Source-backed, but still a starting point</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The 2026 limits below are time-sensitive. Plan fit depends on the employer's actual documents, provider network, formulary, and household needs.
            </p>
          </div>
          <SourceList sources={sources} title="Official sources" />
        </section>
      </div>
    </>
  );
};

export default HealthcareWorkerBenefitsBlueprintPage;
