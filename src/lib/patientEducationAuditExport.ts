import { createHash } from "node:crypto";
import { z } from "zod";

const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const organizationKeySchema = z.string().regex(/^(?:CAF-GLOBAL|[A-Z0-9-]+)$/);

export const patientEducationAuditAudienceSchema = z.enum([
  "internal_governance",
  "clinical_governance",
  "security_review",
  "procurement",
  "organization_customer",
  "external_auditor",
]);

export const patientEducationAuditRecordTypeSchema = z.enum([
  "package_descriptor",
  "evidence_summary",
  "review_summary",
  "quality_summary",
  "localization_summary",
  "institution_overlay_summary",
  "release_summary",
  "integrity_summary",
  "signature_summary",
  "distribution_summary",
  "recall_summary",
  "incident_summary",
  "resilience_summary",
  "operational_slo_summary",
  "pilot_analytics_summary",
  "exception_summary",
  "migration_summary",
]);

export const patientEducationAuditClassificationSchema = z.enum([
  "public",
  "caf_internal",
  "caf_confidential",
  "organization_confidential",
  "restricted_clinical_source",
]);

export const patientEducationAuditRecordSchema = z.object({
  recordId: z.string().regex(/^CAF-PE-AUDIT-RECORD-[A-Z0-9-]+$/),
  recordType: patientEducationAuditRecordTypeSchema,
  organizationKey: organizationKeySchema,
  classification: patientEducationAuditClassificationSchema,
  sourceObjectRef: z.string().trim().min(3).max(1000),
  sourceObjectSha256: sha256Schema,
  generatedAt: z.string().datetime(),
  fields: z.record(z.string().regex(/^[a-z][a-z0-9_]*$/), z.unknown()),
  containsPatientLevelData: z.literal(false),
  containsCredentialMaterial: z.literal(false),
  containsUnlicensedSourceText: z.literal(false),
});

export const patientEducationAuditRedactionRuleSchema = z.object({
  ruleId: z.string().regex(/^CAF-PE-REDACTION-[A-Z0-9-]+$/),
  fieldPattern: z.string().trim().min(1).max(500),
  action: z.enum(["remove", "replace_with_role", "replace_with_count", "replace_with_digest", "allow"]),
  replacementValue: z.string().max(500).optional(),
  applicableRecordTypes: z.array(patientEducationAuditRecordTypeSchema),
  applicableAudiences: z.array(patientEducationAuditAudienceSchema),
  reason: z.string().trim().min(3).max(1000),
}).superRefine((value, context) => {
  if (value.action === "replace_with_role" && !value.replacementValue) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Redaction rule ${value.ruleId} requires a role replacement value.` });
  }
  if (value.action !== "replace_with_role" && value.replacementValue) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Redaction rule ${value.ruleId} cannot use replacementValue with ${value.action}.` });
  }
});

export const patientEducationAuditExportPolicySchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  policyId: z.string().regex(/^CAF-PE-AUDIT-POLICY-[A-Z0-9-]+$/),
  allowedRecordTypesByAudience: z.record(patientEducationAuditAudienceSchema, z.array(patientEducationAuditRecordTypeSchema)),
  allowedClassificationsByAudience: z.record(patientEducationAuditAudienceSchema, z.array(patientEducationAuditClassificationSchema)),
  requireOrganizationMatchForCustomer: z.literal(true),
  prohibitReviewerIdentityForExternalAudiences: z.literal(true),
  prohibitCredentialFields: z.literal(true),
  prohibitPatientFields: z.literal(true),
  prohibitUnlicensedSourceText: z.literal(true),
  requiredRedactionRules: z.array(patientEducationAuditRedactionRuleSchema),
});

export const patientEducationAuditExportRequestSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  exportId: z.string().regex(/^CAF-PE-AUDIT-EXPORT-[A-Z0-9-]+$/),
  audience: patientEducationAuditAudienceSchema,
  requestingOrganizationKey: organizationKeySchema,
  requestedRecordTypes: z.array(patientEducationAuditRecordTypeSchema).min(1),
  requestedAt: z.string().datetime(),
  requesterPrincipalId: z.string().regex(/^CAF-PE-PRINCIPAL-[A-Z0-9-]+$/),
  requesterRoleId: z.string().regex(/^[a-z0-9_]+$/),
  purpose: z.string().trim().min(10).max(3000),
  records: z.array(patientEducationAuditRecordSchema).min(1),
});

export const patientEducationAuditExportSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  exportId: z.string(),
  audience: patientEducationAuditAudienceSchema,
  organizationKey: organizationKeySchema,
  generatedAt: z.string().datetime(),
  policyId: z.string(),
  records: z.array(patientEducationAuditRecordSchema),
  sourceRecordCount: z.number().int().nonnegative(),
  includedRecordCount: z.number().int().nonnegative(),
  excludedRecordIds: z.array(z.string()),
  appliedRedactionRuleIds: z.array(z.string()),
  exportSha256: sha256Schema,
  claimsBoundary: z.array(z.string().trim().min(3).max(1000)).min(1),
});

const canonicalize = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, nested]) => [key, canonicalize(nested)]));
  }
  return value;
};
const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(canonicalize(value)), "utf8").digest("hex");

