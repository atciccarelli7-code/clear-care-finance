import { describe, expect, it } from "vitest";
import {
  buildPatientEducationJobCommand,
  calculatePatientEducationIdempotencyKey,
  evaluatePatientEducationJobState,
  patientEducationJobCommandUnsignedSchema,
  reconcilePatientEducationDuplicateCommands,
  verifyPatientEducationJobCommand,
} from "@/lib/patientEducationJobOrchestration";

const payloadSha256 = "a".repeat(64);
const candidateSha256 = "b".repeat(64);
const operationId = "CAF-PE-OPERATION-DEMO-DELIVERY";

const policy = {
  schemaVersion: "1.0.0" as const,
  policyId: "CAF-PE-JOB-POLICY-DEMO",
  retryableErrorCodes: [
    "DEPENDENCY_UNAVAILABLE" as const,
    "DESTINATION_TIMEOUT" as const,
    "DESTINATION_RATE_LIMITED" as const,
    "TRANSIENT_NETWORK_FAILURE" as const,
    "LEASE_EXPIRED" as const,
    "CONCURRENCY_CONFLICT" as const,
  ],
  nonretryableErrorCodes: [
    "VALIDATION_FAILED" as const,
    "AUTHORIZATION_BLOCKED" as const,
    "INTEGRITY_FAILED" as const,
    "PRIVACY_BOUNDARY_FAILED" as const,
    "ORGANIZATION_SCOPE_MISMATCH" as const,
    "DESTINATION_REJECTED" as const,
    "SIGNING_KEY_REVOKED" as const,
    "PACKAGE_SUSPENDED" as const,
    "PACKAGE_RECALLED" as const,
    "UNSUPPORTED_SCHEMA" as const,
    "NONRETRYABLE_CONFIGURATION" as const,
  ],
  baseBackoffSeconds: 30,
  maximumBackoffSeconds: 600,
  jitterPercent: 10,
  leaseDurationSeconds: 120,
  heartbeatIntervalSeconds: 30,
  maximumClockSkewSeconds: 5,
  replayableJobTypes: ["compile" as const, "quality_analysis" as const, "evidence_check" as const, "deliver" as const, "audit_export" as const],
};

const idempotencyKey = calculatePatientEducationIdempotencyKey({
  jobType: "deliver",
  operationId,
  organizationKey: "DEMO-HOSPITAL",
  packageId: "CAF-PE-DEMO-SAFETY",
  packageVersion: "1.0.0",
  candidateSha256,
  destinationId: "CAF-PE-DESTINATION-DEMO-PORTAL",
  payloadSha256,
});

const unsignedCommand = {
  schemaVersion: "1.0.0" as const,
  jobId: "CAF-PE-JOB-DEMO-DELIVERY",
  jobType: "deliver" as const,
  operationId,
  idempotencyKey,
  organizationKey: "DEMO-HOSPITAL",
  environment: "production" as const,
  packageId: "CAF-PE-DEMO-SAFETY",
  packageVersion: "1.0.0",
  candidateSha256,
  destinationId: "CAF-PE-DESTINATION-DEMO-PORTAL",
  orderingKey: "caf-pe-order:demo-hospital:portal",
  payloadRef: "payload://synthetic-authorized-delivery-envelope",
  payloadSha256,
  createdAt: "2026-07-18T20:00:00.000Z",
  notBefore: "2026-07-18T20:00:00.000Z",
  expiresAt: "2026-07-19T20:00:00.000Z",
  priority: "high" as const,
  maximumAttempts: 3,
  containsPatientLevelData: false as const,
  containsFreeTextCaseNarrative: false as const,
  requestedByPrincipalId: "CAF-PE-PRINCIPAL-DELIVERY-AUTHORITY",
};

const command = buildPatientEducationJobCommand(unsignedCommand);

