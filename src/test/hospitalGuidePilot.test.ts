import { describe, expect, it } from "vitest";
import { hospitalGuidePilotPreviews } from "@/data/hospitalGuidePilot";

describe("Hospital & Patient Guide pilot previews", () => {
  it("contains the exact five requested packages", () => {
    expect(hospitalGuidePilotPreviews.map((item) => item.id)).toEqual([
      "copd_recovery",
      "heart_failure",
      "blood_thinners",
      "home_oxygen",
      "first_72_hours",
    ]);
  });

  it("keeps every public preview substantial but controlled", () => {
    for (const preview of hospitalGuidePilotPreviews) {
      expect(preview.patientSees.length).toBeGreaterThanOrEqual(4);
      expect(preview.caregiverSees.length).toBeGreaterThanOrEqual(3);
      expect(preview.nurseUses.length).toBeGreaterThanOrEqual(3);
      expect(preview.customizable.length).toBeGreaterThanOrEqual(4);
      expect(preview.actionLevels).toHaveLength(4);
      expect(preview.sourceLabels.length).toBeGreaterThanOrEqual(2);
      expect(preview.reviewNote).toMatch(/review/i);
    }
  });

  it("does not publish generic patient-specific thresholds or unsafe medicine changes", () => {
    const content = JSON.stringify(hospitalGuidePilotPreviews).toLowerCase();
    expect(content).not.toMatch(/gain \d+ (?:pounds|lbs)/);
    expect(content).not.toMatch(/maintain.{0,25}(?:88|89|90|91|92|93|94|95)%/);
    expect(content).not.toMatch(/double (?:your|the) dose/);
    expect(content).toContain("individualized");
    expect(content).toContain("medication-specific missed-dose");
  });
});
