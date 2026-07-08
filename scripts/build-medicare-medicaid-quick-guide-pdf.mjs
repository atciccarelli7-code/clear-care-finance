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

const renderLooseMarkdown = (markdown) => {
  if (!markdown?.trim()) return "";

  const lines = normalizeNewlines(markdown).trim().split(/\n/);
  const html = [];
  let listOpen = false;

  const closeList = () => {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line === "---") {
      closeList();
      continue;
    }

    if (line.startsWith("- ")) {
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${inline(line.slice(2))}</li>`);
      continue;
    }

    closeList();

    if (line.startsWith("> ")) html.push(`<blockquote>${inline(line.slice(2))}</blockquote>`);
    else if (line.startsWith("### ")) html.push(`<h3>${inline(line.slice(4))}</h3>`);
    else if (line.startsWith("## ")) html.push(`<h2>${inline(line.slice(3))}</h2>`);
    else html.push(`<p>${inline(line)}</p>`);
  }

  closeList();
  return html.join("\n");
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
const preface = beforeEndnotes.split(/\n(?=#\s+Page\s+1\s+[—-]\s+)/)[0]?.trim() ?? "";
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
    @page { size: letter; margin: 0.56in 0.62in; }
    :root { --ink:#171717; --muted:#4f555c; --line:#aeb8c2; --soft:#f2f4f6; --accent:#1f4d5a; --accent-soft:#edf6f8; --paper:#fbfcfd; }
    * { box-sizing: border-box; }
    html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { margin: 0; color: var(--ink); background: white; font: 10.6pt/1.42 Georgia, "Times New Roman", serif; overflow-wrap: anywhere; text-rendering: optimizeLegibility; }
    h1,h2,h3,.sans,.label,.footer,.eyebrow,.page-number,.notice { font-family: Arial, Helvetica, sans-serif; }
    h1 { font-size: 25pt; line-height: 1.08; margin: 0 0 0.18in; max-width: 7in; }
    h2 { font-size: 12pt; line-height: 1.22; margin: 0.105in 0 0.045in; break-after: avoid; page-break-after: avoid; }
    h3 { font-size: 10.3pt; line-height: 1.22; margin: 0.095in 0 0.035in; break-after: avoid; page-break-after: avoid; }
    p { margin: 0 0 0.075in; orphans: 3; widows: 3; }
    ul { margin: 0.035in 0 0.09in 0.22in; padding: 0; }
    li { margin: 0.022in 0; orphans: 2; widows: 2; }
    blockquote { border-left: 4px solid var(--accent); margin: 0.09in 0; padding: 0.01in 0 0.01in 0.12in; color: var(--muted); }
    code,.breakable { font-family: Arial, Helvetica, sans-serif; font-size: 8.2pt; overflow-wrap: anywhere; word-break: break-word; }
    .page { page-break-after: always; break-after: page; min-height: 9.15in; position: relative; display: flex; flex-direction: column; }
    .page:last-child { page-break-after: auto; break-after: auto; }
    .cover { display: grid; align-content: center; }
    .eyebrow { font-weight: 700; font-size: 8.5pt; line-height: 1.2; letter-spacing: .08em; text-transform: uppercase; color: var(--accent); margin-bottom: 0.13in; }
    .subtitle { font: 12.4pt/1.32 Arial, Helvetica, sans-serif; color: var(--muted); max-width: 6.7in; }
    .byline { margin-top: 0.3in; font: 9.4pt/1.35 Arial, Helvetica, sans-serif; color: var(--muted); }
    .notice,.answer { border: 1px solid var(--line); background: var(--soft); padding: 0.105in; margin: 0.09in 0; }
    .answer { border: 1.5px solid var(--accent); background: var(--accent-soft); }
    .label { font-weight: 700; font-size: 8.1pt; letter-spacing: .04em; text-transform: uppercase; color: var(--accent); margin-bottom: 0.035in; }
    .page-number { font-weight: 700; color: var(--accent); letter-spacing: .08em; text-transform: uppercase; font-size: 8.5pt; margin-bottom: 0.045in; }
    .page-title { border-top: 1.5px solid var(--accent); border-bottom: 1px solid var(--line); padding: 0.1in 0 0.08in; margin: 0 0 0.1in; }
    .page-title h1 { font-size: 19pt; margin: 0; }
    .footer { margin-top: auto; font-size: 7.7pt; color: var(--muted); border-top: 1px solid var(--line); padding-top: 0.05in; display: flex; justify-content: space-between; gap: 0.16in; }
    .small { font-size: 8.5pt; color: var(--muted); }
    .source-note { font-size: 8.25pt; color: var(--muted); background: var(--paper); border: 1px solid var(--line); padding: 0.07in; margin-top: 0.08in; }
    .source-note h2 { margin-top: 0; }
    .content p:last-child,.answer p:last-child,.notice p:last-child,.source-note p:last-child { margin-bottom: 0; }
  </style>
</head>
<body>
  <section class="page cover">
    <div class="eyebrow">Community Acquired Finance | Quick Guide</div>
    <h1>The Hospital Discharge & Medicare Quick Guide</h1>
    <p class="subtitle">A 10-page plain-English starting point for families before discharge, rehab, home health, long-term care, or a confusing bill.</p>
    <div class="byline">Written from a healthcare-worker perspective by Andrew Ciccarelli, RN, BSN.<br />Educational only. Verify your situation with official sources, your plan, the facility, the billing office, SHIP, or a qualified professional.</div>
    <div class="notice small">Pre-release draft. Do not distribute as a final public download until source review, PDF review, mobile review, and print review are complete.</div>
    <div class="footer"><span>Community Acquired Finance | Educational only</span><span>Pre-release quick guide</span></div>
  </section>
  ${pages.slice(1).map((page) => `
  <section class="page">
    <div class="page-title">
      <div class="page-number">Page ${page.number}</div>
      <h1>${escapeHtml(page.title)}</h1>
    </div>
    <div class="content">
      ${renderLooseMarkdown(page.body)}
    </div>
    <div class="footer"><span>Community Acquired Finance | Educational only</span><span>Page ${page.number} of 10</span></div>
  </section>`).join("\n")}
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
  console.log("Do not move this quick-guide PDF to /public or link it until preflight passes and release is approved.");
}
