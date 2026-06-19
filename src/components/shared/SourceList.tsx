import { BookOpen, ArrowUpRight } from "lucide-react";
import type { Source } from "@/data/sources";

interface SourceListProps {
  sources: Source[];
  title?: string;
}

export const SourceList = ({ sources, title }: SourceListProps) => {
  if (!sources.length) return null;
  return (
    <div className="space-y-4">
      {title && <h3 className="font-display text-lg font-bold">{title}</h3>}
      <ul className="space-y-3">
        {sources.map((s) => {
          const publisher = s.publisher ?? s.name;
          const dateLabel = s.reviewedDate
            ? `Reviewed ${s.reviewedDate}`
            : s.accessedDate
              ? `Accessed ${s.accessedDate}`
              : null;

          return (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-smooth hover:border-primary/40 hover:shadow-hover"
              >
                <BookOpen className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-smooth shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground group-hover:text-primary transition-smooth">{publisher}</span>
                    <span className="text-xs text-muted-foreground">· {s.pageTitle}</span>
                  </div>
                  {s.note && <p className="text-sm text-muted-foreground mt-1">{s.note}</p>}
                  {dateLabel && <p className="text-xs text-muted-foreground mt-2">{dateLabel}</p>}
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 mt-1 transition-smooth" />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
