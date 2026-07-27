import { randomBytes } from "node:crypto";
import type Stripe from "stripe";

export const EXPECTED_CURRENCY = "usd";
export const EXPECTED_PRICE_CENTS = 2_900;

export class StripeMappingError extends Error {
  constructor(code: string) {
    super(code);
    this.name = "StripeMappingError";
  }
}

const expectedLiveMode = (environment: string) => {
  if (environment === "test") return false;
  if (environment === "live") return true;
  throw new StripeMappingError("invalid_stripe_environment");
};

export const assertStripeMode = (livemode: boolean, environment: string) => {
  if (livemode !== expectedLiveMode(environment)) throw new StripeMappingError("stripe_mode_mismatch");
};

const objectId = (value: string | { id: string } | null | undefined) =>
  typeof value === "string" ? value : value?.id || "";

export const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export const parseCheckoutRequest = (body: unknown) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new StripeMappingError("invalid_checkout_request");
  const record = body as Record<string, unknown>;
  const keys = Object.keys(record);
  if (keys.length !== 1 || keys[0] !== "productKey" || typeof record.productKey !== "string") {
    throw new StripeMappingError("invalid_checkout_request");
  }
  return record.productKey;
};

export const createIntegrationIdentifier = () => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const suffix = Array.from(randomBytes(8), (byte) => alphabet[byte % alphabet.length]).join("");
  return `caf_benefits_${suffix}`;
};

export const assertStripePrice = ({
  price,
  environment,
  expectedPriceId,
  expectedProductId,
  expectedProductKey,
  expectedProductName,
}: {
  price: Stripe.Price;
  environment: string;
  expectedPriceId: string;
  expectedProductId: string;
  expectedProductKey: string;
  expectedProductName: string;
}) => {
  assertStripeMode(price.livemode, environment);
  if (price.id !== expectedPriceId) throw new StripeMappingError("stripe_price_id_mismatch");
  if (!price.active) throw new StripeMappingError("stripe_price_inactive");
  if (price.type !== "one_time" || price.recurring) throw new StripeMappingError("stripe_price_not_one_time");
  if (price.currency !== EXPECTED_CURRENCY) throw new StripeMappingError("stripe_currency_mismatch");
  if (price.unit_amount !== EXPECTED_PRICE_CENTS) throw new StripeMappingError("stripe_amount_mismatch");
  if (price.metadata?.product_key !== expectedProductKey) throw new StripeMappingError("stripe_price_metadata_mismatch");

  const productId = objectId(price.product as string | Stripe.Product | Stripe.DeletedProduct);
  if (productId !== expectedProductId) throw new StripeMappingError("stripe_product_id_mismatch");
  if (typeof price.product !== "string") {
    const product = price.product as Stripe.Product | Stripe.DeletedProduct;
    if ("deleted" in product && product.deleted) throw new StripeMappingError("stripe_product_deleted");
    const activeProduct = product as Stripe.Product;
    assertStripeMode(activeProduct.livemode, environment);
    if (!activeProduct.active) throw new StripeMappingError("stripe_product_inactive");
    if (activeProduct.name !== expectedProductName) throw new StripeMappingError("stripe_product_name_mismatch");
    if (activeProduct.metadata?.product_key !== expectedProductKey) throw new StripeMappingError("stripe_product_metadata_mismatch");
  }
};

export const assertStripeCustomer = (customer: Stripe.Customer | Stripe.DeletedCustomer, userId: string, environment: string) => {
  if ("deleted" in customer && customer.deleted) throw new StripeMappingError("stripe_customer_deleted");
  const activeCustomer = customer as Stripe.Customer;
  assertStripeMode(activeCustomer.livemode, environment);
  if (activeCustomer.metadata?.user_id !== userId) throw new StripeMappingError("stripe_customer_user_mismatch");
};

export const assertCheckoutSession = ({
  session,
  environment,
  expectedPriceId,
  expectedProductId,
  expectedProductKey,
  expectedProductName,
}: {
  session: Stripe.Checkout.Session;
  environment: string;
  expectedPriceId: string;
  expectedProductId: string;
  expectedProductKey: string;
  expectedProductName: string;
}) => {
  assertStripeMode(session.livemode, environment);
  if (session.mode !== "payment") throw new StripeMappingError("stripe_session_mode_mismatch");
  if (session.currency !== EXPECTED_CURRENCY) throw new StripeMappingError("stripe_session_currency_mismatch");
  if (session.amount_total !== EXPECTED_PRICE_CENTS) throw new StripeMappingError("stripe_session_amount_mismatch");
  if (session.metadata?.product_key !== expectedProductKey || session.metadata?.environment !== environment) {
    throw new StripeMappingError("stripe_session_metadata_mismatch");
  }
  if (!isUuid(session.metadata?.user_id || "")) throw new StripeMappingError("stripe_session_user_invalid");
  const items = session.line_items?.data || [];
  if (items.length !== 1 || items[0]?.quantity !== 1 || !items[0]?.price) throw new StripeMappingError("stripe_line_item_mismatch");
  assertStripePrice({
    price: items[0].price,
    environment,
    expectedPriceId,
    expectedProductId,
    expectedProductKey,
    expectedProductName,
  });

  if (session.payment_intent && typeof session.payment_intent !== "string") {
    const intent = session.payment_intent as Stripe.PaymentIntent;
    assertStripeMode(intent.livemode, environment);
    if (intent.amount !== EXPECTED_PRICE_CENTS || intent.currency !== EXPECTED_CURRENCY) {
      throw new StripeMappingError("stripe_payment_intent_amount_mismatch");
    }
    if (
      intent.metadata?.user_id !== session.metadata.user_id
      || intent.metadata?.product_key !== expectedProductKey
      || intent.metadata?.environment !== environment
    ) {
      throw new StripeMappingError("stripe_payment_intent_metadata_mismatch");
    }
    if (objectId(intent.customer) !== objectId(session.customer)) throw new StripeMappingError("stripe_customer_relationship_mismatch");
  }
};

export const assertPaymentIntent = (
  intent: Stripe.PaymentIntent,
  environment: string,
  expectedProductKey: string,
) => {
  assertStripeMode(intent.livemode, environment);
  if (intent.amount !== EXPECTED_PRICE_CENTS || intent.currency !== EXPECTED_CURRENCY) {
    throw new StripeMappingError("stripe_payment_intent_amount_mismatch");
  }
  if (
    !isUuid(intent.metadata?.user_id || "")
    || intent.metadata?.product_key !== expectedProductKey
    || intent.metadata?.environment !== environment
  ) {
    throw new StripeMappingError("stripe_payment_intent_metadata_mismatch");
  }
};

export const assertCharge = (charge: Stripe.Charge, environment: string) => {
  assertStripeMode(charge.livemode, environment);
  if (charge.amount !== EXPECTED_PRICE_CENTS || charge.currency !== EXPECTED_CURRENCY) {
    throw new StripeMappingError("stripe_charge_amount_mismatch");
  }
};

export const isFullRefund = (charge: Pick<Stripe.Charge, "amount" | "amount_refunded" | "refunded">) =>
  charge.refunded === true && charge.amount_refunded >= charge.amount;

export const stableStripeErrorCode = (error: unknown) => {
  const message = error instanceof Error ? error.message : "processing_failed";
  return /^[a-z0-9_]{1,80}$/.test(message) ? message : "processing_failed";
};
