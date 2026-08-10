# Community Acquired Finance Decision Ledger

This ledger records material strategic, product, technical, editorial, commercial, and operating decisions. It prevents prior choices from becoming invisible assumptions.

## Status definitions

- `CONFIRMED`: explicit founder decision or validated operating policy.
- `PROVISIONAL`: current direction that remains open to evidence.
- `EXPERIMENT`: bounded hypothesis with a measurement or review trigger.
- `SUPERSEDED`: replaced by a later decision; retained for history.
- `RETIRED`: intentionally abandoned.

## Decision template

| Field | Required content |
|---|---|
| ID | Stable identifier such as `CAF-D-001` |
| Date | Date decided or last substantively revised |
| Status | One status above |
| Decision | Clear statement of what is being decided |
| Rationale | Why this direction was chosen |
| Evidence | Direct source, founder confirmation, or validated implementation evidence |
| Consequences | What this enables, prevents, or deprioritizes |
| Revisit trigger | Evidence, date, milestone, or failure condition that requires reconsideration |
| Supersedes | Prior decision IDs, if any |

## Active decisions

### CAF-D-001 — Platform identity

- **Date:** 2026-07-29
- **Status:** CONFIRMED
- **Decision:** Community Acquired Finance is a healthcare financial decision-support platform for healthcare workers, patients, and caregivers.
- **Rationale:** This identity integrates healthcare employment, healthcare consumption, illness, insurance, discharge, caregiving, and long-term planning without reducing the brand to a narrow content niche.
- **Evidence:** Explicit founder direction recorded in project context.
- **Consequences:** New work must strengthen decision support and healthcare specificity rather than expand generic finance content.
- **Revisit trigger:** Explicit founder revision or strong evidence that the identity materially prevents serving the intended audiences.
- **Supersedes:** Earlier narrow descriptions such as personal finance for nurses or a medical-bill website.

### CAF-D-002 — Audience importance and phased execution

- **Date:** 2026-07-29
- **Status:** CONFIRMED
- **Decision:** Healthcare workers, patients, and caregivers are equally important at the brand and information-architecture level, while product development proceeds in focused phases.
- **Rationale:** The brand must intentionally serve all audiences without diluting execution across several incomplete experiences.
- **Evidence:** Explicit founder direction recorded in project context.
- **Consequences:** Navigation should represent all audiences; delivery should prioritize one complete flagship before broad parallel expansion.
- **Revisit trigger:** User evidence shows the audience model is confusing or a different sequence produces materially higher mission and business value.
- **Supersedes:** None.

### CAF-D-003 — User value before monetization

- **Date:** 2026-07-30
- **Status:** CONFIRMED
- **Decision:** Monetization must follow useful interpretation and decision support, not precede or distort it.
- **Rationale:** Trust is the primary asset; ethical revenue can improve sustainability only when the user receives independent value first.
- **Evidence:** Repository mission, founder business rules, and multi-role operating policy.
- **Consequences:** Affiliate, advertising, email, premium, and sponsorship actions require neutral alternatives, disclosures, and complete upstream guidance.
- **Revisit trigger:** Never for the principle; implementation details may change with evidence.
- **Supersedes:** None.

### CAF-D-004 — Mandatory multi-role review

- **Date:** 2026-07-30
- **Status:** CONFIRMED
- **Decision:** A founder prompt defines the immediate assignment but may not limit the total evaluation scope; substantial work requires the registered role quorum.
- **Rationale:** Broad and narrow prompts can anchor work on one objective and hide product, business, technical, user, or risk implications.
- **Evidence:** PR #229 and explicit founder instruction.
- **Consequences:** Every required role returns `PASS`, `WARN`, `BLOCK`, or `NOT IMPLICATED`; silence is not approval.
- **Revisit trigger:** The system creates measurable friction without preventing blind spots, in which case role participation may be refined but not silently removed.
- **Supersedes:** Informal single-lens site reviews.

### CAF-D-005 — Decision architecture for high-intent journeys

