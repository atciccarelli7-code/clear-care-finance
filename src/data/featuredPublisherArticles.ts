import type { Article } from "./articles";

export type FeaturedPublisherArticle = Pick<Article, "slug" | "title" | "category" | "readTime" | "promise">;

// Keep the homepage payload compact. The complete reported articles are loaded
// only when a reader opens an article route.
export const FEATURED_PUBLISHER_ARTICLES = [
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
    slug: "20-dollar-tylenol-hospital-prices",
    title: "The $20 Tylenol Isn’t Really About the Tylenol",
    category: "Hospital Prices",
    readTime: "10 min read",
    promise: "A hospital line-item charge is only one layer of the price—and usually not the amount the hospital collects or the patient ultimately owes.",
  },
  {
    slug: "what-nonprofit-hospital-actually-means",
    title: "What a Nonprofit Hospital Actually Is (and Isn’t)",
    category: "Hospital Economics",
    readTime: "9 min read",
    promise: "Nonprofit describes a hospital’s ownership, tax, and public-purpose obligations—not a promise to avoid surpluses, bills, executive pay, or hard financial choices.",
  },
  {
    slug: "why-hospitals-care-about-length-of-stay",
    title: "Why Hospitals Care So Much About Length of Stay",
    category: "Hospital Operations",
    readTime: "10 min read",
    promise: "Length of stay sits where clinical safety, staffed capacity, payment, and discharge barriers collide—so one delayed discharge can affect patients far beyond one room.",
  },
  {
    slug: "why-just-send-them-to-rehab-is-not-simple",
    title: "Why “Just Send Them to Rehab” Is Not That Simple",
    category: "Hospital Discharge",
    readTime: "11 min read",
    promise: "A rehab recommendation starts a chain of clinical review, facility acceptance, coverage rules, authorization, staffing, and logistics—it does not reserve a bed.",
  },
] satisfies FeaturedPublisherArticle[];
