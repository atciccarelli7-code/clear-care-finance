import type { CtaAudienceSegment, CtaDecisionCategory, DirectionalCtaAction } from "@/lib/directionalCta";

export const TOOL_START_LABELS: Record<string, string> = {
  openEnrollmentChecklist: "Build my enrollment checklist",
  paycheckImpact: "Estimate my paycheck impact",
  supplementalBenefits: "Compare supplemental benefits",
  hsaFsa: "Compare HSA and FSA options",
  hospitalBillChecklist: "Build my bill-review checklist",
  financialAssistanceChecklist: "Check assistance steps",
  insuranceVisitCost: "Estimate my visit cost",
  overtimeDeduction: "Estimate my overtime deduction",
  studentLoanPath: "Find my repayment path",
  privateLoanPayoff: "Compare payoff options",
  pslfProgress: "Check my PSLF progress",
  loanPayment: "Estimate my loan payment",
  medicareCost: "Estimate Medicare costs",
  cafeSavings: "Estimate my savings plan",
};

export const getToolStartLabel = (componentKey: string, fallbackTitle: string) =>
  TOOL_START_LABELS[componentKey] ?? `Start ${fallbackTitle}`;

export const PRIORITY_DIRECTIONAL_ARTICLE_SLUGS = new Set([
  "how-hospital-403b-matching-works",
  "how-much-should-a-nurse-put-in-403b-per-paycheck",
  "how-to-read-an-eob",
  "deductible-copay-coinsurance-out-of-pocket-max",
]);

export const isPriorityDirectionalArticle = (slug: string) => PRIORITY_DIRECTIONAL_ARTICLE_SLUGS.has(slug);

const ARTICLE_HERO_ACTIONS: Record<string, DirectionalCtaAction> = {
  "how-hospital-403b-matching-works": {
    id: "hospital_403b_article_hero_calculator",
    label: "Estimate my contribution and match",
    title: "403(b) Paycheck Contribution Calculator",
    href: "/tools/403b-paycheck-calculator",
    availabilityStatus: "available",
  },
  "how-much-should-a-nurse-put-in-403b-per-paycheck": {
    id: "nurse_403b_article_hero_calculator",
    label: "Estimate my paycheck contribution",
    title: "403(b) Paycheck Contribution Calculator",
    href: "/tools/403b-paycheck-calculator",
    availabilityStatus: "available",
  },
};

export const getArticleHeroAction = (slug: string) => ARTICLE_HERO_ACTIONS[slug] ?? null;

export const audienceForArticleCategory = (category: string): CtaAudienceSegment => {
  if (["Build Wealth", "Workplace Benefits"].includes(category)) return "healthcare_workers";
  if (["Hospital Bills", "Medicare"].includes(category)) return "patients_caregivers";
  return "everyone";
};

export const decisionCategoryForArticleCategory = (category: string): CtaDecisionCategory => {
  if (category === "Build Wealth") return "everyday_money";
  if (category === "Workplace Benefits") return "workplace_benefits";
  if (category === "Open Enrollment" || category === "Insurance") return "open_enrollment";
  if (category === "Hospital Bills") return "medical_bills";
  if (category === "Student Loans") return "student_loans";
  if (category === "Medicare") return "medicare_caregiving";
  return "site_navigation";
};

const dedicatedToolDestinations: Record<string, string> = {
  "/tools#403b": "/tools/403b-paycheck-calculator",
  "/tools#eob-bill-match": "/tools/eob-to-bill-match-checker",
  "/tools#insurance": "/tools/health-insurance-visit-cost-calculator",
  "/tools#open-enrollment": "/tools/open-enrollment-true-cost-calculator",
};

export const resolveDirectionalDestination = (href: string) => dedicatedToolDestinations[href] ?? href;

export const audienceForTool = (audience: string): CtaAudienceSegment => {
  if (audience === "Healthcare workers") return "healthcare_workers";
  if (audience === "Patients & caregivers") return "patients_caregivers";
  return "everyone";
};

export const decisionCategoryForToolCategory = (category: string): CtaDecisionCategory => {
  if (category === "Workplace benefits") return "workplace_benefits";
  if (category === "Open enrollment") return "open_enrollment";
  if (category === "Medical bills") return "medical_bills";
  if (category === "Student loans") return "student_loans";
  if (category === "Medicare & caregiving") return "medicare_caregiving";
  return "everyday_money";
};
