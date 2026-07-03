import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TopicCard } from "@/components/shared/TopicCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PageHero } from "@/components/shared/PageHero";
import { NextStepCards } from "@/components/shared/NextStepCards";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { OBBB_OVERTIME_ARTICLE } from "@/data/healthcareWorkerArticles";
import { Wallet, PiggyBank, Shield, Receipt, Brain, Tag, ArrowRight, Clock, TrendingUp, GraduationCap } from "lucide-react";

const HealthcareWorkers = () => {
  return (
    <>
      <PageHero
        eyebrow="For nurses & bedside clinicians"
        title="Money education built for healthcare workers."
        description="Start with the paycheck, then move into benefits, student loans, investing, and the money decisions that come with healthcare work."
      >
        <Button asChild variant="hero" size="lg">
          <Link to="/articles/healthcare-worker-money-map">Start with the money map <ArrowRight className="h-4 w-4" /></Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/tools#403b">Open the 403(b) calculator</Link>
        </Button>
      </PageHero>

      <section className="container py-10 md:py-14">
        <NextStepCards
          eyebrow="Best first steps"
          title="Start with the worker money system"
          description="Healthcare-worker finance is more than benefits. Start with the paycheck, then build toward investing and flexibility."
          cards={[
            {
              eyebrow: "Foundation",
              title: "The Healthcare Worker Money Map",
              description: "A simple order of operations for bills, cash, employer match, debt, retirement, and investing.",
              href: "/articles/healthcare-worker-money-map",
              cta: "Read the map",
            },
            {
              eyebrow: "Paycheck tool",
              title: "403(b) Paycheck Contribution Calculator",
              description: "Turn contribution percentage, match, and annual savings into clear per-paycheck numbers.",
              href: "/tools#403b",
              cta: "Run 403(b) math",
            },
            {
              eyebrow: "Student loans",
              title: "Nursing-school loans and nonprofit work",
              description: "Separate federal forgiveness paths from private-loan payoff and refinance math.",
              href: "/student-loans",
              cta: "Open student loans",
            },
          ]}
        />
      </section>

      <section className="container py-10 md:py-14">
        <Link
          to={`/articles/${OBBB_OVERTIME_ARTICLE.slug}`}
          className="group block rounded-3xl border border-primary/25 bg-primary-soft/35 p-6 shadow-card transition-smooth hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-hover md:p-8"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl min-w-0 space-y-2">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Paycheck update</div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {OBBB_OVERTIME_ARTICLE.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {OBBB_OVERTIME_ARTICLE.promise}
              </p>
              <div className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4" /> {OBBB_OVERTIME_ARTICLE.readTime}
              </div>
            </div>
            <div className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary transition-all group-hover:gap-3">
              Read guide <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>
      </section>

      <section className="container py-16 md:py-20">
        <SectionHeading
          centered
          eyebrow="Topics for you"
          title="The money stuff your hospital orientation skipped"
          description="Pick the lane that matches the decision in front of you. You do not need to read everything at once."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <TopicCard icon={Wallet} title="Paycheck & Benefits" description="403(b), open enrollment, paycheck deductions, insurance choices, and employer benefit paperwork." href="/topics/workplace-benefits" cta="Start benefits" />
          <TopicCard icon={GraduationCap} title="Student Loans" description="PSLF, IDR, Nurse Corps, NHSC, private loan payoff, and refinance planning for healthcare workers." href="/student-loans" cta="Open guide" accent="green" />
          <TopicCard icon={TrendingUp} title="Build Wealth" description="Money maps, fund choices, investing basics, savings rate, and financial independence for healthcare workers." href="/build-wealth" cta="Open hub" />
          <TopicCard icon={PiggyBank} title="Retirement Accounts" description="403(b), 401(a), 457(b), Roth vs Traditional, and fund choices — explained simply." href="/topics/retirement-accounts" cta="Open guide" />
          <TopicCard icon={Shield} title="Health Insurance" description="PPO vs HMO vs HDHP, HSA vs FSA, and how to compare plans." href="/topics/health-insurance" cta="Open guide" />
          <TopicCard icon={Brain} title="Behavior & Burnout" description="Decision fatigue and the money side of long shifts." href="/topics/behavior-burnout" cta="Open guide" />
          <TopicCard icon={Tag} title="Healthcare Worker Discounts & Perks" description="Legitimate discounts without letting them become shopping traps." href="/topics/discounts-perks" cta="Open guide" />
          <TopicCard icon={Receipt} title="Patient Medical Costs" description="Useful even when you're on the clinician side — patients ask." href="/topics/patient-medical-costs" cta="Open guide" accent="green" />
        </div>
      </section>

      <section className="container pb-10 md:pb-14">
        <NewsletterSignup source="healthcare-workers" />
      </section>

      <section className="container pb-20">
        <div className="rounded-3xl bg-gradient-accent p-10 md:p-14 text-center text-primary-foreground shadow-hover">
          <h2 className="font-display text-3xl font-bold mb-3 text-balance">See what a small bump in your 403(b) does</h2>
          <p className="opacity-90 mb-6 max-w-xl mx-auto">Adjust contribution % and employer match and watch the per-paycheck and yearly totals update.</p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/tools#403b">Open the 403(b) calculator</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default HealthcareWorkers;