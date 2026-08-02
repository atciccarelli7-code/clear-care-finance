# Community Acquired Finance — Navigation Simplification and Progressive Resume Work Packet

## 1. Assignment charter

- **Request:** Simplify CAF navigation, make Start Here the clear guided entry, expose the tools directory directly, and make saved work progressive rather than a large automatic page block.
- **User outcome:** A first-time visitor sees one guided start and one browse path; a returning visitor gets a small optional resume control with deliberate removal.
- **Affected audiences:** Healthcare workers, patients, caregivers, and general visitors.
- **Constraints:** Preserve routes, canonicals, source-backed content, privacy boundaries, local-storage schemas, analytics allowlists, Supabase security, Stripe state, and unrelated work.
- **Non-goals:** New calculator, new account system, cloud sync, payment change, database migration, content migration, or route deletion.
- **Risk class:** Moderate because homepage, tools, Start Here, and global navigation are high-traffic surfaces.

## 2. Current-state evidence

| Area | Direct evidence | Verified | Limitation |
|---|---|---:|---|
| Repository | Home and Tools each rendered Decision Concierge while Start Here rendered Financial Navigator | 2026-08-02 | Code proves duplication, not user preference. |
| Navigation | Six primary links plus Explore; Explore repeated Decision Concierge; mobile repeated Start Here inside a group | 2026-08-02 | Inventory does not establish comprehension. |
| Saved work | Returning users received a large expanded continuation card; first-time users had no card | 2026-08-02 | Local state is browser-specific. |
| Supabase | Active project healthy; public tables remain RLS-protected; no schema need identified | 2026-08-02 | Read-only inspection does not prove future traffic behavior. |
| Stripe | Connected CAF account exists; no checkout or product change is implicated | 2026-08-02 | Account state does not establish revenue impact. |
| Linear | AND-103 tracks implementation and release | 2026-08-02 | Operational record, not independent evidence. |

## 3. Inherited-decision challenge

CAF-D-011 was explicitly an experiment, not an untouchable permanent policy. Its grouped Explore model and fixed evidence contract remain useful, but preserving six primary destinations and duplicating a routing experience across Home, Tools, and Start Here created a hierarchy conflict. This release supersedes only those counts and duplicate placements. It preserves the grouped Explore system, broad-audience model, destinations, evidence event contract, and 28-day measurement caution.

## 4. Quantified before and after

| Measure | Before | After | Change |
|---|---:|---:|---:|
| Full guided routing systems visible across Home, Tools, Start Here | 3 | 1 | −2 / −66.7% |
| Desktop primary route links | 6 | 5 | −1 / −16.7% |
| Top-level desktop choices including Explore | 7 | 6 | −1 / −14.3% |
| Explore service destinations | 17 | 16 | −1 duplicate / −5.9% |
| Mobile disclosure groups after three priority actions | 4 | 3 | −1 empty duplicate-start group |
| Tools directory initial state | Hidden behind mode choice | Visible | Direct browse restored |
| Saved-work surface without local state | 0 | 0 | No interruption |
| Saved-work surface with local state | Large expanded card | Small button + dialog | Progressive disclosure |
| Public routes deleted | 0 | 0 | No loss |
| Canonical sitemap routes | 160 | 160 | No loss |
| Database/payment changes | 0 | 0 | No expansion |

## 5. Information architecture and exact language

- Home primary: **Help me find where to start** → `/start-here`.
- Home secondary: **Browse tools** → `/tools`.
- Start Here title: **Find the right next step for the decision in front of you.**
- Tools title: **Find the calculator, checklist, or guide you need.**
- Saved-progress trigger: **Continue saved work**.
- Primary navigation: Start Here; Tools; Money & Retirement; Benefits & Healthcare Costs; Medicare & Medicaid; Explore CAF.
- Plain-language services replace internal product language where helpful: Compare workplace benefits; Review benefit changes; Compare job offers.

## 6. Progressive resume behavior

- No local state: render no saved-progress control and no empty My Plan section.
- Local state: render one restrained trigger; keep details out of view until opened.
- Dialog: title, non-sensitive summary, browser-local notice, updated date, Resume, and Remove.
- Escape closes the dialog and returns focus to the trigger.
- Remove requires a nested confirmation and calls the existing product-specific clear function.
- Storage schemas and route targets remain unchanged; no private answers, financial values, or health details enter analytics.

## 7. Independent role matrix

