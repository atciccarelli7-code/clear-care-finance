import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ALL_ARTICLES } from "@/data/allArticles";
import { PageHero } from "@/components/shared/PageHero";
import { ArticleCard } from "@/components/shared/ArticleCard";
import { cn } from "@/lib/utils";
import { publishedArticles } from "@/lib/article-status";
import { useSeo } from "@/lib/seo";

const Articles = () => {
  useSeo({
    title: "Articles",
    description: "Plain-English healthcare finance articles for healthcare workers, patients, caregivers, benefits, hospital bills, Medicare, Medicaid, and open enrollment.",
    canonicalPath: "/articles",
  });

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const published = useMemo(() => publishedArticles(ALL_ARTICLES), []);
  const categories = useMemo(() => ["All", ...Array.from(new Set(published.map((article) => article.category))).sort()], [published]);

  const filtered = useMemo(
    () =>
      published.filter((a) => {
        const matchesCat = cat === "All" || a.category === cat;
        const matchesQ = !q || (a.title + " " + a.promise + " " + a.summary).toLowerCase().includes(q.toLowerCase());
        return matchesCat && matchesQ;
      }),
    [published, q, cat],
  );

  return (
    <>
      <PageHero
        eyebrow="Articles"
        title="Short, honest reads."
        description={`${published.length} plain-English guides for healthcare workers, patients, families, and caregivers.`}
      />

      <section className="container py-12">
        <div className="max-w-xl mx-auto relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles..."
            className="pl-11 h-12 rounded-full"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold transition-smooth border",
                cat === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">No articles match that search yet.</div>
        )}
      </section>
    </>
  );
};

export default Articles;
