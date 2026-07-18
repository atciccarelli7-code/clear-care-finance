import { z } from "zod";

const semverSchema = z.string().regex(/^\d+\.\d+\.\d+$/);
const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const organizationKeySchema = z.string().regex(/^[A-Z0-9-]+$/);

const evidenceRefSchema = z.object({
  evidenceRef: z.string().trim().min(3).max(1000),
  evaluatedAt: z.string().datetime(),
});

export const patientEducationInstitutionalAuthorityInputSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  institutionalAuthorityId: z.string().regex(/^CAF-PE-INSTITUTIONAL-AUTHORITY-[A-Z0-9-]+$/),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  packageVersion: semverSchema,
  candidateSha256: sha256Schema,
  organizationKey: organizationKeySchema,
  environment: z.enum(["preview", "production"]),
  targetStatus: z.enum(["pilot_ready", "released"]),
  locale: z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/),
  adapterType: z.enum(["avs_text", "patient_portal_json", "accessible_print", "content_management", "ehr_document_reference"]),
  destinationId: z.string().regex(/^CAF-PE-DESTINATION-[A-Z0-9-]+$/),
  evaluatedAt: z.string().datetime(),
  dispatchNotBefore: z.string().datetime(),
  dispatchExpiresAt: z.string().datetime(),
  privateAuthority: evidenceRefSchema.extend({
    decisionId: z.string().regex(/^CAF-PE-PRIVATE-AUTHORITY-[A-Z0-9-]+$/),
    decision: z.enum(["authorized_for_pilot", "authorized_for_release", "blocked"]),
    candidateSha256: sha256Schema,
    organizationKey: organizationKeySchema,
    environment: z.enum(["preview", "production"]),
    targetStatus: z.enum(["pilot_ready", "released"]),
    authorityExpiresAt: z.string().datetime().optional(),
  }),
  organizationReadiness: evidenceRefSchema.extend({
    requestId: z.string().regex(/^CAF-PE-ORG-READINESS-[A-Z0-9-]+$/),
    decision: z.enum(["ready", "blocked"]),
    organizationKey: organizationKeySchema,
    destinationId: z.string().regex(/^CAF-PE-DESTINATION-[A-Z0-9-]+$/),
    entitlementId: z.string().regex(/^CAF-PE-ENTITLEMENT-[A-Z0-9-]+$/).optional(),
  }),
  conformance: evidenceRefSchema.extend({
    conformancePackageId: z.string().regex(/^CAF-PE-CONFORMANCE-PACKAGE-[A-Z0-9-]+$/),
    conformanceVersion: semverSchema,
    decision: z.enum(["conformant", "blocked"]),
    compilerVersion: semverSchema,
    compilerSha256: sha256Schema,
    sourceCommitSha: z.string().regex(/^[a-f0-9]{40}$/),
  }),
  dispatchCommand: evidenceRefSchema.extend({
    jobId: z.string().regex(/^CAF-PE-JOB-[A-Z0-9-]+$/),
    jobType: z.literal("deliver"),
    commandSha256: sha256Schema,
    commandIntegrityValid: z.boolean(),
    idempotencyKey: z.string().regex(/^caf-pe:[a-z0-9:_-]+:[a-f0-9]{64}$/),
    organizationKey: organizationKeySchema,
    packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
    packageVersion: semverSchema,
    candidateSha256: sha256Schema,
    destinationId: z.string().regex(/^CAF-PE-DESTINATION-[A-Z0-9-]+$/),
    payloadSha256: sha256Schema,
  }),
  activeControlNotices: z.array(z.object({
    noticeId: z.string().regex(/^CAF-PE-NOTICE-[A-Z0-9-]+$/),
    packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
    packageVersion: semverSchema,
    organizationKey: organizationKeySchema,
    status: z.enum(["active", "resolved"]),
    releaseStatus: z.enum(["suspended", "recalled", "retired"]),
    issuedAt: z.string().datetime(),
  })),
  organizationStatus: z.enum(["active", "suspended", "offboarding", "terminated"]),
  claimsBoundaryAccepted: z.literal(true),
}).superRefine((value, context) => {
  if (value.environment === "production" && value.targetStatus !== "released") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Production institutional authority must target released status." });
  }
  if (value.environment === "preview" && value.targetStatus !== "pilot_ready") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Preview institutional authority may target pilot-ready status only." });
  }
  if (new Date(value.dispatchExpiresAt) <= new Date(value.dispatchNotBefore)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Dispatch expiration must occur after dispatchNotBefore." });
  }
});

export const patientEducationInstitutionalAuthorityFindingSchema = z.object({
  code: z.string().regex(/^INSTITUTIONAL-AUTHORITY-[A-Z0-9-]+$/),
  subsystem: z.enum(["private_authority", "organization", "conformance", "dispatch", "control_notice", "freshness", "timing"]),
  severity: z.literal("blocking"),
  message: z.string().trim().min(1),
  remediation: z.string().trim().min(1),
  evidenceRef: z.string().optional(),
});

