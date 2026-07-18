import { createHash } from "node:crypto";
import { z } from "zod";

const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const semverSchema = z.string().regex(/^\d+\.\d+\.\d+$/);

export const patientEducationGovernancePolicyTypeSchema = z.enum([
  "authority",
  "organization_isolation",
  "evidence_freshness",
  "quality_thresholds",
  "exception",
  "signing",
  "schema_migration",
  "operational_slo",
  "incident_response",
  "resilience_retention",
  "audit_export",
  "localization",
  "release_state_machine",
  "distribution_control",
]);

export const patientEducationGovernancePolicyReferenceSchema = z.object({
  policyType: patientEducationGovernancePolicyTypeSchema,
  policyId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  policyVersion: semverSchema,
  policySha256: sha256Schema,
  sourceRef: z.string().trim().min(3).max(1000),
  status: z.enum(["draft", "active", "superseded", "suspended", "retired"]),
  effectiveAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
  supersededByPolicyId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/).optional(),
  allowedEnvironments: z.array(z.enum(["test", "preview", "production"])).min(1),
  allowedRiskTiers: z.array(z.enum(["low", "moderate", "high", "critical"])).min(1),
  organizationKeys: z.array(z.string().regex(/^(?:CAF-GLOBAL|[A-Z0-9-]+)$/)).min(1),
  signatureEnvelopeRefs: z.array(z.string().regex(/^CAF-PE-SIGNATURE-[A-Z0-9-]+$/)),
}).superRefine((value, context) => {
  if (value.expiresAt && new Date(value.expiresAt) <= new Date(value.effectiveAt)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Policy ${value.policyId} expires before or at its effective time.` });
  }
  if (value.status === "superseded" && !value.supersededByPolicyId) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Superseded policy ${value.policyId} requires a successor policy ID.` });
  }
  if (value.status !== "superseded" && value.supersededByPolicyId) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Only superseded policies may declare a successor policy ID.` });
  }
});

export const patientEducationGovernanceProfileUnsignedSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  profileId: z.string().regex(/^CAF-PE-GOVERNANCE-PROFILE-[A-Z0-9-]+$/),
  profileVersion: semverSchema,
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/).optional(),
  packageVersion: semverSchema.optional(),
  organizationKey: z.string().regex(/^(?:CAF-GLOBAL|[A-Z0-9-]+)$/),
  environment: z.enum(["test", "preview", "production"]),
  riskTier: z.enum(["low", "moderate", "high", "critical"]),
  effectiveAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
  policyReferences: z.array(patientEducationGovernancePolicyReferenceSchema).min(1),
  requiredPolicyTypes: z.array(patientEducationGovernancePolicyTypeSchema).min(1),
  createdByPrincipalId: z.string().regex(/^CAF-PE-PRINCIPAL-[A-Z0-9-]+$/),
  createdAt: z.string().datetime(),
  profileSignatureRefs: z.array(z.string().regex(/^CAF-PE-SIGNATURE-[A-Z0-9-]+$/)).min(1),
  claimsBoundary: z.array(z.string().trim().min(3).max(1000)).min(1),
}).superRefine((value, context) => {
  if ((value.packageId && !value.packageVersion) || (!value.packageId && value.packageVersion)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Governance profiles must include package ID and version together." });
  }
  if (value.expiresAt && new Date(value.expiresAt) <= new Date(value.effectiveAt)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Governance profile expires before or at its effective time." });
  }
  const policyTypes = value.policyReferences.map((reference) => reference.policyType);
  if (new Set(policyTypes).size !== policyTypes.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Governance profile may reference only one policy per policy type." });
  }
  if (new Set(value.requiredPolicyTypes).size !== value.requiredPolicyTypes.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Required governance policy types must be unique." });
  }
});

export const patientEducationGovernanceProfileSchema = patientEducationGovernanceProfileUnsignedSchema.extend({
  profileSha256: sha256Schema,
});

export const patientEducationGovernanceProfileFindingSchema = z.object({
  code: z.string().regex(/^GOVERNANCE-[A-Z0-9-]+$/),
  severity: z.literal("blocking"),
  message: z.string().trim().min(1),
  remediation: z.string().trim().min(1),
  policyType: patientEducationGovernancePolicyTypeSchema.optional(),
});

export const patientEducationGovernanceProfileEvaluationSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  profileId: z.string(),
  evaluatedAt: z.string().datetime(),
  decision: z.enum(["active", "blocked"]),
  verifiedPolicyIds: z.array(z.string()),
  findings: z.array(patientEducationGovernanceProfileFindingSchema),
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

export const buildPatientEducationGovernanceProfile = (input: unknown) => {
  const value = patientEducationGovernanceProfileUnsignedSchema.parse(input);
  const normalized = {
    ...value,
    policyReferences: [...value.policyReferences].sort((left, right) => left.policyType.localeCompare(right.policyType)),
    requiredPolicyTypes: [...value.requiredPolicyTypes].sort(),
    profileSignatureRefs: [...value.profileSignatureRefs].sort(),
  };
  return patientEducationGovernanceProfileSchema.parse({ ...normalized, profileSha256: digest(normalized) });
};

const finding = (
  code: string,
  message: string,
  remediation: string,
  policyType?: z.infer<typeof patientEducationGovernancePolicyTypeSchema>,
) => ({ code, severity: "blocking" as const, message, remediation, ...(policyType ? { policyType } : {}) });

export const evaluatePatientEducationGovernanceProfile = ({
  profile: rawProfile,
  packageId,
  packageVersion,
  organizationKey,
  environment,
  riskTier,
  evaluatedAt = new Date().toISOString(),
}: {
  profile: unknown;
  packageId?: string;
  packageVersion?: string;
  organizationKey: string;
  environment: "test" | "preview" | "production";
  riskTier: "low" | "moderate" | "high" | "critical";
  evaluatedAt?: string;
}) => {
  const profile = patientEducationGovernanceProfileSchema.parse(rawProfile);
  const findings: z.infer<typeof patientEducationGovernanceProfileFindingSchema>[] = [];
  const { profileSha256, ...unsigned } = profile;
  if (digest(unsigned) !== profileSha256) {
    findings.push(finding("GOVERNANCE-PROFILE-HASH-MISMATCH", "Governance profile digest does not match its canonical content.", "Regenerate and re-sign the exact governance profile."));
  }
  if (profile.organizationKey !== organizationKey && profile.organizationKey !== "CAF-GLOBAL") {
    findings.push(finding("GOVERNANCE-ORGANIZATION-MISMATCH", `Governance profile is scoped to ${profile.organizationKey}, not ${organizationKey}.`, "Use a CAF-global or exact-organization profile."));
  }
  if (profile.environment !== environment || profile.riskTier !== riskTier) {
    findings.push(finding("GOVERNANCE-APPLICABILITY-MISMATCH", "Governance profile environment or risk tier does not match the candidate.", "Select the profile for the exact environment and package risk tier."));
  }
  if ((profile.packageId || profile.packageVersion) && (profile.packageId !== packageId || profile.packageVersion !== packageVersion)) {
    findings.push(finding("GOVERNANCE-PACKAGE-BINDING-MISMATCH", "Governance profile does not match the exact package version.", "Use the package-bound profile for this release candidate."));
  }
  if (new Date(profile.effectiveAt) > new Date(evaluatedAt) || (profile.expiresAt && new Date(profile.expiresAt) <= new Date(evaluatedAt))) {
    findings.push(finding("GOVERNANCE-PROFILE-INACTIVE", "Governance profile is not active at the evaluation time.", "Use an active, signed governance profile."));
  }

  const referenceByType = new Map(profile.policyReferences.map((reference) => [reference.policyType, reference]));
  for (const policyType of profile.requiredPolicyTypes) {
    const reference = referenceByType.get(policyType);
    if (!reference) {
      findings.push(finding("GOVERNANCE-POLICY-MISSING", `Required ${policyType} policy is missing.`, "Add an active exact-version policy reference and re-sign the profile.", policyType));
      continue;
    }
    if (reference.status !== "active") {
      findings.push(finding("GOVERNANCE-POLICY-INACTIVE", `${policyType} policy ${reference.policyId} is ${reference.status}.`, "Replace it with an active policy and repeat governance evaluation.", policyType));
    }
    if (!reference.allowedEnvironments.includes(environment) || !reference.allowedRiskTiers.includes(riskTier)) {
      findings.push(finding("GOVERNANCE-POLICY-APPLICABILITY-MISMATCH", `${policyType} policy is not approved for ${environment}/${riskTier}.`, "Use a policy explicitly approved for the target environment and risk tier.", policyType));
    }
    if (!reference.organizationKeys.includes("CAF-GLOBAL") && !reference.organizationKeys.includes(organizationKey)) {
      findings.push(finding("GOVERNANCE-POLICY-ORGANIZATION-MISMATCH", `${policyType} policy does not cover organization ${organizationKey}.`, "Use a global or exact-organization policy.", policyType));
    }
    if (new Date(reference.effectiveAt) > new Date(evaluatedAt) || (reference.expiresAt && new Date(reference.expiresAt) <= new Date(evaluatedAt))) {
      findings.push(finding("GOVERNANCE-POLICY-INACTIVE-TIME", `${policyType} policy is not active at the evaluation time.`, "Use a currently effective policy and repeat all governed checks.", policyType));
    }
    if (environment === "production" && reference.signatureEnvelopeRefs.length === 0) {
      findings.push(finding("GOVERNANCE-POLICY-SIGNATURE-MISSING", `${policyType} production policy lacks a signature reference.`, "Sign the policy with a trusted production signing key.", policyType));
    }
  }

  return patientEducationGovernanceProfileEvaluationSchema.parse({
    schemaVersion: "1.0.0",
    profileId: profile.profileId,
    evaluatedAt,
    decision: findings.length === 0 ? "active" : "blocked",
    verifiedPolicyIds: findings.length === 0 ? profile.policyReferences.map((reference) => reference.policyId).sort() : [],
    findings,
  });
};
