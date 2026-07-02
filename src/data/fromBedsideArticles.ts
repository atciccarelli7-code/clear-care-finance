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
  }
];
