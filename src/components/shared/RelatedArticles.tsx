import { SectionHeading } from "./SectionHeading";
import { ArticleCard } from "./ArticleCard";
import { ARTICLES } from "@/data/articles";

interface RelatedArticlesProps {
  slugs: string[];
  title?: string;
  description?: string;
}

export const RelatedArticles = ({ slugs, title = "Related articles", description }: RelatedArticlesProps) => {
  const items = slugs.map((s) => ARTICLES.find((a) => a.slug === s)).filter(Boolean) as typeof ARTICLES;
  if (!items.length) return null;
  return (
    <div>
      <SectionHeading eyebrow="Articles" title={title} description={description} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </div>
  );
};
