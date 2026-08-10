import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { recordJourneyEvidence } from "@/lib/firstPartyJourneyEvidence";
import { sanitizeJourneyEvent } from "@/lib/journeyEventContract";
import { PRIVACY_CONSENT_KEY } from "@/lib/privacyConsent";

const fetchMock = vi.fn().mockResolvedValue({ ok: true });

const event = sanitizeJourneyEvent("journey_result_reached", {
  journey_key: "hospital_financial_assistance",
  surface: "medical_bill",
  phase: "result",
  step_index: 8,
  variant: "flagship_funnel_v1",
  session_journey_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
});

beforeEach(() => {
  window.localStorage.clear();
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockClear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("first-party journey evidence client", () => {
  it("does not send without analytics consent", () => {
    expect(event).not.toBeNull();
    expect(recordJourneyEvidence(event!)).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts only the fixed journey contract after analytics consent", () => {
    window.localStorage.setItem(PRIVACY_CONSENT_KEY, "analytics");
    expect(recordJourneyEvidence(event!)).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const request = fetchMock.mock.calls[0][1] as RequestInit;
    const payload = JSON.parse(String(request.body));
    expect(payload).toMatchObject({
      eventName: "journey_result_reached",
      journeyKey: "hospital_financial_assistance",
      surface: "medical_bill",
      phase: "result",
      stepIndex: 8,
      variant: "flagship_funnel_v1",
      sessionJourneyId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    });
    expect(Object.keys(payload).sort()).toEqual([
      "eventId",
      "eventName",
      "journeyKey",
      "phase",
      "sessionJourneyId",
      "stepIndex",
      "surface",
      "variant",
    ]);
    expect(JSON.stringify(payload)).not.toMatch(/"(answer|amount|email|query|url)"/i);
  });

  it("drops non-evidence variants and rejects journey keys outside the server allowlist", () => {
    window.localStorage.setItem(PRIVACY_CONSENT_KEY, "analytics");
    const conciergeEvent = sanitizeJourneyEvent("journey_started", {
      journey_key: "decision_concierge",
      surface: "start_here",
      phase: "name_question",
      variant: "medical_bill",
      session_journey_id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    });
    const unknownJourney = sanitizeJourneyEvent("journey_started", {
      journey_key: "unknown_but_fixed",
      surface: "tools",
      phase: "name_question",
      session_journey_id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });

    expect(recordJourneyEvidence(conciergeEvent!)).toBe(true);
    expect(JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body))).not.toHaveProperty("variant");
    expect(recordJourneyEvidence(unknownJourney!)).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
