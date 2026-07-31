# Evidence-Led Growth and Insurance Handoff — Executive Work Packet

**Date:** 2026-07-31  
**Branch:** `codex/evidence-led-insurance-handoff`  
**Starting main:** `768f4da168f68a74367925e2c1245421f55042b0`

## Assignment charter

- **Request:** Identify and release the single highest-value next improvement using current production, repository, search, analytics, operating, database, and commercial evidence.
- **Selected outcome:** Establish a durable first-party evidence loop for the `/insurance` hub and measure its existing decision handoffs.
- **Affected users:** Visitors who reach the Benefits & Insurance hub and voluntarily allow analytics.
- **Business outcome:** Replace an unverified downstream funnel with a queryable numerator and denominator for one current search opportunity.
- **Non-goals:** No new content, route, affiliate, AdSense resubmission, ad setting, checkout, email campaign, user account, or calculator-input collection.
- **Risk class:** Moderate because a new server endpoint and database table are introduced; low data sensitivity because the schema rejects arbitrary or answer-level fields.

## Current-state evidence

| Evidence | Observed state | Date/window | Source | Limitation |
|---|---|---|---|---|
| Organic clicks | 8 clicks | latest recorded 28-day scorecard | CAF Growth & Revenue Operating Dashboard / GSC | Dashboard summary does not contain a current query/page join. |
| `/insurance` opportunity | 18 impressions, 0 clicks, average position 11.28 | 28 days through 2026-07-20 | Search Baseline tab | Small historical sample; current Search Console connection unavailable. |
| Behavioral funnel | Article sessions, tool starts/completions, result actions, returning users, ad-eligible pageviews, and newsletter signups blank | Dashboard read 2026-07-31 | Weekly Funnel and Executive Scorecard | Blank means unverified, not zero. |
| Analytics implementation | Consent-gated Vercel and GA4 events with sensitive-key filtering | current `main` | `src/lib/analytics.ts`, `growthAnalytics.ts`, `App.tsx` | Code proves emission contracts, not accessible production outcomes. |
| First-party behavioral store | No behavioral table existed before this assignment | 2026-07-31 | Supabase schema inspection | Premium-system tables existed; no event evidence table. |
| Insurance hub | Existing practical pathways and fixed `pathway_click` events | current production/code | `/insurance`, `InsuranceBenefitsHub.tsx` | No consented hub-view denominator or connected first-party click store. |
| Stripe commercial state | 1 active live-mode product marked `prelaunch`; 0 active payment links | 2026-07-31 | Connected Stripe account `Community Acquired Finance` | Does not prove demand, checkout readiness, or entitlement readiness. |
| Production health | Current post-PR #234 deployment is READY | 2026-07-31 | GitHub/Vercel | Does not establish demand or user value. |

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

### Why measurement outranks alternatives

The site already contains search inventory, decision tools, analytics code, and an insurance hub with an observed search opportunity. However, nearly every downstream metric is unverified. Additional content, redesign, retention, or monetization work would therefore be selected without a production behavioral denominator. The connected Stripe account also confirms that the current product remains prelaunch with no active payment link, so activating monetization before evidence and access readiness would not be the next safe step. The bounded evidence loop creates reusable decision evidence while immediately measuring an existing high-intent journey.

## Inherited-decision challenge

| Inherited item | Status | Challenge | Decision |
|---|---|---|---|
| GA4/Vercel analytics are sufficient | Merely implemented | The connected operating dashboard has no observed downstream funnel despite extensive event code. | Preserve existing providers but add a minimal first-party evidence store. |
| Measure the entire site at once | Implicit ambition | A broad schema would increase privacy, maintenance, and interpretation risk. | Reject; instrument one surface and two events. |
| `/insurance` needs more content | Unsupported inference | The hub is already substantial and ranks near page-one range in the dated snapshot. | Preserve content and measure handoff behavior first. |
| Supabase is only for premium workspaces | Provisional architecture | The active project can safely store fixed anonymous experiment events through a server-only boundary. | Extend with a separate locked table; do not mix with workspace data. |
| Stripe product existence means monetization is next | Unsupported inference | The only active product is marked prelaunch and there are no active payment links. | Preserve prelaunch state; do not activate checkout or infer demand. |

## Data minimization contract

### Stored

- random event UUID;
- random browser-session UUID stored only in `sessionStorage`;
- one of two fixed event names;
- fixed surface `insurance_hub`;
- one finite destination ID for handoffs;
- fixed variant;
- server timestamp.

