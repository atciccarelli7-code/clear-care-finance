import { DateItem, type ContentFreshnessProps } from "./ContentFreshness";

export const ArticleFreshness = ({ publishedAt, lastReviewedAt, rulesEffectiveAt, nextReviewAt, timeSensitive, reviewScope, updateNote }: ContentFreshnessProps) => {
  return (
    <aside className="space-y-2 text-sm leading-relaxed text-muted-foreground" aria-label="Content review and freshness information">
      {timeSensitive && <p className="font-semibold text-foreground">Time-sensitive guidance</p>}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <DateItem label="Published" value={publishedAt} />
        <DateItem label="Last reviewed" value={lastReviewedAt} />
        <DateItem label="Rules effective" value={rulesEffectiveAt} />
      </div>
      {updateNote && <p><strong className="text-foreground">Update:</strong> {updateNote}</p>}
      {(nextReviewAt || reviewScope) && (
        <details className="article-review-details">
          <summary className="w-fit cursor-pointer py-2 font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Review scope and updates</summary>
          <div className="space-y-2 border-l-2 border-border pl-4 pt-1">
            <DateItem label="Next review" value={nextReviewAt} />
            {reviewScope && <p><strong className="text-foreground">Review scope:</strong> {reviewScope}</p>}
          </div>
        </details>
      )}
    </aside>
  );

};
