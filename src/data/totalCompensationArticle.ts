import type { Article } from "./articles";

export const TOTAL_COMPENSATION_ARTICLE: Article = {
  slug: "how-healthcare-workers-should-compare-job-offers",
  title: "How Healthcare Workers Should Compare Two Job Offers",
  category: "Healthcare Worker Pay",
  readTime: "8 min read",
  promise: "Compare salary, overtime, differentials, benefits, PTO, insurance premiums, commute burden, and schedule tradeoffs before accepting a healthcare job.",
  audience: "Nurses and other healthcare workers comparing bedside, outpatient, salaried, administrative, clinical specialist, medical device, health technology, or other job offers.",
  summary: "A larger salary does not automatically create a better financial offer. Healthcare workers should compare direct cash compensation, overtime eligibility, shift differentials, employer retirement contributions, health premiums, PTO, commuting and travel costs, unpaid work, schedule burden, and career development. Put the measurable pieces into one total-compensation estimate, then review quality-of-life factors separately rather than forcing every tradeoff into one score.",
  body: [
    "Healthcare job offers are easy to misread because the headline number is usually the easiest number to compare. An hourly bedside role may include overtime and differentials that disappear in a salaried role. A lower-salary employer may contribute more to retirement, charge less for insurance, or require fewer unpaid hours. A higher-salary role may still be worth taking because it improves schedule, career direction, or quality of life — but you should know the financial tradeoff before deciding.",
    "The goal is not to turn every benefit into a fake precise number. The goal is to separate what can be reasonably estimated from what must remain a personal judgment."
  ],
  sections: [
    {
      title: "Start with direct cash compensation",
      definition: "Direct cash compensation is the money expected to appear in wages or bonus payments before taxes and payroll deductions.",
      keyPoints: [
        "For an hourly role, calculate scheduled hours, expected paid weeks, overtime hours, the overtime multiplier, and the hours that actually receive a differential.",
        "For a salaried role, confirm whether the salary covers a standard schedule or routinely includes unpaid work outside stated hours.",
        "Separate guaranteed cash from discretionary bonuses, temporary incentives, callback pay, holiday premiums, and one-time sign-on bonuses.",
        "Annualize a sign-on bonus across the period you must remain employed to avoid repayment rather than treating the full amount as permanent annual income."
      ],
      watchOut: "Do not assume every premium or bonus is guaranteed. Ask what is written into the offer, what depends on staffing needs, and what can be changed by policy."
    },
    {
      title: "Compare overtime and differential rules",
      definition: "Healthcare workers often earn meaningful income from nights, weekends, call, charge pay, preceptor pay, and overtime that may not exist in another role.",
      keyPoints: [
        "Covered, non-exempt employees generally receive overtime under federal rules when applicable requirements are met, but exempt status and overtime eligibility depend on the actual role and pay arrangement.",
        "Ask whether overtime begins after 40 hours in a workweek, after a scheduled shift, or under another employer policy.",
        "Confirm whether differentials apply to all worked hours, only specific shifts, or only hours meeting a minimum threshold.",
        "Do not project unlimited overtime. Use a sustainable expectation based on what you realistically plan to work."
      ],
      watchOut: "A salary that looks higher may be lower on an effective hourly basis when the new role regularly requires travel, email, charting, events, or administrative work outside scheduled hours."
    },
    {
      title: "Add employer-funded benefits",
      definition: "Total compensation includes wages plus employer-paid benefits with economic value.",
      keyPoints: [
        "Include employer retirement matching and non-elective contributions, but verify which compensation is eligible and when the contribution vests.",
        "Include employer HSA or HRA contributions that you are expected to receive.",
        "Only assign a cash value to tuition, certification, continuing education, disability, life insurance, or other benefits when the value is known and you reasonably expect to use the benefit.",
        "Treat pension or equity value cautiously because a simple annual estimate may miss vesting, funding, market, and tenure assumptions."
      ],
      watchOut: "A stated match is not automatically received. The employee may need to contribute, remain employed through a vesting period, or satisfy plan eligibility rules."
    },
    {
      title: "Subtract the costs attached to the job",
      definition: "A job can pay more while creating higher recurring costs.",
      keyPoints: [
        "Compare the employee premium for the exact health coverage tier you need, not the employer's lowest advertised premium.",
        "Include dental and vision premiums when they differ materially.",
        "Estimate commuting, parking, tolls, transit, required travel, licensing, certification, or equipment costs that are not reimbursed.",
        "Compare total health-plan exposure separately when deductibles, networks, prescriptions, and out-of-pocket maximums differ."
      ],
      watchOut: "This comparison is not a take-home-pay calculation. Taxes and payroll treatment can differ by household, state, benefit type, and compensation structure."
    },
    {
      title: "Handle PTO without double counting",
      definition: "Paid time off has real value, but salary comparisons can accidentally count it twice.",
      keyPoints: [
        "For hourly roles, paid leave may represent additional paid hours beyond worked hours and can be estimated using the hourly rate.",
        "For salaried roles, annual salary usually continues during paid leave, so adding PTO value again to annual compensation can double count it.",
        "Compare the number of usable days, waiting periods, accrual caps, holiday schedules, and whether unused leave can be carried over or paid out.",
        "Paid parental leave, sick leave, and vacation may deserve separate review when policies differ."
      ]
    },
    {
      title: "Calculate effective hourly value",
      definition: "Effective hourly value translates total estimated compensation into the time the role actually requires.",
      keyPoints: [
        "Divide estimated compensation after selected work costs by scheduled annual hours for a standard comparison.",
        "Also divide by actual hours when a salaried role includes routine unpaid work outside scheduled time.",
        "Use this number to understand the tradeoff, not to reduce every career decision to hourly pay.",
        "A lower effective hourly rate can still be rational when the role creates unusually strong advancement, flexibility, training, or long-term income potential."
      ],
      watchOut: "Commute time, on-call availability, and travel are burdens even when they are not legally compensable working time. Keep the financial and quality-of-life analyses distinct."
    },
    {
      title: "Review quality of life separately",
      definition: "Some job differences matter deeply but should not be converted into a fake scientific score.",
      keyPoints: [
        "Compare workdays per week, nights, weekends, holidays, call, travel, remote flexibility, schedule predictability, and physical demands.",
        "Consider whether a role improves or weakens sleep, family time, recovery, autonomy, and the ability to maintain healthy routines.",
        "Review leadership quality, training, product or clinical credibility, territory expectations, and advancement opportunities.",
        "Decide which factors are non-negotiable before the compensation difference pressures you into rationalizing a poor fit."
      ]
    },
    {
      title: "Ask for the documents behind the offer",
      keyPoints: [
        "Request the written offer, benefits rate sheet, retirement plan summary, vesting schedule, PTO policy, holiday policy, and job description.",
        "Ask how the role is classified for overtime and how bonuses, call, travel, and reimbursement work.",
        "Review sign-on repayment language and the date each benefit becomes effective.",
        "Confirm the expected schedule with the hiring manager, not only the recruiter or posting."
      ],
      watchOut: "Verbal assurances are useful context but are not a substitute for written compensation, schedule, benefit, and repayment terms."
    }
  ],
  example: {
    title: "Bedside RN versus clinical specialist",
    body: "A bedside RN may earn less in base pay but receive time-and-a-half overtime, night differential, three scheduled workdays, and a strong employer contribution. A clinical specialist may offer a higher salary and better career trajectory but require five workdays, regional travel, unpaid email or event time, and higher insurance premiums. The correct comparison adds the measurable dollars, calculates effective value per actual hour, and then reviews travel, schedule, physical demands, and advancement separately."
  },
  relatedCalculator: {
    label: "Healthcare Worker Total Compensation Comparison",
    href: "/tools/healthcare-worker-total-compensation-comparison"
  },
  commonMistakes: [
    "Comparing annual salary without including overtime and differentials from the current role.",
    "Counting a retirement match before confirming eligibility, employee contribution requirements, and vesting.",
    "Using the employer's cheapest advertised health premium instead of the coverage tier actually needed.",
    "Treating a one-time sign-on bonus as recurring annual compensation.",
    "Adding salary PTO value again even though it is already included in annual salary.",
    "Ignoring unpaid salaried work, commuting, travel, parking, tolls, and on-call burden.",
    "Forcing schedule, health, and career-development factors into an arbitrary numerical score."
  ],
  takeaway: "Build the financial comparison first, then make the human decision. The best offer is not always the highest salary, but you should understand exactly how much money, time, benefit value, and quality of life you are trading before accepting it.",
  sources: [
    {
      name: "U.S. Bureau of Labor Statistics",
      pageTitle: "Employer Costs for Employee Compensation",
      url: "https://www.bls.gov/news.release/ecec.toc.htm",
      note: "Official compensation data framework separating wages and salaries from employer benefit costs."
    },
    {
      name: "U.S. Department of Labor",
      pageTitle: "Overtime Pay",
      url: "https://www.dol.gov/agencies/whd/overtime",
      note: "Official federal overtime overview for covered, non-exempt employees."
    },
    {
      name: "Internal Revenue Service",
      pageTitle: "Retirement Topics — Contributions",
      url: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-contributions",
      note: "Official information about employee and employer contributions to workplace retirement plans."
    },
    {
      name: "HealthCare.gov",
      pageTitle: "Your Total Costs for Health Care",
      url: "https://www.healthcare.gov/choose-a-plan/your-total-costs/",
      note: "Official explanation of premiums and out-of-pocket costs when comparing health coverage."
    }
  ]
};
