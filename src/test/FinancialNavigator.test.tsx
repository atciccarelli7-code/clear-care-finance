import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FinancialNavigator } from "@/components/navigator/FinancialNavigator";
import { generateNavigatorPlan, saveNavigatorPlan } from "@/lib/financialNavigator";

const renderNavigator = () => render(<MemoryRouter><FinancialNavigator /></MemoryRouter>);

const seedWealthPlan = () => {
  saveNavigatorPlan(generateNavigatorPlan("wealth", {
    wealth_goal: "emergency",
    emergency_position: "none",
    debt_type: "high_interest",
    retirement_access: "403b",
    match_status: "below",
    urgency: "week",
  }));
};

describe("FinancialNavigator", () => {
  beforeEach(() => {
    window.localStorage.clear();
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });
    Object.defineProperty(window, "requestAnimationFrame", {
      configurable: true,
      value: (callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      },
    });
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: vi.fn(),
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    Object.defineProperty(window, "print", { configurable: true, value: vi.fn() });
    Object.defineProperty(window, "confirm", { configurable: true, value: vi.fn().mockReturnValue(true) });
  });

  it("keeps a single page landmark and uses native radio inputs with focused question transitions", () => {
    const { container } = renderNavigator();

    expect(container.querySelector("main")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Build wealth and financial stability/ }));

    expect(screen.getByRole("heading", { name: "What is the main financial goal in front of you?" })).toHaveFocus();
    expect(screen.getAllByRole("radio")).toHaveLength(8);
    expect(screen.getByRole("button", { name: /Continue/ })).toBeDisabled();

    const emergencyFund = screen.getByRole("radio", { name: "Build an emergency fund" });
    fireEvent.click(emergencyFund);
    expect(emergencyFund).toBeChecked();
    expect(screen.getByRole("button", { name: /Continue/ })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: /Continue/ }));
    expect(screen.getByRole("heading", { name: "How much emergency savings do you currently have?" })).toHaveFocus();
  });

  it("renders a saved plan once in priority groups with explicit completion semantics", () => {
    seedWealthPlan();
    renderNavigator();

    expect(screen.getByRole("heading", { name: "My Plan" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Do now" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Do next" })).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "My Plan completion" })).toHaveAttribute("aria-valuenow", "0");
    expect(screen.queryAllByText("Completed")).toHaveLength(0);
  });

  it("clears local plan data and returns to a clean pathway chooser", () => {
    seedWealthPlan();
    renderNavigator();

    expect(window.localStorage.length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "Clear local plan" }));

    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(window.localStorage.length).toBe(0);
    expect(screen.getByRole("heading", { name: "No saved actions yet" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Build wealth and financial stability/ })).toBeInTheDocument();
  });
});
