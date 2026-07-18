import { z } from "zod";

const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const roleIdSchema = z.string().regex(/^[a-z0-9_]+$/);

export const patientEducationRecordClassSchema = z.enum([
  "source_content",
  "evidence_dossier",
  "review_approval",
  "quality_report",
  "localization",
  "institution_overlay",
  "release_record",
  "reproducibility_manifest",
  "signature_envelope",
  "delivery_envelope",
  "distribution_record",
  "control_notice",
  "acknowledgment",
  "incident_record",
  "operational_event",
  "pilot_analytics",
  "audit_export",
  "backup_manifest",
  "destruction_receipt",
]);

export const patientEducationRetentionRuleSchema = z.object({
  recordClass: patientEducationRecordClassSchema,
  minimumRetentionDays: z.number().int().positive().max(36500),
  maximumRetentionDays: z.number().int().positive().max(36500).optional(),
  immutableDuringRetention: z.boolean(),
  legalHoldEligible: z.boolean(),
  destructionAllowed: z.boolean(),
  requiredDestructionApproverRoleIds: z.array(roleIdSchema),
}).superRefine((value, context) => {
  if (value.maximumRetentionDays && value.maximumRetentionDays < value.minimumRetentionDays) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Maximum retention for ${value.recordClass} cannot be shorter than minimum retention.` });
  }
  if (!value.destructionAllowed && value.requiredDestructionApproverRoleIds.length > 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Non-destructible class ${value.recordClass} cannot declare destruction approvers.` });
  }
  if (value.destructionAllowed && value.requiredDestructionApproverRoleIds.length === 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Destructible class ${value.recordClass} requires destruction approver roles.` });
  }
});

export const patientEducationResiliencePolicySchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  policyId: z.string().regex(/^CAF-PE-RESILIENCE-POLICY-[A-Z0-9-]+$/),
  retentionRules: z.array(patientEducationRetentionRuleSchema).min(1),
  requiredBackupCopies: z.number().int().min(2).max(10),
  requiredGeographicRegions: z.number().int().min(2).max(10),
  requireImmutableBackupCopy: z.literal(true),
  requireEncryptedBackupCopies: z.literal(true),
  requireBackupIntegrityVerification: z.literal(true),
  maximumBackupAgeHours: z.number().int().positive().max(8760),
  recoveryPointObjectiveMinutes: z.number().int().nonnegative().max(10080),
  recoveryTimeObjectiveMinutes: z.number().int().positive().max(10080),
  restoreTestIntervalDays: z.number().int().positive().max(365),
  minimumRestoreTestSamplePercent: z.number().positive().max(100),
  prohibitGovernanceRecordDestruction: z.literal(true),
});

export const patientEducationBackupCopySchema = z.object({
  copyId: z.string().regex(/^CAF-PE-BACKUP-COPY-[A-Z0-9-]+$/),
  storageRef: z.string().trim().min(3).max(1000),
  region: z.string().trim().min(2).max(200),
  providerBoundary: z.string().trim().min(3).max(500),
  encrypted: z.boolean(),
  immutable: z.boolean(),
  createdAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
  objectCount: z.number().int().positive().max(1_000_000_000),
  bytesStored: z.number().int().positive(),
  manifestSha256: sha256Schema,
  integrityVerification: z.enum(["not_verified", "passed", "failed"]),
  verifiedAt: z.string().datetime().optional(),
}).superRefine((value, context) => {
  if (value.integrityVerification === "passed" && !value.verifiedAt) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Passed backup copy ${value.copyId} requires verifiedAt.` });
  }
  if (value.integrityVerification === "failed" && !value.verifiedAt) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Failed backup copy ${value.copyId} requires verifiedAt.` });
  }
});

export const patientEducationBackupSetSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  backupSetId: z.string().regex(/^CAF-PE-BACKUP-SET-[A-Z0-9-]+$/),
  environment: z.enum(["test", "preview", "production"]),
  organizationKey: z.string().regex(/^(?:CAF-GLOBAL|[A-Z0-9-]+)$/),
  backupWindowStart: z.string().datetime(),
  backupWindowEnd: z.string().datetime(),
  sourceWatermarkAt: z.string().datetime(),
  sourceInventorySha256: sha256Schema,
  recordClassCounts: z.record(patientEducationRecordClassSchema, z.number().int().nonnegative()),
  copies: z.array(patientEducationBackupCopySchema).min(1),
}).superRefine((value, context) => {
  if (new Date(value.backupWindowEnd) <= new Date(value.backupWindowStart)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Backup window end must occur after its start." });
  }
  if (new Date(value.sourceWatermarkAt) > new Date(value.backupWindowEnd)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Backup source watermark cannot be later than the backup window end." });
  }
  const copyIds = value.copies.map((copy) => copy.copyId);
  if (new Set(copyIds).size !== copyIds.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Backup copy IDs must be unique." });
  }
});

export const patientEducationRestoreTestSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  restoreTestId: z.string().regex(/^CAF-PE-RESTORE-TEST-[A-Z0-9-]+$/),
  backupSetId: z.string().regex(/^CAF-PE-BACKUP-SET-[A-Z0-9-]+$/),
  environment: z.enum(["test", "preview", "production"]),
  isolatedRecoveryEnvironmentRef: z.string().trim().min(3).max(1000),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime(),
  sourceWatermarkAt: z.string().datetime(),
  restoredThroughAt: z.string().datetime(),
  sampledObjectPercent: z.number().positive().max(100),
  restoredObjectCount: z.number().int().positive(),
  verifiedObjectCount: z.number().int().nonnegative(),
  integrityStatus: z.enum(["passed", "failed"]),
  applicationVerificationStatus: z.enum(["passed", "failed"]),
  organizationIsolationVerificationStatus: z.enum(["passed", "failed"]),
  findings: z.array(z.string().trim().min(3).max(3000)),
  evidenceRefs: z.array(z.string().trim().min(3).max(1000)).min(1),
}).superRefine((value, context) => {
  if (new Date(value.completedAt) <= new Date(value.startedAt)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Restore test completion must occur after it starts." });
  }
  if (value.verifiedObjectCount > value.restoredObjectCount) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Verified restore objects cannot exceed restored objects." });
  }
  const passed = value.integrityStatus === "passed"
    && value.applicationVerificationStatus === "passed"
    && value.organizationIsolationVerificationStatus === "passed";
  if (passed && value.findings.length > 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "A fully passed restore test cannot contain unresolved findings." });
  }
  if (!passed && value.findings.length === 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "A failed restore test requires findings." });
  }
});

export const patientEducationLegalHoldSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  legalHoldId: z.string().regex(/^CAF-PE-LEGAL-HOLD-[A-Z0-9-]+$/),
  organizationKey: z.string().regex(/^(?:CAF-GLOBAL|[A-Z0-9-]+)$/),
  recordClasses: z.array(patientEducationRecordClassSchema).min(1),
  objectRefs: z.array(z.string().trim().min(3).max(1000)),
  reason: z.string().trim().min(10).max(5000),
  issuedAt: z.string().datetime(),
  issuedByPrincipalId: z.string().regex(/^CAF-PE-PRINCIPAL-[A-Z0-9-]+$/),
  status: z.enum(["active", "released"]),
  releasedAt: z.string().datetime().optional(),
  releasedByPrincipalId: z.string().regex(/^CAF-PE-PRINCIPAL-[A-Z0-9-]+$/).optional(),
}).superRefine((value, context) => {
  if (value.status === "released" && (!value.releasedAt || !value.releasedByPrincipalId)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Released legal holds require release time and principal." });
  }
  if (value.status === "active" && (value.releasedAt || value.releasedByPrincipalId)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Active legal holds cannot contain release metadata." });
  }
});

export const patientEducationDestructionReceiptSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  destructionReceiptId: z.string().regex(/^CAF-PE-DESTRUCTION-[A-Z0-9-]+$/),
  recordClass: patientEducationRecordClassSchema,
  organizationKey: z.string().regex(/^(?:CAF-GLOBAL|[A-Z0-9-]+)$/),
  objectRefs: z.array(z.string().trim().min(3).max(1000)).min(1),
  objectInventorySha256: sha256Schema,
  retentionSatisfiedAt: z.string().datetime(),
  destroyedAt: z.string().datetime(),
  destructionMethod: z.string().trim().min(3).max(1000),
  executorPrincipalId: z.string().regex(/^CAF-PE-PRINCIPAL-[A-Z0-9-]+$/),
  approvals: z.array(z.object({
    approvalId: z.string().regex(/^CAF-PE-DESTRUCTION-APPROVAL-[A-Z0-9-]+$/),
    principalId: z.string().regex(/^CAF-PE-PRINCIPAL-[A-Z0-9-]+$/),
    roleId: roleIdSchema,
    approvedAt: z.string().datetime(),
  })),
  legalHoldCheckRef: z.string().trim().min(3).max(1000),
  verificationEvidenceRef: z.string().trim().min(3).max(1000),
}).superRefine((value, context) => {
  if (new Date(value.destroyedAt) < new Date(value.retentionSatisfiedAt)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Destruction cannot precede retention satisfaction." });
  }
  if (new Set(value.approvals.map((approval) => approval.principalId)).size !== value.approvals.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Destruction approvals require distinct principals." });
  }
});

export const patientEducationResilienceFindingSchema = z.object({
  code: z.string().regex(/^RESILIENCE-[A-Z0-9-]+$/),
  severity: z.enum(["warning", "blocking", "critical"]),
  message: z.string().trim().min(1),
  remediation: z.string().trim().min(1),
  copyId: z.string().optional(),
});

export const patientEducationResilienceEvaluationSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  backupSetId: z.string(),
  evaluatedAt: z.string().datetime(),
  state: z.enum(["healthy", "degraded", "critical"]),
  rpoMinutesObserved: z.number().nonnegative(),
  mostRecentRestoreTestId: z.string().optional(),
  findings: z.array(patientEducationResilienceFindingSchema),
  incidentRequired: z.boolean(),
});

const finding = (code: string, severity: "warning" | "blocking" | "critical", message: string, remediation: string, copyId?: string) => ({
  code,
  severity,
  message,
  remediation,
  ...(copyId ? { copyId } : {}),
});

export const evaluatePatientEducationResilience = ({
  backupSet: rawBackupSet,
  restoreTests: rawRestoreTests,
  policy: rawPolicy,
  evaluatedAt = new Date().toISOString(),
}: {
  backupSet: unknown;
  restoreTests: unknown[];
  policy: unknown;
  evaluatedAt?: string;
}) => {
  const backupSet = patientEducationBackupSetSchema.parse(rawBackupSet);
  const restoreTests = rawRestoreTests.map((test) => patientEducationRestoreTestSchema.parse(test));
  const policy = patientEducationResiliencePolicySchema.parse(rawPolicy);
  const findings: z.infer<typeof patientEducationResilienceFindingSchema>[] = [];

  if (backupSet.copies.length < policy.requiredBackupCopies) {
    findings.push(finding("RESILIENCE-BACKUP-COPY-COUNT-LOW", "critical", `Only ${backupSet.copies.length} backup copies exist; ${policy.requiredBackupCopies} are required.`, "Create and verify the missing independent copies."));
  }
  const regions = new Set(backupSet.copies.map((copy) => copy.region));
  if (regions.size < policy.requiredGeographicRegions) {
    findings.push(finding("RESILIENCE-GEOGRAPHIC-DIVERSITY-LOW", "critical", `Only ${regions.size} geographic backup region(s) exist.`, "Replicate encrypted backups to additional governed regions."));
  }
  if (policy.requireImmutableBackupCopy && !backupSet.copies.some((copy) => copy.immutable)) {
    findings.push(finding("RESILIENCE-IMMUTABLE-COPY-MISSING", "critical", "No immutable backup copy exists.", "Create a write-once or retention-locked encrypted backup copy."));
  }

  for (const copy of backupSet.copies) {
    if (policy.requireEncryptedBackupCopies && !copy.encrypted) {
      findings.push(finding("RESILIENCE-BACKUP-NOT-ENCRYPTED", "critical", `Backup copy ${copy.copyId} is not encrypted.`, "Replace it with an encrypted copy and assess exposure.", copy.copyId));
    }
    if (policy.requireBackupIntegrityVerification && copy.integrityVerification !== "passed") {
      findings.push(finding("RESILIENCE-BACKUP-INTEGRITY-NOT-PASSED", "critical", `Backup copy ${copy.copyId} integrity is ${copy.integrityVerification}.`, "Verify or replace the backup copy before relying on it.", copy.copyId));
    }
    const ageHours = (new Date(evaluatedAt).getTime() - new Date(copy.createdAt).getTime()) / 3_600_000;
    if (ageHours > policy.maximumBackupAgeHours) {
      findings.push(finding("RESILIENCE-BACKUP-COPY-STALE", "blocking", `Backup copy ${copy.copyId} is older than ${policy.maximumBackupAgeHours} hours.`, "Create and verify a current backup copy.", copy.copyId));
    }
    if (copy.expiresAt && new Date(copy.expiresAt) <= new Date(evaluatedAt)) {
      findings.push(finding("RESILIENCE-BACKUP-COPY-EXPIRED", "critical", `Backup copy ${copy.copyId} has expired.`, "Replace the expired copy and verify restoration.", copy.copyId));
    }
  }

  const rpoMinutesObserved = Math.max(0, (new Date(evaluatedAt).getTime() - new Date(backupSet.sourceWatermarkAt).getTime()) / 60_000);
  if (rpoMinutesObserved > policy.recoveryPointObjectiveMinutes) {
    findings.push(finding("RESILIENCE-RPO-BREACHED", "critical", `Observed recovery point is ${rpoMinutesObserved.toFixed(2)} minutes old.`, "Create a current backup and investigate backup scheduling or ingestion failure."));
  }

  const relevantTests = restoreTests
    .filter((test) => test.backupSetId === backupSet.backupSetId)
    .sort((left, right) => right.completedAt.localeCompare(left.completedAt));
  const latestTest = relevantTests[0];
  if (!latestTest) {
    findings.push(finding("RESILIENCE-RESTORE-TEST-MISSING", "critical", "No restore test exists for the backup set.", "Perform an isolated restore and verify integrity, application behavior, and organization isolation."));
  } else {
    const ageDays = (new Date(evaluatedAt).getTime() - new Date(latestTest.completedAt).getTime()) / 86_400_000;
    if (ageDays > policy.restoreTestIntervalDays) {
      findings.push(finding("RESILIENCE-RESTORE-TEST-OVERDUE", "critical", `Latest restore test is ${ageDays.toFixed(2)} days old.`, "Run and document a new isolated restore test."));
    }
    if (latestTest.sampledObjectPercent < policy.minimumRestoreTestSamplePercent) {
      findings.push(finding("RESILIENCE-RESTORE-SAMPLE-TOO-SMALL", "blocking", `Restore test sampled ${latestTest.sampledObjectPercent}% of objects.`, "Increase the sample to meet policy or run a full restore."));
    }
    if (
      latestTest.integrityStatus !== "passed"
      || latestTest.applicationVerificationStatus !== "passed"
      || latestTest.organizationIsolationVerificationStatus !== "passed"
    ) {
      findings.push(finding("RESILIENCE-RESTORE-TEST-FAILED", "critical", "The latest restore test did not pass all verification domains.", "Open an incident, repair the failure, and repeat the restore test."));
    }
    const restoreDurationMinutes = (new Date(latestTest.completedAt).getTime() - new Date(latestTest.startedAt).getTime()) / 60_000;
    if (restoreDurationMinutes > policy.recoveryTimeObjectiveMinutes) {
      findings.push(finding("RESILIENCE-RTO-BREACHED", "critical", `Restore took ${restoreDurationMinutes.toFixed(2)} minutes.`, "Improve recovery automation, capacity, and runbooks until RTO is met."));
    }
    const restoreLagMinutes = (new Date(latestTest.restoredThroughAt).getTime() - new Date(latestTest.sourceWatermarkAt).getTime()) / 60_000;
    if (restoreLagMinutes < 0) {
      findings.push(finding("RESILIENCE-RESTORE-WATERMARK-INVALID", "critical", "Restore completed behind its declared source watermark.", "Correct recovery data selection and repeat verification."));
    }
  }

  const state = findings.some((item) => item.severity === "critical")
    ? "critical"
    : findings.length > 0
      ? "degraded"
      : "healthy";

  return patientEducationResilienceEvaluationSchema.parse({
    schemaVersion: "1.0.0",
    backupSetId: backupSet.backupSetId,
    evaluatedAt,
    state,
    rpoMinutesObserved,
    ...(latestTest ? { mostRecentRestoreTestId: latestTest.restoreTestId } : {}),
    findings,
    incidentRequired: state === "critical",
  });
};

export const evaluatePatientEducationDestruction = ({
  receipt: rawReceipt,
  policy: rawPolicy,
  legalHolds: rawLegalHolds,
}: {
  receipt: unknown;
  policy: unknown;
  legalHolds: unknown[];
}) => {
  const receipt = patientEducationDestructionReceiptSchema.parse(rawReceipt);
  const policy = patientEducationResiliencePolicySchema.parse(rawPolicy);
  const legalHolds = rawLegalHolds.map((hold) => patientEducationLegalHoldSchema.parse(hold));
  const errors: string[] = [];
  const rule = policy.retentionRules.find((candidate) => candidate.recordClass === receipt.recordClass);
  if (!rule) errors.push(`No retention rule exists for ${receipt.recordClass}.`);
  if (policy.prohibitGovernanceRecordDestruction && ["review_approval", "release_record", "signature_envelope", "distribution_record", "control_notice", "acknowledgment", "incident_record", "destruction_receipt"].includes(receipt.recordClass)) {
    errors.push(`Governance class ${receipt.recordClass} cannot be destroyed.`);
  }
  if (rule && !rule.destructionAllowed) errors.push(`Retention rule prohibits destruction of ${receipt.recordClass}.`);
  const activeHold = legalHolds.some((hold) =>
    hold.status === "active"
    && hold.organizationKey === receipt.organizationKey
    && (hold.recordClasses.includes(receipt.recordClass) || hold.objectRefs.some((ref) => receipt.objectRefs.includes(ref))),
  );
  if (activeHold) errors.push("An active legal hold covers one or more records in the destruction receipt.");
  if (rule) {
    const approvedRoles = new Set(receipt.approvals.map((approval) => approval.roleId));
    const missingRoles = rule.requiredDestructionApproverRoleIds.filter((roleId) => !approvedRoles.has(roleId));
    if (missingRoles.length > 0) errors.push(`Destruction approval role(s) missing: ${missingRoles.join(", ")}.`);
  }
  return { allowed: errors.length === 0, errors };
};
