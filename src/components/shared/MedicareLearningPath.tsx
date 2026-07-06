import { CompactArticleCard } from "./CompactArticleCard";
import { SectionHeading } from "./SectionHeading";
import { ALL_ARTICLES } from "@/data/allArticles";
import { isArticleDraft } from "@/lib/article-status";

const learningPathGroups = [
  {
    title: "Policy changes to watch",
    description: "Start here for planned Medicare and Medicaid changes that may affect patients, caregivers, hospitals, and discharge planning.",
    slugs: [
      "medicare-medicaid-changes-january-2027",
    ],
  },
  {
    title: "Exact questions families search",
    description: "Use these when someone needs the plain-English answer before or after a confusing Medicare.gov, plan, or discharge-planning conversation.",
    slugs: [
      "does-medicare-cover-long-term-care",
      "does-medicare-cover-rehab-after-hospital-stay",
      "medicare-vs-medicaid-what-is-the-difference",
      "what-does-medicare-not-cover",
      "why-do-i-still-owe-money-with-medicare",
    ],
  },
  {
    title: "Start here",
    description: "Use these first if you are trying to understand the big Medicare and Medicaid map.",
    slugs: [
      "medicare-options-explained",
      "plain-english-glossary",
      "medicaid-dual-eligibility-ltss",
    ],
  },
  {
    title: "After a hospital stay",
    description: "Use these when a patient is leaving the hospital, going to rehab, or trying to stay safe at home.",
    slugs: [
      "discharge-coverage-guide",
      "short-term-rehab-after-hospital",
      "home-health-after-discharge",
      "durable-medical-equipment-after-discharge",
      "long-term-care-and-custodial-care",
    ],
  },
];

const getPublishedArticles = (slugs: string[]) =>
  slugs
    .map((slug) => ALL_ARTICLES.find((article) => article.slug === slug))
    .filter((article) => article && !isArticleDraft(article));

export const MedicareLearningPath = () => (
  <div className="min-w-0">
    <SectionHeading
      eyebrow="Articles"
      title="Medicare learning path"
      description="Start with the exact question, then use the big-picture Medicare guides and discharge guides when a patient needs coverage clarity."
      className="mb-8"
    />

    <div className="space-y-8 md:space-y-10">
      {learningPathGroups.map((group) => {
        const articles = getPublishedArticles(group.slugs);
        if (!articles.length) return null;

        return (
          <section key={group.title} className="min-w-0 rounded-3xl border border-border bg-muted/20 p-4 md:p-6">
            <div className="mb-4 max-w-2xl min-w-0 space-y-1.5 break-words md:mb-5">
              <h3 className="font-display text-xl font-bold tracking-tight text-foreground md:text-2xl">
                {group.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {group.description}
              </p>
            </div>

            <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article) => (
                <CompactArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  </div>
);
