import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  Baby,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileText,
  HeartPulse,
  Home,
  Info,
  Landmark,
  Printer,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ELIGIBILITY_LAST_REVIEWED,
  FEDERAL_ELIGIBILITY_RULES,
  OFFICIAL_ELIGIBILITY_SOURCES,
  STATE_MEDICAID_LINKS,
  type StateCode,
} from "@/data/medicareMedicaidEligibilityData";
import {
  EMPTY_ELIGIBILITY_ANSWERS,
  evaluateMedicareMedicaidEligibility,
  type EligibilityAnswers,
  type EligibilityScreeningResult,
  type IncomePeriod,
  type MedicareCondition,
  type MspApplicationUnit,
  type PathwayCard,
  type YesNoNotSure,
} from "@/lib/medicareMedicaidEligibility";
import { useSeo } from "@/lib/seo";
import { trackGrowthEvent } from "@/lib/growthAnalytics";

type StepId =
  | "state"
  | "age"
  | "medicare"
  | "ssdi"
  | "ssdi-months"
  | "condition"
  | "household"
  | "income"
  | "pregnancy"
  | "children"
  | "disability"
  | "long-term-care"
  | "dual"
  | "msp-unit"
  | "results";

type Choice<T extends string> = {
  value: T;
  label: string;
  helper?: string;
};

const YES_NO_NOT_SURE: Choice<YesNoNotSure>[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "not-sure", label: "Not sure" },
];

const MEDICARE_CONDITIONS: Choice<MedicareCondition>[] = [
  { value: "als", label: "ALS", helper: "Amyotrophic lateral sclerosis (Lou Gehrig’s disease)." },
  { value: "esrd", label: "End-stage renal disease", helper: "Permanent kidney failure requiring dialysis or a kidney transplant may apply." },
  { value: "neither", label: "Neither" },
  { value: "not-sure", label: "Not sure" },
];

const INCOME_PERIODS: Choice<IncomePeriod>[] = [
  { value: "monthly", label: "Monthly" },
  { value: "annual", label: "Annual" },
];

const MSP_UNITS: Choice<MspApplicationUnit>[] = [
  { value: "individual", label: "Individual", helper: "Use this when the state would review one person for the Medicare Savings Program." },
  { value: "married-couple", label: "Married couple", helper: "Use this when the state would apply the married-couple federal screening amount." },
  { value: "not-sure", label: "Not sure", helper: "The state will determine the correct application unit." },
];

const formatDate = (value: string) => {
  const parsed = new Date(`${value}T12:00:00`);
  return Number.isNaN(parsed.getTime())
    ? value
    : new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(parsed);
};

const needsPregnancyQuestion = (answers: EligibilityAnswers) =>
  answers.ageNotSure || answers.age === null || (answers.age >= 12 && answers.age <= 55);

const hasPossibleMedicareSignal = (answers: EligibilityAnswers) =>
  answers.alreadyMedicare === "yes" ||
  answers.alreadyMedicare === "not-sure" ||
  answers.ageNotSure ||
  (answers.age !== null && answers.age >= FEDERAL_ELIGIBILITY_RULES.medicareAge.value) ||
  answers.ssdi === "yes" ||
  answers.ssdi === "not-sure" ||
  answers.condition === "als" ||
  answers.condition === "esrd" ||
  answers.condition === "not-sure";

export const buildEligibilitySteps = (answers: EligibilityAnswers): StepId[] => {
  const steps: StepId[] = ["state", "age", "medicare", "ssdi"];
  if (answers.ssdi === "yes") steps.push("ssdi-months");
  steps.push("condition", "household", "income");
  if (needsPregnancyQuestion(answers)) steps.push("pregnancy");
  steps.push("children", "disability", "long-term-care", "dual");
  if ((answers.dualHelp === "yes" || answers.dualHelp === "not-sure") && hasPossibleMedicareSignal(answers)) {
    steps.push("msp-unit");
  }
  steps.push("results");
  return steps;
};

