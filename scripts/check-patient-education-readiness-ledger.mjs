import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const ledgerPath = "config/patient-education-readiness-ledger.json";
const registryPath = "config/patient-education-capability-registry.json";
const dependencyGraphPath = "config/patient-education-capability-dependencies.json";
const authorityManifestPath = "public/patient-education/demo/synthetic-authority-conformance-manifest.json";
const errors = [];

const absolute = (relativePath) => path.join(root, relativePath);
const exists = (relativePath) => fs.existsSync(absolute(relativePath));
const read = (relativePath) => fs.readFileSync(absolute(relativePath), "utf8");
const readJson = (relativePath) => JSON.parse(read(relativePath));

for (const requiredPath of [ledgerPath, registryPath, dependencyGraphPath, authorityManifestPath]) {
  if (!exists(requiredPath)) errors.push(`Missing readiness input: ${requiredPath}`);
}

let ledger;
let registry;
let dependencyGraph;
let authorityManifest;
try {
  if (exists(ledgerPath)) ledger = readJson(ledgerPath);
  if (exists(registryPath)) registry = readJson(registryPath);
  if (exists(dependencyGraphPath)) dependencyGraph = readJson(dependencyGraphPath);
  if (exists(authorityManifestPath)) authorityManifest = readJson(authorityManifestPath);
} catch (error) {
  errors.push(`Unable to parse readiness input JSON: ${error.message}`);
}

const domains = ledger?.domains ?? [];
const blockers = ledger?.openBlockers ?? [];
const executionEvidence = ledger?.executionEvidence ?? {};
const capabilityIds = new Set((registry?.capabilities ?? []).map((capability) => capability.id));

if (ledger?.schemaVersion !== "1.0.0") errors.push("Readiness ledger schemaVersion must be 1.0.0.");
if (ledger?.ledgerId !== "CAF-PE-READINESS-LEDGER-FOUNDATION") errors.push("Readiness ledger ID is invalid.");
if (ledger?.status !== "development_only") errors.push("Readiness ledger must remain development_only.");
if (!Number.isFinite(Date.parse(ledger?.asOf ?? ""))) errors.push("Readiness ledger asOf must be an ISO timestamp.");
if (ledger?.draftPullRequest !== 190) errors.push("Readiness ledger must identify draft PR 190.");
if (ledger?.mustRemainDraft !== true) errors.push("Readiness ledger must require PR 190 to remain draft.");
if (ledger?.authoritativeCapabilityCount !== 44) errors.push("Readiness ledger must declare 44 authoritative capabilities.");
if (ledger?.requiredSyntheticScenarioCount !== 88) errors.push("Readiness ledger must declare 88 required synthetic scenarios.");
if (ledger?.reconstructionTrancheCount !== 6) errors.push("Readiness ledger must declare six reconstruction tranches.");

if (registry?.capabilityCount !== ledger?.authoritativeCapabilityCount) errors.push("Readiness ledger capability count does not match the canonical registry.");
if (registry?.scenarioCount !== ledger?.requiredSyntheticScenarioCount) errors.push("Readiness ledger scenario count does not match the canonical registry.");
if ((dependencyGraph?.tranches ?? []).length !== ledger?.reconstructionTrancheCount) errors.push("Readiness ledger tranche count does not match the dependency graph.");
if (authorityManifest?.capabilityCount !== ledger?.authoritativeCapabilityCount) errors.push("Readiness ledger capability count does not match the authority manifest.");
if (authorityManifest?.scenarioCount !== ledger?.requiredSyntheticScenarioCount) errors.push("Readiness ledger scenario count does not match the authority manifest.");

for (const flag of [
  "exactHeadCertified",
  "githubActionsEvidenceAvailable",
  "vercelApplicationBuildResultAvailable",
  "syntheticAuthorityPathsExecutedInProtectedRuntime",
]) {
  if (executionEvidence[flag] !== false) errors.push(`Execution evidence flag ${flag} must remain false until immutable evidence is attached.`);
}
if (executionEvidence.vercelConstraint !== "account_build_rate_limit") errors.push("Readiness ledger must record the current Vercel account build-rate-limit constraint.");
if (executionEvidence.exactHeadCertified && (!executionEvidence.githubActionsEvidenceAvailable || !executionEvidence.vercelApplicationBuildResultAvailable)) {
  errors.push("Exact-head certification cannot be true without both CI and application-build evidence.");
}
if (executionEvidence.syntheticAuthorityPathsExecutedInProtectedRuntime && !executionEvidence.exactHeadCertified) {
  errors.push("Protected-runtime conformance execution cannot be represented as complete before exact-head certification.");
}

