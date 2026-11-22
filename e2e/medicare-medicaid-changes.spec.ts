import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("changes hub supports dated reading, filtering, archives and care transitions", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/medicare-medicaid-changes");
  await page.getByRole("button", { name: "Necessary only", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Medicare & Medicaid Changes" })).toBeVisible();
  await expect(page.getByText("Last verified: November 22, 2026", { exact: true }).first()).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://communityacquiredfinance.com/medicare-medicaid-changes");
  expect(await page.locator("#caf-route-aware-adsense").count()).toBe(0);
  await page.getByLabel("Program and scope").selectOption("North Carolina Medicaid");
  await page.getByLabel("Policy status").selectOption("Effective");
  await expect(page.getByRole("status")).toHaveText("1 current timeline entry; 0 archived entries.");
  await expect(page.locator("#noncitizen-nc")).toBeVisible();
  await page.getByLabel("Search changes").fill("no-such-topic");
  await expect(page.getByText("No changes match.", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.getByLabel("Search changes").focus();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Program and scope")).toBeFocused();
  await page.getByLabel("Search changes").fill("$615");
  await expect(page.locator('[id="2026-part-d-archive"]')).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.getByRole("navigation", { name: "Changes timeline sections" }).getByRole("link", { name: "Later and proposed" }).click();
  await expect(page).toHaveURL(/#later-changes$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const audit = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(audit.violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("hub.png"), fullPage: true });
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; window.scrollTo(0, 0); });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.screenshot({ path: testInfo.outputPath("hub-top.png") });
  if (testInfo.project.name === "mobile-chromium") {
    await page.setViewportSize({ width: 320, height: 700 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.goto("/articles/medicare-medicaid-changes-january-2027");
  await page.getByRole("link", { name: "Open Medicare & Medicaid Changes", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Medicare & Medicaid Changes" })).toBeVisible();
  await page.goto("/medicare-care-costs");
  await page.getByRole("link", { name: "Read the verified changes timeline and archive" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Medicare & Medicaid Changes" })).toBeVisible();
  expect(errors).toEqual([]);
});
