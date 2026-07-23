import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const PRODUCT_ID = "healthcare_compensation_benefits_decision_book";
const PRODUCT_VERSION = "3.0-web.1";
const STORE_KEY = `caf:premium:content:${PRODUCT_ID}:${PRODUCT_VERSION}`;
const EXPECTED_MODULE_IDS = [
  "pay-structure",
  "total-compensation",
  "medical-insurance",
  "dental-insurance",
  "vision-insurance",
  "hsa-fsa-hra",
  "retirement-plan",
  "retirement-election",
  "pto-leave",
  "protection-elections",
  "schedule-time",
  "repayment-risk",
  "career-fit",
  "integrated-decision",
];

function fail(message) {
  console.error(`Premium content seed failed: ${message}`);
  process.exit(1);
}

function validateProduct(product) {
  if (!product || typeof product !== "object") fail("the JSON root must be an object");
  if (product.id !== PRODUCT_ID) fail(`product id must be ${PRODUCT_ID}`);
  if (product.version !== PRODUCT_VERSION) fail(`product version must be ${PRODUCT_VERSION}`);
  if (product.sourceVersion !== "3.0") fail("sourceVersion must be 3.0");
  if (!Array.isArray(product.modules) || product.modules.length !== EXPECTED_MODULE_IDS.length) fail("exactly fourteen modules are required");

  const actualIds = product.modules.map((module) => module?.id);
  EXPECTED_MODULE_IDS.forEach((id, index) => {
    if (actualIds[index] !== id) fail(`module ${index + 1} must be ${id}`);
  });

  for (const module of product.modules) {
    const requiredStrings = ["number", "part", "title", "purpose", "orientation"];
    for (const field of requiredStrings) {
      if (typeof module[field] !== "string" || !module[field].trim()) fail(`${module.id}.${field} must be a non-empty string`);
    }
    const requiredArrays = ["framingQuestions", "comparisonFields", "actions", "professionalQuestions", "completionCriteria", "relatedModuleIds", "sourceIds"];
    for (const field of requiredArrays) {
      if (!Array.isArray(module[field])) fail(`${module.id}.${field} must be an array`);
    }
  }

  if (!Array.isArray(product.sources)) fail("sources must be an array");
  if (!Array.isArray(product.updateHistory)) fail("updateHistory must be an array");
  if (typeof product.limitation !== "string" || !product.limitation.trim()) fail("limitation must be a non-empty string");
}

const inputPath = process.argv[2];
if (!inputPath) fail("provide a private JSON path, e.g. node scripts/seed-premium-content.mjs private-product-content/healthcare-benefits-v3.json");

const redisUrl = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "").replace(/\/$/, "");
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";
if (!redisUrl || !redisToken) fail("Redis REST URL and token are required");

let product;
try {
  product = JSON.parse(await readFile(resolve(inputPath), "utf8"));
} catch (error) {
  fail(error instanceof Error ? error.message : "the private JSON file could not be read");
}

validateProduct(product);

const response = await fetch(redisUrl, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${redisToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(["SET", STORE_KEY, JSON.stringify(product)]),
});

const payload = await response.json().catch(() => ({}));
if (!response.ok || payload.error || payload.result !== "OK") fail(payload.error || `Redis returned HTTP ${response.status}`);

console.log(`Seeded ${PRODUCT_ID} ${PRODUCT_VERSION} to ${STORE_KEY}.`);
console.log("The source JSON remains local and must not be committed.");
