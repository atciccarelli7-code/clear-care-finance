import {
  PRECOMMERCE_OBSERVED_VARIANT,
  PRECOMMERCE_VERIFICATION_VARIANT,
  type PreCommerceVariant,
} from "./preCommerceOfferContract.js";

export const INSURANCE_EVENT_NAMES = [
  "insurance_hub_viewed",
  "insurance_hub_handoff_opened",
] as const;

export const NAVIGATION_EVENT_NAMES = [
  "service_navigation_opened",
  "service_navigation_destination_selected",
] as const;

export const PRECOMMERCE_EVENT_NAMES = [
  "precommerce_offer_viewed",
  "precommerce_offer_engaged",
  "precommerce_commitment_started",
] as const;

export const EVIDENCE_EVENT_NAMES = [
  ...INSURANCE_EVENT_NAMES,
  ...NAVIGATION_EVENT_NAMES,
  ...PRECOMMERCE_EVENT_NAMES,
] as const;

export type EvidenceEventName = (typeof EVIDENCE_EVENT_NAMES)[number];

export const EVIDENCE_SURFACE = "insurance_hub" as const;
export const PRECOMMERCE_SURFACE = "benefits_decision_result" as const;
export const NAVIGATION_SURFACES = ["desktop_header", "mobile_header"] as const;
export type NavigationSurface = (typeof NAVIGATION_SURFACES)[number];
export type EvidenceSurface = typeof EVIDENCE_SURFACE | typeof PRECOMMERCE_SURFACE | NavigationSurface;

export const SERVICE_NAVIGATION_VARIANT = "service_navigation_v1" as const;
export const PRECOMMERCE_VARIANTS = [
  PRECOMMERCE_OBSERVED_VARIANT,
  PRECOMMERCE_VERIFICATION_VARIANT,
] as const;
export const EVIDENCE_VARIANTS = [
  "baseline_v1",
  "release_verification",
  SERVICE_NAVIGATION_VARIANT,
  ...PRECOMMERCE_VARIANTS,
] as const;
export type EvidenceVariant = (typeof EVIDENCE_VARIANTS)[number];

export const INSURANCE_DESTINATION_IDS = [
  "discharge_coverage",
  "discharge_printable",
  "prior_authorization",
  "plan_types",
  "sbc_guide",
  "commercial_comparison",
  "eob_guide",
  "cost_sharing_basics",
  "facility_fees",
  "medical_bill_review",
  "eob_bill_match",
  "out_of_pocket_max",
  "open_enrollment",
  "medicare_hub",
  "prescription_checklist",
  "spouse_coverage",
  "supplemental_policies",
  "hsa_fsa",
  "paycheck_impact",
] as const;

export const NAVIGATION_DESTINATION_IDS = [
  "decision_concierge",
  "start_here",
  "all_tools",
  "articles",
  "benefits_command_center",
  "benefits_change_detector",
  "total_compensation",
  "paycheck_403b",
  "career_decision_center",
  "hospital_patient_guide",
  "medical_bill_review",
  "eob_bill_match",
  "prior_authorization",
  "benefits_insurance",
  "medicare_medicaid",
  "open_enrollment",
  "quick_guides",
  "topic_guides",
] as const;

export const PRECOMMERCE_DESTINATION_IDS = [
  "offer_details",
  "commitment_form",
] as const;

export type InsuranceDestinationId = (typeof INSURANCE_DESTINATION_IDS)[number];
export type NavigationDestinationId = (typeof NAVIGATION_DESTINATION_IDS)[number];
export type PreCommerceDestinationId = (typeof PRECOMMERCE_DESTINATION_IDS)[number];
export type EvidenceDestinationId = InsuranceDestinationId | NavigationDestinationId | PreCommerceDestinationId;

