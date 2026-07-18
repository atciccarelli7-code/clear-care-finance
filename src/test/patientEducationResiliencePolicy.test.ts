import { describe, expect, it } from "vitest";
import {
  evaluatePatientEducationDestruction,
  evaluatePatientEducationResilience,
} from "@/lib/patientEducationResiliencePolicy";

const retentionRules = [
  {
    recordClass: "release_record" as const,
    minimumRetentionDays: 3650,
    immutableDuringRetention: true,
    legalHoldEligible: true,
    destructionAllowed: false,
    requiredDestructionApproverRoleIds: [],
  },
  {
    recordClass: "operational_event" as const,
    minimumRetentionDays: 365,
    maximumRetentionDays: 730,
    immutableDuringRetention: false,
    legalHoldEligible: true,
    destructionAllowed: true,
    requiredDestructionApproverRoleIds: ["privacy_owner", "records_owner"],
  },
];

const policy = {
  schemaVersion: "1.0.0" as const,
  policyId: "CAF-PE-RESILIENCE-POLICY-DEMO",
  retentionRules,
  requiredBackupCopies: 3,
  requiredGeographicRegions: 2,
  requireImmutableBackupCopy: true as const,
  requireEncryptedBackupCopies: true as const,
  requireBackupIntegrityVerification: true as const,
  maximumBackupAgeHours: 24,
  recoveryPointObjectiveMinutes: 60,
  recoveryTimeObjectiveMinutes: 120,
  restoreTestIntervalDays: 30,
  minimumRestoreTestSamplePercent: 25,
  prohibitGovernanceRecordDestruction: true as const,
};

const copy = (suffix: string, region: string, immutable: boolean) => ({
  copyId: `CAF-PE-BACKUP-COPY-${suffix}`,
  storageRef: `backup://${region.toLowerCase()}/${suffix.toLowerCase()}`,
  region,
  providerBoundary: `Synthetic provider boundary ${region}`,
  encrypted: true,
  immutable,
  createdAt: "2026-07-18T17:30:00.000Z",
  objectCount: 1000,
  bytesStored: 1_000_000,
  manifestSha256: suffix.toLowerCase().charAt(0).repeat(64).replace(/[^a-f0-9]/g, "a"),
  integrityVerification: "passed" as const,
  verifiedAt: "2026-07-18T17:45:00.000Z",
});

const backupSet = {
  schemaVersion: "1.0.0" as const,
  backupSetId: "CAF-PE-BACKUP-SET-DEMO",
  environment: "production" as const,
  organizationKey: "CAF-GLOBAL",
  backupWindowStart: "2026-07-18T17:00:00.000Z",
  backupWindowEnd: "2026-07-18T18:00:00.000Z",
  sourceWatermarkAt: "2026-07-18T17:50:00.000Z",
  sourceInventorySha256: "f".repeat(64),
  recordClassCounts: {
    release_record: 10,
    operational_event: 990,
  },
  copies: [
    copy("A", "US-EAST", true),
    copy("B", "US-WEST", false),
    copy("C", "US-EAST", false),
  ],
};

const restoreTest = {
  schemaVersion: "1.0.0" as const,
  restoreTestId: "CAF-PE-RESTORE-TEST-DEMO",
  backupSetId: backupSet.backupSetId,
  environment: "production" as const,
  isolatedRecoveryEnvironmentRef: "recovery://synthetic-isolated-environment",
  startedAt: "2026-07-18T18:00:00.000Z",
  completedAt: "2026-07-18T19:00:00.000Z",
  sourceWatermarkAt: backupSet.sourceWatermarkAt,
  restoredThroughAt: backupSet.sourceWatermarkAt,
  sampledObjectPercent: 100,
  restoredObjectCount: 1000,
  verifiedObjectCount: 1000,
  integrityStatus: "passed" as const,
  applicationVerificationStatus: "passed" as const,
  organizationIsolationVerificationStatus: "passed" as const,
  findings: [],
  evidenceRefs: ["restore-evidence://synthetic-demo"],
};

