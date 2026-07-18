import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const readJson = (relativePath) => JSON.parse(read(relativePath));
const errors = [];

const registryPath = "config/patient-education-capability-registry.json";
const nonAuthorityRegistryPath = "config/patient-education-non-authority-modules.json";
const dependencyGraphPath = "config/patient-education-capability-dependencies.json";
const crossTrancheContractsPath = "config/patient-education-cross-tranche-contracts.json";
const dependencyCheckPath = "scripts/check-patient-education-capability-dependencies.mjs";
const authorityManifestPath = "public/patient-education/demo/synthetic-authority-conformance-manifest.json";
const authorityConformanceTest = "src/test/patientEducationAuthorityConformance.test.ts";
const authorityTypecheckConfig = "tsconfig.patient-education-authority.json";
const reconstructionPlanPath = "docs/caf-patient-education-branch-reconstruction-and-merge-plan.md";

for (const requiredPath of [
  registryPath,
  nonAuthorityRegistryPath,
  dependencyGraphPath,
  crossTrancheContractsPath,
  dependencyCheckPath,
  authorityManifestPath,
  authorityConformanceTest,
  authorityTypecheckConfig,
  reconstructionPlanPath,
]) {
  if (!exists(requiredPath)) errors.push(`Missing authority foundation file: ${requiredPath}`);
}

let registry;
let nonAuthorityRegistry;
let dependencyGraph;
let crossTrancheRegistry;
let manifest;
try {
  if (exists(registryPath)) registry = readJson(registryPath);
  if (exists(nonAuthorityRegistryPath)) nonAuthorityRegistry = readJson(nonAuthorityRegistryPath);
  if (exists(dependencyGraphPath)) dependencyGraph = readJson(dependencyGraphPath);
  if (exists(crossTrancheContractsPath)) crossTrancheRegistry = readJson(crossTrancheContractsPath);
  if (exists(authorityManifestPath)) manifest = readJson(authorityManifestPath);
} catch (error) {
  errors.push(`Unable to parse authority foundation JSON: ${error.message}`);
}

const capabilities = registry?.capabilities ?? [];
const capabilityIds = capabilities.map((capability) => capability.id);
const expectedCapabilityCount = capabilities.length;
const expectedScenarioCount = expectedCapabilityCount * 2;

if (registry?.schemaVersion !== "1.0.0") errors.push("Authority capability registry schemaVersion must be 1.0.0.");
if (registry?.status !== "public_safe_architecture_registry") errors.push("Authority capability registry must preserve public-safe architecture status.");
if (registry?.capabilityCount !== expectedCapabilityCount) errors.push(`Authority registry capabilityCount ${registry?.capabilityCount} does not equal ${expectedCapabilityCount}.`);
if (registry?.scenarioCount !== expectedScenarioCount) errors.push(`Authority registry scenarioCount ${registry?.scenarioCount} does not equal ${expectedScenarioCount}.`);
if (expectedCapabilityCount !== 44) errors.push(`Authority-complete foundation must contain 44 capabilities; found ${expectedCapabilityCount}.`);
if (expectedScenarioCount !== 88) errors.push(`Authority-complete foundation must require 88 synthetic paths; found ${expectedScenarioCount}.`);
if (new Set(capabilityIds).size !== capabilityIds.length) errors.push("Authority capability IDs are not unique.");

if (dependencyGraph) {
  if (dependencyGraph.schemaVersion !== "1.0.0") errors.push("Authority dependency graph schemaVersion must be 1.0.0.");
  if (dependencyGraph.status !== "public_safe_architecture_graph") errors.push("Authority dependency graph must preserve public-safe status.");
  if (!Array.isArray(dependencyGraph.tranches) || dependencyGraph.tranches.length !== 6) errors.push("Authority dependency graph must define six reconstruction tranches.");
  if (Object.keys(dependencyGraph.dependencies ?? {}).length !== expectedCapabilityCount) errors.push(`Authority dependency graph must contain ${expectedCapabilityCount} dependency entries.`);
  if (dependencyGraph.requiredTerminalCapabilityId !== "conformance-package") errors.push("Authority dependency graph terminal capability must be conformance-package.");
  if (dependencyGraph.requiredDispatchCapabilityId !== "institutional-authority-decision") errors.push("Authority dependency graph dispatch capability must be institutional-authority-decision.");
}

if (crossTrancheRegistry) {
  if (crossTrancheRegistry.schemaVersion !== "1.0.0") errors.push("Cross-tranche contract registry schemaVersion must be 1.0.0.");
  if (crossTrancheRegistry.status !== "public_safe_cross_tranche_contract_registry") errors.push("Cross-tranche contract registry must preserve public-safe status.");
  if (!Array.isArray(crossTrancheRegistry.contracts) || crossTrancheRegistry.contracts.length === 0) errors.push("Cross-tranche contract registry must contain explicit contract seams.");
  for (const contract of crossTrancheRegistry.contracts ?? []) {
    if (contract.runtimeImportProhibitedBeforeCompletion !== true) errors.push(`Cross-tranche contract ${contract.contractId} must prohibit runtime imports before completion.`);
    if (contract.authorizationUseProhibitedBeforeCompletion !== true) errors.push(`Cross-tranche contract ${contract.contractId} must prohibit authorization use before completion.`);
  }
}

