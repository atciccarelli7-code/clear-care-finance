import { describe, expect, it } from "vitest";
import {
  buildPatientEducationGovernanceProfile,
  evaluatePatientEducationGovernanceProfile,
} from "@/lib/patientEducationGovernanceProfile";

const requiredPolicyTypes = [
  "authority",
  "organization_isolation",
  "evidence_freshness",
  "quality_thresholds",
  "exception",
  "signing",
  "schema_migration",
  "operational_slo",
  "incident_response",
  "resilience_retention",
  "audit_export",
  "localization",
  "release_state_machine",
  "distribution_control",
] as const;

const unsignedProfile = {
  schemaVersion: "1.0.0" as const,
  profileId: "CAF-PE-GOVERNANCE-PROFILE-DEMO",
  profileVersion: "1.0.0",
  packageId: "CAF-PE-DEMO-SAFETY",
  packageVersion: "1.0.0",
  organizationKey: "DEMO-HOSPITAL",
  environment: "production" as const,
  riskTier: "high" as const,
  effectiveAt: "2026-07-18T00:00:00.000Z",
  expiresAt: "2027-07-18T00:00:00.000Z",
  policyReferences: requiredPolicyTypes.map((policyType, index) => ({
    policyType,
    policyId: `CAF-PE-${policyType.replaceAll("_", "-").toUpperCase()}-POLICY-DEMO`,
    policyVersion: "1.0.0",
    policySha256: index.toString(16).padStart(64, "a").slice(-64),
    sourceRef: `private-policy://${policyType}`,
    status: "active" as const,
    effectiveAt: "2026-07-18T00:00:00.000Z",
    expiresAt: "2027-07-18T00:00:00.000Z",
    allowedEnvironments: ["production" as const],
    allowedRiskTiers: ["high" as const],
    organizationKeys: ["DEMO-HOSPITAL"],
    signatureEnvelopeRefs: [`CAF-PE-SIGNATURE-POLICY-${index + 1}`],
  })),
  requiredPolicyTypes: [...requiredPolicyTypes],
  createdByPrincipalId: "CAF-PE-PRINCIPAL-GOVERNANCE-OWNER",
  createdAt: "2026-07-18T00:00:00.000Z",
  profileSignatureRefs: ["CAF-PE-SIGNATURE-GOVERNANCE-PROFILE"],
  claimsBoundary: ["Synthetic governance profile; not approved for patient care."],
};

describe("patientEducationGovernanceProfile", () => {
  it("activates a complete, signed, exact-scope production governance profile", () => {
    const profile = buildPatientEducationGovernanceProfile(unsignedProfile);
    const result = evaluatePatientEducationGovernanceProfile({
      profile,
      packageId: "CAF-PE-DEMO-SAFETY",
      packageVersion: "1.0.0",
      organizationKey: "DEMO-HOSPITAL",
      environment: "production",
      riskTier: "high",
      evaluatedAt: "2026-07-18T12:00:00.000Z",
    });
    expect(result.decision).toBe("active");
    expect(result.verifiedPolicyIds).toHaveLength(requiredPolicyTypes.length);
  });

  it("blocks a missing required policy", () => {
    const profile = buildPatientEducationGovernanceProfile({
      ...unsignedProfile,
      policyReferences: unsignedProfile.policyReferences.slice(1),
    });
    const result = evaluatePatientEducationGovernanceProfile({
      profile,
      packageId: "CAF-PE-DEMO-SAFETY",
      packageVersion: "1.0.0",
      organizationKey: "DEMO-HOSPITAL",
      environment: "production",
      riskTier: "high",
      evaluatedAt: "2026-07-18T12:00:00.000Z",
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "GOVERNANCE-POLICY-MISSING", policyType: "authority" }),
    ]));
  });

  it("blocks unsigned, inactive, or mismatched production policy references", () => {
    const profile = buildPatientEducationGovernanceProfile({
      ...unsignedProfile,
      policyReferences: unsignedProfile.policyReferences.map((reference, index) => index === 0
        ? {
          ...reference,
          status: "suspended" as const,
          allowedRiskTiers: ["moderate" as const],
          organizationKeys: ["OTHER-HOSPITAL"],
          signatureEnvelopeRefs: [],
        }
        : reference),
    });
    const result = evaluatePatientEducationGovernanceProfile({
      profile,
      packageId: "CAF-PE-DEMO-SAFETY",
      packageVersion: "1.0.0",
      organizationKey: "DEMO-HOSPITAL",
      environment: "production",
      riskTier: "high",
      evaluatedAt: "2026-07-18T12:00:00.000Z",
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "GOVERNANCE-POLICY-INACTIVE" }),
      expect.objectContaining({ code: "GOVERNANCE-POLICY-APPLICABILITY-MISMATCH" }),
      expect.objectContaining({ code: "GOVERNANCE-POLICY-ORGANIZATION-MISMATCH" }),
      expect.objectContaining({ code: "GOVERNANCE-POLICY-SIGNATURE-MISSING" }),
    ]));
  });

  it("detects profile tampering", () => {
    const profile = buildPatientEducationGovernanceProfile(unsignedProfile);
    const result = evaluatePatientEducationGovernanceProfile({
      profile: { ...profile, riskTier: "critical" },
      packageId: "CAF-PE-DEMO-SAFETY",
      packageVersion: "1.0.0",
      organizationKey: "DEMO-HOSPITAL",
      environment: "production",
      riskTier: "critical",
      evaluatedAt: "2026-07-18T12:00:00.000Z",
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "GOVERNANCE-PROFILE-HASH-MISMATCH" }),
    ]));
  });
});
