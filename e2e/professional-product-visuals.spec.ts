import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";

const preparePage = async (page: Page, route: string) => {
  await page.addInitScript(() => {
    localStorage.setItem("caf-privacy-consent-v1", "necessary");
    window.print = () => { document.documentElement.dataset.printIntent = "true"; };
  });
  await page.goto(route);
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    if ("fonts" in document) await document.fonts.ready;
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  });
};

const capture = async (page: Page, testInfo: TestInfo, name: string, focus?: Locator) => {
  if (focus) {
    await focus.scrollIntoViewIfNeeded();
    await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  }
  const fileName = `${testInfo.project.name}-${name}.png`;
  await page.screenshot({ path: testInfo.outputPath(fileName), fullPage: false, animations: "disabled" });
};

test("captures the finished product-led homepage and guided start", async ({ page }, testInfo) => {
  await preparePage(page, "/");
  await expect(page.getByRole("heading", { level: 1, name: /Make the next money or healthcare decision clearer/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Help me find where to start/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Open the Benefits Decision System/i })).toBeVisible();
  await expect(page.getByText(/Checkout off|prelaunch|planned early-access|not available for purchase yet/i)).toHaveCount(0);
  await capture(page, testInfo, "homepage");
});

test("captures the free searchable Tools directory", async ({ page }, testInfo) => {
  await preparePage(page, "/tools");
  await expect(page.getByRole("heading", { level: 1, name: /Use every public tool on this page without paying/i })).toBeVisible();
  const directoryStatus = page.getByText(/Showing .* tools for all decisions/i);
  await expect(directoryStatus).toBeVisible();
  await expect(page.getByText(/Preview only|checkout off|not available for purchase yet/i)).toHaveCount(0);
  await capture(page, testInfo, "tools-directory", directoryStatus);
});

test("captures the healthcare-worker flagship as an available system", async ({ page }, testInfo) => {
  await preparePage(page, "/healthcare-workers#benefits-decision-system");
  await expect(page.getByRole("heading", { level: 1, name: /Understand your benefits/i })).toBeVisible();
  const systemHeading = page.getByRole("heading", { name: "Healthcare Worker Benefits Decision System", exact: true });
  await expect(systemHeading).toBeVisible();
  await expect(page.locator("#benefits-decision-system").getByText("Available now · free", { exact: true })).toBeVisible();
  await expect(page.locator("#benefits-decision-system").getByText(/Planned early-access|Checkout and paid access|Working public pilot/i)).toHaveCount(0);
  await capture(page, testInfo, "benefits-decision-system", systemHeading);
});

test("captures the finished Benefits Decision System route", async ({ page }, testInfo) => {
  await preparePage(page, "/products/healthcare-worker-benefits-decision-system");
  await expect(page.getByRole("heading", { level: 1, name: /Work through open enrollment one decision at a time/i })).toBeVisible();
  const workflowHeading = page.getByRole("heading", { name: "Complete an open-enrollment election plan", exact: true });
  await expect(workflowHeading).toBeVisible();
  await expect(page.getByText(/\$29|early-access|prelaunch|Working end-to-end pilot|worth \$29/i)).toHaveCount(0);
  await capture(page, testInfo, "benefits-decision-system-route", workflowHeading);
});

test("captures Hospital Guide before and after an immediate need is selected", async ({ page }, testInfo) => {
  await preparePage(page, "/patients-families/hospital-guide");
  const selectorHeading = page.getByRole("heading", { name: /Start with the operational problem/i });
  await expect(page.getByRole("heading", { level: 1, name: /What do you need help with right now/i })).toBeVisible();
  await capture(page, testInfo, "hospital-guide-mode-selector", selectorHeading);

  await page.getByRole("button", { name: /Leaving the hospital/i }).click();
  const resultAnswer = page.getByText(/Before leaving, identify the final written plan/i);
  await expect(resultAnswer).toBeVisible();
  await capture(page, testInfo, "hospital-guide-result", resultAnswer);
});

test("captures a standardized answer-first decision result", async ({ page }, testInfo) => {
  await preparePage(page, "/tools/roth-vs-traditional-decision-helper");
  await page.getByRole("button", { name: /Compare contribution factors/i }).click();
  const resultLabel = page.getByText(/Your result/i).first();
  await expect(resultLabel).toBeVisible();
  await expect(page.getByText(/Your next two actions/i).first()).toBeVisible();
  await capture(page, testInfo, "answer-first-result", resultLabel);
});

test("captures the verified founder and trust presentation", async ({ page }, testInfo) => {
  await preparePage(page, "/about");
  await expect(page.getByRole("heading", { level: 1, name: /Healthcare money explained by someone who sees the confusion up close/i })).toBeVisible();
  await expect(page.getByText(/Andrew Ciccarelli, RN, BSN/).first()).toBeVisible();
  await capture(page, testInfo, "about-founder-trust");
});