import { describe, expect, it } from "vitest";
import { compilePatientEducationReleaseBundle } from "@/lib/patientEducationBundleCompiler";
import {
  patientEducationEngineDocumentsFixture,
  patientEducationEnginePackageFixture,
} from "@/test/fixtures/patientEducationEngineFixture";

describe("patient education release bundle compiler", () => {
  it("creates a controlled preview containing only public-safe assets", () => {
    const bundle = compilePatientEducationReleaseBundle({
      packageValue: patientEducationEnginePackageFixture,
      documents: patientEducationEngineDocumentsFixture,
      mode: "controlled_preview",
      generatedAt: "2026-07-18T13:00:00.000Z",
    });

    expect(bundle.bundleId).toContain("controlled_preview");
    expect(bundle.manifest.assets.map((asset) => asset.assetId)).toEqual(["CAF-PE-DEMO-QUICK-START"]);
    expect(bundle.withheldAssetIds).toEqual(expect.arrayContaining(["CAF-PE-DEMO-FULL-GUIDE", "CAF-PE-DEMO-AVS"]));
    expect(bundle.artifacts).toHaveLength(4);
    expect(bundle.artifacts.every((artifact) => artifact.assetId === "CAF-PE-DEMO-QUICK-START")).toBe(true);
    expect(JSON.stringify(bundle)).not.toContain("reviewer://rn-clinical-editor-001");
    expect(JSON.stringify(bundle)).not.toContain("Patient-specific plan");
  });

  it("creates a multi-channel institutional delivery bundle", () => {
    const bundle = compilePatientEducationReleaseBundle({
      packageValue: patientEducationEnginePackageFixture,
      documents: patientEducationEngineDocumentsFixture,
      mode: "institutional_delivery",
      generatedAt: "2026-07-18T13:00:00.000Z",
    });

    expect(bundle.artifacts.map((artifact) => artifact.target)).toEqual(expect.arrayContaining([
      "responsive_html",
      "print_html",
      "structured_text",
      "patient_portal_json",
      "avs_text",
    ]));
    expect(bundle.assetIndex.find((asset) => asset.assetId === "CAF-PE-DEMO-FULL-GUIDE")?.artifactPaths.length).toBe(4);
    expect(bundle.artifacts.every((artifact) => artifact.path.includes("/v1.0.0/"))).toBe(true);
    expect(new Set(bundle.artifacts.map((artifact) => artifact.checksum)).size).toBe(bundle.artifacts.length);
  });

  it("blocks institutional delivery before all release gates pass", () => {
    const packageValue = {
      ...patientEducationEnginePackageFixture,
      status: "internal_review",
      releaseGates: {
        ...patientEducationEnginePackageFixture.releaseGates,
        patient_testing: "in_progress",
      },
    };

    expect(() => compilePatientEducationReleaseBundle({
      packageValue,
      documents: patientEducationEngineDocumentsFixture,
      mode: "institutional_delivery",
    })).toThrow(/pilot-ready or released/i);
  });

  it("blocks mismatched document and package versions", () => {
    const documents = patientEducationEngineDocumentsFixture.map((document) => (
      document.assetId === "CAF-PE-DEMO-AVS" ? { ...document, assetVersion: "1.0.1" } : document
    ));

    expect(() => compilePatientEducationReleaseBundle({
      packageValue: patientEducationEnginePackageFixture,
      documents,
      mode: "institutional_delivery",
    })).toThrow(/does not match asset version/i);
  });

  it("blocks duplicate content documents for the same asset", () => {
    expect(() => compilePatientEducationReleaseBundle({
      packageValue: patientEducationEnginePackageFixture,
      documents: [...patientEducationEngineDocumentsFixture, patientEducationEngineDocumentsFixture[0]],
      mode: "institutional_delivery",
    })).toThrow(/Multiple content documents/i);
  });
});
