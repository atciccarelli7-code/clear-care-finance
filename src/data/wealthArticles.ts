import type { Article } from "./articles";
import { SOURCE_PRESETS } from "./sources";

export const WEALTH_ARTICLES: Article[] = [
  {
    slug: "healthcare-worker-money-map",
    title: "The Healthcare Worker Money Map",
    category: "Build Wealth",
    readTime: "6 min read",
    promise: "A plain-English order of operations for turning a healthcare paycheck into savings, retirement contributions, and long-term wealth.",
    audience: "Nurses, techs, respiratory therapists, pharmacists, APPs, physicians, and other healthcare workers who want a simple paycheck plan without finance jargon.",
    summary: "A healthcare paycheck has to cover today and build tomorrow. A simple money map starts with bills and a small cash buffer, then captures the employer retirement match, handles high-interest debt, builds emergency savings, increases retirement contributions, and eventually adds taxable investing when the basics are stable. The goal is not perfection. The goal is a repeatable system that survives long shifts, stress, and irregular expenses.",
    body: [
      "Hospital work can create a strange money problem. The paycheck may be decent, but the schedule is exhausting, deductions are confusing, and small stress purchases can hide the fact that real financial progress is possible.",
      "A money map is not a budget spreadsheet. It is a priority order. Each paycheck should have a job before it disappears: bills, emergency cash, employer match, high-interest debt, retirement savings, and then extra investing when the foundation is stable.",
      "Healthcare workers do not need a complicated investing strategy to begin building wealth. The biggest levers are usually savings rate, avoiding high-interest debt, getting the employer match, using tax-advantaged accounts, and staying consistent through boring markets."
    ],
    sections: [
      {
        title: "Step 1: Know the real paycheck",
        definition: "Start with take-home pay after taxes, insurance premiums, retirement contributions, HSA/FSA elections, union dues, parking, and other payroll deductions.",
        keyPoints: [
          "Gross pay is not the same as money available to spend.",
          "Overtime and shift differential can make income inconsistent.",
          "Benefits choices can change take-home pay more than people expect."
        ],
        watchOut: "Do not build a lifestyle around overtime if the base paycheck cannot support the bills."
      },
      {
        title: "Step 2: Keep a starter emergency fund",
        definition: "A small cash buffer prevents every car repair, pet bill, or medical copay from becoming credit card debt.",
        keyPoints: [
          "Start with one small target, then build toward a larger cushion over time.",
          "Healthcare schedules are stressful enough without every surprise becoming a financial crisis.",
          "Cash is not exciting, but it protects the investing plan."
        ]
      },
      {
        title: "Step 3: Capture the employer match",
        definition: "The employer match is money your workplace contributes when you contribute enough to qualify under plan rules.",
        keyPoints: [
          "For many workers, this is one of the highest-return financial moves available.",
          "403(b), 401(a), 401(k), and 457(b) details vary by employer.",
          "Check vesting rules so you know when employer contributions fully belong to you."
        ],
        watchOut: "Missing a match is usually more expensive than choosing the imperfect fund inside the plan."
      },
      {
        title: "Step 4: Attack high-interest debt",
        definition: "Debt with a high interest rate can quietly undo investing progress because the balance grows against you.",
        keyPoints: [
          "Credit cards and high-rate private loans deserve priority attention.",
          "A lower-return investment cannot reliably outrun very high-interest debt.",
          "The best plan is often a mix: keep the match, keep basic cash, then attack the expensive debt."
        ]
      },
      {
        title: "Step 5: Increase long-term investing",
        definition: "Once the foundation is stable, increase retirement contributions and consider taxable investing if tax-advantaged accounts are already being used well.",
        keyPoints: [
          "Automation helps because willpower is unreliable after hard shifts.",
          "Broad diversified funds can be enough for most people.",
          "The boring plan that gets funded every paycheck usually beats the clever plan that never becomes a habit."
        ]
      }
    ],
    example: {
      title: "A 12-hour shift paycheck plan",
      body: "A nurse reviews one biweekly paycheck. First, rent, utilities, groceries, and loan payments are covered. Next, enough goes to the 403(b) to receive the full match. A fixed transfer builds emergency savings. Any overtime above the normal paycheck is split between high-interest debt and extra retirement savings. The plan is simple enough to repeat."
    },
    relatedCalculator: { label: "403(b) Paycheck Contribution Calculator", href: "/tools#403b" },
    commonMistakes: [
      "Treating overtime like guaranteed base income.",
      "Missing the employer match while trying to pick the perfect investment.",
      "Keeping no cash buffer and then using credit cards for every surprise.",
      "Increasing lifestyle every time pay increases.",
      "Waiting to invest until everything feels perfectly organized."
    ],
    takeaway: "The best healthcare-worker money plan is simple: stabilize the paycheck, capture employer money, avoid high-interest debt traps, and invest consistently enough that time can do the heavy lifting.",
    sources: [SOURCE_PRESETS.irs, SOURCE_PRESETS.federalReserve, SOURCE_PRESETS.bls]
  },
  {
    slug: "how-healthcare-workers-can-invest-without-picking-stocks",
    title: "How Healthcare Workers Can Invest Without Picking Stocks",
    category: "Build Wealth",
    readTime: "6 min read",
    promise: "A simple investing guide for healthcare workers who want long-term growth without turning investing into a second job.",
    audience: "Healthcare workers who want to build wealth but do not want to research individual stocks, follow the market every day, or gamble with retirement money.",
    summary: "Most healthcare workers do not need to become stock pickers to build wealth. A broad diversified fund, a retirement account, steady contributions, and a long time horizon can do most of the work. The hard part is not finding a secret investment. The hard part is saving consistently, avoiding panic, and not letting complexity stop the plan.",
    body: [
      "Healthcare already takes enough mental energy. Investing should not feel like another shift. For many workers, the strongest plan is boring: use the workplace retirement plan, choose a diversified low-cost fund when available, contribute consistently, and give compounding time to work.",
      "Stock picking can be interesting, but it is not required. A person can build meaningful wealth by owning broad pieces of the market instead of trying to guess which company wins next. That is especially important for retirement money, where the goal is durable progress rather than entertainment.",
      "The key is to separate investing from gambling. Investing is a funded system tied to goals, time, diversification, and patience. Gambling is chasing excitement, hot tips, or short-term price movement without a plan."
    ],
    sections: [
      {
        title: "Start with the account",
        definition: "The account is the container: 403(b), 401(a), 457(b), IRA, Roth IRA, HSA, or taxable brokerage.",
        keyPoints: [
          "A workplace plan can make investing automatic through payroll.",
          "An IRA or Roth IRA can add flexibility outside the employer plan.",
          "A taxable brokerage may come later after emergency cash, debt, and retirement basics are on track."
        ]
      },
      {
        title: "Then choose the investment",
        definition: "The investment is what the account owns, such as a target-date fund, total market index fund, bond fund, or other fund option.",
        keyPoints: [
          "Many workers confuse opening the account with choosing the investment inside it.",
          "Target-date funds can be a simple one-fund option when fees are reasonable.",
          "Broad index funds can provide diversification without needing to pick individual winners."
        ],
        watchOut: "Money can sit uninvested if the account is opened but no investment is selected."
      },
      {
        title: "Use automation",
        definition: "Automatic contributions reduce the number of decisions required after tiring workweeks.",
        keyPoints: [
          "Payroll contributions are one of the easiest forms of automation.",
          "Raising contributions after raises can increase savings without feeling as painful.",
          "Automation helps protect the plan from mood, market headlines, and burnout."
        ]
      },
      {
        title: "Avoid fake precision",
        definition: "A good investing plan does not require perfect timing, perfect funds, or perfect predictions.",
        keyPoints: [
          "Consistent contributions matter more than guessing every market move.",
          "Fees, diversification, and behavior usually matter more than financial noise.",
          "The plan should be simple enough to follow during stressful seasons."
        ]
      }
    ],
    example: {
      title: "A boring but powerful setup",
      body: "A respiratory therapist contributes to a 403(b) every paycheck, uses a low-cost target-date fund, keeps a separate emergency fund, and increases the contribution by 1% after each raise. The strategy is not flashy, but it is repeatable."
    },
    relatedCalculator: { label: "403(b) Paycheck Contribution Calculator", href: "/tools#403b" },
    commonMistakes: [
      "Waiting to invest because the market feels high or scary.",
      "Owning too many random funds without knowing what they do.",
      "Thinking investing requires daily market research.",
      "Confusing stock picking with retirement investing.",
      "Ignoring fund fees and default cash positions."
    ],
    takeaway: "Healthcare workers can build wealth without picking stocks. The repeatable system matters more than the exciting idea.",
    sources: [SOURCE_PRESETS.investorGovCompoundInterest, SOURCE_PRESETS.investorGovAssetAllocation, SOURCE_PRESETS.irs]
  },
  {
    slug: "savings-rate-that-actually-changes-your-life",
    title: "The Savings Rate That Actually Changes Your Life",
    category: "Build Wealth",
    readTime: "5 min read",
    promise: "Why savings rate matters more than tiny budgeting hacks, especially for healthcare workers trying to buy back time.",
    audience: "Healthcare workers who want financial independence, fewer required shifts, more career flexibility, or a cleaner path out of burnout.",
    summary: "Savings rate is the percent of income that gets kept, invested, or used to improve the balance sheet instead of being spent. A higher savings rate does two things at once: it increases how much money is working for the future and reduces the lifestyle that future investments must support. That is why savings rate is one of the most powerful financial independence levers.",
    body: [
      "Savings rate sounds like a boring personal finance term, but it is really a measure of freedom. The more of each paycheck you keep and invest, the less dependent you are on picking up shifts forever.",
      "This does not mean never buying coffee, never taking trips, or never enjoying life after a hard shift. It means knowing which spending actually improves life and which spending is just stress leakage that leaves you stuck in the same cycle.",
      "For healthcare workers, savings rate matters because income often rises through overtime, differentials, second jobs, or career moves. Without a plan, extra income can disappear. With a plan, extra income can shorten the distance to financial independence."
    ],
    sections: [
      {
        title: "What savings rate means",
        definition: "Savings rate is the share of income kept for emergency savings, debt payoff, retirement, investing, or other net-worth-building goals.",
        keyPoints: [
          "It is not just money in a savings account.",
          "Retirement contributions count because they build future wealth.",
          "Principal debt payoff can count because it improves the balance sheet."
        ]
      },
      {
        title: "Why it changes the timeline",
        definition: "Higher savings both increases investment contributions and lowers the future lifestyle that must be funded.",
        keyPoints: [
          "A person saving 5% is mostly dependent on work income for a long time.",
          "A person saving 25% to 40% builds flexibility much faster.",
          "The exact target depends on income, family needs, debt, health, housing, and goals."
        ],
        watchOut: "A high savings rate that creates misery is not durable. The goal is a system you can keep."
      },
      {
        title: "Use overtime intentionally",
        definition: "Extra shifts can either expand lifestyle or accelerate freedom.",
        keyPoints: [
          "Pre-assign overtime to emergency savings, debt payoff, retirement, or brokerage investing.",
          "Do not let every overtime check become random spending by default.",
          "Protect sleep and health. Burnout can erase the benefit of extra income."
        ]
      },
      {
        title: "Watch small leaks without shame",
        definition: "Small purchases are not morally bad, but repeated automatic spending can quietly reduce savings rate.",
        keyPoints: [
          "Hospital cafe spending, delivery food, subscriptions, and impulse purchases can add up.",
          "The point is awareness, not guilt.",
          "Keep the purchases that genuinely help and cut the ones that do not."
        ]
      }
    ],
    example: {
      title: "The cafe example",
      body: "A nurse buying coffee, a snack, and lunch every shift may spend thousands per year at work. Cutting that in half does not require misery. It may simply mean bringing lunch two shifts per week and redirecting the difference to retirement or emergency savings."
    },
    relatedCalculator: { label: "Hospital Cafe Savings Rate Calculator", href: "/tools#cafe" },
    commonMistakes: [
      "Only tracking expenses without deciding what the saved money is for.",
      "Letting overtime disappear into lifestyle inflation.",
      "Trying to cut every enjoyable purchase instead of targeting low-value leaks.",
      "Ignoring retirement contributions when calculating savings rate.",
      "Using shame instead of systems."
    ],
    takeaway: "Savings rate is not about being cheap. It is about buying future flexibility with money that would otherwise disappear without a plan.",
    sources: [SOURCE_PRESETS.federalReserve, SOURCE_PRESETS.bls, SOURCE_PRESETS.investorGovCompoundInterest]
  }
];
