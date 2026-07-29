import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { JSDOM } from "jsdom";
import { ADDITIONAL_NON_INDEXED_PRERENDER_ROUTES, PRIVATE_APP_SHELL_ROUTES, normalizeRoute, repositoryRoot } from "./seo-route-utils.mjs";

const SITE_ORIGIN = "https://communityacquiredfinance.com";
const PRODUCTION_SITEMAP = `${SITE_ORIGIN}/sitemap.xml`;
const REPORT_DATE = "2026-07-29";
const outputCsv = path.join(repositoryRoot, "docs", `adsense-url-ledger-${REPORT_DATE}.csv`);
const outputMarkdown = path.join(repositoryRoot, "docs", `adsense-url-ledger-${REPORT_DATE}.md`);
const gscPagesPath = process.env.GSC_PAGES_CSV?.trim();

const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
const normalizeUrlPath = (value) => {
  const parsed = new URL(value, SITE_ORIGIN);
  return normalizeRoute(parsed.pathname);
};
const routeToDistPath = (route) =>
  route === "/" ? path.join(repositoryRoot, "dist", "index.html") : path.join(repositoryRoot, "dist", `${route.slice(1)}.html`);
const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

const parseCsvLine = (line) => {
  const cells = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      cells.push(value);
      value = "";
    } else {
      value += character;
    }
  }
  cells.push(value);
  return cells;
};

const loadGscPerformance = async () => {
  const result = new Map();
  if (!gscPagesPath) return result;
  const lines = (await readFile(gscPagesPath, "utf8")).replace(/^\uFEFF/, "").trim().split(/\r?\n/);
  const headers = parseCsvLine(lines.shift() ?? "");
  for (const line of lines) {
    const cells = parseCsvLine(line);
    const row = Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
    const url = row["Top pages"];
    if (!url) continue;
    result.set(normalizeUrlPath(url), {
      clicks: Number(row.Clicks || 0),
      impressions: Number(row.Impressions || 0),
      ctr: row.CTR || "",
      position: row.Position || "",
    });
  }
  return result;
};

const extractStructuredTypes = (document) => {
  const types = new Set();
  for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const value = JSON.parse(script.textContent || "{}");
      const items = Array.isArray(value) ? value : [value];
      for (const item of items) {
        const type = item?.["@type"];
        if (Array.isArray(type)) type.forEach((entry) => types.add(String(entry)));
        else if (type) types.add(String(type));
      }
    } catch {
      types.add("invalid JSON-LD");
    }
  }
  return [...types].sort();
};

const analyzeHtml = (html, responseHeaders = new Headers()) => {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const internalTargets = new Set();
  let externalLinks = 0;
  for (const anchor of document.querySelectorAll("a[href]")) {
    try {
      const parsed = new URL(anchor.getAttribute("href"), SITE_ORIGIN);
      if (parsed.origin === SITE_ORIGIN) internalTargets.add(normalizeRoute(parsed.pathname));
      else if (/^https?:$/.test(parsed.protocol)) externalLinks += 1;
    } catch {
      // Invalid hrefs are caught by the repository search-readiness checks.
    }
  }
  const contentDocument = document.cloneNode(true);
  contentDocument.querySelectorAll("script,style,noscript,svg,nav,footer").forEach((node) => node.remove());
  const visibleText = clean(contentDocument.body?.textContent);
  const words = visibleText ? visibleText.split(/\s+/).length : 0;
  const dateMatch = visibleText.match(/(?:Published|Updated|Reviewed|Last reviewed|Effective date):?\s+([A-Z][a-z]+ \d{1,2}, \d{4}|\d{4}-\d{2}-\d{2})/i);
  return {
    title: clean(document.title),
    description: clean(document.querySelector('meta[name="description"]')?.getAttribute("content")),
    h1: clean(document.querySelector("h1")?.textContent),
    canonical: clean(document.querySelector('link[rel="canonical"]')?.getAttribute("href")),
    robots: clean(document.querySelector('meta[name="robots"]')?.getAttribute("content")),
    xRobots: clean(responseHeaders.get("x-robots-tag")),
    wordCount: words,
    meaningfulRender: Boolean(document.querySelector("h1")) && words >= 80,
    authorship: /Andrew Ciccarelli|Written by|Reviewed by|RN, BSN|BSN, RN/i.test(visibleText) ? "visible" : "not visible",
    date: dateMatch?.[1] ?? "not visible",
    citations: externalLinks,
    internalTargets: [...internalTargets].sort(),
    structuredData: extractStructuredTypes(document).join("; ") || "none",
    text: visibleText,
  };
};

