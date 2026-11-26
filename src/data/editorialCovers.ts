/** Original CAF conceptual illustrations. Provenance and prompts: docs/editorial-art.md. */
export const EDITORIAL_COVERS: Record<string, { file: string; alt: string }> = {
  "patient-in-the-bed-and-patient-in-the-chart": { file: "bed-and-chart", alt: "Conceptual illustration: a hospital bed and patient at left are represented on a clipboard at right." },
  "what-happens-while-hospital-is-waiting-on-insurance": { file: "waiting-on-insurance", alt: "Conceptual illustration: forms wait in a tray beside a hospital corridor, where shadows suggest a clock." },
  "why-hospitals-become-the-systems-shock-absorber": { file: "shock-absorber", alt: "Conceptual illustration: care pathways converge on a hospital supported by a spring." },
  "home-with-family-is-not-a-free-care-plan": { file: "family-care", alt: "Conceptual illustration: care tasks travel from a hospital into a home with medication, calendars and paperwork." },
  "20-dollar-tylenol-hospital-prices": { file: "tylenol", alt: "Conceptual illustration: one small tablet sits beneath layers of billing paperwork and hospital infrastructure." },
  "what-nonprofit-hospital-actually-means": { file: "nonprofit", alt: "Conceptual illustration: resource pathways circulate around a hospital and branch toward community care and equipment." },
  "why-hospitals-care-about-length-of-stay": { file: "length-of-stay", alt: "Conceptual illustration: empty hospital beds sit inside a clock, with a gate along the path home." },
  "why-just-send-them-to-rehab-is-not-simple": { file: "rehab", alt: "Conceptual illustration: clinical review, coverage, a bed and transport form separate bridge sections between hospital and rehabilitation." },
};

export const coverPath = (file: string, width = 960) => `/images/editorial/${file}-${width}.webp`;
export function socialCover(path: string) {
  const slug = path === "/" ? "why-hospitals-become-the-systems-shock-absorber" : path.replace(/^\/articles\//, "");
  const cover = EDITORIAL_COVERS[slug];
  return cover ? { path: `/images/editorial/${cover.file}-og.jpg`, alt: cover.alt } : null;
}

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
export function applySocialSeo(path: string, set: (selector: string, attr: "content" | "href", value: string) => void, jsonLd?: Record<string, unknown>[], siteUrl = "https://communityacquiredfinance.com") {
  if (jsonLd) setJsonLd(jsonLd);
  const cover = socialCover(path);
  const image = `${siteUrl}${cover?.path ?? "/icon-512.png"}`;
  for (const [attribute, name, value] of [
    ["property", "og:image", image], ["property", "og:image:alt", cover?.alt ?? "Community Acquired Finance"],
    ["property", "og:image:width", cover ? "1200" : "512"], ["property", "og:image:height", cover ? "630" : "512"],
    ["name", "twitter:image", image], ["name", "twitter:image:alt", cover?.alt ?? "Community Acquired Finance"],
    ["name", "twitter:card", cover ? "summary_large_image" : "summary"],
  ]) set(`meta[${attribute}="${name}"]`, "content", value);
  if (cover) document.head.querySelectorAll('script[data-caf-seo-jsonld="true"]').forEach(node => {
    const schema = JSON.parse(node.textContent ?? "{}");
    if (schema["@type"] === "Article") node.textContent = JSON.stringify({ ...schema, image });
  });
}
