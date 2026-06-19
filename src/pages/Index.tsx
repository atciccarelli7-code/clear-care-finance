import { Link } from "react-router-dom";
import { ArrowRight, Calculator, FileText, BookOpen, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopicCard } from "@/components/shared/TopicCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ArticleCard } from "@/components/shared/ArticleCard";
import { PageHero } from "@/components/shared/PageHero";
import { ARTICLES } from "@/data/articles";
import { publishedArticles } from "@/lib/article-status";
import { TOPICS } from "@/data/topics";

const Index = () => {
  const featuredTopics = TOPICS.slice(0, 6);
  const featuredArticles = publishedArticles(ARTICLES).slice(0, 4);

  return (
    <>
      <PageHero
        eyebrow="Plain-English financial education"
        title="Financial clarity for healthcare workers — and the patients they care for."
        description="Pay, benefits, insurance, retirement, Medicare, and Medicaid — explained without jargon, scare tactics, or sales pitches."
      >
        <Button asChild variant="hero" size="lg">
          <Link to="/tools">Open a calculator <ArrowRight className="h-4 w-4" /></Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/topics">Browse topics</Link>
        </Button>
      </PageHero>

      {/* Choose your path */}
      <section id="choose-path" className="container min-w-0 py-16 md:py-20 scroll-mt-20">
        <SectionHeading
          centered
          eyebrow="Choose your path"
          title="Where do you fit?"
          description="The same financial vocabulary affects everyone in a hospital — just from different sides of the bed."
        />
        <div className="grid min-w-0 gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          <TopicCard
            icon={TOPICS[1].icon}
            title="Healthcare Worker Money"
            description="Paychecks, benefits, retirement plans, and quiet spending patterns on shift."
            href="/healthcare-workers"
            cta="Start here"
          />
          <TopicCard
            icon={TOPICS[0].icon}
            title="Patient & Caregiver Money"
            description="Insurance, Medicare, Medicaid, hospital bills, and long-term care basics."
            href="/patients-families"
            cta="Start here"
            accent="green"
          />
          <TopicCard
            icon={Calculator}
            title="Just the calculators"
            description="Five simple tools to estimate paycheck, insurance, Medicare, café spend, and student loans."
            href="/tools"
            cta="Open calculators"
          />
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
            Pick a calculator or read one article. Clarity adds up over time.
          </p>
          <div className="flex min-w-0 flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/tools"><Calculator className="h-4 w-4" /> Try a calculator</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/40 hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link to="/articles"><FileText className="h-4 w-4" /> Read an article</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
