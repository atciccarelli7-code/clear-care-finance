import type { ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Droplets,
  Pill,
  Stethoscope,
} from "lucide-react";
import type {
  HeartFailureActionLevel,
  HeartFailureMedicationGroup,
  HeartFailureTest,
} from "@/data/heartFailureGuide";

export const GuideSection = ({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}) => (
  <section id={id} className="scroll-mt-24" aria-labelledby={id ? `${id}-title` : undefined}>
    <div className="mb-8 space-y-3">
      <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</div>
      <h2 id={id ? `${id}-title` : undefined} className="font-display text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      {description && <p className="max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>}
    </div>
    {children}
  </section>
);

export const TestCard = ({ test }: { test: HeartFailureTest }) => (
  <article className="grid gap-4 rounded-2xl border border-border bg-card p-5 md:grid-cols-[0.7fr_1fr_1fr] md:p-6">
    <div>
      <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Test or evaluation</div>
      <h3 className="mt-2 font-display text-lg font-bold">{test.name}</h3>
      {test.plainName && <p className="mt-1 text-sm font-medium text-secondary">{test.plainName}</p>}
    </div>
    <div>
      <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Question it helps answer</div>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90">{test.questionAnswered}</p>
    </div>
    <div>
      <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">What to know</div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{test.whatToKnow}</p>
    </div>
  </article>
);

export const MedicationCard = ({ medication, defaultOpen = false }: { medication: HeartFailureMedicationGroup; defaultOpen?: boolean }) => (
  <details className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm" open={defaultOpen}>
    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 md:p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset">
      <div className="flex min-w-0 items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          {medication.id === "diuretics" ? <Droplets className="h-5 w-5" aria-hidden="true" /> : <Pill className="h-5 w-5" aria-hidden="true" />}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">Medication purpose card</div>
          <h3 className="mt-1 font-display text-xl font-bold">{medication.name}</h3>
          {medication.commonName && <p className="mt-1 text-sm font-semibold text-primary">Common language: {medication.commonName}</p>}
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">The job: </strong>{medication.job}</p>
        </div>
      </div>
      <ChevronDown className="mt-2 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
    </summary>
    <div className="border-t border-border bg-muted/15 p-5 md:p-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <div>
            <h4 className="font-display font-bold">Common examples</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {medication.examples.map((example) => <span key={example} className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground">{example}</span>)}
            </div>
          </div>
          <div>
            <h4 className="font-display font-bold">Why it may be used</h4>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{medication.whyItMayBeUsed}</p>
          </div>
          <div>
            <h4 className="font-display font-bold">What the team may monitor</h4>
            <ul className="mt-2 space-y-2">
              {medication.whatTheTeamMayMonitor.map((item) => <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{item}</li>)}
            </ul>
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <h4 className="font-display font-bold">Questions to ask</h4>
            <ul className="mt-2 space-y-2">
              {medication.questionsToAsk.map((item) => <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground"><CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />{item}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-warning/30 bg-warning-soft/35 p-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Medication boundary: </strong>{medication.importantBoundary}
          </div>
        </div>
      </div>
    </div>
  </details>
);

const actionClasses = {
  emergency: "border-destructive/35 bg-destructive/5",
  "same-day": "border-warning/40 bg-warning-soft/45",
  steady: "border-success/35 bg-success-soft/40",
} as const;

const actionIcons = {
  emergency: AlertTriangle,
  "same-day": Stethoscope,
  steady: BadgeCheck,
} as const;

export const ActionPlanCard = ({ level }: { level: HeartFailureActionLevel }) => {
  const Icon = actionIcons[level.id];

  return (
    <article className={`rounded-3xl border p-6 md:p-8 ${actionClasses[level.id]}`}>
      <div className="flex items-start gap-4">
        <Icon className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-2xl font-bold">{level.label}</h3>
          <p className="mt-2 font-medium leading-relaxed text-foreground/90">{level.instruction}</p>
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {level.signs.map((sign) => (
              <li key={sign} className="flex items-start gap-3 rounded-xl border border-border/70 bg-background/70 p-4 text-sm leading-relaxed text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{sign}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">Verify: </strong>{level.verification}</p>
        </div>
      </div>
    </article>
  );
};
