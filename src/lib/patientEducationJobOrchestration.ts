import { createHash } from "node:crypto";
import { z } from "zod";

const semverSchema = z.string().regex(/^\d+\.\d+\.\d+$/);
const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const organizationKeySchema = z.string().regex(/^(?:CAF-GLOBAL|[A-Z0-9-]+)$/);

export const patientEducationJobTypeSchema = z.enum([
  "compile",
  "quality_analysis",
  "evidence_check",
  "sign",
  "authorize",
  "deliver",
  "process_receipt",
  "suspend_distribution",
  "recall_distribution",
  "notify_organization",
  "audit_export",
  "backup",
  "restore_test",
]);

export const patientEducationJobErrorCodeSchema = z.enum([
  "DEPENDENCY_UNAVAILABLE",
  "DESTINATION_TIMEOUT",
  "DESTINATION_RATE_LIMITED",
  "TRANSIENT_NETWORK_FAILURE",
  "LEASE_EXPIRED",
  "CONCURRENCY_CONFLICT",
  "VALIDATION_FAILED",
  "AUTHORIZATION_BLOCKED",
  "INTEGRITY_FAILED",
  "PRIVACY_BOUNDARY_FAILED",
  "ORGANIZATION_SCOPE_MISMATCH",
  "DESTINATION_REJECTED",
  "SIGNING_KEY_REVOKED",
  "PACKAGE_SUSPENDED",
  "PACKAGE_RECALLED",
  "UNSUPPORTED_SCHEMA",
  "NONRETRYABLE_CONFIGURATION",
]);

export const patientEducationJobCommandUnsignedSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  jobId: z.string().regex(/^CAF-PE-JOB-[A-Z0-9-]+$/),
  jobType: patientEducationJobTypeSchema,
  operationId: z.string().regex(/^CAF-PE-OPERATION-[A-Z0-9-]+$/),
  idempotencyKey: z.string().regex(/^caf-pe:[a-z0-9:_-]+:[a-f0-9]{64}$/),
  organizationKey: organizationKeySchema,
  environment: z.enum(["test", "preview", "production"]),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/).optional(),
  packageVersion: semverSchema.optional(),
  candidateSha256: sha256Schema.optional(),
  destinationId: z.string().regex(/^CAF-PE-DESTINATION-[A-Z0-9-]+$/).optional(),
  orderingKey: z.string().regex(/^caf-pe-order:[a-z0-9:_-]+$/),
  payloadRef: z.string().trim().min(3).max(1000),
  payloadSha256: sha256Schema,
  createdAt: z.string().datetime(),
  notBefore: z.string().datetime(),
  expiresAt: z.string().datetime(),
  priority: z.enum(["low", "normal", "high", "critical"]),
  maximumAttempts: z.number().int().positive().max(20),
  containsPatientLevelData: z.literal(false),
  containsFreeTextCaseNarrative: z.literal(false),
  requestedByPrincipalId: z.string().regex(/^CAF-PE-PRINCIPAL-[A-Z0-9-]+$/),
}).superRefine((value, context) => {
  if ((value.packageId && !value.packageVersion) || (!value.packageId && value.packageVersion)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Job commands must include package ID and version together." });
  }
  if (new Date(value.expiresAt) <= new Date(value.notBefore) || new Date(value.notBefore) < new Date(value.createdAt)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Job timing must satisfy createdAt <= notBefore < expiresAt." });
  }
  if (["compile", "quality_analysis", "sign", "authorize", "deliver", "suspend_distribution", "recall_distribution"].includes(value.jobType) && (!value.packageId || !value.candidateSha256)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `${value.jobType} jobs require package scope and candidate SHA-256.` });
  }
  if (["deliver", "process_receipt"].includes(value.jobType) && !value.destinationId) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `${value.jobType} jobs require destinationId.` });
  }
});

export const patientEducationJobCommandSchema = patientEducationJobCommandUnsignedSchema.extend({
  commandSha256: sha256Schema,
});

