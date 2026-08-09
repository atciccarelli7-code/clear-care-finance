import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const seriousAxeViolations = async (page: Page) => {
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  return result.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
};

test.beforeEach(async ({ page }) => {
  await page.route("**/_vercel/**", async (route) => {
    await route.fulfill(new URL(route.request().url()).pathname.endsWith(".js")
      ? { status: 200, contentType: "application/javascript", body: "" }
      : { status: 204, body: "" });
  });
  await page.addInitScript(() => localStorage.setItem("caf-privacy-consent-v1", "necessary"));
});

test("public Medicare product is usable, independent, indexable, and accessible", async ({ page }) => {
  await page.goto("/products/medicare-coverage-decision-system");
  await expect(page.getByRole("heading", { level: 1, name: /Structure your Medicare decision/i })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow, max-image-preview:large");
  await expect(page.getByText(/does not.*sell insurance.*rank insurers.*enroll you/i)).toBeVisible();
  await expect(page.getByText(/No account required.*No Medicare number.*medication names/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /Start the free guided decision/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /buy|purchase|checkout/i })).toHaveCount(0);
  await expect(page.getByText(/prelaunch|pilot|checkout disabled|certification pending/i)).toHaveCount(0);
  expect(await seriousAxeViolations(page)).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test("eight-stage workflow preserves uncertainty and produces a printable Decision Brief", async ({ page }, testInfo) => {
  await page.goto("/products/medicare-coverage-decision-system");
  await page.getByRole("button", { name: /Start the free guided decision/i }).click();
  await page.locator("#context").selectOption("already-enrolled");
  await page.locator("#enrolled").selectOption("yes");
  await page.locator("#current-architecture").selectOption("medicare-advantage");
  await page.locator("#coverage-change-interest").selectOption("consider-original");
  await page.getByRole("button", { name: /Mark reviewed and continue/i }).click();

  await page.locator("#providerFreedom").selectOption("high");
  await page.locator("#specialistAccess").selectOption("high");
  await page.locator("#travelFlexibility").selectOption("high");
  await page.locator("#network-tolerance").selectOption("low");
  await expect(page.getByText(/verify Medigap availability.*guaranteed-issue rights.*underwriting/i)).toBeVisible();

  for (let stage = 2; stage <= 6; stage += 1) {
    await page.getByRole("button", { name: /Mark reviewed and continue/i }).click();
  }

  await page.locator("#candidate-1-providers-status").selectOption("confirmed");
  await page.locator("#candidate-1-providers-source").selectOption("provider-confirmation");
  await page.locator("#candidate-1-providers-date").fill("2026-08-09");
  await page.getByRole("button", { name: /Mark reviewed and continue/i }).click();

  await expect(page.getByRole("heading", { name: "A decision receipt—not a plan recommendation" })).toBeVisible();
  await expect(page.getByText(/Important unresolved questions/i)).toBeVisible();
  await expect(page.getByText(/Medigap availability.*guaranteed-issue rights.*underwriting/i)).toBeVisible();
  await expect(page.getByText(/1 source · 1 dated/i)).toBeVisible();
  const officialHandoff = page.locator("section").filter({ has: page.getByRole("heading", { name: "Official handoff", exact: true }) });
  await expect(officialHandoff.getByRole("link", { name: "Medicare Plan Finder", exact: true })).toHaveAttribute("href", "https://www.medicare.gov/plan-compare/");
  await expect(officialHandoff.getByRole("link", { name: /Find local SHIP/i })).toHaveAttribute("href", "https://www.shiphelp.org/");
  await expect(page.getByRole("button", { name: /Print or save as PDF/i })).toBeVisible();
  expect(await seriousAxeViolations(page)).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);

  await page.screenshot({ path: testInfo.outputPath("medicare-decision-brief.png"), fullPage: true, animations: "disabled" });
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".medicare-decision-brief")).toBeVisible();
  await expect(page.locator(".medicare-no-print").first()).toBeHidden();
});

test("paid Medicare application route remains private and fail-closed without authorization", async ({ page }) => {
  await page.goto("/app/medicare-coverage-decision");
  await expect(page.getByRole("heading", { name: "Access is not yet available" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow, noarchive");
  await expect(page.getByText(/never grants product access from a browser flag/i)).toBeVisible();
  expect(await seriousAxeViolations(page)).toEqual([]);
});
