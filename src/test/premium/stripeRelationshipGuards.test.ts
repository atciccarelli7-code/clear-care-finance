import { describe, expect, it, vi } from "vitest";
import { applyCheckoutEvent, applyPaymentFailure } from "../../../api/_lib/stripeEvents";
import { assertCheckoutSession } from "../../../api/_lib/stripeValidation";

const productKey = "healthcare-worker-benefits-decision-system";
const userId = "10000000-0000-4000-8000-000000000001";

const currentEntitlementAdmin = (overrides: Record<string, unknown> = {}) => {
  const query = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    maybeSingle: vi.fn().mockResolvedValue({
      data: {
        status: "processing",
        stripe_customer_id: "cus_current",
        stripe_checkout_session_id: "cs_current",
        stripe_payment_intent_id: "pi_current",
        updated_at: "2026-07-27T19:00:00.000Z",
        ...overrides,
      },
      error: null,
    }),
  };
  return { from: vi.fn(() => query) };
};

describe("Stripe relationship and stale-attempt guards", () => {
  it("ignores a payment failure for an older PaymentIntent", async () => {
    const admin = currentEntitlementAdmin();
    const result = await applyPaymentFailure(admin as never, {
      id: "pi_old",
      livemode: false,
      customer: "cus_current",
      metadata: { user_id: userId, product_key: productKey, environment: "test" },
    } as never, { type: "payment_failed" }, { id: "evt_old_failure", created: 1785178500 });

    expect(result).toBe("processing");
    expect(admin.from).toHaveBeenCalledTimes(1);
  });

  it("rejects a payment failure whose customer does not match the entitlement", async () => {
    const admin = currentEntitlementAdmin();
    await expect(applyPaymentFailure(admin as never, {
      id: "pi_current",
      livemode: false,
      customer: "cus_other",
      metadata: { user_id: userId, product_key: productKey, environment: "test" },
    } as never, { type: "payment_failed" }, { id: "evt_wrong_customer", created: 1785178900 }))
      .rejects.toThrow("stripe_customer_relationship_mismatch");
  });

  it("ignores an async failure from an older Checkout Session", async () => {
    const admin = currentEntitlementAdmin();
    const result = await applyCheckoutEvent(admin as never, {
      id: "cs_old",
      livemode: false,
      customer: "cus_current",
      payment_intent: "pi_old",
      metadata: { user_id: userId, product_key: productKey, environment: "test" },
    } as never, { type: "payment_failed" }, { id: "evt_old_session", created: 1785178900 });

    expect(result).toBe("processing");
    expect(admin.from).toHaveBeenCalledTimes(1);
  });

  it("requires an expanded Stripe Customer tied to the session user", () => {
    expect(() => assertCheckoutSession({
      session: {
        id: "cs_verified",
        livemode: false,
        mode: "payment",
        currency: "usd",
        amount_total: 2900,
        customer: {
          id: "cus_current",
          livemode: false,
          deleted: false,
          metadata: { user_id: userId, product_key: productKey, environment: "test" },
        },
        payment_intent: {
          id: "pi_current",
          livemode: false,
          amount: 2900,
          currency: "usd",
          customer: "cus_current",
          metadata: { user_id: userId, product_key: productKey, environment: "test" },
        },
        metadata: { user_id: userId, product_key: productKey, environment: "test" },
        line_items: {
          data: [{
            quantity: 1,
            price: {
              id: "price_expected",
              active: true,
              livemode: false,
              type: "one_time",
              recurring: null,
              currency: "usd",
              unit_amount: 2900,
              metadata: { product_key: productKey },
              product: {
                id: "prod_expected",
                active: true,
                livemode: false,
                name: "Healthcare Worker Benefits Decision System",
                metadata: { product_key: productKey },
              },
            },
          }],
        },
      } as never,
      environment: "test",
      expectedPriceId: "price_expected",
      expectedProductId: "prod_expected",
      expectedProductKey: productKey,
      expectedProductName: "Healthcare Worker Benefits Decision System",
    })).not.toThrow();
  });
});