export const patientEducationJobLeaseSchema = z.object({
  leaseId: z.string().regex(/^CAF-PE-LEASE-[A-Z0-9-]+$/),
  jobId: z.string().regex(/^CAF-PE-JOB-[A-Z0-9-]+$/),
  workerIdentityRef: z.string().trim().min(3).max(1000),
  acquiredAt: z.string().datetime(),
  heartbeatAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  fencingToken: z.number().int().positive(),
  status: z.enum(["active", "released", "expired", "revoked"]),
}).superRefine((value, context) => {
  if (new Date(value.expiresAt) <= new Date(value.acquiredAt)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Lease ${value.leaseId} expiration must occur after acquisition.` });
  }
  if (new Date(value.heartbeatAt) < new Date(value.acquiredAt) || new Date(value.heartbeatAt) > new Date(value.expiresAt)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Lease ${value.leaseId} heartbeat is outside its validity interval.` });
  }
});

export const patientEducationJobAttemptSchema = z.object({
  attemptId: z.string().regex(/^CAF-PE-ATTEMPT-[A-Z0-9-]+$/),
  jobId: z.string().regex(/^CAF-PE-JOB-[A-Z0-9-]+$/),
  attemptNumber: z.number().int().positive().max(20),
  leaseId: z.string().regex(/^CAF-PE-LEASE-[A-Z0-9-]+$/),
  fencingToken: z.number().int().positive(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime(),
  outcome: z.enum(["succeeded", "retryable_failure", "nonretryable_failure", "lease_lost", "cancelled"]),
  errorCode: patientEducationJobErrorCodeSchema.optional(),
  errorDetailRef: z.string().trim().min(3).max(1000).optional(),
  resultRef: z.string().trim().min(3).max(1000).optional(),
  resultSha256: sha256Schema.optional(),
  sideEffectReceiptRef: z.string().trim().min(3).max(1000).optional(),
  containsPatientLevelData: z.literal(false),
}).superRefine((value, context) => {
  if (new Date(value.completedAt) < new Date(value.startedAt)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Attempt ${value.attemptId} completion precedes its start.` });
  }
  if (value.outcome === "succeeded" && (!value.resultRef || !value.resultSha256)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Successful attempt ${value.attemptId} requires result reference and SHA-256.` });
  }
  if (value.outcome !== "succeeded" && !value.errorCode && value.outcome !== "cancelled") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Failed attempt ${value.attemptId} requires a fixed error code.` });
  }
  if (value.outcome === "succeeded" && value.errorCode) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Successful attempt ${value.attemptId} cannot contain an error code.` });
  }
});

export const patientEducationJobStateSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  command: patientEducationJobCommandSchema,
  status: z.enum(["queued", "leased", "retry_scheduled", "succeeded", "dead_letter", "cancelled", "expired"]),
  activeLease: patientEducationJobLeaseSchema.optional(),
  attempts: z.array(patientEducationJobAttemptSchema),
  nextAttemptAt: z.string().datetime().optional(),
  logicalResultRef: z.string().trim().min(3).max(1000).optional(),
  logicalResultSha256: sha256Schema.optional(),
  successfulAttemptId: z.string().regex(/^CAF-PE-ATTEMPT-[A-Z0-9-]+$/).optional(),
  deadLetterRef: z.string().trim().min(3).max(1000).optional(),
  updatedAt: z.string().datetime(),
}).superRefine((value, context) => {
  const attemptIds = value.attempts.map((attempt) => attempt.attemptId);
  const attemptNumbers = value.attempts.map((attempt) => attempt.attemptNumber);
  if (new Set(attemptIds).size !== attemptIds.length) context.addIssue({ code: z.ZodIssueCode.custom, message: "Job attempt IDs must be unique." });
  if (new Set(attemptNumbers).size !== attemptNumbers.length) context.addIssue({ code: z.ZodIssueCode.custom, message: "Job attempt numbers must be unique." });
  if (value.attempts.some((attempt) => attempt.jobId !== value.command.jobId)) context.addIssue({ code: z.ZodIssueCode.custom, message: "Every attempt must belong to the state command job ID." });
  if (value.activeLease && value.activeLease.jobId !== value.command.jobId) context.addIssue({ code: z.ZodIssueCode.custom, message: "Active lease must belong to the state command job ID." });
  const successes = value.attempts.filter((attempt) => attempt.outcome === "succeeded");
  if (successes.length > 1) context.addIssue({ code: z.ZodIssueCode.custom, message: "A logical job may have only one successful attempt." });
  if (value.status === "succeeded" && (!value.logicalResultRef || !value.logicalResultSha256 || !value.successfulAttemptId || successes.length !== 1)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Succeeded job state requires one exact successful attempt and logical result." });
  }
  if (value.status !== "succeeded" && (value.logicalResultRef || value.logicalResultSha256 || value.successfulAttemptId)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Only succeeded jobs may expose a logical result." });
  }
  if (value.status === "dead_letter" && !value.deadLetterRef) context.addIssue({ code: z.ZodIssueCode.custom, message: "Dead-letter job state requires deadLetterRef." });
  if (value.status === "retry_scheduled" && !value.nextAttemptAt) context.addIssue({ code: z.ZodIssueCode.custom, message: "Retry-scheduled jobs require nextAttemptAt." });
});

