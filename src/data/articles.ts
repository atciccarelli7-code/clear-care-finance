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
    audience: "Patients, families, and anyone helping a parent navigate Medicare for the first time.",
    summary: "Original Medicare = Parts A and B from the federal government. Medicare Advantage (Part C) = a private plan that replaces Parts A and B and usually bundles Part D drugs. Medigap helps pay for what Original Medicare leaves behind.",
    body: [
      "Paste this article from Notion. The article template will render your headings, paragraphs, and lists with consistent typography and spacing.",
    ],
    commonMistakes: [
      "Assuming Medicare covers long-term custodial care (it generally does not).",
      "Skipping Part D enrollment when first eligible and getting a permanent late penalty.",
      "Not comparing in-network providers when switching to Medicare Advantage.",
    ],
    takeaway: "Pick a structure first (Original Medicare + Medigap + Part D, vs. Medicare Advantage), then compare specific plans within that structure.",
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
    audience: "New hires and anyone re-evaluating benefits during open enrollment.",
    summary: "PPO vs HMO vs HDHP. HSA vs FSA. Employer match. Vesting. Pre-tax vs Roth. All in plain English.",
    body: ["Paste this article from Notion."],
    relatedCalculator: { label: "403(b) Paycheck Contribution Calculator", href: "/tools#403b" },
    takeaway: "Read the Summary of Benefits, then pick the plan whose worst-case year you can actually afford.",
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
