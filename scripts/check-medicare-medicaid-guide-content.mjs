import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manuscriptPath = path.join(repoRoot, "docs/medicare-medicaid-guide-final-pre-pdf-manuscript.md");

const normalizeNewlines = (value) => value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
const manuscript = normalizeNewlines(readFileSync(manuscriptPath, "utf8"));
const routeOnlyBulletPattern = /^-\s+`?\/(articles|tools|guides|insurance|medicare-care-costs|disclosures|methodology|glossary)\b[^`\s]*`?\s*$/;

const getSection = (chapterBody, heading) => {
  const lines = chapterBody.split("\n");
  const target = `## ${heading}`.toLowerCase();
  const startIndex = lines.findIndex((line) => line.trim().toLowerCase() === target);
  if (startIndex === -1) return "";

  const sectionLines = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();
    if (/^##\s+/.test(trimmed) || /^---\s*$/.test(trimmed)) break;
    sectionLines.push(lines[index]);
  }
  return sectionLines.join("\n").trim();
};

const chapterBlocks = manuscript
  .split(/\n(?=#\s+Chapter\s+\d+\s+[—-]\s+)/)
  .filter((block) => block.trim().startsWith("# Chapter"));

const issues = [];

if (chapterBlocks.length !== 19) {
  issues.push(`Expected 19 chapters, found ${chapterBlocks.length}.`);
}

for (const block of chapterBlocks) {
  const heading = block.match(/^#\s+Chapter\s+(\d+)\s+[—-]\s+(.*)$/m);
  const chapterLabel = heading ? `Chapter ${heading[1]} — ${heading[2]}` : "Unknown chapter";
  const questions = getSection(block, "Questions to ask");

  if (!questions) {
    issues.push(`${chapterLabel}: missing Questions to ask section.`);
    continue;
  }

  for (const line of questions.split("\n")) {
    const trimmed = line.trim();
    if (routeOnlyBulletPattern.test(trimmed)) {
      issues.push(`${chapterLabel}: route-only bullet appears inside Questions to ask: ${trimmed}`);
    }
  }
}

const highRiskChapterNumbers = new Set([4, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18]);
for (const block of chapterBlocks) {
  const heading = block.match(/^#\s+Chapter\s+(\d+)\s+[—-]\s+(.*)$/m);
  if (!heading) continue;
  const number = Number(heading[1]);
  if (!highRiskChapterNumbers.has(number)) continue;

  const sourceNote = getSection(block, "Source note");
  if (!/Medicare\.gov|Medicaid\.gov|CMS|HealthCare\.gov/.test(sourceNote)) {
    issues.push(`Chapter ${number} — ${heading[2]}: high-risk chapter lacks an official-source source note.`);
  }
}

if (/guaranteed coverage|guarantees coverage|will automatically cover|automatically pays/i.test(manuscript)) {
  issues.push("Manuscript contains language that may imply guaranteed or automatic coverage/payment.");
}

if (issues.length > 0) {
  console.error("Medicare/Medicaid guide content preflight failed:");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log("Medicare/Medicaid guide content preflight passed.");
