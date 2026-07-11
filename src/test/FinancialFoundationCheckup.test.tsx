import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FinancialFoundationCheckup from "@/components/calculators/FinancialFoundationCheckup";
import { FOUNDATION_STORAGE_KEY } from "@/lib/financialFoundationCheckup";
import { NAVIGATOR_STORAGE_KEY } from "@/lib/financialNavigator";

const renderCheckup = () => render(
  <MemoryRouter>
    <FinancialFoundationCheckup />
  </MemoryRouter>,
);

describe("FinancialFoundationCheckup", () => {
  beforeEach(() => {
    window.localStorage.clear();
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: vi.fn(),
    });
    Object.defineProperty(window, "confirm", {
      configurable: true,
      value: vi.fn().mockReturnValue(true),
    });
  });

  it("creates a local baseline and saves the recommended gaps into My Plan", () => {
    renderCheckup();

    fireEvent.change(screen.getByLabelText(/Monthly essential expenses/), { target: { value: "4000" } });
    fireEvent.change(screen.getByLabelText(/Liquid savings available for emergencies/), { target: { value: "2000" } });
    fireEvent.change(screen.getByLabelText(/Highest non-mortgage interest-rate band/), { target: { value: "over_15" } });
    fireEvent.change(screen.getByLabelText(/Employer retirement match status/), { target: { value: "not_contributing" } });
    fireEvent.change(screen.getByLabelText(/Recurring savings and investing system/), { target: { value: "none" } });
    fireEvent.change(screen.getByLabelText(/Protection and beneficiary review/), { target: { value: "due" } });
    fireEvent.change(screen.getByLabelText(/Large planned expense within 12 months/), { target: { value: "unfunded" } });
    fireEvent.click(screen.getByRole("button", { name: /Run my checkup/ }));

    expect(screen.getByRole("heading", { name: "Stabilize first" })).toHaveFocus();
    expect(screen.getByText("16")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Cash resilience score" })).toHaveAttribute("aria-valuenow", "5");
    expect(window.localStorage.getItem(FOUNDATION_STORAGE_KEY)).not.toBeNull();
    expect(screen.getByRole("heading", { name: "Your last 1 checkup" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Add all to My Plan" }));

    const storedPlan = JSON.parse(window.localStorage.getItem(NAVIGATOR_STORAGE_KEY) ?? "null") as { actionIds?: string[] } | null;
    expect(storedPlan?.actionIds).toEqual(expect.arrayContaining([
      "wealth_starter_reserve",
      "wealth_high_interest_debt",
      "wealth_capture_match",
      "wealth_cash_flow",
      "benefits_action_plan",
    ]));
  });

  it("requires essential expenses before calculating runway", () => {
    renderCheckup();
    fireEvent.click(screen.getByRole("button", { name: /Run my checkup/ }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter monthly essential expenses");
    expect(window.localStorage.getItem(FOUNDATION_STORAGE_KEY)).toBeNull();
  });
});
