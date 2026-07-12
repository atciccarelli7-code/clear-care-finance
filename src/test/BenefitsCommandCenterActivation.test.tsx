import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BenefitsCommandCenterActivation from "@/components/benefits/BenefitsCommandCenterActivation";
import {
  BENEFITS_COMMAND_CENTER_STORAGE_KEY,
  createDefaultBenefitsWorkspace,
  loadBenefitsWorkspace,
  saveBenefitsWorkspace,
} from "@/lib/benefitsCommandCenter";
import {
  BENEFITS_COMMAND_CENTER_TOUR_STORAGE_KEY,
  SAMPLE_HOSPITAL_RN_PACKAGE_ID,
} from "@/lib/benefitsCommandCenterActivation";

vi.mock("@/lib/analytics", () => ({ trackSiteEvent: vi.fn(() => true) }));

const renderActivation = (state?: Record<string, unknown>) =>
  render(
    <MemoryRouter initialEntries={[{ pathname: "/tools/benefits-command-center", state }]}>
      <BenefitsCommandCenterActivation />
    </MemoryRouter>,
  );

describe("BenefitsCommandCenterActivation", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("presents three meaningful first actions before a blank workspace", () => {
    renderActivation();
    expect(screen.getByRole("heading", { name: /understand what your job is actually worth/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /build my own package/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /explore a sample package/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /compare two sample jobs/i })).toBeInTheDocument();
    expect(screen.getByText(/no account/i)).toBeInTheDocument();
  });

  it("loads a sample package in one action and renders a calculated Receipt preview", async () => {
    renderActivation();
    fireEvent.click(screen.getByRole("button", { name: /explore a sample package/i }));

    expect(await screen.findByRole("article", { name: /illustrative sample benefits receipt/i })).toBeInTheDocument();
    expect(screen.getByText(/sample hospital rn benefits receipt/i)).toBeInTheDocument();
    expect(screen.getByText(/does not reduce a job to one score/i)).toBeInTheDocument();

    const stored = loadBenefitsWorkspace();
    expect(stored?.packages[0].id).toBe(SAMPLE_HOSPITAL_RN_PACKAGE_ID);
    expect(window.localStorage.getItem(BENEFITS_COMMAND_CENTER_STORAGE_KEY)).toContain(SAMPLE_HOSPITAL_RN_PACKAGE_ID);
  });

  it("loads the fictional bedside versus specialist comparison", async () => {
    renderActivation();
    fireEvent.click(screen.getByRole("button", { name: /compare two sample jobs/i }));

    expect(await screen.findByRole("heading", { name: /bedside rn versus clinical specialist/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /fictional bedside rn offer/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /fictional clinical specialist offer/i })).toBeInTheDocument();
    expect(screen.queryByText(/^winner$/i)).not.toBeInTheDocument();
    expect(loadBenefitsWorkspace()?.packages).toHaveLength(2);
  });

  it("opens the real workspace when the visitor starts their own package", async () => {
    renderActivation();
    fireEvent.click(screen.getByRole("button", { name: /build my own package/i }));
    expect(await screen.findByRole("heading", { name: /build the package behind the paycheck/i })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /workspace modules/i })).toBeInTheDocument();
  });

  it("does not overwrite an existing user-created package when opening a sample preview", async () => {
    const workspace = createDefaultBenefitsWorkspace();
    workspace.packages[0].label = "My private package";
    workspace.packages[0].compensation.hourlyRate = 44;
    saveBenefitsWorkspace(workspace);

    renderActivation({ activation: "sample_receipt", entrySurface: "homepage" });
    expect(await screen.findByRole("article", { name: /illustrative sample benefits receipt/i })).toBeInTheDocument();

    const stored = loadBenefitsWorkspace();
    expect(stored?.packages[0].label).toBe("My private package");
    expect(stored?.packages[0].compensation.hourlyRate).toBe(44);
  });

  it("offers a keyboard-accessible tour and persists a skipped state", async () => {
    renderActivation();
    fireEvent.click(screen.getByRole("button", { name: /take the 60–90 second tour/i }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: /tour progress/i })).toHaveAttribute("aria-valuenow", "1");
    fireEvent.click(screen.getByRole("button", { name: /skip tour/i }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(window.localStorage.getItem(BENEFITS_COMMAND_CENTER_TOUR_STORAGE_KEY)).toBe("skipped");
  });
});
