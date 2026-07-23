# Healthcare Worker Benefits Decision Pack - Revenue Validation

Date: July 22, 2026
Offer: one-time $29 paid pilot
Audience: nurses and other employed healthcare workers comparing jobs or annual benefits
Commercial state: interest validation only; checkout disabled

## Decision

Use the existing private Healthcare Worker Career & Benefits Decision System as the source product. Test a narrower public offer named **Healthcare Worker Benefits Decision Pack**. Do not create a second product master.

The lean validation offer contains:

- A 20-page printable PDF
- A 10-sheet formula-driven spreadsheet
- Two-offer total-compensation comparison
- Health-plan low-, expected-, and high-use scenarios
- HSA, FSA, deductible, out-of-pocket, and employer-funding fields
- Retirement match, eligibility, and vesting review
- Schedule, commute, call, PTO, leave, disability, and protection review
- Bonus, tuition, student-loan assistance, and repayment-risk review
- Document collection, HR questions, written verification, and negotiation prompts
- Final decision summary and reusable annual benefits action plan
- Worked example, current official source register, and clear limitations

## Why $29 is a real test

A directional public-comparator scan found:

| Comparator | Observed price / status | What it does | Implication |
|---|---:|---|---|
| HealthCare.gov SBC resources | Free | Official health-plan comparison documents | Core rules and official sources must remain free |
| Etsy job-offer templates | Roughly $1-$21 in the observed marketplace results | Generic spreadsheets, weighted scores, dashboards, and printables | A generic worksheet is not enough to support $29 |
| Nurse-specific Etsy comparison printable | About $5 in the observed marketplace results | Nurse job comparison worksheet | Healthcare-worker labeling alone is not enough |
| ANA nurse well-being workbook | $22.95 regular price | Evidence-informed burnout and compassion-fatigue workbook | Shows nurses buy focused workbooks, but it addresses a different problem |

The $29 hypothesis depends on the integrated system being worth more than a template: healthcare-specific inputs, controlling-document workflow, health-plan scenarios, retirement and vesting details, repayment risk, written HR verification, and a final auditable decision without an opaque score.

This comparison is directional, not market-size evidence. Prices and listings can change.

## Truthful public funnel

Route: `/products/healthcare-worker-benefits-decision-pack`

Current call to action: **Join the $29 paid-pilot list**

The page states:

- No payment is collected
- Checkout is not active
- Joining creates no purchase obligation
- Final delivery, refund, support, privacy, licensing, and payment terms will be shown before any future checkout
- Full paid files are not publicly hosted

The existing default-deny commerce gates remain unchanged. The checkout connection point remains the existing Lemon Squeezy environment configuration, but no URL, SDK, purchase control, or transaction event is active.

## Privacy-safe measurement

Allowlisted events:

- `benefits_pack_page_viewed`
- `benefits_pack_preview_opened`
- `benefits_pack_paid_pilot_cta_clicked`
- `benefits_pack_interest_submit`

Allowed event properties are fixed product, surface, and preview identifiers. Salary, employer name, health details, benefits values, free text, email, and raw form fields are excluded. Events fire only after analytics consent.

Purchase, revenue, refund, and paid-delivery events are intentionally absent until a verified processor transaction exists.

## Customer discovery

Target mix for 15 interviews:

- 6-8 nurses or bedside clinicians with a job or benefit decision in the last 24 months
- 4-5 other employed healthcare workers
- 2-3 managers, educators, or advanced-practice professionals
- 1-2 exploratory workforce, benefits, or financial-wellness buyer conversations

The internal kit contains:

- A 25-minute problem interview
- Concept-test sequence
- Direct $29 willingness-to-pay question
- Objection and feature-request register
- Purchase and organizational-pilot evidence log
- Draft direct, referral, and organizational outreach
- Go / revise / stop decision memo

All outreach drafts are marked **do not send without explicit founder authorization**. No outreach was sent in this sprint.

## Validation threshold

Commercial validation requires:

- 15 completed interviews, and
- 5 verified paid purchases at $29,

or:

- 1 verified paid organizational pilot.

Starting state:

- Interviews: 0 / 15
- Paid purchases: 0 / 5
- Paid organizational pilots: 0 / 1
- Direct spend: $0 / $150

Interest signups, traffic, previews, compliments, and stated hypothetical intent are not purchases.

## Decision rules

**Continue** when the threshold is met and the evidence identifies a repeatable buyer, problem, price, support load, and delivery expectation.

**Revise one material variable** when repeated pain and intent are strong but verified purchases miss the threshold. Change audience, promise, format, proof, or price, then run a new test.

**Stop or pivot** when the free tools solve the problem, pain is weak or infrequent, trust and support requirements exceed the value, or participants will not pay at a plausible price.

## Release blockers

The private files passed local content, formula, and visual-render QA. They remain not approved for paid distribution until:

- Persistent private hosted delivery is configured
- Independent accessibility review is complete
- Merchant and payout setup is verified
- Product terms, refund, licensing, privacy, and support expectations are approved
- Test checkout, receipt, download, refund, and support flows pass
- Privacy-safe conversion and purchase analytics are verified
- Explicit founder approval is recorded

## Source register

- IRS 403(b) contribution limits: https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-403b-contribution-limits
- IRS Publication 571: https://www.irs.gov/publications/p571
- IRS Revenue Procedure 2025-19: https://www.irs.gov/pub/irs-drop/rp-25-19.pdf
- IRS Publication 15-B: https://www.irs.gov/publications/p15b
- IRS educational assistance: https://www.irs.gov/newsroom/employers-may-help-with-college-expenses-through-educational-assistance-programs
- HealthCare.gov Summary of Benefits and Coverage: https://www.healthcare.gov/health-care-law-protections/summary-of-benefits-and-coverage/
- U.S. Department of Labor Saving Matters: https://www.savingmatters.dol.gov/employees.htm
- Federal Student Aid forgiveness overview: https://studentaid.gov/articles/student-loan-forgiveness/
- ANA nurse well-being workbook comparator: https://www.nursingworld.org/nurses-books/the-double-edged-sword-an-evidence-informed-workb/
- Etsy job-offer template marketplace comparator: https://www.etsy.com/market/job_offer_comparison_template
