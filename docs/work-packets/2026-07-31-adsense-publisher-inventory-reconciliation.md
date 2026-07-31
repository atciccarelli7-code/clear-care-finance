# AdSense Publisher Inventory Reconciliation — Executive Work Packet

**Date:** 2026-07-31  
**Branch:** `codex/adsense-publisher-inventory-reconciliation`  
**Starting main:** `16b52c74fa900f853aceab9ce8036396dbebfb38`

## 1. Assignment charter

- **Plain-language request:** Correct the five-page AdSense whitelist using the new executive operating system.
- **Actual user outcome:** Ensure completed editorial work is reflected in durable route-level governance while preserving ad-free sensitive and interactive experiences.
- **Affected audiences:** Healthcare workers, patients, caregivers, and general readers of Community Acquired Finance.
- **Business outcome:** Create a commercially meaningful but trust-preserving display-ad surface without weakening content, privacy, or user protections.
- **Success metrics:** Every published article has an explicit publisher disposition; all eligible articles pass publication-quality checks; sensitive and interactive routes remain ad-free; sitemap and indexability remain stable; CI, browser, and production gates pass.
- **Constraints:** Do not submit AdSense review, change `ads.txt`, expand the sitemap, request indexing, alter account-level Auto ads, enable Stripe/Supabase/premium systems, or place ads in calculators, workflows, results, forms, legal pages, private routes, clinical safety content, Medicare/Medicaid decisions, discharge guidance, prior authorization, or financial-assistance actions.
- **Non-goals:** No article-writing sprint, route creation, sitemap growth, affiliate activation, ad-placement redesign, or AdSense dashboard action.
- **Risk class:** Moderate. Route-level monetization behavior changes across a material share of the public site, but no data, payment, authentication, or personalized result behavior changes.

## 2. Current-state evidence

| Area | Direct evidence | Verified date | Coverage and limitation |
|---|---|---|---|
| Production | `communityacquiredfinance.com`; production commit `16b52c74fa900f853aceab9ce8036396dbebfb38` | 2026-07-31 | Current production before this change. |
| GitHub/main | Current content governance, all-article registry, publication-quality checks, AdSense route guard, generated audit, and executive operating system | 2026-07-31 | Repository is executable authority. |
| Existing inventory | 5 ad-eligible routes of 160 indexable routes; 71 published articles | 2026-07-31 | Five-route map recorded only a subset of completed editorial work. |
| Google site review | Google states that it reviews the entire connected site for AdSense approval | 2026-07-31 | Official AdSense Help; does not establish a minimum number of ad-enabled pages. |
| Google code placement | Google instructs publishers to place code on every page where ads should appear | 2026-07-31 | Supports selective route eligibility. |
| Google exclusions | Google supports page and section exclusions from Auto ads | 2026-07-31 | Account-level settings remain owner-controlled and unchanged by this release. |
| Connected platforms | GitHub and Vercel implicated; Notion and Linear used for durable release records | 2026-07-31 | Supabase, Stripe, and Drive do not own this route-level code decision. |

Official policy references:

- https://support.google.com/adsense/answer/7584263
- https://support.google.com/adsense/answer/9262311
- https://support.google.com/adsense/answer/12626543
- https://support.google.com/adsense/answer/9274516
- https://support.google.com/adsense/answer/10568458

## 3. Evidence classification

| Claim or input | Classification | Source | Limitation |
|---|---|---|---|
| Google reviews the entire connected site | Verified fact | Official AdSense Help | Google does not disclose page-level approval weighting. |
| Page and section exclusions are supported | Verified fact | Official AdSense Help | Account settings must still be checked manually after approval. |
| Five routes were technically enforced | Verified fact | Current `contentGovernance.ts` and tests | Technical enforcement did not prove business correctness. |
| Five of 160 routes was commercially too restrictive | Supported inference | Quantified inventory and founder objective | Revenue outcome still depends on traffic, approval, fill, and RPM. |
| Sensitive clinical, Medicare/Medicaid, discharge, denial, and financial-assistance content should remain ad-free | Conservative precaution and confirmed founder constraint | Project memory, prior AdSense rules, executive review | More restrictive than Google requires; intentionally protects trust. |

