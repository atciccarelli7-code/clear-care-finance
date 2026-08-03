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

test("bounded product route shows a no-charge, price-qualified $29 offer", async ({ page }) => {
  await page.goto("/products/healthcare-worker-benefits-decision-system");
  await expect(page).toHaveURL(/\/products\/healthcare-worker-benefits-decision-system$/);
  await expect(page.getByRole("heading", { level: 1, name: /Would a \$29 Open Enrollment Workspace/i })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow, noarchive");
  await expect(page.getByText("No card. No checkout. No charge.", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /buy|purchase|checkout/i })).toHaveCount(0);
  await expect(page.getByText(/Free articles, calculators, checklists/i)).toBeVisible();
  await page.getByRole("button", { name: /I would consider it at \$29/i }).click();
  await expect(page.locator("#benefits-early-access-email")).toBeFocused();
  expect(await seriousAxeViolations(page)).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test("price-qualified commitment requires both confirmations and sends only fixed offer fields", async ({ page }) => {
  let submittedBody: Record<string, unknown> | null = null;
  await page.route("**/api/benefits-interest", async (route) => {
    submittedBody = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, saved: true, emailDelivered: true, contactSaved: true }),
    });
  });

  await page.goto("/products/healthcare-worker-benefits-decision-system");
  await page.locator("#benefits-early-access-email").fill("reader@example.com");
  await page.getByRole("button", { name: "Join the $29 early-access list" }).click();
  await expect(page.getByText(/Confirm both statements/i)).toBeVisible();

  await page.getByLabel(/Price confirmation/i).check();
  await page.getByLabel(/Email consent/i).check();
  await page.getByRole("button", { name: "Join the $29 early-access list" }).click();
  await expect(page.getByText(/Your \$29 early-access interest is saved/i)).toBeVisible();

  expect(submittedBody).toMatchObject({
    email: "reader@example.com",
    emailConsent: true,
    priceCommitment: true,
    offerVersion: "benefits_offer_29_v1",
    priceCents: 2900,
    source: "total_compensation_comparison",
  });
  expect(submittedBody).toHaveProperty("sessionId");
  expect(submittedBody).not.toHaveProperty("employer");
  expect(submittedBody).not.toHaveProperty("plan");
  expect(submittedBody).not.toHaveProperty("salary");
  expect(submittedBody).not.toHaveProperty("medical");
  expect(submittedBody).not.toHaveProperty("payment");
  expect(submittedBody).not.toHaveProperty("notes");
});

test("retired product-pack route resolves to the canonical validation offer", async ({ page }) => {
  await page.goto("/products/healthcare-worker-benefits-decision-pack");
  await expect(page).toHaveURL(/\/products\/healthcare-worker-benefits-decision-system$/);
  await expect(page.getByRole("heading", { level: 1, name: /Would a \$29 Open Enrollment Workspace/i })).toBeVisible();
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
  await expect(page.getByText("Access is not yet available", { exact: true })).toBeVisible();
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
