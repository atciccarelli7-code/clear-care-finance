import { createHash } from "node:crypto";
import { z } from "zod";

const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const semverSchema = z.string().regex(/^\d+\.\d+\.\d+$/);

const canonicalize = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nested]) => [key, canonicalize(nested)]),
    );
  }
  return value;
};

const canonicalJson = (value: unknown) => JSON.stringify(canonicalize(value));
export const sha256PatientEducationValue = (value: unknown) => createHash("sha256").update(canonicalJson(value), "utf8").digest("hex");

export const patientEducationReproducibilitySourceObjectSchema = z.object({
  objectType: z.enum([
    "package",
    "document",
    "evidence_dossier",
    "quality_report",
    "localization",
    "institution_overlay",
    "authority_policy",
    "release_record",
  ]),
  objectId: z.string().trim().min(3).max(300),
  version: z.string().trim().min(1).max(100).optional(),
  sha256: sha256Schema,
  classification: z.enum(["public", "caf_internal", "caf_confidential", "organization_confidential", "restricted_clinical_source"]),
});

const patientEducationReproducibilityManifestBaseSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  manifestId: z.string().regex(/^CAF-PE-REPRO-[A-Z0-9-]+$/),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  packageVersion: semverSchema,
  generatedAt: z.string().datetime(),
  sourceRepository: z.string().trim().min(3).max(500),
  sourceCommitSha: z.string().regex(/^[a-f0-9]{40}$/),
  sourceBranchOrTag: z.string().trim().min(1).max(300),
  cleanSourceTreeRequired: z.literal(true),
  buildEnvironment: z.enum(["test", "preview", "production"]),
  runtime: z.object({
    nodeVersion: z.string().trim().min(2).max(100),
    operatingSystem: z.string().trim().min(2).max(200),
    architecture: z.string().trim().min(2).max(100),
  }),
  dependencyLock: z.object({
    path: z.string().trim().min(1).max(500),
    sha256: sha256Schema,
    packageManager: z.string().trim().min(2).max(100),
    packageManagerVersion: z.string().trim().min(1).max(100),
  }),
  compiler: z.object({
    name: z.string().trim().min(2).max(200),
    version: semverSchema,
    codeSha256: sha256Schema,
  }),
  schemaVersions: z.record(z.string().trim().min(1).max(100), z.string().trim().min(1).max(100)),
  sourceObjects: z.array(patientEducationReproducibilitySourceObjectSchema).min(1),
  buildCommands: z.array(z.string().trim().min(1).max(1000)).min(1),
  environmentVariableNames: z.array(z.string().regex(/^[A-Z][A-Z0-9_]*$/)),
  prohibitedInlineSecrets: z.literal(true),
  outputIntegrityManifestId: z.string().regex(/^CAF-PE-INTEGRITY-[A-Z0-9-]+$/),
  outputBundleSha256: sha256Schema,
});

const validatePatientEducationReproducibilityManifest = (
  value: z.infer<typeof patientEducationReproducibilityManifestBaseSchema>,
  context: z.RefinementCtx,
) => {
  const objectKeys = value.sourceObjects.map((object) => `${object.objectType}:${object.objectId}:${object.version ?? ""}`);
  if (new Set(objectKeys).size !== objectKeys.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Reproducibility source objects must be unique by type, ID, and version." });
  }
  if (new Set(value.buildCommands).size !== value.buildCommands.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Reproducibility build commands must be unique and ordered." });
  }
  if (new Set(value.environmentVariableNames).size !== value.environmentVariableNames.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Environment-variable names must be unique." });
  }
};

export const patientEducationReproducibilityManifestUnsignedSchema =
  patientEducationReproducibilityManifestBaseSchema.superRefine(validatePatientEducationReproducibilityManifest);

export const patientEducationReproducibilityManifestSchema =
  patientEducationReproducibilityManifestBaseSchema
    .extend({ manifestSha256: sha256Schema })
    .superRefine(validatePatientEducationReproducibilityManifest);

export type PatientEducationReproducibilityManifestUnsigned = z.infer<typeof patientEducationReproducibilityManifestUnsignedSchema>;
export type PatientEducationReproducibilityManifest = z.infer<typeof patientEducationReproducibilityManifestSchema>;

export const buildPatientEducationReproducibilityManifest = (
  input: unknown,
): PatientEducationReproducibilityManifest => {
  const value = patientEducationReproducibilityManifestUnsignedSchema.parse(input);
  const normalized = {
    ...value,
    sourceObjects: [...value.sourceObjects].sort((left, right) =>
      `${left.objectType}:${left.objectId}:${left.version ?? ""}`.localeCompare(`${right.objectType}:${right.objectId}:${right.version ?? ""}`),
    ),
    schemaVersions: Object.fromEntries(Object.entries(value.schemaVersions).sort(([left], [right]) => left.localeCompare(right))),
    environmentVariableNames: [...value.environmentVariableNames].sort(),
  };
  return patientEducationReproducibilityManifestSchema.parse({
    ...normalized,
    manifestSha256: sha256PatientEducationValue(normalized),
  });
};

export const verifyPatientEducationReproducibilityManifest = (
  input: unknown,
): { valid: boolean; expectedSha256?: string; errors: string[] } => {
  const parsed = patientEducationReproducibilityManifestSchema.safeParse(input);
  if (!parsed.success) return { valid: false, errors: parsed.error.issues.map((issue) => issue.message) };
  const { manifestSha256, ...unsigned } = parsed.data;
  const rebuilt = buildPatientEducationReproducibilityManifest(unsigned);
  const errors: string[] = [];
  if (manifestSha256 !== rebuilt.manifestSha256) errors.push("Reproducibility manifest SHA-256 does not match its canonical contents.");
  if (canonicalJson(parsed.data.sourceObjects) !== canonicalJson(rebuilt.sourceObjects)) errors.push("Source objects are not in canonical order.");
  if (canonicalJson(parsed.data.schemaVersions) !== canonicalJson(rebuilt.schemaVersions)) errors.push("Schema versions are not in canonical order.");
  if (canonicalJson(parsed.data.environmentVariableNames) !== canonicalJson(rebuilt.environmentVariableNames)) errors.push("Environment-variable names are not in canonical order.");
  return { valid: errors.length === 0, expectedSha256: rebuilt.manifestSha256, errors };
};

export const assertPatientEducationReproducible = (input: unknown) => {
  const result = verifyPatientEducationReproducibilityManifest(input);
  if (!result.valid) throw new Error(`Patient education reproducibility verification failed: ${result.errors.join("; ")}`);
  return result;
};
