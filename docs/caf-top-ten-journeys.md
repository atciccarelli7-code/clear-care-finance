# CAF Top Ten Decision Journeys

**Selection date:** July 13, 2026  
**Production base:** `b27770636ea1f783629871adc0f191de850e367a`  
**Parent issue:** #153  
**Dependencies:** #154 and #155

## Selection method

The ten journeys are ranked by:

- urgency and economic consequence;
- healthcare-specific differentiation;
- search and direct-demand potential;
- practical usefulness;
- recurring or return use;
- employer, association, or sponsor relevance;
- current product maturity;
- implementation and maintenance cost;
- privacy, legal, medical, insurance, tax, and employment risk;
- ability to reuse CAF's authoritative systems.

The list is deliberately not balanced evenly across every site category. It favors journeys where CAF can own a meaningful decision moment rather than publish interchangeable explanations.

## 1. Annual workplace-benefits review

**Canonical product:** `/tools/benefits-change-detector`  
**Primary artifact:** Benefits Change Receipt  
**Supporting routes:** acquisition article, Open Enrollment, Benefits Command Center, health-plan cost tools  
**Audience:** healthcare workers and other employees

### Why it is top ten

- Recurs annually.
- Combines cost, employer money, insurance risk, retirement, protection, family benefits, and quality of life.
- Produces a portable HR-ready artifact.
- Has strong organization-pilot relevance.
- Is difficult for generic content or AI summaries to replace.

### Main readiness gap

Production funnel delivery and annual-return behavior are implemented but not yet observed.

### Evidence gate

Measure acquisition article → Detector, review completion, Receipt actions, related journey openings, and local resume.

## 2. Complete benefits-package comparison

**Canonical product:** `/tools/benefits-command-center`  
**Primary artifact:** Benefits Receipt and two-package comparison  
**Supporting routes:** Benefits Blueprint, Employer Benefits Action Plan, total compensation, Open Enrollment  
**Audience:** healthcare workers and employees comparing current coverage, offers, or elections

### Why it is top ten

- CAF's deepest workplace-finance product.
- Connects compensation, health-plan economics, retirement capture, leave, hidden benefits, and qualitative work factors.
- Supports samples, guided activation, local packages, and return use.
- Strongest current commercial demonstration.

### Main readiness gap

Public role distinctions among Blueprint, Action Plan, Detector, calculators, and Command Center need measurement rather than another redesign.

### Evidence gate

Track activation path, package creation, Receipt view, comparison use, My Plan action, and return behavior.

## 3. Health-plan true-cost and risk comparison

**Canonical product:** `/tools/open-enrollment-true-cost-calculator`  
**Supporting routes:** Benefits Change Detector, HSA/FSA helper, Out-of-Pocket Max Estimator, Open Enrollment  
**Audience:** employees and families

### Why it is top ten

- High annual search intent.
- Directly affects paycheck cost and worst-year exposure.
- Naturally hands into the broader benefits system.
- Valuable to both individual users and organization pilots.

### Main readiness gap

Result handoffs into the Detector or Command Center are not yet measured as a single funnel.

### Evidence gate

Measure calculator completion, next-journey opening, and whether the visitor continues to a complete benefits review.

## 4. Healthcare-worker job and total-compensation decision

**Canonical product:** `/tools/healthcare-worker-total-compensation-comparison`  
**Journey hub:** `/healthcare-workers/career-decisions`  
**Supporting routes:** Benefits Command Center and healthcare-worker pay tools  
**Audience:** nurses and other healthcare workers comparing bedside, outpatient, specialist, device, operations, and health-technology roles

### Why it is top ten

- Strong healthcare-specific wedge.
- Connects direct cash, benefits, costs, time, schedule, call, commute, physical burden, flexibility, and career development.
- High emotional and financial importance.
- Strong direct sharing and career-community relevance.

### Main readiness gap

Comparison completion and continuation into benefits-package review are not yet evidenced in production.

### Evidence gate

Measure comparison completion, result actions, career-hub use, and Benefits Command Center continuation.

## 5. Medical-bill resolution command center

**Canonical product:** `/insurance/medical-bill-review-toolkit`  
**Primary artifacts:** problem routing, Medical Bill Review Flow, call/deadline tracker  
**Supporting routes:** EOB Checker, financial assistance, prior authorization, observation status  
**Audience:** patients and caregivers

### Why it is top ten

- High urgency and widespread confusion.
- Directly connects healthcare context with household financial protection.
- Organizes documents, calls, deadlines, affordability, authorization, and multiple-bill problems.
- Creates operational value beyond a static article.

### Main readiness gap

The ecosystem is complete technically, but tool-selection and tracker-use funnels are not reconciled into one observable journey.

### Evidence gate

Measure entry path, selected problem/tool, tracker use, official-source opening, and safe My Plan continuation.

## 6. Prior-authorization and denial navigation

**Canonical product:** `/tools/prior-authorization-next-step-guide`  
**Supporting routes:** Medical Bill Toolkit, discharge, insurance education  
**Audience:** patients, caregivers, and healthcare workers helping patients

### Why it is top ten

- High urgency and strong clinical-context differentiation.
- Deterministically separates submission, pending, missing-information, verbal-denial, formal-denial, urgent, drug, non-drug, and post-service pathways.
- Avoids storing diagnoses or medication names.
- Produces specific provider and plan questions.

