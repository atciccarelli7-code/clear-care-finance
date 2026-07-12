# Community Acquired Finance — Next-Generation Product Roadmap

**Assessment date:** July 12, 2026

## Purpose

This roadmap begins after the known comprehensive-site gaps have been addressed. It does not repeat the Medicaid, childcare, Roth/traditional, observation-status, Medicare-verification, financial-assistance, Turning 65, medical-bill, discharge, Benefits Command Center, or Financial Navigator work already completed.

The standard for a new product is not novelty. It must solve a consequential visitor problem, reuse current infrastructure, minimize data collection, remain sourceable, and produce a practical next action.

## High-confidence immediate opportunities

### 1. Benefits Change Detector

- **Visitor problem:** Employees struggle to identify what actually changed between last year's benefit documents and the new enrollment year.
- **Proposed solution:** A private, no-upload comparison checklist where the visitor marks changes in premium, deductible, network, formulary, employer contribution, retirement match, PTO, disability, life insurance, and dependent-care benefits.
- **Why genuinely new:** Existing tools compare plans and packages, but none focus specifically on year-over-year change detection.
- **Why it belongs:** It turns open enrollment from a full reread into a targeted verification process.
- **Reuse:** Benefits Command Center, Open Enrollment checklist, Tools registry, My Plan fixed actions.
- **Recommended route:** `/tools/benefits-change-detector`
- **Format:** Guided checklist and printable change receipt.
- **User value:** High.
- **Search opportunity:** “What changed in my benefits this year,” “compare open enrollment changes.”
- **Retention opportunity:** Annual repeat use.
- **Monetization compatibility:** Ad-free tool; supporting educational article may be publisher eligible.
- **Privacy sensitivity:** Moderate; use categories and broad differences, no employer or plan names.
- **Legal risk:** Moderate; must not interpret plan rights.
- **Sources:** Employer documents, DOL, IRS, HealthCare.gov.
- **Maintenance:** Low-medium.
- **Technical complexity:** Medium.
- **First milestone:** Define a fixed change taxonomy and print-safe receipt.
- **Next major workstream:** Strong candidate.

### 2. Medical Appointment Cost Preparation Sheet

- **Visitor problem:** Patients know an appointment or procedure is coming but do not know which questions to ask before care.
- **Proposed solution:** A service-agnostic preparation sheet for network, site of service, prior authorization, facility fees, professional bills, anesthesia/pathology/lab bills, estimate rights, and payment or assistance options.
- **Why genuinely new:** Existing tools help after a bill or authorization issue; this product moves the workflow before care.
- **Why it belongs:** Preventive financial navigation is a natural extension of the medical-bill toolkit.
- **Reuse:** Prior Authorization Guide, Medical Bill Toolkit, insurance glossary, fixed My Plan actions.
- **Recommended route:** `/tools/medical-appointment-cost-preparation`
- **Format:** Guided checklist with copy/print output.
- **User value:** High.
- **Search opportunity:** “How much will my procedure cost,” “questions to ask before surgery bill.”
- **Retention opportunity:** Repeat use before major care episodes.
- **Monetization compatibility:** Ad-free.
- **Privacy sensitivity:** High; no procedure, diagnosis, provider, or insurer names.
- **Legal risk:** Moderate-high; cannot guarantee estimates or coverage.
- **Sources:** CMS, HealthCare.gov, CFPB, No Surprises Act resources.
- **Maintenance:** Medium.
- **Technical complexity:** Medium.
- **First milestone:** Build the fixed question taxonomy and payer/provider call split.
- **Next major workstream:** Strong candidate.

### 3. Healthcare Shift-Work Cash-Flow Calendar

- **Visitor problem:** Shift workers with overtime, differentials, irregular schedules, and biweekly pay struggle to distinguish dependable income from variable income.
- **Proposed solution:** A local-only planning calendar that classifies baseline pay, optional overtime, differentials, recurring obligations, and annual benefit deductions without connecting payroll or banking.
- **Why genuinely new:** Existing paycheck tools calculate earnings; this would plan around income variability and pay-cycle timing.
- **Why it belongs:** It uses the founder's nursing and hospital-shift understanding to create a differentiated finance tool.
- **Reuse:** Healthcare-worker paycheck tools, overtime calculator, Financial Foundation Checkup, My Plan.
- **Recommended route:** `/tools/shift-work-cash-flow-calendar`
- **Format:** Browser-local calendar and baseline-income summary.
- **User value:** High for nurses and allied health workers.
- **Search opportunity:** “budget with overtime,” “biweekly nurse budget,” “shift differential budgeting.”
- **Retention opportunity:** Monthly or pay-period reuse.
- **Monetization compatibility:** Ad-free workspace.
- **Privacy sensitivity:** High; use local storage, bounded values, reset controls, no analytics values.
- **Legal risk:** Low-moderate.
- **Sources:** Educational; calculations documented internally.
- **Maintenance:** Medium.
- **Technical complexity:** Medium-high.
- **First milestone:** Define baseline-versus-variable income logic and a privacy-safe storage schema.
- **Next major workstream:** Strong candidate after legal/privacy review of the local model.

### 4. Caregiver Financial Triage Board

