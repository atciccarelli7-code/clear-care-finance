import { VisualExplainerIndex } from "@/components/visual-explainers/article-visuals/VisualExplainer";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search } from "lucide-react";
import { ALL_ARTICLES } from "@/data/allArticles";
import {
  DE_EMPHASIZED_ARTICLE_SLUGS,
  EDITORIAL_AREAS,
  type EditorialAreaId,
  getEditorialAreaId,
} from "@/data/editorialLibrary";
import { FLAGSHIP_VISUAL_ARTICLES } from "@/data/flagshipVisualArticles";
import { visualIndexPath } from "@/components/visual-explainers/article-visuals/visualRoutes";
import { ArticleCard } from "@/components/shared/ArticleCard";
import { cn } from "@/lib/utils";
import { publishedArticles } from "@/lib/article-status";
import { useSeo } from "@/lib/seo";

const featuredArticleSlugs = new Set(FLAGSHIP_VISUAL_ARTICLES.map(article => article.slug));

const Articles = () => {
  useSeo({
    title: "Healthcare Economics and Finance Articles",
    description: "RN-led, source-backed reporting on hospital economics, healthcare costs, insurance, care transitions, Medicare, Medicaid, and healthcare-worker finances.",
    canonicalPath: "/articles",
  });

  const [q, setQ] = useState("");
  const [area, setArea] = useState<EditorialAreaId | "All">("All");
  const published = useMemo(() => publishedArticles(ALL_ARTICLES), []);
  const featuredArticles = useMemo(
    () => [...featuredArticleSlugs]
      .map((slug) => published.find((article) => article.slug === slug))
      .filter((article): article is (typeof published)[number] => Boolean(article)),
    [published],
  );
  const primaryLibrary = useMemo(
    () => published.filter(
      (article) => !featuredArticleSlugs.has(article.slug)
        && !DE_EMPHASIZED_ARTICLE_SLUGS.has(article.slug),
    ),
    [published],
  );
  const additionalGuides = useMemo(
    () => published.filter((article) => DE_EMPHASIZED_ARTICLE_SLUGS.has(article.slug)),
    [published],
  );
  const areaCounts = useMemo(
    () => Object.fromEntries(
      EDITORIAL_AREAS.map((editorialArea) => [
        editorialArea.id,
        published.filter((article) => getEditorialAreaId(article) === editorialArea.id).length,
      ]),
    ) as Record<EditorialAreaId, number>,
    [published],
  );

  const filtered = useMemo(
    () => {
      const normalizedQuery = q.trim().toLowerCase();
      const searchableArticles = normalizedQuery || area !== "All" ? published : primaryLibrary;
      const areaArticles = searchableArticles.filter(
        (article) => area === "All" || getEditorialAreaId(article) === area,
      );
      if (!normalizedQuery) return areaArticles;

      return areaArticles
        .map((article) => {
          const title = article.title.toLowerCase();
          const match = title.startsWith(normalizedQuery) ? 3
            : title.includes(normalizedQuery) ? 2
            : `${article.promise} ${article.summary}`.toLowerCase().includes(normalizedQuery) ? 1 : 0;
          return { article, match };
        })
        .filter(({ match }) => match > 0)
        .sort((a, b) => b.match - a.match)
        .map(({ article }) => article);
    },
    [area, primaryLibrary, published, q],
  );

  const browsingAll = !q.trim() && area === "All";

  return (
    <>
      <header className="publication-intro">
        <div className="container publication-masthead">
          <p className="publication-kicker">Community Acquired Finance</p>
          <div className="publication-masthead-grid">
            <h1>CAF Article Library</h1>
            <div>
              <p className="publication-deck">RN-led reporting and practical guides on healthcare costs, coverage, and care transitions.</p>
              <Link to={visualIndexPath} onClick={() => { setQ(""); setArea("All"); }} className="publication-link mt-3 inline-block text-sm font-semibold">Jump to visual explainers</Link>
            </div>
          </div>
        </div>
      </header>

      <section className="container py-6 md:py-10">
        <div className="mb-5">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Explore the core library</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Search by a phrase from your bill, plan, or discharge paperwork.
          </p>
        </div>

        <div className="relative mb-6 max-w-xl">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles..."
            aria-label="Search the CAF article library"
            className="h-12 rounded-full pl-11"
          />
        </div>

        <div className="mb-12 flex flex-wrap gap-2" role="group" aria-label="Filter the core article library">
          {[{ id: "All" as const, label: "All core articles" }, ...EDITORIAL_AREAS].map((editorialArea) => (
            <button
              key={editorialArea.id}
              type="button"
              aria-pressed={area === editorialArea.id}
              onClick={() => setArea(editorialArea.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold transition-smooth border",
                area === editorialArea.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
              )}
            >
              {editorialArea.label}
            </button>
          ))}
        </div>

        {browsingAll && (
          <>
            <section className="mb-12" aria-labelledby="archive-essential-heading">
              <div className="publication-section-rule">
                <h2 id="archive-essential-heading" className="publication-section-title">Essential reading</h2>
              </div>
              <div className="grid gap-x-7 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                {featuredArticles.map(article => <ArticleCard key={article.slug} article={article} />)}
              </div>
            </section>
            <VisualExplainerIndex />

            <nav aria-label="CAF editorial subjects" className="mb-12">
              <div className="mb-5 max-w-3xl">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Five editorial desks</div>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">The questions CAF helps you understand</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  Start with the part of the healthcare system shaping the decision in front of you.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {EDITORIAL_AREAS.map((editorialArea) => (
                  <Link
                    key={editorialArea.id}
                    to={editorialArea.href}
                    className="group rounded-2xl border border-border bg-card/55 p-5 shadow-sm transition-smooth hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card"
                  >
                    <div className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-secondary">
                      {editorialArea.label} · {areaCounts[editorialArea.id]} articles
                    </div>
                    <h3 className="mt-2 font-display text-lg font-bold leading-tight text-foreground">{editorialArea.question}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{editorialArea.description}</p>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                      Explore this subject <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </nav>

          </>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <ArticleCard key={a.slug} article={a} headingLevel={2} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div role="status" className="text-center py-16 text-muted-foreground">No articles match that search yet.</div>
        )}

        {browsingAll && additionalGuides.length > 0 && (
          <details className="mt-14 rounded-2xl border border-border bg-muted/20 p-5 md:p-7">
            <summary className="cursor-pointer font-display text-xl font-bold text-foreground marker:text-primary">
              Additional practical guides ({additionalGuides.length})
            </summary>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              More references on healthcare work, benefits, and personal finance.
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {additionalGuides.map((article) => <ArticleCard key={article.slug} article={article} />)}
            </div>
          </details>
        )}
      </section>
    </>
  );
};

export default Articles;
