import { useEffect, useRef, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, ClipboardCopy, ExternalLink, Printer, RotateCcw, SlidersHorizontal } from "lucide-react";
import { SaveNavigatorAction } from "@/components/navigator/SaveNavigatorAction";
import { Button } from "@/components/ui/button";
import type { DecisionOutcomeView, DecisionProductDefinition } from "@/lib/decisionOutcome";

export type CommercialHandoffView = {
  partnerName: string;
  url: string;
  disclosure: string;
  onShown: () => void;
  onUsed: () => void;
};

const MetricGroup = ({ title, metrics }: DecisionOutcomeView["metricGroups"][number]) => (
  <section className="rounded-2xl border border-border bg-background/70 p-4 md:p-5" aria-label={title}>
    <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
    <dl className="mt-4 grid gap-3 sm:grid-cols-2">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className={metric.emphasis === "primary"
            ? "rounded-xl border border-action/20 bg-action-soft/35 p-3"
            : metric.emphasis === "caution"
              ? "rounded-xl border border-caution/25 bg-caution-soft/45 p-3"
              : "rounded-xl border border-border/70 bg-card p-3"}
        >
          <dt className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">{metric.label}</dt>
          <dd className="mt-1 text-xl font-extrabold tabular-nums text-foreground">{metric.value}</dd>
          {metric.detail && <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">{metric.detail}</dd>}
        </div>
      ))}
    </dl>
  </section>
);

