import { z } from "zod";

const organizationKeySchema = z.string().regex(/^(?:CAF-GLOBAL|[A-Z0-9-]+)$/);
const roleIdSchema = z.string().regex(/^[a-z0-9_]+$/);

export const patientEducationEnvironmentSchema = z.enum(["development", "test", "preview", "production"]);

export const patientEducationOrganizationResourceSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  resourceId: z.string().regex(/^CAF-PE-RESOURCE-[A-Z0-9-]+$/),
  resourceType: z.enum([
    "global_package",
    "evidence_dossier",
    "quality_report",
    "localization",
    "institution_overlay",
    "release_record",
    "delivery_destination",
    "delivery_envelope",
    "distribution_record",
    "control_notice",
    "acknowledgment",
    "pilot_analytics",
    "audit_export",
  ]),
  organizationKey: organizationKeySchema,
  environment: patientEducationEnvironmentSchema,
  dataClassification: z.enum([
    "public",
    "caf_internal",
    "caf_confidential",
    "organization_confidential",
    "restricted_clinical_source",
  ]),
  immutable: z.boolean(),
  sourceResourceId: z.string().regex(/^CAF-PE-RESOURCE-[A-Z0-9-]+$/).optional(),
}).superRefine((value, context) => {
  const organizationOnlyTypes = new Set([
    "institution_overlay",
    "delivery_destination",
    "delivery_envelope",
    "distribution_record",
    "control_notice",
    "acknowledgment",
    "pilot_analytics",
  ]);
  if (organizationOnlyTypes.has(value.resourceType) && value.organizationKey === "CAF-GLOBAL") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `${value.resourceType} must be scoped to a specific organization.` });
  }
  if (value.dataClassification === "organization_confidential" && value.organizationKey === "CAF-GLOBAL") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Organization-confidential resources require a specific organization." });
  }
});

export const patientEducationOrganizationAccessContextSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  requestId: z.string().regex(/^CAF-PE-ACCESS-[A-Z0-9-]+$/),
  principalId: z.string().regex(/^CAF-PE-PRINCIPAL-[A-Z0-9-]+$/),
  principalOrganizationKey: organizationKeySchema,
  environment: patientEducationEnvironmentSchema,
  roleIds: z.array(roleIdSchema).min(1),
  action: z.enum(["read", "create", "update", "delete", "approve", "distribute", "revoke", "export"]),
  purpose: z.enum(["authoring", "review", "release", "delivery", "support", "audit", "incident_response"]),
  requestedAt: z.string().datetime(),
});

export const patientEducationOrganizationIsolationPolicySchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  policyId: z.string().regex(/^CAF-PE-ISOLATION-POLICY-[A-Z0-9-]+$/),
  globalReadRoleIds: z.array(roleIdSchema),
  globalWriteRoleIds: z.array(roleIdSchema),
  restrictedClinicalSourceRoleIds: z.array(roleIdSchema),
  auditExportRoleIds: z.array(roleIdSchema),
  immutableMutationRoleIds: z.array(roleIdSchema),
  prohibitProductionAccessFromNonProduction: z.literal(true),
  prohibitCrossOrganizationAccess: z.literal(true),
});

export const patientEducationOrganizationIsolationFindingSchema = z.object({
  code: z.string().regex(/^ISOLATION-[A-Z0-9-]+$/),
  severity: z.literal("blocking"),
  message: z.string().trim().min(1),
  remediation: z.string().trim().min(1),
});

export const patientEducationOrganizationAccessDecisionSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  requestId: z.string(),
  resourceId: z.string(),
  decision: z.enum(["allowed", "blocked"]),
  evaluatedAt: z.string().datetime(),
  findings: z.array(patientEducationOrganizationIsolationFindingSchema),
});

export type PatientEducationOrganizationResource = z.infer<typeof patientEducationOrganizationResourceSchema>;
export type PatientEducationOrganizationAccessContext = z.infer<typeof patientEducationOrganizationAccessContextSchema>;
export type PatientEducationOrganizationIsolationPolicy = z.infer<typeof patientEducationOrganizationIsolationPolicySchema>;

const finding = (code: string, message: string, remediation: string) => ({
  code,
  severity: "blocking" as const,
  message,
  remediation,
});

const hasAnyRole = (actual: string[], allowed: string[]) => actual.some((role) => allowed.includes(role));

