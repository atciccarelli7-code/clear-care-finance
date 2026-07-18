import { z } from "zod";
import type { PatientEducationReleaseBundle } from "@/lib/patientEducationBundleCompiler";

const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);

export const patientEducationIntegrityArtifactSchema = z.object({
  path: z.string().trim().min(1),
  assetId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  documentId: z.string().regex(/^CAF-PE-DOC-[A-Z0-9-]+$/),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  target: z.enum(["responsive_html", "print_html", "structured_text", "avs_text", "patient_portal_json"]),
  mimeType: z.string().trim().min(1),
  byteLength: z.number().int().nonnegative(),
  sha256: sha256Schema,
});

export const patientEducationIntegrityManifestSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  manifestId: z.string().regex(/^CAF-PE-INTEGRITY-[A-Z0-9-]+$/),
  bundleId: z.string().trim().min(1),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  packageVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  mode: z.enum(["controlled_preview", "institutional_delivery", "internal_governance"]),
  generatedAt: z.string().datetime(),
  artifactCount: z.number().int().nonnegative(),
  artifacts: z.array(patientEducationIntegrityArtifactSchema),
  canonicalBundleSha256: sha256Schema,
}).superRefine((value, context) => {
  if (value.artifactCount !== value.artifacts.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Integrity artifactCount must equal the artifacts array length." });
  }
  const paths = value.artifacts.map((artifact) => artifact.path);
  if (new Set(paths).size !== paths.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Integrity manifest artifact paths must be unique." });
  }
  const sortedPaths = [...paths].sort((a, b) => a.localeCompare(b));
  if (JSON.stringify(paths) !== JSON.stringify(sortedPaths)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Integrity manifest artifacts must be sorted by path." });
  }
});

export type PatientEducationIntegrityManifest = z.infer<typeof patientEducationIntegrityManifestSchema>;

const encode = (value: string) => new TextEncoder().encode(value);

export const sha256Hex = async (value: string) => {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", encode(value));
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const canonicalArtifactRecord = (artifact: PatientEducationIntegrityManifest["artifacts"][number]) => ({
  path: artifact.path,
  assetId: artifact.assetId,
  documentId: artifact.documentId,
  version: artifact.version,
  target: artifact.target,
  mimeType: artifact.mimeType,
  byteLength: artifact.byteLength,
  sha256: artifact.sha256,
});

export const buildPatientEducationIntegrityManifest = async (
  bundle: PatientEducationReleaseBundle,
): Promise<PatientEducationIntegrityManifest> => {
  const pathSet = new Set<string>();
  for (const artifact of bundle.artifacts) {
    if (pathSet.has(artifact.path)) throw new Error(`Duplicate patient education artifact path: ${artifact.path}.`);
    pathSet.add(artifact.path);
  }

  const artifacts = await Promise.all(bundle.artifacts.map(async (artifact) => ({
    path: artifact.path,
    assetId: artifact.assetId,
    documentId: artifact.documentId,
    version: artifact.version,
    target: artifact.target,
    mimeType: artifact.mimeType,
    byteLength: encode(artifact.content).byteLength,
    sha256: await sha256Hex(artifact.content),
  })));
  artifacts.sort((a, b) => a.path.localeCompare(b.path));

  const canonicalRecord = JSON.stringify({
    schemaVersion: "1.0.0",
    bundleId: bundle.bundleId,
    packageId: bundle.packageId,
    packageVersion: bundle.packageVersion,
    mode: bundle.mode,
    artifacts: artifacts.map(canonicalArtifactRecord),
  });

  const manifestKey = `${bundle.packageId}-${bundle.packageVersion}-${bundle.mode}`
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "-");

  return patientEducationIntegrityManifestSchema.parse({
    schemaVersion: "1.0.0",
    manifestId: `CAF-PE-INTEGRITY-${manifestKey}`,
    bundleId: bundle.bundleId,
    packageId: bundle.packageId,
    packageVersion: bundle.packageVersion,
    mode: bundle.mode,
    generatedAt: bundle.generatedAt,
    artifactCount: artifacts.length,
    artifacts,
    canonicalBundleSha256: await sha256Hex(canonicalRecord),
  });
};

export const verifyPatientEducationIntegrityManifest = async (
  bundle: PatientEducationReleaseBundle,
  manifestInput: unknown,
) => {
  const manifest = patientEducationIntegrityManifestSchema.parse(manifestInput);
  const rebuilt = await buildPatientEducationIntegrityManifest(bundle);
  const issues: string[] = [];

  if (manifest.bundleId !== rebuilt.bundleId) issues.push("bundleId mismatch");
  if (manifest.packageId !== rebuilt.packageId) issues.push("packageId mismatch");
  if (manifest.packageVersion !== rebuilt.packageVersion) issues.push("packageVersion mismatch");
  if (manifest.mode !== rebuilt.mode) issues.push("mode mismatch");
  if (manifest.canonicalBundleSha256 !== rebuilt.canonicalBundleSha256) issues.push("canonical bundle SHA-256 mismatch");

  const rebuiltByPath = new Map(rebuilt.artifacts.map((artifact) => [artifact.path, artifact]));
  for (const artifact of manifest.artifacts) {
    const current = rebuiltByPath.get(artifact.path);
    if (!current) {
      issues.push(`missing artifact: ${artifact.path}`);
      continue;
    }
    if (artifact.sha256 !== current.sha256) issues.push(`SHA-256 mismatch: ${artifact.path}`);
    if (artifact.byteLength !== current.byteLength) issues.push(`byte-length mismatch: ${artifact.path}`);
    if (artifact.documentId !== current.documentId || artifact.version !== current.version || artifact.target !== current.target) {
      issues.push(`artifact metadata mismatch: ${artifact.path}`);
    }
  }
  if (manifest.artifacts.length !== rebuilt.artifacts.length) issues.push("artifact count mismatch");

  return {
    valid: issues.length === 0,
    issues,
    rebuilt,
  };
};
