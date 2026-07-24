import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { premiumModuleManifest, premiumProductManifest } from "../../api/_lib/premiumProduct";
import { addTwelveMonths, resolveEntitlementStatus } from "../../api/premium-webhook";
import { sanitizeProgress } from "../../api/premium-workspace";

describe("premium workspace product contract", () => {
  it("uses the canonical fourteen-module v3 public manifest", () => {
    expect(premiumProductManifest.sourceVersion).toBe("3.0");
    expect(premiumProductManifest.version).toBe("3.0-web.1");
    expect(premiumProductManifest.purchaseModel.type).toBe("one_time");
    expect(premiumProductManifest.purchaseModel.automaticRenewal).toBe(false);
    expect(premiumProductManifest.purchaseModel.ads).toBe(false);
    expect(premiumModuleManifest).toHaveLength(14);
    expect(new Set(premiumModuleManifest.map((module) => module.id)).size).toBe(14);
    expect(premiumModuleManifest.at(-1)?.id).toBe("integrated-decision");
  });

  it("grants entitlement only for paid order states and revokes it for refunds", () => {
    expect(resolveEntitlementStatus("order_created", "paid")).toBe("active");
    expect(resolveEntitlementStatus("order_updated", "paid")).toBe("active");
    expect(resolveEntitlementStatus("order_created", "pending")).toBeNull();
    expect(resolveEntitlementStatus("order_updated", "failed")).toBeNull();
    expect(resolveEntitlementStatus("order_refunded", "refunded")).toBe("refunded");
    expect(resolveEntitlementStatus("order_updated", "paid", "2026-07-24T00:00:00.000Z")).toBe("refunded");
  });

  it("sets the update period to twelve calendar months from purchase", () => {
    expect(addTwelveMonths("2026-07-23T12:00:00.000Z")).toBe("2027-07-23T12:00:00.000Z");
    expect(addTwelveMonths("2024-02-29T12:00:00.000Z")).toBe("2025-03-01T12:00:00.000Z");
  });

  it("accepts only known module and generic task identifiers", () => {
    const progress = sanitizeProgress({
      completedModuleIds: ["pay-structure", "not-a-module", "pay-structure"],
      activeModuleId: "not-a-module",
      completedTaskIds: ["document:offer", "document:offer", "private-note:salary", "document:../../secret"],
    });
    expect(progress.completedModuleIds).toEqual(["pay-structure"]);
    expect(progress.activeModuleId).toBe("total-compensation");
    expect(progress.completedTaskIds).toEqual(["document:offer"]);
  });
});

describe("premium workspace exposure boundaries", () => {
  it("keeps protected routes out of the public sitemap and applies noindex/no-store headers", () => {
    const sitemap = readFileSync("public/sitemap.xml", "utf8");
    const vercel = readFileSync("vercel.json", "utf8");
    expect(sitemap).not.toContain("/premium/");
    expect(vercel).toContain('"source": "/premium/(.*)"');
    expect(vercel).toContain('"value": "noindex, nofollow, noarchive"');
    expect(vercel).toContain('"value": "private, no-store, max-age=0"');
  });

  it("returns private content only after server-side entitlement verification", () => {
    const endpoint = readFileSync("api/premium-workspace.ts", "utf8");
    expect(endpoint.indexOf("requireActiveEntitlement(req)")).toBeGreaterThan(-1);
    expect(endpoint.indexOf("getPremiumProductContent()")).toBeGreaterThan(endpoint.indexOf("requireActiveEntitlement(req)"));
    expect(endpoint.indexOf("product,")).toBeGreaterThan(endpoint.indexOf("getPremiumProductContent()"));
    expect(endpoint).toContain('access.reason === "signed_out" ? 401');
    expect(endpoint).toContain('access.reason === "purchase_required" ? 403');
    expect(endpoint).toContain('error: "content_not_configured"');
  });

  it("keeps payment and storage credentials server-only", () => {
    const env = readFileSync(".env.example", "utf8");
    expect(env).toContain("LEMON_SQUEEZY_WEBHOOK_SECRET=");
    expect(env).toContain("UPSTASH_REDIS_REST_TOKEN=");
    expect(env).not.toContain("VITE_LEMON_SQUEEZY_WEBHOOK_SECRET");
    expect(env).not.toContain("VITE_UPSTASH_REDIS_REST_TOKEN");
  });

  it("keeps substantive paid content out of public repository source and client bundles", () => {
    const client = readFileSync("src/pages/PremiumHealthcareBenefitsWorkspacePage.tsx", "utf8");
    const manifest = readFileSync("api/_lib/premiumProduct.ts", "utf8");
    const loader = readFileSync("api/_lib/premiumContent.ts", "utf8");
    const gitignore = readFileSync(".gitignore", "utf8");
    expect(client).toContain('fetch("/api/premium-workspace"');
    expect(client).not.toContain("What compensation is guaranteed in writing?");
    expect(manifest).not.toContain("What compensation is guaranteed in writing?");
    expect(manifest).not.toContain("My healthcare compensation & benefits elections");
    expect(loader).toContain("getJson<unknown>(PREMIUM_CONTENT_STORE_KEY)");
    expect(loader).toContain("isValidPremiumProductContent(content)");
    expect(gitignore).toContain("private-product-content/");
  });
});
