export type ToolEducation = {
  purpose: string;
  readResult: string;
  beforeActing: string;
};

export const TOOL_EDUCATION_BY_TITLE: Record<string, ToolEducation> = {
  "Open Enrollment Final Checklist": {
    purpose: "Use this as a final review before submitting benefit elections that may lock in for the plan year.",
    readResult: "The completion score shows how much of the decision process is documented, not whether a plan is good or bad.",
    beforeActing: "Save confirmation screenshots and verify networks, medications, payroll deductions, dependents, and beneficiaries before the deadline.",
  },
  "Open Enrollment True Cost Calculator": {
    purpose: "Compare two health plans by annual premium, expected care cost, employer HSA/HRA money, and bad-year exposure.",
    readResult: "The expected-year winner may differ from the bad-year winner. That tradeoff matters if cash reserves are thin or care needs are uncertain.",
    beforeActing: "Do not choose on math alone. Confirm doctors, hospitals, prescriptions, authorization rules, and plan documents first.",
  },
  "Compare total yearly cost, not just the paycheck deduction": {
    purpose: "Compare two health plans by annual premium, expected care cost, employer HSA/HRA money, and bad-year exposure.",
    readResult: "The expected-year winner may differ from the bad-year winner. That tradeoff matters if cash reserves are thin or care needs are uncertain.",
    beforeActing: "Do not choose on math alone. Confirm doctors, hospitals, prescriptions, authorization rules, and plan documents first.",
  },
  "Out-of-Pocket Max Estimator": {
    purpose: "Estimate how much covered in-network cost-sharing may remain before the plan's yearly out-of-pocket maximum is reached.",
    readResult: "A lower remaining amount means the member may be closer to the yearly cap, but insurer claim processing controls the official number.",
    beforeActing: "Verify the latest insurer portal, EOBs, covered status, network status, and any excluded or denied services before relying on the estimate.",
  },
  "How close are you to the out-of-pocket max?": {
    purpose: "Estimate how much covered in-network cost-sharing may remain before the plan's yearly out-of-pocket maximum is reached.",
    readResult: "A lower remaining amount means the member may be closer to the yearly cap, but insurer claim processing controls the official number.",
    beforeActing: "Verify the latest insurer portal, EOBs, covered status, network status, and any excluded or denied services before relying on the estimate.",
  },
  "Open Enrollment Paycheck Impact Calculator": {
    purpose: "Estimate how benefit elections may change take-home pay after pre-tax savings and after-tax deductions.",
    readResult: "The take-home reduction is an estimate of paycheck impact, not a payroll guarantee. Actual tax withholding and employer setup may differ.",
    beforeActing: "Check payroll frequency, pre-tax status, employer contribution rules, and whether deductions apply to every paycheck.",
  },
  "Supplemental Benefits Decision Helper": {
    purpose: "Compare accident, critical illness, and hospital indemnity premiums against likely payout, emergency fund gaps, and peace-of-mind value.",
    readResult: "A negative expected value does not automatically mean the policy is useless, but it does mean the purchase is more about risk transfer than return.",
    beforeActing: "Read exclusions, waiting periods, benefit triggers, coordination rules, and whether the same money would be better used building cash.",
  },
  "HSA vs FSA Decision Helper": {
    purpose: "Compare tax savings, employer HSA money, deductible risk, FSA forfeiture risk, and provider needs before choosing a tax-advantaged health account.",
    readResult: "The result points toward the account structure that fits the assumptions entered, not a universal winner.",
    beforeActing: "Confirm HDHP eligibility, employer contribution timing, rollover rules, use-it-or-lose-it risk, and predictable medical expenses.",
  },
  "Hospital Bill Review Checklist": {
    purpose: "Organize the first pass on a large, confusing, or surprising healthcare bill before paying or setting up a payment plan.",
    readResult: "The completion score shows how much of the basic paper trail is checked. It does not prove the balance is correct.",
    beforeActing: "Match the bill to the EOB, request an itemized bill when needed, and ask about financial assistance before paying in full.",
  },
  "EOB-to-Bill Match Checker": {
    purpose: "Compare the provider bill against the insurer explanation so mismatches are easier to identify before payment.",
    readResult: "Missing checklist items are specific questions for the billing office or insurer. They are not automatic proof of an error.",
    beforeActing: "Verify date of service, provider, allowed amount, adjustment, plan payment, denial language, and patient responsibility.",
  },
  "Compare the bill against the EOB before paying": {
    purpose: "Compare the provider bill against the insurer explanation so mismatches are easier to identify before payment.",
    readResult: "Missing checklist items are specific questions for the billing office or insurer. They are not automatic proof of an error.",
    beforeActing: "Verify date of service, provider, allowed amount, adjustment, plan payment, denial language, and patient responsibility.",
  },
  "Financial Assistance Checklist": {
    purpose: "Screen whether a hospital financial-assistance review appears worth pursuing before paying more, while collecting only broad non-identifying answers.",
    readResult: "The result is a qualified direction—strong reason to request review, possible reason to check the policy, or verify key facts first. It is not an eligibility decision or approval.",
    beforeActing: "Request the exact written policy, identify which bills and providers it covers, confirm insurance processing, preserve deadlines, and keep proof of every application or response.",
  },
  "Health Insurance Visit Cost Calculator": {
    purpose: "Estimate how premiums, deductible, copays, coinsurance, expected visits, and remaining out-of-pocket max room may combine over a year.",
    readResult: "The result is a planning estimate, not a quote. Actual claims depend on allowed amounts, network status, and plan processing.",
    beforeActing: "Use the insurer cost estimator, SBC, provider network, and EOBs to verify the real covered amount before making final decisions.",
  },
  "403(b) Paycheck Contribution Calculator": {
    purpose: "Convert a 403(b) contribution choice into per-paycheck and annual numbers, including a rough employer match estimate when relevant.",
    readResult: "The result shows contribution pace. It does not confirm plan limits, payroll setup, tax withholding, or vesting rules.",
    beforeActing: "Check IRS limits, employer match formula, Roth vs traditional election, pay frequency, and whether overtime or bonuses are included.",
  },
  "OBBB Overtime Deduction Estimator": {
    purpose: "Estimate a rough federal income-tax benefit from qualifying overtime premium rules using simplified assumptions.",
    readResult: "The estimate is directional. Actual eligibility, deduction caps, phaseouts, and payroll reporting may change the final tax result.",
    beforeActing: "Use official tax documents or a qualified tax professional before adjusting withholding or treating the estimate as guaranteed savings.",
  },
  "Student Loan Path Finder": {
    purpose: "Separate federal loan strategy, forgiveness paths, and private-loan payoff decisions before using a payment calculator.",
    readResult: "The result is a routing suggestion. It points to what to verify next rather than selecting a repayment plan for you.",
    beforeActing: "Confirm loan type, servicer records, PSLF eligibility, employer qualification, interest rate, and whether refinancing would remove federal protections.",
  },
  "Private Student Loan Payoff Calculator": {
    purpose: "Compare minimum payments, extra payments, lump sums, and possible refinance APRs for private student loans.",
    readResult: "Lower interest paid usually means faster payoff or lower APR, but cash-flow pressure and emergency reserves still matter.",
    beforeActing: "Check refinance terms, variable-rate risk, fees, cosigner release, and whether extra payments apply to principal.",
  },
  "PSLF Progress Estimator": {
    purpose: "Estimate progress toward 120 qualifying PSLF payments and identify what records need verification.",
    readResult: "The remaining-payment estimate is only as good as the payment count entered. Official servicer and Department of Education records control.",
    beforeActing: "Verify employer certification, qualifying loan type, qualifying repayment plan, consolidation history, and official payment counts.",
  },
  "Student Loan Payment Calculator": {
    purpose: "Estimate monthly payment, total paid, and interest over time for a loan balance, APR, and term.",
    readResult: "A lower monthly payment can increase total interest. A shorter payoff usually reduces interest but raises cash-flow pressure.",
    beforeActing: "Confirm whether the loan is federal or private, whether protections apply, and whether extra payments reduce principal.",
  },
  "Medicare Cost Exposure Tool": {
    purpose: "Create a rough planning snapshot for premiums, deductibles, prescriptions, and coinsurance before comparing Medicare options.",
    readResult: "The result highlights possible exposure. It is not a Medicare Plan Finder quote or an enrollment recommendation.",
    beforeActing: "Verify live plan details, provider access, drug formulary, pharmacy pricing, prior authorization, and official Medicare resources.",
  },
  "Hospital Cafe Savings Rate Calculator": {
    purpose: "Make small recurring shift spending visible without shame so the user can decide whether to redirect any of it.",
    readResult: "The annual number is an awareness tool. It is not a judgment or a demand to cut every convenience purchase.",
    beforeActing: "Choose one realistic substitution or cap rather than making an all-or-nothing rule that will not survive hard shifts.",
  },
};
