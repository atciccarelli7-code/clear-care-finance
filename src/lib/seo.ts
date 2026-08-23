import { useEffect } from "react";
import { getSearchIntentSeoOverride } from "@/data/searchIntentSeoOverrides";

export const SITE_NAME = "Community Acquired Finance";

const configuredSiteUrl = import.meta.env.VITE_SITE_URL as string | undefined;

export const SITE_URL = configuredSiteUrl?.replace(/\/$/, "") || "https://communityacquiredfinance.com";

const setMeta = (selector: string, attr: "content" | "href", value: string) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (!element) {
    if (selector.startsWith("link")) {
      element = document.createElement("link");
      element.setAttribute("rel", "canonical");
    } else {
      element = document.createElement("meta");
      const nameMatch = selector.match(/name="([^"]+)"/);
      const propertyMatch = selector.match(/property="([^"]+)"/);
      if (nameMatch) element.setAttribute("name", nameMatch[1]);
      if (propertyMatch) element.setAttribute("property", propertyMatch[1]);
    }
    document.head.appendChild(element);
  }
  element.setAttribute(attr, value);
};

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

const alignJsonLdWithSearchIntent = (
  jsonLd: Record<string, unknown>[] | undefined,
  title: string,
  description: string,
) => jsonLd?.map((item) => {
  const schemaType = item["@type"];
  if (schemaType === "BreadcrumbList" && Array.isArray(item.itemListElement)) {
    const entries = item.itemListElement as Array<Record<string, unknown>>;
    return {
      ...item,
      itemListElement: entries.map((entry, index) =>
        index === entries.length - 1 ? { ...entry, name: title } : entry,
      ),
    };
  }
  if (schemaType === "Article") return { ...item, headline: title, description };
  if (schemaType === "WebPage" || schemaType === "CollectionPage" || schemaType === "WebApplication") {
    return { ...item, name: title, description };
  }
  return item;
});

export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const useSeo = ({
  title,
  description,
  canonicalPath,
  type = "website",
  author,
  robots,
  jsonLd,
}: {
  title: string;
  description: string;
  canonicalPath: string;
  type?: "website" | "article";
  author?: string;
  robots?: string;
  jsonLd?: Record<string, unknown>[];
}) => {
  useEffect(() => {
    const searchIntentOverride = getSearchIntentSeoOverride(canonicalPath);
    const effectiveTitle = searchIntentOverride?.title ?? title;
    const effectiveDescription = searchIntentOverride?.description ?? description;
    const effectiveJsonLd = searchIntentOverride
      ? alignJsonLdWithSearchIntent(jsonLd, effectiveTitle, effectiveDescription)
      : jsonLd;
    const fullTitle = effectiveTitle.includes(SITE_NAME) ? effectiveTitle : `${effectiveTitle} | ${SITE_NAME}`;
    const canonical = absoluteUrl(canonicalPath);

    document.title = fullTitle;
    setMeta('meta[name="description"]', "content", effectiveDescription);
    setMeta('link[rel="canonical"]', "href", canonical);
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", effectiveDescription);
    setMeta('meta[property="og:type"]', "content", type);
    setMeta('meta[property="og:url"]', "content", canonical);
    setMeta('meta[property="og:site_name"]', "content", SITE_NAME);
    setMeta('meta[name="twitter:card"]', "content", "summary");
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:description"]', "content", effectiveDescription);

    if (author) setMeta('meta[name="author"]', "content", author);
    if (robots) {
      setMeta('meta[name="robots"]', "content", robots);
      setMeta('meta[name="googlebot"]', "content", robots);
    }
    if (effectiveJsonLd) setJsonLd(effectiveJsonLd);
  }, [title, description, canonicalPath, type, author, robots, jsonLd]);
};
