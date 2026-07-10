export type PayRange = "under-50" | "50-75" | "75-100" | "100-150" | "150-plus" | "not-sure";
export type SavingPriority = "protect-paycheck" | "balanced" | "accelerate" | "not-sure";
export type RiskTolerance = "conservative" | "moderate" | "growth" | "not-sure";
export type CostPreference = "lower-deductions" | "predictable-costs" | "balanced" | "not-sure";
export type HealthcareUse = "low" | "moderate" | "high" | "not-sure";
export type YesNoUnknown = "yes" | "no" | "not-sure";
export type FlexibilityPreference = "essential" | "helpful" | "not-important" | "not-sure";
export type HsaComfort = "yes" | "maybe" | "no" | "not-sure";
export type CoverageTier = "employee" | "employee-spouse" | "employee-children" | "family" | "not-sure";

export type BenefitsBlueprintAnswers = {
  age: number;
  targetRetirementAge: number;
  payRange: PayRange;
  savingPriority: SavingPriority;
  riskTolerance: RiskTolerance;
  costPreference: CostPreference;
  healthcareUse: HealthcareUse;
  regularCare: YesNoUnknown;
  flexibility: FlexibilityPreference;
  hsaComfort: HsaComfort;
  coverageTier: CoverageTier;
  employerMatch: YesNoUnknown;
};

export type PlanArchetype = {
  id: "ppo" | "hmo" | "hdhp-hsa";
  name: string;
  fitLabel: string;
  reason: string;
  verify: string;
};

export type BenefitsBlueprint = {
  contributionRange: { minimum: number; maximum: number };
  approximateAnnualRange: { minimum: number; maximum: number } | null;
  applicableRetirementLimit: number;
  matchReminder: string;
  retirementComparison: string[];
  planArchetypes: PlanArchetype[];
  coverageTier: string;
  hsaGuidance: string;
  portalNumbers: string[];
  hrQuestions: string[];
  changeFactors: string[];
};

export const BENEFITS_LIMITS_2026 = {
  year: 2026,
  workplaceRetirementDeferral: 24_500,
  workplaceRetirementCatchUp50: 8_000,
  workplaceRetirementCatchUp60To63: 11_250,
  hsaSelfOnly: 4_400,
  hsaFamily: 8_750,
  hsaCatchUp55: 1_000,
} as const;

const PAY_RANGE_MIDPOINTS: Record<Exclude<PayRange, "not-sure">, number> = {
  "under-50": 40_000,
  "50-75": 62_500,
  "75-100": 87_500,
  "100-150": 125_000,
  "150-plus": 175_000,
};

const COVERAGE_LABELS: Record<CoverageTier, string> = {
  employee: "Employee-only coverage",
  "employee-spouse": "Employee plus spouse/partner coverage",
  "employee-children": "Employee plus child or children coverage",
  family: "Family coverage",
  "not-sure": "Coverage tier still needs to be confirmed",
};

const roundToNearest50 = (value: number) => Math.round(value / 50) * 50;

const getContributionRange = (answers: BenefitsBlueprintAnswers) => {
  const baseByPriority: Record<SavingPriority, [number, number]> = {
    "protect-paycheck": [3, 6],
    balanced: [6, 10],
    accelerate: [10, 15],
    "not-sure": [4, 8],
  };
  const [baseMinimum, baseMaximum] = baseByPriority[answers.savingPriority];
  const yearsToRetirement = answers.targetRetirementAge - answers.age;
  const urgencyAdjustment = yearsToRetirement <= 15 ? 3 : yearsToRetirement <= 25 ? 2 : 0;

  return {
    minimum: Math.min(20, baseMinimum + urgencyAdjustment),
    maximum: Math.min(20, baseMaximum + urgencyAdjustment),
  };
};

const getApplicableRetirementLimit = (age: number) => {
  if (age >= 60 && age <= 63) {
    return BENEFITS_LIMITS_2026.workplaceRetirementDeferral + BENEFITS_LIMITS_2026.workplaceRetirementCatchUp60To63;
  }
  if (age >= 50) {
    return BENEFITS_LIMITS_2026.workplaceRetirementDeferral + BENEFITS_LIMITS_2026.workplaceRetirementCatchUp50;
  }
  return BENEFITS_LIMITS_2026.workplaceRetirementDeferral;
};

