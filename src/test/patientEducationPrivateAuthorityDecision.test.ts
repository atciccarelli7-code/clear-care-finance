import { describe, expect, it } from "vitest";
import { evaluatePatientEducationPrivateAuthority } from "@/lib/patientEducationPrivateAuthorityDecision";

const candidateSha256 = "a".repeat(64);
const evaluatedAt = "2026-07-18T20:00:00.000Z";
const recentAt = "2026-07-18T19:30:00.000Z";

const productionInput = {
  schemaVersion: "1.0.0" as const,
  decisionId: "CAF-PE-PRIVATE-AUTHORITY-DEMO",
  packageId: "CAF-PE-DEMO-SAFETY",
  packageVersion: "1.0.0",
  candidateSha256,
  organizationKey: "DEMO-HOSPITAL",
  environment: "production" as const,
  targetStatus: "released" as const,
  evaluatedAt,
  governanceProfile: {
    evidenceRef: "governance-profile://demo",
    evaluatedAt: recentAt,
    profileId: "CAF-PE-GOVERNANCE-PROFILE-DEMO",
    profileSha256: "b".repeat(64),
    decision: "active" as const,
  },
  evidenceFreshness: {
    evidenceRef: "evidence-freshness://demo",
    evaluatedAt: recentAt,
    dossierId: "DOSSIER-DEMO-SAFETY-1",
    state: "current" as const,
  },
  reviewWorkflow: {
    evidenceRef: "review-workflow://demo",
    evaluatedAt: recentAt,
    workflowId: "CAF-PE-REVIEW-WORKFLOW-DEMO",
    contentHash: candidateSha256,
    decision: "approved" as const,
  },
  authorityEvaluation: {
    evidenceRef: "authority-evaluation://demo",
    evaluatedAt: recentAt,
    authorityEvaluationId: "CAF-PE-AUTHORITY-EVAL-DEMO",
    contentHash: candidateSha256,
    decision: "authorized" as const,
    verifiedPrincipalIds: ["CAF-PE-PRINCIPAL-CLINICAL", "CAF-PE-PRINCIPAL-RELEASE"],
    verifiedApprovalIds: ["CAF-PE-APPROVAL-CLINICAL", "CAF-PE-APPROVAL-RELEASE"],
  },
  organizationIsolation: {
    evidenceRef: "organization-isolation://demo",
    evaluatedAt: recentAt,
    requestId: "CAF-PE-ACCESS-DEMO",
    resourceId: "CAF-PE-RESOURCE-RELEASE-BUNDLE",
    resourceOrganizationKey: "DEMO-HOSPITAL",
    decision: "allowed" as const,
  },
  releaseAuthorization: {
    evidenceRef: "release-authorization://demo",
    evaluatedAt: recentAt,
    authorizationId: "CAF-PE-AUTH-DEMO",
    contentHash: candidateSha256,
    decision: "authorized" as const,
  },
  reproducibility: {
    evidenceRef: "reproducibility://demo",
    evaluatedAt: recentAt,
    manifestId: "CAF-PE-REPRO-DEMO",
    manifestSha256: "c".repeat(64),
    sourceCommitSha: "d".repeat(40),
    outputBundleSha256: candidateSha256,
    valid: true,
    cleanSourceTree: true,
  },
  signatureVerification: {
    evidenceRef: "signature-verification://demo",
    evaluatedAt: recentAt,
    payloadSha256: candidateSha256,
    scope: "release_bundle" as const,
    environment: "production" as const,
    organizationKey: "DEMO-HOSPITAL",
    decision: "trusted" as const,
    verifiedSignatureIds: ["CAF-PE-SIGNATURE-RELEASE-1", "CAF-PE-SIGNATURE-RELEASE-2"],
    verifiedKeyIds: ["CAF-PE-KEY-RELEASE-ONE", "CAF-PE-KEY-RELEASE-TWO"],
  },
  privacyBoundary: {
    evidenceRef: "privacy-boundary://demo",
    evaluatedAt: recentAt,
    decision: "passed" as const,
    scanContext: "institutional_delivery" as const,
  },
  resilience: {
    evidenceRef: "resilience://demo",
    evaluatedAt: recentAt,
    backupSetId: "CAF-PE-BACKUP-SET-DEMO",
    state: "healthy" as const,
    incidentRequired: false,
  },
  operationalHealth: {
    evidenceRef: "operational-health://demo",
    evaluatedAt: recentAt,
    policyId: "CAF-PE-SLO-POLICY-DEMO",
    state: "healthy" as const,
    incidentRequired: false,
  },
  activeIncidents: [],
  exceptions: [],
  claimsBoundaryAccepted: true as const,
};

