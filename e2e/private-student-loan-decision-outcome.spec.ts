import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const route = "/tools/private-student-loan-payoff-calculator";

const enterPrivatePlan = async (page: Page, options: { extra?: string } = {}) => {
  await page.getByLabel("Which loans are included?").selectOption("private");
  await page.getByLabel("Current principal balance").fill("45000");
  await page.getByLabel("Current APR").fill("9");
  await page.getByLabel("Current remaining term").fill("138");
  await page.getByLabel("Current monthly payment").fill("525");
  await page.getByLabel("Optional additional monthly payment").fill(options.extra ?? "0");
};

const expectHealthyAndAccessible = async (page: Page, health: { console: string[]; errors: string[]; failed: string[] }) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const severe = accessibility.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  expect(severe, severe.map((violation) => `${violation.id}: ${violation.help}`).join("\n")).toEqual([]);
  expect(health.console).toEqual([]);
  expect(health.errors).toEqual([]);
  expect(health.failed).toEqual([]);
};

test.beforeEach(async ({ page }) => {
  await page.route("**/_vercel/**", async (route) => {
    const isScript = new URL(route.request().url()).pathname.endsWith(".js");
    await route.fulfill(isScript ? { status: 200, contentType: "application/javascript", body: "" } : { status: 204, body: "" });
  });
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem("caf-privacy-consent-v1", "necessary");
    window.print = () => { document.documentElement.dataset.printIntent = "true"; };
  });
});

test("federal mixed and uncertain borrowers remain in verification without a commercial handoff", async ({ page }) => {
  for (const loanType of ["federal", "mixed", "uncertain"]) {
    await page.goto(route, { waitUntil: "networkidle" });
    await page.getByLabel("Which loans are included?").selectOption(loanType);
    await page.getByRole("button", { name: "Show verification steps" }).click();
    await expect(page.getByRole("heading", { name: "Verify loan type first" })).toBeFocused();
    await expect(page.getByRole("link", { name: /Check federal loan records/i })).toHaveAttribute("href", "https://studentaid.gov/dashboard/");
    await expect(page.getByText("Optional commercial path")).toHaveCount(0);
    await expect(page.getByText(/partner comparison/i)).toHaveCount(0);
  }
});

test("private quote comparison completes by keyboard with portable output and fixed-only My Plan storage", async ({ page }) => {
  const health = { console: [] as string[], errors: [] as string[], failed: [] as string[] };
  page.on("console", (message) => { if (message.type() === "error") health.console.push(message.text()); });
  page.on("pageerror", (error) => health.errors.push(error.message));
  page.on("requestfailed", (request) => {
    const url = new URL(request.url());
    if (url.origin === "http://127.0.0.1:4173" && !request.failure()?.errorText.includes("ERR_ABORTED")) health.failed.push(url.pathname);
  });

  await page.goto(route, { waitUntil: "networkidle" });
  await page.getByLabel("Which loans are included?").focus();
  await page.getByLabel("Which loans are included?").selectOption("private");
  await enterPrivatePlan(page, { extra: "250" });
  await page.getByLabel("Refinance comparison").selectOption("compare");
  await page.getByLabel("Quoted APR").fill("12");
  await page.getByLabel("Quoted rate type").selectOption("fixed");
  await page.getByLabel("Quoted refinance term").fill("84");
  await page.getByLabel("Lender or origination fees").fill("0");
  await page.getByRole("button", { name: "Build decision outcome" }).focus();
  await page.keyboard.press("Enter");

  await expect(page.getByRole("heading", { name: "Do not refinance based on this quote" })).toBeFocused();
  await expect(page.getByText(/increases estimated financing cost/i)).toBeVisible();
  await expect(page.getByText("Total repayment with fees")).toBeVisible();
  await expect(page.getByText("Fee-adjusted break-even")).toBeVisible();
  await expect(page.getByText("Optional commercial path")).toHaveCount(0);

  await page.getByRole("button", { name: "Copy decision summary" }).click();
  await expect(page.getByRole("button", { name: "Summary copied" })).toBeVisible();
  await page.getByRole("button", { name: "Add this action" }).click();
  const stored = await page.evaluate(() => localStorage.getItem("caf-financial-navigator-v1") ?? "");
  expect(stored).toContain("wealth_student_loans");
  expect(stored).not.toMatch(/45000|525|250|principal|apr|payment|quote|fee/i);

  await page.getByRole("button", { name: "Print or save as PDF" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-print-intent", "true");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("form")).toBeHidden();
  await expect(page.locator("#private-loan-decision-outcome")).toBeVisible();
  await expect(page.locator("#private-loan-decision-outcome")).toContainText("Educational estimate only");
  await page.emulateMedia({ media: "screen" });

  await expectHealthyAndAccessible(page, health);
});

test("lower payment and higher lifetime cost remain visually and semantically explicit on mobile", async ({ page }) => {
  await page.goto(route, { waitUntil: "networkidle" });
  await enterPrivatePlan(page);
  await page.getByLabel("Refinance comparison").selectOption("compare");
  await page.getByLabel("Quoted APR").fill("8.5");
  await page.getByLabel("Quoted refinance term").fill("240");
  await page.getByLabel("Lender or origination fees").fill("0");
  await page.getByRole("button", { name: "Build decision outcome" }).click();
  await expect(page.getByRole("heading", { name: "Lower payment, but higher total cost" })).toBeFocused();
  await expect(page.getByText(/Monthly-payment relief and total-cost savings are different decisions/i)).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
