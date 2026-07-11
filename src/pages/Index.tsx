import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calculator,
  FileText,
  BookOpen,
  CheckCircle2,
  HeartPulse,
  Receipt,
  PiggyBank,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopicCard } from "@/components/shared/TopicCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ArticleCard } from "@/components/shared/ArticleCard";
import { PageHero } from "@/components/shared/PageHero";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { ALL_ARTICLES } from "@/data/allArticles";
import { TOPICS } from "@/data/topics";
import { trackHomepageNavigation } from "@/lib/analytics";

type PathCard = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  cta: string;
  accent?: "blue" | "green";
};

const featuredArticleSlugs = [
  "use-credit-cards-without-credit-card-debt",
  "managing-money-has-never-been-easier-or-harder",
  "how-to-pick-retirement-investments-at-work",
  "deductible-copay-coinsurance-out-of-pocket-max",
];

const featuredTopicSlugs = [
  "retirement-accounts",
  "workplace-benefits",
  "health-insurance",
  "patient-medical-costs",
  "medicare-medicaid",
  "hospital-economics",
];

const topicPromiseOverrides: Record<string, string> = {
  "retirement-accounts":
    "Understand workplace retirement accounts, employer matches, Roth versus Traditional contributions, and diversified investing.",
  "workplace-benefits":
    "Make sense of retirement matches, insurance, pre-tax accounts, and open enrollment—no matter where you work.",
};

