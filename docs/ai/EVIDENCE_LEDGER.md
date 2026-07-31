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

## Usage rules

- Retrieve the underlying evidence during each assignment; do not cite this ledger as if it were the source itself.
- Mark unavailable or conflicting evidence rather than silently substituting a weaker class.
- Record model conclusions as `INFERENCE`, not fact.
- Current-state claims require `DIRECT-CURRENT` evidence whenever the system is accessible.
- Consequential external claims require `PRIMARY-SOURCE` evidence unless a documented reason prevents it.
- Screenshots and chat summaries may orient research but remain `STALE-OR-UNVERIFIED` until confirmed.
