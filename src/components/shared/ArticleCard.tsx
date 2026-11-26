import { EditorialCover } from "./EditorialCover";
import type { MouseEventHandler } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/data/articles";

type ArticleCardArticle = Pick<Article, "slug" | "title" | "category" | "readTime" | "promise"> & {
  specialTag?: string;
};

interface ArticleCardProps {
  article: ArticleCardArticle;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  featured?: boolean;
  variant?: "brief";
  headingLevel?: 2 | 3;
}

export const ArticleCard = ({ article, onClick, featured = false, variant, headingLevel = 3 }: ArticleCardProps) => {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const brief = variant === "brief";

  return (
    <Link
      to={`/articles/${article.slug}`}
      onClick={onClick}
      aria-label={article.title}
      className={`editorial-story ${featured ? "editorial-story-lead" : ""} ${brief ? "editorial-story-brief" : ""} group`}
    >
      <EditorialCover
        slug={article.slug}
        priority={featured}
        sizes={featured ? "(min-width: 1024px) 60vw, 94vw" : brief ? "112px" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 94vw"}
      />
      <div className="editorial-story-copy">
        <div className="editorial-story-meta">
          <span className="editorial-story-category">{article.category}</span>
          <span>{article.readTime}</span>
          {article.specialTag && <span>{article.specialTag}</span>}
        </div>
        <Heading className="editorial-story-title group-hover:underline decoration-1 underline-offset-4">{article.title}</Heading>
        <p className="editorial-story-promise">{article.promise}</p>
        {featured && <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary" aria-hidden="true">
          Read article <ArrowRight className="h-4 w-4" />
        </span>}
      </div>
    </Link>
  );
};
