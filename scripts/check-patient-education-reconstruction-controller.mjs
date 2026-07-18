import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const controllerPath = "config/patient-education-reconstruction-controller.json";
const dependencyGraphPath = "config/patient-education-capability-dependencies.json";
const readinessLedgerPath = "config/patient-education-readiness-ledger.json";
const errors = [];
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));

for (const requiredPath of [controllerPath, dependencyGraphPath, readinessLedgerPath]) {
  if (!exists(requiredPath)) errors.push(`Missing reconstruction controller input: ${requiredPath}`);
}

let controller;
let graph;
let readiness;
try {
  if (exists(controllerPath)) controller = readJson(controllerPath);
  if (exists(dependencyGraphPath)) graph = readJson(dependencyGraphPath);
  if (exists(readinessLedgerPath)) readiness = readJson(readinessLedgerPath);
} catch (error) {
  errors.push(`Unable to parse reconstruction controller input: ${error.message}`);
}

if (controller?.schemaVersion !== "1.0.0") errors.push("Reconstruction controller schemaVersion must be 1.0.0.");
if (controller?.controllerId !== "CAF-PE-RECONSTRUCTION-CONTROLLER") errors.push("Reconstruction controller ID is invalid.");
if (controller?.status !== "active_development_control") errors.push("Reconstruction controller must remain an active development control.");
if (controller?.sourceArchitecture?.pullRequest !== 190) errors.push("Source architecture must remain PR 190.");
if (controller?.sourceArchitecture?.branch !== "agent/caf-patient-education-product") errors.push("Source architecture branch is invalid.");
if (controller?.sourceArchitecture?.mustRemainDraft !== true) errors.push("PR 190 must remain draft.");
if (controller?.sourceArchitecture?.directMergeProhibited !== true) errors.push("Direct merge of PR 190 must remain prohibited.");
if (controller?.sourceArchitecture?.requiredClosure !== "superseded") errors.push("PR 190 must close as superseded.");

const tranches = controller?.tranches ?? [];
const expectedIds = ["A", "B", "C", "D", "E", "F"];
const expectedTitles = new Map((graph?.tranches ?? []).map((tranche) => [tranche.id, tranche.title]));
if (tranches.length !== 6) errors.push("Reconstruction controller must contain exactly six tranches.");
if (JSON.stringify(tranches.map((tranche) => tranche.trancheId)) !== JSON.stringify(expectedIds)) errors.push("Reconstruction controller tranche order must be A through F.");
if (JSON.stringify(tranches.map((tranche) => tranche.sequence)) !== JSON.stringify([1, 2, 3, 4, 5, 6])) errors.push("Reconstruction controller sequences must be 1 through 6.");

const allowedStates = new Set(controller?.allowedStates ?? []);
const requiredStates = ["not_started", "reconciled", "blocked", "branch_ready", "in_review", "changes_required", "certified", "merged", "superseded", "canceled"];
if (JSON.stringify([...allowedStates]) !== JSON.stringify(requiredStates)) errors.push("Reconstruction controller allowed states are incomplete or reordered.");

