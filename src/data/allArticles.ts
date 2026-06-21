import { SITE_ARTICLES } from "./siteArticles";
import { OBBB_OVERTIME_ARTICLE } from "./healthcareWorkerArticles";
import { BACKUP_CARE_ARTICLE } from "./familyLogisticsArticles";
import { JANUARY_2027_MEDICARE_MEDICAID_CHANGES_ARTICLE } from "./policyChangeArticles";
import { HSA_FSA_ARTICLE } from "./hsaFsaArticle";
import { HEALTHCARE_CONFUSION_ARTICLES } from "./healthcareConfusionArticles";
import { OPEN_ENROLLMENT_ARTICLES } from "./openEnrollmentArticles";
import { publishedArticles } from "@/lib/article-status";

export const ALL_ARTICLES = publishedArticles([
  ...OPEN_ENROLLMENT_ARTICLES,
  ...HEALTHCARE_CONFUSION_ARTICLES,
  HSA_FSA_ARTICLE,
  JANUARY_2027_MEDICARE_MEDICAID_CHANGES_ARTICLE,
  OBBB_OVERTIME_ARTICLE,
  BACKUP_CARE_ARTICLE,
  ...SITE_ARTICLES,
]);
