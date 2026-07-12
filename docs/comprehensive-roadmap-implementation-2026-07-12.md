# Comprehensive Roadmap Implementation — July 12, 2026

## Starting state

This workstream began from merged `main` commit `db263cffbf0e003d44c63f911214e2b694d7b9b3`, which contains the focused Tools directory, dedicated tool routes, telemetry URL minimization, strengthened shared disclaimers, and the hospital financial-assistance screening workflow.

The production domain was still serving the earlier `b9e2e911a09f88353d871482cc625d99de4965aa` release because Vercel rejected the merge builds after the project reached its build-rate limit. That platform quota condition was documented and was not treated as a code defect. This branch deliberately batches work and avoids no-op deployment commits.

## Product work completed in this branch

### 1. State Medicaid and long-term-care routing

**Canonical route:** `/tools/state-medicaid-long-term-care-router`

The existing Medicare and Medicaid Eligibility Check already contained all 50 states plus the District of Columbia, official state Medicaid agency links, dated federal screening rules, and qualified pathways. Rather than duplicate that system, the new route reuses its state registry and provides a lower-data program router for:

- ordinary Medicaid or CHIP coverage;
- Medicare cost assistance;
- nursing-facility Medicaid;
- home- and community-based services;
- caregiver, respite, and aging/disability support.

The router asks only state, broad program need, Medicare status, broad long-term support need, and care-setting preference. It does not ask exact income, assets, home value, diagnosis, address, applicant name, government identifiers, or free text.

### 2. Childcare and dependent-care benefits

**Canonical route:** `/tools/childcare-benefits-decision-guide`

The workflow coordinates:

- a 2026 Dependent Care FSA;
- employer childcare or backup-care benefits;
- predictable expense bands;
- filing-status and work-related-care questions;
- use-it-or-lose-it risk;
- possible midyear changes;
- Form 2441 and Child and Dependent Care Credit verification.

It shows the 2026 federal dependent-care assistance exclusion ceiling of $7,500 for most eligible households and $3,750 for married filing separately, while clearly stating that an employer may offer less and that current IRS instructions and household facts control the final tax result. It does not calculate exact tax savings or determine eligibility.

### 3. Roth versus traditional contributions

**Canonical route:** `/tools/roth-vs-traditional-decision-helper`

The tool weighs broad factors including:

- current marginal tax-rate band;
- expected future tax-rate direction;
- years until retirement;
- current cash flow;
- expected pension income;
- existing pre-tax/Roth mix;
- early-retirement planning;
- confidence in the assumptions.

It can return only:

- Roth factors currently appear stronger;
- traditional factors currently appear stronger;
- a split may reduce uncertainty.

It explicitly separates contribution amount from contribution tax treatment and does not declare a universal winner.

### 4. Observation versus inpatient status

**Canonical route:** `/tools/observation-vs-inpatient-status-guide`

The guide organizes:

- payer category;
- reported hospital status;
- written notice status;
- approaching discharge;
- possible skilled nursing or rehabilitation;
- active appeal or review deadlines.

It explains that hospital location or an overnight stay does not by itself establish inpatient admission status. It supplies questions for case management, utilization review, the payer, and the post-acute facility, but it does not determine status, coverage, medical necessity, appeal rights, or amount owed.

### 5. Medicare plan verification

**Canonical route:** `/tools/medicare-plan-verification-checklist`

The checklist covers:

- doctors, specialists, and hospitals;
- travel and out-of-area care;
- formularies and pharmacies;
- authorization, referrals, and step therapy;
- premiums, cost sharing, and worst-year exposure;
- Medicare Advantage maximum out-of-pocket exposure;
- Medigap timing and guaranteed-issue questions;
- supplemental-benefit limits;
- Annual Notice of Change review;
- SHIP counseling;
- enrollment period and effective date.

Statuses remain in transient React state. The tool stores no plan, carrier, provider, pharmacy, or medication names.

### 6. Debt versus retirement sequencing

**Canonical route:** `/tools/debt-vs-retirement-router`

The router orders:

- starter liquidity;
- required debt payments;
- employer match verification;
- high-cost debt;
- private student loans;
- federal student-loan protections;
- PSLF verification;
- sustainable retirement progress.

It avoids a universal interest-rate cutoff and warns against refinancing federal loans without understanding the permanent loss of federal protections.

## My Plan integration

Every new decision journey uses the existing fixed-action registry and reusable `SaveNavigatorAction` component. No new answer-level plan schema was introduced.

Only these existing action IDs may be saved from the new routes:

- `cost_program_guide`
- `benefits_action_plan`
- `wealth_403b`
- `cost_discharge`
- `wealth_high_interest_debt`

The following are never saved to My Plan:

- state selection;
- care-setting preference;
- Medicare status;
- filing status;
- expense band;
- tax-rate band;
- pension expectation;
- debt type;
- liquidity range;
- PSLF answer;
- plan-checklist status;
- free text.

## Benefits Command Center assessment

The Benefits Command Center was inspected rather than rewritten. It already provides:

- bounded browser-local packages;
- fictional sample Receipt and comparison activation;
- a full production calculation engine;
- separation of cash, employer value, employee cost, unvested value, estimates, and qualitative value;
- health-plan scenario comparison;
- verification questions;
- print-aware rendering;
- record reset controls;
- explicit uncertainty instead of a universal winner;
- no account, bank, payroll, employer portal, or document connection.

The missing surrounding decision support is addressed by the new childcare, Roth, debt-sequencing, Tools-directory, and fixed My Plan pathways. Automatic value transfer into the Command Center was intentionally not added because it would duplicate sensitive entered values across tools.

## Discovery and architecture

- Six new routes are included in the Tools directory.
- The existing `/tools/:slug` route remains the canonical entry point.
- A dedicated lazy `RoadmapToolRouter` loads the workplace or care bundle only when needed.
- The shared app router does not import each new workflow directly.
- The runtime SEO generator now includes the new focused tools.
- Sitemap, prerender, canonical, metadata, and WebApplication schema generation continue to use existing infrastructure.

## Validation added

- Deterministic unit tests cover strong, uncertain, and prohibited-result paths.
- Rendered interaction tests cover state routing, childcare results, Roth uncertainty, Medicare checklist persistence, directory uniqueness, and safe My Plan storage.
- A build-blocking prerender smoke check verifies all six routes have:
  - a visible H1;
  - the production canonical URL;
  - indexable robots metadata;
  - structured data;
  - no prerendered AdSense page-ad script;
  - no sensitive query parameters.

A full graphical browser dependency was not added because the repository does not currently include one and doing so would add substantial lockfile and CI weight. The exact-head Vercel preview remains the final visual and runtime checkpoint. This limitation must be reported honestly rather than represented as completed Playwright coverage.

## Known limitations

- State routing uses official state Medicaid agency starting points but does not maintain a separate direct link for every waiver, Medicare Savings Program application, aging agency, or long-term-care subprogram.
- Detailed state income, resource, transfer, estate-recovery, and spousal-protection rules remain intentionally outside the national logic.
- IRS Publication 503 currently describes 2025 returns; the childcare tool separately identifies the 2026 statutory limit and directs users to current developments and Form 2441.
- The Medicare checklist does not store checklist state across visits by design.
- Production deployment remains dependent on the Vercel rate limit clearing.
- The legal and privacy documents have not been reviewed by an attorney.
