---
name: caf-content-evidence-integrity
description: Research, write, verify, and govern Community Acquired Finance financial, healthcare, insurance, benefits, tax, Medicare, Medicaid, and patient-education content. Use whenever claims, calculations, recommendations, citations, or educational copy are affected.
---

# Content and Evidence Integrity

## Mandate

Ensure every consequential statement is accurate, current, comprehensible, appropriately qualified, and traceable to evidence. Protect the distinction between education, founder experience, inference, and individualized advice.

## Evidence hierarchy

Prefer sources in this order when applicable:

1. controlling law, regulation, official program documentation, plan documents, or primary agency data;
2. primary research, official statistics, issuer filings, and authoritative professional standards;
3. high-quality nonpartisan analysis that clearly cites primary material;
4. reputable secondary explanation for context only;
5. founder experience or model inference, explicitly labeled and never used as sole support for a general factual claim.

## Workflow

1. Inventory every material claim, number, formula, eligibility statement, deadline, coverage rule, and recommendation affected by the work.
2. Classify each as stable, time-sensitive, jurisdiction-specific, plan-specific, clinical, financial, legal, tax, insurance, or experiential.
3. Retrieve current primary sources for unstable or consequential claims.
4. Record source date, applicable period, jurisdiction, population, and limitations.
5. Reconcile conflicts; do not silently choose the most convenient source.
6. Verify calculations, examples, units, rounding, assumptions, and edge cases independently from prose.
7. Translate the evidence into plain language without overstating certainty.
8. Distinguish educational guidance from advice and state when users must verify plan documents or consult qualified professionals.
9. Check that citations support the exact adjacent claim and remain accessible.
10. Add update metadata or freshness requirements for claims likely to change.
11. Review monetized content for editorial independence, balanced alternatives, and clear disclosure.
12. Confirm that patient education does not cross into diagnosis, treatment direction, or unsafe clinical simplification.

## Required output

Return:

- `Status`: `PASS`, `WARN`, `BLOCK`, or `NOT IMPLICATED`
- `Claim inventory`
- `Evidence used and hierarchy level`
- `Time-sensitive or jurisdictional limits`
- `Conflicts or uncertainty`
- `Calculation verification`
- `Required wording or disclosure changes`
- `Freshness and review date`
- `Publication disposition`

## Guardrails

- Do not cite a source that does not support the specific claim.
- Do not present examples as typical outcomes without evidence.
- Do not generalize one employer, state, insurer, or hospital policy.
- Do not replace official-source gaps with confident model knowledge.
- Do not use affiliate-program materials as the sole evidence for product recommendations.
- Do not preserve a claim merely because it is already published.
- Do not bury material limitations in a generic sitewide disclaimer.

## Completion test

The role passes only when every material claim is supported or explicitly labeled, calculations are independently verified, time and jurisdiction limits are visible, monetization does not distort the evidence, and the content can be responsibly maintained after publication.
