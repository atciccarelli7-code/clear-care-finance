import { workspaceStateSchema, type WorkspaceState } from "./contracts.js";
import {
  extractedBenefitFactSchema,
  type ExtractedBenefitFact,
  type ExtractedBenefitFactKey,
} from "./documentIntakeContracts.js";

export const LOCAL_BENEFITS_SOURCE_MAX_BYTES = 1024 * 1024;
export const LOCAL_SOURCE_METHOD = "browser-local-text" as const;

export type BenefitsSourceTarget = "optionA" | "optionB";

export type ApplyLocalBenefitsFactsInput = {
  state: WorkspaceState;
  facts: ExtractedBenefitFact[];
  target: BenefitsSourceTarget;
  payPeriodsPerYear?: number;
  sourceCategory: string;
};

export type ApplyLocalBenefitsFactsResult = {
  state: WorkspaceState;
  appliedFactKeys: ExtractedBenefitFactKey[];
  skippedFactKeys: ExtractedBenefitFactKey[];
};

const answerKey = (moduleKey: string, group: BenefitsSourceTarget | "shared", fieldId: string) =>
  `${moduleKey}.${group}.${fieldId}`;

const annualPremium = (fact: ExtractedBenefitFact, payPeriodsPerYear?: number) => {
  if (fact.cadence === "annual") return fact.value;
  if (fact.cadence === "monthly") return fact.value * 12;
  if (fact.cadence === "per_pay_period" && Number.isFinite(payPeriodsPerYear) && (payPeriodsPerYear || 0) > 0) {
    return fact.value * Number(payPeriodsPerYear);
  }
  return null;
};

const appendUniqueLine = (current: unknown, line: string) => {
  const existing = typeof current === "string"
    ? current.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)
    : [];
  if (!existing.includes(line)) existing.push(line);
  return existing.join("\n");
};

export const applyConfirmedLocalBenefitsFacts = ({
  state,
  facts,
  target,
  payPeriodsPerYear,
  sourceCategory,
}: ApplyLocalBenefitsFactsInput): ApplyLocalBenefitsFactsResult => {
  const answers = { ...state.answers };
  const assumptions = [...state.assumptions];
  const appliedFactKeys: ExtractedBenefitFactKey[] = [];
  const skippedFactKeys: ExtractedBenefitFactKey[] = [];

  facts.map((fact) => extractedBenefitFactSchema.parse(fact)).forEach((fact) => {
    let applied = true;

    switch (fact.key) {
      case "employee_premium": {
        const annualized = annualPremium(fact, payPeriodsPerYear);
        if (annualized === null) {
          applied = false;
          break;
        }
        answers[answerKey("health-plan-exposure", target, "annual-premium")] = annualized;
        break;
      }
      case "deductible":
        answers[answerKey("health-plan-exposure", target, "deductible")] = fact.value;
        break;
      case "out_of_pocket_maximum":
        answers[answerKey("health-plan-exposure", target, "oop-max")] = fact.value;
        break;
      case "employer_hsa_or_hra_contribution":
        answers[answerKey("health-plan-exposure", target, "employer-account")] = fact.value;
        break;
      case "retirement_match_percent":
        answers[answerKey("retirement-benefits", target, "match-percent")] = fact.value;
        break;
      case "retirement_vesting_years": {
        answers[answerKey("retirement-benefits", target, "vesting-years-source")] = fact.value;
        const optionLabel = target === "optionA" ? "Option A" : "Option B";
        const note = `${optionLabel}: confirm how the ${fact.value}-year vesting schedule converts to the currently vested percentage used in the retirement calculation.`;
        answers[answerKey("verification-list", "shared", "verification-notes")] = appendUniqueLine(
          answers[answerKey("verification-list", "shared", "verification-notes")],
          note,
        );
        break;
      }
    }

    if (!applied) {
      skippedFactKeys.push(fact.key);
      return;
    }

    answers[`source-assistant.${target}.${fact.key}.confirmed`] = true;
    answers[`source-assistant.${target}.${fact.key}.value`] = fact.value;
    answers[`source-assistant.${target}.${fact.key}.cadence`] = fact.cadence || "not_applicable";
    appliedFactKeys.push(fact.key);
  });

  answers[`source-assistant.${target}.method`] = LOCAL_SOURCE_METHOD;
  answers[`source-assistant.${target}.source-category`] = sourceCategory.slice(0, 160);
  answers[`source-assistant.${target}.confirmed-fact-keys`] = appliedFactKeys;
  if (Number.isFinite(payPeriodsPerYear) && (payPeriodsPerYear || 0) > 0) {
    answers[`source-assistant.${target}.pay-periods-per-year`] = Number(payPeriodsPerYear);
  }

  const privacyAssumption = "Source assistance was performed in the browser. Only user-confirmed structured values were saved; raw text and file contents were not retained.";
  if (appliedFactKeys.length && !assumptions.includes(privacyAssumption)) assumptions.push(privacyAssumption);

  return {
    state: workspaceStateSchema.parse({
      ...state,
      answers,
      assumptions,
      updatedAt: new Date().toISOString(),
    }),
    appliedFactKeys,
    skippedFactKeys,
  };
};
