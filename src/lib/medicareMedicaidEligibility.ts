import {
  FEDERAL_ELIGIBILITY_RULES,
  OFFICIAL_ELIGIBILITY_SOURCES,
  getStateMedicaidLink,
  type OfficialSource,
  type StateCode,
} from "@/data/medicareMedicaidEligibilityData";

export type YesNoNotSure = "yes" | "no" | "not-sure";
export type MedicareCondition = "als" | "esrd" | "neither" | "not-sure";
export type IncomePeriod = "monthly" | "annual";
export type MspApplicationUnit = "individual" | "married-couple" | "not-sure";

export type EligibilityAnswers = {
  state: StateCode | "";
  age: number | null;
  ageNotSure: boolean;
  alreadyMedicare: YesNoNotSure | "";
  ssdi: YesNoNotSure | "";
  ssdiMonths: number | null;
  ssdiMonthsNotSure: boolean;
  condition: MedicareCondition | "";
  householdSize: number | null;
  householdSizeNotSure: boolean;
  income: number | null;
  incomeNotSure: boolean;
  incomePeriod: IncomePeriod | "";
  pregnancy: YesNoNotSure | "";
  childrenInHousehold: YesNoNotSure | "";
  disability: YesNoNotSure | "";
  longTermCare: YesNoNotSure | "";
  dualHelp: YesNoNotSure | "";
  mspApplicationUnit: MspApplicationUnit | "";
};

export const EMPTY_ELIGIBILITY_ANSWERS: EligibilityAnswers = {
  state: "",
  age: null,
  ageNotSure: false,
  alreadyMedicare: "",
  ssdi: "",
  ssdiMonths: null,
  ssdiMonthsNotSure: false,
  condition: "",
  householdSize: null,
  householdSizeNotSure: false,
  income: null,
  incomeNotSure: false,
  incomePeriod: "",
  pregnancy: "",
  childrenInHousehold: "",
  disability: "",
  longTermCare: "",
  dualHelp: "",
  mspApplicationUnit: "",
};

export type PathwayCard = {
  id: string;
  label: string;
  title: string;
  why: string[];
  verify: string[];
  sourceIds: string[];
  emphasis?: "standard" | "caution" | "long-term-care";
};

export type OfficialLink = {
  label: string;
  url: string;
  description: string;
};

export type MspIncomeScreen = {
  tier: "qmb" | "slmb" | "qi" | "above-federal-screen" | "not-screened";
  monthlyIncome: number | null;
  monthlyLimit: number | null;
  applicationUnit: Exclude<MspApplicationUnit, "not-sure"> | null;
};

export type EligibilityScreeningResult = {
  medicare: PathwayCard[];
  medicaid: PathwayCard[];
  dual: PathwayCard[];
  whatCouldChange: string[];
  documents: string[];
  nextSteps: string[];
  officialLinks: OfficialLink[];
  sources: OfficialSource[];
  stateName?: string;
  incomplete: boolean;
};

const unique = <T,>(items: T[]) => Array.from(new Set(items));

export const toMonthlyIncome = (income: number | null, period: IncomePeriod | "") => {
  if (income === null || income < 0 || !period) return null;
  return period === "annual" ? income / 12 : income;
};

export const screenMedicareSavingsProgramIncome = (
  monthlyIncome: number | null,
  applicationUnit: MspApplicationUnit | "",
): MspIncomeScreen => {
  if (monthlyIncome === null || applicationUnit === "" || applicationUnit === "not-sure") {
    return { tier: "not-screened", monthlyIncome, monthlyLimit: null, applicationUnit: null };
  }

  const limits = applicationUnit === "individual"
    ? FEDERAL_ELIGIBILITY_RULES.medicareSavingsPrograms2026.individual
    : FEDERAL_ELIGIBILITY_RULES.medicareSavingsPrograms2026.marriedCouple;

  if (monthlyIncome <= limits.qmbMonthlyIncome) {
    return { tier: "qmb", monthlyIncome, monthlyLimit: limits.qmbMonthlyIncome, applicationUnit };
  }
  if (monthlyIncome <= limits.slmbMonthlyIncome) {
    return { tier: "slmb", monthlyIncome, monthlyLimit: limits.slmbMonthlyIncome, applicationUnit };
  }
  if (monthlyIncome <= limits.qiMonthlyIncome) {
    return { tier: "qi", monthlyIncome, monthlyLimit: limits.qiMonthlyIncome, applicationUnit };
  }

  return { tier: "above-federal-screen", monthlyIncome, monthlyLimit: limits.qiMonthlyIncome, applicationUnit };
};

