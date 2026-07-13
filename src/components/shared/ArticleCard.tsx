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
      className="group relative flex min-w-0 max-w-full flex-col break-words rounded-xl border border-border bg-card/65 p-5 transition-smooth hover:border-primary/35 hover:bg-card md:p-6"
    >
      {specialTag && (
        <span className="absolute right-4 top-4 max-w-[9rem] rounded-md border border-primary/20 bg-primary-soft/70 px-2 py-1 text-[0.64rem] font-bold uppercase tracking-[0.12em] text-primary">
          {specialTag}
        </span>
      )}

      <div className={`mb-4 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 ${specialTag ? "pr-32" : ""}`}>
        <span className="max-w-full break-words text-[0.68rem] font-bold uppercase tracking-[0.14em] text-primary">
          {article.category}
        </span>
        <span className="text-xs text-muted-foreground">{article.readTime}</span>
      </div>
      <h3 className="mb-2 font-display text-lg font-bold break-words transition-smooth group-hover:text-primary md:text-xl">
        {article.title}
      </h3>
      <p className="flex-1 text-sm leading-relaxed text-muted-foreground break-words">{article.promise}</p>
      <div className="mt-5 inline-flex max-w-full min-w-0 flex-wrap items-center gap-1.5 break-words text-sm font-semibold text-primary">
        Read article <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
};