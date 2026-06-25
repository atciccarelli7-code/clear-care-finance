import { useEffect } from "react";
import { Link } from "react-router-dom";
import { track } from "@vercel/analytics";
import { Wallet, Shield, HeartPulse, Coffee, CreditCard, Receipt, PiggyBank, ClipboardCheck } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CalculatorCard } from "@/components/shared/CalculatorCard";
import { Calc403b, CalcInsurance, CalcMedicare, CalcCafe } from "@/components/calculators/Calculators";
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
import { absoluteUrl, SITE_NAME, SITE_URL, useJsonLd, useSeo } from "@/lib/seo";

const calculatorGroups = [
  {
    label: "Open enrollment",
    items: [
      { id: "open-enrollment-checklist", label: "Open Enrollment Final Checklist" },
      { id: "open-enrollment", label: "Open Enrollment True Cost Calculator" },
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

const calculatorItems = calculatorGroups.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.label })),
);

const calculatorById = new Map(calculatorItems.map((item) => [item.id, item]));

const guideLinks = [
  { label: "Open enrollment guide", href: "/open-enrollment" },
  { label: "Healthcare glossary", href: "/glossary" },
  { label: "Sources and methods", href: "/methodology" },
  { label: "All healthcare finance articles", href: "/articles" },
];

const calculatorFaqs = [
  {
    question: "Are these calculators financial, tax, medical, or insurance advice?",
    answer:
      "No. They are educational estimates that help you ask better questions before checking plan documents, benefit portals, bills, insurer notices, tax guidance, or a qualified professional.",
  },
  {
    question: "Do the calculators store my personal information?",
    answer:
      "No. The calculators run in the browser and are designed for examples or estimates, not for collecting private medical, financial, employment, or account information.",
  },
  {
    question: "Why do some calculators ask for rough numbers?",
    answer:
      "Healthcare and workplace benefits vary by plan, employer, location, and year. Editable assumptions let you model your own paperwork instead of relying on a generic example.",
  },
  {
    question: "Where should I go after running a calculator?",
    answer:
      "Use the related article beside each tool, the glossary, and the sources page to understand the terms, then verify important decisions with official documents or the organization that issued them.",
  },
];

const trackCalculatorEvent = (action: "jump" | "deep_link", id: string) => {
  const calculator = calculatorById.get(id);
  if (!calculator) return;

  try {
    track("calculator_navigation", {
      action,
      calculator_group: calculator.group,
      calculator_id: id,
      calculator_name: calculator.label,
    });
  } catch {
    // Analytics should never block calculator navigation.
  }
};

const jumpToCalculator = (id: string) => {
  if (!id) return;
  const element = document.getElementById(id);
  if (!element) return;

  element.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", `#${id}`);
  trackCalculatorEvent("jump", id);
};

const Tools = () => {
  useSeo({
    title: "Healthcare Finance Calculators and Checklists",
    description: "Plain-English healthcare finance calculators and checklists for open enrollment, medical bills, Medicare, workplace benefits, savings, overtime, and student loans.",
    canonicalPath: "/tools",
  });

  useJsonLd("tools-page", [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Healthcare Finance Calculators and Checklists",
      url: absoluteUrl("/tools"),
      description:
        "Plain-English calculators and checklists for healthcare workers, patients, caregivers, open enrollment, Medicare, medical bills, and workplace benefits.",
      isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
      },
      mainEntity: {
        "@type": "ItemList",
        name: "Community Acquired Finance calculator library",
        itemListElement: calculatorItems.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.label,
          url: `${absoluteUrl("/tools")}#${item.id}`,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: calculatorFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ]);

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (id) trackCalculatorEvent("deep_link", id);
  }, []);

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
                aria-describedby="calculator-jump-help"
                onChange={(event) => jumpToCalculator(event.target.value)}
              >
                <option value="" disabled>Choose a calculator...</option>
                {calculatorGroups.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.items.map((item) => (
                      <option key={item.id} value={item.id}>{item.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
          </div>
          <div id="calculator-jump-help" className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Need context first?</span>
            {guideLinks.map((link) => (
              <Link key={link.href} to={link.href} className="font-semibold text-primary underline-offset-4 hover:underline">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
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
          <CalculatorCard icon={Shield} eyebrow="For everyone" title="Health Insurance Visit Cost Calculator" description="Estimate yearly out-of-pocket cost across premium, deductible, copays, coinsurance, and visits." relatedArticle={{ label: "Plain-English Healthcare Finance Glossary", href: "/articles/plain-english-glossary" }}>
            <CalcInsurance />
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

      <section className="container min-w-0 pb-16 md:pb-20">
        <SectionHeading
          eyebrow="Calculator FAQ"
          title="Use the numbers as a starting point"
          description="Each tool is intentionally simple, transparent, and tied back to source-backed guides instead of pretending to know every plan rule or household detail."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {calculatorFaqs.map((faq) => (
            <div key={faq.question} className="rounded-2xl border border-border bg-card p-5 shadow-card md:p-6">
              <h2 className="font-display text-lg font-bold text-foreground">{faq.question}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Tools;
