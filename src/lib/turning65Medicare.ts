export type CoverageSource = "active-employer" | "marketplace" | "cobra" | "retiree" | "medicaid" | "va-tricare" | "none" | "other" | "unknown";
export type YesNoUnknown = "yes" | "no" | "unknown";
export type EmployerSize = "20-plus" | "under-20" | "unknown" | "not-applicable";
export type MedicarePreference = "original" | "advantage" | "undecided";
export type DrugCoverage = "creditable" | "not-creditable" | "unknown" | "none";

export type Turning65Answers = {
  birthMonth: number | null;
  birthYear: number | null;
  alreadyEnrolled: YesNoUnknown;
  coverageSource: CoverageSource;
  activeEmployment: YesNoUnknown;
  employerSize: EmployerSize;
  employmentEndingSoon: YesNoUnknown;
  hsaContributing: YesNoUnknown;
  spouseCoverageConcern: YesNoUnknown;
  drugCoverage: DrugCoverage;
  preference: MedicarePreference;
  limitedIncomeHelp: YesNoUnknown;
  stateCode: string;
};

export type TimelineItem = { timing: string; action: string; urgency: "now" | "soon" | "later" };
export type Turning65Plan = {
  headline: string;
  immediateAnswer: string;
  timeline: TimelineItem[];
  doNow: string[];
  canWait: string[];
  documents: string[];
  employerQuestions: string[];
  warnings: string[];
  officialActions: string[];
};

