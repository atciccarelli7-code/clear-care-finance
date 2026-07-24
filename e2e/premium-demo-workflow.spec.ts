import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("caf-privacy-consent-v1", "necessary");
    if (!sessionStorage.getItem("caf-premium-test-initialized")) {
      localStorage.removeItem("caf-premium-development-demo-workspace");
      sessionStorage.setItem("caf-premium-test-initialized", "true");
    }
    window.print = () => { document.documentElement.dataset.printIntent = "true"; };
  });
});

test("development demo completes all modules, saves progress, and prints the brief", async ({ page }) => {
  await page.goto("/app/benefits-decision");
  await expect(page.getByText(/Development-only demo/i).first()).toBeVisible();
  await page.getByRole("link", { name: "New decision" }).click();
  await page.getByLabel("Workspace title").fill("Demo benefits comparison");
  await page.getByRole("button", { name: "Create workspace" }).click();

  await page.getByLabel("Current role or offer").fill("Current option");
  await page.getByLabel("Alternative role or offer").fill("Alternative option");
  await page.getByLabel("Decision deadline").fill("2026-08-31");
  await page.getByRole("button", { name: /Mark module complete/i }).click();

  await expect(page.getByRole("heading", { name: "Compare compensation" })).toBeVisible();
  await page.getByLabel("Pay type").nth(0).selectOption("hourly");
  await page.getByLabel("Pay type").nth(1).selectOption("salary");
  await page.getByLabel("Hourly rate or annual salary").nth(0).fill("42");
  await page.getByLabel("Hourly rate or annual salary").nth(1).fill("90000");
  await page.getByLabel("Expected annual regular hours").nth(0).fill("2000");
  await page.getByRole("button", { name: /Mark module complete/i }).click();

  for (const heading of [
    "Value workplace benefits",
    "Stress-test health-plan exposure",
    "Evaluate retirement benefits",
    "Measure schedule and career tradeoffs",
    "Build the verification list",
  ]) {
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    await page.getByRole("button", { name: /Mark module complete/i }).click();
  }

  await expect(page.getByRole("heading", { name: "Generate the decision brief" })).toBeVisible();
  await page.getByLabel("Final user-selected decision").fill("Proceed with the alternative after written verification.");
  await page.getByLabel("Decision date").fill("2026-07-24");
  await page.getByRole("button", { name: /Mark module complete/i }).click();
  await expect(page.getByText("100% complete")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Demo benefits comparison" }).first()).toBeVisible();
  await expect(page.locator("p").filter({ hasText: "Proceed with the alternative after written verification." })).toBeVisible();

  await page.getByRole("button", { name: "Print decision brief" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-print-intent", "true");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("caf-premium-development-demo-workspace") || "null")?.progressPercent)).toBe(100);

  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const severe = accessibility.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  expect(severe, severe.map((item) => `${item.id}: ${item.help}`).join("\n")).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test("development demo persists locally and mobile module navigation works", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/app/benefits-decision/new");
  await page.getByRole("button", { name: "Create workspace" }).click();
  await page.getByLabel("Current role or offer").fill("Option A");
  await page.getByLabel("Alternative role or offer").fill("Option B");
  await page.getByLabel("Decision deadline").fill("2026-09-01");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.reload();
  await expect(page.getByLabel("Current role or offer")).toHaveValue("Option A");
  await page.getByRole("button", { name: /Module 1 of 8/i }).click();
  await expect(page.getByRole("button", { name: /Compare compensation/i })).toBeVisible();
});
