import { describe, expect, it } from "vitest";
import {
  patientEducationEngineDocumentsFixture,
  patientEducationEngineOverlayFixture,
} from "@/test/fixtures/patientEducationEngineFixture";
import {
  scanPatientEducationDocumentPrivacy,
  scanPatientEducationOverlayPrivacy,
} from "@/lib/patientEducationPrivacyBoundary";

const fullGuide = patientEducationEngineDocumentsFixture.find((document) => document.assetType === "full_guide");
if (!fullGuide) throw new Error("Missing full-guide privacy fixture.");

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
            fields: block.fields.map((field) => field.phiCapability === "patient_identifier"
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
          blockId: "CAF-PE-BLOCK-PRIVACY-MRN",
          sectionId: fullGuide.sections[0].sectionId,
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
    const result = scanPatientEducationOverlayPrivacy(patientEducationEngineOverlayFixture, "institutional_delivery");
    expect(result.passed).toBe(true);
  });

  it("blocks obvious patient identifiers in institution overlay values", () => {
    const result = scanPatientEducationOverlayPrivacy({
      ...patientEducationEngineOverlayFixture,
      fields: patientEducationEngineOverlayFixture.fields.map((field, index) => index === 0
        ? { ...field, value: "Patient name: Jane Example" }
        : field),
    }, "institutional_delivery");
    expect(result.passed).toBe(false);
    expect(result.findings.map((item) => item.code)).toContain("PRIVACY-PATIENT-NAME-DETECTED");
  });
});
