export type CapabilityState = "configured" | "disabled" | "missing" | "ready_test" | "ready_production" | "invalid";

const value = (name: string) => process.env[name]?.trim() || "";
const enabled = (name: string) => value(name) === "true";
const isProduction = () => process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";

export const getPremiumConfig = () => {
  const siteUrl = value("PUBLIC_APP_URL") || value("PUBLIC_SITE_URL") || "https://communityacquiredfinance.com";
  const supabaseUrl = value("SUPABASE_URL");
  const supabaseAnonKey = value("SUPABASE_ANON_KEY");
  const supabaseServiceRoleKey = value("SUPABASE_SERVICE_ROLE_KEY");
  const stripeEnvironment = value("STRIPE_ENVIRONMENT") || "disabled";
  const stripeSecretKey = value("STRIPE_SECRET_KEY");
  const stripeWebhookSecret = value("STRIPE_WEBHOOK_SECRET");
  const stripePrice = value("STRIPE_PRICE_HEALTHCARE_WORKER_BENEFITS_DECISION_SYSTEM");
  const flags = {
    publicProductPage: process.env.PREMIUM_PUBLIC_PRODUCT_PAGE_ENABLED !== "false",
    applicationShell: process.env.PREMIUM_APPLICATION_SHELL_ENABLED !== "false",
    authentication: enabled("PREMIUM_AUTH_ENABLED"),
    workspacePersistence: enabled("PREMIUM_WORKSPACE_PERSISTENCE_ENABLED"),
    entitlementEnforcement: enabled("PREMIUM_ENTITLEMENTS_ENABLED"),
    checkout: enabled("PREMIUM_CHECKOUT_ENABLED"),
    testAdministration: enabled("PREMIUM_TEST_ADMIN_ENABLED"),
    previewAccess: enabled("PREMIUM_PREVIEW_ACCESS_ENABLED"),
    productionCheckoutAuthorized: enabled("PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED"),
  };
  const mockAuth = enabled("PREMIUM_MOCK_AUTH_ENABLED") || enabled("VITE_PREMIUM_DEV_MOCK_AUTH");
  const entitlementBypass = enabled("PREMIUM_ENTITLEMENT_BYPASS");
  const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseServiceRoleKey);
  const stripeTestConfigured =
    stripeEnvironment === "test" &&
    stripeSecretKey.startsWith("sk_test_") &&
    stripeWebhookSecret.startsWith("whsec_") &&
    stripePrice.startsWith("price_");
  const stripeLiveConfigured =
    stripeEnvironment === "live" &&
    stripeSecretKey.startsWith("sk_live_") &&
    stripeWebhookSecret.startsWith("whsec_") &&
    stripePrice.startsWith("price_");
  const production = isProduction();
  const violations = [
    ...(production && mockAuth ? ["Mock authentication cannot be enabled in production."] : []),
    ...(entitlementBypass ? ["Entitlement bypass is prohibited."] : []),
    ...(flags.checkout && !flags.entitlementEnforcement ? ["Checkout requires entitlement enforcement."] : []),
    ...(flags.checkout && !supabaseConfigured ? ["Checkout requires complete Supabase server configuration."] : []),
    ...(flags.checkout && !stripeTestConfigured && !stripeLiveConfigured ? ["Checkout requires complete Stripe test or authorized live configuration."] : []),
    ...(stripeEnvironment === "live" && !flags.productionCheckoutAuthorized ? ["Live Stripe mode requires explicit production checkout authorization."] : []),
    ...(flags.checkout && stripeEnvironment === "live" && !flags.productionCheckoutAuthorized ? ["Live checkout is not authorized."] : []),
  ];

  return {
    siteUrl,
    supportEmail: value("SUPPORT_EMAIL") || "support@communityacquiredfinance.com",
    supabase: { url: supabaseUrl, anonKey: supabaseAnonKey, serviceRoleKey: supabaseServiceRoleKey, configured: supabaseConfigured },
    stripe: { environment: stripeEnvironment, secretKey: stripeSecretKey, webhookSecret: stripeWebhookSecret, price: stripePrice, testConfigured: stripeTestConfigured, liveConfigured: stripeLiveConfigured },
    flags,
    production,
    violations,
    safe: violations.length === 0,
  };
};

export const capabilityReport = () => {
  const config = getPremiumConfig();
  const capability = (on: boolean, configured: boolean): CapabilityState => !on ? "disabled" : configured ? "configured" : "missing";
  const checkout: CapabilityState =
    !config.flags.checkout
      ? "disabled"
      : !config.safe
        ? "invalid"
        : config.stripe.testConfigured
          ? "ready_test"
          : config.stripe.liveConfigured && config.flags.productionCheckoutAuthorized
            ? "ready_production"
            : "missing";
  return {
    supabaseConfigured: config.supabase.configured,
    authentication: capability(config.flags.authentication, config.supabase.configured),
    databaseMigrationsApplied: "unknown" as const,
    workspacePersistence: capability(config.flags.workspacePersistence, config.supabase.configured),
    stripeTestKeyConfigured: config.stripe.secretKey.startsWith("sk_test_"),
    webhookSecretConfigured: config.stripe.webhookSecret.startsWith("whsec_"),
    stripePriceMapped: config.stripe.price.startsWith("price_"),
    entitlementEnforcement: capability(config.flags.entitlementEnforcement, config.supabase.configured),
    checkout,
    stripeEnvironment: config.stripe.environment,
    premiumContentBoundary: "requires_build_check" as const,
    releaseStatus: checkout === "ready_production" ? "awaiting_explicit_release_validation" : config.supabase.configured ? "foundation_configured" : "foundation_only",
    violations: config.violations,
  };
};
