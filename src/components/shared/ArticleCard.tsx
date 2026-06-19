import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/data/articles";

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => (
  <Link
    to={`/articles/${article.slug}`}
    className="group flex min-w-0 max-w-full flex-col break-words rounded-2xl border border-border bg-card p-6 shadow-card transition-smooth hover:-translate-y-1 hover:shadow-hover hover:border-primary/40 md:p-7"
  >
    <div className="mb-4 flex min-w-0 flex-wrap items-center gap-3">
      <span className="max-w-full break-words rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
        {article.category}
      </span>
      <span className="text-xs text-muted-foreground">{article.readTime}</span>
    </div>
    <h3 className="font-display text-lg md:text-xl font-bold mb-2 group-hover:text-primary transition-smooth break-words">
      {article.title}
    </h3>
    <p className="text-sm text-muted-foreground leading-relaxed flex-1 break-words">{article.promise}</p>
    <div className="mt-5 inline-flex max-w-full min-w-0 flex-wrap items-center gap-1.5 break-words text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
      Read article <ArrowRight className="h-4 w-4 shrink-0" />
    </div>
  </Link>
);
