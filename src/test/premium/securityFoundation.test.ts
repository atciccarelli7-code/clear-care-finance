import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import accessHandler from "../../../api/access/healthcare-worker-benefits-decision-system";
import checkoutHandler from "../../../api/checkout";
import contentHandler from "../../../api/premium/content";
import webhookHandler from "../../../api/stripe/webhook";
import { checkEntitlement, transitionEntitlement } from "../../../api/_lib/entitlements";
import { sameOrigin } from "../../../api/_lib/http";
import { getPremiumConfig } from "../../../api/_lib/premiumConfig";
import { getProduct } from "../../../api/_lib/productRegistry";
import { actionForStripeEvent, applyCheckoutEvent, claimStripeEvent } from "../../../api/_lib/stripeEvents";

const original = { ...process.env };
afterEach(() => {
  process.env = { ...original };
  vi.restoreAllMocks();
});

const response = () => {
  const capture: { status?: number; body?: unknown; headers: Record<string, string> } = { headers: {} };
  const res = {
    status(code: number) { capture.status = code; return res; },
    json(body: unknown) { capture.body = body; },
    setHeader(name: string, value: string) { capture.headers[name] = value; },
  };
  return { res, capture };
};

const configureAuthFoundation = () => {
  process.env.PREMIUM_AUTH_ENABLED = "true";
  process.env.PREMIUM_ENTITLEMENTS_ENABLED = "true";
  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_ANON_KEY = "public-anon-key";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "server-service-role";
};

describe("feature flags and default denial", () => {
  it("keeps every authority-bearing feature disabled by default", () => {
    delete process.env.PREMIUM_AUTH_ENABLED;
    delete process.env.PREMIUM_ENTITLEMENTS_ENABLED;
    delete process.env.PREMIUM_CHECKOUT_ENABLED;
    const config = getPremiumConfig();
    expect(config.flags.authentication).toBe(false);
    expect(config.flags.entitlementEnforcement).toBe(false);
    expect(config.flags.checkout).toBe(false);
  });

  it("rejects development bypasses and live mode without explicit authorization", () => {
    process.env.PREMIUM_ENTITLEMENT_BYPASS = "true";
    process.env.STRIPE_ENVIRONMENT = "live";
    expect(getPremiumConfig().safe).toBe(false);
    expect(getPremiumConfig().violations.join(" ")).toMatch(/bypass|live/i);
  });

  it("recognizes only the server-side product registry", () => {
    expect(getProduct("healthcare-worker-benefits-decision-system")?.expectedPriceUsd).toBe(29);
    expect(getProduct("client-supplied-product")).toBeNull();
  });

  it("allows configured preview origins without trusting arbitrary hosts in production", () => {
    const request = (origin: string) => ({ method: "POST", headers: { origin } });
    const canonical = "https://communityacquiredfinance.com";
    const preview = "clear-care-finance-preview.vercel.app";

    expect(sameOrigin(request(canonical), canonical)).toBe(true);
    process.env.VERCEL_ENV = "preview";
    process.env.VERCEL_URL = preview;
    expect(sameOrigin(request(`https://${preview}`), canonical)).toBe(true);
    expect(sameOrigin(request("https://attacker.example"), canonical)).toBe(false);

    process.env.VERCEL_ENV = "production";
    expect(sameOrigin(request(`https://${preview}`), canonical)).toBe(false);
  });
});

