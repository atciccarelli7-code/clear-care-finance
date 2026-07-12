import { describe, expect, it } from "vitest";
import { sanitizeGrowthEvent } from "@/lib/growthAnalytics";

describe("privacy-safe growth analytics", () => {
  it("allows only fixed event names and categorical properties", () => {
    expect(sanitizeGrowthEvent("benefits_review_completed", {
      entry_surface: "detector",
      completion_band: "complete",
      employer_name: "Hospital Name",
      answers: "premium increased",
      reminder_date: "2027-10-01",
      query_string: "?state=removed",
    })).toEqual({ name: "benefits_review_completed", properties: { entry_surface: "detector", completion_band: "complete" } });
  });

  it("rejects unknown events, arbitrary strings, dates, URLs, and answer-like values", () => {
    expect(sanitizeGrowthEvent("benefit_answer_saved", { entry_surface: "detector" })).toBeNull();
    expect(sanitizeGrowthEvent("benefits_review_started", {
      problem_category: "premium increased",
      destination_id: "/tools/benefits-change-detector?date=2027-01-01",
      handoff_id: "employer: hospital",
    })).toEqual({ name: "benefits_review_started", properties: {} });
  });
});
