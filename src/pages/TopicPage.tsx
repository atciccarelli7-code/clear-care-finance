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
import HealthcareWorkerDiscountsPage from "@/components/discounts/HealthcareWorkerDiscountsPage";
import { Button } from "@/components/ui/button";
import { absoluteUrl, useSeo } from "@/lib/seo";

const DISCOUNTS_DESCRIPTION =
  "Browse verified 2026 healthcare worker discounts for nurses, clinicians, and hospital employees. Compare eligibility, verification, fine print, and real savings.";

const DiscountsTopicPage = () => {
  useSeo({
    title: "Healthcare Worker Discounts for Nurses & Hospital Staff (2026)",
    description: DISCOUNTS_DESCRIPTION,
    canonicalPath: "/topics/discounts-perks",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Topics", item: absoluteUrl("/topics") },
          {
            "@type": "ListItem",
            position: 3,
            name: "Healthcare Worker Discounts & Perks",
            item: absoluteUrl("/topics/discounts-perks"),
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Healthcare Worker Discounts & Perks (2026)",
        description: DISCOUNTS_DESCRIPTION,
        url: absoluteUrl("/topics/discounts-perks"),
        audience: {
          "@type": "Audience",
          audienceType: "Nurses, healthcare professionals, clinicians, and hospital employees",
        },
        isPartOf: {
          "@type": "WebSite",
          name: "Community Acquired Finance",
          url: absoluteUrl("/"),
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Do all hospital employees qualify for healthcare worker discounts?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Eligibility varies by brand. Some programs include hospital employees, while others are limited to licensed nurses, physicians, medical providers, EMTs, or first responders.",
            },
          },
          {
            "@type": "Question",
            name: "Can healthcare worker discounts be combined with sale codes?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Often they cannot be combined, although rules differ by retailer. Compare the verified offer with the public sale price before checking out.",
            },
          },
          {
            "@type": "Question",
            name: "How are healthcare worker discounts verified?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Brands commonly use ID.me, SheerID, a work email, a professional license, or an employment document to confirm eligibility.",
            },
          },
        ],
      },
    ],
  });

  return <HealthcareWorkerDiscountsPage />;
};

const TopicPage = () => {
  const { slug = "" } = useParams();
  const topic = findTopic(slug);
  if (!topic) return <Navigate to="/topics" replace />;
  if (topic.slug === "discounts-perks") return <DiscountsTopicPage />;

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
