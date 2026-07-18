import { z } from "zod";

const semverSchema = z.string().regex(/^\d+\.\d+\.\d+$/);
const hashSchema = z.string().regex(/^[a-f0-9]{64}$/);
const roleIdSchema = z.string().regex(/^[a-z0-9_]+$/);

export const patientEducationControlIdSchema = z.enum([
  "evidence_current",
  "clinical_safety_review",
  "pharmacy_review",
  "health_literacy_review",
  "accessibility_review",
  "patient_testing",
  "localization_human_review",
  "institution_overlay_approval",
  "privacy_boundary",
  "organization_isolation",
  "output_integrity",
  "release_hash_binding",
  "separation_of_duties",
  "distribution_authorization",
  "recall_execution",
  "acknowledgment_deadline",
  "pilot_minimum_cell_size",
]);

export const patientEducationExceptionApprovalSchema = z.object({
  approvalId: z.string().regex(/^CAF-PE-EXCEPTION-APPROVAL-[A-Z0-9-]+$/),
  principalId: z.string().regex(/^CAF-PE-PRINCIPAL-[A-Z0-9-]+$/),
  roleId: roleIdSchema,
  principalType: z.literal("human"),
  decision: z.enum(["approved", "rejected"]),
  rationale: z.string().trim().min(3).max(3000),
  approvedAt: z.string().datetime(),
});

export const patientEducationExceptionRequestSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  exceptionId: z.string().regex(/^CAF-PE-EXCEPTION-[A-Z0-9-]+$/),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  packageVersion: semverSchema,
  contentHash: hashSchema,
  organizationKey: z.string().regex(/^[A-Z0-9-]+$/),
  targetStatus: z.enum(["pilot_ready", "released"]),
  controlId: patientEducationControlIdSchema,
  riskTier: z.enum(["low", "moderate", "high", "critical"]),
  reason: z.string().trim().min(10).max(5000),
  riskAssessment: z.string().trim().min(10).max(5000),
  compensatingControls: z.array(z.object({
    controlRef: z.string().trim().min(3).max(500),
    ownerRoleId: roleIdSchema,
    verificationMethod: z.string().trim().min(3).max(2000),
    verifiedAt: z.string().datetime().optional(),
  })).min(1),
  requestedAt: z.string().datetime(),
  effectiveAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  status: z.enum(["proposed", "approved", "rejected", "revoked", "expired"]),
  approvals: z.array(patientEducationExceptionApprovalSchema),
  revocationReason: z.string().trim().min(3).max(3000).optional(),
}).superRefine((value, context) => {
  if (new Date(value.expiresAt) <= new Date(value.effectiveAt)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Exception expiration must occur after its effective time." });
  }
  if (value.status === "revoked" && !value.revocationReason) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Revoked exceptions require a revocation reason." });
  }
  if (value.status !== "revoked" && value.revocationReason) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Only revoked exceptions may contain a revocation reason." });
  }
});

export const patientEducationExceptionPolicySchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  policyId: z.string().regex(/^CAF-PE-EXCEPTION-POLICY-[A-Z0-9-]+$/),
  nonWaivableControls: z.array(patientEducationControlIdSchema).min(1),
  maximumDurationHours: z.object({
    low: z.number().int().positive().max(8760),
    moderate: z.number().int().positive().max(8760),
    high: z.number().int().positive().max(8760),
    critical: z.number().int().nonnegative().max(8760),
  }),
  requiredApproverRoleIds: z.object({
    low: z.array(roleIdSchema).min(1),
    moderate: z.array(roleIdSchema).min(1),
    high: z.array(roleIdSchema).min(2),
    critical: z.array(roleIdSchema).min(2),
  }),
  requireDistinctPrincipals: z.literal(true),
  allowProductionExceptions: z.boolean(),
  requireVerifiedCompensatingControls: z.boolean(),
});

export const patientEducationExceptionFindingSchema = z.object({
  code: z.string().regex(/^EXCEPTION-[A-Z0-9-]+$/),
  severity: z.literal("blocking"),
  message: z.string().trim().min(1),
  remediation: z.string().trim().min(1),
});

export const patientEducationExceptionDecisionSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  exceptionId: z.string(),
  evaluatedAt: z.string().datetime(),
  decision: z.enum(["effective", "blocked"]),
  findings: z.array(patientEducationExceptionFindingSchema),
  verifiedApprovalIds: z.array(z.string()),
  verifiedCompensatingControlRefs: z.array(z.string()),
});

export type PatientEducationExceptionRequest = z.infer<typeof patientEducationExceptionRequestSchema>;
export type PatientEducationExceptionPolicy = z.infer<typeof patientEducationExceptionPolicySchema>;

const finding = (code: string, message: string, remediation: string) => ({
  code,
  severity: "blocking" as const,
  message,
  remediation,
});

