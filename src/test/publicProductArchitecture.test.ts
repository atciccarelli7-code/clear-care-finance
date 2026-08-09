import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PAID_PRODUCTS, isPaidCommerceEnabled } from "@/data/paidProducts";

const source = (path: string) => readFileSync(path, "utf8");

const indexSource = source("src/pages/Index.tsx");
const startHereSource = source("src/pages/StartHere.tsx");
const toolsSource = source("src/pages/Tools.tsx");
const workerSource = source("src/pages/HealthcareWorkers.tsx");
const journeySource = source("src/components/benefits/BenefitsDecisionSystemJourney.tsx");
const journeyDataSource = source("src/data/benefitsDecisionSystemJourney.ts");
const comparisonSource = source("src/pages/BenefitsCommandCenterPage.tsx");
const workflowSource = source("src/components/premium/OpenEnrollmentPilot.tsx");
const navigationSource = source("src/data/serviceNavigation.ts");
const footerSource = source("src/components/layout/Footer.tsx");
const appSource = source("src/App.tsx");
const phase3AppSource = source("src/Phase3ProductApp.tsx");
const siteSeoMetaSource = source("src/lib/siteSeoMeta.ts");
const offerPageSource = source("src/pages/premium/BenefitsDecisionOfferPage.tsx");
const offerFormSource = source("src/components/premium/BenefitsEarlyAccessForm.tsx");
const testCheckoutPanelSource = source("src/components/premium/PremiumTestCheckoutPanel.tsx");
const offerHandoffSource = source("src/components/premium/BenefitsOfferValidationPathway.tsx");
const routeEndcapSource = source("src/components/layout/routeEndcap.ts");
const vercelSource = source("vercel.json");
const sitemapGeneratorSource = source("scripts/generate-sitemap.mjs");

const OFFER_PATH = "/products/healthcare-worker-benefits-decision-system";
const publicProductSource = [
  indexSource,
  startHereSource,
  toolsSource,
  workerSource,
  journeySource,
  journeyDataSource,
  comparisonSource,
  workflowSource,
  footerSource,
  offerPageSource,
  siteSeoMetaSource,
].join("\n");

const leakedReleaseState = [
  "Checkout off",
  "checkout remains disabled",
  "paid access remain off",
  "not available for purchase yet",
  "Planned early-access test",
  "Working end-to-end pilot",
  "Working public pilot",
  "Browser-local product pilot",
  "Try the guided pilot",
  "Open the full guided pilot",
  "I would consider it at $29",
  "This would be worth $29 to me",
  "Premium foundation built",
  "being prepared",
  "not activated until",
  "separately certified",
] as const;

describe("finished public product architecture", () => {
  it("presents the public benefits system as a complete free browser-local workflow", () => {
    expect(indexSource).toContain("Guided workflows available now");
    expect(indexSource).toContain("Free · available now");
    expect(startHereSource).toContain("complete browser-local Benefits Decision System now");
    expect(toolsSource).toContain("Free · browser-local");
    expect(workerSource).toContain("Available now · free");
    expect(offerPageSource).toContain("Start the guided system");
    expect(workflowSource).toContain("Browser-local decision system");
    expect(footerSource).toContain("Benefits Decision System");
  });

  it("keeps internal release-state and price-test language out of core public surfaces", () => {
    for (const phrase of leakedReleaseState) expect(publicProductSource).not.toContain(phrase);
  });

  it("links primary public surfaces to the canonical completed workflow", () => {
    for (const publicSource of [indexSource, startHereSource, toolsSource, comparisonSource, journeySource, workerSource]) {
      expect(publicSource).toContain(OFFER_PATH);
    }
    expect(navigationSource).toContain("/healthcare-workers");
    expect(offerHandoffSource).toContain(OFFER_PATH);
    expect(routeEndcapSource).toContain("/tools/healthcare-worker-total-compensation-comparison");
  });

  it("renders the dedicated workflow as an indexable free WebApplication", () => {
    expect(siteSeoMetaSource).toContain(OFFER_PATH);
    expect(siteSeoMetaSource).toContain("robots: indexed");
    expect(siteSeoMetaSource).toContain('"@type": "WebApplication"');
    expect(siteSeoMetaSource).toContain("isAccessibleForFree: true");
    expect(siteSeoMetaSource).toContain("free browser-local Benefits Decision System");
    expect(phase3AppSource).toContain("BENEFITS_DECISION_OFFER_PATH");
    expect(phase3AppSource).toContain("BENEFITS_DECISION_OFFER_META");
    expect(vercelSource).not.toContain(`"source": "${OFFER_PATH}"`);
    expect(sitemapGeneratorSource).toContain(OFFER_PATH);
  });

  it("keeps the focused benefits comparison free and clearly subordinate to the complete system", () => {
    expect(comparisonSource).toContain("Free workplace-benefits comparison");
    expect(comparisonSource).toContain("Use this comparison for a focused package. Use the full system for open enrollment.");
    expect(comparisonSource).toContain("Both public workflows are available now");
    expect(comparisonSource).not.toContain("CAF Benefits Command Center");
  });

  it("keeps dormant paid-commerce infrastructure fail closed and off the public offer page", () => {
    const flagship = PAID_PRODUCTS.find((product) => product.id === "healthcare-worker-benefits-decision-system");

    expect(flagship).toMatchObject({
      launchPrice: 29,
      status: "private_ready",
      checkoutEnabled: false,
      checkoutUrl: "",
    });
    expect(isPaidCommerceEnabled()).toBe(false);
    expect(offerPageSource).not.toContain("BenefitsEarlyAccessForm");
    expect(offerPageSource).not.toContain("PAID_PRODUCTS");
    expect(offerPageSource).not.toContain("recordBenefitsOfferCta");
    expect(offerPageSource).not.toContain("$29");
  });

  it("preserves private validation and test-mode commerce components without exposing them publicly", () => {
    expect(offerFormSource).toContain("priceCommitment");
    expect(offerFormSource).toContain("emailConsent");
    expect(offerFormSource).toContain("VITE_PREMIUM_TEST_CHECKOUT_DISPLAY_ENABLED");
    expect(testCheckoutPanelSource).toContain("Protected test-mode certification");
    expect(testCheckoutPanelSource).toContain("Test mode only · No real charge · No production access");
    expect(testCheckoutPanelSource).toContain("createCheckoutSession(auth.accessToken, productKey)");
  });

  it("preserves private application route boundaries", () => {
    expect(appSource).toContain('<Route element={<ProtectedPremiumRoutes />}>');
    expect(appSource).toContain('<Route path="/app/benefits-decision" element={<BenefitsDecisionAppPage />} />');
  });
});
