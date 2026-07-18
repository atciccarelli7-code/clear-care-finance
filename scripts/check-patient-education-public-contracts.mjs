import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const loadJson = async (relativePath) => JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
const failures = [];

const files = {
  capability: "public/patient-education/capability-manifest.json",
  descriptorSchema: "public/patient-education/schemas/public-package-descriptor-v1.schema.json",
  bundleSchema: "public/patient-education/schemas/controlled-preview-bundle-v1.schema.json",
  demoBundle: "public/patient-education/demo/controlled-preview-bundle.json",
};

const [capability, descriptorSchema, bundleSchema, demoBundle] = await Promise.all(Object.values(files).map(loadJson));

const prohibitedKeys = new Set([
  "reviewerIdentityRef",
  "reviewerName",
  "reviewerEmail",
  "patientName",
  "dateOfBirth",
  "medicalRecordNumber",
  "diagnosis",
  "medication",
  "patientOrder",
  "hospitalCustomization",
  "contract",
  "price",
  "pricing",
]);

const inspectKeys = (value, location = "root") => {
  if (Array.isArray(value)) {
    value.forEach((item, index) => inspectKeys(item, `${location}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (prohibitedKeys.has(key)) failures.push(`${location}.${key} is prohibited in public patient-education contracts.`);
    inspectKeys(child, `${location}.${key}`);
  }
};

for (const [label, value] of Object.entries({ capability, descriptorSchema, bundleSchema, demoBundle })) {
  if (value.schemaVersion && value.schemaVersion !== "1.0.0") failures.push(`${label} must use schemaVersion 1.0.0.`);
  inspectKeys(value, label);
}

if (descriptorSchema.$schema !== "https://json-schema.org/draft/2020-12/schema") failures.push("Public package descriptor must use JSON Schema 2020-12.");
if (!descriptorSchema.$id?.endsWith("/patient-education/schemas/public-package-descriptor-v1.schema.json")) failures.push("Public package descriptor has an unexpected $id.");
if (!bundleSchema.$id?.endsWith("/patient-education/schemas/controlled-preview-bundle-v1.schema.json")) failures.push("Controlled preview bundle has an unexpected $id.");
if (bundleSchema.properties?.packageDescriptor?.$ref !== "./public-package-descriptor-v1.schema.json") failures.push("Controlled preview schema must reference the public package descriptor schema.");

if (demoBundle.schemaVersion !== "1.0.0") failures.push("Demo bundle must use schemaVersion 1.0.0.");
if (demoBundle.mode !== "controlled_preview") failures.push("Demo bundle must remain controlled_preview only.");
if (!/^CAF-PE-[A-Z0-9-]+-v\d+\.\d+\.\d+-controlled_preview$/.test(demoBundle.bundleId ?? "")) failures.push("Demo bundleId is invalid.");
if (!/^CAF-PE-[A-Z0-9-]+$/.test(demoBundle.packageDescriptor?.packageId ?? "")) failures.push("Demo packageId is invalid.");
if (demoBundle.packageDescriptor?.status === "pilot_ready" || demoBundle.packageDescriptor?.status === "released") failures.push("Public demo bundle must not imply pilot-ready or released status.");

const gates = demoBundle.packageDescriptor?.releaseGateSummary ?? [];
const requiredGates = new Set(["evidence", "clinical_review", "health_literacy", "accessibility", "patient_testing", "institutional_localization"]);
if (gates.length !== requiredGates.size || gates.some((gate) => !requiredGates.has(gate.gate))) failures.push("Demo bundle must contain exactly the six public release gates.");

const artifactIndex = demoBundle.artifactIndex ?? [];
if (artifactIndex.length === 0) failures.push("Demo bundle must include at least one artifact metadata entry.");
const artifactPaths = artifactIndex.map((artifact) => artifact.path);
const checksums = artifactIndex.map((artifact) => artifact.checksum);
if (new Set(artifactPaths).size !== artifactPaths.length) failures.push("Demo artifact paths must be unique.");
if (new Set(checksums).size !== checksums.length) failures.push("Demo artifact checksums must be unique.");
if (checksums.some((checksum) => !/^fnv1a-[a-f0-9]{8}$/.test(checksum))) failures.push("Demo artifact checksums must use fnv1a-xxxxxxxx format.");

const previewAssetIds = new Set((demoBundle.packageDescriptor?.assets ?? []).filter((asset) => asset.publicPreviewAvailable).map((asset) => asset.assetId));
if (artifactIndex.some((artifact) => !previewAssetIds.has(artifact.assetId))) failures.push("Demo artifacts may reference only assets marked publicPreviewAvailable.");

const requiredWithheld = [
  "restricted_clinical_instruction_assets",
  "patient_specific_fields",
  "phi_capable_fields",
  "evidence_dossiers",
  "reviewer_identity_records",
  "hospital_customizations",
  "contracts_and_pricing",
  "client_deliverables",
];
if (requiredWithheld.some((category) => !demoBundle.withheldCategories?.includes(category))) failures.push("Demo bundle is missing one or more required withheld categories.");

const registryPaths = new Set((capability.contractRegistry ?? []).map((entry) => entry.path));
for (const requiredPath of [
  "/patient-education/schemas/public-package-descriptor-v1.schema.json",
  "/patient-education/schemas/controlled-preview-bundle-v1.schema.json",
  "/patient-education/demo/controlled-preview-bundle.json",
]) {
  if (!registryPaths.has(requiredPath)) failures.push(`Capability manifest must register ${requiredPath}.`);
}

if (failures.length > 0) {
  console.error("Patient education public contract checks failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Patient education public contract checks passed for ${artifactIndex.length} demo artifact entries.`);
