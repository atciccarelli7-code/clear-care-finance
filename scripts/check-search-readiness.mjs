import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createServer } from "vite";
import {
  ADDITIONAL_NON_INDEXED_PRERENDER_ROUTES,
  getCanonicalRoutes,
  normalizeRoute,
  repositoryRoot,
} from "./seo-route-utils.mjs";

const siteUrl = (process.env.VITE_SITE_URL || "https://communityacquiredfinance.com").replace(/\/$/, "");
const distDir = path.join(repositoryRoot, "dist");
const errors = [];
const warnings = [];

const outputPathForRoute = (route) =>
  route === "/" ? path.join(distDir, "index.html") : path.join(distDir, `${route.replace(/^\//, "")}.html`);

const decodeHtml = (value) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&#039;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&nbsp;", " ");

const extractAll = (html, pattern) => Array.from(html.matchAll(pattern), (match) => match[1]);
const extractFirst = (html, pattern) => html.match(pattern)?.[1]?.trim();
const expectedFullTitle = (title) => (title.includes("Community Acquired Finance") ? title : `${title} | Community Acquired Finance`);

const compareSets = (label, actual, expected) => {
  const missing = [...expected].filter((item) => !actual.has(item));
  const extra = [...actual].filter((item) => !expected.has(item));
  if (missing.length) errors.push(`${label} is missing: ${missing.join(", ")}`);
  if (extra.length) errors.push(`${label} contains unexpected entries: ${extra.join(", ")}`);
};

const normalizeInternalHref = (href) => {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
    return null;
  }

  let parsed;
  try {
    parsed = new URL(href, siteUrl);
  } catch {
    return null;
  }

  if (parsed.origin !== siteUrl) return null;
  const pathname = normalizeRoute(parsed.pathname);
  if (pathname.startsWith("/api/")) return null;
  if (/\.(?:pdf|png|jpe?g|gif|svg|webp|ico|xml|txt|json|webmanifest|css|js|map|woff2?)$/i.test(pathname)) return null;
  return pathname;
};

const vite = await createServer({
  root: repositoryRoot,
  mode: "production",
  appType: "custom",
  logLevel: "error",
  server: { middlewareMode: true },
});

