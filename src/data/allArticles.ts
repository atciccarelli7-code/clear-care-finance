import { SITE_ARTICLES } from "./siteArticles";
import { OBBB_OVERTIME_ARTICLE } from "./healthcareWorkerArticles";
import { BACKUP_CARE_ARTICLE } from "./familyLogisticsArticles";
import { publishedArticles } from "@/lib/article-status";

export const ALL_ARTICLES = publishedArticles([OBBB_OVERTIME_ARTICLE, BACKUP_CARE_ARTICLE, ...SITE_ARTICLES]);
