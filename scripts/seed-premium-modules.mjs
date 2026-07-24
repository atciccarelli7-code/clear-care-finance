import { readFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const fail = (message) => {
  console.error(`Premium module seed blocked: ${message}`);
  process.exit(1);
};
const input = process.argv[2];
if (!input) fail("provide an ignored JSON path under private-premium-content/.");
const root = path.resolve(import.meta.dirname, "..");
const absolute = path.resolve(root, input);
const allowedRoot = path.join(root, "private-premium-content");
if (!absolute.startsWith(`${allowedRoot}${path.sep}`)) fail("the seed file must be under private-premium-content/.");
const url = process.env.SUPABASE_URL?.trim();
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (!url || !serviceRole) fail("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
const status = process.env.PREMIUM_CONTENT_SEED_STATUS || "test";
if (!["private_build", "test", "active"].includes(status)) fail("PREMIUM_CONTENT_SEED_STATUS must be private_build, test, or active.");
if (status === "active" && process.env.PREMIUM_CONTENT_SEED_PRODUCTION_AUTHORIZED !== "true") fail("active seeding requires explicit production authorization.");
const payload = JSON.parse(readFileSync(absolute, "utf8"));
if (!Array.isArray(payload.modules) || payload.productKey !== "healthcare-worker-benefits-decision-system") fail("invalid product payload.");
const requiredKeys = ["define-decision", "compare-compensation", "value-benefits", "health-plan-exposure", "retirement-benefits", "schedule-career", "verification-list", "decision-brief"];
if (requiredKeys.some((key) => !payload.modules.some((module) => module?.key === key))) fail("all eight authorized modules are required.");
const supabase = createClient(url, serviceRole, { auth: { persistSession: false, autoRefreshToken: false } });
const rows = payload.modules.map((definition) => ({
  product_key: payload.productKey,
  module_key: definition.key,
  status,
  definition,
  updated_at: new Date().toISOString(),
}));
const { error } = await supabase.from("premium_modules").upsert(rows, { onConflict: "product_key,module_key,status" });
if (error) fail("the protected content store rejected the seed.");
console.log(`Seeded ${rows.length} protected ${status} modules for ${payload.productKey}.`);
