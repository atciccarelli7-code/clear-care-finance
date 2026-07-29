import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

const productPage = read("public/products/expanded-medical-bill-response-workbook.html");
const productEnhancement = read("public/medical-bill-productization.js");
const appShell = read("index.html");
const appLayout = read("src/components/layout/Layout.tsx");
const productPathway = read("src/components/medical-bill/MedicalBillProductPathway.tsx");
const productFoundation = read("src/components/medical-bill/MedicalBillProductFoundation.tsx");
const pathwayConfig = read("src/components/medical-bill/medicalBillProductPathwayConfig.ts");
const interestForm = read("src/components/medical-bill/MedicalBillInterestForm.tsx");
const productConfig = read("api/product-config.ts");
const emailApi = read("api/send.ts");
const unsubscribeApi = read("api/unsubscribe.ts");
const samplePreview = read("public/downloads/expanded-medical-bill-response-workbook-preview.html");
const vercelConfig = read("vercel.json");

describe("medical bill productization static contracts", () => {
  it("presents the public React pathways as complete free resources without development-state copy", () => {
    expect(productFoundation).toContain("Free medical-bill resources");
    expect(productFoundation).toContain("No account or document upload required");
    expect(productPathway).toContain("No payment");
    expect(productPathway).toContain("No account required");
    expect(productPathway).toContain("No bill upload");
    expect(productFoundation).not.toMatch(/early access|checkout is intentionally disabled|audience validation|private build|in development/i);
    expect(productPathway).not.toMatch(/early access|checkout remains disabled|audience validation|private build|workbook preview/i);
    expect(productPathway).not.toContain("$24 one-time");
  });

  it("parks legacy workbook and preview URLs behind complete free resources", () => {
    expect(vercelConfig).toContain('"source": "/products/expanded-medical-bill-response-workbook.html"');
    expect(vercelConfig).toContain('"source": "/downloads/expanded-medical-bill-response-workbook-preview.html"');
    expect(vercelConfig.match(/"destination": "\/insurance\/medical-bill-review-toolkit"/g)?.length).toBeGreaterThanOrEqual(2);
  });

  it("retains representative preview artifacts internally without exposing the private master", () => {
    expect(productPage.match(/data-preview-page=/g)).toHaveLength(3);
    expect(productPage).toContain("/downloads/expanded-medical-bill-response-workbook-preview.html");
    expect(samplePreview).toContain("Sample workbook pages");
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
