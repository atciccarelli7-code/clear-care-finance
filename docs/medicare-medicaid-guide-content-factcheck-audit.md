# Medicare and Medicaid Guide Content Fact-Check Audit

Community Acquired Finance  
Content, grammar, and source-accuracy audit for the Medicare/Medicaid guide  
Last updated: 2026-07-07

## Scope

This audit was added after reviewing the latest layout/visual PDF preview and finding that the guide still contains confusing copy, awkward grammar, and presentation issues that could undermine trust even if the facts are directionally correct.

The guide should not be treated as release-ready until this content audit is resolved.

This audit does not publish the PDF, unlock the landing page CTA, add the PDF URL to the sitemap, add QR codes, add ads, add affiliate links, add insurer rankings, add plan recommendations, add lead forms, or add sales language.

## Release decision

**Do not merge PR #108 as a final design pass yet.**

Reason: the latest PDF preview improved spacing, but content quality is now the highest-risk blocker. The guide needs a source-backed editorial pass before another PDF candidate is generated.

## Immediate defects found

### 1. Related-tool URLs are appearing inside the question flow

In the latest local PDF preview, route bullets such as `/medicare-care-costs`, `/tools/eob-to-bill-match-checker`, and related article URLs appeared directly after `Questions to ask` sections.

Why this matters:

- It makes the guide look unfinished.
- It confuses readers because URLs look like additional questions.
- It weakens the credibility of otherwise useful chapters.

Required fix:

- Do not render raw route bullets inside chapter body copy.
- Keep tools in a labeled `Related tools` section, the final QR/tool directory, or a deliberately designed resource panel.
- Add a build/preflight check that fails if route-only bullets appear inside rendered `Questions to ask` blocks.

### 2. Several sentences are factually directionally correct but too loose

The guide should not rely on statements that are merely `sort of right`. It should use precise, cautious wording tied to official sources.

Examples requiring recheck/rewrite:

- Medicare vs Medicaid descriptions.
- Medicare Advantage prior authorization language.
- Observation vs inpatient language.
- Skilled nursing facility timing/cost-sharing language.
- Home health vs full-time home aide language.
- QMB/Medicare Savings Program billing protection language.
- Long-term care vs custodial care language.

Required fix:

- Recheck each high-risk chapter against Medicare.gov, Medicaid.gov, and CMS.gov.
- Rewrite sentences that are grammatically awkward, overly broad, or hard for a stressed family to interpret.
- Avoid professional shorthand unless it is defined clearly.

### 3. Current wording sometimes stacks too many caveats in one sentence

Some sentences try to cover too many exceptions at once. This makes them legally safer but harder to understand.

Required fix:

- Split long sentences into shorter plain-English statements.
- Use `usually`, `may`, and `must verify` deliberately, not repeatedly.
- Keep the reader oriented: what is the question, who decides, and what document verifies it?

### 4. The guide needs a chapter-level source certification pass

Before launch, each chapter should have a short verification note:

- official sources checked,
- major rules verified,
- current-year dollar amounts checked or intentionally avoided,
- state/plan-specific limitations preserved,
- any remaining unresolved wording.

Required fix:

- Add an editorial/fact-check report before final PDF candidate generation.
- Do not rely on the visual artifact review rubric alone.

## Official-source anchors for the fact-check pass

Use official sources first. Non-official explainers can help identify reader confusion, but they should not be used as the final authority for guide claims.

### Medicare vs Medicaid

Primary sources:

- Medicare.gov — How Medicare works.
- Medicaid.gov — Eligibility Policy.
- Medicaid.gov — Seniors & Medicare and Medicaid Enrollees.
- CMS.gov — Medicare-Medicaid Coordination Office.

Audit target:

- Clarify that Medicare is federal health insurance, while Medicaid is a joint federal-state program administered by states within federal rules.
- Avoid implying Medicaid is only for long-term care.
- Avoid implying all dual-eligible cost-sharing is always paid by Medicaid.

### Original Medicare vs Medicare Advantage

Primary sources:

- Medicare.gov — Compare Original Medicare and Medicare Advantage.
- Medicare.gov — Your health plan options.
- CMS.gov — Medicare Managed Care Appeals & Grievances.

Audit target:

- Keep clear that Medicare Advantage plans must cover medically necessary services Original Medicare covers, but may use networks, referrals, and prior authorization.
- Avoid implying every Medicare Advantage service requires prior authorization.
- Keep emergency vs non-emergency network distinctions clear.

### Long-term care and custodial care

Primary sources:

- Medicare.gov — Long-term care.
- Medicaid.gov — Long Term Services & Supports.

Audit target:

- Use Medicare.gov's distinction that long-term care is different from skilled nursing facility care.
- Clarify that Medicare generally does not pay for long-term care/custodial care when that is the primary need.
- Explain that Medicaid is the primary payer nationally for long-term care services, but eligibility and covered settings are state-specific.

### Skilled nursing facility care

Primary source:

- Medicare.gov — Skilled nursing facility care.

Audit target:

- Verify the 3-day qualifying inpatient hospital stay rule for Original Medicare.
- State that observation or emergency-room time before inpatient admission does not count toward that 3-day qualifying stay.
- Avoid putting current-year dollar amounts in narrative text unless they are checked immediately before release.
- Clarify that Medicare Advantage plans may waive or handle the 3-day requirement differently and families should contact the plan.

### Home health

Primary source:

- Medicare.gov — Home health services.

Audit target:

- Explain that Medicare-covered home health can include part-time or intermittent skilled services when eligibility rules are met.
- Clarify that Medicare does not pay for 24-hour-a-day home care, home-delivered meals, unrelated homemaker services, or custodial care when that is the only care needed.
- Avoid making home health sound like full-time home support.

### Bills, MSN/EOB, and QMB

Primary sources:

- Medicare.gov — Medicare Summary Notice.
- Medicare.gov — Medicare Savings Programs.
- CMS.gov — Qualified Medicare Beneficiary Program.

Audit target:

- State that an MSN is not a bill.
- State that the MSN shows what Medicare paid and the maximum amount the person may owe the provider.
- Clarify that Medicare Savings Programs are state-administered and may help with Medicare Part A/Part B costs depending on program.
- For QMB, specify that billing protection applies to Medicare-covered Part A and Part B services/items and cost-sharing; do not imply every bill is prohibited.

## Editorial rewrite rules

Use these rules in the next pass:

1. Prefer short sentences.
2. One concept per sentence when possible.
3. Avoid stacking `state, plan, facility, timing, diagnosis, authorization` lists unless the list itself is the point.
4. Do not use raw route bullets inside patient-facing chapter text.
5. Do not include current-year dollar amounts in body copy unless they are verified on the release date.
6. Do not imply guaranteed coverage, eligibility, payment, waiver approval, appeal success, or plan outcome.
7. Every high-risk chapter should make clear who decides or verifies the answer.
8. Plain-English does not mean vague. Use precise words, but define them.

## Proposed next work package

Create a separate content-focused PR or update PR #108 before merge with:

1. Parser/build fix so related-tool routes do not appear under `Questions to ask`.
2. Chapter-by-chapter grammar and clarity rewrite.
3. Official-source fact check for Chapters 4, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, and 17.
4. Updated source map if any sources changed.
5. Regenerated local PDF preview.
6. Only then return to visual artifact review.

## Blocking note

The guide is promising, but it should not be launched as-is. Layout can be fixed mechanically; content trust is the product. This audit should be resolved before any final public PDF candidate is committed.
