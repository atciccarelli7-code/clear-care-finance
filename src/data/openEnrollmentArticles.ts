import type { Article } from "./articles";

const HC_DEDUCTIBLE = {
  name: "HealthCare.gov",
  pageTitle: "Deductible glossary",
  url: "https://www.healthcare.gov/glossary/deductible/",
  note: "Defines deductibles and explains copays, coinsurance, preventive care, separate deductibles, family deductibles, and premium tradeoffs."
};

const HC_OOP_MAX = {
  name: "HealthCare.gov",
  pageTitle: "Out-of-pocket maximum glossary",
  url: "https://www.healthcare.gov/glossary/out-of-pocket-maximum-limit/",
  note: "Defines out-of-pocket maximums and what they do not include."
};

const HC_COINSURANCE = {
  name: "HealthCare.gov",
  pageTitle: "Coinsurance glossary",
  url: "https://www.healthcare.gov/glossary/co-insurance/",
  note: "Defines coinsurance and gives deductible/coinsurance examples."
};

const HC_ALLOWED_AMOUNT = {
  name: "HealthCare.gov",
  pageTitle: "Allowed amount glossary",
  url: "https://www.healthcare.gov/glossary/allowed-amount/",
  note: "Defines allowed amount, eligible expense, payment allowance, and negotiated rate."
};

const HC_NETWORK = {
  name: "HealthCare.gov",
  pageTitle: "Network glossary",
  url: "https://www.healthcare.gov/glossary/network/",
  note: "Defines health insurance provider networks."
};

const HC_FORMULARY = {
  name: "HealthCare.gov",
  pageTitle: "Formulary glossary",
  url: "https://www.healthcare.gov/glossary/formulary/",
  note: "Defines a formulary as the prescription drug list covered by a plan."
};

const HC_PREAUTH = {
  name: "HealthCare.gov",
  pageTitle: "Preauthorization glossary",
  url: "https://www.healthcare.gov/glossary/preauthorization/",
  note: "Defines prior authorization and notes that it is not a payment guarantee."
};

const IRS_HSA_2026 = {
  name: "IRS",
  pageTitle: "Rev. Proc. 2025-19 — 2026 HSA and HDHP limits",
  url: "https://www.irs.gov/pub/irs-drop/rp-25-19.pdf",
  note: "Provides 2026 HSA limits, HDHP minimum deductibles, HDHP out-of-pocket limits, and excepted-benefit HRA amount."
};

const IRS_FSA_2026 = {
  name: "IRS",
  pageTitle: "Rev. Proc. 2025-32 — 2026 inflation adjustments",
  url: "https://www.irs.gov/pub/irs-drop/rp-25-32.pdf",
  note: "Includes 2026 health FSA salary reduction and carryover amounts."
};

const IRS_PUB_969 = {
  name: "IRS",
  pageTitle: "Publication 969 — HSAs and other tax-favored health plans",
  url: "https://www.irs.gov/publications/p969",
  note: "Explains HSAs, health FSAs, HRAs, qualified medical expenses, and health FSA reimbursement rules."
};

const IRS_PUB_503 = {
  name: "IRS",
  pageTitle: "Publication 503 — Child and dependent care expenses",
  url: "https://www.irs.gov/publications/p503",
  note: "Explains dependent care expenses, dependent care benefits, and the child and dependent care credit."
};

const IRS_PUB_15B = {
  name: "IRS",
  pageTitle: "Publication 15-B — Employer's Tax Guide to Fringe Benefits",
  url: "https://www.irs.gov/publications/p15b",
  note: "Explains employer fringe benefit tax treatment, including group-term life insurance coverage above $50,000."
};

const article = (item: Article): Article => ({ ...item, description: item.description ?? item.promise });

