import { z } from "zod";

const semverSchema = z.string().regex(/^\d+\.\d+\.\d+$/);
const organizationKeySchema = z.string().regex(/^[A-Z0-9-]+$/);

export const patientEducationOrganizationGateSchema = z.object({
  gateId: z.string().regex(/^CAF-PE-ORG-GATE-[A-Z0-9-]+$/),
  gateType: z.enum([
    "contract",
    "security_review",
    "privacy_review",
    "clinical_governance_review",
    "implementation_readiness",
    "support_readiness",
    "destination_validation",
    "data_residency",
    "incident_contacts",
    "recall_contacts",
  ]),
  status: z.enum(["not_started", "in_review", "passed", "failed", "expired", "not_applicable"]),
  ownerRoleId: z.string().regex(/^[a-z0-9_]+$/),
  evidenceRef: z.string().trim().min(3).max(1000).optional(),
  completedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  rationale: z.string().trim().min(3).max(3000).optional(),
}).superRefine((value, context) => {
  if (value.status === "passed" && (!value.evidenceRef || !value.completedAt)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Passed organization gate ${value.gateId} requires evidence and completion time.` });
  }
  if (value.status === "not_applicable" && !value.rationale) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Not-applicable organization gate ${value.gateId} requires rationale.` });
  }
});

export const patientEducationDestinationSchema = z.object({
  destinationId: z.string().regex(/^CAF-PE-DESTINATION-[A-Z0-9-]+$/),
  organizationKey: organizationKeySchema,
  environment: z.enum(["test", "preview", "production"]),
  adapterType: z.enum(["avs_text", "patient_portal_json", "accessible_print", "content_management", "ehr_document_reference"]),
  endpointRef: z.string().trim().min(3).max(1000),
  authenticationMethod: z.enum(["none_test_only", "oauth2_client_credentials", "mutual_tls", "signed_request", "private_network"]),
  credentialRef: z.string().trim().min(3).max(1000).optional(),
  inlineCredentialMaterial: z.never().optional(),
  status: z.enum(["draft", "validating", "active", "degraded", "suspended", "retired"]),
  patientBindingLocation: z.literal("organization_runtime"),
  cafPhiCapability: z.literal("none"),
  allowedLocales: z.array(z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/)).min(1),
  maximumPayloadBytes: z.number().int().positive().max(100_000_000),
  timeoutMs: z.number().int().positive().max(600_000),
  retryPolicyRef: z.string().trim().min(3).max(1000),
  circuitBreakerPolicyRef: z.string().trim().min(3).max(1000),
  lastValidatedAt: z.string().datetime().optional(),
  validationExpiresAt: z.string().datetime().optional(),
  lastHealthStatus: z.enum(["unknown", "healthy", "degraded", "unavailable"]),
  lastHealthCheckedAt: z.string().datetime().optional(),
}).superRefine((value, context) => {
  if (value.environment === "production" && value.authenticationMethod === "none_test_only") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Production destination ${value.destinationId} requires authentication.` });
  }
  if (value.authenticationMethod !== "none_test_only" && !value.credentialRef) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Destination ${value.destinationId} requires an external credential reference.` });
  }
  if (value.status === "active" && (!value.lastValidatedAt || !value.validationExpiresAt)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Active destination ${value.destinationId} requires validation provenance and expiration.` });
  }
});

export const patientEducationOrganizationEntitlementSchema = z.object({
  entitlementId: z.string().regex(/^CAF-PE-ENTITLEMENT-[A-Z0-9-]+$/),
  organizationKey: organizationKeySchema,
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  minimumPackageVersion: semverSchema,
  maximumPackageVersionExclusive: semverSchema.optional(),
  allowedLocales: z.array(z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/)).min(1),
  allowedAdapterTypes: z.array(patientEducationDestinationSchema.shape.adapterType).min(1),
  status: z.enum(["pending", "active", "suspended", "expired", "terminated"]),
  effectiveAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
  contractRef: z.string().trim().min(3).max(1000),
  productScheduleRef: z.string().trim().min(3).max(1000),
  pilotOnly: z.boolean(),
}).superRefine((value, context) => {
  if (value.expiresAt && new Date(value.expiresAt) <= new Date(value.effectiveAt)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Entitlement ${value.entitlementId} expires before or at its effective time.` });
  }
});

export const patientEducationOrganizationProfileSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  organizationKey: organizationKeySchema,
  organizationIdentityRef: z.string().trim().min(3).max(1000),
  status: z.enum(["onboarding", "active", "suspended", "offboarding", "terminated"]),
  environment: z.enum(["test", "preview", "production"]),
  dataResidencyRegions: z.array(z.string().trim().min(2).max(200)).min(1),
  encryptionContextRef: z.string().trim().min(3).max(1000),
  contractRef: z.string().trim().min(3).max(1000),
  contractEffectiveAt: z.string().datetime(),
  contractExpiresAt: z.string().datetime().optional(),
  supportContactRef: z.string().trim().min(3).max(1000),
  incidentContactRef: z.string().trim().min(3).max(1000),
  recallContactRef: z.string().trim().min(3).max(1000),
  gates: z.array(patientEducationOrganizationGateSchema).min(1),
  destinations: z.array(patientEducationDestinationSchema),
  entitlements: z.array(patientEducationOrganizationEntitlementSchema),
  onboardingCompletedAt: z.string().datetime().optional(),
  suspensionReason: z.string().trim().min(3).max(3000).optional(),
}).superRefine((value, context) => {
  const gateIds = value.gates.map((gate) => gate.gateId);
  const destinationIds = value.destinations.map((destination) => destination.destinationId);
  const entitlementIds = value.entitlements.map((entitlement) => entitlement.entitlementId);
  if (new Set(gateIds).size !== gateIds.length) context.addIssue({ code: z.ZodIssueCode.custom, message: "Organization gate IDs must be unique." });
  if (new Set(destinationIds).size !== destinationIds.length) context.addIssue({ code: z.ZodIssueCode.custom, message: "Organization destination IDs must be unique." });
  if (new Set(entitlementIds).size !== entitlementIds.length) context.addIssue({ code: z.ZodIssueCode.custom, message: "Organization entitlement IDs must be unique." });
  if (value.destinations.some((destination) => destination.organizationKey !== value.organizationKey || destination.environment !== value.environment)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "All organization destinations must match the profile organization and environment." });
  }
  if (value.entitlements.some((entitlement) => entitlement.organizationKey !== value.organizationKey)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "All entitlements must match the profile organization." });
  }
  if (value.status === "active" && !value.onboardingCompletedAt) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Active organizations require onboardingCompletedAt." });
  }
  if (value.status === "suspended" && !value.suspensionReason) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Suspended organizations require a suspension reason." });
  }
});

export const patientEducationOrganizationReadinessRequestSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  requestId: z.string().regex(/^CAF-PE-ORG-READINESS-[A-Z0-9-]+$/),
  organizationKey: organizationKeySchema,
  environment: z.enum(["test", "preview", "production"]),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  packageVersion: semverSchema,
  locale: z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/),
  adapterType: patientEducationDestinationSchema.shape.adapterType,
  targetStatus: z.enum(["pilot_ready", "released"]),
  destinationId: z.string().regex(/^CAF-PE-DESTINATION-[A-Z0-9-]+$/),
  evaluatedAt: z.string().datetime(),
  profile: patientEducationOrganizationProfileSchema,
});

export const patientEducationOrganizationReadinessFindingSchema = z.object({
  code: z.string().regex(/^ORGANIZATION-[A-Z0-9-]+$/),
  severity: z.literal("blocking"),
  message: z.string().trim().min(1),
  remediation: z.string().trim().min(1),
});

export const patientEducationOrganizationReadinessDecisionSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  requestId: z.string(),
  organizationKey: organizationKeySchema,
  evaluatedAt: z.string().datetime(),
  decision: z.enum(["ready", "blocked"]),
  destinationId: z.string(),
  entitlementId: z.string().optional(),
  findings: z.array(patientEducationOrganizationReadinessFindingSchema),
});

export const patientEducationOrganizationOffboardingSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  offboardingId: z.string().regex(/^CAF-PE-OFFBOARDING-[A-Z0-9-]+$/),
  organizationKey: organizationKeySchema,
  initiatedAt: z.string().datetime(),
  effectiveAt: z.string().datetime(),
  reason: z.string().trim().min(3).max(3000),
  ownerPrincipalId: z.string().regex(/^CAF-PE-PRINCIPAL-[A-Z0-9-]+$/),
  status: z.enum(["planned", "in_progress", "completed", "blocked"]),
  actions: z.array(z.object({
    actionId: z.string().regex(/^CAF-PE-OFFBOARDING-ACTION-[A-Z0-9-]+$/),
    actionType: z.enum(["freeze_distribution", "disable_destinations", "terminate_entitlements", "export_audit", "preserve_governance_history", "remove_access", "destroy_permitted_configuration", "confirm_completion"]),
    ownerRoleId: z.string().regex(/^[a-z0-9_]+$/),
    status: z.enum(["not_started", "in_progress", "completed", "blocked"]),
    dueAt: z.string().datetime(),
    completedAt: z.string().datetime().optional(),
    evidenceRef: z.string().trim().min(3).max(1000).optional(),
  })).min(1),
}).superRefine((value, context) => {
  const actionIds = value.actions.map((action) => action.actionId);
  if (new Set(actionIds).size !== actionIds.length) context.addIssue({ code: z.ZodIssueCode.custom, message: "Offboarding action IDs must be unique." });
  if (value.status === "completed" && value.actions.some((action) => action.status !== "completed" || !action.completedAt || !action.evidenceRef)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Completed offboarding requires every action to be completed with evidence." });
  }
});

const parseVersion = (value: string) => value.split(".").map(Number) as [number, number, number];
const compareVersion = (left: string, right: string) => {
  const a = parseVersion(left);
  const b = parseVersion(right);
  for (let index = 0; index < 3; index += 1) if (a[index] !== b[index]) return a[index] - b[index];
  return 0;
};

