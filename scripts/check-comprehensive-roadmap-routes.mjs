import { readFile } from "node:fs/promises";
import path from "node:path";
import { repositoryRoot } from "./seo-route-utils.mjs";

const distDir = path.join(repositoryRoot, "dist");
const routes = [
  { path: "/for-organizations", heading: "Healthcare education people can use without handing over their private information." },
  { path: "/for-organizations/patient-education-systems", heading: "Hospital-to-home guidance designed around what patients and caregivers actually have to do next." },
  { path: "/tools/benefits-change-detector", heading: "Find the benefit changes that deserve your attention before you re-enroll." },
  { path: "/tools/state-medicaid-long-term-care-router", heading: "State Medicaid and Long-Term Care Program Router" },
  { path: "/tools/childcare-benefits-decision-guide", heading: "Dependent Care FSA and Childcare Benefits Decision Guide" },
  { path: "/tools/roth-vs-traditional-decision-helper", heading: "Roth vs Traditional Decision Helper" },
  { path: "/tools/observation-vs-inpatient-status-guide", heading: "Observation vs Inpatient Status Guide" },
  { path: "/tools/medicare-plan-verification-checklist", heading: "Medicare Plan Verification Checklist" },
  { path: "/tools/debt-vs-retirement-router", heading: "Debt vs Retirement Decision Router" },
];

const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

for (const route of routes) {
  const relative = `${route.path.replace(/^\//, "")}.html`;
  let html = "";
  try {
    html = await readFile(path.join(distDir, relative), "utf8");
  } catch {
    failures.push(`${route.path} was not prerendered to ${relative}.`);
    continue;
  }

  assert(html.includes(`<h1`) && html.includes(route.heading), `${route.path} must prerender its visible H1.`);
  assert(
    html.includes(`<link rel="canonical" href="https://communityacquiredfinance.com${route.path}"`),
    `${route.path} must use the production canonical URL.`,
  );
  assert(/<meta name="robots" content="index, follow, max-image-preview:large"/i.test(html), `${route.path} must remain indexable.`);
  assert(/application\/ld\+json/.test(html), `${route.path} must include visible-content-supported structured data.`);
  assert(!html.includes("googlesyndication.com/pagead"), `${route.path} must remain ad-free in prerendered output.`);
  assert(!/[?&](income|asset|diagnosis|provider|employer|medicare_number)=/i.test(html), `${route.path} must not prerender sensitive query parameters.`);
}

if (failures.length) {
  console.error("Comprehensive roadmap route checks failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Comprehensive roadmap route checks passed for ${routes.length} focused journeys.`);