try {
  const [{ getIndexableRoutes }, { resolveSiteSeoMeta }] = await Promise.all([
    vite.ssrLoadModule("/src/lib/seoRegistry.ts"),
    vite.ssrLoadModule("/src/lib/siteSeoMeta.ts"),
  ]);

  const { permanentRedirects, registryRoutes, canonicalRoutes } = await getCanonicalRoutes(getIndexableRoutes);
  const expectedRoutes = new Set(canonicalRoutes);
  const expectedControlledRoutes = new Set(ADDITIONAL_NON_INDEXED_PRERENDER_ROUTES.map(normalizeRoute));
  const knownHtmlRoutes = new Set([...expectedRoutes, ...expectedControlledRoutes]);

  if (canonicalRoutes.length !== expectedRoutes.size) errors.push("Canonical route list contains duplicates.");
  if (!expectedRoutes.has("/")) errors.push("Canonical route list does not contain the homepage.");
  for (const route of expectedControlledRoutes) {
    if (expectedRoutes.has(route)) errors.push(`Controlled noindex route is incorrectly canonical: ${route}`);
  }

  const sitemapXml = await readFile(path.join(repositoryRoot, "public", "sitemap.xml"), "utf8");
  const sitemapUrls = extractAll(sitemapXml, /<loc>([\s\S]*?)<\/loc>/gi).map((value) => decodeHtml(value.trim()));
  const sitemapRoutes = sitemapUrls.map((value) => {
    const parsed = new URL(value);
    if (parsed.origin !== siteUrl) errors.push(`Sitemap URL uses a noncanonical origin: ${value}`);
    if (parsed.search || parsed.hash) errors.push(`Sitemap URL contains a query string or fragment: ${value}`);
    return normalizeRoute(parsed.pathname);
  });
  if (sitemapRoutes.length !== new Set(sitemapRoutes).size) errors.push("Sitemap contains duplicate URLs.");
  compareSets("Sitemap", new Set(sitemapRoutes), expectedRoutes);
  for (const route of expectedControlledRoutes) {
    if (sitemapRoutes.includes(route)) errors.push(`Controlled noindex route appears in sitemap: ${route}`);
  }

  const robots = await readFile(path.join(repositoryRoot, "public", "robots.txt"), "utf8");
  if (!/User-agent:\s*\*/i.test(robots)) errors.push("robots.txt is missing the general user-agent group.");
  if (!/Allow:\s*\//i.test(robots)) errors.push("robots.txt does not explicitly allow crawling.");
  if (/Disallow:\s*\//i.test(robots)) errors.push("robots.txt blocks the entire site.");
  if (!robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) errors.push("robots.txt does not reference the canonical sitemap URL.");

  const manifest = JSON.parse(await readFile(path.join(distDir, "prerender-manifest.json"), "utf8"));
  compareSets("Prerender manifest", new Set((manifest.routes ?? []).map(normalizeRoute)), expectedRoutes);
  compareSets(
    "Controlled noindex prerender manifest",
    new Set((manifest.nonIndexableRoutes ?? []).map(normalizeRoute)),
    expectedControlledRoutes,
  );

  for (const redirectSource of permanentRedirects.keys()) {
    if (expectedRoutes.has(redirectSource)) errors.push(`Permanent redirect is incorrectly treated as canonical: ${redirectSource}`);
    if (sitemapRoutes.includes(redirectSource)) errors.push(`Permanent redirect appears in sitemap: ${redirectSource}`);
    if ((manifest.routes ?? []).map(normalizeRoute).includes(redirectSource)) errors.push(`Permanent redirect appears in prerender manifest: ${redirectSource}`);
  }

  const titleOwners = new Map();
  const descriptionOwners = new Map();
  const inboundLinks = new Map(canonicalRoutes.map((route) => [route, new Set()]));
  const routeReports = [];

  for (const route of canonicalRoutes) {
    const outputPath = outputPathForRoute(route);
    try {
      await access(outputPath);
    } catch {
      errors.push(`Missing prerendered HTML for ${route}: ${path.relative(repositoryRoot, outputPath)}`);
      continue;
    }

    const html = await readFile(outputPath, "utf8");
    const meta = resolveSiteSeoMeta(route);
    const expectedTitle = expectedFullTitle(meta.title);
    const expectedCanonical = `${siteUrl}${route === "/" ? "/" : route}`;

    const titles = extractAll(html, /<title>([\s\S]*?)<\/title>/gi).map((value) => decodeHtml(value.trim()));
    const descriptions = extractAll(html, /<meta\s+name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/gi).map(decodeHtml);
    const canonicals = extractAll(html, /<link\s+rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/gi).map(decodeHtml);
    const robotsValues = extractAll(html, /<meta\s+name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/gi).map(decodeHtml);
    const googlebotValues = extractAll(html, /<meta\s+name=["']googlebot["'][^>]*content=["']([^"']*)["'][^>]*>/gi).map(decodeHtml);
    const h1Values = extractAll(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi);
    const jsonLdValues = extractAll(html, /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);

    if (titles.length !== 1) errors.push(`${route} has ${titles.length} title elements; expected 1.`);
    if (titles[0] !== expectedTitle) errors.push(`${route} title mismatch. Expected “${expectedTitle}”, found “${titles[0] ?? "missing"}”.`);
    if (descriptions.length !== 1) errors.push(`${route} has ${descriptions.length} meta descriptions; expected 1.`);
    if (descriptions[0] !== meta.description) errors.push(`${route} meta description does not match the SEO registry.`);
    if (canonicals.length !== 1) errors.push(`${route} has ${canonicals.length} canonical links; expected 1.`);
    if (canonicals[0] !== expectedCanonical) errors.push(`${route} canonical mismatch. Expected ${expectedCanonical}, found ${canonicals[0] ?? "missing"}.`);
    if (robotsValues.length !== 1 || /noindex/i.test(robotsValues[0] ?? "")) errors.push(`${route} does not have one indexable robots directive.`);
    if (googlebotValues.length !== 1 || /noindex/i.test(googlebotValues[0] ?? "")) errors.push(`${route} does not have one indexable googlebot directive.`);
    if (h1Values.length !== 1) errors.push(`${route} has ${h1Values.length} H1 elements; expected 1.`);
    if (!/<main\b[^>]*id=["']main-content["']/i.test(html)) errors.push(`${route} is missing the primary main-content landmark.`);
    if (/<div\s+id=["']root["']>\s*<\/div>/i.test(html)) errors.push(`${route} contains an empty application root instead of prerendered content.`);
    if (!jsonLdValues.length) errors.push(`${route} has no JSON-LD structured data.`);

    for (const value of jsonLdValues) {
      try {
        JSON.parse(value);
      } catch {
        errors.push(`${route} contains invalid JSON-LD.`);
      }
    }

    const title = titles[0];
    const description = descriptions[0];
    if (title) {
      const existing = titleOwners.get(title) ?? [];
      existing.push(route);
      titleOwners.set(title, existing);
    }
    if (description) {
      const existing = descriptionOwners.get(description) ?? [];
      existing.push(route);
      descriptionOwners.set(description, existing);
    }

    const internalTargets = new Set();
    for (const href of extractAll(html, /<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi).map(decodeHtml)) {
      const target = normalizeInternalHref(href);
      if (!target) continue;
      internalTargets.add(target);

      if (permanentRedirects.has(target)) {
        errors.push(`${route} links internally through permanent redirect ${target}; link directly to ${permanentRedirects.get(target)}.`);
        continue;
      }
      if (!knownHtmlRoutes.has(target)) {
        errors.push(`${route} links to an unknown internal HTML route: ${target}`);
        continue;
      }
      inboundLinks.get(target)?.add(route);
    }

    routeReports.push({
      route,
      title: title ?? null,
      description: description ?? null,
      canonical: canonicals[0] ?? null,
      h1Count: h1Values.length,
      jsonLdCount: jsonLdValues.length,
      internalTargets: [...internalTargets].sort(),
    });
  }

  for (const route of expectedControlledRoutes) {
    const outputPath = outputPathForRoute(route);
    try {
      await access(outputPath);
    } catch {
      errors.push(`Missing controlled noindex HTML for ${route}: ${path.relative(repositoryRoot, outputPath)}`);
      continue;
    }

    const html = await readFile(outputPath, "utf8");
    const meta = resolveSiteSeoMeta(route);
    const robotsValue = decodeHtml(extractFirst(html, /<meta\s+name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i) ?? "");
    const googlebotValue = decodeHtml(extractFirst(html, /<meta\s+name=["']googlebot["'][^>]*content=["']([^"']*)["'][^>]*>/i) ?? "");
    const title = decodeHtml(extractFirst(html, /<title>([\s\S]*?)<\/title>/i) ?? "");
    const expectedTitle = expectedFullTitle(meta.title);

    if (!/noindex/i.test(robotsValue)) errors.push(`${route} controlled preview is missing noindex robots metadata.`);
    if (!/noindex/i.test(googlebotValue)) errors.push(`${route} controlled preview is missing noindex googlebot metadata.`);
    if (title !== expectedTitle) errors.push(`${route} controlled preview title does not match its SEO metadata.`);
    if (!/<h1\b/i.test(html)) errors.push(`${route} controlled preview is missing an H1.`);
    if (!/<main\b[^>]*id=["']main-content["']/i.test(html)) errors.push(`${route} controlled preview is missing the primary main-content landmark.`);
    if (/<div\s+id=["']root["']>\s*<\/div>/i.test(html)) errors.push(`${route} controlled preview contains an empty application root.`);
  }

  for (const [title, owners] of titleOwners) {
    if (owners.length > 1) errors.push(`Duplicate title “${title}” is used by: ${owners.join(", ")}`);
  }
  for (const [description, owners] of descriptionOwners) {
    if (owners.length > 1) warnings.push(`Duplicate meta description is used by: ${owners.join(", ")} — “${description}”`);
  }
  for (const [route, sources] of inboundLinks) {
    if (route !== "/" && sources.size === 0) errors.push(`Orphan canonical route has no inbound internal link: ${route}`);
  }

  const notFoundPath = path.join(distDir, "404.html");
  const notFoundHtml = await readFile(notFoundPath, "utf8");
  const notFoundRobots = decodeHtml(extractFirst(notFoundHtml, /<meta\s+name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i) ?? "");
  if (!/noindex/i.test(notFoundRobots)) errors.push("404.html is not marked noindex.");
  if (!/<h1\b/i.test(notFoundHtml)) errors.push("404.html is missing an H1.");

  const report = {
    generatedAt: new Date().toISOString(),
    siteUrl,
    registryRouteCount: registryRoutes.length,
    canonicalRouteCount: canonicalRoutes.length,
    controlledNoindexRouteCount: expectedControlledRoutes.size,
    sitemapRouteCount: sitemapRoutes.length,
    prerenderRouteCount: manifest.routes?.length ?? 0,
    permanentRedirectCount: permanentRedirects.size,
    errorCount: errors.length,
    warningCount: warnings.length,
    errors,
    warnings,
    routes: routeReports,
  };

  await writeFile(path.join(distDir, "search-readiness-report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");

  for (const warning of warnings) console.warn(`Search readiness warning: ${warning}`);
  if (errors.length) {
    for (const error of errors) console.error(`Search readiness error: ${error}`);
    throw new Error(`Search readiness audit failed with ${errors.length} error(s).`);
  }

  console.log(
    `Search readiness passed: ${canonicalRoutes.length} canonical routes, ${expectedControlledRoutes.size} controlled noindex route, ${sitemapRoutes.length} sitemap URLs, ${permanentRedirects.size} permanent redirects, ${warnings.length} warning(s).`,
  );
} finally {
  await vite.close();
}
