import { describe, expect, it } from "vitest";
import {
  CANONICAL_ORIGIN,
  fetchDeployment,
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


describe("protected deployment requests", () => {
  const preview = "https://clear-care-finance-example-communityacquiredfinance.vercel.app";
  const secret = "test-only-credential";

  it("authenticates same-origin preview requests, including redirects", async () => {
    const calls = [];
    const response = await fetchDeployment(`${preview}/start-here/`, {
      bypassSecret: secret,
      fetchImpl: async (url, options) => {
        calls.push({ url, options });
        return calls.length === 1
          ? new Response(null, { status: 308, headers: { location: "/start-here" } })
          : new Response("healthy application");
      },
    });
    expect(await response.text()).toBe("healthy application");
    expect(calls).toHaveLength(2);
    expect(calls[1].url).toBe(`${preview}/start-here`);
    for (const { options } of calls) {
      expect(options.redirect).toBe("manual");
      expect(options.headers.get("x-vercel-protection-bypass")).toBe(secret);
      expect(options.headers.has("x-vercel-set-bypass-cookie")).toBe(false);
    }
  });

  it.each([
    ["https://vercel.com/login?next=private", /deployment protection blocked/],
    ["https://example.com/collect", /another origin/],
  ])("fails closed before following %s", async (location, message) => {
    let calls = 0;
    await expect(fetchDeployment(preview, {
      bypassSecret: secret,
      fetchImpl: async () => {
        calls += 1;
        return new Response(null, { status: 302, headers: { location } });
      },
    })).rejects.toThrow(message);
    expect(calls).toBe(1);
  });

  it.each([
    [CANONICAL_ORIGIN, "production"],
    [preview, "production"],
    ["https://other-project.vercel.app", "preview"],
    ["https://example.com", "preview"],
    ["http://clear-care-finance-example-communityacquiredfinance.vercel.app", "preview"],
  ])("does not send preview credentials to %s (%s)", async (url, environment) => {
    await fetchDeployment(url, {
      environment,
      bypassSecret: secret,
      fetchImpl: async (_url, options) => {
        expect(options.headers.has("x-vercel-protection-bypass")).toBe(false);
        return new Response("healthy");
      },
    });
  });

  it("reports denied preview access without exposing the credential", async () => {
    try {
      await fetchDeployment(preview, {
        bypassSecret: secret,
        fetchImpl: async () => new Response(null, { status: 401 }),
      });
      expect.fail("A denied preview must fail");
    } catch (error) {
      expect(error.message).toContain("Preview access denied");
      expect(error.message).not.toContain(secret);
    }
  });

  it("bounds redirect loops", async () => {
    let calls = 0;
    await expect(fetchDeployment(preview, {
      bypassSecret: secret,
      fetchImpl: async () => {
        calls += 1;
        return new Response(null, { status: 308, headers: { location: "/loop" } });
      },
    })).rejects.toThrow("exceeded five");
    expect(calls).toBe(6);
  });
});
