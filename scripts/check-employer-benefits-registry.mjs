import fs from "node:fs";
import path from "node:path";

const registryPath = path.resolve(process.cwd(), "src/data/employer-benefits-registry.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const errors = [];
const allowedAvailability = new Set(["source_collection_needed", "partial_sources", "ready_for_guided_entry"]);
const allowedPackageStatuses = new Set([
  "source_collection_needed",
  "source_collection_in_progress",
  "review_in_progress",
  "ready_for_guided_entry",
  "retired",
]);
const allowedReviewStatuses = new Set([
  "official_source_located",
  "metadata_reviewed",
  "facts_extracted",
  "verified_for_guidance",
]);
const allowedDocumentTypes = new Set([
  "benefits_guide",
  "medical_sbc",
  "employee_rate_sheet",
  "retirement_summary",
  "annual_change_notice",
  "formulary",
  "provider_network",
  "other",
]);

if (registry.schemaVersion !== 1) errors.push("Registry schemaVersion must equal 1.");
if (!Array.isArray(registry.employers) || registry.employers.length < 1) errors.push("Registry must contain at least one employer.");
if (!Array.isArray(registry.coreDocumentTypes) || registry.coreDocumentTypes.length < 5) errors.push("Registry must define the core document types.");

const employerSlugs = new Set();
const packageIds = new Set();
const sourceIds = new Set();

for (const employer of registry.employers ?? []) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(employer.slug ?? "")) errors.push(`Invalid employer slug: ${employer.slug}`);
  if (employerSlugs.has(employer.slug)) errors.push(`Duplicate employer slug: ${employer.slug}`);
  employerSlugs.add(employer.slug);
  if (typeof employer.name !== "string" || employer.name.trim().length < 2) errors.push(`Employer ${employer.slug} is missing a name.`);
  if (!allowedAvailability.has(employer.availability)) errors.push(`Employer ${employer.slug} has invalid availability ${employer.availability}.`);
  if (!Number.isInteger(employer.defaultPlanYear) || employer.defaultPlanYear < 2024 || employer.defaultPlanYear > 2035) {
    errors.push(`Employer ${employer.slug} has invalid defaultPlanYear.`);
  }
  if (!Array.isArray(employer.employeeClasses) || employer.employeeClasses.length < 1) errors.push(`Employer ${employer.slug} needs at least one employee class.`);
  if (!Array.isArray(employer.packages) || employer.packages.length < 1) errors.push(`Employer ${employer.slug} needs at least one plan package.`);

  const employeeClassIds = new Set();
  for (const employeeClass of employer.employeeClasses ?? []) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(employeeClass.id ?? "")) errors.push(`Employer ${employer.slug} has invalid employee class ${employeeClass.id}.`);
    if (employeeClassIds.has(employeeClass.id)) errors.push(`Employer ${employer.slug} has duplicate employee class ${employeeClass.id}.`);
    employeeClassIds.add(employeeClass.id);
  }

  for (const benefitsPackage of employer.packages ?? []) {
    if (packageIds.has(benefitsPackage.id)) errors.push(`Duplicate package id: ${benefitsPackage.id}`);
    packageIds.add(benefitsPackage.id);
    if (!allowedPackageStatuses.has(benefitsPackage.status)) errors.push(`Package ${benefitsPackage.id} has invalid status ${benefitsPackage.status}.`);
    if (!Number.isInteger(benefitsPackage.planYear) || benefitsPackage.planYear < 2024 || benefitsPackage.planYear > 2035) {
      errors.push(`Package ${benefitsPackage.id} has invalid planYear.`);
    }

    const sourceUrls = new Set();
    for (const source of benefitsPackage.sources ?? []) {
      if (sourceIds.has(source.id)) errors.push(`Duplicate source id: ${source.id}`);
      sourceIds.add(source.id);
      if (sourceUrls.has(source.url)) errors.push(`Package ${benefitsPackage.id} has duplicate source URL ${source.url}.`);
      sourceUrls.add(source.url);
      if (!allowedDocumentTypes.has(source.documentType)) errors.push(`Source ${source.id} has invalid document type ${source.documentType}.`);
      if (!allowedReviewStatuses.has(source.reviewStatus)) errors.push(`Source ${source.id} has invalid review status ${source.reviewStatus}.`);

      let parsed;
      try {
        parsed = new URL(source.url);
      } catch {
        errors.push(`Source ${source.id} has an invalid URL.`);
        continue;
      }
      if (parsed.protocol !== "https:") errors.push(`Source ${source.id} must use HTTPS.`);
      const host = parsed.hostname.toLowerCase();
      const officialDomain = String(source.officialDomain ?? "").toLowerCase();
      if (!(host === officialDomain || host.endsWith(`.${officialDomain}`))) {
        errors.push(`Source ${source.id} host ${host} does not match official domain ${officialDomain}.`);
      }
      if (source.reviewStatus === "verified_for_guidance" && benefitsPackage.status !== "ready_for_guided_entry") {
        errors.push(`Source ${source.id} cannot be verified for guidance while package ${benefitsPackage.id} is not ready.`);
      }
    }
  }
}

for (const documentType of registry.coreDocumentTypes ?? []) {
  if (!allowedDocumentTypes.has(documentType)) errors.push(`Unknown core document type: ${documentType}`);
}

if (errors.length) {
  console.error("Employer benefits registry check failed:\n" + errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

const sourceCount = registry.employers.flatMap((employer) => employer.packages.flatMap((benefitsPackage) => benefitsPackage.sources)).length;
console.log(`Employer benefits registry check passed: ${registry.employers.length} employers, ${packageIds.size} packages, ${sourceCount} sources.`);
