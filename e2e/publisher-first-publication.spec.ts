import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const founderArticles = [
  {
    slug: "20-dollar-tylenol-hospital-prices",
    title: "The $20 Tylenol Isn’t Really About the Tylenol",
    systemMap: "One clinical encounter, several money numbers",
    systemLens: "Who controls each layer of the hospital price?",
  },
  {
    slug: "what-nonprofit-hospital-actually-means",
    title: "What a Nonprofit Hospital Actually Is (and Isn’t)",
    systemMap: "What happens when a nonprofit hospital earns more than it spends",
    systemLens: "The nonprofit hospital bargain",
  },
  {
    slug: "why-hospitals-care-about-length-of-stay",
    title: "Why Hospitals Care So Much About Length of Stay",
    systemMap: "How one delayed discharge can reach the emergency department",
    systemLens: "Why length of stay becomes everyone’s problem",
  },
  {
    slug: "why-just-send-them-to-rehab-is-not-simple",
    title: "Why “Just Send Them to Rehab” Is Not That Simple",
    systemMap: "Recommendation to transfer: the steps between hospital and rehab",
    systemLens: "Why nobody can promise rehab alone",
  },
] as const;

const assertHealthyPage = async (page: Page) => {
  await expect(page.locator("h1")).toHaveCount(1);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);

  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(accessibility.violations.filter((item) => item.impact === "serious" || item.impact === "critical")).toEqual([]);
};

test.beforeEach(async ({ page }) => {
  await page.route("**/_vercel/**", async (route) => {
    const isScript = new URL(route.request().url()).pathname.endsWith(".js");
    await route.fulfill(isScript
      ? { status: 200, contentType: "application/javascript", body: "" }
      : { status: 204, body: "" });
  });
  await page.route("**/pagead2.googlesyndication.com/**", (route) => route.fulfill({ status: 200, contentType: "application/javascript", body: "" }));
  await page.route("**/googletagmanager.com/**", (route) => route.fulfill({ status: 200, contentType: "application/javascript", body: "" }));
  await page.addInitScript(() => localStorage.setItem("caf-privacy-consent-v1", "necessary"));
});

test("makes the publication the public front door while keeping tools subordinate and reachable", async ({ page }, testInfo) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: "Understand the money and machinery behind American healthcare." })).toBeVisible();
  await expect(page.getByRole("link", { name: /Read the publication/i })).toHaveAttribute("href", "/articles");
  await expect(page.getByRole("heading", { name: /Healthcare makes more sense when you can see who pays/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "The same event looks different from every seat." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "When the explanation needs a next step." })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Written from nursing and care-transition experience/i })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://communityacquiredfinance.com/");

  for (const article of founderArticles) {
    await expect(page.getByRole("link", { name: new RegExp(article.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) }).first()).toHaveAttribute(
      "href",
      `/articles/${article.slug}`,
    );
  }

  if (testInfo.project.name === "mobile-chromium") {
    await page.getByRole("button", { name: "Open menu" }).click();
    const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
    await expect(mobileNav.getByRole("link", { name: /Read CAF/ })).toBeFocused();
    await expect(mobileNav.getByRole("link", { name: /Free tools/ })).toHaveAttribute("href", "/tools");
  }

  await assertHealthyPage(page);
  expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  expect(pageErrors, pageErrors.join("\n")).toEqual([]);
});

test("makes the article library discoverable and searchable", async ({ page }) => {
  await page.goto("/articles", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: /Healthcare finance and the business of care/i })).toBeVisible();
  await expect(page.getByText("75 RN-led, source-backed articles", { exact: false })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Inside hospitals: prices, margins, capacity/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Questions Google is already testing CAF against" })).toBeVisible();

  await page.getByRole("textbox", { name: "Search the CAF article library" }).fill("Tylenol");
  await expect(page.getByRole("link", { name: /The \$20 Tylenol Isn’t Really About the Tylenol/i }).last()).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://communityacquiredfinance.com/articles");
  await assertHealthyPage(page);
});

for (const article of founderArticles) {
  test(`publishes a complete founder-derived article: ${article.slug}`, async ({ page }) => {
    const applicationFailures: string[] = [];
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("response", (response) => {
      const url = new URL(response.url());
      if (url.origin === "http://127.0.0.1:4173" && response.status() >= 400) applicationFailures.push(`${response.status()} ${url.pathname}`);
    });

    await page.goto(`/articles/${article.slug}`, { waitUntil: "networkidle" });

    await expect(page.getByRole("heading", { level: 1, name: article.title })).toBeVisible();
    await expect(page.getByRole("heading", { name: "60-second summary" })).toBeVisible();
    await expect(page.getByRole("heading", { name: article.systemMap })).toBeVisible();
    await expect(page.getByRole("heading", { name: article.systemLens })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Key takeaway" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sources" })).toBeVisible();
    await expect(page.getByLabel("Article authorship and review")).toContainText("Andrew Ciccarelli, BSN, RN");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://communityacquiredfinance.com/articles/${article.slug}`,
    );

    const schemaTypes = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) => scripts.map((script) => script.textContent ?? "").join("\n"));
    expect(schemaTypes).toContain('"@type":"Article"');
    expect(schemaTypes).toContain('"@type":"BreadcrumbList"');

    await assertHealthyPage(page);
    expect(applicationFailures, applicationFailures.join("\n")).toEqual([]);
    expect(pageErrors, pageErrors.join("\n")).toEqual([]);
  });
}

test("keeps a legacy calculator and the canonical hospital-to-home utility working", async ({ page }) => {
  await page.goto("/tools/403b-paycheck-calculator", { waitUntil: "networkidle" });
  await expect(page.locator("h1")).toContainText(/403\(b\)/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://communityacquiredfinance.com/tools/403b-paycheck-calculator");
  await assertHealthyPage(page);

  await page.goto("/insurance/hospital-discharge-coverage", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "Hospital-to-Home Coverage & Cost Navigator" })).toBeVisible();
  await expect(page.getByText(/Do not enter names, diagnoses, member IDs/i)).toBeVisible();
  await assertHealthyPage(page);
});
