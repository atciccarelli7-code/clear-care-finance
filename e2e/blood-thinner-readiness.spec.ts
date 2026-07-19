import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type Request } from "@playwright/test";

type HealthWatch = { consoleErrors: string[]; pageErrors: string[]; requestFailures: string[]; httpErrors: string[] };

const installHealthWatch = (page: Page): HealthWatch => {
  const watch: HealthWatch = { consoleErrors: [], pageErrors: [], requestFailures: [], httpErrors: [] };
  page.on("console", (message) => { if (message.type() === "error") watch.consoleErrors.push(message.text()); });
  page.on("pageerror", (error) => watch.pageErrors.push(error.message));
  page.on("requestfailed", (request: Request) => {
    const url = new URL(request.url());
    const failure = request.failure()?.errorText ?? "unknown failure";
    if (url.origin === "http://127.0.0.1:4173" && !failure.includes("ERR_ABORTED")) watch.requestFailures.push(`${request.method()} ${url.pathname}: ${failure}`);
  });
  page.on("response", (response) => {
    const url = new URL(response.url());
    if (url.origin === "http://127.0.0.1:4173" && response.status() >= 400) watch.httpErrors.push(`${response.status()} ${url.pathname}`);
  });
  return watch;
};

const chooseSelect = async (page: Page, label: RegExp, option: RegExp) => {
  await page.getByRole("combobox", { name: label }).click();
  await page.getByRole("option", { name: option }).click();
};

test.beforeEach(async ({ page }) => {
  await page.route("**/_vercel/**", async (route) => {
    const isScript = new URL(route.request().url()).pathname.endsWith(".js");
    await route.fulfill(isScript ? { status: 200, contentType: "application/javascript", body: "" } : { status: 204, body: "" });
  });
  await page.addInitScript(() => {
    localStorage.setItem("caf-privacy-consent-v1", "necessary");
    window.print = () => { document.documentElement.dataset.printIntent = "true"; };
  });
});

test("exact medication, teach-back, barrier, handoff, proof, and print states work", async ({ page }) => {
  const watch = installHealthWatch(page);
  await page.goto("/for-organizations/patient-education-systems/blood-thinner-readiness", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: /Turn blood thinner education into a verifiable discharge handoff/i })).toBeVisible();
  await expect(page.getByText("Readiness checks not started", { exact: true })).toBeVisible();
  await expect(page.locator("input, textarea")).toHaveCount(0);
  await expect(page.getByText(/Synthetic review only/i)).toBeVisible();

  await page.getByRole("button", { name: /Rivaroxaban tablet/i }).click();
  await expect(page.getByText(/missed-dose branches differ/i)).toBeVisible();
  await chooseSelect(page, /Select the exact rivaroxaban regimen/i, /15 mg twice daily during the initial treatment period/i);
  await page.getByRole("checkbox", { name: /exact medicine, strength, reason/i }).click();
  await page.getByRole("checkbox", { name: /organization-approved bleeding/i }).click();

  await page.getByRole("button", { name: /Plan/i }).click();
  await expect(page.getByRole("heading", { name: "Rivaroxaban" })).toBeVisible();
  await expect(page.getByText(/Two 15 mg tablets may be taken together/i).first()).toBeVisible();

  await page.getByRole("button", { name: /Teach-back/i }).click();
  for (const prompt of ["exact medicine", "matching medicine card", "approved bleeding", "who owns refills"]) {
    await chooseSelect(page, new RegExp(`Result for .*${prompt}`, "i"), /Passed without prompting/i);
  }

  await page.getByRole("button", { name: /Barriers/i }).click();
  await page.getByRole("checkbox", { name: /Cost, coverage, or authorization problem/i }).click();
  await chooseSelect(page, /Status for Cost, coverage, or authorization problem/i, /Unresolved - stop discharge handoff/i);
  await expect(page.getByText("Discharge handoff blocked", { exact: true })).toBeVisible();
  await chooseSelect(page, /Status for Cost, coverage, or authorization problem/i, /Open with safe named backup/i);
  await expect(page.getByText("Readiness demonstrated in this review workflow", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: /Handoff/i }).click();
  await expect(page.getByText(/No modeled blocker remains/i)).toBeVisible();
  await page.getByRole("button", { name: /Print patient-facing review sample/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-print-intent", "true");

  const proofResponse = await page.request.get("/patient-education/demo/blood-thinner-readiness-proof.json");
  expect(proofResponse.ok()).toBe(true);
  const proof = await proofResponse.json();
  expect(proof.patient_use_status).toBe("NOT APPROVED FOR PATIENT USE");
  expect(proof.governance.open_decision_ids).toHaveLength(12);
  expect(JSON.stringify(proof)).not.toMatch(/reviewerIdentity|patientName|medicalRecordNumber/i);

  await page.emulateMedia({ media: "print" });
  await expect(page.getByRole("article", { name: /Blood thinner safety plan printable review sample/i })).toBeVisible();
  await expect(page.getByText(/REVIEW SAMPLE · NOT APPROVED FOR PATIENT USE/i)).toBeVisible();
  await expect(page.getByTestId("readiness-status")).toBeHidden();
  await page.emulateMedia({ media: "screen" });
  await page.waitForTimeout(1200);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const severe = accessibility.violations.filter((item) => item.impact === "serious" || item.impact === "critical");
  expect(severe, severe.map((item) => `${item.id}: ${item.help}`).join("\n")).toEqual([]);
  expect(page.locator("vite-error-overlay, [data-error-overlay]")).toHaveCount(0);
  expect(watch.consoleErrors).toEqual([]);
  expect(watch.pageErrors).toEqual([]);
  expect(watch.requestFailures).toEqual([]);
  expect(watch.httpErrors).toEqual([]);
});
