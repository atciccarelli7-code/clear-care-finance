import { readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");
const app = read("src/App.tsx");
const phase3App = read("src/Phase3ProductApp.tsx");
const siteSeoMeta = read("src/lib/siteSeoMeta.ts");
const productPage = read("src/pages/premium/BenefitsDecisionOfferPage.tsx");
const demandOffer = read("src/components/premium/PreCommerceDemandOffer.tsx");
const testCheckoutPanel = read("src/components/premium/PremiumTestCheckoutPanel.tsx");
const authProvider = read("src/premium/auth/AuthProvider.tsx");
const signInPage = read("src/pages/premium/SignInPage.tsx");
const premiumApiClient = read("src/premium/apiClient.ts");
const premiumContracts = read("src/premium/contracts.ts");
const documentPage = read("src/pages/premium/BenefitsDocumentStagingPage.tsx");
const localSource = read("src/premium/localBenefitsSource.ts");
const documentConfig = read("api/_lib/premiumConfig.ts");
const sitemapGenerator = read("scripts/generate-sitemap.mjs");
const vercel = read("vercel.json");
const vercelConfig = JSON.parse(vercel);
const sitemap = read("public/sitemap.xml");
const envExample = read(".env.example");
const failures = [];

const unsafeFlags = ["PREMIUM_ENTITLEMENT_BYPASS", "PREMIUM_MOCK_AUTH_ENABLED", "VITE_PREMIUM_DEV_MOCK_AUTH"];
for (const flag of unsafeFlags) if (process.env[flag] === "true") failures.push(`${flag} must not be true during a production build.`);

const checkoutEnabled = process.env.PREMIUM_CHECKOUT_ENABLED === "true";
const authenticationEnabled = process.env.PREMIUM_AUTH_ENABLED === "true";
const entitlementsEnabled = process.env.PREMIUM_ENTITLEMENTS_ENABLED === "true";
const workspacePersistenceEnabled = process.env.PREMIUM_WORKSPACE_PERSISTENCE_ENABLED === "true";
const testCheckoutUiEnabled = process.env.VITE_PREMIUM_TEST_CHECKOUT_DISPLAY_ENABLED === "true";
const supabaseConfigured = ["SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"].every((name) => Boolean(process.env[name]?.trim()));
const stripeTestConfigured = process.env.STRIPE_ENVIRONMENT === "test"
  && ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "STRIPE_PRICE_HEALTHCARE_WORKER_BENEFITS_DECISION_SYSTEM"].every((name) => Boolean(process.env[name]?.trim()));
const protectedTestCheckoutPreview = process.env.VERCEL_ENV === "preview"
  && checkoutEnabled
  && authenticationEnabled
  && entitlementsEnabled
  && workspacePersistenceEnabled
  && supabaseConfigured
  && stripeTestConfigured
  && process.env.PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED !== "true";

