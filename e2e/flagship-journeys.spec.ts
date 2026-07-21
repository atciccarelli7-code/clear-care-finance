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

const visit = async (page: Page, route: string) => {
  await page.goto(route);
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
  await page.getByRole("button", { name: /healthcare-cost, medical-bill, or discharge question/i }).click();
  await page.getByRole("button", { name: "Prepare financially before medical care" }).click();
  await page.getByRole("button", { name: "I am planning ahead" }).click();
  await expect(page.getByRole("heading", { name: "Medical Appointment Cost Preparation" })).toBeFocused();
  await expect(page.getByText(/What you will receive before leaving this experience/i)).toBeVisible();
  await page.getByRole("link", { name: /Start and finish this experience/i }).click();
  await expect(page).toHaveURL(/\/tools\/medical-appointment-cost-preparation$/);
  await expect(page.getByText(/You started with: “Prepare financially before medical care”/)).toBeVisible();
  await expect(page.getByText(/You are still in the same guided journey/i)).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/tools\/medical-appointment-cost-preparation$/);
  await expect(page.getByText(/You started with: “Prepare financially before medical care”/)).toBeVisible();
  await certifyPage(page, watch);
});

test("Financial Navigator creates completes and removes a local My Plan action", async ({ page }) => {
  const watch = installHealthWatch(page);
  await visit(page, "/start-here");
  await page.getByRole("button", { name: /Handle a healthcare-cost problem/i }).click();
  for (let index = 0; index < 8; index += 1) {
    if (await page.getByRole("heading", { name: "Your plan is ready" }).isVisible().catch(() => false)) break;
    await page.locator("#navigator-intake label").first().click();
    await page.locator("#navigator-intake").getByRole("button", { name: /Continue|Build my plan/ }).click();
  }
  await expect(page.getByRole("heading", { name: "Your plan is ready" })).toBeFocused();
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem("caf-financial-navigator-v1") ?? "null")?.actionIds?.length ?? 0);
  expect(before).toBeGreaterThan(0);
  await page.getByRole("button", { name: /^Mark .* complete$/ }).first().click();
  await expect(page.getByRole("progressbar", { name: "My Plan completion" })).not.toHaveAttribute("aria-valuenow", "0");
  await page.getByRole("button", { name: "Remove" }).first().click();
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem("caf-financial-navigator-v1") ?? "null")?.actionIds?.length ?? 0);
  expect(after).toBe(before - 1);
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

test("Medical Bill Response System routes documents to the correct action and official source", async ({ page }) => {
  const watch = installHealthWatch(page);
  await visit(page, "/insurance/medical-bill-review-toolkit");

  await page.getByRole("button", { name: /No document yet/i }).click();
  await expect(page.getByRole("link", { name: /CMS estimate guide/i })).toHaveAttribute(
    "href",
    "https://www.cms.gov/medical-bill-rights/help/guides/good-faith-estimate",
  );

  await page.getByRole("button", { name: /Hospital or facility bill/i }).click();
  await page.getByRole("link", { name: /Start the bill review/i }).click();
  await expect(page).toHaveURL(/\/tools\/medical-bill-review-flow$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/insurance\/medical-bill-review-toolkit$/);
  await certifyPage(page, watch);
});

