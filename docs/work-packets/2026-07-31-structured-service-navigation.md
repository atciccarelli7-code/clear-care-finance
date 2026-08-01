# Community Acquired Finance — Structured Service Navigation Work Packet

## 1. Assignment charter

- **Request:** Replace the generic `More` overflow and flat mobile menu with a structured service-navigation system that exposes completed, high-value decision support.
- **User outcome:** Healthcare workers, patients, caregivers, and general visitors can identify the relevant CAF service without understanding the site's internal content taxonomy.
- **Business outcome:** Improve discovery of completed utility and create bounded evidence about navigation use without activating commerce.
- **Success:** Preserve six primary desktop routes, replace eight unstructured overflow links with four groups, reduce fourteen initial mobile choices to three direct actions plus four disclosures, name at least eight concrete services globally, and preserve every route and indexability disposition.
- **Non-goals:** Homepage rewrite, route removal, visual rebrand, content expansion, AdSense changes, Stripe activation, affiliates, or marketing email.
- **Risk:** Moderate because the header is global, despite the change being reversible and route-preserving.

## 2. Current-state evidence

| Area | Direct evidence | Verified date | Coverage limitation |
|---|---|---|---|
| GitHub | Starting `main` `418d868d23c6c639be84ecb2acbb614f31164ce4`; PR #237 | 2026-07-31 | Final merge SHA remains pending. |
| Production | `communityacquiredfinance.com`; deployment `dpl_C3BUwVV6RBC53fp5p5sjCezuCsf5` READY | 2026-07-31 | Pre-release production only. |
| Header | 6 primary desktop links, 8 `More` links, 14 flat mobile links | 2026-07-31 | Inventory does not by itself prove confusion. |
| Footer | 21 links across Explore, Specialized guides, and Trust | 2026-07-31 | Link count does not establish poor UX. |
| Tools | 34 public tools | 2026-07-31 | Tools differ in value, readiness, and audience. |
| Supabase | `growth_events` has 0 rows and insurance-only constraints before migration | 2026-07-31 | No navigation behavior baseline exists. |
| Analytics | Consent-aware analytics and one bounded first-party evidence system exist | 2026-07-31 | Consented sessions may be sparse and nonrepresentative. |
| Research | Benchmark synthesis, founder observation, current code, Notion, Linear, and Drive brand rules | 2026-07-31 | Benchmark scores are expert heuristic assessments, not usability-lab results. |

## 3. Evidence classification

| Claim | Classification | Support | Limitation |
|---|---|---|---|
| Navigation counts above | Verified fact | Starting header/footer code | Does not prove behavioral failure. |
| Generic overflow is now inadequate | Supported inference | Accumulated service inventory, benchmark comparison, founder observation | Must be tested after release. |
| Four outcome-led groups will improve discovery | Experiment | IA synthesis and bounded implementation | Labels may need revision. |
| No sensitive data are required | Conservative precaution | Fixed event contract and existing privacy policy | Does not prove measurement volume. |
| Benefits Command Center is canonical | Verified fact | Generated and production sitemap | A separate internal helper currently omits it; documented as process debt. |

## 4. Context and decision memory

- Relevant decisions: CAF-D-001, D-002, D-003, D-006, D-008, D-009, and D-010.
- The six-item primary navigation was intentionally introduced in July 2026 to stop mixing audiences, formats, topics, and outcomes.
- That decision remains useful and is preserved. Only the secondary overflow model is revised.
- Existing Decision Concierge, homepage journey, semantic tokens, consent system, evidence endpoint, and footer trust structure are reused.
- Absence from the former `More` list was not treated as proof that a service was absent or incomplete.

## 5. Inherited-decision challenge gate

| Inherited item | Original purpose | Current classification | Present consequence | Challenge | Revisit trigger |
|---|---|---|---|---|---|
| Six primary destinations | Simplify broad positioning | Confirmed and preserved | Six stable broad entries | Do not undo simplification | Evidence favors another primary model |
| Generic `More` | Secondary overflow | Merely implemented | Eight equal-weight mixed links | Label hides outcomes and services | Navigation experiment review |
| Flat mobile sheet | Responsive access | Merely implemented | Fourteen sequential choices | Grouping adds taps but reduces initial scanning | Mobile failure or abandonment |
| Insurance evidence table | Bounded first-party learning | Confirmed for insurance, provisional for expansion | One table, two events, one surface | Avoid building an event warehouse | Privacy, cost, or schema-growth concern |

Passing technical tests never established that the inherited information architecture remained strategically correct.

## 6. Capability plan

| Need | Authority | Use |
|---|---|---|
| Source, tests, PR, ledgers | GitHub | Implement and govern |
| Preview and production | Vercel | Exact-head and runtime validation |
| Evidence constraints | Supabase | Versioned migration and security verification |
| Research/operating record | Notion | Preserve rationale and closeout |
| Active work | Linear AND-99 | Track state and release evidence |
| Brand constraints | Google Drive | Preserve calm, readable, noncommercial style |

## 7. Independent role matrix

