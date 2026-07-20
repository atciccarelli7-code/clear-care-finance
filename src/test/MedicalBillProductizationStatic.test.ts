import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

const productPage = read("public/products/expanded-medical-bill-response-workbook.html");
const productEnhancement = read("public/medical-bill-productization.js");
const spaEnhancement = read("public/medical-bill-productization-spa.js");
const appShell = read("index.html");
const productConfig = read("api/product-config.ts");
const emailApi = read("api/send.ts");
const unsubscribeApi = read("api/unsubscribe.ts");

describe("medical bill productization static contracts", () => {
  it("keeps essential guidance free and exposes a truthful $24 interest-only default", () => {
    expect(productPage).toContain("The free system stays complete");
    expect(productPage).toContain("Essential rights and official-source links");
    expect(productPage).toContain("$24");
    expect(productPage).toContain("Checkout is not active");
    expect(productPage).toContain("does not create a purchase or payment obligation");
    expect(productPage).not.toMatch(/save thousands|limited time|normally \$|only today|ends tonight/i);
  });

  it("publishes representative previews without exposing or embedding the private master", () => {
    expect(productPage.match(/data-preview-page=/g)).toHaveLength(6);
    expect(productPage.match(/class="cell"/g)).toHaveLength(54);
    expect(productPage).not.toContain("repeat(9)");
    expect(productPage).not.toMatch(/expanded-medical-bill-response-workbook-v1\.(pdf|docx)/i);
    expect(productPage).not.toContain("download the full workbook");
  });

  it("separates the static product runtime from hydration-safe SPA enhancement", () => {
    expect(appShell).toContain('<script defer src="/medical-bill-productization-spa.js"></script>');
    expect(appShell).not.toContain('<script defer src="/medical-bill-productization.js"></script>');
    expect(productPage).toContain('<script defer src="/medical-bill-productization.js"></script>');
    expect(spaEnhancement).toContain("window.addEventListener(\"load\", boot");
    expect(spaEnhancement).not.toContain("MutationObserver");
    expect(spaEnhancement).toContain("window.setTimeout(enhanceRoute, 350)");
    expect(spaEnhancement).toContain("window.setTimeout(enhanceRoute, 1200)");
    expect(spaEnhancement).toContain("/insurance/medical-bill-review-toolkit");
    expect(spaEnhancement).toContain("/patients-families");
    expect(spaEnhancement).toContain("/articles/how-to-read-an-eob");
    expect(spaEnhancement).toContain("free_to_premium_click");
    expect(productEnhancement).toContain("premium_interest_submit");
  });

  it("enables checkout only through a secure server-side hosted URL gate", () => {
    expect(productConfig).toContain("MEDICAL_BILL_WORKBOOK_CHECKOUT_URL");
    expect(productConfig).toContain('parsed.protocol === "https:"');
    expect(productConfig).toContain("checkoutEnabled: Boolean(checkoutUrl)");
    expect(productPage).not.toContain("stripe");
    expect(productPage).not.toContain("card number");
  });

  it("implements consent-aware medical bill email entry and signed unsubscribe handling", () => {
    expect(emailApi).toContain('"medical-bill-sequence"');
    expect(emailApi).toContain('"medical-bill-product-interest"');
    expect(emailApi).toContain('"List-Unsubscribe"');
    expect(emailApi).toContain("createUnsubscribeToken");
    expect(unsubscribeApi).toContain("timingSafeEqual");
    expect(unsubscribeApi).toContain("unsubscribed: true");
    expect(spaEnhancement).toContain('type: "medical-bill-sequence"');
    expect(productEnhancement).toContain('"medical-bill-product-interest"');
    expect(spaEnhancement).not.toMatch(/diagnosisDetails|claimNumber|memberId|billAmount|providerName/);
    expect(productEnhancement).not.toMatch(/diagnosisDetails|claimNumber|memberId|billAmount|providerName/);
  });
});