export const patientEducationDeadLetterSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  deadLetterId: z.string().regex(/^CAF-PE-DEAD-LETTER-[A-Z0-9-]+$/),
  jobId: z.string().regex(/^CAF-PE-JOB-[A-Z0-9-]+$/),
  commandSha256: sha256Schema,
  idempotencyKey: z.string().regex(/^caf-pe:[a-z0-9:_-]+:[a-f0-9]{64}$/),
  organizationKey: organizationKeySchema,
  jobType: patientEducationJobTypeSchema,
  lastErrorCode: patientEducationJobErrorCodeSchema,
  attemptCount: z.number().int().positive().max(20),
  deadLetteredAt: z.string().datetime(),
  reason: z.string().trim().min(3).max(3000),
  replayAllowed: z.boolean(),
  replayRequiresRoleIds: z.array(z.string().regex(/^[a-z0-9_]+$/)),
  replayedByJobId: z.string().regex(/^CAF-PE-JOB-[A-Z0-9-]+$/).optional(),
  containsPatientLevelData: z.literal(false),
}).superRefine((value, context) => {
  if (value.replayedByJobId && !value.replayAllowed) context.addIssue({ code: z.ZodIssueCode.custom, message: "A non-replayable dead letter cannot reference a replay job." });
});

export const patientEducationJobPolicySchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  policyId: z.string().regex(/^CAF-PE-JOB-POLICY-[A-Z0-9-]+$/),
  retryableErrorCodes: z.array(patientEducationJobErrorCodeSchema),
  nonretryableErrorCodes: z.array(patientEducationJobErrorCodeSchema),
  baseBackoffSeconds: z.number().int().positive().max(3600),
  maximumBackoffSeconds: z.number().int().positive().max(86400),
  jitterPercent: z.number().min(0).max(100),
  leaseDurationSeconds: z.number().int().positive().max(3600),
  heartbeatIntervalSeconds: z.number().int().positive().max(1800),
  maximumClockSkewSeconds: z.number().int().nonnegative().max(300),
  replayableJobTypes: z.array(patientEducationJobTypeSchema),
}).superRefine((value, context) => {
  const overlap = value.retryableErrorCodes.filter((code) => value.nonretryableErrorCodes.includes(code));
  if (overlap.length > 0) context.addIssue({ code: z.ZodIssueCode.custom, message: `Job error codes cannot be both retryable and nonretryable: ${overlap.join(", ")}.` });
  if (value.heartbeatIntervalSeconds >= value.leaseDurationSeconds) context.addIssue({ code: z.ZodIssueCode.custom, message: "Job heartbeat interval must be shorter than lease duration." });
  if (value.maximumBackoffSeconds < value.baseBackoffSeconds) context.addIssue({ code: z.ZodIssueCode.custom, message: "Maximum backoff cannot be shorter than base backoff." });
});

export const patientEducationJobDecisionSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  jobId: z.string(),
  evaluatedAt: z.string().datetime(),
  decision: z.enum(["wait", "acquire_lease", "continue_lease", "schedule_retry", "mark_succeeded", "dead_letter", "cancel", "expired"]),
  nextAttemptAt: z.string().datetime().optional(),
  reasonCodes: z.array(z.string().regex(/^JOB-[A-Z0-9-]+$/)),
});

const canonicalize = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, nested]) => [key, canonicalize(nested)]));
  return value;
};
const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(canonicalize(value)), "utf8").digest("hex");

export const buildPatientEducationJobCommand = (input: unknown) => {
  const unsigned = patientEducationJobCommandUnsignedSchema.parse(input);
  return patientEducationJobCommandSchema.parse({ ...unsigned, commandSha256: digest(unsigned) });
};