const medicarePathIsCurrentOrPotential = (card: PathwayCard) =>
  ["medicare-current", "medicare-age", "medicare-disability", "medicare-als", "medicare-esrd"].includes(card.id);

export const evaluateMedicareMedicaidEligibility = (
  answers: EligibilityAnswers,
): EligibilityScreeningResult => {
  const medicare: PathwayCard[] = [];
  const medicaid: PathwayCard[] = [];
  const dual: PathwayCard[] = [];
  const sourceIds = new Set<string>();
  const state = getStateMedicaidLink(answers.state);
  const age = answers.ageNotSure ? null : answers.age;
  const monthlyIncome = answers.incomeNotSure ? null : toMonthlyIncome(answers.income, answers.incomePeriod);

  if (answers.alreadyMedicare === "yes") {
    medicare.push({
      id: "medicare-current",
      label: "Medicare status reported",
      title: "You reported that Medicare is already active",
      why: ["Current enrollment can create Medicaid, Medicare Savings Program, and dual-eligibility paths worth checking."],
      verify: ["Confirm whether Part A, Part B, or both are active and the coverage effective date.", "Use the Medicare card or SSA record rather than relying only on a plan card."],
      sourceIds: [OFFICIAL_ELIGIBILITY_SOURCES.medicareEnrollmentTiming.id],
    });
    sourceIds.add(OFFICIAL_ELIGIBILITY_SOURCES.medicareEnrollmentTiming.id);
  }

  if (age !== null && age >= FEDERAL_ELIGIBILITY_RULES.medicareAge.value) {
    medicare.push({
      id: "medicare-age",
      label: "A Medicare eligibility path may apply",
      title: "You appear to meet the basic age screen",
      why: [`The age entered is ${age}, and Medicare eligibility commonly begins at age 65.`],
      verify: ["Confirm citizenship or qualifying lawful-residency rules, work history, current coverage, and the correct enrollment period.", "Premium-free Part A and eligibility to enroll are related but not identical questions."],
      sourceIds: [OFFICIAL_ELIGIBILITY_SOURCES.medicareEnrollmentTiming.id],
    });
    sourceIds.add(OFFICIAL_ELIGIBILITY_SOURCES.medicareEnrollmentTiming.id);
  }

  if (answers.ssdi === "yes") {
    if (!answers.ssdiMonthsNotSure && answers.ssdiMonths !== null && answers.ssdiMonths >= FEDERAL_ELIGIBILITY_RULES.disabilityMedicareWait.value) {
      medicare.push({
        id: "medicare-disability",
        label: "A Medicare eligibility path may apply",
        title: "The disability-based Medicare timing screen may be met",
        why: [`You reported at least ${FEDERAL_ELIGIBILITY_RULES.disabilityMedicareWait.value} months of Social Security disability benefit entitlement.`],
        verify: ["Confirm the entitlement month count with Social Security.", "Confirm whether Medicare enrollment is automatic and the exact effective date."],
        sourceIds: [OFFICIAL_ELIGIBILITY_SOURCES.ssaDisabilityMedicare.id, OFFICIAL_ELIGIBILITY_SOURCES.medicareBefore65.id],
      });
    } else {
      medicare.push({
        id: "medicare-disability-timing",
        label: "A disability-based Medicare path is worth checking",
        title: "The exact SSDI entitlement month count matters",
        why: [answers.ssdiMonthsNotSure || answers.ssdiMonths === null
          ? "You reported SSDI but were not sure how many entitlement months have counted."
          : `You reported ${answers.ssdiMonths} months; most SSDI-based Medicare paths use a 24-month qualifying period.`],
        verify: ["Ask Social Security which month was month one of disability benefit entitlement.", "Prior periods of disability can sometimes count under federal rules."],
        sourceIds: [OFFICIAL_ELIGIBILITY_SOURCES.ssaDisabilityMedicare.id],
        emphasis: "caution",
      });
    }
    sourceIds.add(OFFICIAL_ELIGIBILITY_SOURCES.ssaDisabilityMedicare.id);
    sourceIds.add(OFFICIAL_ELIGIBILITY_SOURCES.medicareBefore65.id);
  }

  if (answers.condition === "als") {
    medicare.push({
      id: "medicare-als",
      label: "A Medicare eligibility path may apply",
      title: "ALS has a separate Medicare timing path",
      why: ["Medicare.gov states that people with ALS generally get Medicare when Social Security disability benefits begin, without the ordinary 24-month Medicare wait."],
      verify: ["Confirm the Social Security disability benefit start date and Medicare effective date with SSA.", "Confirm that the diagnosis and benefit record are coded correctly."],
      sourceIds: [OFFICIAL_ELIGIBILITY_SOURCES.medicareBefore65.id],
    });
    sourceIds.add(OFFICIAL_ELIGIBILITY_SOURCES.medicareBefore65.id);
  }

  if (answers.condition === "esrd") {
    medicare.push({
      id: "medicare-esrd",
      label: "A Medicare eligibility path may apply",
      title: "End-stage renal disease has a separate Medicare path",
      why: ["ESRD can create Medicare eligibility at any age when federal medical and work-history conditions are met."],
      verify: ["Confirm dialysis or transplant timing, work-history requirements, family-member work record if relevant, and the coverage start date.", "ESRD timing rules differ from the ordinary SSDI 24-month path."],
      sourceIds: [OFFICIAL_ELIGIBILITY_SOURCES.medicareEsrd.id, OFFICIAL_ELIGIBILITY_SOURCES.ssaDisabilityMedicare.id],
    });
    sourceIds.add(OFFICIAL_ELIGIBILITY_SOURCES.medicareEsrd.id);
    sourceIds.add(OFFICIAL_ELIGIBILITY_SOURCES.ssaDisabilityMedicare.id);
  }

  if ((answers.ageNotSure || answers.alreadyMedicare === "not-sure" || answers.ssdi === "not-sure" || answers.condition === "not-sure") && medicare.length === 0) {
    medicare.push({
      id: "medicare-uncertain",
      label: "A Medicare eligibility path may apply",
      title: "More information is needed to identify the Medicare path",
      why: ["One or more Medicare screening answers were marked not sure."],
      verify: ["Confirm age, current Medicare status, SSDI entitlement history, and whether ALS or ESRD applies.", "Use Medicare.gov or SSA.gov for the official timing determination."],
      sourceIds: [OFFICIAL_ELIGIBILITY_SOURCES.medicareEnrollmentTiming.id, OFFICIAL_ELIGIBILITY_SOURCES.ssaDisabilityMedicare.id],
      emphasis: "caution",
    });
    sourceIds.add(OFFICIAL_ELIGIBILITY_SOURCES.medicareEnrollmentTiming.id);
    sourceIds.add(OFFICIAL_ELIGIBILITY_SOURCES.ssaDisabilityMedicare.id);
  }

  if (state) {
    sourceIds.add(OFFICIAL_ELIGIBILITY_SOURCES.medicaidEligibility.id);
    sourceIds.add(OFFICIAL_ELIGIBILITY_SOURCES.medicaidStateContacts.id);

    if (age !== null && age >= 19 && age < 65) {
      medicaid.push({
        id: "medicaid-adult",
        label: "A Medicaid pathway is worth checking",
        title: "Adult health-coverage Medicaid may be a category to screen",
        why: [
          `You selected ${state.name} and entered an adult age.`,
          monthlyIncome === null
            ? "Income was not available, so this tool did not attempt an income screen."
            : `You entered household income of about $${Math.round(monthlyIncome).toLocaleString()} per month; ${state.name} must apply its own counting rules and category limits.`,
        ],
        verify: ["Ask the state to screen all available adult coverage categories, not just one income table.", "Confirm how the state counts household members, income, tax relationships, immigration status, and any deductions."],
        sourceIds: [OFFICIAL_ELIGIBILITY_SOURCES.medicaidEligibility.id, OFFICIAL_ELIGIBILITY_SOURCES.medicaidStateContacts.id],
      });
    }

    if (answers.pregnancy === "yes" || answers.childrenInHousehold === "yes") {
      medicaid.push({
        id: "medicaid-family",
        label: "A Medicaid or CHIP pathway is worth checking",
        title: answers.pregnancy === "yes" ? "Pregnancy-related coverage may apply" : "Child-related Medicaid or CHIP may apply",
        why: [
          answers.pregnancy === "yes" ? "Pregnancy can use a separate Medicaid eligibility category and income standard." : "Children can use Medicaid or CHIP rules that differ from adult rules.",
          answers.childrenInHousehold === "yes" ? "You reported that children are included in the household." : "Pregnancy status was reported.",
        ],
        verify: ["Ask the state to screen pregnancy, child Medicaid, and CHIP pathways separately.", "Confirm household composition, expected delivery information when requested, and each child’s age and coverage status."],
        sourceIds: [OFFICIAL_ELIGIBILITY_SOURCES.medicaidEligibility.id, OFFICIAL_ELIGIBILITY_SOURCES.medicaidStateContacts.id],
      });
    } else if (answers.pregnancy === "not-sure" || answers.childrenInHousehold === "not-sure") {
      medicaid.push({
        id: "medicaid-family-uncertain",
        label: "A family coverage pathway may be worth checking",
        title: "Pregnancy or child-related rules could change the result",
        why: ["A pregnancy or children-in-household answer was marked not sure."],
        verify: ["Ask the state whether pregnancy Medicaid, child Medicaid, or CHIP screening is appropriate."],
        sourceIds: [OFFICIAL_ELIGIBILITY_SOURCES.medicaidEligibility.id],
        emphasis: "caution",
      });
    }

    if (answers.disability === "yes") {
      medicaid.push({
        id: "medicaid-disability",
        label: "A Medicaid pathway is worth checking",
        title: "A disability-related Medicaid category may apply",
        why: ["Disability-related Medicaid pathways can use different financial and non-financial rules from ordinary adult coverage."],
        verify: ["Ask whether the state uses SSI-linked, disability, medically needy, waiver, or working-disabled pathways.", "Confirm whether assets or resources are counted for the specific category."],
        sourceIds: [OFFICIAL_ELIGIBILITY_SOURCES.medicaidEligibility.id],
      });
    }

    if (age !== null && age >= 65 || answers.alreadyMedicare === "yes") {
      medicaid.push({
        id: "medicaid-aged-medicare",
        label: "A Medicaid pathway is worth checking",
        title: "An aged, Medicare-related, or cost-sharing assistance category may apply",
        why: ["Age 65 or current Medicare enrollment can lead to Medicaid and Medicare Savings Program screening that is separate from ordinary adult Medicaid."],
        verify: ["Ask the state to screen full Medicaid, Medicare Savings Programs, and any medically needy pathway.", "Confirm income and resource rules for the exact program."],
        sourceIds: [OFFICIAL_ELIGIBILITY_SOURCES.medicaidEligibility.id, OFFICIAL_ELIGIBILITY_SOURCES.medicareSavingsPrograms.id],
      });
      sourceIds.add(OFFICIAL_ELIGIBILITY_SOURCES.medicareSavingsPrograms.id);
    }

    if (answers.longTermCare === "yes") {
      medicaid.push({
        id: "medicaid-long-term-care",
        label: "A long-term-care Medicaid path is worth checking",
        title: "Long-term-care Medicaid needs a separate review",
        why: ["You reported a possible need for nursing-home or long-term-care assistance.", "Long-term-care Medicaid can use medical-need, income, asset, transfer, and spousal rules that are different from ordinary health-coverage Medicaid."],
        verify: ["Ask for a long-term services and supports or nursing-facility Medicaid screening.", "Do not transfer or give away assets based only on this tool; obtain qualified state-specific advice when asset rules matter."],
        sourceIds: [OFFICIAL_ELIGIBILITY_SOURCES.medicaidLongTermCare.id, OFFICIAL_ELIGIBILITY_SOURCES.medicaidStateContacts.id],
        emphasis: "long-term-care",
      });
      sourceIds.add(OFFICIAL_ELIGIBILITY_SOURCES.medicaidLongTermCare.id);
    } else if (answers.longTermCare === "not-sure") {
      medicaid.push({
        id: "medicaid-long-term-care-uncertain",
        label: "A long-term-care Medicaid path may be worth checking",
        title: "Clarify whether the need is medical care, skilled care, or ongoing daily-living help",
        why: ["Long-term-care need was marked not sure, and that distinction can change the Medicaid pathway."],
        verify: ["Ask the care team to document functional needs and expected duration of assistance.", "Ask the state or facility whether an LTSS financial and clinical assessment is needed."],
        sourceIds: [OFFICIAL_ELIGIBILITY_SOURCES.medicaidLongTermCare.id],
        emphasis: "long-term-care",
      });
      sourceIds.add(OFFICIAL_ELIGIBILITY_SOURCES.medicaidLongTermCare.id);
    }

    if (medicaid.length === 0) {
      medicaid.push({
        id: "medicaid-no-obvious-category",
        label: "Official state screening is still the deciding step",
        title: "The information entered does not identify an obvious path, but only the official agency can determine eligibility",
        why: ["Medicaid is state-administered and category-specific, and this screener intentionally avoids a universal income cutoff."],
        verify: [`Ask ${state.agencyName} to screen all categories that may apply.`, "Ask whether a medically needy, spend-down, waiver, or other state-specific pathway exists."],
        sourceIds: [OFFICIAL_ELIGIBILITY_SOURCES.medicaidEligibility.id, OFFICIAL_ELIGIBILITY_SOURCES.medicaidStateContacts.id],
        emphasis: "caution",
      });
    }
  }

  const hasMedicareSignal = medicare.some(medicarePathIsCurrentOrPotential);
  const dualRequested = answers.dualHelp === "yes" || answers.dualHelp === "not-sure";

  if (state && hasMedicareSignal && (dualRequested || answers.alreadyMedicare === "yes")) {
    const mspScreen = screenMedicareSavingsProgramIncome(monthlyIncome, answers.mspApplicationUnit);
    sourceIds.add(OFFICIAL_ELIGIBILITY_SOURCES.medicareSavingsPrograms.id);

    if (["qmb", "slmb", "qi"].includes(mspScreen.tier)) {
      const tierName = mspScreen.tier.toUpperCase();
      dual.push({
        id: "dual-msp-federal-screen",
        label: "A Medicare Savings Program path is worth checking",
        title: `Income is within the 2026 federal ${tierName} screening amount entered for this application unit`,
        why: [
          `The converted monthly income is about $${Math.round(mspScreen.monthlyIncome ?? 0).toLocaleString()}.`,
          `The 2026 federal ${tierName} monthly income screen used here is $${mspScreen.monthlyLimit?.toLocaleString()}; states may use more generous rules or count income differently.`,
        ],
        verify: ["Apply through the state; the state decides the program and must also review resources and other rules.", "Ask about full Medicaid, QMB, SLMB, QI, Extra Help, and dual-eligible coverage options."],
        sourceIds: [OFFICIAL_ELIGIBILITY_SOURCES.medicareSavingsPrograms.id, OFFICIAL_ELIGIBILITY_SOURCES.medicaidStateContacts.id],
      });
    } else {
      dual.push({
        id: "dual-msp-state-screen",
        label: "A dual-eligibility or Medicare Savings Program path may still be worth checking",
        title: "The state must perform the final cost-assistance screen",
        why: [
          mspScreen.tier === "above-federal-screen"
            ? "The income entered is above the federal QI screening amount used here, but states may use higher limits or different counting rules."
            : "The tool could not apply a federal MSP income screen because income or application-unit information was incomplete.",
          "Full Medicaid and Medicare Savings Programs are related but not identical pathways.",
        ],
        verify: ["Ask the state to screen QMB, SLMB, QI, full Medicaid, and any state-specific medically needy pathway.", "Confirm resource limits and which income exclusions apply."],
        sourceIds: [OFFICIAL_ELIGIBILITY_SOURCES.medicareSavingsPrograms.id, OFFICIAL_ELIGIBILITY_SOURCES.medicaidStateContacts.id],
        emphasis: "caution",
      });
    }
  }

  const incomplete = !answers.state || (answers.age === null && !answers.ageNotSure) || !answers.alreadyMedicare;

  const documents = unique([
    "Government-issued identification and Social Security number, if requested by the official agency",
    "Proof of state residence and current address",
    "Recent pay stubs, benefit letters, pension statements, and other household income records",
    "Medicare card and Social Security notices, if Medicare or SSDI is involved",
    ...(answers.condition === "als" || answers.condition === "esrd" ? ["Relevant diagnosis, dialysis, transplant, or specialist documentation"] : []),
    ...(answers.pregnancy === "yes" ? ["Pregnancy verification or expected delivery information if the state requests it"] : []),
    ...(answers.childrenInHousehold === "yes" ? ["Birth dates, identity, relationship, and current coverage information for children"] : []),
    ...(answers.disability === "yes" ? ["Disability award letters and medical documentation requested by the state"] : []),
    ...(answers.longTermCare === "yes" ? ["Bank, retirement, property, transfer, insurance, and facility records requested for long-term-care Medicaid", "Care assessments describing help needed with daily activities"] : []),
    ...(dual.length > 0 ? ["Bank and resource statements requested for Medicare Savings Program screening"] : []),
  ]);

  const whatCouldChange = unique([
    "The state of residence and the Medicaid program category being reviewed",
    "The exact age and Medicare enrollment effective date",
    "The first month of SSDI entitlement and whether prior disability months count",
    "Whether ALS or end-stage renal disease rules apply",
    "Household composition, tax relationships, pregnancy, and the ages of children",
    "How the state counts income, deductions, assets, resources, and medical expenses",
    "Disability findings, functional-care needs, and whether long-term services and supports are requested",
    "Citizenship, qualified immigration status, residency, work history, and enrollment timing",
    "Annual rule changes and state policy changes after the last-reviewed date",
  ]);

  const nextSteps = unique([
    state ? `Open ${state.agencyName} and request a complete eligibility screening.` : "Select a state, then use the official state Medicaid agency directory.",
    "Use Medicare.gov for Medicare timing and coverage questions.",
    ...(answers.ssdi === "yes" || answers.condition === "als" || answers.condition === "esrd" ? ["Use SSA.gov to verify disability benefit entitlement and Medicare effective dates."] : []),
    ...(answers.longTermCare === "yes" ? ["Request a separate long-term services and supports or nursing-facility Medicaid assessment."] : []),
    ...(dual.length > 0 ? ["Ask the state to screen Medicare Savings Programs and full Medicaid separately."] : []),
    "Save the confirmation number, date, documents submitted, and name of any representative who helps you.",
  ]);

  const officialLinks: OfficialLink[] = [
    { label: "Medicare.gov", url: "https://www.medicare.gov/", description: "Official Medicare eligibility, enrollment, coverage, and contact information." },
    { label: "SSA.gov Medicare", url: "https://www.ssa.gov/medicare", description: "Official Social Security Medicare enrollment and disability-benefit information." },
    { label: "Medicaid.gov", url: "https://www.medicaid.gov/", description: "Official federal Medicaid policy and state contact directory." },
    ...(state ? [{ label: state.agencyName, url: state.officialUrl, description: `Official ${state.name} Medicaid agency or program website.` }] : []),
  ];

  const sourceById = Object.values(OFFICIAL_ELIGIBILITY_SOURCES).reduce<Record<string, OfficialSource>>((map, source) => {
    map[source.id] = source;
    return map;
  }, {});

  return {
    medicare,
    medicaid,
    dual,
    whatCouldChange,
    documents,
    nextSteps,
    officialLinks,
    sources: Array.from(sourceIds).map((id) => sourceById[id]).filter(Boolean),
    stateName: state?.name,
    incomplete,
  };
};

export const flattenScreeningResultText = (result: EligibilityScreeningResult) => [
  ...result.medicare.flatMap((card) => [card.label, card.title, ...card.why, ...card.verify]),
  ...result.medicaid.flatMap((card) => [card.label, card.title, ...card.why, ...card.verify]),
  ...result.dual.flatMap((card) => [card.label, card.title, ...card.why, ...card.verify]),
  ...result.whatCouldChange,
  ...result.documents,
  ...result.nextSteps,
].join("\n");
