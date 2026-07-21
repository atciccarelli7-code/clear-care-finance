import { describe, expect, it } from "vitest";
import { sanitizeJourneyEvent } from "@/lib/journeyAnalytics";

describe("shared journey analytics", () => {
  it("keeps only coarse fixed-choice properties", () => {
    expect(sanitizeJourneyEvent("journey_step_completed", {
      journey_key: "decision_concierge",
      surface: "home",
      phase: "narrow_answer",
      step_index: 2,
      variant: "medical_bill",
      session_journey_id: "caf-12345678",
    })).toEqual({
      name: "journey_step_completed",
      properties: {
        journey_key: "decision_concierge",
        surface: "home",
        phase: "narrow_answer",
        step_index: 2,
        variant: "medical_bill",
        session_journey_id: "caf-12345678",
      },
    });
  });

  it("rejects answer content and sensitive or unknown keys instead of silently forwarding them", () => {
    expect(sanitizeJourneyEvent("journey_result_reached", {
      journey_key: "medicare_plan_verification",
      surface: "medicare",
      phase: "result",
      answer: "selected plan name",
    })).toBeNull();
    expect(sanitizeJourneyEvent("journey_result_copied", {
      journey_key: "medical_bill",
      surface: "medical_bill",
      diagnosis: "example",
    })).toBeNull();
  });

  it("rejects malformed event names values and step indexes", () => {
    expect(sanitizeJourneyEvent("journey_answer_saved", {
      journey_key: "decision_concierge",
      surface: "home",
    })).toBeNull();
    expect(sanitizeJourneyEvent("journey_started", {
      journey_key: "contains free text",
      surface: "home",
    })).toBeNull();
    expect(sanitizeJourneyEvent("journey_step_completed", {
      journey_key: "decision_concierge",
      surface: "home",
      step_index: 200,
    })).toBeNull();
  });
});
