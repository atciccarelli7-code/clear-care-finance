import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ClipboardCheck,
  Coffee,
  CreditCard,
  HeartPulse,
  LockKeyhole,
  PiggyBank,
  Receipt,
  Search,
  Shield,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/shared/PageHero";
import { getToolByLegacyAnchor, TOOL_CATEGORIES, TOOLS, type ToolCategory, type ToolDefinition, type ToolIconName } from "@/data/tools";
import { useSeo } from "@/lib/seo";

const TOOL_ICONS: Record<ToolIconName, LucideIcon> = {
  clipboard: ClipboardCheck,
  receipt: Receipt,
  shield: Shield,
  wallet: Wallet,
  heart: HeartPulse,
  coffee: Coffee,
  creditCard: CreditCard,
  piggyBank: PiggyBank,
};

const allCategories = ["All", ...TOOL_CATEGORIES] as const;
type ActiveCategory = (typeof allCategories)[number];

const normalize = (value: string) => value.trim().toLowerCase();

const ToolCard = ({ tool, compact = false }: { tool: ToolDefinition; compact?: boolean }) => {
  const Icon = TOOL_ICONS[tool.icon];

  return (
    <article
      id={tool.legacyAnchorId}
      className="scroll-mt-28 rounded-2xl border border-border bg-card p-5 shadow-card transition-smooth hover:border-primary/40 hover:shadow-hover"
    >
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-secondary">{tool.category}</p>
          <h2 className="mt-1 font-display text-lg font-bold leading-tight break-words">{compact ? tool.shortTitle : tool.title}</h2>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tool.plainEnglishUseCase}</p>
      {!compact && (
        <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
          <div>
            <span className="font-semibold text-foreground">For: </span>
            {tool.audience}
          </div>
          <div>
            <span className="font-semibold text-foreground">Time: </span>
            {tool.estimatedUseTime}
          </div>
        </div>
      )}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild size="sm" className="w-full sm:w-auto">
          <Link to={`/tools/${tool.slug}`}>
            Open tool <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        {tool.relatedArticle && (
          <Link to={tool.relatedArticle.href} className="text-sm font-semibold text-primary hover:underline">
            Related guide
          </Link>
        )}
      </div>
    </article>
  );
};

const Tools = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ActiveCategory>("All");
  const location = useLocation();
  const navigate = useNavigate();

  useSeo({
    title: "Calculators and Checklists",
    description:
      "A plain-English tool library for healthcare workers, patients, open enrollment, medical bills, Medicare, savings, and workplace benefits.",
    canonicalPath: "/tools",
  });

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (!hash) return;

    const tool = getToolByLegacyAnchor(hash);
    if (tool) {
      navigate(`/tools/${tool.slug}`, { replace: true });
    }
  }, [location.hash, navigate]);

  const filteredTools = useMemo(() => {
    const q = normalize(query);
    return TOOLS.filter((tool) => {
      const matchesCategory = category === "All" || tool.category === category;
      const searchable = [
        tool.title,
        tool.shortTitle,
        tool.category,
        tool.audience,
        tool.description,
        tool.plainEnglishUseCase,
      ]
        .join(" ")
        .toLowerCase();
      return matchesCategory && (!q || searchable.includes(q));
    }).sort((a, b) => a.priority - b.priority);
  }, [category, query]);

  const featuredTools = TOOLS.filter((tool) => tool.featured).sort((a, b) => a.priority - b.priority);
  const showFeaturedTools = category === "All" && normalize(query) === "";

  return (
    <>
      <PageHero
        eyebrow="Tools"
        title="Choose one tool. Get one clear answer."
        description="A focused library of calculators and checklists for benefits, medical bills, Medicare, paycheck choices, cafe spending, and student loans."
      >
        <Button asChild variant="hero">
          <a href="#tool-library">Browse tools</a>
        </Button>
      </PageHero>

      <section className="container min-w-0 py-10 md:py-14" id="tool-library">
        <div className="mx-auto mb-8 flex max-w-3xl items-start gap-3 rounded-2xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
          <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <p>Calculations run in your browser. Do not enter account numbers, Social Security numbers, medical records, or other sensitive information.</p>
        </div>

        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-foreground">Search tools</span>
            <span className="relative block">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by topic, bill, Medicare, HSA, 403(b)..."
                className="h-12 w-full rounded-xl border border-border bg-background px-10 text-sm font-medium outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </span>
          </label>

          <div className="flex flex-wrap gap-2" aria-label="Tool categories">
            {allCategories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={`min-h-10 rounded-full border px-4 text-sm font-semibold transition-smooth ${
                  category === item
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {showFeaturedTools && (
          <div className="mb-10">
            <div className="mb-4">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Featured</div>
              <h2 className="font-display text-2xl font-bold">Most-used starting points</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featuredTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} compact />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-9">
          {TOOL_CATEGORIES.map((sectionCategory: ToolCategory) => {
            const tools = filteredTools.filter((tool) => tool.category === sectionCategory);
            if (tools.length === 0) return null;

            return (
              <section key={sectionCategory} className="min-w-0">
                <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{sectionCategory}</div>
                    <h2 className="font-display text-2xl font-bold">{tools.length} {tools.length === 1 ? "tool" : "tools"}</h2>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {tools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-card">
            <h2 className="font-display text-2xl font-bold">No matching tools</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Try a broader term like insurance, paycheck, Medicare, bill, HSA, or loan.
            </p>
            <Button type="button" variant="soft" className="mt-5" onClick={() => { setQuery(""); setCategory("All"); }}>
              Reset filters
            </Button>
          </div>
        )}
      </section>
    </>
  );
};

export default Tools;
