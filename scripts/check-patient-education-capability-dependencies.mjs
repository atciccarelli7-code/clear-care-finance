import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const registryPath = "config/patient-education-capability-registry.json";
const nonAuthorityRegistryPath = "config/patient-education-non-authority-modules.json";
const dependencyGraphPath = "config/patient-education-capability-dependencies.json";
const reconstructionPlanPath = "docs/caf-patient-education-branch-reconstruction-and-merge-plan.md";
const errors = [];

const absolute = (relativePath) => path.join(root, relativePath);
const exists = (relativePath) => fs.existsSync(absolute(relativePath));
const read = (relativePath) => fs.readFileSync(absolute(relativePath), "utf8");
const readJson = (relativePath) => JSON.parse(read(relativePath));

for (const requiredPath of [registryPath, nonAuthorityRegistryPath, dependencyGraphPath, reconstructionPlanPath]) {
  if (!exists(requiredPath)) errors.push(`Missing capability dependency input: ${requiredPath}`);
}

let registry;
let nonAuthorityRegistry;
let graph;
try {
  if (exists(registryPath)) registry = readJson(registryPath);
  if (exists(nonAuthorityRegistryPath)) nonAuthorityRegistry = readJson(nonAuthorityRegistryPath);
  if (exists(dependencyGraphPath)) graph = readJson(dependencyGraphPath);
} catch (error) {
  errors.push(`Unable to parse capability dependency input: ${error.message}`);
}

const capabilityIds = (registry?.capabilities ?? []).map((capability) => capability.id);
const capabilitySet = new Set(capabilityIds);
const nonAuthorityPaths = (nonAuthorityRegistry?.modules ?? []).map((module) => module.path);
const nonAuthoritySet = new Set(nonAuthorityPaths);
const tranches = graph?.tranches ?? [];
const dependencies = graph?.dependencies ?? {};

if (graph?.schemaVersion !== "1.0.0") errors.push("Capability dependency graph schemaVersion must be 1.0.0.");
if (graph?.status !== "public_safe_architecture_graph") errors.push("Capability dependency graph must preserve public-safe status.");
if (!Array.isArray(graph?.claimsBoundary) || graph.claimsBoundary.length < 3) errors.push("Capability dependency graph requires an explicit claims boundary.");
if (!Array.isArray(tranches) || tranches.length !== 6) errors.push("Capability dependency graph must define exactly six reconstruction tranches.");

const expectedTrancheIds = ["A", "B", "C", "D", "E", "F"];
const trancheIds = tranches.map((tranche) => tranche.id);
const sequences = tranches.map((tranche) => tranche.sequence);
if (JSON.stringify(trancheIds) !== JSON.stringify(expectedTrancheIds)) errors.push("Reconstruction tranche IDs must be ordered A through F.");
if (JSON.stringify(sequences) !== JSON.stringify([1, 2, 3, 4, 5, 6])) errors.push("Reconstruction tranche sequence must be exactly 1 through 6.");
if (new Set(trancheIds).size !== trancheIds.length) errors.push("Reconstruction tranche IDs must be unique.");
if (new Set(sequences).size !== sequences.length) errors.push("Reconstruction tranche sequences must be unique.");

const capabilityTranche = new Map();
const assignedCapabilities = [];
const assignedNonAuthorityPaths = [];
for (const tranche of tranches) {
  if (!tranche.title || tranche.title.length < 10) errors.push(`Tranche ${tranche.id} requires a descriptive title.`);
  for (const capabilityId of tranche.authoritativeCapabilityIds ?? []) {
    assignedCapabilities.push(capabilityId);
    if (capabilityTranche.has(capabilityId)) errors.push(`Capability ${capabilityId} is assigned to multiple tranches.`);
    capabilityTranche.set(capabilityId, tranche);
  }
  for (const modulePath of tranche.nonAuthorityModulePaths ?? []) assignedNonAuthorityPaths.push(modulePath);
}

for (const capabilityId of capabilityIds) {
  if (!capabilityTranche.has(capabilityId)) errors.push(`Authoritative capability is not assigned to a reconstruction tranche: ${capabilityId}`);
}
for (const capabilityId of assignedCapabilities) {
  if (!capabilitySet.has(capabilityId)) errors.push(`Reconstruction tranche contains unknown capability: ${capabilityId}`);
}
if (assignedCapabilities.length !== capabilityIds.length) errors.push(`Assigned authoritative capability count ${assignedCapabilities.length} does not equal registry count ${capabilityIds.length}.`);
if (new Set(assignedCapabilities).size !== assignedCapabilities.length) errors.push("Authoritative capabilities must be assigned exactly once across tranches.");

for (const modulePath of nonAuthorityPaths) {
  if (!assignedNonAuthorityPaths.includes(modulePath)) errors.push(`Explicit non-authority module is not assigned to a reconstruction tranche: ${modulePath}`);
}
for (const modulePath of assignedNonAuthorityPaths) {
  if (!nonAuthoritySet.has(modulePath)) errors.push(`Reconstruction tranche contains unknown non-authority module: ${modulePath}`);
}
if (new Set(assignedNonAuthorityPaths).size !== assignedNonAuthorityPaths.length) errors.push("Non-authority modules must be assigned exactly once across tranches.");