const routeType = (route) => {
  if (route.startsWith("/articles/")) return "article";
  if (route.startsWith("/topics/")) return "topic guide";
  if (route.startsWith("/tools/")) return /calculator|estimator/.test(route) ? "calculator" : "guided tool";
  if (route.startsWith("/for-organizations")) return "retired organization route";
  if (route.startsWith("/products")) return "retired product route";
  if (route.startsWith("/app") || ["/account", "/sign-in", "/access-processing"].includes(route)) return "private application";
  if (route.includes("printable") || route.startsWith("/downloads/") || route.endsWith(".pdf")) return "supporting printable";
  if (["/about", "/methodology", "/editorial-policy", "/disclosures", "/accessibility", "/contact"].includes(route)) return "trust";
  if (["/privacy-policy", "/terms-of-use"].includes(route)) return "legal";
  if (["/", "/start-here", "/healthcare-workers", "/build-wealth", "/patients-families", "/student-loans", "/open-enrollment", "/insurance", "/medicare-care-costs", "/glossary"].includes(route)) return "hub";
  if (["/articles", "/topics", "/tools", "/guides", "/healthcare-workers/paycheck-tools"].includes(route)) return "directory";
  if (/\.(?:json|txt|xml|webmanifest)$/.test(route)) return "technical resource";
  if (route === "/404") return "error route";
  return "guide";
};

const audienceFor = (type, description) => {
  if (/healthcare worker|nurse/i.test(description)) return "healthcare workers";
  if (/patient|caregiver|family|hospital|Medicare|Medicaid/i.test(description)) return "patients, families, and caregivers";
  if (type === "trust" || type === "legal") return "all visitors and reviewers";
  if (type === "private application") return "authenticated account users";
  return "general public";
};

const qualityClassFor = ({ type, disposition, finalAnalysis, isPrivate, isError }) => {
  if (disposition === "redirect") return "9. Legacy route";
  if (isPrivate || isError || type === "technical resource") return "8. Technical or error route";
  if (disposition === "noindex") return "4. Useful supporting page; accessible but not indexed";
  if (type === "article" || type === "guide") return "1. Strong standalone educational resource";
  if (type === "calculator" || type === "guided tool") return "2. Strong interactive tool with adequate education";
  if (["trust", "legal", "hub", "directory", "topic guide"].includes(type)) return "3. Legitimate navigational or trust page";
  if ((finalAnalysis?.wordCount ?? 0) < 250) return "5. Thin or incomplete page";
  return "10. Unknown; manual decision";
};

const fetchState = async (url) => {
  try {
    const response = await fetch(url, {
      redirect: "manual",
      headers: { "user-agent": "CAF-AdSense-Release-Ledger/1.0", accept: "text/html,*/*;q=0.8" },
      signal: AbortSignal.timeout(20_000),
    });
    const body = await response.text();
    const analysis = /text\/html/i.test(response.headers.get("content-type") || "") ? analyzeHtml(body, response.headers) : null;
    return {
      status: response.status,
      finalDestination: response.headers.get("location") || response.url,
      analysis,
      xRobots: clean(response.headers.get("x-robots-tag")),
    };
  } catch (error) {
    return { status: "fetch failed", finalDestination: "", analysis: null, xRobots: "", error: error instanceof Error ? error.message : String(error) };
  }
};

