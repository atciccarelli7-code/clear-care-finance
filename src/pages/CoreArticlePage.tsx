import { Navigate, useParams } from "react-router-dom";
import { ALL_ARTICLES } from "@/data/allArticles";
import { ArticlePageView } from "./ArticlePage";

const CoreArticlePage = () => {
  const { slug = "" } = useParams();
  const article = ALL_ARTICLES.find((candidate) => candidate.slug === slug);

  if (!article) return <Navigate to="/articles" replace />;

  return <ArticlePageView article={article} articleCatalog={ALL_ARTICLES} />;
};

export default CoreArticlePage;
