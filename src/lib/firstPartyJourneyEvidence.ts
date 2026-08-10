import {
  isFirstPartyJourneyKey,
  isFirstPartyJourneyVariant,
  isJourneyEvidenceSessionId,
  type SanitizedJourneyEvent,
} from "@/lib/journeyEventContract";
import { readPrivacyConsent } from "@/lib/privacyConsent";

const newUuid = () => {
  try {
    return window.crypto.randomUUID();
  } catch {
    return null;
  }
};

export const recordJourneyEvidence = (event: SanitizedJourneyEvent) => {
  if (typeof window === "undefined" || readPrivacyConsent() !== "analytics") return false;
  const eventId = newUuid();
  const sessionJourneyId = event.properties.session_journey_id;
  if (!eventId || !isJourneyEvidenceSessionId(sessionJourneyId)) return false;
  if (!isFirstPartyJourneyKey(event.properties.journey_key)) return false;

  const payload = {
    eventId,
    eventName: event.name,
    journeyKey: event.properties.journey_key,
    surface: event.properties.surface,
    ...(event.properties.phase ? { phase: event.properties.phase } : {}),
    ...(event.properties.step_index === undefined ? {} : { stepIndex: event.properties.step_index }),
    ...(isFirstPartyJourneyVariant(event.properties.variant) ? { variant: event.properties.variant } : {}),
    sessionJourneyId,
  };

  try {
    void fetch("/api/journey-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "same-origin",
      keepalive: true,
    }).catch(() => undefined);
    return true;
  } catch {
    return false;
  }
};
