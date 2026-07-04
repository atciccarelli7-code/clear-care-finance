import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search } from "lucide-react";
import { ALL_ARTICLES } from "@/data/allArticles";
import { PageHero } from "@/components/shared/PageHero";
import { ArticleCard } from "@/components/shared/ArticleCard";
import { cn } from "@/lib/utils";
import { publishedArticles } from "@/lib/article-status";
import { useSeo } from "@/lib/seo";

const priorityArticleSlugs = [
  "how-to-read-an-eob",
  "deductible-copay-coinsurance-out-of-pocket-max",
  "spouse-family-health-insurance-open-enrollment",
  "accident-critical-illness-hospital-indemnity-open-enrollment",
  "prescription-coverage-open-enrollment-checklist",
  "facility-fee-vs-professional-fee",
];

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
  const priorityArticles = useMemo(
    () => priorityArticleSlugs
      .map((slug) => published.find((article) => article.slug === slug))
      .filter((article): article is (typeof published)[number] => Boolean(article)),
    [published],
  );

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

        {priorityArticles.length > 0 && (
          <div className="mb-10 rounded-3xl border border-primary/15 bg-primary-soft/30 p-5 shadow-card md:p-7">
            <div className="mb-5 max-w-3xl">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Start with the most searched questions</div>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">High-use insurance and bill guides</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                These guides answer the EOB, out-of-pocket maximum, spouse coverage, supplemental insurance, prescription, and facility-fee questions people are already searching for.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {priorityArticles.map((article) => (
                <Link
                  key={article.slug}
                  to={`/articles/${article.slug}`}
                  className="group rounded-2xl border border-border bg-background/85 p-4 shadow-sm transition-smooth hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card"
                >
                  <div className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-secondary">{article.category}</div>
                  <h3 className="mt-2 font-display text-base font-bold leading-tight text-foreground">{article.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{article.promise}</p>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                    Read guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

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
