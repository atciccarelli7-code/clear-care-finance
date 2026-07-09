import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manuscriptPath = path.join(repoRoot, "docs/medicare-medicaid-quick-guide-pre-pdf-manuscript.md");
const outputDir = path.join(repoRoot, "docs/generated/medicare-medicaid-quick-guide");
const htmlPath = path.join(outputDir, "hospital-discharge-medicare-quick-guide-preflight.html");
const pdfPath = path.join(outputDir, "hospital-discharge-medicare-quick-guide-preflight.pdf");

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

const toSlug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const splitLabel = (value) => {
  const strongMatch = value.match(/^\*\*(.*?):\*\*\s*(.*)$/);
  if (strongMatch) return { label: strongMatch[1], text: strongMatch[2] };

  const colonMatch = value.match(/^([^:]{2,36}):\s+(.*)$/);
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

const renderMiniCard = (item) => {
  const { label, text } = splitLabel(item);
  if (label) {
    return `<div class="mini-card"><div class="mini-label">${inline(label)}</div><div>${inline(text)}</div></div>`;
  }

  return `<div class="mini-card"><div>${inline(item)}</div></div>`;
};

const renderPlainBlocks = (lines) => {
  const html = [];
  let list = [];

  const flushList = () => {
    if (list.length) {
      html.push(`<div class="mini-card-grid">${list.map(renderMiniCard).join("\n")}</div>`);
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
  if (key.includes("watch") || key.includes("warning") || key.includes("risk")) return "warning";
  if (key.includes("ask") || key.includes("question") || key.includes("script")) return "ask";
  if (key.includes("compare")) return "compare";
  if (key.includes("path") || key.includes("timeline") || key.includes("first move") || key.includes("next step")) return "flow";
  if (key.includes("source")) return "source";
  return "standard";
};

const renderSection = (section, pageNumber) => {
  const tone = sectionTone(section.heading);
  const heading = escapeHtml(section.heading);
  const lines = section.lines.filter((line) => line.trim());
  const bullets = lines.filter((line) => line.trim().startsWith("- ")).map((line) => line.trim().slice(2));
  const prose = lines.filter((line) => !line.trim().startsWith("- "));

  if (section.heading.toLowerCase() === "direct answer") {
    return `<section class="answer-panel"><div class="section-kicker">Direct answer</div>${renderPlainBlocks(lines)}</section>`;
  }

  if (tone === "source") {
    return `<section class="source-note"><div class="section-kicker">Source note</div>${renderPlainBlocks(lines)}</section>`;
  }

  if (tone === "compare") {
    return `<section class="visual-section compare-section"><h2>${heading}</h2>${prose.length ? `<div class="section-prose">${renderPlainBlocks(prose)}</div>` : ""}<div class="compare-grid">${bullets.map(renderMiniCard).join("\n")}</div></section>`;
  }

  if (tone === "flow") {
    return `<section class="visual-section flow-section"><h2>${heading}</h2>${prose.length ? `<div class="section-prose">${renderPlainBlocks(prose)}</div>` : ""}<div class="flow-grid">${bullets.map((item, index) => `<div class="flow-card"><div class="step-dot">${index + 1}</div>${renderMiniCard(item)}</div>`).join("\n")}</div></section>`;
  }

  if (tone === "warning") {
    return `<section class="visual-section warning-section"><h2>${heading}</h2>${prose.length ? `<div class="section-prose">${renderPlainBlocks(prose)}</div>` : ""}<div class="warning-grid">${bullets.map(renderMiniCard).join("\n")}</div></section>`;
  }

  if (tone === "ask") {
    return `<section class="visual-section ask-section"><h2>${heading}</h2>${prose.length ? `<div class="section-prose">${renderPlainBlocks(prose)}</div>` : ""}<div class="ask-grid">${bullets.map(renderMiniCard).join("\n")}</div></section>`;
  }

  return `<section class="visual-section section-${pageNumber}-${toSlug(section.heading)}"><h2>${heading}</h2>${renderPlainBlocks(lines)}</section>`;
};

const renderPageBody = (page) => {
  const sections = parseSections(page.body);
  return sections.map((section) => renderSection(section, page.number)).join("\n");
};

const renderEndnotes = (markdown) => {
  const links = normalizeNewlines(markdown)
    .trim()
    .split(/\n+/)
    .filter(Boolean)
    .map((line) => line.replace(/^\[\d+\]\s+/, ""));

  return `<div class="source-list">${links.map((line, index) => `<div class="source-item"><span>${index + 1}</span><p>${inline(line)}</p></div>`).join("\n")}</div>`;
};

const parsePage = (rawPage) => {
  const pageBody = normalizeNewlines(rawPage);
  const titleMatch = pageBody.match(/^#\s+Page\s+(\d+)\s+[—-]\s+(.*)$/m);
  if (!titleMatch) return null;

  const [, number, title] = titleMatch;
  const body = pageBody.replace(/^#\s+Page\s+\d+\s+[—-]\s+.*$/m, "").trim();
  return { number: Number(number), title, body };
};

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

const markdown = normalizeNewlines(readFileSync(manuscriptPath, "utf8"));
const [beforeEndnotes, endnotesMarkdown = ""] = markdown.split(/\n# Endnotes and Source Map/);
const pageBlocks = beforeEndnotes
  .split(/\n(?=#\s+Page\s+\d+\s+[—-]\s+)/)
  .filter((block) => block.trim().startsWith("# Page"));
const pages = pageBlocks.map(parsePage).filter(Boolean);

if (pages.length !== 10) {
  console.error(`Expected 10 quick-guide pages, found ${pages.length}.`);
  process.exit(1);
}

const pageNumbers = pages.map((page) => page.number).join(",");
if (pageNumbers !== "1,2,3,4,5,6,7,8,9,10") {
  console.error(`Expected pages 1 through 10 in order. Found: ${pageNumbers}`);
  process.exit(1);
}

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>The Hospital Discharge & Medicare Quick Guide</title>
  <style>
    @page { size: letter; margin: 0.46in 0.52in; }
    :root {
      --ink:#14201f;
      --muted:#566360;
      --line:#c8d2cf;
      --soft:#f3f7f6;
      --panel:#ffffff;
      --accent:#0f5a4a;
      --accent-soft:#e8f4f1;
      --ask:#eef3f8;
      --warn:#fbf3e7;
      --shadow: 0 1px 0 rgba(20,32,31,.08);
    }
    * { box-sizing: border-box; }
    html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { margin: 0; color: var(--ink); background: white; font: 9.6pt/1.32 Arial, Helvetica, sans-serif; overflow-wrap: anywhere; text-rendering: optimizeLegibility; }
    h1,h2,h3,p { margin-top: 0; }
    h1 { font-size: 22pt; line-height: 1.04; margin-bottom: 0.08in; letter-spacing: -0.02em; }
    h2 { font-size: 11.3pt; line-height: 1.12; margin: 0 0 0.055in; }
    h3 { font-size: 9.7pt; line-height: 1.16; margin: 0.08in 0 0.04in; }
    p { margin: 0 0 0.055in; }
    code,.breakable { font-family: Arial, Helvetica, sans-serif; font-size: 7.2pt; overflow-wrap: anywhere; word-break: break-word; }
    .page { page-break-after: always; break-after: page; min-height: 9.55in; position: relative; display: flex; flex-direction: column; gap: 0.1in; }
    .page:last-child { page-break-after: auto; break-after: auto; }
    .topbar { display:flex; justify-content:space-between; align-items:flex-start; gap:.12in; padding-bottom:.07in; border-bottom: 2px solid var(--accent); }
    .brand { font-size: 7.9pt; font-weight: 800; letter-spacing:.09em; text-transform:uppercase; color:var(--accent); }
    .page-num { font-size: 7.8pt; font-weight: 800; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); white-space:nowrap; }
    .page-title { display:grid; grid-template-columns: .42in 1fr; gap:.11in; align-items:center; }
    .badge { height:.38in; width:.38in; border-radius: 999px; background: var(--accent); color:white; display:grid; place-items:center; font-weight:800; font-size:12pt; }
    .subtitle { color: var(--muted); font-size: 9.7pt; line-height:1.25; max-width: 6.8in; }
    .cover-hero { background: linear-gradient(135deg, var(--accent-soft), #fff); border:1px solid var(--line); border-radius:22px; padding:.2in; box-shadow:var(--shadow); }
    .cover-title { display:grid; gap:.09in; }
    .cover-title h1 { font-size: 28pt; max-width:7.1in; }
    .cover-strip { display:grid; grid-template-columns: repeat(5, 1fr); gap:.07in; margin-top:.16in; }
    .cover-chip { border:1px solid var(--line); border-radius:16px; background:white; padding:.08in; min-height:.58in; font-weight:800; font-size:8.2pt; text-align:center; display:grid; place-items:center; }
    .byline { color:var(--muted); font-size:8.4pt; line-height:1.3; }
    .content { display:grid; gap:.1in; }
    .answer-panel { border:2px solid var(--accent); background:var(--accent-soft); border-radius:18px; padding:.12in .14in; box-shadow:var(--shadow); }
    .answer-panel p { font-size: 11.2pt; line-height:1.28; font-weight:700; margin:0; }
    .section-kicker { font-size:7.2pt; text-transform:uppercase; letter-spacing:.09em; color:var(--accent); font-weight:800; margin-bottom:.04in; }
    .visual-section { border:1px solid var(--line); border-radius:18px; padding:.11in; background:var(--panel); box-shadow:var(--shadow); }
    .visual-section h2 { color: var(--ink); display:flex; align-items:center; gap:.06in; }
    .visual-section h2::before { content:""; width:.14in; height:.14in; border-radius:4px; background:var(--accent); flex:0 0 auto; }
    .section-prose { color:var(--muted); font-size:8.9pt; }
    .mini-card-grid,.compare-grid,.ask-grid,.warning-grid,.flow-grid { display:grid; gap:.07in; }
    .mini-card-grid { grid-template-columns: repeat(2, 1fr); }
    .compare-grid { grid-template-columns: repeat(2, 1fr); }
    .ask-grid { grid-template-columns: repeat(2, 1fr); }
    .warning-grid { grid-template-columns: repeat(5, 1fr); }
    .flow-grid { grid-template-columns: repeat(5, 1fr); align-items:stretch; }
    .mini-card { border:1px solid var(--line); background:var(--soft); border-radius:14px; padding:.085in; min-height:.48in; }
    .compare-section .mini-card { background:var(--accent-soft); }
    .ask-section .mini-card { background:var(--ask); }
    .warning-section .mini-card { background:var(--warn); }
    .mini-label { font-size:8pt; line-height:1.15; text-transform:uppercase; letter-spacing:.04em; font-weight:850; color:var(--accent); margin-bottom:.035in; }
    .mini-card div:last-child { font-size:8.6pt; line-height:1.24; }
    .warning-grid .mini-card div:last-child,.flow-grid .mini-card div:last-child { font-size:8.1pt; }
    .flow-card { position:relative; display:grid; grid-template-rows:auto 1fr; gap:.045in; }
    .flow-card:not(:last-child)::after { content:"→"; position:absolute; right:-.058in; top:.21in; color:var(--accent); font-weight:900; font-size:10pt; }
    .step-dot { width:.24in; height:.24in; border-radius:999px; background:var(--accent); color:white; font-weight:850; font-size:8.4pt; display:grid; place-items:center; }
    .source-note { margin-top:auto; border:1px solid var(--line); border-radius:14px; background:#fbfcfc; padding:.075in .09in; color:var(--muted); font-size:7.3pt; line-height:1.22; }
    .source-note p { margin:0; }
    .footer { margin-top:auto; font-size:7.1pt; color:var(--muted); border-top:1px solid var(--line); padding-top:.045in; display:flex; justify-content:space-between; gap:.16in; }
    .source-list { display:grid; grid-template-columns: repeat(2, 1fr); gap:.055in; }
    .source-item { border:1px solid var(--line); border-radius:12px; padding:.06in; display:grid; grid-template-columns:.2in 1fr; gap:.05in; background:white; }
    .source-item span { width:.2in; height:.2in; border-radius:50%; background:var(--accent-soft); color:var(--accent); display:grid; place-items:center; font-weight:850; font-size:7pt; }
    .source-item p { margin:0; font-size:6.8pt; line-height:1.2; }
    @media print {
      .warning-grid .mini-card,.flow-grid .mini-card { padding:.07in; }
    }
  </style>
</head>
<body>
  <section class="page cover">
    <div class="topbar"><div class="brand">Community Acquired Finance</div><div class="page-num">Quick Guide</div></div>
    <div class="cover-hero">
      <div class="cover-title">
        <h1>The Hospital Discharge & Medicare Quick Guide</h1>
        <p class="subtitle">A visual, plain-English starting point for families before discharge, rehab, home support, long-term care, or a confusing bill.</p>
        <p class="byline">Written from a healthcare-worker perspective by Andrew Ciccarelli, RN, BSN. Educational only. Verify with official sources, the plan, facility, billing office, SHIP, or a qualified professional.</p>
      </div>
      <div class="cover-strip">
        <div class="cover-chip">Hospital status</div>
        <div class="cover-chip">Rehab approval</div>
        <div class="cover-chip">Home support</div>
        <div class="cover-chip">Long-term care</div>
        <div class="cover-chip">Medical bills</div>
      </div>
    </div>
    <div class="content">
      ${renderPageBody(pages[0])}
    </div>
    <div class="footer"><span>Educational only | Review candidate</span><span>Page 1 of 10</span></div>
  </section>
  ${pages.slice(1).map((page) => `
  <section class="page page-${page.number}">
    <div class="topbar"><div class="brand">Community Acquired Finance</div><div class="page-num">Page ${page.number} of 10</div></div>
    <div class="page-title">
      <div class="badge">${page.number}</div>
      <div><h1>${escapeHtml(page.title)}</h1></div>
    </div>
    <div class="content">
      ${renderPageBody(page)}
    </div>
    <div class="footer"><span>Educational only | Verify before deciding</span><span>The Hospital Discharge & Medicare Quick Guide</span></div>
  </section>`).join("\n")}
  <section class="page source-map">
    <div class="topbar"><div class="brand">Community Acquired Finance</div><div class="page-num">Source map</div></div>
    <div class="page-title">
      <div class="badge">S</div>
      <div><h1>Endnotes and Source Map</h1><p class="subtitle">Official sources used to keep the short guide grounded without turning it into a textbook.</p></div>
    </div>
    ${renderEndnotes(endnotesMarkdown)}
    <div class="footer"><span>Educational only | Source map for review</span><span>Do not publish until final QA passes</span></div>
  </section>
</body>
</html>`;

mkdirSync(outputDir, { recursive: true });
writeFileSync(htmlPath, html, "utf8");
console.log(`Parsed ${pages.length} quick-guide pages.`);
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
      "--disable-dev-shm-usage",
      "--no-pdf-header-footer",
      "--print-to-pdf-no-header",
      `--print-to-pdf=${pdfPath}`,
      pathToFileURL(htmlPath).href,
    ],
    { encoding: "utf8", timeout: 120000 },
  );

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    console.error(result.stderr || result.stdout || "Chrome PDF export failed.");
    process.exit(result.status ?? 1);
  }

  console.log(`Wrote ${path.relative(repoRoot, pdfPath)}`);
  console.log("Do not move this quick-guide PDF to /public or link it until preflight passes and release is approved.");
}
