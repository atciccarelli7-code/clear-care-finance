import { describe, expect, it } from "vitest";
import { buildStudentLoanPriority } from "../studentLoanPriority";

describe("student-loan priority bridge", () => {
  it("protects match and federal options", () => {
    const result = buildStudentLoanPriority({ loanType: "federal", aprBand: "4-7", fullMatchCaptured: "no", emergencyFund: "1-3-months", forgivenessPath: "unknown", majorExpense: "no", monthlySurplus: "250-750" });
    expect(result.priorities.join(" ")).toContain("employer retirement match");
    expect(result.verify.join(" ")).toContain("before refinancing");
  });
});
