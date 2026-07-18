import { z } from "zod";

const semverSchema = z.string().regex(/^\d+\.\d+\.\d+$/);
const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const roleIdSchema = z.string().regex(/^[a-z0-9_]+$/);

export const patientEducationIncidentTypeSchema = z.enum([
  "clinical_content_safety",
  "evidence_retraction",
  "integrity_failure",
  "signing_key_compromise",
  "unauthorized_access",
  "cross_organization_exposure",
  "incorrect_distribution",
  "localization_defect",
  "accessibility_defect",
  "delivery_failure",
  "recall_execution_failure",
  "backup_or_restore_failure",
  "availability_failure",
  "other",
]);

export const patientEducationIncidentSeveritySchema = z.enum(["sev4", "sev3", "sev2", "sev1"]);

export const patientEducationIncidentImpactSchema = z.object({
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/).optional(),
  packageVersion: semverSchema.optional(),
  organizationKeys: z.array(z.string().regex(/^[A-Z0-9-]+$/)),
  localeIds: z.array(z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/)),
  artifactSha256Values: z.array(sha256Schema),
  distributionIds: z.array(z.string().regex(/^CAF-PE-DIST-[A-Z0-9-]+$/)),
  signingKeyIds: z.array(z.string().regex(/^CAF-PE-KEY-[A-Z0-9-]+$/)),
  sourceIds: z.array(z.string().regex(/^SRC-[A-Z0-9-]+$/)),
  claimIds: z.array(z.string().regex(/^CLAIM-[A-Z0-9-]+$/)),
  possiblePatientSafetyImpact: z.boolean(),
  possiblePrivacyImpact: z.boolean(),
  possibleIntegrityImpact: z.boolean(),
}).superRefine((value, context) => {
  if ((value.packageId && !value.packageVersion) || (!value.packageId && value.packageVersion)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Incident impact must include package ID and version together." });
  }
  for (const field of [value.organizationKeys, value.localeIds, value.artifactSha256Values, value.distributionIds, value.signingKeyIds, value.sourceIds, value.claimIds]) {
    if (new Set(field).size !== field.length) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: "Incident impact reference lists must contain unique values." });
    }
  }
});

export const patientEducationIncidentActionTypeSchema = z.enum([
  "freeze_new_distribution",
  "suspend_package",
  "initiate_recall_assessment",
  "issue_control_notice",
  "revoke_signing_key",
  "disable_destination",
  "isolate_organization",
  "preserve_evidence",
  "notify_organization",
  "notify_clinical_safety_owner",
  "notify_privacy_owner",
  "notify_security_owner",
  "reverify_integrity",
  "reopen_evidence_review",
  "reopen_clinical_review",
  "reopen_localization_review",
  "rebuild_artifacts",
  "rotate_credentials",
  "restore_from_backup",
  "validate_recovery",
  "document_no_exposure",
]);

export const patientEducationIncidentActionSchema = z.object({
  actionId: z.string().regex(/^CAF-PE-INCIDENT-ACTION-[A-Z0-9-]+$/),
  actionType: patientEducationIncidentActionTypeSchema,
  ownerRoleId: roleIdSchema,
  status: z.enum(["not_started", "in_progress", "completed", "blocked", "not_required"]),
  dueAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  evidenceRefs: z.array(z.string().trim().min(3).max(1000)),
  rationale: z.string().trim().min(3).max(3000).optional(),
}).superRefine((value, context) => {
  if (value.status === "completed" && (!value.completedAt || value.evidenceRefs.length === 0)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Completed incident action ${value.actionId} requires completion time and evidence.` });
  }
  if (value.status === "not_required" && !value.rationale) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Not-required incident action ${value.actionId} requires rationale.` });
  }
});

