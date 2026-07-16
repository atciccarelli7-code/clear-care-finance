import { describe, expect, it } from "vitest";
import {
  getMedicarePlanVerificationState,
  type MedicareChecklistStatus,
} from "@/lib/medicarePlanVerification";

const blank = (): Record<string, MedicareChecklistStatus> => ({
  providers: "unconfirmed", travel: "unconfirmed", formulary: "unconfirmed", pharmacy: "unconfirmed",
  authorization: "unconfirmed", costs: "unconfirmed", moop: "unconfirmed", medigap: "unconfirmed",
  supplemental: "unconfirmed", anoc: "unconfirmed", ship: "unconfirmed", enrollment: "unconfirmed",
});

describe("Medicare plan verification completion", () => {
  it("distinguishes not started from in progress", () => {
    expect(getMedicarePlanVerificationState(blank(), 12).state).toBe("not_started");
    const statuses = blank();
    statuses.travel = "not-applicable";
    expect(getMedicarePlanVerificationState(statuses, 12).state).toBe("in_progress");
  });

  it("requires every critical category to be deliberately resolved", () => {
    const statuses = blank();
    ["providers", "formulary", "pharmacy", "authorization", "costs", "moop", "anoc"].forEach((id) => { statuses[id] = "confirmed"; });
    expect(getMedicarePlanVerificationState(statuses, 12).state).toBe("in_progress");
    statuses.enrollment = "not-applicable";
    expect(getMedicarePlanVerificationState(statuses, 12).state).toBe("completed");
  });

  it("defines completion as preparation, not plan suitability", () => {
    const statuses = blank();
    ["providers", "formulary", "pharmacy", "authorization", "costs", "moop", "anoc", "enrollment"].forEach((id) => { statuses[id] = "not-applicable"; });
    const result = getMedicarePlanVerificationState(statuses, 12);
    expect(result.state).toBe("completed");
    expect(result.confirmed).toBe(0);
    expect(result.resolved).toBe(8);
  });
});