const requiredCriticalCapabilities = [
  "authority-policy",
  "authority-contract",
  "organization-isolation",
  "tenant-isolation",
  "signing-authority",
  "review-workflow",
  "governance-profile",
  "private-authority-decision",
  "organization-lifecycle",
  "job-orchestration",
  "institutional-authority-decision",
  "continuity-contract",
  "incident-response",
  "resilience-retention",
  "privacy-boundary",
  "distribution-control",
];
for (const capabilityId of requiredCriticalCapabilities) {
  const capability = capabilities.find((candidate) => candidate.id === capabilityId);
  if (!capability) errors.push(`Authority registry missing critical capability: ${capabilityId}`);
  else {
    if (capability.status !== "authoritative") errors.push(`Critical capability ${capabilityId} is not authoritative.`);
    if (capability.releaseCritical !== true) errors.push(`Critical capability ${capabilityId} must be releaseCritical.`);
    if (!Array.isArray(capability.safetyMarkers) || capability.safetyMarkers.length === 0) errors.push(`Critical capability ${capabilityId} requires stable safety markers.`);
  }
}

if (nonAuthorityRegistry?.status !== "public_safe_non_authority_registry") errors.push("Non-authority registry must preserve public-safe status.");
for (const module of nonAuthorityRegistry?.modules ?? []) {
  if (module.patientCareUseProhibited !== true || module.authorityDecisionUseProhibited !== true || module.privateDataUseProhibited !== true) {
    errors.push(`Non-authority module ${module.path} does not enforce all prohibited-use flags.`);
  }
}

if (manifest) {
  if (manifest.schemaVersion !== "2.1.0") errors.push("Authority conformance manifest schemaVersion must be 2.1.0.");
  if (manifest.status !== "public_safe_technical_proof") errors.push("Authority conformance manifest must preserve public-safe technical-proof status.");
  if (manifest.capabilityCount !== expectedCapabilityCount || manifest.scenarioCount !== expectedScenarioCount) errors.push(`Authority conformance manifest must declare ${expectedCapabilityCount} capabilities and ${expectedScenarioCount} scenarios.`);
  if (!Array.isArray(manifest.capabilities) || new Set(manifest.capabilities).size !== manifest.capabilities.length) errors.push("Authority conformance manifest capabilities must be a unique array.");
  const missing = capabilityIds.filter((id) => !manifest.capabilities?.includes(id));
  const unexpected = (manifest.capabilities ?? []).filter((id) => !capabilityIds.includes(id));
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
    "authenticatedSessionScopeRequired",
    "tenantResourceGuardRequired",
    "verifiedContinuityRecoveryRequired",
    "canonicalCapabilityRegistryRequired",
  ]) {
    if (requirements[requirement] !== true) errors.push(`Authority conformance manifest must require ${requirement}.`);
  }
}

if (exists(authorityConformanceTest)) {
  const source = read(authorityConformanceTest);
  for (const marker of [
    "requires all 44 governed capabilities",
    "toBe(44)",
    "toBe(88)",
    "authority-contract",
    "tenant-isolation",
    "continuity-contract",
    "organization-lifecycle",
    "job-orchestration",
    "institutional-authority-decision",
  ]) {
    if (!source.includes(marker)) errors.push(`Authority conformance test missing marker: ${marker}`);
  }
}

if (exists(reconstructionPlanPath)) {
  const reconstructionPlan = read(reconstructionPlanPath);
  for (const marker of [
    "Tranche A",
    "Tranche F",
    "No force merge",
    "PR #190 remains draft and unmerged",
    "Final integrated certification",
  ]) {
    if (!reconstructionPlan.includes(marker)) errors.push(`Branch reconstruction plan missing required control marker: ${marker}`);
  }
}

for (const architectureFile of registry?.architectureDocuments ?? []) {
  if (!exists(architectureFile)) errors.push(`Missing required architecture document: ${architectureFile}`);
}
for (const proofArtifact of registry?.publicProofArtifacts ?? []) {
  if (!exists(proofArtifact)) errors.push(`Missing required public-safe proof artifact: ${proofArtifact}`);
}

for (const workflowPath of [
  ".github/workflows/patient-education-authority.yml",
  ".github/workflows/patient-education-authority-typecheck.yml",
]) {
  if (!exists(workflowPath)) errors.push(`Missing authority validation workflow: ${workflowPath}`);
}

const serializedPublicAuthority = JSON.stringify({ registry, nonAuthorityRegistry, dependencyGraph, crossTrancheRegistry, manifest });
const populatedSensitivePatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /"(?:patientName|medicalRecordNumber|dateOfBirth|reviewerEmail|realHospitalContact|bloodThinnerDosage)"\s*:\s*"[^"\s][^"]*"/i,
  /"privateKey(?:Inline|Value|Pem)?"\s*:\s*"[^"\s][^"]*"/i,
];
for (const pattern of populatedSensitivePatterns) {
  if (pattern.test(serializedPublicAuthority)) errors.push(`Authority public-safe registry contains populated sensitive material matching ${pattern}.`);
}

if (errors.length > 0) {
  console.error("Patient Education authority foundation check failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Patient Education authority foundation passed: ${expectedCapabilityCount} governed capabilities, ${expectedScenarioCount} synthetic paths, six ordered reconstruction tranches, ${(crossTrancheRegistry?.contracts ?? []).length} explicit cross-tranche contract seam(s), ${registry.architectureDocuments.length + 1} required architecture and reconstruction documents, ${registry.publicProofArtifacts.length} public-safe proof artifacts, and ${nonAuthorityRegistry.modules.length} explicitly non-authority module(s).`);
