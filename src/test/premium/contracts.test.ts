import { describe, expect, it } from "vitest";
import { premiumModuleDefinitionSchema, workspaceStateSchema } from "@/premium/contracts";

describe("premium validation contracts", () => {
  it("rejects arbitrary module keys and oversized user content", () => {
    const result = premiumModuleDefinitionSchema.safeParse({
      key: "arbitrary-module",
      number: 1,
      title: "Invalid",
      summary: "Invalid module",
      fields: [{ id: "field", label: "Field", type: "text" }],
    });
    expect(result.success).toBe(false);
    expect(workspaceStateSchema.safeParse({
      version: 1,
      activeModuleKey: "define-decision",
      completedModuleKeys: [],
      answers: { notes: "x".repeat(8_001) },
      assumptions: [],
      finalDecision: "",
    }).success).toBe(false);
  });

  it("accepts structured JSON state without document uploads", () => {
    const result = workspaceStateSchema.parse({
      version: 1,
      activeModuleKey: "define-decision",
      completedModuleKeys: ["define-decision"],
      answers: { "define-decision.shared.priority": "Schedule" },
      assumptions: ["Overtime excluded"],
      finalDecision: "",
    });
    expect(result.completedModuleKeys).toEqual(["define-decision"]);
    expect(result).not.toHaveProperty("uploads");
  });
});
