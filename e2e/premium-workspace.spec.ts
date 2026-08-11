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

test("canonical product route presents a complete free browser-local decision system", async ({ page }) => {
  await page.goto("/products/healthcare-worker-benefits-decision-system");
  await expect(page).toHaveURL(/\/products\/healthcare-worker-benefits-decision-system$/);
  await expect(page.getByRole("heading", { level: 1, name: /Work through open enrollment one decision at a time/i })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow, max-image-preview:large");
  await expect(page.getByRole("heading", { name: "Complete an open-enrollment election plan", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /Start the guided system/i })).toBeVisible();
  await expect(page.getByText(/Progress stays in this browser/i).first()).toBeVisible();
  await expect(page.getByText(/\$29|early-access|prelaunch|checkout remains|paid access remain off|worth \$29/i)).toHaveCount(0);
  await expect(page.getByRole("button", { name: /buy|purchase|checkout/i })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "What this system does not do", exact: true })).toBeVisible();
  expect(await seriousAxeViolations(page)).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test("open enrollment workflow reaches a persisted, printable election plan", async ({ page }) => {
  const precommerceEvidence: Array<Record<string, unknown>> = [];
  page.on("request", (request) => {
    if (!request.url().includes("/api/evidence-event")) return;
    try {
      const payload = request.postDataJSON() as Record<string, unknown>;
      if (String(payload.eventName).startsWith("precommerce_")) precommerceEvidence.push(payload);
    } catch { /* non-JSON requests are outside this contract */ }
  });
  await page.route("**/api/evidence-event", async (route) => {
    await route.fulfill({ status: 202, contentType: "application/json", body: JSON.stringify({ accepted: true }) });
  });
  await page.route("**/api/precommerce-commitment", async (route) => {
    const body = route.request().postDataJSON();
    expect(body).toMatchObject({
      offerKey: "benefits_decision_workspace_29_v2",
      email: "qualified@example.com",
      emailConsent: true,
      priceCommitment: true,
      evidenceClass: "observed",
      website: "",
    });
    expect(Object.keys(body).sort()).toEqual([
      "email",
      "emailConsent",
      "evidenceClass",
      "offerKey",
      "priceCommitment",
      "sessionId",
      "website",
    ]);
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, saved: true, emailDelivered: false }) });
  });
  await page.goto("/products/healthcare-worker-benefits-decision-system");
  await page.getByRole("button", { name: /Start the guided system/i }).click();

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
  await expect(page.getByRole("button", { name: /Print Benefits Decision Brief/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Would a \$29 one-time Benefits Decision Workspace/i })).toBeVisible();
  await expect(page.getByText(/early-access/i)).toHaveCount(0);
  await page.getByRole("button", { name: /Review exactly what \$29 would add/i }).click();
  await expect(page.getByText("Free today and staying free", { exact: true })).toBeVisible();
  await expect(page.getByText("Proposed $29 workspace", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /I would seriously consider this at \$29/i }).click();
  await page.locator("#precommerce-email").fill("qualified@example.com");
  await page.getByLabel(/Price confirmation:/i).check();
  await page.getByLabel(/Separate email consent:/i).check();
  await page.getByRole("button", { name: /Record my price-qualified interest/i }).click();
  await expect(page.getByText(/price-qualified stated intent is recorded/i)).toBeVisible();
  expect(precommerceEvidence).toEqual([]);

  await page.reload();
  await expect(page.getByRole("heading", { name: /Review the plan before using the employer portal/i })).toBeVisible();
  await expect(page.getByLabel(/I reviewed the planned elections/i)).toBeChecked();

  await page.evaluate(() => localStorage.setItem("caf-privacy-consent-v1", "analytics"));
  await page.reload();
  await expect.poll(() => precommerceEvidence.length).toBe(1);
  await page.getByRole("button", { name: /Review exactly what \$29 would add/i }).click();
  await expect.poll(() => precommerceEvidence.length).toBe(2);
  await page.getByRole("button", { name: /I would seriously consider this at \$29/i }).click();
  await expect.poll(() => precommerceEvidence.length).toBe(3);
  expect(precommerceEvidence.map((payload) => payload.eventName)).toEqual([
    "precommerce_offer_viewed",
    "precommerce_offer_engaged",
    "precommerce_commitment_started",
  ]);
  expect(precommerceEvidence.every((payload) => payload.variant === "benefits_workspace_29_v2")).toBe(true);

  await page.reload();
  await page.getByRole("button", { name: /Review exactly what \$29 would add/i }).click();
  await page.getByRole("button", { name: /I would seriously consider this at \$29/i }).click();
  await page.waitForTimeout(100);
  expect(precommerceEvidence).toHaveLength(3);
  expect(await seriousAxeViolations(page)).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test("source-readiness table remains keyboard accessible", async ({ page }) => {
  await page.goto("/products/healthcare-worker-benefits-decision-system");
  await page.getByRole("button", { name: /Start the guided system/i }).click();
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
  ]) await page.locator(`#pilot-doc-${id}`).selectOption("ready");
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
  await page.locator("#pilot-account").selectOption("none");
  await page.locator("#pilot-dependent-care").selectOption("not-offered");
  await page.locator("#pilot-pay-periods").fill("26");
  await page.getByRole("button", { name: /Continue/i }).click();
  for (const id of ["dental", "vision", "short-term-disability", "long-term-disability", "life-insurance", "accident", "critical-illness", "hospital-indemnity"]) {
    await page.locator(`#pilot-${id}`).selectOption("decline");
  }
  await page.locator("#pilot-ancillary-premium").fill("0");
  await page.getByRole("button", { name: /Continue/i }).click();
  await page.locator("#pilot-retirement-offered").selectOption("no");
  await page.getByRole("button", { name: /Continue/i }).click();

  const region = page.getByRole("region", { name: "Scrollable benefits source-readiness table" });
  await expect(region).toHaveAttribute("tabindex", "0");
});

test("retired product-pack route resolves to the canonical finished system", async ({ page }) => {
  await page.goto("/products/healthcare-worker-benefits-decision-pack");
  await expect(page).toHaveURL(/\/products\/healthcare-worker-benefits-decision-system$/);
  await expect(page.getByRole("heading", { level: 1, name: /Work through open enrollment one decision at a time/i })).toBeVisible();
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
