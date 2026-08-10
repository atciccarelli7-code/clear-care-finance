# Community Acquired Finance Evidence Ledger

This ledger defines where material project facts must be verified, how evidence is classified, and when it becomes stale. It is a governance index, not a substitute for retrieving the underlying source.

## Evidence classes

| Class | Meaning | Examples |
|---|---|---|
| `DIRECT-CURRENT` | Retrieved directly from the authoritative system during the assignment | latest GitHub head, live route response, Vercel deployment state, current Search Console report |
| `PRIMARY-SOURCE` | Current controlling or original external source | IRS, CMS, DOL, BLS, statute, regulation, official plan document, issuer filing |
| `INTERNAL-RECORD` | Versioned project record or connected workspace artifact | decision ledger, source registry, approved Notion specification, Linear issue |
| `FOUNDER-CONFIRMATION` | Explicit founder decision or firsthand workflow experience | confirmed product direction, nursing workflow observation |
| `SECONDARY` | Reputable analysis used for context but not controlling authority | nonpartisan research organization, high-quality technical analysis |
| `INFERENCE` | Model or team conclusion derived from cited evidence | opportunity ranking, likely user behavior, architecture implication |
| `STALE-OR-UNVERIFIED` | Historical, indirect, screenshot-only, inaccessible, or not revalidated | old chat claim, prior deployment status, uncited metric |

## Authoritative source map

| Domain | Preferred evidence | Freshness expectation | Required caveat |
|---|---|---|---|
| Repository and code | GitHub latest `main`, relevant branch, PR diff, CI | every assignment | branch and commit SHA |
| Production behavior | live domain and affected routes, browser journey | every release or audit | exact route and date/time |
| Deployment/runtime | Vercel deployment, logs, domains, environment posture | every release or runtime claim | deployment ID/status and coverage |
| Database/auth | Supabase schema, migrations, RLS, project configuration | every implicated assignment | environment and access limits |
| Payments/entitlements | Stripe objects, webhook evidence, server code, feature flags | every implicated assignment | test/live mode and coverage |
| Search performance | Google Search Console | current reporting window | data lag and property coverage |
| Site analytics | connected analytics and event implementation | current reporting window | coverage date, consent, and event definition |
| Advertising | AdSense account/site status and current policy evidence | every approval or revenue claim | account coverage and decision date |
| Project planning | repository docs, Notion, Linear, Drive | when relevant | identify controlling record when conflicts exist |
| Tax/retirement | IRS, Treasury, DOL, official plan documents | verify for current year and claim | year, plan-specific, and jurisdiction limits |
| Medicare/Medicaid | CMS, Medicare.gov, Medicaid.gov, state agency, controlling law | verify at publication and freshness interval | geography, enrollment period, and plan variation |
| Insurance/benefits | official carrier/plan documents, DOL, CMS, state regulator | verify for affected plan/year | plan-specific variation |
| Labor/careers | BLS, official employer posting, collective agreement, employer policy | verify for current period | occupation/geography and employer specificity |
| Medical/patient education | authoritative clinical guideline, agency, professional body, peer-reviewed primary evidence | verify at publication and clinical review interval | educational scope and emergency boundaries |
| Legal/privacy | controlling law, regulator, official guidance, qualified review where needed | verify for jurisdiction and current date | not legal advice; unresolved jurisdiction issues |
| External platform behavior | official documentation and current product state | every material platform claim | version/date and account-specific limits |

## Claim record template

Use this structure when a material fact requires ongoing governance:

| Field | Required content |
|---|---|
| Evidence ID | Stable ID such as `CAF-E-001` |
| Claim or state | What the evidence supports |
| Domain | Category from the source map |
| Source | Exact system, document, route, or official authority |
| Evidence class | One class above |
| Verified date | Date of substantive verification |
| Coverage | Scope, account, jurisdiction, year, route, or population |
| Freshness trigger | Date or event requiring revalidation |
| Used by | Routes, calculations, documents, or decisions |
| Limitations | What the evidence cannot establish |
| Owner | Role or workflow responsible for maintenance |

## Initial governed evidence

### CAF-E-001 — Repository operating system

