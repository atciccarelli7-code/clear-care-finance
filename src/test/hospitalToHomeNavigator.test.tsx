import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HospitalToHomeNavigator } from "@/components/patients/HospitalToHomeNavigator";
import { DECISION_WORKSPACE_STORAGE_KEY, loadDecisionWorkspace } from "@/lib/decisionWorkspace";
import { trackJourneyEvent } from "@/lib/journeyAnalytics";

vi.mock("@/lib/journeyAnalytics", () => ({ trackJourneyEvent: vi.fn(() => true) }));

afterEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  vi.clearAllMocks();
});

const next = () => fireEvent.click(screen.getByRole("button", { name: /^(continue|build my brief)$/i }));

const completeMedicarePath = () => {
  fireEvent.click(screen.getByRole("button", { name: /family member or caregiver/i })); next();
  fireEvent.click(screen.getByRole("button", { name: /^today/i })); next();
  fireEvent.click(screen.getByRole("button", { name: /^original medicare/i })); next();
  fireEvent.click(screen.getByRole("button", { name: /skilled nursing \/ short-term rehab/i })); next();
  fireEvent.click(screen.getByRole("button", { name: /^outpatient \/ observation/i })); next();
  fireEvent.click(screen.getByRole("button", { name: /^durable medical equipment/i }));
  fireEvent.click(screen.getByRole("button", { name: /^skilled rehabilitation/i })); next();
  fireEvent.click(screen.getByRole("button", { name: /submitted and pending/i })); next();
  fireEvent.click(screen.getByRole("button", { name: /nothing is fully confirmed/i })); next();
  fireEvent.click(screen.getByRole("button", { name: /moon or medicare status-change notice/i })); next();
  fireEvent.click(screen.getByRole("button", { name: /unexpected bill or private-pay cost/i })); next();
};

describe("Hospital-to-Home Navigator", () => {
  it("uses progressive questions, context-aware Medicare branching, and a named progress indicator", () => {
    render(<MemoryRouter><HospitalToHomeNavigator /></MemoryRouter>);

    expect(screen.getByText(/step 1 of 8/i)).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: /hospital-to-home brief progress/i })).toHaveAttribute("aria-valuenow", "12.5");
    expect(screen.queryByRole("heading", { name: /current hospital status/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /family member or caregiver/i })); next();
    fireEvent.click(screen.getByRole("button", { name: /^today/i })); next();
    fireEvent.click(screen.getByRole("button", { name: /^original medicare/i })); next();
    fireEvent.click(screen.getByRole("button", { name: /^home without ordered home health/i })); next();

    expect(screen.getByRole("heading", { name: /current hospital status/i })).toBeInTheDocument();
    expect(screen.getByText(/step 5 of 9/i)).toBeInTheDocument();
  });

  it("builds an owner-assigned result with uncertainty, authoritative handoffs, and no premium gate", async () => {
    render(<MemoryRouter><HospitalToHomeNavigator /></MemoryRouter>);
    completeMedicarePath();

    const heading = screen.getByRole("heading", { name: "Discharge Coverage & Cost Brief" });
    expect(heading).toBeInTheDocument();
    await waitFor(() => expect(heading).toHaveFocus());
    expect(screen.getByText(/observation or changed status may affect cost/i)).toBeInTheDocument();
    expect(screen.getAllByText(/hospital case manager/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /medicare — skilled nursing facility care/i })).toHaveAttribute("href", "https://www.medicare.gov/coverage/skilled-nursing-facility-care");
    expect(screen.queryByText(/\$29|buy|checkout|premium workspace/i)).not.toBeInTheDocument();
  });

  it("saves only fixed task state and emits only allowlisted lifecycle properties", () => {
    render(<MemoryRouter><HospitalToHomeNavigator /></MemoryRouter>);
    completeMedicarePath();
    fireEvent.click(screen.getByRole("button", { name: /mark complete: request a same-day discharge huddle/i }));
    fireEvent.click(screen.getByRole("button", { name: /save task state/i }));

    const workspace = loadDecisionWorkspace();
    const record = workspace.records.find((item) => item.id === "hospital-discharge-primary");
    const stored = JSON.parse(window.localStorage.getItem(DECISION_WORKSPACE_STORAGE_KEY) ?? "{}") as Record<string, unknown>;
    expect(record?.fixedCategory).toBe("Hospital-to-Home Coverage & Cost");
    expect(record?.outstandingActions.some((item) => item.status === "complete")).toBe(true);
    expect(stored).not.toHaveProperty("answers");
    expect(stored).not.toHaveProperty("coverage");
    expect(stored).not.toHaveProperty("hospitalStatus");
    expect(stored).not.toHaveProperty("services");
    expect(stored).not.toHaveProperty("concern");
    expect(trackJourneyEvent).toHaveBeenCalledWith("journey_result_saved", expect.objectContaining({
      journey_key: "hospital_to_home",
      phase: "result",
    }));

    for (const [, properties] of vi.mocked(trackJourneyEvent).mock.calls) {
      expect(Object.keys(properties ?? {}).every((key) => ["journey_key", "surface", "variant", "phase", "step_index"].includes(key))).toBe(true);
    }
    expect(JSON.stringify(vi.mocked(trackJourneyEvent).mock.calls)).not.toMatch(/medicare|observation|dme|caregiver/i);
  });
});
