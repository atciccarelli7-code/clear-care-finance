import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const founderArticles = [
  {
    slug: "how-a-hospital-actually-makes-money",
    title: "How a Hospital Actually Makes Money",
    systemMap: "How one inpatient stay turns into hospital economics",
    systemLens: "Who controls the money around a hospital stay?",
  },
  {
    slug: "patient-in-the-bed-and-patient-in-the-chart",
    title: "The Patient in the Bed and the Patient in the Chart",
    systemMap: "How the patient becomes a decision another organization can act on",
    systemLens: "What actually shapes the downstream decision?",
  },
  {
    slug: "what-happens-while-hospital-is-waiting-on-insurance",
    title: "What Happens While the Hospital Is “Waiting on Insurance”?",
    systemMap: "The discharge chain that four words can hide",
    systemLens: "Who controls the wait, and who feels it?",
  },
  {
    slug: "medically-ready-is-not-the-same-as-ready-for-home",
    title: "Medically Ready Is Not the Same as Ready for Home",
    systemMap: "What changes when the hospital stops doing the work around you",
    systemLens: "What medical readiness does—and does not—answer",
  },
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
  {
    slug: "why-hospitals-become-the-systems-shock-absorber",
    title: "Why the Hospital Becomes the System’s Shock Absorber",
    systemMap: "How a problem moves until somebody can hold it",
    systemLens: "Who owns a problem that crosses organizational lines?",
  },
  {
    slug: "home-with-family-is-not-a-free-care-plan",
    title: "“Home With Family” Is Not a Free Care Plan",
    systemMap: "Where the work goes when the destination is home",
    systemLens: "Who pays when care moves home?",
  },
] as const;

const homepageFeaturedSlugs = new Set([
  "patient-in-the-bed-and-patient-in-the-chart",
  "what-happens-while-hospital-is-waiting-on-insurance",
  "medically-ready-is-not-the-same-as-ready-for-home",
  "why-hospitals-become-the-systems-shock-absorber",
  "home-with-family-is-not-a-free-care-plan",
  "why-just-send-them-to-rehab-is-not-simple",
]);

const homepageFeaturedArticles = founderArticles.filter((article) => homepageFeaturedSlugs.has(article.slug));

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

  expect(homepageFeaturedArticles).toHaveLength(6);
  for (const article of homepageFeaturedArticles) {
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
  await expect(page.getByText("81 RN-led, source-backed articles", { exact: false })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Inside hospitals: prices, capacity, classification, and the work after discharge/i }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "The questions CAF helps you understand" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Explore the core library" })).toBeVisible();
  await expect(page.getByText(/Questions Google is already testing CAF against/i)).toHaveCount(0);
  await expect(page.getByText(/Google users are already asking/i)).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Hospital economics & operations · \d+ articles/i })).toBeVisible();
  await expect(page.getByRole("button", { name: "Care transitions & discharge" })).toHaveAttribute("aria-pressed", "false");

  await page.getByRole("button", { name: "Care transitions & discharge" }).click();
  await expect(page.getByRole("button", { name: "Care transitions & discharge" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("link", { name: /Safe Hospital Discharge and the First 72 Hours at Home/i })).toBeVisible();

  await page.getByText("Additional practical guides (11)").click();
  await expect(page.getByRole("link", { name: /Can You Live Off Dividends/i })).toBeVisible();

  await page.getByRole("textbox", { name: "Search the CAF article library" }).fill("Tylenol");
  await page.getByRole("button", { name: "All core articles" }).click();
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

test("upgrades observation status in place and keeps the care-transition route ad-free", async ({ page }) => {
  await page.goto("/articles/observation-vs-inpatient-status", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: /Observation vs\. Inpatient Status/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "How one hospital stay gets two different descriptions" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Why the status feels invisible from the bed" })).toBeVisible();
  await expect(page.getByText("The MOON is an explanation, not a universal appeal ticket", { exact: false })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://communityacquiredfinance.com/articles/observation-vs-inpatient-status",
  );
  await expect(page.locator('script[src*="pagead2.googlesyndication.com"]')).toHaveCount(0);
  await assertHealthyPage(page);
});

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
