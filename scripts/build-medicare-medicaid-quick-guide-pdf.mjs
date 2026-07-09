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

const iconFor = (value = "") => {
  const key = value.toLowerCase();
  if (key.includes("hospital") || key.includes("inpatient") || key.includes("status")) return "H";
  if (key.includes("rehab") || key.includes("skilled") || key.includes("snf")) return "R";
  if (key.includes("home") || key.includes("equipment") || key.includes("supplier")) return "D";
  if (key.includes("long-term") || key.includes("custodial") || key.includes("daily")) return "L";
  if (key.includes("bill") || key.includes("pay") || key.includes("owe") || key.includes("cost")) return "$";
  if (key.includes("medicaid")) return "M";
  if (key.includes("medicare advantage") || key.includes("plan") || key.includes("authorization")) return "A";
  if (key.includes("original medicare") || key.includes("medicare")) return "M";
  if (key.includes("ask") || key.includes("question") || key.includes("call")) return "?";
  if (key.includes("warning") || key.includes("watch") || key.includes("risk") || key.includes("denied")) return "!";
  if (key.includes("document") || key.includes("notice") || key.includes("paperwork") || key.includes("eob") || key.includes("msn")) return "P";
  return "✓";
};

const pageMeta = {
  1: {
    eyebrow: "Start here",
    subtitle: "Find the right question before decisions move too fast.",
    icon: "1",
    cues: ["Pick the problem", "Ask which rule applies", "Save the paperwork"],
  },
  2: {
    eyebrow: "Avoid costly assumptions",
    subtitle: "Five traps that make families overpay, panic, or miss appeal windows.",
    icon: "!",
    cues: ["Do not assume", "Ask for proof", "Confirm possible cost"],
  },
  3: {
    eyebrow: "Program map",
    subtitle: "Medicare and Medicaid are not interchangeable.",
    icon: "M",
    cues: ["Identify coverage", "Check state rules", "Verify provider fit"],
  },
  4: {
    eyebrow: "Coverage path",
    subtitle: "Same Medicare umbrella, very different process.",
    icon: "A",
    cues: ["Name the plan type", "Check network/approval", "Ask what is owed"],
  },
  5: {
    eyebrow: "Status check",
    subtitle: "Where the patient sleeps is not always the billing status.",
    icon: "H",
    cues: ["Ask current status", "Confirm admission time", "Get notices"],
  },
  6: {
    eyebrow: "Discharge checkpoint",
    subtitle: "Separate the care plan from the payment plan before leaving.",
    icon: "→",
    cues: ["Where next?", "Who pays?", "What is the backup?"],
  },
  7: {
    eyebrow: "Rehab review",
    subtitle: "Short-term skilled care has rules, reviews, and deadlines.",
    icon: "R",
    cues: ["Document skill", "Confirm facility", "Track appeal deadline"],
  },
  8: {
    eyebrow: "Care setting sort",
    subtitle: "Home health, equipment, and custodial care are different questions.",
    icon: "D",
    cues: ["Sort the need", "Check agency/supplier", "Plan long-term help"],
  },
  9: {
    eyebrow: "Bill check",
    subtitle: "Match the bill against the processed claim before paying.",
    icon: "$",
    cues: ["Match documents", "Ask why owed", "Correct or appeal"],
  },
  10: {
    eyebrow: "Call scripts",
    subtitle: "Slow the conversation down and get the answer in writing.",
    icon: "?",
    cues: ["Call the right place", "Use the script", "Write down the answer"],
  },
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

const renderDecisionStrip = (pageNumber) => {
  const cues = pageMeta[pageNumber]?.cues || ["Identify", "Verify", "Document"];
  return `<div class="decision-strip">${cues
    .map(
      (cue, index) => `<div class="decision-pill"><span>${index + 1}</span><strong>${inline(cue)}</strong></div>`,
    )
    .join("\n")}</div>`;
};

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
  if (key.includes("watch") || key.includes("warning") || key.includes("risk")) return "warning";
  if (key.includes("ask") || key.includes("question") || key.includes("script")) return "ask";
  if (key.includes("compare") || key.includes("sort")) return "compare";
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
  const icon = iconFor(section.heading);

  if (section.heading.toLowerCase() === "direct answer") {
    return `<section class="answer-panel">
      <div class="answer-icon">${escapeHtml(pageMeta[pageNumber]?.icon || "✓")}</div>
      <div><div class="section-kicker">Core idea</div>${renderPlainBlocks(lines)}</div>
    </section>`;
  }

  if (tone === "source") {
    return `<section class="source-note"><div class="section-kicker">Source note</div>${renderPlainBlocks(lines, tone)}</section>`;
  }

  if (tone === "compare") {
    return `<section class="visual-section compare-section tone-${tone}"><h2><span>${escapeHtml(icon)}</span>${heading}</h2>${prose.length ? `<div class="section-prose">${renderPlainBlocks(prose, tone)}</div>` : ""}<div class="compare-grid">${bullets.map((item, index) => renderMiniCard(item, index, tone)).join("\n")}</div></section>`;
  }

  if (tone === "flow") {
    return `<section class="visual-section flow-section tone-${tone}"><h2><span>${escapeHtml(icon)}</span>${heading}</h2>${prose.length ? `<div class="section-prose">${renderPlainBlocks(prose, tone)}</div>` : ""}<div class="flow-grid">${bullets.map((item, index) => `<div class="flow-card">${renderMiniCard(item, index, tone)}</div>`).join("\n")}</div></section>`;
  }

  if (tone === "warning") {
    return `<section class="visual-section warning-section tone-${tone}"><h2><span>${escapeHtml(icon)}</span>${heading}</h2>${prose.length ? `<div class="section-prose">${renderPlainBlocks(prose, tone)}</div>` : ""}<div class="warning-grid">${bullets.map((item, index) => renderMiniCard(item, index, tone)).join("\n")}</div></section>`;
  }

  if (tone === "ask") {
    return `<section class="visual-section ask-section tone-${tone}"><h2><span>${escapeHtml(icon)}</span>${heading}</h2>${prose.length ? `<div class="section-prose">${renderPlainBlocks(prose, tone)}</div>` : ""}<div class="ask-grid">${bullets.map((item, index) => renderMiniCard(item, index, tone)).join("\n")}</div></section>`;
  }

  return `<section class="visual-section tone-${tone} section-${pageNumber}-${toSlug(section.heading)}"><h2><span>${escapeHtml(icon)}</span>${heading}</h2>${renderPlainBlocks(lines, tone)}</section>`;
};

