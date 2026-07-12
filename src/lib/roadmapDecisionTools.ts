import { getStateMedicaidLink, type StateCode } from "@/data/medicareMedicaidEligibilityData";

export type UnknownChoice = "yes" | "no" | "not-sure";

export type DecisionResult = {
  direction: string;
  summary: string;
  reasons: string[];
  doNow: string[];
  verify: string[];
  learnLater: string[];
  cautions: string[];
};

const unique = (items: string[]) => [...new Set(items)];

export type MedicaidRoutingNeed =
  | "health-coverage"
  | "nursing-facility"
  | "home-community"
  | "medicare-cost-help"
  | "caregiver-planning"
  | "not-sure";

export type MedicaidRoutingAnswers = {
  state: StateCode | "";
  need: MedicaidRoutingNeed;
  medicare: UnknownChoice;
  longTermNeed: UnknownChoice;
  settingPreference: "home" | "facility" | "either" | "not-sure";
};

export const DEFAULT_MEDICAID_ROUTING_ANSWERS: MedicaidRoutingAnswers = {
  state: "",
  need: "not-sure",
  medicare: "not-sure",
  longTermNeed: "not-sure",
  settingPreference: "not-sure",
};

export const buildMedicaidRoutingResult = (answers: MedicaidRoutingAnswers): DecisionResult & {
  stateName?: string;
  agencyName?: string;
  officialUrl?: string;
} => {
  const state = getStateMedicaidLink(answers.state);
  const reasons: string[] = [];
  const doNow: string[] = [];
  const verify: string[] = [];
  const learnLater: string[] = [];
  const cautions: string[] = [];

  if (state) {
    reasons.push(`${state.name} administers its own Medicaid program and makes the official eligibility and coverage decisions.`);
    doNow.push(`Open ${state.agencyName} and locate the application, eligibility, or long-term services section that matches the need.`);
  } else {
    doNow.push("Choose a state before relying on any program pathway because Medicaid rules, names, applications, and available services are state specific.");
  }

  if (answers.need === "health-coverage") {
    reasons.push("The primary question is ordinary health-coverage Medicaid or CHIP rather than long-term-care financing.");
    verify.push("Ask the state to screen every applicable coverage category, including adult, child, pregnancy, disability, or older-adult pathways when relevant.");
  } else if (answers.need === "nursing-facility") {
    reasons.push("Nursing-facility Medicaid uses a different review from ordinary health-coverage Medicaid and may consider medical need, income, resources, transfers, and spousal protections.");
    doNow.push("Ask the state agency for the nursing-facility Medicaid application and the exact financial and clinical documentation list.");
    verify.push("Ask whether a pre-admission screening, level-of-care assessment, transfer review, or spouse-at-home protection applies.");
  } else if (answers.need === "home-community") {
    reasons.push("Home- and community-based services may use waiver or state-plan programs with separate eligibility rules, service limits, and waiting lists.");
    doNow.push("Ask for the state office or aging/disability agency that handles home- and community-based services and waiver intake.");
    verify.push("Ask whether the program has a waiting list, functional assessment, participant direction, caregiver support, or limits on covered hours.");
  } else if (answers.need === "medicare-cost-help") {
    reasons.push("A person with Medicare may need a Medicare Savings Program, Extra Help, full Medicaid, or more than one program.");
    doNow.push("Ask the state Medicaid agency to screen for QMB, SLMB, QI, and full Medicaid rather than asking about only one program name.");
    verify.push("Confirm whether the state uses income or resource rules more generous than the federal screening amounts.");
  } else if (answers.need === "caregiver-planning") {
    reasons.push("Caregiver planning may involve Medicaid, aging and disability services, respite, home care, transportation, and benefits counseling rather than one eligibility test.");
    doNow.push("Contact the state Medicaid agency and the state or local aging/disability network for a coordinated screening.");
  } else {
    reasons.push("The controlling program category is still uncertain, so the safest first step is a broad state screening rather than a guessed eligibility calculation.");
    verify.push("Ask the state to distinguish ordinary coverage, Medicare cost assistance, nursing-facility Medicaid, and home/community services.");
  }

  if (answers.medicare === "yes") {
    reasons.push("Medicare is already involved, so Medicaid cost assistance and dual-eligibility pathways should be reviewed separately from ordinary Medicaid coverage.");
    verify.push("Confirm active Medicare parts, effective dates, and whether the state can screen for Medicare Savings Programs and Extra Help.");
  } else if (answers.medicare === "not-sure") {
    verify.push("Confirm whether Medicare Part A, Part B, or a Medicare plan is active before interpreting a Medicaid cost-assistance result.");
  }

  if (answers.longTermNeed === "yes") {
    reasons.push("A reported long-term support need makes functional eligibility and care setting as important as financial eligibility.");
    verify.push("Ask who performs the functional or level-of-care assessment and what records are accepted.");
  } else if (answers.longTermNeed === "not-sure") {
    verify.push("Ask whether the person needs ongoing help with daily activities, supervision, or skilled care and which agency performs that assessment.");
  }

  if (answers.settingPreference === "home") {
    learnLater.push("Compare home- and community-based services, personal care, respite, and caregiver-support programs with institutional options.");
  } else if (answers.settingPreference === "facility") {
    learnLater.push("Compare nursing-facility Medicaid, facility participation, resident responsibility, and discharge or transfer planning.");
  } else if (answers.settingPreference === "either") {
    learnLater.push("Ask the state to compare home/community and facility pathways without assuming one setting is available or covered.");
  }

  verify.push(
    "Request the current written eligibility rules, application instructions, covered-services description, and appeal notice from the official agency.",
    "Ask whether estate recovery, transfer rules, spousal protections, or a waiting list could apply before moving assets or signing a care contract.",
  );
  cautions.push(
    "This router does not determine Medicaid, Medicare Savings Program, Extra Help, waiver, nursing-facility, or home-care eligibility.",
    "Do not transfer assets, change ownership, or sign a long-term-care agreement based only on this educational result.",
  );

  return {
    direction: state ? `Start with ${state.agencyName}` : "Choose the controlling state agency first",
    summary: state
      ? `The result identifies the program category and official ${state.name} starting point worth investigating; the state must apply current financial, functional, residency, and program rules.`
      : "Medicaid cannot be routed reliably without the state of residence because program names, rules, agencies, and applications differ.",
    reasons: unique(reasons),
    doNow: unique(doNow),
    verify: unique(verify),
    learnLater: unique(learnLater),
    cautions: unique(cautions),
    stateName: state?.name,
    agencyName: state?.agencyName,
    officialUrl: state?.officialUrl,
  };
};

