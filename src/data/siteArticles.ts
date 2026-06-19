import type { Article } from "./articles";
import { ARTICLES as BASE_ARTICLES } from "./articles";
import { SOURCE_PRESETS } from "./sources";

const PUBLISHED_ARTICLE_OVERRIDES: Article[] = [
  {
    slug: "discharge-coverage-guide",
    title: "Discharge Coverage Guide",
    category: "Medicare",
    readTime: "6 min read",
    promise: "Understand which post-hospital costs Medicare may cover after discharge — and which questions families should ask early.",
    audience: "Patients, caregivers, bedside clinicians, case managers, and families planning a hospital discharge.",
    summary: "Discharge planning is not just a clinical handoff. It can also decide what Medicare may or may not cover next. Skilled nursing facility coverage, home health, durable medical equipment, therapy, medications, and custodial help all follow different rules. The most important early question is whether the patient is inpatient, observation, or outpatient, because status can affect post-hospital coverage.",
    body: [
      "A hospital discharge can feel like the end of the emergency, but financially it is often the beginning of a new set of questions.",
      "Families may hear words like skilled nursing, home health, durable medical equipment, observation, inpatient, custodial care, prior authorization, and discharge appeal while they are already tired and overwhelmed.",
      "This guide is educational. Medicare, Medicaid, Medicare Advantage plans, employer plans, and state programs can apply different rules. Always verify the patient-specific details with the care team, insurer, Medicare resources, plan documents, and the billing office."
    ],
    sections: [
      {
        title: "Hospital status",
        definition: "The billing category for the hospital stay, such as inpatient, observation, or outpatient.",
        keyPoints: [
          "A patient can sleep in a hospital bed and still be considered outpatient or observation.",
          "A formal inpatient order matters for some Medicare coverage questions.",
          "Status can affect whether a skilled nursing facility stay is covered after discharge."
        ],
        watchOut: "Do not rely on the room, length of stay, or how sick the patient looked. Ask directly: Is the patient inpatient, outpatient, or observation?"
      },
      {
        title: "Skilled nursing facility care",
        definition: "Short-term skilled care after hospitalization, such as nursing care, therapy, or rehabilitation that meets Medicare rules.",
        keyPoints: [
          "Medicare may cover skilled nursing facility care only when specific requirements are met.",
          "Coverage is limited and does not mean permanent nursing home coverage.",
          "The discharge planner or case manager can explain whether the stay is expected to qualify."
        ],
        watchOut: "Skilled care and custodial care are not the same. Medicare rules are much narrower than many families expect."
      },
      {
        title: "Home health",
        definition: "Certain skilled services provided at home when a patient meets coverage requirements.",
        keyPoints: [
          "Home health may include skilled nursing, therapy, or other ordered services.",
          "Coverage depends on eligibility, doctor orders, and the type of service needed.",
          "Home health is not the same as around-the-clock personal care."
        ],
        watchOut: "Families often expect home health to provide daily custodial help. It usually does not replace a full-time caregiver."
      },
      {
        title: "Durable medical equipment",
        definition: "Reusable medical equipment ordered for home use, such as walkers, oxygen equipment, wheelchairs, or hospital beds when covered rules are met.",
        keyPoints: [
          "The item usually needs to be medically necessary and ordered by the clinician.",
          "Suppliers, networks, and prior authorization can affect timing and cost.",
          "Ask whether the equipment is rental, purchase, or patient-owned."
        ],
        watchOut: "Do not assume every useful device is covered. Ask before discharge so delays do not leave the patient unsafe at home."
      },
      {
        title: "Custodial care",
        definition: "Help with daily living tasks such as bathing, dressing, toileting, eating, supervision, meals, and transportation.",
        keyPoints: [
          "Custodial care is often what families mean when they say someone needs long-term help.",
          "Medicare generally does not cover most long-term custodial care.",
          "Medicaid may help if the person qualifies under state rules."
        ],
        watchOut: "A discharge plan can be medically safe on paper but still create a major family caregiving burden. Ask who will actually provide daily help."
      },
      {
        title: "Questions to ask before discharge",
        keyPoints: [
          "What is the patient's current hospital status?",
          "Is the next service skilled care, home health, outpatient therapy, durable equipment, or custodial help?",
          "Which payer is expected to cover it?",
          "Does the plan require prior authorization?",
          "What could the patient owe out of pocket?",
          "Who should the family call if the bill or coverage decision looks wrong?"
        ]
      }
    ],
    example: {
      title: "A discharge that changes the bill",
      body: "A patient spends two nights in the hospital after a fall and then needs rehab. The family assumes the rehab stay is covered because the patient was in a hospital bed. Before discharge, the case manager explains that the stay was observation, not inpatient. That distinction can change whether Medicare covers the skilled nursing facility stay. The family should ask for status documentation, plan rules, appeal options, and alternatives before signing discharge paperwork."
    },
    commonMistakes: [
      "Assuming overnight hospital care always means inpatient status.",
      "Confusing short-term skilled nursing facility coverage with long-term nursing home coverage.",
      "Assuming home health means daily caregiving help.",
      "Leaving without asking what equipment, medications, therapy, and follow-up visits may cost.",
      "Waiting until after discharge to ask whether prior authorization is needed."
    ],
    takeaway: "Before discharge, ask what status the patient has, what service is being recommended next, who is expected to pay, and what part of the plan is not covered. Discharge is a care transition and a financial transition.",
    sources: [SOURCE_PRESETS.medicare, SOURCE_PRESETS.cms, SOURCE_PRESETS.medicareLongTermCare],
  },
  {
    slug: "long-term-care-and-custodial-care",
    title: "Long-Term Care and Custodial Care",
    category: "Medicare",
    readTime: "7 min read",
    promise: "Learn why Medicare usually does not pay for long-term daily help — and why Medicaid planning may matter.",
    audience: "Adult children, caregivers, older adults, and healthcare workers explaining long-term care basics to families.",
    summary: "Long-term care usually means ongoing help with daily living. Custodial care means help with bathing, dressing, toileting, eating, mobility, meals, transportation, or supervision. Medicare generally does not cover most long-term custodial care. Medicaid may help for people who qualify under state rules, but eligibility and services vary by state.",
    body: [
      "One of the most expensive Medicare surprises is learning that medically necessary care and daily living help are not treated the same way.",
      "A person can need serious help at home or in a facility and still not have that help covered by Medicare if the need is mainly custodial rather than skilled.",
      "This is why long-term care planning matters before a crisis. The decisions are easier when a family has time to understand the difference between Medicare, Medicaid, savings, family caregiving, community programs, and private long-term care options."
    ],
    sections: [
      {
        title: "Long-term care",
        definition: "Ongoing support for people who need help because of age, disability, chronic illness, cognitive decline, or functional limitations.",
        keyPoints: [
          "It can happen at home, in assisted living, in adult day programs, or in nursing facilities.",
          "It may include medical services, but often centers on daily living support.",
          "Costs can last months or years, not days."
        ],
        watchOut: "Families often wait until a fall, hospital stay, or dementia crisis before asking how long-term care is paid for."
      },
      {
        title: "Custodial care",
        definition: "Non-skilled help with activities of daily living, safety, supervision, meals, transportation, and routine personal care.",
        keyPoints: [
          "Examples include bathing, dressing, toileting, eating, transferring, and supervision.",
          "Custodial care can be essential, but Medicare usually does not pay for most long-term custodial care.",
          "The difference between skilled and custodial care is one of the biggest coverage gaps families face."
        ],
        watchOut: "Important does not always mean covered. A service can be necessary for safety and still fall outside Medicare coverage."
      },
      {
        title: "Skilled care",
        definition: "Care that generally requires licensed clinical skill, such as skilled nursing, therapy, wound care, or rehabilitation services under coverage rules.",
        keyPoints: [
          "Medicare may cover some skilled care when strict requirements are met.",
          "Coverage is limited and usually tied to clinical need, documentation, and time limits.",
          "A skilled stay can end even when the person still needs custodial help."
        ],
        watchOut: "Do not assume a nursing facility stay means the full stay is covered. Ask what part is skilled and what happens when skilled coverage ends."
      },
      {
        title: "Medicaid",
        definition: "A joint federal-state program that may help with long-term services and supports for people who meet financial and functional eligibility rules.",
        keyPoints: [
          "Medicaid rules vary by state.",
          "Eligibility can depend on income, assets, disability, medical need, and state program rules.",
          "Medicaid may cover long-term services and supports that Medicare usually does not."
        ],
        watchOut: "Medicaid planning can involve legal and financial rules. Families should use official state resources and qualified professionals when needed."
      },
      {
        title: "Planning questions",
        keyPoints: [
          "Who would help with bathing, meals, medications, transportation, and supervision?",
          "Could care be safely provided at home?",
          "What family caregiving time is realistic?",
          "What savings or insurance could support care?",
          "Could the person qualify for Medicaid or state long-term services?",
          "Who has power of attorney and access to needed documents?"
        ]
      }
    ],
    example: {
      title: "After rehab ends",
      body: "An older adult has a covered skilled rehab stay after surgery. Therapy improves, and skilled coverage ends. The person still needs help bathing, dressing, cooking, and getting to the bathroom safely. Those needs may be custodial. Medicare may stop paying even though the person still needs daily help, so the family has to plan for home caregivers, facility costs, Medicaid eligibility, or other supports."
    },
    commonMistakes: [
      "Assuming Medicare pays for nursing home care indefinitely.",
      "Confusing short-term skilled care with long-term custodial care.",
      "Waiting until discharge day to ask who will provide daily help.",
      "Assuming Medicaid rules are the same in every state.",
      "Ignoring legal documents and decision-makers until a crisis."
    ],
    takeaway: "Medicare is mainly health insurance. Long-term custodial care is a separate planning problem. Families should understand the difference early, verify Medicaid rules by state, and plan before a hospital crisis forces rushed decisions.",
    sources: [SOURCE_PRESETS.medicareLongTermCare, SOURCE_PRESETS.medicaidLtss, SOURCE_PRESETS.medicaidEligibility, SOURCE_PRESETS.kffMedicaid101],
  },
  {
    slug: "how-to-pick-retirement-investments-at-work",
    title: "How to Pick Retirement Investments at Work",
    category: "Retirement",
    readTime: "7 min read",
    promise: "A practical framework for choosing funds inside a workplace 403(b) or similar retirement plan.",
    audience: "Healthcare workers who enrolled in a workplace retirement plan and now need to choose investments without becoming a finance expert.",
    summary: "The simplest retirement investing decision for many workers is a low-cost target-date fund that roughly matches their expected retirement year. Another simple approach is a diversified mix of broad index funds. The biggest mistakes are not investing contributions, missing the employer match, paying high fees without understanding them, and changing investments based on short-term market fear.",
    body: [
      "Choosing investments inside a 403(b), 401(k), or similar workplace plan can feel harder than signing up for the plan itself.",
      "Most employees are not given a class on expense ratios, target-date funds, asset allocation, bonds, index funds, or default investments. They are just handed a fund menu and expected to choose.",
      "This guide is educational, not individualized investment advice. The right choice depends on your goals, age, risk tolerance, other accounts, plan options, and whether you need help from a qualified professional."
    ],
    sections: [
      {
        title: "Start with the employer match",
        definition: "The employer match is money your employer may contribute when you contribute enough under plan rules.",
        keyPoints: [
          "Missing a match is one of the most expensive workplace benefit mistakes.",
          "Match formulas are plan-specific, so read your benefits guide.",
          "The match is separate from the investments you choose."
        ],
        watchOut: "Contributing money is not the same as investing it. Make sure contributions are actually going into the intended fund, not sitting in a default cash option."
      },
      {
        title: "Target-date fund",
        definition: "A diversified fund designed around an expected retirement year, such as 2055 or 2060.",
        keyPoints: [
          "It usually holds a mix of stocks and bonds.",
          "It generally becomes more conservative as the target year approaches.",
          "It can be a simple one-fund default for people who do not want to manage a portfolio manually."
        ],
        watchOut: "Compare fees. Target-date funds can be low-cost or expensive depending on the plan and provider."
      },
      {
        title: "Broad index funds",
        definition: "Funds that track large parts of the market rather than trying to pick individual winners.",
        keyPoints: [
          "Examples may include U.S. stock index, international stock index, and bond index funds.",
          "They are often lower cost than actively managed funds.",
          "They require the worker to choose and maintain an allocation."
        ],
        watchOut: "Simple does not mean risk-free. Stock index funds can fall sharply in bad markets."
      },
      {
        title: "Expense ratio",
        definition: "The annual cost of owning a fund, shown as a percentage of assets.",
        keyPoints: [
          "Lower fees leave more return in your account over time.",
          "A small-looking percentage can matter over decades.",
          "Compare similar funds before choosing."
        ],
        watchOut: "Do not assume the fund with the longest name or best recent performance is the best option. Fees and diversification matter."
      },
      {
        title: "Decision checklist",
        keyPoints: [
          "Am I contributing enough to capture the match, if available?",
          "Are my contributions invested, not parked in cash by accident?",
          "Is there a low-cost target-date fund that fits my timeline?",
          "If building my own mix, am I diversified across major asset classes?",
          "Do I understand the expense ratios?",
          "Can I stick with this during market declines?"
        ]
      }
    ],
    example: {
      title: "A simple nurse-friendly setup",
      body: "A 28-year-old hospital employee opens the 403(b) menu and sees 30 funds. Instead of picking five random funds based on recent returns, they look for a low-cost target-date fund near their expected retirement year. They choose one diversified fund, confirm future contributions are invested there, and review once or twice a year instead of reacting to every market headline."
    },
    relatedCalculator: { label: "403(b) Paycheck Contribution Calculator", href: "/tools#403b" },
    commonMistakes: [
      "Missing the employer match.",
      "Assuming enrollment automatically means the money is invested well.",
      "Picking funds based only on recent performance.",
      "Ignoring expense ratios.",
      "Changing the whole portfolio every time the market falls."
    ],
    takeaway: "For many healthcare workers, a low-cost target-date fund or a simple diversified index-fund mix is enough. The priority is contributing consistently, capturing the match when available, keeping fees reasonable, and avoiding emotional changes.",
    sources: [SOURCE_PRESETS.irs, SOURCE_PRESETS.federalReserve],
  },
  {
    slug: "hospital-cafe-habit",
    title: "Your Hospital Café Habit Might Be Quietly Eating Your Savings Rate",
    category: "Spending",
    readTime: "5 min read",
    promise: "A non-shaming way to see how shift coffee, snacks, and lunches add up over a year.",
    audience: "Healthcare workers who feel like money disappears between paychecks, especially during stressful stretches of shifts.",
    summary: "The point is not that healthcare workers should never buy coffee or lunch. The point is that repeated convenience purchases can become a hidden monthly bill. If a few shift purchases cost $20 to $35 per shift and you work several shifts a week, the yearly total can reach thousands of dollars. Awareness lets you choose which purchases are worth it and which ones are just stress autopilot.",
    body: [
      "Hospital work is stressful. A coffee, protein snack, cafeteria lunch, or post-shift takeout can feel like a small reward after taking care of everyone else.",
      "That is not a moral failure. The problem is when the spending is invisible. Small purchases feel harmless one at a time, but they can quietly become a real line item in your budget.",
      "The goal is not to ban joy. The goal is to decide on purpose."
    ],
    sections: [
      {
        title: "The hospital café tax",
        definition: "The recurring cost of convenience food and drinks during shifts.",
        keyPoints: [
          "Coffee, energy drinks, snacks, lunch, and dessert can stack quickly.",
          "The purchase usually feels small because it happens during a hard shift.",
          "The monthly total matters more than any single coffee."
        ],
        watchOut: "If the same purchases happen every shift, treat them like a recurring bill, not a random expense."
      },
      {
        title: "Savings rate",
        definition: "The percentage of income you keep instead of spending.",
        keyPoints: [
          "Raising savings rate does not always require a huge raise.",
          "Reducing repeated spending can free up cash for emergency savings, debt payoff, or investing.",
          "The best spending cuts are usually the ones you barely miss."
        ],
        watchOut: "Do not cut the one purchase that genuinely helps you get through a shift if it prevents a much bigger post-shift spending spiral."
      },
      {
        title: "A realistic middle ground",
        keyPoints: [
          "Bring coffee most shifts, buy café coffee on the hardest shifts.",
          "Pack a protein snack before a long shift.",
          "Keep one emergency meal at work if possible.",
          "Set a weekly shift-spending number instead of relying on willpower.",
          "Move the saved amount automatically so it does not disappear elsewhere."
        ]
      }
    ],
    example: {
      title: "Four shifts a week",
      body: "A nurse spends $6 on coffee, $5 on a snack, and $13 on lunch during four shifts each week. That is $24 per shift, about $96 per week, and roughly $400 per month before any post-shift takeout. Cutting that in half could free up about $200 per month without requiring a second job."
    },
    relatedCalculator: { label: "Hospital Café Savings Rate Calculator", href: "/tools#cafe" },
    commonMistakes: [
      "Thinking small purchases do not matter because each one is under $15.",
      "Trying to eliminate every treat and then rebounding into bigger spending.",
      "Buying food because nothing was packed, not because the purchase was worth it.",
      "Tracking groceries but ignoring work-shift spending.",
      "Not redirecting the saved money to a specific goal."
    ],
    takeaway: "You do not need to shame yourself out of every coffee. Run the number, decide what is worth keeping, and redirect the difference toward a goal that makes future shifts less stressful.",
    sources: [SOURCE_PRESETS.bls, SOURCE_PRESETS.federalReserve],
  },
  {
    slug: "healthcare-worker-discounts",
    title: "Healthcare Worker Discounts and Perks Directory",
    category: "Workplace Benefits",
    readTime: "4 min read",
    promise: "Use healthcare discounts without letting them become an excuse to buy things you did not need.",
    audience: "Healthcare workers who want legitimate discounts but do not want a spammy affiliate list.",
    summary: "Healthcare worker discounts can be useful, but only when they reduce the cost of something you already planned to buy. The safest approach is to verify eligibility through reputable programs, compare the final price, watch shipping and subscription terms, and avoid buying just because a discount exists.",
    body: [
      "A healthcare worker discount is only a win if it lowers the price of something you already wanted or needed.",
      "Many discount lists become shopping traps. They make you feel like you are saving money while nudging you toward purchases that were never in your plan.",
      "This guide is intentionally not a spammy coupon wall. It is a filter for using discounts wisely."
    ],
    sections: [
      {
        title: "Legitimate verification",
        definition: "A process that confirms healthcare-worker status before giving access to a discount.",
        keyPoints: [
          "Some retailers use verification services rather than asking for hospital details directly.",
          "Use official retailer pages or reputable verification platforms.",
          "Avoid websites that ask for unnecessary personal information or look unrelated to the brand."
        ],
        watchOut: "Do not upload work IDs or personal documents to random coupon sites. Verify that the site is legitimate first."
      },
      {
        title: "Final price matters",
        definition: "The price after discount, shipping, fees, taxes, subscriptions, and return rules.",
        keyPoints: [
          "A 20% discount can still be worse than another store's regular price.",
          "Subscription renewals can erase the benefit of a one-time discount.",
          "Return shipping and restocking fees matter."
        ],
        watchOut: "Compare the final checkout price, not the advertised discount percentage."
      },
      {
        title: "Best categories to check",
        keyPoints: [
          "Work shoes and scrubs you would buy anyway.",
          "Phone plans and internet service if the discount is recurring.",
          "Gym or wellness benefits if you already use them.",
          "Travel, hotels, or rental cars when the final price beats other options.",
          "Professional education, certifications, or exam prep when relevant."
        ]
      },
      {
        title: "Skip the discount when",
        keyPoints: [
          "You would not buy the item without the discount.",
          "The item requires a subscription you may forget to cancel.",
          "The return policy is weak.",
          "The discount requires more personal information than seems necessary.",
          "A normal sale elsewhere is cheaper."
        ]
      }
    ],
    example: {
      title: "Discount that actually helps",
      body: "A nurse needs new work shoes and already planned to spend about $120. A verified healthcare discount brings a durable pair to $96 with free returns. That is a real win. Buying a $180 jacket because it is discounted to $140 is not the same thing if the jacket was never part of the plan."
    },
    commonMistakes: [
      "Treating discounts as income instead of lower prices.",
      "Buying something only because healthcare workers get a deal.",
      "Ignoring shipping, tax, return rules, and subscription renewals.",
      "Assuming a verified discount is automatically the best available price.",
      "Giving sensitive information to questionable coupon sites."
    ],
    takeaway: "Use healthcare discounts as a price reducer, not a shopping trigger. The best discount is on something you already planned to buy, at a final price that beats the alternatives.",
    sources: [SOURCE_PRESETS.federalReserve],
  },
  {
    slug: "burnout-overspending-overeating",
    title: "Burnout, Overspending, and Overeating After Hard Shifts",
    category: "Spending",
    readTime: "6 min read",
    promise: "Understand why hard shifts can trigger expensive or unhealthy coping patterns — without shame.",
    audience: "Healthcare workers whose hardest money and food decisions happen after stressful shifts.",
    summary: "After a hard shift, the brain wants relief. Spending, takeout, alcohol, snacks, and online shopping can become fast ways to feel better. The solution is not shame or perfect discipline. The solution is to build recovery defaults before the shift: food ready, money rules simple, friction on impulse purchases, and a plan for real rest.",
    body: [
      "Healthcare workers often make their worst financial decisions when they are the most exhausted.",
      "After a 12-hour shift, it is normal to want relief. The problem is when relief always comes through spending, overeating, alcohol, or impulse ordering that creates more stress later.",
      "This guide is educational and not medical or mental health advice. If stress, alcohol use, eating patterns, anxiety, depression, or burnout feel unmanageable, use professional support and workplace resources."
    ],
    sections: [
      {
        title: "Burnout spending",
        definition: "Spending used as immediate relief after stress, fatigue, or emotional overload.",
        keyPoints: [
          "It often happens after long shifts, conflict, understaffing, or emotionally heavy care.",
          "The purchase may feel deserved in the moment but frustrating later.",
          "Common examples include takeout, delivery apps, online shopping, convenience snacks, and alcohol."
        ],
        watchOut: "The goal is not to remove every comfort. It is to separate planned recovery from automatic spending."
      },
      {
        title: "Decision fatigue",
        definition: "The worn-down feeling after making too many decisions or managing too much stress.",
        keyPoints: [
          "After a hard shift, the easiest choice usually wins.",
          "If the easiest choice is delivery, scrolling, or impulse shopping, that becomes the default.",
          "Better defaults beat willpower."
        ],
        watchOut: "Do not expect post-shift discipline to solve a system you can design before the shift."
      },
      {
        title: "Recovery budget",
        definition: "A planned amount of money for rest, convenience, and comfort that does not sabotage bigger goals.",
        keyPoints: [
          "Choose a weekly number for takeout, coffee, or treats.",
          "Use it without guilt when it is planned.",
          "Stop treating every hard shift as a blank check."
        ],
        watchOut: "A recovery budget should reduce shame and surprise, not become another strict rule you hate."
      },
      {
        title: "Better defaults",
        keyPoints: [
          "Keep one easy meal at home for post-shift nights.",
          "Pack a protein snack or drink before work.",
          "Put a 24-hour delay on nonessential online purchases after bad shifts.",
          "Move savings automatically on payday before shift stress hits.",
          "Plan one real recovery activity that does not require spending."
        ]
      }
    ],
    example: {
      title: "The post-shift loop",
      body: "A respiratory therapist leaves work drained, orders $28 of delivery, buys a few online items while scrolling, and feels guilty the next morning. A better system is not shame. It is a freezer meal, a planned $40 weekly convenience budget, app notifications turned off, and a rule that nonessential purchases wait until after sleep."
    },
    relatedCalculator: { label: "Hospital Café Savings Rate Calculator", href: "/tools#cafe" },
    commonMistakes: [
      "Calling it laziness when it is often exhaustion and stress.",
      "Trying to cut every comfort instead of planning better ones.",
      "Leaving food decisions until after the shift.",
      "Shopping online immediately after emotionally hard shifts.",
      "Ignoring burnout until it becomes a financial, health, or relationship problem."
    ],
    takeaway: "Hard shifts create predictable weak points. Build defaults before the shift, budget for reasonable comfort, and make the expensive impulse choice less automatic.",
    sources: [SOURCE_PRESETS.federalReserve],
  },
];

const overrideSlugs = new Set(PUBLISHED_ARTICLE_OVERRIDES.map((article) => article.slug));

export const SITE_ARTICLES: Article[] = [
  ...BASE_ARTICLES.filter((article) => !overrideSlugs.has(article.slug)),
  ...PUBLISHED_ARTICLE_OVERRIDES,
];

export const articles = SITE_ARTICLES;
