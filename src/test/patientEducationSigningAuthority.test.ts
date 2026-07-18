import { describe, expect, it } from "vitest";
import { evaluatePatientEducationSignatures } from "@/lib/patientEducationSigningAuthority";

const payloadSha256 = "a".repeat(64);

const policy = {
  schemaVersion: "1.0.0" as const,
  policyId: "CAF-PE-SIGNING-POLICY-DEMO",
  trustedKeyIds: ["CAF-PE-KEY-RELEASE-ONE", "CAF-PE-KEY-RELEASE-TWO"],
  allowedAlgorithms: {
    test: ["ed25519" as const],
    preview: ["ed25519" as const],
    production: ["ed25519" as const],
  },
  minimumDistinctSignatures: {
    reproducibility_manifest: 1,
    release_bundle: 2,
    delivery_envelope: 1,
    control_notice: 2,
    audit_export: 1,
  },
  requireTrustedTimestampInProduction: true as const,
  requireCryptographicVerification: true as const,
};

const keys = ["ONE", "TWO"].map((suffix) => ({
  schemaVersion: "1.0.0" as const,
  keyId: `CAF-PE-KEY-RELEASE-${suffix}`,
  algorithm: "ed25519" as const,
  publicKeyRef: `kms-public-key://release-${suffix.toLowerCase()}`,
  organizationKey: "DEMO-HOSPITAL",
  environment: "production" as const,
  permittedScopes: ["release_bundle" as const, "control_notice" as const],
  status: "active" as const,
  validFrom: "2026-07-18T00:00:00.000Z",
  validUntil: "2027-07-18T00:00:00.000Z",
}));

const signatures = keys.map((key, index) => ({
  schemaVersion: "1.0.0" as const,
  signatureId: `CAF-PE-SIGNATURE-RELEASE-${index + 1}`,
  keyId: key.keyId,
  algorithm: "ed25519" as const,
  scope: "release_bundle" as const,
  payloadSha256,
  organizationKey: "DEMO-HOSPITAL",
  environment: "production" as const,
  signerPrincipalId: `CAF-PE-PRINCIPAL-SIGNER-${index + 1}`,
  signerRoleId: "release_signer",
  signedAt: "2026-07-18T17:00:00.000Z",
  detachedSignature: `c3ludGhldGljLXNpZ25hdHVyZS0w${index + 1}==`,
  trustedTimestampRef: `tsa://synthetic-${index + 1}`,
  certificateChainRefs: [`certificate://synthetic-${index + 1}`],
  cryptographicVerification: "verified" as const,
}));

describe("patientEducationSigningAuthority", () => {
  it("trusts a production release bundle signed by two distinct trusted keys", () => {
    const result = evaluatePatientEducationSignatures({
      payloadSha256,
      scope: "release_bundle",
      organizationKey: "DEMO-HOSPITAL",
      environment: "production",
      keys,
      signatures,
      policy,
      evaluatedAt: "2026-07-18T18:00:00.000Z",
    });
    expect(result.decision).toBe("trusted");
    expect(result.verifiedKeyIds).toHaveLength(2);
  });

  it("blocks a signature quorum that reuses one key", () => {
    const result = evaluatePatientEducationSignatures({
      payloadSha256,
      scope: "release_bundle",
      organizationKey: "DEMO-HOSPITAL",
      environment: "production",
      keys,
      signatures: signatures.map((signature) => ({ ...signature, keyId: keys[0].keyId })),
      policy,
      evaluatedAt: "2026-07-18T18:00:00.000Z",
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "SIGNATURE-QUORUM-NOT-MET" }),
    ]));
  });

  it("blocks revoked keys and missing trusted timestamps", () => {
    const result = evaluatePatientEducationSignatures({
      payloadSha256,
      scope: "release_bundle",
      organizationKey: "DEMO-HOSPITAL",
      environment: "production",
      keys: keys.map((key, index) => index === 0
        ? { ...key, status: "revoked" as const, revocationReason: "Synthetic compromise test." }
        : key),
      signatures: signatures.map((signature, index) => index === 1
        ? { ...signature, trustedTimestampRef: undefined }
        : signature),
      policy,
      evaluatedAt: "2026-07-18T18:00:00.000Z",
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "SIGNATURE-KEY-INACTIVE" }),
      expect.objectContaining({ code: "SIGNATURE-TRUSTED-TIMESTAMP-REQUIRED" }),
    ]));
  });

  it("blocks payload tampering and cross-organization signatures", () => {
    const result = evaluatePatientEducationSignatures({
      payloadSha256: "b".repeat(64),
      scope: "release_bundle",
      organizationKey: "OTHER-HOSPITAL",
      environment: "production",
      keys,
      signatures,
      policy,
      evaluatedAt: "2026-07-18T18:00:00.000Z",
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "SIGNATURE-PAYLOAD-BINDING-MISMATCH" }),
      expect.objectContaining({ code: "SIGNATURE-ORGANIZATION-MISMATCH" }),
    ]));
  });
});