- **Date:** 2026-07-30
- **Status:** PROVISIONAL
- **Decision:** High-intent calculators and tools should be evaluated as decision journeys that can include interpretation, recommended actions, cautions, saved or printable output, value-aligned lead capture, and appropriate commercial resources.
- **Rationale:** A raw result followed by an external government link may leave both user value and sustainable revenue unrealized.
- **Evidence:** External critique, subsequent multi-role analysis, and founder concern about the missed opportunity.
- **Consequences:** Future reviews must inspect high-intent dead ends and prioritize completing the decision before adding monetization.
- **Revisit trigger:** Actual user behavior, conversion quality, trust signals, or compliance review shows a different sequence performs better.
- **Supersedes:** Calculator-result-only assumptions.

### CAF-D-006 — Repository-native compounding memory

- **Date:** 2026-07-30
- **Status:** CONFIRMED
- **Decision:** Stable project context, decisions, evidence provenance, work outcomes, and process lessons must be stored in version-controlled repository artifacts and validated automatically.
- **Rationale:** Chat context is incomplete, transient, and unsuitable as the sole operating memory for consequential product work.
- **Evidence:** Explicit founder instruction to compound from current work and improve future efficiency.
- **Consequences:** Material assignments must read and update the project context, ledgers, work packet, role registry, and compounding controls.
- **Revisit trigger:** A more reliable authoritative knowledge system replaces the repository artifacts and provides equivalent version history, access, validation, and agent readability.
- **Supersedes:** Dependence on prior conversation summaries.

### CAF-D-007 — Typed Decision Outcome pilot

- **Date:** 2026-07-31
- **Status:** EXPERIMENT
- **Decision:** High-intent tools may adopt a typed Decision Outcome contract that keeps pure calculation, deterministic recommendation, verification, portable output, analytics, and optional commercial eligibility as separate layers. The Private Student Loan Payoff Calculator is the first complete pilot.
- **Rationale:** The prior calculator ended at reactive numbers and could hide a worse refinance quote as `$0 saved`. A reusable contract prevents future tools from terminating without interpretation, caution, a prioritized action, verification, and a neutral path.
- **Evidence:** Founder assignment; current `main` and production inspection; pure-function and browser validation in the pilot pull request; CAF-E-003.
- **Consequences:** The private-loan recommendation engine cannot import partner configuration; federal, mixed, and uncertain debt fails into verification; My Plan stores only a fixed action; typed financial assumptions remain local, user-controlled copy/print data; portable output must preserve those assumptions; `Accelerate repayment` requires measurable modeled time and interest benefit; a quote must be payoff-safe before it can influence a recommendation; partner activation requires verified, current, disclosed configuration.
- **Revisit trigger:** User testing shows the outcome layer overwhelms or confuses users; valid-result completion materially falls; federal/mixed/uncertain commercial exposure is nonzero; recommendation error is found; official sources change; or a second tool cannot adopt the contract without calculator-specific duplication.
- **Supersedes:** None. Implements and tests CAF-D-005 as a bounded pilot.

### CAF-D-008 — Executive decision controls and inherited-policy challenge

- **Date:** 2026-07-31
- **Status:** CONFIRMED
- **Decision:** Every material assignment must apply an executive accountability overlay, challenge inherited policies and registries, quantify before-and-after consequences with numerator and denominator, escalate anomalous outcomes, and make separate technical and business validation decisions before completion.
- **Rationale:** The prior role quorum and governance system correctly preserved broad disciplinary coverage but still allowed a technically functioning five-page AdSense whitelist to pass without an economic-sanity check. Repeated editorial work was lost because one incomplete registry was treated as the full record, and later reviews inherited the restriction as a trusted baseline.
- **Evidence:** Explicit founder direction in the July 31, 2026 executive-system discussion; current repository review of `AGENTS.md`, `ROLE_QUORUM.md`, `MASTER_WORK_PROMPT.md`, the July 31 multi-role audit, and the AdSense remediation chronology.
- **Consequences:** Future work must record accountable strategy, operations, finance, revenue, product, technology, data, discovery, editorial, healthcare-user, risk, accessibility, quality, red-team, and process-improvement dispositions. A passing test cannot establish that a policy is economically or strategically correct. Sitewide and portfolio decisions require quantified consequences and anomaly review. Absence from one registry cannot be treated as proof that prior work was absent.
- **Revisit trigger:** A material decision still passes without quantified business consequences, a future founder must catch a cross-functional anomaly the system should have detected, executive controls create disproportionate friction without preventing misses, or a more reliable automated decision-quality system replaces these controls.
- **Supersedes:** No prior confirmed principle. It hardens CAF-D-004 and CAF-D-006 after a documented failure of execution fidelity.

