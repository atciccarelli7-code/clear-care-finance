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

test("healthcare worker offer comparison continues into a private verified action plan", async ({ page }, testInfo) => {
  const watch = installHealthWatch(page);
  await page.goto("/tools/healthcare-worker-total-compensation-comparison");

  await expect(page.getByRole("heading", { level: 1, name: /Compare two jobs by total compensation/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Build the written verification plan before you resign" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Do not resign until the final written offer is verified" })).toBeVisible();
  await expect(page.getByRole("progressbar", { name: "Healthcare offer verification progress" })).toHaveAttribute("aria-valuenow", "0");
  await expect(page.getByRole("checkbox")).toHaveCount(12);

  const basePay = page.getByRole("checkbox", { name: /Base pay and pay frequency are in writing/ });
  await basePay.check();
  await expect(page.getByRole("progressbar", { name: "Healthcare offer verification progress" })).toHaveAttribute("aria-valuenow", "1");

  const saved = await page.evaluate(() => localStorage.getItem("caf-healthcare-offer-verification-v1"));
  expect(saved).toContain("written-base-pay");
  expect(saved).not.toMatch(/salary|employer|premium|amount/i);

  await page.reload();
  await expect(page.getByRole("heading", { name: "Build the written verification plan before you resign" })).toBeVisible();
  await expect(basePay).toBeChecked();

  for (const checkbox of await page.getByRole("checkbox").all()) {
    if (!await checkbox.isChecked()) await checkbox.check();
  }

  await expect(page.getByRole("progressbar", { name: "Healthcare offer verification progress" })).toHaveAttribute("aria-valuenow", "12");
  await expect(page.getByRole("heading", { name: "All verification items are marked complete" })).toBeVisible();

  await page.getByRole("button", { name: "Copy plan" }).click();
  await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();
  await page.getByRole("button", { name: "Print or PDF" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-print-intent", "true");

  await page.screenshot({
    path: `healthcare-offer-verification-${testInfo.project.name}.png`,
    fullPage: true,
  });

  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const severe = accessibility.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  expect(severe, severe.map((item) => `${item.id}: ${item.help}`).join("\n")).toEqual([]);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Clear local plan" }).click();
  await expect(page.getByRole("progressbar", { name: "Healthcare offer verification progress" })).toHaveAttribute("aria-valuenow", "0");

  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveCount(1);
  expect(watch.httpErrors, watch.httpErrors.join("\n")).toEqual([]);
  expect(watch.consoleErrors, watch.consoleErrors.join("\n")).toEqual([]);
  expect(watch.pageErrors, watch.pageErrors.join("\n")).toEqual([]);
  expect(watch.requestFailures, watch.requestFailures.join("\n")).toEqual([]);
});
