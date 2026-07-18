import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();

const capabilities = [
  {
    id: "content-contract",
    implementation: "src/lib/patientEducationContentContract.ts",
    tests: ["src/test/patientEducationContentContract.test.ts"],
    requiredExports: ["patientEducationContentDocumentSchema", "patientEducationContentBlockSchema"],
  },
  {
    id: "package-contract",
    implementation: "src/lib/patientEducationPackageContract.ts",
    tests: ["src/test/patientEducationPackageContract.test.ts"],
    requiredExports: ["patientEducationPackageSchema"],
  },
  {
    id: "evidence-governance",
    implementation: "src/lib/patientEducationEvidenceContract.ts",
    tests: ["src/test/patientEducationEvidenceContract.test.ts"],
    requiredExports: ["patientEducationEvidenceDossierSchema"],
  },
  {
    id: "asset-compiler",
    implementation: "src/lib/patientEducationAssetCompiler.ts",
    tests: ["src/test/patientEducationAssetCompiler.test.ts"],
    requiredExports: ["compilePatientEducationAsset"],
  },
  {
    id: "bundle-compiler",
    implementation: "src/lib/patientEducationBundleCompiler.ts",
    tests: ["src/test/patientEducationBundleCompiler.test.ts"],
    requiredExports: ["compilePatientEducationReleaseBundle"],
  },
  {
    id: "distribution-compiler",
    implementation: "src/lib/patientEducationDistribution.ts",
    tests: ["src/test/patientEducationDistribution.test.ts"],
    requiredExports: ["buildPatientEducationDistributionManifest"],
  },
  {
    id: "localization-contract",
    implementation: "src/lib/patientEducationLocalizationContract.ts",
    tests: ["src/test/patientEducationLocalizationContract.test.ts"],
    requiredExports: ["patientEducationLocalizationPackageSchema", "applyPatientEducationLocalization"],
  },
  {
    id: "institution-overlay-contract",
    implementation: "src/lib/patientEducationInstitutionOverlay.ts",
    tests: ["src/test/patientEducationInstitutionOverlay.test.ts"],
    requiredExports: ["patientEducationInstitutionOverlaySchema"],
  },
  {
    id: "institution-overlay-compiler",
    implementation: "src/lib/patientEducationInstitutionOverlayCompiler.ts",
    tests: ["src/test/patientEducationInstitutionOverlayCompiler.test.ts"],
    requiredExports: ["applyPatientEducationInstitutionOverlay"],
  },
  {
    id: "quality-contract",
    implementation: "src/lib/patientEducationQualityContract.ts",
    tests: ["src/test/patientEducationQualityContract.test.ts"],
    requiredExports: ["patientEducationQualityReportSchema"],
  },
  {
    id: "quality-engine",
    implementation: "src/lib/patientEducationQualityEngine.ts",
    tests: ["src/test/patientEducationQualityEngine.test.ts"],
    requiredExports: ["analyzePatientEducationQuality", "extractPatientEducationPlainText"],
  },
  {
    id: "release-registry",
    implementation: "src/lib/patientEducationReleaseRegistry.ts",
    tests: ["src/test/patientEducationReleaseRegistry.test.ts"],
    requiredExports: ["patientEducationReleaseRecordSchema"],
  },
  {
    id: "release-state-machine",
    implementation: "src/lib/patientEducationReleaseStateMachine.ts",
    tests: ["src/test/patientEducationReleaseStateMachine.test.ts"],
    requiredExports: ["transitionPatientEducationReleaseRecord"],
  },
  {
    id: "release-authorization",
    implementation: "src/lib/patientEducationReleaseAuthorization.ts",
    tests: ["src/test/patientEducationReleaseAuthorization.test.ts"],
    requiredExports: ["authorizePatientEducationRelease"],
  },
  {
    id: "integrity-manifest",
    implementation: "src/lib/patientEducationIntegrityManifest.ts",
    tests: ["src/test/patientEducationIntegrityManifest.test.ts"],
    requiredExports: ["buildPatientEducationIntegrityManifest", "verifyPatientEducationIntegrityManifest"],
  },
  {
    id: "governance-ledger",
    implementation: "src/lib/patientEducationGovernanceLedger.ts",
    tests: ["src/test/patientEducationGovernanceLedger.test.ts"],
    requiredExports: ["appendPatientEducationGovernanceEvent", "verifyPatientEducationGovernanceLedger"],
  },
  {
    id: "change-risk",
    implementation: "src/lib/patientEducationChangeRisk.ts",
    tests: ["src/test/patientEducationChangeRisk.test.ts"],
    requiredExports: ["classifyPatientEducationChangeRisk"],
  },
  {
    id: "privacy-boundary",
    implementation: "src/lib/patientEducationPrivacyBoundary.ts",
    tests: ["src/test/patientEducationPrivacyBoundary.test.ts"],
    requiredExports: ["scanPatientEducationDocumentPrivacy", "scanPatientEducationOverlayPrivacy"],
  },
  {
    id: "governed-delivery-pipeline",
    implementation: "src/lib/patientEducationGovernedDeliveryPipeline.ts",
    tests: ["src/test/patientEducationGovernedDeliveryPipeline.test.ts"],
    requiredExports: ["preparePatientEducationReleaseCandidate", "authorizePreparedPatientEducationCandidate"],
  },
  {
    id: "delivery-adapters",
    implementation: "src/lib/patientEducationDeliveryAdapterContract.ts",
    tests: ["src/test/patientEducationDeliveryAdapterContract.test.ts"],
    requiredExports: ["createPatientEducationDeliveryEnvelope", "patientEducationDeliveryReceiptSchema"],
  },
  {
    id: "distribution-control",
    implementation: "src/lib/patientEducationDistributionControl.ts",
    tests: ["src/test/patientEducationDistributionControl.test.ts"],
    requiredExports: ["buildPatientEducationDistributionControlNotice", "revokePatientEducationDistributions"],
  },
  {
    id: "pilot-analytics",
    implementation: "src/lib/patientEducationPilotAnalyticsContract.ts",
    tests: ["src/test/patientEducationPilotAnalyticsContract.test.ts"],
    requiredExports: ["patientEducationPilotAnalyticsBatchSchema", "calculatePatientEducationPilotRates"],
  },
];

