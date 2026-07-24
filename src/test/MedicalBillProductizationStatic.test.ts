import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

const productPage = read("public/products/expanded-medical-bill-response-workbook.html");
const productEnhancement = read("public/medical-bill-productization.js");
const appShell = read("index.html");
const appLayout = read("src/components/layout/Layout.tsx");
const productPathway = read("src/components/medical-bill/MedicalBillProductPathway.tsx");
const pathwayConfig = read("src/components/medical-bill/medicalBillProductPathwayConfig.ts");
const interestForm = read("src/components/medical-bill/MedicalBillInterestForm.tsx");
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
    expect(productPathway).toContain("No payment");
    expect(productPathway).toContain("Free system stays complete");
    expect(productPathway).not.toContain("$24 one-time");
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

  it("renders supporting offers through governed React routes instead of a global DOM injector", () => {
    expect(appShell).not.toContain("medical-bill-productization-spa.js");
    expect(appShell).not.toContain('<script defer src="/medical-bill-productization.js"></script>');
    expect(productPage).toContain('<script defer src="/medical-bill-productization.js"></script>');
    expect(appLayout).toContain("hasMedicalBillProductPathway");
    expect(appLayout).toContain("<MedicalBillProductPathway pathname={location.pathname} />");
    expect(pathwayConfig).toContain("/insurance/medical-bill-review-toolkit");
    expect(pathwayConfig).toContain("/patients-families");
    expect(pathwayConfig).toContain("/articles/how-to-read-an-eob");
    expect(pathwayConfig).toContain("/articles/why-one-hospital-visit-can-create-multiple-bills");
    expect(productPathway).toContain("supporting_page_to_product");
    expect(productPathway).not.toContain("history.pushState");
    expect(productPathway).not.toContain("setTimeout");
    expect(productEnhancement).toContain("premium_interest_submit");
  });

  it("keeps the medical-bill product and portfolio bundle private while allowing a separate product to advance", () => {
    expect(productConfig).toContain('portfolioStatus: commerceEnabled ? "one_product_launch_ready" : "implementation_ready_default_deny"');
    expect(productConfig).toContain('productId: "medical_bill_response_resolution_system"');
    expect(productConfig).toContain('productStatus: "private_ready"');
    expect(productConfig).toContain('deliveryMode: "private_master_not_hosted"');
    expect(productConfig).toContain('productId: "healthcare_money_decision_library"');
    expect(productConfig.match(/checkoutEnabled: false/g)?.length).toBeGreaterThanOrEqual(2);
    expect(productConfig).not.toContain("MEDICAL_BILL_WORKBOOK_CHECKOUT_URL");
    expect(productConfig).not.toContain("VITE_LEMON_SQUEEZY_MEDICAL_BILL_PRODUCT_URL");
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
    expect(interestForm).toContain('type: isSequence ? "medical-bill-sequence" : "medical-bill-product-interest"');
    expect(interestForm).toContain("medical_bill_email_sequence_start");
    expect(productEnhancement).toContain('"medical-bill-product-interest"');
    expect(interestForm).not.toMatch(/diagnosisDetails|claimNumber|memberId|billAmount|providerName/);
    expect(productEnhancement).not.toMatch(/diagnosisDetails|claimNumber|memberId|billAmount|providerName/);
  });
});
