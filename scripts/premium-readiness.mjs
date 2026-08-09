import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const value = (name) => process.env[name]?.trim() || "";
const enabled = (name) => value(name) === "true";
const configured = (...names) => names.every((name) => Boolean(value(name)));
const stripeEnvironment = value("STRIPE_ENVIRONMENT") || "disabled";
const stripeTest = stripeEnvironment === "test" && value("STRIPE_SECRET_KEY").startsWith("sk_test_");
const webhook = value("STRIPE_WEBHOOK_SECRET").startsWith("whsec_");
const prices = {
  "healthcare-worker-benefits-decision-system": value("STRIPE_PRICE_HEALTHCARE_WORKER_BENEFITS_DECISION_SYSTEM").startsWith("price_"),
  "medicare-coverage-decision-system": value("STRIPE_PRICE_MEDICARE_COVERAGE_DECISION_SYSTEM").startsWith("price_"),
};
const anyPrice = Object.values(prices).some(Boolean);
const supabase = configured("SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY");
const migrationPath = path.join(root, "supabase/migrations/202607240001_premium_system_foundation.sql");
const medicareMigrationPath = path.join(root, "supabase/migrations/20260809120000_medicare_multi_product_platform.sql");
const distPath = path.join(root, "dist");
const boundaryStatus = (() => {
  if (!existsSync(distPath)) return "not_built";
  const sentinels = [
    "CAF_PREMIUM_PROTECTED_SENTINEL_7b2c91e4",
    "CAF_PREMIUM_DEVELOPMENT_CONTENT_SENTINEL_84f6c1d9",
    "SUPABASE_SERVICE_ROLE_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
  ];
  const walk = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
  const failed = walk(distPath)
    .filter((file) => /\.(?:js|css|html|json|xml|map)$/i.test(file))
    .some((file) => sentinels.some((sentinel) => readFileSync(file, "utf8").includes(sentinel)));
  return failed ? "fail" : "pass";
})();
const violations = [
  ...(enabled("PREMIUM_ENTITLEMENT_BYPASS") ? ["Development entitlement bypass is enabled."] : []),
  ...(enabled("PREMIUM_MOCK_AUTH_ENABLED") ? ["Mock authentication is enabled."] : []),
  ...(enabled("VITE_PREMIUM_DEV_MOCK_AUTH") ? ["Public development mock authentication is enabled."] : []),
  ...(enabled("PREMIUM_CHECKOUT_ENABLED") && !enabled("PREMIUM_ENTITLEMENTS_ENABLED") ? ["Checkout requires entitlement enforcement."] : []),
  ...(enabled("PREMIUM_CHECKOUT_ENABLED") && !(stripeTest && webhook && anyPrice && supabase) ? ["Checkout is enabled without complete secure test configuration for any registered product."] : []),
  ...(stripeEnvironment === "live" && !enabled("PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED") ? ["Stripe live mode lacks explicit production authorization."] : []),
];
const report = {
  supabaseConfigured: supabase,
  authenticationConfigured: enabled("PREMIUM_AUTH_ENABLED") && supabase,
  databaseMigrationsApplied: "unknown",
  migrationPresent: existsSync(migrationPath),
  medicareProductMigrationPresent: existsSync(medicareMigrationPath),
  stripeTestKeyConfigured: stripeTest,
  webhookSecretConfigured: webhook,
  stripePricesMapped: prices,
  entitlementsEnabled: enabled("PREMIUM_ENTITLEMENTS_ENABLED"),
  checkoutEnabled: enabled("PREMIUM_CHECKOUT_ENABLED"),
  productionMode: stripeEnvironment,
  premiumContentBoundaryCheck: boundaryStatus,
  currentReleaseStatus: supabase ? "foundation configured; external validation required" : "foundation only",
  safe: violations.length === 0,
  violations,
};

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("CAF multi-product decision-system readiness");
  console.log("-------------------------------------------");
  for (const [key, item] of Object.entries(report)) {
    if (key === "violations") continue;
    console.log(`${key}: ${typeof item === "boolean" ? (item ? "yes" : "no") : item}`);
  }
  if (violations.length) {
    console.log("\nBlocking safety violations:");
    violations.forEach((violation) => console.log(`- ${violation}`));
  } else {
    console.log("\nNo unsafe activation flags detected.");
  }
}

if (process.argv.includes("--strict") && violations.length) process.exit(1);