const renderPageBody = (page) => {
  const sections = parseSections(page.body);
  return `${renderDecisionStrip(page.number)}\n${sections.map((section) => renderSection(section, page.number)).join("\n")}`;
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
    @page { size: letter; margin: 0.42in 0.48in; }
    :root {
      --ink:#132320;
      --muted:#586763;
      --line:#c6d4cf;
      --line-dark:#8ca09a;
      --soft:#f4f8f7;
      --panel:#ffffff;
      --accent:#0c5c4d;
      --accent-2:#2b7a78;
      --accent-soft:#e7f4f1;
      --ask:#edf4fb;
      --ask-line:#b8cee3;
      --warn:#fff4e3;
      --warn-line:#e9c17d;
      --compare:#edf7f5;
      --flow:#f1f5f8;
      --shadow: 0 6px 18px rgba(19,35,32,.08), 0 1px 0 rgba(19,35,32,.08);
      --micro-shadow: 0 2px 8px rgba(19,35,32,.05);
    }
    * { box-sizing: border-box; }
    html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { margin: 0; color: var(--ink); background: white; font: 9.25pt/1.27 Arial, Helvetica, sans-serif; overflow-wrap: anywhere; text-rendering: optimizeLegibility; }
    h1,h2,h3,p { margin-top: 0; }
    h1 { font-size: 21.5pt; line-height: 1.02; margin-bottom: 0.052in; letter-spacing: -0.035em; }
    h2 { font-size: 10.7pt; line-height: 1.12; margin: 0 0 0.052in; }
    h3 { font-size: 9.2pt; line-height: 1.16; margin: 0.065in 0 0.032in; }
    p { margin: 0 0 0.046in; }
    code,.breakable { font-family: Arial, Helvetica, sans-serif; font-size: 6.85pt; overflow-wrap: anywhere; word-break: break-word; }
    .page { page-break-after: always; break-after: page; min-height: 9.65in; position: relative; display: flex; flex-direction: column; gap: 0.08in; }
    .page:last-child { page-break-after: auto; break-after: auto; }
    .topbar { display:grid; grid-template-columns: 1.4in 1fr 1.05in; align-items:center; gap:.1in; padding-bottom:.052in; border-bottom: 2px solid var(--accent); }
    .brand { font-size: 7.25pt; font-weight: 850; letter-spacing:.105em; text-transform:uppercase; color:var(--accent); }
    .page-num { font-size: 7.15pt; font-weight: 850; letter-spacing:.075em; text-transform:uppercase; color:var(--muted); white-space:nowrap; text-align:right; }
    .progress-rail { display:flex; justify-content:center; align-items:center; gap:.025in; }
    .progress-dot { width:.155in; height:.155in; border-radius:999px; display:grid; place-items:center; border:1px solid var(--line); color:var(--muted); font-size:5.4pt; font-weight:850; line-height:1; background:white; }
    .progress-dot.is-past { background:var(--accent-soft); border-color:var(--accent-soft); color:var(--accent); }
    .progress-dot.is-current { background:var(--accent); border-color:var(--accent); color:white; transform:scale(1.13); }
    .page-title { display:grid; grid-template-columns: .54in 1fr; gap:.12in; align-items:center; background:linear-gradient(135deg, var(--accent-soft), #fff); border:1px solid var(--line); border-radius:22px; padding:.105in .13in; box-shadow:var(--micro-shadow); }
    .badge { height:.42in; width:.42in; border-radius: 16px; background: linear-gradient(135deg, var(--accent), var(--accent-2)); color:white; display:grid; place-items:center; font-weight:900; font-size:13pt; box-shadow: inset 0 -1px 0 rgba(0,0,0,.12); }
    .eyebrow { font-size:6.95pt; text-transform:uppercase; letter-spacing:.105em; color:var(--accent); font-weight:900; margin-bottom:.025in; }
    .subtitle { color: var(--muted); font-size: 8.5pt; line-height:1.2; max-width: 6.8in; margin:0; }
    .decision-strip { display:grid; grid-template-columns: repeat(3, 1fr); gap:.06in; }
    .decision-pill { display:grid; grid-template-columns:.24in 1fr; align-items:center; gap:.052in; border:1px solid var(--line); border-radius:999px; background:white; padding:.045in .065in; box-shadow:var(--micro-shadow); }
    .decision-pill span { width:.2in; height:.2in; border-radius:50%; display:grid; place-items:center; background:var(--accent); color:white; font-size:7pt; font-weight:900; }
    .decision-pill strong { font-size:7.45pt; line-height:1.1; color:var(--ink); }
    .cover-hero { position:relative; background: radial-gradient(circle at top left, #d7efea, transparent 40%), linear-gradient(135deg, var(--accent-soft), #fff 72%); border:1px solid var(--line); border-radius:28px; padding:.21in; box-shadow:var(--shadow); overflow:hidden; }
    .cover-hero::after { content:""; position:absolute; right:-.35in; top:-.35in; width:1.35in; height:1.35in; border-radius:50%; border:.18in solid rgba(12,92,77,.10); }
    .cover-title { display:grid; gap:.07in; position:relative; z-index:1; }
    .cover-title h1 { font-size: 27.5pt; max-width:7.05in; margin-bottom:.015in; }
    .byline { color:var(--muted); font-size:8pt; line-height:1.25; max-width:6.8in; }
    .cover-strip { display:grid; grid-template-columns: repeat(5, 1fr); gap:.06in; margin-top:.13in; position:relative; z-index:1; }
    .cover-chip { border:1px solid var(--line); border-radius:18px; background:white; padding:.07in .05in; min-height:.6in; font-weight:850; font-size:7.55pt; text-align:center; display:grid; gap:.022in; place-items:center; box-shadow:var(--micro-shadow); }
    .chip-icon { width:.215in; height:.215in; border-radius:999px; background:var(--accent-soft); color:var(--accent); display:grid; place-items:center; font-weight:900; font-size:7.25pt; }
    .content { display:grid; gap:.076in; }
    .answer-panel { display:grid; grid-template-columns:.44in 1fr; gap:.095in; align-items:start; border:2px solid var(--accent); background:linear-gradient(135deg, var(--accent-soft), #fff); border-radius:20px; padding:.11in .13in; box-shadow:var(--shadow); }
    .answer-icon { width:.34in; height:.34in; border-radius:14px; background:var(--accent); color:white; font-weight:900; font-size:12pt; display:grid; place-items:center; }
    .answer-panel p { font-size: 10.65pt; line-height:1.2; font-weight:800; margin:0; }
    .section-kicker { font-size:6.65pt; text-transform:uppercase; letter-spacing:.105em; color:var(--accent); font-weight:900; margin-bottom:.032in; }
    .visual-section { border:1px solid var(--line); border-radius:20px; padding:.095in .105in .105in; background:var(--panel); box-shadow:var(--micro-shadow); position:relative; overflow:hidden; }
    .visual-section::before { content:""; position:absolute; inset:0 auto 0 0; width:.055in; background:var(--accent); }
    .visual-section h2 { color: var(--ink); display:flex; align-items:center; gap:.06in; padding-left:.03in; }
    .visual-section h2 span { width:.235in; height:.235in; border-radius:10px; background:var(--accent-soft); color:var(--accent); display:grid; place-items:center; font-size:8.1pt; font-weight:900; flex:0 0 auto; }
    .section-prose { color:var(--muted); font-size:8.35pt; }
    .mini-card-grid,.compare-grid,.ask-grid,.warning-grid,.flow-grid { display:grid; gap:.055in; }
    .mini-card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .compare-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .ask-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .warning-grid { grid-template-columns: repeat(auto-fit, minmax(1.55in, 1fr)); }
    .flow-grid { grid-template-columns: repeat(auto-fit, minmax(1.15in, 1fr)); align-items:stretch; }
    .mini-card { display:grid; grid-template-columns:.28in 1fr; gap:.055in; align-items:start; border:1px solid var(--line); background:var(--soft); border-radius:15px; padding:.068in; min-height:.48in; box-shadow: inset 0 1px 0 rgba(255,255,255,.75); }
    .mini-icon { width:.225in; height:.225in; border-radius:999px; background:white; border:1px solid var(--line-dark); color:var(--accent); display:grid; place-items:center; font-weight:900; font-size:7.55pt; line-height:1; }
    .compare-section { background:linear-gradient(135deg, #fff, var(--compare)); }
    .compare-section .mini-card { background:#ffffff; }
    .compare-section .mini-icon { background:var(--accent-soft); }
    .ask-section { background:linear-gradient(135deg, #fff, var(--ask)); }
    .ask-section::before { background:#3a6f94; }
    .ask-section h2 span,.ask-section .mini-icon { color:#315f80; border-color:var(--ask-line); background:#f6fbff; }
    .ask-section .mini-card { background:#f8fbff; border-color:var(--ask-line); }
    .warning-section { background:linear-gradient(135deg, #fff, var(--warn)); }
    .warning-section::before { background:#b87517; }
    .warning-section h2 span,.warning-section .mini-icon { color:#8a5b12; border-color:var(--warn-line); background:#fffaf1; }
    .warning-section .mini-card { background:#fffaf1; border-color:var(--warn-line); }
    .flow-section { background:linear-gradient(135deg, #fff, var(--flow)); }
    .flow-card { position:relative; display:grid; }
    .flow-card:not(:last-child)::after { content:""; position:absolute; right:-.04in; top:.29in; width:.085in; height:.085in; border-top:2px solid var(--accent); border-right:2px solid var(--accent); transform:rotate(45deg); }
    .flow-card .mini-card { grid-template-columns:1fr; text-align:center; padding:.065in .05in; min-height:.66in; }
    .flow-card .mini-icon { margin:0 auto .032in; background:var(--accent); color:white; border-color:var(--accent); }
    .mini-label { font-size:7.25pt; line-height:1.08; text-transform:uppercase; letter-spacing:.04em; font-weight:900; color:var(--accent); margin-bottom:.025in; }
    .mini-copy div:last-child { font-size:7.95pt; line-height:1.18; }
    .warning-grid .mini-copy div:last-child,.flow-grid .mini-copy div:last-child { font-size:7.45pt; }
    .source-note { margin-top:auto; border:1px solid var(--line); border-radius:14px; background:#fbfcfc; padding:.06in .075in; color:var(--muted); font-size:6.75pt; line-height:1.16; }
    .source-note p { margin:0; }
    .footer { margin-top:auto; font-size:6.7pt; color:var(--muted); border-top:1px solid var(--line); padding-top:.038in; display:flex; justify-content:space-between; gap:.16in; }
    .source-list { display:grid; grid-template-columns: repeat(3, 1fr); gap:.042in; }
    .source-item { border:1px solid var(--line); border-radius:12px; padding:.048in; display:grid; grid-template-columns:.18in 1fr; gap:.04in; background:white; }
    .source-item span { width:.17in; height:.17in; border-radius:50%; background:var(--accent-soft); color:var(--accent); display:grid; place-items:center; font-weight:850; font-size:6.35pt; }
    .source-item p { margin:0; font-size:6.05pt; line-height:1.15; }
    @media print {
      .cover-hero,.answer-panel,.visual-section,.mini-card,.decision-pill,.page-title,.cover-chip { box-shadow:none; }
      .progress-dot.is-current { transform:none; }
    }
  </style>
</head>
<body>
  <section class="page cover">
    ${renderTopbar(1, "Quick Guide")}
    <div class="cover-hero">
      <div class="cover-title">
        <div class="eyebrow">Visual hospital-family handout</div>
        <h1>The Hospital Discharge & Medicare Quick Guide</h1>
        <p class="subtitle">A plain-English starting point for families before discharge, rehab, home support, long-term care, or a confusing bill.</p>
        <p class="byline">Written from a healthcare-worker perspective by Andrew Ciccarelli, RN, BSN. Educational only. Verify with official sources, the plan, facility, billing office, SHIP, or a qualified professional.</p>
      </div>
      <div class="cover-strip">
        <div class="cover-chip"><span class="chip-icon">H</span>Hospital status</div>
        <div class="cover-chip"><span class="chip-icon">R</span>Rehab approval</div>
        <div class="cover-chip"><span class="chip-icon">D</span>Home support</div>
        <div class="cover-chip"><span class="chip-icon">L</span>Long-term care</div>
        <div class="cover-chip"><span class="chip-icon">$</span>Medical bills</div>
      </div>
    </div>
    <div class="content">
      ${renderPageBody(pages[0])}
    </div>
    <div class="footer"><span>Educational only | Review candidate</span><span>Page 1 of 10</span></div>
  </section>
  ${pages.slice(1).map((page) => `
  <section class="page page-${page.number}">
    ${renderTopbar(page.number)}
    <div class="page-title">
      <div class="badge">${escapeHtml(pageMeta[page.number]?.icon || String(page.number))}</div>
      <div><div class="eyebrow">${escapeHtml(pageMeta[page.number]?.eyebrow || "Quick guide")}</div><h1>${escapeHtml(page.title)}</h1><p class="subtitle">${escapeHtml(pageMeta[page.number]?.subtitle || "Use this page to ask better questions.")}</p></div>
    </div>
    <div class="content">
      ${renderPageBody(page)}
    </div>
    <div class="footer"><span>Educational only | Verify before deciding</span><span>The Hospital Discharge & Medicare Quick Guide</span></div>
  </section>`).join("\n")}
  <section class="page source-map">
    ${renderTopbar(null, "Source map")}
    <div class="page-title">
      <div class="badge">S</div>
      <div><div class="eyebrow">Trust layer</div><h1>Endnotes and Source Map</h1><p class="subtitle">Official sources used to keep the short guide grounded without turning it into a textbook.</p></div>
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