### CAF-D-009 — Complete route-level publisher-content disposition

- **Date:** 2026-07-31
- **Status:** CONFIRMED
- **Decision:** Every published article must have exactly one durable publisher-content disposition. The current reviewed portfolio makes 39 of 71 articles ad-eligible and keeps 32 reviewed articles intentionally ad-free; all non-article, interactive, private, sensitive, unknown, and future-unclassified routes remain ad-free by default.
- **Rationale:** The inherited five-route whitelist represented only 5 of 160 indexable routes and 5 of 71 articles. It was a technically functioning precaution, not a complete editorial record or economically coherent permanent inventory. A complete ledger preserves prior review work while allowing selective monetization without broad route prefixes.
- **Evidence:** Founder authorization; official Google AdSense documentation on whole-site review, code placement, page exclusions, and excluded areas; `src/data/publisherArticleReviews.ts`; publication-quality checks; route-aware AdSense tests; and the quantified executive work packet.
- **Consequences:** All 71 published articles receive explicit review provenance and a revisit date. Ad-eligible inventory rises from 5 to 39 routes while 121 of 160 canonical routes remain ad-free. Medicare, Medicaid, medication safety, discharge, clinical recovery, prior authorization, financial assistance, tools, forms, results, hubs, directories, topic guides, legal/trust pages, private routes, and unknown routes remain excluded. Missing or duplicate article dispositions fail governance.
- **Revisit trigger:** 2027-01-31; material article revisions; Google policy or account-status change; meaningful placement, traffic, revenue, accessibility, or user-trust evidence; or a quality failure on an eligible article.
- **Supersedes:** The July 29 five-route implementation as the complete publisher inventory. It preserves the fail-closed and sensitive-context principles established by that remediation.

### CAF-D-010 — Bounded first-party evidence before broader growth changes

- **Date:** 2026-07-31
- **Status:** EXPERIMENT
- **Decision:** Use a consent-gated, first-party evidence store for one bounded surface—the `/insurance` hub—before making another broad content, retention, landing-page, or monetization change. The initial contract contains one view denominator, one handoff numerator, fixed destination identifiers, and no arbitrary event properties.
- **Rationale:** The connected operating dashboard records only 8 organic clicks in its latest 28-day scorecard and leaves nearly every downstream behavioral denominator unverified. Existing Vercel and Google Analytics code proves event emission logic but does not provide a connected, queryable decision record. A sitewide event warehouse would exceed the evidence need and increase privacy and maintenance risk.
- **Evidence:** Current production and repository inspection; dated Search Console snapshot showing `/insurance` at 18 impressions, 0 clicks, and average position 11.28 through 2026-07-20; blank downstream funnel fields in the connected Growth & Revenue dashboard; Supabase schema inspection confirming no behavioral evidence table; official Supabase guidance requiring explicit table privileges in addition to RLS and keeping service credentials server-side; work packet `2026-07-31-evidence-led-insurance-handoff.md`.
- **Consequences:** The site may store random event and browser-session UUIDs, one of two fixed event names, the fixed `insurance_hub` surface, an approved destination ID, a fixed variant, and a server timestamp only after analytics consent. The table has forced RLS, no public/anonymous/authenticated privileges or policies, and server-only service-role access. No form answers, financial amounts, health or insurance details, account identifiers, URLs, query strings, referrers, IP addresses, user agents, or device fingerprints are intentionally stored. No visual, SEO, AdSense, Stripe, checkout, or email-campaign change is included.
- **Revisit trigger:** First 28 days after production release; at least 10 consented insurance-hub sessions; any privacy or security defect; endpoint abuse or material runtime cost; evidence that consented volume is too sparse for useful learning; or a decision to expand the contract to another surface.
- **Supersedes:** The implicit assumption that existing third-party event emission alone provides sufficient decision-grade product evidence. It does not supersede the existing consent and sanitization rules.



