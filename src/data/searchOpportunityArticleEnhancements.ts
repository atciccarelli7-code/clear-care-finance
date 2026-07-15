import type { Article, ArticleSection } from "./articles";

const REVIEW_DATE = "2026-07-15";

const directAnswerSection = (definition: string, keyPoints: string[], watchOut?: string): ArticleSection => ({
  title: "The direct answer",
  definition,
  keyPoints,
  ...(watchOut ? { watchOut } : {}),
});

const prependSection = (article: Article, section: ArticleSection) => [section, ...(article.sections ?? [])];

const reviewMetadata = (scope: string, timeSensitive = false) => ({
  lastReviewedAt: REVIEW_DATE,
  nextReviewAt: timeSensitive ? "2026-10-15" : "2027-01-15",
  timeSensitive: articleTimeSensitive(timeSensitive),
  reviewScope: scope,
  updateNote: "Expanded after reviewing Google Search Console impressions, ranking position, and query intent for Community Acquired Finance.",
});

const articleTimeSensitive = (value: boolean) => value;

const enhanceArticle = (article: Article): Article => {
  switch (article.slug) {
    case "cash-vs-investing-when-you-feel-behind":
      return {
        ...article,
        ...reviewMetadata("Cash reserves, emergency funds, near-term spending, debt costs, retirement matching, investment time horizon, and staged investing decisions."),
        title: "Should You Keep Cash or Invest It? A Practical Decision Framework",
        promise: "Decide which dollars should stay liquid, which should pay down expensive debt, and which can be invested for long-term growth.",
        description: "Use a practical cash-versus-investing framework based on emergency reserves, near-term expenses, debt, employer matching, and time horizon.",
        summary: "Keep money in cash when it protects the emergency fund, covers a known expense within roughly the next few years, or prevents high-interest debt. Invest money that can remain untouched through market declines and is intended for long-term goals. Before choosing either extreme, capture any available employer retirement match, maintain a realistic cash buffer, and use a staged plan when the timing feels uncertain.",
        sections: prependSection(
          article,
          directAnswerSection(
            "Cash and investing solve different problems: cash protects near-term stability, while investing is designed for long-term growth.",
            [
              "Keep an emergency reserve and money for known near-term expenses in a stable, accessible account.",
              "Prioritize expensive debt and any available employer retirement match before adding taxable investments.",
              "Invest only money that can remain invested through a major market decline without forcing a sale.",
              "A staged contribution plan can reduce decision paralysis without abandoning long-term compounding.",
            ],
            "Do not invest money needed for rent, a move, a wedding, taxes, medical costs, or another foreseeable expense simply because cash feels unproductive.",
          ),
        ),
        comparisonTable: {
          headers: ["Dollar purpose", "Usually belongs in", "Reason"],
          rows: [
            ["Emergency reserve", "Cash or cash equivalent", "Must be available without market-loss risk"],
            ["Known expense in the next few years", "Cash or short-duration savings", "The spending date matters more than maximum return"],
            ["High-interest debt payoff", "Debt reduction", "The avoided interest is a predictable benefit"],
            ["Retirement or a goal many years away", "Diversified investments", "Long time horizon can absorb normal market volatility"],
          ],
        },
        numberedSteps: [
          "Set a minimum emergency-fund target based on essential monthly expenses and job stability.",
          "List every known expense expected within the next few years and keep that money outside volatile investments.",
          "Capture the full employer retirement match when the budget can support it.",
          "Compare remaining debt interest rates with the role and risk of additional investing.",
          "Choose a diversified investment allocation for money with a long time horizon.",
          "Automate a staged monthly contribution when an all-at-once decision would cause inaction.",
        ],
        questionsToAsk: [
          "How many months of essential expenses are already protected?",
          "Which large expenses are likely before this money has time to recover from a market decline?",
          "Am I missing an employer retirement match?",
          "Would investing this money force me to use a credit card or sell during a downturn?",
          "Is this goal measured in months, a few years, or decades?",
          "Would a staged contribution plan help me act consistently?",
        ],
      };

    case "hospital-cafe-habit":
      return {
        ...article,
        ...reviewMetadata("Hospital cafeteria spending, shift-based convenience purchases, annualized cost, meal planning, payroll leakage, and realistic behavior-change strategies."),
        title: "How Much Does Hospital Cafeteria Spending Cost Per Year?",
        promise: "Annualize the cost of cafeteria meals, coffee, and convenience purchases without pretending every shift meal can be eliminated.",
        description: "Calculate the yearly cost of hospital cafeteria meals and coffee, then build a realistic shift-work spending plan instead of an all-or-nothing budget.",
        summary: "A purchase that feels small during one shift becomes meaningful when multiplied across weekly shifts and an entire year. The useful calculation is average spending per shift multiplied by shifts per week and working weeks per year. The goal is not necessarily zero cafeteria spending; it is deciding which purchases are worth the convenience and replacing the rest with a repeatable meal, snack, and coffee plan.",
        sections: prependSection(
          article,
          directAnswerSection(
            "Annual hospital cafeteria spending equals average spending per shift multiplied by shifts worked per week and working weeks per year.",
            [
              "A $12 purchase across three shifts per week for 48 working weeks is about $1,728 per year.",
              "Coffee, vending, delivery, and late-shift snacks should be included when they are part of the same pattern.",
              "Convenience has real value during healthcare shifts, so the best target may be fewer unplanned purchases rather than none.",
              "A dedicated per-shift allowance is easier to sustain than relying on willpower after a difficult shift.",
            ],
            "Do not treat food spending as a moral failure. The useful question is whether the convenience is intentional and worth the annual cost.",
          ),
        ),
        comparisonTable: {
          headers: ["Average spend per shift", "Three shifts weekly for 48 weeks", "Approximate annual cost"],
          rows: [
            ["$5", "144 shifts", "$720"],
            ["$10", "144 shifts", "$1,440"],
            ["$15", "144 shifts", "$2,160"],
            ["$20", "144 shifts", "$2,880"],
          ],
        },
        numberedSteps: [
          "Review two to four weeks of cafeteria, coffee, vending, and delivery purchases made during work.",
          "Calculate the average cost per shift rather than focusing on the most expensive day.",
          "Multiply the average by expected weekly shifts and working weeks per year.",
          "Choose which purchases provide enough convenience or enjoyment to keep intentionally.",
          "Prepare one reliable meal, snack, and drink backup for the purchases you want to replace.",
          "Set a per-shift allowance and reassess after one month instead of imposing a permanent ban.",
        ],
        questionsToAsk: [
          "What is my true average spending per shift?",
          "Which purchases happen because I am hungry, exhausted, unprepared, or seeking relief?",
          "Which cafeteria purchase genuinely improves a difficult shift?",
          "What backup meal or snack can survive a long workday?",
          "Would a fixed weekly work-food allowance be easier than tracking every item?",
          "What would I prefer this annual amount to fund instead?",
        ],
      };

    case "long-term-care-and-custodial-care":
      return {
        ...article,
        ...reviewMetadata("Skilled care, custodial care, activities of daily living, Medicare coverage limits, Medicaid pathways, caregiver planning, and long-term services and supports.", true),
        title: "Skilled Care vs. Custodial Care: What Medicare Usually Covers",
        promise: "Separate short-term skilled care from long-term custodial help and identify the coverage questions families should ask before a crisis.",
        description: "Learn the difference between skilled care and custodial care, what Medicare may cover, and when Medicaid or separate long-term-care planning may matter.",
        summary: "Skilled care requires licensed clinical services such as nursing, therapy, wound care, or medication management and may be covered by Medicare when specific rules are met. Custodial care is ongoing help with daily activities such as bathing, dressing, toileting, eating, mobility, meals, or supervision. Medicare generally does not pay for most long-term custodial care, so families should evaluate Medicaid eligibility, personal resources, caregiver capacity, and other long-term-care options early.",
        sections: prependSection(
          article,
          directAnswerSection(
            "Medicare may cover qualifying short-term skilled care, but it generally does not cover ongoing custodial care when daily-living assistance is the main need.",
            [
              "Skilled care involves clinical services that must be performed or supervised by licensed professionals.",
              "Custodial care focuses on activities of daily living and supervision over time.",
              "A nursing facility can provide both types of care, but the setting alone does not determine Medicare coverage.",
              "Medicaid may help with long-term services and supports for people who meet state eligibility rules.",
            ],
            "Do not assume that a hospital discharge to a nursing facility means Medicare will pay for an unlimited stay.",
          ),
        ),
        comparisonTable: {
          headers: ["Type of care", "Typical need", "Coverage question"],
          rows: [
            ["Skilled nursing or therapy", "Clinical treatment or rehabilitation requiring licensed professionals", "Are Medicare's medical-necessity and eligibility rules met?"],
            ["Custodial care", "Bathing, dressing, toileting, eating, mobility, meals, or supervision", "Who will pay when daily-living help is the primary need?"],
            ["Home health services", "Intermittent qualifying skilled care at home", "Does the person meet home-health eligibility and plan-of-care requirements?"],
            ["Long-term services and supports", "Ongoing assistance at home or in a facility", "Could Medicaid, private coverage, personal assets, or family caregiving apply?"],
          ],
        },
        numberedSteps: [
          "Ask the care team to describe the exact skilled services and daily-living assistance the person needs.",
          "Confirm whether the current service is rehabilitation, skilled nursing, home health, or primarily custodial care.",
          "Request the expected coverage period, patient cost, and written notice when coverage may end.",
          "Check Medicaid and Medicare Savings Program pathways using the person's state, income, resources, and disability status.",
          "Estimate caregiver time, home-safety needs, transportation, and paid-help costs.",
          "Document a long-term plan before the next hospitalization or functional decline creates an emergency decision.",
        ],
        questionsToAsk: [
          "Which services are skilled and which are custodial?",
          "What Medicare rule supports coverage, and when could coverage end?",
          "What will the daily or monthly cost be after covered care ends?",
          "Could the person qualify for Medicaid long-term services and supports?",
          "Can care be provided safely at home, and what caregiver support is required?",
          "What written appeal or discharge rights apply if coverage is ending?",
        ],
        relatedCalculator: { label: "Medicare and Medicaid Eligibility Check", href: "/tools/medicare-medicaid-eligibility-check" },
      };

    case "medicare-advantage-vs-original-medicare-2026":
      return {
        ...article,
        ...reviewMetadata("2026 Original Medicare and Medicare Advantage structure, provider access, premiums, cost sharing, annual limits, drug coverage, prior authorization, travel, and supplemental coverage.", true),
        title: "Medicare Advantage vs. Original Medicare in 2026: Key Tradeoffs",
        promise: "Compare provider access, premiums, annual cost limits, drug coverage, prior authorization, travel, and supplemental coverage before choosing a Medicare path.",
        description: "Compare Medicare Advantage and Original Medicare in 2026 by provider access, premiums, cost sharing, drug coverage, prior authorization, travel, and Medigap.",
        summary: "Original Medicare generally offers broad nationwide access to clinicians and facilities that accept Medicare, but Parts A and B do not include a built-in annual out-of-pocket maximum. Medicare Advantage plans provide Part A and Part B benefits through private insurers, use plan-specific networks and rules, and include an annual limit on covered Part A and Part B spending. The better fit depends on doctors, hospitals, prescriptions, travel, premiums, supplemental coverage, prior authorization, and total bad-year exposure—not the advertised premium alone.",
        sections: prependSection(
          article,
          directAnswerSection(
            "Original Medicare emphasizes broad provider access and flexible supplemental coverage, while Medicare Advantage bundles coverage through a private plan with networks, plan rules, and an annual out-of-pocket limit.",
            [
              "Original Medicare generally allows nationwide use of providers that accept Medicare.",
              "Medicare Advantage plans may use networks, referrals, and prior authorization and can differ substantially by county and insurer.",
              "Original Medicare Parts A and B do not have a built-in annual out-of-pocket maximum, while Medicare Advantage plans do for covered Part A and Part B services.",
              "Prescription coverage, Medigap eligibility, travel needs, and total annual cost should be compared separately from the headline premium.",
            ],
            "A $0-premium Medicare Advantage plan still requires the Part B premium and can create copays, coinsurance, network restrictions, and prior-authorization requirements.",
          ),
        ),
        comparisonTable: {
          headers: ["Decision factor", "Original Medicare", "Medicare Advantage"],
          rows: [
            ["Provider access", "Generally any U.S. provider that accepts Medicare", "Plan network and service-area rules may apply"],
            ["Annual Part A and B spending limit", "No built-in maximum without other coverage", "Plan includes a maximum for covered Part A and Part B services"],
            ["Drug coverage", "Usually add a separate Part D plan", "Often included, but formulary and pharmacy rules vary"],
            ["Supplemental coverage", "May pair with Medigap when eligible", "Medigap does not pay Medicare Advantage cost sharing"],
          ],
        },
        numberedSteps: [
          "List every physician, hospital, specialist, medication, and recurring service that must remain accessible.",
          "Compare monthly premiums, deductibles, copays, coinsurance, drug costs, and bad-year exposure.",
          "Check network status and prior-authorization rules for anticipated care.",
          "Evaluate travel, seasonal residence, and out-of-area coverage needs.",
          "Review Medigap timing and underwriting considerations before leaving or delaying supplemental coverage.",
          "Use the official Medicare Plan Compare information and confirm material details directly with the plan before enrollment.",
        ],
        questionsToAsk: [
          "Are my clinicians, hospitals, and medications covered next year?",
          "What is the maximum I could owe for covered Part A and Part B services?",
          "Which services require prior authorization or referrals?",
          "How are urgent, emergency, and routine services handled while traveling?",
          "Can I obtain or keep the Medigap coverage I want?",
          "What changed from the current plan year?",
        ],
        relatedCalculator: { label: "Medicare Advantage Plan Helper", href: "/tools/medicare-advantage-plan-helper" },
      };

    default:
      return article;
  }
};

export const applySearchOpportunityArticleEnhancements = (articles: Article[]) => articles.map(enhanceArticle);
