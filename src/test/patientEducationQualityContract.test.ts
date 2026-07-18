import { describe, expect, it } from "vitest";
import { validatePatientEducationQualityReport } from "@/lib/patientEducationQualityContract";

const base = {
  schemaVersion: "1.0.0",
  reportId: "CAF-PE-QA-BLOOD-001",
  packageId: "CAF-PE-BLOOD-001",
  packageVersion: "1.0.0",
  documentId: "CAF-PE-DOC-BLOOD-001",
  documentVersion: "1.0.0",
  locale: "en-US",
  generatedAt: "2026-07-18T13:30:00.000Z",
  metrics: { readingGrade: 6.8, readingEase: 72, averageSentenceWords: 13, passiveVoicePercent: 4, actionabilityScore: 91, numeracyScore: 88, accessibilityScore: 96 },
  thresholds: { maximumReadingGrade: 8, minimumReadingEase: 60, minimumActionabilityScore: 80, minimumNumeracyScore: 80, minimumAccessibilityScore: 90 },
  findings: [],
  humanReviews: { healthLiteracy: "approved", accessibility: "approved", clinicalSafety: "approved" },
  releaseDecision: "passed",
} as const;

describe("patient education quality report", () => {
  it("passes only when automated thresholds and human reviews pass", () => {
    expect(validatePatientEducationQualityReport(base).success).toBe(true);
  });

  it("blocks a false pass when readability exceeds the threshold", () => {
    const result = validatePatientEducationQualityReport({ ...base, metrics: { ...base.metrics, readingGrade: 11.2 } });
    expect(result.success).toBe(false);
  });

  it("blocks a false pass when a human review is incomplete", () => {
    const result = validatePatientEducationQualityReport({ ...base, humanReviews: { ...base.humanReviews, accessibility: "in_review" } });
    expect(result.success).toBe(false);
  });
});
