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

test("captures the simplified homepage and guided start", async ({ page }, testInfo) => {
  await preparePage(page, "/");
  await expect(page.getByRole("heading", { level: 1, name: /Make the next money or healthcare decision clearer/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Help me choose where to start/i })).toBeVisible();
  await capture(page, testInfo, "homepage");
});

test("captures Tools in choose-first and directory states", async ({ page }, testInfo) => {
  await preparePage(page, "/tools");
  const chooserHeading = page.getByRole("heading", { name: /Start with the decision, not the catalog/i });
  await expect(page.getByRole("heading", { level: 1, name: /Choose a guided answer or browse the full tool library/i })).toBeVisible();
  await capture(page, testInfo, "tools-choose-first", chooserHeading);

  await page.getByRole("button", { name: /Browse all tools/i }).click();
  const directoryStatus = page.getByText(/Showing .* tools for all decisions/i);
  await expect(directoryStatus).toBeVisible();
  await capture(page, testInfo, "tools-directory-open", directoryStatus);
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
  await preparePage(page, "/tools/medical-appointment-cost-preparation");
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
  const resultLabel = page.getByText(/Your result/i).first();
  await expect(resultLabel).toBeVisible();
  await expect(page.getByText(/Your next three actions/i).first()).toBeVisible();
  await capture(page, testInfo, "answer-first-result", resultLabel);
});

test("captures the verified founder and trust presentation", async ({ page }, testInfo) => {
  await preparePage(page, "/about");
  await expect(page.getByRole("heading", { level: 1, name: /Healthcare money explained by someone who sees the confusion up close/i })).toBeVisible();
  await expect(page.getByText(/Andrew Ciccarelli, RN, BSN/).first()).toBeVisible();
  await capture(page, testInfo, "about-founder-trust");
});
