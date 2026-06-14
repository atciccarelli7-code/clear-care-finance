import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { TOPICS } from "@/data/topics";
import { PageHero } from "@/components/shared/PageHero";
import { TopicCard } from "@/components/shared/TopicCard";

const Topics = () => (
  <>
    <PageHero
      eyebrow="Content hubs"
      title="Every topic, one consistent format."
      description="Quick guide → definitions → comparison → calculator → related articles → sources → disclaimer."
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

export default Topics;
