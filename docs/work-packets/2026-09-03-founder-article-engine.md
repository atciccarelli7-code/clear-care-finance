# Work Packet — Founder-Led Article Engine, Manuscript Mining & Publication

## 1. Identity

- **Date:** 2026-09-03
- **Branch:** `codex/founder-article-engine-2`
- **Scope:** Mine protected founder material, rank ten candidates, publish the strongest bounded portfolio, document the recurring workflow, and production-certify the release.
- **Explicit exclusions:** Assignment 1 rework, broad Search Console optimization, archive redesign, new products, monetization, and unrelated cleanup.

## 2. Starting state

Main and production begin at Assignment 1's verified state: 188 canonical routes, 77 public articles, six flagships, five editorial desks, 42 ad-eligible routes, 146 ad-free routes, and 39 permanent redirects. PR #282 is merged and the production deployment is healthy.

## 3. Founder material and ownership boundary

The primary source is the read-only 406-paragraph Google Doc **Hospitals Are a Business — Rough Draft / Idea Dump**. Original material includes the grocery-store analogy, nonprofit/business tension, “business but not only a business” formulation, healthcare identity-crisis questions, hospital price and fixed-payment examples, and prompts about insurance, documentation, administration, emergency waiting, and rational actors. Repository content-engine records and prior founder-led articles provide continuity. No patient anecdote, employer-specific claim, quotation, or experience was invented; the manuscript was not edited.

## 4. Evidence plan

Every candidate separates founder observation, sourced factual claim, editorial synthesis, and unresolved question. Research tests support, alternatives, exceptions, current rules, and limitations. Preferred evidence is CMS, Medicare.gov, Federal Register, HHS OIG, MedPAC, GAO, CMS cost reports, and peer-reviewed health-economics research; an AHA report is disclosed as industry perspective rather than neutral proof.

## 5. Inherited-decision challenge

Assignment 1's archive architecture remains sound and is not reopened. The update-before-new-URL rule is applied to prior authorization. Previously held hospital service-line economics is re-admitted only because current payment, margin, cost-report, allocation, and cross-subsidy evidence now supports a properly qualified version.

## 6. Capability plan

| Need | Authoritative surface | Risk boundary |
|---|---|---|
| Founder source | Connected Google Drive/Docs | Read-only; no manuscript mutation |
| Current facts | Primary government sources and bounded research | Current dates, payer scope, and samples must remain visible |
| Implementation | Existing data-driven article architecture | No new framework, backend, or duplicated canonical |
| Release | GitHub exact-head workflows and Vercel | No merge until required checks and preview pass |
| Browser QA | Hosted certification plus production inspection | Mobile, desktop, accessibility, canonicals, schema, and links |

## 7. Independent role matrix

| Role | Disposition | Material finding / acceptance test |
|---|---|---|
| Editorial director | PASS | Three pieces clear the flagship bar; seven remain held. |
| Founder-voice steward | PASS | Founder logic is identified and bounded; no experience is fabricated. |
| Healthcare researcher | PASS | EMTALA, IPPS, margins, prior authorization, appeals, and cross-subsidy claims have scoped sources. |
| Adversarial fact-checker | PASS | Each article states its strongest complication and where evidence stops. |
| Information architect | PASS | Two new hospital-economics canonicals and one existing costs/insurance canonical fit the five desks. |
| SEO strategist | PASS | Prior authorization remains one canonical; only two distinct URLs are added. |
| Frontend engineer | PASS | Existing article schema and components are reused. |
| Accessibility/reliability | PENDING | Full local and hosted browser gates must pass. |
| Privacy/legal | PASS | No PHI, individualized coverage determination, or confidential workplace detail. |
| Release owner | PENDING | Exact-head PR, merge, READY production, and post-release smoke are required. |

## 8. Executive accountability matrix

| Perspective | Finding | Consequence |
|---|---|---|
| Strategy | Founder mechanisms, not keyword volume, are CAF's durable advantage. | Publish only pieces worth keeping at zero Google traffic. |
| Product | Prior authorization naturally leads to an existing next-step guide; the hospital-economics pieces do not need forced tools. | Contextual pathways only. |
| Finance | Margin claims change meaning by level and accounting boundary. | Name hospital, period, payer, service, and margin definition. |
| Discovery | Two distinct URLs deepen one established cluster. | Small index expansion, no variants. |
| Editorial/evidence | A vivid analogy can overstate legal or payment rules. | Preserve the question while correcting the rule. |
| Quality/release | Technical correctness does not prove reader impact. | Report release evidence separately from future performance. |

## 9. Anti-blindness findings

- Strongest argument against the portfolio: the two hospital articles could become institutional apologetics or repeat existing flagships.
- Resolution: both add a distinct mechanism, center accountability, and explicitly reject explanation as acquittal.
- Most important factual correction: EMTALA is emergency screening/stabilization/transfer protection, not universal free hospital care.
- Most important sample limit: the OIG prior-authorization finding is a one-week June 2019 sample from 15 large Medicare Advantage organizations, not a current national rate.
- Most important accounting limit: public cost reports do not prove an internal service-line allocation or a specific cross-subsidy.
- Metric that could rise while quality falls: indexed article count. It is not used as the selection objective.

