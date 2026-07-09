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

const iconFor = (value = "") => {
  const key = value.toLowerCase();
  if (key.includes("hospital") || key.includes("inpatient") || key.includes("status")) return "STAT";
  if (key.includes("rehab") || key.includes("skilled") || key.includes("snf")) return "REH";
  if (key.includes("home") || key.includes("equipment") || key.includes("supplier")) return "HOME";
  if (key.includes("long-term") || key.includes("custodial") || key.includes("daily")) return "LTC";
  if (key.includes("bill") || key.includes("pay") || key.includes("owe") || key.includes("cost")) return "BILL";
  if (key.includes("medicaid")) return "MCD";
  if (key.includes("medicare advantage") || key.includes("plan") || key.includes("authorization")) return "AUTH";
  if (key.includes("original medicare") || key.includes("medicare")) return "MED";
  if (key.includes("ship")) return "SHIP";
  if (key.includes("ask") || key.includes("question") || key.includes("call")) return "ASK";
  if (key.includes("warning") || key.includes("watch") || key.includes("risk") || key.includes("denied")) return "RISK";
  if (key.includes("document") || key.includes("notice") || key.includes("paperwork") || key.includes("eob") || key.includes("msn")) return "DOC";
  return "CHK";
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

const renderProgressRail = (current) => {
  const dots = Array.from({ length: 10 }, (_, index) => {
    const page = index + 1;
    const currentClass = page === current ? " is-current" : "";
    const pastClass = page < current ? " is-past" : "";
    return `<span class="progress-dot${currentClass}${pastClass}">${page}</span>`;
  }).join("");

  return `<div class="progress-rail" aria-label="Quick guide progress">${dots}</div>`;
};

const renderTopbar = (current, label = `Page ${current} of 10`) => `
  <div class="topbar">
    <div class="brand">Community Acquired Finance</div>
    ${Number.isInteger(current) ? renderProgressRail(current) : ""}
    <div class="page-num">${escapeHtml(label)}</div>
  </div>`;

const renderDecisionStrip = (guide, pageNumber) => {
  const cues = guide.pageThemeMap[pageNumber]?.cues || ["Identify", "Verify", "Document"];
  return `<div class="decision-strip">${cues
    .map((cue, index) => `<div class="decision-pill"><span>${index + 1}</span><strong>${inline(cue)}</strong></div>`)
    .join("\n")}</div>`;
};

const renderCoverPathway = (guide) => `<div class="cover-pathway" aria-label="First five checks">${guide.coverPathway
  .map(([number, label, text]) => `<div class="cover-step"><span>${number}</span><strong>${inline(label)}</strong><p>${inline(text)}</p></div>`)
  .join("\n")}</div>`;

const renderReferenceRow = (item, index = 0, tone = "standard") => {
  const { label, text } = splitLabel(item);
  const marker = tone === "flow" ? String(index + 1) : iconFor(label || text);
  const labelHtml = label ? `<strong>${inline(label)}</strong>` : "";

  return `<li><span>${escapeHtml(marker)}</span><p>${labelHtml}${labelHtml ? " — " : ""}${inline(text)}</p></li>`;
};

const renderPlainBlocks = (lines, tone = "standard") => {
  const html = [];
  let list = [];

  const flushList = () => {
    if (list.length) {
      html.push(`<ul class="reference-list tone-${tone}">${list.map((item, index) => renderReferenceRow(item, index, tone)).join("\n")}</ul>`);
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

const sectionTone = (heading) => {
  const key = heading.toLowerCase();
  if (key.includes("watch") || key.includes("warning") || key.includes("risk") || key.includes("avoid")) return "warning";
  if (key.includes("ask") || key.includes("question") || key.includes("script") || key.includes("call")) return "ask";
  if (key.includes("compare") || key.includes("sort") || key.includes("know") || key.includes("real life")) return "compare";
  if (key.includes("path") || key.includes("timeline") || key.includes("first move") || key.includes("next step") || key.includes("checklist")) return "flow";
  if (key.includes("source")) return "source";
  return "standard";
};

const renderSection = (guide, section, pageNumber) => {
  const tone = sectionTone(section.heading);
  const heading = escapeHtml(section.heading);
  const lines = section.lines.filter((line) => line.trim());
  const icon = iconFor(section.heading);

  if (section.heading.toLowerCase() === "direct answer") {
    const meta = guide.pageThemeMap[pageNumber] || {};
    return `<section class="answer-panel">
      <div class="answer-icon">${escapeHtml(meta.icon || String(pageNumber))}</div>
      <div><div class="section-kicker">Core idea</div>${renderPlainBlocks(lines)}</div>
    </section>`;
  }

  if (tone === "source") {
    return `<section class="source-note"><div class="section-kicker">Source note</div>${renderPlainBlocks(lines, tone)}</section>`;
  }

  return `<section class="reference-section tone-${tone}"><h2><span>${escapeHtml(icon)}</span>${heading}</h2>${renderPlainBlocks(lines, tone)}</section>`;
};

const renderPageBody = (guide, page) => {
  const sections = parseSections(page.body);
  const renderedSections = sections.map((section) => renderSection(guide, section, page.number)).join("\n");

  if (page.number === 1) return renderedSections;
  return `${renderDecisionStrip(guide, page.number)}\n${renderedSections}`;
};

const renderEndnotes = (markdown) => {
  const links = normalizeNewlines(markdown)
    .trim()
    .split(/\n+/)
    .filter(Boolean)
    .map((line) => line.replace(/^\[\d+\]\s+/, ""));

  return `<div class="source-list">${links.map((line, index) => `<div class="source-item"><span>${index + 1}</span><p>${inline(line)}</p></div>`).join("\n")}</div>`;
};

const renderHtml = (guide, pages, endnotesMarkdown) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(guide.title)}</title>
  <style>
    @page { size: letter; margin: 0.34in 0.4in; }
    :root {
      --ink:#12211f; --muted:#52625f; --line:#bdccc7; --line-dark:#7d918b;
      --soft:#f6faf9; --panel:#ffffff; --accent:#0b5d4e; --accent-2:#2d7c76;
      --accent-soft:#e7f4f1; --ask:#edf4fb; --warn:#fff5e8; --compare:#edf7f5; --flow:#f4f7f8;
      --page-accent: var(--accent); --page-accent-2: var(--accent-2); --page-soft: var(--accent-soft);
      --shadow: 0 2px 7px rgba(19,35,32,.045);
    }
    * { box-sizing: border-box; }
    html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { margin: 0; color: var(--ink); background: white; font: 8.55pt/1.18 Arial, Helvetica, sans-serif; overflow-wrap: anywhere; text-rendering: optimizeLegibility; }
    h1,h2,h3,p { margin-top: 0; }
    h1 { font-size: 18.2pt; line-height: 1.02; margin-bottom: 0.024in; }
    h2 { font-size: 9.2pt; line-height: 1.08; margin: 0 0 0.032in; }
    h3 { font-size: 8.05pt; line-height: 1.1; margin: 0.042in 0 0.018in; color:var(--page-accent); }
    p { margin: 0 0 0.03in; }
    code,.breakable { font-family: Arial, Helvetica, sans-serif; font-size: 6pt; overflow-wrap: anywhere; word-break: break-word; }
    .page { page-break-after: always; break-after: page; min-height: 9.96in; position: relative; display: flex; flex-direction: column; gap: 0.046in; --page-accent: var(--accent); --page-accent-2: var(--accent-2); --page-soft: var(--accent-soft); }
    .page:last-child { page-break-after: auto; break-after: auto; }
    .theme-warning { --page-accent:#a86112; --page-accent-2:#c98623; --page-soft:#fff4e3; }
    .theme-program { --page-accent:#315f80; --page-accent-2:#4f83a6; --page-soft:#edf4fb; }
    .theme-coverage { --page-accent:#345c8c; --page-accent-2:#5e7fa8; --page-soft:#eef3fb; }
    .theme-status { --page-accent:#6a4d99; --page-accent-2:#8d70b5; --page-soft:#f2eefb; }
    .theme-pathway { --page-accent:#0c5c4d; --page-accent-2:#2b7a78; --page-soft:#e7f4f1; }
    .theme-rehab { --page-accent:#7a4e19; --page-accent-2:#a27130; --page-soft:#fbf1e5; }
    .theme-home { --page-accent:#2f6b4f; --page-accent-2:#5c916f; --page-soft:#edf7f0; }
    .theme-billing { --page-accent:#49606d; --page-accent-2:#6d8492; --page-soft:#eef3f5; }
    .theme-scripts { --page-accent:#305f6b; --page-accent-2:#5b8790; --page-soft:#eaf5f7; }
    .topbar { display:grid; grid-template-columns: 1.34in 1fr 1in; align-items:center; gap:.075in; padding-bottom:.034in; border-bottom: 1.5px solid var(--page-accent); break-inside: avoid; page-break-inside: avoid; }
    .brand { font-size: 6.45pt; font-weight: 850; letter-spacing:.095em; text-transform:uppercase; color:var(--page-accent); }
    .page-num { font-size: 6.25pt; font-weight: 850; letter-spacing:.06em; text-transform:uppercase; color:var(--muted); white-space:nowrap; text-align:right; }
    .progress-rail { display:flex; justify-content:center; align-items:center; gap:.018in; }
    .progress-dot { width:.126in; height:.126in; border-radius:999px; display:grid; place-items:center; border:1px solid var(--line); color:var(--muted); font-size:4.8pt; font-weight:850; line-height:1; background:white; }
    .progress-dot.is-past { background:var(--page-soft); border-color:var(--page-soft); color:var(--page-accent); }
    .progress-dot.is-current { background:var(--page-accent); border-color:var(--page-accent); color:white; }
    .page-title { display:grid; grid-template-columns: .38in 1fr; gap:.075in; align-items:center; background:linear-gradient(135deg, var(--page-soft), #fff); border:1px solid var(--line); border-radius:12px; padding:.062in .078in; box-shadow:var(--shadow); break-inside: avoid; page-break-inside: avoid; }
    .badge { height:.3in; width:.3in; border-radius: 10px; background: linear-gradient(135deg, var(--page-accent), var(--page-accent-2)); color:white; display:grid; place-items:center; font-weight:900; font-size:9.6pt; }
    .eyebrow { font-size:6.05pt; text-transform:uppercase; letter-spacing:.085em; color:var(--page-accent); font-weight:900; margin-bottom:.012in; }
    .subtitle { color: var(--muted); font-size: 7.3pt; line-height:1.12; max-width: 7in; margin:0; }
    .decision-strip { display:grid; grid-template-columns: repeat(3, 1fr); gap:.034in; break-inside: avoid; page-break-inside: avoid; }
    .decision-pill { display:grid; grid-template-columns:.18in 1fr; align-items:center; gap:.034in; border:1px solid var(--line); border-radius:999px; background:white; padding:.028in .044in; box-shadow:var(--shadow); }
    .decision-pill span { width:.152in; height:.152in; border-radius:50%; display:grid; place-items:center; background:var(--page-accent); color:white; font-size:5.7pt; font-weight:900; }
    .decision-pill strong { font-size:6.55pt; line-height:1.04; color:var(--ink); }
    .cover-hero { position:relative; background:linear-gradient(135deg, var(--page-soft), #fff 74%); border:1px solid var(--line); border-radius:16px; padding:.115in .13in; box-shadow:var(--shadow); overflow:hidden; break-inside: avoid; page-break-inside: avoid; }
    .cover-title { display:grid; gap:.034in; position:relative; z-index:1; }
    .cover-title h1 { font-size: 23pt; max-width:7.1in; margin-bottom:0; }
    .byline { color:var(--muted); font-size:7.1pt; line-height:1.14; max-width:7.05in; }
    .cover-strip { display:grid; grid-template-columns: repeat(5, 1fr); gap:.035in; margin-top:.065in; position:relative; z-index:1; }
    .cover-chip { border:1px solid var(--line); border-radius:11px; background:white; padding:.038in .034in; min-height:.39in; font-weight:850; font-size:6.6pt; text-align:center; display:grid; gap:.012in; place-items:center; box-shadow:var(--shadow); }
    .chip-icon { width:.165in; height:.165in; border-radius:999px; background:var(--page-soft); color:var(--page-accent); display:grid; place-items:center; font-weight:900; font-size:5.9pt; }
    .cover-pathway { display:grid; grid-template-columns: repeat(5, 1fr); gap:.034in; break-inside: avoid; page-break-inside: avoid; }
    .cover-step { border:1px solid var(--line); border-radius:10px; background:white; padding:.044in .04in; min-height:.5in; box-shadow:var(--shadow); }
    .cover-step span { width:.158in; height:.158in; border-radius:999px; background:var(--page-accent); color:white; display:grid; place-items:center; font-size:5.6pt; font-weight:900; margin-bottom:.018in; }
    .cover-step strong { display:block; font-size:6.45pt; text-transform:uppercase; letter-spacing:.035em; color:var(--page-accent); margin-bottom:.01in; }
    .cover-step p { font-size:6.25pt; line-height:1.08; color:var(--muted); margin:0; }
    .content { display:grid; gap:.042in; }
    .answer-panel { display:grid; grid-template-columns:.32in 1fr; gap:.062in; align-items:start; border:1.5px solid var(--page-accent); background:linear-gradient(135deg, var(--page-soft), #fff); border-radius:12px; padding:.064in .076in; box-shadow:var(--shadow); break-inside: avoid; page-break-inside: avoid; }
    .answer-icon { width:.25in; height:.25in; border-radius:9px; background:var(--page-accent); color:white; font-weight:900; font-size:8.7pt; display:grid; place-items:center; }
    .answer-panel p { font-size: 9.05pt; line-height:1.12; font-weight:800; margin:0; }
    .section-kicker { font-size:5.8pt; text-transform:uppercase; letter-spacing:.09em; color:var(--page-accent); font-weight:900; margin-bottom:.016in; }
    .reference-section { border:1px solid var(--line); border-left:4px solid var(--page-accent); border-radius:10px; padding:.052in .062in .058in; background:var(--panel); box-shadow:var(--shadow); break-inside: avoid; page-break-inside: avoid; }
    .reference-section h2 { color: var(--ink); display:flex; align-items:center; gap:.04in; }
    .reference-section h2 span { width:.235in; height:.18in; border-radius:7px; background:var(--page-soft); color:var(--page-accent); display:grid; place-items:center; font-size:5.35pt; letter-spacing:.01em; font-weight:900; flex:0 0 auto; }
    .tone-compare { background:linear-gradient(135deg, #fff, var(--compare)); }
    .tone-ask { background:linear-gradient(135deg, #fff, var(--ask)); }
    .tone-warning { background:linear-gradient(135deg, #fff, var(--warn)); }
    .tone-flow { background:linear-gradient(135deg, #fff, var(--flow)); }
    .reference-list { list-style:none; padding:0; margin:0; display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap:.028in .04in; }
    .reference-list li { display:grid; grid-template-columns:.29in 1fr; gap:.034in; align-items:start; border-top:1px solid rgba(125,145,139,.42); padding-top:.028in; break-inside: avoid; page-break-inside: avoid; }
    .reference-list li:nth-child(-n+2) { border-top:0; padding-top:0; }
    .reference-list span { width:.245in; height:.17in; border-radius:999px; background:white; border:1px solid var(--line-dark); color:var(--page-accent); display:grid; place-items:center; font-weight:900; font-size:5.15pt; letter-spacing:.01em; line-height:1; }
    .reference-list p { font-size:7.25pt; line-height:1.11; margin:0; }
    .reference-list strong { font-size:6.7pt; text-transform:uppercase; letter-spacing:.025em; color:var(--page-accent); }
    blockquote { border-left:3px solid var(--page-accent); margin:.025in 0; padding:.02in .06in; color:var(--ink); background:#fff; font-weight:750; }
    .source-note { margin-top:auto; border:1px solid var(--line); border-radius:9px; background:#fbfcfc; padding:.036in .05in; color:var(--muted); font-size:5.9pt; line-height:1.08; break-inside: avoid; page-break-inside: avoid; }
    .source-note p { margin:0; }
    .footer { margin-top:auto; font-size:5.9pt; color:var(--muted); border-top:1px solid var(--line); padding-top:.024in; display:flex; justify-content:space-between; gap:.12in; }
    .source-list { display:grid; grid-template-columns: repeat(3, 1fr); gap:.032in; }
    .source-item { border:1px solid var(--line); border-radius:8px; padding:.034in; display:grid; grid-template-columns:.15in 1fr; gap:.028in; background:white; break-inside: avoid; page-break-inside: avoid; }
    .source-item span { width:.14in; height:.14in; border-radius:50%; background:var(--accent-soft); color:var(--accent); display:grid; place-items:center; font-weight:850; font-size:5.55pt; }
    .source-item p { margin:0; font-size:5.25pt; line-height:1.08; }
    @media print {
      .cover-hero,.answer-panel,.reference-section,.decision-pill,.page-title,.cover-chip,.cover-step { box-shadow:none; }
      .reference-list span,.chip-icon,.cover-step span,.decision-pill span,.answer-icon,.badge { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <section class="page cover theme-start">
    ${renderTopbar(1, "Quick Guide")}
    <div class="cover-hero">
      <div class="cover-title">
        <div class="eyebrow">${escapeHtml(guide.coverEyebrow)}</div>
        <h1>${escapeHtml(guide.title)}</h1>
        <p class="subtitle">${escapeHtml(guide.subtitle)}</p>
        <p class="byline">Written from a healthcare-worker perspective by Andrew Ciccarelli, RN, BSN. Educational only. Verify with official sources, plan documents, agency notices, SHIP, or a qualified professional.</p>
      </div>
      <div class="cover-strip">
        ${guide.coverChips.map((chip, index) => `<div class="cover-chip"><span class="chip-icon">${index + 1}</span>${escapeHtml(chip)}</div>`).join("\n")}
      </div>
    </div>
    ${renderCoverPathway(guide)}
    <div class="content">
      ${renderPageBody(guide, pages[0])}
    </div>
    <div class="footer"><span>Educational only | Print reference v2</span><span>Page 1 of 10</span></div>
  </section>
  ${pages.slice(1).map((page) => {
    const meta = guide.pageThemeMap[page.number] || {};
    return `
  <section class="page page-${page.number} theme-${meta.theme || "default"}">
    ${renderTopbar(page.number)}
    <div class="page-title">
      <div class="badge">${escapeHtml(meta.icon || String(page.number))}</div>
      <div><div class="eyebrow">${escapeHtml(meta.eyebrow || "Quick guide")}</div><h1>${escapeHtml(page.title)}</h1><p class="subtitle">Use this page to ask better questions before signing, paying, enrolling, or appealing.</p></div>
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
      <div class="badge">S</div>
      <div><div class="eyebrow">Optional trust layer</div><h1>Endnotes and Source Map</h1><p class="subtitle">Official sources used to keep the short guide grounded without turning it into a textbook.</p></div>
    </div>
    ${renderEndnotes(endnotesMarkdown)}
    <div class="footer"><span>Educational only | Optional source trail for review</span><span>Preflight-only unless release is approved</span></div>
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
