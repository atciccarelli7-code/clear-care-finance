import { Wallet, Shield, HeartPulse, Coffee } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { CalculatorCard } from "@/components/shared/CalculatorCard";
import { Calc403b, CalcInsurance, CalcMedicare, CalcCafe } from "@/components/calculators/Calculators";

const Tools = () => {
  return (
    <>
      <PageHero
        eyebrow="Calculators"
        title="Run the numbers in plain English."
        description="Four friendly calculators to estimate paychecks, insurance, Medicare, and quietly accumulating café spend."
      />

      <section className="container py-12 md:py-16 space-y-12">
        <div id="403b" className="scroll-mt-24">
          <CalculatorCard
            icon={Wallet}
            eyebrow="For healthcare workers"
            title="403(b) Paycheck Contribution Calculator"
            description="See per-paycheck contributions, annual contribution, and a rough employer match estimate."
            relatedArticle={{ label: "How to Pick Retirement Investments at Work", href: "/articles/how-to-pick-retirement-investments-at-work" }}
          >
            <Calc403b />
          </CalculatorCard>
        </div>

        <div id="insurance" className="scroll-mt-24">
          <CalculatorCard
            icon={Shield}
            eyebrow="For everyone"
            title="Health Insurance Visit Cost Calculator"
            description="Estimate yearly out-of-pocket cost across premium, deductible, copays, coinsurance, and visits."
            relatedArticle={{ label: "Plain-English Healthcare Finance Glossary", href: "/articles/plain-english-glossary" }}
          >
            <CalcInsurance />
          </CalculatorCard>
        </div>

        <div id="medicare" className="scroll-mt-24">
          <CalculatorCard
            icon={HeartPulse}
            eyebrow="For patients & caregivers"
            title="Medicare Cost Exposure Tool"
            description="Rough estimate for premiums, deductibles, prescriptions, and coinsurance over a year."
            relatedArticle={{ label: "Medicare Options Explained", href: "/articles/medicare-options-explained" }}
          >
            <CalcMedicare />
          </CalculatorCard>
        </div>

        <div id="cafe" className="scroll-mt-24">
          <CalculatorCard
            icon={Coffee}
            eyebrow="Spending, no shame"
            title="Hospital Café Savings Rate Calculator"
            description="See what daily café spend adds up to over a year — and what redirecting some of it could grow into."
            relatedArticle={{ label: "Your Hospital Café Habit Might Be Quietly Eating Your Savings Rate", href: "/articles/hospital-cafe-habit" }}
          >
            <CalcCafe />
          </CalculatorCard>
        </div>
      </section>
    </>
  );
};

export default Tools;