test("Turning 65 journey builds a dated timeline with official verification", async ({ page }) => {
  const watch = installHealthWatch(page);
  await visit(page, "/medicare-care-costs/turning-65");
  await page.getByLabel("Birth month").fill("6");
  await page.getByLabel("Birth year").fill("1961");
  await page.getByRole("button", { name: /Build qualified timeline/i }).click();
  await expect(page.getByRole("heading", { name: "Dated timeline" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Official verification and escalation" })).toBeVisible();
  await page.getByRole("button", { name: "Copy plan" }).click();
  await page.getByRole("button", { name: "Print" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-print-intent", "true");
  await certifyPage(page, watch);
});

test("Medical Appointment Cost Preparation completes by keyboard", async ({ page }) => {
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
  await page.getByRole("button", { name: /Print or save as PDF/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-print-intent", "true");
  await certifyPage(page, watch);
});

test("Medicare Plan Verification reaches explicit preparation completion", async ({ page }) => {
  const watch = installHealthWatch(page);
  await visit(page, "/tools/medicare-plan-verification-checklist");
  const labels = [
    /Preferred doctors, specialists, and hospitals were checked/i,
    /Every recurring prescription was checked/i,
    /Preferred and mail-order pharmacy rules/i,
    /Prior authorization, referral, and step-therapy/i,
    /Premium, deductible, copays, coinsurance/i,
    /maximum out-of-pocket exposure was identified/i,
    /Annual Notice of Change was reviewed/i,
    /correct enrollment period and effective date/i,
  ];
  for (const label of labels) await page.getByLabel(label).selectOption("confirmed");
  await expect(page.getByRole("heading", { name: /critical verification categories were deliberately resolved/i })).toBeFocused();
  await expect(page.getByText(/does not mean a plan is suitable, recommended, approved/i)).toBeVisible();
  await page.getByRole("button", { name: /Copy checklist/i }).click();
  await page.getByRole("button", { name: /Print or save as PDF/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-print-intent", "true");
  await certifyPage(page, watch);
});

test("Medicare cost hub keeps its comparison table keyboard accessible", async ({ page }) => {
  const watch = installHealthWatch(page);
  await visit(page, "/medicare-care-costs");
  await expect(page.getByRole("heading", { name: /Common Medicare cost points/i })).toBeVisible();
  const table = page.getByRole("region", { name: /Common Medicare cost points.*scrollable table/i });
  await table.focus();
  await expect(table).toBeFocused();
  await certifyPage(page, watch);
});

test("Benefits Command Center supports direct modes print and local clearing", async ({ page }) => {
  const watch = installHealthWatch(page);
  await visit(page, "/tools/benefits-command-center?mode=tour");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: /skip tour/i }).click();
  await visit(page, "/tools/benefits-command-center?mode=compare-samples");
  await expect(page.getByRole("heading", { name: /bedside rn versus clinical specialist/i })).toBeVisible();
  await visit(page, "/tools/benefits-command-center?mode=build");
  await page.getByLabel("Local package label").fill("Private offer");
  await page.getByRole("button", { name: "Open partial Receipt" }).click();
  await expect(page.getByRole("article", { name: /Benefits Receipt for Private offer/i })).toBeVisible();
  await page.getByRole("button", { name: "Print / PDF" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-print-intent", "true");
  await page.getByRole("button", { name: /Clear all local data/i }).click();
  await expect(page.getByText(/All Command Center data was cleared from this browser/i)).toBeVisible();
  await certifyPage(page, watch);
});

test("consumer Hospital and Patient Guide finder routes to the blood thinner safety guide", async ({ page }) => {
  const watch = installHealthWatch(page);
  await visit(page, "/patients-families/hospital-guide");
  await expect(page.getByRole("heading", { level: 1, name: /Know what to verify/i })).toBeVisible();
  await page.getByRole("button", { name: /questions about a blood thinner/i }).click();
  await expect(page.getByText(/Suggested starting point/i)).toBeVisible();
  await page.getByRole("link", { name: /Open the guide/i }).click();
  await expect(page).toHaveURL(/\/articles\/blood-thinner-safety-before-going-home$/);
  await expect(page.getByRole("heading", { level: 1, name: /Blood Thinner Safety/i })).toBeVisible();
  await expect(page.getByText(/does not supply dosing/i)).toBeVisible();
  await certifyPage(page, watch);
});

test("Organization page preserves the B2B pause and hands visitors to consumer guides", async ({ page }) => {
  const watch = installHealthWatch(page);
  await visit(page, "/for-organizations");
  await expect(page.getByRole("heading", { level: 1, name: /Healthcare financial education without private records/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Institutional patient-education sales are paused/i })).toBeVisible();
  await expect(page.getByText(/not currently offering a hospital pilot/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /Build program brief/i })).toHaveCount(0);
  await page.getByRole("link", { name: /Review the consumer guide library/i }).click();
  await expect(page).toHaveURL(/\/patients-families\/hospital-guide$/);
  await expect(page.getByRole("heading", { level: 1, name: /Know what to verify/i })).toBeVisible();
  await certifyPage(page, watch);
});
