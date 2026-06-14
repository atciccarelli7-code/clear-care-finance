import { cn } from "@/lib/utils";

interface CalculatorResultProps {
  label: string;
  value: string;
  emphasis?: "primary" | "accent" | "muted";
  helper?: string;
}

export const CalculatorResult = ({ label, value, emphasis = "muted", helper }: CalculatorResultProps) => {
  const styles = {
    primary: "bg-gradient-primary text-primary-foreground border-transparent",
    accent: "bg-gradient-accent text-primary-foreground border-transparent",
    muted: "bg-muted/30 border-border text-foreground",
  }[emphasis];

  const labelColor = emphasis === "muted" ? "text-muted-foreground" : "opacity-90";

  return (
    <div className={cn("rounded-2xl border p-5 shadow-card", styles)}>
      <div className={cn("text-xs font-semibold uppercase tracking-wider", labelColor)}>{label}</div>
      <div className="mt-1 font-display text-2xl md:text-3xl font-bold tabular-nums">{value}</div>
      {helper && (
        <div className={cn("text-xs mt-1", emphasis === "muted" ? "text-muted-foreground" : "opacity-80")}>
          {helper}
        </div>
      )}
    </div>
  );
};
