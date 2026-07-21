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

const exportPdfPair = async (page: Page, slug: string) => {
  await mkdir(ARTIFACT_DIR, { recursive: true });
  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));

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
  await exportPdfPair(page, "medical-bill-response-result");

  await page.goto("/downloads/medical-bill-response-pack.html", { waitUntil: "networkidle" });
  await expect(page.locator("body")).toContainText(/Medical Bill Response Pack/i);
  await exportPdfPair(page, "medical-bill-response-pack");
});

test("generate Hospital and Patient Guide action plan PDFs", async ({ page }) => {
  await visit(page, "/patients-families/hospital-guide");
  await page.getByRole("button", { name: "Leaving the hospital" }).click();
  await expect(page.getByText("Your next three actions")).toBeVisible();
  await expect(page.getByText("Verify before acting")).toBeVisible();
  await exportPdfPair(page, "hospital-discharge-action-plan");
});

test("generate healthcare offer verification PDFs", async ({ page }) => {
  await visit(page, "/tools/healthcare-worker-total-compensation-comparison");
  for (const checkbox of await page.getByRole("checkbox").all()) {
    if (!await checkbox.isChecked()) await checkbox.check();
  }
  await expect(page.getByRole("heading", { name: "All verification items are marked complete" })).toBeVisible();
  await exportPdfPair(page, "healthcare-offer-verification-plan");
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
  await exportPdfPair(page, "turning-65-medicare-timeline");
});
