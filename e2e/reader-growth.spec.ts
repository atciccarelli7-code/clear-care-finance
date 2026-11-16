import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("search landing to second founder article to consented newsletter signup", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  let submitted: Record<string, unknown> | undefined;
  await page.route("**/api/send", async (route) => {
    submitted = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, saved: true, emailDelivered: false }) });
  });
  await page.goto("/articles/20-dollar-tylenol-hospital-prices");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("The $20 Tylenol Isn’t Really About the Tylenol");
  const series = page.locator("section").filter({ has: page.getByRole("heading", { name: "Hospital money and patient flow", exact: true }) });
  await series.getByRole("link", { name: /What a Nonprofit Hospital Actually/ }).click();
  await expect(page).toHaveURL(/\/articles\/what-nonprofit-hospital-actually-means$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://communityacquiredfinance.com/articles/what-nonprofit-hospital-actually-means");
  const signup = page.getByRole("region", { name: "Keep following the money behind healthcare" });
  await signup.getByLabel("Email", { exact: true }).fill("reader@example.com");
  await signup.getByRole("button", { name: "Join the monthly list" }).click();
  await expect(signup.getByRole("status")).toContainText("Check the consent box");
  expect(submitted).toBeUndefined();
  await signup.getByRole("checkbox").check();
  await signup.getByRole("button", { name: "Join the monthly list" }).click();
  await expect(signup.getByRole("status")).toContainText("Welcome email delivery is still being finalized");
  expect(submitted).toMatchObject({ source: "article-what-nonprofit-hospital-actually-means", consent: true, type: "newsletter" });
  expect(errors).toEqual([]);
});

test("newsletter examples, author, metadata, and accessible signup", async ({ page }) => {
  await page.goto("/newsletter");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Understand the machinery behind healthcare, once a month.");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://communityacquiredfinance.com/newsletter");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /One healthcare-system explanation each month from Andrew/);
  await expect(page.locator("#example-articles a")).toHaveCount(4);
  await expect(page.getByLabel("Email", { exact: true })).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Meet the author" })).toHaveAttribute("href", "/about");
  await expect(page.locator("#medical-bill-resources")).toHaveCount(0);
  const accessibility = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(accessibility.violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
