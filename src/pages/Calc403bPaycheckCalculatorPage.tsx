import { Link } from "react-router-dom";
import { ArrowRight, PiggyBank, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { CalculatorCard, CalculatorNextSteps } from "@/components/shared/CalculatorCard";
import { Calc403bEmailEstimate as Calc403b } from "@/components/calculators/Calc403bEmailEstimate";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";

const Calc403bPaycheckCalculatorPage = () => {
  useSeo({
    title: "403(b) Paycheck and Employer Match Calculator for Healthcare Workers",
    description:
      "Estimate a 403(b) payroll contribution, model common employer matching or non-elective formulas, and identify what to verify before changing payroll.",
    canonicalPath: "/tools/403b-paycheck-calculator",
  });

  return (
    <>
      <PageHero
        eyebrow="403(b) decision calculator"
        title="403(b) Paycheck and Employer Match Calculator"
        description="Estimate the paycheck contribution, enter the actual employer formula, and leave with a plan-document verification checklist—not a generic match guess."
      >
        <Button asChild variant="hero" size="lg">
          <a href="#calculator">Build the 403(b) decision <ArrowRight className="h-4 w-4" /></a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/articles/how-hospital-403b-matching-works">Read the matching guide</Link>
        </Button>
      </PageHero>

      <div className="container min-w-0 space-y-10 py-10 md:space-y-14 md:py-14">
        <section className="grid gap-4 md:grid-cols-3" aria-label="How to use this 403b calculator">
          {[
            {
              title: "Use the exact formula",
              body: "A 50% match on the first 6% is not the same as a 6% employer contribution. Use the current plan document.",
            },
            {
              title: "Protect cash flow",
              body: "Compare the payroll election with rent, food, debt, emergency savings, and dependable take-home pay.",
            },
            {
              title: "Verify the deposit",
              body: "Check eligible compensation, per-paycheck funding, true-up rules, vesting, and the next employer deposit.",
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
            title="403(b) Contribution and Employer Formula Decision"
            description="Estimate employee contributions, model supported employer formulas, and fail safely when the actual plan is tiered, discretionary, or unknown."
            relatedArticle={{ label: "How Much Should a Nurse Put in a 403(b) Per Paycheck?", href: "/articles/how-much-should-a-nurse-put-in-403b-per-paycheck" }}
          >
            <Calc403b />
            <CalculatorNextSteps
              steps={[
                {
                  label: "How hospital 403(b) matching works",
                  href: "/articles/how-hospital-403b-matching-works",
                  helper: "Use this before assuming the employer contribution is automatic, dollar for dollar, or fully vested.",
                },
                {
                  label: "Roth vs Traditional 403(b) for Healthcare Workers",
                  href: "/articles/roth-vs-traditional-403b-healthcare-workers",
                  helper: "Use this when the paycheck impact depends on pre-tax versus Roth contributions.",
                },
                {
                  label: "How to Pick Retirement Investments at Work",
                  href: "/articles/how-to-pick-retirement-investments-at-work",
                  helper: "The payroll contribution gets money into the account; the investment election decides what it buys.",
                },
              ]}
            />
          </CalculatorCard>
        </section>
      </div>
    </>
  );
};

export default Calc403bPaycheckCalculatorPage;
