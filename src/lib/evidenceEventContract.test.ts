import { describe, expect, it } from "vitest";
import {
  parseEvidenceEventPayload,
  resolveInsuranceDestinationId,
} from "@/lib/evidenceEventContract";

const EVENT_ID = "3d594650-3436-4bd6-9a58-e773b7a4ea55";
const SESSION_ID = "956397df-65eb-43b4-9ef6-4aa42f83236c";

describe("first-party evidence contract", () => {
  it("accepts the fixed insurance hub view event without arbitrary dimensions", () => {
    expect(parseEvidenceEventPayload({
      eventId: EVENT_ID,
      sessionId: SESSION_ID,
      eventName: "insurance_hub_viewed",
      surface: "insurance_hub",
      variant: "baseline_v1",
    })).toEqual({
      eventId: EVENT_ID,
      sessionId: SESSION_ID,
      eventName: "insurance_hub_viewed",
      surface: "insurance_hub",
      variant: "baseline_v1",
    });
  });

  it("requires an allowlisted destination for handoff events", () => {
    expect(parseEvidenceEventPayload({
      eventId: EVENT_ID,
      sessionId: SESSION_ID,
      eventName: "insurance_hub_handoff_opened",
      surface: "insurance_hub",
      destinationId: "commercial_comparison",
      variant: "baseline_v1",
    })?.destinationId).toBe("commercial_comparison");

    expect(parseEvidenceEventPayload({
      eventId: EVENT_ID,
      sessionId: SESSION_ID,
      eventName: "insurance_hub_handoff_opened",
      surface: "insurance_hub",
      destinationId: "custom_user_value",
      variant: "baseline_v1",
    })).toBeNull();
  });

  it("rejects unknown properties and sensitive-looking payload expansion", () => {
    expect(parseEvidenceEventPayload({
      eventId: EVENT_ID,
      sessionId: SESSION_ID,
      eventName: "insurance_hub_viewed",
      surface: "insurance_hub",
      variant: "baseline_v1",
      email: "reader@example.com",
    })).toBeNull();
  });

  it("maps only known same-site destinations and rejects query strings", () => {
    expect(resolveInsuranceDestinationId("/insurance/commercial-insurance-comparison#comparison-tool"))
      .toBe("commercial_comparison");
    expect(resolveInsuranceDestinationId("plan_types")).toBe("plan_types");
    expect(resolveInsuranceDestinationId("/tools/out-of-pocket-max-estimator?amount=5000"))
      .toBeNull();
    expect(resolveInsuranceDestinationId("https://example.com/insurance"))
      .toBeNull();
  });
});
