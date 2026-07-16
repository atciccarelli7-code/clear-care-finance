import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type Request } from "@playwright/test";

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
    if (url.origin === "http://127.0.0.1:4173" && response.status() >= 400) {
      watch.httpErrors.push(`${response.status()} ${url.pathname}`);
    }
  });
  return watch;
};

const installIntentStubs = async (page: Page) => {
  await page.addInitScript(() => {
    localStorage.setItem("caf-privacy-consent-v1", "necessary");
    window.print = () => { document.documentElement.dataset.printIntent = "true"; };
  });
};

const visit = async (page: Page, path: string) => {
  await page.goto(path);
  await page.waitForFunction(() => Array.from(document.querySelectorAll("button, select, input")).some((element) => (
    Object.keys(element).some((key) => key.startsWith("__reactProps$"))
  )));
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
};

const certifyPage = async (page: Page, watch: HealthWatch) => {
  await expect(page.locator("body")).toContainText(/Community Acquired Finance|Medicare|benefit|financial|medical/i);
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("vite-error-overlay, [data-error-overlay]")).toHaveCount(0);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);

  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const severe = accessibility.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  expect(severe, severe.map((item) => `${item.id}: ${item.help}`).join("\n")).toEqual([]);
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
  await installIntentStubs(page);
});

test("homepage concierge routes to the canonical pre-care journey and survives browser history", async ({ page }) => {
  const watch = installHealthWatch(page);
  await visit(page, "/");

  await page.getByRole("button", { name: "Prepare financially before medical care" }).click();
  await page.getByRole("button", { name: "I am planning ahead" }).click();
  await expect(page.getByRole("heading", { name: "Medical Appointment Cost Preparation" })).toBeFocused();
  await page.getByRole("link", { name: /Open this journey/i }).click();
  await expect(page).toHaveURL(/\/tools\/medical-appointment-cost-preparation$/);
  await expect(page.getByRole("heading", { level: 1, name: "Medical Appointment Cost Preparation" })).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/tools\/medical-appointment-cost-preparation$/);
  await certifyPage(page, watch);
});

test("Financial Navigator creates, completes, and removes a local My Plan action", async ({ page }) => {
  const watch = installHealthWatch(page);
  await visit(page, "/start-here");
  await page.getByRole("button", { name: /Handle a healthcare-cost problem/i }).click();

  for (let index = 0; index < 8; index += 1) {
    if (await page.getByRole("heading", { name: "Your plan is ready" }).isVisible().catch(() => false)) break;
    const firstChoice = page.locator("#navigator-intake label").first();
    await firstChoice.click();
    await page.locator("#navigator-intake").getByRole("button", { name: /Continue|Build my plan/ }).click();
  }

  await expect(page.getByRole("heading", { name: "Your plan is ready" })).toBeFocused();
  const storedBefore = await page.evaluate(() => JSON.parse(localStorage.getItem("caf-financial-navigator-v1") ?? "null")?.actionIds?.length ?? 0);
  expect(storedBefore).toBeGreaterThan(0);

  await page.getByRole("button", { name: /^Mark .* complete$/ }).first().click();
  await expect(page.getByRole("progressbar", { name: "My Plan completion" })).not.toHaveAttribute("aria-valuenow", "0");
  await page.getByRole("button", { name: "Remove" }).first().click();
  const storedAfter = await page.evaluate(() => JSON.parse(localStorage.getItem("caf-financial-navigator-v1") ?? "null")?.actionIds?.length ?? 0);
  expect(storedAfter).toBe(storedBefore - 1);
  await certifyPage(page, watch);
});

