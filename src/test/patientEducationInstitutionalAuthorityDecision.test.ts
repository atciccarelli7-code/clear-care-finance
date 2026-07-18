import { describe, expect, it } from "vitest";
import { evaluatePatientEducationInstitutionalAuthority } from "@/lib/patientEducationInstitutionalAuthorityDecision";

const candidateSha256 = "a".repeat(64);
const evaluatedAt = "2026-07-18T21:00:00.000Z";
const recentAt = "2026-07-18T20:55:00.000Z";

const validInput = {
  schemaVersion: "1.0.0" as const,
  institutionalAuthorityId: "CAF-PE-INSTITUTIONAL-AUTHORITY-DEMO",
  packageId: "CAF-PE-DEMO-SAFETY",
  packageVersion: "1.0.0",
  candidateSha256,
  organizationKey: "DEMO-HOSPITAL",
  environment: "production" as const,
  targetStatus: "released" as const,
  locale: "en-US",
  adapterType: "patient_portal_json" as const,
  destinationId: "CAF-PE-DESTINATION-DEMO-PORTAL",
  evaluatedAt,
  dispatchNotBefore: "2026-07-18T21:00:00.000Z",
  dispatchExpiresAt: "2026-07-18T21:10:00.000Z",
  privateAuthority: {
    evidenceRef: "private-authority://demo",
    evaluatedAt: recentAt,
    decisionId: "CAF-PE-PRIVATE-AUTHORITY-DEMO",
    decision: "authorized_for_release" as const,
    candidateSha256,
    organizationKey: "DEMO-HOSPITAL",
    environment: "production" as const,
    targetStatus: "released" as const,
    authorityExpiresAt: "2026-07-18T21:15:00.000Z",
  },
  organizationReadiness: {
    evidenceRef: "organization-readiness://demo",
    evaluatedAt: recentAt,
    requestId: "CAF-PE-ORG-READINESS-DEMO",
    decision: "ready" as const,
    organizationKey: "DEMO-HOSPITAL",
    destinationId: "CAF-PE-DESTINATION-DEMO-PORTAL",
    entitlementId: "CAF-PE-ENTITLEMENT-DEMO-SAFETY",
  },
  conformance: {
    evidenceRef: "conformance://foundation-v1",
    evaluatedAt: "2026-07-18T12:00:00.000Z",
    conformancePackageId: "CAF-PE-CONFORMANCE-PACKAGE-FOUNDATION",
    conformanceVersion: "1.0.0",
    decision: "conformant" as const,
    compilerVersion: "1.0.0",
    compilerSha256: "b".repeat(64),
    sourceCommitSha: "c".repeat(40),
  },
  dispatchCommand: {
    evidenceRef: "job-command://demo-delivery",
    evaluatedAt: recentAt,
    jobId: "CAF-PE-JOB-DEMO-DELIVERY",
    jobType: "deliver" as const,
    commandSha256: "d".repeat(64),
    commandIntegrityValid: true,
    idempotencyKey: `caf-pe:deliver:demo:${"e".repeat(64)}`,
    organizationKey: "DEMO-HOSPITAL",
    packageId: "CAF-PE-DEMO-SAFETY",
    packageVersion: "1.0.0",
    candidateSha256,
    destinationId: "CAF-PE-DESTINATION-DEMO-PORTAL",
    payloadSha256: "f".repeat(64),
  },
  activeControlNotices: [],
  organizationStatus: "active" as const,
  claimsBoundaryAccepted: true as const,
};

describe("patientEducationInstitutionalAuthorityDecision", () => {
  it("authorizes one exact, entitled, conformant dispatch within a short window", () => {
    const result = evaluatePatientEducationInstitutionalAuthority(validInput);
    expect(result.decision).toBe("authorized_for_dispatch");
    expect(result.entitlementId).toBe("CAF-PE-ENTITLEMENT-DEMO-SAFETY");
    expect(result.dispatchAuthorization).toEqual(expect.objectContaining({
      jobId: "CAF-PE-JOB-DEMO-DELIVERY",
      commandSha256: "d".repeat(64),
    }));
    expect(result.findings).toEqual([]);
  });

  it("withholds dispatch authorization when organization readiness or entitlement is missing", () => {
    const result = evaluatePatientEducationInstitutionalAuthority({
      ...validInput,
      organizationReadiness: {
        ...validInput.organizationReadiness,
        decision: "blocked" as const,
        entitlementId: undefined,
      },
    });
    expect(result.decision).toBe("blocked");
    expect(result.dispatchAuthorization).toBeUndefined();
    expect(result.entitlementId).toBeUndefined();
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "INSTITUTIONAL-AUTHORITY-ORGANIZATION-NOT-READY" }),
    ]));
  });

  it("blocks a mismatched or tampered dispatch command", () => {
    const result = evaluatePatientEducationInstitutionalAuthority({
      ...validInput,
      dispatchCommand: {
        ...validInput.dispatchCommand,
        commandIntegrityValid: false,
        organizationKey: "OTHER-HOSPITAL",
        candidateSha256: "9".repeat(64),
      },
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "INSTITUTIONAL-AUTHORITY-DISPATCH-COMMAND-MISMATCH" }),
    ]));
  });

  it("blocks active suspension, recall, or retirement notices", () => {
    const result = evaluatePatientEducationInstitutionalAuthority({
      ...validInput,
      activeControlNotices: [
        {
          noticeId: "CAF-PE-NOTICE-DEMO-RECALL",
          packageId: validInput.packageId,
          packageVersion: validInput.packageVersion,
          organizationKey: validInput.organizationKey,
          status: "active" as const,
          releaseStatus: "recalled" as const,
          issuedAt: "2026-07-18T20:59:00.000Z",
        },
      ],
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "INSTITUTIONAL-AUTHORITY-ACTIVE-CONTROL-NOTICE" }),
    ]));
  });

  it("blocks stale readiness, expired private authority, and an excessive dispatch window", () => {
    const result = evaluatePatientEducationInstitutionalAuthority({
      ...validInput,
      dispatchExpiresAt: "2026-07-18T22:00:00.000Z",
      privateAuthority: {
        ...validInput.privateAuthority,
        authorityExpiresAt: "2026-07-18T20:59:59.000Z",
      },
      organizationReadiness: {
        ...validInput.organizationReadiness,
        evaluatedAt: "2026-07-18T20:30:00.000Z",
      },
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "INSTITUTIONAL-AUTHORITY-ORGANIZATION-READINESS-STALE" }),
      expect.objectContaining({ code: "INSTITUTIONAL-AUTHORITY-PRIVATE-AUTHORITY-BLOCKED" }),
      expect.objectContaining({ code: "INSTITUTIONAL-AUTHORITY-DISPATCH-WINDOW-TOO-LONG" }),
      expect.objectContaining({ code: "INSTITUTIONAL-AUTHORITY-DISPATCH-OUTLIVES-PRIVATE-AUTHORITY" }),
    ]));
  });

  it("blocks when the compiler baseline is not conformant", () => {
    const result = evaluatePatientEducationInstitutionalAuthority({
      ...validInput,
      conformance: {
        ...validInput.conformance,
        decision: "blocked" as const,
      },
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "INSTITUTIONAL-AUTHORITY-CONFORMANCE-BLOCKED" }),
    ]));
  });
});
