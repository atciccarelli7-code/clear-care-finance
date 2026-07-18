import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const reconciliationPath = "config/patient-education-reconstruction-reconciliation.json";
const dependencyGraphPath = "config/patient-education-capability-dependencies.json";
const nonAuthorityRegistryPath = "config/patient-education-non-authority-modules.json";
const errors = [];

const absolute = (relativePath) => path.join(root, relativePath);
const exists = (relativePath) => fs.existsSync(absolute(relativePath));
const readJson = (relativePath) => JSON.parse(fs.readFileSync(absolute(relativePath), "utf8"));
const gitBlobSha = (buffer) => crypto
  .createHash("sha1")
  .update(Buffer.from(`blob ${buffer.length}\0`, "utf8"))
  .update(buffer)
  .digest("hex");

for (const requiredPath of [reconciliationPath, dependencyGraphPath, nonAuthorityRegistryPath]) {
  if (!exists(requiredPath)) errors.push(`Missing reconstruction reconciliation input: ${requiredPath}`);
}

let reconciliation;
let dependencyGraph;
let nonAuthorityRegistry;
try {
  if (exists(reconciliationPath)) reconciliation = readJson(reconciliationPath);
  if (exists(dependencyGraphPath)) dependencyGraph = readJson(dependencyGraphPath);
  if (exists(nonAuthorityRegistryPath)) nonAuthorityRegistry = readJson(nonAuthorityRegistryPath);
} catch (error) {
  errors.push(`Unable to parse reconstruction reconciliation input: ${error.message}`);
}

if (reconciliation?.schemaVersion !== "1.0.0") errors.push("Reconstruction reconciliation schemaVersion must be 1.0.0.");
if (reconciliation?.reconciliationId !== "CAF-PE-RECONCILIATION-TRANCHE-A-MAIN") errors.push("Reconstruction reconciliation ID is invalid.");
if (reconciliation?.status !== "exact_blob_reconciled") errors.push("Reconstruction reconciliation status must remain exact_blob_reconciled.");
if (reconciliation?.baseline?.repository !== "atciccarelli7-code/clear-care-finance") errors.push("Reconstruction baseline repository is invalid.");
if (!/^[a-f0-9]{40}$/.test(reconciliation?.baseline?.mainCommitSha ?? "")) errors.push("Reconstruction baseline main commit must be a 40-character SHA.");
if (reconciliation?.baseline?.draftPullRequest !== 190) errors.push("Reconstruction reconciliation must reference draft PR 190.");
if (reconciliation?.baseline?.sourceBranch !== "agent/caf-patient-education-product") errors.push("Reconstruction source branch is invalid.");
if (reconciliation?.baseline?.verifiedBy !== "github_contents_blob_sha_comparison") errors.push("Reconstruction verification method must be GitHub contents blob SHA comparison.");
if (!Number.isFinite(Date.parse(reconciliation?.baseline?.verifiedAt ?? ""))) errors.push("Reconstruction verification timestamp must be valid ISO time.");

