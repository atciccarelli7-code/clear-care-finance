# Community Acquired Finance Organization Offering System

**Decision date:** July 16, 2026
**Canonical route:** `/for-organizations`
**Release intent:** Replace the narrow exploratory pilot page with a complete, inspectable organization offering while preserving the no-account, no-sensitive-data product boundary.

## Executive decision

The organization product is a healthcare-specific financial education and decision-preparation layer. It is not a benefits administrator, care navigator, claims platform, payment platform, case-management system, insurance agency, clinical service, or individualized financial-planning service.

The public offering is now complete enough for a hospital, health plan, healthcare employer, school, association, staffing organization, post-acute provider, or community organization to:

1. identify the relevant buyer and audience;
2. inspect five working participant programs;
3. use a fixed-choice planner to create a review-ready brief;
4. understand implementation roles and gates;
5. adapt launch materials;
6. review measurement and claims boundaries;
7. complete an initial privacy, security, accessibility, professional-scope, and procurement review; and
8. decide whether CAF is the right vendor category before contacting CAF.

No enterprise backend, identity system, organization dashboard, HRIS/EHR/claims connection, custom pricing claim, certification claim, customer claim, or ROI claim was invented to make the offer appear mature.

## Products available now

| Program | Primary buyer problem | Released participant pathway | Organization deliverables |
|---|---|---|---|
| Benefits Decision Readiness | Open enrollment, new-hire elections, benefits changes | Benefits Blueprint, Change Detector, True Cost Calculator, Benefits Command Center | Launch sequence, orientation, privacy notice, aggregate engagement framework, findings review |
| Healthcare Cost Preparation | Pre-care cost questions, authorization, EOBs, bills, financial assistance | Medical Appointment Cost Preparation, Prior Authorization Guide, Medical Bill Review Flow and Toolkit | Pre/post-care pathways, staff handoff language, printable checklists, escalation links, correction route |
| Medicare, Medicaid, and Discharge Readiness | Coverage starting points, post-acute questions, discharge verification | Eligibility Check, Discharge Checklist, Medicare/Medicaid Guide, Discharge Coverage Guide | Caregiver launch path, coverage boundaries, agency handoffs, printable preparation, escalation review |
| Healthcare Career and Compensation Decisions | Role comparison, total compensation, transition risk | Total Compensation Comparison, Career Decision Center, Benefits Action Plan, 403(b) Calculator | Role-change pathway, offer checklist, facilitator guide, comparison template, feedback review |
| Healthcare Finance Navigation Library | Broad education access across several needs | Start Here, Tools, Topic Guides, Patients and Caregivers | Curated sequence, topic launch copy, safe usage framework, content review option, correction channel |

## Actual participant and buyer flow

```text
Buyer evaluates released public tools
        |
        v
Fixed-choice program planner (browser tab only)
        |
        v
Review-ready brief: program + modules + roles + launch + evidence + guardrails
        |
        v
Internal legal/privacy/security/accessibility/content review
        |
        v
Focused launch without a participant identity file
        |
        v
Aggregate evidence + limitations + expand/revise/stop decision
```

The planner asks only for four categorical selections: organization type, audience, first priority, and planning horizon. It has no free-text field. Selections are held in React state, do not enter the URL or local persistence, and are prohibited from the analytics payload.

## Operating model

### Open evaluation

The buyer and reviewers use the live public product, trust pages, source binder, and procurement matrix. No participant launch or commercial commitment is implied.

### Focused program

One audience, one decision moment, approved modules, accountable owners, approved launch channels, participant notice, support route, privacy-safe learning plan, and end review.

### Phased partnership

A second program, recurring education calendar, custom material, or additional measurement is considered only after the first phase demonstrates usefulness and the operating burden is understood. Final scope, pricing, data handling, service levels, and legal terms require a written agreement.

## Accountability model

| Responsibility | Organization | CAF | Joint |
|---|---|---|---|
| Define audience, decision moment, internal owner, and launch channel | Accountable | Consulted | Review |
| Public product, source governance, corrections, and release quality | Informed | Accountable | Review organization-specific implications |
| Plan, policy, clinical, legal, and participant communications | Accountable | Not authoritative | Review requested language |
| Privacy/security/accessibility/professional-scope due diligence | Reviewer/approver | Evidence owner | Resolve written questions |
| Participant support and emergency/case escalation | Accountable | Public product/correction channel only | Define handoff language |
| Reach data | Accountable | No participant list required | Reconcile only at aggregate level |
| Consented fixed-ID product engagement | Informed | Accountable when available | Interpret with limitations |
| ROI, claims, retention, enrollment, or health outcomes | Evidence owner or independent evaluator | No claim without evidence | Separate method and approval required |

