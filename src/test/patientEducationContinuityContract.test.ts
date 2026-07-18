import { describe, expect, it } from "vitest";
import { evaluatePatientEducationContinuity } from "@/lib/patientEducationContinuityContract";

const backup = {
  schemaVersion: "1.0.0" as const,
  backupId: "CAF-PE-BACKUP-PILOT-001",
  environment: "pilot" as const,
  createdAt: "2026-07-18T12:00:00.000Z",
  sourceSnapshotAt: "2026-07-18T11:55:00.000Z",
  contentSha256: "b".repeat(64),
  objectCount: 120,
  includes: ["packages", "evidence", "reviews", "releases", "distributions", "audit_ledger", "configuration"] as const,
  encryption: { algorithm: "AES-256-GCM" as const, keyRef: "kms://synthetic-backup-key" },
  retentionUntil: "2027-07-18T12:00:00.000Z",
  immutable: true as const,
};

const recovery = {
  schemaVersion: "1.0.0" as const,
  recoveryTestId: "CAF-PE-RECOVERY-001",
  backupId: backup.backupId,
  startedAt: "2026-07-18T12:30:00.000Z",
  completedAt: "2026-07-18T13:00:00.000Z",
  targetEnvironment: "test" as const,
  recoveredContentSha256: backup.contentSha256,
  recoveredObjectCount: backup.objectCount,
  integrityVerified: true,
  auditChainVerified: true,
  applicationSmokeTestsPassed: true,
  recoveryPointMinutes: 5,
  recoveryTimeMinutes: 30,
  findings: [],
};

const policy = {
  schemaVersion: "1.0.0" as const,
  policyId: "CAF-PE-CONTINUITY-PILOT",
  environment: "pilot" as const,
  maximumRecoveryPointMinutes: 15,
  maximumRecoveryTimeMinutes: 60,
  maximumBackupAgeHours: 24,
  requiredBackupIncludes: ["packages", "evidence", "reviews", "releases", "distributions", "audit_ledger", "configuration"] as const,
  requireSuccessfulRecoveryTestWithinDays: 30,
  freezeReleaseOnFailure: true as const,
};

describe("patient education continuity contract", () => {
  it("passes a complete recent backup and verified restoration", () => {
    const result = evaluatePatientEducationContinuity({ backupInput: backup, recoveryInput: recovery, policyInput: policy, evaluatedAt: "2026-07-18T14:00:00.000Z" });
    expect(result.passed).toBe(true);
    expect(result.releaseFrozen).toBe(false);
  });

  it("freezes release when restored content differs from the backup manifest", () => {
    const result = evaluatePatientEducationContinuity({ backupInput: backup, recoveryInput: { ...recovery, recoveredContentSha256: "c".repeat(64) }, policyInput: policy, evaluatedAt: "2026-07-18T14:00:00.000Z" });
    expect(result.releaseFrozen).toBe(true);
    expect(result.findings).toContain("CONTINUITY-CONTENT-HASH-MISMATCH");
  });

  it("freezes release when audit-chain verification fails", () => {
    const result = evaluatePatientEducationContinuity({ backupInput: backup, recoveryInput: { ...recovery, auditChainVerified: false }, policyInput: policy, evaluatedAt: "2026-07-18T14:00:00.000Z" });
    expect(result.findings).toContain("CONTINUITY-AUDIT-CHAIN-NOT-VERIFIED");
  });

  it("enforces recovery objectives and backup freshness", () => {
    const result = evaluatePatientEducationContinuity({ backupInput: backup, recoveryInput: { ...recovery, recoveryPointMinutes: 90, recoveryTimeMinutes: 180 }, policyInput: policy, evaluatedAt: "2026-07-20T14:00:00.000Z" });
    expect(result.findings).toEqual(expect.arrayContaining(["CONTINUITY-RPO-EXCEEDED", "CONTINUITY-RTO-EXCEEDED", "CONTINUITY-BACKUP-STALE"]));
  });
});