## 10. Quantified before-and-after impact

| Measure | Before | Expected after | Change |
|---|---:|---:|---:|
| Canonical routes | 188 | 190 | +2 |
| Public articles | 77 | 79 | +2 |
| Flagship articles | 6 | 9 | +3, including one rebuilt canonical |
| Redirects | 39 | 39 | 0 |
| Prior-authorization canonicals | 1 | 1 | 0 |

Generated release output is authoritative for final route and publisher-disposition counts.

## 11. Anomaly gate

- [ ] More than 20% of a major surface changes.
- [ ] An existing URL is removed, redirected, or deindexed.
- [ ] A new tool, backend, account, payment, or user-data field is introduced.
- [ ] A founder experience is inferred rather than sourced.
- [ ] One payer rule is generalized to all coverage.
- [ ] Technical success is presented as audience or revenue proof.

No anomaly is expected; re-evaluate after exact generated counts and browser checks.

## 12. Candidate work ranking

The ten-candidate scoring record lives in `docs/editorial/2026-09-03-founder-candidate-pipeline.md`. Selected: business/public-utility tension, recommendation/coverage separation at the existing prior-authorization canonical, and overall-versus-service margin. Held: documentation, broader insurance synthesis, rational-actor synthesis, administrator role, negotiated patient choice, ED waiting as a duplicate mechanism, and more-care-is-not-always-better.

## 13. Integrated decision

Publish `/articles/hospitals-are-businesses-and-public-utilities` and `/articles/hospital-profitable-unprofitable-service`; rebuild `/articles/prior-authorization-explained` in place. Connect all three to the Hospital Economics hub, feature them in the article archive, and add reciprocal contextual links to current flagships. Use the prior-authorization guide only where it is a genuine next action.

## 14. Separate validation dispositions

### Technical validation

- **Status:** PASS locally / PENDING hosted evidence.
- The full suite passes 138 files and 766 tests. Lint has zero errors and 15 inherited Fast Refresh warnings. The production build passes governance, API TypeScript, publication, freshness, premium, institutional, patient-education, AdSense, bundle, prerender, roadmap, redirect, sitemap, and search checks.
- Generation produces 190 canonical routes, 79 articles, 44 ad-eligible routes, 146 ad-free routes, 39 redirects, and zero search warnings. The entry is 499.30 KiB under the unchanged 500 KiB cap.
- The three prerendered pages contain the correct H1, canonical, Article schema, source lists, and internal links. The Hospital Economics hub contains both new hospital articles.
- Local Playwright cannot launch because the pinned Chromium executable is absent. The cloud browser cannot reach loopback. Hosted mobile/desktop certification therefore remains a mandatory release gate; no local browser assertion is claimed.

### Business/editorial validation

- **Status:** PASS for publication selection; future audience impact unknown.
- The portfolio deepens existing hospital economics and costs/insurance desks, preserves founder reasoning, and avoids generic expansion.

## 15. Implementation slices

| Slice | Output | Acceptance test |
|---|---|---|
| Candidate pipeline | Ten ranked theses and explicit selection | Complete ten-factor record |
| Research | Claim/source/adversarial ledger | Every material rule scoped and sourced |
| Articles | Two new + one rebuilt canonical | Full metadata, sources, counterargument, practical implication |
| Discovery | Archive, desk hub, contextual internal links | No indiscriminate link block or dead route |
| Workflow | Updated CAF Content Engine | Repeatable capture-to-review loop |
| Release | PR, CI, merge, deployment | Exact-head and production certification |

## 16. Release gates

- [x] Founder source meaningfully inspected.
- [x] Ten candidates ranked and three selected.
- [x] Research includes complications and counterevidence.
- [x] Founder observation is separated from sourced claims.
- [x] Canonical and desk decisions are explicit.
- [x] Full local tests, lint, TypeScript, build, and repository gates pass.
- [ ] Mobile/desktop accessibility and link checks pass.
- [ ] Exact-head PR checks and preview pass.
- [ ] Merge, production deployment, smoke, sitemap, schema, and logs pass.

## 17. Executive closeout

Two new founder-led articles and one in-place canonical rebuild are locally complete. The first focused test attempt failed because this fresh worktree had no installed project dependencies; `npm ci` repaired the environment. The first build then caught a literal freshness-check requirement and stale 42/77 publisher inventory contracts; both were corrected. The next build caught a 500.96 KiB entry regression; repeated categories and dates in the generated runtime SEO manifest were dictionary-encoded without removing metadata, lowering the entry to 499.30 KiB. The first full suite caught one remaining 42-route expectation; after repair, all 766 tests pass. Hosted release identifiers and production inspection remain to be appended to the final implementation report.

## 18. Compounding closeout

Update the CAF Content Engine, decision/evidence/work ledgers, and this packet after release. Stop at the bounded article batch; later Search Console work belongs to Assignment 3.
