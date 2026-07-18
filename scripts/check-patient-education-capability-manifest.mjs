import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(root, "public/patient-education/capability-manifest.json");
const failures = [];
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

assert(manifest.schemaVersion === "1.0.0", "Capability manifest must use schemaVersion 1.0.0.");
assert(manifest.productId === "CAF-PES", "Capability manifest must use the CAF-PES product identifier.");
assert(manifest.status === "development_stage", "Capability manifest must preserve development-stage status.");
assert(manifest.publicClassification === "public_product_architecture", "Capability manifest must remain classified as public product architecture.");
assert(manifest.privacyPosture?.phiRequired === false, "Capability manifest must state that PHI is not required.");
assert(manifest.privacyPosture?.patientAccountRequired === false, "Capability manifest must state that patient accounts are not required.");
assert(manifest.privacyPosture?.freeTextPilotIntake === false, "Capability manifest must keep public pilot intake free-text disabled.");
assert(manifest.privacyPosture?.answerLevelAnalytics === false, "Capability manifest must keep answer-level analytics disabled.");

const expectedGates = [
  "evidence",
  "clinical_review",
  "health_literacy",
  "accessibility",
  "patient_testing",
  "institutional_localization",
];
assert(JSON.stringify(manifest.releaseGates) === JSON.stringify(expectedGates), "Capability manifest release gates must remain complete and ordered.");

assert(Array.isArray(manifest.flagshipModules) && manifest.flagshipModules.length === 5, "Capability manifest must contain exactly five initial flagship modules.");
const moduleIds = manifest.flagshipModules?.map((module) => module.id) ?? [];
assert(new Set(moduleIds).size === moduleIds.length, "Capability manifest flagship module IDs must be unique.");
assert(manifest.flagshipModules?.some((module) => module.id === "blood_thinners" && module.status === "evidence_development"), "Blood thinners must remain the evidence-development flagship module.");
assert(manifest.flagshipModules?.every((module) => ["high", "critical"].includes(module.riskTier)), "Initial flagship modules must retain high or critical risk classification.");

assert(Array.isArray(manifest.packageAssetTypes) && manifest.packageAssetTypes.length >= 15, "Capability manifest must expose the coordinated multi-asset package model.");
assert(Array.isArray(manifest.claimsBoundary) && manifest.claimsBoundary.length >= 3, "Capability manifest must include explicit claims boundaries.");
assert(Array.isArray(manifest.prohibitedPublicPayloads) && manifest.prohibitedPublicPayloads.includes("patient_identifiers"), "Capability manifest must prohibit patient identifiers.");
assert(manifest.prohibitedPublicPayloads?.includes("evidence_dossiers"), "Capability manifest must keep evidence dossiers out of the public payload.");
assert(manifest.prohibitedPublicPayloads?.includes("hospital_customizations"), "Capability manifest must keep hospital customizations out of the public payload.");

const serialized = JSON.stringify(manifest);
const forbiddenKeyPatterns = [
  /patientName/i,
  /dateOfBirth/i,
  /medicalRecordNumber/i,
  /mrn/i,
  /reviewerName/i,
  /reviewerEmail/i,
  /hospitalPhone/i,
  /clientName/i,
  /contractValue/i,
];
for (const pattern of forbiddenKeyPatterns) {
  assert(!pattern.test(serialized), `Capability manifest contains a forbidden public data key matching ${pattern}.`);
}

const clinicalInstructionPatterns = [
  /take \d+/i,
  /mg (?:once|twice|three times|daily)/i,
  /call 911 if/i,
  /increase (?:the )?oxygen/i,
  /flush (?:the )?tube with \d+/i,
  /skip (?:the )?dose/i,
];
for (const pattern of clinicalInstructionPatterns) {
  assert(!pattern.test(serialized), `Capability manifest contains actionable clinical instruction content matching ${pattern}.`);
}

if (failures.length > 0) {
  console.error("Patient Education Systems capability manifest checks failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Patient Education Systems capability manifest checks passed.");
