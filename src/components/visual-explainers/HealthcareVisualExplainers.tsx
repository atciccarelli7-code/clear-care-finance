import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, ExternalLink, Info, ShieldAlert } from "lucide-react";
import type { MedicareCostReference, VisualSource } from "@/data/medicareVisualExplainers";
import { cn } from "@/lib/utils";

export const VisualStat = ({ label, value, context }: { label: string; value: string; context: string }) => (
  <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
    <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
    <p className="mt-2 font-display text-2xl font-extrabold tracking-tight text-foreground">{value}</p>
    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{context}</p>
  </div>
);

export const ComparisonPanel = ({
  eyebrow,
  title,
  description,
  columns,
}: {
  eyebrow: string;
  title: string;
  description: string;
  columns: ReadonlyArray<{ label: string; memoryAid: string; who: string; controls: string; verify: string }>;
}) => (
  <section className="rounded-[2rem] border border-border bg-card p-5 shadow-card md:p-8">
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
    <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground">{title}</h2>
    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p>
    <div className="mt-6 grid gap-4 lg:grid-cols-3">
      {columns.map((column) => (
        <article key={column.label} className="rounded-2xl border border-border bg-background/70 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{column.label}</p>
          <h3 className="mt-2 font-display text-xl font-bold text-foreground">{column.memoryAid}</h3>
          <dl className="mt-4 space-y-3 text-sm leading-relaxed">
            <div><dt className="font-bold text-foreground">Who it serves</dt><dd className="mt-1 text-muted-foreground">{column.who}</dd></div>
            <div><dt className="font-bold text-foreground">What controls the answer</dt><dd className="mt-1 text-muted-foreground">{column.controls}</dd></div>
            <div><dt className="font-bold text-foreground">Where to verify</dt><dd className="mt-1 text-muted-foreground">{column.verify}</dd></div>
          </dl>
        </article>
      ))}
    </div>
  </section>
);

export const CostReferenceTable = ({
  title,
  description,
  rows,
}: {
  title: string;
  description: string;
  rows: MedicareCostReference[];
}) => (
  <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
    <div className="p-5 md:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">2026 official reference</p>
      <h2 className="mt-2 font-display text-2xl font-bold text-foreground">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
    <div
      className="overflow-x-auto border-t border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      role="region"
      aria-label={`${title} scrollable table`}
      tabIndex={0}
    >
      <table className="w-full min-w-[42rem] text-left text-sm">
        <caption className="sr-only">{title}</caption>
        <thead className="bg-muted/50 text-xs uppercase tracking-[0.1em] text-muted-foreground">
          <tr><th className="px-5 py-3">Cost</th><th className="px-5 py-3">2026 amount</th><th className="px-5 py-3">Frequency</th><th className="px-5 py-3">Important context</th></tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr key={row.id}>
              <th scope="row" className="px-5 py-4 font-bold text-foreground">{row.label}</th>
              <td className="px-5 py-4 font-display text-lg font-bold text-primary">{row.amount}</td>
              <td className="px-5 py-4 text-muted-foreground">{row.period}</td>
              <td className="px-5 py-4 text-muted-foreground">{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export const CoverageGapGrid = ({
  title,
  description,
  gaps,
}: {
  title: string;
  description: string;
  gaps: ReadonlyArray<{ label: string; status: string; note: string }>;
}) => (
  <section className="rounded-3xl border border-border bg-card p-5 shadow-card md:p-6">
    <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Coverage reality check</p>
    <h2 className="mt-2 font-display text-2xl font-bold text-foreground">{title}</h2>
    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      {gaps.map((gap) => (
        <article key={gap.label} className="rounded-2xl border border-border bg-background/70 p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
            <div><h3 className="font-bold text-foreground">{gap.label}</h3><p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-amber-700 dark:text-amber-300">{gap.status.replaceAll("-", " ")}</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{gap.note}</p></div>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export const WarningCallout = ({ title, children, items, tone = "warning" }: { title: string; children: ReactNode; items?: string[]; tone?: "warning" | "info" }) => {
  const Icon = tone === "warning" ? AlertTriangle : Info;
  return (
    <section className={cn("rounded-3xl border p-5 shadow-sm md:p-6", tone === "warning" ? "border-amber-300 bg-amber-50/80 dark:border-amber-800 dark:bg-amber-950/20" : "border-primary/20 bg-primary-soft/25")}>
      <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-foreground"><Icon className={cn("h-5 w-5", tone === "warning" ? "text-amber-700 dark:text-amber-300" : "text-primary")} aria-hidden="true" />{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
      {items && <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">{items.map((item) => <li key={item} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><span>{item}</span></li>)}</ul>}
    </section>
  );
};

export const VisualSourceNote = ({ sources }: { sources: VisualSource[] }) => (
  <aside className="rounded-2xl border border-border bg-muted/25 p-4 text-xs leading-relaxed text-muted-foreground" aria-label="Visual explainer sources">
    <p className="font-bold text-foreground">Source and review note</p>
    <p className="mt-1">Figures are educational reference points, not a benefit quote. Verify current coverage with controlling plan documents and official sources.</p>
    <ul className="mt-3 space-y-2">
      {sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="font-semibold text-primary underline-offset-4 hover:underline">{source.label}<ExternalLink className="ml-1 inline h-3 w-3" aria-hidden="true" /></a> — {source.scope} Reviewed {source.reviewed}.</li>)}
    </ul>
  </aside>
);
