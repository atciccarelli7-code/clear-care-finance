import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import {
  BUSINESS_ROLES,
  SUPPLEMENTAL_ROUTE_ASSETS,
  classifyBusinessRole,
} from "./business-role-classification.mjs";

const SOURCE = "docs/audits/2026-08-03-directional-cta-route-inventory.csv";
const OUTPUT = "docs/audits/2026-08-03-free-paid-route-role-inventory.csv";
const SUMMARY = "docs/audits/2026-08-03-free-paid-route-role-inventory.md";
const EXPECTED_CANONICAL_ROUTES = 160;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const next = text[index + 1];

    if (quoted) {
      if (character === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        cell += character;
      }
      continue;
    }

    if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(cell);
      cell = "";
    } else if (character === "\n") {
      row.push(cell.replace(/\r$/, ""));
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }

  if (cell || row.length) {
    row.push(cell.replace(/\r$/, ""));
    rows.push(row);
  }

  if (quoted) throw new Error(`Unterminated quoted cell in ${SOURCE}`);
  if (rows.length < 2) throw new Error(`No route rows found in ${SOURCE}`);

  const [headers, ...data] = rows;
  return data.map((values, rowIndex) => {
    if (values.length !== headers.length) {
      throw new Error(
        `CSV column mismatch at data row ${rowIndex + 2}: expected ${headers.length}, found ${values.length}`,
      );
    }
    return Object.fromEntries(headers.map((header, columnIndex) => [header, values[columnIndex]]));
  });
}

const sourceRows = parseCsv(readFileSync(SOURCE, "utf8"));
if (sourceRows.length !== EXPECTED_CANONICAL_ROUTES) {
  throw new Error(
    `Business architecture baseline expected ${EXPECTED_CANONICAL_ROUTES} canonical routes; found ${sourceRows.length}. ` +
      "Regenerate the directional CTA inventory and explicitly classify any route change.",
  );
}

const seen = new Set();
const canonicalRows = sourceRows.map((row) => {
  if (seen.has(row.route)) throw new Error(`Duplicate route in ${SOURCE}: ${row.route}`);
  seen.add(row.route);
  return {
    route: row.route,
    route_class: row.route_class,
    audience: row.audience,
    current_title: row.primary_intent,
    current_promise: row.page_promise,
    ...classifyBusinessRole(row),
    source_scope: "canonical_public_route_inventory",
  };
});

const rows = [
  ...canonicalRows,
  ...SUPPLEMENTAL_ROUTE_ASSETS.map((row) => ({
    route: row.route,
    route_class: row.route_class,
    audience: row.audience,
    current_title: row.primary_intent,
    current_promise: "",
    business_role: row.business_role,
    public_access_decision: row.public_access_decision,
    flagship_relationship: row.flagship_relationship,
    phase_2_action: row.phase_2_action,
    rationale: row.rationale,
    verification_status: row.verification_status,
    source_scope: "supplemental_product_or_private_route",
  })),
];

const allowedRoles = new Set(Object.values(BUSINESS_ROLES));
for (const row of rows) {
  if (!allowedRoles.has(row.business_role)) {
    throw new Error(`Unclassified or invalid role for ${row.route}: ${row.business_role}`);
  }
  for (const field of [
    "public_access_decision",
    "flagship_relationship",
    "phase_2_action",
    "rationale",
    "verification_status",
  ]) {
    if (!String(row[field] ?? "").trim()) throw new Error(`Missing ${field} for ${row.route}`);
  }
}

const countBy = (field) => rows.reduce((counts, row) => {
  counts[row[field]] = (counts[row[field]] ?? 0) + 1;
  return counts;
}, {});
const roleCounts = countBy("business_role");
const freeCount = rows.filter((row) => row.business_role.startsWith("free_")).length;
const moduleCandidateCount = roleCounts[BUSINESS_ROLES.PAID_PRODUCT_MODULE_CANDIDATE] ?? 0;
const infrastructureCount = roleCounts[BUSINESS_ROLES.SHARED_PRODUCT_INFRASTRUCTURE] ?? 0;
const consolidationCount = roleCounts[BUSINESS_ROLES.CONSOLIDATION_CANDIDATE] ?? 0;
const failSafeCount = rows.filter((row) => row.verification_status.includes("requires") || row.verification_status.includes("fail_safe")).length;

const columns = [
  "route",
  "route_class",
  "audience",
  "current_title",
  "current_promise",
  "business_role",
  "public_access_decision",
  "flagship_relationship",
  "phase_2_action",
  "rationale",
  "verification_status",
  "source_scope",
];
const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csv = [
  columns.join(","),
  ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(",")),
].join("\n") + "\n";

const roleRows = Object.values(BUSINESS_ROLES)
  .map((role) => `| ${role} | ${roleCounts[role] ?? 0} |`)
  .join("\n");
const summary = `# CAF free/paid route-role inventory — August 3, 2026

This inventory classifies every route in the current 160-route canonical public inventory and ${SUPPLEMENTAL_ROUTE_ASSETS.length} supplemental product, account, private workspace, and legacy redirect routes.

The classifications are business roles, not immediate implementation instructions. Phase 1 changes no route, navigation, indexability, pricing, checkout, authentication, entitlement, or public content behavior.

## Portfolio summary

| Business role | Routes |
|---|---:|
${roleRows}

| Control measure | Count |
|---|---:|
| Canonical public routes classified | ${canonicalRows.length} |
| Supplemental product/private routes classified | ${SUPPLEMENTAL_ROUTE_ASSETS.length} |
| Total route assets classified | ${rows.length} |
| Routes retained in the free layer | ${freeCount} |
| Existing free assets whose logic may be reused inside the flagship | ${moduleCandidateCount} |
| Shared paid-product infrastructure routes | ${infrastructureCount} |
| Consolidation, repair, redirect, or removal candidates | ${consolidationCount} |
| Routes requiring verification before a destructive change | ${failSafeCount} |

## Governing interpretation

- Free resources explain bounded questions, supply official verification starting points, and complete single-purpose tasks.
- Paid value coordinates multiple inputs and benefit categories, preserves work, identifies missing information, compares scenarios, and produces a decision brief.
- A paid-module-candidate classification does not remove or paywall the existing public route. The current bounded version remains free; reusable logic can be coordinated inside the Open Enrollment Workspace.
- Medical-bill, Medicare, Medicaid, discharge, clinical-safety, eligibility, and urgent deadline resources remain in the free public-interest layer.
- The Healthcare Worker Benefits Decision System/Open Enrollment Workspace is the only visible paid flagship during validation.
- Checkout remains disabled.

## Consolidation posture

Phase 1 authorizes hierarchy and naming consolidation, not automatic URL deletion. Any redirect, merge, noindex, or removal must pass route-specific content, search, redirect, accessibility, and browser validation in Phase 2.

The generated row-level artifact is \`${OUTPUT}\`.
`;

const write = process.argv.includes("--write");
if (write) {
  mkdirSync("docs/audits", { recursive: true });
  writeFileSync(OUTPUT, csv);
  writeFileSync(SUMMARY, summary);
}

console.log(
  `Business architecture coverage PASS: ${canonicalRows.length} canonical + ${SUPPLEMENTAL_ROUTE_ASSETS.length} supplemental = ${rows.length} route assets; ` +
    `${freeCount} free-layer, ${moduleCandidateCount} paid-module candidates, ${infrastructureCount} infrastructure, ${consolidationCount} consolidation candidates.`,
);
if (!write) console.log(`Run with --write to refresh ${OUTPUT} and ${SUMMARY}.`);
