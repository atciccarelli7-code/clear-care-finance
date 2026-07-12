import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackSiteEvent } from "@/lib/analytics";
import {
  addNavigatorAction,
  getNavigatorRecommendation,
  loadStoredNavigatorPlan,
} from "@/lib/financialNavigator";

interface SaveNavigatorActionProps {
  recommendationId: string;
  sourceRoute: string;
  title?: string;
  description?: string;
}

export const SaveNavigatorAction = ({
  recommendationId,
  sourceRoute,
  title = "Keep this next step in My Plan",
  description = "Save the fixed action only. Your answers and entered values are not added to the shared plan.",
}: SaveNavigatorActionProps) => {
  const recommendation = getNavigatorRecommendation(recommendationId);
  const [added, setAdded] = useState(
    () => loadStoredNavigatorPlan()?.actionIds.includes(recommendationId) ?? false,
  );

  if (!recommendation) return null;

  const addAction = () => {
    const result = addNavigatorAction(recommendationId);
    const isAdded = Boolean(result.plan?.actionIds.includes(recommendationId));
    setAdded(isAdded);

    if (isAdded) {
      trackSiteEvent("tool_plan_action_added", {
        event_category: "navigator",
        recommendation_id: recommendation.fixedAnalyticsId,
        pathway_id: recommendation.pathway,
        source_route: sourceRoute,
        destination_path: "/start-here",
      });
    }
  };

  return (
    <section className="rounded-2xl border border-primary/20 bg-primary-soft/30 p-4 print:hidden md:p-5" aria-label="Save next action">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-sm ring-1 ring-primary/15">
          <Compass className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
          <p className="mt-2 text-sm font-semibold text-foreground">Action: {recommendation.title}</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button type="button" onClick={addAction} disabled={added}>
              {added ? <><Check className="h-4 w-4" /> Added to My Plan</> : "Add this action"}
            </Button>
            <Button asChild variant="outline">
              <Link to="/start-here#my-plan">Open My Plan <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SaveNavigatorAction;
