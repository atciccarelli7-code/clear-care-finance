import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const next = async (page: import("@playwright/test").Page) => {
  await page.getByRole("button", { name: /^(continue|build my brief)$/i }).click();
};

test.beforeEach(async ({ page }) => {
  await page.route("**/_vercel/**", async (route) => {
    const isScript = new URL(route.request().url()).pathname.endsWith(".js");
    await route.fulfill(isScript
      ? { status: 200, contentType: "application/javascript", body: "" }
      : { status: 204, body: "" });
  });
  await page.addInitScript(() => {
    localStorage.setItem("caf-privacy-consent-v1", "necessary");
    window.print = () => { document.documentElement.dataset.printIntent = "true"; };
  });
});

test("builds a private owner-assigned Medicare discharge brief and isolates it for print", async ({ page }) => {
  await page.goto("/insurance/hospital-discharge-coverage");

  await expect(page.getByRole("heading", { level: 1, name: "Hospital-to-Home Coverage & Cost Navigator" })).toBeVisible();
  await expect(page.getByText(/Do not enter names, diagnoses, member IDs/i)).toBeVisible();

  await page.getByRole("button", { name: /family member or caregiver/i }).click(); await next(page);
  await page.getByRole("button", { name: /^today/i }).click(); await next(page);
  await page.getByRole("button", { name: /^original medicare/i }).click(); await next(page);
  await page.getByRole("button", { name: /skilled nursing \/ short-term rehab/i }).click(); await next(page);
  await page.getByRole("button", { name: /^outpatient \/ observation/i }).click(); await next(page);
  await page.getByRole("button", { name: /^durable medical equipment/i }).click();
  await page.getByRole("button", { name: /^skilled rehabilitation/i }).click(); await next(page);
  await page.getByRole("button", { name: /submitted and pending/i }).click(); await next(page);
  await page.getByRole("button", { name: /nothing is fully confirmed/i }).click(); await next(page);
  await page.getByRole("button", { name: /moon or medicare status-change notice/i }).click(); await next(page);
  await page.getByRole("button", { name: /unexpected bill or private-pay cost/i }).click(); await next(page);

  const resultHeading = page.getByRole("heading", { name: "Discharge Coverage & Cost Brief" });
  await expect(resultHeading).toBeFocused();
  await expect(page.getByText(/observation or changed status may affect cost/i)).toBeVisible();
  await expect(page.getByText("Hospital case manager", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Medicare — skilled nursing facility care/i })).toHaveAttribute(
    "href",
    "https://www.medicare.gov/coverage/skilled-nursing-facility-care",
  );
  await expect(page.getByText(/\$29|checkout|premium workspace/i)).toHaveCount(0);

  await page.getByRole("button", { name: /Mark complete: request a same-day discharge huddle/i }).click();
  await page.getByRole("button", { name: /Save task state/i }).click();
  await expect(page.getByText(/Saved to My Decision Plan/i)).toBeVisible();
  const saved = await page.evaluate(() => localStorage.getItem("caf-decision-workspace-v1"));
  expect(saved).toContain("Hospital-to-Home Coverage & Cost");
  expect(saved).not.toMatch(/original-medicare|observation|durable medical equipment|caregiver/i);

  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(accessibility.violations.filter((item) => item.impact === "serious" || item.impact === "critical")).toEqual([]);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);

  await page.getByRole("button", { name: /Print \/ save as PDF/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-print-intent", "true");
  await page.emulateMedia({ media: "print" });
  await expect(resultHeading).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "Hospital-to-Home Coverage & Cost Navigator" })).toBeHidden();
  await expect(page.getByRole("heading", { name: /What insurance may cover after discharge/i })).toBeHidden();
});
