# Community Acquired Finance — Ranked Next Opportunities

**Assessment date:** July 12, 2026  
**Prepared after:** Tools-directory architecture, decision-journey foundation, trust-layer review, telemetry hardening, and hospital financial-assistance screening implementation.

## Decision standard

A proposed feature should move a visitor from a real question to a safe next action. It should reuse existing architecture, avoid sensitive-data collection, use authoritative sources, remain maintainable, and create more value than another generic article.

No item below should be described as risk free. Legal, tax, insurance, healthcare, employment, privacy, and advertising obligations can change and may require professional review.

## Immediate next work

### 1. State-aware Medicaid and long-term-care routing

- **Visitor problem:** “Could Medicaid help pay for long-term care in my state, and where do I apply?”
- **Product:** State-aware decision router with official agency handoffs, not a national eligibility calculator.
- **Reuse:** Medicare/Medicaid Eligibility Check, decision-journey framework, official-source components, freshness governance.
- **Route:** Strengthen `/tools/medicare-medicaid-eligibility-check`; avoid a competing route unless the current experience becomes unmanageably broad.
- **Format:** Guided flow + state resource directory + printable verification checklist.
- **User value:** Very high; families often confuse Medicare skilled coverage, custodial care, Medicaid eligibility, and home/community programs.
- **Search opportunity:** High-intent long-tail searches by state and care setting.
- **Privacy sensitivity:** High. Use broad categories; do not request names, addresses, diagnoses, account numbers, exact assets, or documents.
- **Legal/regulatory risk:** High because rules vary by state and program.
- **Sources:** Medicaid.gov, state Medicaid agencies, state aging/disability agencies, CMS, Medicare.gov.
- **Maintenance:** High; requires state-link and review-date governance.
- **Complexity:** High.
- **First step:** Create a source-maintained state agency registry and a national branching model that never calculates official eligibility.
- **Next Codex assignment:** **Yes**, after current branch is reviewed.

### 2. Childcare and dependent-care benefits workflow

- **Visitor problem:** “Should I use a Dependent Care FSA, employer childcare benefit, or tax credit?”
- **Product:** Current-year household coordination and verification workflow.
- **Reuse:** Benefits Command Center, Employer Benefits Action Plan, tool directory, My Plan registry, freshness checks.
- **Route:** Dedicated tool route connected from open enrollment and workplace benefits.
- **Format:** Guided decision tool with contribution-planning estimate and HR/tax verification checklist.
- **User value:** High for working families and healthcare workers with shift-based childcare needs.
- **Search opportunity:** Strong, especially around open enrollment and childcare-cost pressure.
- **Privacy sensitivity:** Moderate. Use broad expense and household categories; avoid dependent names and exact identifying details.
- **Legal/tax risk:** Moderate to high; interactions depend on current IRS rules and household facts.
- **Sources:** IRS publications/forms/instructions, Department of Labor, employer plan documents.
- **Maintenance:** Annual tax-year review.
- **Complexity:** Medium-high.
- **First step:** Verify 2026 limits and the interaction rules before implementing calculations.
- **Next Codex assignment:** **Yes**, paired with source verification.

### 3. Roth versus traditional decision tool

- **Visitor problem:** “Should my next contribution be Roth or traditional?”
- **Product:** Qualified factor comparison, never a universal winner.
- **Reuse:** 403(b) calculator, Financial Navigator, retirement articles, My Plan.
- **Route:** Dedicated tool route; link from 403(b), Build Wealth, and open enrollment.
- **Format:** Guided comparison + explanation of uncertainty + split-contribution option.
- **User value:** High and broadly applicable.
- **Search opportunity:** High, but competitive; differentiation comes from healthcare-worker pensions, 403(b), 401(a), and early-retirement context.
- **Privacy sensitivity:** Moderate. Use tax-rate bands and broad ranges rather than exact income.
- **Legal/tax/investment risk:** Moderate-high.
- **Sources:** IRS and official retirement-plan guidance.
- **Maintenance:** Annual tax and retirement-rule review.
- **Complexity:** Medium.
- **First step:** Define deterministic factor weights and prohibit “winner” language when evidence is mixed.
- **Next Codex assignment:** **Yes**.

### 4. Observation versus inpatient status guide

- **Visitor problem:** “Was this hospital stay observation or inpatient, and what could that affect?”
- **Product:** Status-verification and discharge-planning guide.
- **Reuse:** Medical Bill Toolkit, Hospital Discharge Command Center, Medicare guide, My Plan action registry.
- **Route:** Focused tool route linked from discharge and billing hubs.
- **Format:** Guided flow with written-notice, order-status, Medicare, SNF, and discharge questions.
- **User value:** High for caregivers facing post-acute planning and unexpected cost sharing.
- **Search opportunity:** Strong high-intent healthcare search.
- **Privacy sensitivity:** High; no diagnosis or patient identity.
- **Legal/coverage risk:** High. The tool must not decide status or coverage.
- **Sources:** Medicare.gov, CMS notices, official appeal resources.
- **Maintenance:** Moderate.
- **Complexity:** Medium.
- **First step:** Reuse the uncertainty pattern from Prior Authorization and the new Financial Assistance screening.
- **Next Codex assignment:** **Yes**.

### 5. Expand safe My Plan coverage

