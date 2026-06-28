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
import { ALL_ARTICLES } from "@/data/allArticles";
import { TOPICS } from "@/data/topics";

type PathCard = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  cta: string;
  accent?: "blue" | "green";
};

const Index = () => {
  const featuredTopics = TOPICS.slice(0, 6);
  const featuredArticles = ALL_ARTICLES.slice(0, 4);

  const pathCards: PathCard[] = [
    {
      icon: Receipt,
      title: "I got a medical bill",
      description: "Review the bill, compare it with your EOB, and find the next practical step before paying.",
      href: "/insurance/medical-bill-review-toolkit",
      cta: "Review the bill",
      accent: "green",
    },
    {
      icon: HeartPulse,
      title: "I’m a healthcare worker",
      description: "Understand pay, shift spending, retirement benefits, and financial choices tied to healthcare work.",
      href: "/healthcare-workers",
      cta: "Start here",
      accent: "blue",
    },
    {
      icon: BookOpen,
      title: "I’m trying to understand Medicare or Medicaid",
      description: "Learn what the programs cover, where costs appear, and why long-term care needs separate planning.",
      href: "/topics/medicare-medicaid",
      cta: "Open the guide",
      accent: "green",
    },
    {
      icon: PiggyBank,
      title: "I’m choosing benefits",
      description: "Make sense of premiums, deductibles, FSAs, HSAs, open enrollment, and insurance tradeoffs.",
      href: "/insurance",
      cta: "Compare options",
      accent: "blue",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="RN-led financial clarity"
        title="Healthcare money decisions, translated."
        description="Plain-English calculators and guides for medical bills, benefits, Medicare, Medicaid, and healthcare-worker pay."
      >
        <Button asChild variant="hero" size="lg">
          <a href="#choose-path">Start here <ArrowRight className="h-4 w-4" /></a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/tools">Browse tools</Link>
        </Button>
      </PageHero>

      {/* Choose your path */}
      <section id="choose-path" className="container min-w-0 scroll-mt-20 py-12 md:py-16">
        <SectionHeading
          centered
          eyebrow="Start here"
          title="What are you trying to figure out?"
          description="Choose the situation closest to yours. Each path leads to a practical guide or calculator, not a sales funnel."
        />
        <div className="mx-auto grid max-w-5xl min-w-0 gap-5 md:grid-cols-2">
          {pathCards.map(({ icon, title, description, href, cta, accent }) => (
            <TopicCard
              key={title}
              icon={icon}
              title={title}
              description={description}
              href={href}
              cta={cta}
              accent={accent}
            />
          ))}
        </div>
      </section>

      {/* Topic hubs */}
      <section className="border-y border-border bg-card/30 py-16 md:py-20">
        <div className="container min-w-0">
          <SectionHeading
            eyebrow="Topic hubs"
            title="Every topic, one consistent format"
            description="Quick guide → definitions → comparison → calculator → related articles → trusted sources."
          />
          <div className="grid min-w-0 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredTopics.map((t) => (
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
          <div className="mt-10 text-center min-w-0">
            <Button asChild variant="soft">
              <Link to="/topics">See all topics <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="container min-w-0 py-16 md:py-20">
        <div className="flex min-w-0 flex-wrap items-end justify-between gap-4 mb-12">
          <SectionHeading
            eyebrow="Articles"
            title="Plain-English guides"
            description="Short reads, written without scare tactics or sales pitches."
            className="mb-0"
          />
          <Button asChild variant="soft">
            <Link to="/articles">Browse all <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid min-w-0 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featuredArticles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>

      {/* Standards */}
      <section className="bg-gradient-hero border-y border-border py-16 md:py-20">
        <div className="container min-w-0">
          <SectionHeading
            centered
            eyebrow="Our standards"
            title="Built for clarity, not clicks."
            description="Healthcare is complicated enough. The money side shouldn't add to the chaos."
          />
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {[
              { t: "Plain-English education", d: "No jargon, no acronym soup." },
              { t: "Credible sources", d: "Every topic links to government or reputable references." },
              { t: "Practical calculators", d: "Numbers you can actually use." },
              { t: "No scare tactics", d: "Information, not fear." },
              { t: "No spammy monetization", d: "No popups, no sales funnels." },
              { t: "Educational only", d: "Never individualized advice." },
            ].map((i) => (
              <div key={i.t} className="flex min-w-0 gap-3 rounded-2xl bg-card border border-border p-5 shadow-card">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="min-w-0 break-words">
                  <div className="font-semibold break-words">{i.t}</div>
                  <div className="text-sm text-muted-foreground break-words">{i.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container min-w-0 py-20">
        <div className="min-w-0 break-words rounded-3xl bg-gradient-primary p-6 text-center text-primary-foreground shadow-hover sm:p-10 md:p-16">
          <BookOpen className="h-10 w-10 mx-auto mb-4 opacity-90" />
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-balance break-words">Start with one small win</h2>
          <p className="text-lg opacity-90 max-w-xl mx-auto mb-7 break-words">
            Pick a money map, a calculator, or one article. Clarity adds up over time.
          </p>
          <div className="flex min-w-0 flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/tools"><Calculator className="h-4 w-4" /> Browse tools</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent text-primary-foreground border-primary-foreground/40 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link to="/articles"><FileText className="h-4 w-4" /> Read an article</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
