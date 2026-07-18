import { z } from "zod";

const identifier = z.string().regex(/^[A-Z0-9-]+$/);
const sha256 = z.string().regex(/^[a-f0-9]{64}$/);

export const patientEducationAuthorityRoleSchema = z.enum([
  "platform_admin",
  "product_owner",
  "clinical_reviewer",
  "nursing_reviewer",
  "pharmacy_reviewer",
  "health_literacy_reviewer",
  "accessibility_reviewer",
  "privacy_reviewer",
  "security_reviewer",
  "localization_reviewer",
  "implementation_reviewer",
  "release_manager",
  "auditor",
]);

export const patientEducationOrganizationScopeSchema = z.object({
  organizationKey: identifier,
  environments: z.array(z.enum(["development", "test", "pilot", "production"])).min(1),
  packageIds: z.array(z.string().regex(/^CAF-PE-[A-Z0-9-]+$/)),
  permissions: z.array(z.enum([
    "source.read",
    "source.write",
    "review.read",
    "review.decide",
    "release.prepare",
    "release.authorize",
    "release.suspend",
    "release.recall",
    "delivery.issue",
    "delivery.revoke",
    "audit.read",
    "audit.export",
    "organization.configure",
  ])).min(1),
});

export const patientEducationActorSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  actorId: z.string().regex(/^CAF-PE-ACTOR-[A-Z0-9-]+$/),
  subjectRef: z.string().trim().min(3).max(500),
  roles: z.array(patientEducationAuthorityRoleSchema).min(1),
  organizationScopes: z.array(patientEducationOrganizationScopeSchema),
  status: z.enum(["active", "suspended", "revoked"]),
  authenticatedAt: z.string().datetime(),
  authenticationStrength: z.enum(["single_factor", "multi_factor", "hardware_backed"]),
  sessionExpiresAt: z.string().datetime(),
}).superRefine((value, context) => {
  if (new Date(value.sessionExpiresAt) <= new Date(value.authenticatedAt)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Authority session expiration must occur after authentication." });
  }
  if (["release_manager", "platform_admin"].some((role) => value.roles.includes(role as never)) && value.authenticationStrength === "single_factor") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Release and platform authority require multi-factor or hardware-backed authentication." });
  }
});

export const patientEducationSigningKeySchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  keyId: z.string().regex(/^CAF-PE-KEY-[A-Z0-9-]+$/),
  algorithm: z.enum(["Ed25519", "ECDSA-P256-SHA256"]),
  publicKeyFingerprint: sha256,
  status: z.enum(["active", "rotating", "revoked", "retired"]),
  purpose: z.enum(["release_manifest", "delivery_envelope", "audit_export"]),
  environment: z.enum(["test", "pilot", "production"]),
  createdAt: z.string().datetime(),
  activatesAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  revokedAt: z.string().datetime().optional(),
  revocationReason: z.string().trim().min(3).max(1000).optional(),
}).superRefine((value, context) => {
  if (new Date(value.expiresAt) <= new Date(value.activatesAt)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Signing key expiration must occur after activation." });
  }
  if (value.status === "revoked" && (!value.revokedAt || !value.revocationReason)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Revoked signing keys require revocation time and reason." });
  }
  if (value.status !== "revoked" && (value.revokedAt || value.revocationReason)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Revocation metadata is valid only for revoked signing keys." });
  }
});

export const patientEducationSignatureSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  signatureId: z.string().regex(/^CAF-PE-SIG-[A-Z0-9-]+$/),
  keyId: z.string().regex(/^CAF-PE-KEY-[A-Z0-9-]+$/),
  signedObjectType: z.enum(["release_manifest", "delivery_envelope", "audit_export"]),
  signedObjectId: z.string().trim().min(3).max(500),
  signedObjectSha256: sha256,
  signatureValue: z.string().regex(/^[A-Za-z0-9+/=_-]{40,}$/),
  signedAt: z.string().datetime(),
  signerActorId: z.string().regex(/^CAF-PE-ACTOR-[A-Z0-9-]+$/),
  trustedTimestampRef: z.string().trim().min(3).max(500),
});

export type PatientEducationActor = z.infer<typeof patientEducationActorSchema>;
export type PatientEducationSigningKey = z.infer<typeof patientEducationSigningKeySchema>;
export type PatientEducationSignature = z.infer<typeof patientEducationSignatureSchema>;

export const authorizePatientEducationAction = ({
  actorInput,
  organizationKey,
  environment,
  permission,
  packageId,
  at = new Date().toISOString(),
}: {
  actorInput: unknown;
  organizationKey: string;
  environment: "development" | "test" | "pilot" | "production";
  permission: z.infer<typeof patientEducationOrganizationScopeSchema>["permissions"][number];
  packageId?: string;
  at?: string;
}) => {
  const actor = patientEducationActorSchema.parse(actorInput);
  const findings: string[] = [];
  if (actor.status !== "active") findings.push("AUTHORITY-ACTOR-INACTIVE");
  if (new Date(actor.sessionExpiresAt) <= new Date(at)) findings.push("AUTHORITY-SESSION-EXPIRED");
  const scope = actor.organizationScopes.find((candidate) => candidate.organizationKey === organizationKey);
  if (!scope) findings.push("AUTHORITY-ORGANIZATION-OUT-OF-SCOPE");
  else {
    if (!scope.environments.includes(environment)) findings.push("AUTHORITY-ENVIRONMENT-OUT-OF-SCOPE");
    if (!scope.permissions.includes(permission)) findings.push("AUTHORITY-PERMISSION-DENIED");
    if (packageId && scope.packageIds.length > 0 && !scope.packageIds.includes(packageId)) findings.push("AUTHORITY-PACKAGE-OUT-OF-SCOPE");
  }
  return { authorized: findings.length === 0, actor, findings };
};

export const validatePatientEducationSigningKeyUse = ({
  keyInput,
  purpose,
  environment,
  at = new Date().toISOString(),
}: {
  keyInput: unknown;
  purpose: PatientEducationSigningKey["purpose"];
  environment: PatientEducationSigningKey["environment"];
  at?: string;
}) => {
  const key = patientEducationSigningKeySchema.parse(keyInput);
  const findings: string[] = [];
  if (key.status !== "active") findings.push("SIGNING-KEY-NOT-ACTIVE");
  if (key.purpose !== purpose) findings.push("SIGNING-KEY-PURPOSE-MISMATCH");
  if (key.environment !== environment) findings.push("SIGNING-KEY-ENVIRONMENT-MISMATCH");
  if (new Date(at) < new Date(key.activatesAt)) findings.push("SIGNING-KEY-NOT-YET-ACTIVE");
  if (new Date(at) >= new Date(key.expiresAt)) findings.push("SIGNING-KEY-EXPIRED");
  return { valid: findings.length === 0, key, findings };
};
