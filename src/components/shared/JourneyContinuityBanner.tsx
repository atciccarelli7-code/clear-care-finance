import { useEffect, useState } from "react";
import { Compass, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { clearJourneyContext, loadJourneyContext, type JourneyContext } from "@/lib/journeyContext";

export const JourneyContinuityBanner = () => {
  const location = useLocation();
  const [context, setContext] = useState<JourneyContext | null>(null);

  useEffect(() => {
    const active = loadJourneyContext();
    setContext(active?.destinationPath === location.pathname ? active : null);
  }, [location.pathname]);

  if (!context) return null;

  const endJourney = () => {
    clearJourneyContext();
    setContext(null);
  };

  return (
    <aside className="border-b border-primary/15 bg-primary-soft/30" aria-label="Active guided journey">
      <div className="container flex min-w-0 flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Compass className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase tracking-[0.15em] text-primary">You are still in the same guided journey</div>
            <p className="mt-1 text-sm font-semibold text-foreground">You started with: “{context.goalLabel}”</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Finish this experience to receive: {context.expectedOutcome}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={endJourney}
          className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-muted-foreground hover:bg-background/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" aria-hidden="true" /> End journey
        </button>
      </div>
    </aside>
  );
};

export default JourneyContinuityBanner;
