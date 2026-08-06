import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Header } from "@/components/layout/Header";

const evidenceMocks = vi.hoisted(() => ({
  recordServiceNavigationOpened: vi.fn(),
  recordServiceNavigationSelection: vi.fn(),
}));

vi.mock("@/lib/firstPartyEvidence", () => evidenceMocks);

const renderHeader = (path = "/") => render(
  <MemoryRouter initialEntries={[path]}>
    <Header />
  </MemoryRouter>,
);

describe("Header service navigation", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    evidenceMocks.recordServiceNavigationOpened.mockClear();
    evidenceMocks.recordServiceNavigationSelection.mockClear();
    Object.defineProperty(window, "requestAnimationFrame", {
      configurable: true,
      value: (callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      },
    });
    Object.defineProperty(window, "cancelAnimationFrame", {
      configurable: true,
      value: vi.fn(),
    });
  });

  it("moves focus into the opened mobile menu and restores it after Escape", () => {
    renderHeader();
    const menuButton = screen.getByRole("button", { name: "Open menu" });

    fireEvent.click(menuButton);
    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });

    expect(within(mobileNav).getByRole("link", { name: /Start Here/ })).toHaveFocus();
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.documentElement.style.overflow).toBe("hidden");

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
    expect(menuButton).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("contains keyboard focus inside the opened mobile menu", () => {
    renderHeader();
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });

    const firstLink = within(mobileNav).getByRole("link", { name: /Start Here/ });
    const lastLink = within(mobileNav).getByRole("link", { name: "Monthly email" });

    lastLink.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(firstLink).toHaveFocus();

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(lastLink).toHaveFocus();
  });

  it("uses the same grouped hierarchy on mobile and exposes active destinations", () => {
    renderHeader("/medicare-care-costs");
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });

    expect(within(mobileNav).getByText("Healthcare-worker decisions")).toBeInTheDocument();
    expect(within(mobileNav).getByText("Patient and caregiver decisions")).toBeInTheDocument();
    expect(within(mobileNav).getByText("Free education and trusted sources")).toBeInTheDocument();
    expect(within(mobileNav).getByRole("link", { name: /Medicare & Medicaid/ })).toHaveAttribute("aria-current", "page");
  });

  it("closes the mobile menu after a grouped service is selected", () => {
    renderHeader();
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    fireEvent.click(within(mobileNav).getByText("Patient and caregiver decisions"));

    const billReview = within(mobileNav).getByRole("link", { name: /Hospital Bill & Assistance/ });
    expect(billReview).toHaveAttribute("href", "/medical-bills/financial-assistance");
    fireEvent.click(billReview);

    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
  });

  it("exposes an accessible desktop service-navigation trigger", () => {
    renderHeader();
    const trigger = screen.getByRole("button", { name: "Open Explore CAF service navigation" });

    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveTextContent("Explore CAF");
  });

  it("records only fixed navigation open and destination identifiers", () => {
    renderHeader();
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });

    expect(evidenceMocks.recordServiceNavigationOpened).toHaveBeenCalledWith("mobile_header");
    fireEvent.click(within(mobileNav).getByRole("link", { name: /Free tools/ }));
    expect(evidenceMocks.recordServiceNavigationSelection).toHaveBeenCalledWith("mobile_header", "all_tools");
  });
});