const requiredDomains = new Map([
  ["public_institutional_surface", "implemented_public_safe"],
  ["structured_content_compilation", "implemented_public_safe"],
  ["quality_localization_review", "implemented_public_safe"],
  ["release_authority_isolation", "implemented_public_safe"],
  ["delivery_operations_continuity", "implemented_public_safe"],
  ["canonical_registry_dependency_dag", "implemented_public_safe"],
  ["synthetic_authority_conformance", "declared_not_executed"],
  ["exact_head_ci_certification", "evidence_unavailable"],
  ["branch_integration", "blocked_reconstruction_required"],
  ["clinical_content_release", "not_represented_publicly"],
  ["accessibility_conformance", "not_certified"],
  ["hospital_pilot", "not_authorized"],
  ["production_delivery", "prohibited"],
]);

const domainIds = domains.map((domain) => domain.id);
if (new Set(domainIds).size !== domainIds.length) errors.push("Readiness domain IDs must be unique.");
if (domains.length !== requiredDomains.size) errors.push(`Readiness ledger must contain exactly ${requiredDomains.size} domains.`);
for (const [domainId, requiredMaturity] of requiredDomains) {
  const domain = domains.find((candidate) => candidate.id === domainId);
  if (!domain) errors.push(`Missing readiness domain: ${domainId}.`);
  else if (domain.maturity !== requiredMaturity) errors.push(`Readiness domain ${domainId} must remain ${requiredMaturity}; found ${domain.maturity}.`);
}

