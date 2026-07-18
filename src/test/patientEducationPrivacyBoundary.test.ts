import { describe, expect, it } from "vitest";
import {
  assertPatientEducationPrivacyBoundary,
  scanPatientEducationDocumentPrivacy,
  scanPatientEducationOverlayPrivacy,
} from "@/lib/patientEducationPrivacyBoundary";
import { patientEducationQuickStartDocumentFixture } from "@/test/fixtures/patientEducationEngineFixture";

const safeOverlay = {
  schemaVersion: "1.0.0" as const,
  overlayId: "CAF-PE-OVERLAY-PRIVACY-TEST",
  organizationKey: "DEMO-HOSPITAL",
  packageId: patientEducationQuickStartDocumentFixture.packageId,
  packageVersion: patientEducationQuickStartDocumentFixture.assetVersion,
  locale: "en-US",
  effectiveAt: "2026-07-18T13:00:00.000Z",
  fields: [
    {
      fieldId: "care_team_contact",
      category: "contact" as const,
      value: "Call 704-555-0100 for the approved hospital transition support line.",
      sourceOwner: "Patient education operations",
      phiCapability: "none" as const,
      approvedByRole: "Institutional patient education owner",
      approvedAt: "2026-07-18T13:00:00.000Z",
    },
  ],
  status: "approved" as const,
  changeReason: "Synthetic privacy scanner fixture.",
};

describe("patientEducationPrivacyBoundary", () => {
  it("allows CAF source content to define but not populate a PHI-capable field", () => {
    const result = scanPatientEducationDocumentPrivacy(
      patientEducationQuickStartDocumentFixture,
      "caf_source_repository",
    );
    expect(result.passed).toBe(true);
    expect(result.findings).toEqual([]);
  });

  it("blocks a populated PHI-capable field in CAF-managed source content", () => {
    const document = {
      ...patientEducationQuickStartDocumentFixture,
      blocks: patientEducationQuickStartDocumentFixture.blocks.map((block) => block.type === "personalization"
        ? {
          ...block,
          fields: block.fields.map((field) => field.fieldId === "patient_specific_plan"
            ? { ...field, placeholder: "Patient Name: Jordan Smith" }
            : field),
        }
        : block),
    };

    const result = scanPatientEducationDocumentPrivacy(document, "caf_source_repository");
    expect(result.passed).toBe(false);
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "PRIVACY-PHI-FIELD-POPULATED-IN-SOURCE", severity: "blocking" }),
      expect.objectContaining({ code: "PRIVACY-PATIENT-NAME-DETECTED", severity: "blocking" }),
    ]));
  });

  it("detects obvious MRN and date-of-birth patterns in structured prose", () => {
    const document = {
      ...patientEducationQuickStartDocumentFixture,
      blocks: patientEducationQuickStartDocumentFixture.blocks.map((block) => block.blockId === "quick-intro" && block.type === "paragraph"
        ? { ...block, text: "MRN: AB-12345. DOB: 01/02/1980." }
        : block),
    };

    const result = scanPatientEducationDocumentPrivacy(document, "caf_source_repository");
    expect(result.passed).toBe(false);
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "PRIVACY-MRN-DETECTED" }),
      expect.objectContaining({ code: "PRIVACY-DOB-DETECTED" }),
    ]));
  });

  it("blocks an unsanitized institutional document from controlled preview", () => {
    const result = scanPatientEducationDocumentPrivacy(
      patientEducationQuickStartDocumentFixture,
      "controlled_preview",
    );
    expect(result.passed).toBe(false);
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "PRIVACY-PHI-CAPABLE-FIELD-IN-PREVIEW" }),
      expect.objectContaining({ code: "PRIVACY-CONTROLLED-PREVIEW-REQUIRES-SANITIZATION" }),
    ]));
  });

  it("allows an approved organization contact in institutional delivery", () => {
    const result = scanPatientEducationOverlayPrivacy(safeOverlay, "institutional_delivery");
    expect(result.passed).toBe(true);
    expect(result.findings).toEqual([]);
    expect(() => assertPatientEducationPrivacyBoundary(result)).not.toThrow();
  });

  it("flags public contact information for confirmation without treating it as PHI by default", () => {
    const result = scanPatientEducationOverlayPrivacy(safeOverlay, "controlled_preview");
    expect(result.passed).toBe(true);
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "PRIVACY-PUBLIC-PHONE-REVIEW", severity: "warning" }),
    ]));
  });

  it("blocks patient identifiers hidden inside an institution overlay value", () => {
    const result = scanPatientEducationOverlayPrivacy({
      ...safeOverlay,
      fields: [
        {
          ...safeOverlay.fields[0],
          value: "MRN: PATIENT-778899",
        },
      ],
    }, "institutional_delivery");

    expect(result.passed).toBe(false);
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "PRIVACY-MRN-DETECTED", severity: "blocking" }),
    ]));
    expect(() => assertPatientEducationPrivacyBoundary(result)).toThrow("Patient education privacy boundary failed");
  });
});
