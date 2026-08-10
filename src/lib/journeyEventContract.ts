export const JOURNEY_EVENT_NAMES = [
  "journey_viewed",
  "journey_started",
  "journey_step_completed",
  "journey_back_selected",
  "journey_exited_unexpectedly",
  "journey_result_reached",
  "journey_result_copied",
  "journey_result_printed",
  "journey_resume_clicked",
  "journey_restarted",
  "journey_handoff_opened",
] as const;

export const JOURNEY_SURFACES = [
  "home",
  "tools",
  "start_here",
  "destination",
  "hospital_guide",
  "benefits",
  "medicare",
  "medical_bill",
] as const;

export const JOURNEY_PHASES = [
  "name_question",
  "narrow_answer",
  "build_action_plan",
  "verify_officially",
  "result",
  "handoff",
] as const;

export const FIRST_PARTY_JOURNEY_KEYS = [
  "decision_concierge",
  "healthcare_offer_verification",
  "roth_traditional",
  "debt_retirement",
  "observation_status",
  "medicare_plan_verification",
  "paycheck_403b",
  "total_compensation_comparison",
  "benefits_decision_system",
  "hospital_financial_assistance",
  "medicare_coverage_decision",
] as const;

export const FIRST_PARTY_JOURNEY_VARIANTS = ["flagship_funnel_v1"] as const;

export type JourneyEventName = (typeof JOURNEY_EVENT_NAMES)[number];
export type JourneySurface = (typeof JOURNEY_SURFACES)[number];
export type JourneyPhase = (typeof JOURNEY_PHASES)[number];
export type FirstPartyJourneyKey = (typeof FIRST_PARTY_JOURNEY_KEYS)[number];
export type FirstPartyJourneyVariant = (typeof FIRST_PARTY_JOURNEY_VARIANTS)[number];

export type JourneyEventProperties = {
  journey_key: string;
  surface: JourneySurface;
  phase?: JourneyPhase;
  step_index?: number;
  variant?: string;
  session_journey_id?: string;
};

export type SanitizedJourneyEvent = {
  name: JourneyEventName;
  properties: JourneyEventProperties;
};

export type JourneyEvidencePayload = {
  eventId: string;
  eventName: JourneyEventName;
  journeyKey: string;
  surface: JourneySurface;
  phase?: JourneyPhase;
  stepIndex?: number;
  variant?: string;
  sessionJourneyId: string;
};

const FIXED_VALUE_PATTERN = /^[a-z0-9][a-z0-9_-]{0,63}$/;
const SESSION_ID_PATTERN = /^[a-z0-9-]{8,64}$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ALLOWED_KEYS = new Set<keyof JourneyEventProperties>([
  "journey_key",
  "surface",
  "phase",
  "step_index",
  "variant",
  "session_journey_id",
]);
const SURFACES = new Set<JourneySurface>(JOURNEY_SURFACES);
const PHASES = new Set<JourneyPhase>(JOURNEY_PHASES);
const FIRST_PARTY_KEYS = new Set<string>(FIRST_PARTY_JOURNEY_KEYS);
const FIRST_PARTY_VARIANTS = new Set<string>(FIRST_PARTY_JOURNEY_VARIANTS);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

export const isJourneySessionId = (value: unknown): value is string =>
  typeof value === "string" && SESSION_ID_PATTERN.test(value);

export const isFirstPartyJourneyKey = (value: unknown): value is FirstPartyJourneyKey =>
  typeof value === "string" && FIRST_PARTY_KEYS.has(value);

export const isFirstPartyJourneyVariant = (value: unknown): value is FirstPartyJourneyVariant =>
  typeof value === "string" && FIRST_PARTY_VARIANTS.has(value);

export const isJourneyEvidenceSessionId = (value: unknown): value is string =>
  typeof value === "string" && UUID_PATTERN.test(value);

export const sanitizeJourneyEvent = (
  name: string,
  properties: Record<string, unknown> = {},
): SanitizedJourneyEvent | null => {
  if (!JOURNEY_EVENT_NAMES.includes(name as JourneyEventName)) return null;
  if (Object.keys(properties).some((key) => !ALLOWED_KEYS.has(key as keyof JourneyEventProperties))) return null;

  const journeyKey = properties.journey_key;
  const surface = properties.surface;
  if (typeof journeyKey !== "string" || !FIXED_VALUE_PATTERN.test(journeyKey)) return null;
  if (typeof surface !== "string" || !SURFACES.has(surface as JourneySurface)) return null;

  const cleaned: JourneyEventProperties = {
    journey_key: journeyKey,
    surface: surface as JourneySurface,
  };

  if (properties.phase !== undefined) {
    if (typeof properties.phase !== "string" || !PHASES.has(properties.phase as JourneyPhase)) return null;
    cleaned.phase = properties.phase as JourneyPhase;
  }

  if (properties.step_index !== undefined) {
    if (!Number.isInteger(properties.step_index) || Number(properties.step_index) < 0 || Number(properties.step_index) > 20) return null;
    cleaned.step_index = Number(properties.step_index);
  }

  if (properties.variant !== undefined) {
    if (typeof properties.variant !== "string" || !FIXED_VALUE_PATTERN.test(properties.variant)) return null;
    cleaned.variant = properties.variant;
  }

  if (properties.session_journey_id !== undefined) {
    if (!isJourneySessionId(properties.session_journey_id)) return null;
    cleaned.session_journey_id = properties.session_journey_id;
  }

  return { name: name as JourneyEventName, properties: cleaned };
};

export const parseJourneyEvidencePayload = (value: unknown): JourneyEvidencePayload | null => {
  if (!isRecord(value)) return null;
  const allowedKeys = new Set([
    "eventId",
    "eventName",
    "journeyKey",
    "surface",
    "phase",
    "stepIndex",
    "variant",
    "sessionJourneyId",
  ]);
  if (Object.keys(value).some((key) => !allowedKeys.has(key))) return null;
  if (typeof value.eventId !== "string" || !UUID_PATTERN.test(value.eventId)) return null;
  if (!isJourneyEvidenceSessionId(value.sessionJourneyId)) return null;
  if (!isFirstPartyJourneyKey(value.journeyKey)) return null;
  if (value.variant !== undefined && !isFirstPartyJourneyVariant(value.variant)) return null;

  const event = sanitizeJourneyEvent(String(value.eventName ?? ""), {
    journey_key: value.journeyKey,
    surface: value.surface,
    ...(value.phase === undefined ? {} : { phase: value.phase }),
    ...(value.stepIndex === undefined ? {} : { step_index: value.stepIndex }),
    ...(value.variant === undefined ? {} : { variant: value.variant }),
    session_journey_id: value.sessionJourneyId,
  });
  if (!event) return null;

  return {
    eventId: value.eventId,
    eventName: event.name,
    journeyKey: event.properties.journey_key,
    surface: event.properties.surface,
    ...(event.properties.phase ? { phase: event.properties.phase } : {}),
    ...(event.properties.step_index === undefined ? {} : { stepIndex: event.properties.step_index }),
    ...(event.properties.variant ? { variant: event.properties.variant } : {}),
    sessionJourneyId: value.sessionJourneyId,
  };
};
