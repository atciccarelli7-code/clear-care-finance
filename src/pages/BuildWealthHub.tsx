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

type Stage = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cards: HubCard[];
};

const stages: Stage[] = [
  {
    id: "stabilize",
    eyebrow: "Stage 1",
    title: "Stabilize",
    description: "Start with the paycheck, cash buffer, known bills, and one small spending pattern you can actually see.",
    cards: [
      {
        eyebrow: "Start here",
        title: "The Healthcare Worker Money Map",
        body: "A simple order of operations for each paycheck: bills, cash, employer match, debt payoff, retirement, and extra investing.",
        href: "/articles/healthcare-worker-money-map",
        cta: "Read map",
        icon: ClipboardList,
      },
      {
        eyebrow: "Cash balance",
        title: "Cash vs Investing",
        body: "Decide which dollars should stay liquid and which dollars can work toward long-term compounding.",
        href: "/articles/cash-vs-investing-when-you-feel-behind",
        cta: "Find balance",
        icon: Wallet,
      },
      {
        eyebrow: "Small leak",
        title: "Cafe Savings Rate Calculator",
        body: "See how shift spending adds up and decide whether any of it should be redirected.",
        href: "/tools#cafe",
        cta: "Check spend",
        icon: Coffee,
      },
    ],
  },
  {
    id: "work-benefits",
    eyebrow: "Stage 2",
    title: "Use Work Benefits",
    description: "Turn workplace retirement, tax choices, fund selection, and paycheck deductions into practical decisions.",
    cards: [
      {
        eyebrow: "Tool",
        title: "403(b) Paycheck Calculator",
        body: "Estimate per-paycheck contributions, annual savings, and employer match impact.",
        href: "/tools#403b",
        cta: "Run math",
        icon: Calculator,
      },
      {
        eyebrow: "Fund choice",
        title: "Pick Retirement Investments at Work",
        body: "Compare target-date funds, S&P 500 index funds, fees, and risk inside a workplace plan.",
        href: "/articles/how-to-pick-retirement-investments-at-work",
        cta: "Pick funds",
        icon: BarChart3,
      },
      {
        eyebrow: "Tax choice",
        title: "Roth vs Traditional 403(b)",
        body: "Compare current tax relief with future tax flexibility before changing contribution type.",
        href: "/articles/roth-vs-traditional-403b-healthcare-workers",
        cta: "Compare",
        icon: ShieldCheck,
      },
      {
        eyebrow: "Paycheck",
        title: "Overtime Deduction Estimator",
        body: "Estimate how qualifying overtime premium pay may affect paycheck planning.",
        href: "/tools#overtime",
        cta: "Estimate",
        icon: BadgeDollarSign,
      },
    ],
  },
  {
    id: "build-freedom",
    eyebrow: "Stage 3",
    title: "Build Freedom",
    description: "Use investing, savings rate, career income, and FI math to create more long-term optionality.",
    cards: [
      {
        eyebrow: "Investing basics",
        title: "Invest Without Picking Stocks",
        body: "Use broad diversification, automation, and retirement accounts without turning investing into a second job.",
        href: "/articles/how-healthcare-workers-can-invest-without-picking-stocks",
        cta: "Learn system",
        icon: TrendingUp,
      },
      {
        eyebrow: "Savings rate",
        title: "The Savings Rate That Changes Your Life",
        body: "Understand why savings rate buys future flexibility and why extra income needs a job.",
        href: "/articles/savings-rate-that-actually-changes-your-life",
        cta: "Build flexibility",
        icon: PiggyBank,
      },
      {
        eyebrow: "FI math",
        title: "Can Healthcare Workers Reach FI?",
        body: "Translate financial independence into savings rate, asset base, and timeline decisions.",
        href: "/articles/can-healthcare-workers-reach-financial-independence",
        cta: "Read guide",
        icon: BarChart3,
      },
      {
        eyebrow: "Career income",
        title: "Earn More from Healthcare Skills",
        body: "Use role changes, certifications, business skills, and healthcare knowledge to expand income options.",
        href: "/articles/earn-more-without-burning-out-bedside",
        cta: "Build income",
        icon: BriefcaseBusiness,
      },
    ],
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
        title="Build future flexibility in the right order."
        description="Start with stability, use workplace benefits intentionally, then build toward investing, career income, and financial independence."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="hero">
            <Link to="/articles/healthcare-worker-money-map">Start with money map</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/tools#403b">Run 403(b) math</Link>
          </Button>
        </div>
      </PageHero>

      <main className="container space-y-14 py-12 md:py-16">
        <NextStepCards
          eyebrow="Pick your stage"
          title="Where are you trying to get unstuck?"
          description="This hub is organized by sequence, not by jargon. Stabilize first, use benefits second, build freedom third."
          cards={stages.map((stage) => ({
            eyebrow: stage.eyebrow,
            title: stage.title,
            description: stage.description,
            href: `#${stage.id}`,
            cta: "Jump to stage",
          }))}
        />

        {stages.map((stage) => (
          <section key={stage.id} id={stage.id} className="scroll-mt-24">
            <SectionHeading centered eyebrow={stage.eyebrow} title={stage.title} description={stage.description} />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {stage.cards.map((card) => (
                <CardLink key={card.href} card={card} />
              ))}
            </div>
          </section>
        ))}

        <section className="rounded-[2rem] border border-primary/15 bg-primary-soft/30 p-5 shadow-card md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Site thesis</div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">Healthcare is the angle. Flexibility is the mission.</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                Benefits, insurance, and hospital bills create trust because they are confusing and high-stakes. The broader mission is helping people make better paycheck, investing, savings, and career decisions.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Get the employer match.",
                "Build cash before chaos hits.",
                "Invest simply and consistently.",
                "Use income growth as leverage.",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-primary/15 bg-card p-4 text-sm font-semibold text-foreground shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <Card className="rounded-3xl shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-2xl">How this connects to the insurance tools</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Insurance and benefits protect the downside. Investing, savings rate, and career income build the upside. The site needs both.
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