# CAF Benefits Command Center — Product Specification

## Product purpose

The CAF Benefits Command Center is a private, accountless workplace-finance workspace that helps a user build, understand, and compare compensation and benefits packages. It connects cash compensation, health-plan economics, retirement contributions, paid leave, hidden benefits, work structure, and unresolved verification questions without pretending every benefit can be reduced to one authoritative number.

The public canonical route is `/tools/benefits-command-center`.

## Product relationship

- The **Financial Navigator** identifies the decision.
- **My Plan** stores fixed, trackable next actions.
- The **Financial Foundation Checkup** identifies broad financial weak links.
- Existing compensation, 403(b), health-plan, Benefits Blueprint, and Employer Benefits Action Plan tools remain specialized modules.
- The **Benefits Command Center** is the deep workplace-finance workspace that combines these subjects into a package and Benefits Receipt.

## Supported workspace modes

1. Review a current benefits package
2. Compare two job offers
3. Complete open enrollment
4. Understand a new offer
5. Find benefits that may be available but unused

All modes use one versioned package model rather than separate applications.

## Data model

Storage key: `caf-benefits-command-center-v1`

A package contains:

- local package label
- healthcare-worker context toggle
- compensation profile
- up to three health plans
- selected health plan
- retirement profile
- paid-leave profile
- hidden-benefit classifications
- work and quality-of-life factors
- updated timestamp

The workspace supports up to three packages and two-package comparison.

## Privacy model

The first release is local-only. It does not require or support:

- user accounts
- cloud synchronization
- bank or payroll connections
- employer-portal connections
- document uploads
- offer-letter uploads
- paystub uploads
- SBC uploads
- account numbers
- insurance member IDs
- medical information
- employer names

Users may use generic labels such as Current job, Offer A, and Offer B. Package labels are length-constrained and stripped of angle brackets.

Package values are not placed in URLs, analytics, console logs, or error telemetry.

## Compensation methodology

The Command Center reuses `src/lib/totalCompensation.ts` for:

- hourly and salary base compensation
- overtime
- shift or specialty differentials
- annual bonus
- annualized sign-on value
- holiday, call, charge, or specialty pay
- scheduled and actual annual hours
- effective hourly value
- selected commuting and work costs

The Receipt separates expected cash from employer benefits and employee costs. Variable compensation is not described as guaranteed.

## Health-plan methodology

Each package may include up to three health plans. Each plan can contain:

- premium per paycheck
- pay frequency
- annual surcharges
- known employer premium contribution
- deductible
- coinsurance
- common copays
- out-of-pocket maximum
- employer HSA or HRA contribution
- network verification status
- prescription verification status

Three deterministic scenarios are shown:

- **Low use:** premiums plus limited visits and limited deductible use
- **Moderate use:** premiums plus several visits, partial deductible exposure, and entered coinsurance
- **High use:** premiums plus the selected out-of-pocket maximum

Employer HSA or HRA funding reduces the displayed net planning cost. The scenarios do not predict actual care, coverage, claims, or eligibility.

## Retirement methodology

The retirement model supports common workplace-plan categories and calculates:

- employee contribution
- estimated employer match
- maximum employer match under the entered formula
- potential uncaptured match
- non-elective employer contribution
- fixed employer contribution
- vested employer contribution
- unvested employer contribution

The first release models a match as an entered match percentage applied up to an entered employee-contribution cap. Actual eligible compensation, true-ups, per-paycheck rules, exclusions, vesting, and plan formulas must be verified.

## Paid-leave methodology

Paid leave is estimated using the entered paid hours multiplied by the compensation engine's hourly equivalent.

- Hourly paid leave may be included in estimated economic package value.
- Salary paid leave is displayed separately and is not added again to annual salary.
- Sick leave, carryover, payout, and parental-leave rules remain subject to employer policy.

## Hidden benefits

Supported categories include:

- life insurance
- short-term disability
- long-term disability
- Dependent Care FSA
- childcare support
- tuition assistance
- certification or licensure reimbursement
- student-loan assistance
- commuter benefits
- professional dues or continuing education
- parental leave
- mental-health or employee-assistance support

A benefit may be enrolled, available but unused, not offered, or unknown. A dollar value is included only when entered and classified as currently used. Other value remains qualitative or conditional.

## Benefits Receipt

The Benefits Receipt displays:

- base and expected cash compensation
- expected overtime and differentials
- quantifiable employer benefit value
- selected employee costs
- value after selected costs
- selected health-plan scenarios
- employer retirement contribution
- uncaptured match
- unvested employer value
- paid-leave estimate
- qualitative or conditional benefits
- deterministic verification questions
- fixed My Plan recommendations
- package completeness

The Receipt intentionally distinguishes:

- guaranteed or base cash
- expected variable cash
- employer contributions
- employee costs
- unvested value
- estimates
- qualitative value
- unknown or unverified items

## Comparison model

Two packages can be compared by:

- expected cash
- estimated value after selected costs
- employer retirement value
- moderate-use health-plan cost
- worst-case health-plan cost
- entered commute
- verification uncertainty

The comparison produces classifications and uncertainty language. It does not produce a universal winner.

## Verification questions

Questions are generated only when relevant inputs remain uncertain. Current rules cover:

- match true-up
- match calculation timing
- vesting schedule
- provider and facility network
- prescription coverage
- HSA funding conditions
- leave carryover
- leave payout
- disability replacement definition
- tuition repayment
- beneficiary and portability review

## My Plan integration

The Command Center reuses existing fixed recommendation IDs rather than creating a second plan registry. Possible actions include:

- `benefits_match`
- `benefits_health_cost`
- `benefits_sbc`
- `benefits_action_plan`
- `benefits_blueprint`
- `benefits_total_comp`

Only fixed action IDs and existing recommendation copy enter My Plan. Package values and labels do not.

## Analytics taxonomy

Consent-gated events include:

- `benefits_command_center_opened`
- `benefits_command_center_entry_opened`
- `benefits_workspace_mode_selected`
- `benefits_package_started`
- `benefits_package_deleted`
- `benefits_health_plan_added`
- `benefits_receipt_copied`
- `benefits_receipt_printed`
- `benefits_all_actions_added`

Allowed properties use fixed categories, route paths, counts, and output statuses. Salary, wages, premiums, deductibles, plan totals, package labels, employer details, job details, and user-entered answers are prohibited by the shared analytics sanitizer and by product design.

## Search and internal distribution

The route is intended to be a public, indexable `WebApplication` with meaningful prerendered explanatory content. Contextual entry points are configured for high-intent routes including Start Here, Tools, Insurance, Healthcare Workers, Open Enrollment, total-compensation comparison, Benefits Blueprint, Employer Benefits Action Plan, 403(b) calculator, and open-enrollment cost comparison.

## Deferred features

The first release intentionally excludes:

- document uploads or extraction
- accounts and cross-device sync
- employer-specific templates
- enterprise administration
- reminders
- free-text notes
- tax calculations
- payroll withholding calculations
- exact provider or drug coverage decisions
- individualized insurance recommendations
- a single package winner score

These may be evaluated only after product usage and privacy requirements are understood.
