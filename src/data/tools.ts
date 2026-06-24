export type ToolCategory =
  | "Open enrollment"
  | "Hospital bills"
  | "Healthcare worker money"
  | "Patients, caregivers, and loans";

export type ToolComponentKey =
  | "openEnrollmentChecklist"
  | "hospitalBillReview"
  | "eobBillMatch"
  | "financialAssistanceChecklist"
  | "calc403b"
  | "overtimeDeduction"
  | "insuranceVisitCost"
  | "openEnrollmentTrueCost"
  | "openEnrollmentPaycheckImpact"
  | "supplementalBenefits"
  | "hsaVsFsa"
  | "medicareCostExposure"
  | "hospitalCafeSavings"
  | "studentLoanPayment";

export type ToolIconName =
  | "clipboard"
  | "receipt"
  | "shield"
  | "wallet"
  | "heart"
  | "coffee"
  | "creditCard"
  | "piggyBank";

export interface ToolDefinition {
  slug: string;
  legacyAnchorId: string;
  legacyAnchorAliases?: string[];
  title: string;
  shortTitle: string;
  category: ToolCategory;
  audience: string;
  description: string;
  plainEnglishUseCase: string;
  estimatedUseTime: string;
  featured?: boolean;
  priority: number;
  relatedArticle?: { label: string; href: string };
  componentKey: ToolComponentKey;
  icon: ToolIconName;
  disclaimerNote?: string;
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  "Open enrollment",
  "Hospital bills",
  "Healthcare worker money",
  "Patients, caregivers, and loans",
];

