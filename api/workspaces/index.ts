import { randomUUID } from "node:crypto";
import { checkEntitlement } from "../_lib/entitlements.js";
import { methodNotAllowed, parseJsonBody, safeError, sameOrigin, setPrivateHeaders, type ApiRequest, type ApiResponse } from "../_lib/http.js";
import { getPremiumConfig } from "../_lib/premiumConfig.js";
import { BENEFITS_PRODUCT_KEY, getProduct } from "../_lib/productRegistry.js";
import { ConfigurationUnavailableError, getSupabaseAdmin, requireAuthenticatedUser, UnauthorizedError } from "../_lib/supabase.js";
import { emptyWorkspaceStateForProduct, parseWorkspaceState, workspaceTitleForProduct } from "../_lib/workspaceRegistry.js";

const mapWorkspace = (row: Record<string, unknown>) => ({
  id: row.id,
  productKey: row.product_key,
  title: row.title,
  status: row.status,
  progressPercent: row.progress_percent,
  state: parseWorkspaceState(String(row.product_key), row.state),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setPrivateHeaders(res);
  if (!["GET", "POST"].includes(req.method || "")) return methodNotAllowed(res, ["GET", "POST"]);
  const config = getPremiumConfig();
  if (!config.safe || !config.flags.workspacePersistence || !config.flags.entitlementEnforcement || !config.supabase.configured) {
    return safeError(res, 503, "configuration_unavailable", "Secure workspace persistence is not available.");
  }
  if (req.method === "POST" && !sameOrigin(req, config.siteUrl)) return safeError(res, 403, "origin_rejected", "The request origin was rejected.");
  try {
    const user = await requireAuthenticatedUser(req);
    const admin = getSupabaseAdmin();
    if (req.method === "GET") {
      const requestedProductKey = Array.isArray(req.query?.productKey) ? req.query?.productKey[0] : req.query?.productKey;
      const productKey = typeof requestedProductKey === "string" && requestedProductKey ? requestedProductKey : BENEFITS_PRODUCT_KEY;
      if (!getProduct(productKey)) return safeError(res, 404, "unsupported_product", "The requested product is not available.");
      const access = await checkEntitlement(user.id, productKey);
      if (access.accessStatus !== "active") return safeError(res, 403, "entitlement_required", "Active product access is required.");
      const { data, error } = await admin
        .from("workspaces")
        .select("id,product_key,title,status,progress_percent,state,created_at,updated_at")
        .eq("user_id", user.id)
        .eq("product_key", productKey)
        .order("updated_at", { ascending: false });
      if (error) throw new Error("Workspace query failed");
      return res.status(200).json({ workspaces: (data || []).map(mapWorkspace) });
    }
    const body = parseJsonBody<{ title?: unknown; productKey?: unknown }>(req);
    const productKey = typeof body.productKey === "string" && body.productKey ? body.productKey : BENEFITS_PRODUCT_KEY;
    if (!getProduct(productKey)) return safeError(res, 404, "unsupported_product", "The requested product is not available.");
    const access = await checkEntitlement(user.id, productKey);
    if (access.accessStatus !== "active") return safeError(res, 403, "entitlement_required", "Active product access is required.");
    const title = workspaceTitleForProduct(productKey, body.title);
    if (!title) return safeError(res, 400, "invalid_workspace", "Enter a workspace title.");
    const state = emptyWorkspaceStateForProduct(productKey);
    const { data, error } = await admin
      .from("workspaces")
      .insert({
        id: randomUUID(),
        user_id: user.id,
        product_key: productKey,
        title,
        status: "active",
        progress_percent: 0,
        state,
      })
      .select("id,product_key,title,status,progress_percent,state,created_at,updated_at")
      .single();
    if (error || !data) throw new Error("Workspace create failed");
    return res.status(201).json({ workspace: mapWorkspace(data) });
  } catch (error) {
    if (error instanceof UnauthorizedError) return safeError(res, 401, "authentication_required", "Sign in to continue.");
    if (error instanceof ConfigurationUnavailableError) return safeError(res, 503, "configuration_unavailable", "Secure workspace persistence is not available.");
    return safeError(res, 503, "workspace_unavailable", "The workspace request could not be completed.");
  }
}
