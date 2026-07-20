import { describe, expect, it } from "vitest";
import { CONSUMER_PATIENT_GUIDE_CARDS } from "@/data/consumerPatientGuideArticles";

describe("consumer Hospital & Patient Guide library", () => {
  it("contains five unique consumer destinations", () => {
    expect(CONSUMER_PATIENT_GUIDE_CARDS).toHaveLength(5);
    expect(new Set(CONSUMER_PATIENT_GUIDE_CARDS.map((guide) => guide.route)).size).toBe(5);
    for (const guide of CONSUMER_PATIENT_GUIDE_CARDS) {
      expect(guide.route).toMatch(/^\/articles\//);
      expect(guide.reviewStatus).toContain("no independent physician or pharmacist review claimed");
    }
  });
});
