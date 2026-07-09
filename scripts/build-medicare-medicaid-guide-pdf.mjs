import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manuscriptPath = path.join(repoRoot, "docs/medicare-medicaid-guide-final-pre-pdf-manuscript.md");
const outputDir = path.join(repoRoot, "docs/generated/medicare-medicaid-guide");
const htmlPath = path.join(outputDir, "hospital-family-guide-medicare-medicaid-preflight.html");
const pdfPath = path.join(outputDir, "hospital-family-guide-medicare-medicaid-preflight.pdf");

const normalizeNewlines = (value) => value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

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
  if (!markdown?.trim()) return "";

  const lines = normalizeNewlines(markdown).trim().split(/\n/);
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

    if (line.startsWith("> ")) html.push(`<blockquote>${inline(line.slice(2))}</blockquote>`);
    else if (line.startsWith("#### ")) html.push(`<h4>${inline(line.slice(5))}</h4>`);
    else if (line.startsWith("### ")) html.push(`<h3>${inline(line.slice(4))}</h3>`);
    else if (line.startsWith("## ")) html.push(`<h3>${inline(line.slice(3))}</h3>`);
    else if (line.startsWith("# ")) html.push(`<h2>${inline(line.slice(2))}</h2>`);
    else html.push(`<p${compact ? ' class="small"' : ""}>${inline(line)}</p>`);
  }

  closeLists();
  return html.join("\n");
};

