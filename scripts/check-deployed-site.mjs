import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const CANONICAL_ORIGIN = "https://communityacquiredfinance.com";
export const MANAGED_ADSENSE_SCRIPT_ID = "caf-route-aware-adsense";

export const REPRESENTATIVE_ROUTES = [
  {
    path: "/",
    markers: ["Understand your money", "Community Acquired Finance"],
    adFree: true,
  },
  {
    path: "/start-here",
    markers: ["Start Here", "starting point"],
    adFree: true,
  },
  {
    path: "/tools",
    markers: ["Financial Tools", "tools"],
    adFree: true,
  },
  {
    path: "/tools/benefits-change-detector",
    markers: ["Benefits Change Detector", "benefit changes"],
    adFree: true,
  },
  {
    path: "/tools/roth-vs-traditional-decision-helper",
    markers: ["Roth vs Traditional", "Roth and Traditional"],
    adFree: true,
  },
  {
    path: "/insurance/medical-bill-review-toolkit",
    markers: ["Medical Bill Review", "medical bill"],
    adFree: false,
  },
  {
    path: "/medicare-care-costs/turning-65",
    markers: ["Turning 65", "Medicare"],
    adFree: true,
  },
  {
    path: "/articles/what-employer-benefit-changes-should-i-compare",
    markers: ["Employer Benefit Changes", "benefit changes"],
    adFree: false,
  },
  {
    path: "/products/healthcare-worker-benefits-decision-system",
    markers: ["Healthcare Worker Benefits Decision System", "Interactive decision system"],
    adFree: true,
  },
];

const ERROR_SHELL_PATTERNS = [
  /DEPLOYMENT_NOT_FOUND/i,
  /Vercel Security Checkpoint/i,
  /Application error/i,
  /Internal Server Error/i,
  /This page could not be found/i,
  /The page you are looking for does not exist/i,
  /FUNCTION_INVOCATION_FAILED/i,
];

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const decodeHtml = (value) =>
  value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&nbsp;/gi, " ");

const visibleText = (html) =>
  decodeHtml(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " "),
  ).trim();

