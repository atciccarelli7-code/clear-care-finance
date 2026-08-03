# Directional CTA decision paths — 2026-08-03

## 1. Assignment charter

- **Request:** turn important CAF pages into clear directions rather than generic promotion, inventory the full site, implement a reusable hierarchy, instrument it safely, validate, release, and record the result.
- **Outcome:** one route-level endcap owner, one primary and at most one secondary directional action, outcome-specific tool entry labels, and a ranked route backlog.
- **Audiences:** healthcare workers, patients, caregivers, and general readers.
- **Success metrics:** valid tool entry, meaningful next-step selection, tool completion where already available, no stacked endcaps, no sensitive analytics fields, and no route/SEO/accessibility regression.
- **Constraints:** preserve CAF-D-013 navigation, typed Decision Outcomes, 160 canonical routes, 39 ad-eligible articles, free-product truthfulness, privacy consent, and disabled commerce.
- **Non-goals:** no broad redesign, content rewrite, new route, Supabase schema, Stripe/checkout, premium, affiliate, email, or advertising change.
- **Risk:** moderate and reversible.

## 2. Current-state evidence

| Area | Direct evidence | Date | Limitation |
|---|---|---|---|
| Production | Home and representative hub, article, and tool routes inspected; current production matched merged PR #248. | 2026-08-03 | Heuristic inspection, not direct usability research. |
| GitHub/main | `dfc77679920fb6b8a247e45100e6673e3739356e`; PR #248 merged. | 2026-08-03 | New release evidence pending. |
| Vercel | Production `dpl_3EAKBmDWbM9cqyzqdNuQs9BVCc33` READY; no grouped 24-hour runtime errors reported. | 2026-08-03 | Preview and new-head runtime pending. |
| Supabase | CAF project healthy; bounded evidence schema already exists. | 2026-08-03 | No schema or row change authorized or needed. |
| Stripe | Commerce hard-disabled; premium products private-ready only. | 2026-08-03 | No purchase CTA is truthful. |
| Search/analytics | Dashboard reports 8 organic clicks; route snapshot ends 2026-07-20; downstream CTA/tool fields are mostly blank. | 2026-08-03 | Too sparse/stale for causal or “high traffic” claims. |
| Notion/Linear/Drive | Control records and AND-103 confirm PR #248 release; repo/Drive closeout was stale. AND-104 controls this sprint. | 2026-08-03 | Drive snapshot needs supersession after release. |

## 3. Evidence classification

| Claim | Class | Source | Limitation |
|---|---|---|---|
| CTA systems stack on 14 routes | Verified fact | Route-config inventory | Says nothing about user comprehension. |
| 14 generic tools say `Open the tool` | Verified fact | `tools.ts` + `ToolPage.tsx` | Does not prove poor conversion. |
| Clearer hierarchy should reduce decision burden | Supported inference | Production/code review and user-context heuristics | Requires later behavior/usability evidence. |
| CTA clicks will improve | Unresolved | No reliable baseline | Raw clicks could rise while completion falls. |
| Checkout should remain disabled | Verified boundary | Stripe/config/release records | Separate commercial release required. |

## 4. Context and decision memory

- Active decisions: CAF-D-003, D-005, D-006, D-008, D-009, D-010, D-011, D-012, D-013.
- CAF-D-013 controls navigation: Start Here remains the sole router and Tools remains direct browse.
- CAF-D-005/007/012 protect completed Decision Outcome result hierarchy.
- Active AND-102 branch reuses D-013/E-008/W-010 and is based before PR #248. AND-104 records a rebase/renumber blocker; this sprint uses D-014/E-009/W-011 and avoids its files.
- Repository closeout for PR #248 was reconciled with final Linear/Notion evidence.

## 5. Inherited-decision challenge gate

| Item | Status | Present impact | Challenge and disposition |
|---|---|---:|---|
| Start Here is sole router | Experiment | 1 guided entry | Preserve; CTA work must not recreate routing on Home or Tools. |
| Four independent global endcaps | Merely implemented | 37 routes have at least one; 14 have 2+ | Replace composition-by-accumulation with explicit precedence. |
| Equal article next-step cards | Merely implemented | 71 articles | Change only three priority articles; defer 65 article-specific audits rather than trigger a 44.4% template anomaly. |
| Bounded first-party evidence | Experiment | `/insurance` only | Reuse third-party consented analytics; no Supabase expansion. |
| Disabled commerce | Confirmed boundary | 0 purchasable products | Preserve truthful free destinations. |

