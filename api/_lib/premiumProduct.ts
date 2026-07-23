export const PREMIUM_PRODUCT_ID = "healthcare_compensation_benefits_decision_book";

export type PremiumModule = {
  id: string;
  number: string;
  part: string;
  title: string;
  purpose: string;
  orientation: string;
  framingQuestions: string[];
  comparisonFields: string[];
  actions: string[];
  professionalQuestions: string[];
  completionCriteria: string[];
  relatedModuleIds: string[];
  sourceIds: string[];
};

export const premiumSources = [
  { id: "dol-ecec", agency: "U.S. Bureau of Labor Statistics", title: "Employer Costs for Employee Compensation", url: "https://www.bls.gov/news.release/ecec.toc.htm" },
  { id: "dol-retirement", agency: "U.S. Department of Labor", title: "What You Should Know About Your Retirement Plan", url: "https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/publications/what-you-should-know-about-your-retirement-plan" },
  { id: "dol-fmla", agency: "U.S. Department of Labor", title: "FMLA Fact Sheet #28", url: "https://www.dol.gov/agencies/whd/fact-sheets/28-fmla" },
  { id: "irs-403b", agency: "Internal Revenue Service", title: "403(b) contribution limits", url: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-403b-contribution-limits" },
  { id: "irs-pub15b", agency: "Internal Revenue Service", title: "Publication 15-B: Employer's Tax Guide to Fringe Benefits", url: "https://www.irs.gov/publications/p15b" },
  { id: "healthcare-sbc", agency: "HealthCare.gov", title: "Summary of Benefits and Coverage", url: "https://www.healthcare.gov/health-care-law-protections/summary-of-benefits-and-coverage/" },
  { id: "healthcare-costs", agency: "HealthCare.gov", title: "Your total costs for health care", url: "https://www.healthcare.gov/choose-a-plan/your-total-costs/" },
  { id: "fsa", agency: "Federal Student Aid", title: "Student loan forgiveness overview", url: "https://studentaid.gov/articles/student-loan-forgiveness/" },
] as const;

export const premiumModules: PremiumModule[] = [
  {
    id: "pay-structure", number: "01", part: "Compensation", title: "Employment pay structure",
    purpose: "Translate a written offer or current role into a realistic annual cash-compensation range before comparing headline pay.",
    orientation: "Keep guaranteed pay separate from overtime, differentials, call, bonuses, and other conditional income. Use a range when hours or premiums are not verified.",
    framingQuestions: ["What compensation is guaranteed in writing?", "Which amounts depend on schedule, hours, performance, or continued service?", "What pay-period and eligibility rules could change the first-year result?"],
    comparisonFields: ["Base rate or salary", "FTE and scheduled hours", "Overtime multiplier and expected hours", "Shift, weekend, holiday, charge, call, standby, and callback pay", "Bonus, sign-on, and other conditional cash", "First eligible pay period"],
    actions: ["Name the controlling offer, pay record, or policy and its effective date.", "Label every material amount Verified, Estimated, Assumed, or Unresolved.", "Record a conservative and expected annual cash range rather than a maximum case."],
    professionalQuestions: ["Please confirm the base rate, FTE, scheduled hours, and first eligible pay period.", "Please provide the current differential, overtime, holiday, call, standby, and callback rules.", "Please identify every guarantee, performance condition, service period, and repayment term."],
    completionCriteria: ["Guaranteed and conditional pay are separated.", "The first-year range is recorded.", "Material open pay questions have an owner and due date."],
    relatedModuleIds: ["total-compensation", "schedule-time", "repayment-risk"], sourceIds: ["dol-ecec"],
  },
  {
    id: "total-compensation", number: "02", part: "Compensation", title: "Total compensation",
    purpose: "Compare measurable employer value without converting every benefit or life-quality factor into one misleading total.",
    orientation: "Count employer-funded value once, separate employee costs, and leave qualitative or unverified benefits outside the headline number.",
    framingQuestions: ["Which employer contributions are usable and likely to vest?", "Which costs reduce the package value?", "Which benefits are valuable but cannot be responsibly converted to dollars?"],
    comparisonFields: ["Annual cash compensation", "Employer retirement contribution", "Employer HSA or HRA funding", "Employee premiums and selected recurring costs", "Paid-leave estimate", "Unvested or forfeitable value", "Qualitative benefits and uncertainty"],
    actions: ["Build a measurable-value subtotal.", "Show employee costs and unvested value separately.", "Write a non-dollar quality and uncertainty note next to the economic comparison."],
    professionalQuestions: ["Please identify every employer-funded benefit and the eligibility date for each.", "Please confirm which amounts are guaranteed, discretionary, reimbursed, or forfeitable.", "Please provide the source document for any value presented as part of total compensation."],
    completionCriteria: ["No benefit is double counted.", "Employer value and employee cost are separated.", "Unverified value is not presented as guaranteed."],
    relatedModuleIds: ["pay-structure", "medical-insurance", "retirement-plan", "integrated-decision"], sourceIds: ["dol-ecec", "dol-retirement"],
  },
  {
    id: "medical-insurance", number: "03", part: "Health & insurance", title: "Medical insurance",
    purpose: "Choose a medical plan only after testing access and low-, expected-, and high-use cost ranges.",
    orientation: "Premium is only one part of cost. Verify the exact plan, coverage tier, network, formulary, deductible structure, employer funding, and out-of-pocket exposure.",
    framingQuestions: ["Can the buyer reach the clinicians, facilities, and medications that matter?", "What is the annual cost under low, expected, and high use?", "Which rules or family structures could materially change the calculation?"],
    comparisonFields: ["Annual payroll premium", "Deductible and family structure", "Copays and coinsurance", "Out-of-pocket maximum", "Employer HSA or HRA funding", "Provider and facility network", "Prescription formulary", "Referral and prior-authorization rules"],
    actions: ["Use the correct plan-year rate sheet and SBC.", "Run three cost scenarios without predicting actual healthcare use.", "Keep network and prescription verification as separate decision gates."],
    professionalQuestions: ["Please provide the current plan-year rate sheet, SBC, plan document, provider directory, and formulary.", "Please confirm employer HSA or HRA funding, deposit timing, and forfeiture or eligibility rules.", "Please confirm referral, prior-authorization, specialty-pharmacy, and out-of-network requirements."],
    completionCriteria: ["Three cost scenarios are documented.", "Network and medication status are explicitly verified or unresolved.", "The controlling plan-year documents are named."],
    relatedModuleIds: ["hsa-fsa-hra", "total-compensation", "integrated-decision"], sourceIds: ["healthcare-sbc", "healthcare-costs"],
  },
  {
    id: "dental-insurance", number: "04", part: "Health & insurance", title: "Dental insurance",
    purpose: "Treat dental coverage as a defined contract rather than an assumed add-on benefit.",
    orientation: "Network, annual maximum, waiting periods, frequency limits, alternate-benefit rules, and expected use determine whether the election fits.",
    framingQuestions: ["Is the intended dentist in the exact plan network?", "What annual maximum and frequency limits apply?", "Do waiting periods or exclusions affect expected care?"],
    comparisonFields: ["Annual premium", "Network status", "Deductible", "Preventive, basic, and major coverage", "Annual maximum", "Waiting periods", "Implant, missing-tooth, orthodontic, and alternate-benefit rules"],
    actions: ["Obtain the certificate or full plan document.", "Compare expected services to the actual benefit schedule.", "Record any coverage assumption that still requires written confirmation."],
    professionalQuestions: ["Please provide the certificate or full dental plan document, not only the enrollment summary.", "Please confirm waiting periods, missing-tooth, implant, orthodontic, and alternate-benefit rules.", "Please confirm the selected dentist's network status for the exact plan."],
    completionCriteria: ["Network is verified.", "Expected care is compared with limits and exclusions.", "The election and rationale are recorded."],
    relatedModuleIds: ["vision-insurance", "integrated-decision"], sourceIds: [],
  },
  {
    id: "vision-insurance", number: "05", part: "Health & insurance", title: "Vision insurance",
    purpose: "Compare the benefit against the buyer's actual exam, lens, frame, and contact-lens pattern.",
    orientation: "A low premium does not establish value. Verify provider access, frequencies, allowances, lens options, and whether benefits can be combined.",
    framingQuestions: ["Which services and materials are expected during the plan year?", "Are the intended providers and retailers in network?", "Do frequency and allowance rules match the buyer's use pattern?"],
    comparisonFields: ["Annual premium", "Exam copay and frequency", "Frame allowance and frequency", "Lens options", "Contact-lens allowance", "Provider network", "Combination and upgrade rules"],
    actions: ["Use the full benefit schedule.", "Price the expected use pattern, not an idealized maximum benefit.", "Record uncovered upgrades separately."],
    professionalQuestions: ["Please provide the full vision benefit schedule and current provider directory.", "Please confirm frame, lens, and contact-lens frequencies and whether benefits can be combined.", "Please confirm coverage for the buyer's expected lens options and providers."],
    completionCriteria: ["Expected use is compared with the contract.", "Provider status is verified.", "The election and uncovered costs are recorded."],
    relatedModuleIds: ["dental-insurance", "integrated-decision"], sourceIds: [],
  },
  {
    id: "hsa-fsa-hra", number: "06", part: "Health & insurance", title: "HSA, FSA & HRA elections",
    purpose: "Identify each account correctly, verify eligibility, and choose contributions only after employer funding and use rules are known.",
    orientation: "Do not treat HSA, FSA, and HRA labels as interchangeable. Record the plan year, account type, employer contribution, timing, rollover, runout, substantiation, and forfeiture rules.",
    framingQuestions: ["Which account is actually offered and who owns the funds?", "What limits or other coverage affect eligibility?", "What amount can be used without creating avoidable forfeiture or cash-flow strain?"],
    comparisonFields: ["Account type", "Eligibility", "Employee election", "Employer funding", "Deposit timing", "Rollover or grace period", "Runout and substantiation", "Forfeiture rules"],
    actions: ["Recheck year-specific federal limits before acting.", "Coordinate the election with the selected medical plan.", "Keep employer funding and employee contributions separate."],
    professionalQuestions: ["Please confirm the account type, plan year, employer contribution, timing, and eligibility conditions.", "Please provide rollover, grace-period, runout, substantiation, and forfeiture rules.", "Please confirm whether other employer coverage limits HSA eligibility."],
    completionCriteria: ["Account type and eligibility are verified.", "Employer and employee funding are separated.", "The contribution decision and review date are recorded."],
    relatedModuleIds: ["medical-insurance", "integrated-decision"], sourceIds: ["irs-pub15b"],
  },
  {
    id: "retirement-plan", number: "07", part: "Retirement", title: "Retirement plan identification",
    purpose: "Identify every workplace retirement plan separately before combining match, non-elective, pension, or deferred-compensation features.",
    orientation: "A 403(b), 401(a), 457(b), pension, and nonqualified plan can have different eligibility, compensation definitions, vesting, and distribution rules.",
    framingQuestions: ["Which plans exist and when does eligibility begin?", "What employer money is matching, non-elective, fixed, pension, or discretionary?", "What value is vested, unvested, or conditional?"],
    comparisonFields: ["Plan type", "Eligibility date", "Match formula and cap", "Non-elective or fixed contribution", "Eligible compensation", "True-up and pay-period rules", "Vesting schedule", "Fees and distribution rules to verify"],
    actions: ["Name each plan and SPD separately.", "Estimate employer value only from the documented formula.", "Show unvested employer money outside current usable value."],
    professionalQuestions: ["Please provide the SPD or plan summary for every retirement plan offered.", "Please confirm the match formula, cap, eligible compensation, waiting period, and vesting schedule.", "Please identify any pension, 401(a), 457(b), or nonqualified plan that is separate from the primary account."],
    completionCriteria: ["Every plan is separately identified.", "Employer formulas and vesting are documented.", "Unknown true-up or eligible-compensation rules are flagged."],
    relatedModuleIds: ["retirement-election", "total-compensation", "integrated-decision"], sourceIds: ["dol-retirement", "irs-403b"],
  },
  {
    id: "retirement-election", number: "08", part: "Retirement", title: "Retirement contribution election",
    purpose: "Choose a contribution rate that captures intended employer value while preserving cash-flow and review discipline.",
    orientation: "A contribution percentage is not complete until payroll timing, eligible compensation, full-match requirements, annual limits, and the process for changing the election are known.",
    framingQuestions: ["What employee contribution captures the intended employer amount?", "Will per-paycheck rules or timing leave employer money uncaptured?", "Is the election sustainable within the buyer's cash-flow constraints?"],
    comparisonFields: ["Employee rate and contribution type", "Contribution per paycheck and annually", "Estimated employer contribution", "Potential uncaptured match", "Annual limit monitoring", "Change process and deadline"],
    actions: ["Model the contribution using realistic eligible compensation.", "Confirm whether overtime, bonuses, and differentials count.", "Calendar a review after the first deduction and employer contribution post."],
    professionalQuestions: ["Please confirm when payroll deferrals and employer contributions begin.", "Please confirm whether bonuses, overtime, and differentials are eligible compensation.", "Please provide the process and deadline for changing the contribution election."],
    completionCriteria: ["The intended employer value is identified.", "Paycheck and annual amounts are understood.", "A first-paycheck verification date is scheduled."],
    relatedModuleIds: ["retirement-plan", "integrated-decision"], sourceIds: ["irs-403b", "dol-retirement"],
  },
  {
    id: "pto-leave", number: "09", part: "Time, leave & protection", title: "PTO & leave",
    purpose: "Translate leave language into usable time: accrual, eligibility, caps, restrictions, payout, and coordination with job-protected leave.",
    orientation: "Do not count an advertised leave bank as fully usable until first-year accrual, waiting periods, blackout rules, carryover, payout, and coordination rules are known.",
    framingQuestions: ["How much leave is usable in the first year?", "What restrictions or attendance rules reduce practical access?", "What happens to leave during disability, family leave, or separation?"],
    comparisonFields: ["PTO accrual and eligibility", "Holiday treatment", "Sick time and attendance rules", "Caps and carryover", "Blackout and approval practices", "Separation payout", "Parental and caregiver leave", "Coordination with disability and FMLA"],
    actions: ["Calculate first-year usable hours separately from headline annual hours.", "Record operational restrictions that are not visible in the policy summary.", "Name the policy and effective date."],
    professionalQuestions: ["Please provide the PTO, holiday, sick-time, and leave policies for the role and location.", "Please confirm first-year accrual, eligibility, caps, carryover, blackout periods, and separation payout.", "Please explain how employer-paid leave coordinates with disability, FMLA, and state programs."],
    completionCriteria: ["First-year usable leave is estimated.", "Restrictions and payout rules are documented.", "The election or accepted tradeoff is recorded."],
    relatedModuleIds: ["protection-elections", "schedule-time", "integrated-decision"], sourceIds: ["dol-fmla"],
  },
  {
    id: "protection-elections", number: "10", part: "Time, leave & protection", title: "Disability, life & protection elections",
    purpose: "Treat protection benefits as specific contracts rather than vague employer-quality signals.",
    orientation: "Verify definitions, waiting periods, benefit percentages, caps, exclusions, offsets, tax treatment, portability, and employee cost before relying on coverage.",
    framingQuestions: ["What event triggers coverage and how is income defined?", "What waiting periods, exclusions, caps, or offsets apply?", "Does the coverage continue or convert when employment ends?"],
    comparisonFields: ["Short-term disability", "Long-term disability", "Life and AD&D", "Professional-liability support", "Waiting period", "Benefit definition and cap", "Exclusions and offsets", "Employee premium and tax treatment", "Portability"],
    actions: ["Obtain the certificate or policy when the benefit is decision-relevant.", "Separate employer-paid basic coverage from voluntary elections.", "Record beneficiary or portability work without storing sensitive details in CAF."],
    professionalQuestions: ["Please provide the certificate or policy for disability, life, AD&D, and professional-liability coverage.", "Please confirm waiting periods, definitions, exclusions, benefit caps, offsets, and portability.", "Please confirm employee premiums and whether coverage or tax treatment changes with employee-paid elections."],
    completionCriteria: ["Material definitions and limits are identified.", "Employee cost is recorded.", "Sensitive beneficiary details remain outside the workspace."],
    relatedModuleIds: ["pto-leave", "schedule-time", "integrated-decision"], sourceIds: ["irs-pub15b"],
  },
  {
    id: "schedule-time", number: "11", part: "Time, leave & protection", title: "Schedule & controlled time",
    purpose: "Measure annual time burden and record schedule quality separately from dollar value.",
    orientation: "Include scheduled hours, commute, call, travel, charting, preparation, email, and recovery burden. Do not force schedule quality or family fit into a false dollar score.",
    framingQuestions: ["How many hours are controlled by the job each year?", "How predictable and usable is the schedule?", "Which unpaid or unreimbursed requirements change the practical value of the role?"],
    comparisonFields: ["Scheduled annual hours", "Commute and parking", "Weekends, nights, and holidays", "Call, standby, and callback", "Travel and overnight travel", "Unpaid charting, preparation, or email", "Cancellation and low-census practices", "Self-scheduling, remote, and flexibility", "Physical demand and recovery"],
    actions: ["Calculate annual controlled time using explicit assumptions.", "Keep economic cost, time burden, and quality rating separate.", "Document schedule rules and observed practice when they differ."],
    professionalQuestions: ["Please confirm expected schedule, rotation, weekends, holidays, call, travel, and overnight travel.", "Please describe cancellation, low-census, remote-work, self-scheduling, and shift-change practices.", "Please confirm whether charting, preparation, email, or travel occurs outside paid time."],
    completionCriteria: ["Annual controlled time is estimated.", "Schedule quality is recorded separately from dollars.", "Material practice-versus-policy uncertainty is visible."],
    relatedModuleIds: ["pay-structure", "pto-leave", "career-fit", "integrated-decision"], sourceIds: ["dol-ecec"],
  },
  {
    id: "repayment-risk", number: "12", part: "Conditional benefits & risk", title: "Repayment risk",
    purpose: "Treat sign-on, relocation, tuition, retention, and similar payments as contingent until the written agreement proves otherwise.",
    orientation: "Record the gross payment, service period, trigger, full or prorated repayment, separation rules, tax documentation, deadline, and reserve amount.",
    framingQuestions: ["What event creates a repayment obligation?", "Is repayment full, prorated, or discretionary?", "How much cash should remain reserved until the obligation expires?"],
    comparisonFields: ["Payment type and gross amount", "Payment date", "Service commitment", "Voluntary and involuntary separation rules", "Full or prorated repayment", "Repayment deadline", "Tax documentation", "Reserve amount and release date"],
    actions: ["Read the separate repayment agreement rather than relying on offer-summary language.", "Keep the payment conditional in the comparison until the service period expires.", "Calendar the obligation end date and reserve release review."],
    professionalQuestions: ["Please provide the complete repayment agreement and identify the controlling document if terms conflict.", "Please confirm whether repayment is full or prorated and how voluntary, involuntary, leave, transfer, or termination events are treated.", "Please confirm whether the employer supports prior-year tax documentation or adjustment when repayment occurs."],
    completionCriteria: ["Trigger and repayment formula are documented.", "A reserve decision is recorded.", "The obligation end date is calendared."],
    relatedModuleIds: ["pay-structure", "career-fit", "integrated-decision"], sourceIds: ["irs-pub15b"],
  },
  {
    id: "career-fit", number: "13", part: "Conditional benefits & risk", title: "Career fit & employment risk",
    purpose: "Make strategic value visible without forcing career trajectory, manager quality, role security, or family fit into a dollar estimate.",
    orientation: "Use a separate qualitative record for training, orientation, leadership, workload, territory, travel, performance metrics, advancement, transferability, stability, and reversal conditions.",
    framingQuestions: ["What makes this role a stronger or weaker long-term platform?", "Which operational or leadership risks could reverse the choice?", "What evidence can be verified before accepting and what must be monitored during the first 90 days?"],
    comparisonFields: ["Orientation and training", "Manager and team stability", "Patient, account, or territory load", "Travel and on-call escalation", "Performance metrics and quota exposure", "Advancement and internal mobility", "Transferable skills", "Role security and scope-change risk", "Family fit and recovery burden"],
    actions: ["Record a qualitative rating with evidence, not a dollar conversion.", "Separate verified facts from interview impressions and assumptions.", "Create 30-, 60-, and 90-day review conditions for material unknowns."],
    professionalQuestions: ["Please describe the orientation, training, performance measures, and support available during the first 90 days.", "Please confirm territory, travel, call, workload, productivity, and escalation expectations in writing.", "Please describe the advancement path, role-scope review process, and circumstances that commonly change this position."],
    completionCriteria: ["Strategic value and role risk are separately documented.", "Reversal conditions are explicit.", "First-90-day verification items are scheduled."],
    relatedModuleIds: ["schedule-time", "repayment-risk", "integrated-decision"], sourceIds: [],
  },
  {
    id: "integrated-decision", number: "14", part: "Integrated decision", title: "My healthcare compensation & benefits elections",
    purpose: "Bring every applicable choice, reason, source, confidence label, unresolved fact, and review date into one calm decision record.",
    orientation: "The final board is not a universal score. It is an auditable record of what was selected, why it was reasonable with the information available, what remains unresolved, and what could trigger reconsideration.",
    framingQuestions: ["What was selected in each applicable module?", "Which facts and tradeoffs were decisive?", "What must still be verified, completed, monitored, or reviewed?"],
    comparisonFields: ["Selected election or option", "Decisive reason", "Controlling source and effective date", "Confidence label", "Accepted tradeoff", "Unresolved fact and owner", "Action and deadline", "Reversal condition", "Next review date"],
    actions: ["Transfer each completed module decision into the election board.", "Close acceptance, resignation, enrollment, and coverage-gap gates before acting.", "Generate a dated printable summary and retain the controlling documents outside CAF."],
    professionalQuestions: ["Which unresolved items must be answered before the decision deadline?", "Which written confirmations must be retained with the final decision record?", "When will the buyer review actual deductions, employer contributions, schedule, coverage, and role scope?"],
    completionCriteria: ["Every applicable module has a recorded election or deliberate deferral.", "Open items have owners and deadlines.", "The final summary is dated, printable, and has a next-review date."],
    relatedModuleIds: ["total-compensation", "medical-insurance", "retirement-plan", "pto-leave", "repayment-risk", "career-fit"], sourceIds: ["dol-ecec", "dol-retirement", "healthcare-sbc", "irs-403b"],
  },
];

export const premiumProduct = {
  id: PREMIUM_PRODUCT_ID,
  name: "Healthcare Compensation & Benefits Decision Workspace",
  sourceEditionName: "Healthcare Compensation & Benefits Decision Book",
  version: "3.0-web.1",
  sourceVersion: "3.0",
  sourceReviewDate: "2026-07-23",
  publishedAt: "2026-07-23",
  audience: "Healthcare professionals evaluating pay, insurance, retirement, time, and employment risk.",
  outcome: "A documented compensation and benefits decision, verification plan, and dated election summary.",
  purchaseModel: {
    type: "one_time",
    automaticRenewal: false,
    access: "Continued access to the purchased edition while the service remains available.",
    updates: "Twelve months of substantive product updates from the verified purchase date.",
    ads: false,
  },
  privacy: {
    savedToAccount: ["module completion", "last viewed module", "generic task completion", "product version"],
    keptInBrowser: ["calculator inputs", "free-text notes", "draft comparisons", "personalized print content until the user prints or saves it"],
    prohibited: ["Social Security numbers", "account or member IDs", "banking credentials", "medical records", "insurance portal credentials", "beneficiary details", "unnecessary health information"],
  },
  modules: premiumModules,
  sources: premiumSources,
  updateHistory: [
    { version: "3.0-web.1", date: "2026-07-23", type: "substantive", summary: "Converted the canonical v3.0 private-client decision book into a secure modular workspace with account progress, source library, and print-ready decision records." },
    { version: "3.0", date: "2026-07-23", type: "source edition", summary: "Expanded the healthcare compensation and benefits system to fourteen modular decisions and an integrated election board." },
  ],
  limitation: "Educational decision support only. The workspace does not provide individualized financial, legal, tax, employment, insurance, investment, or medical advice; determine eligibility or coverage; interpret controlling documents; or guarantee outcomes.",
} as const;
