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

const certifyPage = async (page: Page, watch: HealthWatch) => {
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
    await route.fulfill(isScript ? { status: 200, contentType: "application/javascript", body: "" } : { status: 204, body: "" });
  });
  await page.addInitScript(() => {
    localStorage.setItem("caf-privacy-consent-v1", "necessary");
    window.print = () => { document.documentElement.dataset.printIntent = "true"; };
  });
});

test("Patient Education Systems builds a private pilot brief", async ({ page }, testInfo) => {
  const watch = installHealthWatch(page);
  await page.goto("/for-organizations/patient-education-systems");
  await page.waitForFunction(() => document.body.innerText.includes("CAF Patient Education Systems"));

  await expect(page.getByRole("heading", { level: 1, name: /Hospital-to-home education designed around what patients actually have to do next/i })).toBeVisible();
  await expect(page.getByText(/Controlled preview—not a clinical handout/i)).toBeVisible();
  await expect(page.getByText(/No patient information and no free text/i)).toBeVisible();
  await expect(page.locator("#pilot-builder textarea, #pilot-builder input")).toHaveCount(0);

  const initialUrl = page.url();
  await page.getByLabel("Care setting").selectOption("acute_inpatient");
  await page.getByLabel("First flagship module").selectOption("blood_thinners");
  await page.getByLabel("Pilot scale").selectOption("single_unit");
  await page.getByLabel("Planning horizon").selectOption("ninety_day_pilot");
  await page.getByLabel("Primary evaluation focus").selectOption("comprehension");
  await page.getByRole("button", { name: /Build pilot brief/i }).click();

  await expect(page.getByRole("heading", { name: /New to Blood Thinners: Single unit starting brief/i })).toBeFocused();
  await expect(page.getByText("Medication-specific insert", { exact: true })).toBeVisible();
  await page.getByText("Privacy, clinical, and claims boundaries", { exact: true }).click();
  await expect(page.getByText(/Do not enter names, dates of birth, medical record numbers/i)).toBeVisible();
  expect(page.url()).toBe(initialUrl);

  await page.getByRole("button", { name: /Copy brief/i }).click();
  await expect(page.getByRole("status")).toContainText(/Pilot brief copied/i);
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toContain("CAF PATIENT EDUCATION SYSTEMS - PILOT STARTING BRIEF");
  expect(clipboard).toContain("PRIVACY, CLINICAL, AND CLAIMS BOUNDARIES");
  expect(clipboard).not.toMatch(/patient name:|medical record number:|date of birth:/i);

  await page.getByRole("button", { name: /Print or save PDF/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-print-intent", "true");
  await page.screenshot({ path: testInfo.outputPath("patient-education-systems.png"), fullPage: true });
  await certifyPage(page, watch);
});