const getAnnualRange = (
  payRange: PayRange,
  contributionRange: { minimum: number; maximum: number },
  applicableLimit: number,
) => {
  if (payRange === "not-sure") return null;
  const midpoint = PAY_RANGE_MIDPOINTS[payRange];
  return {
    minimum: Math.min(applicableLimit, roundToNearest50(midpoint * (contributionRange.minimum / 100))),
    maximum: Math.min(applicableLimit, roundToNearest50(midpoint * (contributionRange.maximum / 100))),
  };
};

const getRetirementComparison = (riskTolerance: RiskTolerance) => {
  const common = [
    "Compare pretax and Roth contribution availability and how each changes today's paycheck.",
    "Check the investment menu, expense ratios, administrative fees, automatic escalation, and beneficiary settings.",
    "Treat the employer match and vesting schedule as separate questions: a contribution can receive a match before that match is fully vested.",
  ];

  if (riskTolerance === "conservative") {
    return [
      ...common,
      "Your conservative preference is a reason to compare diversified lower-volatility choices carefully, while also considering inflation and a long retirement horizon.",
    ];
  }
  if (riskTolerance === "moderate") {
    return [
      ...common,
      "Your moderate preference is a reason to compare broadly diversified mixes that balance growth potential with the ability to tolerate market declines.",
    ];
  }
  if (riskTolerance === "growth") {
    return [
      ...common,
      "Your growth-oriented preference is a reason to compare diversified growth-heavy choices only if you can remain invested through large market declines.",
    ];
  }
  return [
    ...common,
    "Because risk tolerance is still uncertain, compare how you would react to a meaningful market decline before choosing an investment mix.",
  ];
};

const getPlanArchetypes = (answers: BenefitsBlueprintAnswers): PlanArchetype[] => {
  const scores = { ppo: 0, hmo: 0, "hdhp-hsa": 0 };
  const reasons: Record<keyof typeof scores, string[]> = { ppo: [], hmo: [], "hdhp-hsa": [] };

  if (answers.flexibility === "essential") {
    scores.ppo += 4;
    reasons.ppo.push("broad provider and out-of-network flexibility matters to you");
  } else if (answers.flexibility === "helpful") {
    scores.ppo += 2;
    reasons.ppo.push("you value some provider flexibility");
  } else if (answers.flexibility === "not-important") {
    scores.hmo += 2;
    reasons.hmo.push("you are comfortable working within a coordinated network");
  }

  if (answers.costPreference === "predictable-costs") {
    scores.hmo += 2;
    scores.ppo += 1;
    reasons.hmo.push("you prefer more predictable point-of-care costs");
  } else if (answers.costPreference === "lower-deductions") {
    scores["hdhp-hsa"] += 2;
    reasons["hdhp-hsa"].push("lower paycheck deductions are a priority");
  }

  if (answers.healthcareUse === "high") {
    scores.ppo += 2;
    scores.hmo += 2;
    scores["hdhp-hsa"] -= 2;
    reasons.ppo.push("you expect higher healthcare use");
    reasons.hmo.push("you expect higher healthcare use and may value coordinated care");
  } else if (answers.healthcareUse === "low") {
    scores["hdhp-hsa"] += 2;
    reasons["hdhp-hsa"].push("you expect relatively low healthcare use");
  }

  if (answers.regularCare === "yes") {
    scores.ppo += 2;
    scores.hmo += 1;
    reasons.ppo.push("regular prescriptions or specialist visits make network and formulary details important");
  }

  if (answers.hsaComfort === "yes") {
    scores["hdhp-hsa"] += 4;
    reasons["hdhp-hsa"].push("you are comfortable comparing a higher deductible and an HSA");
  } else if (answers.hsaComfort === "maybe") {
    scores["hdhp-hsa"] += 2;
    reasons["hdhp-hsa"].push("you are open to an HSA if the full plan math works");
  } else if (answers.hsaComfort === "no") {
    scores["hdhp-hsa"] -= 3;
  }

  const definitions: Record<keyof typeof scores, Omit<PlanArchetype, "fitLabel" | "reason">> = {
    ppo: {
      id: "ppo",
      name: "PPO-style flexibility",
      verify: "Verify the network, out-of-network benefits, specialist rules, drug formulary, premium, deductible, and out-of-pocket maximum.",
    },
    hmo: {
      id: "hmo",
      name: "HMO-style coordination",
      verify: "Verify the required primary-care process, referrals, network boundaries, prescriptions, premium, deductible, and out-of-pocket maximum.",
    },
    "hdhp-hsa": {
      id: "hdhp-hsa",
      name: "HSA-eligible high-deductible option",
      verify: "Verify HSA eligibility, employer HSA funding, deductible exposure, coinsurance, prescriptions, network, and total annual cost—not only the premium.",
    },
  };

  const rankedIds = (Object.keys(scores) as Array<keyof typeof scores>)
    .sort((left, right) => scores[right] - scores[left]);
  const topScore = scores[rankedIds[0]];
  const topIds = rankedIds.filter((id) => scores[id] === topScore);
  const hasPositiveLeader = topScore > 0;

  return rankedIds.map((id, index) => {
    const isTop = scores[id] === topScore;
    const fitLabel = !hasPositiveLeader
      ? isTop
        ? "No clear fit signal"
        : "Lower fit signal"
      : isTop && topIds.length > 1
        ? "Top fit signal (tie)"
        : index === 0
          ? "First archetype to inspect"
          : index === 1
            ? "Also compare"
            : "Keep as a reference";

    return {
      ...definitions[id],
      fitLabel,
      reason:
        reasons[id].length > 0
          ? `This deserves comparison because ${reasons[id].slice(0, 2).join(" and ")}.`
          : "Your answers do not strongly favor or rule out this structure, so use the actual plan documents to compare it.",
    };
  });
};