const forbiddenMaturityTokens = ["approved", "certified", "deployed", "production_ready", "pilot_ready", "complete", "operational"];
for (const domain of domains) {
  if (!/^[a-z0-9_]+$/.test(domain.id ?? "")) errors.push(`Invalid readiness domain ID: ${domain.id}.`);
  if (!domain.remainingGate || domain.remainingGate.length < 20) errors.push(`Readiness domain ${domain.id} requires a specific remaining gate.`);
  const maturity = String(domain.maturity ?? "").toLowerCase();
  for (const token of forbiddenMaturityTokens) {
    if (maturity === token || maturity.includes(`${token}_`)) errors.push(`Readiness domain ${domain.id} overstates maturity with ${domain.maturity}.`);
  }
  if (!Array.isArray(domain.evidenceRefs)) errors.push(`Readiness domain ${domain.id} evidenceRefs must be an array.`);
  for (const evidenceRef of domain.evidenceRefs ?? []) {
    if (!/^(?:path|registry|linear):\/\//.test(evidenceRef)) errors.push(`Readiness domain ${domain.id} contains unsupported evidence reference: ${evidenceRef}.`);
    if (evidenceRef.startsWith("path://")) {
      const relativePath = evidenceRef.slice("path://".length);
      if (!exists(relativePath)) errors.push(`Readiness evidence path does not exist: ${relativePath}.`);
    }
    if (evidenceRef.startsWith("registry://")) {
      const capabilityId = evidenceRef.slice("registry://".length);
      if (!capabilityIds.has(capabilityId)) errors.push(`Readiness evidence references unknown capability: ${capabilityId}.`);
    }
    if (evidenceRef.startsWith("linear://") && !/^linear:\/\/AND-\d+$/.test(evidenceRef)) errors.push(`Invalid Linear evidence reference: ${evidenceRef}.`);
  }
}

const requiredBlockers = new Map([
  ["CAF-PE-BLOCKER-EXACT-HEAD-EVIDENCE", { severity: "critical", owner: "AND-18" }],
  ["CAF-PE-BLOCKER-BRANCH-RECONSTRUCTION", { severity: "critical", owner: "AND-20" }],
  ["CAF-PE-BLOCKER-PROTECTED-RUNTIME", { severity: "critical", owner: "AND-16" }],
  ["CAF-PE-BLOCKER-HUMAN-REVIEW", { severity: "critical", owner: "AND-17" }],
  ["CAF-PE-BLOCKER-CLINICAL-CONTENT", { severity: "critical", owner: "AND-5" }],
  ["CAF-PE-BLOCKER-ACCESSIBILITY", { severity: "high", owner: "AND-10" }],
  ["CAF-PE-BLOCKER-INTEGRATION", { severity: "high", owner: "AND-13" }],
  ["CAF-PE-BLOCKER-ORGANIZATION-OPERATIONS", { severity: "high", owner: "AND-19" }],
]);

const blockerIds = blockers.map((blocker) => blocker.id);
if (new Set(blockerIds).size !== blockerIds.length) errors.push("Readiness blocker IDs must be unique.");
if (blockers.length !== requiredBlockers.size) errors.push(`Readiness ledger must contain exactly ${requiredBlockers.size} open blockers.`);
for (const [blockerId, requirement] of requiredBlockers) {
  const blocker = blockers.find((candidate) => candidate.id === blockerId);
  if (!blocker) errors.push(`Missing readiness blocker: ${blockerId}.`);
  else {
    if (blocker.severity !== requirement.severity) errors.push(`Readiness blocker ${blockerId} must have severity ${requirement.severity}.`);
    if (blocker.ownerWorkItem !== requirement.owner) errors.push(`Readiness blocker ${blockerId} must be owned by ${requirement.owner}.`);
    if (!blocker.condition || blocker.condition.length < 25) errors.push(`Readiness blocker ${blockerId} requires a specific condition.`);
    if (!blocker.requiredResolution || blocker.requiredResolution.length < 25) errors.push(`Readiness blocker ${blockerId} requires a specific resolution.`);
  }
}

const requiredProhibitedClaims = [
  "clinically approved",
  "hospital deployed",
  "HIPAA compliant",
  "accessibility compliant",
  "EHR integrated",
  "production ready",
  "pilot ready",
  "improves outcomes",
  "reduces readmissions",
  "reduces emergency visits",
  "reduces costs",
  "prevents adverse events",
];
if (!Array.isArray(ledger?.allowedPublicClaims) || ledger.allowedPublicClaims.length < 4) errors.push("Readiness ledger requires bounded allowed public claims.");
if (!Array.isArray(ledger?.prohibitedPublicClaims)) errors.push("Readiness ledger requires prohibited public claims.");
for (const prohibitedClaim of requiredProhibitedClaims) {
  if (!ledger?.prohibitedPublicClaims?.includes(prohibitedClaim)) errors.push(`Readiness ledger missing prohibited public claim: ${prohibitedClaim}.`);
}

const allowedClaims = (ledger?.allowedPublicClaims ?? []).join(" ").toLowerCase();
for (const prohibitedClaim of requiredProhibitedClaims) {
  if (allowedClaims.includes(prohibitedClaim.toLowerCase())) errors.push(`Allowed public claims contain prohibited claim: ${prohibitedClaim}.`);
}
for (const requiredAllowedMarker of ["public-safe governed engineering architecture", "44 authoritative capabilities", "88 required synthetic conformance paths", "draft architecture source"]) {
  if (!allowedClaims.includes(requiredAllowedMarker.toLowerCase())) errors.push(`Allowed public claims missing required bounded marker: ${requiredAllowedMarker}.`);
}

if (!ledger?.completionRule?.includes("Production delivery remains prohibited")) errors.push("Readiness completion rule must keep production delivery prohibited until evidence closes critical blockers.");
if (!ledger?.completionRule?.includes("immutable, exact-version evidence")) errors.push("Readiness completion rule must require immutable exact-version evidence.");

const serializedLedger = JSON.stringify(ledger);
const populatedSensitivePatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /"(?:patientName|medicalRecordNumber|dateOfBirth|reviewerEmail|realHospitalContact|bloodThinnerDosage)"\s*:\s*"[^"\s][^"]*"/i,
  /"privateKey(?:Inline|Value|Pem)?"\s*:\s*"[^"\s][^"]*"/i,
];
for (const pattern of populatedSensitivePatterns) {
  if (pattern.test(serializedLedger)) errors.push(`Readiness ledger contains populated sensitive material matching ${pattern}.`);
}

if (errors.length > 0) {
  console.error("Patient Education readiness ledger check failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

const criticalBlockers = blockers.filter((blocker) => blocker.severity === "critical").length;
console.log(`Patient Education readiness ledger passed: ${domains.length} evidence-bounded domains, ${blockers.length} open blockers (${criticalBlockers} critical), 44 governed capabilities, 88 required synthetic paths, six reconstruction tranches, exact-head certification unavailable, hospital pilot not authorized, and production delivery prohibited.`);
