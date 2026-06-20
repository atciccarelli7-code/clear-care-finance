import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import type { Article } from "@/data/articles";

interface CompactArticleCardProps {
  article: Article;
}

export const CompactArticleCard = ({ article }: CompactArticleCardProps) => (
  <Link
    to={`/articles/${article.slug}`}
    className="group flex min-w-0 max-w-full flex-col break-words rounded-2xl border border-border bg-card/80 p-4 shadow-card transition-smooth hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-hover md:p-5"
  >
    <div className="mb-2 inline-flex min-w-0 items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <Clock className="h-3.5 w-3.5 shrink-0" />
      <span>{article.readTime}</span>
    </div>

    <h3 className="font-display text-base font-bold leading-snug text-foreground transition-smooth group-hover:text-primary md:text-lg">
      {article.title}
    </h3>

    <p className="mt-2 text-sm leading-relaxed text-muted-foreground break-words md:line-clamp-2">
      {article.promise}
    </p>

    <div className="mt-4 inline-flex min-w-0 items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5">
      Read guide <ArrowRight className="h-4 w-4 shrink-0" />
    </div>
  </Link>
);