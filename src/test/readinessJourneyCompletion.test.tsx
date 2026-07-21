import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { DecisionJourneyAnalyticsBoundary } from "@/components/readiness/DecisionJourneyAnalyticsBoundary";
import { ObservationInpatientStatusGuidePage } from "@/pages/CareDecisionToolsBundle";
import {
  DebtVsRetirementRouterPage,
  RothTraditionalDecisionHelperPage,
} from "@/pages/WorkplaceDecisionToolsBundle";

const renderJourney = (
  path: string,
  journeyId: "roth_traditional" | "debt_retirement" | "observation_status",
  page: React.ReactNode,
) => render(
  <MemoryRouter initialEntries={[path]}>
    <DecisionJourneyAnalyticsBoundary journeyId={journeyId}>
      {page}
    </DecisionJourneyAnalyticsBoundary>
  </MemoryRouter>,
);

describe("priority decision journey completion", () => {
  it("connects the Roth result to contribution and complete-benefits journeys", () => {
    renderJourney(
      "/tools/roth-vs-traditional-decision-helper",
      "roth_traditional",
      <RothTraditionalDecisionHelperPage />,
    );

    fireEvent.click(screen.getByRole("button", { name: /compare contribution factors/i }));

    expect(screen.getByRole("heading", { name: /continue only if this result leaves another question unresolved/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /estimate the paycheck contribution/i })).toHaveAttribute("href", "/tools/403b-paycheck-calculator");
    expect(screen.getByRole("link", { name: /review retirement inside the full benefits package/i })).toHaveAttribute("href", "/tools/benefits-command-center");
  });

  it("connects debt sequencing to the Financial Foundation Checkup and loan-specific rules", () => {
    renderJourney(
      "/tools/debt-vs-retirement-router",
      "debt_retirement",
      <DebtVsRetirementRouterPage />,
    );

    fireEvent.click(screen.getByRole("button", { name: /build priority order/i }));

    expect(screen.getByRole("link", { name: /run the Financial Foundation Checkup/i })).toHaveAttribute("href", "/start-here#financial-foundation-checkup");
    expect(screen.getByRole("link", { name: /separate federal and private student-loan paths/i })).toHaveAttribute("href", "/student-loans");
  });

  it("connects hospital-status verification to discharge and medical-bill command centers", () => {
    renderJourney(
      "/tools/observation-vs-inpatient-status-guide",
      "observation_status",
      <ObservationInpatientStatusGuidePage />,
    );

    fireEvent.click(screen.getByRole("button", { name: /build status-verification plan/i }));

    expect(screen.getByRole("link", { name: /open the Hospital Discharge Command Center/i })).toHaveAttribute("href", "/insurance/hospital-discharge-coverage");
    expect(screen.getByRole("link", { name: /continue in the Medical Bill Review Toolkit/i })).toHaveAttribute("href", "/insurance/medical-bill-review-toolkit");
  });
});
