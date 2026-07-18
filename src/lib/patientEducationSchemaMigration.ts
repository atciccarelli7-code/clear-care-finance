import { z } from "zod";

const semverSchema = z.string().regex(/^\d+\.\d+\.\d+$/);
const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const roleIdSchema = z.string().regex(/^[a-z0-9_]+$/);

export const patientEducationMigratableObjectTypeSchema = z.enum([
  "package",
  "document",
  "evidence_dossier",
  "quality_report",
  "localization",
  "institution_overlay",
  "release_record",
  "delivery_envelope",
  "distribution_record",
  "control_notice",
  "pilot_analytics",
  "audit_export",
]);

export const patientEducationMigrationStepSchema = z.object({
  migrationId: z.string().regex(/^CAF-PE-MIGRATION-[A-Z0-9-]+$/),
  objectType: patientEducationMigratableObjectTypeSchema,
  fromSchemaVersion: semverSchema,
  toSchemaVersion: semverSchema,
  implementationRef: z.string().trim().min(3).max(1000),
  implementationSha256: sha256Schema,
  status: z.enum(["draft", "in_review", "approved", "retired"]),
  reversible: z.boolean(),
  reverseMigrationId: z.string().regex(/^CAF-PE-MIGRATION-[A-Z0-9-]+$/).optional(),
  preservesStableIdentifiers: z.boolean(),
  preservesOrganizationScope: z.boolean(),
  preservesDataClassification: z.boolean(),
  preservesAuditHistory: z.boolean(),
  knownLosses: z.array(z.string().trim().min(3).max(2000)),
  approvedByRoleIds: z.array(roleIdSchema),
  approvedAt: z.string().datetime().optional(),
  testFixtureRefs: z.array(z.string().trim().min(3).max(1000)),
}).superRefine((value, context) => {
  if (value.fromSchemaVersion === value.toSchemaVersion) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Migration source and target versions must differ." });
  }
  if (value.reversible && !value.reverseMigrationId) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Reversible migrations require a reverse migration ID." });
  }
  if (!value.reversible && value.reverseMigrationId) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Irreversible migrations cannot declare a reverse migration ID." });
  }
  if (value.status === "approved" && (!value.approvedAt || value.approvedByRoleIds.length === 0 || value.testFixtureRefs.length === 0)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Approved migrations require approval provenance and test fixtures." });
  }
});

export const patientEducationMigrationPlanSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  planId: z.string().regex(/^CAF-PE-MIGRATION-PLAN-[A-Z0-9-]+$/),
  objectType: patientEducationMigratableObjectTypeSchema,
  objectId: z.string().trim().min(3).max(500),
  organizationKey: z.string().regex(/^(?:CAF-GLOBAL|[A-Z0-9-]+)$/),
  inputSchemaVersion: semverSchema,
  targetSchemaVersion: semverSchema,
  inputSha256: sha256Schema,
  createdAt: z.string().datetime(),
  createdByPrincipalId: z.string().regex(/^CAF-PE-PRINCIPAL-[A-Z0-9-]+$/),
  steps: z.array(patientEducationMigrationStepSchema).min(1),
  dryRunRequired: z.literal(true),
  backupRef: z.string().trim().min(3).max(1000),
  rollbackTestRef: z.string().trim().min(3).max(1000).optional(),
});

export const patientEducationMigrationPolicySchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  policyId: z.string().regex(/^CAF-PE-MIGRATION-POLICY-[A-Z0-9-]+$/),
  reversibleRequiredObjectTypes: z.array(patientEducationMigratableObjectTypeSchema),
  requiredApproverRoleIds: z.record(patientEducationMigratableObjectTypeSchema, z.array(roleIdSchema).min(1)),
  prohibitVersionDowngrade: z.literal(true),
  requireStableIdentifiers: z.literal(true),
  requireOrganizationScopePreservation: z.literal(true),
  requireClassificationPreservation: z.literal(true),
  requireAuditHistoryPreservation: z.literal(true),
  requireRollbackTestForReversible: z.literal(true),
});

export const patientEducationMigrationFindingSchema = z.object({
  code: z.string().regex(/^MIGRATION-[A-Z0-9-]+$/),
  severity: z.literal("blocking"),
  message: z.string().trim().min(1),
  remediation: z.string().trim().min(1),
  migrationId: z.string().optional(),
});

export const patientEducationMigrationEvaluationSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  planId: z.string(),
  evaluatedAt: z.string().datetime(),
  decision: z.enum(["approved_to_execute", "blocked"]),
  orderedMigrationIds: z.array(z.string()),
  findings: z.array(patientEducationMigrationFindingSchema),
});

export const patientEducationMigrationReceiptSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  receiptId: z.string().regex(/^CAF-PE-MIGRATION-RECEIPT-[A-Z0-9-]+$/),
  planId: z.string().regex(/^CAF-PE-MIGRATION-PLAN-[A-Z0-9-]+$/),
  objectId: z.string().trim().min(3).max(500),
  organizationKey: z.string().regex(/^(?:CAF-GLOBAL|[A-Z0-9-]+)$/),
  inputSha256: sha256Schema,
  outputSha256: sha256Schema,
  inputSchemaVersion: semverSchema,
  outputSchemaVersion: semverSchema,
  executedMigrationIds: z.array(z.string().regex(/^CAF-PE-MIGRATION-[A-Z0-9-]+$/)).min(1),
  executedAt: z.string().datetime(),
  executorPrincipalId: z.string().regex(/^CAF-PE-PRINCIPAL-[A-Z0-9-]+$/),
  dryRunReceiptRef: z.string().trim().min(3).max(1000),
  backupRef: z.string().trim().min(3).max(1000),
  verificationStatus: z.enum(["passed", "failed"]),
  verificationFindings: z.array(z.string().trim().min(3).max(2000)),
}).superRefine((value, context) => {
  if (value.inputSha256 === value.outputSha256) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Migration output hash must differ from the input hash." });
  }
  if (value.verificationStatus === "passed" && value.verificationFindings.length > 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Passed migration receipts cannot contain verification findings." });
  }
  if (value.verificationStatus === "failed" && value.verificationFindings.length === 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Failed migration receipts require verification findings." });
  }
});

const parseVersion = (value: string) => value.split(".").map(Number) as [number, number, number];
const compareVersions = (left: string, right: string) => {
  const leftParts = parseVersion(left);
  const rightParts = parseVersion(right);
  for (let index = 0; index < 3; index += 1) {
    if (leftParts[index] !== rightParts[index]) return leftParts[index] - rightParts[index];
  }
  return 0;
};

const finding = (code: string, message: string, remediation: string, migrationId?: string) => ({
  code,
  severity: "blocking" as const,
  message,
  remediation,
  ...(migrationId ? { migrationId } : {}),
});

