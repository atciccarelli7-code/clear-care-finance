# CAF Product Readiness Audit

**Audit date:** July 13, 2026  
**Production commit inspected:** `b27770636ea1f783629871adc0f191de850e367a`  
**Production deployment inspected:** `dpl_226hSFiujbVw1g3t87hMGVMSwbRW`  
**Parent issue:** #153  
**Standard:** `docs/caf-product-readiness-standard.md`

## Executive finding

CAF already has a stronger product architecture than a normal early-stage content site. The authoritative systems are in place:

- Financial Navigator and My Plan;
- Financial Foundation Checkup;
- Decision Concierge;
- typed tool and route registries;
- Benefits Command Center and Receipt architecture;
- Benefits Change Detector and Receipt;
- medical-bill and discharge workspaces;
- deterministic roadmap tools;
- local-first continuity;
- source and freshness governance;
- privacy-safe analytics helpers;
- route-aware ad protection;
- sitemap, prerender, canonical, and search-readiness gates.

The current limiting factor is not lack of functionality. It is **uneven completion and measurement across otherwise strong journeys**. Several newer guided tools have good logic, official sources, My Plan actions, copy/print, and canonical routes, but their start-to-result-to-next-action funnel is not consistently measured. Some content clusters also contain several overlapping entry points whose roles are understandable to the codebase but not always obvious to a first-time user.

No critical production defect was found during this audit. Production was READY on the expected merge commit, no runtime error clusters were reported in the prior 24 hours, and no unresolved Vercel Toolbar threads existed.

## Scoring method

Scores use the 28-point Product Readiness Standard. A high score does not imply verified adoption. It means the current product can credibly perform its intended job within stated limits.

- **Complete:** 25–28
- **Usable but incomplete:** 20–24
- **Weak:** 14–19
- **Duplicative or risky:** 8–13
- **Unsupported:** 0–7

`Observed analytics` means production payload or event-count evidence was actually inspected. Most current events are implemented and tested but not yet observed through a connected analytics reporting surface.

## Product inventory