- **Claim or state:** The repository contains a mandatory multi-role agent operating system.
- **Domain:** Repository and code
- **Source:** GitHub PR #229 and `AGENTS.md`
- **Evidence class:** DIRECT-CURRENT
- **Verified date:** 2026-07-30
- **Coverage:** Repository governance only
- **Freshness trigger:** Changes to `AGENTS.md`, `.agents/skills`, or `docs/ai`
- **Used by:** All substantial AI-assisted assignments
- **Limitations:** Does not prove every future agent followed the system
- **Owner:** Context steward and quality/release

### CAF-E-002 — Platform mission and audience model

- **Claim or state:** Community Acquired Finance is a healthcare financial decision-support platform for healthcare workers, patients, and caregivers, with focused phased execution.
- **Domain:** Project planning
- **Source:** Founder-confirmed project direction and `docs/ai/PROJECT_CONTEXT.md`
- **Evidence class:** FOUNDER-CONFIRMATION
- **Verified date:** 2026-07-30
- **Coverage:** Strategy and information architecture
- **Freshness trigger:** Explicit founder revision or new validated strategy decision
- **Used by:** Product prioritization, navigation, content, monetization, and roadmap work
- **Limitations:** Does not determine the next feature without current evidence
- **Owner:** Executive strategy and context steward

### CAF-E-003 — Student-loan refinance and private/federal boundaries

- **Claim or state:** A private refinance comparison must distinguish federal debt, compare total cost rather than monthly payment alone, disclose fixed/variable and term/fee assumptions, and defer lender-specific protections to current loan documents and final disclosures.
- **Domain:** Legal/privacy and consumer finance
- **Source:** Consumer Financial Protection Bureau, `Should I consolidate or refinance my student loans?`; CFPB, `Choosing a student loan`; CFPB private student-loan repayment resources; Federal Student Aid dashboard/account guidance; current loan documents remain controlling for lender-specific terms.
- **Evidence class:** PRIMARY-SOURCE
- **Verified date:** 2026-07-31
- **Coverage:** General U.S. federal/private student-loan and consumer-protection boundaries; private-loan payoff/refinance educational calculator.
- **Freshness trigger:** 2027-01-31, substantive CFPB/Federal Student Aid change, partner activation, or a changed claim about federal protections, credit inquiries, prepayment, relief, cosigners, or tax/legal treatment.
- **Used by:** `/tools/private-student-loan-payoff-calculator`, `/student-loans`, `privateStudentLoanDecisionProduct`, CAF-D-007.
- **Limitations:** Does not establish individual eligibility, approval, forgiveness, discharge, tax treatment, cosigner release, hardship rights, a lender relationship, or the terms of any promissory note or final lender disclosure.
- **Owner:** Content/evidence integrity and privacy/legal protection

### CAF-E-004 — AdSense publisher-content and exclusion controls

- **Claim or state:** Google evaluates the connected site for AdSense review, instructs publishers to place ad code on pages where ads should appear, and supports page and section exclusions from Auto ads. These facts support selective route-level ad eligibility but do not establish a minimum eligible-page count, approval probability, traffic level, ad fill, RPM, or account approval state.
- **Domain:** Advertising and external platform behavior
- **Source:** Official Google AdSense Help: connect site to AdSense; page exclusions; excluded areas; ad-code placement; Auto ads optimization guidance.
- **Evidence class:** PRIMARY-SOURCE
- **Verified date:** 2026-07-31
- **Coverage:** Google AdSense product and policy guidance relevant to site connection, route eligibility, and exclusions.
- **Freshness trigger:** 2027-01-31, Google policy/product change, AdSense account review result, or material change to Auto ads/exclusion controls.
- **Used by:** `src/data/publisherArticleReviews.ts`, `src/lib/contentGovernance.ts`, `scripts/check-adsense-readiness.mjs`, CAF-D-009, PR #234.
- **Limitations:** Does not prove Google approves the site, sees all current pages immediately, values one route more than another, or will serve ads on any eligible route. Account-level settings and approval status remain owner-controlled evidence.
- **Owner:** Monetization/conversion, publishing/governance, and privacy/legal protection

### CAF-E-005 — Current growth baseline and server-only evidence controls

