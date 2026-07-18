import { z } from "zod";

const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const organizationKeySchema = z.string().regex(/^(?:CAF-GLOBAL|[A-Z0-9-]+)$/);

export const patientEducationSignatureScopeSchema = z.enum([
  "reproducibility_manifest",
  "release_bundle",
  "delivery_envelope",
  "control_notice",
  "audit_export",
]);

export const patientEducationSigningKeySchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  keyId: z.string().regex(/^CAF-PE-KEY-[A-Z0-9-]+$/),
  algorithm: z.enum(["ed25519", "ecdsa_p256_sha256", "rsa_pss_sha256"]),
  publicKeyRef: z.string().trim().min(3).max(1000),
  privateKeyInline: z.never().optional(),
  organizationKey: organizationKeySchema,
  environment: z.enum(["test", "preview", "production"]),
  permittedScopes: z.array(patientEducationSignatureScopeSchema).min(1),
  status: z.enum(["active", "rotating", "revoked", "expired"]),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime(),
  rotationSuccessorKeyId: z.string().regex(/^CAF-PE-KEY-[A-Z0-9-]+$/).optional(),
  revocationReason: z.string().trim().min(3).max(3000).optional(),
}).superRefine((value, context) => {
  if (new Date(value.validUntil) <= new Date(value.validFrom)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Signing-key validity must end after it begins." });
  }
  if (value.status === "rotating" && !value.rotationSuccessorKeyId) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Rotating signing keys require a successor key ID." });
  }
  if (value.status === "revoked" && !value.revocationReason) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Revoked signing keys require a revocation reason." });
  }
});

export const patientEducationSignatureEnvelopeSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  signatureId: z.string().regex(/^CAF-PE-SIGNATURE-[A-Z0-9-]+$/),
  keyId: z.string().regex(/^CAF-PE-KEY-[A-Z0-9-]+$/),
  algorithm: z.enum(["ed25519", "ecdsa_p256_sha256", "rsa_pss_sha256"]),
  scope: patientEducationSignatureScopeSchema,
  payloadSha256: sha256Schema,
  organizationKey: organizationKeySchema,
  environment: z.enum(["test", "preview", "production"]),
  signerPrincipalId: z.string().regex(/^CAF-PE-PRINCIPAL-[A-Z0-9-]+$/),
  signerRoleId: z.string().regex(/^[a-z0-9_]+$/),
  signedAt: z.string().datetime(),
  detachedSignature: z.string().regex(/^[A-Za-z0-9+/=_-]{16,}$/),
  trustedTimestampRef: z.string().trim().min(3).max(1000).optional(),
  certificateChainRefs: z.array(z.string().trim().min(3).max(1000)),
  cryptographicVerification: z.enum(["not_verified", "verified", "failed"]),
});

export const patientEducationSigningPolicySchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  policyId: z.string().regex(/^CAF-PE-SIGNING-POLICY-[A-Z0-9-]+$/),
  trustedKeyIds: z.array(z.string().regex(/^CAF-PE-KEY-[A-Z0-9-]+$/)).min(1),
  allowedAlgorithms: z.object({
    test: z.array(z.enum(["ed25519", "ecdsa_p256_sha256", "rsa_pss_sha256"])).min(1),
    preview: z.array(z.enum(["ed25519", "ecdsa_p256_sha256", "rsa_pss_sha256"])).min(1),
    production: z.array(z.enum(["ed25519", "ecdsa_p256_sha256", "rsa_pss_sha256"])).min(1),
  }),
  minimumDistinctSignatures: z.record(patientEducationSignatureScopeSchema, z.number().int().positive().max(5)),
  requireTrustedTimestampInProduction: z.literal(true),
  requireCryptographicVerification: z.literal(true),
});

export const patientEducationSignatureFindingSchema = z.object({
  code: z.string().regex(/^SIGNATURE-[A-Z0-9-]+$/),
  severity: z.literal("blocking"),
  message: z.string().trim().min(1),
  remediation: z.string().trim().min(1),
  signatureId: z.string().optional(),
});

export const patientEducationSignatureVerificationResultSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  payloadSha256: sha256Schema,
  scope: patientEducationSignatureScopeSchema,
  organizationKey: organizationKeySchema,
  environment: z.enum(["test", "preview", "production"]),
  evaluatedAt: z.string().datetime(),
  decision: z.enum(["trusted", "blocked"]),
  verifiedSignatureIds: z.array(z.string()),
  verifiedKeyIds: z.array(z.string()),
  findings: z.array(patientEducationSignatureFindingSchema),
});

const finding = (code: string, message: string, remediation: string, signatureId?: string) => ({
  code,
  severity: "blocking" as const,
  message,
  remediation,
  ...(signatureId ? { signatureId } : {}),
});

export const evaluatePatientEducationSignatures = ({
  payloadSha256,
  scope,
  organizationKey,
  environment,
  keys: rawKeys,
  signatures: rawSignatures,
  policy: rawPolicy,
  evaluatedAt = new Date().toISOString(),
}: {
  payloadSha256: string;
  scope: z.infer<typeof patientEducationSignatureScopeSchema>;
  organizationKey: string;
  environment: "test" | "preview" | "production";
  keys: unknown[];
  signatures: unknown[];
  policy: unknown;
  evaluatedAt?: string;
}) => {
  sha256Schema.parse(payloadSha256);
  const keys = rawKeys.map((key) => patientEducationSigningKeySchema.parse(key));
  const signatures = rawSignatures.map((signature) => patientEducationSignatureEnvelopeSchema.parse(signature));
  const policy = patientEducationSigningPolicySchema.parse(rawPolicy);
  const findings: z.infer<typeof patientEducationSignatureFindingSchema>[] = [];
  const keyById = new Map(keys.map((key) => [key.keyId, key]));
  const verifiedSignatureIds = new Set<string>();
  const verifiedKeyIds = new Set<string>();

  if (new Set(keys.map((key) => key.keyId)).size !== keys.length) {
    findings.push(finding("SIGNATURE-DUPLICATE-KEY", "Signing key IDs are not unique.", "Use one canonical metadata record per signing key."));
  }
  if (new Set(signatures.map((signature) => signature.signatureId)).size !== signatures.length) {
    findings.push(finding("SIGNATURE-DUPLICATE-SIGNATURE", "Signature IDs are not unique.", "Issue immutable unique signature envelopes."));
  }

  for (const signature of signatures) {
    const key = keyById.get(signature.keyId);
    let valid = true;
    if (!key) {
      findings.push(finding("SIGNATURE-KEY-MISSING", `Signature ${signature.signatureId} references an unknown key.`, "Resolve the trusted key metadata before accepting the signature.", signature.signatureId));
      continue;
    }
    if (!policy.trustedKeyIds.includes(key.keyId)) {
      findings.push(finding("SIGNATURE-KEY-NOT-TRUSTED", `Key ${key.keyId} is not trusted by policy.`, "Use a key enrolled in the active signing policy.", signature.signatureId));
      valid = false;
    }
    if (!["active", "rotating"].includes(key.status)) {
      findings.push(finding("SIGNATURE-KEY-INACTIVE", `Key ${key.keyId} is ${key.status}.`, "Re-sign with an active trusted key and assess artifacts signed after revocation.", signature.signatureId));
      valid = false;
    }
    if (new Date(signature.signedAt) < new Date(key.validFrom) || new Date(signature.signedAt) >= new Date(key.validUntil)) {
      findings.push(finding("SIGNATURE-KEY-OUTSIDE-VALIDITY", `Signature ${signature.signatureId} was created outside key validity.`, "Re-sign with a key valid at the signing time.", signature.signatureId));
      valid = false;
    }
    if (new Date(signature.signedAt) > new Date(evaluatedAt)) {
      findings.push(finding("SIGNATURE-FUTURE-TIMESTAMP", `Signature ${signature.signatureId} has a future signing time.`, "Correct clock synchronization and re-sign.", signature.signatureId));
      valid = false;
    }
    if (signature.algorithm !== key.algorithm || !policy.allowedAlgorithms[environment].includes(signature.algorithm)) {
      findings.push(finding("SIGNATURE-ALGORITHM-NOT-ALLOWED", `Signature ${signature.signatureId} uses an unapproved algorithm.`, "Re-sign with an algorithm allowed for the target environment.", signature.signatureId));
      valid = false;
    }
    if (signature.payloadSha256 !== payloadSha256 || signature.scope !== scope) {
      findings.push(finding("SIGNATURE-PAYLOAD-BINDING-MISMATCH", `Signature ${signature.signatureId} does not bind the exact payload and scope.`, "Re-sign the exact payload digest for the intended scope.", signature.signatureId));
      valid = false;
    }
    if (signature.organizationKey !== organizationKey || key.organizationKey !== organizationKey) {
      findings.push(finding("SIGNATURE-ORGANIZATION-MISMATCH", `Signature ${signature.signatureId} is outside organization ${organizationKey}.`, "Use a trusted key and signer scoped to the exact organization.", signature.signatureId));
      valid = false;
    }
    if (signature.environment !== environment || key.environment !== environment) {
      findings.push(finding("SIGNATURE-ENVIRONMENT-MISMATCH", `Signature ${signature.signatureId} is not bound to ${environment}.`, "Use an environment-specific key and signature.", signature.signatureId));
      valid = false;
    }
    if (!key.permittedScopes.includes(scope)) {
      findings.push(finding("SIGNATURE-SCOPE-NOT-PERMITTED", `Key ${key.keyId} cannot sign ${scope}.`, "Use a key explicitly permitted for this signature scope.", signature.signatureId));
      valid = false;
    }
    if (policy.requireCryptographicVerification && signature.cryptographicVerification !== "verified") {
      findings.push(finding("SIGNATURE-CRYPTOGRAPHIC-VERIFICATION-REQUIRED", `Signature ${signature.signatureId} is ${signature.cryptographicVerification}.`, "Verify the detached signature against the trusted public key before authorization.", signature.signatureId));
      valid = false;
    }
    if (environment === "production" && policy.requireTrustedTimestampInProduction && !signature.trustedTimestampRef) {
      findings.push(finding("SIGNATURE-TRUSTED-TIMESTAMP-REQUIRED", `Production signature ${signature.signatureId} lacks a trusted timestamp.`, "Obtain and record a trusted timestamp token.", signature.signatureId));
      valid = false;
    }
    if (valid) {
      verifiedSignatureIds.add(signature.signatureId);
      verifiedKeyIds.add(key.keyId);
    }
  }

  const requiredCount = policy.minimumDistinctSignatures[scope];
  if (verifiedKeyIds.size < requiredCount) {
    findings.push(finding(
      "SIGNATURE-QUORUM-NOT-MET",
      `${scope} requires ${requiredCount} distinct trusted signature(s); ${verifiedKeyIds.size} were verified.`,
      "Obtain additional signatures from distinct trusted keys.",
    ));
  }

  return patientEducationSignatureVerificationResultSchema.parse({
    schemaVersion: "1.0.0",
    payloadSha256,
    scope,
    organizationKey,
    environment,
    evaluatedAt,
    decision: findings.length === 0 ? "trusted" : "blocked",
    verifiedSignatureIds: [...verifiedSignatureIds].sort(),
    verifiedKeyIds: [...verifiedKeyIds].sort(),
    findings,
  });
};

export const assertPatientEducationSignaturesTrusted = (input: Parameters<typeof evaluatePatientEducationSignatures>[0]) => {
  const result = evaluatePatientEducationSignatures(input);
  if (result.decision !== "trusted") {
    throw new Error(`Patient education signature verification failed: ${result.findings.map((item) => item.code).join(", ")}`);
  }
  return result;
};