| Product or route | Primary role | Acquisition | Activation | Retention | Revenue relevance | Main overlap | Analytics status | Source status | Score | Classification | Recommended action | Priority |
|---|---|---:|---:|---:|---:|---|---|---|---:|---|---|---:|
| `/` homepage | Topic/directory entry | High | Medium | Low | Medium | Start Here and Tools | Implemented; production outcomes not observed | Stable positioning; route metadata current | 23 | Usable but incomplete | Preserve broad positioning; measure Concierge and starting-path use before redesign | 2 |
| Decision Concierge on Home/Start Here/Tools | Flagship router | Medium | High | Medium | Medium | Financial Navigator pathway selection | Fixed events implemented and tested; delivery not yet observed | Route map is deterministic and current | 25 | Complete | Verify production funnel and refine labels only from use evidence | 1 |
| `/start-here` Financial Navigator | Flagship product | Medium | High | High | Medium | Concierge and topic directories | Mature fixed analytics; production conversion not currently available | Stable general-finance sources and disclaimers | 27 | Complete | Maintain; verify completion, My Plan save, and return rates | 1 |
| Financial Foundation Checkup on Start Here | Flagship product | Low | High | High | Medium | Emergency fund and debt tools | Fixed bucket analytics implemented; outcomes not observed | Assumptions visible; no policy dependence beyond general education | 26 | Complete | Use as recurring 90-day retention anchor; add only evidence-backed refinements | 2 |
| My Plan | Shared continuity system | Low | High | High | Medium | No competing system found | Fixed action analytics implemented | No policy source burden | 27 | Complete | Preserve one authoritative action system; expand only with approved fixed IDs | 1 |
| Returning-user summary | Supporting continuity | Low | Medium | High | Low | None | Fixed view/open/dismiss events implemented | Not source-dependent | 26 | Complete | Extend only to bounded workspaces after privacy review | 3 |
| `/tools` directory | Topic/directory page | High | Medium | Low | Medium | Concierge and topic hubs | Search/filter behavior tested; outcome analytics limited | Current registry and SEO manifest | 25 | Complete | Measure search/filter and flagship-card opening before changing inventory | 3 |
| `/tools/benefits-change-detector` | Flagship product | High | High | High | High | Open Enrollment and Benefits Command Center | Full growth events implemented/tested; delivery not observed | Official DOL, IRS, HealthCare.gov support; 2026 review | 27 | Complete | Verify live funnel, Receipt actions, resume, and annual-return behavior | 1 |
| Benefits Change Receipt | Flagship result artifact | Medium | High | High | High | Benefits Command Center Receipt | Fixed copy/print/share/calendar events implemented | Verification language and dates current | 27 | Complete | Use as CAF's model Receipt; measure action rate before adding fields | 1 |
| `/tools/benefits-command-center` | Flagship product | High | High | High | High | Benefits Blueprint and Action Plan | Deep activation and workspace analytics implemented; production outcomes not observed | Strong source and uncertainty model | 28 | Complete | Maintain as deepest workplace workspace; reduce duplicated CTAs if evidence shows confusion | 1 |
| Benefits Blueprint | Supporting guided tool | Medium | High | Medium | High | Employer Benefits Action Plan and Command Center | Tool analytics exist; funnel not reconciled across products | Current open-enrollment sources | 22 | Usable but incomplete | Clarify canonical role: goal-first preparation before entering detailed values | 2 |
| Employer Benefits Action Plan | Supporting guided tool | Medium | High | Medium | High | Benefits Blueprint and Command Center | Tool analytics exist; production handoff rates unknown | Current benefits and retirement sources | 22 | Usable but incomplete | Clarify role: value-based action plan after actual numbers are known | 2 |
| `/tools/open-enrollment-true-cost-calculator` | Supporting tool | High | High | Low | High | Health visit-cost and OOP tools | Calculator events implemented | Year-sensitive plan inputs; official definitions linked | 23 | Usable but incomplete | Strengthen handoff into Detector or Command Center after result | 2 |
| HSA vs FSA helper | Supporting tool | High | High | Medium | High | Open Enrollment and Benefits Blueprint | Basic tool analytics; result-action evidence unavailable | Tax/eligibility verification present | 22 | Usable but incomplete | Add explicit fixed My Plan and next-journey action if not already present | 3 |
| Childcare Benefits Decision Guide | Supporting guided tool | Medium | High | Medium | Medium | Open Enrollment and benefits cluster | No standardized start/completion/action funnel | 2026 statutory source and IRS verification present | 23 | Usable but incomplete | Add standard decision-tool analytics and measure completion | 3 |
| Roth vs Traditional Decision Helper | Supporting guided tool | High | High | Medium | Medium | 403(b) calculator and retirement articles | No standardized start/completion/action funnel | IRS sources and qualified uncertainty are strong | 24 | Usable but incomplete | First-batch candidate: instrument completion and next-action use | 1 |
| 403(b) paycheck calculator | Supporting tool | High | High | Medium | High | Roth helper and Benefits Command Center | Mature calculator events; production outcomes unavailable | IRS limits and plan verification needed | 23 | Usable but incomplete | Maintain calculation role; hand off tax-treatment questions to Roth helper and package review to Command Center | 2 |
| Debt vs Retirement Router | Flagship candidate | High | High | Medium | Medium | Financial Foundation Checkup and student-loan section | No standardized start/completion/action funnel | Federal student-loan and CFPB verification strong | 24 | Usable but incomplete | First-batch candidate: instrument completion and next-path use | 1 |
| `/tools/healthcare-worker-total-compensation-comparison` | Flagship product | High | High | Medium | High | Career Decisions and Benefits Command Center | Tool events implemented; downstream handoff not observed | BLS/DOL/IRS/HealthCare.gov support | 26 | Complete | Measure comparison completion and Command Center continuation | 2 |
| `/healthcare-workers/career-decisions` | Flagship journey hub | High | Medium | Medium | High | Total Compensation tool and Healthcare Workers hub | Journey analytics incomplete | Source burden moderate; employment boundaries clear | 23 | Usable but incomplete | Add role-transition completion artifact only after observed demand | 3 |
| Healthcare-worker paycheck/overtime tools | Supporting tools | Medium | High | Low | Medium | Total Compensation comparison | Calculator events vary by tool | Tax/payroll estimates qualified | 21 | Usable but incomplete | Consolidate interpretation and route recurring overtime dependence into career/financial foundation journeys | 4 |
| `/insurance/medical-bill-review-toolkit` | Flagship product | High | High | High | Medium | Medical Bill Review Flow and EOB checker | Hub/tracker events exist; complete funnel not reconciled | CMS/IRS/HealthCare.gov and billing boundaries strong | 27 | Complete | Treat as canonical medical-bill command center; measure tool selection and tracker use | 1 |
| Medical Bill Review Flow | Supporting guided tool | High | High | Medium | Medium | Toolkit | Tool events implemented | Qualified process guidance | 23 | Usable but incomplete | Keep as focused action flow; ensure result routes back to toolkit tracker | 2 |
| EOB-to-Bill Match Checker | Supporting tool | High | High | Medium | Medium | Medical Bill Toolkit | Start event exists; completion/action funnel is incomplete | Official definitions linked | 23 | Usable but incomplete | Add completion and next-step event coverage; current internal handoffs are already strong | 2 |
| Financial Assistance Screening | Flagship supporting journey | High | High | Medium | Medium | Medical Bill Toolkit | Fixed tool/My Plan events implemented; production outcomes unknown | IRS 501(r), CMS rights, qualified no-eligibility language | 26 | Complete | Measure screening completion and My Plan use; preserve existing slug | 2 |
| Prior Authorization Next-Step Guide | Flagship product | High | High | Medium | Medium | Medical Bill Toolkit and discharge | Strong start/completion/action event design; production outcomes unavailable | CMS/DOL/HealthCare.gov/Medicaid sources strong | 27 | Complete | Maintain and verify production completion and official-source opening | 1 |
| Observation vs Inpatient Status Guide | Flagship candidate | High | High | Medium | Medium | Hospital Discharge and Medical Bill Toolkit | No standardized start/completion/action funnel | CMS MOON and Medicare SNF sources strong | 24 | Usable but incomplete | First-batch candidate: instrument completion and handoff to discharge/toolkit | 1 |
| `/insurance/hospital-discharge-coverage` | Flagship product | High | High | High | Medium | Discharge Medicare guide and observation tool | Workspace events exist; return behavior not observed | Medicare/discharge verification strong | 26 | Complete | Measure workspace continuation; add only safe categorical return state | 2 |
| `/medicare-care-costs/turning-65` | Flagship product | High | High | High | High | Medicare hub and plan checklist | Journey workspace events implemented; production outcomes unavailable | Current official Medicare/SSA/IRS sources and freshness | 27 | Complete | Maintain as primary enrollment-timing journey; measure resume and official handoffs | 1 |
| Medicare Plan Verification Checklist | Flagship candidate | High | High | Medium | High | Medicare Options, MA/Medigap pages, Turning 65 | No standardized start/completion/action funnel | Medicare Plan Finder, SHIP, Medicare.gov sources strong | 24 | Usable but incomplete | First-batch candidate: instrument checklist progress, copy/print, and next journeys | 1 |
| Medicare Cost Exposure Tool | Supporting tool | High | High | Low | High | Medicare comparison and Plan Finder | Calculator events exist | Effective-year maintenance required | 21 | Usable but incomplete | Add explicit Plan Finder and checklist handoff; keep estimate scope narrow | 3 |
| Medicare/Medicaid Eligibility Check | Supporting guided tool | High | High | Low | Medium | State Medicaid router | Existing events; handoff evidence unavailable | National orientation and official agency links | 22 | Usable but incomplete | Clarify that state router is the canonical state-specific continuation | 2 |
| State Medicaid and Long-Term Care Router | Flagship candidate | High | High | Medium | High | Eligibility Check and Medicare hub | No standardized start/completion/action funnel | Maintained official state registry; high review burden | 24 | Usable but incomplete | First-batch candidate after analytics: measure state-route completion without transmitting state | 1 |
| Student Loan Path Finder | Supporting guided tool | High | High | Medium | Medium | Debt vs Retirement Router | Tool events exist; cross-journey funnel unavailable | Federal program freshness burden | 22 | Usable but incomplete | Make Debt vs Retirement the sequencing layer and Path Finder the loan-type layer | 3 |
| `/for-organizations` | Organization/commercial page | Low | Medium | Low | High | None | Fixed organization-intent events implemented; outcomes not observed | Claims are bounded and product demonstrations are real | 23 | Usable but incomplete | Do not build enterprise features; conduct discovery and measure contact intent | 2 |
| Newsletter surfaces | Retention/commercial support | Medium | Medium | High | Medium | Multiple repeated signup locations | Submission and delivery evidence unresolved; Issue #57 remains relevant | Privacy language present | 18 | Weak | Verify Resend/domain/contact storage before treating newsletter as an owned-audience engine | 2 |
| Article and topic directories | Acquisition/navigation | High | Low | Low | Medium | Many topic hubs | Page/navigation events uneven | Article freshness and editorial transparency are strong | 21 | Usable but incomplete | Prioritize pages already earning impressions; avoid route-volume expansion | 3 |
| Trust, methodology, editorial, privacy, disclosures | Trust/legal | Low | Medium | Low | High indirect | None | Not a funnel priority | Strong, synchronized through build checks | 26 | Complete | Maintain and obtain qualified professional review before materially expanding risk | 3 |

