import { useEffect } from "react";

export const SITE_NAME = "Community Acquired Finance";
export const SITE_URL = "https://clear-care-finance.vercel.app";

const setMeta = (selector: string, attr: "content" | "href", value: string) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (!element) {
    if (selector.startsWith('link')) {
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

export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const useSeo = ({
  title,
  description,
  canonicalPath,
  type = "website",
}: {
  title: string;
  description: string;
  canonicalPath: string;
  type?: "website" | "article";
}) => {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const canonical = absoluteUrl(canonicalPath);

    document.title = fullTitle;
    setMeta('meta[name="description"]', "content", description);
    setMeta('link[rel="canonical"]', "href", canonical);
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:type"]', "content", type);
    setMeta('meta[property="og:url"]', "content", canonical);
    setMeta('meta[property="og:site_name"]', "content", SITE_NAME);
    setMeta('meta[name="twitter:card"]', "content", "summary");
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:description"]', "content", description);
  }, [title, description, canonicalPath, type]);
};
