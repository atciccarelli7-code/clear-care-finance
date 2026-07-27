import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const value = (name) => process.env[name]?.trim() || "";
const enabled = (name) => value(name) === "true";
const configured = (...names) => names.every((name) => Boolean(value(name)));
const stripeEnvironment = value("STRIPE_ENVIRONMENT") || "disabled";
const stripeKeyFor = (mode) => value("STRIPE_SECRET_KEY").startsWith(`sk_${mode}_`) || value("STRIPE_SECRET_KEY").startsWith(`rk_${mode}_`);
const stripeTest = stripeEnvironment === "test" && stripeKeyFor("test");
const stripeLive = stripeEnvironment === "live" && stripeKeyFor("live");
const webhook = value("STRIPE_WEBHOOK_SECRET").startsWith("whsec_");
const product = value("STRIPE_PRODUCT_HEALTHCARE_WORKER_BENEFITS_DECISION_SYSTEM").startsWith("prod_");
const price = value("STRIPE_PRICE_HEALTHCARE_WORKER_BENEFITS_DECISION_SYSTEM").startsWith("price_");
const supabase = configured("SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY");
const migrationPath = path.join(root, "supabase/migrations/202607240001_premium_system_foundation.sql");
const stripeHardeningMigrationPath = path.join(root, "supabase/migrations/202607270002_stripe_prelaunch_hardening.sql");
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
const stripeObjects = webhook && product && price;
const violations = [
  ...(enabled("PREMIUM_ENTITLEMENT_BYPASS") ? ["Development entitlement bypass is enabled."] : []),
  ...(enabled("PREMIUM_MOCK_AUTH_ENABLED") ? ["Mock authentication is enabled."] : []),
  ...(enabled("VITE_PREMIUM_DEV_MOCK_AUTH") ? ["Public development mock authentication is enabled."] : []),
  ...(!["disabled", "test", "live"].includes(stripeEnvironment) ? ["Stripe environment is invalid."] : []),
  ...(enabled("PREMIUM_CHECKOUT_ENABLED") && !enabled("PREMIUM_AUTH_ENABLED") ? ["Checkout requires authentication."] : []),
  ...(enabled("PREMIUM_CHECKOUT_ENABLED") && !enabled("PREMIUM_ENTITLEMENTS_ENABLED") ? ["Checkout requires entitlement enforcement."] : []),
  ...(enabled("PREMIUM_CHECKOUT_ENABLED") && !((stripeTest || stripeLive) && stripeObjects && supabase) ? ["Checkout is enabled without complete secure Stripe and Supabase configuration."] : []),
  ...(enabled("PREMIUM_CHECKOUT_ENABLED") && stripeEnvironment === "live" && !enabled("PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED") ? ["Live checkout lacks explicit production authorization."] : []),
];
const report = {
  supabaseConfigured: supabase,
  authenticationConfigured: enabled("PREMIUM_AUTH_ENABLED") && supabase,
  databaseMigrationsApplied: "unknown",
  migrationPresent: existsSync(migrationPath),
  stripeHardeningMigrationPresent: existsSync(stripeHardeningMigrationPath),
  stripeTestKeyConfigured: stripeTest,
  stripeLiveKeyConfigured: stripeLive,
  webhookSecretConfigured: webhook,
  stripeProductMapped: product,
  stripePriceMapped: price,
  entitlementsEnabled: enabled("PREMIUM_ENTITLEMENTS_ENABLED"),
  checkoutEnabled: enabled("PREMIUM_CHECKOUT_ENABLED"),
  productionCheckoutAuthorized: enabled("PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED"),
  productionMode: stripeEnvironment,
  premiumContentBoundaryCheck: boundaryStatus,
  currentReleaseStatus: supabase ? "foundation configured; external payment validation required" : "foundation only",
  safe: violations.length === 0,
  violations,
};

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("Healthcare Worker Benefits Decision System readiness");
  console.log("-----------------------------------------------------");
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
