import { describe, expect, it } from "vitest";
import {
  evaluatePatientEducationMigrationPlan,
  verifyPatientEducationMigrationReceipt,
} from "@/lib/patientEducationSchemaMigration";

const policy = {
  schemaVersion: "1.0.0" as const,
  policyId: "CAF-PE-MIGRATION-POLICY-DEMO",
  reversibleRequiredObjectTypes: ["release_record" as const, "distribution_record" as const, "control_notice" as const],
  requiredApproverRoleIds: {
    release_record: ["governance_owner", "security_reviewer"],
  },
  prohibitVersionDowngrade: true as const,
  requireStableIdentifiers: true as const,
  requireOrganizationScopePreservation: true as const,
  requireClassificationPreservation: true as const,
  requireAuditHistoryPreservation: true as const,
  requireRollbackTestForReversible: true as const,
};

const step = {
  migrationId: "CAF-PE-MIGRATION-RELEASE-100-110",
  objectType: "release_record" as const,
  fromSchemaVersion: "1.0.0",
  toSchemaVersion: "1.1.0",
  implementationRef: "private-code://migrations/release-100-110",
  implementationSha256: "a".repeat(64),
  status: "approved" as const,
  reversible: true,
  reverseMigrationId: "CAF-PE-MIGRATION-RELEASE-110-100",
  preservesStableIdentifiers: true,
  preservesOrganizationScope: true,
  preservesDataClassification: true,
  preservesAuditHistory: true,
  knownLosses: [],
  approvedByRoleIds: ["governance_owner", "security_reviewer"],
  approvedAt: "2026-07-18T17:00:00.000Z",
  testFixtureRefs: ["fixture://release-record-v1"],
};

const plan = {
  schemaVersion: "1.0.0" as const,
  planId: "CAF-PE-MIGRATION-PLAN-DEMO",
  objectType: "release_record" as const,
  objectId: "CAF-PE-DEMO-SAFETY-v1.0.0",
  organizationKey: "CAF-GLOBAL",
  inputSchemaVersion: "1.0.0",
  targetSchemaVersion: "1.1.0",
  inputSha256: "b".repeat(64),
  createdAt: "2026-07-18T17:00:00.000Z",
  createdByPrincipalId: "CAF-PE-PRINCIPAL-MIGRATION-OWNER",
  steps: [step],
  dryRunRequired: true as const,
  backupRef: "backup://release-record-demo",
  rollbackTestRef: "test://rollback-release-record-demo",
};

describe("patientEducationSchemaMigration", () => {
  it("approves a contiguous reversible migration that preserves governed fields", () => {
    const result = evaluatePatientEducationMigrationPlan({
      plan,
      policy,
      evaluatedAt: "2026-07-18T18:00:00.000Z",
    });
    expect(result.decision).toBe("approved_to_execute");
    expect(result.findings).toEqual([]);
  });

  it("blocks version gaps, identifier loss, and missing rollback tests", () => {
    const result = evaluatePatientEducationMigrationPlan({
      plan: {
        ...plan,
        steps: [{
          ...step,
          fromSchemaVersion: "1.0.1",
          preservesStableIdentifiers: false,
        }],
        rollbackTestRef: undefined,
      },
      policy,
      evaluatedAt: "2026-07-18T18:00:00.000Z",
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "MIGRATION-CHAIN-NOT-CONTIGUOUS" }),
      expect.objectContaining({ code: "MIGRATION-STABLE-ID-PRESERVATION-REQUIRED" }),
      expect.objectContaining({ code: "MIGRATION-ROLLBACK-TEST-REQUIRED" }),
    ]));
  });

  it("blocks irreversible migration of release history", () => {
    const result = evaluatePatientEducationMigrationPlan({
      plan: {
        ...plan,
        steps: [{
          ...step,
          reversible: false,
          reverseMigrationId: undefined,
        }],
      },
      policy,
      evaluatedAt: "2026-07-18T18:00:00.000Z",
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "MIGRATION-REVERSIBILITY-REQUIRED" }),
    ]));
  });

  it("verifies an exact migration receipt", () => {
    const receipt = {
      schemaVersion: "1.0.0" as const,
      receiptId: "CAF-PE-MIGRATION-RECEIPT-DEMO",
      planId: plan.planId,
      objectId: plan.objectId,
      organizationKey: plan.organizationKey,
      inputSha256: plan.inputSha256,
      outputSha256: "c".repeat(64),
      inputSchemaVersion: plan.inputSchemaVersion,
      outputSchemaVersion: plan.targetSchemaVersion,
      executedMigrationIds: [step.migrationId],
      executedAt: "2026-07-18T18:00:00.000Z",
      executorPrincipalId: "CAF-PE-PRINCIPAL-MIGRATION-RUNNER",
      dryRunReceiptRef: "dry-run://release-record-demo",
      backupRef: plan.backupRef,
      verificationStatus: "passed" as const,
      verificationFindings: [],
    };
    expect(verifyPatientEducationMigrationReceipt({ plan, receipt })).toEqual({ valid: true, errors: [] });
    expect(verifyPatientEducationMigrationReceipt({
      plan,
      receipt: { ...receipt, executedMigrationIds: ["CAF-PE-MIGRATION-OTHER"] },
    }).valid).toBe(false);
  });
});