- **Claim or state:** The connected CAF operating dashboard records 8 organic clicks in its latest 28-day scorecard, a dated `/insurance` opportunity of 18 impressions, 0 clicks, and average position 11.28 through 2026-07-20, and no verified downstream behavioral denominators. The active Supabase project had no behavioral evidence table before PR #235. Supabase requires table privileges as well as RLS, and service credentials must remain on a trusted backend.
- **Domain:** Search performance, site analytics, database/auth, and external platform behavior
- **Source:** `CAF Growth & Revenue Operating Dashboard` in Google Sheets; current GitHub analytics implementation; direct Supabase schema inspection for project `uzfcvtgnpkvuapgrkfcb`; official Supabase documentation `Securing your API`, `Row Level Security`, and April 28, 2026 API-key/grants guidance.
- **Evidence class:** DIRECT-CURRENT for the connected dashboard/schema/code; PRIMARY-SOURCE for Supabase security behavior.
- **Verified date:** 2026-07-31
- **Coverage:** The dashboard's latest recorded 28-day summary, dated Search Baseline through 2026-07-20, current production repository, and the active CAF Supabase project.
- **Freshness trigger:** New Search Console export; 28 days after evidence-loop production release; Supabase schema or security change; or expansion to another tracked surface.
- **Used by:** `/insurance`, `api/evidence-event.ts`, `public.growth_events`, CAF-D-010, PR #235, AND-98.
- **Limitations:** Dashboard blanks are unverified rather than zero; the Search Console snapshot is small and dated; consented sessions are not representative of all visitors; event storage cannot establish user satisfaction or causality; official Supabase documentation does not validate this implementation without direct migration and privilege checks.
- **Owner:** Data/analytics, privacy/legal protection, and quality/release



### CAF-E-006 — Structured service-navigation release and bounded evidence controls

- **Claim or state:** PR #237 replaced eight generic overflow links and fourteen flat mobile choices with a four-group `Explore CAF` system, preserved six primary destinations and all 160 sitemap routes, and added two consent-gated fixed navigation events to the existing private `growth_events` table. The final release passed 558 unit tests, exact-head CI, browser accessibility/mobile/performance certification, Decision Journey validation, Supabase effective-access testing, production route smoke checks, and runtime-error review.
- **Domain:** Repository and code, production behavior, site analytics, database/auth, accessibility, and deployment/runtime
- **Source:** GitHub PR #237 and merge `08f6a051754acdf94dec94f0b564349acc7aa1ea`; Vercel production deployment `dpl_9K3StXWYyBXg5gnCTe5kkqPui1ZY`; CI `30676794553`; browser certification `30676794548`; Decision Journey `30676794615`; Supabase project `uzfcvtgnpkvuapgrkfcb` migration `service_navigation_evidence` and direct SQL/advisor verification; Notion release record; Linear AND-99.
- **Evidence class:** DIRECT-CURRENT
- **Verified date:** 2026-07-31
- **Coverage:** Exact implementation head `7f4788430ab251e9a404fcb358b0c518fce1d065`, merged production, representative worker/patient/Medicare/guide routes, the production evidence endpoint, and the active CAF Supabase project.
- **Freshness trigger:** Twenty-eight days after release; 25 distinct consented navigation-open sessions; any navigation, route, schema, privacy, consent, performance, accessibility, or production change.
- **Used by:** `src/components/layout/Header.tsx`, `src/data/serviceNavigation.ts`, the first-party evidence client and API, `public.growth_events`, CAF-D-011, CAF-W-008, AND-99, and experiment `SERVICE-NAVIGATION-2026-08`.
- **Limitations:** Open and selection events do not establish comprehension, satisfaction, task completion, causal impact, or representativeness of all visitors. The benchmark analysis was an expert heuristic review, not controlled usability testing. Consent and low traffic may prevent the 25-session threshold from being reached in the initial window.
- **Owner:** Product/information architecture, data/analytics, accessibility/reliability, privacy/legal protection, and quality/release.


### CAF-E-007 — Patient cost-sharing definitions and bounded estimate controls

