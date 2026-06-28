import { Wallet, Shield, HeartPulse, Coffee, CreditCard, Receipt, PiggyBank, ClipboardCheck } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { CalculatorCard } from "@/components/shared/CalculatorCard";
import { NextStepCards } from "@/components/shared/NextStepCards";
import { Calc403b, CalcMedicare, CalcCafe } from "@/components/calculators/Calculators";
import HealthInsuranceVisitCostCalculator from "@/components/calculators/HealthInsuranceVisitCostCalculator";
import OutOfPocketMaxEstimator from "@/components/calculators/OutOfPocketMaxEstimator";
import CalcLoanPayment from "@/components/calculators/LoanPayment";
import CalcOvertimeDeduction from "@/components/calculators/OvertimeDeduction";
import HsaFsaDecisionHelper from "@/components/calculators/HsaFsaDecisionHelper";
import {
  OpenEnrollmentPaycheckImpactCalculator,
  OpenEnrollmentTrueCostCalculator,
  SupplementalBenefitsDecisionHelper,
} from "@/components/calculators/OpenEnrollmentTools";
import {
  EobBillMatchChecker,
  FinancialAssistanceChecklist,
  HospitalBillChecklistTool,
  OpenEnrollmentChecklistTool,
} from "@/components/calculators/LaunchChecklistTools";
import { useSeo } from "@/lib/seo";

const calculatorGroups = [
  {
    label: "Open enrollment",
    items: [
      { id: "open-enrollment-checklist", label: "Open Enrollment Final Checklist" },
      { id: "open-enrollment", label: "Open Enrollment True Cost Calculator" },
      { id: "out-of-pocket-max", label: "Out-of-Pocket Max Estimator" },
      { id: "paycheck-impact", label: "Open Enrollment Paycheck Impact Calculator" },
      { id: "supplemental-benefits", label: "Supplemental Benefits Decision Helper" },
      { id: "hsa-fsa", label: "HSA vs FSA Decision Helper" },
    ],
  },
  {
    label: "Hospital bills",
    items: [
      { id: "hospital-bill-checklist", label: "Hospital Bill Review Checklist" },
      { id: "eob-bill-match", label: "EOB-to-Bill Match Checker" },
      { id: "out-of-pocket-max", label: "Out-of-Pocket Max Estimator" },
      { id: "financial-assistance-checklist", label: "Financial Assistance Checklist" },
      { id: "insurance", label: "Health Insurance Visit Cost Calculator" },
    ],
  },
  {
    label: "Healthcare worker money",
    items: [
      { id: "403b", label: "403(b) Paycheck Contribution Calculator" },
      { id: "overtime", label: "OBBB Overtime Deduction Estimator" },
      { id: "cafe", label: "Hospital Cafe Savings Rate Calculator" },
    ],
  },
  {
    label: "Patients, caregivers, and loans",
    items: [
      { id: "medicare", label: "Medicare Cost Exposure Tool" },
      { id: "loan", label: "Student Loan Payment Calculator" },
    ],
  },
];

const jumpToCalculator = (id: string) => {
  if (!id) return;
  const element = document.getElementById(id);
  element?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", `#${id}`);
};

