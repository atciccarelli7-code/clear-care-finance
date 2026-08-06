# Hospital Financial Assistance data governance

Effective date: 2026-08-06

Initial policy review date: 2026-08-06

Scheduled review: January 2027, or earlier after a source change

## Product and privacy boundary

The public finder is an educational screening and action-planning product. It never determines eligibility. The hospital makes the final decision, and the controlling policy, application, facility, service, provider, residency, household definition, income method, date, and deadline require direct verification.

The launch is browser-temporary and does not require Supabase. It does not ask for or store names, dates of birth, diagnoses, medical-record or account numbers, Social Security numbers, exact balances, free text, medical records, or bill uploads. Only the fixed existing My Plan action can be saved; hospital, state, household size, income band, insurance status, bill stage, and service month are excluded from saved state and analytics.

## Data dictionary

Source: `src/data/hospitalFinancialAssistancePolicies.ts`

| Field | Type | Meaning and rule |
|---|---|---|
| `slug` | string | Stable non-sensitive system identifier and route key; unique |
| `name` | string | Legal or public health-system name |
| `state`, `stateCode` | string | Published geography; not proof of user residency |
| `facilitiesCovered` | string[] | Policy-described facilities or coverage scope; limitations remain visible |
| `policyUrl`, `applicationUrl` | HTTPS URL | Direct official policy/application or official controlling page |
| `policyEffectiveDate` | string | Source-stated date; “not stated” is allowed and disclosed |
| `sourceRetrievedAt` | ISO date | Date CAF retrieved the controlling source |
| `freeCareThresholdFpl` | insured/uninsured number or null | Published FPG percentage only; `null` means do not infer |
| `discountedCareThresholdFpl` | insured/uninsured number or null | Published upper screening percentage only; `null` means do not infer |
| `hardshipProvision` | string or null | Plain-language bounded summary of published hardship/catastrophic terms |
| `insuredPatientsMayQualify` | yes/limited/verify | Published treatment of insured patients, never an eligibility result |
| `applicationDeadline` | string | Published deadline/lookback language or direct-verification statement |
| `requiredDocumentation` | string[] | Documents named by the source; users verify the current application |
| `presumptiveEligibility` | string | Published automatic/presumptive process, if any |
| `providersIncluded`, `providersExcluded` | string[] | Provider coverage boundaries; separate professional bills remain possible |
| `collectionsLanguage` | string | Published collection/ECA terms or a bounded verification instruction |
| `phone`, `mailingAddress` | string or null | Official financial-counseling contact information; verify before sending documents |
| `translations` | string[] | Published language availability |
| `limitations` | string[] | Material applicability, ambiguity, and interpretation boundaries |
| `reviewStatus` | enum | Primary-source verified or direct verification required |
| `sources` | source[] | Label, publisher, official URL, retrieval date, and exact supported claim |

The finder also uses the 2026 HHS poverty guidelines from ASPE: $15,960 for one person plus $5,680 per additional person in the 48 contiguous states/DC; $19,950 plus $7,100 in Alaska; and $18,360 plus $6,530 in Hawaii. Household size above eight uses the official additional-person increment. These figures are screening math, not a hospital's household or income determination.

## Adding a hospital policy

1. Confirm that an official hospital/health-system policy and application or official application path exist.
2. Read the complete controlling source and any provider list. Do not use a search snippet as evidence.
3. Record every data-dictionary field. Use `null`, “not stated,” or a verification statement instead of inference.
4. Record the policy effective date and retrieval date separately.
5. Add exact evidence citations showing what each source supports.
6. Add the route slug to `src/data/hospitalFinancialAssistanceSeo.ts` in the same order.
7. Add calculation/ambiguity fixtures if the record introduces a new policy structure.
8. Run `npm test`, `npm run lint`, and `npm run build`; confirm the SEO-index alignment test and sitemap.
9. Check the rendered desktop, mobile, keyboard, source-link, and print experience before release.
10. Do not publish if the page would be mostly boilerplate, the official source is unavailable, or the coverage boundaries cannot be stated usefully.

## Updating HHS poverty guidelines

1. Retrieve the current annual guideline from HHS/ASPE and record effective and retrieval dates.
2. Update `HHS_2026_POVERTY_GUIDELINES` (and rename the constant/year references for the new year) in `src/lib/hospitalFinancialAssistance.ts`.
3. Update the finder copy, source card, national/state hub copy, test fixtures, evidence ledger, and review date.
4. Recalculate contiguous, Alaska, Hawaii, and household-size-above-eight tests.
5. Verify all dollar labels at boundaries and rebuild the printable plan.

## Auditing, staleness, and removal

- Automated tests reject drift between the full dataset and lightweight SEO route index and cover malformed/stale records. A record older than 370 days is shown as stale and requires verification.
- Human review is required for substantive policy meaning, provider lists, deadlines, collection language, and broken or replaced documents.
- Review every record at least annually and on any hospital merger, source redirect, policy-date change, or reported discrepancy.
- If a controlling source disappears, mark the record `direct_verification_required`, clear unsupported numeric thresholds, disclose the gap, and schedule a 30-day follow-up.
- If no official source or meaningful unique record can be restored, remove the record and its SEO slug together, add a permanent redirect to the state or national hub, regenerate the sitemap, and record the decision.
- Do not silently retain an old threshold to avoid removing a page.

## Other annual updates

- Medicare figures: update only from CMS/Medicare.gov in the relevant Medicare domain files and source binder; run the Medicare content and route checks.
- IRS contribution limits: update only from IRS releases/notices in the retirement domain files; update year labels and boundary tests together.
- State resources: verify the official agency, active program scope, phone, and application path; state programs do not automatically control every provider or service.

## Review queue

| When | Review |
|---|---|
| Monthly | Automated link-status report or manual official-link sample; user-reported discrepancies |
| Quarterly | All `direct_verification_required` records, redirects, provider exclusions, and application paths |
| January annually | HHS guidelines, all policy retrieval dates, state program terms, source freshness, and print output |
| Event-driven | Hospital merger, policy revision, new effective date, state-program change, source failure, or calculation defect |

## Known limitations

- Eighteen system records are not a comprehensive national hospital directory.
- System policies may not cover every facility, clinician, service, date, residency class, or insurance balance.
- Broad income bands cannot reproduce hospital-specific income calculations.
- The launch has no document upload, account, deadline reminder, application submission, or hospital-side verification.
- Official websites can change without notice; last-reviewed dates reduce but do not remove this risk.
