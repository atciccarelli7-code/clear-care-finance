import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TopicCard } from "@/components/shared/TopicCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PageHero } from "@/components/shared/PageHero";
import { NextStepCards } from "@/components/shared/NextStepCards";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import BenefitsDecisionSystemJourney from "@/components/benefits/BenefitsDecisionSystemJourney";
import { OBBB_OVERTIME_ARTICLE } from "@/data/healthcareWorkerArticles";
import {
  ArrowRight,
  BookOpenCheck,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  FileSearch,
  GraduationCap,
  LockKeyhole,
  PiggyBank,
  Receipt,
  Scale,
  Shield,
  Stethoscope,
  Tag,
  TrendingUp,
  Wallet,
} from "lucide-react";

const paidValue = [
  {
    icon: BookOpenCheck,
    title: "One connected workspace",
    description: "Coordinate medical, prescriptions, HSA or HRA, FSA, retirement, disability, life, supplemental benefits, dependents, and paycheck effects in one review.",
  },
  {
    icon: FileSearch,
    title: "Visible source status",
    description: "Separate verified plan facts from estimates, missing information, conflicting language, and questions that still belong with HR or the carrier.",
  },
  {
    icon: Scale,
    title: "Scenario and tradeoff review",
    description: "Compare expected use, higher-use exposure, employer contributions, network constraints, and benefit tradeoffs without pretending one plan is always best.",
  },
  {
    icon: Receipt,
    title: "A Benefits Decision Brief",
    description: "Leave with a printable record of the decision, assumptions, elections, unresolved questions, deadlines, and official verification steps.",
  },
] as const;