export const evaluatePatientEducationException = ({
  request: rawRequest,
  policy: rawPolicy,
  evaluatedAt = new Date().toISOString(),
}: {
  request: unknown;
  policy: unknown;
  evaluatedAt?: string;
}) => {
  const request = patientEducationExceptionRequestSchema.parse(rawRequest);
  const policy = patientEducationExceptionPolicySchema.parse(rawPolicy);
  const findings: z.infer<typeof patientEducationExceptionFindingSchema>[] = [];

  if (policy.nonWaivableControls.includes(request.controlId)) {
    findings.push(finding(
      "EXCEPTION-CONTROL-NON-WAIVABLE",
      `Control ${request.controlId} is non-waivable.`,
      "Resolve the failed control. Do not distribute the package under an exception.",
    ));
  }

  if (request.targetStatus === "released" && !policy.allowProductionExceptions) {
    findings.push(finding(
      "EXCEPTION-PRODUCTION-PROHIBITED",
      "Policy prohibits exceptions for released production packages.",
      "Resolve the underlying gate or limit the work to a separately authorized synthetic or controlled pilot context.",
    ));
  }

  if (request.status !== "approved") {
    findings.push(finding(
      "EXCEPTION-NOT-APPROVED",
      `Exception ${request.exceptionId} is ${request.status}.`,
      "Complete independent approval before relying on the exception.",
    ));
  }

  if (new Date(evaluatedAt) < new Date(request.effectiveAt) || new Date(evaluatedAt) >= new Date(request.expiresAt)) {
    findings.push(finding(
      "EXCEPTION-NOT-ACTIVE",
      "The exception is not active at the evaluation time.",
      "Use an active exception or resolve the underlying control.",
    ));
  }

  const durationHours = (new Date(request.expiresAt).getTime() - new Date(request.effectiveAt).getTime()) / 3_600_000;
  const maxDuration = policy.maximumDurationHours[request.riskTier];
  if (durationHours > maxDuration) {
    findings.push(finding(
      "EXCEPTION-DURATION-EXCEEDS-POLICY",
      `The ${durationHours}-hour exception exceeds the ${maxDuration}-hour maximum for ${request.riskTier} risk.`,
      "Shorten the exception period or resolve the underlying control before the maximum duration.",
    ));
  }

  if (request.riskTier === "critical" && maxDuration === 0) {
    findings.push(finding(
      "EXCEPTION-CRITICAL-RISK-PROHIBITED",
      "Critical-risk exceptions are prohibited by policy.",
      "Suspend distribution and complete the required critical-risk review or recall assessment.",
    ));
  }

  const requiredRoles = policy.requiredApproverRoleIds[request.riskTier];
  const approved = request.approvals.filter((approval) => approval.decision === "approved");
  const approvedRoles = new Set(approved.map((approval) => approval.roleId));
  const missingRoles = requiredRoles.filter((roleId) => !approvedRoles.has(roleId));
  if (missingRoles.length > 0) {
    findings.push(finding(
      "EXCEPTION-APPROVER-ROLES-MISSING",
      `Required exception approver role(s) are missing: ${missingRoles.join(", ")}.`,
      "Obtain approval from every required role using distinct authenticated human principals.",
    ));
  }

  if (policy.requireDistinctPrincipals && new Set(approved.map((approval) => approval.principalId)).size !== approved.length) {
    findings.push(finding(
      "EXCEPTION-DISTINCT-PRINCIPALS-REQUIRED",
      "One principal supplied multiple approvals for the same exception.",
      "Obtain independent approvals from distinct human principals.",
    ));
  }

  if (request.approvals.some((approval) => approval.decision === "rejected")) {
    findings.push(finding(
      "EXCEPTION-REJECTION-PRESENT",
      "At least one exception approver rejected the request.",
      "Resolve the rejection; do not treat the exception as effective while a rejection remains.",
    ));
  }

  const verifiedControls = request.compensatingControls.filter((control) => Boolean(control.verifiedAt));
  if (policy.requireVerifiedCompensatingControls && verifiedControls.length !== request.compensatingControls.length) {
    findings.push(finding(
      "EXCEPTION-COMPENSATING-CONTROL-UNVERIFIED",
      "One or more compensating controls have not been verified.",
      "Verify every compensating control and record its evidence before the exception becomes effective.",
    ));
  }

  return patientEducationExceptionDecisionSchema.parse({
    schemaVersion: "1.0.0",
    exceptionId: request.exceptionId,
    evaluatedAt,
    decision: findings.length === 0 ? "effective" : "blocked",
    findings,
    verifiedApprovalIds: findings.length === 0 ? approved.map((approval) => approval.approvalId).sort() : [],
    verifiedCompensatingControlRefs: verifiedControls.map((control) => control.controlRef).sort(),
  });
};

export const assertPatientEducationExceptionEffective = (input: Parameters<typeof evaluatePatientEducationException>[0]) => {
  const result = evaluatePatientEducationException(input);
  if (result.decision !== "effective") {
    throw new Error(`Patient education exception is not effective: ${result.findings.map((item) => item.code).join(", ")}`);
  }
  return result;
};
