export type CapabilityState = "configured" | "disabled" | "missing" | "ready_test" | "ready_production" | "invalid";
export type DocumentIntakeMode = "disabled" | "synthetic_only" | "redacted_benefits_only" | "invalid";

const value = (name: string) => process.env[name]?.trim() || "";
const enabled = (name: string) => value(name) === "true";
const isProductionRuntime = () => process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";

const readDocumentIntakeMode = (): DocumentIntakeMode => {
  const mode = value("PREMIUM_DOCUMENT_INTAKE_MODE") || "disabled";
  return ["disabled", "synthetic_only", "redacted_benefits_only"].includes(mode)
    ? mode as DocumentIntakeMode
    : "invalid";
};

export const getPremiumConfig = () => {
  const siteUrl = value("PUBLIC_APP_URL") || value("PUBLIC_SITE_URL") || "https://communityacquiredfinance.com";
  const supabaseUrl = value("SUPABASE_URL");
  const supabaseAnonKey = value("SUPABASE_ANON_KEY");
  const supabaseServiceRoleKey = value("SUPABASE_SERVICE_ROLE_KEY");
  const stripeEnvironment = value("STRIPE_ENVIRONMENT") || "disabled";
  const stripeSecretKey = value("STRIPE_SECRET_KEY");
  const stripeWebhookSecret = value("STRIPE_WEBHOOK_SECRET");
  const stripePrices = {
    "healthcare-worker-benefits-decision-system": value("STRIPE_PRICE_HEALTHCARE_WORKER_BENEFITS_DECISION_SYSTEM"),
    "medicare-coverage-decision-system": value("STRIPE_PRICE_MEDICARE_COVERAGE_DECISION_SYSTEM"),
  } as const;
  const stripePrice = stripePrices["healthcare-worker-benefits-decision-system"];
  const documentIntakeMode = readDocumentIntakeMode();
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
    documentIntake: enabled("PREMIUM_DOCUMENT_INTAKE_ENABLED"),
    documentExtraction: enabled("PREMIUM_DOCUMENT_EXTRACTION_ENABLED"),
    realDocumentProcessingAuthorized: enabled("PREMIUM_REAL_DOCUMENT_PROCESSING_AUTHORIZED"),
  };
  const mockAuth = enabled("PREMIUM_MOCK_AUTH_ENABLED") || enabled("VITE_PREMIUM_DEV_MOCK_AUTH");
  const entitlementBypass = enabled("PREMIUM_ENTITLEMENT_BYPASS");
  const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseServiceRoleKey);
  const stripeTestConfigured =
    stripeEnvironment === "test" &&
    stripeSecretKey.startsWith("sk_test_") &&
    stripeWebhookSecret.startsWith("whsec_") &&
    Object.values(stripePrices).some((price) => price.startsWith("price_"));
  const stripeLiveConfigured =
    stripeEnvironment === "live" &&
    stripeSecretKey.startsWith("sk_live_") &&
    stripeWebhookSecret.startsWith("whsec_") &&
    Object.values(stripePrices).some((price) => price.startsWith("price_"));
  const productionRuntime = isProductionRuntime();
  const productionDeployment = process.env.VERCEL_ENV === "production";
  const documentDependenciesReady =
    flags.authentication &&
    flags.workspacePersistence &&
    flags.entitlementEnforcement &&
    supabaseConfigured;
  const violations = [
    ...(productionRuntime && mockAuth ? ["Mock authentication cannot be enabled in production."] : []),
    ...(entitlementBypass ? ["Entitlement bypass is prohibited."] : []),
    ...(flags.checkout && !flags.entitlementEnforcement ? ["Checkout requires entitlement enforcement."] : []),
    ...(flags.checkout && !supabaseConfigured ? ["Checkout requires complete Supabase server configuration."] : []),
    ...(flags.checkout && !stripeTestConfigured && !stripeLiveConfigured ? ["Checkout requires complete Stripe test or authorized live configuration."] : []),
    ...(stripeEnvironment === "live" && !flags.productionCheckoutAuthorized ? ["Live Stripe mode requires explicit production checkout authorization."] : []),
    ...(flags.checkout && stripeEnvironment === "live" && !flags.productionCheckoutAuthorized ? ["Live checkout is not authorized."] : []),
    ...(documentIntakeMode === "invalid" ? ["PREMIUM_DOCUMENT_INTAKE_MODE is invalid."] : []),
    ...(flags.documentIntake && documentIntakeMode === "disabled" ? ["Document intake is enabled while its mode is disabled."] : []),
    ...(!flags.documentIntake && documentIntakeMode !== "disabled" && documentIntakeMode !== "invalid" ? ["A document intake mode is set while document intake is disabled."] : []),
    ...(flags.documentIntake && !documentDependenciesReady ? ["Document intake requires authentication, workspace persistence, entitlement enforcement, and complete Supabase configuration."] : []),
    ...(flags.documentExtraction && !flags.documentIntake ? ["Document extraction requires document intake."] : []),
    ...(flags.documentExtraction && documentIntakeMode === "disabled" ? ["Document extraction cannot run while document intake is disabled."] : []),
    ...(productionDeployment && flags.documentIntake && !flags.realDocumentProcessingAuthorized ? ["Production document intake requires explicit real-document-processing authorization."] : []),
    ...(productionDeployment && flags.documentIntake && documentIntakeMode !== "redacted_benefits_only" ? ["Production document intake must use redacted_benefits_only mode."] : []),
    ...(productionDeployment && flags.documentExtraction && !flags.realDocumentProcessingAuthorized ? ["Production document extraction requires explicit real-document-processing authorization."] : []),
  ];

  return {
    siteUrl,
    supportEmail: value("SUPPORT_EMAIL") || "support@communityacquiredfinance.com",
    supabase: { url: supabaseUrl, anonKey: supabaseAnonKey, serviceRoleKey: supabaseServiceRoleKey, configured: supabaseConfigured },
    stripe: { environment: stripeEnvironment, secretKey: stripeSecretKey, webhookSecret: stripeWebhookSecret, price: stripePrice, prices: stripePrices, testConfigured: stripeTestConfigured, liveConfigured: stripeLiveConfigured },
    documents: {
      mode: documentIntakeMode,
      bucket: "benefits-document-staging",
      intakeEnabled: flags.documentIntake,
      extractionEnabled: flags.documentExtraction,
      realProcessingAuthorized: flags.realDocumentProcessingAuthorized,
      dependenciesReady: documentDependenciesReady,
    },
    flags,
    productionRuntime,
    productionDeployment,
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
  const documentIntake: CapabilityState =
    !config.flags.documentIntake
      ? "disabled"
      : !config.safe
        ? "invalid"
        : config.documents.dependenciesReady && config.documents.mode !== "disabled" && config.documents.mode !== "invalid"
          ? config.productionDeployment ? "ready_production" : "ready_test"
          : "missing";
  return {
    supabaseConfigured: config.supabase.configured,
    authentication: capability(config.flags.authentication, config.supabase.configured),
    databaseMigrationsApplied: "unknown" as const,
    workspacePersistence: capability(config.flags.workspacePersistence, config.supabase.configured),
    stripeTestKeyConfigured: config.stripe.secretKey.startsWith("sk_test_"),
    webhookSecretConfigured: config.stripe.webhookSecret.startsWith("whsec_"),
    stripePriceMapped: config.stripe.price.startsWith("price_"),
    stripePricesMapped: Object.fromEntries(Object.entries(config.stripe.prices).map(([productKey, price]) => [productKey, price.startsWith("price_")])),
    entitlementEnforcement: capability(config.flags.entitlementEnforcement, config.supabase.configured),
    checkout,
    documentIntake,
    documentIntakeMode: config.documents.mode,
    documentExtraction: capability(config.flags.documentExtraction, documentIntake === "ready_test" || documentIntake === "ready_production"),
    stripeEnvironment: config.stripe.environment,
    premiumContentBoundary: "requires_build_check" as const,
    releaseStatus: checkout === "ready_production" ? "awaiting_explicit_release_validation" : config.supabase.configured ? "foundation_configured" : "foundation_only",
    violations: config.violations,
  };
};
