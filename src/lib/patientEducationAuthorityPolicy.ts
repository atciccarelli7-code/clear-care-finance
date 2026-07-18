import { z } from "zod";

const identifier = z.string().regex(/^[A-Z0-9-]+$/);
const roleIdentifier = z.string().regex(/^[a-z0-9_]+$/);
const hashSchema = z.string().regex(/^[a-f0-9]{64}$/);
const semverSchema = z.string().regex(/^\d+\.\d+\.\d+$/);

export const patientEducationAuthorityScopeSchema = z.enum([
  "source_edit",
  "evidence_review",
  "clinical_review",
  "pharmacy_review",
  "health_literacy_review",
  "accessibility_review",
  "privacy_review",
  "localization_review",
  "institution_overlay_approval",
  "release_authorization",
  "distribution_authorization",
  "correction_authorization",
  "recall_authorization",
  "exception_approval",
  "audit_export",
]);

export const patientEducationAuthorityRoleSchema = z.object({
  roleId: roleIdentifier,
  label: z.string().trim().min(2).max(160),
  authorityScopes: z.array(patientEducationAuthorityScopeSchema).min(1),
  organizationScope: z.enum(["caf_global", "organization"]),
  canApproveOwnWork: z.boolean(),
  active: z.boolean(),
});

export const patientEducationAuthorityPrincipalSchema = z.object({
  principalId: z.string().regex(/^CAF-PE-PRINCIPAL-[A-Z0-9-]+$/),
  principalType: z.enum(["human", "service_account"]),
  organizationKey: identifier,
  identityRef: z.string().trim().min(3).max(500),
  roleIds: z.array(roleIdentifier).min(1),
  status: z.enum(["active", "suspended", "revoked"]),
  authenticatedAt: z.string().datetime(),
  credentialExpiresAt: z.string().datetime(),
  mfaVerified: z.boolean(),
  workloadIdentityRef: z.string().trim().min(3).max(500).optional(),
}).superRefine((value, context) => {
  if (value.principalType === "service_account" && !value.workloadIdentityRef) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Service accounts require a workload identity reference." });
  }
  if (value.principalType === "human" && value.workloadIdentityRef) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Human principals cannot use a workload identity reference." });
  }
});

export const patientEducationAuthorityApprovalSchema = z.object({
  approvalId: z.string().regex(/^CAF-PE-APPROVAL-[A-Z0-9-]+$/),
  principalId: z.string().regex(/^CAF-PE-PRINCIPAL-[A-Z0-9-]+$/),
  roleId: roleIdentifier,
  scope: patientEducationAuthorityScopeSchema,
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  packageVersion: semverSchema,
  contentHash: hashSchema,
  organizationKey: identifier,
  decision: z.enum(["approved", "rejected"]),
  rationale: z.string().trim().min(3).max(4000),
  approvedAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  evidenceRefs: z.array(z.string().trim().min(2).max(500)),
});

export const patientEducationAuthorityPolicySchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  policyId: z.string().regex(/^CAF-PE-AUTHORITY-POLICY-[A-Z0-9-]+$/),
  packageRiskTier: z.enum(["low", "moderate", "high", "critical"]),
  requireMfaForHumanApprovals: z.boolean(),
  maximumApprovalAgeHours: z.number().int().positive().max(8760),
  requiredApprovals: z.array(z.object({
    scope: patientEducationAuthorityScopeSchema,
    minimumApprovals: z.number().int().positive().max(10),
    allowedRoleIds: z.array(roleIdentifier).min(1),
    requireDistinctPrincipals: z.boolean(),
  })).min(1),
  separationOfDutyRules: z.array(z.object({
    leftScope: patientEducationAuthorityScopeSchema,
    rightScope: patientEducationAuthorityScopeSchema,
    reason: z.string().trim().min(3).max(1000),
  })),
  nonHumanApprovalScopes: z.array(patientEducationAuthorityScopeSchema),
}).superRefine((value, context) => {
  const scopes = value.requiredApprovals.map((entry) => entry.scope);
  if (new Set(scopes).size !== scopes.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Required approval scopes must be unique." });
  }
  for (const rule of value.separationOfDutyRules) {
    if (rule.leftScope === rule.rightScope) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: "A separation-of-duty rule must compare two different scopes." });
    }
  }
});

export const patientEducationAuthorityEvaluationRequestSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  evaluationId: z.string().regex(/^CAF-PE-AUTHORITY-EVAL-[A-Z0-9-]+$/),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  packageVersion: semverSchema,
  contentHash: hashSchema,
  organizationKey: identifier,
  evaluatedAt: z.string().datetime(),
  authorPrincipalId: z.string().regex(/^CAF-PE-PRINCIPAL-[A-Z0-9-]+$/).optional(),
  requestedScopes: z.array(patientEducationAuthorityScopeSchema).min(1),
  policy: patientEducationAuthorityPolicySchema,
  roles: z.array(patientEducationAuthorityRoleSchema).min(1),
  principals: z.array(patientEducationAuthorityPrincipalSchema).min(1),
  approvals: z.array(patientEducationAuthorityApprovalSchema),
});

export const patientEducationAuthorityFindingSchema = z.object({
  code: z.string().regex(/^AUTHORITY-[A-Z0-9-]+$/),
  severity: z.literal("blocking"),
  message: z.string().trim().min(1),
  remediation: z.string().trim().min(1),
  scope: patientEducationAuthorityScopeSchema.optional(),
  principalId: z.string().optional(),
});

export const patientEducationAuthorityEvaluationResultSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  evaluationId: z.string(),
  packageId: z.string(),
  packageVersion: semverSchema,
  organizationKey: identifier,
  evaluatedAt: z.string().datetime(),
  decision: z.enum(["authorized", "blocked"]),
  verifiedApprovalIds: z.array(z.string()),
  verifiedPrincipalIds: z.array(z.string()),
  findings: z.array(patientEducationAuthorityFindingSchema),
});

export type PatientEducationAuthorityEvaluationRequest = z.infer<typeof patientEducationAuthorityEvaluationRequestSchema>;
export type PatientEducationAuthorityEvaluationResult = z.infer<typeof patientEducationAuthorityEvaluationResultSchema>;

const blockingFinding = (
  code: string,
  message: string,
  remediation: string,
  scope?: z.infer<typeof patientEducationAuthorityScopeSchema>,
  principalId?: string,
): z.infer<typeof patientEducationAuthorityFindingSchema> => ({
  code,
  severity: "blocking",
  message,
  remediation,
  ...(scope ? { scope } : {}),
  ...(principalId ? { principalId } : {}),
});

const isAtOrBefore = (left: string, right: string) => new Date(left).getTime() <= new Date(right).getTime();

