import {
  patientEducationContentDocumentSchema,
  type PatientEducationContentDocument,
  type PatientEducationContentTarget,
} from "@/lib/patientEducationContentContract";
import {
  compilePatientEducationAsset,
  type CompiledPatientEducationAsset,
  type PatientEducationCompileMode,
} from "@/lib/patientEducationAssetCompiler";
import {
  buildPatientEducationDistributionManifest,
  type PatientEducationDistributionManifest,
} from "@/lib/patientEducationDistribution";
import {
  patientEducationPackageSchema,
  type PatientEducationPackage,
} from "@/lib/patientEducationPackageContract";

export type PatientEducationBundleArtifact = CompiledPatientEducationAsset & {
  path: string;
};

export type PatientEducationReleaseBundle = {
  schemaVersion: "1.0.0";
  bundleId: string;
  generatedAt: string;
  mode: PatientEducationCompileMode;
  packageId: string;
  packageVersion: string;
  manifest: PatientEducationDistributionManifest;
  artifacts: PatientEducationBundleArtifact[];
  assetIndex: Array<{
    assetId: string;
    title: string;
    version: string;
    artifactPaths: string[];
    artifactChecksums: string[];
  }>;
  withheldAssetIds: string[];
  warnings: string[];
};

const compilableTargets = new Set<PatientEducationContentTarget>([
  "responsive_html",
  "print_html",
  "structured_text",
  "avs_text",
  "patient_portal_json",
]);

const binaryOrExternallyProducedFormats = new Set([
  "print_pdf",
  "accessible_pdf",
  "video",
  "audio",
  "image",
  "csv",
]);

const slugify = (value: string) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const expectedDocumentKindByAssetType: Partial<Record<PatientEducationPackage["assets"][number]["type"], PatientEducationContentDocument["documentKind"]>> = {
  full_guide: "full_guide",
  quick_start: "quick_start",
  avs_summary: "avs_summary",
  caregiver_guide: "caregiver_guide",
  teach_back: "teach_back",
  clinician_reference: "clinician_reference",
  implementation_workflow: "implementation_workflow",
  feedback_tool: "feedback_tool",
};

const assertDocumentMatchesAsset = (
  packageValue: PatientEducationPackage,
  asset: PatientEducationPackage["assets"][number],
  document: PatientEducationContentDocument,
) => {
  if (document.packageId !== packageValue.packageId) {
    throw new Error(`Document ${document.documentId} belongs to ${document.packageId}, not ${packageValue.packageId}.`);
  }
  if (document.assetId !== asset.assetId) {
    throw new Error(`Document ${document.documentId} does not match asset ${asset.assetId}.`);
  }
  if (document.assetVersion !== asset.version) {
    throw new Error(`Document ${document.documentId} version ${document.assetVersion} does not match asset version ${asset.version}.`);
  }
  if (document.sourceDossierId !== asset.sourceDossierId) {
    throw new Error(`Document ${document.documentId} source dossier does not match asset ${asset.assetId}.`);
  }
  const expectedKind = expectedDocumentKindByAssetType[asset.type];
  if (expectedKind && document.documentKind !== expectedKind) {
    throw new Error(`Document ${document.documentId} kind ${document.documentKind} does not match asset type ${asset.type}.`);
  }
};

const targetFileName = (
  packageValue: PatientEducationPackage,
  asset: PatientEducationPackage["assets"][number],
  compiled: CompiledPatientEducationAsset,
) => `${slugify(packageValue.shortTitle)}/${asset.assetId.toLowerCase()}/v${asset.version}/${slugify(asset.title)}.${compiled.fileExtension}`;

export const compilePatientEducationReleaseBundle = ({
  packageValue: rawPackage,
  documents: rawDocuments,
  mode,
  generatedAt = new Date().toISOString(),
}: {
  packageValue: unknown;
  documents: unknown[];
  mode: PatientEducationCompileMode;
  generatedAt?: string;
}): PatientEducationReleaseBundle => {
  const packageValue = patientEducationPackageSchema.parse(rawPackage);
  const documents = rawDocuments.map((document) => patientEducationContentDocumentSchema.parse(document));
  const manifest = buildPatientEducationDistributionManifest(packageValue, mode, generatedAt);

  const documentsByAssetId = new Map<string, PatientEducationContentDocument>();
  for (const document of documents) {
    if (documentsByAssetId.has(document.assetId)) {
      throw new Error(`Multiple content documents were supplied for asset ${document.assetId}.`);
    }
    documentsByAssetId.set(document.assetId, document);
  }

  const distributionAssetIds = new Set(manifest.assets.map((asset) => asset.assetId));
  const withheldAssetIds = packageValue.assets
    .filter((asset) => !distributionAssetIds.has(asset.assetId))
    .map((asset) => asset.assetId);
  const warnings: string[] = [];
  const artifacts: PatientEducationBundleArtifact[] = [];

  for (const manifestAsset of manifest.assets) {
    const asset = packageValue.assets.find((candidate) => candidate.assetId === manifestAsset.assetId);
    if (!asset) throw new Error(`Distribution manifest references unknown asset ${manifestAsset.assetId}.`);

    const supportedCompilableTargets = asset.formats.filter((format): format is PatientEducationContentTarget => compilableTargets.has(format as PatientEducationContentTarget));
    const document = documentsByAssetId.get(asset.assetId);

    if (!document) {
      const onlyExternalFormats = asset.formats.every((format) => binaryOrExternallyProducedFormats.has(format));
      if (onlyExternalFormats) {
        warnings.push(`Asset ${asset.assetId} requires an external production pipeline for formats: ${asset.formats.join(", ")}.`);
        continue;
      }
      throw new Error(`Missing structured content document for distributable asset ${asset.assetId}.`);
    }

    assertDocumentMatchesAsset(packageValue, asset, document);
    const targets = document.supportedTargets.filter((target) => supportedCompilableTargets.includes(target));
    if (targets.length === 0) {
      throw new Error(`Asset ${asset.assetId} and document ${document.documentId} have no shared compilable target.`);
    }

    for (const target of targets) {
      const compiled = compilePatientEducationAsset(document, target, mode);
      artifacts.push({
        ...compiled,
        path: targetFileName(packageValue, asset, compiled),
      });
      warnings.push(...compiled.warnings.map((warning) => `${asset.assetId}: ${warning}`));
    }
  }

  const distributedDocumentIds = new Set(artifacts.map((artifact) => artifact.documentId));
  for (const document of documents) {
    if (!distributionAssetIds.has(document.assetId)) continue;
    if (!distributedDocumentIds.has(document.documentId)) {
      warnings.push(`Document ${document.documentId} did not produce an artifact for this bundle mode.`);
    }
  }

  const assetIndex = manifest.assets.map((asset) => {
    const assetArtifacts = artifacts.filter((artifact) => artifact.assetId === asset.assetId);
    return {
      assetId: asset.assetId,
      title: asset.title,
      version: asset.version,
      artifactPaths: assetArtifacts.map((artifact) => artifact.path),
      artifactChecksums: assetArtifacts.map((artifact) => artifact.checksum),
    };
  });

  return {
    schemaVersion: "1.0.0",
    bundleId: `${packageValue.packageId}-v${packageValue.version}-${mode}`,
    generatedAt,
    mode,
    packageId: packageValue.packageId,
    packageVersion: packageValue.version,
    manifest,
    artifacts,
    assetIndex,
    withheldAssetIds,
    warnings: [...new Set(warnings)],
  };
};
