import { describe, expect, it } from "vitest";
import { CONSUMER_PATIENT_GUIDE_CARDS } from "@/data/consumerPatientGuideArticles";

describe("consumer guide finder contract", () => {
  it("returns public article destinations without patient inputs", () => {
    for (const guide of CONSUMER_PATIENT_GUIDE_CARDS) {
      expect(guide.route.startsWith("/articles/")).toBe(true);
      expect(guide).not.toHaveProperty("patientName");
      expect(guide).not.toHaveProperty("diagnosis");
      expect(guide).not.toHaveProperty("medication");
      expect(guide).not.toHaveProperty("freeText");
    }
  });
});
