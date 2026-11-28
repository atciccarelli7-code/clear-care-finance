import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

test("the tool directory routes readers by the decision they face", async ({ page }) => {
  await page.goto("/tools");
  const paths = page.getByRole("region", { name: "Start with what you need to resolve" });
  await expect(paths.getByRole("link", { name: "Look up hospital financial assistance" })).toHaveAttribute("href", "/medical-bills/financial-assistance");
  await expect(paths.getByRole("link", { name: "Work through the discharge coverage guide" })).toHaveAttribute("href", "/insurance/hospital-discharge-coverage");
  await paths.getByRole("link", { name: "Compare your bill with your EOB" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "EOB-to-Bill Match Checker" })).toBeVisible();
});

test("the glossary explains the allowed amount and leads to a worked hospital bill", async ({ page }) => {
  await page.goto("/glossary");
  await page.getByRole("button", { name: "Insurance", exact: true }).click();
  await expect(page.getByRole("button", { name: "Insurance", exact: true })).toHaveAttribute("aria-pressed", "true");
  const search = page.getByRole("textbox", { name: "Search glossary terms" });
  await search.fill("no matching term");
  await expect(page.getByRole("status").filter({ hasText: "No terms match that search." })).toBeVisible();
  await page.getByRole("button", { name: "Clear search and filters" }).click();
  await expect(search).toBeEmpty();
  await search.fill("allowed amount");
  await expect(page.getByRole("heading", { name: "Allowed amount", exact: true })).toBeVisible();
  await expect(page.getByText(/the insurer pays \$240/)).toBeVisible();
  const accessibility = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(accessibility.violations.map(({ id }) => id)).toEqual([]);
  await page.getByRole("link", { name: "Explore a worked hospital bill" }).click();
  await expect(page).toHaveURL(/\/hospital-bill-anatomy$/);
});

