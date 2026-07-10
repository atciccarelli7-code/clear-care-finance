import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const template = await readFile(path.join(distDir, "index.html"), "utf8");

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const replaceMeta = (html, selectorPattern, replacement) =>
  selectorPattern.test(html) ? html.replace(selectorPattern, replacement) : html.replace("</head>", `${replacement}\n</head>`);

const injectMeta = (html, meta) => {
  const fullTitle = meta.title.includes("Community Acquired Finance")
    ? meta.title
    : `${meta.title} | Community Acquired Finance`;
  const canonical = `https://communityacquiredfinance.com${meta.canonicalPath === "/" ? "/" : meta.canonicalPath}`;
  const robots = meta.robots || "index, follow, max-image-preview:large";
  const author = meta.author || "Community Acquired Finance";
  const jsonLd = (meta.jsonLd || [])
    .map(
      (value) =>
        `<script type="application/ld+json" data-caf-seo-jsonld="true">${JSON.stringify(value).replaceAll("<", "\\u003c")}</script>`,
    )
    .join("\n");

  let output = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(fullTitle)}</title>`);
  output = replaceMeta(
    output,
    /<meta\s+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
  );
  output = replaceMeta(output, /<meta\s+name=["']author["'][^>]*>/i, `<meta name="author" content="${escapeHtml(author)}" />`);
  output = replaceMeta(output, /<meta\s+name=["']robots["'][^>]*>/i, `<meta name="robots" content="${escapeHtml(robots)}" />`);
  output = replaceMeta(output, /<meta\s+name=["']googlebot["'][^>]*>/i, `<meta name="googlebot" content="${escapeHtml(robots)}" />`);
  output = replaceMeta(output, /<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${escapeHtml(fullTitle)}" />`);
  output = replaceMeta(output, /<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${escapeHtml(meta.description)}" />`);
  output = replaceMeta(output, /<meta\s+property=["']og:type["'][^>]*>/i, `<meta property="og:type" content="${meta.type === "article" ? "article" : "website"}" />`);
  output = replaceMeta(output, /<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${escapeHtml(canonical)}" />`);
  output = replaceMeta(output, /<meta\s+name=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${escapeHtml(fullTitle)}" />`);
  output = replaceMeta(output, /<meta\s+name=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`);

  output = output.replace(/<link\s+rel=["']canonical["'][^>]*>/i, "");
  output = output.replace(/<script[^>]*data-caf-seo-jsonld=["']true["'][^>]*>[\s\S]*?<\/script>/gi, "");
  output = output.replace(
    "</head>",
    `  <link rel="canonical" href="${escapeHtml(canonical)}" />\n${jsonLd ? `  ${jsonLd}\n` : ""}</head>`,
  );

  return output;
};

const outputPathForRoute = (route) => {
  if (route === "/") return path.join(distDir, "index.html");
  const clean = route.replace(/^\//, "");
  return path.join(distDir, `${clean}.html`);
};

const vite = await createServer({
  root,
  mode: "production",
  appType: "custom",
  logLevel: "error",
  server: { middlewareMode: true },
});

try {
  const [{ render }, { getIndexableRoutes, resolveSeoMeta }] = await Promise.all([
    vite.ssrLoadModule("/src/entry-server.tsx"),
    vite.ssrLoadModule("/src/lib/seoRegistry.ts"),
  ]);

  const routes = getIndexableRoutes();
  for (const route of routes) {
    const { html: appHtml, meta } = await render(route);
    const output = injectMeta(template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`), meta);
    const outputPath = outputPathForRoute(route);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, output, "utf8");
  }

  const notFoundMeta = resolveSeoMeta("/__not-found__");
  const { html: notFoundApp } = await render("/__not-found__");
  const notFoundHtml = injectMeta(
    template.replace('<div id="root"></div>', `<div id="root">${notFoundApp}</div>`),
    notFoundMeta,
  );
  await writeFile(path.join(distDir, "404.html"), notFoundHtml, "utf8");
  await writeFile(
    path.join(distDir, "prerender-manifest.json"),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), routes }, null, 2)}\n`,
    "utf8",
  );

  console.log(`Prerendered ${routes.length} canonical routes plus a real 404 page.`);
} finally {
  await vite.close();
}
