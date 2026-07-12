import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => readFile(path.join(root, relative), "utf8");
const failures = [];
const requiredRouteFreshness = ["/medicare-care-costs", "/medicare-care-costs/turning-65", "/student-loans", "/open-enrollment", "/tools/employer-benefits-action-plan", "/tools/medicare-medicaid-eligibility-check", "/tools/prior-authorization-next-step-guide", "/insurance/hospital-discharge-coverage", "/insurance/medical-bill-review-toolkit"];

const [articlesModel, articlePage, routeFreshness, turningPage, packageJsonRaw] = await Promise.all([
  read("src/data/articles.ts"),
  read("src/pages/ArticlePage.tsx"),
  read("src/components/shared/RouteFreshness.tsx"),
  read("src/pages/Turning65MedicarePage.tsx"),
  read("package.json"),
]);

for (const field of ["publishedAt", "lastReviewedAt", "rulesEffectiveAt", "nextReviewAt", "timeSensitive", "reviewScope", "updateNote"]) {
  if (!articlesModel.includes(`${field}?:`)) failures.push(`Article model is missing ${field}.`);
}
if (!articlePage.includes("<ContentFreshness")) failures.push("ArticlePage must render ContentFreshness.");
for (const route of requiredRouteFreshness) if (!routeFreshness.includes(`\"${route}\"`)) failures.push(`Route freshness metadata missing for ${route}.`);
if (!turningPage.includes("lastReviewedAt={TURNING_65_LAST_REVIEWED}")) failures.push("Turning 65 pathway must display its official review date.");

const packageJson = JSON.parse(packageJsonRaw);
if (!packageJson.scripts?.["content:freshness-check"]) failures.push("package.json must define content:freshness-check.");
if (!String(packageJson.scripts?.build ?? "").includes("check-content-freshness.mjs")) failures.push("Production build must run the content freshness check.");

const dataFiles = (await readdir(path.join(root, "src/data"))).filter((name) => name.endsWith(".ts"));
for (const name of dataFiles) {
  const content = await read(`src/data/${name}`);
  const timeSensitiveBlocks = content.match(/timeSensitive:\s*true[\s\S]{0,500}/g) ?? [];
  for (const block of timeSensitiveBlocks) if (!/lastReviewedAt:\s*["']\d{4}-\d{2}-\d{2}["']/.test(block)) failures.push(`${name} contains timeSensitive: true without a nearby ISO lastReviewedAt.`);
}

if (failures.length) {
  console.error("Content freshness checks failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Content freshness checks passed.");
