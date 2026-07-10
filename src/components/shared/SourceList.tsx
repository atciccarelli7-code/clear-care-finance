import { BookOpen, ArrowUpRight } from "lucide-react";
import type { Source } from "@/data/sources";
import { trackSiteEvent } from "@/lib/analytics";

interface SourceListProps {
  sources: Source[];
  title?: string;
}

export const SourceList = ({ sources, title }: SourceListProps) => {
  if (!sources.length) return null;
  return (
    <div className="min-w-0 space-y-4 break-words">
      {title && <h3 className="font-display text-lg font-bold break-words">{title}</h3>}
      <ul className="min-w-0 space-y-3">
        {sources.map((s) => (
          <li key={s.url} className="min-w-0">
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackSiteEvent("official_source_click", {
                event_category: "sources",
                source_name: s.name,
                link_url: s.url,
                source_path: window.location.pathname,
              })}
              className="group flex min-w-0 max-w-full items-start gap-3 break-words rounded-xl border border-border bg-card p-4 transition-smooth hover:border-primary/40 hover:shadow-hover sm:gap-4"
            >
              <BookOpen className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-smooth shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0 break-words">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="font-semibold text-foreground group-hover:text-primary transition-smooth break-words">{s.name}</span>
                  <span className="text-xs text-muted-foreground break-words">· {s.pageTitle}</span>
                </div>
                {s.note && <p className="text-sm text-muted-foreground mt-1 break-words">{s.note}</p>}
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 mt-1 transition-smooth" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