export const verifyPatientEducationJobCommand = (input: unknown) => {
  const parsed = patientEducationJobCommandSchema.safeParse(input);
  if (!parsed.success) return { valid: false, errors: parsed.error.issues.map((issue) => issue.message) };
  const { commandSha256, ...unsigned } = parsed.data;
  const errors = digest(unsigned) === commandSha256 ? [] : ["Job command SHA-256 does not match canonical contents."];
  return { valid: errors.length === 0, errors };
};

export const calculatePatientEducationIdempotencyKey = ({
  jobType,
  operationId,
  organizationKey,
  packageId,
  packageVersion,
  candidateSha256,
  destinationId,
  payloadSha256,
}: {
  jobType: z.infer<typeof patientEducationJobTypeSchema>;
  operationId: string;
  organizationKey: string;
  packageId?: string;
  packageVersion?: string;
  candidateSha256?: string;
  destinationId?: string;
  payloadSha256: string;
}) => {
  const scope = [jobType, operationId, organizationKey, packageId ?? "none", packageVersion ?? "none", candidateSha256 ?? "none", destinationId ?? "none", payloadSha256].join(":").toLowerCase().replace(/[^a-z0-9:_-]/g, "-");
  return `caf-pe:${scope}:${digest(scope)}`;
};

export const evaluatePatientEducationJobState = ({
  state: rawState,
  policy: rawPolicy,
  evaluatedAt = new Date().toISOString(),
}: {
  state: unknown;
  policy: unknown;
  evaluatedAt?: string;
}) => {
  const state = patientEducationJobStateSchema.parse(rawState);
  const policy = patientEducationJobPolicySchema.parse(rawPolicy);
  const reasonCodes: string[] = [];

  if (!verifyPatientEducationJobCommand(state.command).valid) return patientEducationJobDecisionSchema.parse({ schemaVersion: "1.0.0", jobId: state.command.jobId, evaluatedAt, decision: "dead_letter", reasonCodes: ["JOB-COMMAND-INTEGRITY-FAILED"] });
  if (new Date(evaluatedAt) >= new Date(state.command.expiresAt)) return patientEducationJobDecisionSchema.parse({ schemaVersion: "1.0.0", jobId: state.command.jobId, evaluatedAt, decision: "expired", reasonCodes: ["JOB-COMMAND-EXPIRED"] });
  if (state.status === "succeeded") return patientEducationJobDecisionSchema.parse({ schemaVersion: "1.0.0", jobId: state.command.jobId, evaluatedAt, decision: "mark_succeeded", reasonCodes: ["JOB-LOGICAL-RESULT-ALREADY-COMMITTED"] });
  if (state.status === "cancelled") return patientEducationJobDecisionSchema.parse({ schemaVersion: "1.0.0", jobId: state.command.jobId, evaluatedAt, decision: "cancel", reasonCodes: ["JOB-CANCELLED"] });
  if (state.status === "dead_letter") return patientEducationJobDecisionSchema.parse({ schemaVersion: "1.0.0", jobId: state.command.jobId, evaluatedAt, decision: "dead_letter", reasonCodes: ["JOB-ALREADY-DEAD-LETTERED"] });
  if (new Date(evaluatedAt) < new Date(state.command.notBefore)) return patientEducationJobDecisionSchema.parse({ schemaVersion: "1.0.0", jobId: state.command.jobId, evaluatedAt, decision: "wait", nextAttemptAt: state.command.notBefore, reasonCodes: ["JOB-NOT-BEFORE"] });

  if (state.activeLease?.status === "active") {
    const leaseExpired = new Date(evaluatedAt).getTime() > new Date(state.activeLease.expiresAt).getTime() + policy.maximumClockSkewSeconds * 1000;
    if (!leaseExpired) return patientEducationJobDecisionSchema.parse({ schemaVersion: "1.0.0", jobId: state.command.jobId, evaluatedAt, decision: "continue_lease", reasonCodes: ["JOB-ACTIVE-LEASE"] });
    reasonCodes.push("JOB-LEASE-EXPIRED");
  }

  const lastAttempt = [...state.attempts].sort((a, b) => b.attemptNumber - a.attemptNumber)[0];
  if (!lastAttempt) return patientEducationJobDecisionSchema.parse({ schemaVersion: "1.0.0", jobId: state.command.jobId, evaluatedAt, decision: "acquire_lease", reasonCodes: reasonCodes.length > 0 ? reasonCodes : ["JOB-FIRST-ATTEMPT"] });
  if (lastAttempt.outcome === "succeeded") return patientEducationJobDecisionSchema.parse({ schemaVersion: "1.0.0", jobId: state.command.jobId, evaluatedAt, decision: "mark_succeeded", reasonCodes: ["JOB-SUCCESSFUL-ATTEMPT-PRESENT"] });
  if (lastAttempt.outcome === "nonretryable_failure" || (lastAttempt.errorCode && policy.nonretryableErrorCodes.includes(lastAttempt.errorCode))) return patientEducationJobDecisionSchema.parse({ schemaVersion: "1.0.0", jobId: state.command.jobId, evaluatedAt, decision: "dead_letter", reasonCodes: ["JOB-NONRETRYABLE-FAILURE"] });
  if (state.attempts.length >= state.command.maximumAttempts) return patientEducationJobDecisionSchema.parse({ schemaVersion: "1.0.0", jobId: state.command.jobId, evaluatedAt, decision: "dead_letter", reasonCodes: ["JOB-MAXIMUM-ATTEMPTS-EXHAUSTED"] });
  if (lastAttempt.errorCode && !policy.retryableErrorCodes.includes(lastAttempt.errorCode) && lastAttempt.outcome !== "lease_lost") return patientEducationJobDecisionSchema.parse({ schemaVersion: "1.0.0", jobId: state.command.jobId, evaluatedAt, decision: "dead_letter", reasonCodes: ["JOB-ERROR-NOT-RETRYABLE"] });

  const exponent = Math.max(0, state.attempts.length - 1);
  const deterministicJitterUnit = parseInt(digest(state.command.idempotencyKey).slice(0, 8), 16) / 0xffffffff;
  const jitterMultiplier = 1 + ((deterministicJitterUnit * 2 - 1) * policy.jitterPercent) / 100;
  const backoffSeconds = Math.min(policy.maximumBackoffSeconds, policy.baseBackoffSeconds * 2 ** exponent) * jitterMultiplier;
  const nextAttemptAt = new Date(new Date(lastAttempt.completedAt).getTime() + backoffSeconds * 1000).toISOString();
  if (new Date(evaluatedAt) < new Date(nextAttemptAt)) return patientEducationJobDecisionSchema.parse({ schemaVersion: "1.0.0", jobId: state.command.jobId, evaluatedAt, decision: "wait", nextAttemptAt, reasonCodes: ["JOB-BACKOFF-ACTIVE"] });
  return patientEducationJobDecisionSchema.parse({ schemaVersion: "1.0.0", jobId: state.command.jobId, evaluatedAt, decision: "acquire_lease", reasonCodes: [...reasonCodes, "JOB-RETRY-READY"] });
};

