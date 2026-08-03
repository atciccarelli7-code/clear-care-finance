import { trackSiteEvent } from "@/lib/analytics";

export type CtaAudienceSegment = "healthcare_workers" | "patients_caregivers" | "everyone";

export type CtaDecisionCategory =
  | "career_compensation"
  | "workplace_benefits"
  | "open_enrollment"
  | "medical_bills"
  | "student_loans"
  | "medicare_caregiving"
  | "everyday_money"
  | "site_navigation";

export type CtaActionTier = "primary" | "secondary" | "related";

export type DirectionalCtaContext = {
  audienceSegment: CtaAudienceSegment;
  decisionCategory: CtaDecisionCategory;
  placementId: string;
  originPath?: string;
};

export type DirectionalCtaAction = {
  id: string;
  label: string;
  title: string;
  description?: string;
  eyebrow?: string;
  href: string;
  availabilityStatus: "available";
};

const audienceSegments = new Set<CtaAudienceSegment>(["healthcare_workers", "patients_caregivers", "everyone"]);
const decisionCategories = new Set<CtaDecisionCategory>([
  "career_compensation",
  "workplace_benefits",
  "open_enrollment",
  "medical_bills",
  "student_loans",
  "medicare_caregiving",
  "everyday_money",
  "site_navigation",
]);
const actionTiers = new Set<CtaActionTier>(["primary", "secondary", "related"]);
const FIXED_ID_PATTERN = /^[a-z0-9][a-z0-9_-]{2,95}$/;

const currentPath = () => (typeof window === "undefined" ? "unknown" : window.location.pathname);

const destinationPath = (href: string) => {
  if (href.startsWith("#")) return currentPath();
  try {
    const base = typeof window === "undefined" ? "https://communityacquiredfinance.com" : window.location.origin;
    return new URL(href, base).pathname;
  } catch {
    return href.split(/[?#]/, 1)[0];
  }
};

export const trackDirectionalCta = (
  action: DirectionalCtaAction,
  actionTier: CtaActionTier,
  context: DirectionalCtaContext,
) => {
  const origin = context.originPath ?? currentPath();
  if (
    action.availabilityStatus !== "available" ||
    !FIXED_ID_PATTERN.test(action.id) ||
    !FIXED_ID_PATTERN.test(context.placementId) ||
    !action.label.trim() ||
    !action.title.trim() ||
    !origin.startsWith("/") ||
    !(action.href.startsWith("/") || action.href.startsWith("#") || /^https:\/\//i.test(action.href)) ||
    !audienceSegments.has(context.audienceSegment) ||
    !decisionCategories.has(context.decisionCategory) ||
    !actionTiers.has(actionTier)
  ) return false;

  return trackSiteEvent("directional_cta_clicked", {
    event_category: "directional_navigation",
    cta_id: action.id,
    origin_path: origin,
    destination_path: destinationPath(action.href),
    audience_segment: context.audienceSegment,
    action_tier: actionTier,
    decision_category: context.decisionCategory,
    placement_id: context.placementId,
  });
};