const extractTag = (html, tagName) => {
  const match = html.match(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? visibleText(match[1]) : "";
};

const extractCanonical = (html) => {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  const canonicalTag = tags.find((tag) => /\brel=["'][^"']*\bcanonical\b[^"']*["']/i.test(tag));
  if (!canonicalTag) return "";
  const href = canonicalTag.match(/\bhref=["']([^"']+)["']/i);
  return href ? decodeHtml(href[1]) : "";
};

const hasNoIndexMeta = (html) => {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  return tags.some(
    (tag) =>
      /\bname=["'](?:robots|googlebot)["']/i.test(tag) &&
      /\bcontent=["'][^"']*noindex[^"']*["']/i.test(tag),
  );
};

const normalizePathname = (pathname) => {
  const normalized = pathname.replace(/\/+$/, "");
  return normalized || "/";
};

export const normalizeBaseUrl = (value) => {
  const parsed = new URL(value);
  if (!/^https?:$/.test(parsed.protocol)) throw new Error("Smoke-test base URL must use HTTP or HTTPS.");
  parsed.pathname = normalizePathname(parsed.pathname);
  parsed.search = "";
  parsed.hash = "";
  return parsed.toString().replace(/\/$/, "");
};

export const resolveEnvironment = (requestedEnvironment, baseUrl, canonicalOrigin = CANONICAL_ORIGIN) => {
  if (requestedEnvironment === "production" || requestedEnvironment === "preview") return requestedEnvironment;
  if (requestedEnvironment !== "auto") throw new Error(`Unknown smoke environment: ${requestedEnvironment}`);
  return new URL(baseUrl).origin === new URL(canonicalOrigin).origin ? "production" : "preview";
};

const expectedCanonicalForPath = (canonicalOrigin, pathname) =>
  new URL(normalizePathname(pathname), `${canonicalOrigin}/`).toString();

const requireSecurityHeaders = (headers, errors) => {
  const contentTypeOptions = headers.get("x-content-type-options") ?? "";
  const frameOptions = headers.get("x-frame-options") ?? "";
  const referrerPolicy = headers.get("referrer-policy") ?? "";
  const permissionsPolicy = headers.get("permissions-policy") ?? "";

  if (contentTypeOptions.toLowerCase() !== "nosniff") errors.push("missing X-Content-Type-Options: nosniff");
  if (frameOptions.toUpperCase() !== "DENY") errors.push("missing X-Frame-Options: DENY");
  if (!referrerPolicy.toLowerCase().includes("strict-origin-when-cross-origin")) {
    errors.push("missing strict-origin-when-cross-origin Referrer-Policy");
  }
  if (!permissionsPolicy.includes("camera=()") || !permissionsPolicy.includes("microphone=()")) {
    errors.push("Permissions-Policy does not disable camera and microphone");
  }
};

export const validateHtmlDocument = ({
  route,
  body,
  headers,
  status,
  finalUrl,
  environment,
  canonicalOrigin = CANONICAL_ORIGIN,
}) => {
  const errors = [];
  const expectedCanonical = expectedCanonicalForPath(canonicalOrigin, route.path);
  const contentType = headers.get("content-type") ?? "";
  const title = extractTag(body, "title");
  const heading = extractTag(body, "h1");
  const canonical = extractCanonical(body);
  const text = visibleText(body);

  if (status < 200 || status >= 300) errors.push(`expected HTTP 2xx, received ${status}`);
  if (!contentType.toLowerCase().includes("text/html")) errors.push(`expected HTML content type, received ${contentType || "none"}`);
  if (!title || title.length < 12) errors.push("missing or non-meaningful document title");
  if (!heading || heading.length < 4) errors.push("missing or non-meaningful H1 heading");
  if (!canonical) errors.push("missing canonical link");
  if (canonical && canonical !== expectedCanonical) {
    errors.push(`canonical mismatch: expected ${expectedCanonical}, received ${canonical}`);
  }
  if (hasNoIndexMeta(body)) errors.push("canonical public route contains a noindex meta directive");
  if (environment === "production" && /\bnoindex\b/i.test(headers.get("x-robots-tag") ?? "")) {
    errors.push("production response contains an X-Robots-Tag noindex directive");
  }
  if (!route.markers.some((marker) => text.toLowerCase().includes(marker.toLowerCase()))) {
    errors.push(`missing route-specific content marker (${route.markers.join(" or ")})`);
  }
  for (const pattern of ERROR_SHELL_PATTERNS) {
    if (pattern.test(body)) errors.push(`known deployment/error shell detected: ${pattern.source}`);
  }
  if (!body.includes('id="root"')) errors.push("missing application root element");
  if (route.adFree && (body.includes(`id="${MANAGED_ADSENSE_SCRIPT_ID}"`) || body.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"))) {
    errors.push("ad-free route contains the managed AdSense script in initial HTML");
  }

  requireSecurityHeaders(headers, errors);

  return {
    path: route.path,
    type: "html",
    status,
    finalUrl,
    title,
    heading,
    canonical,
    expectedCanonical,
    passed: errors.length === 0,
    errors,
  };
};

export const validateRobotsDocument = ({ body, headers, status, finalUrl, canonicalOrigin = CANONICAL_ORIGIN }) => {
  const errors = [];
  const canonicalHost = new URL(canonicalOrigin).hostname;
  const contentType = headers.get("content-type") ?? "";

  if (status < 200 || status >= 300) errors.push(`expected HTTP 2xx, received ${status}`);
  if (!contentType.toLowerCase().includes("text/plain")) errors.push(`expected text/plain content type, received ${contentType || "none"}`);
  if (!/^User-agent:\s*\*/im.test(body)) errors.push("robots.txt is missing the wildcard user-agent group");
  if (!/^Allow:\s*\/$/im.test(body)) errors.push("robots.txt does not explicitly allow the public site");
  if (!body.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`)) errors.push("robots.txt sitemap URL is missing or non-canonical");
  if (!body.includes(`Host: ${canonicalHost}`)) errors.push("robots.txt host directive is missing or non-canonical");

  return { path: "/robots.txt", type: "robots", status, finalUrl, passed: errors.length === 0, errors };
};

export const validateSitemapDocument = ({
  body,
  headers,
  status,
  finalUrl,
  htmlRoutes = REPRESENTATIVE_ROUTES,
  canonicalOrigin = CANONICAL_ORIGIN,
}) => {
  const errors = [];
  const contentType = headers.get("content-type") ?? "";
  const locations = Array.from(body.matchAll(/<loc>([^<]+)<\/loc>/gi), (match) => decodeHtml(match[1].trim()));

  if (status < 200 || status >= 300) errors.push(`expected HTTP 2xx, received ${status}`);
  if (!contentType.toLowerCase().includes("xml") && !/^\s*<\?xml|<urlset\b/i.test(body)) {
    errors.push(`expected XML sitemap content, received ${contentType || "unknown content type"}`);
  }
  if (locations.length < htmlRoutes.length) errors.push("sitemap contains fewer URLs than the representative route set");

  for (const location of locations) {
    if (!location.startsWith(`${canonicalOrigin}/`) && location !== `${canonicalOrigin}/`) {
      errors.push(`non-canonical sitemap location: ${location}`);
      break;
    }
  }

  for (const route of htmlRoutes) {
    const expected = expectedCanonicalForPath(canonicalOrigin, route.path);
    if (!locations.includes(expected)) errors.push(`representative route missing from sitemap: ${expected}`);
  }

  return {
    path: "/sitemap.xml",
    type: "sitemap",
    status,
    finalUrl,
    urlCount: locations.length,
    passed: errors.length === 0,
    errors,
  };
};

const buildHeaders = () => {
  const headers = new Headers({
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5",
    "user-agent": "CAF-Deployed-Site-Smoke/1.0",
  });
  const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim();
  if (bypassSecret) {
    headers.set("x-vercel-protection-bypass", bypassSecret);
    headers.set("x-vercel-set-bypass-cookie", "true");
  }
  return headers;
};

const fetchWithRetry = async (url, { attempts, delayMs }) => {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: buildHeaders(),
        redirect: "follow",
        signal: AbortSignal.timeout(20_000),
      });
      if (response.ok || (response.status < 500 && response.status !== 404)) return response;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    if (attempt < attempts) await sleep(delayMs);
  }
  throw new Error(`Unable to fetch ${url} after ${attempts} attempts: ${lastError?.message ?? "unknown error"}`);
};

const parseArguments = (argv) => {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!argument.startsWith("--")) continue;
    const key = argument.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for --${key}`);
    values[key] = value;
    index += 1;
  }
  return values;
};

export const runSmokeChecks = async ({
  baseUrl,
  environment = "auto",
  canonicalOrigin = CANONICAL_ORIGIN,
  attempts = 6,
  delayMs = 10_000,
  reportPath = "artifacts/deployed-site-smoke.json",
}) => {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const resolvedEnvironment = resolveEnvironment(environment, normalizedBaseUrl, canonicalOrigin);
  const startedAt = new Date().toISOString();
  const results = [];

  for (const route of REPRESENTATIVE_ROUTES) {
    const routeUrl = new URL(route.path, `${normalizedBaseUrl}/`).toString();
    const started = Date.now();
    try {
      const response = await fetchWithRetry(routeUrl, { attempts, delayMs });
      const body = await response.text();
      results.push({
        ...validateHtmlDocument({
          route,
          body,
          headers: response.headers,
          status: response.status,
          finalUrl: response.url,
          environment: resolvedEnvironment,
          canonicalOrigin,
        }),
        durationMs: Date.now() - started,
      });
    } catch (error) {
      results.push({
        path: route.path,
        type: "html",
        passed: false,
        durationMs: Date.now() - started,
        errors: [error instanceof Error ? error.message : String(error)],
      });
    }
  }

  for (const specialPath of ["/robots.txt", "/sitemap.xml"]) {
    const routeUrl = new URL(specialPath, `${normalizedBaseUrl}/`).toString();
    const started = Date.now();
    try {
      const response = await fetchWithRetry(routeUrl, { attempts, delayMs });
      const body = await response.text();
      const result =
        specialPath === "/robots.txt"
          ? validateRobotsDocument({
              body,
              headers: response.headers,
              status: response.status,
              finalUrl: response.url,
              canonicalOrigin,
            })
          : validateSitemapDocument({
              body,
              headers: response.headers,
              status: response.status,
              finalUrl: response.url,
              canonicalOrigin,
            });
      results.push({ ...result, durationMs: Date.now() - started });
    } catch (error) {
      results.push({
        path: specialPath,
        type: specialPath === "/robots.txt" ? "robots" : "sitemap",
        passed: false,
        durationMs: Date.now() - started,
        errors: [error instanceof Error ? error.message : String(error)],
      });
    }
  }

  const report = {
    schemaVersion: 1,
    startedAt,
    completedAt: new Date().toISOString(),
    baseUrl: normalizedBaseUrl,
    canonicalOrigin,
    environment: resolvedEnvironment,
    passed: results.every((result) => result.passed),
    checkedRoutes: results.length,
    failedRoutes: results.filter((result) => !result.passed).length,
    results,
  };

  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  for (const result of results) {
    const status = result.passed ? "PASS" : "FAIL";
    console.log(`${status.padEnd(4)} ${result.path} (${result.durationMs} ms)`);
    for (const error of result.errors ?? []) console.error(`     - ${error}`);
  }
  console.log(`\n${report.passed ? "Deployed-site smoke checks passed" : "Deployed-site smoke checks failed"}: ${results.length - report.failedRoutes}/${results.length} routes healthy.`);
  console.log(`Report: ${reportPath}`);

  return report;
};

const isMainModule = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;

if (isMainModule) {
  const args = parseArguments(process.argv.slice(2));
  const baseUrl = args["base-url"] ?? process.env.SMOKE_BASE_URL;
  if (!baseUrl) {
    console.error("Usage: node scripts/check-deployed-site.mjs --base-url <url> [--environment auto|preview|production]");
    process.exitCode = 2;
  } else {
    try {
      const report = await runSmokeChecks({
        baseUrl,
        environment: args.environment ?? process.env.SMOKE_ENVIRONMENT ?? "auto",
        canonicalOrigin: args["canonical-origin"] ?? process.env.SMOKE_CANONICAL_ORIGIN ?? CANONICAL_ORIGIN,
        attempts: Number(args.attempts ?? process.env.SMOKE_ATTEMPTS ?? 6),
        delayMs: Number(args["delay-ms"] ?? process.env.SMOKE_DELAY_MS ?? 10_000),
        reportPath: args.report ?? process.env.SMOKE_REPORT_PATH ?? "artifacts/deployed-site-smoke.json",
      });
      if (!report.passed) process.exitCode = 1;
    } catch (error) {
      console.error(error instanceof Error ? error.stack ?? error.message : String(error));
      process.exitCode = 1;
    }
  }
}
