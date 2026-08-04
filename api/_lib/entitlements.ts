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
    case "mark_processing": return current === "active" || current === "test" ? current : "processing";
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
  stripeEventId?: string;
  stripeEventCreatedAt?: number;
  test: boolean;
  transition: EntitlementTransition;
};

type ExistingEntitlement = {
  id: string;
  status: EntitlementStatus;
  purchased_at: string | null;
  expires_at: string | null;
  stripe_customer_id: string | null;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  last_stripe_event_created_at: number | null;
  last_stripe_event_id: string | null;
  updated_at: string;
};

const statusPriority: Record<EntitlementStatus, number> = {
  processing: 0,
  expired: 1,
  revoked: 2,
  active: 3,
  test: 3,
  refunded: 4,
};

const shouldIgnoreEvent = (
  existing: ExistingEntitlement,
  input: PaymentEntitlementInput,
  nextStatus: EntitlementStatus,
) => {
  if (input.stripeEventCreatedAt === undefined || !input.stripeEventId) return false;
  if (existing.last_stripe_event_created_at === null) return false;
  if (input.stripeEventCreatedAt < existing.last_stripe_event_created_at) return true;
  if (input.stripeEventCreatedAt > existing.last_stripe_event_created_at) return false;
  if (statusPriority[nextStatus] < statusPriority[existing.status]) return true;
  if (statusPriority[nextStatus] > statusPriority[existing.status]) return false;
  return Boolean(existing.last_stripe_event_id && input.stripeEventId <= existing.last_stripe_event_id);
};

const keepOrReplace = <T>(incoming: T | undefined, existing: T) => incoming === undefined ? existing : incoming;

export const applyPaymentEntitlement = async (
  input: PaymentEntitlementInput,
  admin: SupabaseClient = getSupabaseAdmin(),
  attempt = 0,
): Promise<EntitlementStatus> => {
  if (!getProduct(input.productKey)) throw new Error("unsupported_product");
  if ((input.stripeEventId && input.stripeEventCreatedAt === undefined) || (!input.stripeEventId && input.stripeEventCreatedAt !== undefined)) {
    throw new Error("invalid_stripe_event_ordering");
  }

  const { data: existingRaw, error: lookupError } = await admin
    .from("entitlements")
    .select("id,status,purchased_at,expires_at,stripe_customer_id,stripe_checkout_session_id,stripe_payment_intent_id,last_stripe_event_created_at,last_stripe_event_id,updated_at")
    .eq("user_id", input.userId)
    .eq("product_key", input.productKey)
    .maybeSingle();
  if (lookupError) throw new Error("entitlement_lookup_failed");
  const existing = existingRaw as ExistingEntitlement | null;
  const currentStatus = existing?.status || null;
  const status = transitionEntitlement(currentStatus, input.transition);
  if (existing && shouldIgnoreEvent(existing, input, status)) return existing.status;

  const now = new Date().toISOString();
  const retainedPurchase = existing?.purchased_at || null;
  const purchasedAt = status === "active" || status === "test"
    ? currentStatus === "active" || currentStatus === "test" ? retainedPurchase || now : now
    : retainedPurchase;
  const record = {
    user_id: input.userId,
    product_key: input.productKey,
    status,
    access_type: "one_time",
    purchased_at: purchasedAt,
    expires_at: existing?.expires_at || null,
    stripe_customer_id: keepOrReplace(input.stripeCustomerId, existing?.stripe_customer_id || null),
    stripe_checkout_session_id: keepOrReplace(input.stripeCheckoutSessionId, existing?.stripe_checkout_session_id || null),
    stripe_payment_intent_id: keepOrReplace(input.stripePaymentIntentId, existing?.stripe_payment_intent_id || null),
    last_stripe_event_created_at: input.stripeEventCreatedAt ?? existing?.last_stripe_event_created_at ?? null,
    last_stripe_event_id: input.stripeEventId ?? existing?.last_stripe_event_id ?? null,
    updated_at: now,
  };

  if (!existing) {
    const { error } = await admin.from("entitlements").insert(record);
    if (!error) return status;
    if (error.code === "23505" && attempt < 2) return applyPaymentEntitlement(input, admin, attempt + 1);
    throw new Error("entitlement_update_failed");
  }

  const { data: updated, error } = await admin
    .from("entitlements")
    .update(record)
    .eq("id", existing.id)
    .eq("updated_at", existing.updated_at)
    .select("id")
    .maybeSingle();
  if (error) throw new Error("entitlement_update_failed");
  if (!updated) {
    if (attempt < 2) return applyPaymentEntitlement(input, admin, attempt + 1);
    throw new Error("entitlement_concurrency_conflict");
  }
  return status;
};
