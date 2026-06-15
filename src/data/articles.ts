import type { Source } from "./sources";
import { SOURCE_PRESETS } from "./sources";

export type Article = {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  promise: string;                  // one-sentence promise
  audience: string;                 // who this is for
  summary: string;                  // 60-second summary
  body: string[];                   // plain-English paragraphs
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
    relatedCalculator: { label: "Insurance Visit Cost Calculator", href: "/tools#insurance" },
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
    relatedCalculator: { label: "403(b) Paycheck Contribution Calculator", href: "/tools#403b" },
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
    relatedCalculator: { label: "403(b) Paycheck Contribution Calculator", href: "/tools#403b" },
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
    relatedCalculator: { label: "Hospital Café Savings Rate Calculator", href: "/tools#cafe" },
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
    slug: "why-er-visit-is-expensive",
    title: "Why an ER Visit Can Be So Expensive",
    category: "Hospital Bills",
    readTime: "6 min read",
    promise: "Chargemasters, facility fees, and out-of-network billing explained.",
    audience: "Anyone who got an ER bill and felt blindsided.",
    summary: "ER pricing is built from a base facility fee tied to acuity level, plus charges from physicians who may bill separately and may be out of network.",
    body: ["Paste this article from Notion."],
    relatedCalculator: { label: "Insurance Visit Cost Calculator", href: "/tools#insurance" },
    takeaway: "Always request an itemized bill and check that providers were in-network. Many charges are negotiable.",
    sources: [SOURCE_PRESETS.kff, SOURCE_PRESETS.healthcareGov],
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