export type ChildcareAnswers = {
  filingStatus: "single-joint-head" | "married-separate" | "not-sure";
  workStatus: "both-working" | "student-or-disabled-spouse" | "one-not-working" | "not-sure";
  employerFsa: UnknownChoice;
  predictableExpenses: UnknownChoice;
  expenseBand: "under-3000" | "3000-6000" | "6000-7500" | "over-7500" | "not-sure";
  otherEmployerHelp: UnknownChoice;
  midyearChangeLikely: UnknownChoice;
};

export const DEFAULT_CHILDCARE_ANSWERS: ChildcareAnswers = {
  filingStatus: "not-sure",
  workStatus: "not-sure",
  employerFsa: "not-sure",
  predictableExpenses: "not-sure",
  expenseBand: "not-sure",
  otherEmployerHelp: "not-sure",
  midyearChangeLikely: "not-sure",
};

export const buildChildcareResult = (answers: ChildcareAnswers): DecisionResult => {
  let support = 0;
  let caution = 0;
  const reasons: string[] = [];
  const doNow: string[] = [];
  const verify: string[] = [];
  const learnLater: string[] = [];

  if (answers.employerFsa === "yes") {
    support += 2;
    reasons.push("A Dependent Care FSA is available through the employer, so a pre-tax election can be evaluated.");
  } else if (answers.employerFsa === "no") {
    caution += 2;
    reasons.push("No employer Dependent Care FSA was reported, so the decision should focus on other employer help and the federal credit rules.");
  } else {
    verify.push("Ask HR whether a Dependent Care FSA is offered, the plan-year maximum, enrollment deadline, claim deadline, and forfeiture rules.");
  }

  if (answers.predictableExpenses === "yes") {
    support += 2;
    reasons.push("Predictable work-related care expenses reduce the risk of electing more than can be reimbursed.");
  } else if (answers.predictableExpenses === "no") {
    caution += 2;
    reasons.push("Uncertain care spending increases use-it-or-lose-it risk and favors a conservative election.");
  } else {
    caution += 1;
    verify.push("Estimate only care expenses that are likely to occur during the plan year and can be documented under the employer plan.");
  }

  if (answers.workStatus === "both-working") {
    support += 1;
    reasons.push("The care appears connected to work for both spouses or for the filing individual, which is a core federal coordination question.");
  } else if (answers.workStatus === "student-or-disabled-spouse") {
    verify.push("Review the special earned-income rules for a full-time student spouse or a spouse not able to care for themselves.");
  } else if (answers.workStatus === "one-not-working") {
    caution += 2;
    reasons.push("A nonworking spouse can limit federal dependent-care tax benefits unless a specific exception applies.");
  } else {
    verify.push("Confirm whether the care is needed so the filer and spouse, when applicable, can work or look for work.");
  }

  if (answers.filingStatus === "married-separate") {
    caution += 2;
    reasons.push("Married-filing-separately rules are more restrictive and the 2026 federal dependent-care assistance exclusion is generally lower than the standard household limit.");
    verify.push("Confirm whether an exception to the joint-return rule applies before making an election.");
  } else if (answers.filingStatus === "not-sure") {
    verify.push("Confirm the expected filing status because it affects the federal exclusion and credit coordination.");
  }

  if (answers.expenseBand === "over-7500") {
    reasons.push("Expected care spending exceeds the 2026 federal dependent-care assistance exclusion ceiling, so some expenses may remain outside the FSA election.");
    learnLater.push("Review whether remaining qualified expenses may be considered under the Child and Dependent Care Credit after employer benefits are accounted for.");
  } else if (answers.expenseBand === "6000-7500") {
    support += 1;
    reasons.push("The expected expense band is near the 2026 federal maximum, but the employer plan may set a lower limit.");
  } else if (answers.expenseBand === "under-3000") {
    caution += 1;
    reasons.push("Lower expected expenses make over-election and forfeiture more important than maximizing the statutory limit.");
  }

  if (answers.otherEmployerHelp === "yes") {
    verify.push("Ask how employer subsidies, backup care, on-site care, or direct reimbursements coordinate with the Dependent Care FSA and tax reporting.");
  }
  if (answers.midyearChangeLikely === "yes") {
    caution += 1;
    verify.push("Ask which qualifying events permit a midyear election change and what documentation or timing the plan requires.");
  }

  doNow.push(
    "Request the employer's Dependent Care FSA summary, 2026 election limit, eligible-expense rules, reimbursement process, and claim deadline.",
    "Estimate predictable work-related care expenses conservatively and subtract any employer-paid or reimbursed care before choosing an election.",
  );
  verify.push(
    "Use Form 2441 and current IRS instructions to coordinate employer dependent-care benefits with any Child and Dependent Care Credit.",
    "Confirm provider-identification, earned-income, filing-status, qualifying-person, and work-related-expense requirements before treating an expense as tax eligible.",
  );

  const direction = support >= caution + 2
    ? "Dependent Care FSA factors appear stronger"
    : caution >= support + 2
      ? "Use a conservative election or verify alternatives first"
      : "A partial election may reduce uncertainty";

  return {
    direction,
    summary: "For 2026, federal law increased the dependent-care assistance exclusion ceiling to $7,500 for most eligible households and $3,750 for married filing separately, but the employer plan can offer less and tax-credit coordination still depends on the final IRS rules and household facts.",
    reasons: unique(reasons),
    doNow: unique(doNow),
    verify: unique(verify),
    learnLater: unique(learnLater),
    cautions: [
      "This result is educational and does not determine tax eligibility, exact savings, filing status, or whether a specific expense is reimbursable.",
      "Unused elections may be forfeited under the employer plan, so do not elect the statutory maximum solely because it is available.",
    ],
  };
};

