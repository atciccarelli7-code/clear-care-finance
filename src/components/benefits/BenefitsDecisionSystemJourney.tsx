import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  FileText,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import {
  benefitsDecisionDocuments,
  benefitsDecisionJourneySteps,
  benefitsDecisionSituationItems,
  benefitsDecisionSystemBoundary,
} from "@/data/benefitsDecisionSystemJourney";

const stepIcons = {
  prepare: ClipboardCheck,
  sources: FileSearch,
  confirm: CheckCircle2,
  situation: UserRoundCheck,
  brief: FileText,
} as const;

const BenefitsDecisionSystemJourney = () => (
  <div className="space-y-8">
    <section className="overflow-hidden rounded-[2rem] border border-primary/25 bg-card shadow-card" aria-labelledby="guided-benefits-journey-heading">
      <div className="grid gap-8 bg-gradient-to-br from-primary-soft/55 via-background to-secondary-soft/35 p-6 md:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            <Sparkles className="h-4 w-4" aria-hidden="true" /> Guided paid experience
          </div>
          <h3 id="guided-benefits-journey-heading" className="mt-5 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Bring the documents. Know your situation. CAF guides the rest.
          </h3>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            The purchaser should not need to understand benefits terminology, build a spreadsheet, or know which formulas matter. They bring the current materials that apply to them and answer plain-language questions. The system organizes the evidence, exposes uncertainty, runs the relevant scenarios, and produces a reviewable decision brief.
          </p>
        </div>

        <div className="grid gap-3 rounded-3xl border border-border bg-background/90 p-5 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">The exchange</div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="font-display text-lg font-bold">You bring</div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Current plan-year documents and an understanding of your household, priorities, and decision deadline.</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="font-display text-lg font-bold">CAF provides</div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">A guided interview, source status, transparent calculations, scenario comparisons, and verification prompts.</p>
            </div>
            <div className="rounded-2xl border border-primary/25 bg-primary-soft/35 p-4">
              <div className="font-display text-lg font-bold">You leave with</div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">A source-backed Benefits Decision Brief with assumptions, tradeoffs, deadlines, elections, and unresolved questions.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border p-6 md:p-10">
        <div className="mb-6 max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">One understandable step at a time</div>
          <h3 className="mt-2 font-display text-2xl font-bold md:text-3xl">The product journey</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            Complexity remains in the system rather than being transferred to the user. Each step reveals only the questions needed for the decision in front of them.
          </p>
        </div>

        <ol className="grid gap-4 lg:grid-cols-5">
          {benefitsDecisionJourneySteps.map((step) => {
            const Icon = stepIcons[step.id];
            return (
              <li key={step.id} className="relative rounded-2xl border border-border bg-background p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Step {step.number}</span>
                </div>
                <h4 className="mt-4 font-display text-lg font-bold">{step.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.summary}</p>
                <div className="mt-4 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">CAF:</strong> {step.systemAction}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>

    <section className="grid gap-6 lg:grid-cols-2" aria-label="Benefits Decision System preparation">
      <article className="rounded-[2rem] border border-border bg-card p-6 shadow-card md:p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary"><FileText className="h-5 w-5" aria-hidden="true" /></span>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Document checklist</div>
            <h3 className="mt-1 font-display text-2xl font-bold">What the purchaser brings</h3>
          </div>
        </div>
        <ul className="mt-6 space-y-4">
          {benefitsDecisionDocuments.map((document) => (
            <li key={document.id} className="flex gap-3 rounded-2xl border border-border bg-background p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <div className="font-semibold text-foreground">
                  {document.title}{document.required ? <span className="ml-2 text-xs font-bold uppercase tracking-[0.1em] text-primary">Core</span> : null}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{document.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-[2rem] border border-border bg-card p-6 shadow-card md:p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary-soft text-secondary"><UserRoundCheck className="h-5 w-5" aria-hidden="true" /></span>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">Personal situation</div>
            <h3 className="mt-1 font-display text-2xl font-bold">What the purchaser knows</h3>
          </div>
        </div>
        <ul className="mt-6 space-y-4">
          {benefitsDecisionSituationItems.map((item) => (
            <li key={item.id} className="rounded-2xl border border-border bg-background p-4">
              <div className="font-semibold text-foreground">{item.title}</div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </li>
          ))}
        </ul>
      </article>
    </section>

    <section className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm md:p-8" aria-labelledby="document-safety-boundary-heading">
      <div className="flex flex-col gap-5 md:flex-row md:items-start">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-amber-800 shadow-sm">
          <LockKeyhole className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <h3 id="document-safety-boundary-heading" className="font-display text-2xl font-bold">The product promise does not outrun the security boundary.</h3>
          <p className="mt-3 text-sm leading-relaxed md:text-base">{benefitsDecisionSystemBoundary.uploadGate}</p>
          <p className="mt-3 text-sm leading-relaxed md:text-base">{benefitsDecisionSystemBoundary.controllingDocuments}</p>
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-white/75 p-4 text-sm leading-relaxed">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden="true" />
            <div>
              <strong>Never provide:</strong> {benefitsDecisionSystemBoundary.prohibitedData.join(", ")}.
            </div>
          </div>
        </div>
      </div>
    </section>

    <div className="flex items-center gap-2 text-sm font-bold text-primary">
      The design target is guided completion, not software imitation <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </div>
  </div>
);

export default BenefitsDecisionSystemJourney;
