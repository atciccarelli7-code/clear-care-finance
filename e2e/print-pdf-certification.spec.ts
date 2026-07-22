import { mkdir } from "node:fs/promises";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

const ARTIFACT_DIR = path.resolve("print-certification");

const installPrivacyBoundary = async (page: Page) => {
  await page.route("**/_vercel/**", async (route) => {
    const isScript = new URL(route.request().url()).pathname.endsWith(".js");
    await route.fulfill(isScript
      ? { status: 200, contentType: "application/javascript", body: "" }
      : { status: 204, body: "" });
  });
  await page.addInitScript(() => {
    localStorage.setItem("caf-privacy-consent-v1", "necessary");
  });
};

const visit = async (page: Page, route: string) => {
  await page.goto(route, { waitUntil: "networkidle" });
  await page.waitForFunction(() => Array.from(document.querySelectorAll("button, select, input")).some((element) => (
    Object.keys(element).some((key) => key.startsWith("__reactProps$"))
  ))).catch(() => undefined);
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
};

const assertGovernedPrintSurface = async (page: Page, expectedText: RegExp, isStandalonePack = false) => {
  await expect(page.locator("body")).toContainText(expectedText);

  if (!isStandalonePack) {
    await expect(page.locator("header.sticky")).toBeHidden();
    await expect(page.locator("footer")).toBeHidden();
    await expect(page.locator('aside[aria-label="Site trust standards"]')).toBeHidden();
    await expect(page.locator('nav[aria-label="Primary mobile navigation"]')).toBeHidden();
    await expect(page.locator("button:visible, [role=button]:visible")).toHaveCount(0);
  }

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
};

const exportPdfPair = async (page: Page, slug: string, expectedText: RegExp, isStandalonePack = false) => {
  await mkdir(ARTIFACT_DIR, { recursive: true });
  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await assertGovernedPrintSurface(page, expectedText, isStandalonePack);

  const baseOptions = {
    printBackground: true,
    displayHeaderFooter: false,
    margin: { top: "0.45in", right: "0.45in", bottom: "0.45in", left: "0.45in" },
    tagged: true,
    outline: true,
  } as const;

  await page.pdf({
    ...baseOptions,
    path: path.join(ARTIFACT_DIR, `${slug}-letter.pdf`),
    format: "Letter",
  });
  await page.pdf({
    ...baseOptions,
    path: path.join(ARTIFACT_DIR, `${slug}-a4.pdf`),
    format: "A4",
  });

  await page.emulateMedia({ media: "screen" });
};

test.beforeEach(async ({ page }) => {
  await installPrivacyBoundary(page);
});

test("generate Medical Bill Response System result and printable pack PDFs", async ({ page }) => {
  await visit(page, "/insurance/medical-bill-review-toolkit");
  await page.getByRole("button", { name: /Hospital or facility bill/i }).click();
  await expect(page.locator("#document-result")).toContainText("Safest next action");
  await exportPdfPair(page, "medical-bill-response-result", /Hospital or facility bill/i);

  await page.goto("/downloads/medical-bill-response-pack.html", { waitUntil: "networkidle" });
  await expect(page.locator("body")).toContainText(/Medical Bill Response Pack/i);
  await exportPdfPair(page, "medical-bill-response-pack", /Medical Bill Response Pack/i, true);
});

test("generate Hospital and Patient Guide action plan PDFs", async ({ page }) => {
  await visit(page, "/patients-families/hospital-guide");
  await page.getByRole("button", { name: "Leaving the hospital" }).click();
  await expect(page.getByText("Your next three actions")).toBeVisible();
  await expect(page.getByText("Verify before acting")).toBeVisible();
  await exportPdfPair(page, "hospital-discharge-action-plan", /Your next three actions/i);
});

test("generate diagnosis-explained concise handout PDFs", async ({ page }) => {
  await visit(page, "/patients-families/diagnosis-explained/heart-failure");
  await expect(page.locator('section[aria-label="Concise heart failure handout"]')).toContainText(
    "Independent clinical review is pending",
  );
  await expect(page.locator('section[aria-label="Concise heart failure handout"]')).toContainText(
    "Do not change medicine doses",
  );
  await exportPdfPair(page, "heart-failure-concise-handout", /Heart Failure: concise care handout/i);

  await visit(page, "/patients-families/diagnosis-explained/copd");
  await expect(page.locator('section[aria-label="Concise COPD handout"]')).toContainText(
    "Independent clinical review is pending",
  );
  await expect(page.locator('section[aria-label="Concise COPD handout"]')).toContainText(
    "Do not change inhaler doses",
  );
  await exportPdfPair(page, "copd-concise-handout", /COPD: concise care handout/i);
});

test("generate healthcare offer verification PDFs", async ({ page }) => {
  await visit(page, "/tools/healthcare-worker-total-compensation-comparison");
  for (const checkbox of await page.getByRole("checkbox").all()) {
    if (!await checkbox.isChecked()) await checkbox.check();
  }
  await expect(page.getByRole("heading", { name: "All verification items are marked complete" })).toBeVisible();
  await exportPdfPair(page, "healthcare-offer-verification-plan", /All verification items are marked complete/i);
});

test("generate Turning 65 Medicare timeline PDFs", async ({ page }) => {
  await visit(page, "/medicare-care-costs/turning-65");
  await page.getByLabel("Birth month").fill("6");
  await page.getByLabel("Birth year").fill("1961");
  await page.getByLabel("Already enrolled in any part of Medicare?").selectOption("no");
  await page.getByLabel("Current coverage source").selectOption("active-employer");
  await page.getByLabel("Is the coverage based on current active employment?").selectOption("yes");
  await page.getByLabel("Approximate employer size").selectOption("20-plus");
  await page.getByLabel("Will active employment or coverage end soon?").selectOption("no");
  await page.getByLabel("Are employee or employer HSA contributions continuing?").selectOption("yes");
  await page.getByLabel("Could spouse or dependent coverage be affected?").selectOption("no");
  await page.getByLabel("Current prescription coverage status").selectOption("creditable");
  await page.getByLabel("Current coverage preference").selectOption("undecided");
  await page.getByLabel("Should the result include limited-income help?").selectOption("no");
  await page.getByLabel("State abbreviation").fill("NC");
  await page.getByRole("button", { name: /Build qualified timeline/i }).click();
  await expect(page.getByRole("heading", { name: "Dated timeline" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Official verification and escalation" })).toBeVisible();
  await exportPdfPair(page, "turning-65-medicare-timeline", /Official verification and escalation/i);
});