export const patientEducationInstitutionalAuthorityDecisionSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  institutionalAuthorityId: z.string(),
  packageId: z.string(),
  packageVersion: semverSchema,
  candidateSha256: sha256Schema,
  organizationKey: organizationKeySchema,
  environment: z.enum(["preview", "production"]),
  targetStatus: z.enum(["pilot_ready", "released"]),
  locale: z.string(),
  adapterType: z.string(),
  destinationId: z.string(),
  evaluatedAt: z.string().datetime(),
  decision: z.enum(["authorized_for_dispatch", "blocked"]),
  findings: z.array(patientEducationInstitutionalAuthorityFindingSchema),
  verifiedEvidenceRefs: z.array(z.string()),
  entitlementId: z.string().optional(),
  dispatchAuthorization: z.object({
    jobId: z.string(),
    commandSha256: sha256Schema,
    idempotencyKey: z.string(),
    payloadSha256: sha256Schema,
    notBefore: z.string().datetime(),
    expiresAt: z.string().datetime(),
  }).optional(),
  claimsBoundary: z.array(z.string().trim().min(3).max(1000)).min(1),
}).superRefine((value, context) => {
  if (value.decision === "blocked" && value.dispatchAuthorization) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Blocked institutional authority cannot expose dispatch authorization." });
  }
  if (value.decision === "authorized_for_dispatch" && (!value.dispatchAuthorization || !value.entitlementId)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Authorized institutional authority requires dispatch authorization and entitlement." });
  }
});

const finding = (
  code: string,
  subsystem: z.infer<typeof patientEducationInstitutionalAuthorityFindingSchema>["subsystem"],
  message: string,
  remediation: string,
  evidenceRef?: string,
) => ({ code, subsystem, severity: "blocking" as const, message, remediation, ...(evidenceRef ? { evidenceRef } : {}) });

