import type { Article } from "./articles";
import { SOURCE_PRESETS } from "./sources";

export const RETIREMENT_INVESTMENT_ARTICLES: Article[] = [
  {
    slug: "how-to-pick-retirement-investments-at-work",
    title: "How to Pick Retirement Investments at Work",
    category: "Build Wealth",
    readTime: "8 min read",
    promise: "A plain-English guide to target-date funds, S&P 500 index funds, expense ratios, risk, and changing investments inside a workplace retirement account.",
    audience: "Healthcare workers with a 403(b), 401(a), 401(k), or 457(b) who are contributing money but are not sure what the account is actually invested in.",
    summary: "Many workers are placed into a default target-date fund and never realize they can review or change their investments. A target-date fund can be a reasonable one-fund choice, but it is not the only option and it is not always the cheapest. The key is to understand the account, the investment menu, the expense ratio, the stock/bond mix, and the risk you are choosing. An S&P 500 index fund can be a powerful low-cost way to own large U.S. companies, but it is still stock-market risk and should be used with a long time horizon.",
    body: [
      "A workplace retirement account has two parts: the account and the investments inside it. The account might be a 403(b), 401(k), 401(a), or 457(b). The investment is what your contributions buy inside that account. A lot of people contribute for years without knowing the second part.",
      "Many plans default workers into a target-date fund. That is not automatically bad. A target-date fund is designed to be simple: it usually owns a mix of stocks and bonds and gradually becomes more conservative as the retirement year approaches. For someone who wants a one-fund solution, that can be useful.",
      "But default does not mean best. Some target-date funds are expensive. Some may be too conservative or too aggressive for your situation. Some workers may prefer a low-cost S&P 500 index fund, total U.S. stock market fund, or simple blend of stock and bond funds if the plan menu allows it.",
      "The goal is not to tell every reader to pick the same fund. The goal is to teach them how to look at the menu, understand what they own, compare fees, and choose intentionally instead of accidentally."
    ],
    sections: [
      {
        title: "Step 1: Find what you own now",
        definition: "Log into the retirement plan website and look for current investments, investment elections, future contributions, or investment mix.",
        keyPoints: [
          "The current balance shows what your existing money owns.",
          "Future contribution elections show where new paycheck contributions will go.",
          "Those can be different, so check both before assuming everything is invested the same way."
        ],
        watchOut: "Do not confuse contribution percentage with investment choice. One controls how much money goes in; the other controls what the money buys."
      },
      {
        title: "Step 2: Understand target-date funds",
        definition: "A target-date fund is a diversified all-in-one fund that changes its stock and bond mix over time based on a target retirement year.",
        keyPoints: [
          "It can be a reasonable default for people who want one simple choice.",
          "The fund's glide path usually becomes more conservative as the target year gets closer.",
          "Different companies can build target-date funds differently, even when the target year is the same."
        ],
        watchOut: "A target-date fund can still lose money. It is not a guaranteed retirement balance."
      },
      {
        title: "Step 3: Look for low-cost index funds",
        definition: "An index fund tries to track a market index instead of paying managers to pick stocks actively.",
        keyPoints: [
          "Common examples include S&P 500 index funds, total U.S. stock market funds, international index funds, and bond index funds.",
          "Lower expenses leave more of the fund's return for the investor, all else equal.",
          "Index funds are not risk-free; they simply remove much of the active manager selection problem."
        ]
      },
      {
        title: "Step 4: Know what an S&P 500 fund actually owns",
        definition: "An S&P 500 index fund generally tracks 500 large U.S. companies and is weighted mostly by company size.",
        keyPoints: [
          "It is a concentrated bet on large U.S. public companies, not every company in America.",
          "The biggest companies can become a large share of the fund because of market-cap weighting.",
          "Historically, broad low-cost U.S. stock index investing has been one of the simplest wealth-building tools available, but future returns are not guaranteed."
        ],
        watchOut: "An S&P 500 fund can fall sharply during bear markets. It is usually best suited for long-term money, not emergency cash or near-term expenses."
      },
      {
        title: "Step 5: Check the expense ratio",
        definition: "The expense ratio is the ongoing annual cost of the fund, shown as a percentage of assets.",
        keyPoints: [
          "A 0.03% fund is much cheaper than a 0.60% fund.",
          "Small percentage differences compound over decades.",
          "A higher fee does not automatically mean a better fund."
        ],
        example: "On $100,000, a 0.05% expense ratio costs about $50 per year. A 0.60% expense ratio costs about $600 per year. That gap can matter over a long career."
      },
      {
        title: "Step 6: Pick a risk level you can actually hold",
        definition: "The best fund is not only the one with the highest expected return. It is the one you can keep owning through bad markets.",
        keyPoints: [
          "A young worker may reasonably hold more stock exposure because the money has decades to recover.",
          "A worker near retirement may need more bonds or cash-like stability.",
          "Selling after the market falls can do more damage than picking a slightly imperfect fund."
        ]
      },
      {
        title: "Step 7: Make the change carefully",
        definition: "Most workplace platforms let you change future contributions, rebalance the current balance, or both.",
        keyPoints: [
          "Changing future contributions affects new money from future paychecks.",
          "Exchanging or rebalancing affects money already inside the account.",
          "Read the confirmation screen before submitting because the platform may separate these actions."
        ],
        watchOut: "Do not rapidly trade retirement funds in response to market headlines. This is supposed to be a long-term plan."
      }
    ],
    example: {
      title: "A Fidelity NetBenefits-style example",
      body: "A nurse logs into a workplace retirement account and sees that contributions are going into a 2065 target-date fund. The fund is diversified, but the nurse checks the expense ratio, stock/bond mix, and available index funds. The plan also offers a State Street S&P 500 index option. The S&P 500 fund is not the absolute cheapest fund in the world, but it is low-cost, simple, and aligned with a long time horizon. The nurse decides whether to keep the target-date fund, use the S&P 500 fund, or build a blend based on risk tolerance and time horizon."
    },
    relatedCalculator: { label: "403(b) Paycheck Contribution Calculator", href: "/tools#403b" },
    commonMistakes: [
      "Thinking the employer chooses the best investment automatically.",
      "Changing the contribution percentage but never choosing the investment inside the account.",
      "Assuming every target-date fund with the same year has the same cost and risk.",
      "Picking the highest recent performer without understanding what it owns.",
      "Ignoring expense ratios because they look small.",
      "Going 100% stocks without understanding how painful a major market decline can feel.",
      "Treating this article as individualized advice instead of an education framework."
    ],
    takeaway: "A workplace retirement account should not be a black box. Know what you own, check the fees, understand the risk, and choose intentionally. A low-cost index fund can be a powerful wealth-building tool, but the right investment mix must fit the worker's time horizon, risk tolerance, and total financial life.",
    sources: [SOURCE_PRESETS.irs, SOURCE_PRESETS.investorGovMutualFunds, SOURCE_PRESETS.secTargetDateFunds, SOURCE_PRESETS.sp500Methodology, SOURCE_PRESETS.investorGovAssetAllocation]
  }
];