- **Claim or state:** Deductibles, copayments, coinsurance, allowed amounts, and out-of-pocket limits are distinct plan terms whose service-specific sequence must be verified. The in-network out-of-pocket maximum does not establish that every premium, non-covered service, out-of-network charge, balance bill, or amount above the allowed amount is protected. A standardized Summary of Benefits and Coverage helps identify the applicable service row, while the current plan document, insurer accumulator, processed EOB, and provider bill control an individual case.
- **Domain:** Insurance/benefits, patient financial education, search performance, and repository/product evidence
- **Source:** HealthCare.gov glossary pages for deductible, copayment, coinsurance, allowed amount, cost sharing, and out-of-pocket maximum; CMS Summary of Benefits and Coverage guidance; founder-provided Search Console export dated 2026-08-01; GitHub PR #247.
- **Evidence class:** PRIMARY-SOURCE for insurance definitions; DIRECT-CURRENT for the search export and implementation evidence.
- **Verified date:** 2026-08-01
- **Coverage:** General U.S. educational health-insurance cost-sharing boundaries and the CAF route `/tools/health-insurance-visit-cost-calculator`.
- **Freshness trigger:** 2027-02-01; substantive HealthCare.gov/CMS change; any calculation discrepancy; changed route logic; or new post-release search/completion evidence.
- **Used by:** Patient Cost Share Calculator, `healthInsuranceCostShareDecisionProduct`, CAF-D-012, CAF-W-009, and PR #247.
- **Limitations:** Does not determine individual coverage, network status, medical necessity, prior authorization, claim adjudication, balance-billing rights, appeal rights, final allowed amount, or amount ultimately owed. Search impressions do not establish causality, demand size, comprehension, completion, or revenue.
- **Owner:** Content/evidence integrity, healthcare user research, privacy/legal protection, analytics, and quality/release.

### CAF-E-009 — Directional CTA baseline and route ownership evidence

- **Claim or state:** The sitemap contains 160 canonical routes. Before the CTA resolver, 37 routes received at least one global endcap and 14 received two or more; 14 dynamic ToolPage routes used `Open the tool`; the total-compensation hero did not enter its comparison; and three selected article handoffs used equal-weight next-step cards. Current dashboard evidence is too sparse and stale to establish CTA conversion or causality.
- **Domain:** Repository/code, information architecture, analytics/privacy, search inventory, and product truthfulness.
- **Source:** `docs/audits/2026-08-03-directional-cta-route-inventory.csv`; sitemap; route/action configs; current production inspection; connected Growth & Revenue dashboard snapshot through 2026-07-20; Stripe/Supabase release boundaries; independent role reviews.
- **Evidence class:** DIRECT-CURRENT for code, routes, product availability, and deployment baseline; STALE-OR-INCOMPLETE for conversion performance; INFERENCE for likely decision-burden reduction.
- **Verified date:** 2026-08-03.
- **Coverage:** All 160 canonical routes at inventory level; detailed implementation on 30 routes; three article pilot handoffs; 14 dynamic tool routes.
- **Freshness trigger:** Any route/endcap/action registry change; 28 days after release; adequate consented completion data; navigation/insurance experiment interpretation; or direct user research.
- **Used by:** CAF-D-014, CAF-W-011, AND-104, CTA build contracts, and the route inventory generator.
- **Limitations:** Click selection does not establish comprehension, satisfaction, task completion, revenue, or causal lift. Consented analytics are not representative of all visitors. The route inventory uses governed classifications and a ranked backlog, not direct testing of every page with users.
- **Owner:** Product, information architecture, frontend/systems, analytics/privacy, SEO, accessibility, and quality/release.

### CAF-E-010 — Hospital financial-assistance policy and screening evidence

- **Claim or state:** The 2026 HHS poverty guideline is $15,960 plus $5,680 per additional person in the contiguous states/DC, $19,950 plus $7,100 in Alaska, and $18,360 plus $6,530 in Hawaii. North Carolina's current participating-hospital program publishes a 100% discount below 200% FPG, at least 75% from 200–250%, and at least 50% from 250–300% for insured and uninsured North Carolina residents, subject to program and hospital terms. Eighteen launch records have current official hospital/system policy, application, or controlling financial-assistance sources; absent terms are not inferred.
- **Domain:** Hospital financial assistance, medical bills, income-screening math, state program rules, privacy, and search architecture.
- **Source:** HHS/ASPE 2026 poverty guidelines; IRS Sections 501(r)(4) and 501(r)(6); NCDHHS Medical Debt program and hospital-policy list; official Atrium, Novant, Duke, UNC, WakeMed, ECU, Cone, Mission, Cleveland Clinic, Mass General Brigham, Johns Hopkins, Mayo Clinic, UPMC, Stanford, Cedars-Sinai, Northwestern, Mount Sinai, and Providence sources recorded in `src/data/hospitalFinancialAssistancePolicies.ts`; settled Search Console export reconciliation dated 2026-07-29.
- **Evidence class:** PRIMARY-SOURCE for federal/state/system policy terms; DIRECT-CURRENT for repository, production, and release validation; STALE-OR-INCOMPLETE for lagged Search Console performance; INFERENCE for product prioritization and future demand.
- **Verified date:** 2026-08-06.
- **Coverage:** 2026 U.S. poverty-guideline screening and the 18 named system records; North Carolina statewide terms only where NCDHHS says they apply.
- **Freshness trigger:** January 2027; new annual HHS guidelines; policy effective-date/source change; hospital merger; broken link; reported discrepancy; or calculation defect.
- **Used by:** `/tools/financial-assistance-checklist`, national/state hubs, 18 policy routes, CAF-D-015, CAF-W-012, measurement/query maps, and maintenance documentation.
- **Limitations:** A published threshold does not determine eligibility. Coverage can vary by facility, service, provider, residency, date, insurance status, and hospital income/household method. The launch set is not a national directory. Search Console data is lagged and cannot prove demand, causality, comprehension, or ranking lift.
- **Owner:** Content/evidence integrity, healthcare user research, privacy/legal protection, SEO/discovery, product, analytics, and quality/release.

