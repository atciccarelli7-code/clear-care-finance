import { describe, expect, it } from "vitest";
import {
  buildMedicalAppointmentCostPlan,
  createMedicalAppointmentCostPlanText,
  DEFAULT_MEDICAL_APPOINTMENT_COST_ANSWERS,
} from "@/lib/medicalAppointmentCostPreparation";

describe("medical appointment cost preparation", () => {
  it("builds a bounded pre-care plan with universal safety limits", () => {
    const plan = buildMedicalAppointmentCostPlan(DEFAULT_MEDICAL_APPOINTMENT_COST_ANSWERS);
    const text = createMedicalAppointmentCostPlanText(plan);

    expect(plan.sections.map((section) => section.title)).toEqual([
      "Questions for the healthcare provider or facility",
      "Questions for the insurer or health plan",
      "Possible separate bills to verify",
      "Documents and confirmation details to retain",
      "Estimates, deposits, payment plans, and financial assistance",
      "What to verify after the EOB or bill arrives",
    ]);
    expect(text).toMatch(/estimate is not a guarantee/i);
    expect(text).toMatch(/separate bills/i);
    expect(text).toMatch(/educational preparation/i);
  });

  it("adds setting and coverage-specific questions without determining price or coverage", () => {
    const plan = buildMedicalAppointmentCostPlan({
      ...DEFAULT_MEDICAL_APPOINTMENT_COST_ANSWERS,
      setting: "hospital-outpatient",
      coverage: "uninsured-self-pay",
    });
    const text = createMedicalAppointmentCostPlanText(plan);

    expect(text).toMatch(/hospital outpatient department/i);
    expect(text).toMatch(/facility fee/i);
    expect(text).toMatch(/good-faith estimate/i);
    expect(text).not.toMatch(/you will owe|you are covered|guaranteed price/i);
  });

  it("places care before cost research when urgent care is selected", () => {
    const plan = buildMedicalAppointmentCostPlan({
      ...DEFAULT_MEDICAL_APPOINTMENT_COST_ANSWERS,
      timing: "urgent-or-emergency",
    });

    expect(plan.urgentCareNotice).toMatch(/Do not delay emergency or urgently needed care/i);
    expect(plan.headline).toMatch(/Get necessary care first/i);
  });
});
