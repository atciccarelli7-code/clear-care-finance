import { checkEntitlement } from "../_lib/entitlements.js";
import { methodNotAllowed, safeError, setPrivateHeaders, type ApiRequest, type ApiResponse } from "../_lib/http.js";
import { getPremiumConfig } from "../_lib/premiumConfig.js";
import { getProduct } from "../_lib/productRegistry.js";
import { ConfigurationUnavailableError, getSupabaseAdmin, requireAuthenticatedUser, UnauthorizedError } from "../_lib/supabase.js";

const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setPrivateHeaders(res);
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  const config = getPremiumConfig();
  if (!config.safe || !config.flags.entitlementEnforcement || !config.supabase.configured) {
    return safeError(res, 503, "configuration_unavailable", "Protected content is not available.");
  }
  const productKey = first(req.query?.productKey);
  const moduleKey = first(req.query?.moduleKey);
  const product = productKey ? getProduct(productKey) : null;
  if (!product || !moduleKey || !product.authorizedModules.includes(moduleKey as never)) {
    return safeError(res, 404, "unsupported_module", "The requested product module does not exist.");
  }
  try {
    const user = await requireAuthenticatedUser(req);
    const access = await checkEntitlement(user.id, productKey!);
    if (access.accessStatus !== "active") return safeError(res, 403, "entitlement_required", "Active product access is required.");
    const admin = getSupabaseAdmin();
    const { data: productRow, error: productError } = await admin
      .from("products")
      .select("status")
      .eq("product_key", productKey)
      .maybeSingle();
    if (productError || !productRow || !["active", "test"].includes(productRow.status)) {
      return safeError(res, 503, "product_unavailable", "This product is not currently available.");
    }
    const { data, error } = await admin
      .from("premium_modules")
      .select("definition")
      .eq("product_key", productKey)
      .eq("module_key", moduleKey)
      .eq("status", productRow.status === "active" ? "active" : "test")
      .maybeSingle();
    if (error || !data) return safeError(res, 404, "module_unavailable", "This module is not available.");
    return res.status(200).json(data.definition);
  } catch (error) {
    if (error instanceof UnauthorizedError) return safeError(res, 401, "authentication_required", "Sign in to continue.");
    if (error instanceof ConfigurationUnavailableError) return safeError(res, 503, "configuration_unavailable", "Protected content is not available.");
    return safeError(res, 503, "content_unavailable", "Protected content could not be loaded.");
  }
}
