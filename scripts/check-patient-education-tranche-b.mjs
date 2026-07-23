import { execFileSync } from "node:child_process";
import { lstatSync, readFileSync } from "node:fs";

const manifestPath = "config/patient-education-tranche-b-manifest.json";
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const failures = [];

const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const fail = (message) => failures.push(message);
const assertSha = (value, label) => {
  if (!/^[a-f0-9]{40}$/.test(value ?? "")) fail(`${label} must be a full lowercase Git blob or commit SHA.`);
};
const blobAt = (revision, path) => {
  try {
    return git("rev-parse", `${revision}:${path}`);
  } catch {
    fail(`Missing ${path} at ${revision}.`);
    return "";
  }
};
const workingBlob = (path) => {
  try {
    if (!lstatSync(path).isFile()) {
      fail(`${path} must be a regular file.`);
      return "";
    }
    return git("hash-object", `--path=${path}`, "--", path);
  } catch {
    fail(`Missing required Tranche B file: ${path}.`);
    return "";
  }
};

if (manifest.schemaVersion !== "1.0.0") fail("Unsupported Tranche B manifest schema version.");
if (manifest.manifestId !== "CAF-PE-TRANCHE-B-INTEGRITY-PRIVACY") fail("Unexpected Tranche B manifest ID.");
if (manifest.trancheId !== "B") fail("Unexpected tranche ID.");
if (manifest.status !== "public_safe_reconstruction_candidate") fail("Tranche B must remain a reconstruction candidate.");

const { baseline } = manifest;
assertSha(baseline.mainCommitSha, "Baseline main commit");
assertSha(baseline.sourceCommitSha, "PR #190 source commit");
if (baseline.sourcePullRequest !== 190) fail("Tranche B must remain bound to source PR #190.");

try {
  git("merge-base", "--is-ancestor", baseline.mainCommitSha, "HEAD");
} catch {
  fail(`Baseline ${baseline.mainCommitSha} is not an ancestor of HEAD.`);
}

const reconstructedPaths = [];
for (const capability of manifest.alreadyIntegratedCapabilities) {
  for (const artifact of [capability.implementation, capability.test]) {
    assertSha(artifact.blobSha, `${capability.capabilityId}:${artifact.path}`);
    const baselineBlob = blobAt(baseline.mainCommitSha, artifact.path);
    const currentBlob = workingBlob(artifact.path);
    if (baselineBlob !== artifact.blobSha) fail(`${artifact.path} does not match its manifest-bound baseline blob.`);
    if (currentBlob !== artifact.blobSha) fail(`${artifact.path} changed inside Tranche B.`);
  }
}

for (const capability of manifest.reconstructedCapabilities) {
  for (const artifact of [capability.implementation, capability.test]) {
    reconstructedPaths.push(artifact.path);
    assertSha(artifact.sourceBlobSha, `${capability.capabilityId}:${artifact.path}:source`);
    assertSha(artifact.reconstructionBlobSha, `${capability.capabilityId}:${artifact.path}:reconstruction`);
    const sourceBlob = blobAt(baseline.sourceCommitSha, artifact.path);
    const currentBlob = workingBlob(artifact.path);
    if (sourceBlob !== artifact.sourceBlobSha) fail(`${artifact.path} no longer matches the exact PR #190 source blob.`);
    if (currentBlob !== artifact.reconstructionBlobSha) fail(`${artifact.path} does not match its reviewed reconstruction blob.`);
    const differs = artifact.sourceBlobSha !== artifact.reconstructionBlobSha;
    if (differs && !artifact.correctnessDeviation?.trim()) fail(`${artifact.path} differs from PR #190 without a documented correctness deviation.`);
    if (!differs && artifact.correctnessDeviation) fail(`${artifact.path} documents a deviation but is byte-identical to PR #190.`);
  }
}

const trancheControlPaths = [
  ".github/workflows/patient-education-tranche-b.yml",
  manifestPath,
  "docs/caf-patient-education-tranche-b-integrity-privacy.md",
  "scripts/check-patient-education-tranche-b.mjs",
];
const allowedPaths = new Set([...reconstructedPaths, ...trancheControlPaths]);
for (const path of trancheControlPaths) workingBlob(path);

const changedPaths = git("diff", "--name-only", `${baseline.mainCommitSha}...HEAD`)
  .split(/\r?\n/)
  .filter(Boolean);
for (const path of changedPaths) {
  if (!allowedPaths.has(path)) fail(`Out-of-scope Tranche B path: ${path}.`);
}
for (const path of allowedPaths) {
  if (!changedPaths.includes(path)) fail(`Manifest-listed Tranche B path is absent from the branch diff: ${path}.`);
}

const requiredCommands = [
  "node scripts/check-patient-education-tranche-b.mjs",
  "npx vitest run src/test/patientEducationIntegrityManifest.test.ts src/test/patientEducationReproducibilityManifest.test.ts src/test/patientEducationInstitutionOverlay.test.ts src/test/patientEducationPrivacyBoundary.test.ts",
  "npm run build",
];
if (JSON.stringify(manifest.acceptanceCommands) !== JSON.stringify(requiredCommands)) {
  fail("Acceptance commands do not match the bounded Tranche B certification contract.");
}

const claims = manifest.claimsBoundary.join(" ").toLowerCase();
for (const boundary of ["no clinical patient guide", "defense in depth", "does not establish clinical approval", "pilot authorization", "patient outcomes"]) {
  if (!claims.includes(boundary)) fail(`Claims boundary must explicitly preserve: ${boundary}.`);
}

if (failures.length > 0) {
  console.error("Patient Education Tranche B certification failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Patient Education Tranche B scope and provenance checks passed (${changedPaths.length} bounded files).`);
