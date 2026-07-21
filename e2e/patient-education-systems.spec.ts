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
  test("starts with immediate needs and progressively discloses the five guide families", async ({ page }) => {
    await page.goto("/patients-families/hospital-guide");
    await expect(page.getByRole("heading", { name: /What do you need help with right now/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Medicines or equipment/i })).toBeVisible();
    await expect(page.getByText(/No name, diagnosis, policy number, claim detail, or free-text medical information is requested/i)).toBeVisible();

    await page.getByRole("button", { name: /Medicines or equipment/i }).click();
    await expect(page.getByText(/Use the exact written prescription, label, equipment order/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /See medicine and equipment guides/i })).toHaveAttribute("href", "#medicine-equipment-guides");
    await expect(page.getByRole("link", { name: /Blood Thinner Safety/i })).toHaveAttribute("href", "/articles/blood-thinner-safety-before-going-home");

    await page.getByRole("button", { name: /Copy questions and actions/i }).click();
    await expect(page.getByRole("status")).toContainText(/Action plan copied/i);

    const allGuides = page.getByText(/All five patient and caregiver guides/i);
    await expect(allGuides).toBeVisible();

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
