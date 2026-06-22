import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SourceList } from "@/components/shared/SourceList";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import type { Source } from "@/data/sources";
import { cn } from "@/lib/utils";

interface CalculatorFormLayoutProps {
  inputTitle?: string;
  inputs: ReactNode;
  results: ReactNode;
  onReset: () => void;
}

export const CalculatorFormLayout = ({
  inputTitle = "Your numbers",
  inputs,
  results,
  onReset,
}: CalculatorFormLayoutProps) => (
  <form onSubmit={(event) => event.preventDefault()} className="grid gap-7 lg:grid-cols-5 lg:gap-8">
    <fieldset className="space-y-5 lg:col-span-3">
      <legend className="mb-5 font-display text-lg font-bold">{inputTitle}</legend>
      {inputs}
      <Button type="button" variant="outline" size="sm" onClick={onReset} className="min-h-11 gap-2">
        <RotateCcw className="h-4 w-4" /> Start over
      </Button>
    </fieldset>
    <section
      aria-live="polite"
      aria-atomic="false"
      className="space-y-3 lg:col-span-2 lg:self-start"
    >
      <h3 className="font-display text-lg font-bold">Your estimate</h3>
      {results}
    </section>
  </form>
);

interface CalculatorNoticeProps {
  children: ReactNode;
  tone?: "neutral" | "caution";
}

export const CalculatorNotice = ({ children, tone = "neutral" }: CalculatorNoticeProps) => (
  <div
    className={cn(
      "flex gap-3 rounded-2xl border p-4 text-sm leading-relaxed",
      tone === "caution"
        ? "border-secondary/35 bg-secondary-soft text-foreground"
        : "border-border bg-muted/30 text-muted-foreground",
    )}
  >
    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-secondary" aria-hidden="true" />
    <div>{children}</div>
  </div>
);

interface CalculatorDetailsProps {
  example: ReactNode;
  assumptions: string[];
  sources: Source[];
  relatedTools: Array<{ label: string; href: string }>;
}

export const CalculatorDetails = ({
  example,
  assumptions,
  sources,
  relatedTools,
}: CalculatorDetailsProps) => (
  <div className="mt-8 space-y-6 border-t border-border/70 pt-8">
    <div className="grid gap-5 md:grid-cols-2">
      <section className="rounded-2xl border border-border bg-muted/20 p-5">
        <h3 className="font-display text-base font-bold">Example scenario</h3>
        <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{example}</div>
      </section>
      <section className="rounded-2xl border border-border bg-muted/20 p-5">
        <h3 className="font-display text-base font-bold">Key assumptions</h3>
        <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
          {assumptions.map((assumption) => <li key={assumption}>- {assumption}</li>)}
        </ul>
      </section>
    </div>

    <section>
      <SourceList sources={sources} title="Source notes" />
    </section>

    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="font-display text-base font-bold">Related tools</h3>
      <div className="mt-3 flex flex-wrap gap-3">
        {relatedTools.map((tool) => (
          <Button key={tool.href} asChild variant="outline" size="sm" className="min-h-11">
            <Link to={tool.href}>{tool.label} <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        ))}
      </div>
    </section>

    <DisclaimerBox />
  </div>
);
