import { Navigate, useLocation } from "react-router-dom";
import { FOUNDER_HOSPITAL_ECONOMICS_ARTICLES } from "@/data/founderHospitalEconomicsArticles";
import { FOUNDER_HEALTHCARE_SYSTEMS_ARTICLES } from "@/data/founderHealthcareSystemsArticles";
import { FOUNDER_ARTICLE_ENGINE_ARTICLES } from "@/data/founderArticleEngineArticles";
import { ArticlePageView } from "./ArticlePage";

const FOUNDER_ARTICLES = [
  ...FOUNDER_HEALTHCARE_SYSTEMS_ARTICLES,
  ...FOUNDER_HOSPITAL_ECONOMICS_ARTICLES,
  ...FOUNDER_ARTICLE_ENGINE_ARTICLES,
];

const FounderArticlePage = () => {
  const slug = useLocation().pathname.split("/").at(-1) ?? "";
  const article = FOUNDER_ARTICLES.find((candidate) => candidate.slug === slug);

  if (!article) return <Navigate to="/articles" replace />;

  return <ArticlePageView article={article} articleCatalog={FOUNDER_ARTICLES} />;
};

export default FounderArticlePage;