const getHsaGuidance = (answers: BenefitsBlueprintAnswers) => {
  const ageEligibilityNote =
    answers.age >= 55
      ? ` At age 55 or older, an additional $${BENEFITS_LIMITS_2026.hsaCatchUp55.toLocaleString()} may apply only while you remain HSA-eligible. Medicare enrollment generally ends HSA contribution eligibility and can include retroactive coverage, so verify timing before contributing.`
      : "";
  if (answers.hsaComfort === "yes" && answers.healthcareUse !== "high") {
    return `An HSA deserves closer consideration if the offered plan is HSA-eligible and the deductible fits your cash flow. For 2026, the contribution limit is $${BENEFITS_LIMITS_2026.hsaSelfOnly.toLocaleString()} for self-only coverage and $${BENEFITS_LIMITS_2026.hsaFamily.toLocaleString()} for family coverage; employer contributions count toward that limit.${ageEligibilityNote}`;
  }
  if (answers.hsaComfort === "maybe" || answers.healthcareUse === "high") {
    return `Compare the HSA option carefully, but do not choose it for the tax advantage alone. Put the premium savings, employer HSA contribution, deductible, prescriptions, expected care, and bad-year exposure on one page first.${ageEligibilityNote}`;
  }
  if (answers.hsaComfort === "no") {
    return `An HSA-eligible option is not your leading fit signal right now. Still compare the actual total annual cost if the employer contribution or premium difference is substantial.${ageEligibilityNote}`;
  }
  return `HSA fit is still uncertain. Find the plan's HSA-eligibility statement, employer contribution, deductible, and out-of-pocket maximum before deciding.${ageEligibilityNote}`;
};

