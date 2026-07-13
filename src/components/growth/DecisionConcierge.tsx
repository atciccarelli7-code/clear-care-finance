import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock3, Compass, FileCheck2, RotateCcw } from "lucide-react";
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

type DecisionConciergeProps = {
  entrySurface: Extract<GrowthEntrySurface, "home" | "start_here" | "tools">;
  compact?: boolean;
};

export const DecisionConcierge = ({ entrySurface, compact = false }: DecisionConciergeProps) => {
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

  const start = (value: ConciergeProblemCategory) => {
    setProblem(value);
    setTiming(undefined);
    setAudience(undefined);
    setComplete(false);
    if (!startedRef.current) {
      startedRef.current = true;
      trackGrowthEvent("concierge_started", { entry_surface: entrySurface, problem_category: value });
    }
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
    setProblem(undefined);
    setTiming(undefined);
    setAudience(undefined);
    setComplete(false);
    startedRef.current = false;
  };

  const result = getConciergeResult({ problem, timing, audience });
  const followUpOptions = problem === "not_sure" ? CONCIERGE_AUDIENCE_OPTIONS : CONCIERGE_TIMING_OPTIONS;

  return (
    <section className={`rounded-xl border border-border bg-card/75 ${compact ? "p-5 md:p-6" : "p-6 md:p-8"}`} aria-labelledby={`concierge-${entrySurface}-heading`}>
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft/75 text-primary"><Compass className="h-5 w-5" aria-hidden="true" /></div>
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">One-Minute Decision Concierge</div>
          <h2 id={`concierge-${entrySurface}-heading`} className="mt-1 font-display text-2xl font-bold tracking-tight">What are you trying to figure out?</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Choose fixed answers only. The Concierge routes you into an existing CAF journey; it does not repeat its calculations.</p>
        </div>
      </div>

      {!problem && (
        <div className={`mt-6 grid gap-2 ${compact ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3"}`} role="group" aria-label="Choose a decision category">
          {CONCIERGE_PROBLEM_OPTIONS.map((option) => (
            <button key={option.id} type="button" onClick={() => start(option.id)} className="min-h-12 rounded-lg border border-border bg-background px-4 py-3 text-left text-sm font-semibold leading-snug transition hover:border-primary/35 hover:bg-primary-soft/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {option.label}
            </button>
          ))}
        </div>
      )}

      {problem && !complete && (
        <div className="mt-6 rounded-lg border border-border bg-muted/15 p-4 md:p-5">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">One follow-up</div>
          <h3 className="mt-1 font-display text-lg font-bold">{problem === "not_sure" ? "Which starting point is closest?" : "How soon do you need to act?"}</h3>
          <div className="mt-4 grid gap-2 sm:grid-cols-2" role="group" aria-label="Concierge follow-up choices">
            {followUpOptions.map((option) => (
              <button key={option.id} type="button" onClick={() => problem === "not_sure" ? finish({ audience: option.id as ConciergeAudience }) : finish({ timing: option.id as ConciergeTiming })} className="min-h-11 rounded-lg border border-border bg-background px-4 py-2.5 text-left text-sm font-semibold hover:border-primary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {option.label}
              </button>
            ))}
          </div>
          <button type="button" onClick={reset} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"><RotateCcw className="h-4 w-4" /> Choose a different decision</button>
        </div>
      )}

      {problem && complete && (
        <div className="mt-6 space-y-5" aria-live="polite">
          <div className="rounded-lg border border-primary/25 bg-primary-soft/20 p-5 md:p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary"><CheckCircle2 className="h-4 w-4" /> Best next journey</div>
            <h3 ref={resultHeadingRef} tabIndex={-1} className="mt-2 font-display text-2xl font-bold outline-none">{result.label}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{result.reason}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-background/80 p-4"><div className="flex items-center gap-2 text-sm font-bold"><FileCheck2 className="h-4 w-4 text-primary" /> Have available</div><ul className="mt-2 space-y-1 text-sm text-muted-foreground">{result.haveAvailable.map((item) => <li key={item}>• {item}</li>)}</ul></div>
              <div className="rounded-lg border border-border bg-background/80 p-4"><div className="flex items-center gap-2 text-sm font-bold"><Clock3 className="h-4 w-4 text-primary" /> Expected effort</div><p className="mt-2 text-sm text-muted-foreground">{result.effort}</p><p className="mt-2 text-xs text-muted-foreground">{result.canSaveReceipt ? "This pathway can save an action or Receipt locally." : "This focused step does not save entered values into My Plan."}</p></div>
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button asChild variant="hero"><Link to={result.destinationPath} onClick={() => trackGrowthEvent("concierge_destination_opened", { entry_surface: entrySurface, problem_category: result.problem, destination_id: result.journeyId.replaceAll("-", "_") })}>Open this journey <ArrowRight className="h-4 w-4" /></Link></Button>
              {result.secondaryPath && <Button asChild variant="outline"><Link to={result.secondaryPath}>{result.secondaryLabel}</Link></Button>}
            </div>
          </div>
          <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"><RotateCcw className="h-4 w-4" /> Start over</button>
        </div>
      )}
    </section>
  );
};

export default DecisionConcierge;