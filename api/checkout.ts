import Stripe from "stripe";
import { applyPaymentEntitlement } from "./_lib/entitlements.js";
import { methodNotAllowed, parseJsonBody, safeError, sameOrigin, setPrivateHeaders, type ApiRequest, type ApiResponse } from "./_lib/http.js";
import { getPremiumConfig } from "./_lib/premiumConfig.js";
import { getProduct, getServerPrice } from "./_lib/productRegistry.js";
import { ConfigurationUnavailableError, getSupabaseAdmin, requireAuthenticatedUser, UnauthorizedError } from "./_lib/supabase.js";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setPrivateHeaders(res);
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  const config = getPremiumConfig();
  if (!sameOrigin(req, config.siteUrl)) return safeError(res, 403, "origin_rejected", "The request origin was rejected.");
  if (!config.flags.checkout) return safeError(res, 503, "checkout_disabled", "Checkout is not currently available.");
  if (!config.flags.authentication || !config.flags.entitlementEnforcement || !config.supabase.configured) {
    return safeError(res, 503, "configuration_unavailable", "Checkout is not currently available.");
  }
  if (!config.stripe.testConfigured && !(config.stripe.liveConfigured && config.flags.productionCheckoutAuthorized)) {
    return safeError(res, 503, "stripe_configuration_unavailable", "Checkout is not currently available.");
  }
  if (!config.safe) return safeError(res, 503, "checkout_disabled", "Checkout is not currently available.");
  try {
    const user = await requireAuthenticatedUser(req);
    const body = parseJsonBody<{ productKey?: unknown; priceId?: unknown; successUrl?: unknown; cancelUrl?: unknown }>(req);
    if (body.priceId || body.successUrl || body.cancelUrl) return safeError(res, 400, "invalid_checkout_request", "The checkout request is invalid.");
    const productKey = typeof body.productKey === "string" ? body.productKey : "";
    const product = getProduct(productKey);
    const price = getServerPrice(productKey);
    if (!product || !price) return safeError(res, 404, "unsupported_product", "The requested product is not available.");

    const admin = getSupabaseAdmin();
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (profileError) throw new Error("profile_lookup_failed");
    const stripe = new Stripe(config.stripe.secretKey);
    let customerId = profile?.stripe_customer_id || "";
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;
      const { error } = await admin.from("profiles").upsert({
        user_id: user.id,
        email: user.email,
        stripe_customer_id: customerId,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
      if (error) throw new Error("profile_update_failed");
    }

    const metadata = { user_id: user.id, product_key: product.productKey };
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      line_items: [{ price, quantity: 1 }],
      metadata,
      payment_intent_data: { metadata },
      success_url: `${config.siteUrl}/access-processing`,
      cancel_url: `${config.siteUrl}${product.publicRoute}?checkout=cancelled`,
      allow_promotion_codes: false,
      billing_address_collection: "auto",
    });
    if (!session.url) throw new Error("checkout_url_missing");
    await applyPaymentEntitlement({
      userId: user.id,
      productKey: product.productKey,
      stripeCustomerId: customerId,
      stripeCheckoutSessionId: session.id,
      test: config.stripe.environment === "test",
      transition: { type: "mark_processing" },
    }, admin);
    return res.status(200).json({ checkoutUrl: session.url });
  } catch (error) {
    if (error instanceof UnauthorizedError) return safeError(res, 401, "authentication_required", "Sign in to continue.");
    if (error instanceof ConfigurationUnavailableError) return safeError(res, 503, "configuration_unavailable", "Checkout is not currently available.");
    return safeError(res, 503, "checkout_unavailable", "Checkout could not be opened.");
  }
}
