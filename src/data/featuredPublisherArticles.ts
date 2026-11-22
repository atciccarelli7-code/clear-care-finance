import type { Article } from "./articles";

export type FeaturedPublisherArticle = Pick<Article, "slug" | "title" | "category" | "readTime" | "promise">;

// Keep the homepage payload compact. The complete reported articles are loaded
// only when a reader opens an article route. Rotate the six-card package toward
// the newest founder-led reporting while preserving the strongest adjacent work.
export const FEATURED_PUBLISHER_ARTICLES = [
  {
    slug: "patient-in-the-bed-and-patient-in-the-chart",
    title: "The Patient in the Bed and the Patient in the Chart",
    category: "Hospital Discharge",
    readTime: "16 min read",
    promise: "What a clinician sees in the room has to survive documentation, handoffs, coverage rules and outside review before another organization can act on it.",
  },
  {
    slug: "what-happens-while-hospital-is-waiting-on-insurance",
    title: "What Happens While the Hospital Is “Waiting on Insurance”?",
    category: "Hospital Discharge",
    readTime: "18 min read",
    promise: "The patient may be medically ready to leave. The hospital may be ready to discharge them. But until the next organization says yes, everyone keeps waiting—and the hospital keeps operating around that wait.",
  },
  {
    slug: "20-dollar-tylenol-hospital-prices",
    title: "The $20 Tylenol Isn’t Really About the Tylenol",
    category: "Hospital Prices",
    readTime: "10 min read",
    promise: "A hospital line-item charge is only one layer of the price—and usually not the amount the hospital collects or the patient ultimately owes.",
  },
  {
    slug: "why-hospitals-become-the-systems-shock-absorber",
    title: "Why the Hospital Becomes the System’s Shock Absorber",
    category: "Hospital Economics",
    readTime: "11 min read",
    promise: "When another part of the care system cannot absorb a problem, the hospital often inherits the visible consequence—even when it did not create the original failure.",
  },
  {
    slug: "home-with-family-is-not-a-free-care-plan",
    title: "“Home With Family” Is Not a Free Care Plan",
    category: "Patients & Caregivers",
    readTime: "11 min read",
    promise: "A discharge home can move medication, transportation, monitoring, daily care, coordination, and financial risk outside the hospital; the work does not disappear.",
  },
  {
    slug: "home-health-after-discharge",
    title: "Home Health After Discharge",
    category: "Medicare",
    readTime: "6 min read",
    promise: "Plan who will help between Medicare home health visits, especially on the first night and during the first week.",
  },
] satisfies FeaturedPublisherArticle[];
