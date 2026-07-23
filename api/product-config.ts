type ApiRequest = { method?: string };
type ApiResponse = { status: (code: number) => ApiResponse; json: (body: unknown) => void; setHeader: (name: string, value: string) => void };

const configured = (name: string) => Boolean(process.env[name]?.trim());
const storeReady = (configured("UPSTASH_REDIS_REST_URL") && configured("UPSTASH_REDIS_REST_TOKEN")) || (configured("KV_REST_API_URL") && configured("KV_REST_API_TOKEN"));
const checkoutReady = configured("LEMON_SQUEEZY_HEALTHCARE_PRODUCT_URL") && configured("LEMON_SQUEEZY_WEBHOOK_SECRET") && configured("LEMON_SQUEEZY_HEALTHCARE_VARIANT_ID");
const accessEmailReady = configured("RESEND_API_KEY") && configured("RESEND_FROM_EMAIL") && configured("PUBLIC_SITE_URL");
const commerceEnabled = process.env.ENABLE_PREMIUM_COMMERCE === "true" && storeReady && checkoutReady && accessEmailReady;

const products = [
  {
    productId: "healthcare_compensation_benefits_decision_book",
    legacyProductId: "healthcare_worker_career_benefits_decision_system",
    productName: "Healthcare Compensation & Benefits Decision Workspace",
    productStatus: commerceEnabled ? "launch_ready" : "implementation_ready_default_deny",
    sourceEdition: "3.0",
    workspaceVersion: "3.0-web.1",
    standardPrice: 39,
    launchPrice: 29,
    checkoutEnabled: commerceEnabled,
    publicRoute: "/products/healthcare-worker-benefits-decision-pack",
    accessRoute: "/premium/access",
    workspaceRoute: "/premium/healthcare-compensation-benefits",
    deliveryMode: "authenticated_web_workspace_with_browser_print_pdf",
    accessModel: "continued_access_to_purchased_edition",
    updateModel: "twelve_months_no_auto_renewal",
    adsInsideProduct: false,
  },
  {
    productId: "medical_bill_response_resolution_system",
    productStatus: "private_ready",
    standardPrice: 29,
    launchPrice: 19,
    checkoutEnabled: false,
    deliveryMode: "private_master_not_hosted",
  },
] as const;

const bundle = {
  productId: "healthcare_money_decision_library",
  productStatus: "private_ready",
  standardPrice: 59,
  launchPrice: 39,
  checkoutEnabled: false,
  deliveryMode: "private_master_not_hosted",
} as const;

export default function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader("Allow", "GET");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=300");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  return res.status(200).json({
    portfolioStatus: commerceEnabled ? "one_product_launch_ready" : "implementation_ready_default_deny",
    commerceEnabled,
    paymentProvider: "lemon_squeezy_one_time",
    accountModel: "passwordless_email_session",
    entitlementModel: "server_verified_webhook_backed",
    progressModel: "minimal_account_progress_private_notes_local",
    hostingPlanRequiredForLaunch: "vercel_pro",
    infrastructure: { storeReady, checkoutReady, accessEmailReady },
    products,
    bundle,
    activationRequires: [
      "founder_approval",
      "vercel_pro",
      "upstash_redis_connected",
      "lemon_squeezy_merchant_and_variant_verified",
      "webhook_and_refund_test_passed",
      "resend_access_email_verified",
      "refund_terms_published",
      "support_path_ready",
      "privacy_safe_analytics_verified",
    ],
  });
}
