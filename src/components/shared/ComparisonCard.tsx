import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComparisonSide } from "@/data/topics";

interface ComparisonCardProps {
  side: ComparisonSide;
}

export const ComparisonCard = ({ side }: ComparisonCardProps) => {
  const isPrimary = side.accent === "primary";
  return (
    <div className="min-w-0 break-words rounded-2xl border border-border bg-card p-6 shadow-card transition-smooth hover:shadow-hover md:p-8">
      <div className="mb-6 min-w-0">
        <div
          className={cn(
            "inline-block h-1 w-12 rounded-full mb-4",
            isPrimary ? "bg-primary" : "bg-secondary",
          )}
        />
        <h3 className="font-display text-xl font-bold break-words">{side.title}</h3>
        <p className="text-sm text-muted-foreground break-words">{side.subtitle}</p>
      </div>
      <ul className="space-y-3 min-w-0">
        {side.points.map((p) => (
          <li key={p} className="flex min-w-0 items-start gap-3 text-sm text-foreground">
            <CheckCircle2
              className={cn("h-4 w-4 mt-0.5 shrink-0", isPrimary ? "text-primary" : "text-secondary")}
            />
            <span className="min-w-0 break-words">{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
