import {
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  Coffee,
  CreditCard,
  HeartPulse,
  PiggyBank,
  Receipt,
  Shield,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalculatorCard } from "@/components/shared/CalculatorCard";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { PageHero } from "@/components/shared/PageHero";
import { ToolRenderer } from "@/components/calculators/ToolRenderer";
import { getRelatedTools, getToolBySlug, TOOL_CATEGORY_GUIDANCE, type ToolIconName } from "@/data/tools";
import { useSeo } from "@/lib/seo";
import NotFound from "@/pages/NotFound";

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

const ToolPage = () => {
  const { toolSlug } = useParams();
  const tool = getToolBySlug(toolSlug);

  useSeo({
    title: tool ? tool.title : "Tool",
    description: tool
      ? `${tool.description} ${tool.plainEnglishUseCase}`
      : "Plain-English healthcare finance calculator or checklist.",
    canonicalPath: tool ? `/tools/${tool.slug}` : "/tools",
  });

  if (!tool) return <NotFound />;

  const Icon = TOOL_ICONS[tool.icon];
  const relatedTools = getRelatedTools(tool);
  const categoryGuidance = TOOL_CATEGORY_GUIDANCE[tool.category];
  const assumptionNotes = [...categoryGuidance.assumptionNotes, ...(tool.assumptionNotes ?? [])];
  const sourceNotes = [...categoryGuidance.sourceNotes, ...(tool.sourceNotes ?? [])];

  return (
    <>
      <PageHero eyebrow={tool.category} title={tool.title} description={tool.description}>
        <Button asChild variant="outline" size="sm">
          <Link to="/tools">
            <ArrowLeft className="h-4 w-4" /> All tools
          </Link>
        </Button>
      </PageHero>

      <section className="container min-w-0 py-8 md:py-12">
        <div className="mb-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <div className="text-xs font-semibold uppercase tracking-wider text-secondary">Who it helps</div>
            <p className="mt-1 text-sm leading-relaxed text-foreground">{tool.audience}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <div className="text-xs font-semibold uppercase tracking-wider text-secondary">Best use</div>
            <p className="mt-1 text-sm leading-relaxed text-foreground">{tool.plainEnglishUseCase}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <div className="text-xs font-semibold uppercase tracking-wider text-secondary">Time estimate</div>
            <p className="mt-1 text-sm leading-relaxed text-foreground">{tool.estimatedUseTime}</p>
          </div>
        </div>

        <div className="mb-6 grid gap-3 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="mb-3 flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-secondary">Before you start</h2>
            </div>
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              {assumptionNotes.map((note) => (
                <li key={note} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-secondary">Source notes</h2>
            </div>
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              {sourceNotes.map((note) => (
                <li key={note} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div id={tool.legacyAnchorId} className="scroll-mt-28">
          <CalculatorCard
            icon={Icon}
            eyebrow={tool.audience}
            title="Use this tool"
            description={tool.plainEnglishUseCase}
            relatedArticle={tool.relatedArticle}
          >
            <ToolRenderer toolKey={tool.componentKey} />
          </CalculatorCard>
        </div>

        <div className="mt-6">
          <DisclaimerBox>
            {tool.disclaimerNote}
          </DisclaimerBox>
        </div>

        {relatedTools.length > 0 && (
          <div className="mt-10">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Related tools</div>
                <h2 className="font-display text-2xl font-bold">Keep going in this category</h2>
              </div>
              <Button asChild variant="soft" size="sm">
                <Link to="/tools">Browse all tools</Link>
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedTools.map((related) => (
                <Link
                  key={related.slug}
                  to={`/tools/${related.slug}`}
                  className="group rounded-2xl border border-border bg-card p-5 shadow-card transition-smooth hover:border-primary/40 hover:shadow-hover"
                >
                  <div className="text-xs font-semibold uppercase tracking-wider text-secondary">{related.category}</div>
                  <h3 className="mt-2 font-display text-lg font-bold">{related.shortTitle}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{related.plainEnglishUseCase}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                    Open tool <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default ToolPage;