export const evaluatePatientEducationAuthority = (
  input: unknown,
): PatientEducationAuthorityEvaluationResult => {
  const request = patientEducationAuthorityEvaluationRequestSchema.parse(input);
  const findings: PatientEducationAuthorityEvaluationResult["findings"] = [];
  const roles = new Map(request.roles.map((role) => [role.roleId, role]));
  const principals = new Map(request.principals.map((principal) => [principal.principalId, principal]));
  const verifiedApprovalIds = new Set<string>();
  const verifiedPrincipalIds = new Set<string>();

  if (new Set(request.roles.map((role) => role.roleId)).size !== request.roles.length) {
    findings.push(blockingFinding("AUTHORITY-DUPLICATE-ROLE", "Authority role IDs are not unique.", "Use one canonical definition for each authority role."));
  }
  if (new Set(request.principals.map((principal) => principal.principalId)).size !== request.principals.length) {
    findings.push(blockingFinding("AUTHORITY-DUPLICATE-PRINCIPAL", "Authority principal IDs are not unique.", "Resolve duplicate identity records before evaluating approvals."));
  }
  if (new Set(request.approvals.map((approval) => approval.approvalId)).size !== request.approvals.length) {
    findings.push(blockingFinding("AUTHORITY-DUPLICATE-APPROVAL", "Authority approval IDs are not unique.", "Issue immutable unique approval records."));
  }

  const validApprovals = request.approvals.filter((approval) => {
    const principal = principals.get(approval.principalId);
    const role = roles.get(approval.roleId);
    let valid = true;

    if (!principal) {
      findings.push(blockingFinding("AUTHORITY-PRINCIPAL-MISSING", `Approval ${approval.approvalId} references an unknown principal.`, "Resolve the authenticated principal before accepting the approval.", approval.scope, approval.principalId));
      return false;
    }
    if (!role || !role.active) {
      findings.push(blockingFinding("AUTHORITY-ROLE-INACTIVE", `Approval ${approval.approvalId} uses an unknown or inactive role.`, "Use an active governed role with the required scope.", approval.scope, approval.principalId));
      valid = false;
    }
    if (principal.status !== "active") {
      findings.push(blockingFinding("AUTHORITY-PRINCIPAL-INACTIVE", `Principal ${principal.principalId} is ${principal.status}.`, "Restore the principal through the identity authority or obtain a new approval.", approval.scope, principal.principalId));
      valid = false;
    }
    if (!isAtOrBefore(request.evaluatedAt, principal.credentialExpiresAt)) {
      findings.push(blockingFinding("AUTHORITY-CREDENTIAL-EXPIRED", `Principal ${principal.principalId} has expired credentials.`, "Re-authenticate and reissue the approval with current credentials.", approval.scope, principal.principalId));
      valid = false;
    }
    if (!principal.roleIds.includes(approval.roleId)) {
      findings.push(blockingFinding("AUTHORITY-ROLE-NOT-ASSIGNED", `Principal ${principal.principalId} is not assigned role ${approval.roleId}.`, "Correct role assignment or obtain approval from an authorized principal.", approval.scope, principal.principalId));
      valid = false;
    }
    if (role && !role.authorityScopes.includes(approval.scope)) {
      findings.push(blockingFinding("AUTHORITY-SCOPE-NOT-GRANTED", `Role ${approval.roleId} cannot approve ${approval.scope}.`, "Use a role explicitly granted this authority scope.", approval.scope, principal.principalId));
      valid = false;
    }
    if (principal.principalType === "service_account" && !request.policy.nonHumanApprovalScopes.includes(approval.scope)) {
      findings.push(blockingFinding("AUTHORITY-HUMAN-REVIEW-REQUIRED", `Service account ${principal.principalId} cannot approve ${approval.scope}.`, "Obtain approval from an authenticated human principal.", approval.scope, principal.principalId));
      valid = false;
    }
    if (request.policy.requireMfaForHumanApprovals && principal.principalType === "human" && !principal.mfaVerified) {
      findings.push(blockingFinding("AUTHORITY-MFA-REQUIRED", `Human principal ${principal.principalId} did not satisfy MFA.`, "Re-authenticate with MFA and reissue the approval.", approval.scope, principal.principalId));
      valid = false;
    }
    const organizationAllowed = role?.organizationScope === "caf_global"
      ? principal.organizationKey === "CAF-GLOBAL"
      : principal.organizationKey === request.organizationKey;
    if (!organizationAllowed || approval.organizationKey !== request.organizationKey) {
      findings.push(blockingFinding("AUTHORITY-ORGANIZATION-SCOPE-MISMATCH", `Approval ${approval.approvalId} is outside organization ${request.organizationKey}.`, "Use a principal and approval scoped to the exact organization, or a CAF global role where permitted.", approval.scope, principal.principalId));
      valid = false;
    }
    if (
      approval.packageId !== request.packageId
      || approval.packageVersion !== request.packageVersion
      || approval.contentHash !== request.contentHash
    ) {
      findings.push(blockingFinding("AUTHORITY-VERSION-BINDING-MISMATCH", `Approval ${approval.approvalId} is not bound to the exact package version and content hash.`, "Repeat review against the exact release candidate.", approval.scope, principal.principalId));
      valid = false;
    }
    if (approval.decision !== "approved") {
      findings.push(blockingFinding("AUTHORITY-APPROVAL-REJECTED", `Approval ${approval.approvalId} records a rejection.`, "Resolve the rejection and obtain a new approved record.", approval.scope, principal.principalId));
      valid = false;
    }
    if (!isAtOrBefore(request.evaluatedAt, approval.expiresAt)) {
      findings.push(blockingFinding("AUTHORITY-APPROVAL-EXPIRED", `Approval ${approval.approvalId} has expired.`, "Repeat the required review for the exact candidate.", approval.scope, principal.principalId));
      valid = false;
    }
    const approvalAgeHours = (new Date(request.evaluatedAt).getTime() - new Date(approval.approvedAt).getTime()) / 3_600_000;
    if (approvalAgeHours < 0 || approvalAgeHours > request.policy.maximumApprovalAgeHours) {
      findings.push(blockingFinding("AUTHORITY-APPROVAL-STALE", `Approval ${approval.approvalId} is outside the permitted approval-age window.`, "Obtain a current approval within policy limits.", approval.scope, principal.principalId));
      valid = false;
    }
    if (request.authorPrincipalId === principal.principalId && role && !role.canApproveOwnWork) {
      findings.push(blockingFinding("AUTHORITY-SELF-APPROVAL-PROHIBITED", `Principal ${principal.principalId} cannot approve their own source work.`, "Obtain independent review from a distinct authorized principal.", approval.scope, principal.principalId));
      valid = false;
    }
    return valid;
  });

  for (const requirement of request.policy.requiredApprovals) {
    if (!request.requestedScopes.includes(requirement.scope)) continue;
    const matching = validApprovals.filter((approval) =>
      approval.scope === requirement.scope && requirement.allowedRoleIds.includes(approval.roleId),
    );
    const distinctPrincipals = new Set(matching.map((approval) => approval.principalId));
    const count = requirement.requireDistinctPrincipals ? distinctPrincipals.size : matching.length;
    if (count < requirement.minimumApprovals) {
      findings.push(blockingFinding(
        "AUTHORITY-QUORUM-NOT-MET",
        `${requirement.scope} requires ${requirement.minimumApprovals} valid approval(s); ${count} were verified.`,
        "Obtain the remaining independent approvals from permitted roles.",
        requirement.scope,
      ));
    } else {
      matching.forEach((approval) => {
        verifiedApprovalIds.add(approval.approvalId);
        verifiedPrincipalIds.add(approval.principalId);
      });
    }
  }

  for (const rule of request.policy.separationOfDutyRules) {
    const leftPrincipals = new Set(validApprovals.filter((approval) => approval.scope === rule.leftScope).map((approval) => approval.principalId));
    const overlap = validApprovals
      .filter((approval) => approval.scope === rule.rightScope && leftPrincipals.has(approval.principalId))
      .map((approval) => approval.principalId);
    for (const principalId of [...new Set(overlap)]) {
      findings.push(blockingFinding(
        "AUTHORITY-SEPARATION-OF-DUTIES-VIOLATION",
        `Principal ${principalId} approved both ${rule.leftScope} and ${rule.rightScope}.`,
        `Obtain an independent approval. Policy reason: ${rule.reason}`,
        rule.rightScope,
        principalId,
      ));
    }
  }

  return patientEducationAuthorityEvaluationResultSchema.parse({
    schemaVersion: "1.0.0",
    evaluationId: request.evaluationId,
    packageId: request.packageId,
    packageVersion: request.packageVersion,
    organizationKey: request.organizationKey,
    evaluatedAt: request.evaluatedAt,
    decision: findings.length === 0 ? "authorized" : "blocked",
    verifiedApprovalIds: [...verifiedApprovalIds].sort(),
    verifiedPrincipalIds: [...verifiedPrincipalIds].sort(),
    findings,
  });
};

export const assertPatientEducationAuthority = (input: unknown) => {
  const result = evaluatePatientEducationAuthority(input);
  if (result.decision !== "authorized") {
    throw new Error(`Patient education authority evaluation failed: ${result.findings.map((finding) => finding.code).join(", ")}`);
  }
  return result;
};