### CAF-E-011 — Medicare decision, marketing boundary, and multi-product isolation evidence

- **Claim or state:** Medicare.gov distinguishes Original Medicare and Medicare Advantage across provider choice, cost structure, drug coverage, prior authorization, and travel; plan-specific drug and local plan comparison belongs in Medicare Plan Finder; working-past-65/HSA and MA-to-Original/Medigap transitions require timing and rights verification. Current 42 CFR Parts 422 and 423 and CMS guidance regulate plan communications, marketing, TPMOs, agents, and brokers; CAF's implementation is narrowed to independent education with no sponsor relationship, compensation, enrollment, leads, insurer ordering, or plan-specific recommendation. The active Supabase project now contains two private-build products, forced RLS, and a transactionally verified product-specific workspace boundary.
- **Domain:** Medicare education, insurance regulatory boundary, product architecture, payments, database/auth, privacy, and accessibility.
- **Source:** Medicare.gov comparison, Plan Finder, working-past-65, Medigap, cost-assistance, and plan-type resources; Social Security Medicare sign-up; Medicaid.gov and SHIP; CMS Medicare Communications and Marketing Guidelines page; eCFR 42 CFR Parts 422 and 423; current repository; direct Supabase project `uzfcvtgnpkvuapgrkfcb` migration and rolled-back policy test.
- **Evidence class:** PRIMARY-SOURCE for Medicare and regulatory facts; DIRECT-CURRENT for repository, production baseline, Supabase product/RLS state, and test results; INFERENCE for legal risk narrowing and product-investment value.
- **Verified date:** 2026-08-09.
- **Coverage:** U.S. federal baseline with explicit state-specific handoffs, 2026 plan-year source registry, both CAF premium products, and the Medicare public/private routes.
- **Freshness trigger:** Source registry review dates; 2027 plan-year update; CMS/eCFR change; state-specific feature; Stripe test/live configuration; schema/RLS change; or regulated commercial relationship.
- **Used by:** Medicare Coverage Decision System, `src/data/medicareCoverageSources.ts`, product/workspace registries, checkout/webhook/entitlement layers, CAF-D-016, CAF-W-013, and the Medicare work packet.
- **Limitations:** Educational narrowing is a risk-control decision, not a legal opinion. No authorized Stripe test-mode surface was available, so code-level payment tests do not establish a real hosted Checkout/webhook/refund cycle. Search Console evidence was unavailable and no user study has yet established comprehension or value.
- **Owner:** Product, content/evidence, healthcare user research, privacy/legal protection, systems/security, accessibility, monetization, and quality/release.

### CAF-E-012 — August 10 search baseline and flagship outcome-evidence gap

