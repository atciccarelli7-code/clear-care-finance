import Stripe from "stripe";
import { methodNotAllowed, readRawBody, safeError, setPrivateHeaders, type ApiRequest, type ApiResponse } from "../_lib/http.js";
import { getPremiumConfig } from "../_lib/premiumConfig.js";
import { getSupabaseAdmin } from "../_lib/supabase.js";
import {
  actionForStripeEvent,
  applyCheckoutEvent,
  applyPaymentFailure,
  applyRefundEvent,
  claimStripeEvent,
  finishStripeEvent,
  validateCheckoutSessionMapping,
} from "../_lib/stripeEvents.js";

export const config = { api: { bodyParser: false } };

const header = (req: ApiRequest, name: string) => {
  const raw = req.headers[name];
  return Array.isArray(raw) ? raw[0] : raw || "";
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setPrivateHeaders(res);
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  const premium = getPremiumConfig();
  if (!premium.safe || !premium.flags.entitlementEnforcement || !premium.supabase.configured || !premium.stripe.webhookSecret || !premium.stripe.secretKey) {
    return safeError(res, 503, "configuration_unavailable", "Webhook processing is unavailable.");
  }
  const stripe = new Stripe(premium.stripe.secretKey);
  let event: Stripe.Event;
  try {
    const signature = header(req, "stripe-signature");
    if (!signature) return safeError(res, 400, "invalid_signature", "Invalid webhook signature.");
    event = stripe.webhooks.constructEvent(await readRawBody(req), signature, premium.stripe.webhookSecret);
  } catch {
    return safeError(res, 400, "invalid_signature", "Invalid webhook signature.");
  }

  const admin = getSupabaseAdmin();
  try {
    const claim = await claimStripeEvent(admin, event);
    if (claim === "duplicate") return res.status(200).json({ received: true, duplicate: true });
    const action = actionForStripeEvent(event);
    if (action.kind === "ignore") {
      await finishStripeEvent(admin, event.id, "ignored");
      return res.status(200).json({ received: true });
    }
    if (action.kind === "refund") {
      await applyRefundEvent(admin, event.data.object as Stripe.Charge, event);
    } else if (event.type === "payment_intent.payment_failed") {
      await applyPaymentFailure(admin, event.data.object as Stripe.PaymentIntent, action.transition, event);
    } else {
      const incoming = event.data.object as Stripe.Checkout.Session;
      const session = await stripe.checkout.sessions.retrieve(incoming.id, { expand: ["line_items"] });
      validateCheckoutSessionMapping(session, premium.stripe.environment);
      await applyCheckoutEvent(admin, session, action.transition, event);
    }
    await finishStripeEvent(admin, event.id, "processed");
    return res.status(200).json({ received: true });
  } catch (error) {
    try {
      await finishStripeEvent(admin, event.id, "failed", error instanceof Error ? error.message.slice(0, 80) : "processing_failed");
    } catch {
      // Preserve the original controlled response.
    }
    return safeError(res, 503, "webhook_processing_failed", "The event could not be processed.");
  }
}