## Duplicate and overlap findings

### 1. Workplace-benefits role ambiguity

Benefits Blueprint, Employer Benefits Action Plan, Benefits Change Detector, open-enrollment calculators, and Benefits Command Center are all useful, but their public role distinctions require discipline:

- **Benefits Change Detector:** what changed this year and what needs attention;
- **Benefits Blueprint:** what matters before opening the HR portal;
- **Employer Benefits Action Plan:** what to prioritize after entering real values;
- **Benefits Command Center:** deepest package workspace and Receipt;
- **Open-enrollment calculators:** narrow scenario calculations.

They should not be merged into one giant form, but CTAs must state these roles consistently.

### 2. Medicare comparison fragmentation

The site correctly preserves explanatory pages for Original Medicare, Medicare Advantage, Medigap, Part D, and plan marketing. The Medicare Plan Verification Checklist should become the action layer that these pages feed into. Creating another plan-comparison calculator would be duplicative and risk unsupported ranking.

### 3. Medical-bill entry-point density

The Toolkit, Review Flow, EOB Checker, financial-assistance screening, prior-authorization guide, observation guide, and discharge workspace are complementary. The Toolkit must remain the canonical command center, while each tool states the document or problem it owns. Existing handoffs are generally strong; analytics does not yet prove whether visitors understand the distinctions.