| Role | Status | Finding / acceptance test |
|---|---|---|
| Orchestrator | PASS | Scope remains one coherent IA and continuity release. |
| Context steward | PASS | CAF-D-011 is challenged, partially preserved, and explicitly superseded. |
| Capability router | PASS | Connected systems are used according to authority; no unnecessary schema/payment action. |
| Executive strategy | PASS | One clear entry protects trust and reduces routing redundancy. |
| Product management | PASS | Guided and direct-browse intents are separated. |
| Healthcare user research | WARN | Heuristic conflict is strong; direct post-release usability evidence is still needed. |
| Information architecture | PASS | One router, one direct directory, stable destinations. |
| UX and design system | PASS | Existing components and hierarchy are retained. |
| Content and evidence integrity | PASS | No substantive educational claim changed. |
| Frontend engineering | PASS | Existing local schemas and event contracts are preserved. |
| Systems architecture | PASS | Duplicate presentation removed without a new router or service. |
| Backend, data, and security | NOT IMPLICATED | No API, auth, database, or RLS change. |
| Platform and DevOps | WARN | Preview and production verification are pending release. |
| SEO and discovery | PASS | 160 canonical routes and all sitemap URLs remain; two orphan links were restored contextually. |
| Monetization and conversion | PASS | No payment or ad expansion; guided and browse CTAs remain available. |
| Analytics and experimentation | WARN | Existing navigation experiment needs annotation because the UI changed before its original review threshold. |
| Accessibility, performance, reliability | WARN | Unit focus tests pass; local executable-browser certification is blocked by unavailable Chromium. |
| Privacy, legal, user protection | PASS | Browser-local storage, deliberate removal, and non-sensitive tracking remain explicit. |
| Publishing and governance | PASS | Work packet, decision, work record, issue, and release evidence are required. |
| Quality and release | WARN | 580 tests/build pass; exact-head CI and preview remain required. |
| Adversarial red team | PASS | First-time, returning, Escape/focus, confirmation, stale SEO, and route-loss cases are covered. |
| Process improvement | PASS | Duplicate-routing and progressive-resume expectations become regression tests. |

## 8. Executive accountability matrix

| Perspective | Status | Consequence |
|---|---|---|
| CEO / Strategy | PASS | Product hierarchy is clearer without shrinking utility. |
| COO | PASS | No new operational system; exact records will reconcile at release. |
| CFO | PASS | No infrastructure or payment cost; small maintenance reduction. |
| CRO | PASS | Preserves both guided and high-intent direct browsing without premature sales pressure. |
| CPO | PASS | Removes two duplicate routers and one oversized interruption. |
| CTO | PASS | Reuses routes, schemas, components, and clearing functions. |
| Data / Analytics | WARN | Interrupted experiment must not be interpreted as one stable variant. |
| Marketing / Discovery | PASS | No indexed inventory loss; topical discovery remains. |
| Editorial / Evidence | PASS | Claims and source boundaries unchanged. |
| Healthcare user context | WARN | Post-release comprehension evidence is not yet available. |
| Privacy / Legal | PASS | No cloud persistence or expanded event payload. |
| Accessibility / Reliability | WARN | Browser CI must supply final axe/responsive certification. |
| Quality / Release | WARN | Exact-head and production gates pending. |
| Red Team | PASS | Direct and guided paths, removal, focus, first-time state, and SEO orphans challenged. |
| Process Improvement | PASS | One-router principle and progressive continuity are durable checks. |

## 9. Anti-blindness and anomaly gate

- A lower count is not automatically better; the retained Explore panel still exposes 16 concrete services.
- More Start Here clicks could indicate clearer hierarchy or unresolved confusion; click rate alone cannot establish success.
- Hiding saved work entirely would harm returning users; this release preserves a visible, optional trigger only when state exists.
- Removing the duplicate directory initially created two SEO orphans. Build validation caught them, and contextual inbound links were added without restoring the directory.
- Browser tooling failure is recorded as a release gate, not mislabeled as a product failure or a pass.

## 10. Validation dispositions

### Technical validation

- `npm test`: PASS — 101 files, 580 tests.
- `npm run lint`: PASS — 0 errors; 12 pre-existing Fast Refresh warnings outside this change.
- `npm run build`: PASS — governance, typed outcomes, publication readiness, patient/institutional boundaries, AdSense readiness, production bundle, 160-route prerender, bundle budget, comprehensive routes, and search readiness.
- TypeScript: PASS.
- Saved-progress component tests: PASS for first-time absence, collapsed state, Resume, Escape/focus return, confirmation, removal, and annual-review recovery.
- Local Playwright: BLOCKED because the installed Playwright package has no Chromium executable and the allowed environment returned an empty archive from the browser CDN.

### Business validation

- **Status:** PASS WITH MEASUREMENT WARNING.
- One guided router remains responsible for uncertain visitors.
- Direct tool browsing becomes immediately available.
- All public destinations remain available and indexable.
- No revenue, satisfaction, or conversion lift is claimed.

## 11. Release and rollback

- Release branch: `agent/navigation-progressive-resume`.
- Controlling issue: Linear AND-103.
- Preview, CI, pull request, merge SHA, production deployment, and runtime evidence will be attached to the release record.
- Rollback: revert the release commit. No data migration, checkout, account, or destructive storage reversal is required.
- Reassessment: direct user confusion, saved-progress removal defect, route/SEO regression, 28 days after release, or adequate fixed navigation evidence.

## 12. Compounding closeout

- Durable decision: CAF-D-013.
- Durable work record: CAF-W-010.
- Reusable assets: progressive continuity dialog, product-specific removal dispatcher, one-router IA tests, direct tools-directory tests, and saved/no-saved regression coverage.
- Process lesson: removing a duplicate global directory requires a search-readiness crawl because visually secondary links may still be the only static inbound path.