const Index = () => {
  const featuredTopics = featuredTopicSlugs
    .map((slug) => TOPICS.find((topic) => topic.slug === slug))
    .filter((topic): topic is (typeof TOPICS)[number] => Boolean(topic))
    .map((topic) => ({ ...topic, promise: topicPromiseOverrides[topic.slug] ?? topic.promise }));
  const featuredArticles = featuredArticleSlugs
    .map((slug) => ALL_ARTICLES.find((article) => article.slug === slug))
    .filter((article): article is (typeof ALL_ARTICLES)[number] => Boolean(article));

  const pathCards: PathCard[] = [
    {
      id: "retirement_financial_independence",
      icon: PiggyBank,
      title: "I’m planning for retirement or financial independence",
      description: "Organize saving, retirement accounts, investing, debt, and the next step toward long-term financial flexibility.",
      href: "/build-wealth",
      cta: "Build my plan",
      accent: "blue",
    },
    {
      id: "medical_bill",
      icon: Receipt,
      title: "I got a medical bill",
      description: "Review the bill, compare it with your EOB, and find the next practical step before paying.",
      href: "/insurance/medical-bill-review-toolkit",
      cta: "Review the bill",
      accent: "green",
    },
    {
      id: "medicare_medicaid",
      icon: BookOpen,
      title: "I’m trying to understand Medicare or Medicaid",
      description: "Learn what the programs cover, where costs appear, and why long-term care needs separate planning.",
      href: "/topics/medicare-medicaid",
      cta: "Open the guide",
      accent: "green",
    },
    {
      id: "workplace_benefits_insurance",
      icon: HeartPulse,
      title: "I’m choosing workplace benefits or insurance",
      description: "Compare premiums, deductibles, retirement matches, FSAs, HSAs, and open-enrollment tradeoffs.",
      href: "/insurance",
      cta: "Compare options",
      accent: "blue",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Plain-English financial clarity"
        title="Understand your money—from workplace benefits to healthcare costs."
        description="Use practical guides and calculators for retirement, investing, workplace benefits, insurance, medical bills, Medicare, and Medicaid—built with an RN’s healthcare perspective."
      >
        <Button asChild variant="hero" size="lg">
          <a
            href="#choose-path"
            onClick={() => trackHomepageNavigation("hero_action", "choose_starting_point")}
          >
            Choose a starting point <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link
            to="/tools"
            onClick={() => trackHomepageNavigation("hero_action", "use_calculator", "/tools")}
          >
            Use a calculator
          </Link>
        </Button>
      </PageHero>

      <section id="choose-path" className="container min-w-0 scroll-mt-20 py-12 md:py-16">
        <SectionHeading
          centered
          eyebrow="Start here"
          title="What would you like to understand today?"
          description="Choose the situation closest to yours. Each path leads to a practical guide or calculator, not a sales funnel."
        />
        <div className="mx-auto grid max-w-5xl min-w-0 gap-5 md:grid-cols-2">
          {pathCards.map(({ id, icon, title, description, href, cta, accent }) => (
            <TopicCard
              key={id}
              icon={icon}
              title={title}
              description={description}
              href={href}
              cta={cta}
              accent={accent}
              onClick={() => trackHomepageNavigation("starting_path", id, href)}
            />
          ))}
        </div>
        <p className="mx-auto mt-7 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground">
          Work in healthcare? The{" "}
          <Link
            className="font-semibold text-primary underline-offset-4 hover:underline"
            to="/healthcare-workers"
            onClick={() => trackHomepageNavigation("specialty_hub", "healthcare_workers", "/healthcare-workers")}
          >
            healthcare-worker hub
          </Link>{" "}
          adds RN-focused pay, career, and benefit tools without limiting the rest of the site to healthcare employees.
        </p>
      </section>

      <section className="border-y border-border bg-card/30 py-16 md:py-20">
        <div className="container min-w-0">
          <SectionHeading
            eyebrow="Explore by topic"
            title="General financial guidance, with deeper healthcare expertise"
            description="Move from a plain-English explanation to a comparison, calculator, related articles, and trusted sources."
          />
          <div className="grid min-w-0 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredTopics.map((topic) => {
              const href = `/topics/${topic.slug}`;
              return (
                <TopicCard
                  key={topic.slug}
                  icon={topic.icon}
                  title={topic.title}
                  description={topic.promise}
                  href={href}
                  cta="Open guide"
                  onClick={() => trackHomepageNavigation("featured_topic", topic.slug, href)}
                />
              );
            })}
          </div>
          <div className="mt-10 text-center min-w-0">
            <Button asChild variant="soft">
              <Link
                to="/topics"
                onClick={() => trackHomepageNavigation("section_browse", "all_topics", "/topics")}
              >
                See all topics <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container min-w-0 py-16 md:py-20">
        <div className="flex min-w-0 flex-wrap items-end justify-between gap-4 mb-12">
          <SectionHeading
            eyebrow="Articles"
            title="Start with a question you already have"
            description="Read practical explanations about credit, retirement investing, everyday money decisions, and healthcare costs."
            className="mb-0"
          />
          <Button asChild variant="soft">
            <Link
              to="/articles"
              onClick={() => trackHomepageNavigation("section_browse", "all_articles", "/articles")}
            >
              Browse all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid min-w-0 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featuredArticles.map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
              onClick={() =>
                trackHomepageNavigation("featured_article", article.slug, `/articles/${article.slug}`)
              }
            />
          ))}
        </div>
      </section>

      <section className="bg-gradient-hero border-y border-border py-16 md:py-20">
        <div className="container min-w-0">
          <SectionHeading
            centered
            eyebrow="Our standards"
            title="Built for clarity, not clicks."
            description="Money and healthcare are complicated enough. The explanation should not add to the confusion."
          />
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {[
              { t: "Plain-English education", d: "No jargon, no acronym soup." },
              { t: "Credible sources", d: "Every topic links to government or reputable references." },
              { t: "Practical calculators", d: "Numbers you can actually use." },
              { t: "No scare tactics", d: "Information, not fear." },
              { t: "No spammy monetization", d: "No popups, no sales funnels." },
              { t: "Educational only", d: "Never individualized advice." },
            ].map((item) => (
              <div key={item.t} className="flex min-w-0 gap-3 rounded-2xl bg-card border border-border p-5 shadow-card">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="min-w-0 break-words">
                  <div className="font-semibold break-words">{item.t}</div>
                  <div className="text-sm text-muted-foreground break-words">{item.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container min-w-0 py-16 md:py-20">
        <NewsletterSignup
          source="home"
          title="Get one clear financial email each month"
          description="Join Community Acquired Finance Monthly for practical notes on retirement, workplace benefits, insurance, medical bills, Medicare, Medicaid, and new calculators. First issue planned for August 1."
          buttonLabel="Join the monthly list"
        />
      </section>

      <section className="container min-w-0 py-20">
        <div className="min-w-0 break-words rounded-3xl bg-gradient-primary p-6 text-center text-primary-foreground shadow-hover sm:p-10 md:p-16">
          <BookOpen className="h-10 w-10 mx-auto mb-4 opacity-90" />
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-balance break-words">Start with one small win</h2>
          <p className="text-lg opacity-90 max-w-xl mx-auto mb-7 break-words">
            Pick a calculator, one guide, or one article. Financial clarity compounds over time.
          </p>
          <div className="flex min-w-0 flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link
                to="/tools"
                onClick={() => trackHomepageNavigation("closing_cta", "browse_tools", "/tools")}
              >
                <Calculator className="h-4 w-4" /> Browse tools
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent text-primary-foreground border-primary-foreground/40 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link
                to="/articles"
                onClick={() => trackHomepageNavigation("closing_cta", "read_article", "/articles")}
              >
                <FileText className="h-4 w-4" /> Read an article
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