const mapWithConcurrency = async (items, concurrency, worker) => {
  const results = new Array(items.length);
  let cursor = 0;
  const run = async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index);
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
  return results;
};

const productionSitemapResponse = await fetch(PRODUCTION_SITEMAP, { signal: AbortSignal.timeout(20_000) });
const productionSitemapXml = await productionSitemapResponse.text();
const originalSitemapRoutes = new Set(
  [...productionSitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => normalizeUrlPath(match[1])),
);
const finalSitemapXml = await readFile(path.join(repositoryRoot, "public", "sitemap.xml"), "utf8");
const finalSitemapRoutes = new Set(
  [...finalSitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => normalizeUrlPath(match[1])),
);
const vercelConfig = JSON.parse(await readFile(path.join(repositoryRoot, "vercel.json"), "utf8"));
const redirectMap = new Map(
  (vercelConfig.redirects ?? [])
    .filter((entry) => entry.permanent && typeof entry.source === "string" && !entry.source.includes(":") && !entry.source.includes("*"))
    .map((entry) => [normalizeRoute(entry.source), entry.destination]),
);

const controlledNoindex = new Set(ADDITIONAL_NON_INDEXED_PRERENDER_ROUTES.map(normalizeRoute));
const privateRoutes = new Set(["/app", ...PRIVATE_APP_SHELL_ROUTES, "/account", "/sign-in", "/access-processing"]);
const staticRoutes = [
  "/robots.txt",
  "/sitemap.xml",
  "/ads.txt",
  "/llms.txt",
  "/site.webmanifest",
  "/downloads/medical-bill-response-pack",
  "/downloads/medical-bill-response-pack.html",
  "/guides/hospital-discharge-medicare-quick-guide.pdf",
  "/patient-education/capability-manifest.json",
  "/patient-education/demo/controlled-preview-bundle.json",
  "/patient-education/schemas/controlled-preview-bundle-v1.schema.json",
  "/patient-education/schemas/public-package-descriptor-v1.schema.json",
  "/404",
];
const routeSet = new Set([
  ...originalSitemapRoutes,
  ...finalSitemapRoutes,
  ...redirectMap.keys(),
  ...controlledNoindex,
  ...privateRoutes,
  ...staticRoutes,
]);
const routes = [...routeSet].sort((left, right) => left.localeCompare(right));
const gscPerformance = await loadGscPerformance();

const productionStates = await mapWithConcurrency(routes, 10, async (route) => {
  const requestRoute = route === "/404" ? "/adsense-readiness-nonexistent-route" : route;
  return fetchState(`${SITE_ORIGIN}${requestRoute}`);
});

const finalAnalyses = new Map();
for (const route of new Set([...finalSitemapRoutes, ...controlledNoindex, ...privateRoutes])) {
  try {
    finalAnalyses.set(route, analyzeHtml(await readFile(routeToDistPath(route), "utf8")));
  } catch {
    // Redirects and runtime-only entries intentionally do not all have local HTML.
  }
}
try {
  finalAnalyses.set("/downloads/medical-bill-response-pack", analyzeHtml(await readFile(path.join(repositoryRoot, "public", "downloads", "medical-bill-response-pack.html"), "utf8")));
} catch {
  // Reported as incomplete below.
}
try {
  finalAnalyses.set("/404", analyzeHtml(await readFile(path.join(repositoryRoot, "dist", "404.html"), "utf8")));
} catch {
  // Reported as incomplete below.
}

const inboundOriginal = new Map(routes.map((route) => [route, 0]));
for (const state of productionStates) {
  for (const target of state.analysis?.internalTargets ?? []) inboundOriginal.set(target, (inboundOriginal.get(target) ?? 0) + 1);
}
const inboundFinal = new Map(routes.map((route) => [route, 0]));
for (const analysis of finalAnalyses.values()) {
  for (const target of analysis.internalTargets ?? []) inboundFinal.set(target, (inboundFinal.get(target) ?? 0) + 1);
}

