import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { PAID_PRODUCT_BUNDLE, PAID_PRODUCT_LAUNCH_GATES, PAID_PRODUCTS } from "@/data/paidProducts";
import { roadmapTools } from "@/data/roadmapTools";
import PrivatePaidProductsLabPage from "@/pages/PrivatePaidProductsLabPage";

const purchaseActionName = /\b(buy|purchase|checkout|pay now|order now)\b/i;

describe("private paid product readiness", () => {
  it("keeps legacy private products and the bundle unavailable for direct client checkout", () => {
    expect(PAID_PRODUCTS).toHaveLength(2);
    expect(PAID_PRODUCTS.every((product) => product.status === "private_ready")).toBe(true);
    expect(PAID_PRODUCTS.every((product) => product.checkoutEnabled === false)).toBe(true);
    expect(PAID_PRODUCTS.every((product) => product.checkoutUrl === "")).toBe(true);
    expect(PAID_PRODUCT_BUNDLE.status).toBe("private_ready");
    expect(PAID_PRODUCT_BUNDLE.checkoutEnabled).toBe(false);
    expect(PAID_PRODUCT_BUNDLE.checkoutUrl).toBe("");
    expect(PAID_PRODUCT_LAUNCH_GATES.length).toBeGreaterThanOrEqual(8);
  });

  it("does not register the private product lab without the preview flag", () => {
    expect(roadmapTools.some((tool) => tool.slug === "private-paid-product-lab")).toBe(false);
  });

  it("renders a substantive internal portfolio without purchase controls", () => {
    render(
      <MemoryRouter>
        <PrivatePaidProductsLabPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /two complete paid systems/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^healthcare worker benefits decision system$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /medical bill response & resolution system/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /healthcare money decision library/i })).toBeInTheDocument();
    expect(screen.getAllByText(/checkout off/i)).toHaveLength(2);
    expect(screen.queryByRole("button", { name: purchaseActionName })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: purchaseActionName })).not.toBeInTheDocument();
  });

  it("requires an explicit server switch and every secure dependency before commerce can activate", () => {
    const source = readFileSync("api/product-config.ts", "utf8");
    const checkout = readFileSync("api/checkout.ts", "utf8");
    const config = readFileSync("api/_lib/premiumConfig.ts", "utf8");
    expect(source).toContain("checkoutEnabled: false");
    expect(config).toContain('enabled("PREMIUM_CHECKOUT_ENABLED")');
    expect(config).toContain("Checkout requires entitlement enforcement.");
    expect(config).toContain("Live Stripe mode requires explicit production checkout authorization.");
    expect(checkout).toContain("getServerPrice(productKey)");
    expect(checkout).toContain("if (body.priceId || body.successUrl || body.cancelUrl)");
    expect(checkout).not.toContain("body.priceId as");
  });
});
