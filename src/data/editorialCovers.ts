/** Original CAF conceptual illustrations. Provenance and prompts: docs/editorial-art.md. */
export const EDITORIAL_COVERS: Record<string, { file: string; alt: string }> = {
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
