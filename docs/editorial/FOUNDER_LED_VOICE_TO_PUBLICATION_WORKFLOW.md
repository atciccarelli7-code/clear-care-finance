# CAF Founder-Led Voice → Publication Workflow

Last reviewed: 2026-09-08

This note extends `CAF_CONTENT_ENGINE.md` with the workflow proven by the September 2026 founder-led care-transition batch.

## What this batch proved

The strongest CAF process is not "AI generates an article and the founder approves it." It is:

1. **Founder Voice interview** — use conversation to extract what Andrew actually noticed, believed, questioned, or found operationally strange.
2. **Source-note preservation** — retain the concrete bedside mechanism, memorable phrasing, uncertainty, and de-identified example before research changes the framing.
3. **Research that is allowed to disagree** — test the founder's explanation against controlling rules, primary sources, and peer-reviewed evidence. Do not use research only to validate the initial intuition.
4. **Article synthesis** — write around the actual founder thesis and keep first-person reasoning visible.
5. **Adversarial review in small batches** — after roughly three strong drafts, use a separate review pass to verify denominators, payer populations, rule dates, causal language, and source-to-claim fit.
6. **Publication implementation** — preserve the approved prose, source numbering, review metadata, internal journeys, and ad-sensitivity classification.
7. **Audience learning** — evaluate search visibility, article-to-article movement, source clicks, and newsletter behavior after enough data accumulate. Do not rewrite a distinctive thesis because of a tiny sample.

## The recurring editorial pattern

A strong founder-led CAF section often follows:

**Founder observation → evidence → limitation or counterevidence → revised interpretation**

The revision is part of the story. When Andrew says "I initially thought X; the evidence made me more careful," preserve that reasoning when it helps the reader understand the system.

Examples from the September batch:

- Visible bedside improvement with oxygen did not establish a population-level long-term benefit; LOTT made the coverage threshold more understandable without erasing the bedside observation.
- "Waiting on insurance" was initially easy to frame as payer cost avoidance; hospital payment research showed that the marginal cost can fall differently depending on the contract.
- Physician documentation initially looked like the main ownership point; review showed that the portable functional record is interprofessional.
- Discharge confidence felt predictive at the bedside; the READI trial required a much more careful conclusion about readmission.

## Voice preservation rules

- Preserve short spoken beats when they create rhythm: "Food appears." / "Medications appear." / "I still assess the patient."
- Preserve memorable founder lines unless they are factually misleading.
- Never replace a real founder uncertainty with omniscient institutional prose.
- Keep de-identified patient examples general enough that no patient or workplace episode can reasonably be reconstructed.
- Test a few signature lines in code when a flagship article is implemented so future refactors cannot silently flatten them.
- Research paragraphs may sound more technical than the surrounding narrative. That is acceptable when the transition back to Andrew's interpretation remains clear.

## Evidence discipline learned from Astra review

For every consequential statistic, record:

- numerator and denominator;
- population and payer type;
- study design;
- care setting and geography;
- time period;
- whether the result is association, modeled estimate, or causal evidence;
- the limitation that would change a reader's interpretation.

When a paper's narrative text and table disagree, inspect the underlying table/method and disclose the choice internally rather than selecting the cleaner number.

For current coverage/payment rules, distinguish:

- Original Medicare from Medicare Advantage;
- SNF from IRF and other meanings of "rehab";
- coverage approval from facility acceptance;
- a maximum decision deadline from typical decision time;
- a case payment from the marginal cost of another hospital day;
- a benefit being covered from a service actually being available.

## Publication gates added by this batch

Before release, verify:

- every inline numeric source marker maps to the displayed source list;
- the article has an explicit `reviewed`, indexable publisher classification;
- sensitive discharge, medication, Medicare, denial, and oxygen articles remain ad-free unless separately justified;
- the homepage/archive surfaces new founder reporting without increasing page clutter;
- the article route resolves through the shared catalog rather than requiring one-off routing architecture;
- signature founder-language tests pass;
- review dates reflect the fastest-changing controlling source.

## What not to do next

Do not treat this successful batch as permission to mass-produce adjacent articles. The bottleneck remains evidence of reader demand, not URL count.

Do not build a new calculator simply because an article mentions a workflow. Reuse an existing navigator, checklist, or related article when it genuinely helps.

Do not send every first draft to an expensive adversarial review. Develop a small batch first, package its claim maps and known risks, then use the review model where it has the highest marginal value.

## Next founder interview candidate

**Your Insurance Covers Home Health. Why Can't You Find an Agency?**

The interview should first establish what Andrew has actually seen, then research the mechanism rather than assuming the explanation.

Keep these possible gates separate:

1. the patient meets the benefit's eligibility requirements;
2. a clinician orders/recommends the service;
3. an agency receives the referral;
4. the agency is in network or otherwise acceptable to the payer;
5. the agency can meet the patient's clinical needs;
6. geography and visit timing are workable;
7. staffing is available;
8. the agency formally accepts the patient;
9. a start-of-care date is actually confirmed.

Required counterweight: do not infer a national workforce shortage, low payment, or insurer refusal from a local failed referral. Compare founder observations with current Medicare requirements, plan network/access obligations, home-health capacity evidence, and any defensible national or regional data.

## Review cadence

For the September 2026 batch:

- `what-happens-while-hospital-is-waiting-on-insurance` — review by 2027-01-15 because the 2027 Prior Authorization API implementation is a near-term policy trigger.
- `patient-in-the-bed-and-patient-in-the-chart` — review by 2027-03-08 or sooner if Medicare oxygen/SNF rules or OIG findings materially change.
- `medically-ready-is-not-the-same-as-ready-for-home` — review by 2027-03-08 or sooner if discharge-planning, home-health, or APCM rules materially change.

This workflow is a quality system, not a production quota. Publish the next piece only when the founder interview produces a distinct argument CAF can credibly own.
