# Evidence-Led Growth and Insurance Handoff — Executive Work Packet

**Date:** 2026-07-31  
**Implementation branch:** `codex/evidence-led-insurance-handoff`  
**Starting main:** `768f4da168f68a74367925e2c1245421f55042b0`  
**Implementation PR:** #235  
**Implementation merge:** `ca8d384ae4134569ca10ded8a7b5b96a7de1aa1a`  
**Production deployment:** `dpl_5TScqaNv3KohCxaixrciH7TTxzPJ`

## Assignment charter

- **Request:** Identify and release the single highest-value next improvement using current production, repository, search, analytics, operating, database, and commercial evidence.
- **Selected bottleneck:** Measurement integrity.
- **Selected intervention:** Establish a bounded first-party evidence loop for the existing `/insurance` decision tree.
- **Affected users:** Visitors who reach the Benefits & Insurance hub and voluntarily allow analytics.
- **Business outcome:** Replace an unverified downstream funnel with a queryable numerator and denominator for one current search opportunity.
- **Non-goals:** No new content, route, affiliate, AdSense resubmission, ad setting, checkout, email campaign, user account, or calculator-input collection.
- **Risk class:** Moderate implementation risk because a server endpoint and database table were introduced; low data sensitivity because the schema rejects arbitrary and answer-level fields.

## Current-state evidence used for selection

| Evidence | Observed state | Date/window | Source | Limitation |
|---|---|---|---|---|
| Organic clicks | 8 clicks | latest recorded 28-day scorecard | CAF Growth & Revenue Operating Dashboard / GSC | Dashboard summary did not contain a current query/page join. |
| `/insurance` opportunity | 18 impressions, 0 clicks, average position 11.28 | 28 days through 2026-07-20 | Search Baseline tab | Small historical sample; current Search Console connection was unavailable. |
| Behavioral funnel | Article sessions, tool starts/completions, result actions, returning users, ad-eligible pageviews, and newsletter signups blank | Dashboard read 2026-07-31 | Weekly Funnel and Executive Scorecard | Blank means unverified, not zero. |
| Analytics implementation | Consent-gated Vercel and GA4 events with sensitive-key filtering | starting `main` | `src/lib/analytics.ts`, `growthAnalytics.ts`, `App.tsx` | Code proved emission contracts, not accessible production outcomes. |
| First-party behavioral store | No behavioral table existed before this assignment | 2026-07-31 | Supabase schema inspection | Premium-system tables existed; no event evidence table. |
| Insurance hub | Existing practical pathways and fixed `pathway_click` events | starting production/code | `/insurance`, `InsuranceBenefitsHub.tsx` | No consented hub-view denominator or connected first-party click store. |
| Stripe commercial state | 1 active live-mode product marked `prelaunch`; 0 active payment links | 2026-07-31 | Connected Stripe account `Community Acquired Finance` | Did not prove demand, checkout readiness, or entitlement readiness. |
| Production health | Post-PR #234 production was READY | 2026-07-31 | GitHub/Vercel | Did not establish demand or user value. |

## Bottleneck selection gate

Scores use a 1–5 scale. Higher is better except implementation effort and risk, where 5 means easier/lower risk.

| Candidate | User value | Evidence strength | Business value | Ease | Reversibility | Low risk | Measurement quality | Time to learning | Mission fit | Total |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Search acquisition rewrite | 3 | 2 | 3 | 3 | 5 | 4 | 2 | 2 | 4 | 28 |
| Landing-page redesign | 3 | 2 | 3 | 3 | 5 | 4 | 2 | 2 | 4 | 28 |
| Another decision-outcome build | 4 | 2 | 4 | 2 | 4 | 3 | 2 | 2 | 5 | 28 |
| Retention/newsletter expansion | 3 | 1 | 4 | 3 | 4 | 3 | 1 | 2 | 4 | 25 |
| Trust/RN differentiation expansion | 4 | 3 | 3 | 3 | 5 | 4 | 2 | 3 | 5 | 32 |
| **Measurement integrity + insurance handoff** | **4** | **5** | **5** | **4** | **5** | **4** | **5** | **5** | **5** | **42** |
| Monetization activation | 2 | 2 | 4 | 2 | 3 | 2 | 1 | 2 | 2 | 20 |

### Why measurement outranked the alternatives

The site already contained search inventory, decision tools, analytics code, and a substantial insurance hub with an observed search opportunity. Nearly every downstream metric was nevertheless unverified. More content, a redesign, retention promotion, or monetization would therefore have been selected without a production behavioral denominator. The connected Stripe account also confirmed that the current product remained prelaunch with no active payment link. The bounded evidence loop created reusable decision evidence while immediately measuring an existing high-intent journey.

## Inherited-decision challenge

