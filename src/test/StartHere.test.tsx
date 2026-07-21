import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import StartHere from "@/pages/StartHere";

vi.mock("@/components/navigator/FinancialNavigator", () => ({
  FinancialNavigator: () => <div>Primary Financial Navigator</div>,
}));
vi.mock("@/components/calculators/FinancialFoundationCheckup", () => ({
  default: () => <div>Optional Financial Foundation Checkup</div>,
}));
vi.mock("@/lib/seo", () => ({ useSeo: vi.fn() }));

const renderStartHere = (entry = "/start-here") => render(
  <MemoryRouter initialEntries={[entry]}>
    <StartHere />
  </MemoryRouter>,
);

describe("Start Here", () => {
  it("renders one primary action-plan experience and gates the optional checkup", async () => {
    renderStartHere();

    expect(screen.getByText("Primary Financial Navigator")).toBeInTheDocument();
    expect(screen.queryByText("Optional Financial Foundation Checkup")).not.toBeInTheDocument();
    expect(screen.getByText(/Start Here has one primary job/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Open the optional foundation checkup/i }));
    expect(await screen.findByText("Optional Financial Foundation Checkup")).toBeInTheDocument();
  });

  it("opens a previously saved foundation checkup when its continuity link is followed", async () => {
    renderStartHere("/start-here#financial-foundation-checkup");

    expect(screen.getByText("Primary Financial Navigator")).toBeInTheDocument();
    expect(await screen.findByText("Optional Financial Foundation Checkup")).toBeInTheDocument();
    expect(screen.getByText("Optional Financial Foundation Checkup").closest("section")?.id).toBe("financial-foundation-checkup");
  });
});
