import { afterEach, describe, expect, it, vi } from "vitest";
import type Stripe from "stripe";
import { getPremiumConfig } from "../../../api/_lib/premiumConfig";
import { BENEFITS_PRODUCT_KEY, MEDICARE_PRODUCT_KEY, getServerPrice } from "../../../api/_lib/productRegistry";
import { applyCheckoutEvent, applyPaymentFailure, applyRefundEvent, validateCheckoutSessionMapping } from "../../../api/_lib/stripeEvents";
import { transitionEntitlement } from "../../../api/_lib/entitlements";
import { emptyMedicareCoverageState, medicareCoverageStateSchema } from "@/medicare/contracts";
import { workspaceStateSchema } from "@/premium/contracts";
import { workspaceTitleForProduct } from "../../../api/_lib/workspaceRegistry";

const original = { ...process.env };
afterEach(() => {
  process.env = { ...original };
  vi.restoreAllMocks();
});

const configurePrices = () => {
  process.env.STRIPE_PRICE_HEALTHCARE_WORKER_BENEFITS_DECISION_SYSTEM = "price_benefits_test";
  process.env.STRIPE_PRICE_MEDICARE_COVERAGE_DECISION_SYSTEM = "price_medicare_test";
};

const session = (productKey: string, priceId: string, overrides: Partial<Stripe.Checkout.Session> = {}) => ({
  id: `cs_${productKey}`,
  mode: "payment",
  livemode: false,
  amount_total: 2900,
  metadata: { user_id: "10000000-0000-4000-8000-000000000001", product_key: productKey },
  line_items: { data: [{ quantity: 1, price: { id: priceId, currency: "usd", unit_amount: 2900 } }] },
  ...overrides,
} as unknown as Stripe.Checkout.Session);

describe("multi-product server authority", () => {
  it("maps Benefits and Medicare to separate server-only prices", () => {
    configurePrices();
    expect(getServerPrice(BENEFITS_PRODUCT_KEY)).toBe("price_benefits_test");
    expect(getServerPrice(MEDICARE_PRODUCT_KEY)).toBe("price_medicare_test");
    expect(getServerPrice("browser-invented-product")).toBe("");
  });

  it("accepts the exact Medicare and Benefits line item mappings", () => {
    configurePrices();
    expect(validateCheckoutSessionMapping(session(MEDICARE_PRODUCT_KEY, "price_medicare_test"), "test").productKey).toBe(MEDICARE_PRODUCT_KEY);
    expect(validateCheckoutSessionMapping(session(BENEFITS_PRODUCT_KEY, "price_benefits_test"), "test").productKey).toBe(BENEFITS_PRODUCT_KEY);
  });

  it("fails closed for a wrong price, altered product metadata, mixed mapping, quantity, amount, or mode", () => {
    configurePrices();
    expect(() => validateCheckoutSessionMapping(session(MEDICARE_PRODUCT_KEY, "price_benefits_test"), "test")).toThrow("invalid_product_mapping");
    expect(() => validateCheckoutSessionMapping(session("unknown-product", "price_medicare_test"), "test")).toThrow("invalid_product_mapping");
    expect(() => validateCheckoutSessionMapping(session(BENEFITS_PRODUCT_KEY, "price_medicare_test"), "test")).toThrow("invalid_product_mapping");
    expect(() => validateCheckoutSessionMapping(session(MEDICARE_PRODUCT_KEY, "price_medicare_test", { amount_total: 1 }), "test")).toThrow("invalid_product_mapping");
    expect(() => validateCheckoutSessionMapping(session(MEDICARE_PRODUCT_KEY, "price_medicare_test", { mode: "subscription" }), "test")).toThrow("invalid_product_mapping");
    expect(() => validateCheckoutSessionMapping(session(MEDICARE_PRODUCT_KEY, "price_medicare_test", { livemode: true }), "test")).toThrow("invalid_product_mapping");
  });

  it("keeps live checkout invalid without explicit authorization", () => {
    process.env.STRIPE_ENVIRONMENT = "live";
    process.env.STRIPE_SECRET_KEY = "sk_live_placeholder";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_placeholder";
    process.env.PREMIUM_CHECKOUT_ENABLED = "true";
    process.env.PREMIUM_ENTITLEMENTS_ENABLED = "true";
    configurePrices();
    expect(getPremiumConfig().safe).toBe(false);
    expect(getPremiumConfig().violations.join(" ")).toMatch(/explicit production checkout authorization/i);
  });

  it("does not grant test access from a checkout-created processing row", () => {
    expect(transitionEntitlement(null, { type: "mark_processing", test: true })).toBe("processing");
    expect(transitionEntitlement("processing", { type: "grant", test: true })).toBe("test");
  });
});

