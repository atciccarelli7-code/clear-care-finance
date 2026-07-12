# CAF Benefits Command Center — Activation Experience

## Purpose

The activation release makes the Benefits Command Center understandable before a visitor enters personal package information. The public canonical route remains `/tools/benefits-command-center`.

The release does not create a second calculation engine or separate sample application. Fictional examples use the production package schema, Benefits Receipt calculation, comparison engine, local-storage controls, and workspace modules.

## First-visit choices

A visitor with no meaningful saved package sees three actions:

1. **Build my own package** — opens a fresh local workspace.
2. **Explore a sample package** — loads a fictional hospital RN package and displays a calculated sample Benefits Receipt.
3. **Compare two sample jobs** — loads fictional bedside RN and Clinical Specialist packages and displays the production comparison output.

A voluntary eight-step product tour remains available from the activation screen and the full workspace.

## Sample package assumptions

### Sample Hospital RN Package

The fictional package demonstrates:

- hourly compensation
- three 12-hour shifts
- limited expected overtime
- shift differential
- employer 403(b) matching and non-elective contribution
- partial vesting
- employee health premiums
- employer health-premium contribution
- employer HSA/HRA funding
- paid leave
- disability and life-insurance value
- tuition and certification benefits
- commute and parking costs
- unresolved network, prescription, vesting, true-up, leave, disability, tuition, and beneficiary questions

It is intentionally not a perfect package. Strong compensation and employer contributions coexist with higher healthcare exposure, a longer commute, unvested value, and unresolved plan details.

### Bedside RN versus Clinical Specialist

The fictional comparison demonstrates:

- hourly versus salaried compensation
- overtime and differential dependence
- salary-plus-bonus compensation
- employer retirement differences
- vesting differences
- moderate- and high-use healthcare costs
- commute or travel burden
- schedule predictability
- physical demand
- career trajectory
- unresolved assumptions

The comparison does not include a winner field or universal recommendation.

## User-data protection

Samples replace local storage only when the existing workspace is pristine or already contains samples. An established user-created package is never overwritten by opening a sample preview.

Sample package IDs are stable and clearly distinguishable from user-created package IDs. Users can:

- open a sample in the full workspace
- return to activation examples
- start a fresh personal package
- delete a package
- clear all local Command Center data

No sample data is fetched remotely.

## Guided tour

The tour contains eight steps:

1. Create or load a package
2. Enter compensation
3. Compare healthcare scenarios
4. Review retirement money and vesting
5. Identify hidden or unused benefits
6. Generate the Benefits Receipt
7. Compare another package
8. Save fixed actions to My Plan

The tour:

- is voluntary
- can be skipped at any time
- supports Escape-to-close through the existing Radix dialog
- uses focus trapping from the existing dialog component
- persists skipped or completed status locally
- exposes progressbar semantics
- respects reduced-motion preferences
- adds no third-party tour dependency

Tour storage key: `caf-benefits-command-center-tour-v1`

## Internal distribution

The existing route-aware entry layer now includes the homepage and stronger sample actions on selected high-intent surfaces. The full workspace remains lazy loaded and is not shipped to unrelated routes.

## Search behavior

The canonical route remains unchanged. Sample receipt, sample comparison, and tour states do not create separate indexable URLs. The public page contains visible explanatory content describing:

- the Benefits Receipt
- job-offer comparison
- salary limitations
- package uncertainty
- privacy
- sample activation paths

## Known limitations

- sample packages are illustrative and not employer offers
- no account or cross-device synchronization
- no document upload or extraction
- no employer-specific templates
- no exact payroll, tax, eligibility, coverage, vesting, or overtime determination
- no automatic provider or prescription verification
