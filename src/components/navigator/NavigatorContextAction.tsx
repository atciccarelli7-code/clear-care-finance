import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Check, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackSiteEvent } from "@/lib/analytics";
import { addNavigatorAction, getNavigatorRecommendation, loadStoredNavigatorPlan } from "@/lib/financialNavigator";
import { NAVIGATOR_CONTEXT_ACTIONS } from "@/components/navigator/navigatorContextConfig";

export const NavigatorContextAction = () => {
  const location = useLocation();
  const config = NAVIGATOR_CONTEXT_ACTIONS[location.pathname];
  const recommendation = useMemo(() => config ? getNavigatorRecommendation(config.recommendationId) : undefined, [config]);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!config) return;
    setAdded(loadStoredNavigatorPlan()?.actionIds.includes(config.recommendationId) ?? false);
  }, [config]);

  if (!config || !recommendation) return null;

  const addAction = () => {
    const result = addNavigatorAction(config.recommendationId);
    setAdded(Boolean(result.plan?.actionIds.includes(config.recommendationId)));
    trackSiteEvent("contextual_plan_action_added", {
      event_category: "navigator",
      recommendation_id: recommendation.fixedAnalyticsId,
      pathway_id: recommendation.pathway,
      source_route: location.pathname,
      destination_path: "/start-here",
    });
  };

  return (
    <section className="container mt-10 print:hidden" aria-label="Financial Navigator next action">
      <div className="rounded-[2rem] border border-primary/20 bg-primary-soft/35 p-5 shadow-card md:p-7">
        <div className="grid gap-5 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-primary shadow-sm ring-1 ring-primary/15">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{config.eyebrow}</div>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">{config.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{config.description}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button type="button" onClick={addAction} disabled={added}>
              {added ? <><Check className="h-4 w-4" /> Added to My Plan</> : config.buttonLabel}
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
