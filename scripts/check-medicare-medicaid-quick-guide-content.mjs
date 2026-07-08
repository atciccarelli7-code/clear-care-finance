import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manuscriptPath = path.join(repoRoot, "docs/medicare-medicaid-quick-guide-pre-pdf-manuscript.md");

const normalizeNewlines = (value) => value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
const manuscript = normalizeNewlines(readFileSync(manuscriptPath, "utf8"));
const issues = [];

const pageBlocks = manuscript
  .split(/\n(?=#\s+Page\s+\d+\s+[—-]\s+)/)
  .filter((block) => block.trim().startsWith("# Page"));

if (pageBlocks.length !== 10) {
  issues.push(`Expected 10 quick-guide pages, found ${pageBlocks.length}.`);
}

const requiredSections = ["Direct answer", "Source note"];
const sourcePattern = /Medicare\.gov|Medicaid\.gov|CMS|HealthCare\.gov|Orientation page|full guide/i;

for (const block of pageBlocks) {
  const heading = block.match(/^#\s+Page\s+(\d+)\s+[—-]\s+(.*)$/m);
  const pageLabel = heading ? `Page ${heading[1]} — ${heading[2]}` : "Unknown page";

  for (const section of requiredSections) {
    const sectionPattern = new RegExp(`^##\\s+${section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "m");
    if (!sectionPattern.test(block)) {
      issues.push(`${pageLabel}: missing ${section} section.`);
    }
  }

  const sourceNoteMatch = block.match(/^##\s+Source note\s*\n([\s\S]*?)(?=\n##\s+|\n---\s*$|$)/m);
  const sourceNote = sourceNoteMatch?.[1]?.trim() ?? "";
  if (!sourcePattern.test(sourceNote)) {
    issues.push(`${pageLabel}: source note does not identify an official or bounded source.`);
  }
}

if (/guaranteed coverage|guarantees coverage|will automatically cover|automatically pays|must pay|always covered|everything is covered/i.test(manuscript)) {
  issues.push("Quick guide contains language that may imply guaranteed or automatic coverage/payment.");
}

if (/affiliate|lead form|plan ranking|best plan|recommended insurer/i.test(manuscript)) {
  issues.push("Quick guide contains sales, ranking, affiliate, or lead-generation language.");
}

if (/\$\d/.test(manuscript)) {
  issues.push("Quick guide contains dollar amounts. Keep the quick guide evergreen and verify dollar amounts in the full guide/tool layer.");
}

if (issues.length > 0) {
  console.error("Medicare/Medicaid quick guide content preflight failed:");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log("Medicare/Medicaid quick guide content preflight passed.");