export const evaluatePatientEducationInstitutionalAuthority = (input: unknown) => {
  const value = patientEducationInstitutionalAuthorityInputSchema.parse(input);
  const findings: z.infer<typeof patientEducationInstitutionalAuthorityFindingSchema>[] = [];
  const verifiedEvidenceRefs = new Set<string>();

  const freshnessWindowsMinutes = {
    privateAuthority: 60,
    organizationReadiness: 15,
    conformance: 1440,
    dispatchCommand: 15,
  } as const;
  const checkFreshness = (
    label: keyof typeof freshnessWindowsMinutes,
    evidence: { evaluatedAt: string; evidenceRef: string },
  ) => {
    const ageMinutes = (new Date(value.evaluatedAt).getTime() - new Date(evidence.evaluatedAt).getTime()) / 60_000;
    if (ageMinutes < 0 || ageMinutes > freshnessWindowsMinutes[label]) {
      findings.push(finding(
        `INSTITUTIONAL-AUTHORITY-${label.replace(/([A-Z])/g, "-$1").toUpperCase()}-STALE`,
        "freshness",
        `${label} evidence is ${ageMinutes.toFixed(2)} minutes old or future-dated.`,
        "Repeat the exact-scope evaluation within its freshness window.",
        evidence.evidenceRef,
      ));
    } else verifiedEvidenceRefs.add(evidence.evidenceRef);
  };
  checkFreshness("privateAuthority", value.privateAuthority);
  checkFreshness("organizationReadiness", value.organizationReadiness);
  checkFreshness("conformance", value.conformance);
  checkFreshness("dispatchCommand", value.dispatchCommand);

  const expectedPrivateDecision = value.targetStatus === "released" ? "authorized_for_release" : "authorized_for_pilot";
  if (
    value.privateAuthority.decision !== expectedPrivateDecision
    || value.privateAuthority.candidateSha256 !== value.candidateSha256
    || value.privateAuthority.organizationKey !== value.organizationKey
    || value.privateAuthority.environment !== value.environment
    || value.privateAuthority.targetStatus !== value.targetStatus
    || !value.privateAuthority.authorityExpiresAt
    || new Date(value.privateAuthority.authorityExpiresAt) <= new Date(value.evaluatedAt)
  ) {
    findings.push(finding(
      "INSTITUTIONAL-AUTHORITY-PRIVATE-AUTHORITY-BLOCKED",
      "private_authority",
      "Private authority is blocked, expired, or does not bind the exact candidate scope.",
      "Repeat the composite private-authority decision for the exact candidate, organization, environment, and target status.",
      value.privateAuthority.evidenceRef,
    ));
  }

  if (
    value.organizationReadiness.decision !== "ready"
    || value.organizationReadiness.organizationKey !== value.organizationKey
    || value.organizationReadiness.destinationId !== value.destinationId
    || !value.organizationReadiness.entitlementId
    || value.organizationStatus !== "active"
  ) {
    findings.push(finding(
      "INSTITUTIONAL-AUTHORITY-ORGANIZATION-NOT-READY",
      "organization",
      "Organization, destination, or entitlement is not ready for delivery.",
      "Complete organization onboarding, destination validation, health, and exact package entitlement.",
      value.organizationReadiness.evidenceRef,
    ));
  }

  if (value.conformance.decision !== "conformant") {
    findings.push(finding(
      "INSTITUTIONAL-AUTHORITY-CONFORMANCE-BLOCKED",
      "conformance",
      "The compiler and authority baseline has not passed synthetic conformance.",
      "Run and pass the complete exact-version conformance package before institutional dispatch.",
      value.conformance.evidenceRef,
    ));
  }

  if (
    !value.dispatchCommand.commandIntegrityValid
    || value.dispatchCommand.jobType !== "deliver"
    || value.dispatchCommand.organizationKey !== value.organizationKey
    || value.dispatchCommand.packageId !== value.packageId
    || value.dispatchCommand.packageVersion !== value.packageVersion
    || value.dispatchCommand.candidateSha256 !== value.candidateSha256
    || value.dispatchCommand.destinationId !== value.destinationId
  ) {
    findings.push(finding(
      "INSTITUTIONAL-AUTHORITY-DISPATCH-COMMAND-MISMATCH",
      "dispatch",
      "Dispatch command is invalid or does not bind the exact candidate, organization, and destination.",
      "Regenerate the canonical idempotent delivery command from this authority request.",
      value.dispatchCommand.evidenceRef,
    ));
  }

  const activeNotice = value.activeControlNotices.find((notice) =>
    notice.status === "active"
    && notice.packageId === value.packageId
    && notice.packageVersion === value.packageVersion
    && notice.organizationKey === value.organizationKey,
  );
  if (activeNotice) {
    findings.push(finding(
      "INSTITUTIONAL-AUTHORITY-ACTIVE-CONTROL-NOTICE",
      "control_notice",
      `Active ${activeNotice.releaseStatus} notice ${activeNotice.noticeId} blocks dispatch.`,
      "Resolve the control notice or use the authorized replacement version.",
    ));
  }

  if (new Date(value.dispatchNotBefore) < new Date(value.evaluatedAt)) {
    findings.push(finding(
      "INSTITUTIONAL-AUTHORITY-DISPATCH-WINDOW-STARTED-BEFORE-AUTHORITY",
      "timing",
      "Dispatch window begins before institutional authority evaluation.",
      "Create a new command whose not-before time is at or after authority evaluation.",
    ));
  }
  const maximumDispatchMinutes = value.environment === "production" ? 15 : 60;
  const dispatchWindowMinutes = (new Date(value.dispatchExpiresAt).getTime() - new Date(value.dispatchNotBefore).getTime()) / 60_000;
  if (dispatchWindowMinutes > maximumDispatchMinutes) {
    findings.push(finding(
      "INSTITUTIONAL-AUTHORITY-DISPATCH-WINDOW-TOO-LONG",
      "timing",
      `Dispatch window is ${dispatchWindowMinutes.toFixed(2)} minutes; maximum is ${maximumDispatchMinutes}.`,
      "Shorten the dispatch window and require fresh authority after expiration.",
    ));
  }
  if (value.privateAuthority.authorityExpiresAt && new Date(value.dispatchExpiresAt) > new Date(value.privateAuthority.authorityExpiresAt)) {
    findings.push(finding(
      "INSTITUTIONAL-AUTHORITY-DISPATCH-OUTLIVES-PRIVATE-AUTHORITY",
      "timing",
      "Dispatch authorization would outlive private authority.",
      "Set dispatch expiration no later than private-authority expiration.",
    ));
  }

  const decision = findings.length === 0 ? "authorized_for_dispatch" : "blocked";
  return patientEducationInstitutionalAuthorityDecisionSchema.parse({
    schemaVersion: "1.0.0",
    institutionalAuthorityId: value.institutionalAuthorityId,
    packageId: value.packageId,
    packageVersion: value.packageVersion,
    candidateSha256: value.candidateSha256,
    organizationKey: value.organizationKey,
    environment: value.environment,
    targetStatus: value.targetStatus,
    locale: value.locale,
    adapterType: value.adapterType,
    destinationId: value.destinationId,
    evaluatedAt: value.evaluatedAt,
    decision,
    findings,
    verifiedEvidenceRefs: [...verifiedEvidenceRefs].sort(),
    ...(decision === "authorized_for_dispatch" ? {
      entitlementId: value.organizationReadiness.entitlementId,
      dispatchAuthorization: {
        jobId: value.dispatchCommand.jobId,
        commandSha256: value.dispatchCommand.commandSha256,
        idempotencyKey: value.dispatchCommand.idempotencyKey,
        payloadSha256: value.dispatchCommand.payloadSha256,
        notBefore: value.dispatchNotBefore,
        expiresAt: value.dispatchExpiresAt,
      },
    } : {}),
    claimsBoundary: [
      "Institutional authority permits dispatch of one exact, signed, entitled candidate to one validated destination within a short time window.",
      "It does not authorize patient assignment, patient-specific values, or use outside the healthcare organization's approved runtime.",
    ],
  });
};
