import Stripe from "stripe";
import { methodNotAllowed, readRawBody, safeError, setPrivateHeaders, type ApiRequest, type ApiResponse } from "../_lib/http.js";
import { getPremiumConfig } from "../_lib/premiumConfig.js";
import { getProduct, PREMIUM_PRODUCT_KEY } from "../_lib/productRegistry.js";
import {
  assertCharge,
  assertCheckoutSession,
  assertPaymentIntent,
  assertStripeMode,
  stableStripeErrorCode,
  stripeObjectId,
} from "../_lib/stripeValidation.js";
import { getSupabaseAdmin } from "../_lib/supabase.js";
import {
  actionForStripeEvent,
  applyCheckoutEvent,
  applyPaymentFailure,
  applyRefundEvent,
  claimStripeEvent,
  finishStripeEvent,
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
  const stripeConfigured = premium.stripe.testConfigured || premium.stripe.liveConfigured;
  if (
    !premium.safe
    || !premium.flags.entitlementEnforcement
    || !premium.supabase.configured
    || !stripeConfigured
  ) {
    return safeError(res, 503, "configuration_unavailable", "Webhook processing is unavailable.");
  }
  const product = getProduct(PREMIUM_PRODUCT_KEY);
  if (!product) return safeError(res, 503, "configuration_unavailable", "Webhook processing is unavailable.");

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

    try {
      assertStripeMode(event.livemode, premium.stripe.environment);
    } catch {
      await finishStripeEvent(admin, event.id, "ignored", "stripe_mode_mismatch");
      return res.status(200).json({ received: true, ignored: true });
    }

    const action = actionForStripeEvent(event);
    if (action.kind === "ignore") {
      await finishStripeEvent(admin, event.id, "ignored", "unsupported_event_type");
      return res.status(200).json({ received: true });
    }

    if (action.kind === "refund") {
      const charge = event.data.object as Stripe.Charge;
      assertCharge(charge, premium.stripe.environment);
      const paymentIntentId = stripeObjectId(charge.payment_intent);
      if (!paymentIntentId) throw new Error("missing_payment_intent");
      const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
      assertPaymentIntent(intent, premium.stripe.environment, product.productKey);
      if (stripeObjectId(charge.customer) !== stripeObjectId(intent.customer)) {
        throw new Error("stripe_customer_relationship_mismatch");
      }
      const result = await applyRefundEvent(admin, charge, event);
      if (result === "partial_refund_ignored") {
        await finishStripeEvent(admin, event.id, "ignored", "partial_refund_no_access_change");
        return res.status(200).json({ received: true, ignored: true });
      }
    } else if (event.type === "payment_intent.payment_failed") {
      const intent = event.data.object as Stripe.PaymentIntent;
      assertPaymentIntent(intent, premium.stripe.environment, product.productKey);
      await applyPaymentFailure(admin, intent, action.transition, event);
    } else {
      const incoming = event.data.object as Stripe.Checkout.Session;
      const session = await stripe.checkout.sessions.retrieve(incoming.id, {
        expand: ["customer", "line_items.data.price.product", "payment_intent"],
      });
      assertCheckoutSession({
        session,
        environment: premium.stripe.environment,
        expectedPriceId: premium.stripe.price,
        expectedProductId: premium.stripe.product,
        expectedProductKey: product.productKey,
        expectedProductName: product.name,
      });
      if (action.transition.type === "grant" && session.payment_status !== "paid") {
        throw new Error("stripe_payment_not_paid");
      }
      if (action.transition.type === "payment_failed" && session.payment_status === "paid") {
        throw new Error("stripe_failure_event_paid");
      }
      await applyCheckoutEvent(admin, session, action.transition, event);
    }
    await finishStripeEvent(admin, event.id, "processed");
    return res.status(200).json({ received: true });
  } catch (error) {
    try {
      await finishStripeEvent(admin, event.id, "failed", stableStripeErrorCode(error));
    } catch {
      // Preserve the original controlled response.
    }
    return safeError(res, 503, "webhook_processing_failed", "The event could not be processed.");
  }
}
