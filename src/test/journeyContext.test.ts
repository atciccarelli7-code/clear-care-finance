import { beforeEach, describe, expect, it } from "vitest";
import {
  JOURNEY_CONTEXT_STORAGE_KEY,
  clearJourneyContext,
  isValidJourneyContext,
  loadJourneyContext,
  saveJourneyContext,
  type JourneyContext,
} from "@/lib/journeyContext";

const validContext: JourneyContext = {
  journeyId: "medical_bills",
  source: "home",
  goalId: "medical_bill",
  goalLabel: "Understand or reduce a medical bill",
  destinationPath: "/insurance/medical-bill-review-toolkit",
  expectedOutcome: "the correct document-specific review route and next three actions",
};

describe("journey context", () => {
  beforeEach(() => window.sessionStorage.clear());

  it("stores only the fixed journey handoff and restores it in the same tab", () => {
    expect(saveJourneyContext(validContext)).toBe(true);
    expect(loadJourneyContext()).toEqual(validContext);
    expect(JSON.parse(window.sessionStorage.getItem(JOURNEY_CONTEXT_STORAGE_KEY) ?? "{}"))
      .not.toHaveProperty("answers");
  });

  it("rejects query strings, fragments, free-form identifiers, and malformed storage", () => {
    expect(isValidJourneyContext({ ...validContext, destinationPath: "/tools/example?answer=yes" })).toBe(false);
    expect(isValidJourneyContext({ ...validContext, goalId: "medical bill from Jane" })).toBe(false);

    window.sessionStorage.setItem(JOURNEY_CONTEXT_STORAGE_KEY, JSON.stringify({ ...validContext, expectedOutcome: "<script>" }));
    expect(loadJourneyContext()).toBeNull();
    expect(window.sessionStorage.getItem(JOURNEY_CONTEXT_STORAGE_KEY)).toBeNull();
  });

  it("can be explicitly ended without affecting other browser storage", () => {
    window.sessionStorage.setItem("unrelated", "keep");
    saveJourneyContext(validContext);
    clearJourneyContext();
    expect(loadJourneyContext()).toBeNull();
    expect(window.sessionStorage.getItem("unrelated")).toBe("keep");
  });
});
