import type { visuals } from "./content";

const article = (slug: string) => `/articles/${slug}`;

const destinations = {
  "medicare-enrollment": "/medicare-care-costs/turning-65",
  "disability-coverage": "/tools/medicare-medicaid-eligibility-check",
  "medicare-medicaid": article("medicare-vs-medicaid-what-is-the-difference"),
  "medicare-options": article("medicare-advantage-vs-original-medicare-2026"),
  "medicaid-pathways": article("medicaid-dual-eligibility-ltss"),
  "nc-medicaid-expansion-income": article("medicaid-dual-eligibility-ltss"),
  "medicaid-application": article("from-the-bedside-long-term-care-medicaid-hospital-delay"),
  "medicare-snf": article("does-medicare-cover-rehab-after-hospital-stay"),
  "nursing-home-payers": article("does-medicare-cover-long-term-care"),
  "bill-to-payment": article("allowed-amount-medical-bills"),
  "eob-match": article("how-to-read-an-eob"),
  "multiple-bills": article("why-one-hospital-visit-can-create-multiple-bills"),
  "financial-assistance": article("check-hospital-financial-assistance-before-paying"),
} as const satisfies Record<keyof typeof visuals, string>;

export type VisualId = keyof typeof destinations;
export const groups = [
  { name: "Medicare and Medicaid", ids: ["medicare-enrollment", "disability-coverage", "medicare-medicaid", "medicare-options", "medicaid-pathways", "nc-medicaid-expansion-income", "medicaid-application", "medicare-snf", "nursing-home-payers"] },
  { name: "Hospital bills", ids: ["bill-to-payment", "eob-match", "multiple-bills", "financial-assistance"] },
] as const satisfies ReadonlyArray<{ name: string; ids: readonly VisualId[] }>;

export const visualIndexPath = "/articles#visual-explainers";
export const visualHref = (id: VisualId) => `${destinations[id]}#visual-${id}`;

export function visualForArticle(slug: string) {
  return (Object.keys(destinations) as VisualId[]).find(id => destinations[id] === article(slug));
}