## 6. Capability plan

| Need | Authority | Write/risk |
|---|---|---|
| Code, tests, ledgers | Repository/GitHub | Branch and PR only |
| Preview/production | Vercel Git deployment | Release gated |
| Issue/control | Linear AND-104 | Status/comments |
| Release memory | Notion + repository | After verified release |
| Dashboard/snapshot | Google Drive | Update/supersede only after final evidence |
| Database/payment | Supabase/Stripe | Read-only; no change |

## 7. Independent role matrix

| Role | Status | Material finding / acceptance |
|---|---|---|
| Orchestrator | PASS | Bounded implementation and release path. |
| Context steward | WARN | AND-102 collision recorded; stale PR #248 repo closeout corrected. |
| Capability router | PASS | No unnecessary data/payment mutation. |
| Executive strategy | PASS | Clearer decision ownership without new products. |
| Product management | PASS | Highest-value defects selected; backlog explicit. |
| Healthcare user research | WARN | Decision-burden inference lacks direct testing. |
| Information architecture | PASS after resolver | One global endcap owner required. |
| UX/design system | PASS after hierarchy | One primary, max one secondary, quiet related links. |
| Content/evidence integrity | PASS | Labels name available outcomes without benefit/eligibility promises. |
| Frontend engineering | PASS after tests | Shared button/link and next-action primitives. |
| Systems architecture | PASS | Route owner resolver replaces independent composition. |
| Backend/data/security | NOT IMPLICATED | No API, database, auth, or payment change. |
| Platform/DevOps | WARN pending release | Exact-head preview and production required. |
| SEO/discovery | PASS | Routes, canonicals, legacy anchors, and inventory unchanged. |
| Monetization/CRO | WARN | No revenue claim or commercial activation. |
| Analytics/experimentation | PASS with warning | Fixed consented event; completion outranks clicks. |
| Accessibility/reliability | WARN pending browser | Keyboard, axe, narrow screen, overflow required. |
| Privacy/legal/protection | PASS | No inputs, results, device fingerprint, or free text. |
| Publishing/governance | PASS after records | D-014/E-009/W-011 and 160-row inventory required. |
| Quality/release | WARN pending gates | Full suite, browser, preview, exact-head, production. |
| Adversarial red team | PASS | Raw CTA-click lift rejected as sufficient success. |
| Process improvement | PASS | Build-time CTA contract and route inventory generator. |

## 8. Executive accountability matrix

| Perspective | Status | Consequence |
|---|---|---|
| CEO/strategy | PASS | Strengthens existing journeys rather than expanding portfolio. |
| COO | PASS | One owner resolver reduces operating ambiguity. |
| CFO/CRO | WARN | No near-term revenue claim; completion evidence needed. |
| CPO/CTO | PASS | Reusable typed hierarchy with bounded 18.8% route scope. |
| Data/analytics | PASS with warning | Fixed metadata only; no causality claim. |
| Discovery/editorial | PASS | 160 indexable and 39 ad-eligible dispositions unchanged. |
| Healthcare context | WARN | Direct comprehension evidence unavailable. |
| Privacy/legal | PASS | Existing consent and sanitizer retained; contract is stricter. |
| Accessibility/reliability | WARN pending browser | Real browser certification is a gate. |
| Quality/release | WARN pending release | No merge before exact-head and preview checks. |
| Red team/process | PASS | Template-wide 44.4% change rejected for a 3-article pilot. |

## 9. Anti-blindness findings

- The prompt emphasized CTA copy; the larger defect was four independently appended endcap systems.
- The strongest counterargument is that traffic and usability evidence are too sparse to make CTA wording the growth bottleneck.
- The weakest assumption is that the first related tool is always the best next action.
- A CTA-click rate can improve while users loop through pages or complete fewer decisions.
- Completion, backtracking, direct feedback, or adequate consented journey evidence could reverse action ordering.

