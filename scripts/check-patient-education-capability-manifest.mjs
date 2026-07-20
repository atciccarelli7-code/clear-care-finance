import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(path.join(root, "public/patient-education/capability-manifest.json"), "utf8"));
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

assert(manifest.schemaVersion === "2.0.0", "Capability manifest must use schemaVersion 2.0.0.");
assert(manifest.programId === "CAF-PES", "Capability manifest must use the CAF-PES program identifier.");
assert(manifest.status === "paused_future_option", "Institutional patient education must remain paused_future_option.");
assert(manifest.publicClassification === "institutional_archive_boundary", "Manifest must be classified as an institutional archive boundary.");
assert(manifest.activeConsumerProgram?.route === "/patients-families/hospital-guide", "Manifest must identify the canonical consumer guide hub.");
assert(manifest.activeConsumerProgram?.guideFamilies?.length === 5, "Manifest must identify exactly five consumer guide families.");

const institutional = manifest.institutionalAsset ?? {};
assert(institutional.activeSales === false, "Institutional sales must be inactive.");
assert(institutional.activePilot === false || institutional.activePilot === undefined, "Institutional pilot activity must be inactive.");
assert(institutional.activeBuyerIntake === false, "Institutional buyer intake must be inactive.");
assert(institutional.activeReviewerRecruitment === false, "Institutional reviewer recruitment must be inactive.");
assert(institutional.patientUseApproved === false, "Institutional patient use must remain unapproved.");
assert(institutional.pilotReady === false, "Institutional package must not be pilot-ready.");
assert(institutional.externalHumanApprovalsComplete === false, "External human approvals must remain incomplete.");
assert(/^caf-pe-/i.test(institutional.candidate ?? ""), "Controlled candidate identifier is missing.");
assert(/^[a-f0-9]{64}$/.test(institutional.controlledSourceBundleSha256 ?? ""), "Controlled source-bundle SHA-256 is invalid.");

const safety = manifest.publicSafetyBoundary ?? {};
for (const key of [
  "phiCollected",
  "patientAccountRequired",
  "personalizedClinicalAdvice",
  "exactMedicationDosingPublished",
  "productSpecificMissedDoseRulesPublished",
  "personalizedEmergencyTriagePublished",
  "hospitalApprovalClaimed",
  "independentMedicalReviewClaimed",
]) assert(safety[key] === false, `Public safety boundary ${key} must remain false.`);

const serialized = JSON.stringify(manifest);
for (const pattern of [/patientName/i, /dateOfBirth/i, /medicalRecordNumber/i, /reviewerEmail/i, /contractValue/i]) {
  assert(!pattern.test(serialized), `Capability manifest contains forbidden public data matching ${pattern}.`);
}

if (failures.length) {
  console.error("Patient education capability manifest checks failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Paused institutional manifest and active consumer guide capability checks passed.");
