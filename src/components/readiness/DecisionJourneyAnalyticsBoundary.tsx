import { useEffect, useRef, type PropsWithChildren } from "react";
import {
  trackReadinessJourneyEvent,
  type ReadinessJourneyId,
} from "@/lib/decisionJourneyAnalytics";

export const DecisionJourneyAnalyticsBoundary = ({
  journeyId,
  children,
}: PropsWithChildren<{ journeyId: ReadinessJourneyId }>) => {
  const startedRef = useRef(false);

  useEffect(() => {
    startedRef.current = false;
  }, [journeyId]);

  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackReadinessJourneyEvent("decision_journey_started", { journey_id: journeyId });
  };

  return (
    <div onChangeCapture={markStarted} onSubmitCapture={markStarted}>
      {children}
    </div>
  );
};

export default DecisionJourneyAnalyticsBoundary;