| Role | Status before release | Finding / acceptance test |
|---|---|---|
| Strategy | PASS | Compounds completed utility rather than adding disconnected content. |
| Product / IA | PASS | One four-group intervention improves global discovery while preserving primary routes. |
| UX / design system | PASS | Existing semantic system is retained; no parallel visual language. |
| Frontend | PASS | One typed registry drives desktop and mobile. |
| Data / security | WARN | Apply migration only after final code/browser gates and verify effective grants. |
| SEO / discovery | PASS | Routes and sitemap inventory remain unchanged. |
| Analytics | PASS | Two fixed consented events create a bounded numerator and denominator. |
| Accessibility / reliability | WARN | Exact keyboard, 320px, laptop, overflow, axe, and regression evidence required. |
| Privacy / legal | PASS | No URLs, free text, identity, health, insurance, financial, or result values. |
| Quality / release | WARN | All exact-head workflows, migration, preview, PR review, merge, and production smoke must pass. |
| Red team | WARN | The grouped panel must not become a disguised sitemap or overwhelming mega menu. |
| Process improvement | PASS | Typed registry and route/evidence tests reduce future drift. |

## 8. Executive accountability matrix

| Perspective | Status | Finding / consequence |
|---|---|---|
| CEO / strategy | PASS | Supports CAF's decision-support identity and equal audience importance. |
| COO | WARN | GitHub, Vercel, Supabase, Notion, Linear, and measurement records must agree at closeout. |
| CFO | PASS | Bounded reversible work; no paid activation or immediate revenue claim. |
| CRO | PASS | Discovery is measured before conversion or monetization changes. |
| CPO | PASS | Nine concrete services receive global outcome-led visibility. |
| CTO | PASS | Current React/Vite/TypeScript/Tailwind architecture is reused. |
| Data officer | WARN | The 25-session threshold may not be reached quickly. |
| Discovery officer | PASS | Internal discovery rises without removing indexed inventory. |
| Editorial/evidence officer | PASS | Service copy describes outcomes without individualized claims. |
| Healthcare-user officer | PASS | Worker and patient/caregiver pathways receive intentional visibility. |
| Privacy/legal officer | WARN | Production migration and actual role behavior require verification. |
| Accessibility/reliability officer | WARN | Global navigation cannot ship with browser or performance failure. |
| Quality/release officer | WARN | Merge remains blocked until every final-head gate passes. |
| Red team | WARN | More visible destinations could increase cognitive load despite grouping. |
| Process officer | PASS | One controlling registry replaces duplicated secondary-navigation definitions. |

## 9. Anti-blindness findings

- The prompt emphasized discoverability but direct user testing is not available.
- The strongest argument against the solution is that it could simply turn `More` into an oversized mega menu.
- The weakest assumption is that the four labels will be immediately understandable.
- More clicks could reflect confusion rather than success.
- A searchable service finder remains a future option only if grouped navigation evidence is weak.
- Benefits Command Center exposed a pre-existing mismatch between the generated sitemap and one internal SEO helper; this release uses the generated sitemap as route authority and records the helper mismatch as debt rather than broadening scope.

## 10. Quantified before-and-after impact

| Measure | Before | Target after | Change |
|---|---:|---:|---:|
| Primary desktop destinations | 6 | 6 | 0 |
| Generic overflow destinations | 8 | 0 | -8 |
| Structured service groups | 0 | 4 | +4 |
| Initial flat mobile destinations | 14 | 3 direct actions | -11 |
| Mobile disclosure groups | 0 | 4 | +4 |
| Concrete high-value services named globally | 0 | 9 | +9 |
| Footer links | 21 | 21 | 0 |
| Public tools | 34 | 34 | 0 |
| Indexable routes | 160 | 160 expected | 0 expected |
| Ad-eligible articles | 39 | 39 | 0 |
| Navigation evidence events | 0 | 2 | +2 |
| Evidence tables | 1 | 1 | 0 |

Consequences: more utility becomes visible; no direct monetization change; no route or content removal; one registry reduces maintenance drift; desktop panel density and mobile disclosure taps remain measurement risks.

## 11. Anomaly gate

- [x] Changes more than 20% of a globally visible surface.
- [ ] Reduces monetizable inventory.
- [ ] Reduces indexable inventory.
- [ ] Reduces usable functionality.
- [ ] Contradicts a confirmed founder objective.
- [x] Could pass technically while failing in business value.

Mitigation: preserve primary routes, limit to four groups, certify keyboard/mobile/laptop behavior, retain a simple rollback, and review navigation evidence after 28 days.

## 12. Candidate ranking

| Candidate | Decision |
|---|---|
| Structured Explore CAF navigation | Selected: broad discovery impact, bounded, reversible, measurable |
| Homepage rewrite | Rejected: homepage already has coherent Decision Concierge and browse pathways |
| Searchable service finder | Deferred: higher architecture/maintenance cost before proving grouped navigation is insufficient |
| Flagship hub redesign | Rejected: does not solve global discovery |
| Full visual redesign | Rejected: high cost and risk, weak relationship to verified problem |