export const patientEducationIncidentSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  incidentId: z.string().regex(/^CAF-PE-INCIDENT-[A-Z0-9-]+$/),
  incidentType: patientEducationIncidentTypeSchema,
  severity: patientEducationIncidentSeveritySchema,
  title: z.string().trim().min(3).max(500),
  summary: z.string().trim().min(10).max(5000),
  detectedAt: z.string().datetime(),
  declaredAt: z.string().datetime(),
  status: z.enum(["investigating", "contained", "recovering", "monitoring", "closed"]),
  environment: z.enum(["test", "preview", "production"]),
  commanderPrincipalId: z.string().regex(/^CAF-PE-PRINCIPAL-[A-Z0-9-]+$/),
  commanderRoleId: roleIdSchema,
  clinicalSafetyLeadRoleId: roleIdSchema.optional(),
  privacyLeadRoleId: roleIdSchema.optional(),
  securityLeadRoleId: roleIdSchema.optional(),
  impact: patientEducationIncidentImpactSchema,
  distributionFrozenAt: z.string().datetime().optional(),
  containmentAt: z.string().datetime().optional(),
  recoveryAt: z.string().datetime().optional(),
  closedAt: z.string().datetime().optional(),
  actions: z.array(patientEducationIncidentActionSchema).min(1),
  timelineRefs: z.array(z.string().trim().min(3).max(1000)),
  rootCauseCategory: z.enum([
    "content_process",
    "evidence_process",
    "software_defect",
    "configuration_defect",
    "identity_or_access",
    "cryptographic_control",
    "third_party_dependency",
    "human_error",
    "unknown",
  ]).optional(),
  rootCauseSummary: z.string().trim().min(10).max(5000).optional(),
  correctiveActionRefs: z.array(z.string().trim().min(3).max(1000)),
  closureApprovals: z.array(z.object({
    approvalId: z.string().regex(/^CAF-PE-INCIDENT-CLOSURE-[A-Z0-9-]+$/),
    principalId: z.string().regex(/^CAF-PE-PRINCIPAL-[A-Z0-9-]+$/),
    roleId: roleIdSchema,
    approvedAt: z.string().datetime(),
    rationale: z.string().trim().min(3).max(3000),
  })),
}).superRefine((value, context) => {
  if (new Date(value.declaredAt) < new Date(value.detectedAt)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Incident declaration cannot precede detection." });
  }
  const actionIds = value.actions.map((action) => action.actionId);
  if (new Set(actionIds).size !== actionIds.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Incident action IDs must be unique." });
  }
  if (["contained", "recovering", "monitoring", "closed"].includes(value.status) && !value.containmentAt) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `${value.status} incidents require containmentAt.` });
  }
  if (["monitoring", "closed"].includes(value.status) && !value.recoveryAt) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `${value.status} incidents require recoveryAt.` });
  }
  if (value.status === "closed" && (!value.closedAt || !value.rootCauseCategory || !value.rootCauseSummary || value.correctiveActionRefs.length === 0 || value.closureApprovals.length === 0)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Closed incidents require closure time, root cause, corrective actions, and closure approvals." });
  }
});

export const patientEducationIncidentPolicySchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  policyId: z.string().regex(/^CAF-PE-INCIDENT-POLICY-[A-Z0-9-]+$/),
  containmentTargetMinutes: z.object({
    sev4: z.number().int().positive().max(10080),
    sev3: z.number().int().positive().max(10080),
    sev2: z.number().int().positive().max(10080),
    sev1: z.number().int().positive().max(10080),
  }),
  distributionFreezeRequiredFor: z.array(patientEducationIncidentTypeSchema),
  clinicalSafetyLeadRequiredFor: z.array(patientEducationIncidentTypeSchema),
  privacyLeadRequiredFor: z.array(patientEducationIncidentTypeSchema),
  securityLeadRequiredFor: z.array(patientEducationIncidentTypeSchema),
  mandatoryActionTypesByIncident: z.record(patientEducationIncidentTypeSchema, z.array(patientEducationIncidentActionTypeSchema)),
  closureRoleIdsBySeverity: z.object({
    sev4: z.array(roleIdSchema).min(1),
    sev3: z.array(roleIdSchema).min(1),
    sev2: z.array(roleIdSchema).min(2),
    sev1: z.array(roleIdSchema).min(2),
  }),
  minimumMonitoringHoursAfterRecovery: z.object({
    sev4: z.number().int().nonnegative().max(8760),
    sev3: z.number().int().nonnegative().max(8760),
    sev2: z.number().int().nonnegative().max(8760),
    sev1: z.number().int().nonnegative().max(8760),
  }),
});

