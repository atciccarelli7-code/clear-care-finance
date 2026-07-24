export type ContentPageType =
  | "article"
  | "long-form-guide"
  | "topic-guide"
  | "hub"
  | "directory"
  | "calculator"
  | "guided-workflow"
  | "result-or-saved-work"
  | "printable"
  | "form"
  | "trust"
  | "legal"
  | "organization";

export type ContentTier =
  | "flagship"
  | "substantial"
  | "standard"
  | "utility"
  | "navigation"
  | "trust"
  | "draft";

export type ContentReviewStatus = "reviewed" | "needs-review" | "blocked";

export type ContentGovernance = {
  route: string;
  publicAvailable: boolean;
  pageType: ContentPageType;
  contentTier: ContentTier;
  indexable: boolean;
  adEligible: boolean;
  sensitiveContext: boolean;
  interactiveContext: boolean;
  reviewStatus: ContentReviewStatus;
  reason: string;
  lastContentReview?: string;
};

type ResolveContentGovernanceOptions = {
  knownRoute?: boolean;
};

const normalizePathname = (pathname: string) => {
  if (!pathname || pathname === "/") return "/";
  const clean = pathname.split("?")[0].split("#")[0].replace(/\/+$/, "");
  return clean || "/";
};

const AD_ELIGIBLE_ARTICLE_REVIEWS = new Map<string, { tier: "flagship" | "substantial"; reviewedAt: string }>([
  ["/articles/deductible-copay-coinsurance-out-of-pocket-max", { tier: "flagship", reviewedAt: "2026-07-13" }],
  ["/articles/how-to-read-an-eob", { tier: "flagship", reviewedAt: "2026-07-13" }],
  ["/articles/how-hospital-403b-matching-works", { tier: "substantial", reviewedAt: "2026-07-13" }],
  ["/articles/facility-fee-vs-professional-fee", { tier: "substantial", reviewedAt: "2026-07-13" }],
  ["/articles/backup-care-plans-for-busy-healthcare-workers", { tier: "substantial", reviewedAt: "2026-07-13" }],
  ["/articles/prescription-coverage-open-enrollment-checklist", { tier: "substantial", reviewedAt: "2026-07-13" }],
  ["/articles/prior-authorization-explained", { tier: "substantial", reviewedAt: "2026-07-13" }],
  ["/articles/spouse-family-health-insurance-open-enrollment", { tier: "substantial", reviewedAt: "2026-07-13" }],
  ["/articles/accident-critical-illness-hospital-indemnity-open-enrollment", { tier: "substantial", reviewedAt: "2026-07-13" }],
  ["/articles/medicare-options-explained", { tier: "flagship", reviewedAt: "2026-07-12" }],
]);

const TRUST_ROUTES = new Set(["/about", "/methodology", "/editorial-policy", "/disclosures", "/accessibility"]);
const LEGAL_ROUTES = new Set(["/privacy-policy", "/terms-of-use"]);
const FORM_ROUTES = new Set(["/newsletter", "/contact"]);
const ORGANIZATION_ROUTES = new Set([
  "/for-organizations",
  "/for-organizations/programs",
  "/for-organizations/implementation",
  "/for-organizations/measurement",
  "/for-organizations/trust-procurement",
  "/for-organizations/faq",
]);
const PRINTABLE_ROUTES = new Set(["/insurance/hospital-discharge-coverage/printable"]);
const RESULT_OR_SAVED_WORK_ROUTES = new Set(["/start-here/my-plan", "/my-plan", "/receipts"]);
const DIRECTORY_ROUTES = new Set(["/articles", "/topics", "/tools", "/guides", "/healthcare-workers/paycheck-tools"]);
const HUB_ROUTES = new Set([
  "/",
  "/start-here",
  "/healthcare-workers",
  "/build-wealth",
  "/patients-families",
  "/patients-families/hospital-guide",
  "/student-loans",
  "/open-enrollment",
  "/insurance",
  "/medicare-care-costs",
  "/glossary",
]);
const NON_TOOL_WORKFLOWS = new Set([
  "/healthcare-workers/career-decisions",
  "/medicare-care-costs/turning-65",
  "/insurance/medical-bill-review-toolkit",
]);
const PRIVATE_APPLICATION_ROUTES = new Set(["/account", "/sign-in", "/access-processing"]);

