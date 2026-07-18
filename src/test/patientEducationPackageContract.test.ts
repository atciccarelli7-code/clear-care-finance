import { describe, expect, it } from "vitest";
import { validatePatientEducationPackage } from "@/lib/patientEducationPackageContract";

const basePackage = {
  schemaVersion: "1.0.0",
  packageId: "CAF-PE-ANTICOAG-ADULT-EN-001",
  title: "New to Blood Thinners",
  shortTitle: "Blood thinners",
  description: "Development-stage institutional package architecture for adult anticoagulant education.",
  clinicalDomains: ["Medication safety", "Care transitions"],
  intendedAudiences: ["Adult patients", "Caregivers", "Discharge teams"],
  careSettings: ["Acute inpatient", "Observation"],
  ageGroup: "adult",
  language: "en-US",
  riskTier: "critical",
  status: "researching",
  version: "0.1.0",
  publicStatus: "private",
  dataClassification: "caf_confidential",
  productOwnerRole: "CAF product owner",
  sourceDossierId: "CAF-ED-ANTICOAG-001",
  sourceDossierStatus: "in_progress",
  assets: [
    {
      assetId: "CAF-PE-ANTICOAG-FULL-GUIDE",
      type: "full_guide",
      title: "New to Blood Thinners — Full Patient Guide",
      audience: ["patient", "caregiver"],
      formats: ["responsive_html", "print_pdf", "accessible_pdf"],
      status: "researching",
      version: "0.1.0",
      sourceDossierId: "CAF-ED-ANTICOAG-001",
      derivedFromAssetIds: [],
      localizationRequired: true,
      patientSpecificFieldsAllowed: true,
      containsClinicalInstructions: true,
      publicDistributionAllowed: false,
    },
  ],
  requiredReviewRoles: [
    {
      roleId: "clinical_pharmacist",
      roleLabel: "Clinical pharmacist",
      discipline: "Pharmacy",
      required: true,
      approvalScope: "Medication-specific instructions, interactions, monitoring, and interruption language.",
      status: "not_assigned",
    },
  ],
  releaseGates: {
    evidence: "in_progress",
    clinical_review: "not_started",
    health_literacy: "not_started",
    accessibility: "not_started",
    patient_testing: "not_started",
    institutional_localization: "not_started",
  },
  localizationFields: [
    {
      fieldId: "managing_clinician_phone",
      label: "Managing clinician phone",
      category: "contact",
      requiredForRelease: true,
      populatedBy: "healthcare_organization",
      allowsPhi: false,
      storageBoundary: "Populate only inside the healthcare organization's approved delivery environment.",
    },
  ],
  prohibitedData: ["Patient name", "Date of birth", "Medical record number", "Case narrative"],
  claimsBoundary: ["This package is not represented as hospital-approved, clinically validated, or ready for patient use."],
  correctionRoute: {
    ownerRole: "CAF content safety owner",
    severityModel: ["critical", "major", "minor"],
    recallCapable: true,
    customerNotificationRequiredFor: ["critical", "major"],
  },
} as const;

describe("patient education package contract", () => {
  it("accepts a development-stage private package", () => {
    const result = validatePatientEducationPackage(basePackage);
    expect(result.success).toBe(true);
  });

  it("blocks pilot-ready status before all gates and mandatory reviews pass", () => {
    const result = validatePatientEducationPackage({ ...basePackage, status: "pilot_ready" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message).join(" ")).toMatch(/every release gate|required review role/i);
    }
  });

  it("blocks public exposure of restricted clinical instruction assets", () => {
    const result = validatePatientEducationPackage({ ...basePackage, publicStatus: "public" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.map((issue) => issue.message).join(" ")).toMatch(/restricted clinical-instruction/i);
  });

  it("blocks PHI-enabled fields in the public product architecture", () => {
    const result = validatePatientEducationPackage({
      ...basePackage,
      publicStatus: "controlled_preview",
      dataClassification: "public_product_architecture",
      localizationFields: [{ ...basePackage.localizationFields[0], allowsPhi: true }],
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.map((issue) => issue.message).join(" ")).toMatch(/cannot include localization fields that allow PHI/i);
  });

  it("accepts a fully approved pilot-ready package with review provenance", () => {
    const result = validatePatientEducationPackage({
      ...basePackage,
      status: "pilot_ready",
      sourceDossierStatus: "complete",
      lastClinicalReviewAt: "2026-07-18T00:00:00.000Z",
      nextClinicalReviewAt: "2027-01-18T00:00:00.000Z",
      requiredReviewRoles: [{
        ...basePackage.requiredReviewRoles[0],
        status: "approved",
        reviewerIdentityRef: "CAF-REV-PHARM-001",
        approvedVersion: "1.0.0",
        reviewedAt: "2026-07-18T00:00:00.000Z",
        expiresAt: "2027-01-18T00:00:00.000Z",
      }],
      releaseGates: {
        evidence: "passed",
        clinical_review: "passed",
        health_literacy: "passed",
        accessibility: "passed",
        patient_testing: "passed",
        institutional_localization: "passed",
      },
    });
    expect(result.success).toBe(true);
  });
});
