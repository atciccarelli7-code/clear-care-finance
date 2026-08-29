import { Navigate, useParams } from "react-router-dom";
import { CORE_ARTICLES } from "@/data/coreArticles";
import { ArticlePageView } from "./ArticlePage";

const CoreArticlePage = () => {
  const { slug = "" } = useParams();
  const article = CORE_ARTICLES.find((candidate) => candidate.slug === slug);

  if (!article) return <Navigate to="/articles" replace />;

  return <ArticlePageView article={article} articleCatalog={CORE_ARTICLES} />;
};

export default CoreArticlePage;
