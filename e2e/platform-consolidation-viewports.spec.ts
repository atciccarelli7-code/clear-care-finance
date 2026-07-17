import { expect, test, type Page } from "@playwright/test";

const viewports = [
  { label: "320x568", width: 320, height: 568 },
  { label: "375x667", width: 375, height: 667 },
  { label: "390x844", width: 390, height: 844 },
  { label: "430x932", width: 430, height: 932 },
  { label: "768x1024", width: 768, height: 1024 },
  { label: "1024x768", width: 1024, height: 768 },
  { label: "1366x768", width: 1366, height: 768 },
  { label: "1440x900", width: 1440, height: 900 },
] as const;

const waitForHydration = async (page: Page) => {
  await page.waitForFunction(() => Array.from(document.querySelectorAll("button, select, input")).some((element) => (
    Object.keys(element).some((key) => key.startsWith("__reactProps$"))
  )));
};

const expectHealthyLayout = async (page: Page) => {
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("vite-error-overlay, [data-error-overlay]")).toHaveCount(0);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("caf-privacy-consent-v1", "necessary"));
  await page.route("**/_vercel/**", async (route) => route.fulfill({ status: 204, body: "" }));
});

for (const viewport of viewports) {
  test(`${viewport.label}: hierarchy, progressive routing, BCC mode, and buyer trust remain usable`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    await page.goto("/");
    await waitForHydration(page);
    await expectHealthyLayout(page);
    await expect(page.getByRole("group", { name: "Choose a decision category" }).getByRole("button")).toHaveCount(4);
    await page.getByRole("button", { name: /Healthcare costs or medical bills/i }).click();
    await page.getByRole("button", { name: "Prepare financially before medical care" }).click();
    await page.getByRole("button", { name: "I am planning ahead" }).click();
    await expect(page.getByRole("heading", { name: "Medical Appointment Cost Preparation" })).toBeFocused();

    await page.goto("/tools/benefits-command-center?mode=sample-receipt");
    await waitForHydration(page);
    await expect(page.getByRole("article", { name: /illustrative sample benefits receipt/i })).toBeVisible();
    await expectHealthyLayout(page);
    await page.reload();
    await waitForHydration(page);
    await expect(page.getByRole("article", { name: /illustrative sample benefits receipt/i })).toBeVisible();

    await page.goto("/for-organizations/trust-procurement");
    await waitForHydration(page);
    await expect(page.getByRole("heading", { name: "Current public capability" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /No implied certification or enterprise readiness/i })).toBeVisible();
    await expectHealthyLayout(page);
  });
}
