import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("consumer blood thinner safety guide", () => {
  test("publishes a source-backed preparation guide without pilot or dosing claims", async ({ page }) => {
    await page.goto("/articles/blood-thinner-safety-before-going-home");
    await expect(page).toHaveTitle(/Blood Thinner Safety/i);
    await expect(page.getByRole("heading", { name: /Blood Thinner Safety: What to Verify Before Going Home/i })).toBeVisible();
    await expect(page.getByText(/does not supply dosing/i)).toBeVisible();
    await expect(page.getByText(/No independent physician or pharmacist review is claimed/i)).toBeVisible();
    await expect(page.getByText(/Build a pilot/i)).toHaveCount(0);
    await expect(page.getByText(/design partner/i)).toHaveCount(0);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => violation.impact === "critical")).toEqual([]);
  });

  test("redirects the former institutional route", async ({ page }) => {
    await page.goto("/for-organizations/patient-education-systems/blood-thinner-readiness");
    await expect(page).toHaveURL(/\/articles\/blood-thinner-safety-before-going-home$/);
  });
});