const isStepComplete = (step: StepId, answers: EligibilityAnswers) => {
  switch (step) {
    case "state":
      return Boolean(answers.state);
    case "age":
      return answers.ageNotSure || (answers.age !== null && answers.age >= 0 && answers.age <= 120);
    case "medicare":
      return Boolean(answers.alreadyMedicare);
    case "ssdi":
      return Boolean(answers.ssdi);
    case "ssdi-months":
      return answers.ssdiMonthsNotSure || (answers.ssdiMonths !== null && answers.ssdiMonths >= 0 && answers.ssdiMonths <= 1200);
    case "condition":
      return Boolean(answers.condition);
    case "household":
      return answers.householdSizeNotSure || (answers.householdSize !== null && answers.householdSize >= 1 && answers.householdSize <= 30);
    case "income":
      return answers.incomeNotSure || (answers.income !== null && answers.income >= 0 && Boolean(answers.incomePeriod));
    case "pregnancy":
      return Boolean(answers.pregnancy);
    case "children":
      return Boolean(answers.childrenInHousehold);
    case "disability":
      return Boolean(answers.disability);
    case "long-term-care":
      return Boolean(answers.longTermCare);
    case "dual":
      return Boolean(answers.dualHelp);
    case "msp-unit":
      return Boolean(answers.mspApplicationUnit);
    case "results":
      return true;
  }
};

const stepTitles: Record<StepId, string> = {
  state: "What state does the person live in?",
  age: "How old is the person?",
  medicare: "Is the person already enrolled in Medicare?",
  ssdi: "Has the person received Social Security Disability Insurance (SSDI)?",
  "ssdi-months": "For about how many months has SSDI entitlement counted?",
  condition: "Could ALS or end-stage renal disease apply?",
  household: "How many people are in the household?",
  income: "What is the household’s approximate income?",
  pregnancy: "Could pregnancy-related coverage apply?",
  children: "Are children included in the household?",
  disability: "Does the person have a disability that may affect Medicaid eligibility?",
  "long-term-care": "Does the person need nursing-home or long-term-care assistance?",
  dual: "Should the result check for help available to someone with Medicare and limited income or resources?",
  "msp-unit": "Which Medicare Savings Program application unit is closest?",
  results: "Possible paths to verify",
};

const questionHelp: Partial<Record<StepId, string>> = {
  state: "Medicaid rules and application systems are state-specific.",
  age: "Age can identify an age-based Medicare path and age-related Medicaid categories.",
  medicare: "Current Medicare enrollment can create Medicare Savings Program and dual-eligibility paths.",
  ssdi: "Medicare based on disability generally uses SSDI entitlement timing, not disability status alone.",
  "ssdi-months": "Use the month count from Social Security if available. Mark Not sure rather than guessing.",
  condition: "ALS and ESRD use Medicare pathways that differ from the ordinary age or SSDI timing rules.",
  household: "The state decides whose income and household relationship count for each program category.",
  income: "Enter a rough gross amount before taxes. The state may count income differently, so this is not a final eligibility calculation.",
  pregnancy: "Pregnancy-related Medicaid can use a separate category and income standard.",
  children: "Children may have Medicaid or CHIP pathways even when an adult does not.",
  disability: "Disability-related Medicaid can use different financial and non-financial rules.",
  "long-term-care": "Long-term-care Medicaid is separate from ordinary health-coverage Medicaid and may involve medical-need, income, asset, transfer, and spousal rules.",
  dual: "This includes full Medicaid and Medicare Savings Programs such as QMB, SLMB, and QI. The state makes the official determination.",
  "msp-unit": "This only selects the federal screening amount shown in the result. The state decides the correct unit and applies its own counting rules.",
};

