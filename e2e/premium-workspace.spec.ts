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

test("bounded product route shows the working no-charge, price-qualified $29 pilot", async ({ page }) => {
  await page.goto("/products/healthcare-worker-benefits-decision-system");
  await expect(page).toHaveURL(/\/products\/healthcare-worker-benefits-decision-system$/);
  await expect(page.getByRole("heading", { level: 1, name: /A complete benefits decision system—not another disconnected free calculator/i })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow, noarchive");
  await expect(page.getByRole("heading", { name: "Complete an open-enrollment election plan", exact: true })).toBeVisible();
  await expect(page.getByText("No card. No checkout. No charge.", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /buy|purchase|checkout/i })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Learn and prepare without paying", exact: true })).toBeVisible();
  await expect(page.getByText(/Public calculators, checklists, comparisons/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Premium foundation built", exact: true })).toBeVisible();
  await expect(page.getByText(/Live payment and public paid access remain off/i)).toBeVisible();
  await expect(page.getByText(/Benefits files and raw copied text remain on the user’s device/i)).toBeVisible();
  await page.getByRole("button", { name: /I would consider it at \$29/i }).first().click();
  await expect(page.locator("#benefits-early-access-email")).toBeFocused();
  expect(await seriousAxeViolations(page)).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test("open enrollment pilot reaches a persisted, printable election plan", async ({ page }) => {
  await page.goto("/products/healthcare-worker-benefits-decision-system");
  await page.getByRole("button", { name: /Try the guided pilot/i }).click();

  await page.getByRole("button", { name: "Annual open enrollment" }).click();
  await page.locator("#pilot-deadline").fill("2026-11-15");
  await page.getByRole("button", { name: /Continue/i }).click();

  await page.locator("#pilot-tier").selectOption("employee-only");
  await page.locator("#pilot-other").selectOption("no");
  await page.locator("#pilot-use").selectOption("expected");
  await page.locator("#pilot-priority").selectOption("balanced");
  await page.getByRole("button", { name: /Continue/i }).click();

  for (const id of [
    "benefits-guide",
    "payroll-rates",
    "medical-sbcs",
    "drug-network-resources",
    "account-rules",
    "protection-retirement-summaries",
  ]) {
    await page.locator(`#pilot-doc-${id}`).selectOption("ready");
  }
  await page.getByRole("button", { name: /Continue/i }).click();

  await page.getByLabel("Compare a second medical plan").uncheck();
  await page.locator("#pilot-plan-a-label").fill("Plan A");
  await page.locator("#pilot-plan-a-premium").fill("2400");
  await page.locator("#pilot-plan-a-deductible").fill("1500");
  await page.locator("#pilot-plan-a-coinsurance").fill("20");
  await page.locator("#pilot-plan-a-oop").fill("5000");
  await page.locator("#pilot-plan-a-employer").fill("500");
  await page.locator("#pilot-plan-a-allowed").fill("3000");
  await page.locator("#pilot-plan-a-network").selectOption("confirmed");
  await page.locator("#pilot-plan-a-rx").selectOption("confirmed");
  await page.locator("#pilot-medical-election").selectOption("a");
  await page.getByRole("button", { name: /Continue/i }).click();

  await page.locator("#pilot-account").selectOption("hsa");
  await page.locator("#pilot-account-contribution").fill("2000");
  await page.locator("#pilot-dependent-care").selectOption("not-offered");
  await page.locator("#pilot-pay-periods").fill("26");
  await page.getByRole("button", { name: /Continue/i }).click();

  for (const id of [
    "dental",
    "vision",
    "short-term-disability",
    "long-term-disability",
    "life-insurance",
    "accident",
    "critical-illness",
    "hospital-indemnity",
  ]) {
    await page.locator(`#pilot-${id}`).selectOption(id === "dental" || id === "vision" ? "enroll" : "decline");
  }
  await page.locator("#pilot-ancillary-premium").fill("480");
  await page.getByRole("button", { name: /Continue/i }).click();

  await page.locator("#pilot-retirement-offered").selectOption("yes");
  await page.locator("#pilot-compensation").fill("80000");
  await page.locator("#pilot-retirement-rate").fill("6");
  await page.locator("#pilot-match-status").selectOption("known");
  await page.locator("#pilot-match-rate").fill("100");
  await page.locator("#pilot-match-limit").fill("6");
  await page.locator("#pilot-vested").fill("100");
  await page.getByRole("button", { name: /Continue/i }).click();

  await expect(page.getByRole("heading", { name: /Review the plan before using the employer portal/i })).toBeVisible();
  await expect(page.getByText("Plan A", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/before tax effects and is not take-home pay/i)).toBeVisible();
  await page.getByLabel(/I reviewed the planned elections/i).check();
  await expect(page.getByText(/planning workflow is complete/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /Print election plan/i })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: /Review the plan before using the employer portal/i })).toBeVisible();
  await expect(page.getByLabel(/I reviewed the planned elections/i)).toBeChecked();
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

test("retired product-pack route resolves to the canonical working pilot", async ({ page }) => {
  await page.goto("/products/healthcare-worker-benefits-decision-pack");
  await expect(page).toHaveURL(/\/products\/healthcare-worker-benefits-decision-system$/);
  await expect(page.getByRole("heading", { level: 1, name: /A complete benefits decision system—not another disconnected free calculator/i })).toBeVisible();
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
