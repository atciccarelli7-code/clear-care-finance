import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TopicCard } from "@/components/shared/TopicCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PageHero } from "@/components/shared/PageHero";
import { NextStepCards } from "@/components/shared/NextStepCards";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { OBBB_OVERTIME_ARTICLE } from "@/data/healthcareWorkerArticles";
import { Wallet, PiggyBank, Shield, Receipt, Brain, Tag, ArrowRight, Clock, TrendingUp, GraduationCap, BriefcaseBusiness, Stethoscope } from "lucide-react";

const HealthcareWorkers = () => {
  return (
    <>
      <PageHero
        eyebrow="For nurses & bedside clinicians"
        title="Money education built for healthcare workers."
        description="Start with the paycheck, then move into benefits, student loans, investing, job offers, and the money decisions that come with healthcare work."
      >
        <Button asChild variant="hero" size="lg">
          <Link to="/tools/healthcare-worker-total-compensation-comparison">Compare two job offers <ArrowRight className="h-4 w-4" /></Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/tools/healthcare-worker-benefits-blueprint">Build a benefits blueprint</Link>
        </Button>
      </PageHero>

      <section className="container py-10 md:py-14">
        <div className="grid gap-5 rounded-3xl border border-primary/20 bg-primary-soft/30 p-6 shadow-card md:grid-cols-[auto_1fr] md:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-primary shadow-sm">
            <Stethoscope className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Why this worker section exists</div>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">Good income does not automatically create a good financial system.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
              I kept helping coworkers make sense of 403(b) contributions, employer benefits, and the decisions hidden behind an HR portal. The recurring problem was not a lack of effort. Important choices arrived during orientation, open enrollment, job changes, and exhausting shifts without enough context. These tools are meant to make the value behind the paycheck visible before years pass unnoticed.
            </p>
            <Link to="/articles/how-hospital-403b-matching-works" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
              Understand hospital 403(b) matching <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="container py-10 md:py-14">
        <NextStepCards
          eyebrow="Best first steps"
          title="Use one connected worker-money system"
          description="Start with the overall order of operations, compare compensation before changing roles, decide what matters before opening the HR portal, then run the employer's actual benefit numbers."
          cards={[
            {
              eyebrow: "Compare opportunities",
              title: "Healthcare Worker Total Compensation Comparison",
              description: "Compare hourly or salary pay, overtime, differentials, retirement contributions, insurance premiums, PTO, commuting costs, and quality-of-life tradeoffs.",
              href: "/tools/healthcare-worker-total-compensation-comparison",
              cta: "Compare jobs",
            },
            {
              eyebrow: "Paycheck decisions",
              title: "Healthcare Worker Paycheck Tools",
              description: "Use worker-specific calculators for 403(b) contributions, overtime tradeoffs, paycheck changes, and other decisions tied to clinical work.",
              href: "/healthcare-workers/paycheck-tools",
              cta: "Open paycheck tools",
            },
            {
              eyebrow: "Foundation",
              title: "The Healthcare Worker Money Map",
              description: "A simple order of operations for bills, cash, employer match, debt, retirement, and investing.",
              href: "/articles/healthcare-worker-money-map",
              cta: "Read the map",
            },
            {
              eyebrow: "Before HR",
              title: "Healthcare Worker Benefits Blueprint",
              description: "Answer goal-first questions and leave with the retirement, health-plan, HSA, and coverage details to find.",
              href: "/tools/healthcare-worker-benefits-blueprint",
              cta: "Build the blueprint",
            },
            {
              eyebrow: "Actual benefit numbers",
              title: "Employer Benefits Action Plan",
              description: "Enter the employer match, premium, deductible, out-of-pocket maximum, and HSA contributions to build a prioritized action list.",
              href: "/tools/employer-benefits-action-plan",
              cta: "Build the action plan",
            },
            {
              eyebrow: "Interactive system preview",
              title: "Healthcare Worker Benefits Decision System",
              description: "Preview the account-based comparison workflow and join the early-access list. Checkout is not active and no payment is collected.",
              href: "/products/healthcare-worker-benefits-decision-system",
              cta: "See how the system works",
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
          <TopicCard icon={BriefcaseBusiness} title="Job Offers & Total Compensation" description="Compare salary, hourly pay, overtime, benefits, insurance premiums, PTO, commute, and schedule tradeoffs." href="/tools/healthcare-worker-total-compensation-comparison" cta="Compare jobs" accent="green" />
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
            <Link to="/tools/403b-paycheck-calculator">Open the 403(b) calculator</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default HealthcareWorkers;
