import { Navigate, useLocation } from "react-router-dom";
import { FOUNDER_HOSPITAL_ECONOMICS_ARTICLES } from "@/data/founderHospitalEconomicsArticles";
import { ArticlePageView } from "./ArticlePage";

const FounderArticlePage = () => {
  const slug = useLocation().pathname.split("/").at(-1) ?? "";
  const article = FOUNDER_HOSPITAL_ECONOMICS_ARTICLES.find((candidate) => candidate.slug === slug);

  if (!article) return <Navigate to="/articles" replace />;

  return <ArticlePageView article={article} />;
};

export default FounderArticlePage;
