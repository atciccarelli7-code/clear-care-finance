import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem("caf-privacy-consent-v1","necessary"));
});

test("a reader changes coverage, opens the itemization and matches the EOB", async ({ page }) => {
  await page.goto("/hospital-bill-anatomy");
  await expect(page.getByRole("heading", {name:"The Anatomy of a Hospital Bill",exact:true})).toBeVisible();
  await expect(page.locator(".bill-result-number")).toHaveText("$1,736.00");
  await page.getByLabel("Coverage arrangement",{exact:true}).selectOption("medigap-g");
  await expect(page.locator(".bill-result-number")).toHaveText("$0.00");
  await page.getByLabel(/Add a separate hypothetical professional claim/).check();
  await expect(page.locator(".bill-result-number")).toHaveText("$283.00");
  await page.getByRole("button",{name:"Itemized charges",exact:true}).click();
  await page.getByText("Semiprivate room and routine nursing",{exact:true}).click();
  await expect(page.locator(".bill-statement")).toContainText("Does this quantity match the billed inpatient dates");
  await page.getByRole("button",{name:"EOB / payer explanation",exact:true}).click();
  await expect(page.locator(".bill-statement")).toContainText("Original Medicare normally uses a Medicare Summary Notice");
  await expect(page.locator(".bill-statement .bill-total")).toContainText("$283.00");
  await page.getByLabel("Explore claim processing").selectOption("denied");
  await expect(page.locator(".bill-statement")).toContainText("A denial does not automatically transfer the entire bill");
  await expect(page.locator(".bill-statement .bill-total")).toHaveCount(0);
});

test("commercial accumulators reconcile and invalid inputs never leave a stale answer", async ({page}) => {
  await page.goto("/hospital-bill-anatomy");
  await page.getByLabel("Coverage arrangement",{exact:true}).selectOption("ppo");
  await expect(page.locator(".bill-result-number")).toHaveText("$4,080.00");
  await page.getByText("Change the coverage assumptions",{exact:true}).click();
  await page.getByLabel("Prior qualifying out-of-pocket spending ($)",{exact:true}).fill("6000");
  await expect(page.locator(".bill-result-number")).toHaveText("$0.00");
  await page.getByLabel("Prior qualifying out-of-pocket spending ($)",{exact:true}).fill("6001");
  await expect(page.locator(".bill-result-number")).toHaveText("Not calculated");
  await expect(page.getByRole("alert")).toContainText("Prior out-of-pocket spending");
  await expect(page.locator("#economics .bill-total")).toContainText("Unavailable");
});

test("observation never receives a Part A hospital deductible and fixed scenario links reopen", async ({page}) => {
  await page.goto("/hospital-bill-anatomy#scenario=observation");
  await expect(page.getByRole("button",{name:/An overnight observation stay/})).toHaveAttribute("aria-pressed","true");
  await expect(page.locator(".bill-result-number")).toHaveText("Not calculated");
  await expect(page.getByRole("alert")).toContainText("Observation is outpatient care");
  await page.getByLabel("Coverage arrangement",{exact:true}).selectOption("uninsured");
  await expect(page.locator(".bill-result-number")).toHaveText("$5,600.00");
  await page.getByRole("button",{name:"Compare all nine coverage examples"}).click();
  await expect(page.getByRole("region",{name:"Coverage comparison table"})).toContainText("Not modeled for this encounter");
  await expect(page.locator(".bill-statement")).toContainText("Self-pay discount");
});

test("chapters, comparison and sources are accessible without horizontal page overflow", async ({page},testInfo) => {
  await page.goto("/hospital-bill-anatomy");
  await page.getByRole("button",{name:"Compare all nine coverage examples"}).click();
  await page.getByRole("button",{name:"Itemized charges",exact:true}).click();
  await page.getByText("Change the coverage assumptions",{exact:true}).click();
  await page.getByLabel("Coverage arrangement",{exact:true}).selectOption("ppo");
  const accessibility=await new AxeBuilder({page}).include("main").withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze();
  expect(accessibility.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  await page.screenshot({path:`test-results/hospital-bill-${testInfo.project.name}.png`,fullPage:true});
  await page.getByRole("link",{name:"Data & methodology",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Different numbers. Different evidence.",exact:true})).toBeVisible();
  await expect(page).toHaveTitle(/Hospital Bill Anatomy: Sources and Methodology/);
  const method=await new AxeBuilder({page}).include("main").withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze();
  expect(method.violations.map(v=>v.id)).toEqual([]);
});

test("a keyboard reader can open detail and reach the financial-assistance path", async ({page}) => {
  await page.goto("/hospital-bill-anatomy");
  const detail=page.getByText("Change the coverage assumptions",{exact:true});
  await detail.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Coverage rule year")).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Coverage rule year")).toBeFocused();
  await page.getByRole("link",{name:"Find hospital financial assistance →",exact:true}).click();
  await expect(page).toHaveURL(/\/medical-bills\/financial-assistance$/);
});

test("core education is present in the prerendered HTML with JavaScript disabled", async ({browser,baseURL}) => {
  const context=await browser.newContext({javaScriptEnabled:false,baseURL});
  const page=await context.newPage();
  await page.goto("/hospital-bill-anatomy");
  await expect(page.getByRole("heading",{name:"The Anatomy of a Hospital Bill",exact:true})).toBeVisible();
  await expect(page.locator("#hospitals")).toContainText("Average Medicare payment");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href","https://communityacquiredfinance.com/hospital-bill-anatomy");
  await expect(page.getByRole("link",{name:"Data & methodology",exact:true})).toHaveAttribute("href","/hospital-bill-anatomy/methodology");
  await context.close();
});
