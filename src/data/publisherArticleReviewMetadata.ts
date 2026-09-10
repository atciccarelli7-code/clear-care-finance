import type { Article } from "./articles";
import { PUBLISHER_ARTICLE_REVIEWS } from "./publisherArticleReviewLedger";

const REVIEW_BY_SLUG = new Map(PUBLISHER_ARTICLE_REVIEWS.map((review) => [review.slug, review]));

export const applyPublisherArticleReviewMetadata = (articles: Article[]): Article[] =>
  articles.map((article) => {
    const review = REVIEW_BY_SLUG.get(article.slug);
    if (!review || review.disposition !== "ad-eligible") return article;

    const nextReviewAt =
      article.nextReviewAt && article.nextReviewAt < review.nextReviewAt
        ? article.nextReviewAt
        : review.nextReviewAt;

    return {
      ...article,
      lastReviewedAt: article.lastReviewedAt ?? review.reviewedAt,
      nextReviewAt,
      reviewScope: article.reviewScope ?? review.reviewScope,
    };
  });