const SENSITIVE_WORKFLOW_TOKENS = [
  "eligibility",
  "medicaid",
  "medicare",
  "medical-bill",
  "hospital-bill",
  "prior-authorization",
  "financial-assistance",
  "disability",
  "discharge",
  "observation-vs-inpatient",
];

const isSensitiveWorkflowPath = (path: string) =>
  (path.startsWith("/tools/") || NON_TOOL_WORKFLOWS.has(path)) &&
  SENSITIVE_WORKFLOW_TOKENS.some((token) => path.includes(token));

const toolPageType = (path: string): ContentPageType =>
  /calculator|estimator/.test(path) ? "calculator" : "guided-workflow";

const blockedUnknown = (route: string): ContentGovernance => ({
  route,
  publicAvailable: false,
  pageType: "hub",
  contentTier: "draft",
  indexable: false,
  adEligible: false,
  sensitiveContext: false,
  interactiveContext: false,
  reviewStatus: "blocked",
  reason: "Unknown routes are not monetized or treated as indexable by content governance.",
});

export const getExplicitAdEligibleRoutes = () => Array.from(AD_ELIGIBLE_ARTICLE_REVIEWS.keys());

export const resolveContentGovernance = (
  pathname: string,
  options: ResolveContentGovernanceOptions = {},
): ContentGovernance => {
  const route = normalizePathname(pathname);
  const reviewedArticle = AD_ELIGIBLE_ARTICLE_REVIEWS.get(route);

  if (route === "/app" || route.startsWith("/app/") || PRIVATE_APPLICATION_ROUTES.has(route)) {
    return {
      route,
      publicAvailable: false,
      pageType: "result-or-saved-work",
      contentTier: "utility",
      indexable: false,
      adEligible: false,
      sensitiveContext: true,
      interactiveContext: true,
      reviewStatus: "blocked",
      reason: "Account, entitlement, workspace, and user-output routes are private, noindex, and permanently ad-free.",
    };
  }

  if (reviewedArticle) {
    return {
      route,
      publicAvailable: true,
      pageType: "article",
      contentTier: reviewedArticle.tier,
      indexable: true,
      adEligible: true,
      sensitiveContext: false,
      interactiveContext: false,
      reviewStatus: "reviewed",
      reason: "Explicitly reviewed, substantive publisher article with a distinct informational purpose.",
      lastContentReview: reviewedArticle.reviewedAt,
    };
  }

  if (TRUST_ROUTES.has(route)) {
    return {
      route,
      publicAvailable: true,
      pageType: "trust",
      contentTier: "trust",
      indexable: true,
      adEligible: false,
      sensitiveContext: false,
      interactiveContext: false,
      reviewStatus: "reviewed",
      reason: "Trust and methodology pages remain discoverable but permanently ad-free.",
    };
  }

  if (LEGAL_ROUTES.has(route)) {
    return {
      route,
      publicAvailable: true,
      pageType: "legal",
      contentTier: "trust",
      indexable: true,
      adEligible: false,
      sensitiveContext: false,
      interactiveContext: false,
      reviewStatus: "reviewed",
      reason: "Legal and privacy pages are compliance surfaces and remain permanently ad-free.",
    };
  }

  if (FORM_ROUTES.has(route)) {
    return {
      route,
      publicAvailable: true,
      pageType: "form",
      contentTier: "utility",
      indexable: true,
      adEligible: false,
      sensitiveContext: false,
      interactiveContext: true,
      reviewStatus: "blocked",
      reason: "Form-led pages are not advertising inventory.",
    };
  }

  if (ORGANIZATION_ROUTES.has(route)) {
    return {
      route,
      publicAvailable: true,
      pageType: "organization",
      contentTier: "standard",
      indexable: true,
      adEligible: false,
      sensitiveContext: false,
      interactiveContext: false,
      reviewStatus: "blocked",
      reason: "Organization and commercial-program surfaces remain separate from programmatic advertising.",
    };
  }

  if (PRINTABLE_ROUTES.has(route)) {
    return {
      route,
      publicAvailable: true,
      pageType: "printable",
      contentTier: "utility",
      indexable: true,
      adEligible: false,
      sensitiveContext: false,
      interactiveContext: false,
      reviewStatus: "blocked",
      reason: "Printable utility variants remain ad-free to avoid duplicate and action-oriented inventory.",
    };
  }

  if (RESULT_OR_SAVED_WORK_ROUTES.has(route)) {
    return {
      route,
      publicAvailable: true,
      pageType: "result-or-saved-work",
      contentTier: "utility",
      indexable: false,
      adEligible: false,
      sensitiveContext: true,
      interactiveContext: true,
      reviewStatus: "blocked",
      reason: "Results, saved work, receipts, and personal plans are never advertising inventory.",
    };
  }

  if (DIRECTORY_ROUTES.has(route)) {
    return {
      route,
      publicAvailable: true,
      pageType: "directory",
      contentTier: "navigation",
      indexable: true,
      adEligible: false,
      sensitiveContext: false,
      interactiveContext: true,
      reviewStatus: "blocked",
      reason: "Navigation-led directories remain useful and indexable but are not ad-eligible.",
    };
  }

  if (HUB_ROUTES.has(route)) {
    return {
      route,
      publicAvailable: true,
      pageType: "hub",
      contentTier: "navigation",
      indexable: true,
      adEligible: false,
      sensitiveContext: false,
      interactiveContext: false,
      reviewStatus: "needs-review",
      reason: "Broad audience and topic hubs are ad-free by default even when they remain indexable.",
    };
  }

  if (NON_TOOL_WORKFLOWS.has(route)) {
    return {
      route,
      publicAvailable: true,
      pageType: "guided-workflow",
      contentTier: "utility",
      indexable: true,
      adEligible: false,
      sensitiveContext: isSensitiveWorkflowPath(route),
      interactiveContext: true,
      reviewStatus: "blocked",
      reason: "Interactive decision workflows remain permanently ad-free.",
    };
  }

  if (route.startsWith("/tools/") && options.knownRoute) {
    return {
      route,
      publicAvailable: true,
      pageType: toolPageType(route),
      contentTier: "utility",
      indexable: true,
      adEligible: false,
      sensitiveContext: isSensitiveWorkflowPath(route),
      interactiveContext: true,
      reviewStatus: "blocked",
      reason: "Calculators and guided tools are useful search destinations but remain permanently ad-free.",
    };
  }

  if (route.startsWith("/topics/") && options.knownRoute) {
    return {
      route,
      publicAvailable: true,
      pageType: "topic-guide",
      contentTier: "navigation",
      indexable: true,
      adEligible: false,
      sensitiveContext: false,
      interactiveContext: false,
      reviewStatus: "needs-review",
      reason: "Topic guides remain indexable but require individual editorial review before monetization.",
    };
  }

  if (route.startsWith("/articles/") && options.knownRoute) {
    return {
      route,
      publicAvailable: true,
      pageType: "article",
      contentTier: "standard",
      indexable: true,
      adEligible: false,
      sensitiveContext: false,
      interactiveContext: false,
      reviewStatus: "needs-review",
      reason: "Published article remains indexable but is ad-free until affirmatively reviewed for publisher value.",
    };
  }

  if ((route.startsWith("/guides/") || route.startsWith("/insurance/")) && options.knownRoute) {
    return {
      route,
      publicAvailable: true,
      pageType: "long-form-guide",
      contentTier: "standard",
      indexable: true,
      adEligible: false,
      sensitiveContext: false,
      interactiveContext: false,
      reviewStatus: "needs-review",
      reason: "Standalone guide remains indexable and ad-free until an affirmative content review is recorded.",
    };
  }

  if (options.knownRoute) {
    return {
      route,
      publicAvailable: true,
      pageType: "hub",
      contentTier: "standard",
      indexable: true,
      adEligible: false,
      sensitiveContext: false,
      interactiveContext: false,
      reviewStatus: "needs-review",
      reason: "Known public route remains ad-free unless an explicit review grants eligibility.",
    };
  }

  return blockedUnknown(route);
};

export const isRouteAdEligible = (pathname: string) => resolveContentGovernance(pathname).adEligible;
