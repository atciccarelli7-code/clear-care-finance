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

const REVIEWED_AT = "2026-07-31";
const STANDARD_NEXT_REVIEW = "2027-01-31";
const SENSITIVE_NEXT_REVIEW = "2026-10-31";

const eligible = (
  slug: string,
  contentTier: "flagship" | "substantial" = "substantial",
): PublisherArticleReview => ({
  slug,
  route: `/articles/${slug}`,
  disposition: "ad-eligible",
  contentTier,
  reviewedAt: REVIEWED_AT,
  nextReviewAt: STANDARD_NEXT_REVIEW,
  reviewScope:
    "Publisher-value review covering authoritative sources, original explanatory depth, practical decision support, distinct search intent, and suitability for light advertising outside sensitive or interactive contexts.",
  reason:
    "Affirmatively reviewed publisher article with authoritative sources, original explanatory depth, practical decision support, and no interactive or sensitive workflow context.",
});

const sensitive = (slug: string): PublisherArticleReview => ({
  slug,
  route: `/articles/${slug}`,
  disposition: "ad-free-sensitive",
  contentTier: "standard",
  reviewedAt: REVIEWED_AT,
  nextReviewAt: SENSITIVE_NEXT_REVIEW,
  reviewScope:
    "Publisher-suitability review covering patient sensitivity, Medicare or Medicaid context, medication and discharge safety, coverage denials, financial assistance, and risk of advertising near consequential healthcare decisions.",
  reason:
    "Affirmatively reviewed but kept ad-free because the article addresses a sensitive patient, medication, discharge, Medicare, Medicaid, denial, or financial-assistance decision.",
});

const editorial = (slug: string, reason: string): PublisherArticleReview => ({
  slug,
  route: `/articles/${slug}`,
  disposition: "ad-free-editorial",
  contentTier: "standard",
  reviewedAt: REVIEWED_AT,
  nextReviewAt: SENSITIVE_NEXT_REVIEW,
  reviewScope:
    "Publisher-suitability review covering standalone explanatory value, duplication, navigation dependence, freshness burden, and commercial-presentation risk.",
  reason,
});

