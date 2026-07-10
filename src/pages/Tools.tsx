import type { ReactNode } from "react";
import { Wallet, Shield, HeartPulse, Coffee, CreditCard, Receipt, PiggyBank, ClipboardCheck, GraduationCap, Landmark, ArrowRight, Sparkles } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { CalculatorCard } from "@/components/shared/CalculatorCard";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { CalcMedicare, CalcCafe } from "@/components/calculators/Calculators";
import { Calc403bEmailEstimate as Calc403b } from "@/components/calculators/Calc403bEmailEstimate";
import HealthInsuranceVisitCostCalculator from "@/components/calculators/HealthInsuranceVisitCostCalculator";
import OutOfPocketMaxEstimator from "@/components/calculators/OutOfPocketMaxEstimator";
import CalcLoanPayment from "@/components/calculators/LoanPayment";
import { PSLFProgressEstimator, PrivateLoanPayoffCalculator, StudentLoanPathFinder } from "@/components/calculators/StudentLoanTools";
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
import { trackToolEvent } from "@/lib/siteAnalytics";
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
      { id: "medical-bill-review-flow", label: "Medical Bill Review Flow" },
      { id: "hospital-bill-checklist", label: "Hospital Bill Review Checklist" },
      { id: "eob-bill-match", label: "EOB-to-Bill Match Checker" },
      { id: "financial-assistance-checklist", label: "Financial Assistance Checklist" },
      { id: "insurance", label: "Health Insurance Visit Cost Calculator" },
    ],
  },
  {
    label: "Healthcare worker money",
    items: [
      { id: "403b", label: "403(b) Paycheck Contribution Calculator" },
      { id: "overtime", label: "OBBB Overtime Deduction Estimator" },
    ],
  },
  {
    label: "Student loans",
    items: [
      { id: "student-loan-path", label: "Student Loan Path Finder" },
      { id: "private-loan-payoff", label: "Private Student Loan Payoff Calculator" },
      { id: "pslf-progress", label: "PSLF Progress Estimator" },
      { id: "loan", label: "Student Loan Payment Calculator" },
    ],
  },
  {
    label: "Patients and caregivers",
    items: [
      { id: "hospital-discharge-medicare-checklist", label: "Hospital Discharge Medicare Checklist Tool" },
      { id: "medicare", label: "Medicare Cost Exposure Tool" },
    ],
  },
  {
    label: "Everyday spending",
    items: [
      { id: "cafe", label: "Hospital Cafe Savings Rate Calculator" },
    ],
  },
];

const intentCards = [
  {
    eyebrow: "Medical bill",
    title: "I got a confusing bill, EOB, MSN, or collection notice",
    description: "Use the review flow to decide what to check, what to request, who to call, and whether to pause before paying.",
    href: "#medical-bill-review-flow",
    cta: "Review bill before paying",
  },
  {
    eyebrow: "Hospital discharge",
    title: "I need to know what to ask before discharge",
    description: "Use the guided checklist for rehab/SNF, home health, equipment, medication, denial, Medicaid, or bill questions.",
    href: "#hospital-discharge-medicare-checklist",
    cta: "Build discharge checklist",
  },
  {
    eyebrow: "Benefits choice",
    title: "I am choosing a health plan",
    description: "Compare total yearly cost, paycheck impact, HSA/FSA choices, and bad-year exposure.",
    href: "#open-enrollment",
    cta: "Compare plans",
  },
  {
    eyebrow: "Healthcare worker money",
    title: "I want paycheck and benefit clarity",
    description: "Use the 403(b), overtime, and benefits tools to turn confusing deductions into numbers.",
    href: "#403b",
    cta: "Start with 403(b)",
  },
  {
    eyebrow: "Student loans",
    title: "I need a loan path, not random advice",
    description: "Separate federal forgiveness options from private-loan payoff and refinance math.",
    href: "#student-loan-path",
    cta: "Find loan path",
  },
  {
    eyebrow: "Medicare",
    title: "I am helping a parent or caregiver",
    description: "Estimate premium, deductible, prescription, and coinsurance exposure before comparing plan choices.",
    href: "#medicare",
    cta: "Estimate Medicare costs",
  },
  {
    eyebrow: "Spending habits",
    title: "I want one small money leak to fix",
    description: "Use the cafe calculator to make shift spending visible without shame or moralizing.",
    href: "#cafe",
    cta: "Check cafe spend",
  },
];

