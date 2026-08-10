import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import FinancialAssistanceScreeningTool from "@/components/calculators/FinancialAssistanceScreeningTool";
import { trackSiteEvent } from "@/lib/analytics";
import { loadStoredNavigatorPlan } from "@/lib/financialNavigator";

vi.mock("@/lib/analytics", () => ({ trackSiteEvent: vi.fn() }));

afterEach(() => {
  window.localStorage.clear();
  vi.clearAllMocks();
});

const continueButton = () => screen.getByRole("button", { name: /^continue/i });

const completeAtriumPath = () => {
  fireEvent.change(screen.getByLabelText("Where is the hospital?"), { target: { value: "NC" } });
  fireEvent.click(continueButton());
  fireEvent.change(screen.getByLabelText(/which hospital or health system/i), { target: { value: "atrium-health" } });
  fireEvent.click(continueButton());
  fireEvent.click(screen.getByRole("radio", { name: "4 people" }));
  fireEvent.click(continueButton());
  fireEvent.click(screen.getByRole("radio", { name: /more than \$66,000 through \$82,500/i }));
  fireEvent.click(continueButton());
  fireEvent.click(screen.getByRole("radio", { name: /^insured/i }));
  fireEvent.click(continueButton());
  fireEvent.click(screen.getByRole("radio", { name: /^in collections/i }));
  fireEvent.click(continueButton());
  fireEvent.click(screen.getByRole("radio", { name: /i don't know \/ skip/i }));
  fireEvent.click(continueButton());
  fireEvent.click(screen.getByRole("button", { name: /build my action plan/i }));
};

describe("Hospital Financial Assistance Finder", () => {
  it("uses one primary question per step and explains the privacy boundary", () => {
    render(<MemoryRouter><FinancialAssistanceScreeningTool /></MemoryRouter>);

    expect(screen.getByText(/private by design/i)).toBeInTheDocument();
    expect(screen.getByText(/step 1 of 8/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /choose the hospital's state/i })).toBeInTheDocument();
    expect(screen.queryByText(/household size used for screening/i)).not.toBeInTheDocument();
  });

  it("builds a bounded source-backed result for a published free-care range", () => {
    render(<MemoryRouter><FinancialAssistanceScreeningTool /></MemoryRouter>);
    completeAtriumPath();

    expect(screen.getByRole("heading", { name: /appears to fall within the policy's published free-care range/i })).toBeInTheDocument();
    expect(screen.getByText(/the hospital must make the final eligibility determination/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Official policy, application, and sources" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /official application/i })).toHaveAttribute("href", expect.stringContaining("atriumhealth.org"));
    expect(screen.queryByText(/you qualify|you are eligible|you are approved|guaranteed approval/i)).not.toBeInTheDocument();
  });

  it("falls back to a national verification plan when the hospital is not listed", () => {
    render(<MemoryRouter><FinancialAssistanceScreeningTool /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText("Where is the hospital?"), { target: { value: "TX" } });
    fireEvent.click(continueButton());
    fireEvent.change(screen.getByLabelText(/which hospital or health system/i), { target: { value: "not-listed" } });
    fireEvent.click(continueButton());
    fireEvent.click(screen.getByRole("radio", { name: /^I don't know/i }));
    fireEvent.click(continueButton());
    fireEvent.click(screen.getByRole("radio", { name: /^I don't know/i }));
    fireEvent.click(continueButton());
    fireEvent.click(screen.getByRole("radio", { name: /^I don't know/i }));
    fireEvent.click(continueButton());
    fireEvent.click(screen.getByRole("radio", { name: /^I don't know/i }));
    fireEvent.click(continueButton());
    fireEvent.click(screen.getByRole("radio", { name: /i don't know \/ skip/i }));
    fireEvent.click(continueButton());
    fireEvent.click(screen.getByRole("button", { name: /build my action plan/i }));

    expect(screen.getByRole("heading", { name: /use the national action plan/i })).toBeInTheDocument();
    expect(screen.getByText(/no eligibility terms have been inferred/i)).toBeInTheDocument();
  });

  it("saves only the fixed existing action into My Plan", () => {
    render(<MemoryRouter><FinancialAssistanceScreeningTool /></MemoryRouter>);
    completeAtriumPath();
    fireEvent.click(screen.getByRole("button", { name: "Add this action" }));

    const plan = loadStoredNavigatorPlan();
    expect(plan?.actionIds).toContain("cost_financial_assistance");
    expect(JSON.stringify(plan)).not.toMatch(/atrium|income|household|collection|insurance/i);
  });

  it("emits only fixed categorical analytics properties, never the entered answers", () => {
    render(<MemoryRouter><FinancialAssistanceScreeningTool /></MemoryRouter>);
    completeAtriumPath();

    const allowedKeys = new Set([
      "event_category",
      "tool_id",
      "surface_id",
      "return_state",
      "step_id",
      "policy_id",
      "outcome_id",
      "missing_state",
      "journey_key",
      "surface",
      "phase",
      "step_index",
      "variant",
      "session_journey_id",
    ]);
    const calls = vi.mocked(trackSiteEvent).mock.calls;

    expect(calls.some(([event]) => event === "tool_completed")).toBe(true);
    for (const [, properties = {}] of calls) {
      expect(Object.keys(properties).every((key) => allowedKeys.has(key))).toBe(true);
    }
    expect(JSON.stringify(calls)).not.toContain("200_250");
    expect(JSON.stringify(calls)).not.toContain("2026-05");
    expect(JSON.stringify(calls)).not.toContain("collections");
  });
});
