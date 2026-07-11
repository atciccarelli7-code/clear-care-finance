import type { MouseEventHandler } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/data/articles";

interface ArticleCardProps {
  article: Article;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export const ArticleCard = ({ article, onClick }: ArticleCardProps) => {
  const specialTag = (article as Article & { specialTag?: string }).specialTag;

  return (
    <Link
      to={`/articles/${article.slug}`}
      onClick={onClick}
      className="group relative flex min-w-0 max-w-full flex-col break-words rounded-2xl border border-border bg-card p-6 shadow-card transition-smooth hover:-translate-y-1 hover:shadow-hover hover:border-primary/40 md:p-7"
    >
      {specialTag && (
        <span className="absolute right-4 top-4 max-w-[9rem] rounded-full border border-primary/25 bg-primary-soft px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-primary shadow-sm">
          {specialTag}
        </span>
      )}

      <div className={`mb-4 flex min-w-0 flex-wrap items-center gap-3 ${specialTag ? "pr-32" : ""}`}>
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
};