### CAF-D-011 — Structured global service navigation

- **Date:** 2026-07-31
- **Status:** SUPERSEDED IN PART by CAF-D-013
- **Decision:** Preserve the six broad primary destinations while replacing the generic `More` overflow and fourteen-link flat mobile sheet with one typed `Explore CAF` service-navigation system: four outcome-led groups on desktop and mobile, three direct mobile actions, concrete service names, concise outcome descriptions, and two fixed consent-gated evidence events.
- **Rationale:** The July broad-audience navigation correctly simplified the primary layer, but its secondary overflow became inadequate as CAF accumulated 34 tools, guided decision systems, and audience-specific resources. A grouped service layer improves discoverability without undoing the primary hierarchy, deleting routes, or building another router.
- **Evidence:** Founder observation; current header, footer, tool, route, production, Notion, Linear, and Drive review; benchmark synthesis; PR #237; exact-head CI `30676794553`; browser certification `30676794548`; Decision Journey `30676794615`; production deployment `dpl_9K3StXWYyBXg5gnCTe5kkqPui1ZY`; direct Supabase migration, role, constraint, cleanup, and advisor verification.
- **Consequences:** Six primary destinations remain unchanged; eight generic overflow links become zero; four structured groups are introduced; the initial mobile choice set changes from fourteen flat links to three direct actions plus four disclosures; nine concrete high-value services become globally named; all 160 sitemap routes, 34 tools, 71 articles, 39 ad-eligible articles, and 21 footer links remain unchanged. Navigation evidence stores only random UUIDs, fixed events, fixed surfaces, allowlisted destination IDs, a fixed variant, and server time after analytics consent.
- **Revisit trigger:** Twenty-eight days after production release; at least 25 distinct consented navigation-open sessions; accessibility, performance, mobile, privacy, or route regression; persistently high open-without-selection behavior at adequate volume; reduced discovery of high-value destinations; or direct user evidence that the grouping is confusing.
- **Supersedes:** Only the generic secondary-overflow and flat-mobile portions of the July 2026 broad-audience navigation implementation. The six primary destinations and broad-audience principle remain confirmed.

### CAF-D-013 — One guided entry and progressive local continuity

- **Date:** 2026-08-02
- **Status:** EXPERIMENT
- **Decision:** Use Start Here as CAF's single full guided-routing experience, keep Tools as the direct searchable directory, reduce desktop primary destinations from six to five, remove repeated router/directory placements, and show browser-local saved work only through a small optional trigger and accessible dialog when state exists.
- **Rationale:** Rendering full routers on Home, Tools, and Start Here blurred responsibility between guided and direct-browse intents. A large automatic saved-work block also gave returning-state continuity more visual priority than the current page task.
- **Evidence:** Current repository and production reconciliation; direct component inventory; 160-route search-readiness audit; 580-test suite; work packet `2026-08-02-navigation-simplification-progressive-resume.md`; Linear AND-103.
- **Consequences:** Full guided routers fall from three visible placements to one; direct primary links fall from six to five; Explore destinations fall from seventeen to sixteen by removing one duplicate router; mobile disclosures fall from four to three after priority-action deduplication. All 160 canonical routes, existing local storage schemas, grouped Explore navigation, and fixed analytics contracts remain. First-time visitors see no continuity prompt; returning visitors can Resume or deliberately Remove local work.
- **Revisit trigger:** Twenty-eight days after release; adequate navigation evidence; direct usability evidence; a saved-progress recovery/removal defect; accessibility or route regression; or evidence that direct discovery materially declined.
- **Supersedes:** CAF-D-011 only where it preserved six primary destinations and repeated the guided router in Explore/mobile. It preserves CAF-D-011's grouped service model, broad audiences, destinations, evidence boundaries, and caution against interpreting sparse consented data.