test("Benefits Change Detector completes a Receipt and exposes safe result actions", async ({ page }) => {
  const watch = installHealthWatch(page);
  await visit(page, "/tools/benefits-change-detector");
  await page.locator('select[aria-label$=" change"]').first().selectOption({ index: 1 });

  for (let index = 0; index < 8; index += 1) {
    const create = page.getByRole("button", { name: /Create Benefits Change Receipt/i });
    if (await create.isVisible().catch(() => false)) { await create.click(); break; }
    await page.getByRole("button", { name: /Next section/i }).click();
  }

  await expect(page.getByRole("heading", { name: "Benefits Change Receipt" })).toBeFocused();
  await page.getByRole("button", { name: "Copy Receipt" }).click();
  await expect(page.getByRole("status")).toContainText(/Receipt copied/i);
  await page.getByRole("button", { name: "Print" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-print-intent", "true");
  await page.getByRole("button", { name: /Reset review/i }).click();
  await expect(page.getByText(/Section 1 of/i).first()).toBeVisible();
  await certifyPage(page, watch);
});

test("Medical Bill Review Toolkit exposes the correct guided action and official rights source", async ({ page }) => {
  const watch = installHealthWatch(page);
  await visit(page, "/insurance/medical-bill-review-toolkit");
  const officialRights = page.getByRole("link", { name: /Estimate or good-faith estimate.*Check official rights/i });
  await expect(officialRights).toHaveAttribute("href", "https://www.cms.gov/medical-bill-rights");
  await page.getByRole("link", { name: /Medical bill.*Review the bill/i }).click();
  await expect(page).toHaveURL(/\/tools\/medical-bill-review-flow$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/insurance\/medical-bill-review-toolkit$/);
  await certifyPage(page, watch);
});

test("Turning 65 journey builds a dated timeline and keeps official verification visible", async ({ page }) => {
  const watch = installHealthWatch(page);
  await visit(page, "/medicare-care-costs/turning-65");
  await page.getByLabel("Birth month").fill("6");
  await page.getByLabel("Birth year").fill("1961");
  await page.getByRole("button", { name: /Build qualified timeline/i }).click();

  await expect(page.getByRole("heading", { name: "Dated timeline" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Official verification and escalation" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Medicare\.gov.*When can I sign up/i }).first()).toHaveAttribute("href", "https://www.medicare.gov/basics/get-started-with-medicare/sign-up/when-can-i-sign-up-for-medicare");
  await page.getByRole("button", { name: "Copy plan" }).click();
  await page.getByRole("button", { name: "Print" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-print-intent", "true");
  await certifyPage(page, watch);
});

test("Medical Appointment Cost Preparation completes by keyboard and preserves safe continuity", async ({ page }) => {
  const watch = installHealthWatch(page);
  await visit(page, "/tools/medical-appointment-cost-preparation");

  await page.locator("#care-timing").focus();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.getByRole("button", { name: /Continue/i }).focus();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: /Continue/i }).focus();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: /Build my cost preparation plan/i }).focus();
  await page.keyboard.press("Enter");

  await expect(page.getByRole("heading", { name: /medical-care cost preparation plan/i })).toBeFocused();
  await page.getByRole("button", { name: "Copy plan" }).click();
  await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();
  await page.getByRole("button", { name: /Print or save as PDF/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-print-intent", "true");
  await page.getByRole("button", { name: "Add this action" }).click();
  await expect(page.getByRole("button", { name: /Added to My Plan/i })).toBeDisabled();
  await page.getByRole("link", { name: /Medical Bill Review Toolkit/i }).last().click();
  await expect(page).toHaveURL(/\/insurance\/medical-bill-review-toolkit$/);
  await certifyPage(page, watch);
});

test("Medicare Plan Verification reaches explicit preparation completion and a next action", async ({ page }) => {
  const watch = installHealthWatch(page);
  await visit(page, "/tools/medicare-plan-verification-checklist");
  const coreLabels = [
    /Preferred doctors, specialists, and hospitals were checked/i,
    /Every recurring prescription was checked/i,
    /Preferred and mail-order pharmacy rules/i,
    /Prior authorization, referral, and step-therapy/i,
    /Premium, deductible, copays, coinsurance/i,
    /maximum out-of-pocket exposure was identified/i,
    /Annual Notice of Change was reviewed/i,
    /correct enrollment period and effective date/i,
  ];
  for (const label of coreLabels) await page.getByLabel(label).selectOption("confirmed");
  await page.getByLabel(coreLabels[0]).selectOption("confirmed");

  await expect(page.getByRole("heading", { name: /critical verification categories were deliberately resolved/i })).toBeFocused();
  await expect(page.getByText(/does not mean a plan is suitable, recommended, approved/i)).toBeVisible();
  await page.getByRole("button", { name: /Copy checklist/i }).click();
  await page.getByRole("button", { name: /Print or save as PDF/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-print-intent", "true");
  await expect(page.getByRole("link", { name: /Medicare Plan Finder/i })).toHaveAttribute("href", "https://www.medicare.gov/plan-compare/");
  await page.getByRole("link", { name: /Turning 65 timeline/i }).click();
  await expect(page).toHaveURL(/\/medicare-care-costs\/turning-65$/);
  await certifyPage(page, watch);
});