export const patientEducationIncidentFindingSchema = z.object({
  code: z.string().regex(/^INCIDENT-[A-Z0-9-]+$/),
  severity: z.enum(["warning", "blocking", "critical"]),
  message: z.string().trim().min(1),
  remediation: z.string().trim().min(1),
  actionId: z.string().optional(),
});

export const patientEducationIncidentEvaluationSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  incidentId: z.string(),
  evaluatedAt: z.string().datetime(),
  state: z.enum(["compliant", "attention_required", "containment_overdue", "closure_blocked"]),
  findings: z.array(patientEducationIncidentFindingSchema),
  overdueActionIds: z.array(z.string()),
  missingMandatoryActionTypes: z.array(patientEducationIncidentActionTypeSchema),
  requiredDistributionFreeze: z.boolean(),
  incidentEscalationRequired: z.boolean(),
});

const finding = (
  code: string,
  severity: "warning" | "blocking" | "critical",
  message: string,
  remediation: string,
  actionId?: string,
) => ({ code, severity, message, remediation, ...(actionId ? { actionId } : {}) });

export const evaluatePatientEducationIncident = ({
  incident: rawIncident,
  policy: rawPolicy,
  evaluatedAt = new Date().toISOString(),
}: {
  incident: unknown;
  policy: unknown;
  evaluatedAt?: string;
}) => {
  const incident = patientEducationIncidentSchema.parse(rawIncident);
  const policy = patientEducationIncidentPolicySchema.parse(rawPolicy);
  const findings: z.infer<typeof patientEducationIncidentFindingSchema>[] = [];
  const requiredDistributionFreeze = policy.distributionFreezeRequiredFor.includes(incident.incidentType);

  if (requiredDistributionFreeze && !incident.distributionFrozenAt) {
    findings.push(finding(
      "INCIDENT-DISTRIBUTION-FREEZE-MISSING",
      "critical",
      "The incident requires a freeze on new distribution, but no freeze is recorded.",
      "Freeze affected package and destination distribution immediately and preserve the timestamp.",
    ));
  }

  if (policy.clinicalSafetyLeadRequiredFor.includes(incident.incidentType) && !incident.clinicalSafetyLeadRoleId) {
    findings.push(finding("INCIDENT-CLINICAL-SAFETY-LEAD-MISSING", "critical", "A clinical-safety lead is required.", "Assign the governed clinical-safety lead role immediately."));
  }
  if (policy.privacyLeadRequiredFor.includes(incident.incidentType) && !incident.privacyLeadRoleId) {
    findings.push(finding("INCIDENT-PRIVACY-LEAD-MISSING", "critical", "A privacy lead is required.", "Assign the governed privacy lead role immediately."));
  }
  if (policy.securityLeadRequiredFor.includes(incident.incidentType) && !incident.securityLeadRoleId) {
    findings.push(finding("INCIDENT-SECURITY-LEAD-MISSING", "critical", "A security lead is required.", "Assign the governed security lead role immediately."));
  }

  const mandatoryActions = policy.mandatoryActionTypesByIncident[incident.incidentType] ?? [];
  const presentActionTypes = new Set(incident.actions.map((action) => action.actionType));
  const missingMandatoryActionTypes = mandatoryActions.filter((actionType) => !presentActionTypes.has(actionType));
  if (missingMandatoryActionTypes.length > 0) {
    findings.push(finding(
      "INCIDENT-MANDATORY-ACTIONS-MISSING",
      "critical",
      `Mandatory incident action(s) are missing: ${missingMandatoryActionTypes.join(", ")}.`,
      "Create, assign, and time-bound every mandatory incident action.",
    ));
  }

  const overdueActions = incident.actions.filter((action) =>
    !["completed", "not_required"].includes(action.status)
    && new Date(action.dueAt) < new Date(evaluatedAt),
  );
  for (const action of overdueActions) {
    findings.push(finding(
      "INCIDENT-ACTION-OVERDUE",
      incident.severity === "sev1" || incident.severity === "sev2" ? "critical" : "blocking",
      `Incident action ${action.actionId} is overdue.`,
      "Escalate the owner, update the incident timeline, and complete or formally block the action.",
      action.actionId,
    ));
  }

  const containmentDeadline = new Date(incident.declaredAt).getTime() + policy.containmentTargetMinutes[incident.severity] * 60_000;
  const containmentOverdue = !incident.containmentAt && new Date(evaluatedAt).getTime() > containmentDeadline;
  if (containmentOverdue) {
    findings.push(finding(
      "INCIDENT-CONTAINMENT-OVERDUE",
      "critical",
      `Incident containment exceeded the ${policy.containmentTargetMinutes[incident.severity]}-minute target.`,
      "Escalate incident command and apply immediate distribution, access, or key controls.",
    ));
  }

  let closureBlocked = false;
  if (incident.status === "closed") {
    const incomplete = incident.actions.filter((action) => !["completed", "not_required"].includes(action.status));
    if (incomplete.length > 0) {
      closureBlocked = true;
      findings.push(finding("INCIDENT-CLOSURE-ACTIONS-INCOMPLETE", "blocking", "The incident was closed with incomplete actions.", "Reopen the incident or complete every required action."));
    }
    const requiredClosureRoles = policy.closureRoleIdsBySeverity[incident.severity];
    const approvedRoles = new Set(incident.closureApprovals.map((approval) => approval.roleId));
    const missingClosureRoles = requiredClosureRoles.filter((roleId) => !approvedRoles.has(roleId));
    if (missingClosureRoles.length > 0) {
      closureBlocked = true;
      findings.push(finding("INCIDENT-CLOSURE-APPROVALS-MISSING", "blocking", `Closure approval role(s) missing: ${missingClosureRoles.join(", ")}.`, "Obtain independent closure approvals from every required role."));
    }
    if (new Set(incident.closureApprovals.map((approval) => approval.principalId)).size !== incident.closureApprovals.length) {
      closureBlocked = true;
      findings.push(finding("INCIDENT-CLOSURE-DISTINCT-PRINCIPALS-REQUIRED", "blocking", "One principal supplied multiple incident-closure approvals.", "Obtain closure approvals from distinct authenticated principals."));
    }
    if (incident.recoveryAt && incident.closedAt) {
      const monitoringHours = (new Date(incident.closedAt).getTime() - new Date(incident.recoveryAt).getTime()) / 3_600_000;
      if (monitoringHours < policy.minimumMonitoringHoursAfterRecovery[incident.severity]) {
        closureBlocked = true;
        findings.push(finding("INCIDENT-MONITORING-PERIOD-INCOMPLETE", "blocking", "The incident closed before completing the required monitoring period.", "Continue monitoring until the severity-specific minimum period is satisfied."));
      }
    }
  }

  const state = closureBlocked
    ? "closure_blocked"
    : containmentOverdue
      ? "containment_overdue"
      : findings.length > 0
        ? "attention_required"
        : "compliant";

  return patientEducationIncidentEvaluationSchema.parse({
    schemaVersion: "1.0.0",
    incidentId: incident.incidentId,
    evaluatedAt,
    state,
    findings,
    overdueActionIds: overdueActions.map((action) => action.actionId).sort(),
    missingMandatoryActionTypes,
    requiredDistributionFreeze,
    incidentEscalationRequired: findings.some((item) => item.severity === "critical"),
  });
};
