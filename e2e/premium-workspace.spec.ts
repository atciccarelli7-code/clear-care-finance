import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type Request } from "@playwright/test";

const PRODUCT_ID = "healthcare_compensation_benefits_decision_book";

const moduleManifest = [
  ["pay-structure", "01", "Compensation", "Employment pay structure"],
  ["total-compensation", "02", "Compensation", "Total compensation"],
  ["medical-insurance", "03", "Health & insurance", "Medical insurance"],
  ["dental-insurance", "04", "Health & insurance", "Dental insurance"],
  ["vision-insurance", "05", "Health & insurance", "Vision insurance"],
  ["hsa-fsa-hra", "06", "Health & insurance", "HSA, FSA & HRA elections"],
  ["retirement-plan", "07", "Retirement", "Retirement plan identification"],
  ["retirement-election", "08", "Retirement", "Retirement contribution election"],
  ["pto-leave", "09", "Time, leave & protection", "PTO & leave"],
  ["protection-elections", "10", "Time, leave & protection", "Disability, life & protection elections"],
  ["schedule-time", "11", "Time, leave & protection", "Schedule & controlled time"],
  ["repayment-risk", "12", "Conditional benefits & risk", "Repayment risk"],
  ["career-fit", "13", "Conditional benefits & risk", "Career fit & employment risk"],
  ["integrated-decision", "14", "Integrated decision", "Integrated decision board"],
] as const;

const fixtureModules = moduleManifest.map(([id, number, part, title], index) => ({
  id,
  number,
  part,
  title,
  purpose: `Fixture purpose for ${title}. This validates layout and interaction without exposing paid source copy.`,
  orientation: "Use the controlling written source, label uncertainty, and record the next action before completing this module.",
  framingQuestions: [
    "What is verified in writing?",
    "What remains estimated, assumed, or unresolved?",
    "What action or deadline comes next?",
  ],
  comparisonFields: ["Verified term", "Estimated value", "Controlling source", "Open question"],
  actions: ["Name the controlling source.", "Record uncertainty explicitly.", "Set the next review date."],
  professionalQuestions: [
    "Please confirm the controlling written terms.",
    "Please identify the effective date and any eligibility conditions.",
    "Please clarify unresolved assumptions before the decision deadline.",
  ],
  completionCriteria: ["The decision, source, uncertainty, and next action are recorded."],
  relatedModuleIds: index < moduleManifest.length - 1 ? [moduleManifest[index + 1][0]] : [moduleManifest[0][0]],
  sourceIds: ["official-source"],
}));

const workspacePayload = {
  product: {
    id: PRODUCT_ID,
    name: "Healthcare Compensation & Benefits Decision Workspace",
    sourceEditionName: "Healthcare Compensation & Benefits Decision Book",
    version: "3.0-web.1",
    sourceVersion: "3.0",
    sourceReviewDate: "2026-07-23",
    publishedAt: "2026-07-23",
    audience: "Healthcare professionals evaluating compensation and benefits.",
    outcome: "A documented decision, verification plan, and dated election summary.",
    purchaseModel: {
      type: "one_time",
      automaticRenewal: false,
      access: "Continued access to the purchased edition while the service remains available.",
      updates: "Twelve months of substantive product updates from the verified purchase date.",
      ads: false,
    },
    privacy: {
      savedToAccount: ["module completion", "last viewed module", "generic task completion", "product version"],
      keptInBrowser: ["calculator inputs", "free-text notes", "draft comparisons"],
      prohibited: ["sensitive identifiers", "medical records", "banking credentials"],
    },
    modules: fixtureModules,
    sources: [{ id: "official-source", agency: "Official source", title: "Fixture official source", url: "https://www.irs.gov/" }],
    updateHistory: [{ version: "3.0-web.1", date: "2026-07-23", type: "substantive", summary: "Fixture update record for visual certification." }],
    limitation: "Educational decision support only. Verify controlling documents and qualified professional guidance before acting.",
  },
  progress: {
    completedModuleIds: [],
    activeModuleId: "pay-structure",
    completedTaskIds: [],
    updatedAt: "2026-07-23T20:00:00.000Z",
  },
  access: {
    purchasedAt: "2026-07-23T18:00:00.000Z",
    updatesUntil: "2027-07-23T18:00:00.000Z",
    accessStatus: "active",
    testMode: true,
  },
};

type HealthWatch = {
  consoleErrors: string[];
  pageErrors: string[];
  requestFailures: string[];
  httpErrors: string[];
};

const installHealthWatch = (page: Page): HealthWatch => {
  const watch: HealthWatch = { consoleErrors: [], pageErrors: [], requestFailures: [], httpErrors: [] };
  page.on("console", (message) => {
    if (message.type() === "error") watch.consoleErrors.push(`${message.text()} @ ${message.location().url || "unknown"}`);
  });
  page.on("pageerror", (error) => watch.pageErrors.push(error.message));
  page.on("requestfailed", (request: Request) => {
    const url = new URL(request.url());
    const failure = request.failure()?.errorText ?? "unknown failure";
    if (url.origin === "http://127.0.0.1:4173" && !failure.includes("ERR_ABORTED")) {
      watch.requestFailures.push(`${request.method()} ${url.pathname}: ${failure}`);
    }
  });
  page.on("response", (response) => {
    const url = new URL(response.url());
    if (url.origin === "http://127.0.0.1:4173" && response.status() >= 400 && !url.pathname.startsWith("/api/premium-")) {
      watch.httpErrors.push(`${response.status()} ${url.pathname}`);
    }
  });
  return watch;
};

