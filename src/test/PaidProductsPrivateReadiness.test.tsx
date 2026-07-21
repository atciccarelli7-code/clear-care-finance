import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import {
  PAID_PRODUCT_BUNDLE,
  PAID_PRODUCT_LAUNCH_GATES,
  PAID_PRODUCTS,
} from "@/data/paidProducts";
import { roadmapTools } from "@/data/roadmapTools";
import PrivatePaidProductsLabPage from "@/pages/PrivatePaidProductsLabPage";

describe("private paid product readiness", () => {
  it("keeps every product and bundle private with checkout disabled", () => {
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
    expect(screen.getByRole("heading", { name: /healthcare worker career & benefits decision system/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /medical bill response & resolution system/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /healthcare money decision library/i })).toBeInTheDocument();
    expect(screen.getAllByText(/checkout off/i)).toHaveLength(2);
    expect(screen.queryByRole("button", { name: /buy|purchase|checkout|pay/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /buy|purchase|checkout|pay/i })).not.toBeInTheDocument();
  });

  it("keeps the public product configuration in a default-deny state", () => {
    const source = readFileSync("api/product-config.ts", "utf8");
    expect(source).toContain('portfolioStatus: "private_ready"');
    expect(source).toContain("commerceEnabled: false");
    expect(source).toContain('paymentProvider: "lemon_squeezy_planned"');
    expect(source).not.toContain("checkoutEnabled: true");
  });
});
