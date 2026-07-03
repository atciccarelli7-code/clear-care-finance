import type { Article } from "./articles";

type FromBedsideArticle = Article & {
  specialTag?: string;
};

export const FROM_BEDSIDE_ARTICLES: FromBedsideArticle[] = [
  {
    slug: "from-the-bedside-medicare-prescription-cost",
    title: "Why Is My Prescription So Expensive If I Have Medicare?",
    category: "Medicare",
    specialTag: "From the Bedside",
    readTime: "5 min read",
    promise: "A bedside Medicare drug-cost story showing why a covered prescription can still create a painful pharmacy bill — and what to ask before giving up on it.",
    audience: "Patients, caregivers, and healthcare workers helping someone understand Medicare drug costs.",
    summary:
      "A high pharmacy bill does not always mean the pharmacy made a mistake or that Medicare is useless. Sometimes the medication is covered, but the plan uses coinsurance, a deductible, or a high-cost formulary tier. In 2026, Medicare Part D out-of-pocket spending on covered Part D drugs reaches catastrophic coverage after $2,100 in qualifying out-of-pocket costs. The Medicare Prescription Payment Plan can spread covered drug costs across the calendar year, but it does not lower the total drug cost.",
    body: [
      "A patient was ready to leave the hospital, but the discharge conversation kept coming back to one medication: Xifaxan, also known by its generic name, rifaximin.",
      "The medical plan made sense clinically, but the patient and their significant other were focused on the pharmacy counter. The prescription had been costing hundreds of dollars per fill even though the patient had Medicare drug coverage through a managed Medicare plan.",
      "That is the part patients struggle with. They hear \"covered,\" but then they see a bill that still feels impossible. From the bedside, that gap between \"covered\" and \"affordable today\" is where a lot of fear, frustration, and medication nonadherence begins.",
      "Medicare drug coverage can still leave someone with a large pharmacy bill when the drug is expensive and the plan uses coinsurance instead of a flat copay. A copay is a fixed amount. Coinsurance is a percentage. If a medication has a high plan cost and the patient owes a percentage of that cost, the patient responsibility can land in the hundreds of dollars.",
      "That does not automatically mean the bill is wrong. It also does not mean the patient has no options. It means the patient needs to understand whether the drug is actually covered by the plan, whether it is subject to a deductible, copay, or coinsurance, how much has already counted toward the Part D out-of-pocket limit, and whether lower-cost alternatives, assistance programs, exceptions, or payment options are available.",
      "For 2026, Medicare.gov explains that Medicare drug plans have three general stages: deductible, initial coverage, and catastrophic coverage. In the initial coverage stage, a person generally pays coinsurance for covered drugs until out-of-pocket spending on covered Part D drugs reaches $2,100 in 2026. After that, catastrophic coverage applies and covered Part D drugs cost $0 out of pocket for the rest of the calendar year.",
      "That can change how a scary prescription bill should be understood. A $500–$700 fill can still be painful, but it may also be moving the patient toward the annual covered Part D drug cap. The key is making sure the drug is being processed through the plan and that the spending counts toward the Part D out-of-pocket limit.",
      "The Medicare Prescription Payment Plan is a payment option available through Medicare drug plans and Medicare Advantage plans with drug coverage. It lets eligible out-of-pocket costs for covered drugs be spread across the calendar year instead of being paid all at once at the pharmacy.",
      "This is important, but it needs to be explained carefully: the Medicare Prescription Payment Plan does not make the drug cheaper. It helps manage timing. That can still matter when the problem is not the total annual amount, but the immediate shock of paying hundreds of dollars at once.",
      "Before stopping or skipping a medication because of price, ask the pharmacist whether the claim was processed through the Medicare drug plan, ask the drug plan what tier and cost-sharing apply, ask the prescriber about alternatives or exceptions, and ask whether Extra Help or the Medicare Prescription Payment Plan may apply. Medication decisions belong with the patient, prescriber, pharmacist, and drug plan — not with panic at the pharmacy counter."
    ],
    example: {
      title: "A $600 prescription shock",
      body:
        "Say a covered medication has a plan cost around $2,400 and the patient owes 25% coinsurance after any deductible rules are handled. That could create a pharmacy cost around $600 for one fill. The next questions are whether the drug was processed through the Medicare drug plan, how much counts toward the 2026 Part D out-of-pocket limit, whether the Medicare Prescription Payment Plan can spread the cost, and whether the prescriber or plan can identify a lower-cost alternative or exception path."
    },
    commonMistakes: [
      "Assuming covered means cheap.",
      "Assuming a high pharmacy bill is automatically a pharmacy error.",
      "Assuming every Medicare plan handles the same drug the same way.",
      "Paying cash or using a discount card without asking whether that spending will count toward the Medicare drug plan's deductible or out-of-pocket maximum.",
      "Stopping or skipping a medication without talking to the prescriber.",
      "Forgetting to review Part D or Medicare Advantage drug coverage during enrollment season when medications are expensive."
    ],
    takeaway:
      "A covered Medicare prescription can still be expensive when the medication is high-cost and the plan uses coinsurance. Ask how the drug was processed, whether the cost counts toward the 2026 Part D out-of-pocket limit, whether the Medicare Prescription Payment Plan can spread the cost, and whether lower-cost or assistance options exist before silently skipping the medication.",
    sources: [
      {
        name: "Medicare.gov",
        pageTitle: "How much does Medicare drug coverage cost?",
        url: "https://www.medicare.gov/health-drug-plans/part-d/basics/costs",
        note: "Official Medicare explanation of Part D premiums, deductibles, copays, coinsurance, coverage stages, the 2026 $2,100 out-of-pocket threshold, and EOBs."
      },
      {
        name: "Medicare.gov",
        pageTitle: "What's the Medicare Prescription Payment Plan?",
        url: "https://www.medicare.gov/prescription-payment-plan",
        note: "Official Medicare explanation that the payment plan spreads covered drug out-of-pocket costs across the calendar year but does not lower total drug costs."
      },
      {
        name: "Medicare.gov",
        pageTitle: "Help with drug costs",
        url: "https://www.medicare.gov/basics/costs/help/drug-costs",
        note: "Official Medicare guidance on Extra Help, other ways to lower prescription costs, and questions to ask when drug costs seem wrong."
      }
    ]
  },
  {
    slug: "from-the-bedside-long-term-care-medicaid-hospital-delay",
    title: "From the Bedside: Long-Term Care Medicaid Should Not Wait Until a Crisis",
    category: "Medicaid",
    specialTag: "From the Bedside",
    readTime: "6 min read",
    promise: "A bedside look at why older adults can get stuck in the hospital while families scramble for long-term care Medicaid and nursing home placement.",
    audience: "Older adults, caregivers, adult children, discharge planners, and healthcare workers trying to understand long-term care planning before a hospital crisis.",
    summary:
      "In one recent week at the bedside, I saw multiple older adults who no longer had a safe discharge plan. Their families could not provide the level of care they needed at home, short-term rehab was hesitant because there was no realistic plan after rehab, and everyone was waiting on long-term care Medicaid so the patient could be placed safely. The painful lesson is simple: Medicare is not long-term custodial care coverage. Medicaid may help pay for long-term services and supports for people who qualify under state rules, but waiting until the hospital discharge crisis can leave patients stuck in the wrong place for far too long.",
    body: [
      "In one recent week at the bedside, I saw the same problem more than once: an older adult was medically past the acute emergency, but still could not safely leave the hospital.",
      "The reason was not that nobody cared. The family cared. The care team cared. Case management cared. The problem was that the patient needed more help than the family could safely provide, and there was no funded long-term care plan ready when the crisis arrived.",
      "That is where families can get trapped. A patient may be old enough for Medicare and still not have coverage for the kind of ongoing custodial care they actually need. Medicare.gov is blunt about this: Medicare does not pay for long-term care. Long-term care includes help with everyday tasks like dressing, bathing, using the bathroom, meals, transportation, and other support over time.",
      "Skilled nursing facility care is different. Medicare Part A can cover skilled nursing facility care only for a limited time when the patient meets specific rules, including a qualifying inpatient hospital stay, need for daily skilled care, and admission to a Medicare-certified skilled nursing facility. That is rehab-level coverage, not open-ended nursing home coverage.",
      "This matters because short-term rehab needs a discharge plan too. If a patient needs therapy but has no safe plan after rehab, a facility may worry that the patient will have nowhere to go when the rehab stay ends. That can delay acceptance, create placement barriers, and leave the patient waiting in the hospital even after the hospital is no longer the right setting.",
      "From the bedside, this is one of the saddest financial planning failures because it does not look like a spreadsheet problem. It looks like a patient losing time, privacy, normal sleep, mobility, and dignity while everyone waits for paperwork and placement.",
      "Medicaid is often the program families eventually discover in this situation. Medicaid.gov describes Medicaid as the primary payer across the nation for long-term care services, including services provided across institutional and community-based settings. But Medicaid is not automatic just because someone is older or sick. Eligibility depends on state rules, income, resources, medical need, and the specific long-term care program involved.",
      "That is why families should ask about long-term care Medicaid before the crisis, not after. If an older adult is declining, needing more hands-on help, falling frequently, needing supervision, or requiring care that family members can no longer safely provide, the conversation should start early with the state Medicaid agency, a hospital or community social worker, an elder law attorney, or a local aging-services organization.",
      "The goal is not to force someone into a nursing home. The goal is to know the options before a hospital stay becomes the application office, the waiting room, and the holding pattern all at once.",
      "Nobody deserves to be stuck in a hospital because the financing plan for long-term care started too late. Hospitals are built for acute illness. They are not homes. They are not long-term care facilities. And they are not where an older adult should have to wait while a family learns, under pressure, that Medicare and Medicaid solve very different problems."
    ],
    sections: [
      {
        title: "The bedside problem",
        definition: "A patient may be medically stable enough to leave the hospital, but still unsafe to go home without long-term support.",
        keyPoints: [
          "Families can reach a point where they cannot safely provide bathing, toileting, transfers, supervision, meals, transportation, or medication support anymore.",
          "Short-term rehab may hesitate if there is no realistic discharge plan after the rehab stay.",
          "The patient can end up waiting in the hospital while long-term care Medicaid and placement are sorted out."
        ],
        watchOut: "This can happen even when the family is trying hard and the patient already has Medicare. Medicare and long-term custodial care coverage are not the same thing."
      },
      {
        title: "Medicare vs. long-term care Medicaid",
        definition: "Medicare is mainly health insurance for acute and skilled medical needs. Medicaid can help pay for long-term services and supports for people who meet state eligibility rules.",
        keyPoints: [
          "Medicare.gov says Medicare does not pay for long-term care, also called custodial care or long-term services and supports.",
          "Medicare Part A may cover skilled nursing facility care only for a limited time when strict conditions are met.",
          "Medicaid.gov describes Medicaid as the primary payer across the nation for long-term care services."
        ],
        watchOut: "Do not assume being 65+, having Medicare, or having a hospital stay means long-term nursing home care will be covered."
      },
      {
        title: "When to start asking questions",
        definition: "Start before the family is in discharge crisis mode.",
        keyPoints: [
          "Ask early if the person needs hands-on help with daily activities or supervision.",
          "Ask if the person has repeated falls, unsafe mobility, worsening confusion, caregiver burnout, or no realistic home support.",
          "Ask the state Medicaid agency, local aging-services office, social worker, or elder law attorney what documents and eligibility rules apply."
        ],
        watchOut: "Rules vary by state, and financial transfers or missing records can complicate eligibility. Get state-specific guidance before making major financial moves."
      }
    ],
    example: {
      title: "Why a hospital stay can turn into a waiting room for long-term care",
      body:
        "Imagine an older adult who is no longer safe at home. The family cannot provide 24-hour support, but there is no long-term care payer in place. The patient may need rehab, but the rehab facility wants to know where the person can safely go after therapy ends. If long-term care Medicaid has not been applied for or approved, the discharge plan can stall. The patient is then stuck waiting in a hospital bed for a system that should have been discussed earlier."
    },
    commonMistakes: [
      "Assuming Medicare pays for long-term nursing home care.",
      "Waiting until the hospital discharge crisis to ask about long-term care Medicaid.",
      "Assuming short-term rehab will accept a patient without a realistic plan after rehab.",
      "Thinking Medicaid eligibility is based only on age instead of state-specific income, resource, and care-need rules.",
      "Moving money, changing ownership, or giving assets away without qualified state-specific guidance.",
      "Treating caregiver burnout as a private family failure instead of a warning sign that a formal care plan may be needed."
    ],
    takeaway:
      "If an older adult may need long-term custodial care, start the Medicaid and care-planning conversation before the hospital crisis. Medicare may cover limited skilled rehab when strict rules are met, but it generally does not pay for long-term custodial care. Medicaid may help people who qualify under state rules, and starting early can protect patients from being stuck in the wrong setting while everyone waits for paperwork, approval, and placement.",
    sources: [
      {
        name: "Medicare.gov",
        pageTitle: "Long-term care",
        url: "https://www.medicare.gov/coverage/long-term-care",
        note: "Official Medicare explanation that Medicare does not pay for long-term care and that long-term care includes custodial support with everyday activities."
      },
      {
        name: "Medicare.gov",
        pageTitle: "Skilled nursing facility care",
        url: "https://www.medicare.gov/coverage/skilled-nursing-facility-care",
        note: "Official Medicare explanation that skilled nursing facility care is covered by Part A only for a limited time when eligibility requirements are met."
      },
      {
        name: "Medicaid.gov",
        pageTitle: "Long Term Services & Supports",
        url: "https://www.medicaid.gov/medicaid/long-term-services-supports",
        note: "Official Medicaid explanation that Medicaid is the primary payer across the nation for long-term care services across institutional and community-based settings."
      }
    ]
  }
];