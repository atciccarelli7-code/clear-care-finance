import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MedicalAppointmentCostPreparationPage from "@/pages/MedicalAppointmentCostPreparationPage";

vi.mock("@/lib/seo", () => ({ useSeo: vi.fn() }));
vi.mock("@/lib/preventiveCostAnalytics", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/preventiveCostAnalytics")>();
  return { ...actual, trackPreventiveCostEvent: vi.fn(() => false) };
});

describe("MedicalAppointmentCostPreparationPage", () => {
  beforeEach(() => window.localStorage.clear());

  it("uses only bounded choices and produces a focused, safe Cost Preparation Plan", async () => {
    render(<MemoryRouter><MedicalAppointmentCostPreparationPage /></MemoryRouter>);

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByText(/Do not enter names, diagnoses, medications, member IDs/i)).toBeInTheDocument();
    expect(screen.getByText(/Do not delay emergency or urgently needed care/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("What setting is expected?"), { target: { value: "hospital-outpatient" } });
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));
    fireEvent.click(screen.getByRole("button", { name: /Build my cost preparation plan/i }));

    await waitFor(() => expect(screen.getByRole("heading", { name: /Your medical-care cost preparation plan/i })).toHaveFocus());
    expect(screen.getByRole("heading", { name: "Questions for the healthcare provider or facility" })).toBeInTheDocument();
    expect(screen.getAllByText(/Is this location treated as a hospital outpatient department/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("heading", { name: "Fixed call scripts" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Copy plan/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Print or save as PDF/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Start over/i })).toBeInTheDocument();
    expect(window.localStorage.length).toBe(0);
  });
});
