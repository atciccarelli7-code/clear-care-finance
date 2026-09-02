import type { Article } from "./articles";

export type EditorialAreaId =
  | "hospital-economics"
  | "costs-bills-insurance"
  | "care-transitions"
  | "medicare-medicaid"
  | "healthcare-worker-money";

export type EditorialArea = {
  id: EditorialAreaId;
  label: string;
  question: string;
  description: string;
  href: string;
};

export const EDITORIAL_AREAS: readonly EditorialArea[] = [
  {
    id: "hospital-economics",
    label: "Hospital economics & operations",
    question: "Why does the hospital work this way?",
    description: "Prices, payment, nonprofit status, capacity, length of stay, and the incentives behind hospital decisions.",
    href: "/topics/hospital-economics",
  },
  {
    id: "costs-bills-insurance",
    label: "Costs, bills & insurance",
    question: "What do these prices and insurance rules mean?",
    description: "Allowed amounts, EOBs, facility fees, cost sharing, prior authorization, and help with hospital bills.",
    href: "/insurance",
  },
  {
    id: "care-transitions",
    label: "Care transitions & discharge",
    question: "What has to happen before care can safely move?",
    description: "Rehab, home care, equipment, medication changes, caregiver work, and the first days after discharge.",
    href: "/patients-families/hospital-guide",
  },
  {
    id: "medicare-medicaid",
    label: "Medicare & Medicaid",
    question: "Which program or coverage rule controls next?",
    description: "Medicare choices, hospital status, skilled care, long-term care, Medicaid, and coverage gaps.",
    href: "/medicare-care-costs",
  },
  {
    id: "healthcare-worker-money",
    label: "Healthcare worker money & benefits",
    question: "How should a healthcare worker evaluate the money?",
    description: "403(b) plans, job offers, open enrollment, protection benefits, shift-life costs, and career tradeoffs.",
    href: "/healthcare-workers",
  },
] as const;

const CARE_TRANSITION_CATEGORIES = new Set([
  "Hospital Discharge",
  "Hospital Stay",
  "Hospital & Patient Guide",
  "Patients & Caregivers",
]);

const MEDICARE_CATEGORIES = new Set(["Medicare", "Medicaid", "Medicare & Medicaid"]);
const WORKER_CATEGORIES = new Set([
  "Build Wealth",
  "Healthcare Worker Pay",
  "Open Enrollment",
  "Spending",
  "Workplace Benefits",
]);

export const getEditorialAreaId = (article: Pick<Article, "category">): EditorialAreaId => {
  if (CARE_TRANSITION_CATEGORIES.has(article.category)) return "care-transitions";
  if (MEDICARE_CATEGORIES.has(article.category)) return "medicare-medicaid";
  if (WORKER_CATEGORIES.has(article.category)) return "healthcare-worker-money";
  if (article.category === "Insurance" || article.category === "Hospital Bills") return "costs-bills-insurance";
  return "hospital-economics";
};

export const DE_EMPHASIZED_ARTICLE_SLUGS = new Set([
  "how-healthcare-workers-can-invest-without-picking-stocks",
  "savings-rate-that-actually-changes-your-life",
  "can-healthcare-workers-reach-financial-independence",
  "cash-vs-investing-when-you-feel-behind",
  "can-you-live-off-dividends-passive-income-guide",
  "managing-money-has-never-been-easier-or-harder",
  "use-credit-cards-without-credit-card-debt",
  "diagnosis-explained",
  "workplace-benefits-definitions",
  "plain-english-glossary",
  "healthcare-worker-discounts",
]);
