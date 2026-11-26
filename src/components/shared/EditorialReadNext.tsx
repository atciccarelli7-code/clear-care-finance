import { Link } from "react-router-dom";
import { ArrowRight, ChartNoAxesColumn } from "lucide-react";
import { EditorialCover } from "./EditorialCover";
import type { Article } from "@/data/articles";
import { DE_EMPHASIZED_ARTICLE_SLUGS, getEditorialAreaId } from "@/data/editorialLibrary";
import { isArticleDraft } from "@/lib/article-status";
import { trackSiteEvent } from "@/lib/analytics";
import { visuals } from "@/components/visual-explainers/article-visuals/content";
import { visualHref, type VisualId } from "@/components/visual-explainers/article-visuals/visualRoutes";

const followUps: Record<string, { stories: string[]; visual: VisualId }> = {
  "why-hospitals-become-the-systems-shock-absorber": {
    stories: ["patient-in-the-bed-and-patient-in-the-chart", "what-happens-while-hospital-is-waiting-on-insurance"],
    visual: "medicare-snf",
  },
  "home-with-family-is-not-a-free-care-plan": {
    stories: ["why-just-send-them-to-rehab-is-not-simple", "patient-in-the-bed-and-patient-in-the-chart"],
    visual: "nursing-home-payers",
  },
  "20-dollar-tylenol-hospital-prices": {
    stories: ["why-one-hospital-visit-can-create-multiple-bills", "facility-fee-vs-professional-fee"],
    visual: "bill-to-payment",
  },
  "what-nonprofit-hospital-actually-means": {
    stories: ["20-dollar-tylenol-hospital-prices", "why-hospitals-become-the-systems-shock-absorber"],
    visual: "financial-assistance",
  },
  "why-hospitals-care-about-length-of-stay": {
    stories: ["why-hospitals-become-the-systems-shock-absorber", "patient-in-the-bed-and-patient-in-the-chart"],
    visual: "medicare-snf",
  },
  "why-just-send-them-to-rehab-is-not-simple": {
    stories: ["why-hospitals-care-about-length-of-stay", "home-with-family-is-not-a-free-care-plan"],
    visual: "medicare-snf",
  },
  "patient-in-the-bed-and-patient-in-the-chart": {
    stories: ["why-just-send-them-to-rehab-is-not-simple", "why-hospitals-care-about-length-of-stay"],
    visual: "medicare-snf",
  },
  "what-happens-while-hospital-is-waiting-on-insurance": {
    stories: ["patient-in-the-bed-and-patient-in-the-chart", "why-hospitals-care-about-length-of-stay"],
    visual: "medicare-snf",
  },
};

// The dedicated founder route loads a smaller article catalog than the archive.
const crossCatalogStories = [
  { slug: "patient-in-the-bed-and-patient-in-the-chart", title: "The Patient in the Bed and the Patient in the Chart", category: "Hospital Discharge", promise: "Follow the clinical record from the bedside to the organization deciding what happens next." },
  { slug: "what-happens-while-hospital-is-waiting-on-insurance", title: "What Happens While the Hospital Is “Waiting on Insurance”?", category: "Hospital Discharge", promise: "Trace what can still hold up a transfer while a patient is ready to leave." },
  { slug: "why-one-hospital-visit-can-create-multiple-bills", title: "Why One Hospital Visit Can Create Multiple Bills", category: "Hospital Bills", promise: "Follow two claims from one visit to see which bill goes with which insurance statement." },
  { slug: "facility-fee-vs-professional-fee", title: "Facility Fee vs. Professional Fee", category: "Hospital Bills", promise: "Identify which charge came from the facility and which came from the clinician." },
];

export function EditorialReadNext({ article, catalog, existingLinks }: {
  article: Article;
  catalog: readonly Article[];
  existingLinks: readonly string[];
}) {
  const followUp = followUps[article.slug];
  const area = getEditorialAreaId(article);
  const excluded = new Set([article.slug, ...existingLinks.flatMap(href =>
    href.startsWith("/articles/") ? [href.slice("/articles/".length).split(/[?#]/, 1)[0]] : [],
  )]);
  const eligible = catalog.filter(item => !isArticleDraft(item) && !DE_EMPHASIZED_ARTICLE_SLUGS.has(item.slug));
  const candidates = new Map([...crossCatalogStories, ...eligible].map(item => [item.slug, item]));
  const sameDesk = eligible.filter(item => getEditorialAreaId(item) === area);
  const order = [...(followUp?.stories ?? []), ...sameDesk.filter(item => item.category === article.category).map(item => item.slug), ...sameDesk.map(item => item.slug)];
  const stories = [...new Set(order)].filter(slug => !excluded.has(slug) && candidates.has(slug)).slice(0, 2);
  if (!stories.length && !followUp) return null;

  return (
    <section className="editorial-read-next print:hidden" aria-labelledby="editorial-read-next-heading">
      <div className="publication-section-rule">
        <h2 id="editorial-read-next-heading" className="publication-section-title">Continue reading</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {stories.map(slug => {
          const story = candidates.get(slug);
          return story && (
            <Link
              key={slug}
              to={`/articles/${slug}`}
              aria-label={story.title}
              className="editorial-story editorial-story-brief group"
              onClick={() => trackSiteEvent("editorial_read_next_selected", { origin_slug: article.slug, destination_slug: slug })}
            >
              <EditorialCover slug={slug} sizes="80px" />
              <div>
                <p className="editorial-story-category">{story.category}</p>
                <h3 className="editorial-story-title group-hover:underline">{story.title}</h3>
                <p className="editorial-story-promise">{story.promise}</p>
              </div>
            </Link>
          );
        })}
      </div>
      {followUp && (
        <Link to={visualHref(followUp.visual)} className="editorial-visual-link" onClick={() =>
          trackSiteEvent("editorial_visual_explainer_selected", { origin_slug: article.slug, visual_id: followUp.visual })
        }>
          <ChartNoAxesColumn className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className="publication-kicker block">Visual explainer</span>
            <span className="block font-semibold leading-snug">{visuals[followUp.visual].title}</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        </Link>
      )}
    </section>
  );
}
