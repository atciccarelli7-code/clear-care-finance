import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("article reading preserves accessible and printed trust information", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/articles/why-hospitals-care-about-length-of-stay");
  const author = page.getByLabel("Article authorship and review");
  await expect(author.getByRole("link", { name: "Andrew Ciccarelli, BSN, RN" })).toBeVisible();
  await expect(page.getByLabel("Content review and freshness information").getByText("Last reviewed", { exact: false })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("article-after.png") });
  const limitations = author.getByText(/RN perspective shaped by/);
  await expect(limitations).not.toBeVisible();
  await author.locator("summary").press("Enter");
  await expect(limitations).toBeVisible();
  await expect(author.getByText(/no separate credentialed professional reviewer/)).toBeVisible();
  await author.locator("summary").press("Enter");
  await page.emulateMedia({ media: "print" });
  await expect(limitations).toBeVisible();
  await expect(page.getByText("Review scope:", { exact: true })).toBeVisible();
  await page.emulateMedia({ media: "screen" });
  await expect(limitations).not.toBeVisible();
  expect((await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
});

test("archive jump exposes working search and the header stays opaque", async ({ page }, testInfo) => {
  await page.goto("/articles");
  await page.getByRole("link", { name: "Search or browse by subject" }).click();
  const search = page.getByRole("textbox", { name: "Search the CAF article library" });
  await expect(search).toBeInViewport();
  await search.fill("allowed amount");
  await expect(page.locator('a[href="/articles/allowed-amount-medical-bills"]').last()).toBeVisible();
  await expect(page.locator("header")).toHaveCSS("background-color", "rgb(251, 251, 248)");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("archive-search-after.png") });
});

test("mobile menu has a usable target and a direct article destination", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-specific navigation");
  await page.goto("/articles/20-dollar-tylenol-hospital-prices");
  const toggle = page.getByRole("button", { name: "Open menu", exact: true });
  const box = await toggle.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);
  await toggle.click();
  await expect(page.getByRole("button", { name: "Close menu", exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("mobile-menu-after.png") });
  await page.getByRole("button", { name: "Close menu", exact: true }).click();
  await page.getByRole("link", { name: "Open Articles", exact: true }).click();
  await expect(page).toHaveURL(/\/articles$/);
});
