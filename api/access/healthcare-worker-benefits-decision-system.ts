import { checkEntitlement } from "../_lib/entitlements";
import { methodNotAllowed, safeError, setPrivateHeaders, type ApiRequest, type ApiResponse } from "../_lib/http";
import { getPremiumConfig } from "../_lib/premiumConfig";
import { PREMIUM_PRODUCT_KEY } from "../_lib/productRegistry";
import { ConfigurationUnavailableError, requireAuthenticatedUser, UnauthorizedError } from "../_lib/supabase";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setPrivateHeaders(res);
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  const config = getPremiumConfig();
  if (!config.safe || !config.flags.authentication || !config.flags.entitlementEnforcement || !config.supabase.configured) {
    return res.status(503).json({ status: "configuration_unavailable", productKey: PREMIUM_PRODUCT_KEY });
  }
  try {
    const user = await requireAuthenticatedUser(req);
    const access = await checkEntitlement(user.id, PREMIUM_PRODUCT_KEY);
    return res.status(200).json({ status: access.accessStatus, productKey: PREMIUM_PRODUCT_KEY });
  } catch (error) {
    if (error instanceof UnauthorizedError) return res.status(200).json({ status: "signed_out", productKey: PREMIUM_PRODUCT_KEY });
    if (error instanceof ConfigurationUnavailableError) return res.status(503).json({ status: "configuration_unavailable", productKey: PREMIUM_PRODUCT_KEY });
    return safeError(res, 503, "access_check_unavailable", "Access could not be verified.");
  }
}