describe("product-specific entitlement isolation", () => {
  it.each([
    [BENEFITS_PRODUCT_KEY, "cs_benefits"],
    [MEDICARE_PRODUCT_KEY, "cs_medicare"],
  ])("grants only the purchased %s entitlement", async (productKey, checkoutId) => {
    let inserted: Record<string, unknown> | undefined;
    const query = {
      select: vi.fn(() => query),
      eq: vi.fn(() => query),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      insert: vi.fn((record: Record<string, unknown>) => { inserted = record; return Promise.resolve({ error: null }); }),
    };
    const admin = { from: vi.fn(() => query) };
    await applyCheckoutEvent(admin as never, {
      id: checkoutId,
      livemode: false,
      customer: "cus_test",
      payment_intent: `pi_${productKey}`,
      metadata: { user_id: "10000000-0000-4000-8000-000000000001", product_key: productKey },
    } as never, { type: "grant", test: true }, { id: `evt_${productKey}`, created: 1_786_230_000 });
    expect(inserted).toMatchObject({ product_key: productKey, status: "test", stripe_livemode: false });
    expect(inserted?.product_key).not.toBe(productKey === MEDICARE_PRODUCT_KEY ? BENEFITS_PRODUCT_KEY : MEDICARE_PRODUCT_KEY);
  });

  it("a Medicare refund updates only the entitlement found by its payment intent and product", async () => {
    const updates: Record<string, unknown>[] = [];
    const filters: Array<[string, unknown]> = [];
    const query = {
      select: vi.fn(() => query),
      eq: vi.fn((field: string, value: unknown) => { filters.push([field, value]); return query; }),
      maybeSingle: vi.fn().mockResolvedValue({ data: { id: "ent_medicare", product_key: MEDICARE_PRODUCT_KEY, stripe_livemode: false, last_stripe_event_created_at: null }, error: null }),
      update: vi.fn((record: Record<string, unknown>) => { updates.push(record); return query; }),
      then: (resolve: (value: { error: null }) => void) => resolve({ error: null }),
    };
    const admin = { from: vi.fn(() => query) };
    await expect(applyRefundEvent(admin as never, { refunded: true, amount: 2900, amount_refunded: 2900, payment_intent: "pi_medicare", livemode: false } as never, { id: "evt_refund", created: 1_786_230_100 })).resolves.toBe("refunded");
    expect(filters).toContainEqual(["stripe_payment_intent_id", "pi_medicare"]);
    expect(filters).toContainEqual(["product_key", MEDICARE_PRODUCT_KEY]);
    expect(updates[0]).toMatchObject({ status: "refunded" });
  });

  it("fails closed when a failure or refund event mode does not match the stored entitlement", async () => {
    const query = {
      select: vi.fn(() => query),
      eq: vi.fn(() => query),
      maybeSingle: vi.fn().mockResolvedValue({ data: { id: "ent_medicare", product_key: MEDICARE_PRODUCT_KEY, stripe_livemode: false, last_stripe_event_created_at: null }, error: null }),
    };
    const admin = { from: vi.fn(() => query) };
    await expect(applyPaymentFailure(admin as never, {
      id: "pi_medicare",
      livemode: true,
      metadata: { user_id: "10000000-0000-4000-8000-000000000001", product_key: MEDICARE_PRODUCT_KEY },
    } as never, { type: "payment_failed", test: false })).rejects.toThrow("payment_entitlement_not_found");
    await expect(applyRefundEvent(admin as never, {
      refunded: true,
      amount: 2900,
      amount_refunded: 2900,
      payment_intent: "pi_medicare",
      livemode: true,
    } as never)).rejects.toThrow("entitlement_not_found");
  });
});

describe("product-specific workspace contracts", () => {
  it("keeps Benefits and Medicare workspace states mutually exclusive", () => {
    const medicare = emptyMedicareCoverageState();
    expect(medicareCoverageStateSchema.safeParse(medicare).success).toBe(true);
    expect(workspaceStateSchema.safeParse(medicare).success).toBe(false);
    expect(medicareCoverageStateSchema.safeParse({ version: 1, activeModuleKey: "define-decision" }).success).toBe(false);
  });

  it("ignores client-supplied Medicare workspace titles while preserving the Benefits title contract", () => {
    expect(workspaceTitleForProduct(MEDICARE_PRODUCT_KEY, "Medication and provider details")).toBe("Medicare coverage decision");
    expect(workspaceTitleForProduct(BENEFITS_PRODUCT_KEY, "My benefits comparison")).toBe("My benefits comparison");
  });
});
