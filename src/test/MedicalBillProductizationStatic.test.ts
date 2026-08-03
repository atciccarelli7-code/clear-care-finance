import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

const appShell = read("index.html");
const appLayout = read("src/components/layout/Layout.tsx");
const productPathway = read("src/components/medical-bill/MedicalBillProductPathway.tsx");
const productFoundation = read("src/components/medical-bill/MedicalBillProductFoundation.tsx");
const pathwayConfig = read("src/components/medical-bill/medicalBillProductPathwayConfig.ts");
const interestForm = read("src/components/medical-bill/MedicalBillInterestForm.tsx");
const productConfig = read("api/product-config.ts");
const emailApi = read("api/send.ts");
const unsubscribeApi = read("api/unsubscribe.ts");
const vercelConfig = read("vercel.json");

const obsoletePublicArtifacts = [
  "public/products/expanded-medical-bill-response-workbook.html",
  "public/downloads/expanded-medical-bill-response-workbook-preview.html",
  "public/medical-bill-productization.js",
] as const;

const legacyRoutes = [
  "/products/expanded-medical-bill-response-workbook",
  "/products/expanded-medical-bill-response-workbook.html",
  "/downloads/expanded-medical-bill-response-workbook-preview",
  "/downloads/expanded-medical-bill-response-workbook-preview.html",
] as const;

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

  it("removes obsolete public product artifacts so static-file precedence cannot bypass redirects", () => {
    for (const artifact of obsoletePublicArtifacts) {
      expect(existsSync(artifact), `${artifact} should not be deployed publicly`).toBe(false);
    }
  });

  it("parks all legacy workbook and preview URL variants behind the complete free toolkit", () => {
    for (const route of legacyRoutes) {
      expect(vercelConfig).toContain(`"source": "${route}"`);
    }
    expect(vercelConfig.match(/"destination": "\/insurance\/medical-bill-review-toolkit"/g)?.length).toBeGreaterThanOrEqual(4);
  });

  it("renders supporting offers through governed React routes instead of a global DOM injector", () => {
    expect(appShell).not.toContain("medical-bill-productization-spa.js");
    expect(appShell).not.toContain("medical-bill-productization.js");
    expect(appLayout).toContain("getRouteEndcapOwner");
    expect(appLayout).toContain('endcapOwner === "medical_bill"');
    expect(appLayout).toContain("<MedicalBillProductPathway pathname={location.pathname} />");
    expect(pathwayConfig).toContain("/insurance/medical-bill-review-toolkit");
    expect(pathwayConfig).toContain("/patients-families");
    expect(pathwayConfig).toContain("/articles/how-to-read-an-eob");
    expect(pathwayConfig).toContain("/articles/why-one-hospital-visit-can-create-multiple-bills");
    expect(productPathway).toContain("supporting_page_to_product");
    expect(productPathway).not.toContain("history.pushState");
    expect(productPathway).not.toContain("setTimeout");
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
    expect(interestForm).not.toMatch(/diagnosisDetails|claimNumber|memberId|billAmount|providerName/);
  });
});