export const OPEN_ENROLLMENT_ARTICLES: Article[] = [
  article({
    slug: "open-enrollment-mistakes-healthcare-workers",
    title: "Open Enrollment Mistakes Healthcare Workers Make Every Year",
    category: "Open Enrollment",
    readTime: "8 min read",
    promise: "Avoid the benefit choices that quietly raise risk, reduce take-home pay, or leave healthcare workers underprotected.",
    audience: "Healthcare workers choosing employer benefits during open enrollment.",
    summary: "Open enrollment is not just picking health insurance. It is a one-year financial setup for premiums, medical risk, tax accounts, disability protection, life insurance, dental, vision, childcare, dependents, and paycheck deductions. Healthcare workers often know the clinical side of care but still underestimate plan design, disability risk, spouse rules, medication coverage, and payroll impact.",
    body: [
      "Open enrollment is easy to rush because it happens during real life: shifts, overtime, family schedules, holidays, and benefit portals that do not explain the tradeoffs clearly.",
      "The biggest mistake is treating the cheapest paycheck deduction as the cheapest plan. The real question is premium plus expected care plus worst-case exposure plus the benefits you would actually use.",
      "Healthcare workers should also think differently about disability coverage. A bedside job depends on the body, and one injury, pregnancy complication, surgery, or chronic condition can interrupt income."
    ],
    sections: [
      { title: "Mistake 1: picking only by paycheck premium", keyPoints: ["Low premium plans often shift more cost to deductibles, coinsurance, and out-of-pocket exposure.", "High premium plans may be worth it for predictable care, medications, pregnancy, surgery, or chronic conditions.", "Compare expected-year and bad-year cost before choosing."] },
      { title: "Mistake 2: ignoring prescriptions", keyPoints: ["Check the formulary before enrollment closes.", "Look for separate prescription deductibles, specialty tiers, prior authorization, step therapy, and preferred pharmacy rules.", "One medication can change the best plan choice."] },
      { title: "Mistake 3: skipping disability insurance", keyPoints: ["Healthcare work is physically and emotionally demanding.", "Short-term and long-term disability protect income differently.", "Ask whether benefits are taxable, how long the waiting period is, and whether the definition is own occupation or any occupation."] },
      { title: "Mistake 4: forgetting spouse and kids", keyPoints: ["Two-worker households should compare both employer plans.", "Check spouse surcharge rules and whether children can be placed on the better pediatric network.", "Family deductibles and family out-of-pocket limits can work differently than individual coverage."] },
      { title: "Mistake 5: not checking paycheck impact", keyPoints: ["Medical, dental, vision, HSA, FSA, disability, life, supplemental policies, and retirement elections all hit payroll.", "Pre-tax benefits reduce taxable pay, but the paycheck still changes.", "Run the paycheck impact before submitting elections."] }
    ],
    example: { title: "The rushed nurse example", body: "A nurse picks the lowest premium plan because she is healthy. She forgets a planned MRI, an expensive medication, and the employer HSA contribution on another plan. The cheaper paycheck option ends up more expensive by spring." },
    relatedCalculator: { label: "Open Enrollment True Cost Calculator", href: "/tools/open-enrollment-true-cost" },
    commonMistakes: ["Picking by premium only.", "Ignoring medications and preferred pharmacies.", "Skipping disability insurance because you are young.", "Forgetting spouse surcharge rules.", "Adding every supplemental policy without checking the annual premium.", "Not updating beneficiaries."],
    takeaway: "Open enrollment should be treated like a one-year household risk plan, not a checkbox. Compare total cost, worst-case exposure, payroll impact, and income protection.",
    sources: [HC_DEDUCTIBLE, HC_OOP_MAX, HC_FORMULARY, HC_NETWORK, IRS_HSA_2026]
  }),
  article({
    slug: "premium-deductible-out-of-pocket-open-enrollment",
    title: "Premium, Deductible, and Out-of-Pocket Max: How to Compare Health Plans",
    category: "Open Enrollment",
    readTime: "7 min read",
    promise: "Learn the three numbers that decide whether a health plan is cheap, risky, or actually a good fit.",
    audience: "Workers comparing employer health plans during open enrollment.",
    summary: "The premium is what comes out of your paycheck. The deductible is what you pay for covered care before the plan starts paying for many services. The out-of-pocket maximum is your annual in-network cap for covered services, but it does not include premiums, non-covered care, out-of-network care, or costs above the allowed amount. The best plan is not always the lowest premium plan.",
    body: ["A health plan should be compared in two ways: expected-year cost and bad-year exposure.", "Expected-year cost asks what you will likely spend if the year goes mostly as planned. Bad-year exposure asks what happens if someone has surgery, hospitalization, a complicated pregnancy, a serious injury, or a new diagnosis.", "The right choice depends on cash cushion, expected care, prescriptions, employer HSA or HRA money, and household risk tolerance."],
    sections: [
      { title: "Premium", definition: "The amount you pay to keep coverage active, usually taken from each paycheck.", keyPoints: ["Premiums count even if you never use care.", "A low premium can be useful if you have cash for a higher deductible.", "A high premium can be worth it if it meaningfully lowers expected medical costs or risk."] },
      { title: "Deductible", definition: "The amount you pay for covered services before the plan starts paying for many benefits.", keyPoints: ["Some services can be covered before the deductible.", "Prescription drugs may have a separate deductible.", "Family plans can have both individual and family deductibles."] },
      { title: "Out-of-pocket maximum", definition: "The most you pay in a plan year for covered in-network services, excluding premiums and several other costs.", keyPoints: ["It includes deductibles, copays, and coinsurance for covered in-network care.", "It does not include premiums, out-of-network care, non-covered services, or some amounts above allowed charges.", "This is the bad-year number to compare."] },
      { title: "Employer HSA/HRA money", keyPoints: ["Employer account money can offset deductible risk.", "Do not ignore it when comparing plans.", "A plan with a higher deductible can still be competitive if the premium savings and employer contribution are large enough."] }
    ],
    example: { title: "The $80/paycheck trap", body: "Plan A costs $80 less per paycheck than Plan B. Over 26 paychecks, that saves $2,080. But if Plan A has a $4,000 higher out-of-pocket max and no employer HSA money, it may be cheaper only in a healthy year." },
    relatedCalculator: { label: "Open Enrollment True Cost Calculator", href: "/tools/open-enrollment-true-cost" },
    commonMistakes: ["Only comparing premiums.", "Ignoring employer HSA contributions.", "Not checking prescription deductibles.", "Assuming the out-of-pocket max includes premiums.", "Not comparing worst-case exposure."],
    takeaway: "Compare premium, expected spending, employer account money, and out-of-pocket max together. A health plan is a risk tradeoff, not just a payroll deduction.",
    sources: [HC_DEDUCTIBLE, HC_OOP_MAX, HC_COINSURANCE, HC_ALLOWED_AMOUNT, IRS_HSA_2026]
  }),
  article({
    slug: "spouse-family-health-insurance-open-enrollment",
    title: "Should You Put Your Spouse or Kids on Your Health Insurance?",
    category: "Open Enrollment",
    readTime: "7 min read",
    promise: "Use a household framework for spouse coverage, spouse surcharges, family deductibles, and children's networks.",
    audience: "Couples and families comparing employer health plans during open enrollment.",
    summary: "Two-worker households should not automatically put everyone on one plan. Compare both employers' premiums, spouse surcharge rules, family deductibles, family out-of-pocket maximums, doctors, hospitals, pediatric networks, prescriptions, and employer HSA or HRA contributions. Sometimes one plan for everyone is best. Sometimes split coverage is better.",
    body: ["Spouse coverage is one of the most expensive open enrollment decisions because the wrong choice repeats every paycheck for a year.", "Some employers charge a spouse surcharge if the spouse has access to their own employer plan. Some make spouse coverage less attractive through higher family premiums.", "Children add another layer because pediatricians, specialists, urgent care, children's hospitals, and medications may differ by network."],
    sections: [
      { title: "Start with both employer options", keyPoints: ["Compare employee-only, employee-plus-spouse, employee-plus-children, and family premiums.", "Check whether either employer contributes to an HSA or HRA.", "Look for spouse surcharge or working-spouse rules."] },
      { title: "Family deductible design", keyPoints: ["Ask whether the plan has embedded or aggregate deductibles.", "Check individual and family out-of-pocket maximums.", "A plan can be good for one adult and poor for a family."], watchOut: "Family coverage is not just employee-only coverage multiplied by more people." },
      { title: "Network and prescription fit", keyPoints: ["Check each spouse's doctors and medications.", "Check pediatricians and children's hospitals if you have kids.", "Do not assume the same hospital system means the same network for every plan."] },
      { title: "When split coverage can make sense", keyPoints: ["One spouse has expensive medications covered better on their own plan.", "One employer charges a spouse surcharge.", "Kids have a better pediatric network on one parent's plan.", "One plan has better maternity, specialist, or mental health access."] }
    ],
    example: { title: "The split-plan example", body: "A couple compares both employers. The spouse surcharge makes family coverage expensive on one plan, while the children's doctors are in-network on the other. They split coverage instead of defaulting everyone to one plan." },
    relatedCalculator: { label: "Open Enrollment True Cost Calculator", href: "/tools/open-enrollment-true-cost" },
    commonMistakes: ["Assuming family coverage is automatically cheaper.", "Missing spouse surcharge rules.", "Ignoring children's doctors and medications.", "Not checking both family out-of-pocket maxes.", "Assuming one employer's plan is always better."],
    takeaway: "Compare spouse and family coverage like a household insurance portfolio. The best answer may be one plan, two plans, or kids on a different parent plan.",
    sources: [HC_DEDUCTIBLE, HC_OOP_MAX, HC_NETWORK, HC_FORMULARY]
  }),
  article({
    slug: "prescription-coverage-open-enrollment-checklist",
    title: "Before You Pick a Health Plan, Check Your Medications",
    category: "Open Enrollment",
    readTime: "6 min read",
    promise: "Avoid choosing a plan that looks cheap until one medication changes the math.",
    audience: "Workers and families with recurring prescriptions or possible medication changes.",
    summary: "Prescription coverage can make or break an open enrollment decision. Check whether each medication is on the formulary, which tier it falls into, whether a deductible applies, whether prior authorization or step therapy is required, and whether a preferred pharmacy or mail-order program changes the cost.",
    body: ["Many workers check doctors but forget medications. That can be expensive.", "A plan's formulary is the covered drug list. The same medication can land on different tiers across plans, and specialty drugs can be especially sensitive to plan rules.", "The safest approach is to check every recurring medication before enrollment closes, including dose, quantity, pharmacy, and generic alternatives."],
    sections: [
      { title: "Formulary", definition: "The plan's list of covered prescription drugs.", keyPoints: ["Check each medication by exact name, dose, and form.", "Generic, preferred brand, non-preferred brand, and specialty tiers can have different costs.", "Formularies can change each year."] },
      { title: "Prior authorization and step therapy", keyPoints: ["Some drugs require plan approval before coverage.", "Step therapy may require trying a cheaper alternative first.", "Approval is not always a promise the plan will pay every cost."] },
      { title: "Pharmacy rules", keyPoints: ["Preferred pharmacies can cost less.", "Mail order can be cheaper for maintenance medications.", "A pharmacy can be in-network but not preferred."] },
      { title: "Prescription deductible", keyPoints: ["Some plans have a separate drug deductible.", "Some drugs may bypass the deductible while others do not.", "Expensive prescriptions should be included in total plan comparison."] }
    ],
    example: { title: "The inhaler example", body: "A respiratory medication is $20 on one plan but subject to a deductible and prior authorization on another. The lower premium plan loses once medication costs are included." },
    relatedCalculator: { label: "Open Enrollment True Cost Calculator", href: "/tools/open-enrollment-true-cost" },
    commonMistakes: ["Checking only doctors, not drugs.", "Not checking dosage and quantity.", "Ignoring preferred pharmacy rules.", "Missing prior authorization requirements.", "Assuming last year's formulary still applies."],
    takeaway: "Medication coverage should be checked before plan selection, not after the first refill of the new year.",
    sources: [HC_FORMULARY, HC_PREAUTH, HC_DEDUCTIBLE]
  }),
  article({
    slug: "network-checklist-open-enrollment",
    title: "In-Network Is Not One Checkbox: What to Verify During Open Enrollment",
    category: "Open Enrollment",
    readTime: "6 min read",
    promise: "Use a practical network checklist before choosing a plan for the next year.",
    audience: "Workers comparing plan networks, doctors, hospitals, labs, and pharmacies.",
    summary: "A network is the facilities, providers, and suppliers contracted with a health plan. During open enrollment, workers should check more than a favorite doctor. Verify primary care, specialists, hospitals, urgent care, imaging, labs, behavioral health, pharmacies, and children's providers. A plan can have a low premium and still be a bad fit if the network creates friction or out-of-network risk.",
    body: ["Network mistakes often show up when care is already needed.", "Open enrollment is the time to check access before the new plan year locks in. A network is not just the hospital brand on the brochure; it includes provider groups, labs, imaging centers, pharmacies, and behavioral health access.", "For healthcare workers, this matters even more because employer-owned facilities may not cover every specialist, outside referral, child provider, or spouse's doctor."],
    sections: [
      { title: "Network", definition: "The facilities, providers, and suppliers contracted with a health plan.", keyPoints: ["Check provider names, not just hospital logos.", "Confirm locations and billing groups.", "Use the insurer's directory and call the office when the decision is high-stakes."] },
      { title: "What to verify", keyPoints: ["Primary care provider.", "Specialists.", "Preferred hospital and emergency department.", "Urgent care centers.", "Imaging and labs.", "Mental health providers.", "Pharmacies.", "Children's providers."] },
      { title: "Higher-risk situations", keyPoints: ["Pregnancy or fertility treatment.", "Planned surgery.", "Chronic disease specialists.", "Expensive imaging.", "Kids with specialists.", "Therapy or psychiatry access."] },
      { title: "What not to assume", keyPoints: ["A doctor listed last year is still in-network.", "A hospital being in-network means every clinician involved is in-network.", "A pharmacy being in-network means it is preferred.", "A referral guarantees payment."] }
    ],
    example: { title: "The specialist problem", body: "A worker checks that the hospital is in-network but forgets to check a child's specialist. The plan saves premium dollars but creates higher specialty care costs and scheduling problems." },
    relatedCalculator: { label: "Open Enrollment True Cost Calculator", href: "/tools/open-enrollment-true-cost" },
    commonMistakes: ["Checking only the hospital system.", "Not checking labs and imaging.", "Ignoring mental health access.", "Trusting an old provider directory without confirming.", "Forgetting kids and spouse providers."],
    takeaway: "Network fit is a practical access issue and a financial issue. Verify providers and services before enrollment closes.",
    sources: [HC_NETWORK, HC_ALLOWED_AMOUNT, HC_FORMULARY]
  }),
  article({
    slug: "disability-insurance-healthcare-workers-open-enrollment",
    title: "Disability Insurance for Healthcare Workers: The Benefit You Should Not Ignore",
    category: "Open Enrollment",
    readTime: "7 min read",
    promise: "Understand short-term and long-term disability before an injury or illness threatens your income.",
    audience: "Healthcare workers whose income depends on physical, cognitive, and emotional capacity to work.",
    summary: "Disability insurance is income protection. Short-term disability usually helps during shorter absences; long-term disability may help if an illness or injury keeps you out much longer. Healthcare workers should check the waiting period, benefit percentage, maximum benefit, tax treatment, pre-existing condition rules, pregnancy coverage, mental health limitations, and whether the definition is own occupation or any occupation.",
    body: ["For bedside workers, income depends on the ability to move, lift, think clearly, chart, communicate, manage stress, and safely care for patients.", "That makes disability coverage one of the most important open enrollment choices. It is not exciting, but it protects the paycheck that funds every other goal.", "The key is understanding what the plan actually pays and under what definition of disability."],
    sections: [
      { title: "Short-term disability", definition: "Coverage designed to replace part of income during a shorter qualifying disability period.", keyPoints: ["Often used for surgery recovery, pregnancy-related leave, injury, or short-term illness.", "Usually has a waiting period.", "Benefit percentage and duration vary by employer plan."] },
      { title: "Long-term disability", definition: "Coverage designed to replace part of income after a longer disability period.", keyPoints: ["Can matter if you cannot return to your job for months or longer.", "The definition of disability matters.", "Some policies shift from own occupation to any occupation after a period of time."] },
      { title: "Tax treatment", keyPoints: ["If the employer pays premiums pre-tax, benefits may be taxable.", "If you pay premiums after-tax, benefits may be tax-free under many arrangements.", "Read your plan documents and ask HR how premiums are treated."] },
      { title: "Healthcare-worker questions", keyPoints: ["Does the plan cover pregnancy-related disability?", "How are back injuries, mental health, and chronic conditions handled?", "What is the elimination period?", "What documentation is required?", "Does it coordinate with PTO, workers' compensation, or state benefits?"] }
    ],
    example: { title: "The back injury example", body: "A nurse cannot safely lift or transfer patients after a back injury. PTO covers only part of the absence. Disability coverage can be the difference between a temporary setback and a cash-flow crisis." },
    relatedCalculator: { label: "Paycheck Impact Calculator", href: "/tools/open-enrollment-paycheck-impact" },
    commonMistakes: ["Skipping coverage because you are young.", "Not checking the waiting period.", "Assuming PTO is enough.", "Ignoring tax treatment.", "Not reading the definition of disability."],
    takeaway: "Disability insurance is not a side benefit for healthcare workers. It is paycheck protection for a physically and emotionally demanding profession.",
    sources: [IRS_PUB_15B]
  }),
  article({
    slug: "employer-life-insurance-open-enrollment",
    title: "Employer Life Insurance: Helpful, But Usually Not a Full Plan",
    category: "Open Enrollment",
    readTime: "6 min read",
    promise: "Know what basic life, supplemental life, guaranteed issue, and portability mean before checking the box.",
    audience: "Workers reviewing basic and supplemental life insurance during open enrollment.",
    summary: "Employer life insurance can be useful, especially basic employer-paid coverage. But it is often tied to employment, may be limited to a multiple of salary, may require evidence of insurability above guaranteed-issue amounts, and may not be portable at the same cost after leaving the job. Employer-provided group-term life insurance coverage above $50,000 can also create taxable wage treatment under IRS rules.",
    body: ["Employer life insurance is easy to overestimate because the enrollment screen makes coverage look simple.", "Basic life insurance is helpful, but workers with a spouse, children, debt, or future dependents usually need to compare the amount to actual household needs.", "The biggest limitation is job dependency. Losing or changing a job can affect coverage."],
    sections: [
      { title: "Basic life", definition: "Employer-provided coverage, often a flat amount or multiple of salary.", keyPoints: ["Often automatic or low-cost.", "May not be enough for dependents.", "Usually tied to employment."] },
      { title: "Supplemental life", definition: "Extra life insurance the employee elects and pays for.", keyPoints: ["May be available in salary multiples.", "May require evidence of insurability above guaranteed-issue amounts.", "Costs can rise with age bands."] },
      { title: "Taxable group-term life issue", keyPoints: ["IRS rules generally allow exclusion of up to $50,000 of employer-provided group-term life coverage from wages.", "Coverage above $50,000 can create imputed taxable wages.", "This is usually not a reason to avoid needed coverage, but it explains a common paycheck/W-2 surprise."] },
      { title: "Portability and conversion", keyPoints: ["Ask what happens if you leave the employer.", "Portable coverage may cost more.", "Conversion may be available but not always attractive."] }
    ],
    example: { title: "The one-times-salary problem", body: "A worker has one times salary in basic life insurance but a mortgage, student loans, a spouse, and a child. The employer benefit helps, but it is not a full household protection plan." },
    relatedCalculator: { label: "Paycheck Impact Calculator", href: "/tools/open-enrollment-paycheck-impact" },
    commonMistakes: ["Assuming employer life insurance is enough.", "Forgetting coverage may end with the job.", "Ignoring evidence-of-insurability rules.", "Not naming beneficiaries.", "Not noticing imputed income over $50,000 of employer-provided coverage."],
    takeaway: "Employer life insurance is useful, but workers should compare it to household needs and understand job dependency, underwriting, portability, and beneficiaries.",
    sources: [IRS_PUB_15B]
  }),
  article({
    slug: "accident-critical-illness-hospital-indemnity-open-enrollment",
    title: "Accident, Critical Illness, and Hospital Indemnity: Real Benefit or Paycheck Leak?",
    category: "Open Enrollment",
    readTime: "7 min read",
    promise: "Evaluate supplemental health policies without confusing them for major medical insurance.",
    audience: "Workers deciding whether to add accident, critical illness, or hospital indemnity coverage.",
    summary: "Accident, critical illness, and hospital indemnity policies are usually supplemental cash-benefit products. They may pay a set amount when a covered event happens, but they do not replace major medical insurance and they may not match the actual hospital bill. The decision should compare annual premium, emergency fund, deductible exposure, likely benefit triggers, exclusions, and whether the same dollars would be better used for an HSA, FSA, emergency fund, or debt.",
    body: ["Supplemental policies can be useful, but they are easy to buy emotionally.", "The enrollment pitch often focuses on scary events. The financial question is simpler: what is the annual premium, what exact event triggers payment, how much would it pay, and do you already have enough cash to handle the gap?", "These policies are not bad by default. They are not essential by default either."],
    sections: [
      { title: "Accident insurance", definition: "A supplemental policy that may pay fixed benefits after covered accidents.", keyPoints: ["Useful only if the event meets policy definitions.", "May help with deductibles or missed work costs.", "Check exclusions and benefit schedule."] },
      { title: "Critical illness", definition: "A policy that may pay a lump sum for listed diagnoses such as heart attack, stroke, or cancer, depending on policy terms.", keyPoints: ["Definitions matter.", "Pre-existing condition rules may apply.", "Not every serious diagnosis triggers payment."] },
      { title: "Hospital indemnity", definition: "A policy that may pay a set amount for hospital admission or hospital days.", keyPoints: ["May help with deductible exposure.", "Payment may not match the actual hospital bill.", "Read admission, ICU, observation, and recurrence rules."] },
      { title: "Decision framework", keyPoints: ["Calculate the annual premium.", "Compare it to your deductible and emergency fund.", "Read the benefit schedule before buying.", "Avoid buying every optional policy just because each one feels cheap per paycheck."] }
    ],
    example: { title: "The $18/paycheck bundle", body: "A worker buys multiple supplemental policies for $18 per paycheck. That is $468 per year over 26 paychecks. If the emergency fund is already strong and the policy triggers are narrow, the money may be better directed elsewhere." },
    relatedCalculator: { label: "Supplemental Benefits Decision Helper", href: "/tools/supplemental-benefits" },
    commonMistakes: ["Treating supplemental policies like health insurance.", "Only looking at the per-paycheck cost.", "Not reading benefit triggers.", "Ignoring exclusions.", "Buying policies instead of building an emergency fund."],
    takeaway: "Supplemental policies can help fill gaps, but only when the benefit triggers, annual premium, and household cash position make sense.",
    sources: [HC_DEDUCTIBLE, HC_OOP_MAX]
  }),
  article({
    slug: "dental-vision-insurance-open-enrollment",
    title: "Dental and Vision Insurance: What to Check Before Adding Them",
    category: "Open Enrollment",
    readTime: "6 min read",
    promise: "Avoid overbuying add-ons by checking annual maximums, frequency limits, and real expected use.",
    audience: "Workers deciding whether dental or vision coverage is worth the payroll deduction.",
    summary: "Dental and vision benefits are not the same as major medical insurance. Dental plans often have annual maximums, waiting periods, preventive/basic/major categories, and frequency limits. Vision plans often work more like discount math: exam copay, frame allowance, lens coverage, contact allowance, and frequency limits. The right question is whether the benefit beats paying cash for what you will actually use.",
    body: ["Dental and vision are popular because the deductions look small. But small deductions over 26 paychecks are still real money.", "Dental insurance is most valuable when preventive care and likely treatment make the annual premium worthwhile. Vision coverage is most valuable when the exam, frame/contact allowance, and lens benefits beat cash pricing.", "Both should be checked against actual use, not fear of missing out."],
    sections: [
      { title: "Dental plan checklist", keyPoints: ["Annual maximum benefit.", "Preventive, basic, and major coverage percentages.", "Waiting periods.", "Frequency limits for X-rays, cleanings, crowns, and replacements.", "Orthodontic lifetime maximum if relevant."] },
      { title: "Vision plan checklist", keyPoints: ["Exam copay.", "Frame allowance.", "Contact lens allowance.", "Lens upgrades and add-ons.", "How often exams, frames, lenses, or contacts are covered."] },
      { title: "Break-even mindset", keyPoints: ["Annual premium equals per-paycheck premium times pay periods.", "Compare that annual cost to the care you will actually use.", "Do not pay for a plan mainly because it feels incomplete to skip it."] },
      { title: "Healthcare-worker angle", keyPoints: ["Shift work makes scheduling preventive care harder.", "Dental pain can interrupt work fast.", "Vision needs matter for charting, driving, night shift, and screen-heavy work."] }
    ],
    example: { title: "The vision plan example", body: "A vision plan costs $7 per paycheck, or $182 per year. If the worker only uses a basic exam and buys cheap glasses elsewhere, cash pay may be better. If they use contacts, lens upgrades, and an in-network provider, the plan may win." },
    relatedCalculator: { label: "Paycheck Impact Calculator", href: "/tools/open-enrollment-paycheck-impact" },
    commonMistakes: ["Assuming dental covers major work like medical insurance.", "Ignoring annual maximums.", "Ignoring frequency limits.", "Overbuying vision coverage when cash pricing is cheaper.", "Forgetting orthodontic lifetime limits."],
    takeaway: "Dental and vision can be useful, but they should pass a simple annual premium versus expected-use test.",
    sources: []
  }),
  article({
    slug: "health-fsa-vs-dependent-care-fsa",
    title: "Health FSA vs Dependent Care FSA: Same Name, Totally Different Use",
    category: "Open Enrollment",
    readTime: "6 min read",
    promise: "Do not mix up medical expense money with childcare or dependent-care money.",
    audience: "Workers choosing FSA elections during open enrollment.",
    summary: "A health FSA is for eligible medical expenses. A dependent care FSA is for qualifying care that allows you and your spouse, if filing jointly, to work or look for work. They are separate accounts with different rules. Health FSA money cannot simply be used for daycare, and dependent care FSA money cannot simply be used for medical bills.",
    body: ["The word FSA creates confusion because employers may offer more than one type.", "A health FSA helps reimburse qualified medical expenses. A dependent care FSA helps pay for eligible childcare or dependent care so the taxpayer can work or look for work.", "The election should be based on predictable expenses because unused funds can be restricted by plan rules."],
    sections: [
      { title: "Health FSA", definition: "An employer arrangement that reimburses eligible medical expenses.", keyPoints: ["Used for eligible medical, dental, vision, and prescription expenses.", "The full elected annual amount is generally available during the coverage period.", "Plans may have carryover or grace period rules, but not always."] },
      { title: "Dependent care FSA", definition: "An account for qualifying care expenses that allow you to work or look for work.", keyPoints: ["Often used for daycare, preschool, before/after-school care, or adult dependent care.", "Rules depend on qualifying person and work-related care requirements.", "It interacts with the child and dependent care tax credit, so tax planning matters."] },
      { title: "Do not cross the accounts", keyPoints: ["Health FSA dollars are not childcare dollars.", "Dependent care FSA dollars are not medical dollars.", "Elect each one based on the right category of predictable expenses."] },
      { title: "Open enrollment questions", keyPoints: ["What is the health FSA limit and carryover?", "What is the dependent care limit for my filing status?", "What receipts are required?", "What is the runout deadline?", "Can I change elections after enrollment only for qualifying events?"] }
    ],
    example: { title: "The daycare confusion", body: "A worker contributes to a health FSA thinking it can help with daycare. It cannot. Dependent care needs a separate election under the dependent care FSA rules." },
    relatedCalculator: { label: "HSA vs FSA Decision Helper", href: "/tools/hsa-vs-fsa" },
    commonMistakes: ["Using the wrong FSA type.", "Overfunding based on guesses.", "Ignoring runout deadlines.", "Assuming carryover applies to every FSA.", "Forgetting dependent care rules interact with tax credits."],
    takeaway: "Health FSA and dependent care FSA are separate tools. Use each for the correct kind of expense and only elect amounts you can justify with predictable need.",
    sources: [IRS_PUB_969, IRS_FSA_2026, IRS_PUB_503]
  }),
  article({
    slug: "open-enrollment-paycheck-impact",
    title: "How Open Enrollment Changes Your Paycheck",
    category: "Open Enrollment",
    readTime: "6 min read",
    promise: "See how benefit elections stack up before your first paycheck of the new plan year surprises you.",
    audience: "Workers who want to understand payroll deductions before submitting benefit elections.",
    summary: "Open enrollment decisions affect take-home pay through medical, dental, vision, HSA, FSA, dependent care FSA, disability, life insurance, supplemental policies, parking, transit, and retirement deductions. Some deductions are pre-tax and reduce taxable pay. Others may be after-tax. The correct question is not only whether a benefit is useful, but what the combined paycheck impact will be.",
    body: ["Benefit elections feel small when viewed one line at a time. Together, they can materially change take-home pay.", "The paycheck impact is not always equal to the deduction amount because pre-tax elections reduce taxable pay. But the cash still leaves the paycheck.", "Workers should model the combined effect before submitting elections, especially when also increasing retirement contributions."],
    sections: [
      { title: "Common pre-tax deductions", keyPoints: ["Medical premiums.", "Dental and vision premiums if offered through a cafeteria plan.", "HSA or FSA contributions.", "Dependent care FSA contributions.", "Traditional retirement contributions may reduce income tax but still generally count for payroll-tax purposes."] },
      { title: "Common after-tax or special deductions", keyPoints: ["Some disability premiums.", "Supplemental life insurance.", "Accident, critical illness, or hospital indemnity policies.", "Roth retirement contributions.", "Union dues, parking, or other employer-specific deductions."] },
      { title: "Why tax treatment matters", keyPoints: ["Pre-tax deductions reduce taxable wages.", "After-tax deductions do not reduce current taxable pay.", "Disability premium tax treatment can affect whether future benefits are taxable."] },
      { title: "Best practice", keyPoints: ["Add every election together before submitting.", "Convert per-paycheck cost to annual cost.", "Make sure the benefit stack still leaves room for rent, savings, emergency fund, and debt payments."] }
    ],
    example: { title: "The stacked deduction example", body: "A worker adds medical, dental, vision, HSA, disability, life, critical illness, and a retirement increase. Each line looked small, but the combined take-home reduction is much larger than expected." },
    relatedCalculator: { label: "Paycheck Impact Calculator", href: "/tools/open-enrollment-paycheck-impact" },
    commonMistakes: ["Only looking at one deduction at a time.", "Forgetting annual cost.", "Confusing pre-tax with free.", "Not checking disability tax treatment.", "Submitting elections before modeling the first paycheck."],
    takeaway: "Open enrollment is a paycheck decision as much as a benefits decision. Stack the deductions before submitting elections.",
    sources: [IRS_PUB_15B, IRS_PUB_969]
  }),
  article({
    slug: "beneficiaries-open-enrollment-checklist",
    title: "The 10-Minute Open Enrollment Task That Prevents a Legal Mess",
    category: "Open Enrollment",
    readTime: "5 min read",
    promise: "Use open enrollment to update beneficiaries before life changes create avoidable problems.",
    audience: "Workers reviewing life insurance, retirement accounts, HSAs, and workplace benefits.",
    summary: "Open enrollment is a natural time to check beneficiaries. Review employer life insurance, supplemental life, retirement accounts, HSAs, pensions, 401(a), 403(b), 401(k), and any old accounts. Marriage, divorce, children, death in the family, new accounts, and job changes can make old beneficiary choices wrong.",
    body: ["Beneficiary updates are boring until they matter.", "The problem is that benefits often transfer by beneficiary designation, not by what someone casually meant to do. Old elections can create conflict after a death or major life change.", "Open enrollment is an easy annual trigger to review every account."],
    sections: [
      { title: "Accounts to check", keyPoints: ["Basic life insurance.", "Supplemental life insurance.", "Retirement plan.", "HSA.", "Pension or 401(a) if applicable.", "Old employer accounts.", "IRA and brokerage transfer-on-death settings."] },
      { title: "Life events that require review", keyPoints: ["Marriage.", "Divorce.", "Birth or adoption.", "Death of a beneficiary.", "New job.", "New retirement account.", "Breakup or changed family relationship."] },
      { title: "Primary vs contingent beneficiary", keyPoints: ["Primary beneficiary receives the asset first.", "Contingent beneficiary receives it if the primary beneficiary cannot.", "Percentages should total 100%."], watchOut: "Do not leave old beneficiary choices in place because the portal is annoying." },
      { title: "Documentation", keyPoints: ["Save confirmation pages.", "Tell the right person where documents are stored.", "Review annually during open enrollment."] }
    ],
    example: { title: "The old account problem", body: "A worker changes jobs, opens a new retirement plan, and forgets an old employer account. Years later, the old beneficiary is still listed. Annual review catches this before it becomes a family problem." },
    relatedCalculator: { label: "Paycheck Impact Calculator", href: "/tools/open-enrollment-paycheck-impact" },
    commonMistakes: ["Only updating life insurance, not retirement accounts.", "Forgetting contingent beneficiaries.", "Leaving an ex-partner listed.", "Not saving confirmation.", "Ignoring old employer accounts."],
    takeaway: "Open enrollment is the perfect annual reminder to update beneficiaries across insurance, retirement, HSA, and old accounts.",
    sources: [IRS_PUB_15B]
  })
];
