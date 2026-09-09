import type { Article } from "./articles";

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

const DEFAULT_REVIEWED_AT = "2026-07-31";
const DEFAULT_ELIGIBLE_NEXT_REVIEW = "2027-01-31";
const DEFAULT_SENSITIVE_NEXT_REVIEW = "2026-10-31";

const AD_ELIGIBLE_SLUGS = new Set([
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

const EDITORIAL_REASONS: Record<string, string> = {
  "diagnosis-explained": "Reviewed and kept ad-free because it explains the publication system rather than serving as a standalone decision-support article.",
  "obbb-overtime-tax-deduction-healthcare-workers": "Reviewed and kept ad-free pending a dedicated current-law tax review before any publisher monetization.",
  "workplace-benefits-definitions": "Reviewed and kept ad-free because the current page is definition-led reference content rather than sufficiently layered publisher inventory.",
  "plain-english-glossary": "Reviewed and kept ad-free because it duplicates glossary-style reference intent and is not standalone publisher inventory.",
  "healthcare-worker-discounts": "Reviewed and kept ad-free because the directory-like discount intent creates navigation and commercial-presentation risk.",
};

const FLAGSHIP_ELIGIBLE_SLUGS = new Set([
  "why-hospitals-become-the-systems-shock-absorber",
  "20-dollar-tylenol-hospital-prices",
  "deductible-copay-coinsurance-out-of-pocket-max",
  "how-to-read-an-eob",
]);

const REVIEW_TIMING: Record<string, { reviewedAt: string; nextReviewAt: string }> = {
  "patient-in-the-bed-and-patient-in-the-chart": { reviewedAt: "2026-09-08", nextReviewAt: "2027-03-08" },
  "what-happens-while-hospital-is-waiting-on-insurance": { reviewedAt: "2026-09-08", nextReviewAt: "2027-01-15" },
  "medically-ready-is-not-the-same-as-ready-for-home": { reviewedAt: "2026-09-08", nextReviewAt: "2027-03-08" },
  "why-hospitals-become-the-systems-shock-absorber": { reviewedAt: "2026-08-30", nextReviewAt: "2027-02-28" },
  "home-with-family-is-not-a-free-care-plan": { reviewedAt: "2026-08-30", nextReviewAt: "2026-11-30" },
  "20-dollar-tylenol-hospital-prices": { reviewedAt: "2026-08-29", nextReviewAt: "2027-02-28" },
  "what-nonprofit-hospital-actually-means": { reviewedAt: "2026-08-29", nextReviewAt: "2027-02-28" },
  "why-hospitals-care-about-length-of-stay": { reviewedAt: "2026-08-29", nextReviewAt: "2027-02-28" },
  "why-just-send-them-to-rehab-is-not-simple": { reviewedAt: "2026-08-29", nextReviewAt: "2026-11-30" },
  "observation-vs-inpatient-status": { reviewedAt: "2026-08-30", nextReviewAt: "2026-11-30" },
};

const ELIGIBLE_REVIEW_SCOPE =
  "Publisher-value review covering authoritative sources, original explanatory depth, practical decision support, distinct search intent, and suitability for light advertising outside sensitive or interactive contexts.";
const ELIGIBLE_REASON =
  "Affirmatively reviewed publisher article with authoritative sources, original explanatory depth, practical decision support, and no interactive or sensitive workflow context.";
const SENSITIVE_REVIEW_SCOPE =
  "Publisher-suitability review covering patient sensitivity, Medicare or Medicaid context, medication and discharge safety, coverage denials, financial assistance, and risk of advertising near consequential healthcare decisions.";
const SENSITIVE_REASON =
  "Affirmatively reviewed but kept ad-free because the article addresses a sensitive patient, medication, discharge, Medicare, Medicaid, denial, or financial-assistance decision.";
const EDITORIAL_REVIEW_SCOPE =
  "Publisher-suitability review covering standalone explanatory value, duplication, navigation dependence, freshness burden, and commercial-presentation risk.";

const reviewForSlug = (slug: string): PublisherArticleReview | undefined => {
  const timing = REVIEW_TIMING[slug];

  if (AD_ELIGIBLE_SLUGS.has(slug)) {
    return {
      slug,
      route: `/articles/${slug}`,
      disposition: "ad-eligible",
      contentTier: FLAGSHIP_ELIGIBLE_SLUGS.has(slug) ? "flagship" : "substantial",
      reviewedAt: timing?.reviewedAt ?? DEFAULT_REVIEWED_AT,
      nextReviewAt: timing?.nextReviewAt ?? DEFAULT_ELIGIBLE_NEXT_REVIEW,
      reviewScope: ELIGIBLE_REVIEW_SCOPE,
      reason: ELIGIBLE_REASON,
    };
  }

  if (SENSITIVE_SLUGS.has(slug)) {
    return {
      slug,
      route: `/articles/${slug}`,
      disposition: "ad-free-sensitive",
      contentTier: "standard",
      reviewedAt: timing?.reviewedAt ?? DEFAULT_REVIEWED_AT,
      nextReviewAt: timing?.nextReviewAt ?? DEFAULT_SENSITIVE_NEXT_REVIEW,
      reviewScope: SENSITIVE_REVIEW_SCOPE,
      reason: SENSITIVE_REASON,
    };
  }

  const editorialReason = EDITORIAL_REASONS[slug];
  if (editorialReason) {
    return {
      slug,
      route: `/articles/${slug}`,
      disposition: "ad-free-editorial",
      contentTier: "standard",
      reviewedAt: DEFAULT_REVIEWED_AT,
      nextReviewAt: DEFAULT_SENSITIVE_NEXT_REVIEW,
      reviewScope: EDITORIAL_REVIEW_SCOPE,
      reason: editorialReason,
    };
  }

  return undefined;
};

const ALL_REVIEWED_SLUGS = [
  ...AD_ELIGIBLE_SLUGS,
  ...SENSITIVE_SLUGS,
  ...Object.keys(EDITORIAL_REASONS),
];

export const PUBLISHER_ARTICLE_REVIEWS = ALL_REVIEWED_SLUGS
  .map((slug) => reviewForSlug(slug))
  .filter((review): review is PublisherArticleReview => Boolean(review));

export const getPublisherArticleReview = (pathname: string) => {
  const clean = pathname.split("?")[0].split("#")[0].replace(/\/+$/, "");
  if (!clean.startsWith("/articles/")) return undefined;
  return reviewForSlug(clean.slice("/articles/".length));
};

export const getAdEligiblePublisherRoutes = () =>
  Array.from(AD_ELIGIBLE_SLUGS, (slug) => `/articles/${slug}` as `/articles/${string}`);

export const applyPublisherArticleReviewMetadata = (articles: Article[]): Article[] =>
  articles.map((article) => {
    const review = reviewForSlug(article.slug);
    if (!review || review.disposition !== "ad-eligible") return article;

    const nextReviewAt =
      article.nextReviewAt && article.nextReviewAt < review.nextReviewAt
        ? article.nextReviewAt
        : review.nextReviewAt;

    return {
      ...article,
      lastReviewedAt: article.lastReviewedAt ?? review.reviewedAt,
      nextReviewAt,
      reviewScope: article.reviewScope ?? review.reviewScope,
    };
  });
