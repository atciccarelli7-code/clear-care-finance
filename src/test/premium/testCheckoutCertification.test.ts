import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createCheckoutSession, PremiumApiError } from "@/premium/apiClient";
import { premiumAuthRedirectPath } from "@/premium/auth/AuthProvider";

const PRODUCT_ROUTE = "/products/healthcare-worker-benefits-decision-system?checkout=ready";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Stripe-hosted test Checkout client", () => {
  it("submits only the fixed product key with the authenticated bearer token", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      checkoutUrl: "https://checkout.stripe.com/c/pay/cs_test_example",
    }), { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(createCheckoutSession("access-token")).resolves.toBe("https://checkout.stripe.com/c/pay/cs_test_example");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/checkout");
    expect(init).toMatchObject({ method: "POST", credentials: "same-origin", cache: "no-store" });
    expect(init.headers).toMatchObject({
      "Content-Type": "application/json",
      Authorization: "Bearer access-token",
    });
    expect(JSON.parse(String(init.body))).toEqual({ productKey: "healthcare-worker-benefits-decision-system" });
  });

  it("rejects a non-Stripe redirect even when the API returns HTTP 200", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      checkoutUrl: "https://attacker.example/collect-card",
    }), { status: 200, headers: { "Content-Type": "application/json" } })));

    await expect(createCheckoutSession("access-token")).rejects.toThrow(/Stripe-hosted HTTPS Checkout/i);
  });

  it("preserves a safe server error code for the UI", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      code: "checkout_disabled",
      message: "Checkout is not currently available.",
    }), { status: 503, headers: { "Content-Type": "application/json" } })));

    await expect(createCheckoutSession("access-token")).rejects.toMatchObject<Partial<PremiumApiError>>({
      status: 503,
      code: "checkout_disabled",
      message: "Checkout is not currently available.",
    });
  });
});

describe("fixed magic-link return contexts", () => {
  it("maps only the internal workspace and purchase contexts", () => {
    expect(premiumAuthRedirectPath("purchase")).toBe(PRODUCT_ROUTE);
    expect(premiumAuthRedirectPath("workspace")).toBe("/app/benefits-decision");
    expect(premiumAuthRedirectPath()).toBe("/app/benefits-decision");
  });
});

describe("test Checkout repository boundaries", () => {
  it("keeps the browser test flag off by default and lazy-loads the nonproduction panel", () => {
    const env = readFileSync(".env.example", "utf8");
    const panel = readFileSync("src/components/premium/PremiumTestCheckoutPanel.tsx", "utf8");
    const form = readFileSync("src/components/premium/BenefitsEarlyAccessForm.tsx", "utf8");
    const signIn = readFileSync("src/pages/premium/SignInPage.tsx", "utf8");
    const releaseCheck = readFileSync("scripts/check-premium-release.mjs", "utf8");

    expect(env).toContain("VITE_PREMIUM_TEST_CHECKOUT_DISPLAY_ENABLED=false");
    expect(panel).toContain("Protected test-mode certification");
    expect(panel).toContain("Test mode only · No real charge · No production access");
    expect(panel).toContain("createCheckoutSession(auth.accessToken)");
    expect(form).toContain('import.meta.env.VITE_PREMIUM_TEST_CHECKOUT_DISPLAY_ENABLED === "true"');
    expect(form).toContain('lazy(() => import("@/components/premium/PremiumTestCheckoutPanel")');
    expect(form).toContain("<LazyPremiumTestCheckoutPanel />");
    expect(signIn).toContain('searchParams.get("next") === "purchase" ? "purchase" : "workspace"');
    expect(signIn).toContain("auth.requestMagicLink(email, returnContext)");
    expect(releaseCheck).toContain("protectedTestCheckoutPreview");
    expect(releaseCheck).toContain("The Stripe test Checkout panel must never be compiled into production.");
  });
});
