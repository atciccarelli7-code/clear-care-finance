import { cn } from "@/lib/utils";

interface CalculatorResultProps {
  label: string;
  value: string;
  emphasis?: "primary" | "accent" | "muted";
  helper?: string;
}

export const CalculatorResult = ({ label, value, emphasis = "muted", helper }: CalculatorResultProps) => {
  const styles = {
    primary: "border-primary/20 bg-primary-soft/80 text-foreground ring-1 ring-primary/10",
    accent: "border-secondary/20 bg-secondary-soft/80 text-foreground ring-1 ring-secondary/10",
    muted: "border-border bg-background/70 text-foreground",
  }[emphasis];

  const valueColor = {
    primary: "text-primary",
    accent: "text-secondary",
    muted: "text-foreground",
  }[emphasis];

  return (
    <div className={cn("min-w-0 break-words rounded-2xl border p-4 shadow-sm transition-smooth md:p-5", styles)}>
      <div className="break-words text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
      <div className={cn("mt-1 break-words font-display text-2xl font-bold tabular-nums leading-tight md:text-3xl", valueColor)}>
        {value}
      </div>
      {helper && <div className="mt-1.5 break-words text-xs leading-relaxed text-muted-foreground">{helper}</div>}
    </div>
  );
};