| Inherited item | Status | Challenge | Disposition |
|---|---|---|---|
| GA4/Vercel analytics are sufficient | Merely implemented | The connected operating dashboard had no observed downstream funnel despite extensive event code. | Preserved existing providers and added a minimal first-party evidence store. |
| Measure the entire site at once | Implicit ambition | A broad schema would increase privacy, maintenance, and interpretation risk. | Rejected; instrumented one surface and two events. |
| `/insurance` needs more content | Unsupported inference | The hub was already substantial and ranked near page-one range in the dated snapshot. | Preserved content and measured handoff behavior first. |
| Supabase is only for premium workspaces | Provisional architecture | The active project could safely store fixed anonymous experiment events through a server-only boundary. | Extended with a separate locked table; did not mix with workspace data. |
| Stripe product existence means monetization is next | Unsupported inference | The only active product was marked prelaunch and there were no active payment links. | Preserved prelaunch state; did not activate checkout or infer demand. |

## Implemented intervention

The release added:

- a strict typed event contract;
- exact-key payload parsing and UUID validation;
- one fixed surface, `insurance_hub`;
- two fixed events, `insurance_hub_viewed` and `insurance_hub_handoff_opened`;
- a finite destination allowlist;
- consent-gated client emission using the existing privacy choice;
- once-per-browser-session view deduplication;
- mirroring of existing insurance pathway clicks into the bounded first-party contract;
- a same-origin, POST-only `/api/evidence-event` endpoint;
- a private `public.growth_events` table in Supabase;
- forced RLS with no policies and no `public`, `anon`, or `authenticated` privileges;
- `service_role` privileges limited to SELECT, INSERT, and DELETE;
- public privacy-policy disclosure;
- unit, API, migration-security, consent, and deduplication tests;
- a 28-day experiment definition and threshold;
- repository, Notion, Linear, and Google Sheets operating records.

## Data minimization contract

### Stored

- random event UUID;
- random browser-session UUID stored only in `sessionStorage`;
- one of two fixed event names;
- fixed surface `insurance_hub`;
- one approved destination ID for handoffs;
- fixed variant;
- server timestamp.

### Never stored by this pipeline

- name, email, phone, account ID, or authenticated user ID;
- IP address, user agent, device fingerprint, approximate location, or referrer;
- URL, query string, fragment, or search query;
- medical, medication, diagnosis, claim, provider, employer, or insurance details;
- calculator answers, financial amounts, premiums, deductibles, balances, APRs, results, recommendations, or free text.

## Before-and-after impact

| Measure | Before | After | Consequence |
|---|---:|---:|---|
| First-party behavioral tables | 0 | 1 | Queryable experiment evidence is available. |
| Fixed evidence event names | 0 | 2 | One denominator and one handoff numerator. |
| Instrumented surfaces in this pipeline | 0 | 1 of 160 indexable routes | Bounded scope; no sitewide profiling. |
| Allowed arbitrary event properties | N/A | 0 | Exact parser rejects extra keys. |
| Public/anonymous/authenticated table privileges | N/A | 0 | Browser and signed-in users cannot query or write Supabase directly. |
| Service-role table privileges | Default broad grants detected during validation | SELECT, INSERT, DELETE only | Endpoint can write/query/clean evidence but cannot update or truncate the table. |
| Existing routes/content/indexability | 160 routes / 71 articles | unchanged | No SEO inventory change. |
| Existing AdSense eligibility | 39 articles | unchanged | No advertising expansion. |
| Existing page visuals | current `/insurance` | unchanged | Baseline measures the current decision tree without redesign confounding. |
| Active Stripe payment links | 0 | 0 | No monetization activation. |

## Experiment definition

- **ID:** `INSURANCE-HANDOFF-2026-07`
- **Variant:** `baseline_v1`
- **Hypothesis:** Visitors who reach the insurance hub and allow analytics will use its decision pathways, revealing which existing destination deserves the next optimization.
- **Denominator:** Distinct consented session IDs with `insurance_hub_viewed`.
- **Numerator:** Distinct consented session IDs with `insurance_hub_handoff_opened`.
- **Breakdown:** Fixed `destination_id` only.
- **Minimum interpretation threshold:** 10 consented hub-view sessions.
- **Window:** First 28 days after production release.
- **Guardrails:** Zero sensitive fields; no navigation failure; no public database access; no material runtime errors.
- **Decision rule:** Below 10 views, report counts only and extend the window. At or above 10 views, rank destination counts, calculate distinct-session handoff rate, and inspect the strongest and weakest pathways before changing page content.
- **Reversal trigger:** Privacy defect, public table exposure, endpoint abuse, navigation regression, material runtime cost, or evidence that consented sessions are too sparse to justify persistent storage.

## Executive accountability matrix