const tranches = reconciliation?.tranches ?? [];
if (!Array.isArray(tranches) || tranches.length !== 1) errors.push("Reconstruction reconciliation must contain exactly the integrated Tranche A record.");
const trancheA = tranches.find((tranche) => tranche.trancheId === "A");
if (!trancheA) errors.push("Reconstruction reconciliation is missing Tranche A.");
else {
  if (trancheA.title !== "Public institutional product surface") errors.push("Tranche A title does not match the capability dependency graph.");
  if (trancheA.reconciliationStatus !== "already_integrated_exact_blob_match") errors.push("Tranche A must remain classified as an exact-blob integrated surface.");
  if (trancheA.newMergePullRequestRequired !== false) errors.push("Tranche A must not require a redundant merge pull request while blobs match.");
  if (trancheA.runtimeCertificationStillRequired !== true) errors.push("Tranche A must retain integrated runtime-certification requirements.");
  if (!Array.isArray(trancheA.claimsBoundary) || trancheA.claimsBoundary.length < 3) errors.push("Tranche A reconciliation requires an explicit claims boundary.");
  const artifacts = trancheA.artifacts ?? [];
  if (trancheA.artifactCount !== artifacts.length) errors.push(`Tranche A artifactCount ${trancheA.artifactCount} does not equal ${artifacts.length}.`);
  if (artifacts.length !== 18) errors.push(`Tranche A reconciliation must contain 18 exact-blob artifacts; found ${artifacts.length}.`);
  const paths = artifacts.map((artifact) => artifact.path);
  const blobShas = artifacts.map((artifact) => artifact.mainBlobSha);
  if (new Set(paths).size !== paths.length) errors.push("Tranche A reconciliation artifact paths must be unique.");
  if (new Set(blobShas).size !== blobShas.length) errors.push("Tranche A reconciliation blob SHAs must be unique.");
  for (const artifact of artifacts) {
    if (!artifact.path || path.isAbsolute(artifact.path) || artifact.path.includes("..")) errors.push(`Invalid Tranche A artifact path: ${artifact.path}.`);
    if (!/^[a-f0-9]{40}$/.test(artifact.mainBlobSha ?? "")) errors.push(`Invalid Git blob SHA for ${artifact.path}.`);
    if (!exists(artifact.path)) {
      errors.push(`Tranche A reconciled artifact is missing: ${artifact.path}.`);
      continue;
    }
    const actualBlobSha = gitBlobSha(fs.readFileSync(absolute(artifact.path)));
    if (actualBlobSha !== artifact.mainBlobSha) errors.push(`Tranche A artifact drifted from reconciled main blob: ${artifact.path}; expected ${artifact.mainBlobSha}, found ${actualBlobSha}.`);
  }
}

const graphTrancheA = (dependencyGraph?.tranches ?? []).find((tranche) => tranche.id === "A");
if (!graphTrancheA) errors.push("Capability dependency graph is missing Tranche A.");
else {
  if (graphTrancheA.title !== trancheA?.title) errors.push("Tranche A title differs between dependency graph and reconciliation manifest.");
  if ((graphTrancheA.authoritativeCapabilityIds ?? []).length !== 0) errors.push("Tranche A must remain a public-surface tranche without authoritative control capabilities.");
  const expectedNonAuthorityPaths = (nonAuthorityRegistry?.modules ?? []).map((module) => module.path).sort();
  const graphNonAuthorityPaths = [...(graphTrancheA.nonAuthorityModulePaths ?? [])].sort();
  if (JSON.stringify(graphNonAuthorityPaths) !== JSON.stringify(expectedNonAuthorityPaths)) errors.push("Tranche A non-authority module assignment does not match the explicit non-authority registry.");
}

const remaining = reconciliation?.remainingReconstructionTranches ?? [];
if (JSON.stringify(remaining) !== JSON.stringify(["B", "C", "D", "E", "F"])) errors.push("Remaining reconstruction tranches must be exactly B through F.");
if (!reconciliation?.completionRule?.includes("must not be recreated as a redundant merge pull request")) errors.push("Reconciliation completion rule must prohibit redundant Tranche A recreation.");
if (!reconciliation?.completionRule?.includes("Any blob drift reopens Tranche A review")) errors.push("Reconciliation completion rule must reopen Tranche A on blob drift.");

const serialized = JSON.stringify(reconciliation);
const populatedSensitivePatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /"(?:patientName|medicalRecordNumber|dateOfBirth|reviewerEmail|realHospitalContact|bloodThinnerDosage)"\s*:\s*"[^"\s][^"]*"/i,
  /"privateKey(?:Inline|Value|Pem)?"\s*:\s*"[^"\s][^"]*"/i,
];
for (const pattern of populatedSensitivePatterns) {
  if (pattern.test(serialized)) errors.push(`Reconstruction reconciliation contains populated sensitive material matching ${pattern}.`);
}

if (errors.length > 0) {
  console.error("Patient Education reconstruction reconciliation check failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Patient Education reconstruction reconciliation passed: Tranche A is already integrated through 18 exact Git blob matches at main commit ${reconciliation.baseline.mainCommitSha}; no redundant merge PR is required; Tranches B through F remain reconstruction work; runtime certification is still required.`);
