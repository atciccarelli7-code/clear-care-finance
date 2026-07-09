import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolveQuickGuideIds, getQuickGuideDefinition } from "./quick-guide-definitions.mjs";

const normalizeNewlines = (value) => value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
const pageHeadingSource = "^#\\s+Page\\s+(\\d+)\\s+[\\u002d\\u2013\\u2014]\\s+(.*)$";
const pageHeadingPattern = new RegExp(pageHeadingSource, "m");
const splitPagePattern = new RegExp(`\\n(?=${pageHeadingSource})`, "gm");

const getSection = (block, heading) => {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = block.match(new RegExp(`^##\\s+${escaped}\\s*\\n([\\s\\S]*?)(?=\\n##\\s+|\\n---\\s*$|$)`, "m"));
  return match?.[1]?.trim() ?? "";
};

const hasSourceCue = (text, cues) =>
  cues.some((cue) => text.toLowerCase().includes(cue.toLowerCase()));

const blockedLanguageChecks = [
  {
    pattern: /guaranteed coverage|guarantees coverage|will automatically cover|automatically pays|must pay|always covered|everything is covered/i,
    message: "contains language that may imply guaranteed or automatic coverage/payment.",
  },
  {
    pattern: /affiliate|lead form|plan ranking|plan rankings|best plan|recommended insurer|insurer ranking|insurer rankings|plan recommendation|plan recommendations/i,
    message: "contains sales, ranking, affiliate, or lead-generation language.",
  },
  {
    pattern: /\$\d/,
    message: "contains dollar amounts. Keep quick guides evergreen unless dollar amounts are explicitly allowed.",
  },
  {
    pattern: /\bqr\b|qr\s*code/i,
    message: "contains public QR-code language. Keep QR references out of quick-guide page content until destination testing is complete.",
  },
];

export const checkQuickGuideContent = (ids = ["hospital-discharge-medicare-quick-guide"]) => {
  const issues = [];

  for (const id of ids) {
    const guide = getQuickGuideDefinition(id);
    const manuscript = normalizeNewlines(readFileSync(guide.sourceManuscriptPath, "utf8"));
    const [beforeEndnotes, endnotesMarkdown = ""] = manuscript.split(/\n# Endnotes and Source Map/);
    const pageBlocks = beforeEndnotes
      .split(splitPagePattern)
      .filter((block) => block.trim().startsWith("# Page"));
    const pageText = pageBlocks.join("\n");

    if (pageBlocks.length !== 10) {
      issues.push(`${guide.id}: expected 10 quick-guide pages, found ${pageBlocks.length}.`);
    }

    if (!endnotesMarkdown.trim()) {
      issues.push(`${guide.id}: missing Endnotes and Source Map section.`);
    }

    const pageNumbers = [];
    for (const block of pageBlocks) {
      const heading = block.match(pageHeadingPattern);
      const pageNumber = heading ? Number(heading[1]) : null;
      const pageLabel = heading ? `${guide.id} Page ${heading[1]} - ${heading[2]}` : `${guide.id} unknown page`;
      if (pageNumber) pageNumbers.push(pageNumber);

      const directAnswer = getSection(block, "Direct answer");
      if (!directAnswer) {
        issues.push(`${pageLabel}: missing Direct answer section.`);
      }

      const sourceNote = getSection(block, "Source note");
      if (!sourceNote) {
        issues.push(`${pageLabel}: missing Source note section.`);
      } else if (!hasSourceCue(sourceNote, guide.requiredSourceCues)) {
        issues.push(`${pageLabel}: source note is missing a guide-specific official-source cue.`);
      }
    }

    const expected = "1,2,3,4,5,6,7,8,9,10";
    if (pageNumbers.join(",") !== expected) {
      issues.push(`${guide.id}: expected pages ${expected} in order. Found: ${pageNumbers.join(",") || "none"}.`);
    }

    if (!/^\s*\[\d+\]/m.test(endnotesMarkdown)) {
      issues.push(`${guide.id}: Endnotes and Source Map has no numbered source entries.`);
    }

    for (const check of blockedLanguageChecks) {
      if (check.pattern.test(pageText)) {
        issues.push(`${guide.id}: ${check.message}`);
      }
    }

    if (!Array.isArray(guide.requiredSourceCues) || guide.requiredSourceCues.length === 0) {
      issues.push(`${guide.id}: definition is missing requiredSourceCues.`);
    }
  }

  if (issues.length > 0) {
    console.error("Quick guide content preflight failed:");
    for (const issue of issues) console.error(`- ${issue}`);
    return false;
  }

  console.log(`Quick guide content preflight passed for ${ids.join(", ")}.`);
  return true;
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const ids = resolveQuickGuideIds(process.argv.slice(2));
  if (!checkQuickGuideContent(ids)) process.exit(1);
}
