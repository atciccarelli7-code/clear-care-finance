import { describe, expect, it } from "vitest";
import { validatePatientEducationContentDocument } from "@/lib/patientEducationContentContract";
import {
  patientEducationFullGuideDocumentFixture,
  patientEducationQuickStartDocumentFixture,
} from "@/test/fixtures/patientEducationEngineFixture";

describe("patient education content contract", () => {
  it("accepts a complete institutional full-guide structure", () => {
    const result = validatePatientEducationContentDocument(patientEducationFullGuideDocumentFixture);
    expect(result.success).toBe(true);
  });

  it("rejects a full guide when a required operational section is missing", () => {
    const value = {
      ...patientEducationFullGuideDocumentFixture,
      blocks: patientEducationFullGuideDocumentFixture.blocks.filter((block) => block.sectionId !== "plan_breaks"),
    };
    const result = validatePatientEducationContentDocument(value);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.map((issue) => issue.message).join(" ")).toMatch(/plan_breaks/i);
  });

  it("rejects restricted content inside a controlled-preview document", () => {
    const value = {
      ...patientEducationFullGuideDocumentFixture,
      distributionBoundary: "controlled_preview",
    };
    const result = validatePatientEducationContentDocument(value);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.map((issue) => issue.message).join(" ")).toMatch(/restricted block/i);
  });

  it("requires PHI-capable personalization to remain institutional", () => {
    const value = {
      ...patientEducationQuickStartDocumentFixture,
      distributionBoundary: "internal_governance",
    };
    const result = validatePatientEducationContentDocument(value);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.map((issue) => issue.message).join(" ")).toMatch(/PHI-capable field/i);
  });

  it("rejects emergency callouts without an explicit action", () => {
    const value = {
      ...patientEducationFullGuideDocumentFixture,
      blocks: patientEducationFullGuideDocumentFixture.blocks.map((block) => (
        block.type === "callout" ? { ...block, action: undefined } : block
      )),
    };
    const result = validatePatientEducationContentDocument(value);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.map((issue) => issue.message).join(" ")).toMatch(/Emergency callout.*explicit action/i);
  });

  it("rejects duplicate block identifiers", () => {
    const duplicate = patientEducationQuickStartDocumentFixture.blocks[0];
    const value = {
      ...patientEducationQuickStartDocumentFixture,
      blocks: [...patientEducationQuickStartDocumentFixture.blocks, duplicate],
    };
    const result = validatePatientEducationContentDocument(value);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.map((issue) => issue.message).join(" ")).toMatch(/unique/i);
  });
});
