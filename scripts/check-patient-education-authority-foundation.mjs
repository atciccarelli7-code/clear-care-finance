import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const errors = [];

const legacyFoundationPath = "scripts/check-patient-education-foundation.mjs";
if (!exists(legacyFoundationPath)) {
  errors.push(`Missing legacy governed foundation gate: ${legacyFoundationPath}`);
}

const legacyIds = exists(legacyFoundationPath)
  ? [...read(legacyFoundationPath).matchAll(/\bid:\s*"([a-z0-9-]+)"/g)].map((match) => match[1])
  : [];
if (new Set(legacyIds).size !== legacyIds.length) errors.push("Legacy foundation capability IDs are not unique.");
if (legacyIds.length !== 38) errors.push(`Legacy governed foundation must contain 38 capabilities; found ${legacyIds.length}.`);

const authorityCapabilities = [
  {
    id: "organization-lifecycle",
    implementation: "src/lib/patientEducationOrganizationLifecycle.ts",
    test: "src/test/patientEducationOrganizationLifecycle.test.ts",
    exports: ["evaluatePatientEducationOrganizationReadiness", "patientEducationOrganizationOffboardingSchema"],
    safetyPhrases: ["pilot-only entitlement", "offboarding action"],
  },
  {
    id: "job-orchestration",
    implementation: "src/lib/patientEducationJobOrchestration.ts",
    test: "src/test/patientEducationJobOrchestration.test.ts",
    exports: ["buildPatientEducationJobCommand", "evaluatePatientEducationJobState", "reconcilePatientEducationDuplicateCommands"],
    safetyPhrases: ["exactly one logical result", "conflicting replay", "patient-level data"],
  },
  {
    id: "institutional-authority-decision",
    implementation: "src/lib/patientEducationInstitutionalAuthorityDecision.ts",
    test: "src/test/patientEducationInstitutionalAuthorityDecision.test.ts",
    exports: ["evaluatePatientEducationInstitutionalAuthority"],
    safetyPhrases: ["withholds dispatch authorization", "active suspension, recall, or retirement notices", "compiler baseline is not conformant"],
  },
];

for (const capability of authorityCapabilities) {
  if (!exists(capability.implementation)) {
    errors.push(`[${capability.id}] Missing implementation: ${capability.implementation}`);
    continue;
  }
  const source = read(capability.implementation);
  for (const exportName of capability.exports) {
    if (!source.includes(exportName)) errors.push(`[${capability.id}] Missing export marker ${exportName}.`);
  }
  if (!exists(capability.test)) {
    errors.push(`[${capability.id}] Missing adversarial test: ${capability.test}`);
  } else {
    const testSource = read(capability.test).toLowerCase();
    for (const phrase of capability.safetyPhrases) {
      if (!testSource.includes(phrase.toLowerCase())) errors.push(`[${capability.id}] Test no longer contains safety marker: ${phrase}`);
    }
  }
}

const combinedIds = [...legacyIds, ...authorityCapabilities.map((capability) => capability.id)];
if (new Set(combinedIds).size !== combinedIds.length) errors.push("Authority-complete capability IDs are not unique.");
if (combinedIds.length !== 41) errors.push(`Authority-complete foundation must contain 41 capabilities; found ${combinedIds.length}.`);

const authorityConformanceTest = "src/test/patientEducationAuthorityConformance.test.ts";
if (!exists(authorityConformanceTest)) errors.push(`Missing authority conformance test: ${authorityConformanceTest}`);
else {
  const source = read(authorityConformanceTest);
  for (const phrase of [
    "requires all 41 governed capabilities",
    "scenarioCount).toBe(82)",
    "organization-lifecycle",
    "job-orchestration",
    "institutional-authority-decision",
  ]) {
    if (!source.includes(phrase)) errors.push(`Authority conformance test missing marker: ${phrase}`);
  }
}

