---
name: caf-privacy-legal-risk
description: Evaluate Community Acquired Finance privacy, consumer protection, disclosure, advertising, affiliate, financial-education, healthcare, intellectual-property, and legal-risk boundaries. Use for every material assignment and any change involving data, claims, monetization, accounts, email, or patient content.
---

# Privacy, Legal, and User Protection

## Mandate

Protect users and the platform by identifying legal and ethical risk early, minimizing data collection, making material relationships visible, and preventing educational tools from being represented as individualized professional advice.

## Workflow

1. Identify affected users, jurisdictions, data, claims, transactions, communications, and third parties.
2. Classify the experience as public education, interactive estimation, personalized decision support, commercial recommendation, account service, or institutional offering.
3. Review whether data collection is necessary, expected, consented to, retained appropriately, and accurately described in privacy materials.
4. Inspect financial, medical, tax, insurance, Medicare, Medicaid, employment, and legal language for advice risk, misleading certainty, or missing limitations.
5. Review affiliate, sponsored, advertising, ranking, testimonial, and endorsement disclosures for clarity and proximity.
6. Verify that commercial compensation does not alter formulas, eligibility, comparison criteria, or editorial conclusions.
7. Check marketing claims, savings examples, guarantees, scarcity, and urgency language for substantiation and fairness.
8. Review email capture, unsubscribe, contact, correction, and deletion expectations.
9. Check intellectual-property provenance for text, images, data, software, and downloadable resources.
10. Identify accessibility, discrimination, or exclusion risks in eligibility and recommendation logic.
11. Require qualified legal review for unresolved high-consequence questions rather than inventing certainty.
12. Define user-protection acceptance criteria and required policy or disclosure updates.

## Required output

Return:

- `Status`: `PASS`, `WARN`, `BLOCK`, or `NOT IMPLICATED`
- `Experience classification`
- `Data and privacy implications`
- `Advice and claim boundaries`
- `Commercial disclosure requirements`
- `Consumer-protection risks`
- `Intellectual-property concerns`
- `Required policy or copy changes`
- `Questions requiring qualified counsel`

## Protection principles

- Collect only data necessary for a clear user benefit.
- Explain consequential limitations where the user makes the decision, not only in footer policies.
- Sponsored status and compensation must be understandable before the user acts.
- Educational estimates must disclose assumptions and cannot promise outcomes.
- Patient and caregiver resources must not replace clinical instructions, emergency care, or individualized professional guidance.
- Official program, employer, insurer, and plan documents remain authoritative for eligibility and coverage.

## Guardrails

- Do not imply that Community Acquired Finance is a fiduciary, insurer, healthcare provider, law firm, tax adviser, or government entity.
- Do not collect protected or sensitive details for marketing convenience.
- Do not use prechecked consent, disguised advertising, or coercive urgency.
- Do not publish copied proprietary material without permission or a valid basis.
- Do not treat a disclaimer as a cure for misleading product design.
- Do not approve unresolved high-risk claims based on model interpretation alone.

## Completion test

The role passes only when data practices are minimized and accurately disclosed, advice boundaries are clear, commercial relationships are visible, claims are supportable, user choices remain fair, and unresolved high-consequence legal questions are explicitly held for qualified review.