const attempt = (
  attemptNumber: number,
  outcome: "succeeded" | "retryable_failure" | "nonretryable_failure" | "lease_lost",
  errorCode?: "DESTINATION_TIMEOUT" | "AUTHORIZATION_BLOCKED" | "LEASE_EXPIRED",
) => ({
  attemptId: `CAF-PE-ATTEMPT-DEMO-${attemptNumber}`,
  jobId: command.jobId,
  attemptNumber,
  leaseId: `CAF-PE-LEASE-DEMO-${attemptNumber}`,
  fencingToken: attemptNumber,
  startedAt: `2026-07-18T20:0${attemptNumber}:00.000Z`,
  completedAt: `2026-07-18T20:0${attemptNumber}:10.000Z`,
  outcome,
  ...(errorCode ? { errorCode, errorDetailRef: `error-detail://synthetic/${attemptNumber}` } : {}),
  ...(outcome === "succeeded" ? {
    resultRef: "delivery-receipt://synthetic-success",
    resultSha256: "c".repeat(64),
    sideEffectReceiptRef: "side-effect://synthetic-logical-delivery",
  } : {}),
  containsPatientLevelData: false as const,
});

describe("patientEducationJobOrchestration", () => {
  it("builds and verifies deterministic command integrity and idempotency", () => {
    expect(idempotencyKey).toMatch(/^caf-pe:.*:[a-f0-9]{64}$/);
    expect(verifyPatientEducationJobCommand(command)).toEqual({ valid: true, errors: [] });
    const rebuiltKey = calculatePatientEducationIdempotencyKey({
      jobType: "deliver",
      operationId,
      organizationKey: "DEMO-HOSPITAL",
      packageId: "CAF-PE-DEMO-SAFETY",
      packageVersion: "1.0.0",
      candidateSha256,
      destinationId: "CAF-PE-DESTINATION-DEMO-PORTAL",
      payloadSha256,
    });
    expect(rebuiltKey).toBe(idempotencyKey);
  });

  it("acquires the first lease and detects a stale lease with fencing", () => {
    const first = evaluatePatientEducationJobState({
      state: {
        schemaVersion: "1.0.0",
        command,
        status: "queued",
        attempts: [],
        updatedAt: "2026-07-18T20:00:00.000Z",
      },
      policy,
      evaluatedAt: "2026-07-18T20:00:01.000Z",
    });
    expect(first.decision).toBe("acquire_lease");

    const stale = evaluatePatientEducationJobState({
      state: {
        schemaVersion: "1.0.0",
        command,
        status: "leased",
        activeLease: {
          leaseId: "CAF-PE-LEASE-DEMO-STALE",
          jobId: command.jobId,
          workerIdentityRef: "workload://synthetic-worker-one",
          acquiredAt: "2026-07-18T20:00:00.000Z",
          heartbeatAt: "2026-07-18T20:00:30.000Z",
          expiresAt: "2026-07-18T20:02:00.000Z",
          fencingToken: 1,
          status: "active",
        },
        attempts: [attempt(1, "lease_lost", "LEASE_EXPIRED")],
        updatedAt: "2026-07-18T20:02:10.000Z",
      },
      policy,
      evaluatedAt: "2026-07-18T20:03:00.000Z",
    });
    expect(stale.decision).toBe("acquire_lease");
    expect(stale.reasonCodes).toContain("JOB-LEASE-EXPIRED");
  });

  it("applies deterministic retry backoff and dead-letters after maximum attempts", () => {
    const retryState = {
      schemaVersion: "1.0.0" as const,
      command,
      status: "retry_scheduled" as const,
      attempts: [attempt(1, "retryable_failure", "DESTINATION_TIMEOUT")],
      nextAttemptAt: "2026-07-18T20:05:00.000Z",
      updatedAt: "2026-07-18T20:01:10.000Z",
    };
    const waiting = evaluatePatientEducationJobState({ state: retryState, policy, evaluatedAt: "2026-07-18T20:01:20.000Z" });
    expect(waiting.decision).toBe("wait");
    expect(waiting.reasonCodes).toContain("JOB-BACKOFF-ACTIVE");
    expect(waiting.nextAttemptAt).toBeDefined();

    const exhausted = evaluatePatientEducationJobState({
      state: {
        ...retryState,
        attempts: [
          attempt(1, "retryable_failure", "DESTINATION_TIMEOUT"),
          attempt(2, "retryable_failure", "DESTINATION_TIMEOUT"),
          attempt(3, "retryable_failure", "DESTINATION_TIMEOUT"),
        ],
        updatedAt: "2026-07-18T20:03:10.000Z",
      },
      policy,
      evaluatedAt: "2026-07-18T21:00:00.000Z",
    });
    expect(exhausted.decision).toBe("dead_letter");
    expect(exhausted.reasonCodes).toContain("JOB-MAXIMUM-ATTEMPTS-EXHAUSTED");
  });

  it("commits only one logical result despite at-least-once processing", () => {
    const successAttempt = attempt(1, "succeeded");
    const result = evaluatePatientEducationJobState({
      state: {
        schemaVersion: "1.0.0",
        command,
        status: "succeeded",
        attempts: [successAttempt],
        logicalResultRef: successAttempt.resultRef,
        logicalResultSha256: successAttempt.resultSha256,
        successfulAttemptId: successAttempt.attemptId,
        updatedAt: successAttempt.completedAt,
      },
      policy,
      evaluatedAt: "2026-07-18T21:00:00.000Z",
    });
    expect(result.decision).toBe("mark_succeeded");
    expect(result.reasonCodes).toContain("JOB-LOGICAL-RESULT-ALREADY-COMMITTED");
  });

  it("reconciles harmless duplicate commands and detects conflicting replay", () => {
    const duplicate = buildPatientEducationJobCommand({
      ...unsignedCommand,
      jobId: "CAF-PE-JOB-DEMO-DUPLICATE",
      createdAt: "2026-07-18T20:00:01.000Z",
      notBefore: "2026-07-18T20:00:01.000Z",
    });
    const reconciled = reconcilePatientEducationDuplicateCommands([command, duplicate]);
    expect(reconciled.valid).toBe(true);
    expect(reconciled.canonicalJobs).toHaveLength(1);
    expect(reconciled.duplicateJobIds).toEqual(["CAF-PE-JOB-DEMO-DUPLICATE"]);

    const conflicting = buildPatientEducationJobCommand({
      ...unsignedCommand,
      jobId: "CAF-PE-JOB-DEMO-CONFLICT",
      candidateSha256: "9".repeat(64),
      createdAt: "2026-07-18T20:00:02.000Z",
      notBefore: "2026-07-18T20:00:02.000Z",
    });
    const conflictResult = reconcilePatientEducationDuplicateCommands([command, conflicting]);
    expect(conflictResult.valid).toBe(false);
    expect(conflictResult.conflictingIdempotencyKeys).toEqual([idempotencyKey]);
  });

  it("dead-letters tampered commands and nonretryable authorization failure", () => {
    const tampered = { ...command, candidateSha256: "8".repeat(64) };
    expect(verifyPatientEducationJobCommand(tampered).valid).toBe(false);
    const tamperedDecision = evaluatePatientEducationJobState({
      state: {
        schemaVersion: "1.0.0",
        command: tampered,
        status: "queued",
        attempts: [],
        updatedAt: "2026-07-18T20:00:00.000Z",
      },
      policy,
      evaluatedAt: "2026-07-18T20:01:00.000Z",
    });
    expect(tamperedDecision.decision).toBe("dead_letter");
    expect(tamperedDecision.reasonCodes).toContain("JOB-COMMAND-INTEGRITY-FAILED");

    const blocked = evaluatePatientEducationJobState({
      state: {
        schemaVersion: "1.0.0",
        command,
        status: "retry_scheduled",
        attempts: [attempt(1, "nonretryable_failure", "AUTHORIZATION_BLOCKED")],
        nextAttemptAt: "2026-07-18T20:05:00.000Z",
        updatedAt: "2026-07-18T20:01:10.000Z",
      },
      policy,
      evaluatedAt: "2026-07-18T20:10:00.000Z",
    });
    expect(blocked.decision).toBe("dead_letter");
    expect(blocked.reasonCodes).toContain("JOB-NONRETRYABLE-FAILURE");
  });

  it("prohibits patient-level data and free-text case narratives in job commands", () => {
    expect(patientEducationJobCommandUnsignedSchema.safeParse({
      ...unsignedCommand,
      containsPatientLevelData: true,
    }).success).toBe(false);
    expect(patientEducationJobCommandUnsignedSchema.safeParse({
      ...unsignedCommand,
      containsFreeTextCaseNarrative: true,
    }).success).toBe(false);
  });
});
