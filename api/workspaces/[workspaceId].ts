import { checkEntitlement } from "../_lib/entitlements.js";
import { methodNotAllowed, parseJsonBody, safeError, sameOrigin, setPrivateHeaders, type ApiRequest, type ApiResponse } from "../_lib/http.js";
import { getPremiumConfig } from "../_lib/premiumConfig.js";
import { ConfigurationUnavailableError, getSupabaseAdmin, requireAuthenticatedUser, UnauthorizedError } from "../_lib/supabase.js";
import { parseWorkspaceState, workspaceProgressForProduct } from "../_lib/workspaceRegistry.js";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
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
  if (!["GET", "PUT", "DELETE"].includes(req.method || "")) return methodNotAllowed(res, ["GET", "PUT", "DELETE"]);
  const config = getPremiumConfig();
  if (!config.safe || !config.flags.workspacePersistence || !config.flags.entitlementEnforcement || !config.supabase.configured) {
    return safeError(res, 503, "configuration_unavailable", "Secure workspace persistence is not available.");
  }
  if (req.method !== "GET" && !sameOrigin(req, config.siteUrl)) return safeError(res, 403, "origin_rejected", "The request origin was rejected.");
  const workspaceId = first(req.query?.workspaceId);
  if (!workspaceId || !uuid.test(workspaceId)) return safeError(res, 404, "workspace_not_found", "The workspace was not found.");
  try {
    const user = await requireAuthenticatedUser(req);
    const admin = getSupabaseAdmin();
    const { data: ownership, error: ownershipError } = await admin
      .from("workspaces")
      .select("product_key")
      .eq("id", workspaceId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (ownershipError) throw new Error("Workspace ownership lookup failed");
    if (!ownership) return safeError(res, 404, "workspace_not_found", "The workspace was not found.");
    const productKey = String(ownership.product_key);
    const access = await checkEntitlement(user.id, productKey);
    if (access.accessStatus !== "active") return safeError(res, 403, "entitlement_required", "Active product access is required.");
    if (req.method === "DELETE") {
      const { data, error } = await admin.from("workspaces").delete().eq("id", workspaceId).eq("user_id", user.id).eq("product_key", productKey).select("id");
      if (error) throw new Error("Workspace delete failed");
      if (!data?.length) return safeError(res, 404, "workspace_not_found", "The workspace was not found.");
      return res.status(200).json({ deleted: true });
    }
    if (req.method === "PUT") {
      let state: Record<string, unknown>;
      try {
        state = { ...parseWorkspaceState(productKey, parseJsonBody<{ state?: unknown }>(req).state), updatedAt: new Date().toISOString() };
      } catch {
        return safeError(res, 400, "invalid_workspace_state", "The workspace data is invalid.");
      }
      const { data, error } = await admin
        .from("workspaces")
        .update({ state, progress_percent: workspaceProgressForProduct(productKey, state), updated_at: new Date().toISOString() })
        .eq("id", workspaceId)
        .eq("user_id", user.id)
        .eq("product_key", productKey)
        .select("id,product_key,title,status,progress_percent,state,created_at,updated_at")
        .maybeSingle();
      if (error) throw new Error("Workspace save failed");
      if (!data) return safeError(res, 404, "workspace_not_found", "The workspace was not found.");
      return res.status(200).json({ workspace: mapWorkspace(data) });
    }
    const { data, error } = await admin
      .from("workspaces")
      .select("id,product_key,title,status,progress_percent,state,created_at,updated_at")
      .eq("id", workspaceId)
      .eq("user_id", user.id)
      .eq("product_key", productKey)
      .maybeSingle();
    if (error) throw new Error("Workspace query failed");
    if (!data) return safeError(res, 404, "workspace_not_found", "The workspace was not found.");
    return res.status(200).json({ workspace: mapWorkspace(data) });
  } catch (error) {
    if (error instanceof UnauthorizedError) return safeError(res, 401, "authentication_required", "Sign in to continue.");
    if (error instanceof ConfigurationUnavailableError) return safeError(res, 503, "configuration_unavailable", "Secure workspace persistence is not available.");
    return safeError(res, 503, "workspace_unavailable", "The workspace request could not be completed.");
  }
}