describe("API denial states", () => {
  it("reports configuration unavailable when access authority is absent", async () => {
    delete process.env.PREMIUM_AUTH_ENABLED;
    const { res, capture } = response();
    await accessHandler({ method: "GET", headers: {} }, res);
    expect(capture.status).toBe(503);
    expect(capture.body).toMatchObject({ status: "configuration_unavailable" });
    expect(capture.headers["Cache-Control"]).toContain("no-store");
  });

  it("returns signed_out without querying user data when no bearer token exists", async () => {
    configureAuthFoundation();
    const { res, capture } = response();
    await accessHandler({ method: "GET", headers: {} }, res);
    expect(capture.status).toBe(200);
    expect(capture.body).toMatchObject({ status: "signed_out" });
  });

  it("keeps checkout disabled and rejects invalid webhook signatures", async () => {
    const checkout = response();
    await checkoutHandler({ method: "POST", headers: { origin: "https://communityacquiredfinance.com" }, body: { productKey: "healthcare-worker-benefits-decision-system" } }, checkout.res);
    expect(checkout.capture.status).toBe(503);
    expect(checkout.capture.body).toMatchObject({ code: "checkout_disabled" });

    configureAuthFoundation();
    process.env.STRIPE_ENVIRONMENT = "test";
    process.env.STRIPE_SECRET_KEY = "sk_test_placeholder";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_placeholder";
    process.env.STRIPE_PRICE_HEALTHCARE_WORKER_BENEFITS_DECISION_SYSTEM = "price_placeholder";
    const webhook = response();
    await webhookHandler({ method: "POST", headers: { "stripe-signature": "invalid" }, body: "{}" }, webhook.res);
    expect(webhook.capture.status).toBe(400);
    expect(webhook.capture.body).toMatchObject({ code: "invalid_signature" });
  });

  it("rejects unsupported products and reports missing Stripe configuration safely", async () => {
    configureAuthFoundation();
    const content = response();
    await contentHandler({
      method: "GET",
      headers: {},
      query: { productKey: "unsupported-product", moduleKey: "define-decision" },
    }, content.res);
    expect(content.capture.status).toBe(404);
    expect(content.capture.body).toMatchObject({ code: "unsupported_module" });

    process.env.PREMIUM_CHECKOUT_ENABLED = "true";
    process.env.STRIPE_ENVIRONMENT = "test";
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_WEBHOOK_SECRET;
    delete process.env.STRIPE_PRICE_HEALTHCARE_WORKER_BENEFITS_DECISION_SYSTEM;
    const checkout = response();
    await checkoutHandler({
      method: "POST",
      headers: { origin: "https://communityacquiredfinance.com" },
      body: { productKey: "healthcare-worker-benefits-decision-system" },
    }, checkout.res);
    expect(checkout.capture.status).toBe(503);
    expect(checkout.capture.body).toMatchObject({ code: "stripe_configuration_unavailable" });
  });
});