const trancheById = new Map(tranches.map((tranche) => [tranche.trancheId, tranche]));
for (const tranche of tranches) {
  if (tranche.title !== expectedTitles.get(tranche.trancheId)) errors.push(`Tranche ${tranche.trancheId} title differs from the dependency graph.`);
  if (!allowedStates.has(tranche.state)) errors.push(`Tranche ${tranche.trancheId} has invalid state ${tranche.state}.`);
  if (!Array.isArray(tranche.dependsOn)) errors.push(`Tranche ${tranche.trancheId} dependsOn must be an array.`);
  if (!Array.isArray(tranche.workItems) || tranche.workItems.length === 0) errors.push(`Tranche ${tranche.trancheId} requires work-item ownership.`);
  if (!Array.isArray(tranche.evidenceRefs)) errors.push(`Tranche ${tranche.trancheId} evidenceRefs must be an array.`);
  if (!tranche.remainingGate || tranche.remainingGate.length < 30) errors.push(`Tranche ${tranche.trancheId} requires a specific remaining gate.`);
  for (const dependencyId of tranche.dependsOn ?? []) {
    const dependency = trancheById.get(dependencyId);
    if (!dependency) errors.push(`Tranche ${tranche.trancheId} depends on unknown tranche ${dependencyId}.`);
    if (dependency && dependency.sequence >= tranche.sequence) errors.push(`Tranche ${tranche.trancheId} dependency ${dependencyId} must precede it.`);
  }
  for (const workItem of tranche.workItems ?? []) {
    if (!/^AND-\d+$/.test(workItem)) errors.push(`Tranche ${tranche.trancheId} has invalid Linear work item ${workItem}.`);
  }
  for (const evidenceRef of tranche.evidenceRefs ?? []) {
    if (!/^(?:path|linear|github-pr):\/\//.test(evidenceRef)) errors.push(`Tranche ${tranche.trancheId} has unsupported evidence ref ${evidenceRef}.`);
    if (evidenceRef.startsWith("path://")) {
      const relativePath = evidenceRef.slice("path://".length);
      if (!exists(relativePath)) errors.push(`Tranche ${tranche.trancheId} evidence path is missing: ${relativePath}.`);
    }
    if (evidenceRef.startsWith("linear://") && !/^linear:\/\/AND-\d+$/.test(evidenceRef)) errors.push(`Tranche ${tranche.trancheId} has invalid Linear evidence ref ${evidenceRef}.`);
    if (evidenceRef.startsWith("github-pr://") && !/^github-pr:\/\/\d+$/.test(evidenceRef)) errors.push(`Tranche ${tranche.trancheId} has invalid GitHub PR evidence ref ${evidenceRef}.`);
  }
}

const expectedCurrentStates = { A: "reconciled", B: "in_review", C: "blocked", D: "blocked", E: "blocked", F: "blocked" };
for (const [trancheId, expectedState] of Object.entries(expectedCurrentStates)) {
  if (trancheById.get(trancheId)?.state !== expectedState) errors.push(`Tranche ${trancheId} must remain ${expectedState} at the current evidence state.`);
}

const trancheA = trancheById.get("A");
if (trancheA) {
  if (trancheA.branchCreationAuthorized !== false) errors.push("Tranche A must not create a redundant branch.");
  if (trancheA.mergeRequired !== false) errors.push("Tranche A must not require another merge.");
  if (trancheA.mergeAuthorized !== false) errors.push("Tranche A merge authorization must remain false because no new merge is required.");
}

const trancheB = trancheById.get("B");
if (trancheB) {
  if (trancheB.branchCreationAuthorized !== true) errors.push("Tranche B branch creation must be authorized.");
  if (trancheB.branch !== "agent/caf-pe-tranche-b-integrity-privacy") errors.push("Tranche B branch is invalid.");
  if (trancheB.pullRequest !== 192) errors.push("Tranche B must identify PR 192.");
  if (trancheB.mergeRequired !== true) errors.push("Tranche B must require merge or explicit supersession.");
  if (trancheB.mergeAuthorized !== false) errors.push("Tranche B merge must remain unauthorized.");
  if (trancheB.repositoryActionsCertified !== false) errors.push("Tranche B repository Actions must remain uncertified until attached evidence exists.");
  if (trancheB.localSnapshotEvidenceAvailable !== true) errors.push("Tranche B must record the available local snapshot evidence.");
}

for (const trancheId of ["C", "D", "E", "F"]) {
  const tranche = trancheById.get(trancheId);
  if (!tranche) continue;
  if (tranche.branchCreationAuthorized !== false) errors.push(`Tranche ${trancheId} branch creation must remain blocked.`);
  if (tranche.mergeAuthorized !== false) errors.push(`Tranche ${trancheId} merge must remain unauthorized.`);
  for (const dependencyId of tranche.dependsOn) {
    const dependency = trancheById.get(dependencyId);
    if (dependency && dependency.state !== "merged" && dependency.state !== "superseded") {
      if (tranche.state !== "blocked") errors.push(`Tranche ${trancheId} must remain blocked while ${dependencyId} is ${dependency.state}.`);
    }
  }
}

const transitionRules = controller?.transitionRules ?? [];
if (transitionRules.length !== requiredStates.length) errors.push("Reconstruction controller must define one transition rule per state.");
const transitionFrom = transitionRules.map((rule) => rule.from);
if (new Set(transitionFrom).size !== transitionFrom.length) errors.push("Transition-rule source states must be unique.");
for (const state of requiredStates) {
  const rule = transitionRules.find((candidate) => candidate.from === state);
  if (!rule) errors.push(`Missing transition rule for ${state}.`);
  for (const target of rule?.to ?? []) if (!allowedStates.has(target)) errors.push(`Transition ${state} -> ${target} uses an invalid target state.`);
}
for (const terminalState of ["merged", "superseded", "canceled"]) {
  const rule = transitionRules.find((candidate) => candidate.from === terminalState);
  if ((rule?.to ?? []).length !== 0) errors.push(`Terminal state ${terminalState} cannot have outgoing transitions.`);
}

const gates = controller?.globalGates ?? {};
for (const gate of [
  "noForceMerge",
  "noDependentBranchBeforePrerequisiteMerge",
  "exactCommitEvidenceRequired",
  "repositoryActionsEvidenceRequired",
  "productionBuildRequired",
  "targetedTestsRequired",
  "claimsBoundaryRequired",
  "patientCareUseProhibited",
  "pilotAuthorizationProhibited",
  "productionDeliveryProhibited",
]) {
  if (gates[gate] !== true) errors.push(`Global reconstruction gate ${gate} must remain true.`);
}

if (readiness) {
  if (readiness.draftPullRequest !== controller.sourceArchitecture.pullRequest) errors.push("Readiness and reconstruction controller disagree on the source PR.");
  if (readiness.mustRemainDraft !== controller.sourceArchitecture.mustRemainDraft) errors.push("Readiness and reconstruction controller disagree on draft status.");
  const branchDomain = readiness.domains?.find((domain) => domain.id === "branch_integration");
  if (branchDomain?.maturity !== "blocked_reconstruction_required") errors.push("Readiness ledger must keep branch integration blocked.");
}

if (!controller?.completionRule?.includes("B through F are merged in dependency order")) errors.push("Completion rule must require B through F dependency-ordered merges.");
if (!controller?.completionRule?.includes("PR 190 closes as superseded rather than merged")) errors.push("Completion rule must require PR 190 supersession.");
if (!Array.isArray(controller?.claimsBoundary) || controller.claimsBoundary.length < 3) errors.push("Reconstruction controller requires an explicit claims boundary.");

const serialized = JSON.stringify(controller);
const populatedSensitivePatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /"(?:patientName|medicalRecordNumber|dateOfBirth|reviewerEmail|realHospitalContact|bloodThinnerDosage)"\s*:\s*"[^"\s][^"]*"/i,
  /"privateKey(?:Inline|Value|Pem)?"\s*:\s*"[^"\s][^"]*"/i,
];
for (const pattern of populatedSensitivePatterns) if (pattern.test(serialized)) errors.push(`Reconstruction controller contains populated sensitive material matching ${pattern}.`);

if (errors.length > 0) {
  console.error("Patient Education reconstruction controller check failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Patient Education reconstruction controller passed: A reconciled; B in review at PR 192 with merge unauthorized; C through F blocked in dependency order; PR 190 remains draft and direct merge prohibited; patient-care, pilot, and production use remain prohibited.");
