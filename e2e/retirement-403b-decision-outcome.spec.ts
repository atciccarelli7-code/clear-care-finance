import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const route = "/tools/403b-paycheck-calculator";

const expectAccessible = async (page: import("@playwright/test").Page) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const severe = accessibility.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  expect(severe, severe.map((violation) => `${violation.id}: ${violation.help}`).join("\n")).toEqual([]);
};

test.beforeEach(async ({ page }) => {
  await page.route("**/_vercel/**", async (route) => {
    const isScript = new URL(route.request().url()).pathname.endsWith(".js");
    await route.fulfill(isScript ? { status: 200, contentType: "application/javascript", body: "" } : { status: 204, body: "" });
  });
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem("caf-privacy-consent-v1", "necessary");
    window.print = () => { document.documentElement.dataset.printIntent = "true"; };
  });
});

test("unknown or tiered match formulas fail closed without an employer estimate", async ({ page }) => {
  await page.goto(route, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Build my 403(b) decision outcome" }).click();

  await expect(page.getByRole("heading", { name: "Verify the employer formula before relying on a match estimate" })).toBeFocused();
  const employerMetric = page.getByText("Estimated annual employer contribution").locator("..");
  await expect(employerMetric).toContainText("Not estimated");
  await expect(page.getByText(/generic percentage from overstating compensation/i)).toBeVisible();
  await expect(page.getByText("Optional commercial path")).toHaveCount(0);
  await expectAccessible(page);
});

test("a 50% match on the first 6% does not become a 6% employer contribution", async ({ page }) => {
  await page.goto(route, { waitUntil: "networkidle" });
  await page.getByLabel("Employer contribution formula").selectOption("partial_match_up_to");
  await page.getByLabel("Employer contribution per dollar contributed").fill("50");
  await page.getByLabel("Employee contribution eligible for the partial match").fill("6");
  await page.getByRole("button", { name: "Build my 403(b) decision outcome" }).click();

  await expect(page.getByRole("heading", { name: "You appear to be capturing the full stated match" })).toBeFocused();
  const employerMetric = page.getByText("Estimated annual employer contribution").locator("..");
  await expect(employerMetric).toContainText("$2,527");
  await expect(employerMetric).not.toContainText("$5,054");
  await expect(page.getByText(/Employer matches 50% of contributions up to 6%/i)).toBeVisible();
});

test("below-match state, portable actions, print output, and mobile accessibility remain complete", async ({ page }) => {
  await page.goto(route, { waitUntil: "networkidle" });
  await page.getByLabel("Your contribution").fill("4");
  await page.getByLabel("Employer contribution formula").selectOption("full_match_up_to");
  await page.getByLabel("Employee contribution eligible for the match").fill("6");
  await page.getByRole("button", { name: "Build my 403(b) decision outcome" }).click();

  await expect(page.getByRole("heading", { name: "You may be contributing below the stated full-match threshold" })).toBeFocused();
  await expect(page.getByText(/smallest affordable contribution increase/i)).toBeVisible();
  await page.getByRole("button", { name: "Copy decision summary" }).click();
  await expect(page.getByRole("button", { name: "Summary copied" })).toBeVisible();

  await page.getByRole("button", { name: "Print or save as PDF" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-print-intent", "true");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("#decision-outcome-retirement_403b_contribution")).toBeVisible();
  await expect(page.locator("#decision-outcome-retirement_403b_contribution")).toContainText("The plan document and payroll records control");
  await page.emulateMedia({ media: "screen" });

  await expectAccessible(page);
});
