# CAF Benefits Command Center — Deterministic Rule Map

## Core constraints

- Maximum packages: 3
- Maximum health plans per package: 3
- Comparison packages: 2
- Storage schema version: 1
- Package data remains local
- Negative, non-finite, and invalid numeric values are normalized to safe nonnegative values
- Package and plan labels are local-only, limited in length, and stripped of angle brackets

## Compensation rules

1. Hourly base cash equals hourly rate × scheduled weekly hours × paid work weeks.
2. Salary base cash equals annual salary.
3. Hourly overtime equals hourly rate × overtime multiplier × expected overtime hours × paid work weeks.
4. Differential pay equals differential per hour × differential hours × paid work weeks.
5. Expected cash includes base cash, expected overtime, expected differential, annual bonus, annualized sign-on or retention value, and entered specialty pay.
6. Variable cash is displayed as expected rather than guaranteed.
7. Unpaid hours increase actual annual hours for effective-hourly calculations but do not increase cash.
8. Commute, parking, dental, and vision costs are treated as selected employee costs.

## Health-plan rules

### Annual premium

`premium per paycheck × paychecks per year + annual surcharges`

### Selected deductible and out-of-pocket maximum

- Employee-only and non-family tiers use the entered individual values.
- Family tier uses family values when present and otherwise falls back to individual values.

### Low-use member cost

- two entered primary-care copays
- one entered specialist copay
- up to 10% of the selected deductible, capped at $500
- capped by the selected out-of-pocket maximum when present

### Moderate-use member cost

- four entered primary-care copays
- two entered specialist copays
- one entered urgent-care copay
- 60% of the selected deductible
- coinsurance applied to another 40% of the selected deductible
- capped by the selected out-of-pocket maximum when present

### High-use member cost

- selected out-of-pocket maximum
- when no maximum is entered, the model falls back to the selected deductible for safe calculation behavior

### Net annual scenario cost

`annual employee premium + scenario member cost − employer HSA/HRA contribution`

Net scenario cost cannot fall below zero.

### Verification flags

- A plan with unverified network status generates a network question.
- A plan with unverified prescription status generates a prescription question.
- An HDHP generates an employer HSA funding question.

The scenario engine does not model diagnoses, medical services, formularies, claim processing, balance billing, or official eligibility.

## Retirement rules

### Employee contribution

`eligible base compensation × entered employee contribution percentage`

### Estimated employer match

`eligible base compensation × lesser of employee contribution percentage or match-cap percentage × employer match rate`

A 100% match rate means dollar-for-dollar matching up to the entered cap.

### Maximum employer match

`eligible base compensation × match-cap percentage × employer match rate`

### Uncaptured match

`maximum employer match − estimated employer match`, with a floor of zero.

### Non-elective contribution

`eligible base compensation × non-elective percentage + fixed employer contribution`

### Total employer retirement contribution

`estimated match + non-elective contribution`

### Vesting

- Vested value equals employer retirement contribution × entered vested percentage.
- Unvested value equals employer retirement contribution × unvested percentage.
- Employee contributions are not treated as unvested.

### Verification triggers

- Unknown true-up status generates a true-up question.
- Unknown match timing generates a timing question.
- Employer value with less than 100% vesting generates a vesting question.

## Paid-leave rules

1. Hourly equivalent comes from the shared compensation engine.
2. Paid-leave estimate equals hourly equivalent × entered PTO and paid-holiday hours.
3. Hourly-role paid leave may be included in economic package value.
4. Salary-role paid leave is shown but not added to salary again.
5. Unknown carryover produces a carryover question.
6. Unknown payout produces a payout question.

Parental-leave weeks remain qualitative in the first release unless represented by another entered explicit employer value.

## Hidden-benefit rules

- `enrolled`: the benefit is listed as included; a known entered annual value may be added.
- `available_unused`: the benefit is listed as potentially missed but is not added to package value.
- `not_offered`: the benefit is excluded from value and recommendations.
- `unsure`: the benefit contributes to the review-gap count but not package value.

Known value is added only for benefits classified as enrolled.

### Benefit-specific verification

- Long-term disability that is enrolled, available, or unknown produces a replacement-definition question.
- Tuition assistance that is enrolled or available produces a repayment question.
- Life insurance that is not marked not offered produces a beneficiary and portability question.

## Receipt rules

### Quantifiable employer benefit value

- employer retirement contribution
- known employer health-premium contribution
- employer HSA/HRA contribution
- known value of enrolled hidden benefits
- hourly paid-leave value when applicable

### Annual employee costs

- selected health-plan annual premium
- dental and vision premiums
- commute cost
- parking and transit cost

### Estimated total package value

`expected cash compensation + quantifiable employer benefit value`

### Estimated value after selected costs

`estimated total package value − selected employee costs`

The Receipt separately shows unvested employer value and does not imply it is currently portable cash.

## Completeness rules

The package receives credit for ten broad completion markers:

1. base compensation entered
2. scheduled hours entered
3. selected health-plan premium structure present
4. selected health-plan out-of-pocket maximum entered
5. retirement plan type classified
6. match true-up classified
7. paid leave entered
8. leave carryover classified
9. at least one hidden benefit classified
10. schedule predictability classified

Completeness is a workflow indicator, not a quality score.

## My Plan recommendation rules

- Uncaptured match or unknown retirement plan → `benefits_match`
- Selected health plan → `benefits_health_cost`
- Unverified network or prescription status → `benefits_sbc`
- Any hidden benefit available but unused or unknown → `benefits_action_plan`
- At least three verification questions → `benefits_blueprint`
- Bonus or overtime entered → `benefits_total_comp`

At most five fixed recommendation IDs are returned. Package values and labels never enter My Plan.

## Comparison rules

The comparison calculates directional differences for:

- expected cash
- value after selected costs
- employer retirement contribution
- selected health-plan moderate-use estimate
- selected health-plan high-use estimate
- entered commute minutes

### Classification thresholds

- Expected cash within 3% of the larger package is described as relatively close.
- Retirement differences above $100 generate a retirement classification.
- Health-plan differences above $100 generate a scenario classification.
- Commute differences of at least 10 minutes per workday generate a commute classification.

### Uncertainty language

- 8 or more combined verification questions: several unverified assumptions
- 3 to 7: useful comparison with several details to verify
- fewer than 3: relatively few unresolved items

No winner field or universal recommendation is generated.

## Storage validation rules

- Schema version must equal 1.
- Mode must match a published workspace mode.
- At least one valid package must load.
- Unknown or malformed packages are discarded.
- Package count is capped at 3.
- Health-plan count is capped at 3 per package.
- Unknown hidden-benefit IDs are ignored; published categories are reconstructed.
- Active and comparison package IDs must refer to valid loaded packages.
- Malformed JSON returns no stored workspace.

## Analytics rules

The shared analytics sanitizer rejects keys containing sensitive concepts such as salary, wage, employer, benefit, premium, deductible, contribution, amount, balance, overtime, bonus, role, and schedule. Command Center events therefore use only fixed IDs, counts, route paths, modes, and output statuses.

Raw package inputs, package labels, package totals, health-plan values, retirement values, and selected benefit details are never sent.