export type RothTraditionalAnswers = {
  currentRate: "low" | "middle" | "high" | "not-sure";
  futureRate: "lower" | "similar" | "higher" | "not-sure";
  yearsToRetirement: "under-10" | "10-25" | "over-25" | "not-sure";
  cashFlow: "tight" | "comfortable" | "not-sure";
  pension: UnknownChoice;
  currentMix: "mostly-pretax" | "balanced" | "mostly-roth" | "not-sure";
  earlyRetirement: UnknownChoice;
  confidence: "high" | "low" | "not-sure";
};

export const DEFAULT_ROTH_TRADITIONAL_ANSWERS: RothTraditionalAnswers = {
  currentRate: "not-sure",
  futureRate: "not-sure",
  yearsToRetirement: "not-sure",
  cashFlow: "not-sure",
  pension: "not-sure",
  currentMix: "not-sure",
  earlyRetirement: "not-sure",
  confidence: "not-sure",
};

export const buildRothTraditionalResult = (answers: RothTraditionalAnswers): DecisionResult => {
  let roth = 0;
  let traditional = 0;
  let uncertainty = 0;
  const reasons: string[] = [];
  const verify: string[] = [];

  if (answers.currentRate === "low") { roth += 2; reasons.push("A lower current marginal tax-rate band can make paying tax now relatively more attractive."); }
  if (answers.currentRate === "high") { traditional += 2; reasons.push("A higher current marginal tax-rate band can make a current-year deduction more valuable."); }
  if (answers.currentRate === "not-sure") { uncertainty += 1; verify.push("Identify the marginal federal and state tax-rate bands that apply to the next contribution dollar."); }

  if (answers.futureRate === "higher") { roth += 2; reasons.push("Expecting a higher future tax rate is a factor favoring Roth contributions, though future tax law is uncertain."); }
  if (answers.futureRate === "lower") { traditional += 2; reasons.push("Expecting a lower future tax rate is a factor favoring traditional contributions, though retirement income and future law may differ."); }
  if (answers.futureRate === "not-sure") uncertainty += 2;

  if (answers.yearsToRetirement === "over-25") { roth += 1; reasons.push("A long time horizon increases the period during which qualified Roth growth may compound tax free."); }
  if (answers.yearsToRetirement === "under-10") { traditional += 1; reasons.push("A shorter horizon can make the current deduction and retirement withdrawal plan more important than distant compounding assumptions."); }

  if (answers.cashFlow === "tight") { traditional += 2; reasons.push("Tight current cash flow makes the immediate tax deduction more useful, provided the contribution amount remains sustainable."); }
  if (answers.cashFlow === "comfortable") roth += 1;

  if (answers.pension === "yes") { roth += 1; reasons.push("Expected pension income may fill lower retirement tax brackets and increase the value of tax diversification."); }
  if (answers.currentMix === "mostly-pretax") { roth += 2; reasons.push("A portfolio already concentrated in pre-tax accounts may benefit from additional tax diversification."); }
  if (answers.currentMix === "mostly-roth") { traditional += 2; reasons.push("A portfolio already concentrated in Roth accounts may benefit from additional current deductions and tax diversification."); }

  if (answers.earlyRetirement === "yes") {
    traditional += 1;
    roth += 1;
    reasons.push("Early-retirement planning can use both pre-tax conversion opportunities and Roth contribution basis, so account access strategy matters alongside tax rate.");
  }
  if (answers.confidence === "low" || answers.confidence === "not-sure") uncertainty += 2;

  const difference = roth - traditional;
  const direction = uncertainty >= 4 || Math.abs(difference) <= 1
    ? "A split may reduce uncertainty"
    : difference >= 2
      ? "Roth factors currently appear stronger"
      : "Traditional factors currently appear stronger";

  return {
    direction,
    summary: "Contribution type and contribution amount are separate decisions. This comparison weighs current deduction value, possible future tax rates, existing account mix, cash flow, pension income, and retirement-access planning without assuming a universal winner.",
    reasons: unique(reasons.length ? reasons : ["The current answers do not create a strong directional advantage for either tax treatment."]),
    doNow: [
      "Capture the full employer match and choose a sustainable total contribution amount before optimizing the tax label.",
      "Compare a full Roth, full traditional, and split election using the same contribution amount.",
    ],
    verify: unique([
      ...verify,
      "Confirm whether the plan offers Roth contributions, how employer contributions are taxed, and whether in-plan conversions or rollovers are available.",
      "Review current IRS contribution limits and the plan's payroll election rules for the effective tax year.",
    ]),
    learnLater: [
      "Review required minimum distributions, Roth conversion windows, Social Security taxation, Medicare IRMAA, and state-tax treatment as the retirement plan develops.",
    ],
    cautions: [
      "This tool does not provide individualized tax or investment advice and cannot predict future tax law or retirement income.",
      "Do not reduce a valuable employer match or create unsustainable cash flow solely to pursue one tax treatment.",
    ],
  };
};

