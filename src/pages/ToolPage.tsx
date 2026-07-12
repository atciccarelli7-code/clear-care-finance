import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calculator, Clock3, ShieldCheck } from "lucide-react";
import { ToolRenderer } from "@/components/calculators/ToolRenderer";
import { CalculatorCard, CalculatorNextSteps } from "@/components/shared/CalculatorCard";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import { roadmapTools } from "@/data/roadmapTools";
import { getToolBySlug, getToolHref, tools } from "@/data/tools";
import { useSeo } from "@/lib/seo";
import { RoadmapToolRouter } from "@/pages/RoadmapToolRouter";

const ToolPage = () => {
  const { slug = "" } = useParams();
  const coreTool = getToolBySlug(slug);
  const roadmapTool = roadmapTools.find((candidate) => candidate.slug === slug);
  const tool = coreTool ?? roadmapTool;

  useSeo({
    title: tool?.title ?? "Tool Not Found",
    description: tool?.description ?? "Browse Community Acquired Finance calculators and decision tools.",
    canonicalPath: tool ? `/tools/${tool.slug}` : "/tools",
    robots: tool ? "index, follow, max-image-preview:large" : "noindex, nofollow",
  });

  if (!tool) return <Navigate to="/tools" replace />;
  if (roadmapTool) return <RoadmapToolRouter slug={roadmapTool.slug} />;
  if (tool.href && tool.href !== `/tools/${tool.slug}`) return <Navigate to={tool.href} replace />;
  if (!tool.componentKey) return <Navigate to="/tools" replace />;

  const relatedTools = tools
    .filter((candidate) => candidate.slug !== tool.slug && candidate.category === tool.category)
    .slice(0, 3);

  return (
    <>
      <PageHero eyebrow={tool.category} title={tool.title} description={tool.description}>
        <Button asChild variant="hero" size="lg">
          <a href="#tool">Open the tool <ArrowRight className="h-4 w-4" /></a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/tools"><ArrowLeft className="h-4 w-4" /> All tools</Link>
        </Button>
      </PageHero>

      <div className="container min-w-0 space-y-10 py-10 md:space-y-14 md:py-14">
        <section className="grid gap-4 md:grid-cols-3" aria-label="Tool details">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
            <Clock3 className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-lg font-bold">{tool.estimatedUseTime}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Typical time to complete</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
            <Calculator className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-lg font-bold">{tool.audience}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Designed for this audience, usable by anyone</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-lg font-bold">Educational estimate</h2>
            <p className="mt-1 text-sm text-muted-foreground">Verify final numbers with official records and plan documents</p>
          </div>
        </section>

        <section id="tool" className="scroll-mt-28">
          <CalculatorCard
            icon={Calculator}
            eyebrow={tool.category}
            title={tool.title}
            description={tool.description}
            relatedArticle={tool.relatedArticle}
          >
            <ToolRenderer componentKey={tool.componentKey} />
            {relatedTools.length > 0 && (
              <CalculatorNextSteps
                steps={relatedTools.map((related) => ({
                  label: related.shortTitle,
                  href: getToolHref(related),
                  helper: related.description,
                }))}
              />
            )}
          </CalculatorCard>
        </section>

        <section className="rounded-3xl border border-border bg-card p-5 shadow-card md:p-7">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold">Need a different kind of help?</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Return to the directory to search every calculator, checklist, and guided decision workflow.
              </p>
            </div>
            <Button asChild variant="soft"><Link to="/tools">Browse all tools</Link></Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default ToolPage;
