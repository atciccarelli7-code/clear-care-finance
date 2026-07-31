import { expect, test, type Page } from "@playwright/test";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const artifactDirectory = path.resolve("artifacts/print-certification");

const installPrivacyBoundary = async (page: Page) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    Object.defineProperty(window.navigator, "sendBeacon", { configurable: true, value: () => true });
  });
};

const visit = async (page: Page, route: string) => {
  await page.goto(route, { waitUntil: "networkidle" });
  await expect(page.locator("main")).toBeVisible();
};

const exportPdfPair = async (
  page: Page,
  fileStem: string,
  expectedText: RegExp,
  fullPage = false,
  printTarget?: string,
) => {
  await mkdir(artifactDirectory, { recursive: true });
  await page.emulateMedia({ media: "print" });
  const target = printTarget ? page.locator(printTarget) : page.locator("body");
  await expect(page.locator('[role="region"][aria-label="Privacy choices"]')).toBeHidden();
  await expect(target).toContainText(expectedText);

  const formats = [
    { name: "letter", format: "Letter" as const },
    { name: "a4", format: "A4" as const },
  ];

  for (const { name, format } of formats) {
    const pdfPath = path.join(artifactDirectory, `${fileStem}-${name}.pdf`);
    await page.pdf({
      path: pdfPath,
      format,
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: "0.35in", right: "0.35in", bottom: "0.35in", left: "0.35in" },
      ...(fullPage ? { pageRanges: "1-" } : {}),
    });
    expect((await stat(pdfPath)).size).toBeGreaterThan(10_000);
  }

  await page.emulateMedia({ media: "screen" });
};

test.beforeEach(async ({ page }) => {
  await installPrivacyBoundary(page);
});

test("generate healthcare offer verification plan PDFs", async ({ page }) => {
  await visit(page, "/tools/healthcare-worker-total-compensation-comparison");
  const verificationItems = page.getByRole("checkbox");
  await expect(verificationItems).toHaveCount(12);
  for (const checkbox of await verificationItems.all()) {
    if (!await checkbox.isChecked()) await checkbox.check();
  }
  await expect(page.getByRole("heading", { name: "All verification items are marked complete" })).toBeVisible();
  await exportPdfPair(page, "healthcare-offer-verification-plan", /All verification items are marked complete/i);
});

test("generate Turning 65 Medicare timeline PDFs", async ({ page }) => {
  await visit(page, "/medicare-care-costs/turning-65");
  await page.getByRole("button", { name: /Build qualified timeline/i }).click();
  await expect(page.locator("#turning-65-print-result")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Dated timeline/i })).toBeVisible();
  await exportPdfPair(page, "turning-65-medicare-timeline", /Dated timeline/i, false, "#turning-65-print-result");
});

