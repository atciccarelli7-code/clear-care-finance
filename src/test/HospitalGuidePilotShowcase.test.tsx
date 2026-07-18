import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HospitalGuidePilotShowcase } from "@/components/organizations/HospitalGuidePilotShowcase";

vi.mock("@/lib/analytics", () => ({ trackSiteEvent: vi.fn() }));

describe("HospitalGuidePilotShowcase", () => {
  it("switches packages and perspectives with accessible controls", () => {
    render(<HospitalGuidePilotShowcase />);

    expect(screen.getByRole("heading", { name: "COPD Exacerbation and Recovery at Home" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /heart failure/i }));
    expect(screen.getByRole("heading", { name: "Heart Failure Discharge and Daily Management" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Caregiver sees" }));
    expect(screen.getByRole("tabpanel", { name: "Caregiver sees" })).toHaveTextContent(/breathing, swelling, sleep/i);
  });

  it("shows four text-labeled action levels", () => {
    render(<HospitalGuidePilotShowcase />);
    expect(screen.getByText("Routine self-management", { selector: "div" })).toBeInTheDocument();
    expect(screen.getByText("Contact the care team", { selector: "div" })).toBeInTheDocument();
    expect(screen.getByText("Seek urgent evaluation", { selector: "div" })).toBeInTheDocument();
    expect(screen.getByText("Call 911 / emergency services", { selector: "div" })).toBeInTheDocument();
  });
});

