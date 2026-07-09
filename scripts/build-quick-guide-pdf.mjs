import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { repoRoot, resolveQuickGuideIds, getQuickGuideDefinition } from "./quick-guide-definitions.mjs";

const normalizeNewlines = (value) => value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
const pageHeadingSource = "^#\\s+Page\\s+(\\d+)\\s+[\\u002d\\u2013\\u2014]\\s+(.*)$";
const pageHeadingPattern = new RegExp(pageHeadingSource, "m");
const splitPagePattern = new RegExp(`\n(?=${pageHeadingSource})`, "gm");

const escapeHtml = (value = "") =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const inline = (value = "") =>
  escapeHtml(value)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, '<code class="breakable">$1</code>');

const splitLabel = (value) => {
  const strongMatch = value.match(/^\*\*(.*?):\*\*\s*(.*)$/);
  if (strongMatch) return { label: strongMatch[1], text: strongMatch[2] };

  const colonMatch = value.match(/^([^:]{2,48}):\s+(.*)$/);
  if (colonMatch) return { label: colonMatch[1], text: colonMatch[2] };

  return { label: null, text: value };
};

const parseSections = (markdown) => {
  const sections = [];
  let current = { heading: "", lines: [] };

  for (const rawLine of normalizeNewlines(markdown).trim().split(/\n/)) {
    const line = rawLine.trim();
    const headingMatch = line.match(/^##\s+(.*)$/);

    if (headingMatch) {
      if (current.heading || current.lines.some(Boolean)) sections.push(current);
      current = { heading: headingMatch[1].trim(), lines: [] };
      continue;
    }

    if (line !== "---") current.lines.push(rawLine);
  }

  if (current.heading || current.lines.some(Boolean)) sections.push(current);
  return sections;
};

const parsePage = (rawPage) => {
  const pageBody = normalizeNewlines(rawPage);
  const titleMatch = pageBody.match(pageHeadingPattern);
  if (!titleMatch) return null;

  const [, number, title] = titleMatch;
  const body = pageBody.replace(pageHeadingPattern, "").trim();
  return { number: Number(number), title, body };
};

export const parseQuickGuideManuscript = (guide) => {
  const markdown = normalizeNewlines(readFileSync(guide.sourceManuscriptPath, "utf8"));
  const [beforeEndnotes, endnotesMarkdown = ""] = markdown.split(/\n# Endnotes and Source Map/);
  const pageBlocks = beforeEndnotes
    .split(splitPagePattern)
    .filter((block) => block.trim().startsWith("# Page"));
  const pages = pageBlocks.map(parsePage).filter(Boolean);

  if (pages.length !== 10) {
    throw new Error(`${guide.id}: expected 10 quick-guide pages, found ${pages.length}.`);
  }

  const pageNumbers = pages.map((page) => page.number).join(",");
  if (pageNumbers !== "1,2,3,4,5,6,7,8,9,10") {
    throw new Error(`${guide.id}: expected pages 1 through 10 in order. Found: ${pageNumbers}`);
  }

  return { pages, endnotesMarkdown };
};

const renderTopbar = (current, label = `Page ${current} of 10`) => `
  <div class="topbar">
    <div class="brand">Community Acquired Finance</div>
    <div class="guide-label">Hospital-family quick guide</div>
    <div class="page-num">${escapeHtml(label)}</div>
  </div>`;

const renderCoverPathway = (guide) => `<div class="cover-pathway" aria-label="First five checks">${guide.coverPathway
  .map(([number, label, text]) => `<div class="cover-step"><strong>Step ${escapeHtml(number)}: ${inline(label)}</strong><p>${inline(text)}</p></div>`)
  .join("\n")}</div>`;

const renderClearCarePath = (guide, pageNumber) => {
  const steps = guide.pageThemeMap?.[pageNumber]?.clearCarePath;
  if (!steps?.length) return "";

  return `<aside class="clear-care-path" aria-label="Clear Care Path">
    <div class="clear-care-path-head">
      <strong>Clear Care Path</strong>
      <span>Work the question in this order.</span>
    </div>
    <div class="clear-care-path-grid">
      ${steps
        .map(
          ([label, text], index) => `
        <div class="clear-care-path-step">
          <div class="step-count">${index + 1}</div>
          <strong>${inline(label)}</strong>
          <p>${inline(text)}</p>
        </div>`,
        )
        .join("\n")}
    </div>
  </aside>`;
};

const renderBullet = (item) => {
  const { label, text } = splitLabel(item);
  if (label) return `<li><strong>${inline(label)}:</strong> ${inline(text)}</li>`;
  return `<li>${inline(item)}</li>`;
};

const renderPlainBlocks = (lines) => {
  const html = [];
  let list = [];

  const flushList = () => {
    if (list.length) {
      html.push(`<ul>${list.map((item) => renderBullet(item)).join("\n")}</ul>`);
      list = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      continue;
    }

    if (line.startsWith("- ")) {
      list.push(line.slice(2));
      continue;
    }

    flushList();

    if (line.startsWith("> ")) html.push(`<blockquote>${inline(line.slice(2))}</blockquote>`);
    else if (line.startsWith("### ")) html.push(`<h3>${inline(line.slice(4))}</h3>`);
    else html.push(`<p>${inline(line)}</p>`);
  }

  flushList();
  return html.join("\n");
};

const sectionClass = (heading) => {
  const key = heading.toLowerCase();
  if (key.includes("source")) return "source-note";
  if (key.includes("direct answer")) return "direct-answer";
  if (key.includes("script") || key.includes("ask") || key.includes("call")) return "section action-section";
  if (key.includes("watch") || key.includes("avoid") || key.includes("risk")) return "section caution-section";
  return "section";
};

const renderSection = (section) => {
  const heading = escapeHtml(section.heading);
  const lines = section.lines.filter((line) => line.trim());
  const klass = sectionClass(section.heading);

  if (klass === "direct-answer") {
    return `<section class="direct-answer"><div class="section-label">Direct answer</div>${renderPlainBlocks(lines)}</section>`;
  }

  if (klass === "source-note") {
    return `<section class="source-note"><strong>Source note:</strong> ${renderPlainBlocks(lines).replace(/^<p>|<\/p>$/g, "")}</section>`;
  }

  return `<section class="${klass}"><h2>${heading}</h2>${renderPlainBlocks(lines)}</section>`;
};

const renderPageBody = (guide, page) => {
  const sections = parseSections(page.body);
  const html = [];

  for (const section of sections) {
    html.push(renderSection(section));
    if (section.heading.toLowerCase() === "direct answer") {
      html.push(renderClearCarePath(guide, page.number));
    }
  }

  return html.join("\n");
};

const renderEndnotes = (markdown) => {
  const links = normalizeNewlines(markdown)
    .trim()
    .split(/\n+/)
    .filter(Boolean)
    .map((line) => line.replace(/^\[\d+\]\s+/, ""));

  return `<ol class="source-list">${links.map((line) => `<li>${inline(line)}</li>`).join("\n")}</ol>`;
};

const renderHtml = (guide, pages, endnotesMarkdown) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(guide.title)}</title>
  <style>
    @page { size: letter; margin: 0.36in 0.42in; }
    :root {
      --ink:#14211f;
      --muted:#52615d;
      --line:#c7d2ce;
      --line-dark:#6d7f79;
      --soft:#f5faf8;
      --accent:#0b5d4e;
      --accent-soft:#eaf5f2;
      --warn:#fff7e8;
      --ask:#edf5fa;
    }
    * { box-sizing: border-box; }
    html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { margin: 0; color: var(--ink); background: white; font: 8.8pt/1.24 Arial, Helvetica, sans-serif; text-rendering: optimizeLegibility; }
    h1,h2,h3,p { margin-top: 0; }
    h1 { font-size: 18pt; line-height: 1.05; margin: 0 0 0.035in; }
    h2 { font-size: 9.1pt; line-height: 1.1; margin: 0 0 0.035in; color: var(--accent); }
    h3 { font-size: 8.2pt; line-height: 1.12; margin: 0.04in 0 0.02in; color: var(--accent); }
    p { margin: 0 0 0.035in; }
    strong { font-weight: 800; }
    code,.breakable { font-family: Arial, Helvetica, sans-serif; font-size: 6.2pt; overflow-wrap: anywhere; word-break: break-word; }
    .page { page-break-after: always; break-after: page; min-height: 9.95in; display: flex; flex-direction: column; gap: 0.06in; }
    .page:last-child { page-break-after: auto; break-after: auto; }
    .topbar { display: grid; grid-template-columns: 2.25in 1fr 1in; gap: 0.1in; align-items: center; border-bottom: 2px solid var(--accent); padding-bottom: 0.035in; }
    .brand { font-size: 6.8pt; font-weight: 850; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); }
    .guide-label { font-size: 6.5pt; color: var(--muted); text-align: center; text-transform: uppercase; letter-spacing: 0.06em; }
    .page-num { font-size: 6.5pt; font-weight: 800; color: var(--muted); text-align: right; text-transform: uppercase; letter-spacing: 0.05em; }
    .cover-hero { border: 1px solid var(--line); border-top: 5px solid var(--accent); background: var(--soft); padding: 0.12in 0.14in; }
    .cover-title h1 { font-size: 24pt; line-height: 1.02; margin-bottom: 0.045in; }
    .eyebrow { font-size: 6.6pt; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); font-weight: 850; margin-bottom: 0.025in; }
    .subtitle,.byline { color: var(--muted); font-size: 7.4pt; line-height: 1.18; max-width: 7.1in; margin-bottom: 0.035in; }
    .cover-strip { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.04in; margin-top: 0.06in; }
    .cover-chip { border-top: 2px solid var(--accent); background: white; padding: 0.045in; font-size: 6.8pt; font-weight: 800; text-align: center; }
    .cover-pathway { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.04in; }
    .cover-step { border: 1px solid var(--line); background: white; padding: 0.055in; min-height: 0.46in; }
    .cover-step strong { display: block; color: var(--accent); font-size: 6.8pt; margin-bottom: 0.018in; }
    .cover-step p { color: var(--muted); font-size: 6.5pt; line-height: 1.1; margin: 0; }
    .page-title { border-bottom: 1px solid var(--line-dark); padding-bottom: 0.04in; }
    .page-title .eyebrow { margin-bottom: 0.018in; }
    .page-title .subtitle { margin: 0; font-size: 7.1pt; }
    .content { display: grid; gap: 0.052in; }
    .direct-answer { border-left: 4px solid var(--accent); background: var(--accent-soft); padding: 0.065in 0.075in; }
    .direct-answer p { font-size: 9.2pt; line-height: 1.16; font-weight: 750; margin: 0; }
    .section-label { font-size: 6.2pt; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); font-weight: 900; margin-bottom: 0.02in; }
    .clear-care-path { border: 1px solid var(--line); border-left: 4px solid var(--accent); background: var(--soft); padding: 0.055in 0.065in; break-inside: avoid; page-break-inside: avoid; }
    .clear-care-path-head { display: flex; align-items: baseline; justify-content: space-between; gap: 0.12in; border-bottom: 1px solid var(--line); padding-bottom: 0.032in; margin-bottom: 0.045in; }
    .clear-care-path-head strong { color: var(--accent); font-size: 8pt; text-transform: uppercase; letter-spacing: 0.07em; }
    .clear-care-path-head span { color: var(--muted); font-size: 6.6pt; }
    .clear-care-path-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.045in; }
    .clear-care-path-step { background: white; border: 1px solid var(--line); padding: 0.045in; min-height: 0.52in; position: relative; }
    .clear-care-path-step:not(:last-child)::after { content: "→"; position: absolute; right: -0.038in; top: 50%; transform: translateY(-50%); color: var(--accent); font-weight: 850; font-size: 8pt; }
    .step-count { color: var(--muted); font-size: 5.7pt; font-weight: 850; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.012in; }
    .clear-care-path-step strong { display: block; color: var(--ink); font-size: 7.15pt; line-height: 1.08; margin-bottom: 0.012in; }
    .clear-care-path-step p { color: var(--muted); font-size: 6.45pt; line-height: 1.1; margin: 0; }
    .section { border-top: 1px solid var(--line); padding-top: 0.047in; break-inside: avoid; page-break-inside: avoid; }
    .action-section { background: var(--ask); border: 1px solid var(--line); padding: 0.055in 0.065in; }
    .caution-section { background: var(--warn); border: 1px solid var(--line); padding: 0.055in 0.065in; }
    ul { margin: 0; padding-left: 0.15in; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 0.16in; row-gap: 0.028in; }
    li { margin: 0; padding-left: 0.01in; line-height: 1.17; break-inside: avoid; page-break-inside: avoid; }
    li::marker { color: var(--accent); }
    li strong { color: var(--accent); }
    blockquote { margin: 0.035in 0; border-left: 3px solid var(--accent); padding-left: 0.06in; font-weight: 750; }
    .source-note { margin-top: auto; border-top: 1px solid var(--line); padding-top: 0.035in; color: var(--muted); font-size: 6pt; line-height: 1.1; }
    .source-note p { display: inline; margin: 0; }
    .footer { margin-top: auto; border-top: 1px solid var(--line); padding-top: 0.028in; font-size: 6pt; color: var(--muted); display: flex; justify-content: space-between; gap: 0.15in; }
    .source-map .source-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.04in 0.18in; padding-left: 0.18in; }
    .source-map .source-list li { font-size: 5.8pt; line-height: 1.11; }
    @media print {
      .cover-hero,.cover-chip,.cover-step,.direct-answer,.section,.action-section,.caution-section,.clear-care-path,.clear-care-path-step { box-shadow: none; }
    }
  </style>
