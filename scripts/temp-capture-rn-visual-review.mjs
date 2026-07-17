import { chromium } from "@playwright/test";
import fs from "node:fs/promises";

const baseUrl = "http://127.0.0.1:4173";
const outputDir = "visual-review-artifacts";
const scenarios = [
  { name: "desktop", viewport: { width: 1440, height: 1000 }, isMobile: false },
  { name: "mobile", viewport: { width: 390, height: 844 }, isMobile: true },
];

await fs.rm(outputDir, { recursive: true, force: true });
await fs.mkdir(outputDir, { recursive: true });
const report = [];

async function dismissConsent(page) {
  const necessaryOnly = page.getByRole("button", { name: "Necessary only" });
  if (await necessaryOnly.count()) {
    await necessaryOnly.first().click();
    await page.waitForTimeout(250);
  }
}

async function captureViewport(page, locator, path) {
  await locator.first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  await page.screenshot({ path, type: "jpeg", quality: 76 });
}

for (const scenario of scenarios) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: scenario.viewport,
    isMobile: scenario.isMobile,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const consoleMessages = [];
  const pageErrors = [];
  const failedResponses = [];

  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      consoleMessages.push({ type: message.type(), text: message.text() });
    }
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400) {
      failedResponses.push({ status: response.status(), url: response.url() });
    }
  });

  const guideResponse = await page.goto(`${baseUrl}/patients-families/hospital-guide`, {
    waitUntil: "networkidle",
  });
  await dismissConsent(page);
  const guideTitle = await page.title();

  await page.screenshot({
    path: `${outputDir}/${scenario.name}-guide-full.jpg`,
    type: "jpeg",
    quality: 52,
    fullPage: true,
  });

  const firstPrinciple = page.getByText(
    "Identify the destination and payment barriers early",
    { exact: true },
  );
  const rnPrinciplesVisible = (await firstPrinciple.count()) === 1;
  await captureViewport(
    page,
    firstPrinciple,
    `${outputDir}/${scenario.name}-guide-principles.jpg`,
  );

  const assessmentHeading = page.getByText(
    "Find the barriers that can keep a medically ready patient from leaving safely",
    { exact: true },
  );
  await captureViewport(
    page,
    assessmentHeading,
    `${outputDir}/${scenario.name}-guide-assessment.jpg`,
  );

  const barrierTitles = [
    "The long-term care payment path is not established",
    "Function is declining while discharge is delayed",
  ];

  const barrierCounts = {};
  for (const title of barrierTitles) {
    const label = page.locator("label").filter({ hasText: title });
    barrierCounts[title] = await label.count();
    if (await label.count()) {
      await label.first().click();
    }
  }

  const questionList = page.getByText("Your question list", { exact: true });
  await captureViewport(
    page,
    questionList,
    `${outputDir}/${scenario.name}-guide-selected-questions.jpg`,
  );

  const guideText = await page.locator("body").innerText();
  const guideOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  const guideBrokenImages = await page.evaluate(() =>
    Array.from(document.images)
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.src),
  );

  const guideFailedResponses = [...failedResponses];
  failedResponses.length = 0;

  const articleResponse = await page.goto(
    `${baseUrl}/articles/from-the-bedside-long-term-care-medicaid-hospital-delay`,
    { waitUntil: "networkidle" },
  );
  const articlePageTitle = await page.title();

  await page.screenshot({
    path: `${outputDir}/${scenario.name}-article-full.jpg`,
    type: "jpeg",
    quality: 52,
    fullPage: true,
  });

  const articleTitle = page
    .getByRole("heading", { name: /Long-Term Care Medicaid Should Not Wait Until a Crisis/ })
    .first();
  await captureViewport(
    page,
    articleTitle,
    `${outputDir}/${scenario.name}-article-top.jpg`,
  );

  const functionSection = page.getByText(
    "Protect function while the paperwork catches up",
    { exact: true },
  );
  await captureViewport(
    page,
    functionSection,
    `${outputDir}/${scenario.name}-article-function-section.jpg`,
  );

  const articleText = await page.locator("body").innerText();
  const articleOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  const articleBrokenImages = await page.evaluate(() =>
    Array.from(document.images)
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.src),
  );

  report.push({
    scenario: scenario.name,
    viewport: scenario.viewport,
    guideStatus: guideResponse?.status(),
    guideTitle,
    rnPrinciplesVisible,
    barrierCounts,
    questionListUpdated:
      guideText.includes("2 possible barriers to resolve") &&
      guideText.includes("Which payment path") &&
      guideText.includes("What was the patient's baseline function"),
    guideOverflow,
    guideBrokenImages,
    guideFailedResponses,
    articleStatus: articleResponse?.status(),
    articlePageTitle,
    articleIncludesFunctionalDecline: articleText.toLowerCase().includes("functional decline"),
    articleIncludesMobilityGuidance: articleText.toLowerCase().includes("mobility"),
    articleIncludesCaregiverTraining: articleText.toLowerCase().includes("caregiver training"),
    articleOverflow,
    articleBrokenImages,
    articleFailedResponses: [...failedResponses],
    consoleMessages,
    pageErrors,
  });

  await context.close();
  await browser.close();
}

await fs.writeFile(`${outputDir}/report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
