import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import OrganizationDetailsPage from "@/pages/OrganizationDetailsPage";

const renderPath = (path: string) => render(
  <MemoryRouter initialEntries={[path]}>
    <OrganizationDetailsPage />
  </MemoryRouter>,
);

describe("OrganizationDetailsPage", () => {
  it("keeps programs inspectable and connected to live participant products", () => {
    renderPath("/for-organizations/programs");
    expect(screen.getByRole("heading", { level: 1, name: /Five focused programs built from public participant experiences/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Benefits Decision Readiness" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Benefits Change Detector/i })[0]).toHaveAttribute("href", "/tools/benefits-change-detector");
  });

  it("states current capability and rejects implied enterprise certifications", () => {
    renderPath("/for-organizations/trust-procurement");
    expect(screen.getByRole("heading", { name: "Current public capability" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /No implied certification or enterprise readiness/i })).toBeInTheDocument();
    expect(screen.getByText(/does not represent HIPAA, SOC 2, HITRUST, BAA, SSO/i)).toBeInTheDocument();
  });

  it("answers buyer questions without inventing pricing or outcome claims", () => {
    renderPath("/for-organizations/faq");
    expect(screen.getByText(/Does CAF need employee, patient, member, or student data/i)).toBeInTheDocument();
    expect(screen.getByText(/Can CAF prove savings, retention, claims reduction, better elections, or ROI/i)).toBeInTheDocument();
    expect(screen.getByText(/How is pricing determined/i)).toBeInTheDocument();
  });
});