- **Claim or state:** The August 10, 2026 Search Console Web export covers daily data from 2026-06-21 through 2026-08-08 and reports 17 daily clicks/1,490 impressions, while the page table reports 18 clicks/1,992 impressions. The disclosed query table contains 396 rows, 0 clicks, and 862 impressions because low-volume click queries are privacy suppressed. Qualified near-winners include the hospital 403(b) article (2 clicks, 124 impressions, position 8.15), nurse 403(b) contribution article (1/23/6.04), total-compensation tool (1/10/8.10), facility-fee article (0/48/12.50), check-assistance-before-paying page (0/13/4.92), and EOB/bill matcher (0/9/5.22). The active first-party `growth_events` table contained 12 navigation/offer events and no flagship lifecycle result evidence.
- **Domain:** Search performance, site analytics, product strategy, database/auth, and privacy.
- **Source:** Founder-provided August 10 Search Console export `communityacquiredfinance.com-Performance-on-Search-2026-08-10.zip`; current production/main/Vercel reconciliation; direct Supabase project `uzfcvtgnpkvuapgrkfcb` query; July 21 Library research *What Makes Websites Succeed and What Community Acquired Finance Should Become*; detailed reconciliation in the dated work packet.
- **Evidence class:** DIRECT-CURRENT for GSC, code, production, Vercel, and Supabase; INTERNAL-RECORD for the research paper; INFERENCE for opportunity clustering and the selected intervention.
- **Verified date:** 2026-08-10.
- **Coverage:** Web search only for the exported property/window; current first-party event store; five selected released flagships.
- **Freshness trigger:** New Search Console export; 2026-09-07; 25 consented first-party views for any selected journey; analytics schema/consent change; or a major product/SEO release.
- **Used by:** CAF-D-017, CAF-W-014, `public.journey_events`, the first-party journey evidence API/client, and `docs/work-packets/2026-08-10-first-party-journey-evidence.md`.
- **Limitations:** GSC tables are intentionally non-additive and cannot be reliably joined at this low volume; rankings and impressions do not establish product value, causality, conversion, or willingness to pay. Consented first-party sessions are not representative of all visitors, and lifecycle events do not establish comprehension or satisfaction.
- **Owner:** Data/analytics, SEO/discovery, product, privacy/legal protection, and quality/release.

### CAF-E-013 — First-party flagship journey evidence production release

- **Claim or state:** CAF's consent-gated, answer-free flagship lifecycle evidence system is released. PR #270 merged at `5848f129e80efdd389cc367e36b8cd1dcb6e9fef`; production deployment `dpl_CXZYmwB4wq2QAU3dJbgznAeXFHfs` was READY with 12 Node functions and the canonical production alias. A controlled allowlisted POST returned 202 and persisted the exact fixed event fields; an invalid journey returned 400, a foreign origin returned 403, and the controlled row was deleted with zero retained synthetic rows. Exact-head CI #1053, Decision Journey #730, and Browser certification #666 passed.
- **Domain:** Product analytics, production release, privacy, database security, accessibility, and reliability.
- **Source:** GitHub PR/run/deployment metadata; Vercel deployment, build, and runtime logs; direct production route/API responses; direct Supabase read and exact-row cleanup; browser artifact `browser-certification-31400534644` digest `sha256:16dc3fc35422f0dff968e800603f26a11bd8ce5dc348b9ae7ea91e0d272d1231`.
- **Evidence class:** DIRECT-CURRENT for release, runtime, database, and browser evidence; no user-value claim is made.
- **Verified date:** 2026-08-10.
- **Coverage:** Five explicitly instrumented flagships, the strict shared journey contract, production server boundary, and private `public.journey_events` store.
- **Freshness trigger:** Any schema, event-contract, consent, privacy, endpoint, deployment, or flagship-flow change; 2026-09-07; or 25 consented view sessions for any journey.
- **Used by:** CAF-D-017, CAF-W-014, the dated work packet, and future aggregate product-measurement reports.
- **Limitations:** The release event was synthetic and deleted. No organic production sample, user comprehension evidence, causality, conversion, retention, or willingness-to-pay evidence exists yet. Preview writes fail closed because privileged Supabase credentials are production-only. Vercel's successful build log contains a non-fatal cancellation diagnostic before `Build Completed`.
- **Owner:** Product, data/analytics, privacy/legal protection, systems/security, accessibility, and quality/release.

## Usage rules

- Retrieve the underlying evidence during each assignment; do not cite this ledger as if it were the source itself.
- Mark unavailable or conflicting evidence rather than silently substituting a weaker class.
- Record model conclusions as `INFERENCE`, not fact.
- Current-state claims require `DIRECT-CURRENT` evidence whenever the system is accessible.
- Consequential external claims require `PRIMARY-SOURCE` evidence unless a documented reason prevents it.
- Screenshots and chat summaries may orient research but remain `STALE-OR-UNVERIFIED` until confirmed.
