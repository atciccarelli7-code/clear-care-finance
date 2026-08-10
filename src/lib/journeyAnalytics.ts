import { trackSiteEvent } from "@/lib/analytics";
import { recordJourneyEvidence } from "@/lib/firstPartyJourneyEvidence";
import {
  isJourneySessionId,
  sanitizeJourneyEvent,
  type JourneyEventName,
  type JourneyEventProperties,
} from "@/lib/journeyEventContract";

export {
  JOURNEY_EVENT_NAMES,
  JOURNEY_PHASES,
  JOURNEY_SURFACES,
  sanitizeJourneyEvent,
} from "@/lib/journeyEventContract";
export type {
  JourneyEventName,
  JourneyEventProperties,
  JourneyPhase,
  JourneySurface,
} from "@/lib/journeyEventContract";

const SESSION_KEY = "caf-journey-analytics-session-v1";
const createSessionJourneyId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID().toLowerCase();
  return `caf-${Math.random().toString(36).slice(2, 14)}`;
};

export const getSessionJourneyId = () => {
  if (typeof window === "undefined") return undefined;
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (isJourneySessionId(existing)) return existing;
    const created = createSessionJourneyId();
    if (!isJourneySessionId(created)) return undefined;
    window.sessionStorage.setItem(SESSION_KEY, created);
    return created;
  } catch {
    return undefined;
  }
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
  const tracked = trackSiteEvent(event.name, event.properties);
  if (!tracked) return false;
  recordJourneyEvidence(event);
  return true;
};