### CAF-D-012 — Bounded patient cost-share Decision Outcome

- **Date:** 2026-08-01
- **Status:** EXPERIMENT
- **Decision:** Extend the typed Decision Outcome architecture to the existing patient visit-cost route, but only for explicitly selected service rules. Unknown or unsupported rules omit the patient-cost estimate, and the out-of-pocket cap is applied only when covered in-network status is confirmed.
- **Rationale:** The supplied Search Console export showed 192 combined impressions and zero clicks across the cost-sharing explainer and calculator, while the prior calculator could automatically add copay and coinsurance despite plan-specific sequencing. The stronger 403(b) opportunity had already been implemented, making this the highest-leverage unfinished exposed journey.
- **Evidence:** Founder-provided Search Console export dated 2026-08-01; current repository and PR #243 reconciliation; official HealthCare.gov definitions for deductible, copayment, coinsurance, allowed amount, and out-of-pocket maximum; CMS Summary of Benefits and Coverage guidance; PR #247 calculation, accessibility, performance, and browser evidence.
- **Consequences:** The canonical route remains stable; users must identify the service-specific rule and network/coverage status; unsupported structures fail into verification; billed charge is distinguished from allowed amount; copy and print preserve assumptions and cautions; no affiliate, account, backend, PHI, or financial telemetry is introduced.
- **Revisit trigger:** Any calculation discrepancy; user evidence that the flow is confusing; meaningful post-release search/completion data; official-source change; or source review by 2027-02-01.
- **Supersedes:** The prior reactive visit-cost arithmetic implementation on the same route. It applies CAF-D-007 and does not supersede the user-value-before-monetization principle.

### CAF-D-014 — Directional action ownership and bounded CTA hierarchy

- **Date:** 2026-08-03
- **Status:** EXPERIMENT
- **Decision:** Every material route must have one named action owner. Layout may render at most one global endcap, and purpose-built directional surfaces may render one primary, at most one secondary, and subordinate related actions. Pilot the hierarchy on 14 dynamic tool routes, the total-compensation route, and three high-value article handoffs; defer the remaining article-specific audit rather than bulk-changing the 71-article template.
- **Rationale:** Four independently composed global systems stacked two or more endcaps on 14 routes, while generic tool and article actions obscured the next outcome. A full article migration would affect 71 of 160 canonical routes (44.4%) without sufficient behavior evidence.
- **Evidence:** Production/code inspection; complete 160-route inventory; independent product, governance, and engineering reviews; AND-104; work packet `2026-08-03-directional-cta-decision-paths.md`.
- **Consequences:** Thirty of 160 canonical routes receive a bounded hierarchy correction; stacked global endcaps fall from 14 routes to zero; all routes, canonicals, indexability, 39 ad-eligible articles, Decision Outcomes, Supabase schema, Stripe/checkout, premium state, and navigation CAF-D-013 remain unchanged. Ordinary directional actions use one consent-gated fixed event with no inputs, results, free text, or device fingerprint fields.
- **Revisit trigger:** Twenty-eight days; adequate consented completion evidence; direct usability feedback; lower completion or increased backtracking; any accessibility, search, analytics, route, or truthfulness defect; or a proposal to migrate the remaining articles.
- **Supersedes:** Independent global endcap composition and generic `Open the tool` primary labels. It does not supersede specialized result events, the active insurance/service-navigation evidence contracts, or typed Decision Outcomes.

