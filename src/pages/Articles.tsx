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

const featuredArticleSlugs = [
  "20-dollar-tylenol-hospital-prices",
  "what-nonprofit-hospital-actually-means",
  "why-hospitals-care-about-length-of-stay",
  "why-just-send-them-to-rehab-is-not-simple",
] as const;

const searchOpportunityArticleSlugs = [
  "how-hospital-403b-matching-works",
  "allowed-amount-medical-bills",
  "facility-fee-vs-professional-fee",
  "check-hospital-financial-assistance-before-paying",
  "observation-vs-inpatient-status",
] as const;

const subjectLinks = [
  { label: "Hospital economics", href: "/topics/hospital-economics" },
  { label: "Healthcare costs", href: "/insurance" },
  { label: "Patients & caregivers", href: "/patients-families" },
  { label: "Medicare & Medicaid", href: "/medicare-care-costs" },
  { label: "Healthcare workers", href: "/healthcare-workers" },
] as const;

const Articles = () => {
  useSeo({
    title: "Healthcare Economics and Finance Articles",
    description: "RN-led, source-backed reporting on hospital economics, healthcare costs, insurance, care transitions, Medicare, Medicaid, and healthcare-worker finances.",
    canonicalPath: "/articles",
  });

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const published = useMemo(() => publishedArticles(ALL_ARTICLES), []);
  const categories = useMemo(() => ["All", ...Array.from(new Set(published.map((article) => article.category))).sort()], [published]);
  const featuredArticles = useMemo(
    () => featuredArticleSlugs
      .map((slug) => published.find((article) => article.slug === slug))
      .filter((article): article is (typeof published)[number] => Boolean(article)),
    [published],
  );
  const searchOpportunityArticles = useMemo(
    () => searchOpportunityArticleSlugs
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
        eyebrow="The CAF publication"
        title="Healthcare finance and the business of care, explained from inside the system."
        description={`${published.length} RN-led, source-backed articles about hospital money, insurance rules, patient costs, Medicare, Medicaid, care transitions, and healthcare-worker finances.`}
      />

      <section className="container py-12">
        <div className="mb-12">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Featured now</div>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">Inside hospitals: prices, margins, capacity, and the path after discharge</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              These pieces begin with Andrew's nursing and care-transition observations, then add the payment rules, primary evidence, and practical implications that are usually missing from the conversation.
            </p>
          </div>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {featuredArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}
          </div>
        </div>

        {searchOpportunityArticles.length > 0 && (
          <div className="mb-10 rounded-3xl border border-primary/15 bg-primary-soft/30 p-5 shadow-card md:p-7">
            <div className="mb-5 max-w-3xl">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Current search opportunities</div>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">Questions Google is already testing CAF against</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                CAF is still very early. These pages are receiving some search exposure, so they are being kept visible and improved without pretending a few impressions are a proven content business.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {searchOpportunityArticles.map((article) => (
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

        <nav aria-label="Browse articles by subject" className="mb-10 rounded-2xl border border-border bg-card/55 p-4 md:p-5">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Browse by subject</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {subjectLinks.map((link) => (
              <Link key={link.href} to={link.href} className="rounded-full border border-border bg-background px-3.5 py-2 text-sm font-semibold text-foreground transition-smooth hover:border-primary/40 hover:text-primary">
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="mb-5">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Browse the complete article library</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Search by the words on your bill, plan, discharge paperwork, or workplace benefit.</p>
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