const monthName = (month: number) => new Intl.DateTimeFormat("en-US", { month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2026, month - 1, 1)));
const isoMonth = (date: Date) => `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
const addMonths = (date: Date, amount: number) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + amount, 1));

export const getInitialEnrollmentWindow = (birthMonth: number | null, birthYear: number | null) => {
  if (!birthMonth || !birthYear || birthMonth < 1 || birthMonth > 12 || birthYear < 1900 || birthYear > 2100) return null;
  const eligibilityMonth = new Date(Date.UTC(birthYear + 65, birthMonth - 1, 1));
  return {
    eligibilityMonth: isoMonth(eligibilityMonth),
    starts: isoMonth(addMonths(eligibilityMonth, -3)),
    ends: isoMonth(addMonths(eligibilityMonth, 3)),
    label: `${monthName(addMonths(eligibilityMonth, -3).getUTCMonth() + 1)} ${addMonths(eligibilityMonth, -3).getUTCFullYear()} through ${monthName(addMonths(eligibilityMonth, 3).getUTCMonth() + 1)} ${addMonths(eligibilityMonth, 3).getUTCFullYear()}`,
  };
};

export const buildTurning65Plan = (answers: Turning65Answers): Turning65Plan => {
  const iep = getInitialEnrollmentWindow(answers.birthMonth, answers.birthYear);
  const doNow = [
    "Confirm whether enrollment will be automatic or requires an application through Social Security.",
    "List current doctors, hospitals, pharmacies, prescriptions, and preferred post-acute providers before comparing coverage structures.",
    "Save current employer, retiree, COBRA, Marketplace, Medicaid, VA, or TRICARE coverage documents and the prescription-drug creditable-coverage notice.",
  ];
  const canWait = [
    "Do not select a Medicare Advantage, Part D, or Medigap policy until provider, drug, total-cost, and enrollment-timing questions are verified.",
    "Do not cancel current coverage until the replacement effective date and dependent consequences are confirmed in writing.",
  ];
  const documents = [
    "Social Security account information and any Medicare enrollment notice",
    "Current insurance card and Summary Plan Description or retiree coverage document",
    "Employer letter or form confirming active-employment coverage when applicable",
    "Annual creditable prescription-drug coverage notice",
    "Medication list, pharmacy list, physician list, and hospital preferences",
    "Most recent tax return or SSA premium notice if IRMAA may be relevant",
  ];
  const employerQuestions = [
    "Is this coverage based on current active employment, and when will it end?",
    "Does the plan require enrollment in Part A, Part B, or both at age 65?",
    "How many employees are counted for Medicare coordination purposes?",
    "Is prescription coverage creditable for Part D, and where is that stated in writing?",
    "What happens to spouse or dependent coverage when the employee enrolls in Medicare?",
    "Is retiree coverage available, and could joining an outside Medicare plan cause it to be lost?",
  ];
  const warnings: string[] = [];
  const officialActions = [
    "Use Medicare.gov's sign-up timing questions for the exact coverage situation.",
    "Use Social Security for Part A and Part B enrollment actions and required forms.",
    "Use Medicare Plan Finder only after the enrollment timeline and coverage structure are clear.",
    "Use SHIP for free, plan-neutral counseling and state-specific Medigap questions.",
  ];
  const timeline: TimelineItem[] = [];

  if (iep) timeline.push({ timing: `Initial Enrollment Period: ${iep.label}`, action: "Verify the sign-up month, desired coverage effective date, and whether active-employment rules change the ordinary timeline.", urgency: "now" });
  else timeline.push({ timing: "Before the 65th birthday month", action: "Use Medicare.gov or Social Security to identify the exact Initial Enrollment Period dates.", urgency: "now" });

  let headline = "Verify the enrollment timeline before choosing a plan.";
  let immediateAnswer = "Most people first become eligible for Medicare around age 65, but the correct action depends on current coverage, active employment, employer size, HSA contributions, and whether drug coverage is creditable.";

  if (answers.alreadyEnrolled === "yes") {
    headline = "Confirm what is already active before adding or changing coverage.";
    immediateAnswer = "Because Medicare enrollment may already be active, first verify Parts A and B effective dates, current drug coverage, and whether any employer or retiree plan coordinates with Medicare.";
  } else if (answers.coverageSource === "active-employer" && answers.activeEmployment === "yes") {
    if (answers.employerSize === "20-plus") {
      headline = "Active employer coverage may allow Part B to be delayed, but the employer plan must confirm it.";
      immediateAnswer = "Medicare.gov indicates that some people covered through current active employment can wait to enroll in Part B without a late penalty. Do not assume that applies: confirm the employer's Medicare coordination rules, coverage end date, and required forms.";
      timeline.push({ timing: "Before employment or active coverage ends", action: "Plan the Part B application and employer-coverage verification so Medicare can start without a gap.", urgency: "soon" });
    } else if (answers.employerSize === "under-20") {
      headline = "The employer plan may expect Medicare to pay first.";
      immediateAnswer = "Medicare.gov warns that job-based coverage from an employer with fewer than 20 employees might not pay correctly without Parts A and B. Confirm the plan's written coordination rule immediately.";
      warnings.push("For an employer with fewer than 20 employees, do not rely on the employer card alone; ask the benefits administrator whether Part A and Part B are required for the plan to remain primary or secondary correctly.");
    } else warnings.push("Employer size and Medicare coordination are unresolved. Ask the benefits administrator before deciding whether to delay Part B.");
  } else if (["cobra", "retiree", "marketplace", "none", "unknown"].includes(answers.coverageSource)) {
    headline = "Do not assume this coverage protects a delayed Medicare enrollment.";
    immediateAnswer = "COBRA, retiree coverage, Marketplace coverage, no coverage, and uncertain coverage do not automatically create the same enrollment protection as insurance based on current active employment. Use Medicare.gov's official timing tool now.";
    warnings.push("The eight-month Part B Special Enrollment Period is tied to current employment or the end of that employment-based coverage; COBRA does not extend the employment clock.");
  }

  if (answers.employmentEndingSoon === "yes") timeline.push({ timing: "About one month before active employer coverage ends", action: "Submit the needed Medicare forms early enough to reduce the risk of a coverage gap.", urgency: "now" });

  if (answers.hsaContributing === "yes") {
    warnings.push("HSA contributions require special timing. Medicare.gov advises the employee and employer to stop HSA contributions six months before retirement or applying for Social Security or Railroad Retirement benefits. Verify the tax timing before applying.");
    doNow.push("Ask payroll to identify both employee and employer HSA contribution dates, then verify the stop date with Medicare.gov, Social Security, and a qualified tax professional when necessary.");
  }

  if (answers.drugCoverage === "unknown" || answers.drugCoverage === "none" || answers.drugCoverage === "not-creditable") {
    warnings.push("Part D timing is unresolved. Medicare.gov states that going more than 63 days without creditable drug coverage can create a late-enrollment penalty.");
    doNow.push("Request the written creditable-coverage notice from the current plan and keep it with enrollment records.");
  }

  if (answers.preference === "original") {
    warnings.push("The federal Medigap Open Enrollment Period generally starts the first month a person is 65 or older and enrolled in Part B and lasts six months. State rights can add protections; timing should be checked before delaying Part B or changing coverage.");
    officialActions.push("Compare Medigap timing and state protections before relying on a future ability to buy a policy.");
  }

  if (answers.spouseCoverageConcern === "yes") doNow.push("Get written confirmation of what happens to spouse or dependent coverage when Medicare starts or active employment ends.");
  if (answers.limitedIncomeHelp === "yes" || answers.limitedIncomeHelp === "unknown") officialActions.push("Check the state Medicaid agency, Medicare Savings Programs, and Extra Help; the state makes the official determination.");

  warnings.push("IRMAA can increase Part B and Part D premiums for some households based on tax information. Use the Social Security notice and official appeal process for a qualifying life-changing event; this tool does not calculate IRMAA.");
  timeline.push({ timing: "After Parts A and B timing is settled", action: "Choose between Original Medicare and Medicare Advantage, then verify doctors, hospitals, prescriptions, total annual cost, travel, prior authorization, and post-acute providers.", urgency: "later" });
  timeline.push({ timing: "Before canceling existing coverage", action: "Confirm the Medicare effective date and consequences for retiree, spouse, dependent, HSA, and drug coverage.", urgency: "soon" });

  return { headline, immediateAnswer, timeline, doNow, canWait, documents, employerQuestions, warnings, officialActions };
};