### Never stored by this pipeline

- name, email, phone, account ID, or authenticated user ID;
- IP address, user agent, device fingerprint, approximate location, or referrer;
- URL, query string, fragment, or search query;
- medical, medication, diagnosis, claim, provider, employer, or insurance details;
- calculator answers, financial amounts, premiums, deductibles, balances, APRs, results, recommendations, or free text.

## Before-and-after impact

| Measure | Before | Release target | Consequence |
|---|---:|---:|---|
| First-party behavioral tables | 0 | 1 | Queryable experiment evidence becomes available. |
| Evidence event names | 0 | 2 | One denominator and one handoff numerator. |
| Instrumented surfaces in this pipeline | 0 | 1 of 160 indexable routes | Bounded scope; no sitewide profiling. |
| Allowed arbitrary event properties | N/A | 0 | Exact parser rejects extra keys. |
| Public/anonymous/authenticated table privileges | N/A | 0 | Browser and signed-in users cannot query or write Supabase directly. |
| Service-role table privileges | Default broad grants | SELECT, INSERT, DELETE only | Endpoint can write/query/clean evidence but cannot update or truncate the table. |
| Existing routes/content/indexability | 160 / 71 articles | unchanged | No SEO inventory change. |
| Existing AdSense eligibility | 39 articles | unchanged | No advertising expansion. |
| Existing page visuals | current `/insurance` | unchanged | Experiment measures the current decision tree without redesign confounding. |
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
- **Guardrails:** zero sensitive fields; no navigation failure; no public database access; no material runtime errors.
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
| CTO | WARN | Requires final CI, preview, and production validation. |
| Data | PASS | Defines numerator, denominator, variant, threshold, prohibited data, and least-privilege access. |
| Discovery | PASS | Uses the strongest current dated hub opportunity without rewriting on a tiny sample. |
| Editorial | PASS | No content claim or source changes beyond the privacy disclosure. |
| Healthcare user | PASS | Sensitive answers and health context are excluded. |
| Privacy/legal | PASS | Public disclosure is updated; forced RLS, zero public policies, and explicit privileges are verified. |
| Accessibility/reliability | WARN | Browser journeys and navigation must remain unchanged. |
| Quality/release | WARN | Pending final latest-head release gates. |
| Red team | PASS | Main risk—creating surveillance infrastructure—is constrained by one surface, two events, consent, exact keys, no public access, and service-role least privilege. |
| Process improvement | PASS | Creates a reusable evidence pattern without making it sitewide by default. |

## Validation record

1. Payload allowlist, UUID, consent, session deduplication, and query-string rejection tests pass locally/in CI candidates.
2. The first workflow pass rejected one shared-contract TypeScript narrowing defect after 544 unit tests and all preceding checks passed; it was fixed before migration.
3. The exact migration was applied to Supabase only after the corrected code/build gate passed.
4. Direct inspection verified RLS enabled and forced, no policies, and no `public`, `anon`, or `authenticated` privileges.
5. Direct inspection initially found Supabase default grants left `service_role` with UPDATE/TRUNCATE and related privileges. A corrective migration revoked all service-role privileges and granted only SELECT, INSERT, and DELETE. The source migration and regression test were hardened to preserve that result.
6. The Supabase security advisor reports one informational `rls_enabled_no_policy` notice for `growth_events`; this is intentional because no browser role receives table privileges or an RLS policy. Remediation reference: https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy
7. The performance advisor reports the new report index as unused; this is expected before production evidence exists. Remediation reference: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index
8. A controlled `release_verification` row passed the database constraints and was deleted; total and verification row counts returned to zero.
9. Final CI, browser, preview, deployed endpoint, production route, and runtime checks remain required before merge/closeout.
10. GitHub, Notion, Linear, and the Growth & Revenue Operating Dashboard must receive final release evidence.

## Separate dispositions

### Technical validation

**Current status:** WARN pending final latest-head CI, browser, Vercel preview, merge, and production checks. Database security and constraint validation are PASS.

### Business validation

**Current status:** PASS. Measurement integrity is directly evidenced as incomplete, the selected intervention is bounded to the strongest current dated hub opportunity, and current Stripe state does not justify activating monetization instead.

## Rollback

- Revert the release commit.
- Drop `public.growth_events` after confirming no evidence must be retained.
- No user workspace, entitlement, payment, article, route, or SEO migration is involved.