const HealthcareWorkers = () => {
  return (
    <>
      <PageHero
        eyebrow="For nurses & healthcare workers"
        title="Learn workplace benefits for free. Use one guided system when the decision gets complicated."
        description="CAF keeps explanations, calculators, and checklists public. The paid flagship is designed for the person who brings the current benefits documents and knows their personal situation—but should not have to become a benefits expert to make the decision."
      >
        <Button asChild variant="hero" size="lg">
          <a href="#benefits-decision-system">See the guided Decision System <ArrowRight className="h-4 w-4" /></a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/open-enrollment">Use the free open-enrollment guide</Link>
        </Button>
      </PageHero>

      <section id="benefits-decision-system" className="container min-w-0 scroll-mt-24 py-10 md:py-16" aria-labelledby="benefits-decision-system-heading">
        <div className="overflow-hidden rounded-[2rem] border border-primary/25 bg-card shadow-card">
          <div className="grid gap-6 border-b border-border bg-primary-soft/25 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-9">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">CAF's single paid flagship</div>
              <h2 id="benefits-decision-system-heading" className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
                Healthcare Worker Benefits Decision System
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                The purchaser brings the official plan-year documents that apply to them and answers plain-language questions about their household, healthcare-use pattern, budget, priorities, and employment horizon. CAF coordinates the evidence, calculations, tradeoffs, verification work, and final decision brief.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background px-5 py-4 text-sm">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <LockKeyhole className="h-4 w-4 text-primary" aria-hidden="true" /> Preview only
              </div>
              <p className="mt-1 max-w-[18rem] leading-relaxed text-muted-foreground">
                Planned early-access test: <strong className="text-foreground">$29 one time</strong>. Checkout, paid access, and private document upload remain off.
              </p>
            </div>
          </div>

          <div className="p-6 md:p-9">
            <BenefitsDecisionSystemJourney />

            <div className="mt-10">
              <div className="mb-5">
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">What the purchase coordinates</div>
                <h3 className="mt-2 font-display text-2xl font-bold">The value is guided completion—not access to definitions.</h3>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {paidValue.map(({ icon: Icon, title, description }) => (
                  <article key={title} className="rounded-2xl border border-border bg-background/70 p-5">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    <h3 className="mt-3 font-display text-xl font-bold">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-7 grid gap-5 rounded-2xl border border-border bg-muted/20 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" /> Free resources remain useful on their own
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Definitions, deadlines, official links, single-purpose calculators, the Benefits Blueprint, the free Benefits Comparison Workspace, and the open-enrollment guide remain public. The paid value is coordination, saved work, source control, guided review, and the final brief.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button asChild>
                  <Link to="/tools/benefits-command-center">Prepare with the free workspace</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/tools#all-tools">Browse all free tools</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-10 md:py-14">
        <div className="grid gap-5 rounded-3xl border border-primary/20 bg-primary-soft/30 p-6 shadow-card md:grid-cols-[auto_1fr] md:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-primary shadow-sm">
            <Stethoscope className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Why this worker section exists</div>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">Good income does not automatically create a good financial system.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
              I kept helping coworkers make sense of 403(b) contributions, employer benefits, and the decisions hidden behind an HR portal. The recurring problem was not a lack of effort. Important choices arrived during orientation, open enrollment, job changes, and exhausting shifts without enough context. These resources make the value behind the paycheck visible before years pass unnoticed.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold">
              <Link to="/articles/how-hospital-403b-matching-works" className="inline-flex items-center gap-2 text-primary hover:underline">
                Understand hospital 403(b) matching <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/healthcare-workers/career-decisions" className="inline-flex items-center gap-2 text-primary hover:underline">
                Plan a healthcare career move <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-10 md:py-14">
        <NextStepCards
          eyebrow="Free education and tools"
          title="Solve one bounded decision without paying"
          description="Use the focused public resource that matches the immediate question. The paid system becomes relevant only when several benefit decisions must be coordinated and preserved together."
          cards={[
            {
              eyebrow: "Open enrollment",
              title: "Open Enrollment Guide",
              description: "Prepare the documents, costs, networks, prescriptions, accounts, and questions that matter before making elections.",
              href: "/open-enrollment",
              cta: "Open the free guide",
            },
            {
              eyebrow: "Compare opportunities",
              title: "Healthcare Worker Total Compensation Comparison",
              description: "Compare pay, overtime, differentials, retirement contributions, insurance premiums, PTO, commuting costs, and quality-of-life tradeoffs.",
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
              <p className="text-muted-foreground leading-relaxed">{OBBB_OVERTIME_ARTICLE.promise}</p>
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
          eyebrow="Topics for healthcare workers"
          title="The money decisions hospital orientation rarely finishes"
          description="Pick the lane that matches the decision in front of you. You do not need to read everything at once."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <TopicCard icon={BriefcaseBusiness} title="Job Offers & Total Compensation" description="Compare salary, hourly pay, overtime, benefits, insurance premiums, PTO, commute, and schedule tradeoffs." href="/tools/healthcare-worker-total-compensation-comparison" cta="Compare jobs" accent="green" />
          <TopicCard icon={Wallet} title="Paycheck & Benefits" description="403(b), open enrollment, paycheck deductions, insurance choices, and employer benefit paperwork." href="/topics/workplace-benefits" cta="Start benefits" />
          <TopicCard icon={GraduationCap} title="Student Loans" description="PSLF, IDR, Nurse Corps, NHSC, private loan payoff, and refinance planning for healthcare workers." href="/student-loans" cta="Open guide" accent="green" />
          <TopicCard icon={TrendingUp} title="Build Wealth" description="Money maps, fund choices, investing basics, savings rate, and financial independence for healthcare workers." href="/build-wealth" cta="Open hub" />
          <TopicCard icon={PiggyBank} title="Retirement Accounts" description="403(b), 401(a), 457(b), Roth vs Traditional, and fund choices—explained simply." href="/topics/retirement-accounts" cta="Open guide" />
          <TopicCard icon={Shield} title="Health Insurance" description="PPO vs HMO vs HDHP, HSA vs FSA, and how to compare plans." href="/topics/health-insurance" cta="Open guide" />
          <TopicCard icon={Brain} title="Behavior & Burnout" description="Decision fatigue and the money side of long shifts." href="/topics/behavior-burnout" cta="Open guide" />
          <TopicCard icon={Tag} title="Healthcare Worker Discounts & Perks" description="Legitimate discounts without letting them become shopping traps." href="/topics/discounts-perks" cta="Open guide" />
          <TopicCard icon={Receipt} title="Patient Medical Costs" description="Useful even when you're on the clinician side—patients ask." href="/topics/patient-medical-costs" cta="Open guide" accent="green" />
        </div>
      </section>

      <section className="container pb-10 md:pb-14">
        <NewsletterSignup source="healthcare-workers" />
      </section>
    </>
  );
};

export default HealthcareWorkers;
