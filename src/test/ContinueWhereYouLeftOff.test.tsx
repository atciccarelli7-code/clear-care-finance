import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { ContinueWhereYouLeftOff } from "@/components/shared/ContinueWhereYouLeftOff";
import { addNavigatorAction } from "@/lib/financialNavigator";
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

    expect(screen.queryByRole("dialog", { name: "Continue saved work" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Continue saved work/ }));
    expect(screen.getByRole("dialog", { name: "Continue saved work" })).toBeInTheDocument();
    expect(screen.getByText("Saved only in this browser")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Resume/ })).toHaveAttribute("href", "/start-here#my-plan");
  });

  it("stays collapsed until opened and closes with Escape while preserving local work", async () => {
    addNavigatorAction("wealth_starter_reserve");
    renderSummary();

    const trigger = screen.getByRole("button", { name: /Continue saved work/ });
    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog", { name: "Continue saved work" })).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(window.localStorage.length).toBeGreaterThan(0);
  });

  it("requires confirmation before removing saved work", () => {
    addNavigatorAction("wealth_starter_reserve");
    renderSummary();

    fireEvent.click(screen.getByRole("button", { name: /Continue saved work/ }));
    fireEvent.click(screen.getByRole("button", { name: /Remove My Plan/ }));
    expect(screen.getByRole("alertdialog", { name: "Remove this saved work?" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Keep saved work" }));
    expect(window.localStorage.length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /Remove My Plan/ }));
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(screen.queryByRole("button", { name: /Continue saved work/ })).not.toBeInTheDocument();
  });

  it("renders a saved annual benefits review without crashing the app shell", () => {
    saveBenefitsReview({
      ...createBenefitsReview(2027),
      selections: { deductible: "increased" },
    });
    renderSummary();

    fireEvent.click(screen.getByRole("button", { name: /Continue saved work/ }));
    expect(screen.getByRole("link", { name: /Resume/ })).toHaveAttribute("href", "/tools/benefits-change-detector");
  });
});
