import type { Article } from "./articles";
import { SOURCE_PRESETS } from "./sources";

const CMS_MEDICAL_BILL_RIGHTS = {
  name: "CMS",
  pageTitle: "Medical Bill Rights and No Surprises Act protections",
  url: "https://www.cms.gov/medical-bill-rights",
  note: "Federal overview of surprise billing protections, good faith estimates, and complaint options."
};

const HEALTHCARE_ALLOWED_AMOUNT = {
  name: "HealthCare.gov",
  pageTitle: "Allowed amount glossary",
  url: "https://www.healthcare.gov/glossary/allowed-amount/",
  note: "Official definition of allowed amount for covered health care services."
};

const HEALTHCARE_BALANCE_BILLING = {
  name: "HealthCare.gov",
  pageTitle: "Balance billing glossary",
  url: "https://www.healthcare.gov/glossary/balance-billing/",
  note: "Official definition of balance billing and its relationship to allowed amounts."
};

const ID_ME_NURSE_DISCOUNTS = {
  name: "ID.me Shop",
  pageTitle: "Nurse Discounts & Exclusive Deals",
  url: "https://shop.id.me/nurse",
  note: "Healthcare-worker discount marketplace with explicit affiliate and change-at-any-time disclosure."
};

export const POST_ADSENSE_PREPARED_ARTICLES: Article[] = [
  {
    slug: "how-to-read-an-eob",
    title: "EOB vs Medical Bill: What You Actually Owe",
    category: "Hospital Bills",
    readTime: "6 min read",
    promise: "Learn how to compare an insurance Explanation of Benefits with a provider bill before paying.",
    audience: "Patients, caregivers, and healthcare workers helping someone understand a bill after insurance.",
    summary:
      "An Explanation of Benefits is usually the insurer's claim-processing explanation, not the payment request. A provider bill is the request for payment from the hospital, doctor, lab, ambulance company, or other provider. The safest number to compare is patient responsibility, matched by date of service, provider, service, claim number, and allowed amount. If the EOB and bill disagree, call before paying.",
    body: [
      "Hospital paperwork often arrives in pieces. A patient may get discharge instructions, a hospital bill, an insurance Explanation of Benefits, lab bills, physician bills, and letters that look urgent even when they are not payment requests.",
      "The first step is separating the document that explains insurance processing from the document that asks for money.",
      "This guide is educational. A specific bill can depend on the insurance plan, provider network, claim coding, plan rules, federal protections, state protections, and whether the claim has finished processing."
    ],
    sections: [
      {
        title: "Explanation of Benefits",
        definition: "A claim-processing statement from the insurance company showing how a medical claim was handled.",
        keyPoints: [
          "It usually shows what was billed, what the plan allowed, what insurance paid, and what the patient may owe.",
          "It is usually not the bill itself.",
          "It may arrive before or after the provider bill.",
          "It should help you check whether the provider bill matches the insurer's patient-responsibility amount."
        ],
        watchOut: "Do not pay from the EOB alone unless the provider also sent a bill requesting payment."
      },
      {
        title: "Medical bill",
        definition: "The payment request from the hospital, physician group, lab, ambulance company, imaging group, or other provider.",
        keyPoints: [
          "It should match the date of service, provider, service, and patient responsibility after insurance processing.",
          "Several bills can come from one hospital visit because different groups may bill separately.",
          "A bill may arrive before insurance finishes processing, which can make the amount look wrong or incomplete."
        ],
        watchOut: "A provider bill that does not match the EOB deserves a phone call before payment."
      },
      {
        title: "Patient responsibility",
        definition: "The amount the insurer says the patient may owe after the claim is processed under the plan rules.",
        keyPoints: [
          "This can include deductible, copay, coinsurance, or non-covered amounts.",
          "It should be compared with the amount due on the provider bill.",
          "If the bill asks for more than the EOB patient responsibility, ask why."
        ]
      },
      {
        title: "Allowed amount",
        definition: "The plan-recognized amount for a covered service, which may be lower than the provider's original billed charge.",
        keyPoints: [
          "The allowed amount is often the number used to calculate insurance payment and patient cost-sharing.",
          "The billed charge can be much higher than the allowed amount.",
          "For in-network care, the patient usually should not assume they owe the full original billed charge after insurance adjustments."
        ],
        watchOut: "The allowed amount may work differently for out-of-network care or non-covered services."
      },
      {
        title: "What to compare before paying",
        keyPoints: [
          "Patient name.",
          "Date of service.",
          "Provider or facility name.",
          "Claim number if listed.",
          "Service description.",
          "Billed amount.",
          "Allowed amount.",
          "Insurance payment.",
          "Deductible, copay, or coinsurance amount.",
          "Patient responsibility.",
          "Amount due on the provider bill."
        ]
      },
      {
        title: "If the EOB and bill do not match",
        keyPoints: [
          "Do not assume the highest number is what you owe.",
          "Call the provider billing office and ask whether insurance has fully processed the claim.",
          "Call the insurer and ask what your patient responsibility is for that claim.",
          "Ask the provider to re-bill insurance if the claim was denied or processed incorrectly.",
          "Ask whether federal surprise billing protections, financial assistance, or a payment plan may apply."
        ]
      }
    ],
    example: {
      title: "A simple EOB example",
      body:
        "A hospital sends a bill for $2,000. The insurance EOB shows a $2,000 billed charge, a $700 allowed amount, a $300 insurance payment, and a $400 patient responsibility. In this simplified example, the patient should not automatically assume they owe the full $2,000. They should compare the provider bill with the $400 patient-responsibility amount and ask why if the bill does not match."
    },
    relatedCalculator: { label: "EOB-to-Bill Match Checker", href: "/tools#eob-bill-match" },
    commonMistakes: [
      "Treating the EOB as the payment request.",
      "Paying the provider before insurance finishes processing.",
      "Ignoring denied claims.",
      "Matching a bill to the wrong EOB.",
      "Not checking whether the bill belongs to the hospital, physician group, lab, ambulance company, imaging group, anesthesia group, or another provider.",
      "Assuming every surprise bill is automatically protected or automatically illegal."
    ],
    takeaway:
      "An EOB explains how insurance processed a claim. A medical bill asks for payment. Before paying, match the bill to the EOB by date, provider, service, allowed amount, insurance payment, and patient responsibility.",
    sources: [CMS_MEDICAL_BILL_RIGHTS, HEALTHCARE_ALLOWED_AMOUNT, HEALTHCARE_BALANCE_BILLING]
  },
  {
    slug: "home-health-after-hospital",
    title: "Home Health After the Hospital: What It Provides — and What It Does Not",
    category: "Medicare",
    readTime: "6 min read",
    promise: "Understand what home health can provide after discharge, what it usually does not provide, and which questions families should ask before leaving the hospital.",
    audience: "Patients, caregivers, families planning discharge, and healthcare workers explaining home health in plain English.",
    summary:
      "Home health is medical care delivered at home after an illness, injury, hospitalization, or decline in function. It can include skilled nursing, physical therapy, occupational therapy, speech therapy, medical social work, and limited home health aide support when the patient qualifies. It is not the same as full-time caregiving, meal preparation, housekeeping, supervision, or unlimited help with bathing and toileting.",
    body: [
      "Home health can make a discharge home safer, but families often hear the phrase and picture much more help than what may actually arrive.",
      "A patient may be medically stable enough to leave the hospital and still be weak, nervous, confused, or dependent on family support between visits.",
      "That gap matters. Home health can be very helpful, but it is not a replacement for a full-time caregiver."
    ],
    sections: [
      {
        title: "Home health",
        definition: "Healthcare services provided in the patient's home for an illness, injury, recovery period, or functional decline.",
        keyPoints: [
          "May include skilled nursing, therapy, social work, limited aide support, supplies, or equipment tied to the care plan.",
          "Usually requires a provider order and a qualifying skilled need.",
          "Medicare home health usually means part-time or intermittent visits, not someone staying all day."
        ],
        watchOut: "A referral for home health does not automatically mean daily caregiving."
      },
      {
        title: "Skilled care",
        definition: "Care that requires trained medical or therapy professionals, such as nursing, wound care, physical therapy, occupational therapy, or speech therapy.",
        keyPoints: [
          "Examples include wound care, medication teaching, IV or nutrition therapy, monitoring serious illness, and therapy services.",
          "Documentation should explain why the care is skilled and medically necessary.",
          "Skilled need is different from general help at home."
        ]
      },
      {
        title: "Custodial care",
        definition: "Help with daily living needs like bathing, dressing, toileting, meals, housekeeping, transportation, and supervision.",
        keyPoints: [
          "Custodial care may be necessary for safety and dignity.",
          "It is often the help families need most urgently after discharge.",
          "Medicare home health usually does not cover custodial or personal care when that is the only care needed."
        ],
        watchOut: "A patient can truly need daily help and still need a separate payer or caregiver plan."
      },
      {
        title: "What home health can provide",
        keyPoints: [
          "Part-time or intermittent skilled nursing care.",
          "Wound care or medication teaching.",
          "Physical therapy, occupational therapy, and speech-language pathology when coverage conditions are met.",
          "Medical social services.",
          "Part-time or intermittent home health aide care when tied to covered skilled services.",
          "Certain medical supplies and durable medical equipment."
        ]
      },
      {
        title: "What home health usually does not provide",
        keyPoints: [
          "24-hour-a-day care at home.",
          "Home meal delivery.",
          "Homemaker services like shopping or cleaning when unrelated to the care plan.",
          "Custodial or personal care as the only care needed.",
          "Long-term supervision for dementia, wandering risk, or general safety needs."
        ]
      },
      {
        title: "Questions to ask before discharge",
        keyPoints: [
          "What specific home health services are being ordered?",
          "Is nursing, PT, OT, speech therapy, social work, or aide care included?",
          "How often is each discipline expected to visit?",
          "How soon after discharge will the first visit happen?",
          "Which agency will provide the care?",
          "Is the agency in-network or Medicare-certified?",
          "What care is the family expected to provide between visits?",
          "If the patient needs more help than home health provides, what are the backup options?"
        ]
      }
    ],
    example: {
      title: "Home health is not a sitter",
      body:
        "A patient leaves the hospital after pneumonia and weakness. A nurse may review medications and monitor symptoms. A physical therapist may work on walking and fall prevention. An occupational therapist may work on bathing safety and daily routines. But if the family needs someone to stay all day, cook, clean, supervise, or provide daily bathing help without a skilled need, that may require private pay care, family caregiving, Medicaid-based services, or another discharge plan."
    },
    relatedCalculator: { label: "Medicare Cost Exposure Tool", href: "/tools#medicare" },
    commonMistakes: [
      "Assuming home health means full-time help at home.",
      "Assuming therapy will come every day.",
      "Assuming insurance covers bathing, meals, housekeeping, and supervision by default.",
      "Waiting until discharge day to ask what home health actually includes.",
      "Confusing skilled home health with private-duty caregiving."
    ],
    takeaway:
      "Home health can be a strong discharge support, but it is not full-time home care. If the real need is daily custodial help, meals, supervision, or 24-hour care, families need a separate plan.",
    sources: [SOURCE_PRESETS.medicareHomeHealth, SOURCE_PRESETS.medicaidLtss]
  },
  {
    slug: "hospital-cafe-habit",
    title: "Your Hospital Cafe Habit Might Be Quietly Eating Your Savings Rate",
    category: "Spending",
    readTime: "5 min read",
    promise: "A non-shaming look at how small shift purchases add up over a month and year.",
    audience: "Healthcare workers who feel like money disappears between paychecks.",
    summary:
      "Coffee, drinks, snacks, and cafeteria lunches can become a meaningful yearly expense when they happen every shift. The point is not to shame exhausted healthcare workers for buying comfort during hard shifts. The point is to see the number, decide what is worth keeping, and redirect the spending that does not actually improve your day.",
    body: [
      "Healthcare work is stressful. Sometimes the hospital cafe is not just food. It is a break, a reward, a comfort, and a reason to step away from the unit for five minutes.",
      "This article is not a rule that says you should never buy coffee or lunch at work. It is a numbers exercise. If a habit is worth the money, keep it intentionally. If it is not worth the yearly cost, make the better choice easier before the shift starts.",
      "Small purchases matter most when they are automatic. A single coffee is not the problem. The autopilot pattern is what quietly eats into the savings rate."
    ],
    sections: [
      {
        title: "The core idea",
        definition: "Small shift purchases become large because they repeat.",
        keyPoints: [
          "$8 per shift over 16 shifts per month is $128 per month.",
          "$15 per shift over 16 shifts per month is $240 per month.",
          "$25 per shift over 16 shifts per month is $400 per month.",
          "That money may be worth it, but it should be a conscious tradeoff."
        ],
        watchOut: "The goal is awareness, not guilt."
      },
      {
        title: "What to keep",
        keyPoints: [
          "The purchase that genuinely improves a hard shift.",
          "The planned coffee with a coworker that helps you feel human.",
          "The backup meal when the shift becomes chaotic.",
          "The comfort item that fits inside your real budget."
        ]
      },
      {
        title: "What to replace",
        keyPoints: [
          "The automatic snack you barely enjoy.",
          "The second drink because you forgot water or coffee from home.",
          "The cafeteria meal you buy only because nothing was packed.",
          "The vending-machine purchase caused by poor planning, not actual preference."
        ]
      },
      {
        title: "Better defaults",
        keyPoints: [
          "Bring one reliable meal that does not require motivation.",
          "Keep a backup protein bar, tuna packet, oatmeal cup, or shelf-stable snack in your bag or locker.",
          "Bring coffee most days, but allow a planned cafe day if it matters to you.",
          "Decide the budget before the shift, not when you are tired and hungry."
        ]
      }
    ],
    example: {
      title: "The $12 shift habit",
      body:
        "A nurse spends $5 on coffee and $7 on a snack or cafeteria item during four shifts per week. That is about $48 per week, roughly $208 per month, and about $2,500 per year. Redirecting even half could fund an emergency buffer, IRA contributions, student loan payoff, or a vacation without eliminating every treat."
    },
    relatedCalculator: { label: "Hospital Cafe Savings Rate Calculator", href: "/tools#cafe" },
    commonMistakes: [
      "Making the goal too extreme and then quitting.",
      "Cutting the one purchase that actually helps while keeping purchases that do not matter.",
      "Trying to make disciplined decisions after a hard shift instead of before it.",
      "Forgetting that convenience needs a budget too."
    ],
    takeaway:
      "Run the number once. Keep what is worth it. Replace what is automatic. The win is not never buying cafe food. The win is deciding on purpose.",
    sources: [SOURCE_PRESETS.federalReserve, SOURCE_PRESETS.bls]
  },
  {
    slug: "burnout-overspending-overeating",
    title: "Burnout, Overspending, and Overeating After Hard Shifts",
    category: "Behavior & Burnout",
    readTime: "6 min read",
    promise: "Why post-shift decisions hit your wallet and your body — and what helps without shame.",
    audience: "Healthcare workers whose hardest financial decisions happen after a 12-hour shift.",
    summary:
      "Hard shifts can push people toward fast relief: takeout, alcohol, snacks, scrolling, impulse purchases, or skipping basic recovery. This is not a character flaw. It is a predictable environment problem. Better defaults, planned recovery, and lower-friction routines usually work better than relying on willpower after you are exhausted.",
    body: [
      "The most expensive choices often happen when you are least equipped to make them: after a hard shift, after a patient decline, after getting yelled at, after missing a break, or after working short-staffed.",
      "This is not a moral failure. It is a predictable response to exhaustion, stress, hunger, and decision fatigue.",
      "The goal is not to remove every comfort. The goal is to stop using money, food, alcohol, or impulse purchases as the only recovery plan."
    ],
    sections: [
      {
        title: "Decision fatigue",
        definition: "The worn-down state after making too many decisions or carrying too much stress.",
        keyPoints: [
          "Healthcare shifts require constant decisions, interruptions, and emotional control.",
          "By the end of the day, the easiest choice usually wins.",
          "The fix is not more willpower. The fix is making the better choice easier before the shift starts."
        ]
      },
      {
        title: "Burnout spending",
        definition: "Spending used as quick relief after emotional overload or exhaustion.",
        keyPoints: [
          "Common examples include takeout, delivery, online shopping, convenience-store stops, extra drinks, and random purchases after work.",
          "Some spending is reasonable recovery. The problem is when the spending becomes automatic and no longer helps.",
          "A planned recovery budget is healthier than pretending you will never need convenience."
        ],
        watchOut: "Do not confuse a discount, treat, or delivery order with a recovery system."
      },
      {
        title: "Better defaults before the shift",
        keyPoints: [
          "Pack one easy meal and one backup snack.",
          "Set a post-shift food default before work starts.",
          "Remove saved carts and one-click purchases from shopping apps.",
          "Use a weekly recovery budget instead of unlimited emotional spending.",
          "Plan one low-friction decompression routine: shower, walk, meal, sleep, or a short call with someone safe."
        ]
      },
      {
        title: "When it may be bigger than budgeting",
        keyPoints: [
          "If eating, drinking, spending, anxiety, depression, or sleep feels out of control, budgeting alone is not the answer.",
          "Consider talking with a clinician, therapist, employee assistance program, or trusted professional support.",
          "If you feel unsafe or may harm yourself, seek immediate help through local emergency services or crisis support."
        ],
        watchOut: "This article is education, not medical or mental health advice."
      }
    ],
    example: {
      title: "The post-shift default",
      body:
        "A respiratory therapist notices that after bad shifts they spend $35 on delivery and snacks almost automatically. Instead of banning takeout, they choose two planned takeout nights per pay period, keep frozen meals at home, and remove saved payment details from delivery apps. The goal is not perfection. The goal is fewer exhausted decisions."
    },
    relatedCalculator: { label: "Hospital Cafe Savings Rate Calculator", href: "/tools#cafe" },
    commonMistakes: [
      "Trying to solve exhaustion with stricter rules.",
      "Cutting every comfort until the plan becomes unrealistic.",
      "Making spending decisions after the shift instead of before it.",
      "Ignoring sleep, hunger, and stress while blaming budgeting alone.",
      "Treating serious distress as a personal finance problem."
    ],
    takeaway:
      "Design your post-shift environment so the default choice is also the kind one. Budgeting works better when it respects how tired healthcare workers actually are.",
    sources: [SOURCE_PRESETS.federalReserve]
  },
  {
    slug: "healthcare-worker-discounts",
    title: "Healthcare Worker Discounts and Perks Directory",
    category: "Discounts & Perks",
    readTime: "5 min read",
    promise: "Use healthcare-worker discounts as a tool, not as a shopping trigger.",
    audience: "Nurses, techs, respiratory therapists, APPs, physicians, pharmacists, EMS workers, and other healthcare workers checking whether a discount is worth it.",
    summary:
      "Healthcare-worker discounts can be useful, but a discount only helps if it lowers the price of something you already planned to buy. Many discount pages change frequently, use verification platforms, and may include affiliate links. The safest approach is to verify through the official brand page or a reputable verification portal, compare the final price, and avoid buying only because the discount exists.",
    body: [
      "Healthcare-worker discounts can save real money on scrubs, shoes, phone plans, travel, fitness, software, and everyday purchases. They can also become a shopping trap.",
      "The rule is simple: a discount is valuable only if it reduces the price of something you already planned to buy.",
      "This directory is built around verification habits, not hype. Deals change, eligibility changes, and some discount marketplaces earn affiliate revenue. Always check the final price before buying."
    ],
    sections: [
      {
        title: "Start with verification",
        definition: "The process a brand or discount platform uses to confirm healthcare-worker status.",
        keyPoints: [
          "Common verification may use a work email, license, badge, paystub, professional credential, or third-party verification platform.",
          "Use official brand pages or established verification portals when possible.",
          "Do not upload work documents to random coupon sites."
        ],
        watchOut: "Protect your personal and employment information."
      },
      {
        title: "Categories worth checking",
        keyPoints: [
          "Scrubs and work apparel.",
          "Comfortable shoes and compression socks.",
          "Cell phone plans and internet service.",
          "Fitness memberships and wellness services.",
          "Travel, hotels, rental cars, and theme parks.",
          "Technology, software, and continuing education.",
          "Local restaurants and small businesses near hospitals."
        ]
      },
      {
        title: "How to judge a discount",
        keyPoints: [
          "Compare the final price after discount, tax, shipping, fees, and return rules.",
          "Check whether the same item is cheaper elsewhere without the healthcare discount.",
          "Avoid subscriptions unless you wanted the subscription before seeing the deal.",
          "Do not treat cash back or points as guaranteed savings until they actually post.",
          "Re-check eligibility before relying on the discount for a major purchase."
        ]
      },
      {
        title: "Where to look first",
        keyPoints: [
          "The official brand website.",
          "Your employer benefits portal.",
          "Union or professional organization member-benefit pages if applicable.",
          "Established verification platforms such as ID.me when the brand participates.",
          "Local hospital-area businesses that may not advertise online."
        ]
      }
    ],
    example: {
      title: "The discount that is not a deal",
      body:
        "A pair of shoes is 20% off through a healthcare-worker discount portal, but shipping is expensive and returns are limited. The same shoes are available for less at another retailer without the discount. The better deal is the lower final price, not the bigger discount headline."
    },
    commonMistakes: [
      "Buying something only because there is a healthcare-worker discount.",
      "Ignoring shipping, return fees, subscription terms, or blackout dates.",
      "Assuming every online discount list is current.",
      "Uploading personal employment proof to low-trust coupon sites.",
      "Counting cash back before it is approved or paid."
    ],
    takeaway:
      "Use healthcare-worker discounts on purchases you already planned to make. Compare final price, protect your information, and skip deals that create new spending.",
    sources: [ID_ME_NURSE_DISCOUNTS, SOURCE_PRESETS.federalReserve]
  }
];