### CAF-D-015 — Source-governed hospital-assistance flagship

- **Date:** 2026-08-06
- **Status:** CONFIRMED
- **Decision:** Make Hospital Financial Assistance & Medical Bill Relief the first search-demand flagship: preserve the indexed `/tools/financial-assistance-checklist` route, add one national hub, one complete North Carolina hub, and only reviewed system pages with official sources and meaningful unique policy data. Keep the launch browser-temporary, avoid PHI, and never state that a user qualifies.
- **Rationale:** The user job is consequential and action-oriented, the existing medical-bill ecosystem provides reusable adjacent workflows, an earlier Search Console baseline showed the existing resource at 10 impressions and average position 4.8, and source availability supports a high-quality bounded launch set. A mass directory or second finder URL would create thin content and maintenance risk.
- **Evidence:** Current main/production and route inventory; settled Search Console exports reconciled 2026-07-29; HHS/ASPE 2026 poverty guidelines; IRS Section 501(r); current NCDHHS program; official hospital/system policies and applications; Product 1 tests/build; `docs/work-packets/2026-08-06-search-demand-product-buildout.md`.
- **Consequences:** Eighteen policy records and 20 new canonical hub/policy routes enter the maintained product system; one finder alias permanently redirects to the existing tool route; missing terms remain missing; Product 2–6 shells are not published; no Supabase migration, upload, payment, or account state is added.
- **Revisit trigger:** Any policy/source/calculation/privacy defect; January 2027 annual review; 30/60/90-day search and product evidence; a hospital merger or source change; or evidence that a new state can meet the same source and maintenance standard.
- **Supersedes:** The earlier checklist-level implementation at the same canonical tool route. It does not supersede the broader Medical Bill Response System or distinct supporting articles/tools.

### CAF-D-016 — Independent Medicare decision organization on a reusable product platform

- **Date:** 2026-08-09
- **Status:** CONFIRMED
- **Decision:** Make the Medicare Coverage Decision System CAF's coordinating Medicare product layer: preserve the existing search and education routes, put Original Medicare and Medicare Advantage at the first major architecture fork, require official provider/drug/cost/Medigap verification before a conclusion, and keep CAF outside plan sales, enrollment, insurer ranking, compensation, and lead transfer. Generalize the existing premium platform through server-authoritative product and workspace registries so every purchase, grant, failure, refund, and saved workspace stays product-specific.
- **Rationale:** CAF already had substantial Medicare education and a hardened single-product premium foundation. Another guide would duplicate value; Medicare Advantage-first logic or plan-specific commercial conduct would weaken trust and increase regulatory risk; one-off payment and workspace stacks would create cross-product security risk.
- **Evidence:** Current main/production and route inventory; Medicare.gov, CMS, Social Security, Medicaid.gov, SHIP, and eCFR sources verified August 9, 2026; direct live Supabase schema/RLS inspection and rolled-back two-user cross-product matrix; deterministic personas and commerce isolation tests; work packet `2026-08-09-medicare-coverage-decision-system.md`.
- **Consequences:** The complete safety sequence remains free and browser-local. The planned one-time paid value is authenticated persistence and organization only. Provider names, medication names, diagnoses, beneficiary identifiers, notes, and document uploads are excluded from v1. Live payments remain fail-closed until an authorized Stripe test chain and every founder/legal/support/privacy/accessibility gate pass.
- **Revisit trigger:** Medicare/CMS marketing-rule change; evidence of insurer or broker relationship; request for plan-specific ranking, lead transfer, enrollment, document or medication-name intake; annual 2027 update; privacy/accessibility defect; or authorized Stripe test evidence.
- **Supersedes:** Single-product assumptions in the premium foundation. It does not supersede the existing Benefits Decision System or any preserved Medicare search-entry route.

### CAF-D-017 — Query product outcomes before expanding flagship surface area

