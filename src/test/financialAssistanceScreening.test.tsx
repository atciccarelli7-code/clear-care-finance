import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import FinancialAssistanceScreeningTool from "@/components/calculators/FinancialAssistanceScreeningTool";
import { loadStoredNavigatorPlan } from "@/lib/financialNavigator";

afterEach(() => {
  window.localStorage.clear();
});

describe("FinancialAssistanceScreeningTool", () => {
  it("renders an uncertainty-first pathway without requiring sensitive data", () => {
    render(
      <MemoryRouter>
        <FinancialAssistanceScreeningTool />
      </MemoryRouter>,
    );

    expect(screen.getByText(/does not need a hospital name, patient name, exact income/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /build my screening plan/i }));

    expect(screen.getByRole("heading", { name: /verify the bill source and insurance status/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Official verification resources" })).toBeInTheDocument();
    expect(screen.getByText(/does not determine eligibility/i)).toBeInTheDocument();
  });

  it("produces a strong qualified screening direction for hospital hardship", () => {
    render(
      <MemoryRouter>
        <FinancialAssistanceScreeningTool />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText("Who issued the bill?"), { target: { value: "hospital" } });
    fireEvent.change(screen.getByLabelText("Has insurance finished processing the claim?"), { target: { value: "processed" } });
    fireEvent.change(screen.getByLabelText("How would paying this balance affect the household?"), { target: { value: "unaffordable" } });
    fireEvent.change(screen.getByLabelText("What is the account status?"), { target: { value: "collections" } });
    fireEvent.change(screen.getByLabelText("Is the hospital nonprofit?"), { target: { value: "yes" } });
    fireEvent.change(screen.getByLabelText("Have you found the written financial-assistance policy?"), { target: { value: "not_found" } });
    fireEvent.change(screen.getByLabelText("Where are you in the application process?"), { target: { value: "not_requested" } });
    fireEvent.click(screen.getByRole("button", { name: /build my screening plan/i }));

    expect(screen.getByRole("heading", { name: /strong reason to request financial-assistance review/i })).toBeInTheDocument();
    expect(screen.getByText(/request the written financial-assistance policy, plain-language summary/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/you qualify|you are eligible|you are approved|application is approved|guaranteed approval/i),
    ).not.toBeInTheDocument();
  });

  it("saves only the fixed existing action into My Plan", () => {
    render(
      <MemoryRouter>
        <FinancialAssistanceScreeningTool />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /build my screening plan/i }));
    fireEvent.click(screen.getByRole("button", { name: "Add this action" }));

    const plan = loadStoredNavigatorPlan();
    expect(plan?.actionIds).toContain("cost_financial_assistance");
    expect(JSON.stringify(plan)).not.toMatch(/hospital|income|collection|affordability|insuranceStatus/i);
    expect(screen.getByRole("button", { name: /added to my plan/i })).toBeDisabled();
  });
});