export type ObservationAnswers = {
  coverage: "original-medicare" | "medicare-advantage" | "commercial" | "other" | "not-sure";
  reportedStatus: "inpatient" | "observation" | "outpatient" | "not-confirmed";
  writtenNotice: "received" | "not-received" | "not-applicable" | "not-sure";
  dischargeSoon: UnknownChoice;
  skilledFacility: UnknownChoice;
  activeDeadline: UnknownChoice;
};

export const DEFAULT_OBSERVATION_ANSWERS: ObservationAnswers = {
  coverage: "not-sure",
  reportedStatus: "not-confirmed",
  writtenNotice: "not-sure",
  dischargeSoon: "not-sure",
  skilledFacility: "not-sure",
  activeDeadline: "not-sure",
};

export const buildObservationResult = (answers: ObservationAnswers): DecisionResult => {
  const reasons: string[] = [];
  const doNow: string[] = [];
  const verify: string[] = [];

  if (answers.reportedStatus === "not-confirmed") {
    doNow.push("Ask the hospital to state the current order in writing: inpatient admission, observation, or another outpatient status.");
    reasons.push("A bed location, hospital wristband, or overnight stay does not by itself establish inpatient admission status.");
  } else {
    reasons.push(`The reported status is ${answers.reportedStatus.replace("-", " ")}, but the written order and payer processing control.`);
    verify.push("Ask when the status began, whether it changed, and which physician or utilization-review decision supports the current order.");
  }

  if (answers.coverage === "original-medicare") {
    reasons.push("Original Medicare treats inpatient and outpatient hospital services under different benefit structures, and observation time generally does not count as inpatient time for the traditional skilled-nursing-facility qualifying-stay rule.");
    if (answers.writtenNotice !== "received") {
      doNow.push("Ask whether the Medicare Outpatient Observation Notice (MOON) is required and request a copy when applicable.");
    }
  } else if (answers.coverage === "medicare-advantage") {
    verify.push("Ask the plan how it classifies the stay, what prior-authorization or network rules apply, and whether it waives any traditional skilled-nursing qualifying-stay requirement.");
  } else if (answers.coverage === "commercial") {
    verify.push("Ask the insurer how inpatient, observation, and outpatient hospital services apply to the deductible, copays, coinsurance, authorization, and post-acute benefits.");
  } else {
    verify.push("Confirm the payer and the benefit document that controls hospital and post-acute coverage.");
  }

  if (answers.skilledFacility === "yes") {
    doNow.push("Tell case management that skilled nursing or rehabilitation is being considered and ask exactly which hospital days the payer will count.");
    verify.push("Confirm facility participation, authorization, clinical eligibility, qualifying-stay rules, transportation, and the backup plan if coverage is denied.");
  }
  if (answers.dischargeSoon === "yes") {
    doNow.push("Request the written status, discharge plan, payer verification, and post-acute options before leaving the hospital when possible.");
  }
  if (answers.activeDeadline === "yes") {
    doNow.unshift("Act on the written deadline now: call the number on the notice and ask which expedited review or appeal process applies.");
  } else if (answers.activeDeadline === "not-sure") {
    verify.push("Review every written notice for an appeal, review, discharge, or payment deadline and record the exact date and time.");
  }

  return {
    direction: answers.activeDeadline === "yes"
      ? "Verify status and the active deadline immediately"
      : answers.reportedStatus === "not-confirmed"
        ? "Get the written hospital status before planning the next setting"
        : "Use the written status to verify coverage and discharge consequences",
    summary: "The tool organizes status, notice, coverage, and discharge questions. It cannot determine the official hospital order, medical necessity, coverage, appeal rights, or amount owed.",
    reasons: unique(reasons),
    doNow: unique(doNow),
    verify: unique([
      ...verify,
      "Ask hospital case management or utilization review for the current status, written notice, and payer-contact pathway.",
      "Keep copies of notices, discharge documents, call references, and the Medicare Summary Notice or insurer EOB when issued.",
    ]),
    learnLater: [
      "Review how hospital status can affect Part A versus Part B cost sharing, post-acute planning, and the questions to ask a skilled nursing facility.",
    ],
    cautions: [
      "Do not delay medically necessary care or leave the hospital solely because of a financial estimate from this guide.",
      "An appeal or discharge deadline may be short; use the controlling notice and official payer instructions.",
    ],
  };
};