describe("patientEducationPrivateAuthorityDecision", () => {
  it("authorizes a production release only when every authority subsystem reconciles", () => {
    const result = evaluatePatientEducationPrivateAuthority(productionInput);
    expect(result.decision).toBe("authorized_for_release");
    expect(result.findings).toEqual([]);
    expect(result.distributableCandidateSha256).toBe(candidateSha256);
    expect(result.verifiedPrincipalIds).toHaveLength(2);
    expect(result.verifiedSignatureIds).toHaveLength(2);
  });

  it("fails closed and withholds the distributable candidate on any subsystem mismatch", () => {
    const result = evaluatePatientEducationPrivateAuthority({
      ...productionInput,
      evidenceFreshness: { ...productionInput.evidenceFreshness, state: "suspend_required" as const },
      signatureVerification: {
        ...productionInput.signatureVerification,
        payloadSha256: "9".repeat(64),
      },
    });
    expect(result.decision).toBe("blocked");
    expect(result.distributableCandidateSha256).toBeUndefined();
    expect(result.verifiedPrincipalIds).toEqual([]);
    expect(result.verifiedSignatureIds).toEqual([]);
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "PRIVATE-AUTHORITY-EVIDENCE-NOT-CURRENT" }),
      expect.objectContaining({ code: "PRIVATE-AUTHORITY-SIGNATURES-BLOCKED" }),
    ]));
  });

  it("blocks an active incident affecting the package and organization", () => {
    const result = evaluatePatientEducationPrivateAuthority({
      ...productionInput,
      activeIncidents: [
        {
          incidentId: "CAF-PE-INCIDENT-DEMO",
          incidentType: "integrity_failure",
          severity: "sev1" as const,
          status: "contained" as const,
          packageId: productionInput.packageId,
          packageVersion: productionInput.packageVersion,
          organizationKeys: [productionInput.organizationKey],
          distributionFrozen: true,
        },
      ],
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "PRIVATE-AUTHORITY-ACTIVE-INCIDENT" }),
    ]));
  });

  it("blocks stale evaluation evidence", () => {
    const result = evaluatePatientEducationPrivateAuthority({
      ...productionInput,
      releaseAuthorization: {
        ...productionInput.releaseAuthorization,
        evaluatedAt: "2026-07-18T17:00:00.000Z",
      },
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "PRIVATE-AUTHORITY-RELEASE-AUTHORIZATION-STALE" }),
    ]));
  });

  it("prohibits production releases that depend on an exception", () => {
    const result = evaluatePatientEducationPrivateAuthority({
      ...productionInput,
      exceptions: [
        {
          exceptionId: "CAF-PE-EXCEPTION-DEMO",
          controlId: "patient_testing",
          decision: "effective" as const,
          targetStatus: "released" as const,
          expiresAt: "2026-07-19T20:00:00.000Z",
          evidenceRef: "exception://demo",
        },
      ],
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "PRIVATE-AUTHORITY-PRODUCTION-EXCEPTION-PROHIBITED" }),
    ]));
  });

  it("can authorize a preview pilot with a current, effective pilot-only exception", () => {
    const pilotInput = {
      ...productionInput,
      decisionId: "CAF-PE-PRIVATE-AUTHORITY-PILOT",
      environment: "preview" as const,
      targetStatus: "pilot_ready" as const,
      signatureVerification: {
        ...productionInput.signatureVerification,
        environment: "preview" as const,
      },
      exceptions: [
        {
          exceptionId: "CAF-PE-EXCEPTION-PILOT",
          controlId: "patient_testing",
          decision: "effective" as const,
          targetStatus: "pilot_ready" as const,
          expiresAt: "2026-07-19T20:00:00.000Z",
          evidenceRef: "exception://pilot",
        },
      ],
    };
    const result = evaluatePatientEducationPrivateAuthority(pilotInput);
    expect(result.decision).toBe("authorized_for_pilot");
    expect(result.distributableCandidateSha256).toBe(candidateSha256);
  });
});