## 13. Integrated decision

Implement `Explore CAF` using one typed registry, four outcome-led groups, three direct mobile actions, nine concrete named services, and the existing consent-gated evidence API/table. Preserve the six primary routes, homepage, footer, sitemap, design tokens, and commercial boundaries. Measure distinct consented opened sessions and distinct sessions selecting an allowlisted destination by desktop/mobile surface. Revert the UI and migration if accessibility, reliability, performance, or navigation evidence fails.

## 14. Separate validation dispositions

### Technical validation

**Current status:** WARN until final exact-head CI, browser, Decision Journey, Vercel preview, Supabase security verification, merge, and production smoke all pass.

Required evidence includes 558 unit tests, API typecheck, build, bundle, prerender, sitemap, AdSense governance, 1280px keyboard journey, 320px mobile journey, multi-destination mobile journey, axe, no horizontal overflow, premium/patient regressions, forced RLS, least privilege, controlled insert/delete, and clean advisors/runtime.

### Business validation

**Current status:** PASS subject to final technical certification. The selected intervention exposes completed services without hiding content, preserves all audiences, avoids commercial pressure, is maintainable through one registry, and creates evidence capable of reversing the decision. It does not prove improved satisfaction or causality before the measurement window.

## 15. Implementation slices

| Slice | Files / system | Acceptance |
|---|---|---|
| Typed IA | `src/data/serviceNavigation.ts` | Four groups, unique routes/IDs, at least eight concrete services |
| UI | `Header.tsx` | Same hierarchy desktop/mobile; focus, Escape, touch, overflow pass |
| Evidence | evidence contract/client/API | Fixed consented open and selection events only |
| Database | `202607310002_service_navigation_evidence.sql` | Strict constraints, forced RLS, service-role SELECT/INSERT/DELETE only |
| Tests | unit, migration, Playwright | Full final-head suite passes |
| Governance | ledgers, work packet, Notion, Linear | Exact release state and rollback recorded |
| Release | PR #237 and Vercel | No unresolved threads; exact production deployment READY |

## 16. Release gates

- [x] Inherited-decision and quantified-impact gates complete.
- [x] Business rationale and rollback defined.
- [ ] Final-head CI passes.
- [ ] Final-head browser certification passes.
- [ ] Final-head Decision Journey passes.
- [ ] Supabase migration and effective security pass.
- [ ] Exact-head preview is READY.
- [ ] PR review threads are clear.
- [ ] Technical validation is PASS.
- [ ] PR is merged and exact production is verified.
- [ ] Durable records are reconciled.

## 17. Executive closeout

Pending final release. Production remains unchanged until all gates pass. Deliberate non-changes include homepage, footer, routes, sitemap, AdSense, Stripe, affiliates, email, content, and brand system. The rollback is a revert of PR #237 plus a reviewed constraint rollback after inspecting any collected rows. The first interpretation threshold is 25 distinct consented navigation-open sessions or 28 days, whichever yields decision-grade evidence.

## 18. Compounding closeout

- Typed service registry created for reuse.
- Fixed navigation evidence contract created by extending—not duplicating—the existing system.
- Unit, migration, route, accessibility, and browser regression coverage added.
- Generic overflow and flat mobile-secondary definitions are retired in the implementation.
- Remaining process debt: reconcile the Benefits Command Center omission in the internal `getIndexableRoutes()` helper with the generated sitemap authority in a separate bounded change.
- Reassessment trigger: 28 days after release, 25 distinct consented opened sessions, any accessibility/performance defect, or route drift.## 19. Final release closeout

- **Technical validation:** PASS. CI `30676794553`, browser certification `30676794548`, and Decision Journey `30676794615` passed on exact head `7f4788430ab251e9a404fcb358b0c518fce1d065`.
- **Business validation:** PASS. Six primary destinations remain intact; eight generic overflow links become four outcome-led groups; nine concrete services are named; all routes, tools, articles, AdSense dispositions, homepage, footer, and commercial boundaries are preserved.
- **Database/privacy:** Migration `service_navigation_evidence` is applied. Forced RLS, no public policies, and service-role SELECT/INSERT/DELETE only were verified. Valid events passed; invalid events, duplicates, anonymous reads, and authenticated writes failed. Controlled rows were deleted back to zero.
- **Release:** PR #237 merged at `08f6a051754acdf94dec94f0b564349acc7aa1ea`; Vercel production `dpl_9K3StXWYyBXg5gnCTe5kkqPui1ZY` is READY with no alias error.
- **Production smoke:** Homepage, Benefits Command Center, Medical Bill Review, Medicare/Medicaid, and Quick Guides returned HTTP 200. The evidence endpoint returned expected POST-only/no-store/noindex behavior. No production error logs were found in the inspected release window.
- **Measurement:** `SERVICE-NAVIGATION-2026-08`; 28 days; interpret at 25 distinct consented navigation-open sessions, otherwise report raw counts and extend.
- **Known process debt:** Reconcile the internal `getIndexableRoutes()` omission of Benefits Command Center with the generated sitemap authority in a separate bounded change.
