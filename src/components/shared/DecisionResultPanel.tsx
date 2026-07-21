import { useEffect, useRef, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { AlertTriangle, CheckCircle2, ClipboardCheck, Copy, Printer, RotateCcw } from "lucide-react";
import { NextStepCards } from "@/components/shared/NextStepCards";
import { Button } from "@/components/ui/button";
import { READINESS_JOURNEY_HANDOFFS } from "@/data/readinessJourneys";
import { getReadinessJourneyId } from "@/lib/decisionJourneyAnalytics";
import { trackJourneyEvent } from "@/lib/journeyAnalytics";
import type { DecisionResult } from "@/lib/roadmapDecisionTools";

const ResultList = ({
  title,
  items,
  emphasis = "supporting",
}: {
  title: string;
  items: string[];
  emphasis?: "primary" | "supporting";
}) => {
  if (!items.length) return null;
  return (
    <section className={emphasis === "primary" ? "border-y border-action/25 bg-action-soft/30 p-5 md:p-6" : "border-t border-border py-5"}>
      <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
      <ol className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {items.map((item, index) => (
          <li key={item} className="flex items-start gap-2.5">
            {emphasis === "primary" ? (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-action text-xs font-extrabold text-action-foreground">{index + 1}</span>
            ) : (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
            )}
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
};

const nextActionTitle = (count: number) => {
  if (count >= 3) return "Your next three actions";
  if (count === 2) return "Your next two actions";
  return "Your next action";
};

export const decisionResultToText = (result: DecisionResult, officialNote?: string) => {
  const primaryActions = result.doNow.slice(0, 3);
  return [
    "YOUR RESULT",
    result.direction,
    result.summary,
    "",
    "WHY YOU RECEIVED THIS RESULT",
    ...result.reasons.map((item) => `- ${item}`),
    "",
    nextActionTitle(primaryActions.length).toUpperCase(),
    ...primaryActions.map((item) => `- ${item}`),
    "",
    "WHAT TO VERIFY OR GATHER",
    ...result.verify.map((item) => `- ${item}`),
    "",
    "OPTIONAL LEARNING",
    ...result.learnLater.map((item) => `- ${item}`),
    "",
    "IMPORTANT LIMITS",
    ...result.cautions.map((item) => `- ${item}`),
    officialNote ? `\n${officialNote}` : "",
  ].filter(Boolean).join("\n");
};

export const DecisionResultPanel = ({
  result,
  copied,
  onCopy,
  onPrint,
  onReset,
  children,
}: {
  result: DecisionResult;
  copied: boolean;
  onCopy: () => void;
  onPrint: () => void;
  onReset: () => void;
  children?: ReactNode;
}) => {
  const location = useLocation();
  const journeyId = getReadinessJourneyId(location.pathname);
  const handoffs = journeyId ? READINESS_JOURNEY_HANDOFFS[journeyId] : [];
  const completionTrackedRef = useRef(false);
  const primaryActions = result.doNow.slice(0, 3);

  useEffect(() => {
    if (!journeyId || completionTrackedRef.current) return;
    completionTrackedRef.current = true;
    trackJourneyEvent("journey_result_reached", {
      journey_key: journeyId,
      surface: "destination",
      phase: "result",
    });
  }, [journeyId]);

  const trackResultAction = (resultAction: "copy" | "print" | "reset") => {
    if (!journeyId) return;
    if (resultAction === "copy") {
      trackJourneyEvent("journey_result_copied", { journey_key: journeyId, surface: "destination", phase: "result" });
      return;
    }
    if (resultAction === "print") {
      trackJourneyEvent("journey_result_printed", { journey_key: journeyId, surface: "destination", phase: "result" });
      return;
    }
    trackJourneyEvent("journey_restarted", { journey_key: journeyId, surface: "destination", phase: "name_question" });
  };

  return (
    <div className="space-y-5" aria-live="polite">
      <article className="overflow-hidden rounded-3xl border border-success/30 bg-card shadow-card">
        <header className="surface-success border-x-0 border-t-0 p-5 md:p-7">
          <p className="semantic-label flex items-center gap-2 text-success"><CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Your result</p>
          <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-foreground md:text-3xl">{result.direction}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">{result.summary}</p>
        </header>

        <div className="p-5 md:p-7">
          <ResultList title="Why you received this result" items={result.reasons} />
          <ResultList title={nextActionTitle(primaryActions.length)} items={primaryActions} emphasis="primary" />
          <ResultList title="What to verify or gather" items={result.verify} />

          <section className="surface-caution mt-5 rounded-2xl p-4 md:p-5">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
              <AlertTriangle className="h-5 w-5 text-caution" aria-hidden="true" /> Verify before acting
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              {result.cautions.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </section>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row print:hidden">
            <Button type="button" onClick={() => { trackResultAction("copy"); onCopy(); }}><Copy className="h-4 w-4" /> {copied ? "Plan copied" : "Copy plan"}</Button>
            <Button type="button" variant="outline" onClick={() => { trackResultAction("print"); onPrint(); }}><Printer className="h-4 w-4" /> Print or save as PDF</Button>
            <Button type="button" variant="ghost" onClick={() => { trackResultAction("reset"); onReset(); }}><RotateCcw className="h-4 w-4" /> Start over</Button>
          </div>
        </div>
      </article>

      {children}

      {result.learnLater.length > 0 && (
        <details className="group rounded-2xl border border-optional/20 bg-optional-soft p-5">
          <summary className="min-h-11 cursor-pointer list-none font-display text-lg font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
            Optional learning after the action plan
            <span className="float-right text-primary transition-transform group-open:rotate-45" aria-hidden="true">+</span>
          </summary>
          <ul className="mt-4 space-y-3 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
            {result.learnLater.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </details>
      )}

      {journeyId && handoffs.length > 0 && (
        <NextStepCards
          eyebrow="Optional next step"
          title="Continue only if this result leaves another question unresolved"
          description="These approved CAF handoffs do not receive your answers or result. The current result remains complete on this page."
          cards={handoffs}
          columns="two"
          onCardOpen={(card) => {
            const handoff = handoffs.find((item) => item.href === card.href);
            if (!handoff) return;
            trackJourneyEvent("journey_handoff_opened", {
              journey_key: journeyId,
              surface: "destination",
              phase: "handoff",
              variant: handoff.id,
            });
          }}
        />
      )}
    </div>
  );
};

export const DecisionToolIntro = ({ children }: { children: ReactNode }) => (
  <div className="surface-trust rounded-2xl p-4 text-sm leading-relaxed text-muted-foreground md:p-5">
    <div className="flex items-start gap-3">
      <ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-trust" aria-hidden="true" />
      <div>
        <div>{children}</div>
        <p className="mt-3 border-t border-trust/15 pt-3 text-xs font-semibold text-muted-foreground">
          Effective year: 2026 where dated federal figures are used. Policy and source review: July 12, 2026. Verify current official rules before acting.
        </p>
      </div>
    </div>
  </div>
);

export const SelectQuestion = ({
  id,
  label,
  helper,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  helper: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) => {
  const helperId = `${id}-helper`;
  return (
    <div className="rounded-2xl border border-border bg-background/70 p-4 md:p-5">
      <label htmlFor={id} className="block text-sm font-bold text-foreground md:text-base">{label}</label>
      <p id={helperId} className="mt-1 text-xs leading-relaxed text-muted-foreground md:text-sm">{helper}</p>
      <select
        id={id}
        value={value}
        aria-describedby={helperId}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 min-h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </div>
  );
};
