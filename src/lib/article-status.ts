import type { Article } from "@/data/articles";

const ARTICLE_PLACEHOLDER = /paste this article from notion/i;

export const isArticleDraft = (article: Pick<Article, "body">) =>
  article.body.some((paragraph) => ARTICLE_PLACEHOLDER.test(paragraph));

export const publishedArticles = (articles: Article[]) =>
  articles.filter((article) => !isArticleDraft(article));
