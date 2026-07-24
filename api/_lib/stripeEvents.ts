import type { SupabaseClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import { applyPaymentEntitlement, type EntitlementTransition } from "./entitlements.js";
import { PREMIUM_PRODUCT_KEY } from "./productRegistry.js";

export type StripeEventAction =
  | { kind: "checkout"; transition: EntitlementTransition }
  | { kind: "refund"; transition: EntitlementTransition }
  | { kind: "ignore" };

export const actionForStripeEvent = (event: Pick<Stripe.Event, "type" | "data">): StripeEventAction => {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    return { kind: "checkout", transition: session.payment_status === "paid" ? { type: "grant", test: !session.livemode } : { type: "mark_processing", test: false } };
  }
  if (event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    return { kind: "checkout", transition: { type: "grant", test: !session.livemode } };
  }
  if (event.type === "checkout.session.async_payment_failed" || event.type === "payment_intent.payment_failed") {
    return { kind: "checkout", transition: { type: "payment_failed" } };
  }
  if (event.type === "charge.refunded") return { kind: "refund", transition: { type: "refund" } };
  return { kind: "ignore" };
};

export const claimStripeEvent = async (admin: SupabaseClient, event: Pick<Stripe.Event, "id" | "type">) => {
  const { error } = await admin.from("stripe_events").insert({
    stripe_event_id: event.id,
    event_type: event.type,
    processing_status: "processing",
  });
  if (!error) return "claimed" as const;
  if (error.code === "23505") {
    const { data, error: lookupError } = await admin
      .from("stripe_events")
      .select("processing_status")
      .eq("stripe_event_id", event.id)
      .maybeSingle();
    if (lookupError) throw new Error("Event lookup failed");
    if (data?.processing_status !== "failed") return "duplicate" as const;
    const { error: retryError } = await admin
      .from("stripe_events")
      .update({
        processed_at: null,
        processing_status: "processing",
        error_message: null,
      })
      .eq("stripe_event_id", event.id)
      .eq("processing_status", "failed");
    if (retryError) throw new Error("Event retry claim failed");
    return "claimed" as const;
  }
  throw new Error("Event claim failed");
};

export const finishStripeEvent = async (
  admin: SupabaseClient,
  eventId: string,
  status: "processed" | "ignored" | "failed",
  errorCode?: string,
) => {
  const { error } = await admin
    .from("stripe_events")
    .update({
      processed_at: new Date().toISOString(),
      processing_status: status,
      error_message: errorCode || null,
    })
    .eq("stripe_event_id", eventId);
  if (error) throw new Error("Event completion failed");
};

export const applyCheckoutEvent = async (
  admin: SupabaseClient,
  session: Stripe.Checkout.Session,
  transition: EntitlementTransition,
) => {
  const userId = session.metadata?.user_id || "";
  const productKey = session.metadata?.product_key || "";
  if (!/^[0-9a-f-]{36}$/i.test(userId) || productKey !== PREMIUM_PRODUCT_KEY) throw new Error("invalid_event_metadata");
  return applyPaymentEntitlement({
    userId,
    productKey,
    stripeCustomerId: typeof session.customer === "string" ? session.customer : session.customer?.id,
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
    test: !session.livemode,
    transition,
  }, admin);
};

export const applyPaymentFailure = async (
  admin: SupabaseClient,
  intent: Stripe.PaymentIntent,
  transition: EntitlementTransition,
) => {
  const userId = intent.metadata?.user_id || "";
  const productKey = intent.metadata?.product_key || "";
  if (!/^[0-9a-f-]{36}$/i.test(userId) || productKey !== PREMIUM_PRODUCT_KEY) throw new Error("invalid_event_metadata");
  return applyPaymentEntitlement({
    userId,
    productKey,
    stripeCustomerId: typeof intent.customer === "string" ? intent.customer : intent.customer?.id,
    stripePaymentIntentId: intent.id,
    test: !intent.livemode,
    transition,
  }, admin);
};

export const applyRefundEvent = async (admin: SupabaseClient, charge: Stripe.Charge) => {
  const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
  if (!paymentIntentId) throw new Error("missing_payment_intent");
  const { data, error } = await admin
    .from("entitlements")
    .select("id")
    .eq("stripe_payment_intent_id", paymentIntentId)
    .maybeSingle();
  if (error || !data) throw new Error("entitlement_not_found");
  const { error: updateError } = await admin
    .from("entitlements")
    .update({ status: "refunded", updated_at: new Date().toISOString() })
    .eq("id", data.id);
  if (updateError) throw new Error("refund_update_failed");
};
