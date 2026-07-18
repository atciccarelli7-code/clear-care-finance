import { describe, expect, it } from "vitest";
import {
  evaluatePatientEducationAuthority,
  type PatientEducationAuthorityEvaluationRequest,
} from "@/lib/patientEducationAuthorityPolicy";

const evaluatedAt = "2026-07-18T15:00:00.000Z";
const contentHash = "a".repeat(64);

const roles = [
  {
    roleId: "clinical_reviewer",
    label: "Clinical reviewer",
    authorityScopes: ["clinical_review"] as const,
    organizationScope: "caf_global" as const,
    canApproveOwnWork: false,
    active: true,
  },
  {
    roleId: "release_authority",
    label: "Release authority",
    authorityScopes: ["release_authorization"] as const,
    organizationScope: "caf_global" as const,
    canApproveOwnWork: false,
    active: true,
  },
];

const principals = [
  {
    principalId: "CAF-PE-PRINCIPAL-CLINICAL-ONE",
    principalType: "human" as const,
    organizationKey: "CAF-GLOBAL",
    identityRef: "identity://clinical-one",
    roleIds: ["clinical_reviewer"],
    status: "active" as const,
    authenticatedAt: "2026-07-18T14:00:00.000Z",
    credentialExpiresAt: "2026-07-19T14:00:00.000Z",
    mfaVerified: true,
  },
  {
    principalId: "CAF-PE-PRINCIPAL-RELEASE-ONE",
    principalType: "human" as const,
    organizationKey: "CAF-GLOBAL",
    identityRef: "identity://release-one",
    roleIds: ["release_authority"],
    status: "active" as const,
    authenticatedAt: "2026-07-18T14:00:00.000Z",
    credentialExpiresAt: "2026-07-19T14:00:00.000Z",
    mfaVerified: true,
  },
];

const approvals = [
  {
    approvalId: "CAF-PE-APPROVAL-CLINICAL-ONE",
    principalId: "CAF-PE-PRINCIPAL-CLINICAL-ONE",
    roleId: "clinical_reviewer",
    scope: "clinical_review" as const,
    packageId: "CAF-PE-DEMO-SAFETY",
    packageVersion: "1.0.0",
    contentHash,
    organizationKey: "DEMO-HOSPITAL",
    decision: "approved" as const,
    rationale: "Synthetic clinical review completed.",
    approvedAt: "2026-07-18T14:15:00.000Z",
    expiresAt: "2026-07-19T14:15:00.000Z",
    evidenceRefs: ["QA://demo"],
  },
  {
    approvalId: "CAF-PE-APPROVAL-RELEASE-ONE",
    principalId: "CAF-PE-PRINCIPAL-RELEASE-ONE",
    roleId: "release_authority",
    scope: "release_authorization" as const,
    packageId: "CAF-PE-DEMO-SAFETY",
    packageVersion: "1.0.0",
    contentHash,
    organizationKey: "DEMO-HOSPITAL",
    decision: "approved" as const,
    rationale: "Synthetic release authorization completed.",
    approvedAt: "2026-07-18T14:30:00.000Z",
    expiresAt: "2026-07-19T14:30:00.000Z",
    evidenceRefs: ["AUTH://demo"],
  },
];

const baseRequest: PatientEducationAuthorityEvaluationRequest = {
  schemaVersion: "1.0.0",
  evaluationId: "CAF-PE-AUTHORITY-EVAL-DEMO",
  packageId: "CAF-PE-DEMO-SAFETY",
  packageVersion: "1.0.0",
  contentHash,
  organizationKey: "DEMO-HOSPITAL",
  evaluatedAt,
  authorPrincipalId: "CAF-PE-PRINCIPAL-AUTHOR",
  requestedScopes: ["clinical_review", "release_authorization"],
  policy: {
    schemaVersion: "1.0.0",
    policyId: "CAF-PE-AUTHORITY-POLICY-HIGH-RISK",
    packageRiskTier: "high",
    requireMfaForHumanApprovals: true,
    maximumApprovalAgeHours: 24,
    requiredApprovals: [
      {
        scope: "clinical_review",
        minimumApprovals: 1,
        allowedRoleIds: ["clinical_reviewer"],
        requireDistinctPrincipals: true,
      },
      {
        scope: "release_authorization",
        minimumApprovals: 1,
        allowedRoleIds: ["release_authority"],
        requireDistinctPrincipals: true,
      },
    ],
    separationOfDutyRules: [
      {
        leftScope: "clinical_review",
        rightScope: "release_authorization",
        reason: "Clinical review and final release authorization must be independent.",
      },
    ],
    nonHumanApprovalScopes: [],
  },
  roles: roles.map((role) => ({ ...role, authorityScopes: [...role.authorityScopes] })),
  principals,
  approvals,
};

describe("patientEducationAuthorityPolicy", () => {
  it("authorizes exact-version approvals from distinct authenticated principals", () => {
    const result = evaluatePatientEducationAuthority(baseRequest);
    expect(result.decision).toBe("authorized");
    expect(result.findings).toEqual([]);
    expect(result.verifiedApprovalIds).toHaveLength(2);
  });

  it("blocks separation-of-duties violations", () => {
    const sharedPrincipal = {
      ...principals[0],
      roleIds: ["clinical_reviewer", "release_authority"],
    };
    const result = evaluatePatientEducationAuthority({
      ...baseRequest,
      principals: [sharedPrincipal],
      approvals: approvals.map((approval) => ({
        ...approval,
        principalId: sharedPrincipal.principalId,
      })),
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "AUTHORITY-SEPARATION-OF-DUTIES-VIOLATION" }),
    ]));
  });

  it("blocks expired credentials and stale approvals", () => {
    const result = evaluatePatientEducationAuthority({
      ...baseRequest,
      principals: principals.map((principal, index) => index === 0
        ? { ...principal, credentialExpiresAt: "2026-07-18T14:59:59.000Z" }
        : principal),
      approvals: approvals.map((approval, index) => index === 1
        ? { ...approval, approvedAt: "2026-07-16T14:30:00.000Z" }
        : approval),
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "AUTHORITY-CREDENTIAL-EXPIRED" }),
      expect.objectContaining({ code: "AUTHORITY-APPROVAL-STALE" }),
    ]));
  });

  it("blocks cross-organization approvals", () => {
    const result = evaluatePatientEducationAuthority({
      ...baseRequest,
      approvals: approvals.map((approval) => ({ ...approval, organizationKey: "OTHER-HOSPITAL" })),
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "AUTHORITY-ORGANIZATION-SCOPE-MISMATCH" }),
    ]));
  });

  it("blocks self-approval where the role prohibits it", () => {
    const result = evaluatePatientEducationAuthority({
      ...baseRequest,
      authorPrincipalId: principals[0].principalId,
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "AUTHORITY-SELF-APPROVAL-PROHIBITED" }),
    ]));
  });
});
