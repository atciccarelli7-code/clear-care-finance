import type { SupabaseClient } from "@supabase/supabase-js";
import { getPremiumConfig } from "./premiumConfig.js";
import { getProduct } from "./productRegistry.js";
import { getSupabaseAdmin, ConfigurationUnavailableError } from "./supabase.js";

export type EntitlementStatus = "active" | "processing" | "refunded" | "revoked" | "expired" | "test";

export type EntitlementTransition =
  | { type: "mark_processing"; test?: boolean }
  | { type: "grant"; test?: boolean }
  | { type: "payment_failed" }
  | { type: "refund" }
  | { type: "revoke" }
  | { type: "restore"; test?: boolean }
  | { type: "expire" };

export const transitionEntitlement = (current: EntitlementStatus | null, transition: EntitlementTransition): EntitlementStatus => {
  switch (transition.type) {
    case "mark_processing": return transition.test ? "test" : current === "active" ? "active" : "processing";
    case "grant": return transition.test ? "test" : "active";
    case "payment_failed": return current === "active" || current === "test" ? current : "revoked";
    case "refund": return "refunded";
    case "revoke": return "revoked";
    case "restore": return transition.test ? "test" : "active";
    case "expire": return "expired";
  }
};

export const checkEntitlement = async (
  userId: string,
  productKey: string,
  admin: SupabaseClient = getSupabaseAdmin(),
) => {
  const config = getPremiumConfig();
  if (!config.flags.entitlementEnforcement || !config.supabase.configured) throw new ConfigurationUnavailableError("Entitlements unavailable");
  const product = getProduct(productKey);
  if (!product) return { accessStatus: "not_purchased" as const, entitlement: null, product: null };
  const { data, error } = await admin
    .from("entitlements")
    .select("id,status,access_type,purchased_at,expires_at")
    .eq("user_id", userId)
    .eq("product_key", productKey)
    .maybeSingle();
  if (error) throw new Error("Entitlement lookup failed");
  if (!data) return { accessStatus: "not_purchased" as const, entitlement: null, product };
  const expired = data.expires_at && new Date(data.expires_at).getTime() <= Date.now();
  if (expired || data.status === "expired") return { accessStatus: "revoked" as const, entitlement: data, product };
  if (data.status === "active" || data.status === "test") return { accessStatus: "active" as const, entitlement: data, product };
  if (data.status === "processing") return { accessStatus: "processing" as const, entitlement: data, product };
  return { accessStatus: "revoked" as const, entitlement: data, product };
};

export type PaymentEntitlementInput = {
  userId: string;
  productKey: string;
  stripeCustomerId?: string | null;
  stripeCheckoutSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  test: boolean;
  transition: EntitlementTransition;
};

export const applyPaymentEntitlement = async (input: PaymentEntitlementInput, admin: SupabaseClient = getSupabaseAdmin()) => {
  const { data: existing, error: lookupError } = await admin
    .from("entitlements")
    .select("id,status")
    .eq("user_id", input.userId)
    .eq("product_key", input.productKey)
    .maybeSingle();
  if (lookupError) throw new Error("Entitlement lookup failed");
  const status = transitionEntitlement((existing?.status as EntitlementStatus | undefined) || null, input.transition);
  const record = {
    user_id: input.userId,
    product_key: input.productKey,
    status,
    access_type: "one_time",
    purchased_at: status === "active" || status === "test" ? new Date().toISOString() : null,
    stripe_customer_id: input.stripeCustomerId || null,
    stripe_checkout_session_id: input.stripeCheckoutSessionId || null,
    stripe_payment_intent_id: input.stripePaymentIntentId || null,
    updated_at: new Date().toISOString(),
  };
  const query = existing
    ? admin.from("entitlements").update(record).eq("id", existing.id)
    : admin.from("entitlements").insert(record);
  const { error } = await query;
  if (error) throw new Error("Entitlement update failed");
  return status;
};
