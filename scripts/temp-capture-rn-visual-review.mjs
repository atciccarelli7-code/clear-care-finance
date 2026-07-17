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

async function captureViewport(page, locator, path) {
  await locator.first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  await page.screenshot({ path, type: "jpeg", quality: 72 });
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

  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      consoleMessages.push({ type: message.type(), text: message.text() });
    }
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  const guideResponse = await page.goto(`${baseUrl}/patients-families/hospital-guide`, {
    waitUntil: "networkidle",
  });

  await page.screenshot({
    path: `${outputDir}/${scenario.name}-guide-full.jpg`,
    type: "jpeg",
    quality: 48,
    fullPage: true,
  });

  const principlesHeading = page.getByText("RN operating principles", { exact: true });
  await captureViewport(
    page,
    principlesHeading,
    `${outputDir}/${scenario.name}-guide-principles.jpg`,
  );

  const assessmentHeading = page.getByText(
    "Find the nonmedical barriers before they become a last-minute delay",
    { exact: true },
  );
  await captureViewport(
    page,
    assessmentHeading,
    `${outputDir}/${scenario.name}-guide-assessment.jpg`,
  );

  const barrierTitles = [
    "The long-term-care payment path is not established",
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

  const articleResponse = await page.goto(
    `${baseUrl}/articles/from-the-bedside-long-term-care-medicaid-hospital-delay`,
    { waitUntil: "networkidle" },
  );

  await page.screenshot({
    path: `${outputDir}/${scenario.name}-article-full.jpg`,
    type: "jpeg",
    quality: 48,
    fullPage: true,
  });

  const articleTitle = page.getByText(
    "From the Bedside: Long-Term Care Medicaid Should Not Wait Until a Crisis",
    { exact: true },
  );
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
    guideTitle: await page.title(),
    rnPrinciplesVisible: (await principlesHeading.count()) === 1,
    barrierCounts,
    questionListUpdated:
      guideText.includes("2 possible barriers to resolve") &&
      guideText.includes("Which payment path") &&
      guideText.includes("What was the patient's baseline function"),
    guideOverflow,
    guideBrokenImages,
    articleStatus: articleResponse?.status(),
    articleIncludesFunctionalDecline: articleText.toLowerCase().includes("functional decline"),
    articleIncludesMobilityGuidance: articleText.toLowerCase().includes("mobility"),
    articleIncludesCaregiverTraining: articleText.toLowerCase().includes("caregiver training"),
    articleOverflow,
    articleBrokenImages,
    consoleMessages,
    pageErrors,
  });

  await context.close();
  await browser.close();
}

await fs.writeFile(`${outputDir}/report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