const finding = (code: string, message: string, remediation: string) => ({ code, severity: "blocking" as const, message, remediation });

export const evaluatePatientEducationOrganizationReadiness = (input: unknown) => {
  const request = patientEducationOrganizationReadinessRequestSchema.parse(input);
  const profile = request.profile;
  const findings: z.infer<typeof patientEducationOrganizationReadinessFindingSchema>[] = [];
  if (profile.organizationKey !== request.organizationKey || profile.environment !== request.environment) {
    findings.push(finding("ORGANIZATION-PROFILE-SCOPE-MISMATCH", "Organization profile does not match the request scope.", "Use the exact organization and environment profile."));
  }
  if (profile.status !== "active") {
    findings.push(finding("ORGANIZATION-NOT-ACTIVE", `Organization is ${profile.status}.`, "Complete onboarding or resolve suspension/offboarding before delivery."));
  }
  if (new Date(profile.contractEffectiveAt) > new Date(request.evaluatedAt) || (profile.contractExpiresAt && new Date(profile.contractExpiresAt) <= new Date(request.evaluatedAt))) {
    findings.push(finding("ORGANIZATION-CONTRACT-INACTIVE", "Organization contract is not active.", "Renew or activate the governing contract before delivery."));
  }
  const requiredGateTypes = ["contract", "security_review", "privacy_review", "clinical_governance_review", "implementation_readiness", "support_readiness", "destination_validation", "data_residency", "incident_contacts", "recall_contacts"] as const;
  for (const gateType of requiredGateTypes) {
    const gate = profile.gates.find((candidate) => candidate.gateType === gateType);
    if (!gate || !["passed", "not_applicable"].includes(gate.status)) {
      findings.push(finding("ORGANIZATION-GATE-NOT-PASSED", `Required organization gate ${gateType} is not passed.`, "Complete and evidence the onboarding gate."));
    } else if (gate.status === "passed" && gate.expiresAt && new Date(gate.expiresAt) <= new Date(request.evaluatedAt)) {
      findings.push(finding("ORGANIZATION-GATE-EXPIRED", `Organization gate ${gateType} has expired.`, "Repeat the gate review before delivery."));
    }
  }
  const destination = profile.destinations.find((candidate) => candidate.destinationId === request.destinationId);
  if (!destination) {
    findings.push(finding("ORGANIZATION-DESTINATION-MISSING", `Destination ${request.destinationId} is not registered.`, "Register and validate the exact destination."));
  } else {
    if (destination.status !== "active" || destination.lastHealthStatus !== "healthy") findings.push(finding("ORGANIZATION-DESTINATION-NOT-HEALTHY", `Destination ${destination.destinationId} is ${destination.status}/${destination.lastHealthStatus}.`, "Restore destination validation and health before delivery."));
    if (destination.adapterType !== request.adapterType || !destination.allowedLocales.includes(request.locale)) findings.push(finding("ORGANIZATION-DESTINATION-APPLICABILITY-MISMATCH", "Destination adapter or locale does not match the request.", "Use a destination validated for the requested adapter and locale."));
    if (destination.validationExpiresAt && new Date(destination.validationExpiresAt) <= new Date(request.evaluatedAt)) findings.push(finding("ORGANIZATION-DESTINATION-VALIDATION-EXPIRED", "Destination validation has expired.", "Repeat destination conformance and security validation."));
  }
  const entitlement = profile.entitlements.find((candidate) =>
    candidate.packageId === request.packageId
    && candidate.status === "active"
    && candidate.allowedLocales.includes(request.locale)
    && candidate.allowedAdapterTypes.includes(request.adapterType)
    && compareVersion(request.packageVersion, candidate.minimumPackageVersion) >= 0
    && (!candidate.maximumPackageVersionExclusive || compareVersion(request.packageVersion, candidate.maximumPackageVersionExclusive) < 0)
    && new Date(candidate.effectiveAt) <= new Date(request.evaluatedAt)
    && (!candidate.expiresAt || new Date(candidate.expiresAt) > new Date(request.evaluatedAt)),
  );
  if (!entitlement) findings.push(finding("ORGANIZATION-ENTITLEMENT-MISSING", "No active entitlement covers the exact package, locale, adapter, and time.", "Activate an exact-scope entitlement before delivery."));
  else if (request.targetStatus === "released" && entitlement.pilotOnly) findings.push(finding("ORGANIZATION-ENTITLEMENT-PILOT-ONLY", "The entitlement permits pilot use only.", "Execute a production product schedule before release delivery."));

  return patientEducationOrganizationReadinessDecisionSchema.parse({
    schemaVersion: "1.0.0",
    requestId: request.requestId,
    organizationKey: request.organizationKey,
    evaluatedAt: request.evaluatedAt,
    decision: findings.length === 0 ? "ready" : "blocked",
    destinationId: request.destinationId,
    ...(entitlement ? { entitlementId: entitlement.entitlementId } : {}),
    findings,
  });
};