const forbiddenFieldPattern = /(patient|mrn|dob|birth|encounter|member|subscriber|claim_number|diagnosis|medication_order|prescription|address|phone|email|credential|secret|token|password|private_key|reviewer_name|reviewer_email|reviewer_identity|source_text|verbatim_source)/i;
const externalAudiences = new Set<z.infer<typeof patientEducationAuditAudienceSchema>>(["procurement", "organization_customer", "external_auditor"]);

const applyRedactions = (
  record: z.infer<typeof patientEducationAuditRecordSchema>,
  audience: z.infer<typeof patientEducationAuditAudienceSchema>,
  policy: z.infer<typeof patientEducationAuditExportPolicySchema>,
) => {
  const fields: Record<string, unknown> = {};
  const appliedRuleIds = new Set<string>();
  for (const [key, value] of Object.entries(record.fields)) {
    const rules = policy.requiredRedactionRules.filter((rule) =>
      (rule.applicableRecordTypes.length === 0 || rule.applicableRecordTypes.includes(record.recordType))
      && (rule.applicableAudiences.length === 0 || rule.applicableAudiences.includes(audience))
      && new RegExp(rule.fieldPattern, "i").test(key),
    );
    const rule = rules[0];
    if (rule) {
      appliedRuleIds.add(rule.ruleId);
      if (rule.action === "remove") continue;
      if (rule.action === "replace_with_role") fields[key] = rule.replacementValue;
      else if (rule.action === "replace_with_count") fields[key] = Array.isArray(value) ? value.length : value && typeof value === "object" ? Object.keys(value as object).length : 1;
      else if (rule.action === "replace_with_digest") fields[key] = digest(value);
      else fields[key] = value;
      continue;
    }
    if (forbiddenFieldPattern.test(key)) continue;
    fields[key] = value;
  }
  return {
    record: { ...record, fields },
    appliedRuleIds: [...appliedRuleIds],
  };
};

export const buildPatientEducationAuditExport = ({
  request: rawRequest,
  policy: rawPolicy,
  generatedAt = new Date().toISOString(),
}: {
  request: unknown;
  policy: unknown;
  generatedAt?: string;
}) => {
  const request = patientEducationAuditExportRequestSchema.parse(rawRequest);
  const policy = patientEducationAuditExportPolicySchema.parse(rawPolicy);
  const allowedTypes = new Set(policy.allowedRecordTypesByAudience[request.audience]);
  const allowedClassifications = new Set(policy.allowedClassificationsByAudience[request.audience]);
  const excludedRecordIds: string[] = [];
  const appliedRuleIds = new Set<string>();
  const included: z.infer<typeof patientEducationAuditRecordSchema>[] = [];

  for (const record of request.records) {
    const customerOrgMismatch = request.audience === "organization_customer"
      && policy.requireOrganizationMatchForCustomer
      && record.organizationKey !== request.requestingOrganizationKey;
    const globalRecordForCustomer = request.audience === "organization_customer"
      && record.organizationKey === "CAF-GLOBAL"
      && !["public", "caf_internal"].includes(record.classification);
    if (
      !request.requestedRecordTypes.includes(record.recordType)
      || !allowedTypes.has(record.recordType)
      || !allowedClassifications.has(record.classification)
      || customerOrgMismatch
      || globalRecordForCustomer
      || record.containsPatientLevelData
      || record.containsCredentialMaterial
      || record.containsUnlicensedSourceText
    ) {
      excludedRecordIds.push(record.recordId);
      continue;
    }
    const redacted = applyRedactions(record, request.audience, policy);
    redacted.appliedRuleIds.forEach((ruleId) => appliedRuleIds.add(ruleId));
    if (externalAudiences.has(request.audience) && policy.prohibitReviewerIdentityForExternalAudiences) {
      for (const key of Object.keys(redacted.record.fields)) {
        if (/reviewer_(name|email|identity)/i.test(key)) delete redacted.record.fields[key];
      }
    }
    included.push(redacted.record);
  }

  const unsigned = {
    schemaVersion: "1.0.0" as const,
    exportId: request.exportId,
    audience: request.audience,
    organizationKey: request.requestingOrganizationKey,
    generatedAt,
    policyId: policy.policyId,
    records: included.sort((left, right) => left.recordId.localeCompare(right.recordId)),
    sourceRecordCount: request.records.length,
    includedRecordCount: included.length,
    excludedRecordIds: excludedRecordIds.sort(),
    appliedRedactionRuleIds: [...appliedRuleIds].sort(),
    claimsBoundary: [
      "This export provides governance evidence only and does not establish clinical approval, legal compliance, accessibility conformance, deployment, or patient outcomes.",
      "Protected source text, credentials, patient-level information, and unauthorized organization records are excluded.",
    ],
  };
  return patientEducationAuditExportSchema.parse({ ...unsigned, exportSha256: digest(unsigned) });
};

export const verifyPatientEducationAuditExport = (input: unknown) => {
  const parsed = patientEducationAuditExportSchema.safeParse(input);
  if (!parsed.success) return { valid: false, errors: parsed.error.issues.map((issue) => issue.message) };
  const { exportSha256, ...unsigned } = parsed.data;
  const errors: string[] = [];
  if (digest(unsigned) !== exportSha256) errors.push("Audit export SHA-256 does not match its canonical contents.");
  for (const record of parsed.data.records) {
    for (const key of Object.keys(record.fields)) {
      if (forbiddenFieldPattern.test(key)) errors.push(`Audit export contains forbidden field: ${key}.`);
    }
  }
  return { valid: errors.length === 0, errors };
};
