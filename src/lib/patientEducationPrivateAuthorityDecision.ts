import { z } from "zod";

const semverSchema = z.string().regex(/^\d+\.\d+\.\d+$/);
const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const organizationKeySchema = z.string().regex(/^[A-Z0-9-]+$/);

const subsystemEvidenceSchema = z.object({
  evidenceRef: z.string().trim().min(3).max(1000),
  evaluatedAt: z.string().datetime(),
});

export const patientEducationPrivateAuthorityInputSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  decisionId: z.string().regex(/^CAF-PE-PRIVATE-AUTHORITY-[A-Z0-9-]+$/),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  packageVersion: semverSchema,
  candidateSha256: sha256Schema,
  organizationKey: organizationKeySchema,
  environment: z.enum(["test", "preview", "production"]),
  targetStatus: z.enum(["pilot_ready", "released"]),
  evaluatedAt: z.string().datetime(),
  governanceProfile: subsystemEvidenceSchema.extend({
    profileId: z.string().regex(/^CAF-PE-GOVERNANCE-PROFILE-[A-Z0-9-]+$/),
    profileSha256: sha256Schema,
    decision: z.enum(["active", "blocked"]),
  }),
  evidenceFreshness: subsystemEvidenceSchema.extend({
    dossierId: z.string().regex(/^DOSSIER-[A-Z0-9-]+$/),
    state: z.enum(["current", "review_required", "suspend_required", "recall_assessment_required"]),
  }),
  reviewWorkflow: subsystemEvidenceSchema.extend({
    workflowId: z.string().regex(/^CAF-PE-REVIEW-WORKFLOW-[A-Z0-9-]+$/),
    contentHash: sha256Schema,
    decision: z.enum(["approved", "blocked", "in_progress"]),
  }),
  authorityEvaluation: subsystemEvidenceSchema.extend({
    authorityEvaluationId: z.string().regex(/^CAF-PE-AUTHORITY-EVAL-[A-Z0-9-]+$/),
    contentHash: sha256Schema,
    decision: z.enum(["authorized", "blocked"]),
    verifiedPrincipalIds: z.array(z.string().regex(/^CAF-PE-PRINCIPAL-[A-Z0-9-]+$/)).min(1),
    verifiedApprovalIds: z.array(z.string().regex(/^CAF-PE-APPROVAL-[A-Z0-9-]+$/)).min(1),
  }),
  organizationIsolation: subsystemEvidenceSchema.extend({
    requestId: z.string().regex(/^CAF-PE-ACCESS-[A-Z0-9-]+$/),
    resourceId: z.string().regex(/^CAF-PE-RESOURCE-[A-Z0-9-]+$/),
    resourceOrganizationKey: organizationKeySchema,
    decision: z.enum(["allowed", "blocked"]),
  }),
  releaseAuthorization: subsystemEvidenceSchema.extend({
    authorizationId: z.string().regex(/^CAF-PE-AUTH-[A-Z0-9-]+$/),
    contentHash: sha256Schema,
    decision: z.enum(["authorized", "blocked"]),
  }),
  reproducibility: subsystemEvidenceSchema.extend({
    manifestId: z.string().regex(/^CAF-PE-REPRO-[A-Z0-9-]+$/),
    manifestSha256: sha256Schema,
    sourceCommitSha: z.string().regex(/^[a-f0-9]{40}$/),
    outputBundleSha256: sha256Schema,
    valid: z.boolean(),
    cleanSourceTree: z.boolean(),
  }),
  signatureVerification: subsystemEvidenceSchema.extend({
    payloadSha256: sha256Schema,
    scope: z.literal("release_bundle"),
    environment: z.enum(["test", "preview", "production"]),
    organizationKey: organizationKeySchema,
    decision: z.enum(["trusted", "blocked"]),
    verifiedSignatureIds: z.array(z.string().regex(/^CAF-PE-SIGNATURE-[A-Z0-9-]+$/)).min(1),
    verifiedKeyIds: z.array(z.string().regex(/^CAF-PE-KEY-[A-Z0-9-]+$/)).min(1),
  }),
  privacyBoundary: subsystemEvidenceSchema.extend({
    decision: z.enum(["passed", "blocked"]),
    scanContext: z.enum(["caf_source_repository", "controlled_preview", "institutional_delivery"]),
  }),
  resilience: subsystemEvidenceSchema.extend({
    backupSetId: z.string().regex(/^CAF-PE-BACKUP-SET-[A-Z0-9-]+$/),
    state: z.enum(["healthy", "degraded", "critical"]),
    incidentRequired: z.boolean(),
  }),
  operationalHealth: subsystemEvidenceSchema.extend({
    policyId: z.string().regex(/^CAF-PE-SLO-POLICY-[A-Z0-9-]+$/),
    state: z.enum(["healthy", "degraded", "critical"]),
    incidentRequired: z.boolean(),
  }),
  activeIncidents: z.array(z.object({
    incidentId: z.string().regex(/^CAF-PE-INCIDENT-[A-Z0-9-]+$/),
    incidentType: z.string().trim().min(3).max(200),
    severity: z.enum(["sev4", "sev3", "sev2", "sev1"]),
    status: z.enum(["investigating", "contained", "recovering", "monitoring"]),
    packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/).optional(),
    packageVersion: semverSchema.optional(),
    organizationKeys: z.array(organizationKeySchema),
    distributionFrozen: z.boolean(),
  })),
  exceptions: z.array(z.object({
    exceptionId: z.string().regex(/^CAF-PE-EXCEPTION-[A-Z0-9-]+$/),
    controlId: z.string().trim().min(3).max(200),
    decision: z.enum(["effective", "blocked"]),
    targetStatus: z.enum(["pilot_ready", "released"]),
    expiresAt: z.string().datetime(),
    evidenceRef: z.string().trim().min(3).max(1000),
  })),
  claimsBoundaryAccepted: z.literal(true),
}).superRefine((value, context) => {
  if (value.environment === "production" && value.targetStatus !== "released") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Production private authority decisions must target released status." });
  }
  if (value.targetStatus === "released" && value.environment !== "production") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Released status requires the production environment." });
  }
});

