import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { repoRoot, resolveQuickGuideIds, getQuickGuideDefinition } from "./quick-guide-definitions.mjs";

const normalizeNewlines = (value) => value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
const pageHeadingSource = "^#\\s+Page\\s+(\\d+)\\s+[\\u002d\\u2013\\u2014]\\s+(.*)$";
const pageHeadingPattern = new RegExp(pageHeadingSource, "m");
const splitPagePattern = new RegExp(`\\n(?=${pageHeadingSource})`, "gm");

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

const toSlug = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const splitLabel = (value) => {
  const strongMatch = value.match(/^\*\*(.*?):\*\*\s*(.*)$/);
  if (strongMatch) return { label: strongMatch[1], text: strongMatch[2] };

  const colonMatch = value.match(/^([^:]{2,42}):\s+(.*)$/);
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
  if (key.includes("social security")) return "SSA";
  if (key.includes("ship")) return "SHIP";
  if (key.includes("ask") || key.includes("question") || key.includes("call")) return "ASK";
  if (key.includes("warning") || key.includes("watch") || key.includes("risk") || key.includes("denied")) return "RISK";
  if (key.includes("document") || key.includes("notice") || key.includes("paperwork") || key.includes("eob") || key.includes("msn")) return "DOC";
  return "OK";
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

const renderMiniCard = (item, index = 0, tone = "standard") => {
  const { label, text } = splitLabel(item);
  const seed = label || text;
  const icon = iconFor(seed);
  const labelHtml = label ? `<div class="mini-label">${inline(label)}</div>` : "";
  const marker = tone === "flow" ? String(index + 1) : icon;

  return `<div class="mini-card mini-card-${toSlug(seed).slice(0, 32)}">
    <div class="mini-icon">${escapeHtml(marker)}</div>
    <div class="mini-copy">${labelHtml}<div>${inline(text)}</div></div>
  </div>`;
};

const renderPlainBlocks = (lines, tone = "standard") => {
  const html = [];
  let list = [];

  const flushList = () => {
    if (list.length) {
      html.push(`<div class="mini-card-grid">${list.map((item, index) => renderMiniCard(item, index, tone)).join("\n")}</div>`);
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
  if (key.includes("ask") || key.includes("question") || key.includes("script")) return "ask";
  if (key.includes("compare") || key.includes("sort") || key.includes("know")) return "compare";
  if (key.includes("path") || key.includes("timeline") || key.includes("first move") || key.includes("next step")) return "flow";
  if (key.includes("source")) return "source";
  return "standard";
};

const renderSection = (guide, section, pageNumber) => {
  const tone = sectionTone(section.heading);
  const heading = escapeHtml(section.heading);
  const lines = section.lines.filter((line) => line.trim());
  const bullets = lines.filter((line) => line.trim().startsWith("- ")).map((line) => line.trim().slice(2));
  const prose = lines.filter((line) => !line.trim().startsWith("- "));
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

  const sectionBody = bullets.length
    ? `${prose.length ? `<div class="section-prose">${renderPlainBlocks(prose, tone)}</div>` : ""}<div class="${tone}-grid">${bullets.map((item, index) => renderMiniCard(item, index, tone)).join("\n")}</div>`
    : renderPlainBlocks(lines, tone);

  return `<section class="visual-section ${tone}-section tone-${tone}"><h2><span>${escapeHtml(icon)}</span>${heading}</h2>${sectionBody}</section>`;
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
    @page { size: letter; margin: 0.42in 0.48in; }
    :root {
      --ink:#132320; --muted:#586763; --line:#c6d4cf; --line-dark:#8ca09a;
      --soft:#f4f8f7; --panel:#ffffff; --accent:#0c5c4d; --accent-2:#2b7a78;
      --accent-soft:#e7f4f1; --ask:#edf4fb; --ask-line:#b8cee3;
      --warn:#fff4e3; --warn-line:#e9c17d; --compare:#edf7f5; --flow:#f1f5f8;
      --page-accent: var(--accent); --page-accent-2: var(--accent-2); --page-soft: var(--accent-soft);
      --shadow: 0 6px 18px rgba(19,35,32,.08), 0 1px 0 rgba(19,35,32,.08);
      --micro-shadow: 0 2px 8px rgba(19,35,32,.05);
    }
    * { box-sizing: border-box; }
    html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { margin: 0; color: var(--ink); background: white; font: 9.1pt/1.24 Arial, Helvetica, sans-serif; overflow-wrap: anywhere; text-rendering: optimizeLegibility; }
    h1,h2,h3,p { margin-top: 0; }
    h1 { font-size: 21pt; line-height: 1.02; margin-bottom: 0.045in; }
    h2 { font-size: 10.4pt; line-height: 1.12; margin: 0 0 0.045in; }
    h3 { font-size: 9pt; line-height: 1.15; margin: 0.055in 0 0.028in; }
    p { margin: 0 0 0.04in; }
    code,.breakable { font-family: Arial, Helvetica, sans-serif; font-size: 6.65pt; overflow-wrap: anywhere; word-break: break-word; }
    .page { page-break-after: always; break-after: page; min-height: 9.65in; position: relative; display: flex; flex-direction: column; gap: 0.062in; --page-accent: var(--accent); --page-accent-2: var(--accent-2); --page-soft: var(--accent-soft); }
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
    .topbar { display:grid; grid-template-columns: 1.4in 1fr 1.05in; align-items:center; gap:.1in; padding-bottom:.048in; border-bottom: 2px solid var(--page-accent); break-inside: avoid; page-break-inside: avoid; }
    .brand { font-size: 7pt; font-weight: 850; letter-spacing:.105em; text-transform:uppercase; color:var(--page-accent); }
    .page-num { font-size: 6.9pt; font-weight: 850; letter-spacing:.075em; text-transform:uppercase; color:var(--muted); white-space:nowrap; text-align:right; }
    .progress-rail { display:flex; justify-content:center; align-items:center; gap:.025in; }
    .progress-dot { width:.15in; height:.15in; border-radius:999px; display:grid; place-items:center; border:1px solid var(--line); color:var(--muted); font-size:5.25pt; font-weight:850; line-height:1; background:white; }
    .progress-dot.is-past { background:var(--page-soft); border-color:var(--page-soft); color:var(--page-accent); }
    .progress-dot.is-current { background:var(--page-accent); border-color:var(--page-accent); color:white; }
    .page-title { display:grid; grid-template-columns: .52in 1fr; gap:.105in; align-items:center; background:linear-gradient(135deg, var(--page-soft), #fff); border:1px solid var(--line); border-radius:20px; padding:.092in .115in; box-shadow:var(--micro-shadow); break-inside: avoid; page-break-inside: avoid; }
    .badge { height:.4in; width:.4in; border-radius: 15px; background: linear-gradient(135deg, var(--page-accent), var(--page-accent-2)); color:white; display:grid; place-items:center; font-weight:900; font-size:12.5pt; }
    .eyebrow { font-size:6.75pt; text-transform:uppercase; letter-spacing:.105em; color:var(--page-accent); font-weight:900; margin-bottom:.02in; }
    .subtitle { color: var(--muted); font-size: 8.2pt; line-height:1.16; max-width: 6.8in; margin:0; }
    .decision-strip { display:grid; grid-template-columns: repeat(3, 1fr); gap:.052in; break-inside: avoid; page-break-inside: avoid; }
    .decision-pill { display:grid; grid-template-columns:.225in 1fr; align-items:center; gap:.045in; border:1px solid var(--line); border-radius:999px; background:white; padding:.039in .055in; box-shadow:var(--micro-shadow); }
    .decision-pill span { width:.188in; height:.188in; border-radius:50%; display:grid; place-items:center; background:var(--page-accent); color:white; font-size:6.6pt; font-weight:900; }
    .decision-pill strong { font-size:7.05pt; line-height:1.07; color:var(--ink); }
    .cover-hero { position:relative; background: radial-gradient(circle at top left, #d7efea, transparent 40%), linear-gradient(135deg, var(--page-soft), #fff 72%); border:1px solid var(--line); border-radius:26px; padding:.19in; box-shadow:var(--shadow); overflow:hidden; break-inside: avoid; page-break-inside: avoid; }
    .cover-title { display:grid; gap:.06in; position:relative; z-index:1; }
    .cover-title h1 { font-size: 26.5pt; max-width:7.05in; margin-bottom:.01in; }
    .byline { color:var(--muted); font-size:7.75pt; line-height:1.21; max-width:6.8in; }
    .cover-strip { display:grid; grid-template-columns: repeat(5, 1fr); gap:.052in; margin-top:.11in; position:relative; z-index:1; }
    .cover-chip { border:1px solid var(--line); border-radius:17px; background:white; padding:.06in .042in; min-height:.54in; font-weight:850; font-size:7.2pt; text-align:center; display:grid; gap:.018in; place-items:center; box-shadow:var(--micro-shadow); }
    .chip-icon { width:.202in; height:.202in; border-radius:999px; background:var(--page-soft); color:var(--page-accent); display:grid; place-items:center; font-weight:900; font-size:6.95pt; }
    .cover-pathway { display:grid; grid-template-columns: repeat(5, 1fr); gap:.049in; break-inside: avoid; page-break-inside: avoid; }
    .cover-step { border:1px solid var(--line); border-radius:15px; background:white; padding:.064in .052in; min-height:.68in; box-shadow:var(--micro-shadow); }
    .cover-step span { width:.19in; height:.19in; border-radius:999px; background:var(--page-accent); color:white; display:grid; place-items:center; font-size:6.6pt; font-weight:900; margin-bottom:.03in; }
    .cover-step strong { display:block; font-size:7.1pt; text-transform:uppercase; letter-spacing:.045em; color:var(--page-accent); margin-bottom:.018in; }
    .cover-step p { font-size:6.9pt; line-height:1.13; color:var(--muted); margin:0; }
    .content { display:grid; gap:.06in; }
    .answer-panel { display:grid; grid-template-columns:.415in 1fr; gap:.082in; align-items:start; border:2px solid var(--page-accent); background:linear-gradient(135deg, var(--page-soft), #fff); border-radius:19px; padding:.094in .112in; box-shadow:var(--shadow); break-inside: avoid; page-break-inside: avoid; }
    .answer-icon { width:.318in; height:.318in; border-radius:13px; background:var(--page-accent); color:white; font-weight:900; font-size:11.1pt; display:grid; place-items:center; }
    .answer-panel p { font-size: 10.25pt; line-height:1.16; font-weight:800; margin:0; }
    .section-kicker { font-size:6.3pt; text-transform:uppercase; letter-spacing:.105em; color:var(--page-accent); font-weight:900; margin-bottom:.026in; }
    .visual-section { border:1px solid var(--line); border-radius:19px; padding:.084in .094in .094in; background:var(--panel); box-shadow:var(--micro-shadow); position:relative; overflow:hidden; break-inside: avoid; page-break-inside: avoid; }
    .visual-section::before { content:""; position:absolute; inset:0 auto 0 0; width:.052in; background:var(--page-accent); }
    .visual-section h2 { color: var(--ink); display:flex; align-items:center; gap:.052in; padding-left:.028in; }
    .visual-section h2 span { width:.28in; height:.22in; border-radius:9px; background:var(--page-soft); color:var(--page-accent); display:grid; place-items:center; font-size:6.05pt; letter-spacing:.02em; font-weight:900; flex:0 0 auto; }
    .section-prose { color:var(--muted); font-size:8pt; }
    .mini-card-grid,.compare-grid,.ask-grid,.warning-grid,.flow-grid,.standard-grid { display:grid; gap:.048in; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .mini-card { display:grid; grid-template-columns:.335in 1fr; gap:.046in; align-items:start; border:1px solid var(--line); background:var(--soft); border-radius:14px; padding:.058in; min-height:.44in; break-inside: avoid; page-break-inside: avoid; }
    .mini-icon { width:.29in; height:.21in; border-radius:999px; background:white; border:1px solid var(--line-dark); color:var(--page-accent); display:grid; place-items:center; font-weight:900; font-size:5.75pt; letter-spacing:.015em; line-height:1; }
    .compare-section { background:linear-gradient(135deg, #fff, var(--compare)); }
    .ask-section { background:linear-gradient(135deg, #fff, var(--ask)); }
    .warning-section { background:linear-gradient(135deg, #fff, var(--warn)); }
    .flow-section { background:linear-gradient(135deg, #fff, var(--flow)); }
    .mini-label { font-size:6.9pt; line-height:1.06; text-transform:uppercase; letter-spacing:.04em; font-weight:900; color:var(--page-accent); margin-bottom:.02in; }
    .mini-copy div:last-child { font-size:7.6pt; line-height:1.14; }
    .source-note { margin-top:auto; border:1px solid var(--line); border-radius:14px; background:#fbfcfc; padding:.052in .066in; color:var(--muted); font-size:6.45pt; line-height:1.12; break-inside: avoid; page-break-inside: avoid; }
    .source-note p { margin:0; }
    .footer { margin-top:auto; font-size:6.45pt; color:var(--muted); border-top:1px solid var(--line); padding-top:.034in; display:flex; justify-content:space-between; gap:.16in; }
    .source-list { display:grid; grid-template-columns: repeat(3, 1fr); gap:.038in; }
    .source-item { border:1px solid var(--line); border-radius:12px; padding:.042in; display:grid; grid-template-columns:.17in 1fr; gap:.036in; background:white; break-inside: avoid; page-break-inside: avoid; }
    .source-item span { width:.16in; height:.16in; border-radius:50%; background:var(--accent-soft); color:var(--accent); display:grid; place-items:center; font-weight:850; font-size:6.1pt; }
    .source-item p { margin:0; font-size:5.8pt; line-height:1.12; }
    @media print {
      .cover-hero,.answer-panel,.visual-section,.mini-card,.decision-pill,.page-title,.cover-chip,.cover-step { box-shadow:none; }
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
    <div class="footer"><span>Educational only | Preflight candidate</span><span>Page 1 of 10</span></div>
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
