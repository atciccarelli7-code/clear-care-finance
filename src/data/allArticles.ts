import { CORE_ARTICLES } from "./coreArticles";
import { FOUNDER_HOSPITAL_ECONOMICS_ARTICLES } from "./founderHospitalEconomicsArticles";
import { applyPublisherArticleReviewMetadata } from "./publisherArticleReviews";
import { publishedArticles } from "@/lib/article-status";

const BASE_ARTICLES = [
  ...FOUNDER_HOSPITAL_ECONOMICS_ARTICLES,
  ...CORE_ARTICLES,
];

const ARTICLES_WITH_PUBLISHER_REVIEW = applyPublisherArticleReviewMetadata(BASE_ARTICLES);

export const ALL_ARTICLES = publishedArticles(ARTICLES_WITH_PUBLISHER_REVIEW);
