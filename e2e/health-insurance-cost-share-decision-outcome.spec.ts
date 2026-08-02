import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const route = "/tools/health-insurance-visit-cost-calculator";

const expectAccessible = async (page: import("@playwright/test").Page) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const severe = accessibility.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  expect(severe, severe.map((violation) => `${violation.id}: ${violation.help}`).join("\n")).toEqual([]);
};

test.beforeEach(async ({ page }) => {
  await page.route("**/_vercel/**", async (intercepted) => {
    const isScript = new URL(intercepted.request().url()).pathname.endsWith(".js");
    await intercepted.fulfill(isScript ? { status: 200, contentType: "application/javascript", body: "" } : { status: 204, body: "" });
  });
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem("caf-privacy-consent-v1", "necessary");
    window.print = () => { document.documentElement.dataset.printIntent = "true"; };
  });
});

test("unknown plan rules fail closed instead of adding deductible, copay, and coinsurance", async ({ page }) => {
  await page.goto(route, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Build my patient cost-share estimate" }).click();
  await expect(page.getByRole("heading", { name: "Verify how this service is actually cost-shared" })).toBeFocused();
  await expect(page.getByText("Estimated patient cost", { exact: true }).locator("..")).toContainText("Not estimated");
  await expect(page.getByText(/should not be added together automatically/i)).toBeVisible();
  await expect(page.getByText("Optional commercial path")).toHaveCount(0);
  await expectAccessible(page);
});

test("deductible then coinsurance produces a bounded covered in-network estimate", async ({ page }) => {
  await page.goto(route, { waitUntil: "networkidle" });
  await page.getByLabel("How does the plan describe this service?").selectOption("deductible_then_coinsurance");
  await page.getByLabel("Coverage and network status").selectOption("covered_in_network");
  await page.getByLabel("Allowed amount per visit").fill("1000");
  await page.getByLabel("Number of visits").fill("2");
  await page.getByLabel("Annual deductible").fill("1500");
  await page.getByLabel("Deductible already met").fill("0");
  await page.getByLabel("Out-of-pocket maximum").fill("6000");
  await page.getByLabel("Out-of-pocket amount already met").fill("0");
  await page.getByLabel("Coinsurance after deductible").fill("20");
  await page.getByRole("button", { name: "Build my patient cost-share estimate" }).click();
  await expect(page.getByRole("heading", { name: "The remaining deductible appears to drive the estimate" })).toBeFocused();
  await expect(page.getByText("Deductible applied").locator("..")).toContainText("$1,500");
  await expect(page.getByText("Coinsurance applied").locator("..")).toContainText("$100");
  await expect(page.getByText("Copays applied").locator("..")).toContainText("$0");
  await expect(page.getByText("Estimated patient cost", { exact: true }).locator("..")).toContainText("$1,600");
});

test("remaining out-of-pocket room caps only confirmed covered in-network cost sharing", async ({ page }) => {
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
  await expect(page.getByRole("heading", { name: "The remaining out-of-pocket limit may cap this estimate" })).toBeFocused();
  await expect(page.getByText("Estimated patient cost", { exact: true }).locator("..")).toContainText("$500");
  await expect(page.getByText("Amount limited by entered OOP cap").locator("..")).toContainText("$1,100");
  await page.getByRole("button", { name: "Copy decision summary" }).click();
  await expect(page.getByRole("button", { name: "Summary copied" })).toBeVisible();
  await page.getByRole("button", { name: "Print or save as PDF" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-print-intent", "true");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("#decision-outcome-health_insurance_cost_share")).toBeVisible();
  await expect(page.locator("#decision-outcome-health_insurance_cost_share")).toContainText("processed EOB");
  await page.emulateMedia({ media: "screen" });
  await page.setViewportSize({ width: 390, height: 844 });
  await expectAccessible(page);
});
