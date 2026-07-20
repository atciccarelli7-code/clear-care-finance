import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const guideRoutes = [
  "/articles/safe-hospital-discharge-first-72-hours",
  "/articles/blood-thinner-safety-before-going-home",
  "/articles/copd-recovery-after-hospital",
  "/articles/heart-failure-plan-after-discharge",
  "/articles/new-home-oxygen-nebulizer-guide",
];

test.describe("consumer Hospital & Patient Guide", () => {
  test("shows the fixed-choice guide finder and five guide families", async ({ page }) => {
    await page.goto("/patients-families/hospital-guide");
    await expect(page.getByRole("heading", { name: /Know what to verify/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /questions about a blood thinner/i })).toBeVisible();
    await expect(page.getByText(/Five-guide consumer library/i)).toBeVisible();

    await page.getByRole("button", { name: /questions about a blood thinner/i }).click();
    await expect(page.getByText(/Suggested starting point/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /Open the guide/i })).toHaveAttribute("href", "/articles/blood-thinner-safety-before-going-home");

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => violation.impact === "critical")).toEqual([]);
  });

  for (const route of guideRoutes) {
    test(`loads ${route}`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator("main")).toBeVisible();
    });
  }

  test("redirects the former institutional overview", async ({ page }) => {
    await page.goto("/for-organizations/patient-education-systems");
    await expect(page).toHaveURL(/\/patients-families\/hospital-guide$/);
  });
});
