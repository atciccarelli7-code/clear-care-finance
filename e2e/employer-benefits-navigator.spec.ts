import { expect, test } from "@playwright/test";

test.describe("Employer benefits navigator", () => {
  test("shows a verified employer source and carries it into the local workspace", async ({ page }) => {
    await page.route("**/api/employer-benefits-source?q=*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          query: "Mayo",
          registryVintage: 2023,
          entries: [{
            systemId: "SYS-TEST-MAYO",
            name: "Mayo Clinic",
            city: "Rochester",
            state: "MN",
            registryVintage: 2023,
            hospitalCount: 10,
            staffedBeds: 2000,
            matchedEmployerSlug: null,
            discoveredSourceCount: 2,
            currentPublicSourceCount: 2,
            bestPlanYear: 2026,
            coverageStatus: "verified_public_pdf",
            sources: [{
              sourceId: "source-mayo-2026",
              title: "2026 Employee Benefits Guide",
              url: "https://benefits.example.org/mayo-2026-guide.pdf",
              audience: "Benefits-eligible employees",
              planYearLabel: "2026",
              planYearStart: 2026,
              planYearEnd: 2026,
              stateRegion: "Minnesota",
              documentType: "full_guide",
              sourceStatus: "verified_public_pdf",
              verificationStatus: "source_verified",
            }],
          }],
        }),
      });
    });

    await page.goto("/tools/benefits-command-center");
    await expect(page.getByRole("heading", { name: /find your healthcare system/i })).toBeVisible();
    await page.getByRole("textbox", { name: "Healthcare system", exact: true }).fill("Mayo");
    await expect(page.getByRole("heading", { name: "Mayo Clinic" })).toBeVisible();
    await expect(page.getByText(/current public source located/i)).toBeVisible();
    await expect(page.getByText("2026 Employee Benefits Guide")).toBeVisible();
    await expect(page.getByRole("link", { name: /open official source/i })).toHaveAttribute("href", "https://benefits.example.org/mayo-2026-guide.pdf");
    await page.getByRole("button", { name: /start with this source/i }).click();

    await page.waitForURL(/mode=build/);
    await expect(page.getByText(/employer source attached/i)).toBeVisible();
    await expect(page.getByText("2026 Employee Benefits Guide")).toBeVisible();

    const workspace = await page.evaluate(() => JSON.parse(window.localStorage.getItem("caf-benefits-command-center-v1") || "null"));
    const sourceContext = await page.evaluate(() => JSON.parse(window.localStorage.getItem("caf-employer-benefits-source-context-v1") || "null"));
    expect(workspace.mode).toBe("open_enrollment");
    expect(workspace.packages[0].label).toContain("Mayo Clinic 2026");
    expect(sourceContext).toMatchObject({
      schemaVersion: 1,
      systemId: "SYS-TEST-MAYO",
      systemName: "Mayo Clinic",
      selectedSource: {
        sourceId: "source-mayo-2026",
        title: "2026 Employee Benefits Guide",
        planYearLabel: "2026",
      },
    });
  });

  test("preserves employer context before opening the reviewed benefits workspace", async ({ page }) => {
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
    await page.getByRole("textbox", { name: "Employer", exact: true }).fill("Example Health System");
    await page.getByRole("textbox", { name: /Public source URL/i }).fill("https://benefits.example.org/2026-guide.pdf");
    await page.getByRole("textbox", { name: /Employee population/i }).fill("Benefits-eligible employees");
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
