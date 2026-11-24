import { Link } from "react-router-dom";
import { ArticleVisual } from "./ArticleVisual";
import { visuals } from "./content";

import { groups, visualHref, visualIndexPath, type VisualId } from "./visualRoutes";

const related: Record<VisualId, VisualId> = {
  "medicare-enrollment": "medicare-options",
  "disability-coverage": "medicaid-pathways",
  "medicare-medicaid": "disability-coverage",
  "medicare-options": "medicare-enrollment",
  "medicaid-pathways": "nc-medicaid-expansion-income",
  "nc-medicaid-expansion-income": "medicaid-application",
  "medicaid-application": "medicaid-pathways",
  "medicare-snf": "nursing-home-payers",
  "nursing-home-payers": "medicare-snf",
  "bill-to-payment": "eob-match",
  "eob-match": "multiple-bills",
  "multiple-bills": "financial-assistance",
  "financial-assistance": "eob-match",
};

export function VisualExplainer({ id, headingLevel = 2 }: { id: VisualId; headingLevel?: 2 | 3 }) {
  const next = related[id];
  return (
    <div id={`visual-${id}`} className="scroll-mt-28">
      <ArticleVisual visual={visuals[id]} headingLevel={headingLevel} />
      <nav aria-label="Related visual explainers" className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-primary print:hidden">
        <Link className="underline underline-offset-4" to={visualHref(next)}>{visuals[next].title}</Link>
        <Link className="underline underline-offset-4" to={visualIndexPath}>All visual explainers</Link>
      </nav>
    </div>
  );
}

export function VisualExplainerIndex() {
  return (
    <section id="visual-explainers" aria-labelledby="visual-explainers-heading" className="mb-10 scroll-mt-28 border-y border-border py-6">
      <h2 id="visual-explainers-heading" className="font-display text-2xl font-bold tracking-tight md:text-3xl">Visual explainers</h2>
      <div className="mt-4 grid gap-5 md:grid-cols-2">
        {groups.map(group => (
          <div key={group.name}>
            <h3 className="font-semibold text-foreground">{group.name}</h3>
            <ul className="mt-1">
              {group.ids.map(id => (
                <li key={id}>
                  <Link to={visualHref(id)} className="inline-block py-1.5 text-sm text-primary underline underline-offset-4">{visuals[id].title}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