export type DebtRetirementAnswers = {
  match: "below" | "full" | "none" | "not-sure";
  emergency: "none" | "under-one" | "one-three" | "three-plus" | "not-sure";
  debt: "high-interest" | "private-student" | "federal-student" | "other" | "none" | "multiple" | "not-sure";
  pslf: UnknownChoice;
  cashFlow: "stressed" | "stable" | "not-sure";
};

export const DEFAULT_DEBT_RETIREMENT_ANSWERS: DebtRetirementAnswers = {
  match: "not-sure",
  emergency: "not-sure",
  debt: "not-sure",
  pslf: "not-sure",
  cashFlow: "not-sure",
};

export const buildDebtRetirementResult = (answers: DebtRetirementAnswers): DecisionResult => {
  const doNow: string[] = [];
  const reasons: string[] = [];
  const verify: string[] = [];

  if (answers.emergency === "none" || answers.emergency === "under-one") {
    doNow.push("Build or protect a starter cash reserve before committing every extra dollar to debt or long-term investing.");
    reasons.push("Very limited liquidity can turn routine expenses into new high-cost debt.");
  }
  if (answers.match === "below") {
    doNow.push("Verify the employer-match formula and consider contributing enough to capture the full match while maintaining required debt payments and basic liquidity.");
    reasons.push("The employer match is compensation, but vesting and contribution rules must be confirmed.");
  } else if (answers.match === "not-sure") {
    verify.push("Confirm the match formula, vesting schedule, eligible compensation, and contribution election in the official plan materials.");
  }

  if (answers.debt === "high-interest") {
    doNow.push("Prioritize a defined payoff plan for the high-cost debt after minimum payments, essential cash reserves, and any deliberately preserved employer match.");
    reasons.push("High borrowing costs can overwhelm expected investment returns, although no single interest-rate cutoff fits every household.");
  } else if (answers.debt === "federal-student") {
    reasons.push("Federal student loans require program analysis before accelerated payoff because forgiveness, income-driven repayment, and federal protections may be valuable.");
    verify.push("Confirm loan type, repayment plan, forgiveness progress, employer certification, and the consequences of consolidation or refinancing.");
  } else if (answers.debt === "private-student") {
    reasons.push("Private student loans are primarily a rate, term, cash-flow, and refinance decision because federal forgiveness protections generally do not apply.");
    verify.push("Check fixed versus variable rate, cosigner terms, refinance fees, and whether extra payments reduce principal.");
  } else if (answers.debt === "multiple") {
    doNow.push("Separate debts by required payment, rate structure, federal protections, collateral, tax treatment, and urgency before choosing one payoff order.");
  }

  if (answers.pslf === "yes") {
    reasons.push("Possible PSLF eligibility makes federal-loan verification more important than a simple interest-rate comparison.");
    verify.push("Submit or review employment certification and compare the official qualifying-payment count with personal records.");
  }
  if (answers.cashFlow === "stressed") {
    doNow.push("Reduce the plan to a sustainable minimum: required payments, essential expenses, a small reserve, and only the retirement contribution that remains affordable.");
  }

  const direction = answers.emergency === "none" || answers.emergency === "under-one"
    ? "Stabilize liquidity before optimizing"
    : answers.debt === "high-interest"
      ? "Use a match-aware high-cost debt payoff plan"
      : answers.debt === "federal-student" || answers.pslf === "yes"
        ? "Verify federal loan strategy before accelerating payoff"
        : "Balance debt reduction with retirement progress";

  return {
    direction,
    summary: "The result orders the decision around liquidity, required payments, employer compensation, debt protections, and sustainable retirement progress rather than using one universal rate cutoff.",
    reasons: unique(reasons.length ? reasons : ["No single factor currently dominates, so the plan should preserve flexibility while more details are verified."]),
    doNow: unique(doNow),
    verify: unique(verify),
    learnLater: ["Review tax effects, refinancing terms, retirement-account access, and the effect of extra payments only after the first priorities are stable."],
    cautions: [
      "This tool does not provide individualized investment, tax, credit, or student-loan advice.",
      "Do not refinance federal student loans without understanding the permanent loss of federal repayment and forgiveness protections.",
    ],
  };
};