export const patientEducationPrivateAuthorityFindingSchema = z.object({
  code: z.string().regex(/^PRIVATE-AUTHORITY-[A-Z0-9-]+$/),
  subsystem: z.enum([
    "governance_profile",
    "evidence",
    "review",
    "authority",
    "organization_isolation",
    "release_authorization",
    "reproducibility",
    "signatures",
    "privacy",
    "resilience",
    "operations",
    "incident_response",
    "exceptions",
    "freshness",
  ]),
  severity: z.literal("blocking"),
  message: z.string().trim().min(1),
  remediation: z.string().trim().min(1),
  evidenceRef: z.string().optional(),
});

export const patientEducationPrivateAuthorityDecisionSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  decisionId: z.string(),
  packageId: z.string(),
  packageVersion: semverSchema,
  candidateSha256: sha256Schema,
  organizationKey: organizationKeySchema,
  environment: z.enum(["test", "preview", "production"]),
  targetStatus: z.enum(["pilot_ready", "released"]),
  evaluatedAt: z.string().datetime(),
  decision: z.enum(["authorized_for_pilot", "authorized_for_release", "blocked"]),
  findings: z.array(patientEducationPrivateAuthorityFindingSchema),
  verifiedEvidenceRefs: z.array(z.string()),
  verifiedPrincipalIds: z.array(z.string()),
  verifiedSignatureIds: z.array(z.string()),
  verifiedKeyIds: z.array(z.string()),
  distributableCandidateSha256: sha256Schema.optional(),
  authorityExpiresAt: z.string().datetime().optional(),
  claimsBoundary: z.array(z.string()).min(1),
}).superRefine((value, context) => {
  if (value.decision === "blocked" && value.distributableCandidateSha256) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Blocked private authority decisions cannot expose a distributable candidate hash." });
  }
  if (value.decision !== "blocked" && !value.distributableCandidateSha256) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Authorized private authority decisions require a distributable candidate hash." });
  }
});

const finding = (
  code: string,
  subsystem: z.infer<typeof patientEducationPrivateAuthorityFindingSchema>["subsystem"],
  message: string,
  remediation: string,
  evidenceRef?: string,
) => ({ code, subsystem, severity: "blocking" as const, message, remediation, ...(evidenceRef ? { evidenceRef } : {}) });

const maxEvidenceAgeHours: Record<z.infer<typeof patientEducationPrivateAuthorityFindingSchema>["subsystem"], number> = {
  governance_profile: 24,
  evidence: 24,
  review: 24,
  authority: 4,
  organization_isolation: 1,
  release_authorization: 1,
  reproducibility: 1,
  signatures: 1,
  privacy: 1,
  resilience: 24,
  operations: 1,
  incident_response: 1,
  exceptions: 1,
  freshness: 1,
};