### Main readiness gap

Production completion and official-source use are unobserved.

### Evidence gate

Verify start/completion/action events and monitor abandonment before expanding.

## 7. Hospital status and discharge financial protection

**Canonical products:** `/tools/observation-vs-inpatient-status-guide` and `/insurance/hospital-discharge-coverage`  
**Supporting route:** `/guides/hospital-discharge-medicare`  
**Audience:** patients and caregivers

### Why it is top ten

- Time-sensitive and financially consequential.
- Healthcare experience materially improves question quality.
- Connects status notice, payer, post-acute care, rehabilitation, home health, equipment, medication, transportation, and deadlines.
- Strong caregiver and organization-education relevance.

### Main readiness gap

The observation tool lacks the standardized start/result/next-journey analytics used by newer flagship products.

### Evidence gate

Instrument and observe completion, copy/print, My Plan action, and discharge-command-center handoff.

## 8. Turning 65 and Medicare enrollment timeline

**Canonical product:** `/medicare-care-costs/turning-65`  
**Supporting routes:** Medicare Plan Verification Checklist, Medicare Cost Exposure, SHIP and Plan Finder links  
**Audience:** people approaching Medicare and family helpers

### Why it is top ten

- Recurring national search demand.
- High penalty and coverage risk from timing mistakes.
- CAF's deterministic workflow handles employment, employer size, HSA, Part D creditable coverage, spouse coverage, Medigap timing, IRMAA, SHIP, and Social Security.
- Strong annual and family-helper return potential.

### Main readiness gap

Production resume and official handoff behavior are not yet observed.

### Evidence gate

Measure timeline completion, local resume, official-link use, and checklist continuation.

## 9. Medicare plan verification

**Canonical product:** `/tools/medicare-plan-verification-checklist`  
**Supporting routes:** Medicare options pages, Turning 65, Cost Exposure, Plan Finder  
**Audience:** Medicare users and caregivers

### Why it is top ten

- Converts fragmented plan comparison information into one practical verification task.
- Covers providers, drugs, pharmacies, authorization, costs, travel, Medigap timing, supplemental benefits, Annual Notice of Change, SHIP, and enrollment timing.
- Does not rank plans or carriers.
- Recurs annually.

### Main readiness gap

The checklist lacks standardized funnel analytics and observed completion behavior.

### Evidence gate

Measure start, progress band, copy/print, My Plan action, and Turning 65 or Plan Finder handoff.

## 10. Financial foundation and debt-versus-retirement sequencing

**Canonical products:** Financial Foundation Checkup on `/start-here` and `/tools/debt-vs-retirement-router`  
**Supporting routes:** student loans, 403(b) calculator, My Plan  
**Audience:** broad public, especially healthcare workers balancing debt and employer benefits

### Why it is top ten

- Creates repeat use every 90 days.
- Connects cash resilience, employer match, costly debt, student-loan protections, savings consistency, and protection review.
- Prevents isolated calculator decisions from ignoring financial fragility.
- Supports CAF's financial-independence mission without becoming generic budgeting content.

### Main readiness gap

The Checkup is mature, but the Debt vs Retirement Router lacks standardized completion and next-action measurement.

### Evidence gate

Measure Router completion, My Plan action, student-loan handoff, and repeated Checkup use.

## Near-term reserve list

These are important but remain outside the top ten until evidence or maintenance capacity improves.

### State Medicaid and Long-Term Care Router

High user value and strong differentiation, but all-state link maintenance and state-specific policy review create a larger operational burden. Standardized analytics must not transmit state.

### Childcare Benefits Decision Guide

Strong annual workplace-benefits use case, but tax-year maintenance and lower immediate urgency place it behind the selected benefits products.

### Student Loan Path Finder and PSLF Progress

Important to healthcare workers, but federal program volatility requires ongoing freshness capacity. They remain strong supporting journeys under the financial-foundation system.

### Newsletter

Potentially critical to retention, but sender-domain and actual delivery evidence must be resolved before newsletter capture is represented as a reliable flagship system.

## First implementation batch

The first focused code batch will complete and measure four selected journeys without adding a new route:

1. Roth vs Traditional Decision Helper — supporting retirement decision under Journey 10
2. Debt vs Retirement Router — Journey 10
3. Observation vs Inpatient Status Guide — Journey 7
4. Medicare Plan Verification Checklist — Journey 9

### Batch objective

Add a shared, fixed-value analytics contract covering:

- journey started;
- journey completed or result generated;
- result copied;
- result printed;
- journey reset;
- approved next journey opened.

Use only fixed tool and handoff identifiers. Do not transmit answers, checklist selections, financial or medical values, dates, state, plan/carrier/provider identity, Receipt text, URLs with query strings, or local-storage contents.

### Why no new product is needed

All four already have:

- canonical routes;
- deterministic logic;
- useful outputs;
- official sources;
- safe My Plan actions where appropriate;
- copy or print behavior;
- ad-free protection;
- tests and prerender coverage.

The missing layer is consistent completion evidence and accountable next-journey ownership.

## Decision rule after the batch

Do not authorize another major tool until:

- the batch is live and verified;
- production payload boundaries are inspected where possible;
- Issue #152 has an indexing and initial funnel baseline;
- newsletter delivery status is clarified;
- the next improvement is selected from observed friction, search evidence, or buyer discovery.