import { describe, expect, it } from "vitest";
import { compilePatientEducationReleaseBundle } from "@/lib/patientEducationBundleCompiler";
import {
  buildPatientEducationIntegrityManifest,
  sha256Hex,
  verifyPatientEducationIntegrityManifest,
} from "@/lib/patientEducationIntegrityManifest";
import {
  patientEducationEngineDocumentsFixture,
  patientEducationEnginePackageFixture,
} from "@/test/fixtures/patientEducationEngineFixture";

const buildBundle = () => compilePatientEducationReleaseBundle({
  packageValue: patientEducationEnginePackageFixture,
  documents: patientEducationEngineDocumentsFixture,
  mode: "controlled_preview",
  generatedAt: "2026-07-18T14:30:00.000Z",
});

describe("patientEducationIntegrityManifest", () => {
  it("creates deterministic SHA-256 hashes for every compiled artifact", async () => {
    const bundle = buildBundle();
    const first = await buildPatientEducationIntegrityManifest(bundle);
    const second = await buildPatientEducationIntegrityManifest(bundle);

    expect(first).toEqual(second);
    expect(first.artifactCount).toBe(bundle.artifacts.length);
    expect(first.canonicalBundleSha256).toMatch(/^[a-f0-9]{64}$/);
    expect(first.artifacts.every((artifact) => /^[a-f0-9]{64}$/.test(artifact.sha256))).toBe(true);
    expect(first.artifacts.map((artifact) => artifact.path)).toEqual(
      [...first.artifacts.map((artifact) => artifact.path)].sort((a, b) => a.localeCompare(b)),
    );
  });

  it("uses UTF-8 byte length rather than JavaScript character count", async () => {
    const value = "Patient café information";
    const hash = await sha256Hex(value);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(new TextEncoder().encode(value).byteLength).toBeGreaterThan(value.length);
  });

  it("verifies an unchanged release bundle", async () => {
    const bundle = buildBundle();
    const manifest = await buildPatientEducationIntegrityManifest(bundle);
    const verification = await verifyPatientEducationIntegrityManifest(bundle, manifest);
    expect(verification.valid).toBe(true);
    expect(verification.issues).toEqual([]);
  });

  it("detects artifact content tampering", async () => {
    const bundle = buildBundle();
    const manifest = await buildPatientEducationIntegrityManifest(bundle);
    const tampered = {
      ...bundle,
      artifacts: bundle.artifacts.map((artifact, index) => index === 0
        ? { ...artifact, content: `${artifact.content}\nUnauthorized change` }
        : artifact),
    };

    const verification = await verifyPatientEducationIntegrityManifest(tampered, manifest);
    expect(verification.valid).toBe(false);
    expect(verification.issues.join(" ")).toContain("mismatch");
  });

  it("rejects duplicate output paths before signing the bundle", async () => {
    const bundle = buildBundle();
    const duplicated = {
      ...bundle,
      artifacts: [...bundle.artifacts, { ...bundle.artifacts[0] }],
    };
    await expect(buildPatientEducationIntegrityManifest(duplicated)).rejects.toThrow("Duplicate patient education artifact path");
  });
});
