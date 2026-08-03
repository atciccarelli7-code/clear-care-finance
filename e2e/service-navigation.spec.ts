import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";

const preparePage = async (page: Page) => {
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

const expectNoHorizontalOverflow = async (page: Page) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
};

const expectNoSeriousAccessibilityViolations = async (page: Page) => {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const severe = results.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  expect(severe, severe.map((item) => `${item.id}: ${item.help}`).join("\n")).toEqual([]);
};

const mobileNavigation = (page: Page) => page.getByRole("navigation", { name: "Mobile navigation", exact: true });

const ensureDisclosureOpen = async (navigation: Locator, label: string) => {
  const details = navigation.locator("details").filter({ hasText: label });
  if (!(await details.evaluate((node) => (node as HTMLDetailsElement).open))) {
    await details.locator("summary").click();
  }
  return details;
};

test.beforeEach(async ({ page }) => {
  await preparePage(page);
});

test("desktop and intermediate-width visitors can discover free services and the flagship preview", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const primary = page.getByRole("navigation", { name: "Primary navigation", exact: true });
  await expect(primary).toBeVisible();
  await expect(primary.getByRole("link", { name: "Start Here" })).toBeVisible();
  await expect(primary.getByRole("link", { name: "Free Tools", exact: true })).toBeVisible();
  await expect(primary.getByRole("link", { name: "Trust & Methods", exact: true })).toBeVisible();

  const trigger = page.getByRole("button", { name: "Open Explore CAF service navigation" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Explore CAF services" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "Explore CAF services", exact: true })).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "Healthcare-worker decisions", exact: true })).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "Patient and caregiver decisions", exact: true })).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "Free education and trusted sources", exact: true })).toBeVisible();

  const flagship = dialog.getByRole("link", { name: /Benefits Decision System/ });
  await expect(flagship).toContainText(/coordinated open-enrollment decision support/i);
  await expect(dialog.getByRole("link", { name: /Compare job offers/ })).toContainText(/beyond hourly pay/i);
  await expect(dialog.getByRole("link", { name: /Medical Bill Review/ })).toContainText(/EOB and provider bill/i);
  await expect(dialog.getByRole("link", { name: /Hospital & Patient Guide/ })).toContainText(/discharge/i);

  await expectNoHorizontalOverflow(page);
  await expectNoSeriousAccessibilityViolations(page);

  await flagship.click();
  await expect(page).toHaveURL(/\/healthcare-workers#benefits-decision-system$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/learn workplace benefits for free/i);
  await expect(page.getByRole("heading", { name: "Healthcare Worker Benefits Decision System", exact: true })).toBeVisible();
});

test("short desktop viewports keep lower Explore CAF destinations reachable", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  await page.setViewportSize({ width: 1280, height: 480 });
  await page.goto("/");

  await page.getByRole("button", { name: "Open Explore CAF service navigation" }).click();
  const dialog = page.getByRole("dialog", { name: "Explore CAF services" });
  await expect(dialog).toBeVisible();

  const metrics = await dialog.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      bottom: rect.bottom,
      viewportHeight: window.innerHeight,
      overflowY: window.getComputedStyle(element).overflowY,
    };
  });

  expect(metrics.bottom).toBeLessThanOrEqual(metrics.viewportHeight + 1);
  expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);
  expect(["auto", "scroll"]).toContain(metrics.overflowY);

  const careerDecision = dialog.getByRole("link", { name: /Healthcare Career Decision Center/ });
  await careerDecision.scrollIntoViewIfNeeded();
  await expect(careerDecision).toBeVisible();
  await careerDecision.click();
  await expect(page).toHaveURL(/\/healthcare-workers\/career-decisions$/);
});

test("320-pixel mobile navigation groups choices and restores focus on Escape", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium");
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto("/");

  const trigger = page.getByRole("button", { name: "Open menu" });
  await trigger.click();
  const mobileNav = mobileNavigation(page);
  await expect(mobileNav).toBeVisible();
  await expect(mobileNav.getByRole("link", { name: /Start Here/ })).toBeFocused();
  await expect(mobileNav.getByRole("link", { name: /Free tools/ })).toBeVisible();
  await expect(mobileNav.getByRole("link", { name: /Free education/ })).toBeVisible();

  await expect(mobileNav.getByText("Healthcare-worker decisions")).toBeVisible();
  await expect(mobileNav.getByText("Patient and caregiver decisions")).toBeVisible();
  await expect(mobileNav.getByText("Free education and trusted sources")).toBeVisible();

  const patientGroup = await ensureDisclosureOpen(mobileNav, "Patient and caregiver decisions");
  await expect(patientGroup.getByRole("link", { name: /Medical Bill Review/ })).toBeVisible();
  await expect(patientGroup.getByRole("link", { name: /Prior Authorization Next Step/ })).toBeVisible();

  await expectNoHorizontalOverflow(page);
  await expectNoSeriousAccessibilityViolations(page);

  await page.keyboard.press("Escape");
  await expect(mobileNav).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("mobile visitors can reach worker, patient, coverage, and learning destinations", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  let mobileNav = mobileNavigation(page);

  const workerGroup = await ensureDisclosureOpen(mobileNav, "Healthcare-worker decisions");
  await workerGroup.getByRole("link", { name: /Compare job offers/ }).click();
  await expect(page).toHaveURL(/\/tools\/healthcare-worker-total-compensation-comparison$/);

  await page.getByRole("button", { name: "Open menu" }).click();
  mobileNav = mobileNavigation(page);
  let coverageGroup = await ensureDisclosureOpen(mobileNav, "Free education and trusted sources");
  await coverageGroup.getByRole("link", { name: /Medicare & Medicaid/ }).click();
  await expect(page).toHaveURL(/\/medicare-care-costs$/);

  await page.getByRole("button", { name: "Open menu" }).click();
  mobileNav = mobileNavigation(page);
  coverageGroup = await ensureDisclosureOpen(mobileNav, "Free education and trusted sources");
  await coverageGroup.getByRole("link", { name: /Quick Guides/ }).click();
  await expect(page).toHaveURL(/\/guides$/);
  await expectNoHorizontalOverflow(page);
});
