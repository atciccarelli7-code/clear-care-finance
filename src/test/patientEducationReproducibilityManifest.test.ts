import { describe, expect, it } from "vitest";
import {
  buildPatientEducationReproducibilityManifest,
  verifyPatientEducationReproducibilityManifest,
} from "@/lib/patientEducationReproducibilityManifest";

const unsignedManifest = {
  schemaVersion: "1.0.0" as const,
  manifestId: "CAF-PE-REPRO-DEMO",
  packageId: "CAF-PE-DEMO-SAFETY",
  packageVersion: "1.0.0",
  generatedAt: "2026-07-18T17:00:00.000Z",
  sourceRepository: "private-repository://caf-patient-education",
  sourceCommitSha: "a".repeat(40),
  sourceBranchOrTag: "release/demo-v1.0.0",
  cleanSourceTreeRequired: true as const,
  buildEnvironment: "test" as const,
  runtime: {
    nodeVersion: "24.0.0",
    operatingSystem: "linux",
    architecture: "x64",
  },
  dependencyLock: {
    path: "package-lock.json",
    sha256: "b".repeat(64),
    packageManager: "npm",
    packageManagerVersion: "11.0.0",
  },
  compiler: {
    name: "CAF Patient Education Compiler",
    version: "1.0.0",
    codeSha256: "c".repeat(64),
  },
  schemaVersions: {
    package: "1.0.0",
    content: "1.0.0",
  },
  sourceObjects: [
    {
      objectType: "document" as const,
      objectId: "CAF-PE-DOC-DEMO",
      version: "1.0.0",
      sha256: "d".repeat(64),
      classification: "caf_confidential" as const,
    },
    {
      objectType: "package" as const,
      objectId: "CAF-PE-DEMO-SAFETY",
      version: "1.0.0",
      sha256: "e".repeat(64),
      classification: "caf_confidential" as const,
    },
  ],
  buildCommands: ["npm ci", "npm run patient-education:compile"],
  environmentVariableNames: ["CAF_BUILD_ENVIRONMENT", "CAF_SIGNING_KEY_ID"],
  prohibitedInlineSecrets: true as const,
  outputIntegrityManifestId: "CAF-PE-INTEGRITY-DEMO",
  outputBundleSha256: "f".repeat(64),
};

describe("patientEducationReproducibilityManifest", () => {
  it("builds and verifies a canonical reproducibility manifest", () => {
    const manifest = buildPatientEducationReproducibilityManifest(unsignedManifest);
    expect(manifest.manifestSha256).toMatch(/^[a-f0-9]{64}$/);
    expect(verifyPatientEducationReproducibilityManifest(manifest)).toEqual(expect.objectContaining({ valid: true }));
  });

  it("produces the same digest regardless of source-object and map insertion order", () => {
    const left = buildPatientEducationReproducibilityManifest(unsignedManifest);
    const right = buildPatientEducationReproducibilityManifest({
      ...unsignedManifest,
      sourceObjects: [...unsignedManifest.sourceObjects].reverse(),
      schemaVersions: {
        content: "1.0.0",
        package: "1.0.0",
      },
      environmentVariableNames: [...unsignedManifest.environmentVariableNames].reverse(),
    });
    expect(right.manifestSha256).toBe(left.manifestSha256);
  });

  it("detects tampering with source provenance", () => {
    const manifest = buildPatientEducationReproducibilityManifest(unsignedManifest);
    const result = verifyPatientEducationReproducibilityManifest({
      ...manifest,
      sourceCommitSha: "9".repeat(40),
    });
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/SHA-256/i);
  });

  it("rejects duplicate source objects", () => {
    expect(() => buildPatientEducationReproducibilityManifest({
      ...unsignedManifest,
      sourceObjects: [unsignedManifest.sourceObjects[0], unsignedManifest.sourceObjects[0]],
    })).toThrow(/unique/i);
  });
});
