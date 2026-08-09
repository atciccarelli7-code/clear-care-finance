import { checkEntitlement } from "../_lib/entitlements.js";
import { methodNotAllowed, safeError, setPrivateHeaders, type ApiRequest, type ApiResponse } from "../_lib/http.js";
import { getPremiumConfig } from "../_lib/premiumConfig.js";
import { getProduct } from "../_lib/productRegistry.js";
import { ConfigurationUnavailableError, requireAuthenticatedUser, UnauthorizedError } from "../_lib/supabase.js";

const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setPrivateHeaders(res);
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  const productKey = first(req.query?.productKey) || "";
  const product = getProduct(productKey);
  if (!product) return safeError(res, 404, "unsupported_product", "The requested product is not available.");
  const config = getPremiumConfig();
  if (!config.safe || !config.flags.authentication || !config.flags.entitlementEnforcement || !config.supabase.configured) {
    return res.status(503).json({ status: "configuration_unavailable", productKey: product.productKey });
  }
  try {
    const user = await requireAuthenticatedUser(req);
    const access = await checkEntitlement(user.id, product.productKey);
    return res.status(200).json({ status: access.accessStatus, productKey: product.productKey });
  } catch (error) {
    if (error instanceof UnauthorizedError) return res.status(200).json({ status: "signed_out", productKey: product.productKey });
    if (error instanceof ConfigurationUnavailableError) return res.status(503).json({ status: "configuration_unavailable", productKey: product.productKey });
    return safeError(res, 503, "access_check_unavailable", "Access could not be verified.");
  }
}
