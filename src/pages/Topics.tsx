import { TOPICS } from "@/data/topics";
import { PageHero } from "@/components/shared/PageHero";
import { TopicCard } from "@/components/shared/TopicCard";
import { absoluteUrl, SITE_NAME, SITE_URL, useJsonLd, useSeo } from "@/lib/seo";

const Topics = () => {
  useSeo({
    title: "Healthcare Finance Topics",
    description:
      "Browse plain-English healthcare finance topic hubs covering Medicare, Medicaid, workplace benefits, retirement, insurance, patient costs, and hospital economics.",
    canonicalPath: "/topics",
  });

  useJsonLd("topics-page", {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Healthcare Finance Topics",
    url: absoluteUrl("/topics"),
    description:
      "Plain-English healthcare finance topic hubs with definitions, calculators, related articles, sources, and disclaimers.",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: TOPICS.map((topic, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: topic.title,
        url: absoluteUrl(`/topics/${topic.slug}`),
      })),
    },
  });

  return (
    <>
      <PageHero
        eyebrow="Content hubs"
        title="Every topic, one consistent format."
        description="Quick guide -> definitions -> comparison -> calculator -> related articles -> sources -> disclaimer."
      />
      <section className="container py-16 md:py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((t) => (
            <TopicCard
              key={t.slug}
              icon={t.icon}
              title={t.title}
              description={t.promise}
              href={`/topics/${t.slug}`}
              cta="Open guide"
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default Topics;