export const evaluatePatientEducationOrganizationAccess = ({
  resource: rawResource,
  context: rawContext,
  policy: rawPolicy,
}: {
  resource: unknown;
  context: unknown;
  policy: unknown;
}) => {
  const resource = patientEducationOrganizationResourceSchema.parse(rawResource);
  const context = patientEducationOrganizationAccessContextSchema.parse(rawContext);
  const policy = patientEducationOrganizationIsolationPolicySchema.parse(rawPolicy);
  const findings: z.infer<typeof patientEducationOrganizationIsolationFindingSchema>[] = [];
  const writeAction = ["create", "update", "delete", "approve", "distribute", "revoke"].includes(context.action);

  if (resource.environment !== context.environment) {
    findings.push(finding(
      "ISOLATION-ENVIRONMENT-MISMATCH",
      `Resource environment ${resource.environment} does not match request environment ${context.environment}.`,
      "Use an identity and runtime bound to the resource environment; never reuse production resources in preview or test.",
    ));
  }

  if (
    policy.prohibitProductionAccessFromNonProduction
    && resource.environment === "production"
    && context.environment !== "production"
  ) {
    findings.push(finding(
      "ISOLATION-PRODUCTION-CROSSING",
      "A non-production runtime attempted to access a production resource.",
      "Use isolated production credentials and the production runtime.",
    ));
  }

  if (resource.organizationKey === "CAF-GLOBAL") {
    const allowedRoles = writeAction ? policy.globalWriteRoleIds : policy.globalReadRoleIds;
    if (context.principalOrganizationKey !== "CAF-GLOBAL" || !hasAnyRole(context.roleIds, allowedRoles)) {
      findings.push(finding(
        "ISOLATION-GLOBAL-AUTHORITY-REQUIRED",
        "The request lacks CAF-global authority for this global resource.",
        "Use an authenticated CAF-global principal with the required global role.",
      ));
    }
  } else if (
    policy.prohibitCrossOrganizationAccess
    && context.principalOrganizationKey !== resource.organizationKey
  ) {
    findings.push(finding(
      "ISOLATION-CROSS-ORGANIZATION-ACCESS",
      `Principal organization ${context.principalOrganizationKey} cannot access resource organization ${resource.organizationKey}.`,
      "Use a principal scoped to the exact organization. Global identities do not inherit organization-confidential access by default.",
    ));
  }

  if (
    resource.dataClassification === "restricted_clinical_source"
    && !hasAnyRole(context.roleIds, policy.restrictedClinicalSourceRoleIds)
  ) {
    findings.push(finding(
      "ISOLATION-RESTRICTED-SOURCE-ROLE-REQUIRED",
      "The request lacks a role permitted to access restricted clinical source material.",
      "Obtain the governed restricted-source role and record the access purpose.",
    ));
  }

  if (context.action === "export" && !hasAnyRole(context.roleIds, policy.auditExportRoleIds)) {
    findings.push(finding(
      "ISOLATION-AUDIT-EXPORT-ROLE-REQUIRED",
      "The request lacks authority to export governed records.",
      "Use an approved audit-export role and a redaction policy appropriate to the recipient.",
    ));
  }

  if (resource.immutable && writeAction && !hasAnyRole(context.roleIds, policy.immutableMutationRoleIds)) {
    findings.push(finding(
      "ISOLATION-IMMUTABLE-RESOURCE",
      "The requested action would mutate an immutable governed resource.",
      "Create a new version or use a narrowly authorized revocation/correction workflow instead of modifying history.",
    ));
  }

  if (context.action === "delete" && ["release_record", "distribution_record", "control_notice", "acknowledgment"].includes(resource.resourceType)) {
    findings.push(finding(
      "ISOLATION-GOVERNANCE-DELETION-PROHIBITED",
      `Governance resource ${resource.resourceType} cannot be deleted.`,
      "Retain the original record and append a correction, revocation, supersession, or retention event.",
    ));
  }

  return patientEducationOrganizationAccessDecisionSchema.parse({
    schemaVersion: "1.0.0",
    requestId: context.requestId,
    resourceId: resource.resourceId,
    decision: findings.length === 0 ? "allowed" : "blocked",
    evaluatedAt: context.requestedAt,
    findings,
  });
};

export const assertPatientEducationOrganizationAccess = (input: Parameters<typeof evaluatePatientEducationOrganizationAccess>[0]) => {
  const result = evaluatePatientEducationOrganizationAccess(input);
  if (result.decision !== "allowed") {
    throw new Error(`Patient education organization isolation failed: ${result.findings.map((item) => item.code).join(", ")}`);
  }
  return result;
};
