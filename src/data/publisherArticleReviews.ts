export type PublisherArticleDisposition = "ad-eligible" | "ad-free-sensitive" | "ad-free-editorial";

export type PublisherArticleReview = {
  slug: string;
  route: `/articles/${string}`;
  disposition: PublisherArticleDisposition;
  contentTier: "flagship" | "substantial" | "standard";
  reviewedAt: string;
  nextReviewAt: string;
  reviewScope: string;
  reason: string;
};

type RuntimePublisherArticleReview = Pick<
  PublisherArticleReview,
  "slug" | "route" | "disposition" | "contentTier" | "reviewedAt" | "reason"
>;

const DEFAULT_REVIEWED_AT = "2026-07-31";

const AD_ELIGIBLE_SLUGS = new Set([
  "how-a-hospital-actually-makes-money",
  "why-hospitals-become-the-systems-shock-absorber",
  "20-dollar-tylenol-hospital-prices",
  "what-nonprofit-hospital-actually-means",
  "what-employer-benefit-changes-should-i-compare",
  "how-much-should-a-nurse-put-in-403b-per-paycheck",
  "how-hospital-403b-matching-works",
  "how-to-pick-retirement-investments-at-work",
  "healthcare-worker-money-map",
  "how-healthcare-workers-can-invest-without-picking-stocks",
  "savings-rate-that-actually-changes-your-life",
  "roth-vs-traditional-403b-healthcare-workers",
  "can-healthcare-workers-reach-financial-independence",
  "cash-vs-investing-when-you-feel-behind",
  "can-you-live-off-dividends-passive-income-guide",
  "money-stress-after-hard-shift",
  "earn-more-without-burning-out-bedside",
  "managing-money-has-never-been-easier-or-harder",
  "use-credit-cards-without-credit-card-debt",
  "open-enrollment-mistakes-healthcare-workers",
  "premium-deductible-out-of-pocket-open-enrollment",
  "spouse-family-health-insurance-open-enrollment",
  "prescription-coverage-open-enrollment-checklist",
  "network-checklist-open-enrollment",
  "disability-insurance-healthcare-workers-open-enrollment",
  "employer-life-insurance-open-enrollment",
  "accident-critical-illness-hospital-indemnity-open-enrollment",
  "dental-vision-insurance-open-enrollment",
  "health-fsa-vs-dependent-care-fsa",
  "open-enrollment-paycheck-impact",
  "beneficiaries-open-enrollment-checklist",
  "how-healthcare-workers-should-compare-job-offers",
  "why-one-hospital-visit-can-create-multiple-bills",
  "facility-fee-vs-professional-fee",
  "in-network-hospital-out-of-network-bills",
  "allowed-amount-medical-bills",
  "hsa-vs-fsa-healthcare-workers",
  "backup-care-plans-for-busy-healthcare-workers",
  "deductible-copay-coinsurance-out-of-pocket-max",
  "how-to-read-an-eob",
  "why-er-visit-is-expensive",
  "hospital-cafe-habit",
  "burnout-overspending-overeating",
]);

const SENSITIVE_SLUGS = new Set([
  "patient-in-the-bed-and-patient-in-the-chart",
  "what-happens-while-hospital-is-waiting-on-insurance",
  "medically-ready-is-not-the-same-as-ready-for-home",
  "home-with-family-is-not-a-free-care-plan",
  "why-hospitals-care-about-length-of-stay",
  "why-just-send-them-to-rehab-is-not-simple",
  "does-medicare-cover-long-term-care",
  "does-medicare-cover-rehab-after-hospital-stay",
  "medicare-vs-medicaid-what-is-the-difference",
  "what-does-medicare-not-cover",
  "why-do-i-still-owe-money-with-medicare",
  "from-the-bedside-medicare-prescription-cost",
  "from-the-bedside-long-term-care-medicaid-hospital-delay",
  "why-am-i-getting-a-blood-thinner-in-the-hospital",
  "why-did-the-hospital-stop-or-change-my-home-medications",
  "safe-hospital-discharge-first-72-hours",
  "blood-thinner-safety-before-going-home",
  "copd-recovery-after-hospital",
  "heart-failure-plan-after-discharge",
  "new-home-oxygen-nebulizer-guide",
  "observation-vs-inpatient-status",
  "prior-authorization-explained",
  "check-hospital-financial-assistance-before-paying",
  "insurance-is-future-planning",
  "medicare-advantage-vs-original-medicare-2026",
  "medicare-medicaid-changes-january-2027",
  "medicare-options-explained",
  "discharge-coverage-guide",
  "short-term-rehab-after-hospital",
  "home-health-after-discharge",
  "durable-medical-equipment-after-discharge",
  "long-term-care-and-custodial-care",
  "medicaid-dual-eligibility-ltss",
]);