const assertPageQuality = async (page: Page, watch: HealthWatch) => {
  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const severe = accessibility.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  expect(severe, severe.map((item) => `${item.id}: ${item.help}`).join("\n")).toEqual([]);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveCount(1);
  expect(watch.httpErrors, watch.httpErrors.join("\n")).toEqual([]);
  expect(watch.consoleErrors, watch.consoleErrors.join("\n")).toEqual([]);
  expect(watch.pageErrors, watch.pageErrors.join("\n")).toEqual([]);
  expect(watch.requestFailures, watch.requestFailures.join("\n")).toEqual([]);
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

test("premium sales and secure access remain useful while commerce is default-deny", async ({ page }, testInfo) => {
  const watch = installHealthWatch(page);
  await page.route("**/api/product-config", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ commerceEnabled: false, infrastructure: { contentReady: false }, products: [] }),
  }));
  await page.route("**/api/premium-session", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ signedIn: false, commerceReady: false }),
  }));
  await page.route("**/api/premium-checkout", (route) => route.fulfill({
    status: 503,
    contentType: "application/json",
    body: JSON.stringify({ error: "Secure checkout is not active yet.", code: "commerce_not_ready" }),
  }));

  await page.goto("/products/healthcare-worker-benefits-decision-pack");
  await expect(page.getByRole("heading", { level: 1, name: "Healthcare Compensation & Benefits Decision Workspace" })).toBeVisible();
  await expect(page.getByText("Commerce default-deny")).toBeVisible();
  await expect(page.getByText(/Fourteen modular decisions/i)).toBeVisible();
  await page.screenshot({ path: `premium-product-sales-${testInfo.project.name}.png`, fullPage: true });
  await assertPageQuality(page, watch);

  await page.getByRole("link", { name: "Review secure access" }).click();
  await expect(page).toHaveURL(/\/premium\/access$/);
  await expect(page.getByRole("heading", { level: 1, name: "Healthcare Compensation & Benefits Decision Workspace" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Open or recover your workspace" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow, noarchive");

  await page.getByLabel("Purchase email").fill("customer@example.com");
  await page.getByRole("button", { name: "Open secure one-time checkout" }).click();
  await expect(page.getByRole("status")).toContainText("Secure checkout is not active yet.");
  await page.screenshot({ path: `premium-secure-access-${testInfo.project.name}.png`, fullPage: true });
  await assertPageQuality(page, watch);
});

test("unauthorized workspace requests fail closed and return to access recovery", async ({ page }) => {
  await page.route("**/api/premium-workspace", (route) => route.fulfill({
    status: 401,
    contentType: "application/json",
    body: JSON.stringify({ error: "signed_out", protected: true }),
  }));
  await page.route("**/api/premium-session", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ signedIn: false, commerceReady: false }),
  }));

  await page.goto("/premium/healthcare-compensation-benefits");
  await expect(page).toHaveURL(/\/premium\/access\?state=expired$/);
  await expect(page.getByText("That access link expired")).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow, noarchive");
});

test("authorized premium dashboard, module, progress, local note, and print controls work", async ({ page }, testInfo) => {
  const watch = installHealthWatch(page);
  let savedProgress = workspacePayload.progress;
  const patchBodies: unknown[] = [];

  await page.route("**/api/premium-workspace", async (route) => {
    const method = route.request().method();
    if (method === "PATCH") {
      const body = route.request().postDataJSON();
      patchBodies.push(body);
      savedProgress = body;
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ progress: body }) });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ...workspacePayload, progress: savedProgress }),
    });
  });
  await page.route("**/api/premium-session", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ signedIn: true, hasAccess: true, emailMasked: "cu••••@example.com" }),
  }));

  await page.goto("/premium/healthcare-compensation-benefits");
  await expect(page.getByRole("heading", { level: 1, name: /Make the decision auditable/i })).toBeVisible();
  await expect(page.getByText("0 of 14")).toBeVisible();
  await expect(page.getByText("Test-mode entitlement")).toBeVisible();

  if (testInfo.project.name === "mobile-chromium") {
    await page.getByRole("button", { name: "Toggle workspace navigation" }).click();
  }
  await page.getByRole("button", { name: /Employment pay structure/ }).first().click();
  await expect(page.getByRole("heading", { level: 1, name: "Employment pay structure" })).toBeVisible();
  await page.getByPlaceholder(/Record your election/i).fill("Private fixture note stored only in this browser.");
  await expect.poll(() => page.evaluate(() => localStorage.getItem(`${"caf-premium-note"}:${PRODUCT_ID}:pay-structure`))).toContain("Private fixture note");

  await page.getByRole("button", { name: "Mark complete" }).first().click();
  await expect.poll(() => patchBodies.length).toBeGreaterThan(0);
  expect(JSON.stringify(patchBodies.at(-1))).toContain("pay-structure");

  await page.getByRole("button", { name: "Print module" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-print-intent", "true");
  await page.screenshot({ path: `premium-workspace-module-${testInfo.project.name}.png`, fullPage: true });
  await assertPageQuality(page, watch);
});
