import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { EDITORIAL_COVERS } from "../src/data/editorialCovers";

test.beforeEach(async ({ page }) => {
  await page.route("https://fonts.googleapis.com/**", route => route.fulfill({ status: 200, contentType: "text/css", body: "" }));
  await page.addInitScript(() => localStorage.setItem("caf-privacy-consent-v1", "necessary"));
});

test("publication leads into reporting and existing visual explainers", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.screenshot({ path: testInfo.outputPath("homepage.png"), fullPage: false });
  await expect(page.locator("h1")).toContainText("money and machinery");
  const lead = page.locator(".editorial-story-lead");
  const accessibility = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(accessibility.violations).toEqual([]);
  await expect(lead.locator("img")).toBeVisible();
  expect(await lead.locator("img").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  await lead.click();
  await expect(page).toHaveURL(/why-hospitals-become-the-systems-shock-absorber/);
  await page.goBack();
  await page.getByRole("link", { name: "Explore the visual explainers", exact: true }).click();
  await expect(page.locator("#visual-explainers-heading")).toBeVisible({ timeout: 20_000 });
});

test("article navigation resets social previews and preserves a working utility", async ({ page }) => {
  await page.goto("/articles/20-dollar-tylenol-hospital-prices");
  await page.getByRole("link", { name: "Open tool", exact: true }).click();
  await expect(page).toHaveURL(/tools\/eob-to-bill-match-checker/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", "https://communityacquiredfinance.com/icon-512.png");
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary");
  await expect(page.locator("main h1")).toBeVisible();
  expect(await page.locator("main input").count()).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const result = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(result.violations).toEqual([]);
});

for (const [slug, cover] of Object.entries(EDITORIAL_COVERS)) {
  test(`${slug}: responsive artwork, metadata, and accessible reading`, async ({ page, request }) => {
    const response = await request.get(`/articles/${slug}`);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain(`https://communityacquiredfinance.com/images/editorial/${cover.file}-og.jpg`);
    expect(html).toContain('content="summary_large_image"');
    await page.goto(`/articles/${slug}`);
    const hero = page.locator("figure").filter({ has: page.getByAltText(cover.alt, { exact: true }) });
    await expect(hero).toBeVisible();
    const img = hero.locator("img");
    expect(await img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    await expect(hero.locator("figcaption")).toContainText("Conceptual");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://communityacquiredfinance.com/articles/${slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const results = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations).toEqual([]);
    await page.setViewportSize({ width: 320, height: 800 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const social = await request.get(`/images/editorial/${cover.file}-og.jpg`);
    expect(social.status()).toBe(200);
    expect(social.headers()["content-type"]).toContain("image/jpeg");
  });
}
