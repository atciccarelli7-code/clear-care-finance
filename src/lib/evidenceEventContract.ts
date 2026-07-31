export const EVIDENCE_EVENT_NAMES = [
  "insurance_hub_viewed",
  "insurance_hub_handoff_opened",
] as const;

export type EvidenceEventName = (typeof EVIDENCE_EVENT_NAMES)[number];
export const EVIDENCE_SURFACE = "insurance_hub" as const;
export const EVIDENCE_VARIANTS = ["baseline_v1", "release_verification"] as const;
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

export type InsuranceDestinationId = (typeof INSURANCE_DESTINATION_IDS)[number];

export type EvidenceEventPayload = {
  eventId: string;
  sessionId: string;
  eventName: EvidenceEventName;
  surface: typeof EVIDENCE_SURFACE;
  destinationId?: InsuranceDestinationId;
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
  if (surface !== EVIDENCE_SURFACE) return null;
  if (!EVIDENCE_VARIANTS.includes(variant as EvidenceVariant)) return null;

  const safeEventName = eventName as EvidenceEventName;
  const safeVariant = variant as EvidenceVariant;

  if (safeEventName === "insurance_hub_viewed") {
    if (destinationId !== undefined) return null;
    return {
      eventId,
      sessionId,
      eventName: safeEventName,
      surface,
      variant: safeVariant,
    };
  }

  if (!INSURANCE_DESTINATION_IDS.includes(destinationId as InsuranceDestinationId)) return null;
  return {
    eventId,
    sessionId,
    eventName: safeEventName,
    surface,
    destinationId: destinationId as InsuranceDestinationId,
    variant: safeVariant,
  };
};