## 10. Quantified before-and-after impact

| Measure | Before | After | Change |
|---|---:|---:|---:|
| Canonical routes inventoried | 0/160 | 160/160 | +160 |
| Routes changed | 0/160 | 30/160 (18.8%) | +30 |
| Routes with 2+ global endcaps | 14/160 | 0/160 | -14 |
| Generic tool outcome labels | 0/14 | 14/14 | +14 |
| Priority article handoffs | 0/3 | 3/3 | +3 |
| Indexable routes | 160 | 160 | 0 |
| Ad-eligible articles | 39/71 | 39/71 | 0 |
| Purchasable product journeys | 0 | 0 | 0 |

- **Measurement:** `directional_cta_clicked` includes fixed CTA ID, origin, destination, audience, action tier, decision category, and placement only.
- **Rollback:** revert one release commit; no migration, data cleanup, payment, route, or environment reversal.

## 11. Anomaly gate

- [x] Could have changed more than 20% of articles if the shared article template were migrated (71/160 site routes; 44.4%).
- [ ] Selected release changes more than 20% of canonical routes (30/160; 18.8%).
- [ ] Reduces indexable, ad-eligible, commercial, or usable inventory.
- Mitigation: three article pilot, complete route inventory, direct canonical destinations, static link/search checks, and reversible owner resolver.

## 12. Candidate ranking

| Candidate | Value | Confidence | Effort | Risk | Decision |
|---|---:|---:|---:|---:|---|
| Add another sitewide CTA panel | 2 | 2 | 3 | 9 | Reject |
| Migrate all 71 articles | 7 | 3 | 7 | 8 | Defer |
| Owner resolver + tools + 3 articles + compensation | 9 | 7 | 6 | 4 | Select |
| Copy-only changes | 4 | 4 | 3 | 5 | Reject as incomplete |

## 13. Integrated decision

Release a typed directional action contract, lightweight tracked action primitive, hierarchical next-action panel, and route endcap resolver. Use it on the 14 dynamic tools, total-compensation route, and three article handoffs. Preserve all current specialized journey/result events and do not double-emit. Reassess ordering after 28 days or adequate consented completion evidence.

## 14. Separate validation dispositions

- **Technical:** 104 test files / 593 tests, TypeScript, lint with zero errors, governance/content/privacy/SEO checks, production build, bundle budget, 160-route prerender, and search readiness pass. Browser/preview/production remain pending.
- **Business:** PASS WITH MEASUREMENT WARNING. The implementation corrects a verified hierarchy defect; it does not establish conversion, satisfaction, or revenue improvement.

## 15. Implementation slices

| Slice | Acceptance |
|---|---|
| Typed CTA event/action | Strict enums/IDs/availability; one event; no sensitive fields. |
| Shared renderers | One primary, max one secondary, subordinate related links. |
| Endcap ownership | At most one global owner; page-owned priority handoffs suppress globals. |
| Priority routes | 14 tools, total compensation, EOB, cost sharing, 403(b). |
| Inventory/governance | 160 CSV rows, generator, D/E/W records, naming rules. |

## 16. Release gates

- [x] Inherited-decision and route-impact review complete.
- [x] Focused contract, type, lint, and component tests pass.
- [x] Full unit/governance/build suite passes.
- [ ] Mobile/tablet/desktop, keyboard, axe, overflow, and anchor behavior pass.
- [ ] Exact-head PR and Vercel preview pass.
- [ ] Production smoke and runtime health pass.
- [ ] Linear, Notion, Drive, and ledgers reflect verified release.

## 17. Release and rollback

- Branch: `agent/directional-cta-decision-paths`.
- Linear: AND-104.
- PR, preview, merge SHA, production deployment, and check IDs: pending.
- Rollback: revert the release commit; no data migration or user-state conversion.

## 18. Compounding closeout

- Decision: CAF-D-014.
- Evidence: CAF-E-009.
- Work: CAF-W-011.
- Reusable assets: strict CTA contract, action primitive, next-action hierarchy, route owner resolver, 160-route inventory generator, and regression tests.
- Backlog: 65 non-priority articles receive ranked article-specific handoff review; no generic bulk migration without evidence.
