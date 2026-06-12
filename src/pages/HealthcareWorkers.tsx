import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TopicCard } from "@/components/shared/TopicCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Wallet, PiggyBank, Shield, Receipt, TrendingUp, Calculator, ArrowRight } from "lucide-react";

const HealthcareWorkers = () => {
  return (
    <>
      <section className="bg-gradient-hero">
        <div className="container py-20 md:py-28 text-center max-w-3xl mx-auto space-y-5 animate-fade-up">
          <span className="inline-block px-3 py-1 rounded-full bg-card border border-border text-xs font-semibold text-primary shadow-card">
            For nurses & bedside clinicians
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
            Money education built for healthcare workers.
          </h1>
          <p className="text-lg text-muted-foreground">
            You take care of patients. We'll help you make sense of the paycheck, benefits, and long-term decisions that come with the job.
          </p>
          <div className="pt-2">
            <Button asChild variant="hero" size="lg">
              <Link to="/tools">Try a paycheck calculator <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <SectionHeading
          centered
          eyebrow="Topics"
          title="The money stuff your hospital orientation skipped"
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Wallet, title: "Paychecks and overtime", description: "Differentials, overtime rules, and pre-tax deductions explained line by line." },
            { icon: PiggyBank, title: "403(b), 401(a), and workplace retirement plans", description: "What they are, how matches work, and how to make sense of contribution choices." },
            { icon: Shield, title: "Health insurance through work", description: "PPO vs HMO vs HDHP, HSAs, FSAs, and how to actually compare plans at open enrollment." },
            { icon: Receipt, title: "Taxes and benefits", description: "Pre-tax accounts, withholdings, and the benefits that quietly save you money." },
            { icon: TrendingUp, title: "Career income growth", description: "Certifications, shift planning, and decisions that move income up over a career." },
            { icon: Calculator, title: "Calculators built for your paycheck", description: "Estimate retirement contributions and out-of-pocket costs in plain English.", href: "/tools" },
          ].map((t) => (
            <TopicCard key={t.title} {...t} href={t.href} cta={t.href ? "Open calculators" : undefined} />
          ))}
        </div>
      </section>

      <section className="container pb-20">
        <div className="rounded-3xl bg-gradient-accent p-10 md:p-14 text-center text-secondary-foreground shadow-hover">
          <h2 className="font-display text-3xl font-bold mb-3">See what a small bump in your 403(b) does</h2>
          <p className="opacity-90 mb-6 max-w-xl mx-auto">Adjust the contribution percentage and see your per-paycheck and annual totals.</p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/tools">Open the 403(b) calculator</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default HealthcareWorkers;
