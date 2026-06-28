import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeDollarSign,
  BarChart3,
  BriefcaseBusiness,
  Calculator,
  ClipboardList,
  Coffee,
  PiggyBank,
  ShieldCheck,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { NextStepCards } from "@/components/shared/NextStepCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSeo } from "@/lib/seo";

type HubCard = {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  icon: LucideIcon;
};

const moneyMapCards: HubCard[] = [
  {
    eyebrow: "Start here",
    title: "The Healthcare Worker Money Map",
    body: "A simple order of operations for each paycheck: bills, cash buffer, employer match, high-interest debt, retirement, and extra investing.",
    href: "/articles/healthcare-worker-money-map",
    cta: "Read the map",
    icon: ClipboardList,
  },
  {
    eyebrow: "Investing basics",
    title: "Invest Without Picking Stocks",
    body: "Use broad diversification, payroll automation, and retirement accounts without turning investing into a second job.",
    href: "/articles/how-healthcare-workers-can-invest-without-picking-stocks",
    cta: "Learn the system",
    icon: TrendingUp,
  },
  {
    eyebrow: "Financial independence",
    title: "The Savings Rate That Changes Your Life",
    body: "Understand why savings rate buys future flexibility and why overtime needs a job before it disappears.",
    href: "/articles/savings-rate-that-actually-changes-your-life",
    cta: "Build flexibility",
    icon: PiggyBank,
  },
];

const toolCards: HubCard[] = [
  {
    eyebrow: "Retirement",
    title: "403(b) Paycheck Contribution Calculator",
    body: "Estimate per-paycheck contributions, yearly savings, employer match, and the effect of raising contribution percentage.",
    href: "/tools#403b",
    cta: "Run 403(b) math",
    icon: Calculator,
  },
  {
    eyebrow: "Paycheck",
    title: "Overtime Deduction Estimator",
    body: "Model how qualifying overtime premium pay may interact with paycheck planning and tax estimates.",
    href: "/tools#overtime",
    cta: "Estimate overtime",
    icon: BadgeDollarSign,
  },
  {
    eyebrow: "Spending habits",
    title: "Hospital Cafe Savings Rate Calculator",
    body: "See how coffee, snacks, and lunch on shift add up, then redirect the difference toward goals without shame.",
    href: "/tools#cafe",
    cta: "Check the leak",
    icon: Coffee,
  },
  {
    eyebrow: "Benefits",
    title: "Open Enrollment Paycheck Impact Calculator",
    body: "Keep the finance and benefits pieces connected by estimating how elections change take-home pay.",
    href: "/tools#paycheck-impact",
    cta: "Check deductions",
    icon: Wallet,
  },
];

const futureBuildCards: HubCard[] = [
  {
    eyebrow: "Next calculator",
    title: "FI Timeline Calculator",
    body: "Current investments, yearly contributions, expected return, and target spending translated into a rough independence timeline.",
    href: "/contact",
    cta: "Planned build",
    icon: BarChart3,
  },
  {
    eyebrow: "Next article",
    title: "Roth vs Traditional 403(b)",
    body: "A practical tax and paycheck guide for healthcare workers choosing between current tax relief and future tax flexibility.",
    href: "/articles",
    cta: "Coming next",
    icon: ShieldCheck,
  },
  {
    eyebrow: "Career lever",
    title: "Earn More Without Burning Out",
    body: "Career moves, role changes, certifications, and business skills that can raise income without relying only on extra shifts.",
    href: "/healthcare-workers",
    cta: "Explore worker hub",
    icon: BriefcaseBusiness,
  },
];