export const reconcilePatientEducationDuplicateCommands = (commandsInput: unknown[]) => {
  const commands = commandsInput.map((command) => patientEducationJobCommandSchema.parse(command));
  const groups = new Map<string, typeof commands>();
  for (const command of commands) groups.set(command.idempotencyKey, [...(groups.get(command.idempotencyKey) ?? []), command]);
  const conflicts: string[] = [];
  const canonicalJobs: typeof commands = [];
  const duplicateJobIds: string[] = [];
  for (const [key, group] of groups.entries()) {
    const fingerprints = new Set(group.map((command) => [command.jobType, command.organizationKey, command.environment, command.packageId, command.packageVersion, command.candidateSha256, command.destinationId, command.payloadSha256].join("|")));
    if (fingerprints.size > 1) conflicts.push(key);
    const sorted = [...group].sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.jobId.localeCompare(b.jobId));
    canonicalJobs.push(sorted[0]);
    duplicateJobIds.push(...sorted.slice(1).map((command) => command.jobId));
  }
  return { valid: conflicts.length === 0, canonicalJobs: canonicalJobs.sort((a, b) => a.jobId.localeCompare(b.jobId)), duplicateJobIds: duplicateJobIds.sort(), conflictingIdempotencyKeys: conflicts.sort() };
};
