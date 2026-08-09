import type { SupabaseClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import { applyPaymentEntitlement, type EntitlementTransition } from "./entitlements.js";
import { getProduct } from "./productRegistry.js";
import { getServerPrice } from "./productRegistry.js";

export type StripeEventAction =
  | { kind: "checkout"; transition: EntitlementTransition }
  | { kind: "refund"; transition: EntitlementTransition }
  | { kind: "ignore" };

export const validateCheckoutSessionMapping = (session: Stripe.Checkout.Session, stripeEnvironment: string) => {
  const productKey = session.metadata?.product_key || "";
  const product = getProduct(productKey);
  const expectedPrice = getServerPrice(productKey);
  const lineItems = session.line_items?.data || [];
  const lineItem = lineItems[0];
  const expectedLiveMode = stripeEnvironment === "live";
  if (
    !product ||
    !expectedPrice ||
    session.mode !== "payment" ||
    session.livemode !== expectedLiveMode ||
    lineItems.length !== 1 ||
    lineItem?.quantity !== 1 ||
    lineItem?.price?.id !== expectedPrice ||
    lineItem?.price?.currency !== product.currency ||
    lineItem?.price?.unit_amount !== product.expectedPriceCents ||
    session.amount_total !== product.expectedPriceCents
  ) throw new Error("invalid_product_mapping");
  return product;
};

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
  event?: Pick<Stripe.Event, "id" | "created">,
) => {
  const userId = session.metadata?.user_id || "";
  const productKey = session.metadata?.product_key || "";
  if (!/^[0-9a-f-]{36}$/i.test(userId) || !getProduct(productKey)) throw new Error("invalid_event_metadata");
  return applyPaymentEntitlement({
    userId,
    productKey,
    stripeCustomerId: typeof session.customer === "string" ? session.customer : session.customer?.id,
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
    test: !session.livemode,
    transition,
    stripeEventId: event?.id,
    stripeEventCreatedAt: event?.created,
  }, admin);
};

export const applyPaymentFailure = async (
  admin: SupabaseClient,
  intent: Stripe.PaymentIntent,
  transition: EntitlementTransition,
  event?: Pick<Stripe.Event, "id" | "created">,
) => {
  const userId = intent.metadata?.user_id || "";
  const productKey = intent.metadata?.product_key || "";
  if (!/^[0-9a-f-]{36}$/i.test(userId) || !getProduct(productKey)) throw new Error("invalid_event_metadata");
  const { data: matching, error } = await admin
    .from("entitlements")
    .select("id,stripe_livemode")
    .eq("user_id", userId)
    .eq("product_key", productKey)
    .eq("stripe_payment_intent_id", intent.id)
    .maybeSingle();
  if (error || !matching || matching.stripe_livemode !== intent.livemode) throw new Error("payment_entitlement_not_found");
  return applyPaymentEntitlement({
    userId,
    productKey,
    stripeCustomerId: typeof intent.customer === "string" ? intent.customer : intent.customer?.id,
    stripePaymentIntentId: intent.id,
    test: !intent.livemode,
    transition,
    stripeEventId: event?.id,
    stripeEventCreatedAt: event?.created,
  }, admin);
};

export const applyRefundEvent = async (admin: SupabaseClient, charge: Stripe.Charge, event?: Pick<Stripe.Event, "id" | "created">) => {
  if (!charge.refunded || charge.amount_refunded < charge.amount) return "partial_refund_ignored" as const;
  const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
  if (!paymentIntentId) throw new Error("missing_payment_intent");
  const { data, error } = await admin
    .from("entitlements")
    .select("id,product_key,stripe_livemode,last_stripe_event_created_at")
    .eq("stripe_payment_intent_id", paymentIntentId)
    .maybeSingle();
  if (error || !data || !getProduct(data.product_key) || data.stripe_livemode !== charge.livemode) throw new Error("entitlement_not_found");
  const eventCreatedAt = event?.created || Math.floor(Date.now() / 1000);
  if (data.last_stripe_event_created_at && eventCreatedAt < Number(data.last_stripe_event_created_at)) return "stale_refund_ignored" as const;
  const { error: updateError } = await admin
    .from("entitlements")
    .update({ status: "refunded", updated_at: new Date().toISOString(), last_stripe_event_created_at: eventCreatedAt, last_stripe_event_id: event?.id || null })
    .eq("id", data.id)
    .eq("product_key", data.product_key)
    .eq("stripe_payment_intent_id", paymentIntentId);
  if (updateError) throw new Error("refund_update_failed");
  return "refunded" as const;
};