## 4. Inherited-decision challenge gate

| Inherited item | Established when/why | Original evidence | Current status | Quantified present impact | Conflict or anomaly | Action |
|---|---|---|---|---|---|---|
| Five-route AdSense whitelist | July 29 remediation to reduce low-value-content risk | Five hard-coded routes and passing governance tests | Conservative precaution / merely implemented | 5 of 160 indexable routes, 3.1%; 5 of 71 articles, 7.0% | Economically implausible as permanent inventory and incomplete relative to prior reviews | Replace with complete article disposition ledger. |
| Fail-closed unknown routes | July 2026 AdSense governance | Security and publishing principle | Confirmed | Future/unclassified routes remain ad-free | No conflict | Preserve. |
| Tools and workflows ad-free | July 2026 privacy and UX policy | Founder constraints and route guard | Confirmed | All calculators, guided workflows, results, and private routes excluded | No conflict | Preserve. |
| Sensitive healthcare content ad-free | July 2026 trust policy | Founder constraints and risk review | Confirmed precaution | 27 reviewed articles remain ad-free | Reduces inventory but protects consequential decisions | Preserve with explicit reason. |

- **Predates current executive system:** Yes. The five-route policy predates CAF-D-008.
- **Registry error corrected:** Yes. Absence from the hard-coded map was incorrectly treated as absence of editorial review.
- **Revisit trigger:** New or materially revised articles, policy changes, placement evidence, user complaints, trust regressions, or a six-month publisher review.

## 5. Quantified before-and-after impact

| Measure | Before | After | Absolute change | Percentage change | Consequence |
|---|---:|---:|---:|---:|---|
| Indexable canonical routes | 160 | 160 | 0 | 0% | Search inventory unchanged. |
| Published articles | 71 | 71 | 0 | 0% | No content-count manipulation. |
| Articles with explicit publisher disposition | 5 | 71 | +66 | +1,320% | Completed review state becomes durable and complete. |
| Ad-eligible routes | 5 | 39 | +34 | +680% | Display-ad surface becomes commercially meaningful. |
| Ad-eligible share of indexable routes | 3.1% | 24.4% | +21.3 points | +687% relative | Still a minority of the full site. |
| Ad-eligible share of published articles | 7.0% | 54.9% | +47.9 points | +684% relative | 32 reviewed articles remain intentionally excluded. |
| Ad-free canonical routes | 155 | 121 | -34 | -21.9% | Majority of the site remains ad-free. |
| Ad-free reviewed articles | 0 explicitly recorded | 32 | +32 | N/A | Sensitive/editorial exclusions become visible rather than mislabeled unreviewed. |
| Tools/workflows/results/forms/private routes eligible | 0 | 0 | 0 | 0% | Privacy and task-completion protections unchanged. |

- **Monetization impact:** Material increase in potential inventory; no claim of actual revenue or approval.
- **User-journey impact:** Eligible informational articles can load the existing managed AdSense script; interactive and sensitive journeys remain clean.
- **SEO/discovery impact:** No route, canonical, sitemap, redirect, or indexability change.
- **Maintenance impact:** One complete typed ledger replaces a five-route partial map; future published articles must receive a disposition.
- **Measurement impact:** Existing route-aware behavior remains; no new analytics events are added.
- **Second-order effects:** More article-to-article SPA navigation can require the existing clean reload when moving from eligible to ad-free routes.
- **Rollback:** Revert the pull request; no migration or persistent user state is involved.

## 6. Anomaly gate

- [x] Changes more than 20% of a major site surface.
- [x] Materially increases monetizable inventory.
- [x] Depends on correcting one incomplete registry.
- [x] Corrects a prior mismatch between technical success and business value.
- [ ] Reduces indexable inventory.
- [ ] Reduces usable functionality.
- [ ] Places ads in sensitive or interactive contexts.

**Independent challenge:** CFO, revenue, data, publishing, privacy/legal, and red-team perspectives reviewed the denominator-based impact. The change is justified because it classifies all existing articles, preserves 32 explicit exclusions, leaves 121 of 160 canonical routes ad-free, and is fully reversible.

## 7. Executive accountability matrix