## Data-flow and threat model

### Intended data flow

- public web access;
- no participant login or organization account;
- fixed-choice answers in the current browser tab;
- no answer values in analytics;
- consent-gated fixed event names and identifiers;
- copy/print occurs only when the participant requests it;
- organization reach and delivery data stays with the organization unless separately reviewed.

### Prohibited launch inputs

- name, email, phone, address, employee/member/student/patient identifier;
- diagnosis, medication, procedure, provider, facility, claim, account, medical-record, or plan identifier;
- organization participant file, eligibility file, payroll record, EHR record, claims record, or uploaded document;
- unrestricted case notes, brief contents, exact values, or URLs containing answers.

### Main misuse cases and controls

| Risk | Control in this release | Residual responsibility |
|---|---|---|
| Participant enters PHI or PII | No free text in organization planner; repeated participant notices; public tools use bounded inputs | Organization launch copy and facilitators must not request case details |
| Buyer mistakes education for administration or advice | Prominent scope boundary, fit/no-fit guide, procurement matrix, FAQ | Signed terms and organization communications must preserve boundary |
| Engagement is marketed as ROI | Evidence hierarchy and explicit outcome boundary | Any outcome study needs a separate method, lawful data access, and approval |
| Customization introduces plan or policy errors | Custom content is a scoped-review item, not current public capability | Organization content owner and appropriate legal/benefits/clinical reviewers approve |
| Certification is inferred from good practice | Page distinguishes standards informing review from conformance/certification | Independent assessment and documentation required before any claim |
| Buyer assumes HIPAA status from healthcare context | No blanket HIPAA claim; actual covered-entity/business-associate relationship must be analyzed | Legal/privacy review before any protected information or BAA discussion |
| Long page becomes difficult to navigate | In-page section navigation, clear hierarchy, five program cards, planner, tables, FAQ | Browser certification covers mobile/desktop navigation and overflow |

## Competitive benchmark and honest differentiation

The July 16 review covered official product pages from LearnLux, Financial Finesse, Brightside, HealthJoy, Included Health, and Cedar. Those vendors demonstrate mature capabilities in human coaching, benefit-aware navigation, employer reporting, payroll/eligibility/claims integration, care delivery, bill support, payments, or enterprise administration.

CAF does not claim parity with those capabilities. It is deliberately differentiated on:

- healthcare-specific benefits, cost, billing, Medicare/Medicaid, discharge, and career-decision depth in one public education system;
- inspectable working tools before a sales conversation;
- no-account evaluation and launch path;
- no participant identity file for the current offering;
- transparent math, assumptions, sources, uncertainty, and next actions;
- a deterministic program planner that produces an implementation and due-diligence brief without free text;
- an explicit vendor-fit rejection path when the buyer needs administration, integration, care delivery, licensed coaching, 24/7 concierge, or mature enterprise infrastructure.

“Best” is not treated as a publishable marketing fact. The proof standard is narrower and testable: CAF must be unusually complete and transparent within healthcare financial education and decision preparation, and it must tell buyers exactly where another vendor category is stronger.

## Measurement architecture

The page separates five evidence levels:

1. **Reach:** organization-owned eligible audience and channel delivery.
2. **Engagement:** consented fixed-ID views, starts, completions, and handoffs when available.
3. **Usefulness:** optional aggregate clear/useful/next-step pulse without case details.
4. **Operations:** timing, support, corrections, accessibility, and incidents.
5. **Outcomes:** enrollment, retention, claims, debt, savings, or ROI only through a separate valid method.

New organization events can identify that a planner or fixed asset was used. They cannot transmit organization type, audience, priority, timeline, buyer identity, participant identity, plan, case, answer, URL, or brief content.

## Release gates

- TypeScript and lint clean.
- Unit/UI tests cover the program catalog, recommendation logic, text export, page content, fixed-choice interaction, and analytics sanitization.
- Production build, prerender, sitemap, canonical, route, trust, freshness, AdSense, and bundle gates pass.
- `/for-organizations` remains indexable and ad-free.
- Browser certification runs at 390 px and 1440 px and completes a real program-planner state change.
- Exact-head GitHub checks and Vercel preview are green.
- Production is merged only after exact-head review, then the live route and planner are rechecked.

## Evidence that remains unavailable

- qualified buyer conversations and contact conversion;
- participant reach or completion baseline;
- production analytics event delivery and counts;
- customer, renewal, or implementation evidence;
- savings, claims, retention, enrollment, debt, or ROI outcomes;
- independent security or accessibility certification;
- verified HIPAA business-associate role or BAA;
- organization-specific service levels or public pricing.

These fields remain unverified and must not be converted into claims.
