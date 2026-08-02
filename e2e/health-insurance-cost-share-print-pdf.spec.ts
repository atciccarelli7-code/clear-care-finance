import { expect, test } from "@playwright/test";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const route = "/tools/health-insurance-visit-cost-calculator";
const artifactDirectory = path.resolve("artifacts/print-certification");
const visualDirectory = path.resolve("test-results/patient-cost-share-visuals");

const completeCostShareJourney = async (page: import("@playwright/test").Page) => {
  await page.goto(route, { waitUntil: "networkidle" });
  await page.getByLabel("How does the plan describe this service?").selectOption("deductible_then_coinsurance");
  await page.getByLabel("Coverage and network status").selectOption("covered_in_network");
  await page.getByLabel("Allowed amount per visit").fill("1000");
  await page.getByLabel("Number of visits").fill("2");
  await page.getByLabel("Annual deductible").fill("1500");
  await page.getByLabel("Deductible already met").fill("0");
  await page.getByLabel("Out-of-pocket maximum").fill("6000");
  await page.getByLabel("Out-of-pocket amount already met").fill("5500");
  await page.getByLabel("Coinsurance after deductible").fill("20");
  await page.getByRole("button", { name: "Build my patient cost-share estimate" }).click();
  await expect(page.getByRole("heading", { name: "The remaining out-of-pocket limit may cap this estimate" })).toBeVisible();
  await expect(page.locator("#decision-outcome-health_insurance_cost_share")).toContainText("$500");
  await expect(page.locator("#decision-outcome-health_insurance_cost_share")).toContainText("$1,100");
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    Object.defineProperty(window.navigator, "sendBeacon", { configurable: true, value: () => true });
  });
});

test("capture desktop/mobile visuals and Letter/A4 patient cost-share decision PDFs", async ({ page }) => {
  await mkdir(artifactDirectory, { recursive: true });
  await mkdir(visualDirectory, { recursive: true });
  await completeCostShareJourney(page);

  await page.screenshot({
    path: path.join(visualDirectory, "patient-cost-share-decision-desktop.png"),
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: path.join(visualDirectory, "patient-cost-share-decision-mobile.png"),
    fullPage: true,
  });

  await page.emulateMedia({ media: "print" });
  const outcome = page.locator("#decision-outcome-health_insurance_cost_share");
  await expect(outcome).toBeVisible();
  await expect(outcome).toContainText("The remaining out-of-pocket limit may cap this estimate");
  await expect(outcome).toContainText("Open the current Summary of Benefits and Coverage");
  await expect(outcome).toContainText("processed EOB");
  await expect(outcome).toContainText(/educational estimate/i);

  for (const { suffix, format } of [
    { suffix: "letter", format: "Letter" as const },
    { suffix: "a4", format: "A4" as const },
  ]) {
    const pdfPath = path.join(artifactDirectory, `patient-cost-share-decision-${suffix}.pdf`);
    await page.pdf({
      path: pdfPath,
      format,
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: "0.35in", right: "0.35in", bottom: "0.35in", left: "0.35in" },
    });
    expect((await stat(pdfPath)).size).toBeGreaterThan(10_000);
  }
});
