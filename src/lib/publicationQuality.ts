import type { Article } from "@/data/articles";

export type PublicationQualityIssue = {
  field: string;
  message: string;
};

const hasText = (value: string | undefined, minimumLength = 1) =>
  typeof value === "string" && value.trim().length >= minimumLength;

const hasSubstantiveStructure = (article: Article) =>
  article.body.filter((paragraph) => paragraph.trim().length > 0).length >= 3 ||
  (article.sections?.length ?? 0) >= 2;

const hasPracticalDecisionSupport = (article: Article) =>
  Boolean(
    article.example ||
      article.relatedCalculator ||
      (article.commonMistakes?.length ?? 0) > 0 ||
      (article.numberedSteps?.length ?? 0) > 0 ||
      (article.questionsToAsk?.length ?? 0) > 0 ||
      (article.comparisonTable?.rows.length ?? 0) > 0 ||
      (article.sections?.some((section) =>
        Boolean(section.example || section.watchOut || (section.keyPoints?.length ?? 0) > 1),
      ) ?? false),
  );

export const getArticlePublicationIssues = (
  article: Article,
  defaultAuthor?: string,
): PublicationQualityIssue[] => {
  const issues: PublicationQualityIssue[] = [];

  const require = (condition: boolean, field: string, message: string) => {
    if (!condition) issues.push({ field, message });
  };

  require(hasText(article.slug, 3), "slug", "Article needs a distinct canonical slug.");
  require(hasText(article.title, 10), "title", "Article needs a clear descriptive title.");
  require(hasText(article.promise, 30), "promise", "Article needs a useful one-sentence promise.");
  require(hasText(article.audience, 20), "audience", "Article needs a defined reader audience.");
  require(hasText(article.summary, 50), "summary", "Article needs a direct plain-English summary.");
  require(hasSubstantiveStructure(article), "body", "Article needs substantive explanatory paragraphs or sections.");
  require(hasText(article.takeaway, 20), "takeaway", "Article needs a clear practical takeaway.");
  require(article.sources.length > 0, "sources", "Article needs at least one authoritative source.");
  require(hasText(article.author ?? defaultAuthor, 3), "author", "Article needs visible author information.");

  if (article.timeSensitive) {
    require(hasText(article.lastReviewedAt, 10), "lastReviewedAt", "Time-sensitive article needs a last-reviewed date.");
    require(hasText(article.nextReviewAt, 10), "nextReviewAt", "Time-sensitive article needs a next-review date.");
    require(hasText(article.reviewScope, 20), "reviewScope", "Time-sensitive article needs a defined review scope.");
  }

  return issues;
};

export const getAdEligibleArticleIssues = (
  article: Article,
  defaultAuthor?: string,
): PublicationQualityIssue[] => {
  const issues = getArticlePublicationIssues(article, defaultAuthor);
  const require = (condition: boolean, field: string, message: string) => {
    if (!condition) issues.push({ field, message });
  };

  require(
    hasText(article.publishedAt, 10) || hasText(article.lastReviewedAt, 10),
    "publicationMetadata",
    "Ad-eligible article needs a publication date or recorded editorial review date.",
  );
  require(hasText(article.lastReviewedAt, 10), "lastReviewedAt", "Ad-eligible article needs a recorded content review date.");
  require(
    hasPracticalDecisionSupport(article),
    "decisionSupport",
    "Ad-eligible article needs an example, checklist, comparison, common mistakes, questions, or another practical decision aid.",
  );
  require(
    article.body.filter((paragraph) => paragraph.trim().length > 0).length >= 4 || (article.sections?.length ?? 0) >= 3,
    "editorialDepth",
    "Ad-eligible article needs multiple layers of original explanation rather than a navigation-led or definition-only page.",
  );

  return issues;
};
