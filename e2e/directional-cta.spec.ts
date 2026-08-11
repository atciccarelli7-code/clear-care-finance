import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type TestInfo } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

mkdirSync("artifacts/directional-cta", { recursive: true });

const hydrationErrors = new WeakMap<Page, string[]>();

const expectAccessibleAndContained = async (page: Page) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const severe = accessibility.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  expect(severe, severe.map((violation) => `${violation.id}: ${violation.help}`).join("\n")).toEqual([]);
};

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  hydrationErrors.set(page, errors);
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    if (/hydration|server html|minified react error #(418|421|422|425)/i.test(message.text())) errors.push(message.text());
  });
  await page.route("**/_vercel/**", async (intercepted) => {
    const isScript = new URL(intercepted.request().url()).pathname.endsWith(".js");
    await intercepted.fulfill(isScript ? { status: 200, contentType: "application/javascript", body: "" } : { status: 204, body: "" });
  });
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem("caf-privacy-consent-v1", "necessary");
  });
});

test.afterEach(async ({ page }) => {
  expect(hydrationErrors.get(page) ?? [], "React hydration must complete without console errors").toEqual([]);
});

test("total-compensation hero enters the comparison and preserves one subordinate guide", async ({ page }, testInfo) => {
  await page.goto("/tools/healthcare-worker-total-compensation-comparison", { waitUntil: "networkidle" });
  const primary = page.getByRole("link", { name: "Compare the two offers" });
  await expect(primary).toHaveAttribute("href", "#comparison");
  await expect(page.getByRole("link", { name: "Read the comparison guide" })).toHaveCount(1);
  await primary.click();
  await expect(page).toHaveURL(/#comparison$/);
  await expect(page.locator("#comparison")).toBeInViewport();
  await expectAccessibleAndContained(page);

  if (testInfo.project.name === "desktop-chromium") {
    await page.screenshot({ path: path.join("artifacts/directional-cta", "total-compensation-desktop.png"), fullPage: true });
  }
});

test("generic tools use outcome labels and keep related actions subordinate", async ({ page }) => {
  await page.goto("/tools/private-student-loan-payoff-calculator", { waitUntil: "networkidle" });
  await expect(page.getByRole("link", { name: "Compare payoff options" })).toHaveAttribute("href", "#tool");
  await expect(page.getByRole("heading", { name: "Use the result in your next decision" })).toHaveCount(1);
  await expect(page.getByRole("list", { name: "Other useful paths" })).toBeVisible();
  await expectAccessibleAndContained(page);
});

test("priority articles present one dominant direct handoff without a stacked global endcap", async ({ page }, testInfo) => {
  await page.goto("/articles/how-to-read-an-eob", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Turn this explanation into the next decision" })).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Match EOB and bill" })).toHaveAttribute("href", "/tools/eob-to-bill-match-checker");
  await expect(page.getByRole("heading", { name: "From insurance terms to the final bill" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Turn this explanation into a working medical-bill file" })).toHaveCount(0);
  await expectAccessibleAndContained(page);

  if (testInfo.project.name === "mobile-chromium") {
    await page.screenshot({ path: path.join("artifacts/directional-cta", "eob-next-action-mobile.png"), fullPage: true });
  }
});

test("near-winning 403(b) articles expose a direct calculator action in the hero", async ({ page }) => {
  const entries = [
    {
      path: "/articles/how-hospital-403b-matching-works",
      heading: "How Does a Hospital 403(b) Match Work? Examples and Vesting",
      action: "Estimate my contribution and match",
    },
    {
      path: "/articles/how-much-should-a-nurse-put-in-403b-per-paycheck",
      heading: "How Much Should a Nurse Put in a 403(b) Per Paycheck?",
      action: "Estimate my paycheck contribution",
    },
  ];

  for (const entry of entries) {
    await page.goto(entry.path, { waitUntil: "networkidle" });
    const hero = page.locator("section").filter({ has: page.getByRole("heading", { name: entry.heading }) }).first();
    await expect(hero.getByRole("link", { name: entry.action })).toHaveAttribute("href", "/tools/403b-paycheck-calculator");
    await expect(hero.getByText(/min read$/)).toBeVisible();
    await expect(page.getByText("Related tool", { exact: true })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Turn this explanation into the next decision" })).toHaveCount(1);
    await expectAccessibleAndContained(page);
  }
});

test("near-winning financial-assistance entry opens the exact guided finder", async ({ page }) => {
  await page.goto("/articles/check-hospital-financial-assistance-before-paying", { waitUntil: "networkidle" });

  const hero = page.locator("section").filter({
    has: page.getByRole("heading", { name: "Before You Pay a Hospital Bill, Check Financial Assistance" }),
  }).first();
  const primary = hero.getByRole("link", { name: "Check assistance before paying" });
  await expect(primary).toHaveAttribute("href", "/tools/financial-assistance-checklist");
  await expect(page.getByText("Related tool", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Turn this explanation into the next decision" })).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Check assistance steps" })).toHaveAttribute("href", "/tools/financial-assistance-checklist");
  await expect(page.getByRole("heading", { name: "Turn this explanation into a working medical-bill file" })).toHaveCount(0);
  await expectAccessibleAndContained(page);

  await primary.click();
  await expect(page).toHaveURL(/\/tools\/financial-assistance-checklist$/);
  await expect(page.getByRole("heading", { name: "Hospital Financial Assistance & Medical Bill Relief Finder", exact: true }).first()).toBeVisible();
  await expect(page.getByText(/step 1 of 8/i).first()).toBeVisible();
  await expectAccessibleAndContained(page);
});

test("healthcare-worker hub presents one guided flagship and keeps focused actions subordinate", async ({ page }) => {
  await page.goto("/healthcare-workers", { waitUntil: "networkidle" });
  const flagshipSection = page.locator("#benefits-decision-system");
  await expect(page.getByRole("heading", { name: "Healthcare Worker Benefits Decision System", exact: true })).toHaveCount(1);
  await expect(flagshipSection.getByText("Available now · free", { exact: true }).first()).toBeVisible();
  await expect(flagshipSection.getByText(/Complete the public workflow in your browser\. No account, payment, confidential document upload, or cloud storage is required\./)).toBeVisible();
  await expect(page.getByRole("link", { name: /See the guided Decision System/i })).toHaveAttribute("href", "#benefits-decision-system");
  await expect(page.getByRole("link", { name: /Use the open-enrollment guide/i }).first()).toHaveAttribute("href", "/open-enrollment");
  await expect(page.getByText(/single paid flagship|planned early-access|checkout off/i)).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Build the package behind the hourly rate or salary" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Add a healthcare-career transition step to My Plan" })).toHaveCount(0);
  await expectAccessibleAndContained(page);
});

test("320-pixel and tablet widths keep long directional labels visible", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  for (const viewport of [{ width: 320, height: 800 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/tools/healthcare-worker-total-compensation-comparison", { waitUntil: "networkidle" });
    const primary = page.getByRole("link", { name: "Compare the two offers" });
    await expect(primary).toBeVisible();
    const box = await primary.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 1);
    await expectAccessibleAndContained(page);
  }
});
