import { SITE_ARTICLES } from "./siteArticles";
import { OBBB_OVERTIME_ARTICLE } from "./healthcareWorkerArticles";
import { BACKUP_CARE_ARTICLE } from "./familyLogisticsArticles";
import { JANUARY_2027_MEDICARE_MEDICAID_CHANGES_ARTICLE } from "./policyChangeArticles";
import { HSA_FSA_ARTICLE } from "./hsaFsaArticle";
import { HEALTHCARE_CONFUSION_ARTICLES } from "./healthcareConfusionArticles";
import { OPEN_ENROLLMENT_ARTICLES } from "./openEnrollmentArticles";
import { POST_ADSENSE_PREPARED_ARTICLES } from "./postAdsensePreparedArticles";
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
  ...OPEN_ENROLLMENT_ARTICLES_READY,
  ...HEALTHCARE_CONFUSION_ARTICLES,
  ...POST_ADSENSE_PREPARED_ARTICLES,
  HSA_FSA_ARTICLE,
  JANUARY_2027_MEDICARE_MEDICAID_CHANGES_ARTICLE,
  OBBB_OVERTIME_ARTICLE,
  BACKUP_CARE_ARTICLE,
  ...SITE_ARTICLES,
]);
