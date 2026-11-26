import { FEATURED_PUBLISHER_ARTICLES } from "./featuredPublisherArticles";

// Lightweight presentation records; complete reporting stays in its existing lazy-loaded modules.
export const FLAGSHIP_VISUAL_ARTICLES = [
  FEATURED_PUBLISHER_ARTICLES.find(a => a.slug === "why-hospitals-become-the-systems-shock-absorber")!,
  FEATURED_PUBLISHER_ARTICLES.find(a => a.slug === "home-with-family-is-not-a-free-care-plan")!,
  FEATURED_PUBLISHER_ARTICLES.find(a => a.slug === "20-dollar-tylenol-hospital-prices")!,
  { slug: "what-nonprofit-hospital-actually-means", title: "What a Nonprofit Hospital Actually Is (and Isn’t)", category: "Hospital Economics", readTime: "9 min read", promise: "Nonprofit describes a hospital’s ownership, tax, and public-purpose obligations—not a promise to avoid surpluses, bills, executive pay, or hard financial choices." },
  { slug: "why-hospitals-care-about-length-of-stay", title: "Why Hospitals Care So Much About Length of Stay", category: "Hospital Operations", readTime: "10 min read", promise: "Length of stay sits where clinical safety, staffed capacity, payment, and discharge barriers collide—so one delayed discharge can affect patients far beyond one room." },
  { slug: "why-just-send-them-to-rehab-is-not-simple", title: "Why “Just Send Them to Rehab” Is Not That Simple", category: "Hospital Discharge", readTime: "11 min read", promise: "A rehab recommendation starts a chain of clinical review, facility acceptance, coverage rules, authorization, staffing, and logistics—it does not reserve a bed." },
];
