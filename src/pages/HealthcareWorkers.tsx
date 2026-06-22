import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TopicCard } from "@/components/shared/TopicCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PageHero } from "@/components/shared/PageHero";
import { Wallet, PiggyBank, Shield, Receipt, Brain, Tag, ArrowRight } from "lucide-react";

const HealthcareWorkers = () => {
  return (
    <>
      <PageHero
        eyebrow="For nurses & bedside clinicians"
        title="Money education built for healthcare workers."
        description="You take care of patients. We'll help you make sense of the paycheck, benefits, and long-term decisions that come with the job."
      >
        <Button asChild variant="hero" size="lg">
          <Link to="/tools/403b-contribution">Try the 403(b) calculator <ArrowRight className="h-4 w-4" /></Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/topics">Browse topics</Link>
        </Button>
      </PageHero>

      <section className="container py-16 md:py-20">
        <SectionHeading
          centered
          eyebrow="Topics for you"
          title="The money stuff your hospital orientation skipped"
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <TopicCard icon={Wallet} title="Workplace Benefits" description="Decode open enrollment paperwork without calling HR." href="/topics/workplace-benefits" cta="Open guide" />
          <TopicCard icon={PiggyBank} title="Retirement Accounts" description="403(b), 401(a), 457(b), Roth vs Traditional — explained simply." href="/topics/retirement-accounts" cta="Open guide" />
          <TopicCard icon={Shield} title="Health Insurance" description="PPO vs HMO vs HDHP, HSA vs FSA, and how to compare plans." href="/topics/health-insurance" cta="Open guide" />
          <TopicCard icon={Brain} title="Spending, Burnout & Behavior" description="Decision fatigue and the money side of long shifts." href="/topics/spending-burnout-behavior" cta="Open guide" />
          <TopicCard icon={Tag} title="Healthcare Worker Discounts" description="Legitimate discount programs — without spammy affiliate noise." href="/topics/healthcare-worker-discounts" cta="Open guide" />
          <TopicCard icon={Receipt} title="Patient Medical Costs" description="Useful even when you're on the clinician side — patients ask." href="/topics/patient-medical-costs" cta="Open guide" accent="green" />
        </div>
      </section>

      <section className="container pb-20">
        <div className="rounded-3xl bg-gradient-accent p-10 md:p-14 text-center text-primary-foreground shadow-hover">
          <h2 className="font-display text-3xl font-bold mb-3 text-balance">See what a small bump in your 403(b) does</h2>
          <p className="opacity-90 mb-6 max-w-xl mx-auto">Adjust contribution % and employer match and watch the per-paycheck and yearly totals update.</p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/tools/403b-contribution">Open the 403(b) calculator</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default HealthcareWorkers;
