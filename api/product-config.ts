import { getPremiumConfig } from "./_lib/premiumConfig.js";
import { productRegistry } from "./_lib/productRegistry.js";
import { methodNotAllowed, type ApiRequest, type ApiResponse } from "./_lib/http.js";

export default function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=300");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  const config = getPremiumConfig();
  const commerceEnabled = false;
  return res.status(200).json({
    portfolioStatus: commerceEnabled ? "one_product_launch_ready" : "implementation_ready_default_deny",
    product: productRegistry["healthcare-worker-benefits-decision-system"],
    publicProductPageEnabled: config.flags.publicProductPage,
    applicationShellEnabled: config.flags.applicationShell,
    checkoutEnabled: false,
    availability: "early_access_preparation",
    accountAccessAvailable: config.safe && config.flags.authentication && config.supabase.configured,
    statement: "Checkout is not currently enabled. No payment is collected from this page.",
    otherProducts: [
      {
        productId: "medical_bill_response_resolution_system",
        productStatus: "private_ready",
        deliveryMode: "private_master_not_hosted",
        checkoutEnabled: false,
      },
      {
        productId: "healthcare_money_decision_library",
        productStatus: "private_build",
        deliveryMode: "private_master_not_hosted",
        checkoutEnabled: false,
      },
    ],
  });
}