const publicManifestPath = "public/patient-education/demo/synthetic-authority-conformance-manifest.json";
if (!exists(publicManifestPath)) errors.push(`Missing public-safe authority conformance manifest: ${publicManifestPath}`);
else {
  try {
    const manifest = JSON.parse(read(publicManifestPath));
    if (manifest.schemaVersion !== "2.0.0") errors.push("Authority conformance manifest schemaVersion must be 2.0.0.");
    if (manifest.status !== "public_safe_technical_proof") errors.push("Authority conformance manifest must preserve public-safe technical-proof status.");
    if (manifest.capabilityCount !== 41 || manifest.scenarioCount !== 82) errors.push("Authority conformance manifest must declare 41 capabilities and 82 scenarios.");
    if (!Array.isArray(manifest.capabilities) || new Set(manifest.capabilities).size !== manifest.capabilities.length) errors.push("Authority conformance manifest capabilities must be a unique array.");
    const missing = combinedIds.filter((id) => !manifest.capabilities?.includes(id));
    const unexpected = (manifest.capabilities ?? []).filter((id) => !combinedIds.includes(id));
    if (missing.length > 0) errors.push(`Authority conformance manifest missing capability IDs: ${missing.join(", ")}.`);
    if (unexpected.length > 0) errors.push(`Authority conformance manifest contains unexpected capability IDs: ${unexpected.join(", ")}.`);
    for (const [field, expected] of [
      ["suitableForPatientCare", false],
      ["containsClinicalPatientInstructions", false],
      ["containsPatientData", false],
      ["containsRealOrganizationData", false],
      ["containsReviewerIdentity", false],
    ]) {
      if (manifest[field] !== expected) errors.push(`Authority conformance manifest ${field} must be ${expected}.`);
    }
    const requirements = manifest.executionRequirement ?? {};
    for (const requirement of [
      "allScenariosMustPass",
      "executionEvidenceRequired",
      "exactVersionBindingRequired",
      "syntheticDataOnly",
      "organizationLifecycleRequired",
      "idempotentJobExecutionRequired",
      "finalInstitutionalAuthorityRequired",
    ]) {
      if (requirements[requirement] !== true) errors.push(`Authority conformance manifest must require ${requirement}.`);
    }
    const serialized = JSON.stringify(manifest).toLowerCase();
    for (const prohibited of ["patient name", "medical record number", "private key", "reviewer email", "real hospital contact", "blood thinner dosage"]) {
      if (serialized.includes(prohibited)) errors.push(`Authority conformance manifest contains prohibited public phrase: ${prohibited}.`);
    }
  } catch (error) {
    errors.push(`Authority conformance manifest is invalid JSON: ${error.message}`);
  }
}

for (const architectureFile of [
  "docs/caf-patient-education-public-product-architecture.md",
  "docs/caf-patient-education-governed-platform-foundation.md",
  "docs/caf-patient-education-private-authority-blueprint.md",
]) {
  if (!exists(architectureFile)) errors.push(`Missing required architecture document: ${architectureFile}`);
}

for (const implementation of [
  "src/lib/patientEducationAuthorityPolicy.ts",
  "src/lib/patientEducationOrganizationIsolation.ts",
  "src/lib/patientEducationEvidenceFreshnessEngine.ts",
  "src/lib/patientEducationExceptionPolicy.ts",
  "src/lib/patientEducationReproducibilityManifest.ts",
  "src/lib/patientEducationSigningAuthority.ts",
  "src/lib/patientEducationSchemaMigration.ts",
  "src/lib/patientEducationDependencyGraph.ts",
  "src/lib/patientEducationOperationalObservability.ts",
  "src/lib/patientEducationIncidentResponse.ts",
  "src/lib/patientEducationResiliencePolicy.ts",
  "src/lib/patientEducationAuditExport.ts",
  "src/lib/patientEducationReviewWorkflow.ts",
  "src/lib/patientEducationGovernanceProfile.ts",
  "src/lib/patientEducationPrivateAuthorityDecision.ts",
  "src/lib/patientEducationConformancePackage.ts",
]) {
  if (!exists(implementation)) errors.push(`Missing private-authority foundation implementation: ${implementation}`);
}

if (errors.length > 0) {
  console.error("Patient Education authority foundation check failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Patient Education authority foundation passed: ${combinedIds.length} governed capabilities, 82 synthetic paths, 3 architecture documents, and a public-safe authority conformance index.`);