if (checkoutEnabled) {
  const required = ["SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "STRIPE_PRICE_HEALTHCARE_WORKER_BENEFITS_DECISION_SYSTEM"];
  for (const name of required) if (!process.env[name]?.trim()) failures.push(`Checkout is enabled without ${name}.`);
  if (process.env.STRIPE_ENVIRONMENT !== "test" && process.env.PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED !== "true") failures.push("Checkout must remain in Stripe test mode until explicitly authorized.");
}
if (testCheckoutUiEnabled && !protectedTestCheckoutPreview) {
  failures.push("The browser test Checkout panel may appear only in a fully configured protected Vercel preview using Stripe test mode.");
}
if (process.env.VERCEL_ENV === "production" && testCheckoutUiEnabled) {
  failures.push("The Stripe test Checkout panel must never be compiled into production.");
}

const documentIntakeEnabled = process.env.PREMIUM_DOCUMENT_INTAKE_ENABLED === "true";
const documentExtractionEnabled = process.env.PREMIUM_DOCUMENT_EXTRACTION_ENABLED === "true";
const documentUiEnabled = process.env.VITE_PREMIUM_DOCUMENT_INTAKE_ENABLED === "true";
const documentMode = process.env.PREMIUM_DOCUMENT_INTAKE_MODE || "disabled";
const realDocumentProcessingAuthorized = process.env.PREMIUM_REAL_DOCUMENT_PROCESSING_AUTHORIZED === "true";
const protectedSyntheticPreview = process.env.VERCEL_ENV === "preview" && documentMode === "synthetic_only";
if (realDocumentProcessingAuthorized) failures.push("Real visitor document processing is not authorized by this release.");
if (documentIntakeEnabled && !protectedSyntheticPreview) failures.push("Document intake may be enabled only in a protected synthetic-only Vercel preview.");
if (documentExtractionEnabled && (!documentIntakeEnabled || !protectedSyntheticPreview)) failures.push("Document extraction requires protected synthetic-only preview intake.");
if (documentUiEnabled && !protectedSyntheticPreview) failures.push("The legacy server document staging flag may be enabled only in a protected synthetic-only Vercel preview.");
if ((documentIntakeEnabled || documentExtractionEnabled || documentUiEnabled) && process.env.PREMIUM_REAL_DOCUMENT_PROCESSING_AUTHORIZED !== "false") {
  failures.push("Synthetic preview document processing must explicitly keep real-document authorization false.");
}

for (const name of Object.keys(process.env)) {
  if (/^VITE_.*(?:SECRET|SERVICE_ROLE|STRIPE_SECRET|WEBHOOK)/i.test(name)) failures.push(`Server-only secret variable uses a public VITE_ prefix: ${name}.`);
}
if (!app.includes("<ProtectedPremiumRoutes") || !app.includes('path="/app/benefits-decision"')) failures.push("Protected /app route wrapper is missing.");
if (!app.includes('path="/app/benefits-decision/:workspaceId/documents"') || !app.includes("<BenefitsDocumentStagingPage")) failures.push("The protected local source-assistant route is missing.");
const privateHeaderSources = [
  "/app",
  "/app/(.*)",
  "/account",
  "/sign-in",
  "/access-processing",
  "/api/(.*)",
];
const privateHeadersAreComplete = privateHeaderSources.every((source) => {
  const entry = vercelConfig.headers?.find((candidate) => candidate.source === source);
  const headers = new Map(entry?.headers?.map((header) => [header.key.toLowerCase(), header.value]));
  return headers.get("cache-control") === "private, no-store, max-age=0"
    && headers.get("x-robots-tag") === "noindex, nofollow, noarchive";
});
if (!privateHeadersAreComplete) failures.push("Private route noindex/no-store headers are missing.");
const appEntryRedirect = vercelConfig.redirects?.some((redirect) =>
  redirect.source === "/app"
  && redirect.destination === "/app/benefits-decision"
  && redirect.permanent === false,
);
if (!appEntryRedirect) failures.push("The /app entry redirect is missing.");
const documentStagingRewrite = vercelConfig.rewrites?.some((rewrite) =>
  rewrite.source === "/app/benefits-decision/:workspaceId/documents"
  && rewrite.destination === "/app/benefits-decision",
);
if (!documentStagingRewrite) failures.push("The private source-assistant deep-link rewrite is missing.");
const workspaceRewrite = vercelConfig.rewrites?.some((rewrite) =>
  rewrite.source === "/app/benefits-decision/:workspaceId"
  && rewrite.destination === "/app/benefits-decision",
);
if (!workspaceRewrite) failures.push("The private workspace deep-link rewrite is missing.");
const medicareWorkspaceRewrite = vercelConfig.rewrites?.some((rewrite) =>
  rewrite.source === "/app/medicare-coverage-decision/:workspaceId"
  && rewrite.destination === "/app/medicare-coverage-decision",
);
if (!medicareWorkspaceRewrite) failures.push("The private Medicare workspace deep-link rewrite is missing.");
if (vercelConfig.rewrites?.some((rewrite) => rewrite.destination === "/index.html")) {
  failures.push("A clean-URL deployment must not rewrite private routes to /index.html.");
}
if (sitemap.includes("/app") || sitemap.includes("/account") || sitemap.includes("/sign-in") || sitemap.includes("/access-processing")) failures.push("A private route appears in the public sitemap.");
if (sitemap.includes("/products/healthcare-worker-benefits-decision-pack")) failures.push("The retired product route appears in the public sitemap.");

const canonicalProductRoute = "/products/healthcare-worker-benefits-decision-system";
if (!sitemapGenerator.includes(canonicalProductRoute)) failures.push("The canonical public product route is missing from sitemap generation.");
const productHeaderEntry = vercelConfig.headers?.find((candidate) => candidate.source === canonicalProductRoute);
if (productHeaderEntry?.headers?.some((header) => header.key.toLowerCase() === "x-robots-tag" && /noindex/i.test(header.value))) {
  failures.push("The canonical public product route must not receive a noindex response header.");
}
const productPageIsParked = vercelConfig.redirects?.some((redirect) => redirect.source === canonicalProductRoute);
if (productPageIsParked) failures.push("The Phase 3 product route must render the public decision system rather than redirect.");
const retiredRouteRedirectsToOffer = vercelConfig.redirects?.some((redirect) =>
  redirect.source === "/products/healthcare-worker-benefits-decision-pack"
  && redirect.destination === canonicalProductRoute
  && redirect.permanent === true,
);
if (!retiredRouteRedirectsToOffer) failures.push("The retired product route must redirect to the canonical public decision system.");
if (!phase3App.includes("BENEFITS_DECISION_OFFER_META") || !phase3App.includes("BENEFITS_DECISION_OFFER_PATH")) failures.push("The Phase 3 application must use the canonical product metadata source.");
if (!siteSeoMeta.includes(`"${canonicalProductRoute}"`)) failures.push("The canonical public product route metadata is missing.");
if (!siteSeoMeta.includes("robots: indexed")) failures.push("The canonical public product metadata must be indexable.");
if (!siteSeoMeta.includes('title: "Healthcare Worker Benefits Decision System"')) failures.push("The canonical public product metadata title is missing.");
if (!siteSeoMeta.includes('"@type": "WebApplication"') || !siteSeoMeta.includes("isAccessibleForFree: true")) failures.push("The public WebApplication structured-data boundary is missing.");
if (!productPage.includes("Start the guided system") || !productPage.includes("Progress stays in this browser")) failures.push("The public Benefits Decision System must present a complete browser-local workflow.");
const leakedPublicReleaseState = ["$29", "early-access", "prelaunch", "checkout remains", "paid access remain off", "Working end-to-end pilot", "Try the guided pilot"];
for (const phrase of leakedPublicReleaseState) if (productPage.includes(phrase)) failures.push(`The public Benefits Decision System leaks internal release-state language: ${phrase}`);
if (productPage.includes("PAID_PRODUCTS") || productPage.includes("recordBenefitsOfferView")) failures.push("The product route must not record an offer view before the post-result offer renders.");
if (!demandOffer.includes("Free today and staying free") || !demandOffer.includes("Proposed $29 workspace")) failures.push("The pre-commerce offer must distinguish the complete free system from proposed paid value.");
if (!demandOffer.includes("priceCommitment") || !demandOffer.includes("emailConsent") || !demandOffer.includes("Separate email consent")) failures.push("The pre-commerce form must retain separate explicit price and email confirmations.");
if (!demandOffer.includes("No card. No checkout. No charge. No reservation. No obligation.")) failures.push("The pre-commerce offer must state the no-commerce boundary before commitment.");
if (demandOffer.includes("PremiumTestCheckoutPanel") || demandOffer.includes("createCheckoutSession")) failures.push("The public demand offer must remain isolated from Stripe test Checkout.");

const testCheckoutTrustPhrases = [
  "Protected test-mode certification",
  "Test mode only · No real charge · No production access",
  "Card entry remains on Stripe-hosted Checkout",
  "The server—not this page—selects the product, Stripe price, success URL, cancel URL, and entitlement metadata",
];
for (const phrase of testCheckoutTrustPhrases) if (!testCheckoutPanel.includes(phrase)) failures.push(`The test Checkout panel is missing its trust boundary: ${phrase}`);
if (!envExample.includes("VITE_PREMIUM_TEST_CHECKOUT_DISPLAY_ENABLED=false")) failures.push("The test Checkout browser flag must remain disabled by default.");
if (!premiumApiClient.includes('body: JSON.stringify({ productKey })') || !premiumApiClient.includes("type PremiumProductKey")) failures.push("The Checkout client must submit only an allowlisted registered product key.");
if (/priceId|successUrl|cancelUrl/.test(premiumApiClient.split("createCheckoutSession")[1]?.split("export const getPremiumModule")[0] || "")) failures.push("The browser Checkout client must not submit a price or redirect URL.");
if (!premiumContracts.includes('url.hostname === "checkout.stripe.com"')) failures.push("The Checkout response contract must restrict redirects to Stripe-hosted Checkout.");
if (!authProvider.includes("allowedAuthRedirectPaths") || !authProvider.includes("safePremiumAuthRedirectPath")) failures.push("Magic-link return paths must use an explicit allowlist.");
if (!signInPage.includes('searchParams.get("next") === "purchase"') || !signInPage.includes("safePremiumAuthRedirectPath")) failures.push("The purchase sign-in return must use the allowlisted redirect helper.");

const localSourceTrustPhrases = [
  "Nothing is uploaded",
  "Raw text is discarded",
  "You confirm every value",
  "No source text or file was retained",
  "Written plan documents and the plan administrator remain controlling",
];
for (const phrase of localSourceTrustPhrases) if (!documentPage.includes(phrase)) failures.push(`The browser-local source assistant is missing its trust boundary: ${phrase}`);
if (!documentPage.includes("scanSensitiveData") || !documentPage.includes("extractSyntheticBenefitsFacts")) failures.push("The browser-local source assistant must scan before extracting candidates.");
if (/documentIntakeApi|uploadBenefitDocument|signedToken|UploadCloud/.test(documentPage)) failures.push("The commercial v1 source assistant must not invoke server document upload APIs.");
if (!localSource.includes("Only user-confirmed structured values were saved") || !localSource.includes("raw text and file contents were not retained")) failures.push("The structured workspace mapping must preserve the no-source-retention assumption.");
if (!documentConfig.includes("PREMIUM_REAL_DOCUMENT_PROCESSING_AUTHORIZED") || !documentConfig.includes("synthetic_only")) failures.push("The dormant server document-processing release gates are incomplete.");

if (/VITE_(?:SUPABASE_SERVICE_ROLE_KEY|STRIPE_SECRET_KEY|STRIPE_WEBHOOK_SECRET)/.test(envExample)) failures.push(".env.example exposes a server secret through VITE_.");
const safeDefaults = [
  "VITE_PREMIUM_TEST_CHECKOUT_DISPLAY_ENABLED=false",
  "VITE_PREMIUM_DOCUMENT_INTAKE_ENABLED=false",
  "PREMIUM_DOCUMENT_INTAKE_ENABLED=false",
  "PREMIUM_DOCUMENT_EXTRACTION_ENABLED=false",
  "PREMIUM_DOCUMENT_INTAKE_MODE=disabled",
  "PREMIUM_REAL_DOCUMENT_PROCESSING_AUTHORIZED=false",
  "PREMIUM_CHECKOUT_ENABLED=false",
  "PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED=false",
];
for (const setting of safeDefaults) if (!envExample.includes(setting)) failures.push(`.env.example is missing the safe default: ${setting}`);

if (failures.length) {
  console.error("Premium release safety check failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Premium release safety checks passed.");
