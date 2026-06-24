import type { Source } from "./sources";
import { SOURCE_PRESETS } from "./sources";

export type ArticleSection = {
  title: string;
  definition?: string;
  keyPoints?: string[];
  watchOut?: string;
  example?: string;
};

export type Article = {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  promise: string;                  // one-sentence promise
  audience: string;                 // who this is for
  summary: string;                  // 60-second summary
  body: string[];                   // plain-English paragraphs (fallback)
  sections?: ArticleSection[];      // optional fact-sheet sections
  example?: { title: string; body: string };
  relatedCalculator?: { label: string; href: string };
  commonMistakes?: string[];
  takeaway: string;
  sources: Source[];
  description?: string;             // backward-compat for cards
};

const a = (article: Article): Article => ({
  ...article,
  description: article.description ?? article.promise,
});

export const ARTICLES: Article[] = [
  a({
    slug: "medicare-options-explained",
    title: "Medicare Options Explained",
    category: "Medicare",
    readTime: "6 min read",
    promise: "Understand the difference between Original Medicare, Medicare Advantage, Part D, and Medigap — in plain English.",
    audience: "Older adults, caregivers, healthcare workers, and families trying to understand Medicare choices without getting buried in insurance language.",
    summary: "Medicare is not one simple plan. Original Medicare is Parts A and B from the federal government. Medicare Advantage is a private plan alternative, also called Part C. Part D helps with outpatient prescription drugs. Medigap can help pay Original Medicare cost-sharing. Medicaid is separate and may help people with limited income and resources.",
    body: [
      "Medicare is not one simple plan. It is a system of parts, private plan options, supplemental coverage, drug coverage, and sometimes Medicaid help. The wrong assumption can create expensive surprises.",
      "The simplest way to understand Medicare is this: Original Medicare is the federal Medicare program, made up of Part A and Part B. Medicare Advantage, also called Part C, is a private plan alternative for receiving Part A and Part B benefits. Part D helps pay for outpatient prescription drugs. Medigap is supplemental insurance that can help pay Original Medicare cost-sharing. Medicaid is separate from Medicare and may help people with limited income and resources.",
      "Medicare helps pay for healthcare, but it does not make healthcare free. A person can be on Medicare and still owe premiums, deductibles, copays, coinsurance, drug costs, and long-term care costs.",
      "Original Medicare includes Part A hospital insurance and Part B medical insurance. A person using Original Medicare can usually see any doctor or hospital that accepts Medicare anywhere in the United States. The tradeoff is that Original Medicare has cost-sharing and does not include a yearly out-of-pocket maximum by itself.",
      "Many people with Original Medicare add a Part D prescription drug plan, a Medigap policy, or both. Part D helps with outpatient prescriptions. Medigap can help pay some of the deductibles, copays, and coinsurance that Original Medicare leaves behind.",
      "Medicare Advantage plans are private plans approved by Medicare. They must cover medically necessary services that Original Medicare covers, but they can use networks, referrals, prior authorization, and plan-specific cost-sharing.",
      "The attraction of Medicare Advantage is simplicity and a spending cap. Plans often include Part D drug coverage and may include extra benefits that Original Medicare does not cover, such as dental, vision, hearing, transportation, or fitness benefits. Medicare Advantage plans also have a yearly limit on what a person pays for covered Medicare services.",
      "The risk of Medicare Advantage is that a low premium does not automatically mean low total cost. The person still needs to check doctors, hospitals, specialists, prescription drugs, prior authorization rules, referral rules, in-network versus out-of-network costs, maximum out-of-pocket exposure, and travel coverage.",
      "Part A helps cover inpatient hospital care, skilled nursing facility care for a limited time, hospice care, and some home health care. Most people do not pay a monthly Part A premium because they or a spouse paid Medicare taxes long enough while working. But Part A can still create bills through deductibles and coinsurance.",
      "Part B helps cover doctor visits, outpatient care, preventive services, durable medical equipment, lab services, imaging, and other medical services. Part B usually has a monthly premium, an annual deductible, and coinsurance for many covered services.",
      "Part C is Medicare Advantage. A person must have Part A and Part B to join Medicare Advantage and usually must keep paying the Part B premium. Some Medicare Advantage plans have a zero-dollar premium, but that does not mean care is free.",
      "Part D helps pay for outpatient prescription drugs. Part D coverage can come through a standalone Part D plan paired with Original Medicare, or through a Medicare Advantage plan that includes drug coverage. Medication lists should be checked every year because formularies, pharmacies, premiums, and drug costs can change.",
      "Medigap is private supplemental insurance that works with Original Medicare. It can help pay some of the cost-sharing that Original Medicare leaves behind. Important distinction: Medigap is for Original Medicare. A person generally cannot use Medigap to pay Medicare Advantage costs.",
      "Medicaid is a separate program from Medicare. Medicare is mainly age, disability, or condition-based health insurance. Medicaid is income and resource-based assistance, with rules that vary by state.",
      "For older adults, Medicaid matters because it may help with costs Medicare does not fully cover, including long-term services and supports for people who qualify under state rules.",
      "Original Medicare and Medicare Advantage solve different problems. Original Medicare usually offers broader provider access and flexibility. Medicare Advantage may offer bundled benefits and an annual out-of-pocket limit, but it often requires staying within a provider network and following plan rules.",
      "The hidden risk is Original Medicare without supplemental coverage. People who have Original Medicare but no Medigap, Medicaid, employer or union retiree coverage, or other supplemental help can be exposed to repeated deductibles, coinsurance, and no built-in annual cap for Part A and Part B services.",
      "The biggest Medicare misunderstanding is long-term care. Medicare does not pay for most long-term custodial care. Custodial care means help with activities of daily living such as bathing, dressing, toileting, eating, meals, transportation, and supervision over time.",
      "Medicare may cover skilled nursing facility care for a limited time when strict rules are met, but that is not the same as long-term custodial nursing home care.",
      "Before choosing a Medicare path, ask: Are my doctors covered? Are my hospitals covered? Are my specialists covered? Are my prescriptions covered? What is the monthly premium? What is the deductible? What copays or coinsurance apply? Is there a yearly out-of-pocket maximum? Do I need referrals? Does the plan require prior authorization? What happens if I travel? Could I qualify for Medicaid, Extra Help, or a Medicare Savings Program? Do I need a long-term care plan?",
      "Medicare is powerful, but it is not automatic full protection. The right choice is not the plan with the flashiest brochure or the lowest premium. The right choice is the one that fits the person’s doctors, medications, health needs, travel habits, total yearly cost, and long-term care risk.",
    ],
    sections: [
      {
        title: "Original Medicare",
        definition: "The federal Medicare program — Part A (hospital) and Part B (medical) — run directly by the government.",
        keyPoints: [
          "Usually lets a person see any doctor or hospital that accepts Medicare nationwide.",
          "Has deductibles and coinsurance, and no built-in yearly out-of-pocket maximum on its own.",
          "Most people pay no Part A premium, but Part B has a monthly premium.",
          "Often paired with a Part D drug plan and sometimes a Medigap policy.",
        ],
        watchOut: "Without Medigap, Medicaid, or retiree coverage, repeated deductibles and coinsurance can add up with no annual cap.",
      },
      {
        title: "Medicare Advantage (Part C)",
        definition: "A private plan alternative for receiving Part A and Part B benefits, approved by Medicare.",
        keyPoints: [
          "Must cover medically necessary services that Original Medicare covers.",
          "Usually uses networks, referrals, and prior authorization rules.",
          "Has a yearly limit on what a person pays for covered Medicare services.",
          "Often includes Part D drug coverage and may add dental, vision, hearing, or fitness benefits.",
          "A person still generally pays the Part B premium, even on a $0-premium plan.",
        ],
        watchOut: "A low premium does not mean low total cost. Check doctors, hospitals, drugs, prior authorization rules, and travel coverage before enrolling.",
      },
      {
        title: "Part D — Prescription Drugs",
        definition: "Outpatient prescription drug coverage, offered either as a standalone plan with Original Medicare or bundled inside a Medicare Advantage plan.",
        keyPoints: [
          "Each plan has its own formulary (list of covered drugs) and preferred pharmacies.",
          "Costs include premium, deductible, and copays or coinsurance per prescription.",
          "Formularies, premiums, and pharmacy networks can change every year.",
        ],
        watchOut: "Skipping a yearly Part D review can mean paying more for the same medications or losing coverage for a needed drug.",
      },
      {
        title: "Medigap (Medicare Supplement)",
        definition: "Private supplemental insurance that helps pay some of the deductibles, copays, and coinsurance Original Medicare leaves behind.",
        keyPoints: [
          "Works only with Original Medicare, not Medicare Advantage.",
          "Sold in standardized plan letters, so the same letter plan offers the same core benefits across insurers.",
          "Does not include drug coverage — a separate Part D plan is usually added.",
        ],
        watchOut: "Switching from Medicare Advantage back to Original Medicare plus Medigap later may involve medical underwriting depending on timing and state rules.",
      },
      {
        title: "Medicaid",
        definition: "A separate program from Medicare based on income and resources, with rules that vary by state.",
        keyPoints: [
          "May help pay Medicare premiums, deductibles, and coinsurance for people who qualify.",
          "Can help cover long-term services and supports that Medicare does not fully cover.",
          "People with both Medicare and Medicaid are sometimes called dual-eligible.",
        ],
        watchOut: "Eligibility, covered services, and long-term care rules are set at the state level — always verify with the state Medicaid agency.",
      },
      {
        title: "What Medicare usually does not cover",
        keyPoints: [
          "Most long-term custodial care, such as ongoing help with bathing, dressing, toileting, meals, and supervision.",
          "Most routine dental, vision, and hearing care under Original Medicare.",
          "Care received outside the United States in most situations.",
          "Cosmetic procedures and most non-medical services.",
        ],
        watchOut: "Medicare may cover a limited skilled nursing facility stay when strict rules are met — that is not the same as long-term nursing home care.",
      },
      {
        title: "How to choose",
        keyPoints: [
          "Decide on the structure first: Original Medicare (often with Part D and Medigap) or Medicare Advantage.",
          "Then compare specific plans based on doctors, hospitals, medications, and total yearly cost.",
          "Consider travel needs, network rules, and prior authorization requirements.",
          "Check whether Medicaid, Extra Help, or a Medicare Savings Program could lower costs.",
        ],
      },
      {
        title: "Questions to ask before enrolling",
        keyPoints: [
          "Are my doctors, hospitals, and specialists covered?",
          "Are my prescriptions on the plan's formulary, and at what cost?",
          "What is the monthly premium, deductible, and out-of-pocket maximum?",
          "Do I need referrals or prior authorization for common services?",
          "What happens if I travel or need care out of state?",
          "Could I qualify for Medicaid, Extra Help, or a Medicare Savings Program?",
          "Do I have a plan for long-term care, which Medicare generally does not cover?",
        ],
      },
    ],
    commonMistakes: [
      "Assuming Medicare means healthcare is free.",
      "Choosing a Medicare Advantage plan without checking doctors, hospitals, drugs, network rules, and prior authorization.",
      "Using Original Medicare without understanding deductibles, coinsurance, and the lack of a built-in yearly out-of-pocket limit.",
      "Assuming Medicare covers most long-term custodial care.",
      "Skipping Part D review even when medications change.",
    ],
    takeaway: "Pick the Medicare structure first: Original Medicare plus Part D and possibly Medigap, or Medicare Advantage. Then compare specific plans based on doctors, medications, total yearly cost, travel needs, and long-term care risk.",
    sources: [SOURCE_PRESETS.medicare, SOURCE_PRESETS.cms, SOURCE_PRESETS.kff],
  }),
  a({
    slug: "discharge-coverage-guide",
    title: "Discharge Coverage Guide",
    category: "Medicare",
    readTime: "5 min read",
    promise: "What Medicare will and won't pay for when a patient leaves the hospital.",
    audience: "Bedside clinicians, case managers, and families planning a discharge.",
    summary: "Medicare may cover a short stay in a skilled nursing facility after a qualifying inpatient hospital stay. It generally does not cover long-term custodial care.",
    body: ["Paste this article from Notion."],
    takeaway: "Ask about inpatient vs. observation status early — it determines what Medicare will pay for after discharge.",
    sources: [SOURCE_PRESETS.medicare, SOURCE_PRESETS.cms],
  }),
  a({
    slug: "long-term-care-and-custodial-care",
    title: "Long-Term Care and Custodial Care",
    category: "Medicare",
    readTime: "6 min read",
    promise: "Why Medicare doesn't pay for most long-term help, and what Medicaid may cover instead.",
    audience: "Adult children helping aging parents plan ahead.",
    summary: "Custodial care = help with bathing, dressing, toileting, eating. Medicare generally does not cover this. Medicaid is the primary public program that does, for those who qualify financially.",
    body: ["Paste this article from Notion."],
    takeaway: "Plan early. Long-term care decisions are easier when they're not urgent.",
    sources: [SOURCE_PRESETS.medicare, SOURCE_PRESETS.medicaid, SOURCE_PRESETS.kff],
  }),
  a({
    slug: "plain-english-glossary",
    title: "Plain-English Healthcare Finance Glossary",
    category: "Insurance",
    readTime: "4 min read",
    promise: "The 25 terms that show up on benefits paperwork and hospital bills — defined like a human.",
    audience: "Anyone who has ever stared at an EOB.",
    summary: "Deductible, copay, coinsurance, premium, allowed amount, out-of-pocket max, HSA, FSA — defined in one or two sentences each.",
    body: ["See the full glossary on the Glossary page."],
    relatedCalculator: { label: "Insurance Visit Cost Calculator", href: "/tools/insurance-visit-cost" },
    takeaway: "Most insurance confusion disappears once you can name the four cost-sharing pieces: premium, deductible, copay, coinsurance.",
    sources: [SOURCE_PRESETS.healthcareGov, SOURCE_PRESETS.kff],
  }),
  a({
    slug: "workplace-benefits-definitions",
    title: "Workplace Benefits Definitions",
    category: "Workplace Benefits",
    readTime: "5 min read",
    promise: "Decode open enrollment paperwork without calling HR.",
    audience: "Hospital employees, new hires, nurses, techs, respiratory therapists, CNAs, pharmacists, APPs, physicians, EVS staff, food service staff, and anyone comparing benefits during open enrollment.",
    summary: "Workplace benefits are part of your real compensation. This guide explains premiums, deductibles, copays, coinsurance, HSAs, FSAs, HRAs, 403(b)s, employer match, vesting, disability insurance, beneficiaries, COBRA, FMLA, and open enrollment in plain English.",
    body: [
      "Every year, hospital employees are asked to make expensive financial decisions using language most people were never taught: premium, deductible, coinsurance, HSA, FSA, HRA, 403(b), 401(a), employer match, vesting, short-term disability, long-term disability, beneficiary, COBRA, FMLA, and open enrollment.",
      "These words show up in the benefits portal, but the portal rarely explains what they mean in real life. This guide translates the most common workplace benefits terms into plain English so healthcare workers can understand what they are choosing before they click enroll.",
      "Workplace benefits are part of your compensation. Your hourly wage or salary is only one piece of your real pay package. Your employer may also provide health insurance, retirement contributions, disability coverage, paid time off, life insurance, tuition assistance, wellness incentives, and other benefits.",
      "The problem is that benefits are confusing, and confusion is expensive. When people misunderstand benefits, they may choose the wrong health plan, miss employer retirement match, fail to name beneficiaries, underuse an HSA or FSA, misunderstand disability coverage, assume life insurance is enough, miss open enrollment deadlines, ignore tax advantages, or get surprised by a bill or unpaid leave.",
      "Before choosing benefits, ask three questions: What comes out of my paycheck? What could I owe if something bad happens? What free or employer-subsidized money am I leaving on the table?",
      "Open enrollment is the period when you can choose or change certain workplace benefits for the next plan year. Plain English: this is your yearly benefits decision window. If you miss it, you may be locked into your old choices unless you have a qualifying life event.",
      "A qualifying life event is a major life change that may allow you to change benefits outside open enrollment. Examples may include marriage, divorce, birth or adoption of a child, loss of other coverage, change in employment status, or death of a covered family member.",
      "A premium is the amount you pay to keep insurance active. For hospital employees, this is usually the amount taken from your paycheck for medical, dental, or vision coverage. The lowest premium plan is not automatically the cheapest plan overall.",
      "A deductible is the amount you may have to pay for covered healthcare services before your insurance plan starts meaningfully sharing the bill. A copay is a fixed amount you pay for a covered service. Coinsurance is a percentage of the cost that you pay after deductible rules are met.",
      "The out-of-pocket maximum is the most you have to pay for covered in-network services in a plan year. This is one of the most important numbers on the benefits page because it shows your potential worst-case year.",
      "A network is the group of doctors, hospitals, pharmacies, and other providers that contract with your insurance plan. In-network care usually costs less. Out-of-network care may cost more or may not be covered except in emergencies.",
      "An HSA, or Health Savings Account, is a tax-advantaged medical savings account that you own. To contribute, you generally need to be covered by an HSA-eligible high-deductible health plan and meet other IRS rules.",
      "An FSA, or Flexible Spending Account, lets employees set aside pre-tax money for qualified medical expenses, subject to plan rules. An FSA can be useful, but it usually has stricter use-it-or-lose-it rules than an HSA.",
      "An HRA, or Health Reimbursement Arrangement, is employer-funded money that can reimburse certain medical expenses under plan rules. Unlike an HSA, an HRA is usually controlled by the employer and may not follow you if you leave.",
      "A 403(b) is a retirement plan often offered by nonprofit hospitals, public schools, and certain tax-exempt organizations. Plain English: a 403(b) is the nonprofit hospital-world cousin of a 401(k).",
      "A 401(a) plan is an employer-sponsored retirement plan where the employer often controls contribution rules. Some healthcare systems use a 403(b) for employee contributions and a 401(a) for employer contributions.",
      "An employer match is money your employer contributes based on your own retirement contributions. Plain English: this is usually the closest thing to free money in your benefits package.",
      "Vesting means ownership. Your own retirement contributions are usually yours immediately, but employer contributions may require a certain number of years of service before they are fully yours.",
      "A pre-tax contribution lowers taxable income now, but withdrawals are generally taxed later. A Roth contribution is made after taxes now, but qualified withdrawals may be tax-free later.",
      "A beneficiary is the person or people who receive the account or insurance benefit if you die. Update beneficiaries after marriage, divorce, having children, family conflict, or the death of a loved one.",
      "Short-term disability insurance may replace part of your income for a limited time if you cannot work because of a qualifying illness, injury, pregnancy, or recovery period. Long-term disability insurance may protect income if a major health problem keeps you out of work for months or years.",
      "PTO is paid time away from work. Sick time is paid time specifically for illness or medical needs, depending on employer policy. Shift differential is extra pay for working certain shifts, such as nights, weekends, evenings, or holidays.",
      "FMLA, or the Family and Medical Leave Act, may provide job-protected leave for eligible employees who meet certain rules. Plain English: FMLA may protect your job, but it does not automatically mean paid leave.",
      "COBRA may allow certain employees and family members to continue employer health coverage after losing coverage, usually by paying the full premium themselves. Plain English: COBRA can preserve coverage, but it can be expensive.",
      "The goal is not to memorize every benefits term. The goal is to understand enough to make better choices: what comes out of your paycheck, what your worst-case year could cost, and what employer money you do not want to miss."
    ],
    relatedCalculator: { label: "403(b) Paycheck Contribution Calculator", href: "/tools/403b-contribution" },
    commonMistakes: [
      "Choosing the lowest-premium health plan without checking the deductible and out-of-pocket maximum.",
      "Missing the employer retirement match.",
      "Forgetting to update beneficiaries after major life changes.",
      "Confusing HSA, FSA, and HRA rules.",
      "Ignoring disability coverage because you are young and healthy."
    ],
    takeaway: "Workplace benefits are compensation. Before enrolling, ask what comes out of your paycheck, what your worst-case year could cost, and what employer money you do not want to miss.",
    sources: [SOURCE_PRESETS.irs, SOURCE_PRESETS.healthcareGov],
  }),
  a({
    slug: "how-to-pick-retirement-investments-at-work",
    title: "How to Pick Retirement Investments at Work",
    category: "Retirement",
    readTime: "7 min read",
    promise: "A non-scary framework for choosing funds inside your 403(b) menu.",
    audience: "Healthcare workers who got a fund list and didn't know where to start.",
    summary: "Look for a low-cost target-date fund matching your retirement year, or a simple mix of broad index funds. Avoid funds with high expense ratios.",
    body: ["Paste this article from Notion."],
    relatedCalculator: { label: "403(b) Paycheck Contribution Calculator", href: "/tools/403b-contribution" },
    commonMistakes: [
      "Leaving contributions in the default money-market fund for years.",
      "Picking high-fee actively managed funds without comparing expense ratios.",
      "Not enrolling at all and missing the employer match.",
    ],
    takeaway: "Boring usually wins. Low-cost, diversified, and consistent beats clever.",
    sources: [SOURCE_PRESETS.irs, SOURCE_PRESETS.federalReserve],
  }),
  a({
    slug: "hospital-cafe-habit",
    title: "Your Hospital Café Habit Might Be Quietly Eating Your Savings Rate",
    category: "Spending",
    readTime: "5 min read",
    promise: "A non-shaming look at how small daily spend on shift adds up over a year.",
    audience: "Healthcare workers who feel like money disappears between paychecks.",
    summary: "Coffee + snack + lunch on shift can quietly run $3,000–$6,000 a year. The point isn't to never buy coffee; it's to see the number.",
    body: ["Paste this article from Notion."],
    relatedCalculator: { label: "Hospital Café Savings Rate Calculator", href: "/tools/hospital-cafe-savings" },
    takeaway: "Run the number once. Decide consciously. No shame, no rules.",
    sources: [SOURCE_PRESETS.bls, SOURCE_PRESETS.federalReserve],
  }),
  a({
    slug: "healthcare-worker-discounts",
    title: "Healthcare Worker Discounts and Perks Directory",
    category: "Workplace Benefits",
    readTime: "3 min read",
    promise: "Where healthcare workers can legitimately get a discount — and which ones are worth the friction.",
    audience: "Nurses, techs, and bedside clinicians.",
    summary: "Verified discount programs (ID.me, SheerID) for retailers, gyms, phone plans, and travel. We avoid spammy affiliate links.",
    body: ["Paste this article from Notion."],
    takeaway: "Stack the discounts that match what you'd already buy. Skip the ones that just create new purchases.",
    sources: [],
  }),
  a({
    slug: "burnout-overspending-overeating",
    title: "Burnout, Overspending, and Overeating After Hard Shifts",
    category: "Spending",
    readTime: "6 min read",
    promise: "Why post-shift decisions hit your wallet and your body — and what helps.",
    audience: "Anyone whose hardest financial decisions happen at 7:30pm on a 12-hour day.",
    summary: "Decision fatigue and cortisol push us toward immediate relief. Awareness, pre-planned defaults, and recovery time matter more than willpower.",
    body: ["Paste this article from Notion."],
    takeaway: "Design your post-shift environment so the default choice is also the kind one.",
    sources: [SOURCE_PRESETS.federalReserve],
  }),
  a({
    slug: "deductible-copay-coinsurance-out-of-pocket-max",
    title: "Deductible, Copay, Coinsurance, and Out-of-Pocket Max",
    category: "Insurance",
    readTime: "7 min read",
    promise: "Understand the four health insurance numbers that decide what a covered medical visit may cost you.",
    audience: "Patients, caregivers, new healthcare workers, and anyone comparing insurance plans or trying to understand a bill.",
    summary: "Most medical bill confusion comes from four plan terms: deductible, copay, coinsurance, and out-of-pocket maximum. The deductible is what you may pay before insurance shares costs. A copay is a fixed amount. Coinsurance is a percentage. The out-of-pocket maximum is the in-network yearly ceiling for covered services, but it does not include every possible cost.",
    body: [
      "Health insurance does not usually mean the insurance company pays every bill immediately. The plan first applies its rules, negotiates or recognizes an allowed amount, then splits the cost between the plan and the patient.",
      "The four numbers to understand are deductible, copay, coinsurance, and out-of-pocket maximum. Once those are clear, most medical bills become easier to predict and easier to question.",
      "This guide is educational. Always verify plan-specific rules with the insurer, employer benefits portal, Marketplace documents, Medicare materials, Medicaid agency, or the provider billing office."
    ],
    sections: [
      {
        title: "Deductible",
        definition: "The amount you may have to pay for covered healthcare services before your insurance plan starts meaningfully sharing certain costs.",
        keyPoints: [
          "A deductible usually resets each plan year.",
          "Some services may be covered before the deductible, depending on the plan.",
          "A high deductible can make an insured person still owe a large bill early in the year.",
        ],
        watchOut: "Do not assume covered means free. Covered means the service is eligible under the plan, not that your cost is zero.",
        example: "If your deductible is $2,000 and you have met $500, you may still owe $1,500 before coinsurance rules begin for many services.",
      },
      {
        title: "Copay",
        definition: "A fixed dollar amount you pay for a covered service, such as a primary care visit, specialist visit, urgent care visit, or prescription.",
        keyPoints: [
          "Copays are usually easier to understand because the dollar amount is fixed.",
          "Different services can have different copays.",
          "Some plans apply copays before or after deductible rules, so check the plan document.",
        ],
        watchOut: "A copay does not always mean that no other cost can apply. Labs, imaging, procedures, or separate bills may be handled differently.",
      },
      {
        title: "Coinsurance",
        definition: "A percentage of the allowed amount that you pay after deductible rules are met.",
        keyPoints: [
          "Common examples are 10%, 20%, or 30% of the allowed amount.",
          "Coinsurance is based on the plan's allowed amount, not necessarily the provider's sticker price.",
          "Coinsurance can feel unpredictable because the final allowed amount may not be obvious upfront.",
        ],
        watchOut: "A 20% coinsurance rate can still be expensive when the allowed amount is large, such as for surgery, imaging, or a hospital stay.",
        example: "If the allowed amount is $1,000 and your coinsurance is 20%, your share may be $200 after deductible rules are satisfied.",
      },
      {
        title: "Out-of-pocket maximum",
        definition: "The most you pay in a plan year for covered, in-network services under the plan's rules.",
        keyPoints: [
          "Deductibles, copays, and coinsurance for covered in-network care usually count toward this limit.",
          "Premiums usually do not count toward the out-of-pocket maximum.",
          "Out-of-network care, non-covered services, and charges above allowed amounts may not be protected the same way.",
        ],
        watchOut: "The out-of-pocket maximum is a safety cap, not a promise that every possible healthcare cost is capped.",
      },
      {
        title: "What to check before care",
        keyPoints: [
          "Is the provider in-network?",
          "Is the facility in-network?",
          "How much deductible remains?",
          "Does this service use a copay, coinsurance, or both?",
          "What has already counted toward the out-of-pocket maximum?",
          "Could the service require prior authorization?",
        ],
      },
    ],
    example: {
      title: "A simple hospital bill example",
      body: "A patient has a $2,000 deductible, has already met $500, and has 20% coinsurance. If a covered in-network hospital service has a $10,000 allowed amount, the patient may first owe the remaining $1,500 deductible. Then they may owe 20% of the remaining $8,500, or $1,700, unless the out-of-pocket maximum limits the bill. Estimated patient responsibility: $3,200."
    },
    relatedCalculator: { label: "Health Insurance Visit Cost Calculator", href: "/tools/insurance-visit-cost" },
    commonMistakes: [
      "Thinking covered means free.",
      "Comparing plans by premium only, without checking deductible and out-of-pocket maximum.",
      "Forgetting that premiums usually do not count toward the out-of-pocket maximum.",
      "Ignoring whether the provider and facility are both in-network.",
      "Assuming coinsurance is based on the sticker price instead of the allowed amount."
    ],
    takeaway: "Most medical bills become easier to understand when you separate the four cost-sharing pieces: deductible, copay, coinsurance, and out-of-pocket maximum.",
    sources: [SOURCE_PRESETS.healthcareGov, SOURCE_PRESETS.kff],
  }),
  a({
    slug: "how-to-read-an-eob",
    title: "How to Read an Explanation of Benefits Without Losing Your Mind",
    category: "Hospital Bills",
    readTime: "6 min read",
    promise: "Learn how to compare your EOB to the actual medical bill before you pay.",
    audience: "Patients, caregivers, and anyone trying to understand what insurance allowed, paid, denied, or assigned to them.",
    summary: "An Explanation of Benefits, or EOB, is not a bill. It is the insurer's explanation of how a claim was processed. The medical bill comes from the provider. Before paying a confusing bill, compare the EOB and the provider bill for the same date of service, provider, allowed amount, insurance payment, and patient responsibility.",
    body: [
      "An Explanation of Benefits is one of the most useful documents in medical billing, but it is also one of the easiest to ignore because it looks like another bill.",
      "The EOB usually comes from the insurance company. The bill comes from the doctor, hospital, lab, imaging center, or other provider. The EOB tells you how the claim was processed. The provider bill tells you what someone is asking you to pay.",
      "Before paying a large or confusing medical bill, compare the two documents. The amount requested by the provider should generally make sense next to the patient responsibility shown by the insurer."
    ],
    sections: [
      {
        title: "EOB",
        definition: "A statement from your insurer explaining how a claim was processed.",
        keyPoints: [
          "It is usually generated after a provider submits a claim.",
          "It may show billed charges, allowed amount, discounts, insurance payment, denials, and patient responsibility.",
          "It often says it is not a bill.",
        ],
        watchOut: "Do not pay the EOB itself. Use it to understand whether the provider bill makes sense.",
      },
      {
        title: "Provider bill",
        definition: "A request for payment from the hospital, doctor, lab, imaging center, or other provider.",
        keyPoints: [
          "It may arrive before or after insurance finishes processing the claim.",
          "It may use an account number instead of the insurer's claim number.",
          "It should be compared with the EOB before payment, especially for large balances.",
        ],
        watchOut: "If the provider bill asks for more than the EOB says you owe, call before paying.",
      },
      {
        title: "Allowed amount",
        definition: "The amount the insurance plan recognizes for a covered service under the plan's rules or contract.",
        keyPoints: [
          "The allowed amount can be much lower than the original billed charge.",
          "Patient cost-sharing is usually calculated from the allowed amount, not the chargemaster price.",
          "If a claim is out-of-network or denied, the allowed amount may work differently.",
        ],
        watchOut: "A provider's billed charge is not automatically the amount you should personally pay.",
      },
      {
        title: "Patient responsibility",
        definition: "The amount the insurer says may be your share after applying plan rules.",
        keyPoints: [
          "This can include deductible, copay, coinsurance, denied amounts, or non-covered services.",
          "It should be checked against the provider bill.",
          "If the claim is still pending, wait for final processing before paying when possible.",
        ],
      },
      {
        title: "What to compare before paying",
        keyPoints: [
          "Patient name and date of service.",
          "Provider or facility name.",
          "Claim number, account number, or invoice number.",
          "Billed charge and allowed amount.",
          "Insurance payment and adjustments.",
          "Patient responsibility on the EOB versus the provider bill amount.",
        ],
      },
    ],
    example: {
      title: "When the bill and EOB do not match",
      body: "A provider bills $1,200. The insurer's EOB shows a $450 allowed amount, $300 paid by insurance, and $150 patient responsibility. If the provider then sends a bill for $1,200, do not pay automatically. Call the provider billing office and insurer and ask why the provider bill does not match the EOB."
    },
    relatedCalculator: { label: "Health Insurance Visit Cost Calculator", href: "/tools/insurance-visit-cost" },
    commonMistakes: [
      "Paying the first bill before insurance finishes processing.",
      "Ignoring the allowed amount.",
      "Confusing the EOB with a bill.",
      "Assuming every denial is final.",
      "Calling billing without the date of service, claim number, or account number."
    ],
    takeaway: "The EOB is your map. The bill is the payment request. Compare them before paying any large, confusing, or surprising medical balance.",
    sources: [SOURCE_PRESETS.cms, SOURCE_PRESETS.healthcareGov, SOURCE_PRESETS.kff],
  }),
  a({
    slug: "why-er-visit-is-expensive",
    title: "Why an ER Visit Can Be So Expensive",
    category: "Hospital Bills",
    readTime: "6 min read",
    promise: "Understand the pieces that can turn one emergency visit into several separate charges.",
    audience: "Patients, caregivers, and healthcare workers who want a plain-English explanation of emergency department bills.",
    summary: "An ER visit can be expensive because the final bill may include a hospital facility fee, a separate emergency physician charge, labs, imaging, medications, supplies, observation care, and insurance cost-sharing. Insurance can reduce the price, but deductibles, copays, coinsurance, network rules, and separate bills can still leave the patient with a large balance.",
    body: [
      "An emergency room bill rarely reflects just one doctor visit. It can be a bundle of hospital readiness, facility charges, professional services, diagnostics, supplies, medications, and insurance cost-sharing.",
      "That does not mean every bill is correct or easy to understand. It means patients should know which pieces can appear before deciding whether the balance makes sense.",
      "The goal is not to avoid emergency care when it is truly needed. The goal is to understand the bill, compare it with the EOB, ask for an itemized statement, and question charges that look wrong."
    ],
    sections: [
      {
        title: "Facility fee",
        definition: "The hospital's charge for using the emergency department and the 24/7 system behind it.",
        keyPoints: [
          "The ER is staffed and equipped for emergencies at all hours.",
          "Facility charges can vary based on visit complexity and hospital billing rules.",
          "This fee is separate from the clinician's professional fee.",
        ],
        watchOut: "Patients often think the ER bill is only for the provider they saw. The facility component can be a large part of the bill.",
      },
      {
        title: "Separate physician or provider bill",
        definition: "The emergency physician, advanced practice provider, radiologist, anesthesiologist, or other clinician may bill separately from the hospital.",
        keyPoints: [
          "One ER visit can generate more than one bill.",
          "A hospital bill and physician bill may arrive weeks apart.",
          "Insurance may process each claim separately.",
        ],
        watchOut: "Do not assume a second bill is automatically a duplicate. Compare dates, providers, services, and EOBs.",
      },
      {
        title: "Labs, imaging, medications, and supplies",
        definition: "Tests and treatments ordered during the visit can each add cost.",
        keyPoints: [
          "Bloodwork, urine testing, X-rays, CT scans, ultrasounds, medications, IV fluids, splints, and wound supplies may all be billed.",
          "Imaging and lab work can be billed by the hospital and sometimes by separate interpreting clinicians.",
          "The patient may not notice every billable item during a stressful visit.",
        ],
      },
      {
        title: "Insurance cost-sharing",
        definition: "The part of the allowed amount that the patient owes under the plan.",
        keyPoints: [
          "A deductible can make the patient owe more early in the plan year.",
          "A copay may apply to the ER visit.",
          "Coinsurance may apply after deductible rules are met.",
          "The out-of-pocket maximum may limit covered in-network costs, but not every charge is always protected the same way.",
        ],
        watchOut: "Having insurance does not mean the ER visit will be cheap. It means the claim runs through plan rules.",
      },
      {
        title: "Observation or admission",
        definition: "A visit can become more complex if the patient is kept for observation or admitted to the hospital.",
        keyPoints: [
          "Observation status can create outpatient hospital charges.",
          "A formal inpatient admission can move the stay into a different billing category.",
          "Hospital status can also affect some post-hospital coverage questions.",
        ],
        watchOut: "Ask whether the stay is observation or inpatient before discharge when possible.",
      },
      {
        title: "What to ask before paying",
        keyPoints: [
          "Can I get an itemized bill?",
          "Has insurance fully processed every claim from this visit?",
          "Does this bill match my Explanation of Benefits?",
          "Was the claim processed as emergency care?",
          "Is financial assistance or charity care available?",
          "Can denied or unexpected charges be appealed or corrected?",
        ],
      },
    ],
    example: {
      title: "A chest pain visit that ends in discharge",
      body: "A patient goes to the ER for chest pain. They receive an EKG, bloodwork, chest X-ray, IV medication, monitoring, and an emergency provider evaluation. They go home the same day. Even without surgery or admission, the visit may still include a facility fee, professional bill, lab charges, imaging charges, medication charges, and deductible or coinsurance responsibility."
    },
    relatedCalculator: { label: "Insurance Visit Cost Calculator", href: "/tools/insurance-visit-cost" },
    commonMistakes: [
      "Assuming a discharge means the visit should be cheap.",
      "Paying before comparing the bill with the EOB.",
      "Ignoring separate physician, imaging, or lab bills.",
      "Thinking covered means free.",
      "Not asking for financial assistance, charity care, payment plan options, or claim review."
    ],
    takeaway: "An ER bill is often a stack of charges, not one simple visit price. Before paying a large balance, request an itemized bill, compare every charge with the EOB, and ask the insurer or billing office to explain anything that does not match.",
    sources: [SOURCE_PRESETS.medicare, SOURCE_PRESETS.cms, SOURCE_PRESETS.kff, SOURCE_PRESETS.healthcareGov],
  }),
];

// Backwards compatible exports for older imports
export const articles = ARTICLES;
export const categories = [
  "All",
  "Retirement",
  "Insurance",
  "Medicare",
  "Medicaid",
  "Hospital Bills",
  "Workplace Benefits",
  "Spending",
] as const;
