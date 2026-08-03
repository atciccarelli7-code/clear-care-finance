import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { DirectionalNextActions } from "@/components/shared/DirectionalNextActions";
import { trackSiteEvent } from "@/lib/analytics";

vi.mock("@/lib/analytics", () => ({ trackSiteEvent: vi.fn(() => true) }));

const available = "available" as const;
const context = {
  audienceSegment: "everyone",
  decisionCategory: "student_loans",
  placementId: "tool_related_action",
  originPath: "/tools/private-student-loan-payoff-calculator",
} as const;

describe("DirectionalNextActions", () => {
  it("renders one primary, at most one secondary, and subordinate related links", () => {
    render(
      <MemoryRouter>
        <DirectionalNextActions
          title="Choose the next loan action"
          description="Use the closest next step."
          primary={{ id: "loan_compare_primary", title: "Compare payoff options", label: "Compare payoff options", href: "/tools/private-student-loan-payoff-calculator", availabilityStatus: available }}
          secondary={{ id: "loan_path_secondary", title: "Find a repayment path", label: "Find a repayment path", href: "/tools/student-loan-path-finder", availabilityStatus: available }}
          related={[{ id: "loan_payment_related", title: "Estimate a payment", label: "Estimate a payment", href: "/tools/student-loan-payment-calculator", availabilityStatus: available }]}
          context={context}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /compare payoff options/i })).toHaveAttribute("href", "/tools/private-student-loan-payoff-calculator");
    expect(screen.getByRole("link", { name: /find a repayment path/i })).toHaveAttribute("href", "/tools/student-loan-path-finder");
    expect(screen.getByRole("list", { name: /other useful paths/i })).toContainElement(screen.getByRole("link", { name: /estimate a payment/i }));

    fireEvent.click(screen.getByRole("link", { name: /compare payoff options/i }));
    expect(trackSiteEvent).toHaveBeenCalledTimes(1);
    expect(trackSiteEvent).toHaveBeenCalledWith("directional_cta_clicked", expect.objectContaining({
      cta_id: "loan_compare_primary",
      action_tier: "primary",
      placement_id: "tool_related_action",
    }));
  });

  it("uses a native same-page anchor without creating another event", () => {
    render(
      <MemoryRouter>
        <DirectionalNextActions
          title="Start the comparison"
          description="Go directly to the tool."
          primary={{ id: "career_compare_primary", title: "Compare two offers", label: "Compare the two offers", href: "#comparison", availabilityStatus: available }}
          context={{ ...context, decisionCategory: "career_compensation", placementId: "tool_hero" }}
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: /compare the two offers/i })).toHaveAttribute("href", "#comparison");
  });
});

