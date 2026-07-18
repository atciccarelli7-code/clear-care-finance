import { describe, expect, it } from "vitest";
import { buildPatientEducationDistributionManifest } from "@/lib/patientEducationDistribution";

const packageFixture = {
  schemaVersion: "1.0.0",
  packageId: "CAF-PE-ANTICOAG-ADULT-EN-001",
  title: "New to Blood Thinners",
  shortTitle: "Blood thinners",
  description: "Controlled institutional package for adult anticoagulant discharge education.",
  clinicalDomains: ["Medication safety", "Care transitions"],
  intendedAudiences: ["Adult patients", "Caregivers", "Discharge teams"],
  careSettings: ["Acute inpatient", "Observation"],
  ageGroup: "adult",
  language: "en-US",
  riskTier: "critical",
  status: "external_review",
  version: "0.8.0",
  publicStatus: "controlled_preview",
  dataClassification: "client_confidential",
  productOwnerRole: "CAF product owner",
  sourceDossierId: "CAF-ED-ANTICOAG-001",
  sourceDossierStatus: "complete",
  assets: [
    {
      assetId: "CAF-PE-ANTICOAG-FULL-GUIDE",
      type: "full_guide",
      title: "New to Blood Thinners — Full Patient Guide",
      audience: ["patient", "caregiver"],
      formats: ["responsive_html", "print_pdf", "accessible_pdf"],
      status: "external_review",
      version: "0.8.0",
      sourceDossierId: "CAF-ED-ANTICOAG-001",
      derivedFromAssetIds: [],
      localizationRequired: true,
      patientSpecificFieldsAllowed: true,
      containsClinicalInstructions: true,
      publicDistributionAllowed: false,
    },
    {
      assetId: "CAF-PE-ANTICOAG-CLINICIAN-REFERENCE",
      type: "clinician_reference",
      title: "Blood Thinners Product Architecture Preview",
      audience: ["clinician", "reviewer", "administrator"],
      formats: ["responsive_html", "print_pdf"],
      status: "external_review",
      version: "0.8.0",
      sourceDossierId: "CAF-ED-ANTICOAG-001",
      derivedFromAssetIds: [],
      localizationRequired: false,
      patientSpecificFieldsAllowed: false,
      containsClinicalInstructions: false,
      publicDistributionAllowed: true,
    },
  ],
  requiredReviewRoles: [
    {
      roleId: "clinical_pharmacist",
      roleLabel: "Clinical pharmacist",
      discipline: "Pharmacy",
      required: true,
      approvalScope: "Medication instructions, interactions, monitoring, and interruption language.",
      status: "approved",
      reviewerIdentityRef: "CAF-REV-PHARM-001",
      approvedVersion: "0.8.0",
      reviewedAt: "2026-07-18T00:00:00.000Z",
      expiresAt: "2027-01-18T00:00:00.000Z",
    },
  ],
  releaseGates: {
    evidence: "passed",
    clinical_review: "in_progress",
    health_literacy: "in_progress",
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
    {
      fieldId: "patient_specific_schedule",
      label: "Patient-specific schedule",
      category: "clinical_order",
      requiredForRelease: true,
      populatedBy: "healthcare_organization",
      allowsPhi: true,
      storageBoundary: "Never populate or transmit through the CAF public environment.",
    },
  ],
  prohibitedData: ["Patient name", "Date of birth", "Medical record number", "Case narrative"],
  claimsBoundary: ["This package is not represented as hospital-approved or ready for patient use until all release gates pass."],
  correctionRoute: {
    ownerRole: "CAF content safety owner",
    severityModel: ["critical", "major", "minor"],
    recallCapable: true,
    customerNotificationRequiredFor: ["critical", "major"],
  },
} as const;

const institutionReadyPackage = {
  ...packageFixture,
  status: "pilot_ready",
  version: "1.0.0",
  lastClinicalReviewAt: "2026-07-18T00:00:00.000Z",
  nextClinicalReviewAt: "2027-01-18T00:00:00.000Z",
  assets: packageFixture.assets.map((asset) => ({ ...asset, status: "pilot_ready", version: "1.0.0" })),
  requiredReviewRoles: packageFixture.requiredReviewRoles.map((role) => ({ ...role, approvedVersion: "1.0.0" })),
  releaseGates: {
    evidence: "passed",
    clinical_review: "passed",
    health_literacy: "passed",
    accessibility: "passed",
    patient_testing: "passed",
    institutional_localization: "passed",
  },
} as const;

describe("patient education distribution compiler", () => {
  it("builds a controlled preview that withholds restricted clinical and identity metadata", () => {
    const manifest = buildPatientEducationDistributionManifest(
      packageFixture,
      "controlled_preview",
      "2026-07-18T01:00:00.000Z",
    );

    expect(manifest.distributionMode).toBe("controlled_preview");
    expect(manifest.assets).toHaveLength(1);
    expect(manifest.assets[0].type).toBe("clinician_reference");
    expect(manifest.assets[0].patientSpecificFieldsAllowed).toBe(false);
    expect(manifest.localization).toHaveLength(1);
    expect(manifest.localization.every((field) => field.allowsPhi === false)).toBe(true);
    expect(manifest.releaseSummary.requiredReviewRoles[0].status).toBe("assigned");
    expect(manifest.releaseSummary.requiredReviewRoles[0]).not.toHaveProperty("reviewerIdentityRef");
    expect(manifest.releaseSummary.requiredReviewRoles[0]).not.toHaveProperty("reviewedAt");
    expect(manifest.withheld.join(" ")).toMatch(/restricted clinical-instruction assets/i);
  });

  it("blocks controlled preview export for a private-only package", () => {
    expect(() => buildPatientEducationDistributionManifest(
      { ...packageFixture, publicStatus: "private" },
      "controlled_preview",
    )).toThrow(/requires package publicStatus/i);
  });

  it("blocks institutional delivery before all gates pass", () => {
    expect(() => buildPatientEducationDistributionManifest(
      packageFixture,
      "institutional_delivery",
    )).toThrow(/pilot-ready or released/i);
  });

  it("builds institution-ready delivery metadata only after all gates and reviews pass", () => {
    const manifest = buildPatientEducationDistributionManifest(
      institutionReadyPackage,
      "institutional_delivery",
      "2026-07-18T02:00:00.000Z",
    );

    expect(manifest.assets).toHaveLength(2);
    expect(manifest.assets.some((asset) => asset.containsClinicalInstructions)).toBe(true);
    expect(manifest.localization.some((field) => field.allowsPhi)).toBe(true);
    expect(Object.values(manifest.releaseSummary.gates).every((status) => status === "passed")).toBe(true);
    expect(manifest.releaseSummary.requiredReviewRoles[0].status).toBe("approved");
    expect(manifest.releaseSummary.requiredReviewRoles[0].approvedVersion).toBe("1.0.0");
    expect(manifest.releaseSummary.requiredReviewRoles[0]).not.toHaveProperty("reviewerIdentityRef");
  });

  it("preserves all package metadata for internal governance without implying release readiness", () => {
    const manifest = buildPatientEducationDistributionManifest(
      packageFixture,
      "internal_governance",
      "2026-07-18T03:00:00.000Z",
    );

    expect(manifest.assets).toHaveLength(2);
    expect(manifest.package.status).toBe("external_review");
    expect(manifest.releaseSummary.gates.accessibility).toBe("not_started");
    expect(manifest.releaseSummary.requiredReviewRoles[0].status).toBe("approved");
  });
});
