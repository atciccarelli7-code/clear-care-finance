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
import { absoluteUrl, SITE_NAME, SITE_URL, useJsonLd, useSeo } from "@/lib/seo";

const TopicPage = () => {
  const { slug = "" } = useParams();
  const topic = findTopic(slug);

  useSeo({
    title: topic?.title ?? "Topics",
    description:
      topic?.promise ??
      "Plain-English healthcare finance topic hubs from Community Acquired Finance.",
    canonicalPath: topic ? `/topics/${topic.slug}` : "/topics",
  });

  useJsonLd(
    "topic-page",
    topic
      ? [
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `${topic.title} Guide`,
            url: absoluteUrl(`/topics/${topic.slug}`),
            description: topic.promise,
            isPartOf: {
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
            },
            about: topic.definitions.map((definition) => definition.term),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Topics",
                item: absoluteUrl("/topics"),
              },
              {
                "@type": "ListItem",
                position: 2,
                name: topic.title,
                item: absoluteUrl(`/topics/${topic.slug}`),
              },
            ],
          },
        ]
      : null,
  );

  if (!topic) return <Navigate to="/topics" replace />;

  const isMedicareHub = topic.slug === "medicare-medicaid";

  return (
    <>
      <PageHero eyebrow={topic.category} title={topic.title} description={topic.promise}>
        {topic.calculator && (
          <Button asChild variant="hero" size="lg">
            <a href="#calculator">Try the calculator <ArrowRight className="h-4 w-4" /></a>
          </Button>
        )}
        <Button asChild variant="outline" size="lg">
          <a href="#sources">View sources</a>
        </Button>
      </PageHero>

      <section className="container min-w-0 py-10 md:py-16">
        <TopicOverview startHere={topic.startHere} definitions={topic.definitions} />
      </section>

      {topic.comparison && (
        <section className="container min-w-0 py-12">
          <SectionHeading
            centered
            eyebrow="Comparison"
            title={topic.comparison.title}
            description={topic.comparison.description}
          />
          <div className="grid min-w-0 gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <ComparisonCard side={topic.comparison.left} />
            <ComparisonCard side={topic.comparison.right} />
          </div>
        </section>
      )}

      {topic.factSheet && (
        <section className="container min-w-0 py-12">
          <FactSheetGrid factSheet={topic.factSheet} />
        </section>
      )}

      {topic.warning && (
        <section className="container min-w-0 py-12">
          <CalloutWarning title={topic.warning.title}>
            <p>{topic.warning.body}</p>
          </CalloutWarning>
        </section>
      )}

      {topic.calculator && (
        <section id="calculator" className="container min-w-0 py-12 scroll-mt-20">
          <SectionHeading centered eyebrow="Tool" title={topic.calculator.title} description={topic.calculator.description} />
          <CalculatorCard
            eyebrow={topic.category}
            title={topic.calculator.title}
            description={topic.calculator.description}
          >
            <CalculatorByKey k={topic.calculator.key} />
          </CalculatorCard>
        </section>
      )}

      {topic.relatedArticleSlugs.length > 0 && (
        <section className="container min-w-0 py-16">
          {isMedicareHub ? <MedicareLearningPath /> : <RelatedArticles slugs={topic.relatedArticleSlugs} />}
        </section>
      )}

      <section id="sources" className="container min-w-0 py-16 scroll-mt-20">
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
