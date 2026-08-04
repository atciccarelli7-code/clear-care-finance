import Stripe from "stripe";
import { applyPaymentEntitlement } from "./_lib/entitlements.js";
import { methodNotAllowed, parseJsonBody, safeError, sameOrigin, setPrivateHeaders, type ApiRequest, type ApiResponse } from "./_lib/http.js";
import { getPremiumConfig } from "./_lib/premiumConfig.js";
import { getProduct, getServerPrice, getServerStripeProduct } from "./_lib/productRegistry.js";
import {
  assertStripeCustomer,
  assertStripePrice,
  createIntegrationIdentifier,
  parseCheckoutRequest,
  StripeMappingError,
} from "./_lib/stripeValidation.js";
import { ConfigurationUnavailableError, getSupabaseAdmin, requireAuthenticatedUser, UnauthorizedError } from "./_lib/supabase.js";

const PROCESSING_WINDOW_MS = 24 * 60 * 60 * 1_000;

const isMissingStripeResource = (error: unknown) =>
  Boolean(error && typeof error === "object" && "code" in error && (error as { code?: string }).code === "resource_missing");

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

  let productKey = "";
  try {
    productKey = parseCheckoutRequest(parseJsonBody(req));
  } catch {
    return safeError(res, 400, "invalid_checkout_request", "The checkout request is invalid.");
  }

  try {
    const user = await requireAuthenticatedUser(req);
    const product = getProduct(productKey);
    const priceId = getServerPrice(productKey);
    const stripeProductId = getServerStripeProduct(productKey);
    if (!product || !priceId || !stripeProductId) return safeError(res, 404, "unsupported_product", "The requested product is not available.");

    const admin = getSupabaseAdmin();
    const { data: existingEntitlement, error: entitlementError } = await admin
      .from("entitlements")
      .select("status,expires_at,updated_at")
      .eq("user_id", user.id)
      .eq("product_key", product.productKey)
      .maybeSingle();
    if (entitlementError) throw new Error("entitlement_lookup_failed");
    const accessUnexpired = !existingEntitlement?.expires_at || new Date(existingEntitlement.expires_at).getTime() > Date.now();
    if (accessUnexpired && (existingEntitlement?.status === "active" || existingEntitlement?.status === "test")) {
      return safeError(res, 409, "already_entitled", "Access is already active for this product.");
    }
    if (
      existingEntitlement?.status === "processing"
      && Date.now() - new Date(existingEntitlement.updated_at).getTime() < PROCESSING_WINDOW_MS
    ) {
      return safeError(res, 409, "checkout_in_progress", "A checkout attempt is already processing.");
    }

    const stripe = new Stripe(config.stripe.secretKey);
    const stripePrice = await stripe.prices.retrieve(priceId, { expand: ["product"] });
    assertStripePrice({
      price: stripePrice,
      environment: config.stripe.environment,
      expectedPriceId: priceId,
      expectedProductId: stripeProductId,
      expectedProductKey: product.productKey,
      expectedProductName: product.name,
    });

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (profileError) throw new Error("profile_lookup_failed");

    let customerId = profile?.stripe_customer_id || "";
    if (customerId) {
      try {
        const customer = await stripe.customers.retrieve(customerId);
        assertStripeCustomer(customer, user.id, config.stripe.environment);
        if (!("deleted" in customer) && (
          customer.metadata.product_key !== product.productKey
          || customer.metadata.environment !== config.stripe.environment
        )) {
          await stripe.customers.update(customerId, {
            metadata: {
              ...customer.metadata,
              user_id: user.id,
              product_key: product.productKey,
              environment: config.stripe.environment,
            },
          });
        }
      } catch (error) {
        if (!isMissingStripeResource(error)) throw error;
        customerId = "";
      }
    }

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
          product_key: product.productKey,
          environment: config.stripe.environment,
        },
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

    const metadata = {
      user_id: user.id,
      product_key: product.productKey,
      environment: config.stripe.environment,
    };
    const sessionParams: Stripe.Checkout.SessionCreateParams & { integration_identifier: string } = {
      mode: "payment",
      customer: customerId,
      client_reference_id: user.id,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata,
      payment_intent_data: { metadata },
      success_url: `${config.siteUrl}/access-processing`,
      cancel_url: `${config.siteUrl}${product.publicRoute}?checkout=cancelled`,
      allow_promotion_codes: false,
      billing_address_collection: "auto",
      integration_identifier: createIntegrationIdentifier(),
    };
    const session = await stripe.checkout.sessions.create(sessionParams);
    if (!session.url) throw new Error("checkout_url_missing");
    await applyPaymentEntitlement({
      userId: user.id,
      productKey: product.productKey,
      stripeCustomerId: customerId,
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: null,
      test: config.stripe.environment === "test",
      transition: { type: "mark_processing" },
    }, admin);
    return res.status(200).json({ checkoutUrl: session.url });
  } catch (error) {
    if (error instanceof UnauthorizedError) return safeError(res, 401, "authentication_required", "Sign in to continue.");
    if (error instanceof ConfigurationUnavailableError) return safeError(res, 503, "configuration_unavailable", "Checkout is not currently available.");
    if (error instanceof StripeMappingError) return safeError(res, 503, "stripe_mapping_invalid", "Checkout is not currently available.");
    return safeError(res, 503, "checkout_unavailable", "Checkout could not be opened.");
  }
}
