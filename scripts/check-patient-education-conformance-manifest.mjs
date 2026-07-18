import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const manifestPath = path.join(process.cwd(), "public/patient-education/demo/synthetic-governed-conformance-manifest.json");

const requiredCapabilities = [
  "content-contract",
  "package-contract",
  "evidence-governance",
  "asset-compiler",
  "bundle-compiler",
  "distribution-compiler",
  "localization-contract",
  "institution-overlay-contract",
  "institution-overlay-compiler",
  "quality-contract",
  "quality-engine",
  "release-registry",
  "release-state-machine",
  "release-authorization",
  "integrity-manifest",
  "governance-ledger",
  "change-risk",
  "privacy-boundary",
  "governed-delivery-pipeline",
  "delivery-adapters",
  "distribution-control",
  "pilot-analytics",
  "authority-policy",
  "organization-isolation",
  "evidence-freshness",
  "exception-policy",
  "reproducibility-manifest",
  "signing-authority",
  "schema-migration",
  "dependency-graph",
  "operational-observability",
  "incident-response",
  "resilience-retention",
  "audit-export",
  "review-workflow",
  "governance-profile",
  "private-authority-decision",
  "conformance-package",
];

const requiredScenarioTypes = [
  "success",
  "validation_failure",
  "tamper_detection",
  "cross_organization_block",
  "expired_or_stale_block",
  "separation_of_duties_block",
  "privacy_block",
  "incident_escalation",
  "suspension_or_recall",
  "restore_failure",
  "migration_failure",
  "policy_drift_block",
  "bundle_withheld",
];

const errors = [];
if (!fs.existsSync(manifestPath)) {
  errors.push(`Missing public conformance manifest: ${manifestPath}`);
} else {
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (error) {
    errors.push(`Conformance manifest is not valid JSON: ${error.message}`);
  }
  if (manifest) {
    if (manifest.schemaVersion !== "1.0.0") errors.push("Conformance manifest schemaVersion must be 1.0.0.");
    if (manifest.status !== "public_safe_technical_proof") errors.push("Conformance manifest status must preserve its public-safe boundary.");
    if (manifest.syntheticOrganizationKey !== "SYNTHETIC-HOSPITAL") errors.push("Conformance manifest must use the synthetic organization key.");
    for (const [field, expected] of [
      ["suitableForPatientCare", false],
      ["containsClinicalPatientInstructions", false],
      ["containsPatientData", false],
      ["containsRealOrganizationData", false],
      ["containsReviewerIdentity", false],
    ]) {
      if (manifest[field] !== expected) errors.push(`Conformance manifest ${field} must be ${expected}.`);
    }
    if (!Array.isArray(manifest.capabilities)) errors.push("Conformance manifest capabilities must be an array.");
    else {
      if (new Set(manifest.capabilities).size !== manifest.capabilities.length) errors.push("Conformance manifest capabilities must be unique.");
      if (manifest.capabilityCount !== manifest.capabilities.length) errors.push("Conformance manifest capabilityCount does not match its capability array.");
      const missing = requiredCapabilities.filter((capability) => !manifest.capabilities.includes(capability));
      const unexpected = manifest.capabilities.filter((capability) => !requiredCapabilities.includes(capability));
      if (missing.length > 0) errors.push(`Conformance manifest is missing capability IDs: ${missing.join(", ")}.`);
      if (unexpected.length > 0) errors.push(`Conformance manifest contains unknown capability IDs: ${unexpected.join(", ")}.`);
    }
    if (!Array.isArray(manifest.requiredScenarioTypes)) errors.push("Conformance manifest requiredScenarioTypes must be an array.");
    else {
      const missing = requiredScenarioTypes.filter((scenarioType) => !manifest.requiredScenarioTypes.includes(scenarioType));
      if (missing.length > 0) errors.push(`Conformance manifest is missing scenario types: ${missing.join(", ")}.`);
    }
    const requirements = manifest.executionRequirement ?? {};
    if (requirements.positiveScenarioPerCapability !== 1) errors.push("Conformance manifest must require one positive scenario per capability.");
    if (requirements.adversarialScenarioPerCapability !== 1) errors.push("Conformance manifest must require one adversarial scenario per capability.");
    if (requirements.allScenariosMustPass !== true) errors.push("Conformance manifest must require every scenario to pass.");
    if (requirements.executionEvidenceRequired !== true) errors.push("Conformance manifest must require execution evidence.");
    if (requirements.exactVersionBindingRequired !== true) errors.push("Conformance manifest must require exact-version binding.");
    if (requirements.syntheticDataOnly !== true) errors.push("Conformance manifest must require synthetic data only.");
    if (!Array.isArray(manifest.publicClaimsBoundary) || manifest.publicClaimsBoundary.length < 3) errors.push("Conformance manifest requires an explicit public claims boundary.");
    const serialized = JSON.stringify(manifest).toLowerCase();
    for (const prohibited of ["patient name", "medical record number", "private key", "reviewer email", "real hospital contact"]) {
      if (serialized.includes(prohibited)) errors.push(`Conformance manifest contains prohibited phrase: ${prohibited}.`);
    }
  }
}

if (errors.length > 0) {
  console.error("Patient Education public conformance manifest check failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Patient Education public conformance manifest passed: ${requiredCapabilities.length} governed capabilities and ${requiredScenarioTypes.length} required scenario types.`);
