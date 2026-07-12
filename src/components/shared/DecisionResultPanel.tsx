import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, ClipboardCheck, Copy, Printer, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DecisionResult } from "@/lib/roadmapDecisionTools";

const ResultList = ({ title, items }: { title: string; items: string[] }) => {
  if (!items.length) return null;
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5">
      <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
      <ul className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export const decisionResultToText = (result: DecisionResult, officialNote?: string) => [
  result.direction,
  result.summary,
  "",
  "WHY THIS DIRECTION APPLIES",
  ...result.reasons.map((item) => `- ${item}`),
  "",
  "DO NOW",
  ...result.doNow.map((item) => `- ${item}`),
  "",
  "VERIFY",
  ...result.verify.map((item) => `- ${item}`),
  "",
  "LEARN LATER",
  ...result.learnLater.map((item) => `- ${item}`),
  "",
  "IMPORTANT LIMITS",
  ...result.cautions.map((item) => `- ${item}`),
  officialNote ? `\n${officialNote}` : "",
].filter(Boolean).join("\n");

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
}) => (
  <div className="space-y-5" aria-live="polite">
    <section className="rounded-3xl border border-primary/25 bg-primary-soft/30 p-5 shadow-card md:p-7">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Qualified decision direction</p>
      <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-foreground md:text-3xl">{result.direction}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">{result.summary}</p>
    </section>

    <div className="grid gap-4 lg:grid-cols-2">
      <ResultList title="Why this direction applies" items={result.reasons} />
      <ResultList title="Do now" items={result.doNow} />
      <ResultList title="Verify" items={result.verify} />
      <ResultList title="Learn later" items={result.learnLater} />
    </div>

    <section className="rounded-2xl border border-amber-300 bg-amber-50/80 p-4 dark:border-amber-800 dark:bg-amber-950/20 md:p-5">
      <h3 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
        <AlertTriangle className="h-5 w-5 text-amber-700 dark:text-amber-300" aria-hidden="true" /> Important limits
      </h3>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
        {result.cautions.map((item) => <li key={item}>• {item}</li>)}
      </ul>
    </section>

    {children}

    <div className="flex flex-col gap-3 sm:flex-row print:hidden">
      <Button type="button" onClick={onCopy}><Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy plan"}</Button>
      <Button type="button" variant="outline" onClick={onPrint}><Printer className="h-4 w-4" /> Print or save as PDF</Button>
      <Button type="button" variant="ghost" onClick={onReset}><RotateCcw className="h-4 w-4" /> Start over</Button>
    </div>
  </div>
);

export const DecisionToolIntro = ({ children }: { children: ReactNode }) => (
  <div className="rounded-2xl border border-primary/15 bg-primary-soft/25 p-4 text-sm leading-relaxed text-muted-foreground md:p-5">
    <div className="flex items-start gap-3">
      <ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <div>{children}</div>
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
