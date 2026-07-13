export type ToolCategory =
  | "Workplace benefits"
  | "Open enrollment"
  | "Medical bills"
  | "Student loans"
  | "Medicare & caregiving"
  | "Everyday money";

export type ToolAudience = "Healthcare workers" | "Patients & caregivers" | "Everyone";

export type ToolIconKey =
  | "calculator"
  | "clipboard"
  | "coffee"
  | "compass"
  | "graduation"
  | "heart"
  | "landmark"
  | "piggyBank"
  | "receipt"
  | "shield"
  | "wallet";

export type ToolComponentKey =
  | "openEnrollmentChecklist"
  | "paycheckImpact"
  | "supplementalBenefits"
  | "hsaFsa"
  | "hospitalBillChecklist"
  | "financialAssistanceChecklist"
  | "insuranceVisitCost"
  | "overtimeDeduction"
  | "studentLoanPath"
  | "privateLoanPayoff"
  | "pslfProgress"
  | "loanPayment"
  | "medicareCost"
  | "cafeSavings";

export type ToolDefinition = {
  slug: string;
  legacyAnchorId?: string;
  title: string;
  shortTitle: string;
  category: ToolCategory;
  audience: ToolAudience;
  description: string;
  estimatedUseTime: string;
  icon: ToolIconKey;
  featured?: boolean;
  href?: string;
  componentKey?: ToolComponentKey;
  relatedArticle?: { label: string; href: string };
};

export const TOOL_CATEGORIES: Array<"All tools" | ToolCategory> = [
  "All tools",
  "Workplace benefits",
  "Open enrollment",
  "Medical bills",
  "Student loans",
  "Medicare & caregiving",
  "Everyday money",
];

