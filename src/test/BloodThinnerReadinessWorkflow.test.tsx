import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BloodThinnerReadinessWorkflow } from "@/components/organizations/BloodThinnerReadinessWorkflow";

vi.mock("@/lib/analytics", () => ({ trackSiteEvent: vi.fn(() => true) }));

describe("BloodThinnerReadinessWorkflow", () => {
  beforeEach(() => window.sessionStorage.clear());

  it("shows all exact medicine branches and an incomplete status", () => {
    render(<BloodThinnerReadinessWorkflow />);
    expect(screen.getByText("Readiness checks not started")).toBeInTheDocument();
    for (const name of ["Apixaban", "Rivaroxaban", "Dabigatran capsules", "Edoxaban", "Warfarin", "Enoxaparin prefilled syringe"]) {
      expect(screen.getByRole("button", { name: new RegExp(name, "i") })).toBeInTheDocument();
    }
  });

  it("requires a regimen after rivaroxaban is selected", () => {
    render(<BloodThinnerReadinessWorkflow />);
    fireEvent.click(screen.getByRole("button", { name: /rivaroxaban/i }));
    expect(screen.getByText(/missed-dose branches differ/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /select the exact rivaroxaban regimen/i })).toBeInTheDocument();
  });

  it("switches to a patient and caregiver view without exposing staff results", () => {
    render(<BloodThinnerReadinessWorkflow />);
    fireEvent.click(screen.getByRole("button", { name: /patient & caregiver/i }));
    fireEvent.click(screen.getByRole("button", { name: /teach-back/i }));
    expect(screen.getAllByText(/a staff member records the result/i)).toHaveLength(4);
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });
});
