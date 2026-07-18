import { describe, expect, it } from "vitest";
import { applyPatientEducationInstitutionOverlay } from "@/lib/patientEducationInstitutionOverlayCompiler";
import { patientEducationQuickStartDocumentFixture } from "@/test/fixtures/patientEducationEngineFixture";

const overlay = {
  schemaVersion: "1.0.0" as const,
  overlayId: "CAF-PE-OVERLAY-DEMO-COMPILER",
  organizationKey: "DEMO-HOSPITAL",
  packageId: patientEducationQuickStartDocumentFixture.packageId,
  packageVersion: patientEducationQuickStartDocumentFixture.assetVersion,
  locale: "en-US",
  effectiveAt: "2026-07-18T13:00:00.000Z",
  expiresAt: "2027-07-18T13:00:00.000Z",
  fields: [
    {
      fieldId: "care_team_contact",
      category: "contact" as const,
      value: "Call the organization-approved transition support line.",
      sourceOwner: "Patient education operations",
      phiCapability: "none" as const,
      approvedByRole: "Institutional patient education owner",
      approvedAt: "2026-07-18T13:00:00.000Z",
    },
  ],
  status: "approved" as const,
  changeReason: "Synthetic overlay compiler fixture.",
};

describe("patientEducationInstitutionOverlayCompiler", () => {
  it("applies an approved local value only to its declared non-PHI field", () => {
    const result = applyPatientEducationInstitutionOverlay(
      patientEducationQuickStartDocumentFixture,
      overlay,
      {
        evaluatedAt: "2026-07-18T14:00:00.000Z",
        requiredFieldIds: ["care_team_contact"],
      },
    );

    const personalization = result.document.blocks.find((block) => block.type === "personalization");
    expect(personalization?.type).toBe("personalization");
    if (personalization?.type !== "personalization") throw new Error("Expected personalization block.");

    expect(personalization.fields.find((field) => field.fieldId === "care_team_contact")?.placeholder)
      .toBe("Call the organization-approved transition support line.");
    expect(personalization.fields.find((field) => field.fieldId === "patient_specific_plan")?.placeholder)
      .toBeUndefined();
    expect(result.appliedFieldIds).toEqual(["care_team_contact"]);
    expect(result.provenance).toEqual([
      expect.objectContaining({
        fieldId: "care_team_contact",
        sourceOwner: "Patient education operations",
      }),
    ]);
  });

  it("does not mutate clinical instructions or document identifiers", () => {
    const result = applyPatientEducationInstitutionOverlay(
      patientEducationQuickStartDocumentFixture,
      overlay,
      { evaluatedAt: "2026-07-18T14:00:00.000Z" },
    );

    expect(result.document.documentId).toBe(patientEducationQuickStartDocumentFixture.documentId);
    expect(result.document.assetVersion).toBe(patientEducationQuickStartDocumentFixture.assetVersion);
    expect(result.document.blocks.map((block) => ({
      blockId: block.blockId,
      type: block.type,
      sectionId: block.sectionId,
      clinicalInstruction: block.clinicalInstruction,
    }))).toEqual(patientEducationQuickStartDocumentFixture.blocks.map((block) => ({
      blockId: block.blockId,
      type: block.type,
      sectionId: block.sectionId,
      clinicalInstruction: block.clinicalInstruction,
    })));
  });

  it("rejects an overlay before its effective date", () => {
    expect(() => applyPatientEducationInstitutionOverlay(
      patientEducationQuickStartDocumentFixture,
      overlay,
      { evaluatedAt: "2026-07-18T12:59:59.000Z" },
    )).toThrow("is not active");
  });

  it("rejects an overlay after expiration", () => {
    expect(() => applyPatientEducationInstitutionOverlay(
      patientEducationQuickStartDocumentFixture,
      overlay,
      { evaluatedAt: "2027-07-18T13:00:00.000Z" },
    )).toThrow("is not active");
  });

  it("rejects a package-version mismatch", () => {
    expect(() => applyPatientEducationInstitutionOverlay(
      patientEducationQuickStartDocumentFixture,
      { ...overlay, packageVersion: "2.0.0" },
      { evaluatedAt: "2026-07-18T14:00:00.000Z" },
    )).toThrow("packageVersion does not match");
  });

  it("rejects attempts to populate a PHI-capable field", () => {
    expect(() => applyPatientEducationInstitutionOverlay(
      patientEducationQuickStartDocumentFixture,
      {
        ...overlay,
        fields: [
          {
            ...overlay.fields[0],
            fieldId: "patient_specific_plan",
          },
        ],
      },
      { evaluatedAt: "2026-07-18T14:00:00.000Z" },
    )).toThrow("cannot populate PHI-capable field");
  });

  it("rejects undeclared fields unless explicitly allowed for another downstream adapter", () => {
    const unknownFieldOverlay = {
      ...overlay,
      fields: [
        {
          ...overlay.fields[0],
          fieldId: "unknown_contact",
        },
      ],
    };

    expect(() => applyPatientEducationInstitutionOverlay(
      patientEducationQuickStartDocumentFixture,
      unknownFieldOverlay,
      { evaluatedAt: "2026-07-18T14:00:00.000Z" },
    )).toThrow("not declared by the document");

    const allowed = applyPatientEducationInstitutionOverlay(
      patientEducationQuickStartDocumentFixture,
      unknownFieldOverlay,
      {
        evaluatedAt: "2026-07-18T14:00:00.000Z",
        allowUnusedFields: true,
      },
    );
    expect(allowed.unusedFieldIds).toEqual(["unknown_contact"]);
  });
});