const EDITORIAL_SLUGS = new Set([
  "diagnosis-explained",
  "obbb-overtime-tax-deduction-healthcare-workers",
  "workplace-benefits-definitions",
  "plain-english-glossary",
  "healthcare-worker-discounts",
]);

const FLAGSHIP_ELIGIBLE_SLUGS = new Set([
  "how-a-hospital-actually-makes-money",
  "why-hospitals-become-the-systems-shock-absorber",
  "20-dollar-tylenol-hospital-prices",
  "deductible-copay-coinsurance-out-of-pocket-max",
  "how-to-read-an-eob",
]);

const REVIEWED_AT: Record<string, string> = {
  "how-a-hospital-actually-makes-money": "2026-09-10",
  "patient-in-the-bed-and-patient-in-the-chart": "2026-09-08",
  "what-happens-while-hospital-is-waiting-on-insurance": "2026-09-08",
  "medically-ready-is-not-the-same-as-ready-for-home": "2026-09-08",
  "why-hospitals-become-the-systems-shock-absorber": "2026-08-30",
  "home-with-family-is-not-a-free-care-plan": "2026-08-30",
  "20-dollar-tylenol-hospital-prices": "2026-08-29",
  "what-nonprofit-hospital-actually-means": "2026-08-29",
  "why-hospitals-care-about-length-of-stay": "2026-08-29",
  "why-just-send-them-to-rehab-is-not-simple": "2026-08-29",
  "observation-vs-inpatient-status": "2026-08-30",
};

const reviewForSlug = (slug: string): RuntimePublisherArticleReview | undefined => {
  const reviewedAt = REVIEWED_AT[slug] ?? DEFAULT_REVIEWED_AT;

  if (AD_ELIGIBLE_SLUGS.has(slug)) {
    return {
      slug,
      route: `/articles/${slug}`,
      disposition: "ad-eligible",
      contentTier: FLAGSHIP_ELIGIBLE_SLUGS.has(slug) ? "flagship" : "substantial",
      reviewedAt,
      reason: "Reviewed publisher article eligible under CAF's route-level advertising policy.",
    };
  }

  if (SENSITIVE_SLUGS.has(slug)) {
    return {
      slug,
      route: `/articles/${slug}`,
      disposition: "ad-free-sensitive",
      contentTier: "standard",
      reviewedAt,
      reason: "Reviewed healthcare decision content intentionally kept ad-free.",
    };
  }

  if (EDITORIAL_SLUGS.has(slug)) {
    return {
      slug,
      route: `/articles/${slug}`,
      disposition: "ad-free-editorial",
      contentTier: "standard",
      reviewedAt,
      reason: "Reviewed editorial content intentionally kept ad-free.",
    };
  }

  return undefined;
};

export const getPublisherArticleReview = (pathname: string) => {
  const clean = pathname.split("?")[0].split("#")[0].replace(/\/+$/, "");
  if (!clean.startsWith("/articles/")) return undefined;
  return reviewForSlug(clean.slice("/articles/".length));
};

export const getAdEligiblePublisherRoutes = () =>
  Array.from(AD_ELIGIBLE_SLUGS, (slug) => `/articles/${slug}` as `/articles/${string}`);
