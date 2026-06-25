import type { ReactNode } from "react";

interface CalculatorFormulaProps {
  title?: string;
  items: ReactNode[];
  note?: ReactNode;
}

export const CalculatorFormula = ({ title = "How this is calculated", items, note }: CalculatorFormulaProps) => (
  <div className="rounded-2xl border border-border bg-muted/30 p-5 text-sm leading-relaxed">
    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">{title}</div>
    <ul className="space-y-1.5 text-muted-foreground">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
    {note && <p className="mt-3 text-xs text-muted-foreground/80">{note}</p>}
  </div>
);
