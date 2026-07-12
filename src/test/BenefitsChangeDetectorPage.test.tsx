import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BenefitsChangeDetectorPage from "@/pages/BenefitsChangeDetectorPage";

vi.mock("@/lib/growthAnalytics", () => ({ trackGrowthEvent: vi.fn(() => false) }));
vi.mock("@/lib/seo", () => ({ useSeo: vi.fn() }));

describe("BenefitsChangeDetectorPage", () => {
  beforeEach(() => window.localStorage.clear());

  it("renders the guided fixed-choice review and produces a focused Receipt", () => {
    render(<MemoryRouter><BenefitsChangeDetectorPage /></MemoryRouter>);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Employee premium change"), { target: { value: "increased" } });
    for (let index = 0; index < 4; index += 1) fireEvent.click(screen.getByRole("button", { name: /Next section/ }));
    fireEvent.click(screen.getByRole("button", { name: /Create Benefits Change Receipt/ }));
    expect(screen.getByRole("heading", { name: "Benefits Change Receipt" })).toHaveFocus();
    expect(screen.getByText("Employee premium:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Copy safe public link/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Permanently delete local review/ })).toBeInTheDocument();
    expect(screen.queryByText(/best plan|plan winner/i)).not.toBeInTheDocument();
  });
});
