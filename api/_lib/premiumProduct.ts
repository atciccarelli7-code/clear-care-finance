export const PREMIUM_PRODUCT_ID = "healthcare_compensation_benefits_decision_book";
export const PREMIUM_PRODUCT_VERSION = "3.0-web.1";
export const PREMIUM_CONTENT_STORE_KEY = `caf:premium:content:${PREMIUM_PRODUCT_ID}:${PREMIUM_PRODUCT_VERSION}`;

export type PremiumModule = {
  id: string;
  number: string;
  part: string;
  title: string;
  purpose: string;
  orientation: string;
  framingQuestions: string[];
  comparisonFields: string[];
  actions: string[];
  professionalQuestions: string[];
  completionCriteria: string[];
  relatedModuleIds: string[];
  sourceIds: string[];
};

export type PremiumSource = { id: string; agency: string; title: string; url: string };

export type PremiumProductContent = {
  id: string;
  name: string;
  sourceEditionName: string;
  version: string;
  sourceVersion: string;
  sourceReviewDate: string;
  publishedAt: string;
  audience: string;
  outcome: string;
  purchaseModel: {
    type: "one_time";
    automaticRenewal: false;
    access: string;
    updates: string;
    ads: false;
  };
  privacy: {
    savedToAccount: string[];
    keptInBrowser: string[];
    prohibited: string[];
  };
  modules: PremiumModule[];
  sources: PremiumSource[];
  updateHistory: Array<{ version: string; date: string; type: string; summary: string }>;
  limitation: string;
};

// Titles and ordering are public product-preview information. Substantive module content is not
// committed to this public repository; it is seeded from the canonical private v3.0 source into
// the server-only premium content store before launch.
export const premiumModuleManifest = [
  { id: "pay-structure", number: "01", part: "Compensation", title: "Employment pay structure" },
  { id: "total-compensation", number: "02", part: "Compensation", title: "Total compensation" },
  { id: "medical-insurance", number: "03", part: "Health & insurance", title: "Medical insurance" },
  { id: "dental-insurance", number: "04", part: "Health & insurance", title: "Dental insurance" },
  { id: "vision-insurance", number: "05", part: "Health & insurance", title: "Vision insurance" },
  { id: "hsa-fsa-hra", number: "06", part: "Health & insurance", title: "HSA, FSA & HRA elections" },
  { id: "retirement-plan", number: "07", part: "Retirement", title: "Retirement plan identification" },
  { id: "retirement-election", number: "08", part: "Retirement", title: "Retirement contribution election" },
  { id: "pto-leave", number: "09", part: "Time, leave & protection", title: "PTO & leave" },
  { id: "protection-elections", number: "10", part: "Time, leave & protection", title: "Disability, life & protection elections" },
  { id: "schedule-time", number: "11", part: "Time, leave & protection", title: "Schedule & controlled time" },
  { id: "repayment-risk", number: "12", part: "Conditional benefits & risk", title: "Repayment risk" },
  { id: "career-fit", number: "13", part: "Conditional benefits & risk", title: "Career fit & employment risk" },
  { id: "integrated-decision", number: "14", part: "Integrated decision", title: "Integrated decision board" },
] as const;

export const premiumProductManifest = {
  id: PREMIUM_PRODUCT_ID,
  name: "Healthcare Compensation & Benefits Decision Workspace",
  version: PREMIUM_PRODUCT_VERSION,
  sourceVersion: "3.0",
  sourceReviewDate: "2026-07-23",
  moduleCount: premiumModuleManifest.length,
  modules: premiumModuleManifest,
  purchaseModel: {
    type: "one_time",
    automaticRenewal: false,
    updates: "twelve_months",
    ads: false,
  },
} as const;

export function isValidPremiumProductContent(value: unknown): value is PremiumProductContent {
  if (!value || typeof value !== "object") return false;
  const product = value as Partial<PremiumProductContent>;
  if (product.id !== PREMIUM_PRODUCT_ID || product.version !== PREMIUM_PRODUCT_VERSION || product.sourceVersion !== "3.0") return false;
  if (!Array.isArray(product.modules) || product.modules.length !== premiumModuleManifest.length) return false;
  const expectedIds = premiumModuleManifest.map((module) => module.id);
  const actualIds = product.modules.map((module) => module?.id);
  if (expectedIds.some((id, index) => actualIds[index] !== id)) return false;
  return product.modules.every((module) =>
    typeof module.title === "string" &&
    typeof module.purpose === "string" &&
    typeof module.orientation === "string" &&
    Array.isArray(module.framingQuestions) &&
    Array.isArray(module.comparisonFields) &&
    Array.isArray(module.actions) &&
    Array.isArray(module.professionalQuestions) &&
    Array.isArray(module.completionCriteria) &&
    Array.isArray(module.relatedModuleIds) &&
    Array.isArray(module.sourceIds),
  ) && Array.isArray(product.sources) && Array.isArray(product.updateHistory) && typeof product.limitation === "string";
}
