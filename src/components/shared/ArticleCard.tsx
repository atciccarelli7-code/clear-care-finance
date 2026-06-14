import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/data/articles";

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => (
  <Link
    to={`/articles/${article.slug}`}
    className="group flex flex-col rounded-2xl border border-border bg-card p-6 md:p-7 shadow-card transition-smooth hover:-translate-y-1 hover:shadow-hover hover:border-primary/40"
  >
    <div className="flex items-center gap-3 mb-4">
      <span className="px-2.5 py-1 rounded-full bg-primary-soft text-primary text-xs font-semibold">
        {article.category}
      </span>
      <span className="text-xs text-muted-foreground">{article.readTime}</span>
    </div>
    <h3 className="font-display text-lg md:text-xl font-bold mb-2 group-hover:text-primary transition-smooth">
      {article.title}
    </h3>
    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{article.promise}</p>
    <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
      Read article <ArrowRight className="h-4 w-4" />
    </div>
  </Link>
);
