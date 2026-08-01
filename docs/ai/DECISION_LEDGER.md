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
- **Status:** EXPERIMENT
- **Decision:** Preserve the six broad primary destinations while replacing the generic `More` overflow and fourteen-link flat mobile sheet with one typed `Explore CAF` service-navigation system: four outcome-led groups on desktop and mobile, three direct mobile actions, concrete service names, concise outcome descriptions, and two fixed consent-gated evidence events.
- **Rationale:** The July broad-audience navigation correctly simplified the primary layer, but its secondary overflow became inadequate as CAF accumulated 34 tools, guided decision systems, and audience-specific resources. A grouped service layer improves discoverability without undoing the primary hierarchy, deleting routes, or building another router.
- **Evidence:** Founder observation; current header, footer, tool, route, production, Notion, Linear, and Drive review; benchmark synthesis; PR #237; exact-head CI `30676794553`; browser certification `30676794548`; Decision Journey `30676794615`; production deployment `dpl_9K3StXWYyBXg5gnCTe5kkqPui1ZY`; direct Supabase migration, role, constraint, cleanup, and advisor verification.
- **Consequences:** Six primary destinations remain unchanged; eight generic overflow links become zero; four structured groups are introduced; the initial mobile choice set changes from fourteen flat links to three direct actions plus four disclosures; nine concrete high-value services become globally named; all 160 sitemap routes, 34 tools, 71 articles, 39 ad-eligible articles, and 21 footer links remain unchanged. Navigation evidence stores only random UUIDs, fixed events, fixed surfaces, allowlisted destination IDs, a fixed variant, and server time after analytics consent.
- **Revisit trigger:** Twenty-eight days after production release; at least 25 distinct consented navigation-open sessions; accessibility, performance, mobile, privacy, or route regression; persistently high open-without-selection behavior at adequate volume; reduced discovery of high-value destinations; or direct user evidence that the grouping is confusing.
- **Supersedes:** Only the generic secondary-overflow and flat-mobile portions of the July 2026 broad-audience navigation implementation. The six primary destinations and broad-audience principle remain confirmed.

## Updating the ledger

- Add a new entry for every material decision.
- Do not rewrite history when a decision changes; mark the old entry `SUPERSEDED` and link the replacement.
- Do not label a model recommendation `CONFIRMED` without founder confirmation or an established operating policy.
- Keep implementation details in the work ledger unless they establish a durable rule.
- Record uncertainty and revisit triggers explicitly.
