import { CalendarClock, RefreshCw } from "lucide-react";

export type ContentFreshnessProps = {
  publishedAt?: string;
  lastReviewedAt?: string;
  rulesEffectiveAt?: string;
  nextReviewAt?: string;
  timeSensitive?: boolean;
  reviewScope?: string;
  updateNote?: string;
  compact?: boolean;
};

const formatDate = (value?: string) => {
  if (!value) return null;
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(parsed);
};

const DateItem = ({ label, value }: { label: string; value?: string }) => {
  const formatted = formatDate(value);
  if (!formatted || !value) return null;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="font-semibold text-foreground">{label}:</span>
      <time dateTime={value}>{formatted}</time>
    </span>
  );
};

export const ContentFreshness = ({
  publishedAt,
  lastReviewedAt,
  rulesEffectiveAt,
  nextReviewAt,
  timeSensitive,
  reviewScope,
  updateNote,
  compact = false,
}: ContentFreshnessProps) => {
  if (!publishedAt && !lastReviewedAt && !rulesEffectiveAt && !nextReviewAt && !reviewScope && !updateNote) return null;

  return (
    <aside
      className={`rounded-2xl border border-primary/15 bg-primary-soft/25 ${compact ? "p-4" : "p-5 md:p-6"}`}
      aria-label="Content review and freshness information"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background text-primary shadow-sm">
          {timeSensitive ? <RefreshCw className="h-4 w-4" aria-hidden="true" /> : <CalendarClock className="h-4 w-4" aria-hidden="true" />}
        </div>
        <div className="min-w-0 space-y-2">
          <div className="text-sm font-bold text-foreground">{timeSensitive ? "Time-sensitive guidance" : "Content review information"}</div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs leading-relaxed text-muted-foreground md:text-sm">
            <DateItem label="Published" value={publishedAt} />
            <DateItem label="Last reviewed" value={lastReviewedAt} />
            <DateItem label="Rules effective" value={rulesEffectiveAt} />
            <DateItem label="Next review" value={nextReviewAt} />
          </div>
          {reviewScope && <p className="text-xs leading-relaxed text-muted-foreground md:text-sm"><strong className="text-foreground">Review scope:</strong> {reviewScope}</p>}
          {updateNote && <p className="text-xs leading-relaxed text-muted-foreground md:text-sm"><strong className="text-foreground">Update:</strong> {updateNote}</p>}
        </div>
      </div>
    </aside>
  );
};
