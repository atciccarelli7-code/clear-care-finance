import { describe, expect, it } from "vitest";
import { compilePatientEducationAsset } from "@/lib/patientEducationAssetCompiler";
import { patientEducationQuickStartDocumentFixture } from "@/test/fixtures/patientEducationEngineFixture";

describe("patient education asset compiler", () => {
  it("creates a controlled preview without PHI-capable fields or evidence anchors", () => {
    const compiled = compilePatientEducationAsset(
      patientEducationQuickStartDocumentFixture,
      "responsive_html",
      "controlled_preview",
    );

    expect(compiled.mimeType).toContain("text/html");
    expect(compiled.content).toContain("Distribution boundary:");
    expect(compiled.content).toContain("Organization-approved contact");
    expect(compiled.content).not.toContain("Patient-specific plan");
    expect(compiled.content).not.toContain("CLAIM-DEMO-STRUCTURE-1");
    expect(compiled.withheldBlockIds).toContain("quick-evidence");
    expect(compiled.checksum).toMatch(/^fnv1a-[a-f0-9]{8}$/);
  });

  it("preserves PHI-capable fields only for institutional delivery", () => {
    const compiled = compilePatientEducationAsset(
      patientEducationQuickStartDocumentFixture,
      "patient_portal_json",
      "institutional_delivery",
    );
    const parsed = JSON.parse(compiled.content);

    expect(JSON.stringify(parsed)).toContain("patient_specific_plan");
    expect(parsed.distributionBoundary).toBe("institutional_delivery");
  });

  it("withholds evidence anchors outside internal governance", () => {
    const institutional = compilePatientEducationAsset(
      patientEducationQuickStartDocumentFixture,
      "structured_text",
      "institutional_delivery",
    );
    expect(institutional.content).not.toContain("CLAIM-DEMO-STRUCTURE-1");
    expect(institutional.withheldBlockIds).toContain("quick-evidence");
  });

  it("renders evidence anchors for internal governance", () => {
    const internalDocument = {
      ...patientEducationQuickStartDocumentFixture,
      distributionBoundary: "internal_governance",
      blocks: patientEducationQuickStartDocumentFixture.blocks.filter((block) => block.type !== "personalization"),
    };
    const compiled = compilePatientEducationAsset(
      internalDocument,
      "structured_text",
      "internal_governance",
    );
    expect(compiled.content).toContain("CLAIM-DEMO-STRUCTURE-1");
  });

  it("blocks unsupported output targets", () => {
    expect(() => compilePatientEducationAsset(
      patientEducationQuickStartDocumentFixture,
      "avs_text",
      "institutional_delivery",
    )).toThrow(/does not support target/i);
  });
});
