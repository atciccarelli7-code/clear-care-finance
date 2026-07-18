import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const registryPath = "config/patient-education-capability-registry.json";
const nonAuthorityRegistryPath = "config/patient-education-non-authority-modules.json";
const authorityManifestPath = "public/patient-education/demo/synthetic-authority-conformance-manifest.json";
const authorityTestPath = "src/test/patientEducationAuthorityConformance.test.ts";
const errors = [];
const warnings = [];

const absolute = (relativePath) => path.join(root, relativePath);
const exists = (relativePath) => fs.existsSync(absolute(relativePath));
const read = (relativePath) => fs.readFileSync(absolute(relativePath), "utf8");
const readJson = (relativePath) => JSON.parse(read(relativePath));

const loadRequiredJson = (relativePath, label) => {
  if (!exists(relativePath)) {
    console.error(`${label} missing: ${relativePath}`);
    process.exit(1);
  }
  try {
    return readJson(relativePath);
  } catch (error) {
    console.error(`${label} is invalid JSON: ${error.message}`);
    process.exit(1);
  }
};

const registry = loadRequiredJson(registryPath, "Patient Education capability registry");
const nonAuthorityRegistry = loadRequiredJson(nonAuthorityRegistryPath, "Patient Education non-authority registry");

if (registry.schemaVersion !== "1.0.0") errors.push("Capability registry schemaVersion must be 1.0.0.");
if (registry.status !== "public_safe_architecture_registry") errors.push("Capability registry status must preserve the public-safe architecture boundary.");
if (!Array.isArray(registry.claimsBoundary) || registry.claimsBoundary.length < 3) errors.push("Capability registry requires an explicit claims boundary.");
if (!Array.isArray(registry.capabilities) || registry.capabilities.length === 0) errors.push("Capability registry must contain capabilities.");
if (nonAuthorityRegistry.schemaVersion !== "1.0.0") errors.push("Non-authority registry schemaVersion must be 1.0.0.");
if (nonAuthorityRegistry.status !== "public_safe_non_authority_registry") errors.push("Non-authority registry status must preserve the public-safe boundary.");
if (!Array.isArray(nonAuthorityRegistry.modules)) errors.push("Non-authority registry modules must be an array.");

const capabilities = Array.isArray(registry.capabilities) ? registry.capabilities : [];
const excludedModules = Array.isArray(nonAuthorityRegistry.modules) ? nonAuthorityRegistry.modules : [];
const ids = capabilities.map((capability) => capability.id);
const implementations = capabilities.map((capability) => capability.implementation);
const testPaths = capabilities.flatMap((capability) => capability.tests ?? []);
const excludedPaths = excludedModules.map((module) => module.path);

if (registry.capabilityCount !== capabilities.length) errors.push(`Registry capabilityCount ${registry.capabilityCount} does not equal ${capabilities.length}.`);
if (registry.scenarioCount !== capabilities.length * 2) errors.push(`Registry scenarioCount ${registry.scenarioCount} must equal two scenarios per capability (${capabilities.length * 2}).`);
if (new Set(ids).size !== ids.length) errors.push("Capability IDs must be unique.");
if (new Set(implementations).size !== implementations.length) errors.push("Capability implementation paths must be unique.");
if (new Set(testPaths).size !== testPaths.length) errors.push("Every authoritative capability must have a unique primary test file.");
if (new Set(excludedPaths).size !== excludedPaths.length) errors.push("Non-authority module paths must be unique.");
for (const excludedPath of excludedPaths) {
  if (implementations.includes(excludedPath)) errors.push(`Module cannot be both authoritative and excluded: ${excludedPath}`);
}

const validLayers = new Set(["content", "evidence", "compilation", "localization", "organization", "quality", "release", "integrity", "governance", "privacy", "delivery", "analytics", "authority", "platform", "operations", "audit", "review", "conformance"]);

