export const BENEFITS_REVIEW_STORAGE_KEY = "caf:benefits-change-review:v1";
export const BENEFITS_REVIEW_UPDATED_EVENT = "caf-benefits-change-review-updated";
export const BENEFITS_REVIEW_VERSION = 1;
export const BENEFITS_CHANGE_CANONICAL_PATH = "/tools/benefits-change-detector";

export const BENEFIT_CHANGE_STATES = [
  "increased",
  "decreased",
  "added",
  "removed",
  "unchanged",
  "changed_unclear",
  "not_reviewed",
  "not_offered",
  "not_sure",
] as const;

export type BenefitChangeState = (typeof BENEFIT_CHANGE_STATES)[number];
export type BenefitPriority = "review_first" | "verify_before_enrolling" | "lower_apparent_priority" | "still_incomplete";
export type BenefitDirection = "cost" | "coverage" | "employer_value" | "access";
export type BenefitGroup = "medical" | "retirement" | "protection" | "family_tax" | "employment_quality";

export type BenefitDefinition = {
  id: string;
  group: BenefitGroup;
  label: string;
  direction: BenefitDirection;
  question: string;
  document: string;
};
const benefit = (id: string, group: BenefitGroup, label: string, direction: BenefitDirection, question: string, document: string): BenefitDefinition => ({ id, group, label, direction, question, document });

export const BENEFIT_GROUP_LABELS: Record<BenefitGroup, string> = {
  medical: "Medical coverage",
  retirement: "Retirement",
  protection: "Protection benefits",
  family_tax: "Family and tax-advantaged benefits",
  employment_quality: "Employment and quality of life",
};

