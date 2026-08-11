import { describe, expect, it } from "vitest";
import { parseEvidenceEventPayload, resolveInsuranceDestinationId } from "@/lib/evidenceEventContract";

const EVENT_ID = "3d594650-3436-4bd6-9a58-e773b7a4ea55";
const SESSION_ID = "956397df-65eb-43b4-9ef6-4aa42f83236c";

describe("first-party evidence contract", () => {
  it("accepts the fixed insurance and navigation contracts", () => {
    expect(parseEvidenceEventPayload({
      eventId: EVENT_ID,
      sessionId: SESSION_ID,
      eventName: "insurance_hub_viewed",
      surface: "insurance_hub",
      variant: "baseline_v1",
    })?.eventName).toBe("insurance_hub_viewed");
    expect(parseEvidenceEventPayload({
      eventId: EVENT_ID,
      sessionId: SESSION_ID,
      eventName: "service_navigation_destination_selected",
      surface: "mobile_header",
      destinationId: "benefits_command_center",
      variant: "service_navigation_v1",
    })?.destinationId).toBe("benefits_command_center");
  });

  it.each([
    ["precommerce_offer_viewed", undefined],
    ["precommerce_offer_engaged", "offer_details"],
    ["precommerce_commitment_started", "commitment_form"],
  ])("accepts the fixed observed %s event", (eventName, destinationId) => {
    expect(parseEvidenceEventPayload({
      eventId: EVENT_ID,
      sessionId: SESSION_ID,
      eventName,
      surface: "benefits_decision_result",
      ...(destinationId ? { destinationId } : {}),
      variant: "benefits_workspace_29_v2",
    })).toMatchObject({ eventName, surface: "benefits_decision_result", variant: "benefits_workspace_29_v2" });
  });

  it("accepts the isolated release-verification variant", () => {
    expect(parseEvidenceEventPayload({
      eventId: EVENT_ID,
      sessionId: SESSION_ID,
      eventName: "precommerce_offer_viewed",
      surface: "benefits_decision_result",
      variant: "benefits_workspace_29_v2_release_verification",
    })?.variant).toBe("benefits_workspace_29_v2_release_verification");
  });

  it("rejects mismatched offer states and arbitrary experiment dimensions", () => {
    expect(parseEvidenceEventPayload({
      eventId: EVENT_ID,
      sessionId: SESSION_ID,
      eventName: "precommerce_offer_engaged",
      surface: "benefits_decision_result",
      destinationId: "checkout",
      variant: "benefits_workspace_29_v2",
    })).toBeNull();
    expect(parseEvidenceEventPayload({
      eventId: EVENT_ID,
      sessionId: SESSION_ID,
      eventName: "precommerce_offer_viewed",
      surface: "benefits_decision_offer",
      variant: "benefits_offer_29_v1",
    })).toBeNull();
    expect(parseEvidenceEventPayload({
      eventId: EVENT_ID,
      sessionId: SESSION_ID,
      eventName: "precommerce_commitment_started",
      surface: "benefits_decision_result",
      destinationId: "commitment_form",
      variant: "benefits_workspace_39_v1",
    })).toBeNull();
  });

  it("rejects unknown or sensitive-looking properties", () => {
    expect(parseEvidenceEventPayload({
      eventId: EVENT_ID,
      sessionId: SESSION_ID,
      eventName: "precommerce_offer_viewed",
      surface: "benefits_decision_result",
      variant: "benefits_workspace_29_v2",
      employer: "Example Hospital",
    })).toBeNull();
  });

  it("maps only known same-site insurance destinations and rejects query strings", () => {
    expect(resolveInsuranceDestinationId("/insurance/commercial-insurance-comparison#comparison-tool")).toBe("commercial_comparison");
    expect(resolveInsuranceDestinationId("/tools/out-of-pocket-max-estimator?amount=5000")).toBeNull();
    expect(resolveInsuranceDestinationId("https://example.com/insurance")).toBeNull();
  });
});