const publicProofFiles = [
  "public/patient-education/capability-manifest.json",
  "public/patient-education/schemas/public-package-descriptor-v1.schema.json",
  "public/patient-education/schemas/controlled-preview-bundle-v1.schema.json",
  "public/patient-education/demo/controlled-preview-bundle.json",
];

const architectureDocuments = [
  "docs/caf-patient-education-public-product-architecture.md",
  "docs/caf-patient-education-governed-platform-foundation.md",
];

const requiredSafetyTests = [
  ["src/test/patientEducationPrivacyBoundary.test.ts", ["patient identifiers", "PHI-capable"]],
  ["src/test/patientEducationGovernedDeliveryPipeline.test.ts", ["tampered", "no distributable bundle"]],
  ["src/test/patientEducationDistributionControl.test.ts", ["recall", "revokes"]],
  ["src/test/patientEducationReleaseStateMachine.test.ts", ["jumping directly", "re-enter circulation"]],
  ["src/test/patientEducationLocalizationContract.test.ts", ["machine-only"]],
];

const errors = [];
const warnings = [];

const absolute = (relativePath) => path.join(root, relativePath);
const exists = (relativePath) => fs.existsSync(absolute(relativePath));
const read = (relativePath) => fs.readFileSync(absolute(relativePath), "utf8");

for (const capability of capabilities) {
  if (!exists(capability.implementation)) {
    errors.push(`[${capability.id}] Missing implementation: ${capability.implementation}`);
    continue;
  }
  const source = read(capability.implementation);
  for (const exportName of capability.requiredExports) {
    if (!source.includes(exportName)) {
      errors.push(`[${capability.id}] Missing required export marker ${exportName} in ${capability.implementation}`);
    }
  }
  for (const testFile of capability.tests) {
    if (!exists(testFile)) errors.push(`[${capability.id}] Missing adversarial test: ${testFile}`);
  }
}

for (const proofFile of publicProofFiles) {
  if (!exists(proofFile)) errors.push(`Missing public-safe technical proof: ${proofFile}`);
}

for (const documentFile of architectureDocuments) {
  if (!exists(documentFile)) errors.push(`Missing patient education architecture document: ${documentFile}`);
}

for (const [testFile, phrases] of requiredSafetyTests) {
  if (!exists(testFile)) continue;
  const source = read(testFile).toLowerCase();
  for (const phrase of phrases) {
    if (!source.includes(phrase.toLowerCase())) {
      errors.push(`Safety test ${testFile} no longer contains expected scenario marker: ${phrase}`);
    }
  }
}

const publicRoot = absolute("public/patient-education");
if (fs.existsSync(publicRoot)) {
  const publicFiles = [];
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      else publicFiles.push(fullPath);
    }
  };
  walk(publicRoot);
  for (const file of publicFiles) {
    const relativePath = path.relative(root, file).replaceAll(path.sep, "/");
    const lowerPath = relativePath.toLowerCase();
    if (/evidence-dossier|reviewer|signature|hospital-overlay|client-deliverable|blood-thinner-guide/.test(lowerPath)) {
      errors.push(`Restricted patient education material appears in the public proof tree: ${relativePath}`);
    }
  }
}

const testCount = new Set(capabilities.flatMap((capability) => capability.tests)).size;
if (testCount < capabilities.length - 2) {
  warnings.push(`Foundation has ${capabilities.length} capabilities but only ${testCount} unique capability test files.`);
}

if (warnings.length > 0) {
  console.warn("Patient Education foundation warnings:");
  warnings.forEach((warning) => console.warn(`- ${warning}`));
}

if (errors.length > 0) {
  console.error("Patient Education foundation check failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Patient Education foundation check passed: ${capabilities.length} governed capabilities, ${testCount} capability test files, ${publicProofFiles.length} public-safe proof artifacts, and ${architectureDocuments.length} architecture documents.`);
