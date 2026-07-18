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
  /(^|\/)clinical-review(\/|$)/i,
  /(^|\/)hospital-customizations?(\/|$)/i,
  /(^|\/)client-deliverables?(\/|$)/i,
  /(^|\/)source-registers?(\/|$)/i,
  /(^|\/)[^/]*evidence-dossier[^/]*\.(md|json|ya?ml|tsx?|jsx?)$/i,
  /(^|\/)[^/]*hospital-customization[^/]*\.(md|json|ya?ml|tsx?|jsx?)$/i,
  /(^|\/)[^/]*clinical-approval[^/]*\.(md|json|ya?ml|tsx?|jsx?)$/i,
];

const prohibitedPublicContentPatterns = [
  { pattern: /BEGIN PRIVATE CAF PATIENT EDUCATION CONTENT/i, label: "private-content block marker" },
  { pattern: /CAF_PRIVATE_GUIDE_PAYLOAD/i, label: "private guide payload marker" },
  { pattern: /CAF_CLIENT_CUSTOMIZATION_PAYLOAD/i, label: "client customization payload marker" },
];

const walk = async (directory, relative = "") => {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (ignoredDirectories.has(entry.name)) continue;
    const nextRelative = path.posix.join(relative, entry.name);
    const absolute = path.join(directory, entry.name);

    if (forbiddenPathPatterns.some((pattern) => pattern.test(nextRelative))) {
      failures.push(`Public repository contains a protected institutional path: ${nextRelative}`);
    }

    if (entry.isDirectory()) {
      await walk(absolute, nextRelative);
      continue;
    }

    if (ignoredFiles.has(nextRelative)) continue;
    if (!allowedTextExtensions.has(path.extname(entry.name).toLowerCase())) continue;
    const source = await readFile(absolute, "utf8");
    for (const rule of prohibitedPublicContentPatterns) {
      if (rule.pattern.test(source)) failures.push(`${nextRelative} contains a prohibited ${rule.label}.`);
    }
  }
};

await walk(root);

const expectedPublicFiles = [
  "src/pages/PatientEducationSystemsPage.tsx",
  "src/components/organizations/PatientEducationPilotBuilder.tsx",
  "src/data/patientEducationOffering.ts",
  "src/lib/patientEducationPilot.ts",
];

const expectedSources = [];
for (const relativePath of expectedPublicFiles) {
  try {
    expectedSources.push(await readFile(path.join(root, relativePath), "utf8"));
  } catch {
    failures.push(`Missing required public product architecture file: ${relativePath}`);
  }
}

const combinedPublicArchitecture = expectedSources.join("\n");
if (!/development-stage|in development/i.test(combinedPublicArchitecture)) {
  failures.push("The public product architecture must preserve a visible development-stage boundary.");
}
if (!/PHI|patient information|patient-specific/i.test(combinedPublicArchitecture)) {
  failures.push("The public product architecture must preserve an explicit patient-information boundary.");
}
if (!/not (saved|transmitted)|remain(s)? in this browser tab|not added to the URL/i.test(combinedPublicArchitecture)) {
  failures.push("The fixed-choice pilot builder must preserve a visible no-storage or no-transmission boundary.");
}

if (failures.length > 0) {
  console.error("Institutional IP boundary checks failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Institutional IP boundary checks passed.");
