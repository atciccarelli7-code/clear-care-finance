import { describe, expect, it } from "vitest";
import { parseJourneyEvidencePayload } from "@/lib/journeyEventContract";

const validPayload = {
  eventId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  eventName: "journey_result_reached",
  journeyKey: "benefits_decision_system",
  surface: "benefits",
  phase: "result",
  stepIndex: 8,
  variant: "flagship_funnel_v1",
  sessionJourneyId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
};

describe("journey evidence server contract", () => {
  it("accepts a fixed anonymous journey payload", () => {
    expect(parseJourneyEvidencePayload(validPayload)).toEqual(validPayload);
    expect(parseJourneyEvidencePayload({ ...validPayload, journeyKey: "hospital_to_home", surface: "hospital_guide" })).not.toBeNull();
    expect(parseJourneyEvidencePayload({ ...validPayload, eventName: "journey_result_saved" })).not.toBeNull();
  });

  it("rejects unknown or sensitive properties", () => {
    expect(parseJourneyEvidencePayload({ ...validPayload, answer: "selected plan" })).toBeNull();
    expect(parseJourneyEvidencePayload({ ...validPayload, journeyKey: "contains free text" })).toBeNull();
    expect(parseJourneyEvidencePayload({ ...validPayload, journeyKey: "unknown_but_fixed" })).toBeNull();
    expect(parseJourneyEvidencePayload({ ...validPayload, variant: "unknown_variant" })).toBeNull();
    expect(parseJourneyEvidencePayload({ ...validPayload, stepIndex: 21 })).toBeNull();
  });

  it("rejects identifiers outside the bounded random-id contract", () => {
    expect(parseJourneyEvidencePayload({ ...validPayload, eventId: "not-a-uuid" })).toBeNull();
    expect(parseJourneyEvidencePayload({ ...validPayload, sessionJourneyId: "short" })).toBeNull();
    expect(parseJourneyEvidencePayload({ ...validPayload, sessionJourneyId: "caf-12345678" })).toBeNull();
  });
});