export const evaluatePatientEducationMigrationPlan = ({
  plan: rawPlan,
  policy: rawPolicy,
  evaluatedAt = new Date().toISOString(),
}: {
  plan: unknown;
  policy: unknown;
  evaluatedAt?: string;
}) => {
  const plan = patientEducationMigrationPlanSchema.parse(rawPlan);
  const policy = patientEducationMigrationPolicySchema.parse(rawPolicy);
  const findings: z.infer<typeof patientEducationMigrationFindingSchema>[] = [];

  if (new Set(plan.steps.map((step) => step.migrationId)).size !== plan.steps.length) {
    findings.push(finding("MIGRATION-DUPLICATE-STEP", "Migration step IDs are not unique.", "Use each approved migration exactly once."));
  }
  if (plan.steps.some((step) => step.objectType !== plan.objectType)) {
    findings.push(finding("MIGRATION-OBJECT-TYPE-MISMATCH", "One or more migration steps target a different object type.", "Use a plan containing only steps for the target object type."));
  }

  let expectedVersion = plan.inputSchemaVersion;
  for (const step of plan.steps) {
    if (step.fromSchemaVersion !== expectedVersion) {
      findings.push(finding(
        "MIGRATION-CHAIN-NOT-CONTIGUOUS",
        `Migration ${step.migrationId} begins at ${step.fromSchemaVersion}; expected ${expectedVersion}.`,
        "Provide a contiguous ordered migration chain.",
        step.migrationId,
      ));
    }
    if (policy.prohibitVersionDowngrade && compareVersions(step.toSchemaVersion, step.fromSchemaVersion) <= 0) {
      findings.push(finding(
        "MIGRATION-DOWNGRADE-PROHIBITED",
        `Migration ${step.migrationId} does not increase the schema version.`,
        "Create a forward migration to a higher semantic version.",
        step.migrationId,
      ));
    }
    if (step.status !== "approved") {
      findings.push(finding("MIGRATION-STEP-NOT-APPROVED", `Migration ${step.migrationId} is ${step.status}.`, "Complete review and approval before execution.", step.migrationId));
    }
    if (policy.reversibleRequiredObjectTypes.includes(plan.objectType) && !step.reversible) {
      findings.push(finding("MIGRATION-REVERSIBILITY-REQUIRED", `Migration ${step.migrationId} is not reversible.`, "Provide and test a reverse migration for this governed object type.", step.migrationId));
    }
    if (policy.requireStableIdentifiers && !step.preservesStableIdentifiers) {
      findings.push(finding("MIGRATION-STABLE-ID-PRESERVATION-REQUIRED", `Migration ${step.migrationId} does not preserve stable identifiers.`, "Redesign the migration to retain stable IDs and references.", step.migrationId));
    }
    if (policy.requireOrganizationScopePreservation && !step.preservesOrganizationScope) {
      findings.push(finding("MIGRATION-ORGANIZATION-SCOPE-PRESERVATION-REQUIRED", `Migration ${step.migrationId} may alter organization scope.`, "Preserve exact tenant ownership through the migration.", step.migrationId));
    }
    if (policy.requireClassificationPreservation && !step.preservesDataClassification) {
      findings.push(finding("MIGRATION-CLASSIFICATION-PRESERVATION-REQUIRED", `Migration ${step.migrationId} may alter data classification.`, "Preserve or explicitly strengthen classification; never silently weaken it.", step.migrationId));
    }
    if (policy.requireAuditHistoryPreservation && !step.preservesAuditHistory) {
      findings.push(finding("MIGRATION-AUDIT-HISTORY-PRESERVATION-REQUIRED", `Migration ${step.migrationId} may discard audit history.`, "Retain immutable event and provenance history.", step.migrationId));
    }
    if (step.knownLosses.length > 0) {
      findings.push(finding("MIGRATION-KNOWN-DATA-LOSS", `Migration ${step.migrationId} declares known loss.`, "Resolve the loss or create an independently approved archival preservation strategy.", step.migrationId));
    }
    const requiredRoles = policy.requiredApproverRoleIds[plan.objectType];
    const missingRoles = requiredRoles.filter((roleId) => !step.approvedByRoleIds.includes(roleId));
    if (missingRoles.length > 0) {
      findings.push(finding("MIGRATION-APPROVAL-ROLES-MISSING", `Migration ${step.migrationId} lacks role(s): ${missingRoles.join(", ")}.`, "Obtain every required migration approval.", step.migrationId));
    }
    expectedVersion = step.toSchemaVersion;
  }

  if (expectedVersion !== plan.targetSchemaVersion) {
    findings.push(finding("MIGRATION-TARGET-NOT-REACHED", `Migration chain ends at ${expectedVersion}, not ${plan.targetSchemaVersion}.`, "Add or correct steps until the target schema version is reached."));
  }
  if (policy.prohibitVersionDowngrade && compareVersions(plan.targetSchemaVersion, plan.inputSchemaVersion) <= 0) {
    findings.push(finding("MIGRATION-PLAN-DOWNGRADE-PROHIBITED", "Migration plan target is not newer than the input schema.", "Use a forward target version."));
  }
  if (
    policy.requireRollbackTestForReversible
    && plan.steps.some((step) => step.reversible)
    && !plan.rollbackTestRef
  ) {
    findings.push(finding("MIGRATION-ROLLBACK-TEST-REQUIRED", "The plan lacks a rollback test reference.", "Run and record a rollback test before execution."));
  }

  return patientEducationMigrationEvaluationSchema.parse({
    schemaVersion: "1.0.0",
    planId: plan.planId,
    evaluatedAt,
    decision: findings.length === 0 ? "approved_to_execute" : "blocked",
    orderedMigrationIds: plan.steps.map((step) => step.migrationId),
    findings,
  });
};

export const verifyPatientEducationMigrationReceipt = ({
  plan: rawPlan,
  receipt: rawReceipt,
}: {
  plan: unknown;
  receipt: unknown;
}) => {
  const plan = patientEducationMigrationPlanSchema.parse(rawPlan);
  const receipt = patientEducationMigrationReceiptSchema.parse(rawReceipt);
  const errors: string[] = [];
  if (receipt.planId !== plan.planId) errors.push("Migration receipt plan ID does not match.");
  if (receipt.objectId !== plan.objectId || receipt.organizationKey !== plan.organizationKey) errors.push("Migration receipt object scope does not match.");
  if (receipt.inputSha256 !== plan.inputSha256) errors.push("Migration receipt input hash does not match.");
  if (receipt.inputSchemaVersion !== plan.inputSchemaVersion || receipt.outputSchemaVersion !== plan.targetSchemaVersion) errors.push("Migration receipt schema versions do not match the plan.");
  if (JSON.stringify(receipt.executedMigrationIds) !== JSON.stringify(plan.steps.map((step) => step.migrationId))) errors.push("Migration receipt step sequence does not match the plan.");
  if (receipt.backupRef !== plan.backupRef) errors.push("Migration receipt backup reference does not match the plan.");
  if (receipt.verificationStatus !== "passed") errors.push("Migration receipt did not pass verification.");
  return { valid: errors.length === 0, errors };
};