const dependencyKeys = Object.keys(dependencies);
for (const capabilityId of capabilityIds) {
  if (!Object.hasOwn(dependencies, capabilityId)) errors.push(`Capability dependency entry missing: ${capabilityId}`);
}
for (const capabilityId of dependencyKeys) {
  if (!capabilitySet.has(capabilityId)) errors.push(`Dependency graph contains unknown capability key: ${capabilityId}`);
  const dependencyIds = dependencies[capabilityId];
  if (!Array.isArray(dependencyIds)) {
    errors.push(`Dependencies for ${capabilityId} must be an array.`);
    continue;
  }
  if (new Set(dependencyIds).size !== dependencyIds.length) errors.push(`Dependencies for ${capabilityId} must be unique.`);
  for (const dependencyId of dependencyIds) {
    if (!capabilitySet.has(dependencyId)) errors.push(`Capability ${capabilityId} depends on unknown capability ${dependencyId}.`);
    if (dependencyId === capabilityId) errors.push(`Capability ${capabilityId} cannot depend on itself.`);
    const currentTranche = capabilityTranche.get(capabilityId);
    const dependencyTranche = capabilityTranche.get(dependencyId);
    if (currentTranche && dependencyTranche && dependencyTranche.sequence > currentTranche.sequence) {
      errors.push(`Capability ${capabilityId} in Tranche ${currentTranche.id} depends on later Tranche ${dependencyTranche.id} capability ${dependencyId}.`);
    }
  }
}
if (dependencyKeys.length !== capabilityIds.length) errors.push(`Dependency-key count ${dependencyKeys.length} does not equal capability count ${capabilityIds.length}.`);

const visiting = new Set();
const visited = new Set();
const cycleStack = [];
const visit = (capabilityId) => {
  if (visiting.has(capabilityId)) {
    const cycleStart = cycleStack.indexOf(capabilityId);
    errors.push(`Capability dependency cycle detected: ${[...cycleStack.slice(cycleStart), capabilityId].join(" -> ")}`);
    return;
  }
  if (visited.has(capabilityId)) return;
  visiting.add(capabilityId);
  cycleStack.push(capabilityId);
  for (const dependencyId of dependencies[capabilityId] ?? []) visit(dependencyId);
  cycleStack.pop();
  visiting.delete(capabilityId);
  visited.add(capabilityId);
};
for (const capabilityId of capabilityIds) visit(capabilityId);

const transitiveDependencies = (rootId) => {
  const reached = new Set();
  const walk = (capabilityId) => {
    for (const dependencyId of dependencies[capabilityId] ?? []) {
      if (reached.has(dependencyId)) continue;
      reached.add(dependencyId);
      walk(dependencyId);
    }
  };
  walk(rootId);
  return reached;
};

const terminalCapabilityId = graph?.requiredTerminalCapabilityId;
if (!capabilitySet.has(terminalCapabilityId)) errors.push(`Required terminal capability is unknown: ${terminalCapabilityId}`);
else {
  const terminalClosure = transitiveDependencies(terminalCapabilityId);
  const missingFromTerminal = capabilityIds.filter((capabilityId) => capabilityId !== terminalCapabilityId && !terminalClosure.has(capabilityId));
  if (missingFromTerminal.length > 0) errors.push(`Terminal conformance capability does not cover all authoritative capabilities: ${missingFromTerminal.join(", ")}.`);
  const terminalTranche = capabilityTranche.get(terminalCapabilityId);
  if (terminalTranche?.id !== "F") errors.push("Terminal conformance capability must belong to Tranche F.");
}

const dispatchCapabilityId = graph?.requiredDispatchCapabilityId;
const requiredDispatchClosure = [
  "private-authority-decision",
  "organization-lifecycle",
  "job-orchestration",
  "distribution-control",
  "continuity-contract",
  "audit-export",
  "authority-contract",
  "tenant-isolation",
  "signing-authority",
  "review-workflow",
  "release-authorization",
  "privacy-boundary",
];
if (!capabilitySet.has(dispatchCapabilityId)) errors.push(`Required dispatch capability is unknown: ${dispatchCapabilityId}`);
else {
  const dispatchClosure = transitiveDependencies(dispatchCapabilityId);
  for (const requiredCapabilityId of requiredDispatchClosure) {
    if (!dispatchClosure.has(requiredCapabilityId)) errors.push(`Institutional dispatch authority does not transitively require ${requiredCapabilityId}.`);
  }
  const dispatchTranche = capabilityTranche.get(dispatchCapabilityId);
  if (dispatchTranche?.id !== "E") errors.push("Institutional dispatch authority must belong to Tranche E.");
}

if (exists(reconstructionPlanPath)) {
  const reconstructionPlan = read(reconstructionPlanPath);
  for (const tranche of tranches) {
    if (!reconstructionPlan.includes(`Tranche ${tranche.id}`)) errors.push(`Reconstruction plan does not contain Tranche ${tranche.id}.`);
    if (!reconstructionPlan.includes(tranche.title)) errors.push(`Reconstruction plan title does not match dependency graph for Tranche ${tranche.id}: ${tranche.title}`);
  }
}

const serializedGraph = JSON.stringify(graph);
const populatedSensitivePatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /"(?:patientName|medicalRecordNumber|dateOfBirth|reviewerEmail|realHospitalContact)"\s*:\s*"[^"\s][^"]*"/i,
  /"privateKey(?:Inline|Value|Pem)?"\s*:\s*"[^"\s][^"]*"/i,
];
for (const pattern of populatedSensitivePatterns) {
  if (pattern.test(serializedGraph)) errors.push(`Capability dependency graph contains populated sensitive material matching ${pattern}.`);
}

if (errors.length > 0) {
  console.error("Patient Education capability dependency check failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Patient Education capability dependency graph passed: ${capabilityIds.length} capabilities assigned exactly once across ${tranches.length} ordered tranches; terminal conformance covers all capabilities; dispatch authority includes ${requiredDispatchClosure.length} critical dependencies.`);