export const DecisionOutcomePanel = <State extends string>({
  definition,
  outcome,
  sourceRoute,
  copyStatus,
  onCopy,
  onPrint,
  onEdit,
  onRestart,
  onMyPlanSaved,
  onResourceOpen,
  focusKey,
  commercialHandoff,
  children,
}: {
  definition: DecisionProductDefinition<State>;
  outcome: DecisionOutcomeView<State>;
  sourceRoute: string;
  copyStatus: "idle" | "copied" | "failed";
  onCopy: () => void;
  onPrint: () => void;
  onEdit: () => void;
  onRestart: () => void;
  onMyPlanSaved?: () => void;
  onResourceOpen?: (resourceId: string) => void;
  focusKey: number;
  commercialHandoff?: CommercialHandoffView | null;
  children?: ReactNode;
}) => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [focusKey]);

  useEffect(() => {
    commercialHandoff?.onShown();
  }, [commercialHandoff]);

  return (
    <div className="space-y-5" id={`decision-outcome-${definition.decisionIdentifier}`}>
      <p className="sr-only" role="status" aria-live="polite">
        Decision outcome ready: {outcome.stateLabel}.
      </p>

      <article className="overflow-hidden rounded-3xl border border-trust/25 bg-card shadow-card" aria-labelledby="decision-outcome-heading">
        <header className="surface-trust border-x-0 border-t-0 p-5 md:p-7">
          <p className="semantic-label flex items-center gap-2 text-trust"><CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Decision outcome</p>
          <h2 id="decision-outcome-heading" ref={headingRef} tabIndex={-1} className="mt-2 font-display text-2xl font-bold leading-tight text-foreground outline-none md:text-3xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4">
            {outcome.stateLabel}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">{outcome.interpretation}</p>
          <p className="mt-3 text-xs font-semibold text-muted-foreground">Generated {outcome.generatedAt}</p>
        </header>

        <div className="space-y-6 p-5 md:p-7">
          {outcome.assumptions.length > 0 && (
            <section className="rounded-2xl border border-border bg-muted/20 p-4 md:p-5" aria-label="Assumptions used">
              <h3 className="font-display text-lg font-bold text-foreground">Assumptions used</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">User-entered values used for this estimate. Current plan documents, statements, and final provider records control.</p>
              <dl className="mt-4 grid gap-x-5 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                {outcome.assumptions.map((assumption) => (
                  <div key={assumption.label}>
                    <dt className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">{assumption.label}</dt>
                    <dd className="mt-1 text-base font-bold tabular-nums text-foreground">{assumption.value}</dd>
                    {assumption.detail && <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">{assumption.detail}</dd>}
                  </div>
                ))}
              </dl>
            </section>
          )}

          {outcome.metricGroups.map((group) => <MetricGroup key={group.title} {...group} />)}

          <section className="rounded-2xl border border-border bg-muted/25 p-4 md:p-5" aria-labelledby="decision-reason-heading">
            <h3 id="decision-reason-heading" className="font-display text-lg font-bold text-foreground">Why this state</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{outcome.primaryReason}</p>
            <p className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">What could change it:</strong> {outcome.changingAssumption}</p>
          </section>

          <section className="rounded-2xl border border-action/25 bg-action-soft/35 p-5 md:p-6" aria-labelledby="decision-first-action-heading">
            <p className="semantic-label text-action">Prioritized first action</p>
            <h3 id="decision-first-action-heading" className="mt-2 font-display text-xl font-bold text-foreground">{outcome.firstAction}</h3>
            <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {outcome.actionSequence.map((action, index) => (
                <li key={action} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-action text-xs font-extrabold text-action-foreground">{index + 1}</span>
                  <span className="pt-1">{action}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="surface-caution rounded-2xl p-4 md:p-5" aria-labelledby="decision-caution-heading">
            <h3 id="decision-caution-heading" className="flex items-start gap-2 font-display text-lg font-bold text-foreground">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-caution" aria-hidden="true" /> Main caution
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{outcome.primaryCaution}</p>
            <details className="group mt-4 border-t border-caution/20 pt-3">
              <summary className="min-h-11 cursor-pointer list-none py-2 text-sm font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                Review other tradeoffs
                <span className="float-right text-action transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
                {outcome.additionalCautions.map((caution) => <li key={caution}>• {caution}</li>)}
              </ul>
            </details>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-border p-4 md:p-5">
              <h3 className="font-display text-lg font-bold text-foreground">Verification checklist</h3>
              <ul className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {outcome.verificationChecklist.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-trust" aria-hidden="true" />{item}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-border p-4 md:p-5">
              <h3 className="font-display text-lg font-bold text-foreground">Official and neutral resources</h3>
              <ul className="mt-3 space-y-3 text-sm">
                {[...definition.officialResources, ...definition.noncommercialAlternatives].map((resource) => (
                  <li key={resource.id}>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" onClick={() => onResourceOpen?.(resource.id)} className="inline-flex min-h-11 items-center gap-2 font-bold text-action underline decoration-action/35 underline-offset-4 hover:decoration-action">
                      {resource.label}<ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                    <p className="text-xs leading-relaxed text-muted-foreground">{resource.publisher}: {resource.purpose}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {commercialHandoff && (
            <section className="rounded-2xl border border-optional/25 bg-optional-soft p-4 print:hidden md:p-5" aria-labelledby="commercial-handoff-heading">
              <p className="semantic-label text-optional">Optional commercial path</p>
              <h3 id="commercial-handoff-heading" className="mt-2 font-display text-lg font-bold text-foreground">Compare through {commercialHandoff.partnerName}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">The independent result above is complete. The neutral resources remain available whether or not you use this link.</p>
              <p className="mt-3 rounded-xl border border-border bg-card p-3 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">Compensation disclosure:</strong> {commercialHandoff.disclosure}</p>
              <Button asChild variant="outline" className="mt-4">
                <a href={commercialHandoff.url} target="_blank" rel="sponsored nofollow noopener" onClick={commercialHandoff.onUsed}>Open partner comparison<ExternalLink className="h-4 w-4" aria-hidden="true" /></a>
              </Button>
            </section>
          )}

          <p className="border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">Important limit:</strong> {outcome.educationalLimitation}</p>

          <div className="flex flex-col gap-2 print:hidden sm:flex-row sm:flex-wrap">
            {definition.portableOutputCapabilities.copy && <Button type="button" onClick={onCopy}><ClipboardCopy className="h-4 w-4" />{copyStatus === "copied" ? "Summary copied" : copyStatus === "failed" ? "Copy unavailable" : "Copy decision summary"}</Button>}
            {definition.portableOutputCapabilities.print && <Button type="button" variant="outline" onClick={onPrint}><Printer className="h-4 w-4" />Print or save as PDF</Button>}
            <Button type="button" variant="outline" onClick={onEdit}><SlidersHorizontal className="h-4 w-4" />Edit assumptions</Button>
            {definition.portableOutputCapabilities.restart && <Button type="button" variant="ghost" onClick={onRestart}><RotateCcw className="h-4 w-4" />Restart</Button>}
          </div>
        </div>
      </article>

      {definition.myPlanSupport.enabled && definition.myPlanSupport.recommendationId && (
        <SaveNavigatorAction
          recommendationId={definition.myPlanSupport.recommendationId}
          sourceRoute={sourceRoute}
          title="Save this review in My Plan"
          description="Only the fixed follow-up action is saved. Calculator inputs, assumptions, calculated values, and this summary remain out of My Plan storage."
          onAdded={onMyPlanSaved}
        />
      )}

      {children}
    </div>
  );
};
