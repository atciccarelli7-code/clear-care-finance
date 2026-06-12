import { SectionHeading } from "@/components/shared/SectionHeading";
import { Calc403b, CalcInsurance, CalcMedicare } from "@/components/calculators/Calculators";
import { Wallet, Shield, HeartPulse } from "lucide-react";

const Tools = () => {
  return (
    <>
      <section className="bg-gradient-hero">
        <div className="container py-16 md:py-20 text-center max-w-3xl mx-auto space-y-4 animate-fade-up">
          <span className="inline-block px-3 py-1 rounded-full bg-card border border-border text-xs font-semibold text-primary shadow-card">
            Tools & Calculators
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
            Run the numbers in plain English.
          </h1>
          <p className="text-lg text-muted-foreground">
            Friendly placeholder tools to estimate paycheck contributions, insurance costs, and Medicare expenses.
          </p>
        </div>
      </section>

      <section className="container py-16">
        <CalcSection
          id="403b"
          icon={Wallet}
          eyebrow="For healthcare workers"
          title="403(b) Paycheck Contribution Calculator"
          description="See roughly how much goes into your retirement account from each paycheck."
        >
          <Calc403b />
        </CalcSection>

        <div className="my-20 border-t border-border" />

        <CalcSection
          id="insurance"
          icon={Shield}
          eyebrow="For everyone"
          title="Insurance Visit Cost Calculator"
          description="Estimate your yearly out-of-pocket cost so plan comparisons stop feeling like a guessing game."
        >
          <CalcInsurance />
        </CalcSection>

        <div className="my-20 border-t border-border" />

        <CalcSection
          id="medicare"
          icon={HeartPulse}
          eyebrow="For patients & caregivers"
          title="Medicare Cost Estimator"
          description="Get a rough idea of premiums, deductibles, and coinsurance for the year."
        >
          <CalcMedicare />
        </CalcSection>
      </section>
    </>
  );
};

const CalcSection = ({
  id, icon: Icon, eyebrow, title, description, children,
}: {
  id: string; icon: any; eyebrow: string; title: string; description: string; children: React.ReactNode;
}) => (
  <section id={id} className="scroll-mt-24">
    <div className="flex items-start gap-4 mb-8">
      <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary shrink-0">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <span className="inline-block px-3 py-1 rounded-full bg-secondary-soft text-secondary text-xs font-semibold uppercase tracking-wider mb-2">
          {eyebrow}
        </span>
        <h2 className="font-display text-2xl md:text-3xl font-bold">{title}</h2>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
    {children}
  </section>
);

export default Tools;