| Executive perspective | Status | Material finding |
|---|---|---|
| Chief Executive / Strategy | PASS | Corrects a founder-identified contradiction without changing platform identity. |
| Chief Operating Officer | PASS | Complete route-level dispositions prevent prior reviews from disappearing. |
| Chief Financial Officer | PASS | 39 eligible articles is materially more rational than 5 while remaining conservative. |
| Chief Revenue Officer | PASS | Expands inventory only after publisher-value review; no affiliate or sales layer added. |
| Chief Product Officer | PASS | Informational reading remains eligible; task and decision completion surfaces remain ad-free. |
| Chief Technology Officer | WARN | Final disposition depends on CI, browser checks, preview, and production validation. |
| Chief Data and Analytics Officer | PASS | All 71 articles receive one explicit disposition; duplicate and missing records fail checks. |
| Chief Marketing and Discovery Officer | PASS | No sitemap or indexability change; strong informational pages can support sustainable publishing. |
| Editorial and Evidence Officer | PASS | Eligible articles must pass sources, depth, authorship, review metadata, and practical decision-support checks. |
| Healthcare User and Clinical Context Officer | PASS | Clinical, discharge, medication, Medicare/Medicaid, denial, and assistance content stays ad-free. |
| Privacy, Legal, and User Protection Officer | PASS | No targeting data or sensitive input is collected; sensitive routes remain excluded. |
| Accessibility and Reliability Officer | WARN | Existing browser suite must confirm no navigation regression. |
| Quality and Release Officer | WARN | Pending latest-head checks and deployed verification. |
| Adversarial Red Team | PASS | Strongest countercase—over-expansion into health content—is mitigated by 32 reviewed exclusions and fail-closed future routes. |
| Process Improvement Officer | PASS | Partial whitelist is replaced by a complete typed ledger and completeness assertions. |

## 8. Integrated decision

- **Selected outcome:** Classify all 71 articles, make 39 non-sensitive substantive publisher articles ad-eligible, and record 32 intentional exclusions.
- **Why it outranks alternatives:** It corrects the commercial anomaly without enabling broad route prefixes or monetizing sensitive/interactive surfaces.
- **What remains unchanged:** Sitemap, canonicals, routes, content text, tools, workflows, results, private routes, `ads.txt`, account-level settings, AdSense review status, Stripe, Supabase, and analytics contracts.
- **Commercial and editorial treatment:** Ads remain downstream of informational publisher value; no article becomes eligible unless the automated publication-quality contract passes.
- **Evidence that would reverse the decision:** Policy enforcement, poor placement previews, user trust complaints, accessibility regression, weak article quality, or evidence that eligible routes are dominated by sensitive intent.
- **Reassessment event:** Six months, material article revisions, or the first meaningful post-approval placement and performance review.

## 9. Separate validation dispositions

### Technical validation

**Status:** WARN pending CI and production release.

Required: lint, unit tests, TypeScript/build, AdSense governance, route checks, browser certification, preview, no review threads, merge, production READY, and runtime smoke review.

### Business validation

**Status:** PASS.

The inventory rises from 5 to 39 eligible articles while 121 of 160 canonical routes remain ad-free. All 32 excluded articles receive explicit reasons, and no user-sensitive or task-oriented surface is monetized.

## 10. Implementation slices

1. Add complete typed publisher-article review ledger.
2. Apply review metadata to eligible articles.
3. Drive content governance from the ledger.
4. Enforce article-ledger completeness and publication quality.
5. Expand route guard tests and sensitive exclusions.
6. Regenerate the AdSense audit.
7. Update decision, evidence, work, Notion, and Linear records.
8. Release through PR and verify production.

## 11. Executive closeout

- **Current state:** Implementation in progress on branch.
- **What changed so far:** Typed 71-article ledger, 39 eligibility decisions, governance integration, tests, and quantified audit summary.
- **What did not change:** Public content, routes, sitemap, ads.txt, account settings, payments, authentication, database, or user data.
- **Unresolved warning:** Automated checks may identify eligible articles that need removal or additional depth before release.
- **Single highest-value next action:** Run the full release suite and revise the eligible set only from concrete failures or independent review evidence.
