import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FinancialNavigator } from "@/components/navigator/FinancialNavigator";

const renderNavigator = () => render(<MemoryRouter><FinancialNavigator /></MemoryRouter>);

const completeWealthPlan = () => {
  fireEvent.click(screen.getByRole("button", { name: /Build wealth and financial stability/ }));

  for (let step = 0; step < 6; step += 1) {
    fireEvent.click(screen.getAllByRole("radio")[0]);
    fireEvent.click(screen.getByRole("button", { name: step === 5 ? /Build my plan/ : /Continue/ }));
  }
};

describe("FinancialNavigator", () => {
  beforeEach(() => {
    window.localStorage.clear();
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
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

  it("uses one page landmark and Radix radio semantics for the guided intake", () => {
    const { container } = renderNavigator();

    expect(container.querySelector("main")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Build wealth and financial stability/ }));

    expect(screen.getByRole("heading", { name: "What is the main financial goal in front of you?" })).toHaveFocus();
    expect(screen.getAllByRole("radio")).toHaveLength(8);
    expect(screen.getByRole("button", { name: /Continue/ })).toBeDisabled();

    fireEvent.click(screen.getByRole("radio", { name: "Build an emergency fund" }));
    expect(screen.getByRole("radio", { name: "Build an emergency fund" })).toBeChecked();
    expect(screen.getByRole("button", { name: /Continue/ })).toBeEnabled();
  });

  it("focuses the generated-plan confirmation and renders recommendations once in grouped My Plan sections", () => {
    renderNavigator();
    completeWealthPlan();

    expect(screen.getByRole("heading", { name: "Your plan is ready" })).toHaveFocus();
    expect(screen.getByRole("heading", { name: "My Plan" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Do now" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Do next" })).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "My Plan completion" })).toHaveAttribute("aria-valuenow", "0");
    expect(screen.getAllByText("Completed")).toHaveLength(0);
  });

  it("clears local plan data and returns to a clean pathway chooser", () => {
    renderNavigator();
    completeWealthPlan();

    expect(window.localStorage.length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "Clear local plan" }));

    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(window.localStorage.length).toBe(0);
    expect(screen.getByRole("heading", { name: "No saved actions yet" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Build wealth and financial stability/ })).toBeInTheDocument();
  });
});