</head>
<body>
  <section class="page cover">
    ${renderTopbar(1, "Quick Guide")}
    <div class="cover-hero">
      <div class="cover-title">
        <div class="eyebrow">${escapeHtml(guide.coverEyebrow)}</div>
        <h1>${escapeHtml(guide.title)}</h1>
        <p class="subtitle">${escapeHtml(guide.subtitle)}</p>
        <p class="byline">Written from a healthcare-worker perspective by Andrew Ciccarelli, RN, BSN. Educational only. Verify with official sources, plan documents, agency notices, SHIP, or a qualified professional.</p>
      </div>
      <div class="cover-strip">
        ${guide.coverChips.map((chip) => `<div class="cover-chip">${escapeHtml(chip)}</div>`).join("\n")}
      </div>
    </div>
    ${renderCoverPathway(guide)}
    <div class="content">
      ${renderPageBody(guide, pages[0])}
    </div>
    <div class="footer"><span>Educational only | Printable reference</span><span>Page 1 of 10</span></div>
  </section>
  ${pages.slice(1).map((page) => {
    const meta = guide.pageThemeMap[page.number] || {};
    return `
  <section class="page page-${page.number}">
    ${renderTopbar(page.number)}
    <div class="page-title">
      <div class="eyebrow">${escapeHtml(meta.eyebrow || "Quick guide")}</div>
      <h1>${escapeHtml(page.title)}</h1>
      <p class="subtitle">Use this page to ask better questions before signing, paying, enrolling, or appealing.</p>
    </div>
    <div class="content">
      ${renderPageBody(guide, page)}
    </div>
    <div class="footer"><span>Educational only | Verify before deciding</span><span>${escapeHtml(guide.title)}</span></div>
  </section>`;
  }).join("\n")}
  <section class="page source-map">
    ${renderTopbar(null, "Source map")}
    <div class="page-title">
      <div class="eyebrow">Optional trust layer</div>
      <h1>Endnotes and Source Map</h1>
      <p class="subtitle">Official sources used to keep the short guide grounded without turning it into a textbook.</p>
    </div>
    ${renderEndnotes(endnotesMarkdown)}
    <div class="footer"><span>Educational only | Optional source trail for review</span><span>Source map</span></div>
  </section>
