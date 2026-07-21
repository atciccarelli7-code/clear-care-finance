import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const load = (relativePath) => readFile(path.join(root, relativePath), "utf8");

const [manifestText, guideData, hubPage, redirects] = await Promise.all([
  load("public/patient-education/capability-manifest.json"),
  load("src/data/consumerPatientGuideArticles.ts"),
  load("src/pages/HospitalPatientGuidePage.tsx"),
  load("vercel.json"),
]);

const manifest = JSON.parse(manifestText);
const redirectConfig = JSON.parse(redirects);
const assert = (condition, message) => { if (!condition) failures.push(message); };

assert(manifest.status === "paused_future_option", "Institutional program must remain paused_future_option.");
assert((guideData.match(/slug: "/g) ?? []).length === 5, "Consumer guide data must contain exactly five guide articles.");
assert(hubPage.includes("Choose one immediate need"), "Consumer hub must include the fixed-choice immediate-need selector.");
assert(hubPage.includes("fixed choices stay in this browser session") && hubPage.includes("No name, diagnosis, policy number, claim detail, or free-text medical information is requested"), "Guide selector must state local-session behavior and its no-sensitive-input boundary.");
assert(!hubPage.includes("Build a pilot"), "Consumer hub must not include an institutional pilot CTA.");
assert(!hubPage.includes("design partner"), "Consumer hub must not include a design-partner CTA.");

for (const required of [
  "/for-organizations/patient-education-systems",
  "/for-organizations/patient-education-systems/blood-thinner-readiness",
]) {
  assert(redirectConfig.redirects?.some((entry) => entry.source === required && entry.permanent === true), `Missing permanent redirect for ${required}.`);
}

for (const pattern of [
  /does not provide product-specific doses/i,
  /does not supply dosing/i,
  /do not change oxygen flow/i,
  /no independent physician or pharmacist review is claimed/i,
]) assert(pattern.test(guideData), `Consumer guide public contract is missing boundary ${pattern}.`);

for (const pattern of [/patientName/i, /dateOfBirth/i, /medicalRecordNumber/i, /memberId/i, /claimNumber/i]) {
  assert(!pattern.test(hubPage), `Consumer hub contains prohibited patient-data field matching ${pattern}.`);
}

try {
  await access(path.join(root, "public/patient-education/demo/blood-thinner-readiness-proof.json"));
  failures.push("Public institutional blood-thinner proof payload must be removed.");
} catch {
  // Expected: controlled proof payload is no longer public.
}

if (failures.length) {
  console.error("Consumer patient education public contract checks failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Consumer patient guide public contract checks passed.");
