import { socialCover } from "@/data/editorialCovers";
import { absoluteUrl, SITE_NAME } from "./seo";

const setJsonLd = (jsonLd: Record<string, unknown>[]) => {
  document.head.querySelectorAll('script[data-caf-seo-jsonld="true"]').forEach((node) => node.remove());

  jsonLd.forEach((value) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.cafSeoJsonld = "true";
    script.textContent = JSON.stringify(value);
    document.head.appendChild(script);
  });
};

/** Loaded after the core route metadata. The caller cancels stale navigations. */
export function applySocialSeo(path: string, set: (selector: string, attr: "content" | "href", value: string) => void, jsonLd?: Record<string, unknown>[]) {
  if (jsonLd) setJsonLd(jsonLd);
  const cover = socialCover(path);
  const image = absoluteUrl(cover?.path ?? "/icon-512.png");
  for (const [attribute, name, value] of [
    ["property", "og:image", image], ["property", "og:image:alt", cover?.alt ?? SITE_NAME],
    ["property", "og:image:width", cover ? "1200" : "512"], ["property", "og:image:height", cover ? "630" : "512"],
    ["name", "twitter:image", image], ["name", "twitter:image:alt", cover?.alt ?? SITE_NAME],
    ["name", "twitter:card", cover ? "summary_large_image" : "summary"],
  ]) set(`meta[${attribute}="${name}"]`, "content", value);
  if (cover) document.head.querySelectorAll('script[data-caf-seo-jsonld="true"]').forEach(node => {
    const schema = JSON.parse(node.textContent ?? "{}");
    if (schema["@type"] === "Article") node.textContent = JSON.stringify({ ...schema, image });
  });
}