- **Visitor problem:** A caregiver managing discharge, Medicare, Medicaid, bills, transportation, medications, and time away from work becomes overwhelmed by disconnected tasks.
- **Proposed solution:** A browser-local board that groups fixed tasks into today, this week, waiting, and verified without storing patient details.
- **Why genuinely new:** Existing discharge and Medicaid tools generate next steps; this product would coordinate those fixed actions across a care episode.
- **Why it belongs:** It compounds the site's caregiver workflows while preserving data minimization.
- **Reuse:** My Plan action registry, Hospital Discharge Command Center, Medical Bill Toolkit, Medicaid router, Medicare checklist.
- **Recommended route:** `/caregiver-triage`
- **Format:** Local fixed-action workspace.
- **User value:** High.
- **Search opportunity:** Moderate; strongest value is retention and task completion.
- **Retention opportunity:** Very high during a care episode.
- **Monetization compatibility:** Ad-free.
- **Privacy sensitivity:** High; no patient name, diagnosis, provider, insurer, or unrestricted notes.
- **Legal risk:** Moderate.
- **Sources:** Existing source-backed journeys.
- **Maintenance:** Medium.
- **Technical complexity:** Medium.
- **First milestone:** Map existing fixed actions into a caregiver-safe subset.
- **Next major workstream:** Strong candidate.

## Strategic medium-term opportunities

### RN Income Resilience Scorecard

Help healthcare workers assess how much income depends on overtime, nights, weekends, call, bonus, physical capacity, and one employer. The output should identify concentration risk and career-capital actions, not assign a simplistic score or tell someone to change jobs.

### Before-You-Resign Benefits Timeline

A date-oriented checklist for insurance end date, PTO, vesting, retirement loans, HSA/FSA deadlines, COBRA, marketplace enrollment, final paycheck, licensing, and replacement income. It must avoid employment-law conclusions.

### Medicare Annual Review Workspace

A recurring September–December workspace for Annual Notice of Change review, provider and drug verification, Plan Finder preparation, SHIP questions, and enrollment confirmation. Store only categorical completion statuses.

### Medical Debt Resolution Timeline

A fixed-action timeline from bill receipt through claim processing, itemized bill, EOB comparison, financial assistance, payment plan, appeal, and collection notices. Avoid determining liability or legal collectability.

### Employer Benefits Question Library

A searchable library of exact questions to ask HR about match, vesting, HSA eligibility, disability definitions, life insurance conversion, tuition repayment, childcare, PTO, call, travel, and termination dates. This is more useful than another broad article and can connect directly into My Plan.

### Source Freshness Ledger

A public-facing transparency page showing high-risk figures, effective year, last review date, next planned review, and official source. This would strengthen authority and make freshness governance visible rather than only build-time infrastructure.

## Experiments

### One-Minute Financial Triage

A very short homepage mode that asks only the problem category and deadline, then routes to the correct full journey. Test whether this improves completion without competing with Start Here.

### Visual “Who Pays What” Maps

Interactive but non-personal diagrams for one hospital visit, Medicare plus Medigap, employer health plans, skilled versus custodial care, and dependent-care tax coordination. Measure whether diagrams improve tool starts and source clicks.

### Printable Call Scripts

Fixed, non-identifying call scripts for hospital billing, insurer claims, prior authorization, SHIP, state Medicaid, HR, and student-loan servicing. They should be concise, source linked, and never insert case-specific claims.

### Financial Terminology Translator

A controlled glossary assistant that maps a term from a bill, EOB, benefits guide, or Medicare notice to a plain-English definition and the right canonical guide. Avoid free-form legal or coverage interpretation.

## Opportunities requiring backend infrastructure

### Cross-device My Plan

Would require accounts, authentication, encryption, retention, deletion, breach response, access controls, and revised legal documents. The current browser-local model should remain until a separately approved architecture exists.

### Secure document comparison

Comparing SBCs, EOBs, bills, or benefit guides could be useful but would introduce sensitive uploads, OCR, vendor processing, retention, and security obligations. Do not implement as a routine upload feature.

### Reminder delivery

Email or SMS reminders could improve completion but must avoid sensitive subject lines and payloads. A future system should send only generic fixed task labels and require explicit consent and deletion controls.

### Employer benefits aggregation

Automatic HR or payroll connections would create contractual, security, support, and privacy burdens. This remains a long-term product category rather than a website feature.

## Opportunities requiring attorney review

- Personalized insurance or Medicare-plan recommendations.
- State-specific Medicaid financial rules or estate-recovery advice.
- State-specific medical-debt or collection rights.
- Automated appeals using individual facts.
- Affiliate or referral relationships with insurers, advisers, lenders, brokers, providers, or benefits vendors.
- Personalized investing, tax, or debt recommendations based on stored financial profiles.
- Any system storing health or financial documents.
- Any claim that a compliance framework, disclaimer, or technical safeguard eliminates legal exposure.

## Ideas not worth pursuing under the current model

- Generic daily finance news.
- High-volume AI-written SEO articles.
- Stock picks or portfolio recommendations.
- “Best Medicare plan” or “best insurance company” rankings.
- Lead-generation quizzes disguised as educational tools.
- Ads inside decision tools, results, workspaces, or urgent healthcare instructions.
- A national Medicaid calculator claiming official eligibility.
- Medical-bill tools claiming a balance is invalid, fraudulent, uncollectible, or not owed.
- Unrestricted user notes containing medical, employer, tax, or financial details.
- A social feed or community forum requiring moderation of personal medical and financial cases.

## Recommended next workstream

The strongest next major workstream is a **Preventive Healthcare Cost Preparation System** combining:

1. Medical Appointment Cost Preparation Sheet.
2. Fixed provider and payer call scripts.
3. Estimate, network, authorization, facility-fee, and multi-bill verification.
4. A handoff into the existing Medical Bill Toolkit if the final bill differs from the preparation record.
5. Privacy-safe completion analytics and fixed My Plan actions.

This direction is genuinely new, uses the site's strongest healthcare-finance differentiation, provides value before financial harm occurs, and does not require accounts or sensitive document uploads.
