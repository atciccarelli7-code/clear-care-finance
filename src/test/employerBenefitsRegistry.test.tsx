import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EmployerBenefitsNavigator from "@/components/benefits/EmployerBenefitsNavigator";
import {
  createEmployerBenefitsWorkspaceContext,
  employerBenefitsRegistry,
  getEmployerPackageReadiness,
  searchEmployerBenefitsEmployers,
} from "@/lib/employerBenefitsRegistry";

describe("employer benefits registry", () => {
  it("keeps employer packages distinct and source-bounded", () => {
    expect(employerBenefitsRegistry.employers.map((employer) => employer.slug)).toEqual([
      "novant-health",
      "atrium-health",
      "unc-health",
      "ecu-health",
      "northwell-health",
    ]);

    const unc = employerBenefitsRegistry.employers.find((employer) => employer.slug === "unc-health");
    expect(unc).toBeDefined();
    const readiness = getEmployerPackageReadiness(unc!.packages[0]);
    expect(readiness.locatedCoreDocumentCount).toBe(1);
    expect(readiness.canPrefillVerifiedFacts).toBe(false);
    expect(readiness.missingCoreDocumentTypes).toContain("medical_sbc");
  });

  it("searches aliases and regions", () => {
    expect(searchEmployerBenefitsEmployers("Vidant").map((employer) => employer.slug)).toEqual(["ecu-health"]);
    expect(searchEmployerBenefitsEmployers("New York").map((employer) => employer.slug)).toEqual(["northwell-health"]);
  });

  it("creates a versioned employer workspace context", () => {
    const employer = employerBenefitsRegistry.employers.find((entry) => entry.slug === "northwell-health")!;
    const context = createEmployerBenefitsWorkspaceContext({
      employer,
      benefitsPackage: employer.packages[0],
      employeeClass: employer.employeeClasses[0],
    });

    expect(context).toMatchObject({
      schemaVersion: 1,
      employerSlug: "northwell-health",
      planYear: 2026,
      employeeClassId: "non-union",
      sourceStatus: "source_collection_in_progress",
    });
  });
});

describe("EmployerBenefitsNavigator", () => {
  it("renders employer selection, source status, and bounded intake", () => {
    render(<EmployerBenefitsNavigator />);
    expect(screen.getByRole("heading", { name: /start with the employer and plan year/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /novant health/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start this employer workspace/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /request an employer or submit an official link/i })).toBeInTheDocument();
    expect(screen.getByText(/do not provide portal credentials/i)).toBeInTheDocument();
  });
});
