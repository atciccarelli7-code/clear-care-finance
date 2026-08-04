import { expect, test } from "@playwright/test";

test.describe("Employer benefits navigator", () => {
  test("preserves employer context before opening the benefits workspace", async ({ page }) => {
    await page.goto("/tools/benefits-command-center");

    await expect(page.getByRole("heading", { name: /start with the employer and plan year/i })).toBeVisible();
    const uncEmployerButton = page.locator("button").filter({ hasText: "UNC Health" }).first();
    await expect(uncEmployerButton).toBeVisible();
    await uncEmployerButton.scrollIntoViewIfNeeded();
    await uncEmployerButton.click();
    await expect(page.getByRole("link", { name: /2026 UNC Health Benefit Summary/i })).toBeVisible();
    await page.getByLabel("Your employee group").selectOption("triangle");
    await page.getByRole("button", { name: /start this employer workspace/i }).click();

    await page.waitForURL(/employer=unc-health/);
    const context = await page.evaluate(() => JSON.parse(window.localStorage.getItem("caf-employer-benefits-context-v1") || "null"));
    const workspace = await page.evaluate(() => JSON.parse(window.localStorage.getItem("caf-benefits-command-center-v1") || "null"));

    expect(context).toMatchObject({
      schemaVersion: 1,
      employerSlug: "unc-health",
      planYear: 2026,
      employeeClassId: "triangle",
      sourceStatus: "review_in_progress",
    });
    expect(workspace.mode).toBe("open_enrollment");
    expect(workspace.packages[0].label).toContain("UNC Health 2026");
    expect(workspace.packages[0].label).toContain("Triangle employee group");
  });

  test("keeps source intake bounded to public employer metadata", async ({ page }) => {
    let submittedBody: Record<string, unknown> | null = null;
    await page.route("**/api/employer-benefits-source", async (route) => {
      submittedBody = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, saved: true }) });
    });

    await page.goto("/tools/benefits-command-center");
    await expect(page.getByText(/do not provide portal credentials/i)).toBeVisible();
    await page.getByLabel("Employer").fill("Example Health System");
    await page.getByLabel(/Public source URL/i).fill("https://benefits.example.org/2026-guide.pdf");
    await page.getByLabel(/Employee population/i).fill("Benefits-eligible employees");
    await page.getByRole("button", { name: /save for review/i }).click();

    await expect(page.getByText(/saved for review/i)).toBeVisible();
    expect(submittedBody).toMatchObject({
      employerName: "Example Health System",
      sourceUrl: "https://benefits.example.org/2026-guide.pdf",
      employeePopulation: "Benefits-eligible employees",
      planYear: 2026,
    });
    expect(submittedBody).not.toHaveProperty("email");
    expect(submittedBody).not.toHaveProperty("file");
    expect(submittedBody).not.toHaveProperty("notes");
  });
});
