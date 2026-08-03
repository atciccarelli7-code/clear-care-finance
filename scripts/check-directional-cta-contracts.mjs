import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const fail = (message) => {
  throw new Error(`Directional CTA contract failed: ${message}`);
};

const toolData = read("src/data/tools.ts");
const articleRoutes = read("src/lib/directionalCtaRoutes.ts");
const analytics = read("src/lib/directionalCta.ts");
const layout = read("src/components/layout/Layout.tsx");

const componentKeys = [...toolData.matchAll(/componentKey:\s*"([^"]+)"/g)].map((match) => match[1]);
const labelBlock = articleRoutes.match(/TOOL_START_LABELS:[\s\S]*?\n};/)?.[0] ?? "";
for (const componentKey of componentKeys) {
  if (!new RegExp(`\\b${componentKey}:\\s*"`).test(labelBlock)) fail(`missing outcome label for ${componentKey}`);
}
if (new Set(componentKeys).size !== componentKeys.length) fail("tool component keys must be unique");
if (/Open the tool/i.test(read("src/pages/ToolPage.tsx"))) fail("generic ToolPage primary label remains");

const priorityBlock = articleRoutes.match(/PRIORITY_DIRECTIONAL_ARTICLE_SLUGS = new Set\(\[([\s\S]*?)\]\)/)?.[1] ?? "";
const prioritySlugs = [...priorityBlock.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
if (prioritySlugs.length < 3) fail("priority article set is unexpectedly small");
if (new Set(prioritySlugs).size !== prioritySlugs.length) fail("priority article slugs must be unique");

for (const property of ["cta_id", "origin_path", "destination_path", "audience_segment", "action_tier", "decision_category", "placement_id"]) {
  if (!analytics.includes(property)) fail(`analytics contract is missing ${property}`);
}
if (!analytics.includes("availabilityStatus !== \"available\"")) fail("availability must fail closed");
if (!analytics.includes("FIXED_ID_PATTERN")) fail("fixed CTA identifiers must be validated");

if (!layout.includes("getRouteEndcapOwner")) fail("Layout must use the route endcap owner resolver");
for (const legacyBoolean of ["showMedicalBillProductPathway", "showBenefitsCommandCenterEntry", "showNavigatorContext"]) {
  if (layout.includes(legacyBoolean)) fail(`Layout still independently renders ${legacyBoolean}`);
}

console.log(`Directional CTA contracts passed: ${componentKeys.length} tool labels, ${prioritySlugs.length} priority articles, one global endcap owner.`);
