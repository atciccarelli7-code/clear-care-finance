import { CheckCircle2, Lightbulb } from "lucide-react";
import type { FactSheet } from "@/data/topics";
import { SectionHeading } from "./SectionHeading";

interface FactSheetGridProps {
  factSheet: FactSheet;
}

export const FactSheetGrid = ({ factSheet }: FactSheetGridProps) => (
  <div className="min-w-0">
    <SectionHeading
      centered
      eyebrow={factSheet.eyebrow ?? "Fact sheet"}
      title={factSheet.title}
      description={factSheet.description}
    />

    <div className="mx-auto grid max-w-5xl min-w-0 gap-5 md:grid-cols-2">
      {factSheet.items.map((item) => (
        <article
          key={item.title}
          className="min-w-0 break-words rounded-2xl border border-border bg-card p-6 shadow-card transition-smooth hover:border-primary/30 hover:shadow-hover md:p-7"
        >
          <h3 className="font-display text-xl font-bold text-foreground break-words">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground break-words">{item.definition}</p>

          <ul className="mt-5 space-y-2.5 min-w-0">
            {item.bullets.map((bullet) => (
              <li key={bullet} className="flex min-w-0 items-start gap-3 text-sm leading-relaxed text-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="min-w-0 break-words">{bullet}</span>
              </li>
            ))}
          </ul>

          {item.reminder && (
            <div className="mt-5 flex min-w-0 items-start gap-3 rounded-xl border border-primary/20 bg-primary-soft/40 p-4">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-muted-foreground break-words">
                <span className="font-semibold text-foreground">Plain-English reminder: </span>
                {item.reminder}
              </p>
            </div>
          )}
        </article>
      ))}
    </div>
  </div>
);