const getCalculatorLabel = (id: string) => calculatorGroups.flatMap((group) => group.items).find((item) => item.id === id)?.label;

const jumpToCalculator = (id: string) => {
  if (!id) return;
  trackToolEvent("tool_jump_select", id, getCalculatorLabel(id));
  const element = document.getElementById(id);
  element?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", `#${id}`);
};

const SectionIntro = ({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) => (
  <div className="mb-6 max-w-3xl min-w-0">
    <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</div>
    <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h2>
    <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p>
  </div>
);

const ToolAnchor = ({ id, bestFirst = false, children }: { id: string; bestFirst?: boolean; children: ReactNode }) => (
  <div id={id} className="scroll-mt-28 min-w-0 space-y-3">
    {bestFirst && (
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-primary">
        <Sparkles className="h-3.5 w-3.5" /> Best first tool
      </div>
    )}
    {children}
  </div>
);

const Tools = () => {
  useSeo({
    title: "Calculators and Checklists",
    description: "Plain-English calculators and checklists for healthcare workers, patients, open enrollment, medical bills, Medicare, savings, workplace benefits, and student loans.",
    canonicalPath: "/tools",
  });

  return (
    <>
      <PageHero
        eyebrow="Tools"
        title="Start with the problem. Then run the numbers."
        description="Guided calculators and checklists for medical bills, benefits, Medicare, paychecks, student loans, and everyday spending decisions."
      />

      <section className="container min-w-0 pt-10 md:pt-12">
        <div className="rounded-[2rem] border border-border bg-card p-5 shadow-card md:p-7">
          <div className="mb-6 max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Start here</div>
            <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">What are you trying to figure out?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
              Pick the situation first. The calculator name matters less than the decision you are trying to make.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {intentCards.map((card) => (
              <a
                key={card.href}
                href={card.href}
                onClick={() => trackToolEvent("tool_intent_click", card.href.replace("#", ""), card.title)}
                className="group rounded-2xl border border-border bg-background/70 p-4 shadow-sm transition-smooth hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-card md:p-5"
              >
                <div className="text-[0.66rem] font-bold uppercase tracking-[0.16em] text-secondary">{card.eyebrow}</div>
                <h3 className="mt-2 font-display text-lg font-bold leading-tight text-foreground">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                  {card.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="container min-w-0 pt-8">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-card md:p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_360px] md:items-end">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Already know the tool?</div>
              <h2 className="mt-2 font-display text-2xl font-bold">Jump directly</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Use this when you already know which calculator or checklist you want.
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

      <section className="container min-w-0 py-12 md:py-16 space-y-16">
        <section className="space-y-6">
          <SectionIntro eyebrow="Open enrollment" title="Choose benefits by total cost, not just paycheck deduction" description="Use these tools before submitting health, tax account, disability, life, and supplemental benefit elections." />
          <div className="space-y-8">
            <ToolAnchor id="open-enrollment-checklist">
              <CalculatorCard icon={ClipboardCheck} eyebrow="Open enrollment" title="Open Enrollment Final Checklist" description="A printable final pass for health, tax account, disability, life, and supplemental benefit elections." relatedArticle={{ label: "Open Enrollment Guide", href: "/open-enrollment" }}>
                <OpenEnrollmentChecklistTool />
              </CalculatorCard>
            </ToolAnchor>
            <ToolAnchor id="open-enrollment" bestFirst>
              <CalculatorCard icon={Shield} eyebrow="Open enrollment" title="Open Enrollment True Cost Calculator" description="Compare two plans by annual premiums, expected out-of-pocket costs, employer HSA/HRA money, and bad-year exposure." relatedArticle={{ label: "Premium, Deductible, and Out-of-Pocket Max", href: "/articles/premium-deductible-out-of-pocket-open-enrollment" }}>
                <OpenEnrollmentTrueCostCalculator />
              </CalculatorCard>
            </ToolAnchor>
            <ToolAnchor id="out-of-pocket-max">
              <CalculatorCard icon={Shield} eyebrow="Benefits and insurance" title="Out-of-Pocket Max Estimator" description="Estimate how close covered in-network care could bring someone to the plan's yearly out-of-pocket maximum." relatedArticle={{ label: "Full Out-of-Pocket Max Calculator Page", href: "/tools/out-of-pocket-max-estimator" }}>
                <OutOfPocketMaxEstimator />
              </CalculatorCard>
            </ToolAnchor>
            <ToolAnchor id="paycheck-impact">
              <CalculatorCard icon={Receipt} eyebrow="Open enrollment" title="Open Enrollment Paycheck Impact Calculator" description="Estimate how benefit elections may change take-home pay after pre-tax savings and after-tax deductions." relatedArticle={{ label: "How Open Enrollment Changes Your Paycheck", href: "/articles/open-enrollment-paycheck-impact" }}>
                <OpenEnrollmentPaycheckImpactCalculator />
              </CalculatorCard>
            </ToolAnchor>
            <ToolAnchor id="supplemental-benefits">
              <CalculatorCard icon={Wallet} eyebrow="Open enrollment" title="Supplemental Benefits Decision Helper" description="Evaluate accident, critical illness, and hospital indemnity policies against annual premium, emergency fund, and likely payout." relatedArticle={{ label: "Accident, Critical Illness, and Hospital Indemnity", href: "/articles/accident-critical-illness-hospital-indemnity-open-enrollment" }}>
                <SupplementalBenefitsDecisionHelper />
              </CalculatorCard>
            </ToolAnchor>
            <ToolAnchor id="hsa-fsa">
              <CalculatorCard icon={PiggyBank} eyebrow="Open enrollment" title="HSA vs FSA Decision Helper" description="Compare tax savings, employer HSA money, HDHP premium savings, deductible risk, FSA forfeiture risk, and provider factors." relatedArticle={{ label: "HSA vs FSA Guide", href: "/articles/hsa-vs-fsa-healthcare-workers" }}>
                <HsaFsaDecisionHelper />
              </CalculatorCard>
            </ToolAnchor>
          </div>
        </section>

        <section className="space-y-6">
          <SectionIntro eyebrow="Hospital bills" title="Review the bill before money leaves the account" description="Start with the medical bill review flow, then match documents, check assistance, and organize questions for billing or insurance." />
          <div className="space-y-8">
            <ToolAnchor id="medical-bill-review-flow" bestFirst>
              <CalculatorCard icon={Receipt} eyebrow="Hospital bills" title="Medical Bill Review Flow" description="A guided workflow for provider bills, EOBs, Medicare Summary Notices, collection notices, affordability concerns, and pressure to pay." relatedArticle={{ label: "Medical Bill Review Toolkit", href: "/insurance/medical-bill-review-toolkit" }}>
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Use the dedicated tool page to decide what to check before paying, what document to request, what to ask billing, and when to check financial assistance.
                  </p>
                  <a
                    href="/tools/medical-bill-review-flow"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition-smooth hover:-translate-y-0.5 hover:shadow-card"
                  >
                    Open review flow <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </CalculatorCard>
            </ToolAnchor>
            <ToolAnchor id="hospital-bill-checklist">
              <CalculatorCard icon={ClipboardCheck} eyebrow="Hospital bills" title="Hospital Bill Review Checklist" description="A practical checklist for reviewing a large, confusing, or surprising healthcare balance." relatedArticle={{ label: "Financial Assistance Guide", href: "/articles/check-hospital-financial-assistance-before-paying" }}>
                <HospitalBillChecklistTool />
              </CalculatorCard>
            </ToolAnchor>
            <ToolAnchor id="eob-bill-match">
              <CalculatorCard icon={Receipt} eyebrow="Hospital bills" title="EOB-to-Bill Match Checker" description="Compare an insurer explanation with a provider bill and identify mismatches to ask about." relatedArticle={{ label: "How to Read an EOB", href: "/articles/how-to-read-an-eob" }}>
                <EobBillMatchChecker />
              </CalculatorCard>
            </ToolAnchor>
            <ToolAnchor id="financial-assistance-checklist">
              <CalculatorCard icon={Shield} eyebrow="Hospital bills" title="Financial Assistance Checklist" description="A document checklist for hospital financial assistance and charity care applications." relatedArticle={{ label: "Financial Assistance Guide", href: "/articles/check-hospital-financial-assistance-before-paying" }}>
                <FinancialAssistanceChecklist />
              </CalculatorCard>
            </ToolAnchor>
            <ToolAnchor id="insurance">
              <CalculatorCard icon={Shield} eyebrow="For everyone" title="Health Insurance Visit Cost Calculator" description="Estimate yearly out-of-pocket cost across premium, deductible, copays, coinsurance, visits, and remaining out-of-pocket max room." relatedArticle={{ label: "Plain-English Healthcare Finance Glossary", href: "/articles/plain-english-glossary" }}>
                <HealthInsuranceVisitCostCalculator />
              </CalculatorCard>
            </ToolAnchor>
          </div>
        </section>

        <section className="space-y-6">
          <SectionIntro eyebrow="Healthcare worker money" title="Make paycheck and benefit choices easier to see" description="Use these when work benefits, overtime, and retirement deductions feel abstract." />
          <div className="space-y-8">
            <ToolAnchor id="403b" bestFirst>
              <CalculatorCard icon={Wallet} eyebrow="For healthcare workers" title="403(b) Paycheck Contribution Calculator" description="See per-paycheck contributions, annual contribution, and a rough employer match estimate." relatedArticle={{ label: "How to Pick Retirement Investments at Work", href: "/articles/how-to-pick-retirement-investments-at-work" }}>
                <Calc403b />
              </CalculatorCard>
            </ToolAnchor>
            <ToolAnchor id="overtime">
              <CalculatorCard icon={Receipt} eyebrow="For healthcare workers" title="OBBB Overtime Deduction Estimator" description="Estimate the qualifying half-time overtime premium, deduction cap, and rough federal income-tax savings." relatedArticle={{ label: "OBBB Overtime Tax Deduction Explained", href: "/articles/obbb-overtime-tax-deduction-healthcare-workers" }}>
                <CalcOvertimeDeduction />
              </CalculatorCard>
            </ToolAnchor>
          </div>
        </section>

        <section className="space-y-6">
          <SectionIntro eyebrow="Student loans" title="Separate federal forgiveness paths from private payoff math" description="Start with loan type, then choose the right calculator instead of mixing incompatible strategies." />
          <div className="space-y-8">
            <ToolAnchor id="student-loan-path" bestFirst>
              <CalculatorCard icon={GraduationCap} eyebrow="Student loans" title="Student Loan Path Finder" description="Separate federal forgiveness paths from private-loan payoff decisions before choosing a strategy." relatedArticle={{ label: "Full Student Loans Section", href: "/student-loans" }}>
                <StudentLoanPathFinder />
              </CalculatorCard>
            </ToolAnchor>
            <ToolAnchor id="private-loan-payoff">
              <CalculatorCard icon={CreditCard} eyebrow="Private loans" title="Private Student Loan Payoff Calculator" description="Compare minimum payments, extra payments, lump sums, and a possible refinance APR." relatedArticle={{ label: "Full Student Loans Section", href: "/student-loans" }}>
                <PrivateLoanPayoffCalculator />
              </CalculatorCard>
            </ToolAnchor>
            <ToolAnchor id="pslf-progress">
              <CalculatorCard icon={Landmark} eyebrow="Federal loans" title="PSLF Progress Estimator" description="Estimate payments remaining to 120 and see what must be verified before relying on forgiveness." relatedArticle={{ label: "Full Student Loans Section", href: "/student-loans" }}>
                <PSLFProgressEstimator />
              </CalculatorCard>
            </ToolAnchor>
            <ToolAnchor id="loan">
              <CalculatorCard icon={CreditCard} eyebrow="For everyone" title="Student Loan Payment Calculator" description="Estimate monthly payment, total paid, and interest over time." relatedArticle={{ label: "Full Student Loans Section", href: "/student-loans" }}>
                <CalcLoanPayment />
              </CalculatorCard>
            </ToolAnchor>
          </div>
        </section>

        <section className="space-y-6">
          <SectionIntro eyebrow="Medicare & caregiver planning" title="Estimate exposure before comparing plan marketing" description="Use this as a rough planning snapshot, then verify plan details with official sources and plan documents." />
          <div className="space-y-8">
            <ToolAnchor id="hospital-discharge-medicare-checklist" bestFirst>
              <CalculatorCard icon={ClipboardCheck} eyebrow="Patients and caregivers" title="Hospital Discharge Medicare Checklist Tool" description="Build a focused checklist for discharge, rehab/SNF, home health, equipment, medication, Medicare Advantage authorization, Medicaid, long-term care, or medical bill questions." relatedArticle={{ label: "Hospital Discharge & Medicare Guide", href: "/guides/hospital-discharge-medicare" }}>
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Use the dedicated tool page to answer a few questions and generate a copy-friendly or print-friendly call checklist.
                  </p>
                  <a
                    href="/tools/hospital-discharge-medicare-checklist"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition-smooth hover:-translate-y-0.5 hover:shadow-card"
                  >
                    Open checklist tool <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </CalculatorCard>
            </ToolAnchor>
            <ToolAnchor id="medicare">
              <CalculatorCard icon={HeartPulse} eyebrow="For patients & caregivers" title="Medicare Cost Exposure Tool" description="Rough estimate for premiums, deductibles, prescriptions, and coinsurance over a year." relatedArticle={{ label: "Medicare Options Explained", href: "/articles/medicare-options-explained" }}>
                <CalcMedicare />
              </CalculatorCard>
            </ToolAnchor>
          </div>
        </section>

        <section className="space-y-6">
          <SectionIntro eyebrow="Everyday spending" title="Find one small leak without shame" description="Small recurring spending is not a moral failure. The point is to see it clearly and redirect only what you actually want to redirect." />
          <ToolAnchor id="cafe" bestFirst>
            <CalculatorCard icon={Coffee} eyebrow="Spending, no shame" title="Hospital Cafe Savings Rate Calculator" description="See what daily cafe spend adds up to over a year — and what redirecting some of it could grow into." relatedArticle={{ label: "Your Hospital Cafe Habit Might Be Quietly Eating Your Savings Rate", href: "/articles/hospital-cafe-habit" }}>
              <CalcCafe />
            </CalculatorCard>
          </ToolAnchor>
        </section>
      </section>

      <section className="container min-w-0 pb-16">
        <NewsletterSignup
          source="tools"
          title="Want the Healthcare Worker Money Map in your inbox?"
          description="Get the checklist and a short weekly email on paychecks, benefits, insurance, debt, and investing decisions healthcare workers actually face."
        />
      </section>
    </>
  );
};

export default Tools;