export const BENEFIT_TAXONOMY: BenefitDefinition[] = [
  benefit("employee_premium", "medical", "Employee premium", "cost", "What will the employee premium be for the exact coverage tier and pay frequency?", "Rate sheet and enrollment confirmation"),
  benefit("family_premium", "medical", "Spouse or family premium", "cost", "Did the spouse or family tier change, including any working-spouse surcharge?", "Rate sheet and eligibility rules"),
  benefit("deductible", "medical", "Deductible", "cost", "Is the deductible individual, embedded family, or aggregate family, and what services apply first?", "Summary of Benefits and Coverage (SBC)"),
  benefit("coinsurance", "medical", "Coinsurance", "cost", "Which services use coinsurance and is it based on the plan's allowed amount?", "SBC and plan document"),
  benefit("copays", "medical", "Copays", "cost", "Which visit, facility, urgent-care, emergency, and prescription copays changed?", "SBC and prescription benefit summary"),
  benefit("out_of_pocket_max", "medical", "Out-of-pocket maximum", "cost", "What counts toward the in-network maximum and is the family maximum embedded or aggregate?", "SBC and plan document"),
  benefit("network", "medical", "Provider network", "access", "Are current doctors, hospitals, laboratories, and facilities in the exact plan network for the new year?", "Provider directory and written plan confirmation"),
  benefit("out_of_network", "medical", "Out-of-network coverage", "coverage", "Does the plan cover non-emergency out-of-network care, and what balance-billing exposure remains?", "SBC and plan document"),
  benefit("hsa_hra_contribution", "medical", "Employer HSA or HRA contribution", "employer_value", "How much will the employer contribute, when is it deposited, and what conditions apply?", "Employer contribution notice and plan materials"),
  benefit("formulary", "medical", "Drug formulary", "coverage", "Are current prescriptions covered at the same tier, with the same quantity and specialty-pharmacy rules?", "Current formulary"),
  benefit("pharmacy_rules", "medical", "Pharmacy rules", "access", "Did preferred-pharmacy, mail-order, specialty-pharmacy, or refill rules change?", "Prescription benefit guide"),
  benefit("authorization_referral", "medical", "Authorization or referral requirements", "access", "Which services now require prior authorization, referrals, or step therapy?", "Plan document and utilization-management rules"),
  benefit("plan_options", "medical", "Available plan options", "coverage", "Was a plan added, removed, renamed, or moved to a different network?", "Enrollment guide and SBCs for every option"),
  benefit("employer_match", "retirement", "Employer match", "employer_value", "What is the exact match formula, eligible compensation, deposit timing, and true-up rule?", "Summary Plan Description (SPD) and match notice"),
  benefit("non_elective", "retirement", "Non-elective contribution", "employer_value", "Is an employer contribution made even when the employee does not contribute, and what eligibility rules apply?", "SPD and employer contribution notice"),
  benefit("vesting", "retirement", "Vesting", "access", "Did the vesting schedule or treatment of prior service change?", "SPD and vesting schedule"),
  benefit("roth_availability", "retirement", "Roth availability", "coverage", "Are Roth contributions available and does the plan permit in-plan conversion or Roth matching?", "SPD and plan amendment notice"),
  benefit("investment_fees", "retirement", "Investment menu or fees", "cost", "Were investment options removed, mapped, or repriced, and what deadlines apply?", "Participant fee disclosure and fund-change notice"),
  benefit("automatic_enrollment", "retirement", "Automatic enrollment or escalation", "access", "Will contributions start or increase automatically, and how can the election be changed?", "Automatic contribution notice"),
  benefit("short_term_disability", "protection", "Short-term disability", "coverage", "What earnings definition, waiting period, benefit percentage, maximum, and exclusions apply?", "Certificate of coverage"),
  benefit("long_term_disability", "protection", "Long-term disability", "coverage", "Did the elimination period, benefit percentage, maximum, or definition of disability change?", "Certificate of coverage"),
  benefit("life_insurance", "protection", "Life insurance", "coverage", "What employer-paid amount remains and does optional coverage require evidence of insurability?", "Life insurance certificate"),
  benefit("accidental_death", "protection", "Accidental-death coverage", "coverage", "What events, exclusions, and benefit reductions apply?", "AD&D certificate"),
  benefit("waiting_periods", "protection", "Waiting periods", "cost", "When does coverage begin and did any waiting or elimination period become longer?", "Eligibility guide and certificate"),
  benefit("employer_vs_employee_paid", "protection", "Employer-paid versus employee-paid coverage", "employer_value", "Which coverage remains employer-paid and what payroll deductions apply to optional coverage?", "Enrollment guide and rate sheet"),
  benefit("dependent_care_fsa", "family_tax", "Dependent Care FSA", "coverage", "What election limit, eligible-expense rules, claim deadline, and carryover or grace-period terms apply?", "Dependent Care FSA plan summary"),
  benefit("healthcare_fsa", "family_tax", "Healthcare FSA", "coverage", "What election limit, carryover or grace period, and claim deadline apply?", "Healthcare FSA plan summary"),
  benefit("hsa_eligibility", "family_tax", "HSA eligibility", "access", "Does the medical plan remain HSA-eligible and could another coverage arrangement affect eligibility?", "HDHP materials and IRS Publication 969"),
  benefit("childcare_backup", "family_tax", "Childcare or backup care", "coverage", "What eligibility, reservation, copay, provider, and annual-use limits apply?", "Program terms"),
  benefit("adoption_fertility", "family_tax", "Adoption or fertility support", "coverage", "Which services or expenses qualify and are there lifetime, network, or employment-tenure limits?", "Program terms and plan document"),
  benefit("parental_leave", "family_tax", "Parental leave", "coverage", "How much leave is paid, how does it coordinate with disability or state leave, and when must it be used?", "Leave policy"),
  benefit("pto", "employment_quality", "PTO", "employer_value", "How did accrual, front-loading, caps, carryover, and payout rules change?", "PTO policy"),
  benefit("sick_leave", "employment_quality", "Sick leave", "coverage", "Is sick leave separate from PTO, and what notice, carryover, or documentation rules apply?", "Sick-leave policy"),
  benefit("holidays", "employment_quality", "Holidays", "employer_value", "Which dates, premium rates, eligibility rules, and floating-holiday terms apply?", "Holiday policy"),
  benefit("education_assistance", "employment_quality", "Education assistance", "coverage", "What programs, grades, service commitments, and repayment terms apply?", "Tuition-assistance policy"),
  benefit("student_loan_support", "employment_quality", "Student-loan support", "employer_value", "Is support a direct payment, retirement match, or counseling benefit, and what eligibility applies?", "Program terms"),
  benefit("commuter", "employment_quality", "Commuter benefits", "employer_value", "Did the subsidy, pre-tax election, parking, or transit rules change?", "Commuter-benefit guide"),
  benefit("wellness", "employment_quality", "Wellness benefits", "coverage", "What activity is required, what reward is offered, and what privacy terms apply?", "Wellness-program notice"),
  benefit("work_expectations", "employment_quality", "Scheduling, call, travel, or remote-work expectations", "access", "Do benefits materials or policies change call, schedule, travel, or remote-work expectations?", "Written job policy or benefits guide"),
];

const knownBenefitIds = new Set(BENEFIT_TAXONOMY.map((item) => item.id));
const knownStates = new Set<BenefitChangeState>(BENEFIT_CHANGE_STATES);

export type BenefitsReview = {
  version: 1;
  reviewYear: number;
  selections: Record<string, BenefitChangeState>;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  reminderDate?: string;
};

