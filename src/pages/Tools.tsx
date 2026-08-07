import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calculator,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Coffee,
  Compass,
  GraduationCap,
  HeartPulse,
  Landmark,
  Layers3,
  ListFilter,
  PiggyBank,
  Receipt,
  Search,
  Shield,
  Wallet,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { roadmapTools } from "@/data/roadmapTools";
import { getToolByLegacyAnchor, getToolHref, tools, type ToolCategory, type ToolIconKey } from "@/data/tools";
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

type ToolJob = "All decisions" | "Work, pay & benefits" | "Healthcare costs & bills" | "Medicare & caregiving" | "Loans, debt & retirement";

const TOOL_JOBS: Array<{ label: ToolJob; categories: ToolCategory[] }> = [
  { label: "All decisions", categories: ["Workplace benefits", "Open enrollment", "Medical bills", "Student loans", "Medicare & caregiving", "Everyday money"] },
  { label: "Work, pay & benefits", categories: ["Workplace benefits", "Open enrollment"] },
  { label: "Healthcare costs & bills", categories: ["Medical bills"] },
  { label: "Medicare & caregiving", categories: ["Medicare & caregiving"] },
  { label: "Loans, debt & retirement", categories: ["Student loans", "Everyday money"] },
];

const PUBLIC_TOOL_NAMES: Record<string, string> = {
  "healthcare-worker-benefits-blueprint": "Healthcare Worker Benefits Guide",
  "medical-bill-review-flow": "Medical Bill Review Guide",
  "supplemental-benefits-decision-helper": "Supplemental Benefits Comparison",
  "hsa-vs-fsa-decision-helper": "HSA vs FSA Comparison",
  "student-loan-path-finder": "Student Loan Repayment Guide",
  "debt-vs-retirement-router": "Debt vs Retirement Guide",
  "roth-vs-traditional-decision-helper": "Roth vs Traditional Assessment",
  "medicare-advantage-plan-helper": "Medicare Advantage Plan Guide",
};

const publicToolName = (slug: string, fallback: string) => PUBLIC_TOOL_NAMES[slug] ?? fallback;

