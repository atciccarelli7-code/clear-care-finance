import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calculator,
  Check,
  ClipboardCheck,
  Coffee,
  Compass,
  GraduationCap,
  HeartPulse,
  Landmark,
  PiggyBank,
  Receipt,
  Search,
  Shield,
  Sparkles,
  Wallet,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { roadmapTools } from "@/data/roadmapTools";
import { TOOL_CATEGORIES, getToolByLegacyAnchor, getToolHref, tools, type ToolCategory, type ToolIconKey } from "@/data/tools";
import { trackToolEvent } from "@/lib/siteAnalytics";
import { useSeo } from "@/lib/seo";

const iconByKey: Record<ToolIconKey, typeof Calculator> = {
  calculator: Calculator,
  clipboard: ClipboardCheck,
  coffee: Coffee,
  compass: Compass,
  graduation: GraduationCap,
  heart: HeartPulse,
  landmark: Landmark,
  piggyBank: PiggyBank,
  receipt: Receipt,
  shield: Shield,
  wallet: Wallet,
};

const allTools = [...tools, ...roadmapTools];

const Tools = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All tools" | ToolCategory>("All tools");
  const [legacySelection, setLegacySelection] = useState<string | null>(null);

  useSeo({
    title: "Financial Calculators, Checklists, and Decision Tools",
    description:
      "Browse focused financial tools for healthcare workers, patients, benefits, medical bills, Medicare, student loans, and everyday money decisions.",
    canonicalPath: "/tools",
  });

  useEffect(() => {
    const anchor = window.location.hash.slice(1);
    if (!anchor) return;
    const match = getToolByLegacyAnchor(anchor);
    if (!match) return;
    setCategory("All tools");
    setQuery("");
    setLegacySelection(match.slug);
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(`tool-${match.slug}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredTools = allTools.filter((tool) => {
    const matchesCategory = category === "All tools" || tool.category === category;
    const haystack = `${tool.title} ${tool.shortTitle} ${tool.description} ${tool.category} ${tool.audience}`.toLowerCase();
    return matchesCategory && (!normalizedQuery || haystack.includes(normalizedQuery));
  });

  const featuredTools = allTools.filter((tool) => tool.featured);

  const trackOpen = (slug: string, title: string) => {
    trackToolEvent("tool_intent_click", slug, title);
  };

  return (
    <>
      <PageHero
        eyebrow="Financial tools"
        title="Find the right tool without scrolling through every calculator."
        description="Choose the decision first. Each calculator, checklist, or guided workflow now opens on its own focused page."
      />

      <section className="container min-w-0 pt-10 md:pt-12" aria-labelledby="featured-tools-heading">
        <div className="mb-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <Sparkles className="h-4 w-4" aria-hidden="true" /> Best places to start
          </div>
          <h2 id="featured-tools-heading" className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
            Start with a complete decision workflow
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
            These tools turn a real question into an explanation, action plan, and list of details to verify.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredTools.slice(0, 12).map((tool) => {
            const Icon = iconByKey[tool.icon];
            return (
              <Link
                key={tool.slug}
                to={getToolHref(tool)}
                onClick={() => trackOpen(tool.slug, tool.title)}
                className="group flex min-w-0 flex-col rounded-3xl border border-primary/15 bg-gradient-to-br from-card to-primary-soft/25 p-5 shadow-card transition-smooth hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-hover"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="rounded-full border border-border bg-background/75 px-2.5 py-1 text-[0.66rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    {tool.estimatedUseTime}
                  </span>
                </div>
                <div className="mt-4 text-[0.66rem] font-bold uppercase tracking-[0.16em] text-secondary">{tool.category}</div>
                <h3 className="mt-1.5 font-display text-lg font-bold leading-tight text-foreground">{tool.shortTitle}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                  Open tool <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container min-w-0 py-12 md:py-16" aria-labelledby="all-tools-heading">
        <div className="rounded-[2rem] border border-border bg-card p-5 shadow-card md:p-7">
          <div className="grid gap-5 lg:grid-cols-[1fr_380px] lg:items-end">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Full directory</div>
              <h2 id="all-tools-heading" className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">Browse every tool</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Search by the question, cost, benefit, or document you are working with. No account is required.
              </p>
            </div>
            <label className="relative block">
              <span className="sr-only">Search tools</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search bills, 403(b), Medicare…"
                className="h-12 w-full rounded-2xl border border-border bg-background pl-11 pr-4 text-base text-foreground shadow-sm outline-none transition-smooth placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 md:text-sm"
              />
            </label>
          </div>

          <div className="mt-6 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filter tools by category">
            {TOOL_CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  category === item
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
            Showing {filteredTools.length} of {allTools.length} tools
          </p>

          {filteredTools.length > 0 ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredTools.map((tool) => {
                const Icon = iconByKey[tool.icon];
                const highlighted = legacySelection === tool.slug;
                return (
                  <article
                    id={`tool-${tool.slug}`}
                    key={tool.slug}
                    className={`scroll-mt-28 rounded-3xl border bg-background/70 p-5 transition-smooth ${
                      highlighted ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/25"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-secondary">{tool.category}</div>
                        <h3 className="mt-1 font-display text-lg font-bold leading-tight">{tool.title}</h3>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
                      <span className="rounded-full bg-muted px-2.5 py-1">{tool.audience}</span>
                      <span className="rounded-full bg-muted px-2.5 py-1">{tool.estimatedUseTime}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1"><Check className="h-3.5 w-3.5" aria-hidden="true" /> Educational</span>
                    </div>
                    <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <Link
                        to={getToolHref(tool)}
                        onClick={() => trackOpen(tool.slug, tool.title)}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-smooth hover:bg-primary/90"
                      >
                        Open tool <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      {tool.relatedArticle && (
                        <Link className="text-center text-sm font-semibold text-primary underline-offset-4 hover:underline" to={tool.relatedArticle.href}>
                          Read the guide
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-3xl border border-dashed border-border bg-muted/25 p-8 text-center">
              <h3 className="font-display text-xl font-bold">No tool matched that search.</h3>
              <p className="mt-2 text-sm text-muted-foreground">Try a broader term such as “bill,” “benefits,” “loan,” or “Medicare.”</p>
              <button type="button" onClick={() => { setQuery(""); setCategory("All tools"); }} className="mt-4 text-sm font-bold text-primary underline-offset-4 hover:underline">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="container min-w-0 pb-16">
        <NewsletterSignup
          source="tools"
          title="Want the Healthcare Worker Money Map in your inbox?"
          description="Get the checklist and a short monthly email on paychecks, benefits, insurance, debt, and investing decisions healthcare workers actually face."
        />
      </section>
    </>
  );
};

export default Tools;