export const TOOLS: ToolDefinition[] = [
  {
    slug: "open-enrollment-checklist",
    legacyAnchorId: "open-enrollment-checklist",
    title: "Open Enrollment Final Checklist",
    shortTitle: "Final checklist",
    category: "Open enrollment",
    audience: "Workers choosing benefits for the next plan year",
    description: "A final review before health, tax account, disability, life, and supplemental benefit elections are submitted.",
    plainEnglishUseCase: "Use this when you are about to submit open enrollment and want one last miss-nothing pass.",
    estimatedUseTime: "8-12 min",
    featured: true,
    priority: 10,
    relatedArticle: { label: "Open Enrollment Guide", href: "/open-enrollment" },
    componentKey: "openEnrollmentChecklist",
    icon: "clipboard",
  },
  {
    slug: "hospital-bill-review",
    legacyAnchorId: "hospital-bill-checklist",
    legacyAnchorAliases: ["hospital-bill-review", "hospital-bill"],
    title: "Hospital Bill Review Checklist",
    shortTitle: "Bill review",
    category: "Hospital bills",
    audience: "Patients and caregivers reviewing a large or confusing bill",
    description: "A practical checklist for reviewing a large, confusing, or surprising healthcare balance.",
    plainEnglishUseCase: "Use this before paying a bill that feels too large, unclear, or mismatched with insurance.",
    estimatedUseTime: "7-10 min",
    featured: true,
    priority: 20,
    relatedArticle: { label: "Financial Assistance Guide", href: "/articles/check-hospital-financial-assistance-before-paying" },
    componentKey: "hospitalBillReview",
    icon: "clipboard",
  },
  {
    slug: "eob-bill-match",
    legacyAnchorId: "eob-bill-match",
    title: "EOB-to-Bill Match Checker",
    shortTitle: "EOB match",
    category: "Hospital bills",
    audience: "Patients comparing an insurer EOB with a provider bill",
    description: "Compare an insurer explanation with a provider bill and identify mismatches to ask about.",
    plainEnglishUseCase: "Use this when the provider bill does not seem to match the explanation from insurance.",
    estimatedUseTime: "6-9 min",
    priority: 30,
    relatedArticle: { label: "How to Read an EOB", href: "/articles/how-to-read-an-eob" },
    componentKey: "eobBillMatch",
    icon: "receipt",
  },
  {
    slug: "financial-assistance-checklist",
    legacyAnchorId: "financial-assistance-checklist",
    title: "Financial Assistance Checklist",
    shortTitle: "Assistance checklist",
    category: "Hospital bills",
    audience: "Households checking charity care or financial assistance",
    description: "A document checklist for hospital financial assistance and charity care applications.",
    plainEnglishUseCase: "Use this before paying a large hospital balance in full.",
    estimatedUseTime: "5-8 min",
    priority: 40,
    relatedArticle: { label: "Financial Assistance Guide", href: "/articles/check-hospital-financial-assistance-before-paying" },
    componentKey: "financialAssistanceChecklist",
    icon: "shield",
  },
  {
    slug: "403b-contribution",
    legacyAnchorId: "403b",
    title: "403(b) Paycheck Contribution Calculator",
    shortTitle: "403(b)",
    category: "Healthcare worker money",
    audience: "Healthcare workers with a workplace retirement plan",
    description: "See per-paycheck contributions, annual contribution, and a rough employer match estimate.",
    plainEnglishUseCase: "Use this to translate a retirement percentage into paycheck and annual dollars.",
    estimatedUseTime: "4-6 min",
    featured: true,
    priority: 50,
    relatedArticle: { label: "How to Pick Retirement Investments at Work", href: "/articles/how-to-pick-retirement-investments-at-work" },
    componentKey: "calc403b",
    icon: "wallet",
    disclaimerNote: "This is an educational retirement contribution estimate, not tax or investment advice.",
  },
  {
    slug: "overtime-deduction",
    legacyAnchorId: "overtime",
    legacyAnchorAliases: ["overtime-deduction"],
    title: "OBBB Overtime Deduction Estimator",
    shortTitle: "Overtime deduction",
    category: "Healthcare worker money",
    audience: "Workers estimating potential overtime deduction exposure",
    description: "Estimate the qualifying half-time overtime premium, deduction cap, and rough federal income-tax savings.",
    plainEnglishUseCase: "Use this to understand the overtime premium number before treating it as a tax answer.",
    estimatedUseTime: "5-7 min",
    priority: 60,
    relatedArticle: { label: "OBBB Overtime Tax Deduction Explained", href: "/articles/obbb-overtime-tax-deduction-healthcare-workers" },
    componentKey: "overtimeDeduction",
    icon: "receipt",
    disclaimerNote: "Tax rules can change and personal eligibility varies. Verify with IRS guidance or a qualified tax professional.",
  },
  {
    slug: "insurance-visit-cost",
    legacyAnchorId: "insurance",
    title: "Health Insurance Visit Cost Calculator",
    shortTitle: "Visit cost",
    category: "Hospital bills",
    audience: "Patients estimating in-network care costs",
    description: "Estimate yearly out-of-pocket cost across premium, deductible, copays, coinsurance, and visits.",
    plainEnglishUseCase: "Use this to compare what care may cost after premiums and point-of-care charges.",
    estimatedUseTime: "5-8 min",
    featured: true,
    priority: 70,
    relatedArticle: { label: "Plain-English Healthcare Finance Glossary", href: "/articles/plain-english-glossary" },
    componentKey: "insuranceVisitCost",
    icon: "shield",
  },
  {
    slug: "open-enrollment-true-cost",
    legacyAnchorId: "open-enrollment",
    title: "Open Enrollment True Cost Calculator",
    shortTitle: "True cost",
    category: "Open enrollment",
    audience: "Workers comparing health plan options",
    description: "Compare two plans by annual premiums, expected care costs, employer HSA/HRA money, and bad-year exposure.",
    plainEnglishUseCase: "Use this when one plan has a lower premium but another may lower your worst-case risk.",
    estimatedUseTime: "7-10 min",
    featured: true,
    priority: 80,
    relatedArticle: { label: "Premium, Deductible, and Out-of-Pocket Max", href: "/articles/premium-deductible-out-of-pocket-open-enrollment" },
    componentKey: "openEnrollmentTrueCost",
    icon: "shield",
  },
  {
    slug: "open-enrollment-paycheck-impact",
    legacyAnchorId: "paycheck-impact",
    title: "Open Enrollment Paycheck Impact Calculator",
    shortTitle: "Paycheck impact",
    category: "Open enrollment",
    audience: "Workers checking benefit elections against take-home pay",
    description: "Estimate how benefit elections may change take-home pay after pre-tax savings and after-tax deductions.",
    plainEnglishUseCase: "Use this before submitting benefits so the next paycheck is not a surprise.",
    estimatedUseTime: "5-7 min",
    priority: 90,
    relatedArticle: { label: "How Open Enrollment Changes Your Paycheck", href: "/articles/open-enrollment-paycheck-impact" },
    componentKey: "openEnrollmentPaycheckImpact",
    icon: "receipt",
  },
  {
    slug: "supplemental-benefits",
    legacyAnchorId: "supplemental-benefits",
    title: "Supplemental Benefits Decision Helper",
    shortTitle: "Supplemental benefits",
    category: "Open enrollment",
    audience: "Workers evaluating accident, critical illness, or hospital indemnity plans",
    description: "Evaluate supplemental policies against annual premium, emergency fund, and likely payout.",
    plainEnglishUseCase: "Use this to separate useful gap protection from optional peace-of-mind coverage.",
    estimatedUseTime: "6-8 min",
    priority: 100,
    relatedArticle: { label: "Accident, Critical Illness, and Hospital Indemnity", href: "/articles/accident-critical-illness-hospital-indemnity-open-enrollment" },
    componentKey: "supplementalBenefits",
    icon: "wallet",
  },
  {
    slug: "hsa-vs-fsa",
    legacyAnchorId: "hsa-fsa",
    legacyAnchorAliases: ["hsa-vs-fsa"],
    title: "HSA vs FSA Decision Helper",
    shortTitle: "HSA vs FSA",
    category: "Open enrollment",
    audience: "Workers choosing tax-advantaged healthcare accounts",
    description: "Compare tax savings, employer HSA money, premium savings, deductible risk, FSA forfeiture risk, and provider factors.",
    plainEnglishUseCase: "Use this when an HSA looks attractive but a higher deductible or FSA rules change the risk.",
    estimatedUseTime: "7-10 min",
    priority: 110,
    relatedArticle: { label: "HSA vs FSA Guide", href: "/articles/hsa-vs-fsa-healthcare-workers" },
    componentKey: "hsaVsFsa",
    icon: "piggyBank",
  },
  {
    slug: "medicare-cost-exposure",
    legacyAnchorId: "medicare",
    title: "Medicare Cost Exposure Tool",
    shortTitle: "Medicare costs",
    category: "Patients, caregivers, and loans",
    audience: "Patients and caregivers estimating annual Medicare costs",
    description: "Rough estimate for premiums, deductibles, prescriptions, and coinsurance over a year.",
    plainEnglishUseCase: "Use this to build a first-pass annual Medicare cost range for household planning.",
    estimatedUseTime: "5-7 min",
    featured: true,
    priority: 120,
    relatedArticle: { label: "Medicare Options Explained", href: "/articles/medicare-options-explained" },
    componentKey: "medicareCostExposure",
    icon: "heart",
  },
  {
    slug: "hospital-cafe-savings",
    legacyAnchorId: "cafe",
    title: "Hospital Cafe Savings Rate Calculator",
    shortTitle: "Cafe savings",
    category: "Healthcare worker money",
    audience: "Healthcare workers tracking shift spending without shame",
    description: "See what daily cafe spend adds up to over a year and what redirecting some of it could grow into.",
    plainEnglishUseCase: "Use this to put workday food and coffee spending into monthly and yearly context.",
    estimatedUseTime: "4-6 min",
    priority: 130,
    relatedArticle: { label: "Your Hospital Cafe Habit Might Be Quietly Eating Your Savings Rate", href: "/articles/hospital-cafe-habit" },
    componentKey: "hospitalCafeSavings",
    icon: "coffee",
  },
  {
    slug: "student-loan-payment",
    legacyAnchorId: "loan",
    title: "Student Loan Payment Calculator",
    shortTitle: "Student loan",
    category: "Patients, caregivers, and loans",
    audience: "Borrowers estimating a fixed-rate loan payment",
    description: "Estimate monthly payment, total paid, and interest over time.",
    plainEnglishUseCase: "Use this to sanity-check a fixed-rate loan payment before comparing repayment options.",
    estimatedUseTime: "3-5 min",
    priority: 140,
    componentKey: "studentLoanPayment",
    icon: "creditCard",
  },
];

export const getToolBySlug = (slug: string | undefined) =>
  TOOLS.find((tool) => tool.slug === slug);

export const getToolByLegacyAnchor = (anchor: string) =>
  TOOLS.find((tool) => tool.legacyAnchorId === anchor || tool.legacyAnchorAliases?.includes(anchor));

export const getRelatedTools = (tool: ToolDefinition, limit = 3) =>
  TOOLS.filter((candidate) => candidate.slug !== tool.slug && candidate.category === tool.category)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, limit);
