import { describe, expect, it } from "vitest";
import {
  authorizePatientEducationAction,
  patientEducationActorSchema,
  patientEducationSigningKeySchema,
  validatePatientEducationSigningKeyUse,
} from "@/lib/patientEducationAuthorityContract";

const actor = {
  schemaVersion: "1.0.0" as const,
  actorId: "CAF-PE-ACTOR-RELEASE-001",
  subjectRef: "identity://synthetic-release-manager",
  roles: ["release_manager" as const],
  organizationScopes: [{
    organizationKey: "SYNTHETIC-HOSPITAL",
    environments: ["pilot" as const],
    packageIds: ["CAF-PE-DEMO-SAFETY"],
    permissions: ["release.authorize" as const, "delivery.issue" as const],
  }],
  status: "active" as const,
  authenticatedAt: "2026-07-18T12:00:00.000Z",
  authenticationStrength: "multi_factor" as const,
  sessionExpiresAt: "2026-07-18T14:00:00.000Z",
};

const key = {
  schemaVersion: "1.0.0" as const,
  keyId: "CAF-PE-KEY-PILOT-001",
  algorithm: "Ed25519" as const,
  publicKeyFingerprint: "a".repeat(64),
  status: "active" as const,
  purpose: "release_manifest" as const,
  environment: "pilot" as const,
  createdAt: "2026-07-18T10:00:00.000Z",
  activatesAt: "2026-07-18T11:00:00.000Z",
  expiresAt: "2027-07-18T11:00:00.000Z",
};

describe("patient education authority contract", () => {
  it("authorizes only exact organization, environment, package, and permission scope", () => {
    const result = authorizePatientEducationAction({
      actorInput: actor,
      organizationKey: "SYNTHETIC-HOSPITAL",
      environment: "pilot",
      permission: "release.authorize",
      packageId: "CAF-PE-DEMO-SAFETY",
      at: "2026-07-18T13:00:00.000Z",
    });
    expect(result.authorized).toBe(true);
  });

  it("rejects cross-organization and cross-environment authority", () => {
    const result = authorizePatientEducationAction({
      actorInput: actor,
      organizationKey: "OTHER-HOSPITAL",
      environment: "production",
      permission: "release.authorize",
      packageId: "CAF-PE-DEMO-SAFETY",
      at: "2026-07-18T13:00:00.000Z",
    });
    expect(result.authorized).toBe(false);
    expect(result.findings).toContain("AUTHORITY-ORGANIZATION-OUT-OF-SCOPE");
  });

  it("requires stronger authentication for release authority", () => {
    const parsed = patientEducationActorSchema.safeParse({ ...actor, authenticationStrength: "single_factor" });
    expect(parsed.success).toBe(false);
  });

  it("rejects expired sessions", () => {
    const result = authorizePatientEducationAction({
      actorInput: actor,
      organizationKey: "SYNTHETIC-HOSPITAL",
      environment: "pilot",
      permission: "release.authorize",
      at: "2026-07-18T15:00:00.000Z",
    });
    expect(result.findings).toContain("AUTHORITY-SESSION-EXPIRED");
  });

  it("validates exact key purpose, environment, and active window", () => {
    expect(validatePatientEducationSigningKeyUse({
      keyInput: key,
      purpose: "release_manifest",
      environment: "pilot",
      at: "2026-07-18T13:00:00.000Z",
    }).valid).toBe(true);
    expect(validatePatientEducationSigningKeyUse({
      keyInput: key,
      purpose: "delivery_envelope",
      environment: "production",
      at: "2028-07-18T13:00:00.000Z",
    }).findings).toEqual(expect.arrayContaining([
      "SIGNING-KEY-PURPOSE-MISMATCH",
      "SIGNING-KEY-ENVIRONMENT-MISMATCH",
      "SIGNING-KEY-EXPIRED",
    ]));
  });

  it("requires revocation provenance", () => {
    expect(patientEducationSigningKeySchema.safeParse({ ...key, status: "revoked" }).success).toBe(false);
  });
});