export type PrioritizedBenefit = BenefitDefinition & { state: BenefitChangeState; priority: BenefitPriority };

export type BenefitsChangeReceipt = {
  reviewYear: number;
  reviewDate: string;
  reviewedCount: number;
  priorities: Record<BenefitPriority, PrioritizedBenefit[]>;
  majorChanges: PrioritizedBenefit[];
  unresolvedQuestions: string[];
  incompleteAreas: string[];
  documentsToVerify: string[];
  finalChecklist: string[];
};

const isoNow = () => new Date().toISOString();
const validIso = (value: unknown) => typeof value === "string" && Number.isFinite(Date.parse(value));
const validDate = (value: unknown) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T00:00:00Z`));

export const createBenefitsReview = (reviewYear = new Date().getFullYear()): BenefitsReview => ({
  version: BENEFITS_REVIEW_VERSION,
  reviewYear,
  selections: {},
  startedAt: isoNow(),
  updatedAt: isoNow(),
});

export const parseBenefitsReview = (rawValue: string | null): BenefitsReview | null => {
  if (!rawValue) return null;
  try {
    const parsed = JSON.parse(rawValue) as Record<string, unknown>;
    if (parsed.version !== BENEFITS_REVIEW_VERSION) return null;
    const year = Number(parsed.reviewYear);
    if (!Number.isInteger(year) || year < 2020 || year > 2100) return null;
    const rawSelections = parsed.selections && typeof parsed.selections === "object" ? parsed.selections as Record<string, unknown> : {};
    const selections = Object.fromEntries(
      Object.entries(rawSelections).flatMap(([id, value]) => knownBenefitIds.has(id) && knownStates.has(value as BenefitChangeState) ? [[id, value as BenefitChangeState]] : []),
    );
    return {
      version: BENEFITS_REVIEW_VERSION,
      reviewYear: year,
      selections,
      startedAt: validIso(parsed.startedAt) ? parsed.startedAt as string : isoNow(),
      updatedAt: validIso(parsed.updatedAt) ? parsed.updatedAt as string : isoNow(),
      completedAt: validIso(parsed.completedAt) ? parsed.completedAt as string : undefined,
      reminderDate: validDate(parsed.reminderDate) ? parsed.reminderDate as string : undefined,
    };
  } catch {
    return null;
  }
};

const emitUpdate = () => {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(BENEFITS_REVIEW_UPDATED_EVENT));
};

export const loadBenefitsReview = () => typeof window === "undefined" ? null : parseBenefitsReview(window.localStorage.getItem(BENEFITS_REVIEW_STORAGE_KEY));

export const saveBenefitsReview = (review: BenefitsReview) => {
  const safe = parseBenefitsReview(JSON.stringify({ ...review, version: BENEFITS_REVIEW_VERSION, updatedAt: isoNow() })) ?? createBenefitsReview(review.reviewYear);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(BENEFITS_REVIEW_STORAGE_KEY, JSON.stringify(safe));
    emitUpdate();
  }
  return safe;
};

export const deleteBenefitsReview = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(BENEFITS_REVIEW_STORAGE_KEY);
  emitUpdate();
};

export const setBenefitsReminderDate = (review: BenefitsReview, reminderDate?: string) => saveBenefitsReview({ ...review, reminderDate: validDate(reminderDate) ? reminderDate : undefined });

export const getBenefitPriority = (benefit: BenefitDefinition, state: BenefitChangeState): BenefitPriority => {
  if (state === "not_reviewed") return "still_incomplete";
  if (state === "not_sure" || state === "changed_unclear") return "verify_before_enrolling";
  if (state === "removed") return "review_first";
  if (state === "added") return "verify_before_enrolling";
  if (state === "unchanged" || state === "not_offered") return "lower_apparent_priority";
  if (benefit.direction === "cost") return state === "increased" ? "review_first" : "lower_apparent_priority";
  if (benefit.direction === "employer_value" || benefit.direction === "coverage" || benefit.direction === "access") {
    return state === "decreased" ? "review_first" : "lower_apparent_priority";
  }
  return "verify_before_enrolling";
};

export const prioritizeBenefitsReview = (review: BenefitsReview) => BENEFIT_TAXONOMY
  .filter((item) => review.selections[item.id])
  .map((item): PrioritizedBenefit => ({ ...item, state: review.selections[item.id], priority: getBenefitPriority(item, review.selections[item.id]) }));

export const completeBenefitsReview = (review: BenefitsReview) => saveBenefitsReview({ ...review, completedAt: isoNow() });

export const buildBenefitsChangeReceipt = (review: BenefitsReview, reviewDate = new Date().toISOString().slice(0, 10)): BenefitsChangeReceipt => {
  const prioritized = prioritizeBenefitsReview(review);
  const priorities: BenefitsChangeReceipt["priorities"] = {
    review_first: prioritized.filter((item) => item.priority === "review_first"),
    verify_before_enrolling: prioritized.filter((item) => item.priority === "verify_before_enrolling"),
    lower_apparent_priority: prioritized.filter((item) => item.priority === "lower_apparent_priority"),
    still_incomplete: prioritized.filter((item) => item.priority === "still_incomplete"),
  };
  const attention = [...priorities.review_first, ...priorities.verify_before_enrolling];
  return {
    reviewYear: review.reviewYear,
    reviewDate,
    reviewedCount: prioritized.filter((item) => item.state !== "not_reviewed").length,
    priorities,
    majorChanges: priorities.review_first,
    unresolvedQuestions: Array.from(new Set(attention.map((item) => item.question))),
    incompleteAreas: priorities.still_incomplete.map((item) => item.label),
    documentsToVerify: Array.from(new Set(attention.map((item) => item.document))),
    finalChecklist: [
      "Confirm the controlling enrollment deadline in the employer portal or written notice.",
      "Verify elections, coverage tier, dependents, beneficiaries, and payroll deductions before submitting.",
      "Save the final confirmation and current plan documents in a secure place you control.",
      "Check the first payroll deduction and coverage effective date after enrollment.",
      "Ask HR or the plan administrator to answer unresolved questions in writing when possible.",
    ],
  };
};

const priorityLabel: Record<BenefitPriority, string> = {
  review_first: "REVIEW FIRST",
  verify_before_enrolling: "VERIFY BEFORE ENROLLING",
  lower_apparent_priority: "LOWER APPARENT PRIORITY",
  still_incomplete: "STILL INCOMPLETE",
};

const stateLabel = (state: BenefitChangeState) => state.replaceAll("_", " ");

export const createBenefitsReceiptText = (receipt: BenefitsChangeReceipt) => [
  `CAF BENEFITS CHANGE RECEIPT — ${receipt.reviewYear}`,
  `Reviewed: ${receipt.reviewDate}`,
  `${receipt.reviewedCount} benefit areas reviewed`,
  "",
  ...(["review_first", "verify_before_enrolling", "lower_apparent_priority", "still_incomplete"] as BenefitPriority[]).flatMap((priority) => receipt.priorities[priority].length ? [
    priorityLabel[priority],
    ...receipt.priorities[priority].map((item) => `- ${item.label}: ${stateLabel(item.state)}`),
    "",
  ] : []),
  "QUESTIONS FOR HR OR THE PLAN ADMINISTRATOR",
  ...(receipt.unresolvedQuestions.length ? receipt.unresolvedQuestions.map((question) => `- ${question}`) : ["- No unresolved question was generated from the reviewed changes."]),
  "",
  "DOCUMENTS TO VERIFY",
  ...(receipt.documentsToVerify.length ? receipt.documentsToVerify.map((document) => `- ${document}`) : ["- Current enrollment guide and controlling plan documents"]),
  "",
  "FINAL ENROLLMENT CHECKLIST",
  ...receipt.finalChecklist.map((item) => `- ${item}`),
  "",
  "Educational decision support only. Employer documents, plan documents, the Summary Plan Description, the Summary of Benefits and Coverage, official agency guidance, and written plan-administrator responses remain controlling.",
].join("\n");

const escapeIcs = (value: string) => value.replaceAll("\\", "\\\\").replaceAll(",", "\\,").replaceAll(";", "\\;").replaceAll("\n", "\\n");
const nextDate = (date: string) => {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + 1);
  return value.toISOString().slice(0, 10);
};
const compactDate = (date: string) => date.replaceAll("-", "");

export const createBenefitsReviewCalendar = (date: string) => {
  if (!validDate(date)) throw new Error("Choose a valid local reminder date.");
  const canonicalUrl = `https://communityacquiredfinance.com${BENEFITS_CHANGE_CANONICAL_PATH}`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Community Acquired Finance//Benefits Review//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:caf-benefits-review-${compactDate(date)}@communityacquiredfinance.com`,
    `DTSTART;VALUE=DATE:${compactDate(date)}`,
    `DTEND;VALUE=DATE:${compactDate(nextDate(date))}`,
    `SUMMARY:${escapeIcs("Review workplace benefits")}`,
    `DESCRIPTION:${escapeIcs(`Open the private CAF Benefits Change Detector and verify the controlling employer and plan documents. ${canonicalUrl}`)}`,
    `URL:${canonicalUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
};