export type EvidenceEventPayload = {
  eventId: string;
  sessionId: string;
  eventName: EvidenceEventName;
  surface: EvidenceSurface;
  destinationId?: EvidenceDestinationId;
  variant: EvidenceVariant;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const DESTINATION_BY_TARGET: Record<string, InsuranceDestinationId> = {
  discharge: "discharge_coverage",
  plan_types: "plan_types",
  commercial_comparison: "commercial_comparison",
  "/insurance/hospital-discharge-coverage": "discharge_coverage",
  "/insurance/hospital-discharge-coverage#coverage-checklist": "discharge_coverage",
  "/insurance/hospital-discharge-coverage#why-denied": "discharge_coverage",
  "/insurance/hospital-discharge-coverage/printable": "discharge_printable",
  "/tools/prior-authorization-next-step-guide": "prior_authorization",
  "/insurance/health-insurance-plan-types": "plan_types",
  "/insurance/how-to-read-an-sbc": "sbc_guide",
  "/insurance/commercial-insurance-comparison": "commercial_comparison",
  "/insurance/commercial-insurance-comparison#comparison-tool": "commercial_comparison",
  "/articles/how-to-read-an-eob": "eob_guide",
  "/articles/deductible-copay-coinsurance-out-of-pocket-max": "cost_sharing_basics",
  "/articles/facility-fee-vs-professional-fee": "facility_fees",
  "/insurance/medical-bill-review-toolkit": "medical_bill_review",
  "/tools#eob-bill-match": "eob_bill_match",
  "/tools/out-of-pocket-max-estimator": "out_of_pocket_max",
  "/open-enrollment": "open_enrollment",
  "/tools#open-enrollment": "open_enrollment",
  "/medicare-care-costs": "medicare_hub",
  "/medicare-care-costs#cost-estimator": "medicare_hub",
  "/articles/prescription-coverage-open-enrollment-checklist": "prescription_checklist",
  "/articles/spouse-family-health-insurance-open-enrollment": "spouse_coverage",
  "/articles/accident-critical-illness-hospital-indemnity-open-enrollment": "supplemental_policies",
  "/tools#hsa-fsa": "hsa_fsa",
  "/tools#paycheck-impact": "paycheck_impact",
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

export const resolveInsuranceDestinationId = (value: unknown): InsuranceDestinationId | null => {
  if (typeof value !== "string" || value.length > 160 || value.includes("?")) return null;
  const direct = DESTINATION_BY_TARGET[value];
  if (direct) return direct;

  try {
    const parsed = new URL(value, "https://communityacquiredfinance.com");
    if (parsed.origin !== "https://communityacquiredfinance.com") return null;
    return DESTINATION_BY_TARGET[`${parsed.pathname}${parsed.hash}`] ?? DESTINATION_BY_TARGET[parsed.pathname] ?? null;
  } catch {
    return null;
  }
};

export const isNavigationDestinationId = (value: unknown): value is NavigationDestinationId =>
  NAVIGATION_DESTINATION_IDS.includes(value as NavigationDestinationId);

export const parseEvidenceEventPayload = (value: unknown): EvidenceEventPayload | null => {
  if (!isRecord(value)) return null;
  const keys = Object.keys(value);
  const allowedKeys = new Set(["eventId", "sessionId", "eventName", "surface", "destinationId", "variant"]);
  if (keys.some((key) => !allowedKeys.has(key))) return null;

  const eventId = typeof value.eventId === "string" ? value.eventId : "";
  const sessionId = typeof value.sessionId === "string" ? value.sessionId : "";
  const eventName = value.eventName;
  const surface = value.surface;
  const variant = value.variant;
  const destinationId = value.destinationId;

  if (!UUID_PATTERN.test(eventId) || !UUID_PATTERN.test(sessionId)) return null;
  if (!EVIDENCE_EVENT_NAMES.includes(eventName as EvidenceEventName)) return null;
  if (!EVIDENCE_VARIANTS.includes(variant as EvidenceVariant)) return null;

  const safeEventName = eventName as EvidenceEventName;
  const safeVariant = variant as EvidenceVariant;

  if (safeEventName === "insurance_hub_viewed") {
    if (surface !== EVIDENCE_SURFACE || destinationId !== undefined || safeVariant === SERVICE_NAVIGATION_VARIANT || PRECOMMERCE_VARIANTS.includes(safeVariant as PreCommerceVariant)) return null;
    return {
      eventId,
      sessionId,
      eventName: safeEventName,
      surface,
      variant: safeVariant,
    };
  }

  if (safeEventName === "insurance_hub_handoff_opened") {
    if (surface !== EVIDENCE_SURFACE || safeVariant === SERVICE_NAVIGATION_VARIANT || PRECOMMERCE_VARIANTS.includes(safeVariant as PreCommerceVariant)) return null;
    if (!INSURANCE_DESTINATION_IDS.includes(destinationId as InsuranceDestinationId)) return null;
    return {
      eventId,
      sessionId,
      eventName: safeEventName,
      surface,
      destinationId: destinationId as InsuranceDestinationId,
      variant: safeVariant,
    };
  }

  if (safeEventName === "precommerce_offer_viewed") {
    if (surface !== PRECOMMERCE_SURFACE || !PRECOMMERCE_VARIANTS.includes(safeVariant as PreCommerceVariant) || destinationId !== undefined) return null;
    return {
      eventId,
      sessionId,
      eventName: safeEventName,
      surface,
      variant: safeVariant,
    };
  }

  if (safeEventName === "precommerce_offer_engaged") {
    if (
      surface !== PRECOMMERCE_SURFACE
      || !PRECOMMERCE_VARIANTS.includes(safeVariant as PreCommerceVariant)
      || destinationId !== "offer_details"
    ) return null;
    return {
      eventId,
      sessionId,
      eventName: safeEventName,
      surface,
      destinationId,
      variant: safeVariant,
    };
  }

  if (safeEventName === "precommerce_commitment_started") {
    if (
      surface !== PRECOMMERCE_SURFACE
      || !PRECOMMERCE_VARIANTS.includes(safeVariant as PreCommerceVariant)
      || destinationId !== "commitment_form"
    ) return null;
    return {
      eventId,
      sessionId,
      eventName: safeEventName,
      surface,
      destinationId,
      variant: safeVariant,
    };
  }

  if (!NAVIGATION_SURFACES.includes(surface as NavigationSurface) || safeVariant !== SERVICE_NAVIGATION_VARIANT) return null;
  const safeSurface = surface as NavigationSurface;

  if (safeEventName === "service_navigation_opened") {
    if (destinationId !== undefined) return null;
    return {
      eventId,
      sessionId,
      eventName: safeEventName,
      surface: safeSurface,
      variant: safeVariant,
    };
  }

  if (!isNavigationDestinationId(destinationId)) return null;
  return {
    eventId,
    sessionId,
    eventName: safeEventName,
    surface: safeSurface,
    destinationId,
    variant: safeVariant,
  };
};
