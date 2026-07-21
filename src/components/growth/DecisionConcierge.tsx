import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ChevronLeft, Clock3, Compass, FileCheck2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CONCIERGE_AUDIENCE_OPTIONS,
  CONCIERGE_PROBLEM_OPTIONS,
  CONCIERGE_TIMING_OPTIONS,
  getConciergeResult,
  type ConciergeAudience,
  type ConciergeProblemCategory,
  type ConciergeTiming,
} from "@/lib/decisionConcierge";
import { trackGrowthEvent, type GrowthEntrySurface } from "@/lib/growthAnalytics";
import { saveJourneyContext } from "@/lib/journeyContext";

type DecisionConciergeProps = {
  entrySurface: Extract<GrowthEntrySurface, "home" | "start_here" | "tools">;
  compact?: boolean;
};

type ConciergeCategory = "work_benefits" | "saving_retirement" | "healthcare_costs" | "coverage_help";

const CONCIERGE_CATEGORIES: Array<{
  id: ConciergeCategory;
  label: string;
  description: string;
  problems: ConciergeProblemCategory[];
}> = [
  {
    id: "work_benefits",
    label: "I need to make a work, pay, or benefits decision",
    description: "Compare a job, health plans, open-enrollment changes, or workplace benefits.",
    problems: ["workplace_benefits", "health_plans", "open_enrollment_changes", "job_total_comp"],
  },
  {
    id: "saving_retirement",
    label: "I need to decide what to do with saving, debt, or retirement",
    description: "Choose a contribution, tax treatment, or order for debt and retirement priorities.",
    problems: ["retirement_contributions", "roth_traditional", "debt_retirement"],
  },
  {
    id: "healthcare_costs",
    label: "I have a healthcare-cost, medical-bill, or discharge question",
    description: "Prepare before care, identify what to do with a bill, or organize a hospital-to-home plan.",
    problems: ["before_medical_care", "medical_bill", "help_family"],
  },
  {
    id: "coverage_help",
    label: "I need a Medicare, Medicaid, or general starting point",
    description: "Prepare for Medicare, identify an agency pathway, or build a broader action plan.",
    problems: ["prepare_medicare", "medicare_medicaid_help", "not_sure"],
  },
];

const CONCIERGE_EXPECTED_OUTCOMES: Record<ConciergeProblemCategory, string> = {
  workplace_benefits: "a complete benefits-package review and prioritized action list",
  health_plans: "a side-by-side estimate of total plan cost and financial exposure",
  open_enrollment_changes: "a list of material benefit changes and questions to resolve before the deadline",
  retirement_contributions: "a paycheck contribution and employer-match estimate",
  roth_traditional: "a clear summary of the tax-timing factors that support each contribution type",
  before_medical_care: "a prioritized call and document checklist to use before care",
  medical_bill: "the correct document-specific review route and next three actions",
  prepare_medicare: "an enrollment-preparation timeline and official verification checklist",
  medicare_medicaid_help: "the most relevant possible program pathways and the official agency handoff",
  debt_retirement: "an ordered plan for liquidity, required payments, employer match, debt, and retirement",
  job_total_comp: "a structured comparison of pay, benefits, schedule, commute, and total compensation",
  help_family: "a focused hospital, discharge, medication, equipment, follow-up, or coverage action plan",
  not_sure: "a private prioritized action plan for the decision that needs attention first",
};