for (const capability of capabilities) {
  const prefix = `[${capability.id ?? "unknown"}]`;
  if (!/^[a-z0-9-]+$/.test(capability.id ?? "")) errors.push(`${prefix} Invalid capability ID.`);
  if (!validLayers.has(capability.layer)) errors.push(`${prefix} Invalid architecture layer ${capability.layer}.`);
  if (capability.status !== "authoritative") errors.push(`${prefix} Capability status must be authoritative.`);
  if (typeof capability.releaseCritical !== "boolean") errors.push(`${prefix} releaseCritical must be boolean.`);
  if (typeof capability.privacyCritical !== "boolean") errors.push(`${prefix} privacyCritical must be boolean.`);
  if (!capability.implementation?.startsWith("src/lib/patientEducation") || !capability.implementation.endsWith(".ts")) errors.push(`${prefix} Implementation must be a patientEducation TypeScript module.`);
  if (!exists(capability.implementation)) {
    errors.push(`${prefix} Missing implementation: ${capability.implementation}`);
    continue;
  }
  const implementationSource = read(capability.implementation);
  for (const exportName of capability.requiredExports ?? []) {
    if (!implementationSource.includes(exportName)) errors.push(`${prefix} Missing required export marker ${exportName}.`);
  }
  if (!Array.isArray(capability.tests) || capability.tests.length !== 1) errors.push(`${prefix} Exactly one primary adversarial test file is required.`);
  for (const testPath of capability.tests ?? []) {
    if (!exists(testPath)) {
      errors.push(`${prefix} Missing primary test: ${testPath}`);
      continue;
    }
    const testSource = read(testPath);
    if (!testSource.includes("describe(")) errors.push(`${prefix} Test file lacks a describe block: ${testPath}`);
    const scenarioCount = (testSource.match(/\bit\s*\(/g) ?? []).length;
    if (scenarioCount < 2) errors.push(`${prefix} Test file must contain at least one positive and one adversarial scenario: ${testPath}`);
    for (const marker of capability.safetyMarkers ?? []) {
      if (!testSource.toLowerCase().includes(String(marker).toLowerCase())) errors.push(`${prefix} Test file is missing stable safety marker: ${marker}`);
    }
  }
  if ((capability.releaseCritical || capability.privacyCritical) && (!capability.safetyMarkers || capability.safetyMarkers.length === 0)) {
    warnings.push(`${prefix} Critical capability has no explicit stable safety marker.`);
  }
}

for (const module of excludedModules) {
  const prefix = `[non-authority:${module.path ?? "unknown"}]`;
  if (!module.path?.startsWith("src/lib/patientEducation") || !module.path.endsWith(".ts")) errors.push(`${prefix} Invalid excluded module path.`);
  if (!exists(module.path)) errors.push(`${prefix} Excluded module does not exist.`);
  if (!module.reason || module.reason.length < 40) errors.push(`${prefix} Exclusion requires a specific architectural rationale.`);
  for (const requiredFlag of ["patientCareUseProhibited", "authorityDecisionUseProhibited", "privateDataUseProhibited"]) {
    if (module[requiredFlag] !== true) errors.push(`${prefix} ${requiredFlag} must be true.`);
  }
  const moduleSource = exists(module.path) ? read(module.path) : "";
  for (const exportName of module.requiredExports ?? []) {
    if (!moduleSource.includes(exportName)) errors.push(`${prefix} Missing declared export ${exportName}.`);
  }
  for (const testPath of module.tests ?? []) {
    if (!exists(testPath)) errors.push(`${prefix} Missing non-authority module test ${testPath}.`);
  }
}

for (const documentPath of registry.architectureDocuments ?? []) {
  if (!exists(documentPath)) errors.push(`Missing required architecture document: ${documentPath}`);
}
for (const artifactPath of registry.publicProofArtifacts ?? []) {
  if (!exists(artifactPath)) errors.push(`Missing required public-safe proof artifact: ${artifactPath}`);
}

const registeredImplementations = new Set(implementations.map((item) => item.replaceAll(path.sep, "/")));
const explicitExclusions = new Set(excludedPaths.map((item) => item.replaceAll(path.sep, "/")));
const libDirectory = absolute("src/lib");
if (fs.existsSync(libDirectory)) {
  const discovered = fs.readdirSync(libDirectory)
    .filter((name) => /^patientEducation.*\.ts$/.test(name))
    .map((name) => `src/lib/${name}`)
    .sort();
  for (const discoveredPath of discovered) {
    if (!registeredImplementations.has(discoveredPath) && !explicitExclusions.has(discoveredPath)) errors.push(`Ungoverned patient-education implementation is neither authoritative nor explicitly excluded: ${discoveredPath}`);
  }
  for (const registeredPath of registeredImplementations) {
    if (!discovered.includes(registeredPath)) errors.push(`Registry references an implementation outside the discovered patient-education module inventory: ${registeredPath}`);
  }
  for (const excludedPath of explicitExclusions) {
    if (!discovered.includes(excludedPath)) errors.push(`Non-authority registry references a module outside the discovered inventory: ${excludedPath}`);
  }
  if (discovered.length !== registeredImplementations.size + explicitExclusions.size) errors.push("Discovered patient-education module count does not reconcile to authoritative plus explicitly excluded modules.");
}

if (exists(authorityManifestPath)) {
  try {
    const manifest = readJson(authorityManifestPath);
    const manifestIds = manifest.capabilities ?? [];
    const missing = ids.filter((id) => !manifestIds.includes(id));
    const unexpected = manifestIds.filter((id) => !ids.includes(id));
    if (manifest.capabilityCount !== registry.capabilityCount) errors.push(`Authority manifest capabilityCount ${manifest.capabilityCount} does not equal registry count ${registry.capabilityCount}.`);
    if (manifest.scenarioCount !== registry.scenarioCount) errors.push(`Authority manifest scenarioCount ${manifest.scenarioCount} does not equal registry count ${registry.scenarioCount}.`);
    if (missing.length > 0) errors.push(`Authority manifest missing registered capabilities: ${missing.join(", ")}.`);
    if (unexpected.length > 0) errors.push(`Authority manifest contains unregistered capabilities: ${unexpected.join(", ")}.`);
  } catch (error) {
    errors.push(`Unable to validate authority conformance manifest: ${error.message}`);
  }
} else {
  errors.push(`Missing authority conformance manifest: ${authorityManifestPath}`);
}

if (exists(authorityTestPath)) {
  const authorityTest = read(authorityTestPath);
  for (const id of ids) {
    if (!authorityTest.includes(`"${id}"`)) errors.push(`Authority conformance test does not enumerate registered capability ${id}.`);
  }
  if (!authorityTest.includes(`toBe(${registry.capabilityCount})`)) errors.push(`Authority conformance test does not assert capability count ${registry.capabilityCount}.`);
  if (!authorityTest.includes(`toBe(${registry.scenarioCount})`)) errors.push(`Authority conformance test does not assert scenario count ${registry.scenarioCount}.`);
} else {
  errors.push(`Missing authority conformance test: ${authorityTestPath}`);
}

const serializedPublicRegistries = JSON.stringify({ registry, nonAuthorityRegistry }).toLowerCase();
for (const prohibited of ["patient name", "medical record number", "date of birth", "private key", "reviewer email", "real hospital contact", "blood thinner dosage"]) {
  if (serializedPublicRegistries.includes(prohibited)) errors.push(`Patient Education registry contains prohibited public phrase: ${prohibited}.`);
}

if (warnings.length > 0) {
  console.warn("Patient Education capability registry warnings:");
  warnings.forEach((warning) => console.warn(`- ${warning}`));
}
if (errors.length > 0) {
  console.error("Patient Education capability registry check failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Patient Education capability registry passed: ${capabilities.length} authoritative capabilities, ${excludedModules.length} explicitly non-authority module(s), ${registry.scenarioCount} required synthetic scenarios, ${registry.architectureDocuments.length} architecture documents, and ${registry.publicProofArtifacts.length} public-safe proof artifacts.`);
