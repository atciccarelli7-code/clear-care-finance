import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manuscriptPath = path.join(repoRoot, "docs/medicare-medicaid-guide-final-pre-pdf-manuscript.md");
const outputDir = path.join(repoRoot, "docs/generated/medicare-medicaid-guide");
const htmlPath = path.join(outputDir, "hospital-family-guide-medicare-medicaid-preflight.html");
const pdfPath = path.join(outputDir, "hospital-family-guide-medicare-medicaid-preflight.pdf");

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");

const inline = (value) =>
  escapeHtml(value)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, '<code class="breakable">$1</code>');

const renderLooseMarkdown = (markdown, { compact = false } = {}) => {
  const lines = markdown.trim().split(/\r?\n/);
  const html = [];
  let listOpen = false;
  let orderedOpen = false;

  const closeLists = () => {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
    if (orderedOpen) {
      html.push("</ol>");
      orderedOpen = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line === "---") {
      closeLists();
      continue;
    }

    if (line.startsWith("- ")) {
      if (orderedOpen) {
        html.push("</ol>");
        orderedOpen = false;
      }
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${inline(line.slice(2))}</li>`);
      continue;
    }

    const orderedMatch = line.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch) {
      if (listOpen) {
        html.push("</ul>");
        listOpen = false;
      }
      if (!orderedOpen) {
        html.push("<ol>");
        orderedOpen = true;
      }
      html.push(`<li>${inline(orderedMatch[1])}</li>`);
      continue;
    }

    closeLists();

    if (line.startsWith("> ")) {
      html.push(`<blockquote>${inline(line.slice(2))}</blockquote>`);
    } else if (line.startsWith("#### ")) {
      html.push(`<h4>${inline(line.slice(5))}</h4>`);
    } else if (line.startsWith("### ")) {
      html.push(`<h3>${inline(line.slice(4))}</h3>`);
    } else if (line.startsWith("## ")) {
      html.push(`<h3>${inline(line.slice(3))}</h3>`);
    } else if (line.startsWith("# ")) {
      html.push(`<h2>${inline(line.slice(2))}</h2>`);
    } else {
      html.push(`<p${compact ? ' class="small"' : ""}>${inline(line)}</p>`);
    }
  }

  closeLists();
  return html.join("\n");
};

const getSection = (chapterBody, heading) => {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`## ${escaped}\\n([\\s\\S]*?)(?=\\n## |$)`, "m");
  return chapterBody.match(regex)?.[1]?.trim() ?? "";
};

const parseChapter = (rawChapter) => {
  const titleMatch = rawChapter.match(/^# Chapter (\d+) — (.*)$/m);
  if (!titleMatch) return null;

  const [, number, title] = titleMatch;
  return {
    number,
    title,
    directAnswer: getSection(rawChapter, "Direct answer"),
    explanation: getSection(rawChapter, "Plain-English explanation"),
    misunderstanding: getSection(rawChapter, "Common misunderstanding"),
    example: getSection(rawChapter, "Hospital/caregiver example"),
    questions: getSection(rawChapter, "Questions to ask"),
    tools: getSection(rawChapter, "Related site tools"),
    source: getSection(rawChapter, "Source note"),
  };
};

const parseWorksheets = (worksheetMarkdown) => {
  const blocks = worksheetMarkdown
    .split(/\n(?=## )/)
    .map((block) => block.trim())
    .filter((block) => block.startsWith("## "));

  return blocks.map((block) => {
    const [, title = "Worksheet"] = block.match(/^## (.*)$/m) ?? [];
    const lines = block.split(/\r?\n/).slice(1);
    const rows = lines
      .map((line) => line.trim())
      .filter((line) => line.startsWith("- "))
      .map((line) => line.slice(2));
    return { title, rows };
  });
};

const renderWorksheet = ({ title, rows }) => `
  <section class="page worksheet">
    <h2>${escapeHtml(title)}</h2>
    <p class="small">Use this page to organize questions and notes. Educational only; verify details with official sources, the plan, the facility, the billing office, SHIP, or a qualified professional.</p>
    <div class="worksheet-card">
      ${rows.map((row) => `<div class="worksheet-row"><strong>${inline(row)}:</strong><span></span></div>`).join("\n")}
    </div>
    <div class="footer"><span>Community Acquired Finance | Educational only</span><span>Worksheet</span></div>
  </section>`;

const renderChapter = (chapter) => `
  <section class="page chapter">
    <div class="chapter-title">
      <div class="chapter-number">Chapter ${chapter.number}</div>
      <h2>${escapeHtml(chapter.title)}</h2>
    </div>

    <div class="answer keep">
      <div class="label">Direct answer</div>
      ${renderLooseMarkdown(chapter.directAnswer)}
    </div>

    <h3>Plain-English explanation</h3>
    ${renderLooseMarkdown(chapter.explanation)}

    <div class="callout keep-soft">
      <div class="label">Common misunderstanding</div>
      ${renderLooseMarkdown(chapter.misunderstanding)}
    </div>

    <div class="example keep-soft">
      <div class="label">Hospital/caregiver example</div>
      ${renderLooseMarkdown(chapter.example)}
    </div>

    <h3>Questions to ask</h3>
    ${renderLooseMarkdown(chapter.questions)}

    <div class="tools keep-soft">
      <div>
        <div class="label">Related site tools</div>
        ${renderLooseMarkdown(chapter.tools, { compact: true })}
      </div>
      <div class="qr">QR PLACEHOLDER<br />DO NOT PRINT FINAL UNTIL URL IS LIVE AND TESTED</div>
    </div>

    <div class="source keep-soft">${renderLooseMarkdown(chapter.source, { compact: true })}</div>
    <div class="footer"><span>Community Acquired Finance | Educational only</span><span>Draft preflight</span></div>
  </section>`;

const findChrome = () => {
  const candidates = [
    process.env.CHROME_PATH,
    process.env.PUPPETEER_EXECUTABLE_PATH,
    "google-chrome",
    "google-chrome-stable",
    "chromium",
    "chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (candidate.includes(path.sep) && existsSync(candidate)) return candidate;
    if (!candidate.includes(path.sep)) {
      const result = spawnSync(process.platform === "win32" ? "where" : "which", [candidate], { encoding: "utf8" });
      if (result.status === 0) return candidate;
    }
  }

  return null;
};

const markdown = readFileSync(manuscriptPath, "utf8");
const [beforeWorksheets, afterWorksheets = ""] = markdown.split("\n# Worksheet Drafts for Final PDF");
const chapterBlocks = beforeWorksheets.split(/\n(?=# Chapter \d+ — )/).filter((block) => block.startsWith("# Chapter"));
const chapters = chapterBlocks.map(parseChapter).filter(Boolean);
const [worksheetMarkdown = "", endnoteMarkdown = ""] = afterWorksheets.split("\n# Endnotes and Source Map");
const worksheets = parseWorksheets(worksheetMarkdown);
const endnotes = `# Endnotes and Source Map${endnoteMarkdown}`;

if (chapters.length !== 19) {
  console.warn(`Expected 19 chapters, found ${chapters.length}. Continue with caution.`);
}

if (worksheets.length === 0) {
  console.warn("No worksheets parsed. Continue with caution.");
}

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>The Hospital Family Guide to Medicare, Medicaid, Rehab, and Long-Term Care</title>
  <style>
    @page { size: letter; margin: 0.65in 0.7in; }
    :root { --ink:#171717; --muted:#4f555c; --line:#c9d1d9; --soft:#f3f5f7; --accent:#1f4d5a; --accent-soft:#edf6f8; }
    * { box-sizing: border-box; }
    body { margin: 0; color: var(--ink); background: white; font: 11pt/1.48 Georgia, "Times New Roman", serif; overflow-wrap: anywhere; }
    h1,h2,h3,h4,.sans,.label,.footer,.toc,.qr,.worksheet,.eyebrow { font-family: Arial, Helvetica, sans-serif; }
    h1 { font-size: 28pt; line-height: 1.08; margin: 0 0 0.22in; }
    h2 { font-size: 18pt; line-height: 1.2; margin: 0 0 0.16in; break-after: avoid; page-break-after: avoid; }
    h3 { font-size: 12.5pt; line-height: 1.25; margin: 0.18in 0 0.06in; break-after: avoid; page-break-after: avoid; }
    h4 { font-size: 10pt; line-height: 1.25; margin: 0.14in 0 0.05in; break-after: avoid; page-break-after: avoid; }
    p { margin: 0 0 0.11in; orphans: 3; widows: 3; }
    ul,ol { margin: 0.05in 0 0.14in 0.22in; padding: 0; }
    li { margin: 0.04in 0; orphans: 2; widows: 2; }
    blockquote { border-left: 5px solid var(--accent); margin: 0.14in 0; padding: 0.02in 0 0.02in 0.14in; }
    code,.breakable { font-family: Arial, Helvetica, sans-serif; font-size: 8.6pt; overflow-wrap: anywhere; word-break: break-word; }
    .page { page-break-after: always; break-after: page; min-height: 9.35in; position: relative; padding-bottom: 0.18in; }
    .page:last-child { page-break-after: auto; break-after: auto; }
    .cover { display: grid; align-content: center; min-height: 9.35in; }
    .eyebrow { font-weight: 700; font-size: 9pt; line-height: 1.2; letter-spacing: .08em; text-transform: uppercase; color: var(--accent); margin-bottom: 0.16in; }
    .subtitle { font: 13.5pt/1.35 Arial, Helvetica, sans-serif; color: var(--muted); max-width: 6.5in; }
    .byline { margin-top: 0.45in; font: 10pt/1.4 Arial, Helvetica, sans-serif; color: var(--muted); }
    .notice,.answer,.example,.source,.qr-directory,.update-log,.worksheet-card { border: 1px solid var(--line); background: var(--soft); padding: 0.14in; margin: 0.14in 0; }
    .answer { border: 1.5px solid var(--accent); background: var(--accent-soft); }
    .callout { border-left: 5px solid var(--accent); padding: 0.04in 0 0.04in 0.14in; margin: 0.16in 0; }
    .example { background: white; }
    .label { font-weight: 700; font-size: 8.5pt; letter-spacing: .04em; text-transform: uppercase; color: var(--accent); margin-bottom: 0.05in; }
    .chapter { page-break-before: always; break-before: page; }
    .chapter-title { border-bottom: 1px solid var(--line); padding-bottom: 0.12in; margin-bottom: 0.16in; }
    .chapter-number { font: 700 9pt/1.2 Arial, Helvetica, sans-serif; color: var(--accent); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 0.06in; }
    .tools { display: grid; grid-template-columns: minmax(0, 1fr) 1.25in; gap: 0.18in; align-items: start; border-top: 1px solid var(--line); padding-top: 0.12in; margin-top: 0.18in; }
    .qr { width: 1.25in; min-height: 1.25in; border: 2px dashed var(--muted); display: flex; align-items: center; justify-content: center; text-align: center; font-size: 7.1pt; color: var(--muted); padding: 0.08in; overflow-wrap: normal; }
    .source { font-size: 8.8pt; color: var(--muted); background: white; overflow-wrap: anywhere; }
    .source p { margin-bottom: 0; }
    .footer { position: static; margin-top: 0.22in; font-size: 8pt; color: var(--muted); border-top: 1px solid var(--line); padding-top: 0.06in; display: flex; justify-content: space-between; gap: 0.2in; }
    .toc ol { columns: 1; padding-left: 0.26in; }
    .toc li { break-inside: avoid; page-break-inside: avoid; margin-bottom: 0.055in; }
    .worksheet { page-break-before: always; break-before: page; }
    .worksheet-card { background: white; }
    .worksheet-row { border-bottom: 1px solid var(--line); min-height: 0.52in; padding: 0.1in 0; display: grid; grid-template-columns: 2.1in 1fr; gap: 0.14in; align-items: start; }
    .worksheet-row strong { font-family: Arial, Helvetica, sans-serif; font-size: 9.3pt; }
    .worksheet-row span { min-height: 0.3in; display: block; }
    .small { font-size: 9pt; color: var(--muted); }
    .keep { page-break-inside: avoid; break-inside: avoid; }
    .keep-soft { page-break-inside: avoid; break-inside: avoid; }
    @media print { a { text-decoration: none; } .page { break-after: page; } .chapter { break-before: page; } }
  </style>
</head>
<body>
  <section class="page cover">
    <div class="eyebrow">Community Acquired Finance</div>
    <h1>The Hospital Family Guide to Medicare, Medicaid, Rehab, and Long-Term Care</h1>
    <p class="subtitle">A plain-English guide for patients, caregivers, and families trying to understand discharge planning, rehab coverage, long-term care, Medicaid, and medical bills.</p>
    <p class="byline">Written from a healthcare-worker perspective by Andrew Ciccarelli, RN, BSN.</p>
    <div class="notice small">Draft preflight PDF. Do not publish until final source/dollar amount recheck, QR testing, PDF preflight, and approval are complete.</div>
    <div class="footer"><span>Educational only</span><span>Draft preflight</span></div>
  </section>

  <section class="page">
    <h2>Educational disclaimer</h2>
    <div class="notice"><p>This guide is educational only. It is not medical, legal, tax, insurance, Medicaid planning, or individualized financial advice. It does not replace Medicare.gov, Medicaid.gov, CMS, state Medicaid agencies, plan documents, billing offices, SHIP counselors, clinicians, attorneys, licensed insurance professionals, or other qualified professionals. Rules can vary by state, plan, facility, timing, and personal circumstances. Verify before making decisions.</p></div>
    <h2>How to use this guide</h2>
    <p>Start with the situation in front of you: discharge, rehab, home health, long-term care, Medicaid, a denial, or a bill. Then ask which payer is involved, what rule applies, what documentation exists, what the patient may owe, and where the answer can be verified.</p>
    <div class="footer"><span>Community Acquired Finance | Educational only</span><span>Draft preflight</span></div>
  </section>

  <section class="page toc">
    <h2>Table of contents</h2>
    <ol>${chapters.map((chapter) => `<li>${escapeHtml(chapter.title)}</li>`).join("\n")}</ol>
    <div class="footer"><span>Community Acquired Finance | Educational only</span><span>Table of contents</span></div>
  </section>

  ${chapters.map(renderChapter).join("\n")}

  ${worksheets.map(renderWorksheet).join("\n")}

  <section class="page">
    <h2>Endnotes and source map</h2>
    ${renderLooseMarkdown(endnotes, { compact: true })}
    <div class="footer"><span>Community Acquired Finance | Educational only</span><span>Sources</span></div>
  </section>

  <section class="page">
    <h2>QR and tool directory</h2>
    <div class="qr-directory">
      <div class="tools"><div><div class="label">Guide landing page</div><p><code class="breakable">/guides/medicare-medicaid-rehab-long-term-care</code></p></div><div class="qr">QR PLACEHOLDER<br />DO NOT PRINT FINAL</div></div>
      <div class="tools"><div><div class="label">Medicare cost exposure tool</div><p><code class="breakable">/medicare-care-costs#cost-estimator</code></p></div><div class="qr">QR PLACEHOLDER<br />DO NOT PRINT FINAL</div></div>
      <div class="tools"><div><div class="label">EOB-to-bill checker</div><p><code class="breakable">/tools/eob-to-bill-match-checker</code></p></div><div class="qr">QR PLACEHOLDER<br />DO NOT PRINT FINAL</div></div>
    </div>
    <div class="footer"><span>Community Acquired Finance | Educational only</span><span>QR placeholders</span></div>
  </section>
</body>
</html>`;

mkdirSync(outputDir, { recursive: true });
writeFileSync(htmlPath, html, "utf8");
console.log(`Wrote ${path.relative(repoRoot, htmlPath)}`);

const chrome = findChrome();
if (!chrome) {
  console.warn("Chrome/Chromium/Edge was not found. Set CHROME_PATH or open the generated HTML and print to PDF manually.");
  process.exitCode = 0;
} else {
  const result = spawnSync(
    chrome,
    [
      "--headless",
      "--disable-gpu",
      "--no-sandbox",
      "--print-to-pdf-no-header",
      `--print-to-pdf=${pdfPath}`,
      pathToFileURL(htmlPath).href,
    ],
    { encoding: "utf8" },
  );

  if (result.status !== 0) {
    console.error(result.stderr || result.stdout || "Chrome PDF export failed.");
    process.exit(result.status ?? 1);
  }

  console.log(`Wrote ${path.relative(repoRoot, pdfPath)}`);
  console.log("Do not move this PDF to /public or link it until preflight passes and release is approved.");
}
