import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { ContinueWhereYouLeftOff } from "@/components/shared/ContinueWhereYouLeftOff";
import { addNavigatorAction } from "@/lib/financialNavigator";
import { PRODUCT_CONTINUITY_DISMISS_KEY } from "@/lib/productContinuity";
import { createBenefitsReview, saveBenefitsReview } from "@/lib/benefitsChangeDetector";

const renderSummary = () => render(
  <MemoryRouter>
    <ContinueWhereYouLeftOff sourceRoute="/" />
  </MemoryRouter>,
);

describe("ContinueWhereYouLeftOff", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it("stays absent for first-time visitors without local product state", () => {
    renderSummary();
    expect(screen.queryByRole("heading", { name: "Continue where you left off" })).not.toBeInTheDocument();
  });

  it("offers a safe route back to locally saved work", () => {
    addNavigatorAction("wealth_starter_reserve");
    renderSummary();

    expect(screen.getByRole("heading", { name: "Continue where you left off" })).toBeInTheDocument();
    expect(screen.getByText("Saved only in this browser")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Continue My Plan/ })).toHaveAttribute("href", "/start-here#my-plan");
  });

  it("can be dismissed for the current session without deleting local work", () => {
    addNavigatorAction("wealth_starter_reserve");
    renderSummary();

    fireEvent.click(screen.getByRole("button", { name: "Dismiss saved progress for this browser session" }));

    expect(screen.queryByRole("heading", { name: "Continue where you left off" })).not.toBeInTheDocument();
    expect(window.sessionStorage.getItem(PRODUCT_CONTINUITY_DISMISS_KEY)).toBe("true");
    expect(window.localStorage.length).toBeGreaterThan(0);
  });

  it("renders a saved annual benefits review without crashing the app shell", () => {
    saveBenefitsReview({
      ...createBenefitsReview(2027),
      selections: { deductible: "increased" },
    });
    renderSummary();

    expect(screen.getByRole("link", { name: /Continue annual review/i })).toHaveAttribute("href", "/tools/benefits-change-detector");
  });
});