describe("entitlement and webhook transitions", () => {
  it("supports processing, grant, refund, revocation, restoration, expiry, and test states", () => {
    expect(transitionEntitlement(null, { type: "mark_processing" })).toBe("processing");
    expect(transitionEntitlement("processing", { type: "grant" })).toBe("active");
    expect(transitionEntitlement("active", { type: "refund" })).toBe("refunded");
    expect(transitionEntitlement("active", { type: "payment_failed" })).toBe("active");
    expect(transitionEntitlement("processing", { type: "payment_failed" })).toBe("revoked");
    expect(transitionEntitlement("active", { type: "revoke" })).toBe("revoked");
    expect(transitionEntitlement("revoked", { type: "restore" })).toBe("active");
    expect(transitionEntitlement("active", { type: "expire" })).toBe("expired");
    expect(transitionEntitlement(null, { type: "grant", test: true })).toBe("test");
  });

  it("maps successful, failed, refund, and ignored events without browser authority", () => {
    expect(actionForStripeEvent({ type: "checkout.session.completed", data: { object: { payment_status: "paid", livemode: false } } } as never)).toMatchObject({ kind: "checkout", transition: { type: "grant", test: true } });
    expect(actionForStripeEvent({ type: "checkout.session.async_payment_failed", data: { object: {} } } as never)).toMatchObject({ transition: { type: "payment_failed" } });
    expect(actionForStripeEvent({ type: "charge.refunded", data: { object: {} } } as never)).toMatchObject({ kind: "refund" });
    expect(actionForStripeEvent({ type: "customer.created", data: { object: {} } } as never)).toEqual({ kind: "ignore" });
  });

  it("treats duplicate webhook event IDs as idempotent success", async () => {
    const query = {
      insert: vi.fn().mockResolvedValue({ error: { code: "23505" } }),
      select: vi.fn(() => query),
      eq: vi.fn(() => query),
      maybeSingle: vi.fn().mockResolvedValue({ data: { processing_status: "processed" }, error: null }),
    };
    const admin = { from: () => query };
    await expect(claimStripeEvent(admin as never, { id: "evt_test", type: "checkout.session.completed" })).resolves.toBe("duplicate");
  });

  it("allows a previously failed webhook event to be retried without duplicate fulfillment", async () => {
    const query = {
      insert: vi.fn().mockResolvedValue({ error: { code: "23505" } }),
      select: vi.fn(() => query),
      eq: vi.fn(() => query),
      maybeSingle: vi.fn().mockResolvedValue({ data: { processing_status: "failed" }, error: null }),
      update: vi.fn(() => query),
      then: (resolve: (value: { error: null }) => void) => resolve({ error: null }),
    };
    const admin = { from: () => query };
    await expect(claimStripeEvent(admin as never, { id: "evt_retry", type: "checkout.session.completed" })).resolves.toBe("claimed");
    expect(query.update).toHaveBeenCalledWith(expect.objectContaining({ processing_status: "processing", error_message: null }));
  });

  it("grants one idempotent test entitlement from verified checkout metadata", async () => {
    let inserted: Record<string, unknown> | undefined;
    const query = {
      select: vi.fn(() => query),
      eq: vi.fn(() => query),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      insert: vi.fn((record: Record<string, unknown>) => {
        inserted = record;
        return Promise.resolve({ error: null });
      }),
    };
    const admin = { from: vi.fn(() => query) };
    const status = await applyCheckoutEvent(admin as never, {
      id: "cs_test_verified",
      livemode: false,
      customer: "cus_test",
      payment_intent: "pi_test",
      metadata: {
        user_id: "10000000-0000-4000-8000-000000000001",
        product_key: "healthcare-worker-benefits-decision-system",
      },
    } as never, { type: "grant", test: true });
    expect(status).toBe("test");
    expect(inserted).toMatchObject({
      user_id: "10000000-0000-4000-8000-000000000001",
      product_key: "healthcare-worker-benefits-decision-system",
      status: "test",
      stripe_checkout_session_id: "cs_test_verified",
    });
  });

  it("denies a missing entitlement and scopes the lookup to the authenticated user", async () => {
    configureAuthFoundation();
    const filters: Array<[string, string]> = [];
    const query = {
      select: vi.fn(() => query),
      eq: vi.fn((field: string, value: string) => {
        filters.push([field, value]);
        return query;
      }),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    };
    const admin = { from: vi.fn(() => query) };
    await expect(checkEntitlement(
      "20000000-0000-4000-8000-000000000002",
      "healthcare-worker-benefits-decision-system",
      admin as never,
    )).resolves.toMatchObject({ accessStatus: "not_purchased" });
    expect(filters).toContainEqual(["user_id", "20000000-0000-4000-8000-000000000002"]);
  });
});

describe("repository security boundaries", () => {
  it("keeps private routes out of search and protects cross-user workspace access", () => {
    const sitemap = readFileSync("public/sitemap.xml", "utf8");
    const vercel = readFileSync("vercel.json", "utf8");
    const workspace = readFileSync("api/workspaces/[workspaceId].ts", "utf8");
    const migration = readFileSync("supabase/migrations/202607240001_premium_system_foundation.sql", "utf8");
    expect(sitemap).not.toMatch(/\/app|\/account|\/sign-in|\/access-processing/);
    expect(vercel).toContain('"source": "/app/(.*)"');
    expect(vercel).toContain("noindex, nofollow, noarchive");
    expect(workspace).toContain('.eq("user_id", user.id)');
    expect(migration).toContain("workspaces_select_own_entitled");
    expect(migration).toContain("revoke all on public.entitlements from anon, authenticated");
  });
});