| Perspective | Status | Finding |
|---|---|---|
| CEO / Strategy | PASS | Converts building activity into a learning loop tied to a real search opportunity. |
| COO | PASS | Fixed contract and queryable store reduce manual dashboard dependence. |
| CFO | PASS | Small reversible infrastructure investment before larger growth or monetization work. |
| Revenue | PASS | Improves evidence without activating an unverified prelaunch product or commercial relationship. |
| Product | PASS | Measures whether the existing decision tree produces a useful next action. |
| CTO | PASS | API, migration, exact-head preview, merge, and production deployment passed. |
| Data | PASS | Numerator, denominator, variant, threshold, prohibited data, and least-privilege access are explicit. |
| Discovery | PASS | Uses the strongest current dated hub opportunity without rewriting on a tiny sample. |
| Editorial | PASS | No content claim or source changes beyond the privacy disclosure. |
| Healthcare user | PASS | Sensitive answers and health context are excluded. |
| Privacy/legal | PASS | Public disclosure, forced RLS, zero public policies, and explicit privileges are verified. |
| Accessibility/reliability | PASS | Browser and mobile journeys passed and the visual experience remained unchanged. |
| Quality/release | PASS | Latest-head CI, browser, decision-journey, preview, merge, production, and runtime gates passed. |
| Red team | PASS | The surveillance risk is constrained by one surface, two events, consent, exact keys, no public access, and service-role least privilege. |
| Process improvement | PASS | Creates a reusable evidence pattern without making it sitewide by default. |

## Validation record

1. Payload allowlist, UUID, consent, session deduplication, and query-string rejection tests passed.
2. The first workflow pass rejected one shared-contract TypeScript narrowing defect after 544 unit tests and all preceding checks passed; it was fixed before migration.
3. The exact migration was applied to Supabase only after the corrected code/build gate passed.
4. Direct inspection verified RLS enabled and forced, no policies, and no `public`, `anon`, or `authenticated` privileges.
5. Direct inspection found that Supabase default grants initially left `service_role` with UPDATE, TRUNCATE, and related privileges. A corrective migration revoked all service-role privileges and granted only SELECT, INSERT, and DELETE. The source migration and regression test were hardened to preserve that result.
6. The Supabase security advisor reported one informational `rls_enabled_no_policy` notice for `growth_events`; this is intentional because no browser role has table privileges or a policy.
7. The performance advisor reported the new reporting index as unused; this is expected before production evidence exists.
8. A controlled `release_verification` row passed the database constraints and was deleted. Post-release counts were 0 total rows and 0 verification rows before organic observation began.
9. Exact-head `a9c633232bcf034c90114536028376bc8f1030aa` passed:
   - CI `30666434526`;
   - Browser certification `30666434485`;
   - Decision Journey `30666433514`;
   - 544 tests plus API typecheck, governance, publication, AdSense, build, bundle, prerender, mobile, accessibility, and browser gates.
10. Exact-head Vercel preview `dpl_7aG2b8u6pgmWGNkphQ4y4TnL57VG` reached READY.
11. PR #235 merged with head-SHA protection at `ca8d384ae4134569ca10ded8a7b5b96a7de1aa1a`.
12. Production deployment `dpl_5TScqaNv3KohCxaixrciH7TTxzPJ` reached READY and points to the merge SHA.
13. Production `/insurance` and `/privacy-policy` returned HTTP 200 with the expected canonical metadata, unchanged decision hierarchy, and first-party evidence disclosure.
14. Production `/api/evidence-event` returned the expected POST-only 405 boundary on GET with private/no-store and noindex headers.
15. Vercel reported no runtime error clusters for `/api/evidence-event` in the checked post-release hour.
16. A direct production POST from the local execution sandbox could not be performed because that sandbox could not resolve the public host. The endpoint contract, exact-head server behavior, controlled database insert/delete, deployed production function boundary, and runtime health were independently verified; this limitation is not represented as a successful production POST.
17. The Growth & Revenue Operating Dashboard, Notion record, Linear AND-98, repository ledgers, and PR closeout were updated.

## Separate dispositions

### Technical validation

**PASS.** The implementation works, is consent-gated, rejects arbitrary data, preserves navigation and accessibility, maintains indexability and AdSense boundaries, uses least-privilege database access, and is deployed on the verified merge SHA. No material technical blocker remains.

### Business validation

**PASS.** Measurement integrity was directly evidenced as incomplete and materially constrained product prioritization. The intervention is bounded, reversible, mission-aligned, and faster to useful learning than the rejected alternatives. It does not claim that handoff behavior, satisfaction, retention, or revenue has already improved.

## Deliberately unchanged

- No AdSense resubmission or account-setting change.
- No affiliate, lender, insurer, HSA, sponsor, or referral activation.
- No Stripe product, price, payment-link, checkout, payment, or entitlement change.
- No newsletter promotion or marketing email.
- No route, article, sitemap, canonical, or indexability change.
- No redesign of `/insurance`.
- No medical, insurance, financial, calculator-input, or free-text collection.

## Rollback

- Revert merge commit `ca8d384ae4134569ca10ded8a7b5b96a7de1aa1a` or the specific evidence-loop files.
- Drop `public.growth_events` after confirming no evidence must be retained.
- Remove the first-party observer and `/api/evidence-event` endpoint.
- No user workspace, entitlement, payment, article, route, or SEO migration is involved.

## Next decision

At the end of the first 28-day production window, query distinct `baseline_v1` insurance-hub views and handoffs. Below 10 viewed sessions, publish counts only and extend the window. At or above 10, rank destination counts and use the strongest and weakest pathways to select exactly one next landing-to-action improvement.