export const DecisionConcierge = ({ entrySurface, compact = false }: DecisionConciergeProps) => {
  const [category, setCategory] = useState<ConciergeCategory>();
  const [problem, setProblem] = useState<ConciergeProblemCategory>();
  const [timing, setTiming] = useState<ConciergeTiming>();
  const [audience, setAudience] = useState<ConciergeAudience>();
  const [complete, setComplete] = useState(false);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    trackGrowthEvent("concierge_viewed", { entry_surface: entrySurface });
  }, [entrySurface]);

  useEffect(() => {
    if (complete) resultHeadingRef.current?.focus();
  }, [complete]);

  const startCategory = (value: ConciergeCategory) => {
    setCategory(value);
    setProblem(undefined);
    setTiming(undefined);
    setAudience(undefined);
    setComplete(false);
    trackGrowthEvent("concierge_category_selected", { entry_surface: entrySurface, problem_category: value });
    if (!startedRef.current) {
      startedRef.current = true;
      trackGrowthEvent("concierge_started", { entry_surface: entrySurface, problem_category: value });
    }
  };

  const chooseProblem = (value: ConciergeProblemCategory) => {
    setProblem(value);
    setTiming(undefined);
    setAudience(undefined);
    setComplete(false);
  };

  const finish = (next: { timing?: ConciergeTiming; audience?: ConciergeAudience }) => {
    if (next.timing) setTiming(next.timing);
    if (next.audience) setAudience(next.audience);
    setComplete(true);
    const result = getConciergeResult({ problem, timing: next.timing ?? timing, audience: next.audience ?? audience });
    trackGrowthEvent("concierge_completed", {
      entry_surface: entrySurface,
      problem_category: result.problem,
      destination_id: result.journeyId.replaceAll("-", "_"),
      completion_band: "complete",
    });
  };

  const reset = () => {
    setCategory(undefined);
    setProblem(undefined);
    setTiming(undefined);
    setAudience(undefined);
    setComplete(false);
    startedRef.current = false;
  };

  const backToCategories = () => {
    setCategory(undefined);
    setProblem(undefined);
    setTiming(undefined);
    setAudience(undefined);
    setComplete(false);
  };

  const backToProblems = () => {
    setProblem(undefined);
    setTiming(undefined);
    setAudience(undefined);
    setComplete(false);
  };

  const result = getConciergeResult({ problem, timing, audience });
  const effectiveResult = result.problem === "help_family"
    ? {
        ...result,
        label: "Hospital & Patient Guide",
        destinationPath: "/patients-families/hospital-guide",
        reason: "Choose the hospital or discharge issue once, then finish one focused plan without returning to a broad patient-resource hub.",
      }
    : result;
  const followUpOptions = problem === "not_sure" ? CONCIERGE_AUDIENCE_OPTIONS : CONCIERGE_TIMING_OPTIONS;
  const categoryProblems = CONCIERGE_CATEGORIES.find((item) => item.id === category)?.problems ?? [];
  const goalLabel = CONCIERGE_PROBLEM_OPTIONS.find((option) => option.id === effectiveResult.problem)?.label ?? "Find the right starting point";
  const expectedOutcome = CONCIERGE_EXPECTED_OUTCOMES[effectiveResult.problem];

  const openDestination = () => {
    saveJourneyContext({
      journeyId: effectiveResult.journeyId.replaceAll("-", "_"),
      source: entrySurface,
      goalId: effectiveResult.problem,
      goalLabel,
      destinationPath: effectiveResult.destinationPath,
      expectedOutcome,
    });
    trackGrowthEvent("concierge_destination_opened", {
      entry_surface: entrySurface,
      problem_category: effectiveResult.problem,
      destination_id: effectiveResult.journeyId.replaceAll("-", "_"),
    });
  };

  return (
    <section className={`rounded-xl border border-border bg-card/75 ${compact ? "p-5 md:p-6" : "p-6 md:p-8"}`} aria-labelledby={`concierge-${entrySurface}-heading`}>
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft/75 text-primary"><Compass className="h-5 w-5" aria-hidden="true" /></div>
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Decision Concierge</div>
          <h2 id={`concierge-${entrySurface}-heading`} className="mt-1 font-display text-2xl font-bold tracking-tight">Choose one question. Finish one complete experience.</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Three fixed-choice steps identify the single experience that owns your result. You will not be sent through a chain of hubs.</p>
        </div>
      </div>

      {!category && (
        <div className="mt-6">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">Step 1 of 3 · Choose the main question</div>
          <div className="mt-3 grid gap-3 md:grid-cols-2" role="group" aria-label="Choose a decision category">
            {CONCIERGE_CATEGORIES.map((option) => (
              <button key={option.id} type="button" onClick={() => startCategory(option.id)} className="min-h-24 rounded-xl border border-border bg-background px-4 py-3 text-left transition hover:border-primary/35 hover:bg-primary-soft/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <span className="block text-sm font-bold leading-snug">{option.label}</span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{option.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {category && !problem && (
        <div className="mt-6 rounded-lg border border-border bg-muted/15 p-4 md:p-5">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">Step 2 of 3 · Choose the exact decision</div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2" role="group" aria-label="Choose a specific decision">
            {CONCIERGE_PROBLEM_OPTIONS.filter((option) => categoryProblems.includes(option.id)).map((option) => (
              <button key={option.id} type="button" onClick={() => chooseProblem(option.id)} className="min-h-12 rounded-lg border border-border bg-background px-4 py-2.5 text-left text-sm font-semibold hover:border-primary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {option.label}
              </button>
            ))}
          </div>
          <button type="button" onClick={backToCategories} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"><ChevronLeft className="h-4 w-4" /> Back to main questions</button>
        </div>
      )}

      {problem && !complete && (
        <div className="mt-6 rounded-lg border border-border bg-muted/15 p-4 md:p-5">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">Step 3 of 3 · Confirm the situation</div>
          <p className="mt-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold">You started with: “{CONCIERGE_PROBLEM_OPTIONS.find((option) => option.id === problem)?.label}”</p>
          <h3 className="mt-4 font-display text-lg font-bold">{problem === "not_sure" ? "Which starting point is closest?" : "How soon do you need to act?"}</h3>
          <div className="mt-4 grid gap-2 sm:grid-cols-2" role="group" aria-label="Concierge follow-up choices">
            {followUpOptions.map((option) => (
              <button key={option.id} type="button" onClick={() => problem === "not_sure" ? finish({ audience: option.id as ConciergeAudience }) : finish({ timing: option.id as ConciergeTiming })} className="min-h-11 rounded-lg border border-border bg-background px-4 py-2.5 text-left text-sm font-semibold hover:border-primary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {option.label}
              </button>
            ))}
          </div>
          <button type="button" onClick={backToProblems} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"><ChevronLeft className="h-4 w-4" /> Back to exact decisions</button>
        </div>
      )}

      {problem && complete && (
        <div className="mt-6 space-y-5" aria-live="polite">
          <div className="rounded-lg border border-primary/25 bg-primary-soft/20 p-5 md:p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary"><CheckCircle2 className="h-4 w-4" /> Route complete · One final experience</div>
            <p className="mt-3 text-sm font-semibold text-foreground">You started with: “{goalLabel}”</p>
            <h3 ref={resultHeadingRef} tabIndex={-1} className="mt-2 font-display text-2xl font-bold outline-none">{effectiveResult.label}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{effectiveResult.reason}</p>
            <div className="mt-4 rounded-lg border border-primary/20 bg-background/90 p-4">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">What you will receive before leaving this experience</div>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-foreground">{expectedOutcome}</p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-background/80 p-4"><div className="flex items-center gap-2 text-sm font-bold"><FileCheck2 className="h-4 w-4 text-primary" /> Have available</div><ul className="mt-2 space-y-1 text-sm text-muted-foreground">{effectiveResult.haveAvailable.map((item) => <li key={item}>• {item}</li>)}</ul></div>
              <div className="rounded-lg border border-border bg-background/80 p-4"><div className="flex items-center gap-2 text-sm font-bold"><Clock3 className="h-4 w-4 text-primary" /> Expected effort</div><p className="mt-2 text-sm text-muted-foreground">{effectiveResult.effort}</p><p className="mt-2 text-xs text-muted-foreground">The next page will keep your original goal visible. No answers are placed in the URL.</p></div>
            </div>
            <div className="mt-5">
              <Button asChild variant="hero"><Link to={effectiveResult.destinationPath} onClick={openDestination}>Start and finish this experience <ArrowRight className="h-4 w-4" /></Link></Button>
            </div>
            {effectiveResult.secondaryPath && (
              <div className="mt-5 border-t border-border pt-4">
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Optional after the core result</div>
                <Link className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline" to={effectiveResult.secondaryPath}>{effectiveResult.secondaryLabel} <ArrowRight className="h-4 w-4" /></Link>
              </div>
            )}
          </div>
          <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"><RotateCcw className="h-4 w-4" /> Start over</button>
        </div>
      )}
    </section>
  );
};

export default DecisionConcierge;
