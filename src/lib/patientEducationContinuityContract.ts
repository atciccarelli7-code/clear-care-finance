import { z } from "zod";

const sha256 = z.string().regex(/^[a-f0-9]{64}$/);

export const patientEducationBackupManifestSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  backupId: z.string().regex(/^CAF-PE-BACKUP-[A-Z0-9-]+$/),
  environment: z.enum(["test", "pilot", "production"]),
  createdAt: z.string().datetime(),
  sourceSnapshotAt: z.string().datetime(),
  contentSha256: sha256,
  objectCount: z.number().int().nonnegative(),
  includes: z.array(z.enum(["packages", "evidence", "reviews", "releases", "distributions", "audit_ledger", "configuration"])).min(1),
  encryption: z.object({
    algorithm: z.enum(["AES-256-GCM"]),
    keyRef: z.string().trim().min(3),
  }),
  retentionUntil: z.string().datetime(),
  immutable: z.literal(true),
}).superRefine((value, context) => {
  if (new Date(value.sourceSnapshotAt) > new Date(value.createdAt)) context.addIssue({ code: z.ZodIssueCode.custom, message: "Backup snapshot cannot postdate backup creation." });
  if (new Date(value.retentionUntil) <= new Date(value.createdAt)) context.addIssue({ code: z.ZodIssueCode.custom, message: "Backup retention must extend beyond creation." });
});

export const patientEducationRecoveryTestSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  recoveryTestId: z.string().regex(/^CAF-PE-RECOVERY-[A-Z0-9-]+$/),
  backupId: z.string().regex(/^CAF-PE-BACKUP-[A-Z0-9-]+$/),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime(),
  targetEnvironment: z.literal("test"),
  recoveredContentSha256: sha256,
  recoveredObjectCount: z.number().int().nonnegative(),
  integrityVerified: z.boolean(),
  auditChainVerified: z.boolean(),
  applicationSmokeTestsPassed: z.boolean(),
  recoveryPointMinutes: z.number().nonnegative(),
  recoveryTimeMinutes: z.number().nonnegative(),
  findings: z.array(z.object({
    code: z.string().regex(/^RECOVERY-[A-Z0-9-]+$/),
    severity: z.enum(["warning", "blocking"]),
    message: z.string().trim().min(3),
    remediation: z.string().trim().min(3),
  })),
}).superRefine((value, context) => {
  if (new Date(value.completedAt) <= new Date(value.startedAt)) context.addIssue({ code: z.ZodIssueCode.custom, message: "Recovery completion must occur after start." });
});

export const patientEducationContinuityPolicySchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  policyId: z.string().regex(/^CAF-PE-CONTINUITY-[A-Z0-9-]+$/),
  environment: z.enum(["pilot", "production"]),
  maximumRecoveryPointMinutes: z.number().positive(),
  maximumRecoveryTimeMinutes: z.number().positive(),
  maximumBackupAgeHours: z.number().positive(),
  requiredBackupIncludes: z.array(z.enum(["packages", "evidence", "reviews", "releases", "distributions", "audit_ledger", "configuration"])).min(1),
  requireSuccessfulRecoveryTestWithinDays: z.number().int().positive(),
  freezeReleaseOnFailure: z.literal(true),
});

export const evaluatePatientEducationContinuity = ({ backupInput, recoveryInput, policyInput, evaluatedAt = new Date().toISOString() }: { backupInput: unknown; recoveryInput: unknown; policyInput: unknown; evaluatedAt?: string }) => {
  const backup = patientEducationBackupManifestSchema.parse(backupInput);
  const recovery = patientEducationRecoveryTestSchema.parse(recoveryInput);
  const policy = patientEducationContinuityPolicySchema.parse(policyInput);
  const findings: string[] = [];
  if (backup.environment !== policy.environment) findings.push("CONTINUITY-ENVIRONMENT-MISMATCH");
  if (recovery.backupId !== backup.backupId) findings.push("CONTINUITY-BACKUP-REFERENCE-MISMATCH");
  if (recovery.recoveredContentSha256 !== backup.contentSha256) findings.push("CONTINUITY-CONTENT-HASH-MISMATCH");
  if (recovery.recoveredObjectCount !== backup.objectCount) findings.push("CONTINUITY-OBJECT-COUNT-MISMATCH");
  if (!recovery.integrityVerified) findings.push("CONTINUITY-INTEGRITY-NOT-VERIFIED");
  if (!recovery.auditChainVerified) findings.push("CONTINUITY-AUDIT-CHAIN-NOT-VERIFIED");
  if (!recovery.applicationSmokeTestsPassed) findings.push("CONTINUITY-SMOKE-TESTS-FAILED");
  if (recovery.recoveryPointMinutes > policy.maximumRecoveryPointMinutes) findings.push("CONTINUITY-RPO-EXCEEDED");
  if (recovery.recoveryTimeMinutes > policy.maximumRecoveryTimeMinutes) findings.push("CONTINUITY-RTO-EXCEEDED");
  for (const required of policy.requiredBackupIncludes) if (!backup.includes.includes(required)) findings.push(`CONTINUITY-BACKUP-MISSING-${required.toUpperCase()}`);
  const backupAgeHours = (new Date(evaluatedAt).getTime() - new Date(backup.createdAt).getTime()) / 3_600_000;
  if (backupAgeHours > policy.maximumBackupAgeHours) findings.push("CONTINUITY-BACKUP-STALE");
  const recoveryAgeDays = (new Date(evaluatedAt).getTime() - new Date(recovery.completedAt).getTime()) / 86_400_000;
  if (recoveryAgeDays > policy.requireSuccessfulRecoveryTestWithinDays) findings.push("CONTINUITY-RECOVERY-TEST-STALE");
  if (recovery.findings.some((finding) => finding.severity === "blocking")) findings.push("CONTINUITY-BLOCKING-RECOVERY-FINDING");
  return { passed: findings.length === 0, releaseFrozen: findings.length > 0 && policy.freezeReleaseOnFailure, findings, backup, recovery, policy };
};
