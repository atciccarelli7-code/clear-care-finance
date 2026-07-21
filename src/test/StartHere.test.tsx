import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import StartHere from "@/pages/StartHere";

vi.mock("@/components/navigator/FinancialNavigator", () => ({
  FinancialNavigator: () => <div>Primary Financial Navigator</div>,
}));
vi.mock("@/components/calculators/FinancialFoundationCheckup", () => ({
  default: () => <div>Optional Financial Foundation Checkup</div>,
}));
vi.mock("@/lib/seo", () => ({ useSeo: vi.fn() }));

describe("Start Here", () => {
  it("renders one primary action-plan experience and gates the optional checkup", async () => {
    render(<StartHere />);

    expect(screen.getByText("Primary Financial Navigator")).toBeInTheDocument();
    expect(screen.queryByText("Optional Financial Foundation Checkup")).not.toBeInTheDocument();
    expect(screen.getByText(/Start Here has one primary job/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Open the optional foundation checkup/i }));
    expect(await screen.findByText("Optional Financial Foundation Checkup")).toBeInTheDocument();
  });
});
