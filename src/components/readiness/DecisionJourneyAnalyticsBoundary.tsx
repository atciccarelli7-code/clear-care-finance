import { useEffect, useRef, type PropsWithChildren } from "react";
import type { ReadinessJourneyId } from "@/lib/decisionJourneyAnalytics";
import { trackJourneyEvent } from "@/lib/journeyAnalytics";

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
    trackJourneyEvent("journey_started", {
      journey_key: journeyId,
      surface: "destination",
      phase: "name_question",
      step_index: 0,
    });
  };

  return (
    <div onChangeCapture={markStarted} onSubmitCapture={markStarted}>
      {children}
    </div>
  );
};

export default DecisionJourneyAnalyticsBoundary;
