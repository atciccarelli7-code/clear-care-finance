import { describe, expect, it } from "vitest";
import { evaluatePatientEducationException } from "@/lib/patientEducationExceptionPolicy";

const policy = {
  schemaVersion: "1.0.0" as const,
  policyId: "CAF-PE-EXCEPTION-POLICY-DEMO",
  nonWaivableControls: [
    "clinical_safety_review",
    "localization_human_review",
    "privacy_boundary",
    "organization_isolation",
    "output_integrity",
    "release_hash_binding",
    "recall_execution",
  ] as const,
  maximumDurationHours: {
    low: 168,
    moderate: 72,
    high: 24,
    critical: 0,
  },
  requiredApproverRoleIds: {
    low: ["product_owner"],
    moderate: ["product_owner"],
    high: ["clinical_safety_owner", "privacy_owner"],
    critical: ["clinical_safety_owner", "executive_accountable_owner"],
  },
  requireDistinctPrincipals: true as const,
  allowProductionExceptions: false,
  requireVerifiedCompensatingControls: true,
};

const approvedException = {
  schemaVersion: "1.0.0" as const,
  exceptionId: "CAF-PE-EXCEPTION-DEMO",
  packageId: "CAF-PE-DEMO-SAFETY",
  packageVersion: "1.0.0",
  contentHash: "a".repeat(64),
  organizationKey: "DEMO-HOSPITAL",
  targetStatus: "pilot_ready" as const,
  controlId: "patient_testing" as const,
  riskTier: "high" as const,
  reason: "A synthetic pilot fixture requires a short controlled delay in one noncritical testing gate.",
  riskAssessment: "The synthetic fixture cannot be used for care and remains isolated from production distribution.",
  compensatingControls: [
    {
      controlRef: "CONTROL://synthetic-only",
      ownerRoleId: "clinical_safety_owner",
      verificationMethod: "Confirm all artifacts are labeled synthetic and blocked from production destinations.",
      verifiedAt: "2026-07-18T16:00:00.000Z",
    },
  ],
  requestedAt: "2026-07-18T15:00:00.000Z",
  effectiveAt: "2026-07-18T16:00:00.000Z",
  expiresAt: "2026-07-19T16:00:00.000Z",
  status: "approved" as const,
  approvals: [
    {
      approvalId: "CAF-PE-EXCEPTION-APPROVAL-CLINICAL",
      principalId: "CAF-PE-PRINCIPAL-CLINICAL",
      roleId: "clinical_safety_owner",
      principalType: "human" as const,
      decision: "approved" as const,
      rationale: "Synthetic-only control is adequate for the limited pilot fixture.",
      approvedAt: "2026-07-18T15:30:00.000Z",
    },
    {
      approvalId: "CAF-PE-EXCEPTION-APPROVAL-PRIVACY",
      principalId: "CAF-PE-PRINCIPAL-PRIVACY",
      roleId: "privacy_owner",
      principalType: "human" as const,
      decision: "approved" as const,
      rationale: "No patient data or production destination is involved.",
      approvedAt: "2026-07-18T15:35:00.000Z",
    },
  ],
};

describe("patientEducationExceptionPolicy", () => {
  it("allows a short, independently approved, synthetic pilot exception", () => {
    const result = evaluatePatientEducationException({
      request: approvedException,
      policy,
      evaluatedAt: "2026-07-18T17:00:00.000Z",
    });
    expect(result.decision).toBe("effective");
    expect(result.findings).toEqual([]);
  });

  it("blocks exceptions for non-waivable controls", () => {
    const result = evaluatePatientEducationException({
      request: { ...approvedException, controlId: "privacy_boundary" },
      policy,
      evaluatedAt: "2026-07-18T17:00:00.000Z",
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "EXCEPTION-CONTROL-NON-WAIVABLE" }),
    ]));
  });

  it("blocks production exceptions", () => {
    const result = evaluatePatientEducationException({
      request: { ...approvedException, targetStatus: "released" },
      policy,
      evaluatedAt: "2026-07-18T17:00:00.000Z",
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "EXCEPTION-PRODUCTION-PROHIBITED" }),
    ]));
  });

  it("blocks duplicate approvers and unverified compensating controls", () => {
    const result = evaluatePatientEducationException({
      request: {
        ...approvedException,
        compensatingControls: approvedException.compensatingControls.map(({ verifiedAt: _verifiedAt, ...control }) => control),
        approvals: approvedException.approvals.map((approval) => ({
          ...approval,
          principalId: "CAF-PE-PRINCIPAL-SHARED",
        })),
      },
      policy,
      evaluatedAt: "2026-07-18T17:00:00.000Z",
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "EXCEPTION-DISTINCT-PRINCIPALS-REQUIRED" }),
      expect.objectContaining({ code: "EXCEPTION-COMPENSATING-CONTROL-UNVERIFIED" }),
    ]));
  });

  it("blocks critical-risk exceptions", () => {
    const result = evaluatePatientEducationException({
      request: {
        ...approvedException,
        riskTier: "critical" as const,
        expiresAt: approvedException.effectiveAt,
      },
      policy,
      evaluatedAt: "2026-07-18T17:00:00.000Z",
    });
    expect(result.decision).toBe("blocked");
  });
});