const getSection = (chapterBody, heading) => {
  const lines = normalizeNewlines(chapterBody).split("\n");
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

const countBullets = (markdown) =>
  normalizeNewlines(markdown)
    .split("\n")
    .filter((line) => line.trim().startsWith("- ")).length;

const requiredChapterFields = [
  ["directAnswer", "Direct answer"],
  ["explanation", "Plain-English explanation"],
  ["misunderstanding", "Common misunderstanding"],
  ["example", "Hospital/caregiver example"],
  ["questions", "Questions to ask"],
  ["tools", "Related site tools"],
  ["source", "Source note"],
];

const normalizeHeading = (value) => value.trim().toLowerCase();
const requiredHeadingLabels = new Map(requiredChapterFields.map(([, label]) => [normalizeHeading(label), label]));

const normalizeSectionForComparison = (value) =>
  normalizeNewlines(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");

const collectExpectedChapterSections = (rawChapter) => {
  const sections = Object.fromEntries(requiredChapterFields.map(([, label]) => [label, []]));
  let activeSection = null;

  for (const rawLine of normalizeNewlines(rawChapter).split("\n")) {
    const trimmed = rawLine.trim();
    const headingMatch = trimmed.match(/^##\s+(.*)$/);

    if (headingMatch) {
      activeSection = requiredHeadingLabels.get(normalizeHeading(headingMatch[1])) ?? null;
      continue;
    }

    if (/^#\s+/.test(trimmed) || /^---\s*$/.test(trimmed)) {
      activeSection = null;
      continue;
    }

    if (activeSection) sections[activeSection].push(rawLine);
  }

  return Object.fromEntries(
    Object.entries(sections).map(([label, lines]) => [label, lines.join("\n").trim()]),
  );
};

const parseChapter = (rawChapter) => {
  const chapterBody = normalizeNewlines(rawChapter);
  const titleMatch = chapterBody.match(/^#\s+Chapter\s+(\d+)\s+[—-]\s+(.*)$/m);
  if (!titleMatch) return null;

  const [, number, title] = titleMatch;
  return {
    number,
    title,
    raw: chapterBody,
    directAnswer: getSection(chapterBody, "Direct answer"),
    explanation: getSection(chapterBody, "Plain-English explanation"),
    misunderstanding: getSection(chapterBody, "Common misunderstanding"),
    example: getSection(chapterBody, "Hospital/caregiver example"),
    questions: getSection(chapterBody, "Questions to ask"),
    tools: getSection(chapterBody, "Related site tools"),
    source: getSection(chapterBody, "Source note"),
  };
};

const parseWorksheets = (worksheetMarkdown) => {
  const blocks = normalizeNewlines(worksheetMarkdown)
    .split(/\n(?=## )/)
    .map((block) => block.trim())
    .filter((block) => block.startsWith("## "));

  return blocks.map((block) => {
    const [, title = "Worksheet"] = block.match(/^## (.*)$/m) ?? [];
    const lines = block.split(/\n/).slice(1);
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
  </section>`;

const renderGuideMapVisual = () => `
  <div class="visual visual-overview">
    <div class="visual-title">Use the guide by matching the problem to the next verification step</div>
    <div class="flow five">
      <div class="flow-step"><span class="step-label">1</span><strong>Discharge</strong><small>Where is the patient going?</small></div>
      <div class="flow-step"><span class="step-label">2</span><strong>Coverage</strong><small>Which payer and rule applies?</small></div>
      <div class="flow-step"><span class="step-label">3</span><strong>Documents</strong><small>What notice, EOB, MSN, or bill exists?</small></div>
      <div class="flow-step"><span class="step-label">4</span><strong>Cost</strong><small>What could the patient owe?</small></div>
      <div class="flow-step"><span class="step-label">5</span><strong>Verify</strong><small>Who can confirm it in writing?</small></div>
    </div>
  </div>`;

const renderMedicareMedicaidVisual = () => `
  <div class="visual">
    <div class="visual-title">Medicare and Medicaid answer different questions</div>
    <div class="visual-grid two">
      <div class="visual-card">
        <div class="visual-kicker">Medicare</div>
        <strong>Federal health insurance</strong>
        <p>Usually tied to age, disability, or certain serious conditions. It asks whether a service fits a Medicare benefit and coverage rule.</p>
        <ul><li>Hospital, doctor, drug, rehab, and plan questions</li><li>Can still leave deductibles, copays, or coinsurance</li></ul>
      </div>
      <div class="visual-card">
        <div class="visual-kicker">Medicaid</div>
        <strong>State-administered assistance</strong>
        <p>Uses federal rules and state rules. It asks whether the person qualifies under state eligibility and service rules.</p>
        <ul><li>May matter for long-term services and supports</li><li>State agency verification is essential</li></ul>
      </div>
    </div>
  </div>`;

const renderBillComparisonVisual = () => `
  <div class="visual">
    <div class="visual-title">Do not review a confusing bill by itself</div>
    <div class="bill-grid">
      <div class="visual-card"><div class="visual-kicker">Provider bill</div><strong>What the provider says is owed</strong><p>Shows the charge, payment posted, and patient balance.</p></div>
      <div class="visual-card"><div class="visual-kicker">MSN or EOB</div><strong>What Medicare or the plan processed</strong><p>Shows allowed amount, payment, denial, and possible patient responsibility.</p></div>
      <div class="visual-card"><div class="visual-kicker">Next call</div><strong>What needs verification</strong><p>Ask the billing office or plan to explain mismatches before paying blindly.</p></div>
    </div>
  </div>`;

const renderDischargePathwayVisual = () => `
  <div class="visual">
    <div class="visual-title">Discharge planning usually has two tracks: care need and payer rule</div>
    <div class="pathway">
      <div class="path-node start"><strong>Hospital stay</strong><small>Confirm inpatient, outpatient, or observation status.</small></div>
      <div class="path-branches">
        <div class="path-node"><strong>Home health</strong><small>Ordered services, homebound status, equipment, plan rules.</small></div>
        <div class="path-node"><strong>SNF / rehab</strong><small>Skilled need, facility status, authorization, cost-sharing.</small></div>
        <div class="path-node"><strong>Long-term care</strong><small>Custodial needs, Medicaid/LTSS, private pay, state rules.</small></div>
      </div>
      <div class="path-node end"><strong>Before agreeing</strong><small>Ask who pays, what is approved, what can be owed, and what happens if coverage ends.</small></div>
    </div>
  </div>`;

const renderSnfTimelineVisual = () => `
  <div class="visual">
    <div class="visual-title">SNF coverage is short-term and rule-based</div>
    <div class="timeline">
      <div class="timeline-step"><span>Before SNF</span><strong>Qualifying rule</strong><small>Hospital status, skilled need, facility, and payer rules matter.</small></div>
      <div class="timeline-step"><span>Early stay</span><strong>Covered days may begin</strong><small>Cost-sharing can differ by day range and payer arrangement.</small></div>
      <div class="timeline-step"><span>Ongoing stay</span><strong>Review continues</strong><small>Coverage can depend on skilled need, documentation, and authorization.</small></div>
      <div class="timeline-step"><span>After skilled care</span><strong>Question changes</strong><small>Daily custodial help is a different payer and planning problem.</small></div>
    </div>
  </div>`;

const renderChapterVisual = (chapter) => {
  switch (Number(chapter.number)) {
    case 4:
      return renderMedicareMedicaidVisual();
    case 8:
      return renderBillComparisonVisual();
    case 10:
      return renderDischargePathwayVisual();
    case 12:
      return renderSnfTimelineVisual();
    default:
      return "";
  }
};

const renderChapter = (chapter) => `
  <section class="chapter">
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
    ${renderChapterVisual(chapter)}

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

const markdown = normalizeNewlines(readFileSync(manuscriptPath, "utf8"));
const [beforeWorksheets, afterWorksheets = ""] = markdown.split(/\n# Worksheet Drafts for Final PDF/);
const chapterBlocks = beforeWorksheets.split(/\n(?=#\s+Chapter\s+\d+\s+[—-]\s+)/).filter((block) => block.trim().startsWith("# Chapter"));
const chapters = chapterBlocks.map(parseChapter).filter(Boolean);
const [worksheetMarkdown = "", endnoteMarkdown = ""] = afterWorksheets.split(/\n# Endnotes and Source Map/);
const worksheets = parseWorksheets(worksheetMarkdown);
const endnotes = `# Endnotes and Source Map${endnoteMarkdown}`;

if (chapters.length !== 19) {
  console.error(`Expected 19 chapters, found ${chapters.length}.`);
  process.exit(1);
}

const missingChapterFields = [];
for (const chapter of chapters) {
  const expectedSections = collectExpectedChapterSections(chapter.raw);

  for (const [key, label] of requiredChapterFields) {
    if (!chapter[key]?.trim()) {
      missingChapterFields.push(`Chapter ${chapter.number} (${chapter.title}) missing ${label}`);
      continue;
    }

    const expectedSection = normalizeSectionForComparison(expectedSections[label]);
    const parsedSection = normalizeSectionForComparison(chapter[key]);
    if (expectedSection !== parsedSection) {
      missingChapterFields.push(`Chapter ${chapter.number} (${chapter.title}) parser did not preserve the full ${label} section`);
    }
  }

  if (countBullets(chapter.questions) < 2) {
    missingChapterFields.push(`Chapter ${chapter.number} (${chapter.title}) has fewer than 2 question bullets`);
  }

  if (countBullets(chapter.tools) < 1) {
    missingChapterFields.push(`Chapter ${chapter.number} (${chapter.title}) has no related tool bullets`);
  }
}

if (missingChapterFields.length > 0) {
  console.error("Manuscript parsing failed. Missing, incomplete, or truncated required chapter sections:");
  for (const issue of missingChapterFields) console.error(`- ${issue}`);
  process.exit(1);
}

if (worksheets.length === 0) {
  console.error("No worksheets parsed.");
  process.exit(1);
}

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>The Hospital Family Guide to Medicare, Medicaid, Rehab, and Long-Term Care</title>
  <style>
    @page { size: letter; margin: 0.6in 0.66in; }
    :root { --ink:#171717; --muted:#4f555c; --line:#aeb8c2; --soft:#f2f4f6; --accent:#1f4d5a; --accent-soft:#edf6f8; --paper:#fbfcfd; }
    * { box-sizing: border-box; }
    html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { margin: 0; color: var(--ink); background: white; font: 10.8pt/1.46 Georgia, "Times New Roman", serif; overflow-wrap: anywhere; text-rendering: optimizeLegibility; }
    h1,h2,h3,h4,.sans,.label,.footer,.toc,.qr,.worksheet,.eyebrow,.visual { font-family: Arial, Helvetica, sans-serif; }
    h1 { font-size: 26pt; line-height: 1.08; margin: 0 0 0.18in; max-width: 7in; }
    h2 { font-size: 17pt; line-height: 1.18; margin: 0 0 0.12in; break-after: avoid; page-break-after: avoid; }
    h3 { font-size: 12pt; line-height: 1.25; margin: 0.13in 0 0.045in; break-after: avoid; page-break-after: avoid; }
    h4 { font-size: 9.8pt; line-height: 1.25; margin: 0.1in 0 0.035in; break-after: avoid; page-break-after: avoid; }
    p { margin: 0 0 0.085in; orphans: 3; widows: 3; }
    ul,ol { margin: 0.035in 0 0.1in 0.2in; padding: 0; }
    li { margin: 0.025in 0; orphans: 2; widows: 2; }
    blockquote { border-left: 4px solid var(--accent); margin: 0.1in 0; padding: 0.01in 0 0.01in 0.12in; }
    code,.breakable { font-family: Arial, Helvetica, sans-serif; font-size: 8.4pt; overflow-wrap: anywhere; word-break: break-word; }
    .page { page-break-after: always; break-after: page; position: relative; padding-bottom: 0.08in; }
    .page:last-child { page-break-after: auto; break-after: auto; }
    .cover { display: grid; align-content: center; min-height: 9.1in; }
    .eyebrow { font-weight: 700; font-size: 8.8pt; line-height: 1.2; letter-spacing: .08em; text-transform: uppercase; color: var(--accent); margin-bottom: 0.13in; }
    .subtitle { font: 13pt/1.32 Arial, Helvetica, sans-serif; color: var(--muted); max-width: 6.5in; }
    .byline { margin-top: 0.34in; font: 9.7pt/1.35 Arial, Helvetica, sans-serif; color: var(--muted); }
    .notice,.answer,.example,.qr-directory,.worksheet-card { border: 1px solid var(--line); background: var(--soft); padding: 0.11in; margin: 0.1in 0; }
    .answer { border: 1.5px solid var(--accent); background: var(--accent-soft); }
    .answer p:last-child,.notice p:last-child,.example p:last-child,.source p:last-child,.visual p:last-child { margin-bottom: 0; }
    .callout { border-left: 4px solid var(--accent); padding: 0.025in 0 0.025in 0.12in; margin: 0.105in 0; }
    .example { background: white; }
    .label { font-weight: 700; font-size: 8.3pt; letter-spacing: .04em; text-transform: uppercase; color: var(--accent); margin-bottom: 0.035in; }
    .chapter { margin: 0 0 0.18in; }
    .chapter-title { border-top: 1.5px solid var(--accent); border-bottom: 1px solid var(--line); padding: 0.1in 0 0.08in; margin: 0.2in 0 0.105in; }
    .chapter-number { font: 700 8.8pt/1.2 Arial, Helvetica, sans-serif; color: var(--accent); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 0.04in; }
    .source { font-size: 8.4pt; color: var(--muted); background: white; border-top: 1px solid var(--line); padding-top: 0.06in; margin-top: 0.08in; overflow-wrap: anywhere; page-break-inside: auto; break-inside: auto; }
    .source p { margin-bottom: 0; }
    .footer { position: static; margin-top: 0.14in; font-size: 7.8pt; color: var(--muted); border-top: 1px solid var(--line); padding-top: 0.05in; display: flex; justify-content: space-between; gap: 0.18in; }
    .toc ol { columns: 1; padding-left: 0.24in; }
    .toc li { break-inside: avoid; page-break-inside: avoid; margin-bottom: 0.04in; }
    .worksheet { page-break-before: always; break-before: page; }
    .worksheet-card { background: white; }
    .worksheet-row { border-bottom: 1px solid var(--line); min-height: 0.5in; padding: 0.08in 0; display: grid; grid-template-columns: minmax(1.9in, 2.15in) 1fr; gap: 0.12in; align-items: start; }
    .worksheet-row strong { font-family: Arial, Helvetica, sans-serif; font-size: 9.1pt; }
    .worksheet-row span { min-height: 0.3in; display: block; }
    .small { font-size: 8.8pt; color: var(--muted); }
    .keep { page-break-inside: avoid; break-inside: avoid; }
    .keep-soft { page-break-inside: auto; break-inside: auto; }
    .visual { border: 1px solid var(--line); background: var(--paper); padding: 0.11in; margin: 0.115in 0 0.13in; page-break-inside: avoid; break-inside: avoid; }
    .visual-title { font-weight: 700; color: var(--accent); font-size: 9.4pt; line-height: 1.25; margin-bottom: 0.08in; }
    .visual-grid.two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.1in; }
    .visual-card,.flow-step,.path-node,.timeline-step { border: 1px solid #cbd3da; background: white; padding: 0.085in; }
    .visual-card strong,.flow-step strong,.path-node strong,.timeline-step strong { display: block; font-size: 9pt; line-height: 1.2; margin-bottom: 0.035in; }
    .visual-card p,.visual-card li,.flow-step small,.path-node small,.timeline-step small { font-size: 8.15pt; line-height: 1.3; color: var(--muted); }
    .visual-card ul { margin-bottom: 0; }
    .visual-kicker,.timeline-step span,.step-label { display: inline-block; font-size: 7.5pt; line-height: 1; letter-spacing: .05em; text-transform: uppercase; color: var(--accent); font-weight: 700; margin-bottom: 0.04in; }
    .flow { display: grid; gap: 0.08in; }
    .flow.five { grid-template-columns: repeat(5, minmax(0, 1fr)); }
    .bill-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.09in; }
    .pathway { display: grid; gap: 0.08in; }
    .path-branches { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.08in; }
    .path-node.start,.path-node.end { background: var(--accent-soft); border-color: var(--accent); }
    .timeline { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.08in; }
    .qr-directory .tools { display: grid; grid-template-columns: minmax(0, 1fr) 1.18in; gap: 0.12in; align-items: start; border-top: 1px solid var(--line); padding: 0.08in 0; }
    .qr { width: 1.18in; min-height: 1.18in; border: 2px dashed var(--muted); display: flex; align-items: center; justify-content: center; text-align: center; font-size: 6.8pt; color: var(--muted); padding: 0.07in; overflow-wrap: normal; }
    @media print { a { text-decoration: none; } .page { break-after: page; } }
  </style>
</head>
<body>
  <section class="page cover">
    <div class="eyebrow">Community Acquired Finance</div>
    <h1>The Hospital Family Guide to Medicare, Medicaid, Rehab, and Long-Term Care</h1>
    <p class="subtitle">A plain-English guide for adult children, spouses, caregivers, and families trying to help someone through discharge planning, rehab coverage, long-term care, Medicaid, and medical bills.</p>
    <p class="byline">Written from a healthcare-worker perspective by Andrew Ciccarelli, RN, BSN.</p>
    <div class="notice small">Draft preflight PDF. Do not publish until final source/dollar amount recheck, QR testing, PDF preflight, and approval are complete.</div>
    <div class="footer"><span>Educational only</span><span>Draft preflight</span></div>
  </section>

  <section class="page">
    <h2>Educational disclaimer</h2>
    <div class="notice"><p>This guide is educational only. It is not medical, legal, tax, insurance, Medicaid planning, or individualized financial advice. It does not replace Medicare.gov, Medicaid.gov, CMS, state Medicaid agencies, plan documents, billing offices, SHIP counselors, clinicians, attorneys, licensed insurance professionals, or other qualified professionals. Rules can vary by state, plan, facility, timing, and personal circumstances. Verify before making decisions.</p></div>
    <h2>How to use this guide</h2>
    <p>Start with the problem in front of you: discharge, rehab, home health, long-term care, Medicaid, a denial, or a bill. Write down the patient status, payer, facility, dates, reference numbers, and written notices before calling. Then verify the answer with the source that controls the decision.</p>
    ${renderGuideMapVisual()}
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
console.log(`Parsed ${chapters.length} chapters and ${worksheets.length} worksheets.`);
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
      "--no-pdf-header-footer",
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
