import { describe, expect, it } from "vitest";
import {
  getReadinessJourneyId,
  sanitizeReadinessJourneyEvent,
} from "@/lib/decisionJourneyAnalytics";

describe("decision journey readiness analytics", () => {
  it("maps only the approved priority routes", () => {
    expect(getReadinessJourneyId("/tools/roth-vs-traditional-decision-helper")).toBe("roth_traditional");
    expect(getReadinessJourneyId("/tools/debt-vs-retirement-router")).toBe("debt_retirement");
    expect(getReadinessJourneyId("/tools/observation-vs-inpatient-status-guide")).toBe("observation_status");
    expect(getReadinessJourneyId("/tools/medicare-plan-verification-checklist")).toBeNull();
  });

  it("keeps only fixed journey and result-action values", () => {
    expect(sanitizeReadinessJourneyEvent("decision_journey_result_action", {
      journey_id: "roth_traditional",
      result_action: "copy",
      current_tax_rate: "high",
      employer_name: "Hospital",
      answers: "mostly pretax",
      reminder_date: "2027-01-01",
    })).toEqual({
      name: "decision_journey_result_action",
      properties: {
        journey_id: "roth_traditional",
        result_action: "copy",
      },
    });
  });

  it("rejects unknown journeys, actions, handoffs, and events", () => {
    expect(sanitizeReadinessJourneyEvent("decision_journey_completed", {
      journey_id: "medicare_plan_name",
    })).toBeNull();
    expect(sanitizeReadinessJourneyEvent("decision_journey_result_action", {
      journey_id: "debt_retirement",
      result_action: "email_result",
    })).toBeNull();
    expect(sanitizeReadinessJourneyEvent("decision_journey_handoff_opened", {
      journey_id: "observation_status",
      handoff_id: "/insurance/hospital-discharge-coverage?patient=1",
    })).toBeNull();
    expect(sanitizeReadinessJourneyEvent("decision_answer_saved", {
      journey_id: "roth_traditional",
    })).toBeNull();
  });

  it("allows only approved canonical handoff identifiers", () => {
    expect(sanitizeReadinessJourneyEvent("decision_journey_handoff_opened", {
      journey_id: "observation_status",
      handoff_id: "observation_discharge_center",
      diagnosis: "example",
      plan_name: "example",
    })).toEqual({
      name: "decision_journey_handoff_opened",
      properties: {
        journey_id: "observation_status",
        handoff_id: "observation_discharge_center",
      },
    });
  });
});
