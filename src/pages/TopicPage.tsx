import { useParams, Navigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { findTopic } from "@/data/topics";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TopicOverview } from "@/components/shared/TopicOverview";
import { ComparisonCard } from "@/components/shared/ComparisonCard";
import { FactSheetGrid } from "@/components/shared/FactSheetGrid";
import { CalculatorCard } from "@/components/shared/CalculatorCard";
import { CalloutWarning } from "@/components/shared/CalloutWarning";
import { SourceList } from "@/components/shared/SourceList";
import { RelatedArticles } from "@/components/shared/RelatedArticles";
import { MedicareLearningPath } from "@/components/shared/MedicareLearningPath";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { CalculatorByKey } from "@/components/calculators/CalculatorByKey";
import { Button } from "@/components/ui/button";

const TopicPage = () => {
  const { slug = "" } = useParams();
  const topic = findTopic(slug);
  if (!topic) return <Navigate to="/topics" replace />;

  const isMedicareHub = topic.slug === "medicare-medicaid";
  const navItems = [
    { href: "#start-here", label: "Start here", show: true },
    { href: "#comparison", label: "Compare", show: Boolean(topic.comparison) },
    { href: "#fact-sheet", label: "Fact sheet", show: Boolean(topic.factSheet) },
    { href: "#watch-out", label: "Watch out", show: Boolean(topic.warning) },
    { href: "#calculator", label: "Tool", show: Boolean(topic.calculator) },
    { href: "#related", label: "Related", show: topic.relatedArticleSlugs.length > 0 },
    { href: "#sources", label: "Sources", show: true },
  ].filter((item) => item.show);

  return (
    <>
      <PageHero eyebrow={topic.category} title={topic.title} description={topic.promise}>
        {topic.calculator && (
          <Button asChild variant="hero" size="lg">
            <a href="#calculator">Try the calculator <ArrowRight className="h-4 w-4" /></a>
          </Button>
        )}
        {isMedicareHub && (
          <Button asChild variant="accent" size="lg">
            <Link to="/insurance/medicare-advantage">Compare Medicare Advantage plans <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        )}
        <Button asChild variant="outline" size="lg">
          <a href="#sources">View sources</a>
        </Button>
      </PageHero>

      <section className="container min-w-0 pt-8">
        <nav aria-label="On this page" className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="mb-3 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary">On this page</div>
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="rounded-full border border-border bg-background px-3 py-2 text-sm font-semibold text-muted-foreground transition-smooth hover:border-primary/40 hover:text-primary">
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </section>

      <section id="start-here" className="container min-w-0 scroll-mt-24 py-10 md:py-16">
        <TopicOverview startHere={topic.startHere} definitions={topic.definitions} />
      </section>

      {topic.comparison && (
        <section id="comparison" className="container min-w-0 scroll-mt-24 py-12">
          <SectionHeading centered eyebrow="Comparison" title={topic.comparison.title} description={topic.comparison.description} />
          <div className="grid min-w-0 gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <ComparisonCard side={topic.comparison.left} />
            <ComparisonCard side={topic.comparison.right} />
          </div>
        </section>
      )}

      {topic.factSheet && (
        <section id="fact-sheet" className="container min-w-0 scroll-mt-24 py-12">
          <FactSheetGrid factSheet={topic.factSheet} />
        </section>
      )}

      {topic.warning && (
        <section id="watch-out" className="container min-w-0 scroll-mt-24 py-12">
          <CalloutWarning title={topic.warning.title}>
            <p>{topic.warning.body}</p>
          </CalloutWarning>
        </section>
      )}

      {topic.calculator && (
        <section id="calculator" className="container min-w-0 py-12 scroll-mt-24">
          <SectionHeading centered eyebrow="Tool" title={topic.calculator.title} description={topic.calculator.description} />
          <CalculatorCard eyebrow={topic.category} title={topic.calculator.title} description={topic.calculator.description}>
            <CalculatorByKey k={topic.calculator.key} />
          </CalculatorCard>
        </section>
      )}

      {topic.relatedArticleSlugs.length > 0 && (
        <section id="related" className="container min-w-0 scroll-mt-24 py-16">
          {isMedicareHub ? <MedicareLearningPath /> : <RelatedArticles slugs={topic.relatedArticleSlugs} />}
        </section>
      )}

      <section id="sources" className="container min-w-0 py-16 scroll-mt-24">
        <SectionHeading centered eyebrow="Sources" title="Where this comes from" description="Verifiable, publicly available sources you can explore further." />
        <div className="max-w-2xl mx-auto min-w-0 space-y-6">
          <SourceList sources={topic.sources} />
          <DisclaimerBox />
        </div>
        <div className="mt-10 text-center min-w-0">
          <Button asChild variant="soft">
            <Link to="/topics">Browse all topics <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default TopicPage;
