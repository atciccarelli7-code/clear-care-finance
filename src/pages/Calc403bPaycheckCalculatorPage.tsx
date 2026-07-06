import { Link } from "react-router-dom";
import { ArrowRight, PiggyBank, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { CalculatorCard, CalculatorNextSteps } from "@/components/shared/CalculatorCard";
import { Calc403bEmailEstimate as Calc403b } from "@/components/calculators/Calc403bEmailEstimate";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";

const Calc403bPaycheckCalculatorPage = () => {
  useSeo({
    title: "403(b) Paycheck Calculator for Nurses and Healthcare Workers",
    description:
      "Estimate how much a 403(b) contribution may take from each paycheck, what could go toward retirement annually, and how employer match may fit into a hospital benefits plan.",
    canonicalPath: "/tools/403b-paycheck-calculator",
  });

  return (
    <>
      <PageHero
        eyebrow="403(b) calculator"
        title="403(b) Paycheck Calculator for Nurses and Healthcare Workers"
        description="Use this before changing payroll elections so the retirement contribution makes sense in the real paycheck, not just in a benefits portal."
      >
        <Button asChild variant="hero" size="lg">
          <a href="#calculator">Run the paycheck estimate <ArrowRight className="h-4 w-4" /></a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/articles/how-much-should-a-nurse-put-in-403b-per-paycheck">Read the contribution guide</Link>
        </Button>
      </PageHero>

      <main className="container min-w-0 space-y-10 py-10 md:space-y-14 md:py-14">
        <section className="grid gap-4 md:grid-cols-3" aria-label="How to use this 403b calculator">
          {[
            {
              title: "Start with the match",
              body: "Enter a contribution percentage and estimate whether the employer match target is being captured.",
            },
            {
              title: "Protect cash flow",
              body: "Compare the retirement goal against rent, food, debt, emergency savings, and real take-home pay.",
            },
            {
              title: "Increase gradually",
              body: "Use 1% changes after raises or debt payoff instead of making a dramatic change that gets reversed later.",
            },
          ].map((card) => (
            <div key={card.title} className="rounded-3xl border border-border bg-card p-5 shadow-card">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="font-display text-lg font-bold">{card.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
            </div>
          ))}
        </section>

        <section id="calculator" className="scroll-mt-28">
          <CalculatorCard
            icon={PiggyBank}
            eyebrow="For healthcare workers"
            title="403(b) Paycheck Contribution Calculator"
            description="Estimate per-paycheck contribution, annual contribution, and a rough employer match estimate before updating payroll elections."
            relatedArticle={{ label: "How Much Should a Nurse Put in a 403(b) Per Paycheck?", href: "/articles/how-much-should-a-nurse-put-in-403b-per-paycheck" }}
          >
            <Calc403b />
            <CalculatorNextSteps
              steps={[
                {
                  label: "How hospital 403(b) matching works",
                  href: "/articles/how-hospital-403b-matching-works",
                  helper: "Use this before assuming the employer contribution is automatic or fully vested.",
                },
                {
                  label: "Roth vs Traditional 403(b) for Healthcare Workers",
                  href: "/articles/roth-vs-traditional-403b-healthcare-workers",
                  helper: "Use this when the paycheck impact depends on pre-tax versus Roth contributions.",
                },
                {
                  label: "How to Pick Retirement Investments at Work",
                  href: "/articles/how-to-pick-retirement-investments-at-work",
                  helper: "The contribution gets money in. The investment election decides what that money buys.",
                },
              ]}
            />
          </CalculatorCard>
        </section>
      </main>
    </>
  );
};

export default Calc403bPaycheckCalculatorPage;
