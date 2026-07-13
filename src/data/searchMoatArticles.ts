import type { Article } from "./articles";
import { SOURCE_PRESETS } from "./sources";

export const SEARCH_MOAT_ARTICLES: Article[] = [
  {
    slug: "what-employer-benefit-changes-should-i-compare",
    title: "What Employer-Benefit Changes Should I Compare During Open Enrollment?",
    category: "Workplace Benefits",
    readTime: "7 min read",
    publishedAt: "2026-07-12",
    lastReviewedAt: "2026-07-12",
    rulesEffectiveAt: "2026-01-01",
    nextReviewAt: "2027-07-01",
    timeSensitive: true,
    reviewScope: "Job-based medical coverage, retirement, protection, family benefits, leave, and employer-benefit document controls for the 2026 review year.",
    author: "Andrew Ciccarelli, BSN, RN",
    reviewer: "Community Acquired Finance editorial review — verify employer-specific conclusions with HR or the plan administrator",
    promise: "Compare the changes that can alter cost, access, employer value, or protection before you repeat last year's elections.",
    audience: "Employees, healthcare workers, spouses, and families comparing a new workplace-benefits guide with the prior year before enrollment closes.",
    summary: "Start with four questions: Did my cost increase? Did access to doctors, prescriptions, or services narrow? Did the employer contribution or retirement match decrease? Did a protection, leave, or family benefit disappear or become harder to use? Then verify every important change in the current Summary of Benefits and Coverage, Summary Plan Description, plan amendment, rate sheet, certificate, or written plan-administrator response. Do not assume an unchanged election produces unchanged coverage.",
    body: [
      "Open enrollment is a change-detection problem before it is a plan-selection problem. Repeating last year's elections can still produce a different result when premiums, networks, formularies, employer contributions, matching formulas, leave rules, or protection benefits change.",
      "The goal is not to inspect every line with equal urgency. Find changes that can materially affect cost, access, employer-provided value, or protection, then turn uncertainty into exact verification questions.",
      "CAF's Benefits Change Detector keeps this review local to the browser and produces a practical Receipt. Employer documents and plan-administrator answers remain controlling."
    ],
    sections: [
      {
        title: "Review first: changes that can create immediate cost or access risk",
        definition: "A higher employee premium, deductible, coinsurance rate, copay, or out-of-pocket maximum can increase cost. A narrower network, removed out-of-network benefit, formulary change, or new authorization rule can affect access even when the premium looks attractive.",
        keyPoints: [
          "Compare the exact employee-only, spouse, and family payroll rates rather than a marketing summary.",
          "Check the individual and family deductible and out-of-pocket structure, not only the headline amount.",
          "Confirm doctors, hospitals, laboratories, prescriptions, pharmacies, and authorization rules in the exact plan for the new year.",
          "Treat a removed plan or benefit as a fresh decision rather than a routine renewal."
        ],
        watchOut: "A provider directory or formulary can change during the year. Save the date and source of any verification and confirm important details directly."
      },
      {
        title: "Compare employer value, not only employee cost",
        keyPoints: [
          "Employer HSA or HRA funding can offset part of a higher deductible, but deposit timing and eligibility matter.",
          "A retirement match or non-elective contribution is part of compensation; compare the formula, eligible pay, true-up, and vesting.",
          "Employer-paid disability and life insurance can change without appearing in the medical-plan comparison.",
          "PTO, holidays, education assistance, commuter support, and student-loan benefits can change total compensation."
        ]
      },
      {
        title: "Benefits people commonly overlook",
        keyPoints: [
          "Short- and long-term disability waiting periods, benefit percentages, maximums, and definitions of disability.",
          "Healthcare FSA and Dependent Care FSA claim deadlines, carryover, grace-period, and eligible-expense rules.",
          "HSA eligibility when a spouse's coverage, general-purpose FSA, or other arrangement changes.",
          "Parental leave coordination with disability, state leave, PTO, and service requirements.",
          "Backup care, adoption, fertility, tuition, wellness, commuter, and student-loan program limits.",
          "Scheduling, call, travel, and remote-work expectations when they appear in benefits or employment materials."
        ]
      },
      {
        title: "Which document controls which question?",
        keyPoints: [
          "Use the Summary of Benefits and Coverage for a standardized health-plan comparison, but check the fuller plan document for exclusions and operating rules.",
          "Use the Summary Plan Description and amendment notices for retirement, welfare-benefit, claim, eligibility, and participant-right details when applicable.",
          "Use rate sheets and enrollment confirmations for payroll deductions and coverage tiers.",
          "Use certificates of coverage for disability, life, and accidental-death definitions and exclusions.",
          "Use the current formulary and provider directory for prescription and network checks, then verify high-stakes details directly."
        ],
        watchOut: "The enrollment guide is a useful index, but it may not be the controlling legal plan document. Ask which document controls when two sources conflict."
      }
    ],
    comparisonTable: {
      headers: ["Change area", "Why compare it", "Where to verify"],
      rows: [
        ["Premiums and cost sharing", "Changes cash flow and possible bad-year exposure", "Rate sheet, SBC, plan document"],
        ["Network, formulary, authorization", "Changes access to doctors, facilities, prescriptions, and services", "Provider directory, formulary, utilization rules"],
        ["HSA/HRA funding", "Changes employer value and the net impact of a high-deductible plan", "Employer contribution notice and plan materials"],
        ["Retirement match and vesting", "Changes total compensation and the value kept after leaving", "SPD, match notice, fee disclosure"],
        ["Disability and life insurance", "Changes income and family protection during a serious event", "Certificate of coverage and rate sheet"],
        ["FSA, childcare, leave, and PTO", "Changes tax savings, family logistics, and paid time away", "Program terms, leave policy, PTO policy"]
      ]
    },
    numberedSteps: [
      "Confirm the enrollment deadline, effective date, and which elections will roll over automatically.",
      "Collect the current enrollment guide, every medical-plan SBC, rate sheet, retirement notices, protection certificates, and leave or spending-account terms.",
      "Compare the new materials with the prior year and mark each meaningful area as increased, decreased, added, removed, unchanged, unclear, not reviewed, not offered, or not sure.",
      "Review cost increases, removed benefits, reduced employer value, and narrowed access first.",
      "Turn every unclear or incomplete item into one exact question for HR or the plan administrator.",
      "Complete deeper comparisons only where the change matters, such as health-plan total cost, retirement contributions, or job total compensation.",
      "Save the final enrollment confirmation and schedule a check of the first payroll deduction and coverage effective date."
    ],
    questionsToAsk: [
      "Which document controls if the enrollment guide, SBC, portal, and plan document do not match?",
      "Which medical, pharmacy, retirement, protection, leave, or spending-account provisions changed for the new year?",
      "Did any provider network, formulary, prior-authorization, referral, or preferred-pharmacy rule change?",
      "Did the employer HSA/HRA contribution, retirement match, non-elective contribution, vesting, or fee structure change?",
      "Which elections roll over automatically, and which require an active election?",
      "When do elections become effective, when will deductions begin, and what can be corrected after the deadline?",
      "Can you provide the current controlling document or answer this question in writing?"
    ],
    relatedCalculator: { label: "Benefits Change Detector", href: "/tools/benefits-change-detector" },
    commonMistakes: [
      "Repeating last year's elections without checking what changed.",
      "Comparing only premiums while ignoring networks, prescriptions, authorization, employer funding, and bad-year exposure.",
      "Treating every added benefit as valuable without checking eligibility, limits, tax treatment, or payroll cost.",
      "Assuming the enrollment guide overrides the controlling plan document.",
      "Waiting until after enrollment closes to resolve unclear coverage or contribution rules."
    ],
    takeaway: "Compare changes in cost, access, employer value, and protection first. Use the current official documents, ask exact questions about uncertainty, and save a final confirmation rather than relying on last year's memory.",
    sources: [SOURCE_PRESETS.dolPlanInformation, SOURCE_PRESETS.dolWorkersFamilies, SOURCE_PRESETS.healthcareGovSbc, SOURCE_PRESETS.irsTaxFavoredHealthPlans, SOURCE_PRESETS.irs],
  },
  {
    slug: "does-medicare-cover-long-term-care",
    title: "Does Medicare Cover Long-Term Care?",
    category: "Medicare",
    readTime: "5 min read",
    promise: "A plain-English answer to the Medicare long-term care gap, including the difference between skilled care and custodial care.",
    audience: "Patients, caregivers, adult children helping aging parents, and healthcare workers explaining why Medicare may not pay for ongoing daily help.",
    summary: "Medicare usually does not pay for most long-term custodial care. Custodial care means ongoing help with bathing, dressing, toileting, meals, supervision, transportation, or daily living. Medicare may cover limited skilled care when strict rules are met, but that is different from long-term nursing home care or daily personal care. Medicaid may help people who qualify under state rules.",
    body: [
      "Medicare can be powerful health insurance, but it is not a long-term custodial care plan.",
      "The confusing part is that Medicare may cover certain skilled services for a limited time, while still not covering the daily help families often mean when they say long-term care.",
      "This guide is educational. Always verify patient-specific coverage with Medicare.gov, the plan, the state Medicaid agency, SHIP, the facility, and the billing office."
    ],
    sections: [
      {
        title: "The direct answer",
        definition: "Medicare generally does not cover most long-term custodial care.",
        keyPoints: [
          "Custodial care means help with daily living, such as bathing, dressing, toileting, eating, meals, mobility, or supervision.",
          "A person can truly need this help and still have it fall outside Medicare coverage.",
          "Medicaid, private pay, family caregiving, long-term care insurance, or community programs may become part of the plan."
        ],
        watchOut: "Do not assume a nursing home, assisted living facility, or home aide is covered just because the person has Medicare."
      },
      {
        title: "Skilled care is different",
        definition: "Skilled care is medical or therapy care that must be provided or supervised by licensed professionals.",
        keyPoints: [
          "Examples can include wound care, IV medications, skilled nursing, physical therapy, occupational therapy, or speech therapy.",
          "Medicare may cover skilled nursing facility care for a limited time when coverage rules are met.",
          "The care must meet Medicare or plan requirements; needing help at home is not enough by itself."
        ],
        watchOut: "Short-term skilled rehab is not the same thing as indefinite nursing home room-and-board or personal care."
      },
      {
        title: "What families often misunderstand",
        keyPoints: [
          "They hear 'nursing facility' and assume Medicare pays for the whole stay.",
          "They hear 'not safe at home' and assume insurance must cover daily supervision.",
          "They confuse medical necessity with benefit coverage.",
          "They wait until discharge day to ask what happens when covered skilled care ends."
        ]
      },
      {
        title: "What to ask before discharge or placement",
        keyPoints: [
          "Is this skilled care or custodial care?",
          "Which Medicare rule, Medicare Advantage rule, or Medicaid rule is being applied?",
          "How many covered days are expected, and what could the patient owe per day?",
          "What happens if Medicare coverage ends before the patient is safe at home?",
          "Should the family contact the state Medicaid agency or elder-law/benefits professional?"
        ]
      }
    ],
    example: {
      title: "Rehab versus long-term help",
      body: "A patient leaves the hospital after a fall and needs physical therapy in a skilled nursing facility. Medicare may cover a limited skilled rehab stay if rules are met. Months later, the patient mostly needs help bathing, dressing, meals, and supervision. That ongoing daily help is usually custodial care, and Medicare generally does not pay for most of it."
    },
    relatedCalculator: { label: "Medicare Cost Exposure Tool", href: "/medicare-care-costs#cost-estimator" },
    commonMistakes: [
      "Assuming Medicare pays for most nursing home care.",
      "Confusing short-term skilled rehab with long-term custodial care.",
      "Waiting until coverage stops to ask about Medicaid or private-pay planning.",
      "Assuming unsafe at home automatically means Medicare-paid placement."
    ],
    takeaway: "Medicare may cover limited skilled care when rules are met, but it generally does not cover most long-term custodial care. Families should separate medical care, daily living help, and Medicaid eligibility early.",
    sources: [SOURCE_PRESETS.medicareLongTermCare, SOURCE_PRESETS.medicareSnf, SOURCE_PRESETS.medicaidLtss, SOURCE_PRESETS.kffMedicareCoverageSnapshot],
  },
  {
    slug: "does-medicare-cover-rehab-after-hospital-stay",
    title: "Does Medicare Cover Rehab After a Hospital Stay?",
    category: "Medicare",
    readTime: "5 min read",
    promise: "Understand when Medicare may cover short-term rehab, what can block coverage, and what families should ask before discharge.",
    audience: "Patients, caregivers, families comparing rehab options, bedside clinicians, and case managers explaining post-hospital coverage.",
    summary: "Medicare may cover short-term rehab in a skilled nursing facility when specific rules are met. The patient usually needs skilled nursing or therapy, the facility must qualify, and hospital status or plan authorization can matter. Coverage is limited and can involve daily coinsurance. Medicare Advantage plans may add network and prior authorization rules.",
    body: [
      "Rehab after a hospital stay is one of the most common places where families assume coverage before confirming the rules.",
      "The practical question is not just whether the patient needs rehab. It is whether the recommended setting and service meet the payer's coverage rules.",
      "Use this page to organize the questions before the discharge meeting or plan call."
    ],
    sections: [
      {
        title: "The direct answer",
        definition: "Medicare may cover short-term skilled rehab after a hospital stay when coverage rules are met, but it is not automatic.",
        keyPoints: [
          "The care usually must be skilled nursing or therapy care.",
          "The facility generally must be Medicare-certified or approved by the plan.",
          "Original Medicare and Medicare Advantage can apply different operational rules.",
          "Coverage can stop when the patient no longer meets skilled-care criteria."
        ],
        watchOut: "A patient needing help is not the same thing as the stay being covered."
      },
      {
        title: "Hospital status can matter",
        definition: "A patient may sleep in a hospital bed but still be observation or outpatient rather than formally admitted as inpatient.",
        keyPoints: [
          "Families should ask whether the patient is inpatient, observation, or outpatient.",
          "Ask the date and time inpatient status began if it applies.",
          "Status can affect post-hospital skilled nursing facility coverage under Medicare rules."
        ],
        watchOut: "Do not rely on the room number or number of nights. Ask the status directly."
      },
      {
        title: "Medicare Advantage can add another step",
        keyPoints: [
          "The plan may require prior authorization before rehab begins.",
          "The facility may need to be in-network.",
          "The plan may review progress and stop coverage earlier than the family expected.",
          "Appeal rights may exist, but timing matters."
        ]
      },
      {
        title: "Questions to ask before choosing a facility",
        keyPoints: [
          "What skilled need is being documented?",
          "Is the facility Medicare-certified or in-network for the plan?",
          "What will the patient owe per day?",
          "What happens if coverage is denied, delayed, or stopped early?",
          "What is the backup plan if the patient still needs custodial help after rehab?"
        ]
      }
    ],
    example: {
      title: "A common discharge problem",
      body: "A patient needs therapy after pneumonia and weakness. The family hears 'rehab' and assumes Medicare will pay. The case manager explains that coverage depends on hospital status, skilled need, facility eligibility, and plan authorization. The family asks these questions before choosing a facility instead of after the first bill arrives."
    },
    relatedCalculator: { label: "Medicare Cost Exposure Tool", href: "/medicare-care-costs#cost-estimator" },
    commonMistakes: [
      "Assuming rehab is covered because a doctor recommends it.",
      "Waiting until discharge day to ask about inpatient versus observation status.",
      "Ignoring Medicare Advantage prior authorization and network rules.",
      "Confusing short-term rehab with long-term nursing home care."
    ],
    takeaway: "Medicare can cover short-term skilled rehab after a hospital stay, but only when specific coverage rules are met. Ask about hospital status, skilled need, authorization, network, daily cost, and the backup plan before discharge.",
    sources: [SOURCE_PRESETS.medicareSnf, SOURCE_PRESETS.medicareCosts, SOURCE_PRESETS.medicareCompareOriginalAdvantage, SOURCE_PRESETS.medicareLongTermCare],
  },
  {
    slug: "medicare-vs-medicaid-what-is-the-difference",
    title: "Medicare vs Medicaid: What Is the Difference?",
    category: "Medicare",
    readTime: "5 min read",
    promise: "Separate Medicare and Medicaid in plain English so patients and families know which program solves which problem.",
    audience: "Patients, caregivers, families, and healthcare workers who hear Medicare and Medicaid used together and need a simple map.",
    summary: "Medicare is federal health insurance mainly based on age, disability, or certain conditions. Medicaid is income/resource-based assistance run by states within federal rules. Some people have both and are called dual eligible. Medicare usually pays first for Medicare-covered services, while Medicaid may help with premiums, cost-sharing, and long-term services for people who qualify.",
    body: [
      "Medicare and Medicaid sound alike, but they solve different problems.",
      "The easiest memory trick is: Medicare is usually about age, disability, or qualifying condition. Medicaid is usually about income, resources, disability category, family status, or medical need under state rules.",
      "Some people qualify for both, which can make the paperwork confusing but can also reduce costs."
    ],
    sections: [
      {
        title: "Medicare",
        definition: "Federal health insurance mainly for people age 65 or older, certain younger people with disabilities, and people with specific conditions.",
        keyPoints: [
          "Not generally based on income.",
          "Includes Part A, Part B, Medicare Advantage, Part D, and sometimes Medigap as a supplement to Original Medicare.",
          "Can still involve premiums, deductibles, copays, coinsurance, and coverage limits."
        ],
        watchOut: "Medicare does not mean care is free, and it does not cover everything."
      },
      {
        title: "Medicaid",
        definition: "A joint federal-state program that helps eligible people with health coverage and certain long-term services under state rules.",
        keyPoints: [
          "Eligibility and benefits vary by state.",
          "Rules can involve income, resources, disability status, family status, age, pregnancy, or medical need.",
          "For older adults, Medicaid can matter when long-term services and supports become the real issue."
        ],
        watchOut: "A person may qualify in one state and not another, or may qualify for some Medicaid help but not every service."
      },
      {
        title: "Dual eligible",
        definition: "A person who has both Medicare and Medicaid.",
        keyPoints: [
          "Medicare generally pays first for Medicare-covered services.",
          "Medicaid may help with Medicare premiums, deductibles, coinsurance, or additional services depending on eligibility.",
          "Dual-eligible coverage can involve plan choices, coordination rules, and state-specific details."
        ]
      },
      {
        title: "Which program should a family call?",
        keyPoints: [
          "Call Medicare or the Medicare plan for Medicare-covered medical benefits, plan rules, drugs, and enrollment questions.",
          "Call the state Medicaid agency for Medicaid eligibility, long-term services, nursing home Medicaid, or state-specific assistance.",
          "Call SHIP for free Medicare counseling when comparing options or trying to understand coverage."
        ]
      }
    ],
    example: {
      title: "Why the difference matters",
      body: "A 70-year-old patient has Medicare and needs help after a stroke. Medicare may cover certain hospital, physician, drug, and limited skilled rehab costs. If the person later needs ongoing help with bathing, meals, and supervision, Medicaid eligibility may become the bigger question."
    },
    relatedCalculator: { label: "Medicare Cost Exposure Tool", href: "/medicare-care-costs#cost-estimator" },
    commonMistakes: [
      "Thinking Medicare and Medicaid are the same program.",
      "Assuming Medicare eligibility means Medicaid eligibility.",
      "Assuming Medicaid rules are identical in every state.",
      "Ignoring Medicaid until long-term care is already urgent."
    ],
    takeaway: "Medicare is mainly health insurance tied to age, disability, or certain conditions. Medicaid is state-administered assistance for people who qualify under income, resource, disability, family, or medical-need rules. Some people need both.",
    sources: [SOURCE_PRESETS.medicareParts, SOURCE_PRESETS.medicaidEligibility, SOURCE_PRESETS.cmsMedicaidCoordination, SOURCE_PRESETS.kffMedicaid101],
  },
  {
    slug: "what-does-medicare-not-cover",
    title: "What Does Medicare Not Cover?",
    category: "Medicare",
    readTime: "5 min read",
    promise: "A plain-English list of common Medicare coverage gaps that create surprise costs for patients and families.",
    audience: "Patients, caregivers, families, and healthcare workers who need to explain why Medicare coverage still leaves bills or uncovered needs.",
    summary: "Medicare does not cover everything. Original Medicare usually does not cover most long-term custodial care, most routine dental, routine vision, hearing aids, most care outside the United States, cosmetic services, and some non-medical support. Medicare Advantage and supplemental coverage may change some benefits, but plan rules, networks, and limits still matter.",
    body: [
      "Medicare is not an unlimited healthcare credit card.",
      "Many expensive surprises happen because families hear 'Medicare covers healthcare' and assume that means every medical, daily-care, dental, vision, hearing, or nursing-home need is covered.",
      "The practical move is to identify the gap early and ask which program, plan, or out-of-pocket source is supposed to pay."
    ],
    sections: [
      {
        title: "Most long-term custodial care",
        definition: "Ongoing help with daily living rather than short-term skilled medical or therapy care.",
        keyPoints: [
          "Bathing, dressing, toileting, meals, supervision, and daily safety help are common examples.",
          "Medicare may cover limited skilled care when strict rules are met.",
          "Medicaid may help people who qualify under state rules."
        ],
        watchOut: "This is one of the biggest Medicare misunderstandings."
      },
      {
        title: "Routine dental, vision, and hearing under Original Medicare",
        keyPoints: [
          "Original Medicare generally does not cover most routine dental care.",
          "Routine eye exams and eyeglasses are limited under Original Medicare rules.",
          "Hearing aids are generally not covered by Original Medicare.",
          "Some Medicare Advantage plans may include extra benefits, but details vary by plan."
        ]
      },
      {
        title: "Care outside the United States",
        keyPoints: [
          "Original Medicare generally does not cover care outside the United States except in limited situations.",
          "Travelers should verify Medigap, Medicare Advantage, travel insurance, or other coverage before assuming protection."
        ]
      },
      {
        title: "What to ask before assuming coverage",
        keyPoints: [
          "Is this service covered by Original Medicare, Medicare Advantage, Part D, Medigap, Medicaid, or another payer?",
          "Is the provider in-network or Medicare-approved?",
          "Is prior authorization required?",
          "What could the patient owe if the service is covered?",
          "What is the backup plan if the service is not covered?"
        ]
      }
    ],
    example: {
      title: "A coverage gap example",
      body: "A patient finishes a covered rehab stay but still cannot safely bathe, dress, cook, or stay alone. The family asks Medicare to cover long-term home aide support. Medicare may cover some skilled home health services when rules are met, but ongoing custodial daily help is usually a different problem."
    },
    relatedCalculator: { label: "Medicare Cost Exposure Tool", href: "/medicare-care-costs#cost-estimator" },
    commonMistakes: [
      "Assuming covered means free.",
      "Assuming Medicare Advantage extra benefits are the same in every county or plan.",
      "Assuming Medigap covers services Original Medicare does not cover.",
      "Waiting until a bill arrives to ask whether the service was covered."
    ],
    takeaway: "Medicare covers many important services, but it leaves major gaps. The biggest practical gaps are long-term custodial care, routine dental/vision/hearing under Original Medicare, foreign travel, and non-medical support needs.",
    sources: [SOURCE_PRESETS.medicare, SOURCE_PRESETS.medicareLongTermCare, SOURCE_PRESETS.medicareMedigap, SOURCE_PRESETS.medicareCompareOriginalAdvantage],
  },
  {
    slug: "why-do-i-still-owe-money-with-medicare",
    title: "Why Do I Still Owe Money With Medicare?",
    category: "Medicare",
    readTime: "5 min read",
    promise: "Explain why Medicare can pay part of a claim while the patient still owes premiums, deductibles, copays, coinsurance, or uncovered costs.",
    audience: "Medicare beneficiaries, caregivers, and healthcare workers helping families understand bills after Medicare or a Medicare plan processes a claim.",
    summary: "Medicare usually reduces healthcare costs, but it does not make every covered service free. A person may still owe Part B premiums, deductibles, coinsurance, copays, drug costs, Medicare Advantage cost-sharing, out-of-network costs, or charges for services Medicare does not cover. The first step is to match the bill to the Medicare Summary Notice, EOB, or plan explanation.",
    body: [
      "A Medicare bill can feel wrong when Medicare already paid something.",
      "But insurance payment and zero patient responsibility are not the same thing. Medicare may approve a service, pay its share, and still leave the patient with a deductible, copay, or coinsurance amount.",
      "Before paying, match the provider bill to the Medicare Summary Notice, Explanation of Benefits, or plan statement."
    ],
    sections: [
      {
        title: "Covered does not always mean free",
        definition: "Covered means the service is eligible under the program or plan. It does not always mean the patient's cost is zero.",
        keyPoints: [
          "Part B has a monthly premium for most people.",
          "Deductibles may apply before the plan pays its normal share.",
          "Coinsurance or copays may apply after coverage is approved.",
          "Prescription drugs can have separate plan rules and cost-sharing."
        ]
      },
      {
        title: "Original Medicare cost-sharing",
        keyPoints: [
          "Part A can have inpatient hospital deductibles and coinsurance in certain situations.",
          "Part B usually has a deductible and then coinsurance for many covered services.",
          "Original Medicare does not include a built-in annual out-of-pocket maximum for Part A and Part B services by itself.",
          "Medigap, Medicaid, employer retiree coverage, or other supplemental help may reduce some exposure."
        ],
        watchOut: "Original Medicare plus no supplement can leave repeated cost-sharing exposure."
      },
      {
        title: "Medicare Advantage cost-sharing",
        keyPoints: [
          "Medicare Advantage plans can have plan-specific copays, coinsurance, networks, referrals, and prior authorization rules.",
          "A $0 premium plan can still leave medical copays and drug costs.",
          "The plan's maximum out-of-pocket limit matters for covered Medicare medical services."
        ],
        watchOut: "Low premium does not automatically mean low total yearly cost."
      },
      {
        title: "What to check before paying",
        keyPoints: [
          "Match the bill to the Medicare Summary Notice or plan EOB.",
          "Confirm the date of service, provider, allowed amount, plan payment, and patient responsibility.",
          "Ask whether the charge is deductible, copay, coinsurance, out-of-network balance, drug cost, or non-covered service.",
          "Ask whether Medicaid, Extra Help, a Medicare Savings Program, Medigap, or financial assistance may apply."
        ]
      }
    ],
    example: {
      title: "A simple bill example",
      body: "A patient has an outpatient imaging test. Medicare approves the claim and pays its share. The provider bill still shows patient responsibility because the Part B deductible or coinsurance applies. The next step is not to panic; it is to compare the bill with the Medicare statement and confirm the patient responsibility amount."
    },
    relatedCalculator: { label: "Medicare Cost Exposure Tool", href: "/medicare-care-costs#cost-estimator" },
    commonMistakes: [
      "Thinking Medicare payment means the balance should be zero.",
      "Paying a bill before matching it to the Medicare statement or plan EOB.",
      "Ignoring Part B premiums and drug costs when comparing Medicare options.",
      "Assuming a Medicare Advantage plan's premium is the full cost of care."
    ],
    takeaway: "You can owe money with Medicare because premiums, deductibles, copays, coinsurance, drug costs, plan rules, and non-covered services can still apply. Match the bill to the Medicare or plan explanation before paying.",
    sources: [SOURCE_PRESETS.medicareCosts, SOURCE_PRESETS.medicareCompareOriginalAdvantage, SOURCE_PRESETS.medicareMedigap, SOURCE_PRESETS.medicaidEligibility],
  },
  {
    slug: "how-much-should-a-nurse-put-in-403b-per-paycheck",
    title: "How Much Should a Nurse Put in a 403(b) Per Paycheck?",
    category: "Build Wealth",
    readTime: "6 min read",
    promise: "A practical paycheck framework for nurses and healthcare workers deciding what 403(b) contribution percentage to start with.",
    audience: "Nurses, techs, respiratory therapists, pharmacists, APPs, and hospital workers choosing a 403(b) contribution percentage.",
    summary: "A strong starting point is usually enough to capture the full employer match, then increase over time as cash flow stabilizes. The right 403(b) percentage depends on take-home pay, emergency savings, high-interest debt, student loans, rent, family needs, and whether the contribution is Roth or pre-tax. Use the calculator to see what each percentage does to each paycheck before changing payroll elections.",
    body: [
      "The best 403(b) percentage is not the highest number you can force for one paycheck. It is the highest number you can keep without creating credit card debt, cash panic, or missed bills.",
      "For many healthcare workers, the first target is simple: contribute enough to receive the full employer match if the plan offers one and you can afford it.",
      "After that, increases can be gradual. A 1% increase after a raise or after paying off a debt can be more durable than a dramatic jump that gets reversed two paychecks later."
    ],
    sections: [
      {
        title: "Start with the employer match",
        definition: "The employer match is money your workplace may add when you contribute under plan rules.",
        keyPoints: [
          "Check the exact match formula in the benefits portal or plan document.",
          "Many workers should prioritize at least enough contribution to capture the full match when cash flow allows.",
          "Vesting rules determine when employer money fully belongs to you."
        ],
        watchOut: "Missing the match can be more expensive than choosing a slightly imperfect investment fund."
      },
      {
        title: "Then protect the paycheck",
        keyPoints: [
          "Keep enough take-home pay for rent, food, transportation, insurance, minimum debt payments, and predictable bills.",
          "Keep a cash buffer so one car repair or medical copay does not become credit card debt.",
          "Use pre-tax versus Roth intentionally because it can change current take-home pay."
        ]
      },
      {
        title: "A practical contribution ladder",
        keyPoints: [
          "Level 1: contribute enough for the match if affordable.",
          "Level 2: build emergency savings and pay down high-interest debt.",
          "Level 3: increase 403(b) contributions by 1% at a time.",
          "Level 4: work toward broader retirement goals only after the household cash flow is stable."
        ]
      },
      {
        title: "What to check before changing payroll",
        keyPoints: [
          "Is the contribution Roth or pre-tax?",
          "Does the percent apply to base pay only or to overtime/differentials too?",
          "What is the employer match formula and vesting schedule?",
          "What investment will the contribution buy inside the account?",
          "Will the new paycheck still cover the real monthly budget?"
        ]
      }
    ],
    example: {
      title: "A bedside nurse example",
      body: "A nurse earning biweekly pay starts at 6% because that captures the full employer match. After building a small emergency fund, the nurse increases to 7%, then 8% after the next raise. The plan is not dramatic, but it is repeatable and does not rely on perfect willpower after difficult shifts."
    },
    relatedCalculator: { label: "403(b) Paycheck Contribution Calculator", href: "/tools/403b-paycheck-calculator" },
    commonMistakes: [
      "Choosing a contribution so high that bills end up on a credit card.",
      "Contributing nothing while trying to pick the perfect fund.",
      "Forgetting to choose investments inside the account.",
      "Ignoring whether the contribution is Roth or pre-tax.",
      "Assuming overtime will always be available to fix cash-flow problems."
    ],
    takeaway: "For many nurses, the first 403(b) target is enough to get the employer match, then gradual increases as cash flow, debt, and emergency savings improve. Use the paycheck calculator before changing payroll elections.",
    sources: [SOURCE_PRESETS.irs, SOURCE_PRESETS.investorGovCompoundInterest, SOURCE_PRESETS.investorGovAssetAllocation, SOURCE_PRESETS.federalReserve],
  },
  {
    slug: "how-hospital-403b-matching-works",
    title: "How Hospital 403(b) Matching Works",
    category: "Build Wealth",
    readTime: "5 min read",
    promise: "Decode employer match formulas, vesting, payroll timing, and why the match is often the first retirement target for healthcare workers.",
    audience: "Healthcare workers trying to understand hospital retirement benefits, employer match, 401(a) contributions, and vesting rules.",
    summary: "A hospital 403(b) match is employer money added to your retirement plan when you contribute enough under the plan's formula. The match may be dollar-for-dollar, partial, capped at a percent of pay, or deposited into a related employer account such as a 401(a). Vesting rules can decide when employer money fully belongs to you. Always check the plan document, not just the benefits summary.",
    body: [
      "Hospital retirement benefits often look more confusing than they are because several concepts get stacked together: 403(b), 401(a), match, nonelective contribution, vesting, Roth, pre-tax, and investment election.",
      "The match is the part most workers should understand first because it can be one of the highest-value benefits in the package.",
      "The exact formula is employer-specific, so this page explains the structure to look for rather than pretending every hospital plan is identical."
    ],
    sections: [
      {
        title: "What a 403(b) match is",
        definition: "Employer money contributed because you contributed your own paycheck money under the plan's rules.",
        keyPoints: [
          "The match is usually based on a percentage of eligible pay.",
          "The employer may match dollar-for-dollar up to a cap or match only part of each dollar.",
          "Some hospitals deposit employer contributions into a related employer account, such as a 401(a)."
        ],
        watchOut: "The words 'up to' matter. A 100% match up to 6% of pay is not the same as a 6% automatic contribution."
      },
      {
        title: "Common match formula examples",
        keyPoints: [
          "100% of the first 3% you contribute.",
          "50% of the first 6% you contribute.",
          "A fixed employer contribution plus a smaller match.",
          "A nonelective contribution that does not require your own contribution, depending on plan rules."
        ],
        example: "If a worker earns $60,000 and the employer matches 100% up to 6%, contributing 6% could qualify for up to $3,600 of employer contributions before vesting or plan-specific rules."
      },
      {
        title: "Vesting",
        definition: "Vesting determines when employer contributions fully belong to you if you leave the job.",
        keyPoints: [
          "Your own contributions are generally yours immediately.",
          "Employer contributions may vest immediately or over several years.",
          "Leaving before vesting can mean forfeiting some employer money."
        ],
        watchOut: "Before leaving a hospital job, check whether waiting a short period would vest more employer contributions."
      },
      {
        title: "Investment choice still matters",
        keyPoints: [
          "The match gets money into the account, but the investment election determines what that money buys.",
          "Many workers use a target-date fund by default, but it is worth checking fees and risk.",
          "Changing the contribution percentage is not the same thing as changing the investment."
        ]
      }
    ],
    example: {
      title: "A hospital benefits portal example",
      body: "A nurse sees that the hospital matches 50% of the first 6% contributed. The nurse contributes 6%, receives the full available match under the formula, then checks vesting and investment elections. The worker now understands three separate decisions: contribution rate, employer money, and what the account owns."
    },
    relatedCalculator: { label: "403(b) Paycheck Contribution Calculator", href: "/tools/403b-paycheck-calculator" },
    commonMistakes: [
      "Assuming the hospital contributes the maximum even if you contribute nothing.",
      "Confusing Roth/pre-tax contribution choice with the employer match formula.",
      "Ignoring vesting when considering a job change.",
      "Thinking contribution percentage and investment selection are the same decision."
    ],
    takeaway: "A hospital 403(b) match is employer money tied to your own contributions under the plan's formula. Understand the match cap, vesting, payroll timing, and investment choice before leaving money on the table.",
    sources: [SOURCE_PRESETS.irs, SOURCE_PRESETS.investorGovMutualFunds, SOURCE_PRESETS.investorGovAssetAllocation],
  }
];
