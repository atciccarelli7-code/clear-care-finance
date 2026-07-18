import { describe, expect, it } from "vitest";
import { validatePatientEducationInstitutionOverlay } from "@/lib/patientEducationInstitutionOverlay";

const base = {
  schemaVersion: "1.0.0",
  overlayId: "CAF-PE-OVERLAY-HOSPITAL-001",
  organizationKey: "HOSPITAL-001",
  packageId: "CAF-PE-BLOOD-001",
  packageVersion: "1.0.0",
  locale: "en-US",
  effectiveAt: "2026-08-01T00:00:00.000Z",
  fields: [{
    fieldId: "after_hours_contact",
    category: "contact",
    value: "Use the approved hospital after-hours number.",
    sourceOwner: "Clinical operations",
    phiCapability: "none",
    approvedByRole: "Nursing governance",
    approvedAt: "2026-07-28T00:00:00.000Z",
  }],
  status: "approved",
  changeReason: "Initial controlled pilot configuration",
} as const;

describe("patient education institution overlay", () => {
  it("accepts approved non-PHI localization fields", () => {
    expect(validatePatientEducationInstitutionOverlay(base).success).toBe(true);
  });

  it("rejects duplicate localization fields", () => {
    const result = validatePatientEducationInstitutionOverlay({ ...base, fields: [base.fields[0], base.fields[0]] });
    expect(result.success).toBe(false);
  });

  it("rejects expiration before activation", () => {
    const result = validatePatientEducationInstitutionOverlay({ ...base, expiresAt: "2026-07-01T00:00:00.000Z" });
    expect(result.success).toBe(false);
  });
});