const Tools = () => {
  const [query, setQuery] = useState("");
  const [job, setJob] = useState<ToolJob>("All decisions");
  const [legacySelection, setLegacySelection] = useState<string | null>(null);

  useSeo({
    title: "Free Financial Calculators, Checklists, and Decision Tools",
    description:
      "Browse free calculators, checklists, comparisons, and guides for benefits, medical bills, Medicare, student loans, retirement, and everyday money.",
    canonicalPath: "/tools",
  });

  useEffect(() => {
    const anchor = window.location.hash.slice(1);
    if (!anchor) return;
    if (anchor === "all-tools" || anchor === "browse-all-tools") {
      window.requestAnimationFrame(() => document.getElementById("all-tools")?.scrollIntoView({ behavior: "smooth", block: "start" }));
      return;
    }
    const match = getToolByLegacyAnchor(anchor);
    if (!match) return;
    setJob("All decisions");
    setQuery("");
    setLegacySelection(match.slug);
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(`tool-${match.slug}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const activeCategories = TOOL_JOBS.find((item) => item.label === job)?.categories ?? [];
  const filteredTools = allTools.filter((tool) => {
    const matchesJob = activeCategories.includes(tool.category);
    const haystack = `${tool.title} ${tool.shortTitle} ${tool.description} ${tool.category} ${tool.audience}`.toLowerCase();
    return matchesJob && (!normalizedQuery || haystack.includes(normalizedQuery));
  });

  const trackOpen = (slug: string, title: string) => {
    trackToolEvent("tool_intent_click", slug, title);
  };

  return (
    <>
      <PageHero
        eyebrow="Free calculators and decision tools"
        title="Use every public tool on this page without paying."
        description="Search by the decision in front of you. Each calculator, checklist, comparison, and guide completes one bounded task without requiring an account or purchase."
      >
        <Button asChild variant="hero" size="lg"><a href="#tool-search-heading">Search free tools</a></Button>
        <Button asChild variant="outline" size="lg"><Link to="/start-here">Not sure? Start Here</Link></Button>
      </PageHero>

      <section className="container max-w-5xl min-w-0 pt-10 md:pt-12" aria-labelledby="free-tool-boundary-heading">
        <div className="grid gap-5 rounded-3xl border border-primary/20 bg-primary-soft/20 p-6 shadow-card md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Public tools
            </div>
            <h2 id="free-tool-boundary-heading" className="mt-2 font-display text-2xl font-bold tracking-tight">
              A useful result stays free.
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Use a focused tool for one bounded question. When several workplace-benefit decisions need to be coordinated together, the complete Benefits Decision System is also available as a free browser-local workflow.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
            <Button asChild>
              <Link to="/products/healthcare-worker-benefits-decision-system">
                Open the Decision System <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <span className="text-center text-xs font-semibold text-muted-foreground">Free · browser-local</span>
          </div>
        </div>
      </section>

      <section className="container max-w-4xl min-w-0 pt-10 md:pt-12" aria-labelledby="tool-search-heading">
        <div className="border-y border-border py-5">
          <div className="grid gap-4 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] md:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Know what you need?</div>
              <h2 id="tool-search-heading" className="mt-1 font-display text-xl font-bold">Search by the real-world question.</h2>
              <p className="mt-1 text-sm text-muted-foreground">Examples: medical bill, 403(b) match, compare health plans, Medicare, student loan.</p>
            </div>
            <label className="relative block">
              <span className="sr-only">Search all CAF tools</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try “medical bill” or “employer match”"
                className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-base text-foreground outline-none transition-smooth placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 md:text-sm"
              />
            </label>
          </div>
        </div>
      </section>

      <section id="all-tools" className="container min-w-0 scroll-mt-24 py-12 md:py-16" aria-labelledby="all-tools-heading">
        <div className="rounded-2xl border border-border bg-card/70 p-5 md:p-7">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground"><ListFilter className="h-4 w-4" aria-hidden="true" /> Browse by topic</div>
            <h2 id="all-tools-heading" className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">All free tools</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Choose a topic, then open the calculator, checklist, comparison, or guide responsible for the answer.</p>
          </div>

          <div id="all-tools-directory" className="mt-7 border-t border-border pt-7">
            <div className="flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filter tools by the job you need to complete">
              {TOOL_JOBS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setJob(item.label)}
                  aria-pressed={job === item.label}
                  className={`min-h-11 shrink-0 rounded-lg border px-4 text-sm font-semibold transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    job === item.label
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
              Showing {filteredTools.length} of {allTools.length} tools for {job.toLowerCase()}
            </p>

            {filteredTools.length > 0 ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredTools.map((tool) => {
                  const Icon = iconByKey[tool.icon];
                  const highlighted = legacySelection === tool.slug;
                  const displayName = publicToolName(tool.slug, tool.title);
                  return (
                    <article
                      id={`tool-${tool.slug}`}
                      key={tool.slug}
                      className={`scroll-mt-28 rounded-xl border bg-background/65 p-5 transition-smooth ${
                        highlighted ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/25"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-soft text-primary">
                          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">{tool.category}</div>
                          <h3 className="mt-1 font-display text-lg font-bold leading-tight">{displayName}</h3>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
                      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-muted-foreground">
                        <span>{tool.audience}</span><span aria-hidden="true">·</span><span>{tool.estimatedUseTime}</span><span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1"><Check className="h-3.5 w-3.5" aria-hidden="true" /> Free educational tool</span>
                      </div>
                      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <Link
                          to={getToolHref(tool)}
                          onClick={() => trackOpen(tool.slug, displayName)}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-smooth hover:bg-primary/90"
                        >
                          Open {displayName} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        {tool.relatedArticle && (
                          <Link className="text-center text-sm font-semibold text-primary underline-offset-4 hover:underline" to={tool.relatedArticle.href}>Read the guide</Link>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
                <h3 className="font-display text-xl font-bold">No tool matched that search.</h3>
                <p className="mt-2 text-sm text-muted-foreground">Try a broader term such as “bill,” “benefits,” “loan,” “retirement,” or “Medicare.”</p>
                <button type="button" onClick={() => { setQuery(""); setJob("All decisions"); }} className="mt-4 text-sm font-bold text-primary underline-offset-4 hover:underline">Clear filters</button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container min-w-0 pb-10" aria-labelledby="coordinated-workflow-heading">
        <div className="grid gap-5 rounded-3xl border border-border bg-card p-6 shadow-card md:grid-cols-[auto_1fr_auto] md:items-center md:p-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Layers3 className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Need a coordinated benefits workflow?</div>
            <h2 id="coordinated-workflow-heading" className="mt-2 font-display text-2xl font-bold">Use the Benefits Decision System when several choices connect.</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The guided workflow brings plan costs, prescriptions, accounts, retirement, protection benefits, deadlines, verification questions, browser-local progress, and a final decision brief into one sequence. It is available now without an account or purchase.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/products/healthcare-worker-benefits-decision-system">Open the guided system</Link>
          </Button>
        </div>
      </section>

      <section className="container min-w-0 pb-16">
        <NewsletterSignup
          source="tools"
          title="Get one useful healthcare-finance resource each month"
          description="A calm monthly email on workplace benefits, healthcare costs, retirement, insurance, Medicare, Medicaid, and new CAF tools."
        />
      </section>
    </>
  );
};

export default Tools;