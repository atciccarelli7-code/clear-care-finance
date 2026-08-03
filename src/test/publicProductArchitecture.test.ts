import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PAID_PRODUCTS, isPaidCommerceEnabled } from "@/data/paidProducts";

const source = (path: string) => readFileSync(path, "utf8");

const indexSource = source("src/pages/Index.tsx");
const startHereSource = source("src/pages/StartHere.tsx");
const toolsSource = source("src/pages/Tools.tsx");
const workerSource = source("src/pages/HealthcareWorkers.tsx");
const comparisonSource = source("src/pages/BenefitsCommandCenterPage.tsx");
const footerSource = source("src/components/layout/Footer.tsx");
const appSource = source("src/App.tsx");

describe("Phase 2 public product architecture", () => {
  it("makes the free layer explicit across the primary public surfaces", () => {
    expect(indexSource).toContain("Free decision preparation. Paid decision completion.");
    expect(toolsSource).toContain("Use every public tool on this page without paying.");
    expect(startHereSource).toContain("Start Here and every public calculator remain free.");
    expect(workerSource).toContain("Learn workplace benefits for free.");
    expect(footerSource).toContain("Free resources");
  });

  it("presents exactly one visible paid flagship and keeps other product ideas out of public IA", () => {
    const publicSurfaceSource = [indexSource, startHereSource, toolsSource, workerSource, footerSource].join("\n");

    expect(publicSurfaceSource).toContain("Healthcare Worker Benefits Decision System");
    expect(publicSurfaceSource).toContain("Open Enrollment Workspace");
    expect(publicSurfaceSource).not.toContain("Medical Bill Response & Resolution System");
    expect(publicSurfaceSource).not.toContain("Healthcare Money Decision Library");
  });

  it("keeps the focused benefits comparison free and subordinate to the complete system", () => {
    expect(comparisonSource).toContain("Free workplace-benefits comparison");
    expect(comparisonSource).toContain("This focused comparison remains free.");
    expect(comparisonSource).toContain("Need to coordinate the full open-enrollment decision?");
    expect(comparisonSource).not.toContain("CAF Benefits Command Center");
  });

  it("keeps commerce fail closed while showing the $29 validation hypothesis", () => {
    const flagship = PAID_PRODUCTS.find((product) => product.id === "healthcare-worker-benefits-decision-system");

    expect(flagship).toMatchObject({
      launchPrice: 29,
      status: "private_ready",
      checkoutEnabled: false,
      checkoutUrl: "",
    });
    expect(isPaidCommerceEnabled()).toBe(false);
    expect(workerSource).toContain("Checkout and paid access remain off.");
    expect(indexSource).toContain("it is not available for purchase yet");
  });

  it("preserves the existing public preview redirect and private route boundaries", () => {
    expect(appSource).toContain(
      '<Route path="/products/healthcare-worker-benefits-decision-system" element={<Navigate to="/healthcare-workers" replace />} />',
    );
    expect(appSource).toContain('<Route element={<ProtectedPremiumRoutes />}>');
    expect(appSource).toContain('<Route path="/app/benefits-decision" element={<BenefitsDecisionAppPage />} />');
  });
});