- **Date:** 2026-08-10
- **Status:** EXPERIMENT
- **Decision:** Preserve existing third-party analytics and bounded navigation experiments, while mirroring only CAF's strict allowlisted `trackJourneyEvent` lifecycle into a separate consent-gated, service-role-only first-party table. Add explicit view/start/result coverage to the 403(b), total-compensation, Benefits, Hospital Financial Assistance, and Medicare flagships before building another major standalone system.
- **Rationale:** Current Search Console evidence identifies promising healthcare-worker and patient-cost entry pages, but it cannot show whether users complete the products. Connected first-party evidence contained only 12 navigation/offer rows and no flagship result denominator. CAF already has enough product surface; the economically important unknown is which systems produce meaningful completion and portable outputs.
- **Evidence:** August 10 GSC export; current production/main/Vercel reconciliation; direct `growth_events` inspection; July 21 strategy research; official Supabase RLS/API security guidance; `docs/work-packets/2026-08-10-first-party-journey-evidence.md`.
- **Consequences:** At least 11 known fixed journeys become eligible for queryable lifecycle evidence; five priority flagships gain view/start/result coverage; no answers, values, URLs, routes, claims, calculations, pricing, payment, entitlement, advertising, or visible workflow changes. Consented evidence is nonrepresentative and cannot establish satisfaction or causality.
- **Revisit trigger:** 2026-09-07; at least 25 consented view sessions for a journey; privacy/security/runtime defect; endpoint abuse or material cost; or adequate connected analytics that makes the first-party mirror redundant.
- **Supersedes:** CAF-D-010 only where it treated `/insurance` as the sole first-party evidence surface. It preserves D-010's consent, strict keys, least privilege, minimum-sample, and non-causal interpretation rules.

### CAF-D-018 — Convert qualified 403(b) search entries before expanding product surface

- **Date:** 2026-08-10
- **Status:** EXPERIMENT
- **Decision:** Preserve the released 403(b) calculator, article content, search metadata, and answer-free lifecycle evidence. Give the hospital-match and nurse-contribution articles one intent-specific calculator action in the hero, make the calculator the primary final action on both pages, and remove their redundant mid-article tool promos. Do not build another product or activate paid value from this evidence.
- **Rationale:** These two articles are CAF's strongest current qualified search cluster at 3 clicks/147 impressions and average positions 8.15 and 6.04. Production exposed no calculator action in either hero, and the nurse page's first calculator link was roughly 2,926 CSS pixels below the initial inspected desktop viewport. The existing tool already produces a typed Decision Outcome and consent-gated view/start/result/action evidence, so reducing entry friction compounds released work at low risk.
- **Evidence:** August 10 GSC export and CAF-E-012; direct production/main/Vercel/Supabase/browser reconciliation; `docs/work-packets/2026-08-10-403b-search-to-decision-loop.md`; 128 test files/723 tests; 182-route build and search-readiness gates.
- **Consequences:** Two of 182 routes change; hero tool actions move from 0/2 to 2/2, redundant mid-article calculator promos from 2/2 to 0/2, and direct calculator end states from 1/2 to 2/2. All 182 indexable routes, 39 ad-eligible routes, claims, calculations, sources, analytics schemas, answers, pricing, payments, and entitlements remain unchanged. Business impact remains unknown until organic evidence exists.
- **Revisit trigger:** 2026-09-07 or 25 consented 403(b) tool views, whichever is later; any search, accessibility, privacy, runtime, or result-quality defect; or direct evidence that the calculator is not the right next action.
- **Supersedes:** No prior strategic decision. It applies CAF-D-017's evidence system to one concrete acquisition-to-result loop while preserving D-017's minimum-sample and non-causal interpretation rules.

## Updating the ledger

- Add a new entry for every material decision.
- Do not rewrite history when a decision changes; mark the old entry `SUPERSEDED` and link the replacement.
- Do not label a model recommendation `CONFIRMED` without founder confirmation or an established operating policy.
- Keep implementation details in the work ledger unless they establish a durable rule.
- Record uncertainty and revisit triggers explicitly.
