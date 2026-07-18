import { describe, expect, it } from "vitest";
import {
  analyzePatientEducationQuality,
  extractPatientEducationPlainText,
} from "@/lib/patientEducationQualityEngine";
import {
  patientEducationFullGuideDocumentFixture,
  patientEducationQuickStartDocumentFixture,
} from "@/test/fixtures/patientEducationEngineFixture";

const approvedReviews = {
  healthLiteracy: "approved" as const,
  accessibility: "approved" as const,
  clinicalSafety: "approved" as const,
};

describe("patientEducationQualityEngine", () => {
  it("extracts content from structured blocks without exposing evidence identifiers as patient prose", () => {
    const text = extractPatientEducationPlainText(patientEducationQuickStartDocumentFixture);
    expect(text).toContain("Know the next action");
    expect(text).toContain("Organization-approved contact");
    expect(text).not.toContain("CLAIM-DEMO-STRUCTURE-1");
  });

  it("generates a deterministic version-bound report", () => {
    const report = analyzePatientEducationQuality(patientEducationQuickStartDocumentFixture, {
      generatedAt: "2026-07-18T13:30:00.000Z",
      humanReviews: approvedReviews,
      thresholds: {
        maximumReadingGrade: 20,
        minimumReadingEase: 0,
        minimumActionabilityScore: 0,
        minimumNumeracyScore: 0,
        minimumAccessibilityScore: 0,
      },
    });

    expect(report.reportId).toBe("CAF-PE-QA-CAF-PE-DOC-DEMO-QUICK-START-1-0-0-EN-US");
    expect(report.documentVersion).toBe(patientEducationQuickStartDocumentFixture.assetVersion);
    expect(report.generatedAt).toBe("2026-07-18T13:30:00.000Z");
    expect(report.metrics.readingGrade).toBeGreaterThanOrEqual(0);
    expect(report.metrics.readingEase).toBeGreaterThanOrEqual(0);
    expect(report.releaseDecision).toBe("passed");
  });

  it("never self-approves human review gates", () => {
    const report = analyzePatientEducationQuality(patientEducationQuickStartDocumentFixture, {
      generatedAt: "2026-07-18T13:30:00.000Z",
      thresholds: {
        maximumReadingGrade: 20,
        minimumReadingEase: 0,
        minimumActionabilityScore: 0,
        minimumNumeracyScore: 0,
        minimumAccessibilityScore: 0,
      },
    });

    expect(report.humanReviews).toEqual({
      healthLiteracy: "not_started",
      accessibility: "not_started",
      clinicalSafety: "not_started",
    });
    expect(report.releaseDecision).toBe("conditional");
  });

  it("blocks unresolved authoring placeholders", () => {
    const document = {
      ...patientEducationQuickStartDocumentFixture,
      blocks: patientEducationQuickStartDocumentFixture.blocks.map((block, index) => index === 1 && block.type === "paragraph"
        ? { ...block, text: "TODO insert reviewed instructions." }
        : block),
    };

    const report = analyzePatientEducationQuality(document, {
      generatedAt: "2026-07-18T13:30:00.000Z",
      humanReviews: approvedReviews,
      thresholds: {
        maximumReadingGrade: 20,
        minimumReadingEase: 0,
        minimumActionabilityScore: 0,
        minimumNumeracyScore: 0,
        minimumAccessibilityScore: 0,
      },
    });

    expect(report.releaseDecision).toBe("blocked");
    expect(report.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "QA-UNRESOLVED-PLACEHOLDER", severity: "blocking", blockId: "quick-intro" }),
    ]));
  });

  it("flags patient-facing numbers that have no unit or timeframe", () => {
    const document = {
      ...patientEducationQuickStartDocumentFixture,
      blocks: patientEducationQuickStartDocumentFixture.blocks.map((block, index) => index === 1 && block.type === "paragraph"
        ? { ...block, text: "Write down 4 before leaving." }
        : block),
    };

    const report = analyzePatientEducationQuality(document, {
      generatedAt: "2026-07-18T13:30:00.000Z",
      humanReviews: approvedReviews,
      thresholds: {
        maximumReadingGrade: 20,
        minimumReadingEase: 0,
        minimumActionabilityScore: 0,
        minimumNumeracyScore: 100,
        minimumAccessibilityScore: 0,
      },
    });

    expect(report.metrics.numeracyScore).toBeLessThan(100);
    expect(report.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "QA-NUMERACY-LOW", severity: "blocking" }),
    ]));
  });

  it("requires teach-back in a full guide as a quality finding", () => {
    const document = {
      ...patientEducationFullGuideDocumentFixture,
      blocks: patientEducationFullGuideDocumentFixture.blocks.map((block) => block.type === "action_list"
        ? { ...block, teachBackPrompt: undefined }
        : block),
    };

    const report = analyzePatientEducationQuality(document, {
      generatedAt: "2026-07-18T13:30:00.000Z",
      humanReviews: approvedReviews,
      thresholds: {
        maximumReadingGrade: 20,
        minimumReadingEase: 0,
        minimumActionabilityScore: 0,
        minimumNumeracyScore: 0,
        minimumAccessibilityScore: 0,
      },
    });

    expect(report.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "QA-TEACH-BACK-MISSING", severity: "warning" }),
    ]));
  });

  it("flags acronyms not included in the approved acronym registry", () => {
    const document = {
      ...patientEducationQuickStartDocumentFixture,
      blocks: patientEducationQuickStartDocumentFixture.blocks.map((block, index) => index === 1 && block.type === "paragraph"
        ? { ...block, text: "Use the XYZ route." }
        : block),
    };

    const report = analyzePatientEducationQuality(document, {
      generatedAt: "2026-07-18T13:30:00.000Z",
      humanReviews: approvedReviews,
      thresholds: {
        maximumReadingGrade: 20,
        minimumReadingEase: 0,
        minimumActionabilityScore: 0,
        minimumNumeracyScore: 0,
        minimumAccessibilityScore: 0,
      },
    });

    expect(report.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "QA-UNDEFINED-ACRONYM", message: expect.stringContaining("XYZ") }),
    ]));
  });
});
