import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HealthcareOfferDecisionChecklist } from "@/components/calculators/HealthcareOfferDecisionChecklist";

const STORAGE_KEY = "caf-healthcare-offer-verification-v1";
const renderChecklist = () => render(<MemoryRouter><HealthcareOfferDecisionChecklist /></MemoryRouter>);

describe("HealthcareOfferDecisionChecklist", () => {
  beforeEach(() => {
    window.localStorage.clear();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    Object.defineProperty(window, "print", { configurable: true, value: vi.fn() });
    Object.defineProperty(window, "confirm", { configurable: true, value: vi.fn().mockReturnValue(true) });
  });

  it("starts with a clear verification boundary and accessible progress", () => {
    renderChecklist();

    expect(screen.getByRole("heading", { name: "Build the written verification plan before you resign" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Do not resign until the final written offer is verified" })).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(12);
    expect(screen.getByRole("progressbar", { name: "Healthcare offer verification progress" })).toHaveAttribute("aria-valuenow", "0");
    expect(screen.getByText("0 of 12 confirmed")).toBeInTheDocument();
  });

  it("stores fixed completion markers locally and restores them without offer values", () => {
    const { unmount } = renderChecklist();
    const basePayItem = screen.getByRole("checkbox", { name: /Base pay and pay frequency are in writing/ });

    fireEvent.click(basePayItem);
    expect(basePayItem).toBeChecked();

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as { completed: string[] };
    expect(stored.completed).toEqual(["written-base-pay"]);
    expect(window.localStorage.getItem(STORAGE_KEY)).not.toMatch(/salary figures|employer names/i);

    unmount();
    renderChecklist();

    expect(screen.getByRole("checkbox", { name: /Base pay and pay frequency are in writing/ })).toBeChecked();
    expect(screen.getByRole("progressbar", { name: "Healthcare offer verification progress" })).toHaveAttribute("aria-valuenow", "1");
  });

  it("produces a complete action state and copies a plain-text plan", async () => {
    renderChecklist();

    screen.getAllByRole("checkbox").forEach((checkbox) => fireEvent.click(checkbox));

    expect(screen.getByRole("progressbar", { name: "Healthcare offer verification progress" })).toHaveAttribute("aria-valuenow", "12");
    expect(screen.getByRole("heading", { name: "All verification items are marked complete" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Copy plan" }));

    await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1));
    expect(vi.mocked(navigator.clipboard.writeText).mock.calls[0][0]).toContain("Healthcare Offer Verification Plan");
    expect(vi.mocked(navigator.clipboard.writeText).mock.calls[0][0]).toContain("[x] The written offer is final before notice is given");
  });

  it("keeps saved progress when reset is declined and clears it after confirmation", () => {
    renderChecklist();
    const basePayItem = screen.getByRole("checkbox", { name: /Base pay and pay frequency are in writing/ });
    const clearButton = screen.getByRole("button", { name: "Clear local plan" });
    const confirmMock = vi.mocked(window.confirm);

    fireEvent.click(basePayItem);
    expect(basePayItem).toBeChecked();

    confirmMock.mockReturnValueOnce(false);
    fireEvent.click(clearButton);
    expect(basePayItem).toBeChecked();
    expect(screen.getByRole("progressbar", { name: "Healthcare offer verification progress" })).toHaveAttribute("aria-valuenow", "1");

    confirmMock.mockReturnValueOnce(true);
    fireEvent.click(clearButton);
    expect(basePayItem).not.toBeChecked();
    expect(screen.getByRole("progressbar", { name: "Healthcare offer verification progress" })).toHaveAttribute("aria-valuenow", "0");
  });
});
