import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  applyPatientEducationLocalization,
  validatePatientEducationLocalizationPackage,
} from "@/lib/patientEducationLocalizationContract";
import type { PatientEducationContentDocument } from "@/lib/patientEducationContentContract";

const source: PatientEducationContentDocument = {
  schemaVersion: "1.0.0",
  documentId: "CAF-PE-DOC-LOCALIZATION-DEMO",
  packageId: "CAF-PE-LOCALIZATION-DEMO",
  assetId: "CAF-PE-LOCALIZATION-DEMO-FULL",
  assetVersion: "1.0.0",
  documentKind: "full_guide",
  title: "Controlled localization fixture",
  language: "en-US",
  audiences: ["patient"],
  distributionBoundary: "institutional",
  sourceDossierId: "DOSSIER-DEMO",
  supportedTargets: ["responsive_html", "print_html"],
  blocks: [
    { blockId: "important", sectionId: "most_important", type: "paragraph", text: "Follow the plan given by your care team.", clinicalInstruction: false, publicPreviewAllowed: false },
    { blockId: "today", sectionId: "today", type: "paragraph", text: "Review the supplies and contacts before leaving.", clinicalInstruction: false, publicPreviewAllowed: false },
    { blockId: "help", sectionId: "get_help", type: "callout", tone: "warning", iconLabel: "Call today", title: "Get help when the plan changes", body: "Use the organization-approved contact.", action: "Call the organization-approved contact.", clinicalInstruction: false, publicPreviewAllowed: false },
    { blockId: "plan", sectionId: "personal_plan", type: "personalization", title: "Your plan", storageBoundary: "The hospital stores patient-specific values.", fields: [{ fieldId: "contact", label: "Care team contact", category: "contact", valueSource: "healthcare_organization", required: true, phiCapability: "possible" }], clinicalInstruction: false, publicPreviewAllowed: false },
    { blockId: "steps", sectionId: "how_to", type: "procedure", title: "How to use the plan", steps: [{ stepId: "one", title: "Read", instruction: "Read the hospital-approved instructions." }], showMeRequired: false, clinicalInstruction: false, publicPreviewAllowed: false },
    { blockId: "breaks", sectionId: "plan_breaks", type: "troubleshooting", title: "When the plan breaks", scenarios: [{ scenarioId: "delay", trigger: "A service has not contacted you.", action: "Use the organization-approved escalation route." }], clinicalInstruction: false, publicPreviewAllowed: false },
  ],
};

const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

const approvedLocalization = {
  schemaVersion: "1.0.0",
  localizationId: "CAF-PE-LOC-ES-US-DEMO",
  documentId: source.documentId,
  sourceLanguage: "en-US",
  targetLanguage: "es-US",
  sourceAssetVersion: source.assetVersion,
  status: "approved",
  createdAt: "2026-07-18T12:00:00.000Z",
  updatedAt: "2026-07-18T13:00:00.000Z",
  plainLanguageStandard: "Patient-tested plain language",
  culturalAdaptationNotes: [],
  unresolvedTerms: [],
  localizedBlocks: source.blocks.map((block) => ({
    blockId: block.blockId,
    sourceBlockHash: hash(block),
    translatedBlock: block.type === "paragraph" ? { ...block, text: `ES: ${block.text}` } : block,
    translatorAttestation: { method: "human", translatorRole: "Certified medical translator", completedAt: "2026-07-18T12:30:00.000Z" },
    review: { languageAccuracy: "approved", clinicalEquivalence: "approved", healthLiteracy: "approved", reviewedAt: "2026-07-18T13:00:00.000Z" },
  })),
} as const;

describe("patient education localization contract", () => {
  it("accepts a fully reviewed localization and preserves block structure", () => {
    const validation = validatePatientEducationLocalizationPackage(approvedLocalization);
    expect(validation.success).toBe(true);

    const localized = applyPatientEducationLocalization(source, approvedLocalization);
    expect(localized.language).toBe("es-US");
    expect(localized.blocks.map((block) => `${block.blockId}:${block.type}:${block.sectionId}`)).toEqual(
      source.blocks.map((block) => `${block.blockId}:${block.type}:${block.sectionId}`),
    );
  });

  it("rejects machine-only approved localization", () => {
    const unsafe = structuredClone(approvedLocalization);
    unsafe.localizedBlocks[0].translatorAttestation.method = "machine_only";
    expect(validatePatientEducationLocalizationPackage(unsafe).success).toBe(false);
  });

  it("rejects delivery application before localization approval", () => {
    const pending = structuredClone(approvedLocalization);
    pending.status = "clinical_review";
    expect(() => applyPatientEducationLocalization(source, pending)).toThrow(/Only approved localization packages/);
  });
});
