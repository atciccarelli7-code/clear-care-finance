import { readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");
const app = read("src/App.tsx");
const vercel = read("vercel.json");
const vercelConfig = JSON.parse(vercel);
const sitemap = read("public/sitemap.xml");
const envExample = read(".env.example");
const failures = [];

const unsafeFlags = ["PREMIUM_ENTITLEMENT_BYPASS", "PREMIUM_MOCK_AUTH_ENABLED", "VITE_PREMIUM_DEV_MOCK_AUTH"];
for (const flag of unsafeFlags) if (process.env[flag] === "true") failures.push(`${flag} must not be true during a production build.`);
if (process.env.PREMIUM_CHECKOUT_ENABLED === "true") {
  const required = ["SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "STRIPE_PRICE_HEALTHCARE_WORKER_BENEFITS_DECISION_SYSTEM"];
  for (const name of required) if (!process.env[name]?.trim()) failures.push(`Checkout is enabled without ${name}.`);
  if (process.env.STRIPE_ENVIRONMENT !== "test" && process.env.PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED !== "true") failures.push("Checkout must remain in Stripe test mode until explicitly authorized.");
}
for (const name of Object.keys(process.env)) {
  if (/^VITE_.*(?:SECRET|SERVICE_ROLE|STRIPE_SECRET|WEBHOOK)/i.test(name)) failures.push(`Server-only secret variable uses a public VITE_ prefix: ${name}.`);
}
if (!app.includes("<ProtectedPremiumRoutes") || !app.includes('path="/app/benefits-decision"')) failures.push("Protected /app route wrapper is missing.");
const privateHeaderSources = ["/app", "/app/(.*)", "/account", "/sign-in", "/access-processing", "/api/(.*)"];
const privateHeadersAreComplete = privateHeaderSources.every((source) => {
  const entry = vercelConfig.headers?.find((candidate) => candidate.source === source);
  const headers = new Map(entry?.headers?.map((header) => [header.key.toLowerCase(), header.value]));
  return headers.get("cache-control") === "private, no-store, max-age=0"
    && headers.get("x-robots-tag") === "noindex, nofollow, noarchive";
});
if (!privateHeadersAreComplete) failures.push("Private route noindex and no-store headers are missing.");
const appEntryRedirect = vercelConfig.redirects?.some((redirect) =>
  redirect.source === "/app"
  && redirect.destination === "/app/benefits-decision"
  && redirect.permanent === false,
);
if (!appEntryRedirect) failures.push("The /app entry redirect is missing.");
const workspaceRewrite = vercelConfig.rewrites?.some((rewrite) =>
  rewrite.source === "/app/benefits-decision/:workspaceId"
  && rewrite.destination === "/app/benefits-decision",
);
if (!workspaceRewrite) failures.push("The private workspace deep-link rewrite is missing.");
if (vercelConfig.rewrites?.some((rewrite) => rewrite.destination === "/index.html")) {
  failures.push("A clean-URL deployment must not rewrite private routes to /index.html.");
}
if (sitemap.includes("/app") || sitemap.includes("/account") || sitemap.includes("/sign-in") || sitemap.includes("/access-processing")) failures.push("A private route appears in the public sitemap.");
if (sitemap.includes("/products/healthcare-worker-benefits-decision-pack")) failures.push("The retired product route appears in the public sitemap.");
if (!sitemap.includes("/products/healthcare-worker-benefits-decision-system")) failures.push("The canonical public product route is missing from the sitemap.");
if (/VITE_(?:SUPABASE_SERVICE_ROLE_KEY|STRIPE_SECRET_KEY|STRIPE_WEBHOOK_SECRET)/.test(envExample)) failures.push(".env.example exposes a server secret through VITE_.");

if (failures.length) {
  console.error("Premium release safety check failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Premium release safety checks passed.");