export const tools: ToolDefinition[] = [
  {
    slug: "benefits-change-detector",
    title: "Benefits Change Detector",
    shortTitle: "Benefits Change Detector",
    category: "Open enrollment",
    audience: "Everyone",
    description: "Identify year-over-year workplace benefit changes, prioritize what to verify, and create a private Benefits Change Receipt.",
    estimatedUseTime: "6–10 min",
    icon: "receipt",
    featured: true,
    href: "/tools/benefits-change-detector",
    relatedArticle: { label: "What benefit changes should I compare?", href: "/articles/what-employer-benefit-changes-should-i-compare" },
  },
  {
    slug: "benefits-command-center",
    title: "Benefits Command Center",
    shortTitle: "Benefits Command Center",
    category: "Workplace benefits",
    audience: "Healthcare workers",
    description: "Build, compare, and save up to three workplace-benefits packages in a private browser-local workspace.",
    estimatedUseTime: "10–15 min",
    icon: "wallet",
    featured: true,
    href: "/tools/benefits-command-center",
  },
  {
    slug: "healthcare-worker-benefits-blueprint",
    legacyAnchorId: "healthcare-worker-benefits-blueprint",
    title: "Healthcare Worker Benefits Blueprint",
    shortTitle: "Benefits Blueprint",
    category: "Workplace benefits",
    audience: "Healthcare workers",
    description: "Answer goal-first questions before opening the HR portal and leave with plan-comparison priorities.",
    estimatedUseTime: "5–8 min",
    icon: "compass",
    featured: true,
    href: "/tools/healthcare-worker-benefits-blueprint",
    relatedArticle: { label: "Open Enrollment Guide", href: "/open-enrollment" },
  },
  {
    slug: "employer-benefits-action-plan",
    title: "Employer Benefits Action Plan",
    shortTitle: "Benefits Action Plan",
    category: "Workplace benefits",
    audience: "Healthcare workers",
    description: "Turn actual pay, match, health-plan, and HSA numbers into a prioritized verification plan.",
    estimatedUseTime: "8–12 min",
    icon: "clipboard",
    featured: true,
    href: "/tools/employer-benefits-action-plan",
  },
  {
    slug: "healthcare-worker-total-compensation-comparison",
    title: "Healthcare Worker Total Compensation Comparison",
    shortTitle: "Total Compensation Comparison",
    category: "Workplace benefits",
    audience: "Healthcare workers",
    description: "Compare salary, differentials, retirement match, insurance, time off, and hidden benefits across offers.",
    estimatedUseTime: "8–12 min",
    icon: "wallet",
    href: "/tools/healthcare-worker-total-compensation-comparison",
  },
  {
    slug: "403b-paycheck-calculator",
    legacyAnchorId: "403b",
    title: "403(b) Paycheck Contribution Calculator",
    shortTitle: "403(b) Paycheck Calculator",
    category: "Workplace benefits",
    audience: "Healthcare workers",
    description: "Estimate per-paycheck contributions, annual savings, and a rough employer-match amount.",
    estimatedUseTime: "3–5 min",
    icon: "piggyBank",
    featured: true,
    href: "/tools/403b-paycheck-calculator",
    relatedArticle: { label: "How hospital 403(b) matching works", href: "/articles/how-hospital-403b-matching-works" },
  },
  {
    slug: "obbb-overtime-deduction-estimator",
    legacyAnchorId: "overtime",
    title: "OBBB Overtime Deduction Estimator",
    shortTitle: "Overtime Deduction Estimator",
    category: "Workplace benefits",
    audience: "Healthcare workers",
    description: "Estimate qualifying overtime premium, the deduction cap, and rough federal income-tax savings.",
    estimatedUseTime: "3–5 min",
    icon: "receipt",
    componentKey: "overtimeDeduction",
    relatedArticle: { label: "OBBB Overtime Tax Deduction Explained", href: "/articles/obbb-overtime-tax-deduction-healthcare-workers" },
  },
  {
    slug: "open-enrollment-final-checklist",
    legacyAnchorId: "open-enrollment-checklist",
    title: "Open Enrollment Final Checklist",
    shortTitle: "Open Enrollment Checklist",
    category: "Open enrollment",
    audience: "Everyone",
    description: "Run a final, printable review of health, tax account, disability, life, and supplemental elections.",
    estimatedUseTime: "5–8 min",
    icon: "clipboard",
    componentKey: "openEnrollmentChecklist",
    relatedArticle: { label: "Open Enrollment Guide", href: "/open-enrollment" },
  },
  {
    slug: "open-enrollment-true-cost-calculator",
    legacyAnchorId: "open-enrollment",
    title: "Open Enrollment True Cost Calculator",
    shortTitle: "Health Plan True Cost",
    category: "Open enrollment",
    audience: "Everyone",
    description: "Compare two plans by annual premium, expected care cost, employer funding, and bad-year exposure.",
    estimatedUseTime: "5–8 min",
    icon: "shield",
    featured: true,
    href: "/tools/open-enrollment-true-cost-calculator",
    relatedArticle: { label: "Premium, Deductible, and Out-of-Pocket Max", href: "/articles/premium-deductible-out-of-pocket-open-enrollment" },
  },
  {
    slug: "out-of-pocket-max-estimator",
    legacyAnchorId: "out-of-pocket-max",
    title: "Out-of-Pocket Max Estimator",
    shortTitle: "Out-of-Pocket Max",
    category: "Open enrollment",
    audience: "Everyone",
    description: "Estimate how close covered in-network care could bring you to the plan's yearly maximum.",
    estimatedUseTime: "3–5 min",
    icon: "shield",
    href: "/tools/out-of-pocket-max-estimator",
  },
  {
    slug: "open-enrollment-paycheck-impact-calculator",
    legacyAnchorId: "paycheck-impact",
    title: "Open Enrollment Paycheck Impact Calculator",
    shortTitle: "Paycheck Impact",
    category: "Open enrollment",
    audience: "Everyone",
    description: "Estimate how pre-tax and after-tax benefit elections may change take-home pay.",
    estimatedUseTime: "3–5 min",
    icon: "receipt",
    componentKey: "paycheckImpact",
    relatedArticle: { label: "How Open Enrollment Changes Your Paycheck", href: "/articles/open-enrollment-paycheck-impact" },
  },
  {
    slug: "supplemental-benefits-decision-helper",
    legacyAnchorId: "supplemental-benefits",
    title: "Supplemental Benefits Decision Helper",
    shortTitle: "Supplemental Benefits Helper",
    category: "Open enrollment",
    audience: "Everyone",
    description: "Compare premiums and likely payout for accident, critical illness, and hospital indemnity coverage.",
    estimatedUseTime: "5–8 min",
    icon: "wallet",
    componentKey: "supplementalBenefits",
    relatedArticle: { label: "Supplemental Benefits Explained", href: "/articles/accident-critical-illness-hospital-indemnity-open-enrollment" },
  },
  {
    slug: "hsa-vs-fsa-decision-helper",
    legacyAnchorId: "hsa-fsa",
    title: "HSA vs FSA Decision Helper",
    shortTitle: "HSA vs FSA",
    category: "Open enrollment",
    audience: "Everyone",
    description: "Compare tax savings, employer money, deductible risk, forfeiture risk, and provider needs.",
    estimatedUseTime: "5–8 min",
    icon: "piggyBank",
    componentKey: "hsaFsa",
    relatedArticle: { label: "HSA vs FSA Guide", href: "/articles/hsa-vs-fsa-healthcare-workers" },
  },
  {
    slug: "medical-bill-review-flow",
    legacyAnchorId: "medical-bill-review-flow",
    title: "Medical Bill Review Flow",
    shortTitle: "Medical Bill Review",
    category: "Medical bills",
    audience: "Patients & caregivers",
    description: "Decide what to check, request, and ask before paying a provider bill, EOB, MSN, or collection notice.",
    estimatedUseTime: "5–8 min",
    icon: "receipt",
    featured: true,
    href: "/tools/medical-bill-review-flow",
    relatedArticle: { label: "Medical Bill Review Toolkit", href: "/insurance/medical-bill-review-toolkit" },
  },
  {
    slug: "prior-authorization-next-step-guide",
    title: "Prior Authorization Next-Step Guide",
    shortTitle: "Prior Authorization Guide",
    category: "Medical bills",
    audience: "Patients & caregivers",
    description: "Identify the likely process stage and build the next call, document, urgent-review, or appeal steps.",
    estimatedUseTime: "5–8 min",
    icon: "clipboard",
    featured: true,
    href: "/tools/prior-authorization-next-step-guide",
  },
  {
    slug: "hospital-bill-review-checklist",
    legacyAnchorId: "hospital-bill-checklist",
    title: "Hospital Bill Review Checklist",
    shortTitle: "Hospital Bill Checklist",
    category: "Medical bills",
    audience: "Patients & caregivers",
    description: "Organize the first review of a large, confusing, or surprising healthcare balance.",
    estimatedUseTime: "3–5 min",
    icon: "clipboard",
    componentKey: "hospitalBillChecklist",
    relatedArticle: { label: "Financial Assistance Guide", href: "/articles/check-hospital-financial-assistance-before-paying" },
  },
  {
    slug: "eob-to-bill-match-checker",
    legacyAnchorId: "eob-bill-match",
    title: "EOB-to-Bill Match Checker",
    shortTitle: "EOB-to-Bill Checker",
    category: "Medical bills",
    audience: "Patients & caregivers",
    description: "Compare an insurer explanation with a provider bill and identify mismatches to ask about.",
    estimatedUseTime: "3–5 min",
    icon: "receipt",
    href: "/tools/eob-to-bill-match-checker",
    relatedArticle: { label: "How to Read an EOB", href: "/articles/how-to-read-an-eob" },
  },
  {
    slug: "financial-assistance-checklist",
    legacyAnchorId: "financial-assistance-checklist",
    title: "Financial Assistance Checklist",
    shortTitle: "Financial Assistance",
    category: "Medical bills",
    audience: "Patients & caregivers",
    description: "Prepare the documents and questions for hospital charity care or financial assistance.",
    estimatedUseTime: "3–5 min",
    icon: "shield",
    componentKey: "financialAssistanceChecklist",
    relatedArticle: { label: "Financial Assistance Guide", href: "/articles/check-hospital-financial-assistance-before-paying" },
  },
  {
    slug: "health-insurance-visit-cost-calculator",
    legacyAnchorId: "insurance",
    title: "Health Insurance Visit Cost Calculator",
    shortTitle: "Visit Cost Calculator",
    category: "Medical bills",
    audience: "Everyone",
    description: "Estimate yearly cost across premiums, deductible, copays, coinsurance, visits, and remaining maximum room.",
    estimatedUseTime: "5–8 min",
    icon: "shield",
    componentKey: "insuranceVisitCost",
    relatedArticle: { label: "Plain-English Healthcare Finance Glossary", href: "/articles/plain-english-glossary" },
  },
  {
    slug: "student-loan-path-finder",
    legacyAnchorId: "student-loan-path",
    title: "Student Loan Path Finder",
    shortTitle: "Loan Path Finder",
    category: "Student loans",
    audience: "Everyone",
    description: "Separate federal forgiveness paths from private-loan payoff decisions before choosing a strategy.",
    estimatedUseTime: "5–8 min",
    icon: "graduation",
    featured: true,
    componentKey: "studentLoanPath",
    relatedArticle: { label: "Student Loans Section", href: "/student-loans" },
  },
  {
    slug: "private-student-loan-payoff-calculator",
    legacyAnchorId: "private-loan-payoff",
    title: "Private Student Loan Payoff Calculator",
    shortTitle: "Private Loan Payoff",
    category: "Student loans",
    audience: "Everyone",
    description: "Compare minimum payments, extra payments, lump sums, and a possible refinance APR.",
    estimatedUseTime: "5–8 min",
    icon: "calculator",
    componentKey: "privateLoanPayoff",
    relatedArticle: { label: "Student Loans Section", href: "/student-loans" },
  },
  {
    slug: "pslf-progress-estimator",
    legacyAnchorId: "pslf-progress",
    title: "PSLF Progress Estimator",
    shortTitle: "PSLF Progress",
    category: "Student loans",
    audience: "Healthcare workers",
    description: "Estimate payments remaining to 120 and identify the records that still need official verification.",
    estimatedUseTime: "3–5 min",
    icon: "landmark",
    componentKey: "pslfProgress",
    relatedArticle: { label: "Student Loans Section", href: "/student-loans" },
  },
  {
    slug: "student-loan-payment-calculator",
    legacyAnchorId: "loan",
    title: "Student Loan Payment Calculator",
    shortTitle: "Loan Payment Calculator",
    category: "Student loans",
    audience: "Everyone",
    description: "Estimate monthly payment, total paid, and interest over time for a balance, APR, and term.",
    estimatedUseTime: "3–5 min",
    icon: "calculator",
    componentKey: "loanPayment",
    relatedArticle: { label: "Student Loans Section", href: "/student-loans" },
  },
  {
    slug: "medicare-medicaid-eligibility-check",
    legacyAnchorId: "medicare-medicaid-eligibility-check",
    title: "Medicare and Medicaid Eligibility Check",
    shortTitle: "Eligibility Check",
    category: "Medicare & caregiving",
    audience: "Patients & caregivers",
    description: "Identify possible Medicare, Medicaid, long-term-care, dual-eligibility, and cost-assistance paths.",
    estimatedUseTime: "5–8 min",
    icon: "landmark",
    featured: true,
    href: "/tools/medicare-medicaid-eligibility-check",
    relatedArticle: { label: "Medicare vs Medicaid", href: "/articles/medicare-vs-medicaid-what-is-the-difference" },
  },
  {
    slug: "hospital-discharge-medicare-checklist",
    legacyAnchorId: "hospital-discharge-medicare-checklist",
    title: "Hospital Discharge Medicare Checklist Tool",
    shortTitle: "Discharge Checklist",
    category: "Medicare & caregiving",
    audience: "Patients & caregivers",
    description: "Build a focused checklist for rehab, home health, equipment, medication, authorization, or billing questions.",
    estimatedUseTime: "5–8 min",
    icon: "clipboard",
    href: "/tools/hospital-discharge-medicare-checklist",
    relatedArticle: { label: "Hospital Discharge & Medicare Guide", href: "/guides/hospital-discharge-medicare" },
  },
  {
    slug: "medicare-cost-exposure-tool",
    legacyAnchorId: "medicare",
    title: "Medicare Cost Exposure Tool",
    shortTitle: "Medicare Cost Exposure",
    category: "Medicare & caregiving",
    audience: "Patients & caregivers",
    description: "Create a rough planning snapshot for premiums, deductibles, prescriptions, and coinsurance.",
    estimatedUseTime: "3–5 min",
    icon: "heart",
    componentKey: "medicareCost",
    relatedArticle: { label: "Medicare Options Explained", href: "/articles/medicare-options-explained" },
  },
  {
    slug: "hospital-cafe-savings-calculator",
    legacyAnchorId: "cafe",
    title: "Hospital Cafe Savings Rate Calculator",
    shortTitle: "Cafe Savings Calculator",
    category: "Everyday money",
    audience: "Healthcare workers",
    description: "See what recurring shift spending adds up to and what redirecting part of it could become.",
    estimatedUseTime: "2–3 min",
    icon: "coffee",
    componentKey: "cafeSavings",
    relatedArticle: { label: "Hospital Cafe Habit", href: "/articles/hospital-cafe-habit" },
  },
];

export const getToolHref = (tool: ToolDefinition) => tool.href ?? `/tools/${tool.slug}`;

export const getToolBySlug = (slug: string) => tools.find((tool) => tool.slug === slug);

export const getToolByLegacyAnchor = (anchor: string) => tools.find((tool) => tool.legacyAnchorId === anchor);
