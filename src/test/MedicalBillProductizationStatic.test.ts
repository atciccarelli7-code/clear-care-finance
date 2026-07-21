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
const samplePreview = read("public/downloads/expanded-medical-bill-response-workbook-preview.html");

describe("medical bill productization static contracts", () => {
  it("keeps essential guidance free and hard-disables payment during audience validation", () => {
    expect(productPage).toContain("The free system stays complete");
    expect(productPage).toContain("Official sources remain free");
    expect(productPage).toContain("Built, not for sale");
    expect(productPage).toContain("No payment");
    expect(productPage).not.toContain("$24");
    expect(productPage).not.toMatch(/buy now|purchase now|checkout now|save thousands|limited time|normally \$|only today|ends tonight/i);
    expect(spaEnhancement).toContain("Free product laboratory");
    expect(spaEnhancement).toContain("No payment");
    expect(spaEnhancement).not.toContain("$24 one-time");
  });

  it("publishes representative previews without exposing or embedding the private master", () => {
    expect(productPage.match(/data-preview-page=/g)).toHaveLength(3);
    expect(productPage).toContain("/downloads/expanded-medical-bill-response-workbook-preview.html");
    expect(samplePreview).toContain("Sample workbook pages");
    expect(samplePreview).toContain("No checkout is active");
    expect(samplePreview).not.toMatch(/expanded-medical-bill-response-workbook-v1\.(pdf|docx)/i);
    expect(productPage).not.toMatch(/expanded-medical-bill-response-workbook-v1\.(pdf|docx)/i);
    expect(productPage).not.toContain("download the full workbook");
  });

  it("separates the static product runtime from hydration-safe SPA enhancement", () => {
    expect(appShell).toContain('<script defer src="/medical-bill-productization-spa.js"></script>');
    expect(appShell).not.toContain('<script defer src="/medical-bill-productization.js"></script>');
    expect(productPage).toContain('<script defer src="/medical-bill-productization.js"></script>');
    expect(spaEnhancement).toContain('window.addEventListener("load", boot');
    expect(spaEnhancement).not.toContain("MutationObserver");
    expect(spaEnhancement).toContain("window.setTimeout(enhanceRoute, 350)");
    expect(spaEnhancement).toContain("window.setTimeout(enhanceRoute, 1200)");
    expect(spaEnhancement).toContain("/insurance/medical-bill-review-toolkit");
    expect(spaEnhancement).toContain("/patients-families");
    expect(spaEnhancement).toContain("/articles/how-to-read-an-eob");
    expect(spaEnhancement).toContain("supporting_page_to_product");
    expect(productEnhancement).toContain("premium_interest_submit");
  });

  it("keeps the expanded portfolio private with every checkout hard-disabled", () => {
    expect(productConfig).toContain('portfolioStatus: "private_ready"');
    expect(productConfig).toContain("commerceEnabled: false");
    expect(productConfig).toContain('productId: "medical_bill_response_resolution_system"');
    expect(productConfig).toContain('productStatus: "private_ready"');
    expect(productConfig).toContain('deliveryMode: "private_master_not_hosted"');
    expect(productConfig.match(/checkoutEnabled: false/g)?.length).toBeGreaterThanOrEqual(3);
    expect(productConfig.match(/checkoutUrl: ""/g)?.length).toBeGreaterThanOrEqual(3);
    expect(productConfig).not.toContain("MEDICAL_BILL_WORKBOOK_CHECKOUT_URL");
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