test("generate private student-loan decision outcome PDFs", async ({ page }) => {
  await visit(page, "/tools/private-student-loan-payoff-calculator");
  await page.getByLabel("Which loans are included?").selectOption("private");
  await page.getByLabel("Current principal balance").fill("45000");
  await page.getByLabel("Current APR").fill("9");
  await page.getByLabel("Current remaining term").fill("138");
  await page.getByLabel("Current monthly payment").fill("525");
  await page.getByLabel("Optional additional monthly payment").fill("250");
  await page.getByRole("button", { name: "Build decision outcome" }).click();
  await expect(page.getByRole("heading", { name: "Accelerate repayment" })).toBeVisible();
  await page.emulateMedia({ media: "print" });
  await expect(page.getByRole("heading", { name: "Accelerate repayment" })).toBeVisible();
  const printedAssumptions = page.getByRole("region", { name: "Assumptions used" });
  await expect(printedAssumptions).toBeVisible();
  await expect(printedAssumptions).toContainText("Confirmed private loans only");
  await expect(printedAssumptions).toContainText("Current principal");
  await expect(printedAssumptions).toContainText("$45,000");
  await expect(printedAssumptions).toContainText("Current APR");
  await expect(printedAssumptions).toContainText("9.00%");
  await expect(printedAssumptions).toContainText("Entered remaining term");
  await expect(printedAssumptions).toContainText("Additional monthly payment");
  await page.emulateMedia({ media: "screen" });
  await exportPdfPair(
    page,
    "private-student-loan-decision-outcome",
    /Accelerate repayment/i,
    false,
    "#private-loan-decision-outcome",
  );

  await page.getByLabel("Refinance comparison").selectOption("compare");
  await page.getByLabel("Quoted APR").fill("6");
  await page.getByLabel("Quoted refinance term").fill("72");
  await page.getByLabel("Lender or origination fees").fill("500");
  await page.getByRole("button", { name: "Build decision outcome" }).click();
  await expect(page.getByRole("heading", { name: "A quoted refinance may reduce total cost" })).toBeVisible();
  await page.emulateMedia({ media: "print" });
  const quoteAssumptions = page.getByRole("region", { name: "Assumptions used" });
  await expect(quoteAssumptions).toContainText("Quoted APR");
  await expect(quoteAssumptions).toContainText("6.00%");
  await expect(quoteAssumptions).toContainText("Quoted term");
  await expect(quoteAssumptions).toContainText("6 yr");
  await expect(quoteAssumptions).toContainText("Quoted fees");
  await expect(quoteAssumptions).toContainText("$500");
  await expect(page.getByRole("region", { name: "Compared refinance quote" })).toBeVisible();
  await page.emulateMedia({ media: "screen" });
  await exportPdfPair(
    page,
    "private-student-loan-refinance-comparison",
    /A quoted refinance may reduce total cost/i,
    false,
    "#private-loan-decision-outcome",
  );
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
    "Source-checked, nurse-reviewed educational handout",
  );
  await expect(page.locator('section[aria-label="Concise heart failure handout"]')).toContainText(
    "Do not change medicine doses",
  );
  await exportPdfPair(
    page,
    "heart-failure-concise-handout",
    /Heart Failure: concise care handout/i,
    false,
    'section[aria-label="Concise heart failure handout"] header',
  );

  await visit(page, "/patients-families/diagnosis-explained/copd");
  await expect(page.locator('section[aria-label="Concise COPD handout"]')).toContainText(
    "Source-checked, nurse-reviewed educational handout",
  );
  await expect(page.locator('section[aria-label="Concise COPD handout"]')).toContainText(
    "Do not change inhaler doses",
  );
  await exportPdfPair(
    page,
    "copd-concise-handout",
    /COPD: concise care handout/i,
    false,
    'section[aria-label="Concise COPD handout"] header',
  );

  const additionalGuides = [
    { route: "/patients-families/diagnosis-explained/acute-kidney-injury", slug: "acute-kidney-injury", aria: "Concise acute kidney injury handout", title: /AKI, Explained: concise care handout/i },
    { route: "/patients-families/diagnosis-explained/atrial-fibrillation", slug: "atrial-fibrillation", aria: "Concise atrial fibrillation handout", title: /AFib, Explained: concise care handout/i },
    { route: "/patients-families/diagnosis-explained/gastrointestinal-bleeding", slug: "gastrointestinal-bleeding", aria: "Concise gastrointestinal bleeding handout", title: /GI Bleeding, Explained: concise care handout/i },
    { route: "/patients-families/diagnosis-explained/bowel-obstruction", slug: "bowel-obstruction", aria: "Concise bowel obstruction handout", title: /Bowel Obstruction, Explained: concise care handout/i },
    { route: "/patients-families/diagnosis-explained/hypertension", slug: "hypertension", aria: "Concise hypertension handout", title: /High Blood Pressure, Explained: concise care handout/i },
    { route: "/patients-families/diagnosis-explained/dyslipidemia", slug: "dyslipidemia", aria: "Concise dyslipidemia or hyperlipidemia handout", title: /High Cholesterol, Explained: concise care handout/i },
    { route: "/patients-families/diagnosis-explained/kidney-failure", slug: "kidney-failure", aria: "Concise kidney failure (ESKD or ESRD) handout", title: /Kidney Failure, Explained: concise care handout/i },
  ] as const;

  for (const guide of additionalGuides) {
    await visit(page, guide.route);
    const handout = page.locator(`section[aria-label="${guide.aria}"]`);
    await expect(handout).toContainText("Source-checked, nurse-reviewed educational handout");
    await expect(handout).toContainText("Do not");
    await exportPdfPair(page, `${guide.slug}-concise-handout`, guide.title, false, `section[aria-label="${guide.aria}"] header`);
  }
});
