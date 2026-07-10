import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = (process.env.VITE_SITE_URL || "https://communityacquiredfinance.com").replace(/\/$/, "");

const escapeXml = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

const vite = await createServer({
  root,
  mode: "production",
  appType: "custom",
  logLevel: "error",
  server: { middlewareMode: true },
});

try {
  const { getIndexableRoutes } = await vite.ssrLoadModule("/src/lib/seoRegistry.ts");
  const routes = getIndexableRoutes();

  if (!Array.isArray(routes) || routes.length === 0) {
    throw new Error("No indexable routes were returned by the SEO registry.");
  }

  const uniqueRoutes = Array.from(new Set(routes));
  if (uniqueRoutes.length !== routes.length) {
    throw new Error("Duplicate routes were found in the SEO registry.");
  }

  const urls = uniqueRoutes
    .map((route) => `  <url>\n    <loc>${escapeXml(`${siteUrl}${route === "/" ? "/" : route}`)}</loc>\n  </url>`)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  const outputPath = path.join(root, "public", "sitemap.xml");

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, xml, "utf8");
  console.log(`Generated sitemap.xml with ${uniqueRoutes.length} canonical URLs.`);
} finally {
  await vite.close();
}