export const buildBenefitsBlueprint = (answers: BenefitsBlueprintAnswers): BenefitsBlueprint => {
  const contributionRange = getContributionRange(answers);
  const applicableRetirementLimit = getApplicableRetirementLimit(answers.age);
  const retirementCatchUpReminder =
    " The displayed 2026 limit reflects age-based federal rules, but catch-up contributions apply only when permitted by the plan. Some 403(b) participants with at least 15 years of service for the same eligible employer may have a separate plan-permitted catch-up; verify eligibility with the plan administrator.";
  const matchReminder =
    (answers.employerMatch === "yes"
      ? "Start by finding the exact match formula and contributing enough to capture the full available match, if your budget allows. Then decide whether moving toward the planning range is sustainable."
      : answers.employerMatch === "not-sure"
        ? "The employer match is unresolved. Locate the match formula and vesting schedule before submitting the retirement election; missing that information can change the first contribution target."
        : "No employer match is expected based on your answer. The planning range still provides a starting point, but there is no match threshold to capture first.") + retirementCatchUpReminder;

  const hrQuestions = [
    answers.employerMatch === "not-sure"
      ? "What is the exact retirement match formula, deposit timing, and vesting schedule, and does the plan permit age-based or 403(b) 15-year service catch-up contributions?"
      : "Can you confirm the retirement match formula, deposit timing, vesting schedule, and any plan-permitted age-based or 403(b) 15-year service catch-up contributions in writing?",
    "Where can I download the Summary of Benefits and Coverage for every health-plan option?",
    answers.flexibility === "essential"
      ? "Which plans cover my current doctors and hospitals, and what happens when I use out-of-network care?"
      : "Which doctors, hospitals, labs, and pharmacies are in each plan's network?",
    answers.regularCare === "yes"
      ? "Where can I verify my prescriptions, specialist rules, prior authorization requirements, and estimated cost?"
      : "Where can I verify the drug formulary, specialist rules, and prior authorization requirements?",
    "Is any option HSA-eligible, how much does the employer contribute, and when is that money deposited?",
  ];

  return {
    contributionRange,
    approximateAnnualRange: getAnnualRange(answers.payRange, contributionRange, applicableRetirementLimit),
    applicableRetirementLimit,
    matchReminder,
    retirementComparison: getRetirementComparison(answers.riskTolerance),
    planArchetypes: getPlanArchetypes(answers),
    coverageTier: COVERAGE_LABELS[answers.coverageTier],
    hsaGuidance: getHsaGuidance(answers),
    portalNumbers: [
      "Employer match formula and vesting rules",
      "Plan-permitted age and 15-year-service catch-up rules",
      "Employee premium per paycheck",
      "Individual and family deductible",
      "Individual and family out-of-pocket maximum",
      "Copays and coinsurance",
      "Provider, hospital, lab, and pharmacy network rules",
      "Employer HSA contribution and deposit timing",
    ],
    hrQuestions,
    changeFactors: [
      "The actual employer match, vesting schedule, catch-up eligibility, and retirement-plan fees",
      "Premiums, deductible, out-of-pocket maximum, and employer HSA money",
      "Whether current doctors, hospitals, prescriptions, and specialists are covered",
      "A major change in expected care, household coverage, cash flow, or retirement timeline",
      "Plan exclusions, prior authorization rules, or details found in the official Summary of Benefits and Coverage",
    ],
  };
};

export const blueprintToText = (blueprint: BenefitsBlueprint) => {
  const annualRange = blueprint.approximateAnnualRange
    ? `Approximate annual amount at the midpoint of the selected pay range: $${blueprint.approximateAnnualRange.minimum.toLocaleString()}-$${blueprint.approximateAnnualRange.maximum.toLocaleString()}.`
    : "Annual dollar estimate: enter or verify pay in the employer portal before converting the percentage to dollars.";

  return [
    "Healthcare Worker Benefits Blueprint",
    "",
    `Retirement contribution planning range: ${blueprint.contributionRange.minimum}%-${blueprint.contributionRange.maximum}% of pay.`,
    annualRange,
    `Potential 2026 employee elective-deferral limit used for this age: $${blueprint.applicableRetirementLimit.toLocaleString()}. Employer contributions follow separate plan and overall-limit rules. Confirm that the plan permits any applicable catch-up contribution.`,
    blueprint.matchReminder,
    "",
    "Retirement account characteristics to compare:",
    ...blueprint.retirementComparison.map((item) => `- ${item}`),
    "",
    "Health-plan archetypes to compare:",
    ...blueprint.planArchetypes.map((plan) => `- ${plan.fitLabel}: ${plan.name}. ${plan.reason} ${plan.verify}`),
    "",
    `Coverage tier to look for: ${blueprint.coverageTier}.`,
    blueprint.hsaGuidance,
    "",
    "Numbers to locate in the HR portal:",
    ...blueprint.portalNumbers.map((item) => `- ${item}`),
    "",
    "Questions to ask HR:",
    ...blueprint.hrQuestions.map((item) => `- ${item}`),
    "",
    "What could change this blueprint:",
    ...blueprint.changeFactors.map((item) => `- ${item}`),
    "",
    "Educational planning only. Actual plan documents and the Summary of Benefits and Coverage control.",
  ].join("\n");
};
