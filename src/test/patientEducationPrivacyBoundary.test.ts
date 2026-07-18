import { describe, expect, it } from "vitest";
import {
  patientEducationEngineDocumentsFixture,
} from "@/test/fixtures/patientEducationEngineFixture";
import {
  scanPatientEducationDocumentPrivacy,
  scanPatientEducationOverlayPrivacy,
} from "@/lib/patientEducationPrivacyBoundary";

const fullGuide = patientEducationEngineDocumentsFixture.find((document) => document.documentKind === "full_guide");
if (!fullGuide) throw new Error("Missing full-guide privacy fixture.");

const institutionOverlay = {
  schemaVersion: "1.0.0",
  overlayId: "CAF-PE-OVERLAY-HOSPITAL-001",
  organizationKey: "HOSPITAL-001",
  packageId: fullGuide.packageId,
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

describe("patientEducationPrivacyBoundary", () => {
  it("allows CAF source to define PHI-capable fields when no values are populated", () => {
    const result = scanPatientEducationDocumentPrivacy(fullGuide, "caf_source_repository");
    expect(result.passed).toBe(true);
    expect(result.findings).toEqual([]);
  });

  it("blocks a populated PHI-capable field in CAF source", () => {
    const result = scanPatientEducationDocumentPrivacy({
      ...fullGuide,
      blocks: fullGuide.blocks.map((block) => block.type === "personalization"
        ? {
            ...block,
            fields: block.fields.map((field) => field.phiCapability !== "none"
              ? { ...field, placeholder: "Patient Name: Jane Example" }
              : field),
          }
        : block),
    }, "caf_source_repository");
    expect(result.passed).toBe(false);
    expect(result.findings.map((item) => item.code)).toContain("PRIVACY-PHI-FIELD-POPULATED-IN-SOURCE");
    expect(result.findings.map((item) => item.code)).toContain("PRIVACY-PATIENT-NAME-DETECTED");
  });

  it("blocks patient identifiers in narrative text", () => {
    const result = scanPatientEducationDocumentPrivacy({
      ...fullGuide,
      blocks: [
        ...fullGuide.blocks,
        {
          blockId: "privacy-mrn-test",
          sectionId: fullGuide.blocks[0].sectionId,
          type: "paragraph" as const,
          text: "MRN: 1234567",
          clinicalInstruction: false,
          emergencyAction: false,
          claimIds: [],
          publicPreviewAllowed: false,
        },
      ],
    }, "institutional_delivery");
    expect(result.passed).toBe(false);
    expect(result.findings.map((item) => item.code)).toContain("PRIVACY-MRN-DETECTED");
  });

  it("blocks an unsanitized institutional source from controlled preview", () => {
    const result = scanPatientEducationDocumentPrivacy(fullGuide, "controlled_preview");
    expect(result.passed).toBe(false);
    expect(result.findings.map((item) => item.code)).toEqual(expect.arrayContaining([
      "PRIVACY-PHI-CAPABLE-FIELD-IN-PREVIEW",
      "PRIVACY-CONTROLLED-PREVIEW-REQUIRES-SANITIZATION",
    ]));
  });

  it("allows an approved non-PHI institution overlay", () => {
    const result = scanPatientEducationOverlayPrivacy(institutionOverlay, "institutional_delivery");
    expect(result.passed).toBe(true);
  });

  it("blocks obvious patient identifiers in institution overlay values", () => {
    const result = scanPatientEducationOverlayPrivacy({
      ...institutionOverlay,
      fields: institutionOverlay.fields.map((field, index) => index === 0
        ? { ...field, value: "Patient name: Jane Example" }
        : field),
    }, "institutional_delivery");
    expect(result.passed).toBe(false);
    expect(result.findings.map((item) => item.code)).toContain("PRIVACY-PATIENT-NAME-DETECTED");
  });
});