const MedicareMedicaidEligibilityCheckPage = () => {
  const [answers, setAnswers] = useState<EligibilityAnswers>({ ...EMPTY_ELIGIBILITY_ANSWERS });
  const [stepIndex, setStepIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const startedRef = useRef(false);
  const steps = useMemo(() => buildEligibilitySteps(answers), [answers]);
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)];
  const result = useMemo(() => evaluateMedicareMedicaidEligibility(answers), [answers]);
  const questionCount = steps.length - 1;
  const currentQuestionNumber = currentStep === "results" ? questionCount : stepIndex + 1;
  const progressValue = currentStep === "results" ? 100 : Math.round((currentQuestionNumber / questionCount) * 100);

  useSeo({
    title: "Medicare and Medicaid Eligibility Check",
    description:
      "Answer plain-English questions to identify Medicare, Medicaid, Medicare Savings Program, dual-eligibility, and long-term-care paths worth verifying with official agencies.",
    canonicalPath: "/tools/medicare-medicaid-eligibility-check",
  });

  useEffect(() => {
    if (stepIndex > steps.length - 1) setStepIndex(steps.length - 1);
  }, [stepIndex, steps.length]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [currentStep]);

  const updateAnswer = <K extends keyof EligibilityAnswers>(key: K, value: EligibilityAnswers[K]) => {
    setAnswers((previous) => ({ ...previous, [key]: value }));
  };

  const startOver = () => {
    if (currentStep === "results") {
      trackGrowthEvent("flagship_tool_result_action", { tool_id: "medicare_medicaid_eligibility", result_action: "restart" });
    }
    setAnswers({ ...EMPTY_ELIGIBILITY_ANSWERS });
    setStepIndex(0);
    setCopied(false);
    startedRef.current = false;
  };

  const resultText = useMemo(() => buildCopyText(result), [result]);

  const copyResults = async () => {
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      trackGrowthEvent("flagship_tool_result_action", { tool_id: "medicare_medicaid_eligibility", result_action: "copy" });
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const goNext = () => {
    if (!isStepComplete(currentStep, answers) || currentStep === "results") return;
    if (!startedRef.current) {
      startedRef.current = true;
      trackGrowthEvent("flagship_tool_started", { tool_id: "medicare_medicaid_eligibility" });
      trackGrowthEvent("coverage_check_started", { entry_surface: "medicare", action_id: "eligibility_questions" });
    }
    trackGrowthEvent("flagship_tool_step_completed", {
      tool_id: "medicare_medicaid_eligibility",
      step_id: currentStep.replaceAll("-", "_"),
    });
    const nextIndex = Math.min(steps.length - 1, stepIndex + 1);
    if (steps[nextIndex] === "results") {
      trackGrowthEvent("flagship_tool_completed", { tool_id: "medicare_medicaid_eligibility" });
      trackGrowthEvent("coverage_check_completed", { entry_surface: "medicare", action_id: "starting_points" });
    }
    setStepIndex(nextIndex);
  };

  const printResults = () => {
    trackGrowthEvent("flagship_tool_result_action", { tool_id: "medicare_medicaid_eligibility", result_action: "print" });
    window.print();
  };

  const trackHandoff = (actionId: string) => {
    trackGrowthEvent("flagship_tool_handoff_opened", {
      tool_id: "medicare_medicaid_eligibility",
      action_id: actionId,
    });
    if (actionId === "official_resource") {
      trackGrowthEvent("official_program_resource_opened", { entry_surface: "medicare", action_id: "official_resource" });
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Educational eligibility screener"
        title="Medicare and Medicaid Eligibility Check"
        description="Answer a few simple questions to identify possible Medicare, Medicaid, Medicare Savings Program, dual-eligibility, and long-term-care paths—then verify or apply with the official agency."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="hero"><a href="#eligibility-check">Start eligibility check</a></Button>
          <Button asChild variant="outline"><Link to="/articles/medicare-vs-medicaid-what-is-the-difference">Compare Medicare and Medicaid</Link></Button>
        </div>
      </PageHero>

      <div className="container space-y-14 py-10 md:py-16">
        <section className="grid gap-4 md:grid-cols-3" aria-label="Important limitations">
          <SafetyNote icon={<ShieldCheck className="h-5 w-5" />} title="Not an official determination">
            This tool identifies paths worth checking. Medicare, Social Security, and the state Medicaid agency decide eligibility.
          </SafetyNote>
          <SafetyNote icon={<Info className="h-5 w-5" />} title="Rules change">
            Numeric federal rules shown here are dated and sourced. State rules can change at any time. Last reviewed {formatDate(ELIGIBILITY_LAST_REVIEWED)}.
          </SafetyNote>
          <SafetyNote icon={<FileText className="h-5 w-5" />} title="Answers stay on this device">
            Answers remain in local React state. This page does not submit or store age, income, disability, pregnancy, household, or care information.
          </SafetyNote>
        </section>

        <section id="eligibility-check" className="scroll-mt-24">
          <Card className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] shadow-card print:shadow-none">
            <CardHeader className="border-b border-border bg-muted/30 p-5 md:p-8 print:hidden">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                    {currentStep === "results" ? "Screen complete" : `Question ${currentQuestionNumber} of ${questionCount}`}
                  </div>
                  <CardDescription className="mt-1">Choose the closest answer. Use Not sure rather than guessing.</CardDescription>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={startOver}>
                  <RotateCcw className="h-4 w-4" /> Start over
                </Button>
              </div>
              <div className="mt-4" role="progressbar" aria-label="Eligibility check progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressValue}>
                <div className="h-2 overflow-hidden rounded-full bg-border">
                  <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progressValue}%` }} />
                </div>
                <span className="sr-only">{progressValue}% complete</span>
              </div>
            </CardHeader>

            <CardContent className="p-5 md:p-8">
              <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold tracking-tight outline-none md:text-3xl">
                {stepTitles[currentStep]}
              </h2>
              {questionHelp[currentStep] && <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">{questionHelp[currentStep]}</p>}

              <div className="mt-7">
                <StepContent step={currentStep} answers={answers} updateAnswer={updateAnswer} result={result} onCopy={copyResults} onPrint={printResults} onHandoff={trackHandoff} copied={copied} />
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between print:hidden">
                <Button type="button" variant="outline" onClick={() => setStepIndex((value) => Math.max(0, value - 1))} disabled={stepIndex === 0}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                {currentStep !== "results" ? (
                  <Button
                    type="button"
                    onClick={goNext}
                    disabled={!isStepComplete(currentStep, answers)}
                  >
                    {stepIndex === steps.length - 2 ? "See possible paths" : "Continue"} <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="button" variant="soft" onClick={startOver}><RotateCcw className="h-4 w-4" /> Run another check</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="how-it-works-title" className="space-y-7">
          <SectionHeading
            eyebrow="How the screen works"
            title="Four different questions—not one universal cutoff"
            description="Medicare, ordinary Medicaid, long-term-care Medicaid, and Medicare cost assistance use different legal pathways. This tool keeps them separate."
            centered
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <ArticleCard icon={<HeartPulse className="h-6 w-6" />} title="Medicare paths">
              Age 65 is one path, but disability benefit entitlement, ALS, and end-stage renal disease can create separate paths before 65.
            </ArticleCard>
            <ArticleCard icon={<Landmark className="h-6 w-6" />} title="Medicaid categories">
              States assess categories such as adults, pregnancy, children, disability, older adults, and medically needy pathways under different rules.
            </ArticleCard>
            <ArticleCard icon={<Home className="h-6 w-6" />} title="Long-term-care Medicaid">
              Nursing-home and long-term services screening can involve functional need, income, assets, transfers, and spousal protections—not just ordinary coverage income.
            </ArticleCard>
            <ArticleCard icon={<CheckCircle2 className="h-6 w-6" />} title="Dual and cost help">
              A person with Medicare may also qualify for full Medicaid or a Medicare Savings Program that helps with Medicare costs.
            </ArticleCard>
          </div>
        </section>

        <section className="rounded-[2rem] border border-border bg-card p-5 shadow-card md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Federal numbers used</div>
              <h2 className="mt-2 font-display text-2xl font-bold">Dated rules are centralized and visible</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                The screen uses age 65 and the 24-month SSDI Medicare timing rule as federal routing signals. For Medicare Savings Programs, it can compare entered income with 2026 federal QMB, SLMB, and QI screening amounts. A state may use more generous rules or count income and resources differently.
              </p>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                  <thead><tr className="border-b border-border"><th className="p-3">2026 federal MSP screen</th><th className="p-3">Individual monthly income</th><th className="p-3">Married-couple monthly income</th></tr></thead>
                  <tbody>
                    <tr className="border-b border-border"><td className="p-3 font-semibold">QMB</td><td className="p-3">$1,350</td><td className="p-3">$1,824</td></tr>
                    <tr className="border-b border-border"><td className="p-3 font-semibold">SLMB</td><td className="p-3">$1,616</td><td className="p-3">$2,184</td></tr>
                    <tr><td className="p-3 font-semibold">QI</td><td className="p-3">$1,816</td><td className="p-3">$2,455</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-100">
              <h3 className="font-display text-xl font-bold">Why the result stays qualified</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed">
                <li>• Medicaid categories can use different household, income, resource, and medical-need rules.</li>
                <li>• The state may disregard some income or use limits above the federal amount.</li>
                <li>• Medicare eligibility and premium-free Part A are not the same determination.</li>
                <li>• Long-term-care Medicaid should not be reduced to a health-coverage income screen.</li>
              </ul>
            </div>
          </div>
        </section>

        <section aria-label="Related guidance">
          <SectionHeading
            eyebrow="Read next"
            title="Use the result with the right guide"
            description="These pages explain the coverage and care-planning distinctions that commonly change the next step."
            centered
          />
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <RelatedLink href="/articles/medicare-vs-medicaid-what-is-the-difference" title="Medicare vs. Medicaid" description="Understand why the programs overlap but use different eligibility and coverage rules." onOpen={() => trackHandoff("medicare_vs_medicaid")} />
            <RelatedLink href="/medicare-care-costs" title="Medicare, Medicaid & long-term care" description="Review coverage gaps, cost exposure, skilled care, and custodial care planning." onOpen={() => trackHandoff("medicare_medicaid_hub")} />
            <RelatedLink href="/guides/hospital-discharge-medicare" title="Hospital discharge and long-term care guide" description="Prepare for rehab, home health, equipment, Medicaid, and post-hospital care decisions." onOpen={() => trackHandoff("hospital_discharge_guide")} />
          </div>
        </section>

        <section aria-labelledby="sources-title" className="rounded-[2rem] border border-border bg-card p-5 shadow-card md:p-8">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h2 id="sources-title" className="font-display text-2xl font-bold">Primary sources and review dates</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Eligibility logic uses only Medicare.gov, SSA.gov, Medicaid.gov, CMS/HHS, and official state agencies.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {Object.values(OFFICIAL_ELIGIBILITY_SOURCES).map((source) => (
              <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-border bg-background/70 p-4 transition-smooth hover:border-primary/40 hover:shadow-sm">
                <span className="flex items-start justify-between gap-3 text-sm font-bold text-foreground">{source.title}<ExternalLink className="h-4 w-4 shrink-0 text-primary" /></span>
                <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">Effective: {source.effectiveDate} · Last reviewed: {formatDate(source.lastReviewed)}</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

const StepContent = ({
  step,
  answers,
  updateAnswer,
  result,
  onCopy,
  onPrint,
  onHandoff,
  copied,
}: {
  step: StepId;
  answers: EligibilityAnswers;
  updateAnswer: <K extends keyof EligibilityAnswers>(key: K, value: EligibilityAnswers[K]) => void;
  result: EligibilityScreeningResult;
  onCopy: () => void;
  onPrint: () => void;
  onHandoff: (actionId: string) => void;
  copied: boolean;
}) => {
  switch (step) {
    case "state":
      return (
        <label className="block max-w-xl space-y-2">
          <span className="text-sm font-bold">State of residence</span>
          <select
            value={answers.state}
            onChange={(event) => updateAnswer("state", event.target.value as StateCode)}
            className="h-12 w-full rounded-xl border border-border bg-background px-4 text-base text-foreground shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Choose a state</option>
            {STATE_MEDICAID_LINKS.map((state) => <option key={state.code} value={state.code}>{state.name}</option>)}
          </select>
        </label>
      );
    case "age":
      return (
        <NumberOrNotSure
          id="age"
          label="Age in years"
          value={answers.age}
          notSure={answers.ageNotSure}
          min={0}
          max={120}
          onValue={(value) => { updateAnswer("age", value); updateAnswer("ageNotSure", false); }}
          onNotSure={(checked) => { updateAnswer("ageNotSure", checked); if (checked) updateAnswer("age", null); }}
        />
      );
    case "medicare":
      return <ChoiceGroup name="medicare" choices={YES_NO_NOT_SURE} value={answers.alreadyMedicare} onChange={(value) => updateAnswer("alreadyMedicare", value)} />;
    case "ssdi":
      return <ChoiceGroup name="ssdi" choices={YES_NO_NOT_SURE} value={answers.ssdi} onChange={(value) => updateAnswer("ssdi", value)} />;
    case "ssdi-months":
      return (
        <NumberOrNotSure
          id="ssdi-months"
          label="Approximate months of SSDI entitlement"
          value={answers.ssdiMonths}
          notSure={answers.ssdiMonthsNotSure}
          min={0}
          max={1200}
          onValue={(value) => { updateAnswer("ssdiMonths", value); updateAnswer("ssdiMonthsNotSure", false); }}
          onNotSure={(checked) => { updateAnswer("ssdiMonthsNotSure", checked); if (checked) updateAnswer("ssdiMonths", null); }}
        />
      );
    case "condition":
      return <ChoiceGroup name="condition" choices={MEDICARE_CONDITIONS} value={answers.condition} onChange={(value) => updateAnswer("condition", value)} />;
    case "household":
      return (
        <NumberOrNotSure
          id="household"
          label="Household size"
          value={answers.householdSize}
          notSure={answers.householdSizeNotSure}
          min={1}
          max={30}
          onValue={(value) => { updateAnswer("householdSize", value); updateAnswer("householdSizeNotSure", false); }}
          onNotSure={(checked) => { updateAnswer("householdSizeNotSure", checked); if (checked) updateAnswer("householdSize", null); }}
        />
      );
    case "income":
      return (
        <div className="max-w-2xl space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-bold">Approximate gross household income</span>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true">$</span>
              <input
                id="income"
                type="number"
                inputMode="decimal"
                min={0}
                value={answers.income ?? ""}
                disabled={answers.incomeNotSure}
                onChange={(event) => { updateAnswer("income", event.target.value === "" ? null : Number(event.target.value)); updateAnswer("incomeNotSure", false); }}
                className="h-12 w-full rounded-xl border border-border bg-background pl-8 pr-4 text-base text-foreground shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
            </div>
          </label>
          <fieldset disabled={answers.incomeNotSure}>
            <legend className="mb-2 text-sm font-bold">Income period</legend>
            <ChoiceGroup name="income-period" choices={INCOME_PERIODS} value={answers.incomePeriod} onChange={(value) => updateAnswer("incomePeriod", value)} compact />
          </fieldset>
          <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={answers.incomeNotSure}
              onChange={(event) => { updateAnswer("incomeNotSure", event.target.checked); if (event.target.checked) { updateAnswer("income", null); updateAnswer("incomePeriod", ""); } }}
              className="h-4 w-4 accent-primary"
            />
            Not sure
          </label>
        </div>
      );
    case "pregnancy":
      return <ChoiceGroup name="pregnancy" choices={YES_NO_NOT_SURE} value={answers.pregnancy} onChange={(value) => updateAnswer("pregnancy", value)} />;
    case "children":
      return <ChoiceGroup name="children" choices={YES_NO_NOT_SURE} value={answers.childrenInHousehold} onChange={(value) => updateAnswer("childrenInHousehold", value)} />;
    case "disability":
      return <ChoiceGroup name="disability" choices={YES_NO_NOT_SURE} value={answers.disability} onChange={(value) => updateAnswer("disability", value)} />;
    case "long-term-care":
      return <ChoiceGroup name="long-term-care" choices={YES_NO_NOT_SURE} value={answers.longTermCare} onChange={(value) => updateAnswer("longTermCare", value)} />;
    case "dual":
      return <ChoiceGroup name="dual" choices={YES_NO_NOT_SURE} value={answers.dualHelp} onChange={(value) => updateAnswer("dualHelp", value)} />;
    case "msp-unit":
      return <ChoiceGroup name="msp-unit" choices={MSP_UNITS} value={answers.mspApplicationUnit} onChange={(value) => updateAnswer("mspApplicationUnit", value)} />;
    case "results":
      return <Results result={result} onCopy={onCopy} onPrint={onPrint} onHandoff={onHandoff} copied={copied} />;
  }
};

const ChoiceGroup = <T extends string>({
  name,
  choices,
  value,
  onChange,
  compact = false,
}: {
  name: string;
  choices: Choice<T>[];
  value: T | "";
  onChange: (value: T) => void;
  compact?: boolean;
}) => (
  <fieldset>
    <legend className="sr-only">Choose one answer</legend>
    <div className={compact ? "grid gap-3 sm:grid-cols-2" : "grid gap-3 sm:grid-cols-2"}>
      {choices.map((choice) => {
        const selected = value === choice.value;
        return (
          <label
            key={choice.value}
            className={`cursor-pointer rounded-2xl border p-4 transition-smooth ${selected ? "border-primary bg-primary-soft shadow-sm" : "border-border bg-background hover:border-primary/40 hover:bg-muted/30"}`}
          >
            <span className="flex items-start gap-3">
              <input
                type="radio"
                name={name}
                value={choice.value}
                checked={selected}
                onChange={() => onChange(choice.value)}
                className="mt-1 h-4 w-4 shrink-0 accent-primary"
              />
              <span>
                <span className="block text-sm font-bold text-foreground">{choice.label}</span>
                {choice.helper && <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{choice.helper}</span>}
              </span>
            </span>
          </label>
        );
      })}
    </div>
  </fieldset>
);

const NumberOrNotSure = ({
  id,
  label,
  value,
  notSure,
  min,
  max,
  onValue,
  onNotSure,
}: {
  id: string;
  label: string;
  value: number | null;
  notSure: boolean;
  min: number;
  max: number;
  onValue: (value: number | null) => void;
  onNotSure: (checked: boolean) => void;
}) => (
  <div className="max-w-xl space-y-4">
    <label htmlFor={id} className="block space-y-2">
      <span className="text-sm font-bold">{label}</span>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value ?? ""}
        disabled={notSure}
        onChange={(event) => onValue(event.target.value === "" ? null : Number(event.target.value))}
        className="h-12 w-full rounded-xl border border-border bg-background px-4 text-base text-foreground shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
      />
    </label>
    <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-semibold">
      <input type="checkbox" checked={notSure} onChange={(event) => onNotSure(event.target.checked)} className="h-4 w-4 accent-primary" />
      Not sure
    </label>
  </div>
);

const Results = ({ result, onCopy, onPrint, onHandoff, copied }: { result: EligibilityScreeningResult; onCopy: () => void; onPrint: () => void; onHandoff: (actionId: string) => void; copied: boolean }) => (
  <div className="space-y-7" aria-live="polite">
    <div className="rounded-2xl border border-primary/20 bg-primary-soft p-4 text-sm leading-relaxed text-foreground">
      <strong>Educational screening only.</strong> These are possible pathways to investigate—not an approval, denial, or official eligibility determination.
    </div>

    {result.medicare.length > 0 && <ResultSection icon={<HeartPulse className="h-5 w-5" />} title="Medicare pathway" cards={result.medicare} />}
    {result.medicaid.length > 0 && <ResultSection icon={<Landmark className="h-5 w-5" />} title="Medicaid pathway" cards={result.medicaid} />}
    {result.dual.length > 0 && <ResultSection icon={<CheckCircle2 className="h-5 w-5" />} title="Dual eligibility or Medicare Savings Program" cards={result.dual} />}

    <ResultList title="What could change this result?" items={result.whatCouldChange} />
    <ResultList title="Documents to gather" items={result.documents} />
    <ResultList title="Official next steps" items={result.nextSteps} />

    <section className="space-y-3">
      <h3 className="font-display text-xl font-bold">Official links</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {result.officialLinks.map((link) => (
          <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" onClick={() => onHandoff("official_resource")} className="rounded-2xl border border-border p-4 transition-smooth hover:border-primary/40 hover:shadow-sm">
            <span className="flex items-center justify-between gap-3 text-sm font-bold text-foreground">{link.label}<ExternalLink className="h-4 w-4 shrink-0 text-primary" /></span>
            <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">{link.description}</span>
          </a>
        ))}
      </div>
    </section>

    <section className="space-y-3">
      <h3 className="font-display text-xl font-bold">Sources used for this result</h3>
      <ul className="space-y-2 text-sm">
        {result.sources.map((source) => (
          <li key={source.id}>
            <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline-offset-4 hover:underline">{source.title}</a>
            <span className="block text-xs text-muted-foreground">Effective: {source.effectiveDate} · Last reviewed: {formatDate(source.lastReviewed)}</span>
          </li>
        ))}
      </ul>
    </section>

    <div className="flex flex-col gap-3 sm:flex-row print:hidden">
      <Button type="button" onClick={onCopy}><Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy results"}</Button>
      <Button type="button" variant="outline" onClick={onPrint}><Printer className="h-4 w-4" /> Print results</Button>
    </div>
  </div>
);

const ResultSection = ({ icon, title, cards }: { icon: ReactNode; title: string; cards: PathwayCard[] }) => (
  <section className="space-y-4">
    <h3 className="flex items-center gap-2 font-display text-xl font-bold">{icon}{title}</h3>
    <div className="space-y-4">
      {cards.map((card) => (
        <article key={card.id} className={`rounded-2xl border p-5 ${card.emphasis === "long-term-care" ? "border-violet-200 bg-violet-50/70 dark:border-violet-900/50 dark:bg-violet-950/20" : card.emphasis === "caution" ? "border-amber-200 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/20" : "border-border bg-background"}`}>
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{card.label}</div>
          <h4 className="mt-2 font-display text-lg font-bold">{card.title}</h4>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <ResultMiniList title="Why it appeared" items={card.why} />
            <ResultMiniList title="What to verify" items={card.verify} />
          </div>
        </article>
      ))}
    </div>
  </section>
);

const ResultMiniList = ({ title, items }: { title: string; items: string[] }) => (
  <div>
    <h5 className="text-sm font-bold">{title}</h5>
    <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
      {items.map((item) => <li key={item} className="flex gap-2"><span aria-hidden="true">•</span><span>{item}</span></li>)}
    </ul>
  </div>
);

const ResultList = ({ title, items }: { title: string; items: string[] }) => (
  <section className="rounded-2xl border border-border bg-background p-5">
    <h3 className="font-display text-xl font-bold">{title}</h3>
    <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
      {items.map((item) => <li key={item} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" /><span>{item}</span></li>)}
    </ul>
  </section>
);

const SafetyNote = ({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) => (
  <Card className="rounded-3xl shadow-sm">
    <CardHeader className="p-5">
      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">{icon}</div>
      <CardTitle className="font-display text-lg">{title}</CardTitle>
      <CardDescription className="leading-relaxed">{children}</CardDescription>
    </CardHeader>
  </Card>
);

const ArticleCard = ({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) => (
  <Card className="rounded-3xl shadow-card">
    <CardHeader>
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">{icon}</div>
      <CardTitle className="font-display text-xl">{title}</CardTitle>
      <CardDescription className="leading-relaxed">{children}</CardDescription>
    </CardHeader>
  </Card>
);

const RelatedLink = ({ href, title, description, onOpen }: { href: string; title: string; description: string; onOpen: () => void }) => (
  <Link to={href} onClick={onOpen} className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-smooth hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card">
    <h3 className="font-display text-lg font-bold">{title}</h3>
    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">Open guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
  </Link>
);

const buildCopyText = (result: EligibilityScreeningResult) => {
  const pathwayLines = (heading: string, cards: PathwayCard[]) => cards.length === 0 ? [] : [
    heading,
    ...cards.flatMap((card) => [
      `${card.label}: ${card.title}`,
      ...card.why.map((item) => `- Why: ${item}`),
      ...card.verify.map((item) => `- Verify: ${item}`),
    ]),
    "",
  ];

  return [
    "Medicare and Medicaid Eligibility Check",
    "Educational screening only. Official agencies determine eligibility.",
    "",
    ...pathwayLines("Medicare pathway", result.medicare),
    ...pathwayLines("Medicaid pathway", result.medicaid),
    ...pathwayLines("Dual eligibility or Medicare Savings Program", result.dual),
    "What could change this result?",
    ...result.whatCouldChange.map((item) => `- ${item}`),
    "",
    "Documents to gather",
    ...result.documents.map((item) => `- ${item}`),
    "",
    "Official next steps",
    ...result.nextSteps.map((item) => `- ${item}`),
    "",
    "Official links",
    ...result.officialLinks.map((link) => `- ${link.label}: ${link.url}`),
    "",
    `Rules last reviewed: ${formatDate(ELIGIBILITY_LAST_REVIEWED)}`,
  ].join("\n");
};

export default MedicareMedicaidEligibilityCheckPage;
