import { describe, expect, it } from "vitest";
import { classifyPatientEducationChangeRisk } from "@/lib/patientEducationChangeRisk";
import {
  patientEducationFullGuideDocumentFixture,
  patientEducationQuickStartDocumentFixture,
} from "@/test/fixtures/patientEducationEngineFixture";

describe("patientEducationChangeRisk", () => {
  it("classifies a nonclinical paragraph edit as low risk", () => {
    const next = {
      ...patientEducationQuickStartDocumentFixture,
      assetVersion: "1.0.1",
      blocks: patientEducationQuickStartDocumentFixture.blocks.map((block) => block.blockId === "quick-intro" && block.type === "paragraph"
        ? { ...block, text: "This demonstration explains the product structure in plain language." }
        : block),
    };

    const report = classifyPatientEducationChangeRisk(patientEducationQuickStartDocumentFixture, next);
    expect(report.overallRisk).toBe("low");
    expect(report.changes).toEqual([
      expect.objectContaining({ code: "CHANGE-BLOCK-CONTENT", risk: "low", blockId: "quick-intro" }),
    ]);
    expect(report.requiredActions).toEqual(expect.arrayContaining([
      "increment_version",
      "rerun_automated_qa",
      "recompile_all_artifacts",
      "regenerate_integrity_manifest",
    ]));
    expect(report.requiredActions).not.toContain("consider_distribution_suspension");
  });

  it("classifies an emergency-action change as critical", () => {
    const next = {
      ...patientEducationFullGuideDocumentFixture,
      assetVersion: "1.0.1",
      blocks: patientEducationFullGuideDocumentFixture.blocks.map((block) => block.blockId === "full-help" && block.type === "callout"
        ? { ...block, action: "Use the revised organization-approved emergency instruction." }
        : block),
    };

    const report = classifyPatientEducationChangeRisk(patientEducationFullGuideDocumentFixture, next);
    expect(report.overallRisk).toBe("critical");
    expect(report.requiredReviews).toEqual(expect.arrayContaining([
      "clinical_safety",
      "evidence",
      "patient_testing",
    ]));
    expect(report.requiredActions).toEqual(expect.arrayContaining([
      "consider_distribution_suspension",
      "issue_correction_or_recall_assessment",
      "reopen_release_gates",
    ]));
  });

  it("classifies expanded public-preview eligibility as critical", () => {
    const next = {
      ...patientEducationFullGuideDocumentFixture,
      assetVersion: "1.0.1",
      blocks: patientEducationFullGuideDocumentFixture.blocks.map((block) => block.blockId === "full-most-important"
        ? { ...block, publicPreviewAllowed: true }
        : block),
    };

    const report = classifyPatientEducationChangeRisk(patientEducationFullGuideDocumentFixture, next);
    expect(report.overallRisk).toBe("critical");
    expect(report.changes).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "CHANGE-PUBLIC-EXPOSURE-EXPANDED", risk: "critical" }),
    ]));
    expect(report.requiredReviews).toContain("privacy_security");
  });

  it("classifies PHI-capable personalization changes as critical", () => {
    const next = {
      ...patientEducationQuickStartDocumentFixture,
      assetVersion: "1.0.1",
      blocks: patientEducationQuickStartDocumentFixture.blocks.map((block) => block.blockId === "quick-plan" && block.type === "personalization"
        ? {
          ...block,
          fields: block.fields.map((field) => field.fieldId === "patient_specific_plan"
            ? { ...field, label: "Revised patient-specific plan" }
            : field),
        }
        : block),
    };

    const report = classifyPatientEducationChangeRisk(patientEducationQuickStartDocumentFixture, next);
    expect(report.overallRisk).toBe("critical");
    expect(report.changes).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "CHANGE-PHI-CAPABLE-FIELD", risk: "critical" }),
    ]));
    expect(report.requiredReviews).toContain("privacy_security");
  });

  it("classifies a controlling source-dossier change as critical", () => {
    const next = {
      ...patientEducationQuickStartDocumentFixture,
      assetVersion: "1.0.1",
      sourceDossierId: "DOSSIER-DEMO-SAFETY-2",
    };

    const report = classifyPatientEducationChangeRisk(patientEducationQuickStartDocumentFixture, next);
    expect(report.overallRisk).toBe("critical");
    expect(report.changes).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "CHANGE-SOURCE-DOSSIER", risk: "critical" }),
    ]));
    expect(report.requiredReviews).toContain("evidence");
  });

  it("returns no review or release actions when documents are identical", () => {
    const report = classifyPatientEducationChangeRisk(
      patientEducationQuickStartDocumentFixture,
      patientEducationQuickStartDocumentFixture,
    );
    expect(report.overallRisk).toBe("none");
    expect(report.changes).toEqual([]);
    expect(report.requiredReviews).toEqual([]);
    expect(report.requiredActions).toEqual([]);
  });
});
