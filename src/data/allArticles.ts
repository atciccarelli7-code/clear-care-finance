import { CORE_ARTICLES } from "./coreArticles";
import { FOUNDER_CARE_TRANSITIONS_ARTICLES } from "./founderCareTransitionsArticles";
import { FOUNDER_HOSPITAL_ECONOMICS_ARTICLES } from "./founderHospitalEconomicsArticles";
import { FOUNDER_HEALTHCARE_SYSTEMS_ARTICLES } from "./founderHealthcareSystemsArticles";
import { FOUNDER_MEDICARE_ADVANTAGE_HOSPITAL_SIDE_ARTICLE } from "./founderMedicareAdvantageHospitalSideArticle";
import { applyPublisherArticleReviewMetadata } from "./publisherArticleReviewMetadata";
import { publishedArticles } from "@/lib/article-status";

const BASE_ARTICLES = [
  ...FOUNDER_CARE_TRANSITIONS_ARTICLES,
  ...FOUNDER_HOSPITAL_ECONOMICS_ARTICLES,
  ...FOUNDER_HEALTHCARE_SYSTEMS_ARTICLES,
  FOUNDER_MEDICARE_ADVANTAGE_HOSPITAL_SIDE_ARTICLE,
  ...CORE_ARTICLES,
];

const ARTICLES_WITH_PUBLISHER_REVIEW = applyPublisherArticleReviewMetadata(BASE_ARTICLES);

export const ALL_ARTICLES = publishedArticles(ARTICLES_WITH_PUBLISHER_REVIEW);