const CardLink = ({ card }: { card: HubCard }) => {
  const Icon = card.icon;

  return (
    <Link
      to={card.href}
      className="group rounded-3xl border border-border bg-card p-5 shadow-card transition-smooth hover:-translate-y-0.5 hover:shadow-hover md:p-6"
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{card.eyebrow}</div>
      <h3 className="mt-2 font-display text-xl font-bold leading-tight text-foreground">{card.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
      <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
        {card.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
};

const BuildWealthHub = () => {
  useSeo({
    title: "Build Wealth",
    description:
      "Plain-English money, investing, retirement, savings rate, and financial independence guidance for healthcare workers and patients.",
    canonicalPath: "/build-wealth",
  });

  return (
    <>
      <PageHero
        eyebrow="Build Wealth"
        title="Manage money, invest simply, and buy back future flexibility."
        description="The healthcare system creates confusing bills and benefits. Your personal money system should be simpler: know the paycheck, capture employer money, build cash, invest consistently, and avoid decisions that keep you stuck."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="hero">
            <Link to="/articles/healthcare-worker-money-map">Start with the money map</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/tools#403b">Run the 403(b) calculator</Link>
          </Button>
        </div>
      </PageHero>

      <main className="container space-y-16 py-12 md:py-16">
        <NextStepCards
          eyebrow="Pick your money question"
          title="Where are you trying to get unstuck?"
          description="The goal is not more finance content. The goal is a usable path from paycheck confusion to long-term investing."
          cards={[
            {
              eyebrow: "Paycheck system",
              title: "What should I do with each paycheck?",
              description: "Start with the money map, then use the 403(b) and paycheck tools to turn it into a repeatable plan.",
              href: "/articles/healthcare-worker-money-map",
              cta: "Start here",
            },
            {
              eyebrow: "Investing",
              title: "How do I invest without overcomplicating it?",
              description: "Learn the account-versus-investment difference and why broad, automated investing can be enough.",
              href: "/articles/how-healthcare-workers-can-invest-without-picking-stocks",
              cta: "Learn investing",
            },
            {
              eyebrow: "Freedom",
              title: "How do I buy back time?",
              description: "Use savings rate, overtime intentionally, and small spending awareness to build flexibility faster.",
              href: "/articles/savings-rate-that-actually-changes-your-life",
              cta: "Build flexibility",
            },
          ]}
        />

        <section>
          <SectionHeading
            centered
            eyebrow="Core articles"
            title="The wealth-building spine of the site"
            description="These guides rebalance the website toward money management, investing, and financial independence while keeping the healthcare-worker lens."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {moneyMapCards.map((card) => (
              <CardLink key={card.href} card={card} />
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-primary/15 bg-primary-soft/30 p-5 shadow-card md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">The site thesis</div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">Healthcare is the angle. Wealth-building is still the mission.</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                Benefits, insurance, and hospital bills create trust because they are confusing and high-stakes. The broader mission is helping people in and around healthcare make better money decisions: paychecks, investing, savings rate, career income, benefits, and financial independence.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Get the employer match.",
                "Build cash before chaos hits.",
                "Invest simply and consistently.",
                "Use healthcare knowledge as the edge, not the cage.",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-primary/15 bg-card p-4 text-sm font-semibold text-foreground shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <SectionHeading
            centered
            eyebrow="Calculators"
            title="Turn money ideas into numbers"
            description="These tools connect the build-wealth pillar to paycheck decisions, benefits, savings habits, and retirement contributions."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {toolCards.map((card) => (
              <CardLink key={card.href} card={card} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            centered
            eyebrow="Coming next"
            title="The next finance pieces to build"
            description="These are intentionally shown as the roadmap so visitors see the site is bigger than insurance without sending them to empty pages."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {futureBuildCards.map((card) => (
              <CardLink key={card.title} card={card} />
            ))}
          </div>
        </section>

        <Card className="rounded-3xl shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-2xl">How this fits with the insurance tools</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Insurance and benefits protect the downside. Investing and savings rate build the upside. The site needs both.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="hero">
              <Link to="/insurance">Use insurance tools</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/healthcare-workers">Healthcare worker hub</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/articles">Browse all articles</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default BuildWealthHub;
