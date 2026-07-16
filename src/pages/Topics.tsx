import { Link } from "react-router-dom";
import { ArrowRight, BookOpenText, Calculator, Compass, type LucideIcon } from "lucide-react";
import { TOPICS } from "@/data/topics";
import { PageHero } from "@/components/shared/PageHero";
import { TopicCard } from "@/components/shared/TopicCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";

type StartingPoint = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  cta: string;
};

const startingPoints: StartingPoint[] = [
  {
    icon: Compass,
    title: "I need help choosing where to begin",
    description: "Answer a few broad questions and build a private, practical next-action plan.",
    href: "/start-here",
    cta: "Use Start Here",
  },
  {
    icon: Calculator,
    title: "I need a calculator or checklist",
    description: "Go directly to focused tools for benefits, bills, insurance, retirement, Medicare, and debt.",
    href: "/tools",
    cta: "Browse tools",
  },
  {
    icon: BookOpenText,
    title: "I want to understand the subject first",
    description: "Browse the topic groups below for definitions, comparisons, related tools, articles, and sources.",
    href: "#topic-directory",
    cta: "Browse topic guides",
  },
];

const topicGroups = [
  {
    id: "money-work",
    eyebrow: "Money and work",
    title: "Build financial flexibility around the job you have",
    description: "Understand retirement accounts, workplace benefits, burnout-driven money habits, and discounts without turning every question into an investment decision.",
    slugs: ["retirement-accounts", "workplace-benefits", "behavior-burnout", "discounts-perks"],
  },
  {
    id: "coverage-care",
    eyebrow: "Coverage and care costs",
    title: "Make sense of insurance, bills, Medicare, and Medicaid",
    description: "Start with the payer or document causing confusion, then move to the right calculator, checklist, or official source.",
    slugs: ["health-insurance", "patient-medical-costs", "medicare-medicaid"],
  },
  {
    id: "healthcare-system",
    eyebrow: "How healthcare works",
    title: "Understand the system behind the bedside and the bill",
    description: "Use plain-English context for hospital reimbursement, staffing pressure, payer mix, and the financial forces patients and workers can feel.",
    slugs: ["hospital-economics"],
  },
] as const;

const getTopicHref = (slug: string) => slug === "medicare-medicaid" ? "/medicare-care-costs" : `/topics/${slug}`;

const Topics = () => {
  useSeo({
    title: "Financial and Healthcare Topic Guides",
    description: "Choose a clear topic path for money, retirement, workplace benefits, health insurance, medical bills, Medicare, Medicaid, or hospital economics.",
    canonicalPath: "/topics",
  });

  return (
    <>
      <PageHero
        eyebrow="Topic guides"
        title="Choose the financial or healthcare question you need to understand."
        description="Start with a decision, a tool, or a subject. Every route connects plain-English context to a useful next step and the sources that control the answer."
      >
        <Button asChild variant="hero" size="lg">
          <Link to="/start-here">Help me choose <ArrowRight className="h-4 w-4" /></Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/tools">Open tools</Link>
        </Button>
      </PageHero>

      <section className="container py-12 md:py-16" aria-labelledby="topic-starting-points-title">
        <SectionHeading
          id="topic-starting-points-title"
          centered
          eyebrow="Choose your route"
          title="You do not need to browse everything"
          description="Use the shortest path that matches what you need right now."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {startingPoints.map(({ icon: Icon, title, description, href, cta }) => (
            <Link
              key={href}
              to={href}
              className="group rounded-3xl border border-border bg-card p-6 shadow-card transition-smooth hover:-translate-y-1 hover:border-primary/35 hover:shadow-hover"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold leading-tight">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                {cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="topic-directory" className="scroll-mt-24 border-y border-border bg-muted/25 py-14 md:py-20" aria-labelledby="topic-directory-title">
        <div className="container">
          <SectionHeading
            id="topic-directory-title"
            centered
            eyebrow="Topic directory"
            title="Browse by the kind of question"
            description="Each guide begins with the essential context, then connects definitions, comparisons, tools, related articles, sources, and clear limitations."
          />
          <div className="space-y-14">
            {topicGroups.map((group) => {
              const topics = group.slugs
                .map((slug) => TOPICS.find((topic) => topic.slug === slug))
                .filter((topic): topic is (typeof TOPICS)[number] => Boolean(topic));

              return (
                <section key={group.id} aria-labelledby={`topic-group-${group.id}`}>
                  <div className="mb-6 max-w-3xl">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{group.eyebrow}</p>
                    <h2 id={`topic-group-${group.id}`} className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">{group.title}</h2>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{group.description}</p>
                  </div>
                  <div className={`grid gap-5 md:grid-cols-2 ${topics.length === 4 ? "lg:grid-cols-2" : topics.length > 2 ? "xl:grid-cols-3" : ""} ${topics.length === 1 ? "max-w-2xl" : ""}`}>
                    {topics.map((topic) => (
                      <TopicCard
                        key={topic.slug}
                        icon={topic.icon}
                        title={topic.title}
                        description={topic.promise}
                        href={getTopicHref(topic.slug)}
                        cta={topic.slug === "medicare-medicaid" ? "Open Medicare and Medicaid hub" : "Open topic guide"}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Topics;
