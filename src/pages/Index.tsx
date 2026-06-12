import { Link } from "react-router-dom";
import { ArrowRight, Calculator, FileText, HeartPulse, Stethoscope, Users, Wallet, Shield, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopicCard } from "@/components/shared/TopicCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { articles } from "@/data/articles";

const Index = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-7 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border shadow-card text-xs font-semibold text-secondary">
              <Sparkles className="h-3.5 w-3.5" />
              Plain-English financial education
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Financial clarity for healthcare workers and the patients they care for.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Simple guides, calculators, and visual explanations for pay, benefits, insurance,
              retirement accounts, Medicare, Medicaid, and healthcare costs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button asChild variant="hero" size="lg">
                <Link to="/tools">Start with a calculator <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/articles">Explore articles</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
      </section>

      {/* Audience cards */}
      <section className="container py-20">
        <SectionHeading
          centered
          eyebrow="Where do you fit?"
          title="Pick the path that's right for you"
          description="The same financial vocabulary affects everyone in a hospital — just from different sides of the bed."
        />
        <div className="grid gap-6 md:grid-cols-3">
          <TopicCard
            icon={Stethoscope}
            title="I'm a healthcare worker"
            description="Understand paychecks, benefits, 403(b)s, insurance options, taxes, and career-related financial decisions."
            href="/healthcare-workers"
            cta="Learn for healthcare workers"
            accent="blue"
          />
          <TopicCard
            icon={Users}
            title="I'm a patient or caregiver"
            description="Understand insurance terms, Medicare, Medicaid, hospital bills, and what costs may show up before care becomes a crisis."
            href="/patients-families"
            cta="Learn for patients & families"
            accent="green"
          />
          <TopicCard
            icon={Calculator}
            title="I want to use a calculator"
            description="Estimate paycheck contributions, insurance costs, and healthcare expenses with simple plain-English tools."
            href="/tools"
            cta="View calculators"
            accent="blue"
          />
        </div>
      </section>

      {/* Featured tools */}
      <section className="bg-muted/30 py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Tools & Calculators"
            title="Run the numbers without the jargon"
            description="Three friendly calculators to help you understand what shows up on a paycheck or a bill."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Wallet,
                title: "403(b) Paycheck Contribution",
                description: "Estimate how much goes into a 403(b) from each paycheck based on your hourly pay, hours, and contribution percentage.",
              },
              {
                icon: Shield,
                title: "Insurance Visit Cost",
                description: "Estimate annual out-of-pocket cost based on premium, deductible, copay, coinsurance, and number of visits.",
              },
              {
                icon: HeartPulse,
                title: "Medicare Cost Estimator",
                description: "Estimate common Medicare-related costs and learn the difference between premiums, deductibles, and coverage gaps.",
              },
            ].map((t) => (
              <TopicCard
                key={t.title}
                icon={t.icon}
                title={t.title}
                description={t.desc}
                href="/tools"
                cta="Try the calculator"
                accent="blue"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="container py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <SectionHeading
            eyebrow="Articles"
            title="Plain-English guides"
            description="Short reads, written without scare tactics or sales pitches."
            className="mb-0"
          />
          <Button asChild variant="soft">
            <Link to="/articles">Browse all articles <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {articles.slice(0, 4).map((a) => (
            <Link
              key={a.slug}
              to="/articles"
              className="group rounded-2xl border border-border bg-card p-7 shadow-card transition-smooth hover:-translate-y-1 hover:shadow-hover hover:border-primary/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2.5 py-1 rounded-full bg-secondary-soft text-secondary text-xs font-semibold">{a.category}</span>
                <span className="text-xs text-muted-foreground">{a.readTime}</span>
              </div>
              <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-smooth">{a.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{a.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust section */}
      <section className="bg-gradient-hero py-20">
        <div className="container">
          <SectionHeading
            centered
            eyebrow="Why this site exists"
            title="Honest education, not financial hype"
            description="Healthcare is complicated enough. The money side shouldn't add to the chaos."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {[
              { t: "Plain-English education", d: "No jargon, no acronym soup." },
              { t: "Credible sources", d: "Built on government and reputable guidance." },
              { t: "Practical calculators", d: "Numbers you can actually use." },
              { t: "No scare tactics", d: "Information, not fear." },
              { t: "No spammy monetization", d: "No popups, no sales funnels." },
              { t: "Educational only", d: "Not individualized financial, medical, tax, or legal advice." },
            ].map((i) => (
              <div key={i.t} className="flex gap-3 rounded-2xl bg-card border border-border p-5 shadow-card">
                <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">{i.t}</div>
                  <div className="text-sm text-muted-foreground">{i.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20">
        <div className="rounded-3xl bg-gradient-primary p-10 md:p-16 text-center text-primary-foreground shadow-hover">
          <BookOpen className="h-10 w-10 mx-auto mb-4 opacity-90" />
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Start with one small win</h2>
          <p className="text-lg opacity-90 max-w-xl mx-auto mb-7">
            Pick a calculator or read a single article. That's it. Clarity adds up over time.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