</body>
</html>`;

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
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
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

export const buildQuickGuides = (ids = ["hospital-discharge-medicare-quick-guide"]) => {
  const chrome = findChrome();
  const built = [];

  for (const id of ids) {
    const guide = getQuickGuideDefinition(id);
    const { pages, endnotesMarkdown } = parseQuickGuideManuscript(guide);
    const html = renderHtml(guide, pages, endnotesMarkdown);
    const outputDir = path.dirname(guide.outputHtmlPath);

    mkdirSync(outputDir, { recursive: true });
    writeFileSync(guide.outputHtmlPath, html, "utf8");
    console.log(`${guide.id}: parsed ${pages.length} quick-guide pages.`);
    console.log(`${guide.id}: wrote ${path.relative(repoRoot, guide.outputHtmlPath)}`);

    if (!chrome) {
      console.warn(`${guide.id}: Chrome/Chromium/Edge was not found. Set CHROME_PATH or open the generated HTML and print to PDF manually.`);
      built.push({ guide, html: guide.outputHtmlPath, pdf: null });
      continue;
    }

    const result = spawnSync(
      chrome,
      [
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--no-pdf-header-footer",
        "--print-to-pdf-no-header",
        `--print-to-pdf=${guide.outputPdfPath}`,
        pathToFileURL(guide.outputHtmlPath).href,
      ],
      { encoding: "utf8", timeout: 120000 },
    );

    if (result.error) throw result.error;
    if (result.status !== 0) {
      console.error(result.stderr || result.stdout || `${guide.id}: Chrome PDF export failed.`);
      process.exit(result.status ?? 1);
    }

    console.log(`${guide.id}: wrote ${path.relative(repoRoot, guide.outputPdfPath)}`);
    if (!guide.publicReleaseAllowed) {
      console.log(`${guide.id}: preflight-only PDF; do not move to /public or link until release is approved.`);
    }
    built.push({ guide, html: guide.outputHtmlPath, pdf: guide.outputPdfPath });
  }

  return built;
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  buildQuickGuides(resolveQuickGuideIds(process.argv.slice(2)));
}
