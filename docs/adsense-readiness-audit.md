# AdSense Readiness Audit

**Site:** Community Acquired Finance  
**Production domain:** `https://communityacquiredfinance.com`  
**Baseline reviewed:** main at `fdba4c9df37ca5eede814561b63a54e74934ad16`  
**Review date:** July 15, 2026

This audit separates public availability, search indexability, and advertising eligibility. An internal depth label may identify pages that need editorial attention, but it is not a Google word-count rule.

## Executive finding

The technical site foundation was healthy before this remediation: 143 canonical routes prerendered successfully, the sitemap and SEO registry agreed, `ads.txt` contained the correct publisher declaration, trust pages were present, privacy controls were active, and the latest production deployment had no clustered runtime errors.

The principal AdSense risk was the advertising allowlist. It granted eligibility to every `/articles/` route, every `/topics/` route, and 17 broad hubs or guides. That made 88 of 143 canonical routes eligible for the advertising script, including navigation-led topic pages and collection surfaces. The new governance model reduces eligibility to 10 affirmatively reviewed publisher articles while preserving the existing search footprint.

## Before and after

| Measure | Before | After |
|---|---:|---:|
| Public canonical routes | 143 | 143 |
| Indexable canonical routes | 143 | 143 |
| Ad-eligible routes | 88 | 10 |
| Ad-free routes | 55 | 133 |
| Noindex changes | 0 | 0 |
| Redirect or canonical consolidations | 0 | 0 |

No route was noindexed merely because it is interactive, new, low traffic, or not ad-eligible. Useful calculators and workflows remain searchable while staying ad-free.

## Exact ad-eligible route list

Only the following routes are affirmatively approved by the centralized governance registry:

- `/articles/deductible-copay-coinsurance-out-of-pocket-max`
- `/articles/how-to-read-an-eob`
- `/articles/how-hospital-403b-matching-works`
- `/articles/facility-fee-vs-professional-fee`
- `/articles/backup-care-plans-for-busy-healthcare-workers`
- `/articles/prescription-coverage-open-enrollment-checklist`
- `/articles/prior-authorization-explained`
- `/articles/spouse-family-health-insurance-open-enrollment`
- `/articles/accident-critical-illness-hospital-indemnity-open-enrollment`
- `/articles/medicare-options-explained`

Eligibility means the managed AdSense script may load on the route after account approval. It does not authorize aggressive placement, Auto Ads across the entire site, above-the-fold units, sticky mobile ads, or ads next to actions and navigation.

## Route-family audit

| Route family | Public? | Indexable? | Ad-eligible? | Content tier | Interactive or sensitive? | Required action | Reason |
|---|---|---|---|---|---|---|---|
| Ten reviewed articles listed above | Yes | Yes | Yes | Flagship or substantial | No input/result context | Preserve; use conservative placements only | Distinct informational intent, source-backed content, review metadata, and practical decision support |
| All other individual articles | Yes | Yes | No | Standard | No input/result context | Keep ad-free pending individual review | Publication does not automatically establish advertising value |
| `/topics/*` | Yes | Yes | No | Navigation/overview | Generally no | Keep ad-free; improve only for reader value | Topic pages can be useful search destinations but are often collection-led |
| Root hubs such as `/healthcare-workers`, `/insurance`, `/medicare-care-costs` | Yes | Yes | No | Navigation | Mixed pathways | Keep ad-free | Broad hubs primarily route users to the next resource |
| `/articles`, `/topics`, `/tools`, `/guides` | Yes | Yes | No | Navigation | Yes | Permanently ad-free | Directory and navigation screens are not publisher-content inventory |
| `/tools/*` calculators and guided workflows | Yes | Yes | No | Utility | Yes | Permanently ad-free | User actions, inputs, results, and sensitive decisions must remain separate from advertising |
| Medicare/Medicaid eligibility, prior authorization, bill review, discharge, and assistance workflows | Yes | Yes | No | Utility | Sensitive and interactive | Permanently ad-free | Protect privacy and avoid monetizing eligibility, health, or hardship interactions |
| Printable checklist variants | Yes | Yes | No | Utility | Action-oriented | Keep ad-free | Avoid duplicate/action-led advertising inventory |
| Newsletter and contact pages | Yes | Yes | No | Utility/form | Interactive | Permanently ad-free | Form surfaces are not advertising inventory |
| About, methodology, editorial policy, disclosures, and accessibility | Yes | Yes | No | Trust | No | Permanently ad-free | Credibility and governance pages must remain commercially neutral |
| Privacy policy and terms | Yes | Yes | No | Trust/legal | No | Permanently ad-free | Legal and privacy surfaces are compliance content |
| `/for-organizations` | Yes | Yes | No | Organization | Commercial context | Permanently ad-free | Avoid mixing programmatic ads with pilot or partner messaging |
| Unknown or future routes | Not assumed | Not assumed | No | Draft | Unknown | Block by default until classified | Monetization requires affirmative review, never a route-prefix assumption |

