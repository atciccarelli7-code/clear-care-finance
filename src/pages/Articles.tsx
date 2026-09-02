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
import { PageHero } from "@/components/shared/PageHero";
import { ArticleCard } from "@/components/shared/ArticleCard";
import { cn } from "@/lib/utils";
import { publishedArticles } from "@/lib/article-status";
import { useSeo } from "@/lib/seo";

const featuredArticleSlugs = [
  "why-hospitals-become-the-systems-shock-absorber",
  "home-with-family-is-not-a-free-care-plan",
  "20-dollar-tylenol-hospital-prices",
  "what-nonprofit-hospital-actually-means",
  "why-hospitals-care-about-length-of-stay",
  "why-just-send-them-to-rehab-is-not-simple",
] as const;

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
    () => featuredArticleSlugs
      .map((slug) => published.find((article) => article.slug === slug))
      .filter((article): article is (typeof published)[number] => Boolean(article)),
    [published],
  );
  const primaryLibrary = useMemo(
    () => published.filter(
      (article) => !featuredArticleSlugs.includes(article.slug as (typeof featuredArticleSlugs)[number])
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
      const searchableArticles = normalizedQuery ? published : primaryLibrary;

      return searchableArticles.filter((article) => {
        const matchesArea = area === "All" || getEditorialAreaId(article) === area;
        const matchesQuery = !normalizedQuery
          || `${article.title} ${article.promise} ${article.summary}`.toLowerCase().includes(normalizedQuery);
        return matchesArea && matchesQuery;
      });
    },
    [area, primaryLibrary, published, q],
  );

  return (
    <>
      <PageHero
        eyebrow="The CAF publication"
        title="Healthcare finance and the business of care, explained from inside the system."
        description={`${published.length} RN-led, source-backed articles about hospital money, insurance rules, patient costs, Medicare, Medicaid, care transitions, and healthcare-worker finances.`}
      />

      <section className="container py-12">
        <div className="mb-12">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Featured now</div>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">Inside hospitals: prices, capacity, classification, and the work after discharge</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              These pieces begin with Andrew's nursing and care-transition observations, then add the payment rules, primary evidence, and practical implications that are usually missing from the conversation.
            </p>
          </div>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {featuredArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}
          </div>
        </div>

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

        <div className="mb-5">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Explore the core library</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Browse the main publication by subject, or search all {published.length} articles by the words on your bill, plan, discharge paperwork, or workplace benefit.
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

        <div className="mb-12 flex flex-wrap gap-2" aria-label="Filter the core article library">
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">No articles match that search yet.</div>
        )}

        {!q.trim() && additionalGuides.length > 0 && (
          <details className="mt-14 rounded-2xl border border-border bg-muted/20 p-5 md:p-7">
            <summary className="cursor-pointer font-display text-xl font-bold text-foreground marker:text-primary">
              Additional practical guides ({additionalGuides.length})
            </summary>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              These older reference guides remain available for specific questions, but they are not the clearest expression of CAF's RN-led healthcare-systems reporting.
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
