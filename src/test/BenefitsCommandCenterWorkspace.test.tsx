import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import BenefitsCommandCenterWorkspace from "@/components/benefits/BenefitsCommandCenterWorkspace";
import { BENEFITS_COMMAND_CENTER_STORAGE_KEY } from "@/lib/benefitsCommandCenter";

vi.mock("@/lib/analytics", () => ({ trackSiteEvent: vi.fn(() => true) }));

describe("BenefitsCommandCenterWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders an accessible module workspace and persists a local package", async () => {
    render(<BenefitsCommandCenterWorkspace />);

    expect(screen.getByRole("heading", { name: /build the package behind the paycheck/i })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /workspace modules/i })).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: /package completeness/i })).toHaveAttribute("aria-valuemin", "0");

    await waitFor(() => expect(window.localStorage.getItem(BENEFITS_COMMAND_CENTER_STORAGE_KEY)).not.toBeNull());
    const stored = JSON.parse(window.localStorage.getItem(BENEFITS_COMMAND_CENTER_STORAGE_KEY) ?? "null") as { packages?: unknown[] } | null;
    expect(stored?.packages).toHaveLength(1);
  });

  it("adds a second package and exposes the comparison workspace without declaring a winner", async () => {
    render(<BenefitsCommandCenterWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: /add package/i }));
    expect(screen.getByRole("button", { name: "Offer B" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /compare/i }));
    expect(screen.getByRole("heading", { name: /compare two packages without declaring a simplistic winner/i })).toBeInTheDocument();
    expect(screen.queryByText(/^winner$/i)).not.toBeInTheDocument();

    await waitFor(() => {
      const stored = JSON.parse(window.localStorage.getItem(BENEFITS_COMMAND_CENTER_STORAGE_KEY) ?? "null") as { packages?: unknown[] } | null;
      expect(stored?.packages).toHaveLength(2);
    });
  });

  it("renders the Benefits Receipt and clears all local Command Center data", async () => {
    render(<BenefitsCommandCenterWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: /^receipt$/i }));
    expect(screen.getByRole("article", { name: /benefits receipt for current package/i })).toBeInTheDocument();
    expect(screen.getByText(/guaranteed cash, expected variable pay/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /clear all local data/i }));
    await waitFor(() => expect(screen.getByText(/all command center data was cleared/i)).toBeInTheDocument());
    expect(window.localStorage.getItem(BENEFITS_COMMAND_CENTER_STORAGE_KEY)).not.toBeNull();
  });
});