- **Visitor problem:** “I completed a tool, but I do not want to lose the next step.”
- **Product:** Fixed-action save controls on consequential tools.
- **Reuse:** `SaveNavigatorAction`, recommendation registry, return summary.
- **Route:** Existing focused tool pages only.
- **Format:** Integration pass, not a new product.
- **User value:** High compounding value across the entire platform.
- **Search opportunity:** Indirect; improves retention and task completion.
- **Privacy sensitivity:** Low only if fixed IDs are used.
- **Legal risk:** Low-moderate; action text must remain qualified.
- **Maintenance:** Low after registry discipline.
- **Complexity:** Medium.
- **First step:** Map every major tool to an existing safe action; add new fixed actions only when necessary.
- **Next Codex assignment:** **Yes**, potentially combined with the Roth or Medicaid workstream.

## Medium-term opportunities

### Medicare plan verification checklist

Unify existing Original Medicare, Medicare Advantage, Medigap, Part D, network, drug, travel, prior-authorization, and out-of-pocket assets into one plan-verification workflow. Do not rank plans or carriers. Reuse Turning 65, Medicare cost exposure, Plan Finder, and SHIP handoffs.

### Healthcare-role transition workspace

Create a bounded pre-resignation and onboarding checklist for benefits end dates, COBRA/coverage timing, retirement vesting, PTO, licensing, travel/call expectations, training, and compensation verification. Do not interpret contracts or advise resignation.

### Protection review router

Help visitors identify which disability, life, liability, and emergency-fund questions to investigate. Do not recommend insurers, policy amounts, or products as personalized advice.

### Emergency-fund range planner

Only build this if it reuses the Financial Foundation Checkup assumptions and does not create a competing financial plan. Use employment stability, dependents, insurance exposure, and planned expenses as broad factors.

### Medicare/Medicaid caregiver handoff sheet

A printable, non-identifying sheet for questions, documents, agency contacts, and deadlines. It should contain no patient data unless the visitor writes it after printing outside the website.

### Tool completion and official-source funnel review

Use the privacy-safe event taxonomy to evaluate starts, completions, next-step opens, official-source opens, and fixed My Plan actions. Do not add answer-level tracking to make the dashboard more detailed.

## Ideas requiring additional policy research

1. State-by-state Medicaid financial thresholds or asset rules.
2. Estate recovery explanations by state.
3. Current federal student-loan repayment and forgiveness changes.
4. State surprise-billing protections beyond federal No Surprises Act orientation.
5. Tax-credit and Dependent Care FSA interaction calculations.
6. Overtime tax deduction implementation details and future-year continuation.
7. Medicare premiums, deductibles, IRMAA brackets, Part D changes, and enrollment penalties by effective year.

These should not be encoded from secondary summaries or memory. Use current official sources and build explicit review dates.

## Ideas requiring backend infrastructure

### Cross-device account synchronization

Potential value is high, but it would materially change the privacy, security, authentication, retention, breach-response, legal-document, and operational burden. Do not implement without a separately approved architecture and threat model.

### Secure document upload or extraction

Bills, EOBs, benefit documents, and medical records can contain protected or highly sensitive information. Do not implement ordinary upload, OCR, or cloud storage as a convenience feature. A future proposal would need strict minimization, encryption, retention, deletion, vendor, logging, access-control, and legal review.

### Email reminders containing plan contents

Avoid sending detailed financial, medical, bill, employer, or benefits data by email. A future reminder service should use generic task labels and require an approved data model.

### Employer or insurer integrations

Connecting HR, payroll, claims, or plan portals could create substantial security, contractual, compliance, and support obligations. This is not an immediate website feature.

## Ideas requiring professional legal review

1. Jurisdiction-specific Terms of Use and limitation-of-liability language.
2. State privacy-law applicability, opt-out signals, and advertising definitions.
3. EEA/UK/Swiss consent requirements before personalized or expanded advertising.
4. Affiliate, sponsorship, lead-generation, or referral arrangements.
5. Any document-upload or account system involving medical or financial information.
6. State-specific Medicaid, estate-recovery, billing, collection, or insurance-rights content.
7. Any feature that approaches personalized investment, tax, insurance, or legal advice.

The current trust documents are meaningful safeguards, but they are not a substitute for attorney review and cannot guarantee the absence of legal claims or regulatory obligations.

## Ideas not to pursue under the current model

- Personalized stock, security, fund, or trade recommendations.
- A “best Medicare plan” ranking or carrier recommendation engine.
- A national Medicaid eligibility calculator claiming official results.
- Uploaded medical bills or insurance documents through an ordinary contact form.
- A medical-bill tool that declares a balance invalid, fraudulent, uncollectible, or not owed.
- An appeal generator that promises success or provides individualized legal strategy.
- Affiliate-driven “best insurance” or “best financial product” lists.
- Ads inside calculators, generated results, My Plan, Benefits Command Center, or medical/eligibility workflows.
- Unbounded free-text financial or medical notes.
- Sensitive user values in URLs, analytics, logs, shared metadata, or return summaries.
- High-volume generic AI articles created primarily for search traffic or advertising inventory.

## Recommended next sequence

1. Review and merge PR #145 independently if its exact-head validation remains current.
2. Review this trust-and-continuity branch and its financial-assistance workflow.
3. Build state-aware Medicaid/long-term-care routing.
4. Build the childcare/dependent-care benefits workflow after 2026 source verification.
5. Build the Roth-versus-traditional decision tool.
6. Build Observation versus Inpatient Status Guide.
7. Run a focused My Plan integration pass across the remaining consequential tools.
8. Add graphical browser end-to-end regression coverage for the flagship journeys.
9. Obtain qualified attorney review before materially expanding data collection, advertising, affiliate relationships, or jurisdiction-specific legal claims.