test("selected calculators show a result, its assumptions, and where to go next", async ({ page }) => {
  const cases = [
    ["health-insurance-visit-cost-calculator", /\$260/, "Compare your bill with your EOB"],
    ["student-loan-payment-calculator", /\$10,379/, "Review your student loan options"],
    ["hospital-cafe-savings-calculator", /\$520/, "Read the hospital cafe spending guide"],
  ] as const;
  for (const [slug, result, next] of cases) {
    await page.goto(`/tools/${slug}`);
    const example = page.locator('section[aria-labelledby="worked-example-heading"]');
    await expect(example).toContainText(result);
    await expect(example.getByRole("link", { name: next })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  }
});

test("readers can match a bill to its claim and find the hospital's assistance policy", async ({ page }) => {
  await page.goto("/topics/patient-medical-costs");
  await expect(page.getByRole("heading", { name: "One visit, two statements. Which charge should you check?" })).toBeVisible();
  await expect(page.getByText(/explain the \$50 difference/)).toBeVisible();
  const accessibility = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(accessibility.violations.map(({ id }) => id)).toEqual([]);
  await page.getByRole("link", { name: "Compare an EOB with a bill" }).click();
  await expect(page).toHaveURL(/\/tools\/eob-to-bill-match-checker$/);

  await page.goto("/hospital-financial-assistance/north-carolina");
  const novant = page.locator('main a[href="/hospital-financial-assistance/novant-health-north-carolina"]');
  await expect(novant).toContainText("Insured: 200% FPG; uninsured: 300% FPG");
  await novant.click();
  await expect(page.getByRole("heading", { name: "Does this policy cover the bill in front of you?" })).toBeVisible();
});

test("insurance readers reach the bill checker directly and old tool bookmarks still resolve", async ({ page }) => {
  await page.goto("/insurance");
  await page.getByRole("link", { name: /EOB-to-bill checker/i }).first().click();
  await expect(page).toHaveURL(/\/tools\/eob-to-bill-match-checker$/);
  await expect(page.getByRole("heading", { name: "EOB-to-Bill Match Checker", exact: true })).toBeVisible();

  await page.goto("/tools#eob-bill-match");
  const card = page.locator("#tool-eob-to-bill-match-checker");
  await expect(card).toHaveClass(/ring-2/);
  await expect(card).toBeInViewport();
  await expect(card.getByRole("link", { name: /Open EOB-to-Bill Match Checker/i })).toHaveAttribute("href", "/tools/eob-to-bill-match-checker");
});

test("the Medigap comparison explains switching and the two enrollment decisions", async ({ page }) => {
  await page.goto("/insurance/medicare-advantage-vs-medigap");
  await expect(page.getByRole("heading", { name: "Check two separate enrollment decisions" })).toBeVisible();
  await expect(page.getByText(/October 15 through December 7/)).toBeVisible();
  await expect(page.getByText(/federal six-month Medigap window/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Get free SHIP counseling" })).toHaveAttribute("href", "https://www.medicare.gov/talk-to-someone");
  await expect(page.getByRole("region", { name: "Plan comparison table" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
});

test("home health readers can plan for gaps between visits", async ({ page }) => {
  await page.goto("/articles/home-health-after-discharge", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Who will be there at 10 p.m.?" })).toBeVisible();
  await expect(page.getByText(/hypothetical week with ten hours of visits/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Options to check in the Charlotte area" })).toBeVisible();
  await page.getByRole("link", { name: /plan the transition/i }).click();
  await expect(page).toHaveURL(/\/insurance\/hospital-discharge-coverage$/);
});

test("hospital economics explains the bill, the extra day, and who bears the cost", async ({ page }) => {
  await page.goto("/articles/20-dollar-tylenol-hospital-prices");
  await expect(page.getByText(/try and learn it and teach it rather than just stay angry/)).toBeVisible();
  await expect(page.getByText(/the plan assigns \$30 to you/)).toBeVisible();
  await expect(page.locator('a[href="/tools/eob-to-bill-match-checker"]').first()).toBeVisible();

  await page.goto("/articles/what-nonprofit-hospital-actually-means");
  await expect(page.getByText(/when a department switches to a lower-priced supply/)).toBeVisible();

  await page.goto("/articles/why-hospitals-care-about-length-of-stay", { waitUntil: "networkidle" });
  await expect(page.getByText(/the hospital still has \$2,000 left on the case/)).toBeVisible();
  await expect(page.getByText(/A covered readmission can still be paid/)).toBeVisible();
  await page.getByRole("link", { name: /if the team is waiting on insurance/i }).click();
  await expect(page).toHaveURL(/\/articles\/what-happens-while-hospital-is-waiting-on-insurance$/);
});

test("legacy guides answer distinct decisions and link to the right next step", async ({ page }) => {
  const examples = [
    ["healthcare-worker-money-map", "Build the pay-period plan from a check without overtime"],
    ["can-you-live-off-dividends-passive-income-guide", "Could dividends replace one pickup shift a month?"],
    ["short-term-rehab-after-hospital", "Compare two replies to the same referral"],
    ["discharge-coverage-guide", "A home discharge with two separate coverage checks"],
  ];
  for (const [slug, heading] of examples) {
    await page.goto(`/articles/${slug}`);
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
  }
  await expect(page.getByRole("link", { name: /start with the discharge plan/i }))
    .toHaveAttribute("href", "/insurance/hospital-discharge-coverage");

  await page.goto("/articles/money-stress-after-hard-shift", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Payday is Friday, but the bill is due Wednesday" })).toBeVisible();
  await expect(page.getByText(/\$25 timing gap/)).toBeVisible();
  await page.getByRole("link", { name: /plan your next shift/i }).click();
  await expect(page).toHaveURL(/\/articles\/burnout-overspending-overeating$/);
});

const founderArticles = [
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

const homepageFeaturedArticles = [
  ...founderArticles.filter(({ slug }) => [
    "patient-in-the-bed-and-patient-in-the-chart",
    "what-happens-while-hospital-is-waiting-on-insurance",
    "why-hospitals-become-the-systems-shock-absorber",
    "home-with-family-is-not-a-free-care-plan",
  ].includes(slug)),
  { slug: "20-dollar-tylenol-hospital-prices", title: "The $20 Tylenol Isn’t Really About the Tylenol" },
  { slug: "home-health-after-discharge", title: "Home Health After Discharge" },
];
 
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
  await page.route("https://fonts.googleapis.com/**", (route) =>
    route.fulfill({ status: 200, contentType: "text/css", body: "" }),
  );
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
  await expect(page.getByRole("heading", { name: "Featured reporting and explainers", exact: true })).toBeVisible();
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

  await expect(page.getByRole("heading", { level: 1, name: "CAF Article Library" })).toBeVisible();
  const search = page.getByRole("textbox", { name: "Search the CAF article library" });
  await expect(search).toBeInViewport();
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

  await page.getByRole("button", { name: "All core articles" }).click();
  await page.getByText("Additional practical guides (11)").click();
  await expect(page.getByRole("link", { name: /Can You Live Off Dividends/i })).toBeVisible();

  await search.fill("home health");
  await expect(page.locator("main a[href^='/articles/']").first()).toHaveAttribute("href", "/articles/home-health-after-discharge");
  await search.fill("Tylenol");
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
    if (article.slug === "patient-in-the-bed-and-patient-in-the-chart") {
      const opening = page.getByRole("heading", { name: "There are really two versions of every hospitalized patient" });
      await expect(opening).toBeInViewport();
      await expect(page.getByRole("link", { name: /^Reviewed/ })).toHaveAttribute("href", "#article-review");
      expect(await page.getByRole("heading", { name: article.systemMap }).evaluate((heading) => heading.getBoundingClientRect().top))
        .toBeGreaterThan((await opening.boundingBox())!.y);
    } else {
      await expect(page.getByRole("heading", { name: "60-second summary" })).toBeVisible();
    }
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

test("takes a mismatched bill from the article to the follow-up dashboard", async ({ page }) => {
  await page.goto("/articles/why-one-hospital-visit-can-create-multiple-bills");
  await expect(page.getByRole("heading", { name: "Worked example: Two bills and two EOBs" })).toBeVisible();
  await expect(page.getByText(/ask the group’s billing office about the \$360 difference/)).toBeVisible();
  await page.getByRole("link", { name: /Start reviewing your bills/ }).click();
  await expect(page).toHaveURL(/#document-router$/);
  await page.getByRole("button", { name: /Documents do not match/ }).click();
  await page.getByRole("link", { name: "Compare the documents" }).click();
  await page.getByRole("link", { name: /Track follow-up/ }).click();
  await expect(page).toHaveURL(/#call-tracker$/);
  await expect(page.locator("#call-tracker").getByRole("heading", { name: "Medical Bill Case Dashboard" })).toBeInViewport();
});