## Route-by-route generated appendix

The repository contains a deterministic audit generator:

```bash
npm run adsense:audit
```

It resolves every canonical route through `src/lib/contentGovernance.ts` and writes a full route-by-route table to this file with:

- Route and title
- Page type and content tier
- Indexability and ad eligibility
- Primary user intent
- Internal explanatory-depth heuristic
- RN voice-note presence
- Sources and author/review metadata
- Interactive or sensitive context
- Potential overlap cluster
- Recommended action and rationale

The validation command does not use word count as an approval rule:

```bash
npm run adsense:check
```

## Publication-quality standard

General publication readiness requires a clear title, promise, audience, direct summary, substantive explanatory body or sections, practical takeaway, authoritative source, author identification, and time-sensitive review metadata when applicable.

Ad-eligible articles receive a stricter structural review. They must also have:

- Publication and last-reviewed dates
- Multiple layers of original explanation
- Practical decision support such as an example, checklist, comparison, questions, steps, or common mistakes
- A distinct informational purpose
- No unfinished placeholder
- No dominant input, navigation, result, or saved-work purpose

This is implemented in `src/lib/publicationQuality.ts` and enforced by `scripts/check-adsense-readiness.mjs`.

## Content overlap decisions

### Medicare and long-term care

Routes reviewed:

- `/articles/does-medicare-cover-long-term-care`
- `/articles/what-does-medicare-not-cover`
- `/articles/long-term-care-and-custodial-care`
- `/articles/medicaid-dual-eligibility-ltss`

**Decision:** Keep separate for now and keep all ad-free pending individual review. The routes address different intents: a direct Medicare coverage question, a broader exclusions question, the skilled-versus-custodial distinction, and Medicaid/LTSS eligibility. Reassess after additional Search Console evidence rather than merging preemptively.

### Rehabilitation and discharge

Routes reviewed:

- `/articles/does-medicare-cover-rehab-after-hospital-stay`
- `/articles/short-term-rehab-after-hospital`
- `/articles/discharge-coverage-guide`
- `/articles/observation-vs-inpatient-status`

**Decision:** Keep separate. Coverage eligibility, discharge process, short-term rehabilitation, and hospital status are materially different decisions. Strengthen reciprocal pathways rather than creating another similar page.

### Medicare comparisons

Routes reviewed:

- `/articles/medicare-options-explained`
- `/articles/medicare-advantage-vs-original-medicare-2026`
- `/insurance/medicare-advantage-vs-medigap`
- `/insurance/medicare-advantage`
- `/insurance/what-medicare-advantage-marketing-may-not-emphasize`

**Decision:** Keep separate, but only the broad, reviewed Medicare options explainer is currently ad-eligible. The remaining pages serve Original-versus-Advantage, Advantage-versus-Medigap, plan-comparison, and marketing-risk intents. Do not create additional keyword variants.

### Health-insurance cost terminology

Routes reviewed:

- `/articles/deductible-copay-coinsurance-out-of-pocket-max`
- `/articles/premium-deductible-out-of-pocket-open-enrollment`
- `/tools/out-of-pocket-max-estimator`

**Decision:** Keep as a connected journey. The first article explains the terminology, the second applies it to open-enrollment decisions, and the tool performs an estimate. The calculator remains permanently ad-free.

## Search Console and content changes

PR #177 had already upgraded nine high-opportunity articles, added direct answers and practical decision support, strengthened internal pathways, and preserved canonical URLs. This remediation deliberately does not repeat those rewrites. Those nine pages form most of the initial reviewed advertising allowlist.

No additional article was padded or rewritten solely to pursue AdSense approval. The remaining articles stay indexable and ad-free until an individual editorial review confirms distinct intent, sufficient original value, sourcing, and practical usefulness.

## Placement and privacy guardrails

The initial implementation authorizes no new visible ad units. After approval, any placement must follow these limits:

- No above-the-fold placement
- No sticky mobile ad
- No ad beside navigation, buttons, forms, calculators, checklists, result actions, or official-agency links
- No ad within warnings, eligibility explanations, or sensitive passages
- One in-content placement only after a meaningful opening section
- Optional second placement only near the end of a genuinely long article
- Clear visual separation from editorial content
- No personalized advertising audiences based on health, disability, medical history, financial hardship, debt, insurance status, or benefit eligibility

## Current recommendation

Deploy and verify the governance changes first. Confirm that the managed AdSense script appears only on the ten allowlisted articles and is absent from representative hubs, topics, tools, forms, trust pages, and sensitive workflows. Allow Google time to recrawl the changed site before requesting another AdSense review. Approval cannot be guaranteed.
