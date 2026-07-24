import { randomUUID } from "node:crypto";
import { workspaceStateSchema, emptyWorkspaceState } from "../../src/premium/contracts";
import { checkEntitlement } from "../_lib/entitlements";
import { methodNotAllowed, parseJsonBody, safeError, sameOrigin, setPrivateHeaders, type ApiRequest, type ApiResponse } from "../_lib/http";
import { getPremiumConfig } from "../_lib/premiumConfig";
import { PREMIUM_PRODUCT_KEY } from "../_lib/productRegistry";
import { ConfigurationUnavailableError, getSupabaseAdmin, requireAuthenticatedUser, UnauthorizedError } from "../_lib/supabase";

const mapWorkspace = (row: Record<string, unknown>) => ({
  id: row.id,
  title: row.title,
  status: row.status,
  progressPercent: row.progress_percent,
  state: workspaceStateSchema.parse(row.state),
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
    const access = await checkEntitlement(user.id, PREMIUM_PRODUCT_KEY);
    if (access.accessStatus !== "active") return safeError(res, 403, "entitlement_required", "Active product access is required.");
    const admin = getSupabaseAdmin();
    if (req.method === "GET") {
      const { data, error } = await admin
        .from("workspaces")
        .select("id,title,status,progress_percent,state,created_at,updated_at")
        .eq("user_id", user.id)
        .eq("product_key", PREMIUM_PRODUCT_KEY)
        .order("updated_at", { ascending: false });
      if (error) throw new Error("Workspace query failed");
      return res.status(200).json({ workspaces: (data || []).map(mapWorkspace) });
    }
    const body = parseJsonBody<{ title?: unknown }>(req);
    const title = typeof body.title === "string" ? body.title.trim().slice(0, 120) : "";
    if (!title) return safeError(res, 400, "invalid_workspace", "Enter a workspace title.");
    const state = emptyWorkspaceState();
    const { data, error } = await admin
      .from("workspaces")
      .insert({
        id: randomUUID(),
        user_id: user.id,
        product_key: PREMIUM_PRODUCT_KEY,
        title,
        status: "active",
        progress_percent: 0,
        state,
      })
      .select("id,title,status,progress_percent,state,created_at,updated_at")
      .single();
    if (error || !data) throw new Error("Workspace create failed");
    return res.status(201).json({ workspace: mapWorkspace(data) });
  } catch (error) {
    if (error instanceof UnauthorizedError) return safeError(res, 401, "authentication_required", "Sign in to continue.");
    if (error instanceof ConfigurationUnavailableError) return safeError(res, 503, "configuration_unavailable", "Secure workspace persistence is not available.");
    return safeError(res, 503, "workspace_unavailable", "The workspace request could not be completed.");
  }
}
