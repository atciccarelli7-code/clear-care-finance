import { SITE_ARTICLES } from "./siteArticles";
import { OBBB_OVERTIME_ARTICLE } from "./healthcareWorkerArticles";
import { BACKUP_CARE_ARTICLE } from "./familyLogisticsArticles";
import { JANUARY_2027_MEDICARE_MEDICAID_CHANGES_ARTICLE } from "./policyChangeArticles";
import { HSA_FSA_ARTICLE } from "./hsaFsaArticle";
import { HEALTHCARE_CONFUSION_ARTICLES } from "./healthcareConfusionArticles";
import { INSURANCE_FUTURE_PLANNING_ARTICLE } from "./insuranceFuturePlanningArticle";
import { MEDICARE_ADVANTAGE_ORIGINAL_2026_ARTICLE } from "./medicareAdvantageOriginal2026Article";
import { MODERN_MONEY_FRICTION_ARTICLE } from "./modernMoneyFrictionArticle";
import { OPEN_ENROLLMENT_ARTICLES } from "./openEnrollmentArticles";
import { FROM_BEDSIDE_ARTICLES } from "./fromBedsideArticles";
import { WEALTH_ARTICLES } from "./wealthArticles";
import { RETIREMENT_INVESTMENT_ARTICLES } from "./retirementInvestmentArticles";
import { SEARCH_MOAT_ARTICLES } from "./searchMoatArticles";
import { SOURCE_PRESETS } from "./sources";
import { publishedArticles } from "@/lib/article-status";

const OPEN_ENROLLMENT_ARTICLES_READY = OPEN_ENROLLMENT_ARTICLES.map((article) =>
  article.slug === "dental-vision-insurance-open-enrollment"
    ? {
        ...article,
        sources: [SOURCE_PRESETS.healthcareGovDental, SOURCE_PRESETS.healthcareGovDeductible, SOURCE_PRESETS.healthcareGovOutOfPocketMax],
      }
    : article,
);

export const ALL_ARTICLES = publishedArticles([
  ...SEARCH_MOAT_ARTICLES,
  ...RETIREMENT_INVESTMENT_ARTICLES,
  ...WEALTH_ARTICLES,
  MODERN_MONEY_FRICTION_ARTICLE,
  ...OPEN_ENROLLMENT_ARTICLES_READY,
  ...FROM_BEDSIDE_ARTICLES,
  ...HEALTHCARE_CONFUSION_ARTICLES,
  INSURANCE_FUTURE_PLANNING_ARTICLE,
  MEDICARE_ADVANTAGE_ORIGINAL_2026_ARTICLE,
  HSA_FSA_ARTICLE,
  JANUARY_2027_MEDICARE_MEDICAID_CHANGES_ARTICLE,
  OBBB_OVERTIME_ARTICLE,
  BACKUP_CARE_ARTICLE,
  ...SITE_ARTICLES,
]);
