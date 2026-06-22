import { ArrowRight, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/shared/PageHero";
import { CALCULATOR_ICONS } from "@/components/calculators/CalculatorIcon";
import { CALCULATORS } from "@/data/calculators";

const Tools = () => (
  <>
    <PageHero
      eyebrow="Calculators"
      title="Run the numbers in plain English."
      description="Eight focused tools for healthcare paychecks, benefits, bills, savings, work spending, overtime, Medicare, and student loans."
    />

    <section className="container py-12 md:py-16">
      <div className="mx-auto mb-8 flex max-w-3xl items-start gap-3 rounded-2xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <p>Calculations run in your browser. Do not enter account numbers, Social Security numbers, medical records, or other sensitive information.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {CALCULATORS.map((calculator) => {
          const Icon = CALCULATOR_ICONS[calculator.icon];
          return (
            <article
              key={calculator.key}
              id={calculator.legacyAnchor}
              className="scroll-mt-24 rounded-3xl border border-border bg-card/60 p-6 shadow-card transition-smooth hover:border-primary/40 hover:shadow-hover"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-secondary">{calculator.eyebrow}</p>
              <h2 className="mt-2 font-display text-xl font-bold">{calculator.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{calculator.description}</p>
              <Button asChild className="mt-5 min-h-11 w-full sm:w-auto">
                <Link to={`/tools/${calculator.slug}`}>Open calculator <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </article>
          );
        })}
      </div>
    </section>
  </>
);

export default Tools;