const strengthenedRoutes = new Set([
  "/accessibility",
  "/contact",
  "/healthcare-workers/paycheck-tools",
  "/insurance/what-medicare-advantage-marketing-may-not-emphasize",
]);

const rows = routes.map((route, index) => {
  const type = routeType(route);
  const production = productionStates[index];
  const finalAnalysis = finalAnalyses.get(route);
  const redirectDestination = redirectMap.get(route);
  const isPrivate = privateRoutes.has(route);
  const isError = route === "/404";
  const isStaticNoindex = route.startsWith("/downloads/") || route.endsWith(".pdf") || route.startsWith("/patient-education/");
  const disposition = redirectDestination
    ? "redirect"
    : controlledNoindex.has(route) || isPrivate || isError || isStaticNoindex
      ? "noindex"
      : strengthenedRoutes.has(route)
        ? "strengthen"
        : "retain";
  const performance = gscPerformance.get(route);
  const finalStatus = redirectDestination ? "308 expected" : isError ? "404 expected" : finalAnalysis || staticRoutes.includes(route) ? "200 expected" : "not applicable";
  const finalDestination = redirectDestination
    ? new URL(redirectDestination, SITE_ORIGIN).toString()
    : `${SITE_ORIGIN}${route === "/" ? "/" : route}`;
  const originalAnalysis = production.analysis;
  const finalRobots = finalAnalysis?.robots || (isPrivate ? "noindex, nofollow, noarchive" : isStaticNoindex ? "X-Robots-Tag noindex" : "");
  const indexStatus = redirectDestination
    ? "excluded by final redirect"
    : controlledNoindex.has(route) || isPrivate || isStaticNoindex
      ? "excluded by final noindex"
      : "URL-level status unavailable; coverage export is aggregate only";
  const purpose = finalAnalysis?.description || originalAnalysis?.description || `${type} for Community Acquired Finance visitors`;
  const risk = disposition === "redirect" || disposition === "noindex"
    ? "low after remediation"
    : !finalAnalysis?.meaningfulRender && !type.includes("resource")
      ? "high"
      : (finalAnalysis?.wordCount ?? 999) < 250 && !["calculator", "guided tool", "trust", "legal"].includes(type)
        ? "medium"
        : "low";
  const originality = finalAnalysis?.authorship === "visible"
    ? "visible RN authorship or founder perspective"
    : ["calculator", "guided tool"].includes(type)
      ? "original interactive methodology and next-step guidance"
      : type === "article"
        ? "source-backed article; article-specific RN note not always recorded"
        : "not applicable or not visibly asserted";
  return {
    url: `${SITE_ORIGIN}${route === "/" ? "/" : route}`,
    routeType: type,
    qualityClass: qualityClassFor({ type, disposition, finalAnalysis, isPrivate, isError }),
    originalStatus: production.status,
    originalFinalDestination: production.finalDestination,
    originalCanonical: originalAnalysis?.canonical || "",
    originalRobots: originalAnalysis?.robots || "",
    originalXRobots: production.xRobots,
    originalSitemap: originalSitemapRoutes.has(route) ? "yes" : "no",
    finalStatus,
    finalFinalDestination: finalDestination,
    finalCanonical: finalAnalysis?.canonical || (redirectDestination || isError || type === "technical resource" ? "" : finalDestination),
    finalRobots,
    finalXRobots: isPrivate ? "noindex, nofollow, noarchive" : isStaticNoindex ? "noindex configured" : "",
    finalSitemap: finalSitemapRoutes.has(route) ? "yes" : "no",
    googleIndexStatus: indexStatus,
    lastCrawl: "unavailable in attached exports",
    gscClicks: performance?.clicks ?? 0,
    gscImpressions: performance?.impressions ?? 0,
    meaningfulContentWithoutInteraction: finalAnalysis?.meaningfulRender ? "yes" : disposition === "redirect" ? "not applicable" : "not verified",
    title: finalAnalysis?.title || originalAnalysis?.title || "",
    metaDescription: finalAnalysis?.description || originalAnalysis?.description || "",
    h1: finalAnalysis?.h1 || originalAnalysis?.h1 || "",
    pagePurpose: purpose,
    intendedAudience: audienceFor(type, purpose),
    primarySearchIntent: type === "article" || type === "guide" ? "learn and prepare next steps" : type === "calculator" || type === "guided tool" ? "calculate, compare, or prepare" : type === "trust" || type === "legal" ? "verify publisher trust and terms" : "navigate or use a supporting resource",
    substantiveDepth: `${finalAnalysis?.wordCount ?? 0} visible words${["calculator", "guided tool"].includes(type) ? " plus interaction" : ""}`,
    visibleAuthorship: finalAnalysis?.authorship || "not applicable",
    publishedOrUpdatedDate: finalAnalysis?.date || "not visible",
    citations: finalAnalysis?.citations ?? 0,
    internalLinksInOriginal: inboundOriginal.get(route) ?? 0,
    internalLinksOutOriginal: originalAnalysis?.internalTargets.length ?? 0,
    internalLinksInFinal: inboundFinal.get(route) ?? 0,
    internalLinksOutFinal: finalAnalysis?.internalTargets.length ?? 0,
    structuredData: finalAnalysis?.structuredData || "none",
    duplicationOrOverlap: controlledNoindex.has(route) || isStaticNoindex ? "supporting or printable variant removed from index" : redirectDestination ? "legacy or inactive route consolidated" : "no exact metadata duplication detected",
    completeness: disposition === "redirect" || disposition === "noindex" || finalAnalysis?.meaningfulRender ? "complete for final disposition" : "manual verification required",
    originalAnalysisOrFirsthandExpertise: originality,
    disposition,
    adsenseRisk: risk,
  };
});

