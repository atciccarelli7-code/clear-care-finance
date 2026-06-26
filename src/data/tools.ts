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
  | "backupCareCost"
  | "healthcareDiscountValue"
  | "postShiftRecoveryBudget"
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
  assumptionNotes?: string[];
  sourceNotes?: string[];
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  "Open enrollment",
  "Hospital bills",
  "Healthcare worker money",
  "Patients, caregivers, and loans",
];

export interface ToolGuidance {
  assumptionNotes: string[];
  sourceNotes: string[];
}

export const TOOL_CATEGORY_GUIDANCE: Record<ToolCategory, ToolGuidance> = {
  "Open enrollment": {
    assumptionNotes: [
      "Use per-paycheck premiums and annual limits from the same plan year.",
      "Enter in-network amounts unless you are deliberately comparing out-of-network risk.",
    ],
    sourceNotes: [
      "Employer enrollment portal",
      "Plan Summary of Benefits and Coverage",
      "Plan Evidence of Coverage or benefit booklet",
    ],
  },
  "Hospital bills": {
    assumptionNotes: [
      "Match bills to the same patient, date of service, provider, and claim whenever possible.",
      "Treat checklist results as a call-prep aid, not a final billing decision.",
    ],
    sourceNotes: [
      "Insurer explanation of benefits",
      "Provider itemized bill",
      "Hospital financial assistance or charity care policy",
    ],
  },
  "Healthcare worker money": {
    assumptionNotes: [
      "Use gross pay, consistent pay periods, and the same year for all paycheck inputs.",
      "Investment growth examples are illustrations, not guaranteed returns.",
    ],
    sourceNotes: [
      "Employer payroll and benefits documents",
      "Retirement plan summary or match formula",
      "Current IRS guidance when tax treatment matters",
    ],
  },
  "Patients, caregivers, and loans": {
    assumptionNotes: [
      "Use current premium, prescription, visit, or loan statements when available.",
      "Actual costs can change with plan design, provider network, repayment program, and timing.",
    ],
    sourceNotes: [
      "Medicare.gov or plan documents",
      "Insurer or provider cost estimates",
      "Loan servicer disclosures for repayment terms",
    ],
  },
};

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
    sourceNotes: ["Save the confirmation page after submitting elections and compare it with the first paycheck after changes start."],
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
    sourceNotes: ["If a balance is large or surprising, ask for an itemized bill and wait for insurance processing when possible."],
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
    sourceNotes: ["Use the insurer-listed patient responsibility as the main comparison point when reviewing a provider bill."],
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
    sourceNotes: ["Nonprofit hospitals generally must maintain a written financial assistance policy, but eligibility and process vary by hospital."],
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
    assumptionNotes: ["Employer matches can be per-pay-period, annual, discretionary, or vesting-based; enter the formula your plan actually uses."],
    sourceNotes: ["Check your plan summary for match limits, vesting, Roth availability, and annual contribution limits."],
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
    assumptionNotes: ["The estimate focuses on the half-time FLSA overtime premium, not the full overtime paycheck."],
    sourceNotes: ["Confirm current IRS rules, filing-status limits, MAGI phaseout rules, and employer wage reporting before filing."],
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
    assumptionNotes: ["The estimate assumes in-network care and does not model denied claims, prior authorization, balance billing, or noncovered services."],
    sourceNotes: ["Use the plan Summary of Benefits and Coverage plus insurer or provider cost estimates for allowed amounts."],
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
    assumptionNotes: ["Expected-year cost and worst-case exposure answer different questions; a lower expected cost can still mean more risk."],
    sourceNotes: ["Compare premiums, deductible, out-of-pocket maximum, employer HSA/HRA money, and covered services from the same plan year."],
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
    assumptionNotes: ["Pre-tax elections reduce taxable pay; after-tax benefits usually reduce take-home pay dollar for dollar."],
    sourceNotes: ["Verify deduction timing with payroll because some benefits are taken weekly, biweekly, semi-monthly, or only for certain checks."],
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
    assumptionNotes: ["A policy can be emotionally useful even when the expected payout math is not a clear financial win."],
    sourceNotes: ["Read the certificate of coverage for exclusions, waiting periods, benefit triggers, and documentation requirements."],
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
    assumptionNotes: ["HSA eligibility depends on having qualifying HDHP coverage and no disqualifying coverage."],
    sourceNotes: ["Check IRS HSA/FSA rules, employer plan documents, and any FSA carryover or grace-period policy."],
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
    assumptionNotes: ["This is a first-pass annual cost range; it does not model every Part C, Part D, Medigap, hospital, dental, vision, or long-term care cost."],
    sourceNotes: ["Use Medicare.gov, the plan Evidence of Coverage, drug formulary, and provider network information for current figures."],
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
    assumptionNotes: ["The investing example assumes steady monthly savings and a constant annual return, which real markets do not provide."],
    sourceNotes: ["Use your own shift pattern, receipts, and budget priorities; this tool is for awareness, not guilt."],
  },
  {
    slug: "backup-care-cost-planner",
    legacyAnchorId: "backup-care",
    legacyAnchorAliases: ["backup-care-cost"],
    title: "Backup Care Cost Planner",
    shortTitle: "Backup care",
    category: "Healthcare worker money",
    audience: "Healthcare workers planning for late shifts, call, overtime, pets, child care, or household coverage",
    description: "Estimate expected backup-care events, monthly cushion needs, emergency-rate exposure, and pickup-shift value after hidden care costs.",
    plainEnglishUseCase: "Use this before a schedule change or overtime offer so backup care is part of the math.",
    estimatedUseTime: "5-7 min",
    priority: 135,
    relatedArticle: { label: "Backup Care Plans for Busy Healthcare Workers", href: "/articles/backup-care-plans-for-busy-healthcare-workers" },
    componentKey: "backupCareCost",
    icon: "heart",
    assumptionNotes: ["Backup-care costs are household planning inputs, not fixed recommendations; use local rates and your real shift pattern."],
    sourceNotes: ["Use daycare policies, sitter or pet-care rates, transportation costs, payroll estimates, and your own schedule history."],
  },
  {
    slug: "healthcare-worker-discount-value",
    legacyAnchorId: "healthcare-discount-value",
    legacyAnchorAliases: ["discount-value", "healthcare-worker-discounts"],
    title: "Healthcare Worker Discount Value Checker",
    shortTitle: "Discount value",
    category: "Healthcare worker money",
    audience: "Healthcare workers checking whether a discount is actually worth the price, fees, and friction",
    description: "Compare a healthcare-worker discount against fees, verification time, planned budget, and the best non-discount alternative.",
    plainEnglishUseCase: "Use this before letting a discount turn into a new purchase.",
    estimatedUseTime: "4-6 min",
    priority: 136,
    relatedArticle: { label: "Healthcare Worker Discounts and Perks Directory", href: "/articles/healthcare-worker-discounts" },
    componentKey: "healthcareDiscountValue",
    icon: "wallet",
    assumptionNotes: ["A discount is only useful if the final price, fees, time, and purchase timing still fit the plan."],
    sourceNotes: ["Compare the verified checkout price, shipping, subscription terms, expiration rules, and a normal sale or competitor price."],
  },
  {
    slug: "post-shift-recovery-budget",
    legacyAnchorId: "post-shift-recovery",
    legacyAnchorAliases: ["recovery-budget", "burnout-spending"],
    title: "Post-Shift Recovery Budget Calculator",
    shortTitle: "Recovery budget",
    category: "Healthcare worker money",
    audience: "Healthcare workers replacing tired impulse spending with a planned recovery default",
    description: "Estimate the monthly and yearly cash difference between unplanned post-shift spending and a kinder planned recovery routine.",
    plainEnglishUseCase: "Use this to design a realistic default for hard shifts without turning recovery into shame math.",
    estimatedUseTime: "4-6 min",
    priority: 137,
    relatedArticle: { label: "Burnout, Overspending, and Overeating After Hard Shifts", href: "/articles/burnout-overspending-overeating" },
    componentKey: "postShiftRecoveryBudget",
    icon: "coffee",
    assumptionNotes: ["The planned default should still support recovery; this tool compares patterns, not personal discipline."],
    sourceNotes: ["Use recent bank transactions, shift counts, grocery costs, takeout costs, and realistic recovery needs."],
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
    assumptionNotes: ["The payment estimate assumes a fixed interest rate, fixed term, and level monthly payments."],
    sourceNotes: ["Use your promissory note, loan servicer disclosure, or official repayment estimator for final repayment decisions."],
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
