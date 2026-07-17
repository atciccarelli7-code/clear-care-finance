import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ForOrganizationsPage from "@/pages/ForOrganizationsPage";

describe("ForOrganizationsPage", () => {
  it("presents a concise executive overview with inspectable due-diligence paths", () => {
    render(<MemoryRouter><ForOrganizationsPage /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: /without handing over their private information/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Focused pathways built from products buyers can open today/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Benefits Decision Readiness" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Healthcare Cost Preparation" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Medicare, Medicaid, and Discharge Readiness" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Healthcare Career and Compensation Decisions" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Healthcare Finance Navigation Library" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Programs.*Participant pathways/i })).toHaveAttribute("href", "/for-organizations/programs");
    expect(screen.getByRole("link", { name: /Implementation.*Owners, review/i })).toHaveAttribute("href", "/for-organizations/implementation");
    expect(screen.getByRole("link", { name: /Measurement.*Decision-grade/i })).toHaveAttribute("href", "/for-organizations/measurement");
    expect(screen.getByRole("link", { name: /Trust & procurement.*Available now/i })).toHaveAttribute("href", "/for-organizations/trust-procurement");
    expect(screen.getByRole("link", { name: /Buyer FAQ.*Data, certifications/i })).toHaveAttribute("href", "/for-organizations/faq");
    expect(screen.getByText(/does not claim HIPAA, SOC 2, HITRUST, or BAA readiness/i)).toBeInTheDocument();
    expect(screen.queryByText(/CAF is HIPAA compliant|CAF guarantees savings|CAF has proven ROI/i)).not.toBeInTheDocument();
  });

  it("builds a private, fixed-choice program brief from live modules", () => {
    render(<MemoryRouter><ForOrganizationsPage /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText("Organization type"), { target: { value: "health_system" } });
    fireEvent.change(screen.getByLabelText("Primary audience"), { target: { value: "patients_caregivers" } });
    fireEvent.change(screen.getByLabelText("First priority"), { target: { value: "medicare_discharge" } });
    fireEvent.change(screen.getByLabelText("Planning horizon"), { target: { value: "thirty_days" } });
    fireEvent.click(screen.getByRole("button", { name: /build program brief/i }));

    expect(screen.getByRole("heading", { name: /Medicare, Medicaid, and Discharge Readiness for Hospital or health system/i })).toBeInTheDocument();
    expect(screen.getByText(/Selections remain in this browser tab/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Participant pathway/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /Medicare and Medicaid Starting-Point Check/i })[0]).toHaveAttribute("href", "/tools/medicare-medicaid-eligibility-check");
    expect(screen.getByRole("link", { name: /Request program review/i })).toHaveAttribute("href", "/contact");
  });
});