const Tools = () => {
  useSeo({
    title: "Calculators and Checklists",
    description: "Plain-English calculators and checklists for healthcare workers, patients, open enrollment, medical bills, Medicare, savings, and workplace benefits.",
    canonicalPath: "/tools",
  });

  return (
    <>
      <PageHero
        eyebrow="Calculators"
        title="Run the numbers in plain English."
        description="Practical calculators and checklists for paychecks, benefits, insurance choices, open enrollment, medical bills, Medicare, cafe spend, and student loans."
      />

      <section className="container min-w-0 pt-10 md:pt-12">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-card md:p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_360px] md:items-end">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Find a tool fast</div>
              <h2 className="mt-2 font-display text-2xl font-bold">Jump to a calculator or checklist</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Choose the tool you need and the page will move directly to that section. This keeps the full calculator library available without forcing people to scroll through everything.
              </p>
            </div>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-foreground">Select a tool</span>
              <select
                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20"
                defaultValue=""
                onChange={(event) => jumpToCalculator(event.target.value)}
              >
                <option value="" disabled>Choose a calculator...</option>
                {calculatorGroups.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.items.map((item) => (
                      <option key={`${group.label}-${item.id}`} value={item.id}>{item.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="container min-w-0 pt-8">
        <NextStepCards
          eyebrow="Not sure which tool to use?"
          title="Start with the situation, not the calculator name"
          description="Most visitors do not know which formula they need. Pick the real-world problem first."
          cards={[
            {
              eyebrow: "Bill or EOB",
              title: "I got a confusing medical bill",
              description: "Start by matching the provider bill to the insurer's EOB before estimating what may be owed.",
              href: "#eob-bill-match",
              cta: "Check bill vs EOB",
            },
            {
              eyebrow: "Cost cap",
              title: "I want to know my worst-case exposure",
              description: "Use the out-of-pocket max estimator when you know the allowed amount or remaining plan details.",
              href: "#out-of-pocket-max",
              cta: "Estimate cap room",
            },
            {
              eyebrow: "Benefits choice",
              title: "I am comparing health plans",
              description: "Use the open enrollment tools to compare total yearly cost, paycheck impact, HSA/FSA choices, and add-on policies.",
              href: "#open-enrollment",
              cta: "Compare plans",
            },
          ]}
        />
      </section>

      <section className="container min-w-0 py-12 md:py-16 space-y-12">
        <div id="open-enrollment-checklist" className="scroll-mt-28 min-w-0">
          <CalculatorCard icon={ClipboardCheck} eyebrow="Open enrollment" title="Open Enrollment Final Checklist" description="A printable final pass for health, tax account, disability, life, and supplemental benefit elections." relatedArticle={{ label: "Open Enrollment Guide", href: "/open-enrollment" }}>
            <OpenEnrollmentChecklistTool />
          </CalculatorCard>
        </div>

        <div id="hospital-bill-checklist" className="scroll-mt-28 min-w-0">
          <CalculatorCard icon={ClipboardCheck} eyebrow="Hospital bills" title="Hospital Bill Review Checklist" description="A practical checklist for reviewing a large, confusing, or surprising healthcare balance." relatedArticle={{ label: "Financial Assistance Guide", href: "/articles/check-hospital-financial-assistance-before-paying" }}>
            <HospitalBillChecklistTool />
          </CalculatorCard>
        </div>

        <div id="eob-bill-match" className="scroll-mt-28 min-w-0">
          <CalculatorCard icon={Receipt} eyebrow="Hospital bills" title="EOB-to-Bill Match Checker" description="Compare an insurer explanation with a provider bill and identify mismatches to ask about." relatedArticle={{ label: "How to Read an EOB", href: "/articles/how-to-read-an-eob" }}>
            <EobBillMatchChecker />
          </CalculatorCard>
        </div>

        <div id="out-of-pocket-max" className="scroll-mt-28 min-w-0">
          <CalculatorCard icon={Shield} eyebrow="Benefits and insurance" title="Out-of-Pocket Max Estimator" description="Estimate how close covered in-network care could bring someone to the plan's yearly out-of-pocket maximum." relatedArticle={{ label: "Full Out-of-Pocket Max Calculator Page", href: "/tools/out-of-pocket-max-estimator" }}>
            <OutOfPocketMaxEstimator />
          </CalculatorCard>
        </div>

        <div id="financial-assistance-checklist" className="scroll-mt-28 min-w-0">
          <CalculatorCard icon={Shield} eyebrow="Hospital bills" title="Financial Assistance Checklist" description="A document checklist for hospital financial assistance and charity care applications." relatedArticle={{ label: "Financial Assistance Guide", href: "/articles/check-hospital-financial-assistance-before-paying" }}>
            <FinancialAssistanceChecklist />
          </CalculatorCard>
        </div>

        <div id="403b" className="scroll-mt-28 min-w-0">
          <CalculatorCard icon={Wallet} eyebrow="For healthcare workers" title="403(b) Paycheck Contribution Calculator" description="See per-paycheck contributions, annual contribution, and a rough employer match estimate." relatedArticle={{ label: "How to Pick Retirement Investments at Work", href: "/articles/how-to-pick-retirement-investments-at-work" }}>
            <Calc403b />
          </CalculatorCard>
        </div>

        <div id="overtime" className="scroll-mt-28 min-w-0">
          <CalculatorCard icon={Receipt} eyebrow="For healthcare workers" title="OBBB Overtime Deduction Estimator" description="Estimate the qualifying half-time overtime premium, deduction cap, and rough federal income-tax savings." relatedArticle={{ label: "OBBB Overtime Tax Deduction Explained", href: "/articles/obbb-overtime-tax-deduction-healthcare-workers" }}>
            <CalcOvertimeDeduction />
          </CalculatorCard>
        </div>

        <div id="insurance" className="scroll-mt-28 min-w-0">
          <CalculatorCard icon={Shield} eyebrow="For everyone" title="Health Insurance Visit Cost Calculator" description="Estimate yearly out-of-pocket cost across premium, deductible, copays, coinsurance, visits, and remaining out-of-pocket max room." relatedArticle={{ label: "Plain-English Healthcare Finance Glossary", href: "/articles/plain-english-glossary" }}>
            <HealthInsuranceVisitCostCalculator />
          </CalculatorCard>
        </div>

        <div id="open-enrollment" className="scroll-mt-28 min-w-0">
          <CalculatorCard icon={Shield} eyebrow="Open enrollment" title="Open Enrollment True Cost Calculator" description="Compare two plans by annual premiums, expected out-of-pocket costs, employer HSA/HRA money, and bad-year exposure." relatedArticle={{ label: "Premium, Deductible, and Out-of-Pocket Max", href: "/articles/premium-deductible-out-of-pocket-open-enrollment" }}>
            <OpenEnrollmentTrueCostCalculator />
          </CalculatorCard>
        </div>

        <div id="paycheck-impact" className="scroll-mt-28 min-w-0">
          <CalculatorCard icon={Receipt} eyebrow="Open enrollment" title="Open Enrollment Paycheck Impact Calculator" description="Estimate how benefit elections may change take-home pay after pre-tax savings and after-tax deductions." relatedArticle={{ label: "How Open Enrollment Changes Your Paycheck", href: "/articles/open-enrollment-paycheck-impact" }}>
            <OpenEnrollmentPaycheckImpactCalculator />
          </CalculatorCard>
        </div>

        <div id="supplemental-benefits" className="scroll-mt-28 min-w-0">
          <CalculatorCard icon={Wallet} eyebrow="Open enrollment" title="Supplemental Benefits Decision Helper" description="Evaluate accident, critical illness, and hospital indemnity policies against annual premium, emergency fund, and likely payout." relatedArticle={{ label: "Accident, Critical Illness, and Hospital Indemnity", href: "/articles/accident-critical-illness-hospital-indemnity-open-enrollment" }}>
            <SupplementalBenefitsDecisionHelper />
          </CalculatorCard>
        </div>

        <div id="hsa-fsa" className="scroll-mt-28 min-w-0">
          <CalculatorCard icon={PiggyBank} eyebrow="Open enrollment" title="HSA vs FSA Decision Helper" description="Compare tax savings, employer HSA money, HDHP premium savings, deductible risk, FSA forfeiture risk, and provider factors." relatedArticle={{ label: "HSA vs FSA Guide", href: "/articles/hsa-vs-fsa-healthcare-workers" }}>
            <HsaFsaDecisionHelper />
          </CalculatorCard>
        </div>

        <div id="medicare" className="scroll-mt-28 min-w-0">
          <CalculatorCard icon={HeartPulse} eyebrow="For patients & caregivers" title="Medicare Cost Exposure Tool" description="Rough estimate for premiums, deductibles, prescriptions, and coinsurance over a year." relatedArticle={{ label: "Medicare Options Explained", href: "/articles/medicare-options-explained" }}>
            <CalcMedicare />
          </CalculatorCard>
        </div>

        <div id="cafe" className="scroll-mt-28 min-w-0">
          <CalculatorCard icon={Coffee} eyebrow="Spending, no shame" title="Hospital Cafe Savings Rate Calculator" description="See what daily cafe spend adds up to over a year — and what redirecting some of it could grow into." relatedArticle={{ label: "Your Hospital Cafe Habit Might Be Quietly Eating Your Savings Rate", href: "/articles/hospital-cafe-habit" }}>
            <CalcCafe />
          </CalculatorCard>
        </div>

        <div id="loan" className="scroll-mt-28 min-w-0">
          <CalculatorCard icon={CreditCard} eyebrow="For everyone" title="Student Loan Payment Calculator" description="Estimate monthly payment, total paid, and interest over time.">
            <CalcLoanPayment />
          </CalculatorCard>
        </div>
      </section>
    </>
  );
};

export default Tools;