export const evaluatePatientEducationPrivateAuthority = (input: unknown) => {
  const value = patientEducationPrivateAuthorityInputSchema.parse(input);
  const findings: z.infer<typeof patientEducationPrivateAuthorityFindingSchema>[] = [];
  const verifiedEvidenceRefs = new Set<string>();

  const checkEvidenceAge = (subsystem: keyof typeof maxEvidenceAgeHours, evidence: { evaluatedAt: string; evidenceRef: string }) => {
    const ageHours = (new Date(value.evaluatedAt).getTime() - new Date(evidence.evaluatedAt).getTime()) / 3_600_000;
    if (ageHours < 0 || ageHours > maxEvidenceAgeHours[subsystem]) {
      findings.push(finding(
        `PRIVATE-AUTHORITY-${subsystem.replaceAll("_", "-").toUpperCase()}-STALE`,
        "freshness",
        `${subsystem} evidence is ${ageHours.toFixed(2)} hours old or future-dated.`,
        "Repeat the subsystem evaluation within the permitted freshness window.",
        evidence.evidenceRef,
      ));
    } else verifiedEvidenceRefs.add(evidence.evidenceRef);
  };

  checkEvidenceAge("governance_profile", value.governanceProfile);
  checkEvidenceAge("evidence", value.evidenceFreshness);
  checkEvidenceAge("review", value.reviewWorkflow);
  checkEvidenceAge("authority", value.authorityEvaluation);
  checkEvidenceAge("organization_isolation", value.organizationIsolation);
  checkEvidenceAge("release_authorization", value.releaseAuthorization);
  checkEvidenceAge("reproducibility", value.reproducibility);
  checkEvidenceAge("signatures", value.signatureVerification);
  checkEvidenceAge("privacy", value.privacyBoundary);
  checkEvidenceAge("resilience", value.resilience);
  checkEvidenceAge("operations", value.operationalHealth);

  if (value.governanceProfile.decision !== "active") findings.push(finding("PRIVATE-AUTHORITY-GOVERNANCE-PROFILE-BLOCKED", "governance_profile", "Governance profile is not active.", "Resolve profile hash, scope, signatures, and policy applicability.", value.governanceProfile.evidenceRef));
  if (value.evidenceFreshness.state !== "current") findings.push(finding("PRIVATE-AUTHORITY-EVIDENCE-NOT-CURRENT", "evidence", `Evidence state is ${value.evidenceFreshness.state}.`, "Complete review, suspension, or recall assessment before release.", value.evidenceFreshness.evidenceRef));
  if (value.reviewWorkflow.decision !== "approved" || value.reviewWorkflow.contentHash !== value.candidateSha256) findings.push(finding("PRIVATE-AUTHORITY-REVIEW-NOT-APPROVED", "review", "Review workflow is not approved for the exact candidate hash.", "Complete every dependency-ordered human review for the exact candidate.", value.reviewWorkflow.evidenceRef));
  if (value.authorityEvaluation.decision !== "authorized" || value.authorityEvaluation.contentHash !== value.candidateSha256) findings.push(finding("PRIVATE-AUTHORITY-HUMAN-AUTHORITY-BLOCKED", "authority", "Authenticated authority evaluation is blocked or hash-mismatched.", "Obtain exact-version approvals with quorum and separation of duties.", value.authorityEvaluation.evidenceRef));
  if (value.organizationIsolation.decision !== "allowed" || value.organizationIsolation.resourceOrganizationKey !== value.organizationKey) findings.push(finding("PRIVATE-AUTHORITY-ORGANIZATION-ISOLATION-BLOCKED", "organization_isolation", "Organization isolation did not allow access to the exact tenant resource.", "Use a principal and resource scoped to the exact organization and environment.", value.organizationIsolation.evidenceRef));
  if (value.releaseAuthorization.decision !== "authorized" || value.releaseAuthorization.contentHash !== value.candidateSha256) findings.push(finding("PRIVATE-AUTHORITY-RELEASE-AUTHORIZATION-BLOCKED", "release_authorization", "Release authorization is blocked or hash-mismatched.", "Resolve every release gate for the exact candidate.", value.releaseAuthorization.evidenceRef));
  if (!value.reproducibility.valid || !value.reproducibility.cleanSourceTree || value.reproducibility.outputBundleSha256 !== value.candidateSha256) findings.push(finding("PRIVATE-AUTHORITY-REPRODUCIBILITY-BLOCKED", "reproducibility", "Candidate is not reproducible from a clean exact source revision.", "Rebuild from the recorded commit and lockfile, regenerate provenance, and repeat authorization.", value.reproducibility.evidenceRef));
  if (value.signatureVerification.decision !== "trusted" || value.signatureVerification.payloadSha256 !== value.candidateSha256 || value.signatureVerification.organizationKey !== value.organizationKey || value.signatureVerification.environment !== value.environment) findings.push(finding("PRIVATE-AUTHORITY-SIGNATURES-BLOCKED", "signatures", "Trusted signatures do not bind the exact candidate, organization, and environment.", "Verify or re-sign the exact release bundle with trusted environment-specific keys.", value.signatureVerification.evidenceRef));
  if (value.privacyBoundary.decision !== "passed" || value.privacyBoundary.scanContext !== "institutional_delivery") findings.push(finding("PRIVATE-AUTHORITY-PRIVACY-BOUNDARY-BLOCKED", "privacy", "Institutional-delivery privacy boundary did not pass.", "Remove unsafe values and repeat privacy validation.", value.privacyBoundary.evidenceRef));
  if (value.resilience.state !== "healthy" || value.resilience.incidentRequired) findings.push(finding("PRIVATE-AUTHORITY-RESILIENCE-NOT-HEALTHY", "resilience", "Backup and recovery state is not healthy.", "Restore compliant backup coverage and pass an isolated restore test.", value.resilience.evidenceRef));
  if (value.operationalHealth.state === "critical" || value.operationalHealth.incidentRequired || (value.targetStatus === "released" && value.operationalHealth.state !== "healthy")) findings.push(finding("PRIVATE-AUTHORITY-OPERATIONS-NOT-HEALTHY", "operations", "Operational health does not meet release requirements.", "Resolve breached SLOs and any required incident before distribution.", value.operationalHealth.evidenceRef));

  const relevantIncidents = value.activeIncidents.filter((incident) =>
    (!incident.packageId || (incident.packageId === value.packageId && incident.packageVersion === value.packageVersion))
    && (incident.organizationKeys.length === 0 || incident.organizationKeys.includes(value.organizationKey)),
  );
  if (relevantIncidents.length > 0) {
    findings.push(finding(
      "PRIVATE-AUTHORITY-ACTIVE-INCIDENT",
      "incident_response",
      `Active incident(s) affect this candidate: ${relevantIncidents.map((incident) => incident.incidentId).join(", ")}.`,
      "Contain and close the incidents or formally isolate the unaffected candidate with documented evidence.",
    ));
  }

  if (value.targetStatus === "released" && value.exceptions.length > 0) {
    findings.push(finding("PRIVATE-AUTHORITY-PRODUCTION-EXCEPTION-PROHIBITED", "exceptions", "Production release cannot depend on governance exceptions.", "Resolve every control before production authorization."));
  }
  for (const exception of value.exceptions) {
    if (exception.decision !== "effective" || exception.targetStatus !== value.targetStatus || new Date(exception.expiresAt) <= new Date(value.evaluatedAt)) {
      findings.push(finding("PRIVATE-AUTHORITY-EXCEPTION-NOT-EFFECTIVE", "exceptions", `Exception ${exception.exceptionId} is not effective for this target.`, "Remove the exception dependency or obtain a valid pilot-only exception.", exception.evidenceRef));
    }
  }

  const decision = findings.length > 0
    ? "blocked"
    : value.targetStatus === "released"
      ? "authorized_for_release"
      : "authorized_for_pilot";
  const authorityExpiresAt = decision === "blocked"
    ? undefined
    : new Date(new Date(value.evaluatedAt).getTime() + 60 * 60 * 1000).toISOString();

  return patientEducationPrivateAuthorityDecisionSchema.parse({
    schemaVersion: "1.0.0",
    decisionId: value.decisionId,
    packageId: value.packageId,
    packageVersion: value.packageVersion,
    candidateSha256: value.candidateSha256,
    organizationKey: value.organizationKey,
    environment: value.environment,
    targetStatus: value.targetStatus,
    evaluatedAt: value.evaluatedAt,
    decision,
    findings,
    verifiedEvidenceRefs: [...verifiedEvidenceRefs].sort(),
    verifiedPrincipalIds: decision === "blocked" ? [] : [...value.authorityEvaluation.verifiedPrincipalIds].sort(),
    verifiedSignatureIds: decision === "blocked" ? [] : [...value.signatureVerification.verifiedSignatureIds].sort(),
    verifiedKeyIds: decision === "blocked" ? [] : [...value.signatureVerification.verifiedKeyIds].sort(),
    ...(decision === "blocked" ? {} : { distributableCandidateSha256: value.candidateSha256, authorityExpiresAt }),
    claimsBoundary: [
      "Private authority confirms engineering and governance controls for the exact candidate only; it does not independently establish clinical efficacy, legal compliance, accessibility conformance, or patient outcomes.",
      "Patient assignment and patient-specific values remain inside the healthcare organization's approved environment.",
    ],
  });
};
