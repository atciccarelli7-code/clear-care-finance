import { trackSiteEvent } from "@/lib/analytics";

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

export type JourneyEventName = (typeof JOURNEY_EVENT_NAMES)[number];
export type JourneySurface = "home" | "tools" | "start_here" | "destination" | "hospital_guide" | "benefits" | "medicare" | "medical_bill";
export type JourneyPhase = "name_question" | "narrow_answer" | "build_action_plan" | "verify_officially" | "result" | "handoff";

export type JourneyEventProperties = {
  journey_key: string;
  surface: JourneySurface;
  phase?: JourneyPhase;
  step_index?: number;
  variant?: string;
  session_journey_id?: string;
};

const SESSION_KEY = "caf-journey-analytics-session-v1";
const FIXED_VALUE_PATTERN = /^[a-z0-9][a-z0-9_-]{0,63}$/;
const SESSION_ID_PATTERN = /^[a-z0-9-]{8,64}$/;
const ALLOWED_KEYS = new Set<keyof JourneyEventProperties>([
  "journey_key",
  "surface",
  "phase",
  "step_index",
  "variant",
  "session_journey_id",
]);
const SURFACES = new Set<JourneySurface>(["home", "tools", "start_here", "destination", "hospital_guide", "benefits", "medicare", "medical_bill"]);
const PHASES = new Set<JourneyPhase>(["name_question", "narrow_answer", "build_action_plan", "verify_officially", "result", "handoff"]);

const createSessionJourneyId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID().toLowerCase();
  return `caf-${Math.random().toString(36).slice(2, 14)}`;
};

export const getSessionJourneyId = () => {
  if (typeof window === "undefined") return undefined;
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing && SESSION_ID_PATTERN.test(existing)) return existing;
    const created = createSessionJourneyId();
    if (!SESSION_ID_PATTERN.test(created)) return undefined;
    window.sessionStorage.setItem(SESSION_KEY, created);
    return created;
  } catch {
    return undefined;
  }
};

export const sanitizeJourneyEvent = (name: string, properties: Record<string, unknown> = {}) => {
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
    if (typeof properties.session_journey_id !== "string" || !SESSION_ID_PATTERN.test(properties.session_journey_id)) return null;
    cleaned.session_journey_id = properties.session_journey_id;
  }

  return { name: name as JourneyEventName, properties: cleaned };
};

export const trackJourneyEvent = (
  name: JourneyEventName,
  properties: Omit<JourneyEventProperties, "session_journey_id">,
) => {
  const event = sanitizeJourneyEvent(name, {
    ...properties,
    session_journey_id: getSessionJourneyId(),
  });
  if (!event) return false;
  return trackSiteEvent(event.name, event.properties);
};