### 4. Financial-foundation overlap

Financial Foundation Checkup and Debt vs Retirement Router overlap intentionally. The Checkup diagnoses broad foundation weaknesses; the Router sequences one debt-versus-contribution conflict. They should share My Plan actions but not duplicate input or storage.

## Critical weaknesses

1. **Production analytics delivery is not yet verified.** Source code and tests are strong, but the connected tools currently do not expose event payloads or conversion reports.
2. **Roadmap decision tools do not share a standardized analytics funnel.** The newer Roth, debt, observation, Medicare checklist, and state-router journeys have high-quality results but inconsistent start/completion/action telemetry.
3. **Newsletter delivery is not proven.** Existing Issue #57 documents sender/domain and contact-save concerns. Newsletter capture should not be treated as a working retention engine until delivery is verified.
4. **Search Console evidence is unavailable in this execution context.** No ranking or impression-based content decision should be represented as evidence-backed until connected data is inspected.
5. **Organization demand is unvalidated.** The page is credible, but no customers, pilot commitments, or willingness-to-pay evidence exists.

## First readiness implementation batch

The highest-leverage code batch is a standardized, privacy-safe completion funnel for four high-value deterministic journeys:

1. Roth vs Traditional Decision Helper
2. Debt vs Retirement Router
3. Observation vs Inpatient Status Guide
4. Medicare Plan Verification Checklist

Why this batch:

- all four are already implemented, source-backed, ad-free, canonical, and testable;
- no new product or route is required;
- each serves a high-intent decision;
- each already has a useful action artifact and My Plan or next-journey behavior;
- the primary missing layer is consistent start, completion, result-action, and next-journey measurement;
- the changes can reuse existing analytics consent, fixed IDs, DecisionResultPanel, SaveNavigatorAction, and canonical routes;
- answer-level data is unnecessary and prohibited.

The State Medicaid router is equally important but carries a higher maintenance and privacy review burden. It should join the next batch after the fixed analytics pattern proves safe without transmitting state.

## Release risk assessment

- **Current production risk:** low; no active runtime defects were found.
- **First readiness batch risk:** low to moderate; analytics changes can silently overcollect if not strictly allowlisted.
- **Search expansion risk:** moderate; publishing without Search Console evidence could create overlap.
- **Organization expansion risk:** high if enterprise features are built before discovery evidence.
- **Advertising expansion risk:** high to trust and completion if product surfaces lose ad-free protection.

## Immediate decision

Proceed with:

1. the current documentation PR;
2. a focused implementation PR for the four-journey completion funnel;
3. exact-head CI and Vercel validation;
4. production verification;
5. Issue #152 and #157 production analytics verification;
6. no additional major product workflow until funnel visibility and indexing evidence improve.