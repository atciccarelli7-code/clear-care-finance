import { describe, expect, it } from "vitest";
import {
  CANONICAL_ORIGIN,
  MANAGED_ADSENSE_SCRIPT_ID,
  normalizeBaseUrl,
  resolveEnvironment,
  validateHtmlDocument,
  validateRobotsDocument,
  validateSitemapDocument,
} from "./check-deployed-site.mjs";

const securityHeaders = (extra = {}) =>
  new Headers({
    "content-type": "text/html; charset=utf-8",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "strict-origin-when-cross-origin",
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
    ...extra,
  });

const htmlFor = ({ pathname, title = "Benefits Change Detector | Community Acquired Finance", heading = "Benefits Change Detector", body = "Review benefit changes clearly.", extraHead = "" }) => `<!doctype html>
<html lang="en">
  <head>
    <title>${title}</title>
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${new URL(pathname, `${CANONICAL_ORIGIN}/`)}" />
    ${extraHead}
  </head>
  <body><div id="root"><main><h1>${heading}</h1><p>${body}</p></main></div></body>
</html>`;

describe("deployed-site smoke helpers", () => {
  it("normalizes base URLs and resolves production versus preview", () => {
    expect(normalizeBaseUrl("https://communityacquiredfinance.com/")).toBe(CANONICAL_ORIGIN);
    expect(resolveEnvironment("auto", CANONICAL_ORIGIN)).toBe("production");
    expect(resolveEnvironment("auto", "https://clear-care-finance-example.vercel.app")).toBe("preview");
  });

  it("accepts a healthy protected HTML route", () => {
    const route = {
      path: "/tools/benefits-change-detector",
      markers: ["Benefits Change Detector"],
      adFree: true,
    };
    const result = validateHtmlDocument({
      route,
      body: htmlFor({ pathname: route.path }),
      headers: securityHeaders(),
      status: 200,
      finalUrl: `${CANONICAL_ORIGIN}${route.path}`,
      environment: "production",
    });

    expect(result.passed).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("allows Vercel preview noindex response headers while preserving indexable HTML metadata", () => {
    const route = { path: "/start-here", markers: ["Start Here"], adFree: true };
    const result = validateHtmlDocument({
      route,
      body: htmlFor({ pathname: route.path, title: "Start Here | Community Acquired Finance", heading: "Start Here", body: "Choose a starting point." }),
      headers: securityHeaders({ "x-robots-tag": "noindex" }),
      status: 200,
      finalUrl: "https://preview.vercel.app/start-here",
      environment: "preview",
    });

    expect(result.passed).toBe(true);
  });

  it("rejects canonical, indexing, ad-safety, security, and error-shell regressions", () => {
    const route = { path: "/tools/benefits-change-detector", markers: ["Benefits Change Detector"], adFree: true };
    const body = htmlFor({
      pathname: "/wrong-route",
      extraHead: `<meta name="googlebot" content="noindex" /><script id="${MANAGED_ADSENSE_SCRIPT_ID}" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>`,
      body: "Application error",
    });
    const result = validateHtmlDocument({
      route,
      body,
      headers: new Headers({ "content-type": "text/html", "x-robots-tag": "noindex" }),
      status: 200,
      finalUrl: `${CANONICAL_ORIGIN}${route.path}`,
      environment: "production",
    });

    expect(result.passed).toBe(false);
    expect(result.errors.join("\n")).toMatch(/canonical mismatch/);
    expect(result.errors.join("\n")).toMatch(/noindex meta/);
    expect(result.errors.join("\n")).toMatch(/X-Robots-Tag noindex/);
    expect(result.errors.join("\n")).toMatch(/error shell/);
    expect(result.errors.join("\n")).toMatch(/AdSense script/);
    expect(result.errors.join("\n")).toMatch(/X-Frame-Options/);
  });

  it("validates canonical robots and sitemap documents", () => {
    const robots = validateRobotsDocument({
      body: `User-agent: *\nAllow: /\n\nSitemap: ${CANONICAL_ORIGIN}/sitemap.xml\nHost: communityacquiredfinance.com\n`,
      headers: new Headers({ "content-type": "text/plain; charset=utf-8" }),
      status: 200,
      finalUrl: `${CANONICAL_ORIGIN}/robots.txt`,
    });

    const htmlRoutes = [
      { path: "/", markers: ["Home"], adFree: true },
      { path: "/tools", markers: ["Tools"], adFree: true },
    ];
    const sitemap = validateSitemapDocument({
      body: `<?xml version="1.0"?><urlset><url><loc>${CANONICAL_ORIGIN}/</loc></url><url><loc>${CANONICAL_ORIGIN}/tools</loc></url></urlset>`,
      headers: new Headers({ "content-type": "application/xml" }),
      status: 200,
      finalUrl: `${CANONICAL_ORIGIN}/sitemap.xml`,
      htmlRoutes,
    });

    expect(robots.passed).toBe(true);
    expect(sitemap.passed).toBe(true);
    expect(sitemap.urlCount).toBe(2);
  });

  it("rejects preview-domain URLs in the canonical sitemap", () => {
    const sitemap = validateSitemapDocument({
      body: `<?xml version="1.0"?><urlset><url><loc>https://preview.vercel.app/</loc></url></urlset>`,
      headers: new Headers({ "content-type": "application/xml" }),
      status: 200,
      finalUrl: `${CANONICAL_ORIGIN}/sitemap.xml`,
      htmlRoutes: [{ path: "/", markers: ["Home"], adFree: true }],
    });

    expect(sitemap.passed).toBe(false);
    expect(sitemap.errors.join("\n")).toMatch(/non-canonical sitemap location/);
  });
});
