import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const ignoredDirectories = new Set([".git", "dist", "node_modules", "playwright-report", "test-results"]);
const ignoredFiles = new Set(["scripts/check-institutional-ip-boundary.mjs"]);
const allowedTextExtensions = new Set([".css", ".html", ".js", ".jsx", ".json", ".md", ".mjs", ".ts", ".tsx", ".txt", ".yml", ".yaml"]);

const forbiddenPathPatterns = [
  /(^|\/)\.caf-private(\/|$)/i,
  /(^|\/)private-guides?(\/|$)/i,
  /(^|\/)evidence-dossiers?(\/|$)/i,
  /(^|\/)hospital-customizations?(\/|$)/i,
  /(^|\/)client-deliverables?(\/|$)/i,
  /(^|\/)source-registers?(\/|$)/i,
];
const prohibitedPublicContentPatterns = [
  /BEGIN PRIVATE CAF PATIENT EDUCATION CONTENT/i,
  /CAF_PRIVATE_GUIDE_PAYLOAD/i,
  /CAF_CLIENT_CUSTOMIZATION_PAYLOAD/i,
];

const walk = async (directory, relative = "") => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) continue;
    const nextRelative = path.posix.join(relative, entry.name);
    const absolute = path.join(directory, entry.name);
    if (forbiddenPathPatterns.some((pattern) => pattern.test(nextRelative))) failures.push(`Protected institutional path in public repository: ${nextRelative}`);
    if (entry.isDirectory()) { await walk(absolute, nextRelative); continue; }
    if (ignoredFiles.has(nextRelative) || !allowedTextExtensions.has(path.extname(entry.name).toLowerCase())) continue;
    const source = await readFile(absolute, "utf8");
    for (const pattern of prohibitedPublicContentPatterns) if (pattern.test(source)) failures.push(`${nextRelative} contains prohibited private-content material.`);
  }
};

await walk(root);

const requiredFiles = [
  "docs/b2b-patient-education-paused-archive-manifest.md",
  "docs/patient-guide-consumer-architecture.md",
  "docs/patient-guide-editorial-governance.md",
  "src/pages/HospitalPatientGuidePage.tsx",
  "src/pages/ForOrganizationsPage.tsx",
  "public/patient-education/capability-manifest.json",
];
const sources = {};
for (const relativePath of requiredFiles) {
  try { sources[relativePath] = await readFile(path.join(root, relativePath), "utf8"); }
  catch { failures.push(`Missing required consumer conversion boundary file: ${relativePath}`); }
}

const archive = sources["docs/b2b-patient-education-paused-archive-manifest.md"] ?? "";
const organizationPage = sources["src/pages/ForOrganizationsPage.tsx"] ?? "";
const hub = sources["src/pages/HospitalPatientGuidePage.tsx"] ?? "";
const manifest = sources["public/patient-education/capability-manifest.json"] ?? "";

if (!/PAUSED — FUTURE OPTION|paused future option|paused_future_option/i.test(`${archive}\n${manifest}`)) failures.push("Institutional program must preserve an explicit paused future-option state.");
if (!/not currently offering a hospital pilot/i.test(organizationPage)) failures.push("Organization page must state that the hospital pilot is not currently offered.");
if (!/Nothing is submitted, stored on a server/i.test(hub)) failures.push("Consumer guide finder must preserve a visible no-submission boundary.");
if (!/No hospital, reviewer, clinician, insurer, attorney, employer, or regulator has approved/i.test(organizationPage)) failures.push("Organization page must preserve the no-approval boundary.");

if (failures.length) {
  console.error("Institutional archive and consumer boundary checks failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Institutional archive and consumer boundary checks passed.");