describe("patientEducationResiliencePolicy", () => {
  it("accepts encrypted, geographically diverse, restorable backups within RPO and RTO", () => {
    const result = evaluatePatientEducationResilience({
      backupSet,
      restoreTests: [restoreTest],
      policy,
      evaluatedAt: "2026-07-18T18:30:00.000Z",
    });
    expect(result.state).toBe("healthy");
    expect(result.findings).toEqual([]);
  });

  it("requires an incident when copy count, encryption, integrity, RPO, and restore checks fail", () => {
    const result = evaluatePatientEducationResilience({
      backupSet: {
        ...backupSet,
        sourceWatermarkAt: "2026-07-18T10:00:00.000Z",
        copies: [
          {
            ...copy("A", "US-EAST", false),
            encrypted: false,
            integrityVerification: "failed" as const,
          },
        ],
      },
      restoreTests: [],
      policy,
      evaluatedAt: "2026-07-18T18:30:00.000Z",
    });
    expect(result.state).toBe("critical");
    expect(result.incidentRequired).toBe(true);
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "RESILIENCE-BACKUP-COPY-COUNT-LOW" }),
      expect.objectContaining({ code: "RESILIENCE-GEOGRAPHIC-DIVERSITY-LOW" }),
      expect.objectContaining({ code: "RESILIENCE-IMMUTABLE-COPY-MISSING" }),
      expect.objectContaining({ code: "RESILIENCE-BACKUP-NOT-ENCRYPTED" }),
      expect.objectContaining({ code: "RESILIENCE-BACKUP-INTEGRITY-NOT-PASSED" }),
      expect.objectContaining({ code: "RESILIENCE-RPO-BREACHED" }),
      expect.objectContaining({ code: "RESILIENCE-RESTORE-TEST-MISSING" }),
    ]));
  });

  it("blocks failed or undersized restore tests", () => {
    const result = evaluatePatientEducationResilience({
      backupSet,
      restoreTests: [{
        ...restoreTest,
        sampledObjectPercent: 10,
        integrityStatus: "failed" as const,
        findings: ["Synthetic integrity failure."],
      }],
      policy,
      evaluatedAt: "2026-07-18T19:30:00.000Z",
    });
    expect(result.state).toBe("critical");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "RESILIENCE-RESTORE-SAMPLE-TOO-SMALL" }),
      expect.objectContaining({ code: "RESILIENCE-RESTORE-TEST-FAILED" }),
    ]));
  });

  it("prohibits destruction of release history", () => {
    const result = evaluatePatientEducationDestruction({
      receipt: {
        schemaVersion: "1.0.0",
        destructionReceiptId: "CAF-PE-DESTRUCTION-RELEASE-DEMO",
        recordClass: "release_record",
        organizationKey: "CAF-GLOBAL",
        objectRefs: ["release://demo"],
        objectInventorySha256: "a".repeat(64),
        retentionSatisfiedAt: "2036-07-18T00:00:00.000Z",
        destroyedAt: "2036-07-19T00:00:00.000Z",
        destructionMethod: "Synthetic cryptographic erasure.",
        executorPrincipalId: "CAF-PE-PRINCIPAL-RECORDS",
        approvals: [],
        legalHoldCheckRef: "legal-hold-check://none",
        verificationEvidenceRef: "destruction-evidence://demo",
      },
      policy,
      legalHolds: [],
    });
    expect(result.allowed).toBe(false);
    expect(result.errors.join(" ")).toMatch(/cannot be destroyed/i);
  });

  it("allows governed operational-event destruction only after distinct approvals and no active legal hold", () => {
    const receipt = {
      schemaVersion: "1.0.0" as const,
      destructionReceiptId: "CAF-PE-DESTRUCTION-OPS-DEMO",
      recordClass: "operational_event" as const,
      organizationKey: "DEMO-HOSPITAL",
      objectRefs: ["ops-event://batch-2026"],
      objectInventorySha256: "b".repeat(64),
      retentionSatisfiedAt: "2028-07-18T00:00:00.000Z",
      destroyedAt: "2028-07-19T00:00:00.000Z",
      destructionMethod: "Synthetic cryptographic erasure.",
      executorPrincipalId: "CAF-PE-PRINCIPAL-RECORDS",
      approvals: [
        {
          approvalId: "CAF-PE-DESTRUCTION-APPROVAL-PRIVACY",
          principalId: "CAF-PE-PRINCIPAL-PRIVACY",
          roleId: "privacy_owner",
          approvedAt: "2028-07-18T12:00:00.000Z",
        },
        {
          approvalId: "CAF-PE-DESTRUCTION-APPROVAL-RECORDS",
          principalId: "CAF-PE-PRINCIPAL-RECORDS-OWNER",
          roleId: "records_owner",
          approvedAt: "2028-07-18T12:05:00.000Z",
        },
      ],
      legalHoldCheckRef: "legal-hold-check://none",
      verificationEvidenceRef: "destruction-evidence://ops-demo",
    };
    expect(evaluatePatientEducationDestruction({ receipt, policy, legalHolds: [] })).toEqual({ allowed: true, errors: [] });
    const blocked = evaluatePatientEducationDestruction({
      receipt,
      policy,
      legalHolds: [
        {
          schemaVersion: "1.0.0",
          legalHoldId: "CAF-PE-LEGAL-HOLD-DEMO",
          organizationKey: "DEMO-HOSPITAL",
          recordClasses: ["operational_event"],
          objectRefs: [],
          reason: "Synthetic legal hold for conformance testing.",
          issuedAt: "2028-01-01T00:00:00.000Z",
          issuedByPrincipalId: "CAF-PE-PRINCIPAL-LEGAL",
          status: "active",
        },
      ],
    });
    expect(blocked.allowed).toBe(false);
    expect(blocked.errors.join(" ")).toMatch(/legal hold/i);
  });
});
