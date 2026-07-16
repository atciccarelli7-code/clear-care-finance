import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import {
  ChildcareBenefitsDecisionGuidePage,
  RothTraditionalDecisionHelperPage,
} from "@/pages/WorkplaceDecisionToolsBundle";
import {
  MedicarePlanVerificationChecklistPage,
  StateMedicaidLongTermCareRouterPage,
} from "@/pages/CareDecisionToolsBundle";
import { roadmapTools } from "@/data/roadmapTools";
import { tools } from "@/data/tools";
import { loadStoredNavigatorPlan } from "@/lib/financialNavigator";

afterEach(() => {
  window.localStorage.clear();
});

const renderPage = (page: React.ReactNode) => render(<MemoryRouter>{page}</MemoryRouter>);

describe("comprehensive roadmap journeys", () => {
  it("keeps roadmap tool slugs unique across the complete directory", () => {
    const slugs = [...tools, ...roadmapTools].map((tool) => tool.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(roadmapTools).toHaveLength(7);
    roadmapTools.forEach((tool) => {
      expect(tool.href).toBe(`/tools/${tool.slug}`);
      expect(tool.description.length).toBeGreaterThan(40);
    });
  });

  it("routes North Carolina long-term care to the official state agency without collecting exact financial data", () => {
    renderPage(<StateMedicaidLongTermCareRouterPage />);

    expect(screen.getByText(/No exact assets, income, diagnoses, or identifying data/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/exact income|asset value|bank balance/i)).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("State of residence"), { target: { value: "NC" } });
    fireEvent.change(screen.getByLabelText("Primary help being investigated"), { target: { value: "home-community" } });
    fireEvent.change(screen.getByLabelText(/ongoing help with daily activities/i), { target: { value: "yes" } });
    fireEvent.click(screen.getByRole("button", { name: /build state routing plan/i }));

    expect(screen.getByRole("heading", { name: /Start with NC Medicaid/i })).toBeInTheDocument();
    expect(screen.getByText(/does not determine Medicaid/i)).toBeInTheDocument();
    expect(screen.queryByText(/you qualify|you are eligible|approved/i)).not.toBeInTheDocument();
  });

  it("produces a qualified childcare coordination result and saves only a fixed My Plan action", () => {
    renderPage(<ChildcareBenefitsDecisionGuidePage />);

    fireEvent.click(screen.getByRole("button", { name: /build coordination plan/i }));
    expect(screen.getByRole("heading", { name: /partial election may reduce uncertainty/i })).toBeInTheDocument();
    expect(screen.getByText(/does not determine tax eligibility/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Add this action" }));
    const plan = loadStoredNavigatorPlan();
    expect(plan?.actionIds).toContain("benefits_action_plan");
    expect(JSON.stringify(plan)).not.toMatch(/filingStatus|expenseBand|predictableExpenses|7500/i);
  });

  it("defaults the Roth comparison to a split when assumptions are uncertain", () => {
    renderPage(<RothTraditionalDecisionHelperPage />);
    fireEvent.click(screen.getByRole("button", { name: /compare contribution factors/i }));

    expect(screen.getByRole("heading", { name: /A split may reduce uncertainty/i })).toBeInTheDocument();
    expect(screen.getByText(/does not provide individualized tax or investment advice/i)).toBeInTheDocument();
    expect(screen.queryByText(/always choose|guaranteed|best choice/i)).not.toBeInTheDocument();
  });

  it("keeps Medicare checklist statuses transient and provides official verification", async () => {
    renderPage(<MedicarePlanVerificationChecklistPage />);

    const providerStatus = screen.getByLabelText(/Preferred doctors, specialists, and hospitals were checked/i);
    fireEvent.change(providerStatus, { target: { value: "confirmed" } });

    expect(screen.getByRole("heading", { name: /1 of 12 confirmed/i })).toBeInTheDocument();
    [
      /Every recurring prescription was checked/i,
      /Preferred and mail-order pharmacy rules/i,
      /Prior authorization, referral, and step-therapy/i,
      /Premium, deductible, copays, coinsurance/i,
      /maximum out-of-pocket exposure was identified/i,
      /Annual Notice of Change was reviewed/i,
      /correct enrollment period and effective date/i,
    ].forEach((label) => fireEvent.change(screen.getByLabelText(label), { target: { value: "confirmed" } }));

    await waitFor(() => expect(screen.getByRole("heading", { name: /critical verification categories were deliberately resolved/i })).toHaveFocus());
    expect(screen.getByText(/does not mean a plan is suitable, recommended, approved/i)).toBeInTheDocument();
    expect(screen.getByText(/does not rank Original Medicare/i)).toBeInTheDocument();
    expect(window.localStorage.length).toBe(0);
    expect(screen.getByRole("link", { name: /Medicare Plan Finder/i })).toHaveAttribute("href", "https://www.medicare.gov/plan-compare/");
  });
});
