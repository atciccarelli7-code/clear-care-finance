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

test("public visitor sees the interactive-system offer without active checkout", async ({ page }) => {
  await page.goto("/products/healthcare-worker-benefits-decision-system");
  await expect(page.getByRole("heading", { level: 1, name: "Healthcare Worker Benefits Decision System" })).toBeVisible();
  await expect(page.getByText("Interactive decision system")).toBeVisible();
  await expect(page.getByText("Checkout disabled")).toBeVisible();
  await expect(page.getByText("$29 one time — target only")).toBeVisible();
  await expect(page.getByRole("link", { name: /join the early-access list/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /buy/i })).toHaveCount(0);
  expect(await seriousAxeViolations(page)).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test("old product route resolves to the canonical system route", async ({ page }) => {
  await page.goto("/products/healthcare-worker-benefits-decision-pack");
  await expect(page).toHaveURL(/\/products\/healthcare-worker-benefits-decision-system$/);
  await expect(page.getByRole("heading", { level: 1, name: "Healthcare Worker Benefits Decision System" })).toBeVisible();
});

test("missing authentication configuration fails closed on every application entry", async ({ page }) => {
  for (const route of ["/app", "/app/benefits-decision", "/app/benefits-decision/new"]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { name: "Access is not yet available" })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow, noarchive");
    await expect(page.getByText(/never grants product access from a browser flag/i)).toBeVisible();
  }
  await page.goto("/sign-in");
  await expect(page.getByRole("heading", { name: "Secure account access" })).toBeVisible();
  await expect(page.getByText("Access is not yet available")).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow, noarchive");
  expect(await seriousAxeViolations(page)).toEqual([]);
});

test("account and payment-processing states remain private and honest", async ({ page }) => {
  await page.goto("/account");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow, noarchive");
  await expect(page.getByText(/account access is not yet available/i)).toBeVisible();
  await page.goto("/access-processing");
  await expect(page.getByRole("heading", { name: "Access service unavailable" })).toBeVisible();
  await expect(page.getByText(/checkout and entitlement activation are not currently configured/i)).toBeVisible();
});
