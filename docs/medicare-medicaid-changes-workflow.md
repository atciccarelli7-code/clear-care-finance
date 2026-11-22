# Medicare & Medicaid Changes: editorial maintenance

Owner: CAF editorial / Andrew. Prepared November 22, 2026. This does not claim Andrew personally reviewed the new text. Publication and current AdSense account status remain separate checks.

## One source of truth

Public route: `/medicare-medicaid-changes`. Editable records and source URLs: `src/data/medicareMedicaidChanges.ts`. UI: `src/pages/MedicareMedicaidChangesPage.tsx`.

Keep the existing January 2027 article as a background care-transition explainer at its unchanged URL. The hub owns current dates, numbers and policy statuses. Do not create annual or monthly copies. The broad Medicare cost hub retains its coverage and cost-planning role; do not silently replace its 2026 calculator inputs with 2027 amounts during 2026.

## Review rhythm and triggers

- Target December 11, 2026: recheck state requests/elections under SMD 26-006, particularly NC, and any CMS approval evidence. An absent announcement is not proof a state declined the option.
- Before January 1: recheck final beneficiary amounts, corrections, state notices, court-related agency changes and actual implementation.
- Thereafter: monthly editorial triage plus event-driven checks when CMS/NC publishes a consequential final rule, correction, implementation notice or court-response guidance. July/August provider rules and fall plan-year announcements deserve seasonal review.
- Review a source before each substantive change; dates are targets, never a promise of continuous monitoring. No scheduled publisher, scraper, automated status promotion or news feed is installed.

## Entry checklist

1. Identify the reader task. Does this change affect a bill, coverage, enrollment, application, renewal or care transition? Skip generic announcements without an actionable consequence.
2. Inspect the hub and existing CAF explainers for overlap. Update the existing record and link to durable background rather than adding a competing page.
3. Open the original source. Use the final rule/statute plus current agency implementation guidance. Check later corrections, provision-specific applicability, litigation acknowledged by the agency, state elections and waivers. A proposed rule and a final rule are different records; an interim final rule is not merely a proposal.
4. Record affected program/population and jurisdiction. Distinguish Original Medicare from MA, provider rates from beneficiary costs, FY from CY, and national rules from NC implementation. Never imply universal applicability from a percentage or headline.
5. Separate legal effect, applicability/service date, renewal/application initiation date, measurement year and enforcement transition. Use `date` as the sortable applicability date and explain conditional dates in `effectiveDate`.
6. Fill `id`, `title`, `scope`, `status`, `date`, `effectiveDate`, `who`, `changed`, `implication`, `action`, `sources`, and `verifiedAt`. Keep stable IDs so existing deep links survive. Sources must substantiate every material number, date and applicability claim. Quote sparingly; summarize in original language.
7. Label CAF implications as editorial interpretation. Do not invent founder experience, a clinical outcome, a patient story, Andrew's approval or a credentialed reviewer.
8. Check whether a reader could wrongly cancel coverage, miss an application/appeal, assume automatic termination, or mistake payment policy for benefit eligibility. Direct them to the notice, agency, plan and official assistance.
9. Update per-item `verifiedAt` only after substantive verification. Advance `CHANGES_LAST_VERIFIED` only after reviewing the full active set; do not refresh old items just because code was built. Set the next checkpoint to a real editorial trigger.
10. Preserve history. Set `archived: true` for prior-year baselines or superseded entries and `supersededBy` where applicable. Retain original dates, facts and sources; archive does not imply repeal. A correction to a misleading claim should also have a dated note in the work/evidence ledger.
11. Run targeted unit tests, affected lint, the full build and then `npm run test:browser:policy`. The wrapper owns an ephemeral Vite preview port, avoiding other worktrees and Windows process-tree teardown stalls. Install Playwright Chromium or set `PLAYWRIGHT_BROWSERS_PATH` to an existing installation. Inspect narrow mobile, desktop and zoom, combined filters, empty results, anchors, canonical, source links, archive and both incoming paths. Check every internal destination against the registry and the actual page.
12. Review the diff, generated sitemap/SEO outputs and ad-free governance. Use a draft PR; check current AdSense owner evidence and deployment restrictions before merge/release. A local pass is not deployment certification.

## Source desk

Exact item citations live in `POLICY_SOURCES`; that registry is the maintained URL list. The work packet records what was actually verified and remaining gaps.

| Desk | Primary sources | What to distinguish |
| --- | --- | --- |
| FY Medicare payments | CMS IPPS/LTCH and SNF final-rule pages; Federal Register/GovInfo final texts and corrections | FY label versus each provision's applicability; base rate versus total facility payments |
| Beneficiary costs | CMS annual A/B cost release; Medicare.gov cost pages; CMS MA/Part D rate announcement Table V-6 | Final versus projected values; benefit period versus annual deductible; Part D cap versus premiums/Part B |
| MA/Part D | CMS contract-year final/proposed rules; Medicare.gov enrollment and plan comparison; member ANOC/EOC | Regulation versus actual plan benefit; rating year versus measurement year; proposed model versus adopted rule |
| Federal Medicaid | Medicaid.gov federal-policy guidance and New & Notable; SMD 26-001, SHO 26-001, SMD 26-006, November 18 CIB; enacted law and Federal Register | Expansion group versus all members; funding versus eligibility; implementation versus enforcement; enacted limit versus intended regulation |
| North Carolina | NC Medicaid `/beneficiaries/medicaid-is-changing`, detailed work/immigration pages, NCDHHS notices and NC policy bulletins | State instructions versus federal option; page modification date; election versus CMS approval |
| Later changes | CMS final-rule text, implementation roadmap and proposal docket | Roadmap is illustrative, not a substitute for law; reconcile updated dates before giving individual advice |

Avoid secondary news rewrites as the evidentiary basis. NC's September toolkit oriented this review; the detailed current NC pages control the published summaries. Never ask users to send immigration, medical or eligibility records to CAF. Search/filter values stay local and are not added to analytics, URLs or storage.

## Minimal record template

Copy a nearby entry in the typed data file. Choose one of the existing scope/status values; add a new value only if its meaning is clear to a reader. Prefer one provision per entry. A proposal needs an explicit conditional applicability date. Do not infer “Effective” solely from the clock.

## Known limits on November 22

- NC election and CMS approval of SMD 26-006 transition: not verified. The public hub exposes this gap beside the NC entry.
- The CMS letter acknowledges a vacated portion of the community-engagement rule. The page avoids prescribing a medical-frailty test; exact individualized exclusions need current agency/legal review.
- This is a selective patient/caregiver/care-transition reference, not an exhaustive provider compliance manual or a 50-state eligibility database. HH/PFS entry tracks the verified payment calendar without reproducing every provision.
- Current authenticated AdSense status was unavailable. No production release, resubmission or ad activation is part of this implementation.