const headers = Object.keys(rows[0]);
await writeFile(
  outputCsv,
  `${headers.map(csvCell).join(",")}\n${rows.map((row) => headers.map((header) => csvCell(row[header])).join(",")).join("\n")}\n`,
  "utf8",
);

const counts = {
  rows: rows.length,
  originalSitemap: originalSitemapRoutes.size,
  finalSitemap: finalSitemapRoutes.size,
  redirects: rows.filter((row) => row.disposition === "redirect").length,
  noindex: rows.filter((row) => row.disposition === "noindex").length,
  strengthen: rows.filter((row) => row.disposition === "strengthen").length,
  retain: rows.filter((row) => row.disposition === "retain").length,
  highRisk: rows.filter((row) => row.adsenseRisk === "high").length,
};

await writeFile(
  outputMarkdown,
  `# AdSense resubmission URL ledger\n\nGenerated ${REPORT_DATE} from the live production sitemap and responses, final build output, Vercel route configuration, and the attached Search Console Pages export.\n\n## Scope\n\n- Ledger rows: ${counts.rows}\n- Production sitemap URLs before remediation: ${counts.originalSitemap}\n- Final sitemap URLs: ${counts.finalSitemap}\n- Redirect dispositions: ${counts.redirects}\n- Noindex dispositions: ${counts.noindex}\n- Strengthen dispositions: ${counts.strengthen}\n- Retain dispositions: ${counts.retain}\n- Remaining high-risk rows: ${counts.highRisk}\n\nThe CSV is the complete row-level ledger. The Search Console export does not include URL Inspection samples or last-crawl dates, so those fields are explicitly marked unavailable rather than inferred.\n`,
  "utf8",
);

console.log(`Wrote ${path.relative(repositoryRoot, outputCsv)} with ${rows.length} rows.`);
console.log(`Wrote ${path.relative(repositoryRoot, outputMarkdown)}.`);
