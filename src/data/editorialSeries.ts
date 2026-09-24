// Deliberate reading order, independent of publication date or archive ranking.
export const EDITORIAL_SERIES = [
  {
    title: "Hospital money and patient flow",
    description: "Follow the connection between hospital charges, payment, nonprofit status, and the pressure on staffed beds.",
    articles: [
      { slug: "20-dollar-tylenol-hospital-prices", title: "The $20 Tylenol Isn’t Really About the Tylenol" },
      { slug: "what-nonprofit-hospital-actually-means", title: "What a Nonprofit Hospital Actually Is (and Isn’t)" },
      { slug: "how-a-hospital-actually-makes-money", title: "How a Hospital Actually Makes Money" },
      { slug: "why-hospitals-care-about-length-of-stay", title: "Why Hospitals Care So Much About Length of Stay" },
      { slug: "why-hospitals-become-the-systems-shock-absorber", title: "Why the Hospital Becomes the System’s Shock Absorber" },
    ],
  },
  {
    title: "The work behind a hospital discharge",
    description: "Follow the handoffs from clinical decisions and documentation to coverage, placement, and care at home.",
    articles: [
      { slug: "patient-in-the-bed-and-patient-in-the-chart", title: "The Patient in the Bed and the Patient in the Chart" },
      { slug: "what-happens-while-hospital-is-waiting-on-insurance", title: "What Happens While the Hospital Is “Waiting on Insurance”?" },
      { slug: "why-just-send-them-to-rehab-is-not-simple", title: "Why “Just Send Them to Rehab” Is Not That Simple" },
      { slug: "medically-ready-is-not-the-same-as-ready-for-home", title: "Medically Ready Is Not the Same as Ready for Home" },
      { slug: "home-with-family-is-not-a-free-care-plan", title: "“Home With Family” Is Not a Free Care Plan" },
    ],
  },
] as const;

export const getEditorialSeries = (slug: string) => {
  const series = EDITORIAL_SERIES.find((candidate) => candidate.articles.some((article) => article.slug === slug));
  if (!series) return undefined;
  const index = series.articles.findIndex((article) => article.slug === slug);
  return { ...series, next: series.articles[(index + 1) % series.articles.length] };
};