export const PUBLISHER_ARTICLE_REVIEWS: PublisherArticleReview[] = [
  eligible("what-employer-benefit-changes-should-i-compare"),
  eligible("how-much-should-a-nurse-put-in-403b-per-paycheck"),
  eligible("how-hospital-403b-matching-works"),
  eligible("how-to-pick-retirement-investments-at-work"),
  eligible("healthcare-worker-money-map"),
  eligible("how-healthcare-workers-can-invest-without-picking-stocks"),
  eligible("savings-rate-that-actually-changes-your-life"),
  eligible("roth-vs-traditional-403b-healthcare-workers"),
  eligible("can-healthcare-workers-reach-financial-independence"),
  eligible("cash-vs-investing-when-you-feel-behind"),
  eligible("can-you-live-off-dividends-passive-income-guide"),
  eligible("money-stress-after-hard-shift"),
  eligible("earn-more-without-burning-out-bedside"),
  eligible("managing-money-has-never-been-easier-or-harder"),
  eligible("use-credit-cards-without-credit-card-debt"),
  eligible("open-enrollment-mistakes-healthcare-workers"),
  eligible("premium-deductible-out-of-pocket-open-enrollment"),
  eligible("spouse-family-health-insurance-open-enrollment"),
  eligible("prescription-coverage-open-enrollment-checklist"),
  eligible("network-checklist-open-enrollment"),
  eligible("disability-insurance-healthcare-workers-open-enrollment"),
  eligible("employer-life-insurance-open-enrollment"),
  eligible("accident-critical-illness-hospital-indemnity-open-enrollment"),
  eligible("dental-vision-insurance-open-enrollment"),
  eligible("health-fsa-vs-dependent-care-fsa"),
  eligible("open-enrollment-paycheck-impact"),
  eligible("beneficiaries-open-enrollment-checklist"),
  eligible("how-healthcare-workers-should-compare-job-offers"),
  eligible("why-one-hospital-visit-can-create-multiple-bills"),
  eligible("facility-fee-vs-professional-fee"),
  eligible("in-network-hospital-out-of-network-bills"),
  eligible("allowed-amount-medical-bills"),
  eligible("hsa-vs-fsa-healthcare-workers"),
  eligible("backup-care-plans-for-busy-healthcare-workers"),
  eligible("deductible-copay-coinsurance-out-of-pocket-max", "flagship"),
  eligible("how-to-read-an-eob", "flagship"),
  eligible("why-er-visit-is-expensive"),
  eligible("hospital-cafe-habit"),
  eligible("burnout-overspending-overeating"),
  sensitive("does-medicare-cover-long-term-care"),
  sensitive("does-medicare-cover-rehab-after-hospital-stay"),
  sensitive("medicare-vs-medicaid-what-is-the-difference"),
  sensitive("what-does-medicare-not-cover"),
  sensitive("why-do-i-still-owe-money-with-medicare"),
  sensitive("from-the-bedside-medicare-prescription-cost"),
  sensitive("from-the-bedside-long-term-care-medicaid-hospital-delay"),
  sensitive("why-am-i-getting-a-blood-thinner-in-the-hospital"),
  sensitive("why-did-the-hospital-stop-or-change-my-home-medications"),
  sensitive("safe-hospital-discharge-first-72-hours"),
  sensitive("blood-thinner-safety-before-going-home"),
  sensitive("copd-recovery-after-hospital"),
  sensitive("heart-failure-plan-after-discharge"),
  sensitive("new-home-oxygen-nebulizer-guide"),
  sensitive("observation-vs-inpatient-status"),
  sensitive("prior-authorization-explained"),
  sensitive("check-hospital-financial-assistance-before-paying"),
  sensitive("insurance-is-future-planning"),
  sensitive("medicare-advantage-vs-original-medicare-2026"),
  sensitive("medicare-medicaid-changes-january-2027"),
  sensitive("medicare-options-explained"),
  sensitive("discharge-coverage-guide"),
  sensitive("short-term-rehab-after-hospital"),
  sensitive("home-health-after-discharge"),
  sensitive("durable-medical-equipment-after-discharge"),
  sensitive("long-term-care-and-custodial-care"),
  sensitive("medicaid-dual-eligibility-ltss"),
  editorial(
    "diagnosis-explained",
    "Reviewed and kept ad-free because it explains the publication system rather than serving as a standalone decision-support article.",
  ),
  editorial(
    "obbb-overtime-tax-deduction-healthcare-workers",
    "Reviewed and kept ad-free pending a dedicated current-law tax review before any publisher monetization.",
  ),
  editorial(
    "workplace-benefits-definitions",
    "Reviewed and kept ad-free because the current page is definition-led reference content rather than sufficiently layered publisher inventory.",
  ),
  editorial(
    "plain-english-glossary",
    "Reviewed and kept ad-free because it duplicates glossary-style reference intent and is not standalone publisher inventory.",
  ),
  editorial(
    "healthcare-worker-discounts",
    "Reviewed and kept ad-free because the directory-like discount intent creates navigation and commercial-presentation risk.",
  ),
];

const REVIEW_BY_ROUTE = new Map(PUBLISHER_ARTICLE_REVIEWS.map((review) => [review.route, review]));
const REVIEW_BY_SLUG = new Map(PUBLISHER_ARTICLE_REVIEWS.map((review) => [review.slug, review]));

export const getPublisherArticleReview = (pathname: string) => REVIEW_BY_ROUTE.get(pathname);

export const getAdEligiblePublisherRoutes = () =>
  PUBLISHER_ARTICLE_REVIEWS.filter((review) => review.disposition === "ad-eligible").map((review) => review.route);

export const applyPublisherArticleReviewMetadata = (articles: Article[]): Article[] =>
  articles.map((article) => {
    const review = REVIEW_BY_SLUG.get(article.slug);
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
