# Community Acquired Finance Professional Product Governance

**Effective:** July 20, 2026  
**Product owner:** Andrew Ciccarelli, RN, BSN  
**Technical owner:** CAF repository maintainers  
**Applies to:** Consumer pages, guided journeys, tools, calculators, patient/caregiver education, healthcare-worker resources, Medicare/Medicaid resources, organization-facing public routes, analytics, advertising, and release operations.

## 1. Product operating principle

CAF is one connected decision-support product, not a collection of independently optimized pages. Every change must preserve the visitor’s ability to answer:

1. Am I in the right place?
2. Does this understand my problem?
3. What should I do next?
4. Am I still solving the same problem?
5. What answer or plan did I receive?
6. What is the first real-world action I should take?

Depth is preserved through progressive disclosure. Complexity appears when the visitor requests it, not merely because the product can display it.

## 2. Canonical product ownership

The controlling naming and route policy is `docs/caf-product-naming-and-route-governance.md`.

- Decision Concierge owns site-wide routing only.
- Financial Navigator owns the broad prioritized personal-finance plan.
- Benefits Command Center owns complete workplace-benefits package review and comparison.
- Hospital & Patient Guide owns hospital-to-home, caregiver, medication/equipment, discharge-barrier, and coverage preparation.
- Medical Bill Response System owns medical-bill document identification and next actions.
- Focused experiences use descriptive labels such as Calculator, Checklist, Comparison, Guide, Worksheet, or Assessment.

A new public branded product is prohibited unless a descriptive label is insufficient and the proposal includes canonical ownership, distinct output, analytics, acceptance criteria, route governance, and evidence of durable value.

## 3. Journey UX acceptance criteria

A flagship guided journey must:

- state the question it owns;
- state the expected output before the user begins;
- use fixed choices when sensitive free text is unnecessary;
- preserve the original goal at the canonical destination;
- use meaningful phases rather than a deceptive percentage;
- avoid competing primary destinations;
- display one recognizable result before optional resources;
- provide a direct plain-English answer;
- explain why the result applies;
- present no more than three primary next actions before secondary depth;
- identify what must be gathered or verified;
- place copy, print, save, reset, and clear controls where relevant;
- expose official verification at the moment it matters;
- survive reload, browser back/forward, direct entry, and malformed local state;
- keep sensitive workflows free of advertising and lead-generation interruptions.

A router completion is not a terminal answer. It must be labeled as a route or starting point and must hand off to exactly one canonical destination.

## 4. Result standard

Flagship results follow this order:

1. Your result.
2. One direct plain-English answer.
3. Why you received this result.
4. Fixed choices or facts that materially affected it, when safe and necessary.
5. Your next three actions.
6. Questions to ask.
7. What to gather.
8. What requires official verification.
9. Copy, print, save, reset, or clear controls.
10. Optional related education or another journey.

A result must look different from an article library or hub. Success styling confirms that a result was reached; it does not imply that an agency, clinician, insurer, employer, or professional approved the result.

## 5. Semantic design system

The controlling token implementation is in `src/index.css` and `tailwind.config.ts`.

| Semantic | Intended meaning | Required companion cue |
|---|---|---|
| Action / blue | Primary forward action | Verb-led label and clear button/link shape |
| Trust / teal | Privacy, source method, review boundary | Text explaining what is trusted or protected |
| Success / green | Completed step, saved state, result reached | Completion wording or check icon |
| Caution / amber | Verify before acting | Explicit verification statement |
| Danger / red | Genuine deadline, denial, rights loss, irreversible or urgent risk | Concrete risk description and next action |
| Neutral / gray | Supporting information | Lower visual priority |
| Optional / gray | Content not required to finish the current task | “Optional” label or disclosure control |
| Disabled | Unavailable action | Disabled state and, when necessary, reason |

Rules:

- Color never carries meaning alone.
- Primary interactive controls target at least 44×44 CSS pixels where practical.
- Visible keyboard focus is mandatory.
- `prefers-reduced-motion` is respected globally.
- Looping animation, pulsing calls to action, fake urgency, and decorative motion are prohibited.
- Filled cards are not the default answer to hierarchy. Use open layouts, dividers, lists, and disclosure where they clarify sequence.
- A page may have only one visually dominant primary action in the first viewport.

## 6. Accessibility standard

CAF targets WCAG 2.2 AA behavior even when automated tooling checks WCAG 2.1 tags.

Every release must verify:

- one meaningful `h1` per route;
- ordered heading hierarchy;
- semantic landmarks and labels;
- keyboard operation for all controls;
- visible focus in light and dark mode;
- no focus traps outside intentional dialogs;
- form labels, instructions, validation, and status announcements;
- no color-only meaning;
- sufficient text and non-text contrast;
- practical touch targets;
- responsive text and controls without horizontal overflow;
- reduced-motion behavior;
- screen-reader-accessible result and copy status;
- accessible tables, disclosures, and scroll regions;
- no serious or critical automated axe violations on representative journeys.

Automated checks do not replace manual keyboard and screen-size certification.

## 7. Privacy and saved progress

### Session continuity

`sessionStorage` may store fixed publisher-authored routing context needed to preserve the current journey. It must not store names, diagnoses, policy numbers, claims, free text, answer values, or URL query-state.

### Explicit saved actions

`localStorage` may store non-sensitive action IDs, completion states, or user-created local labels only when the experience clearly explains:

- what is stored;
- where it is stored;
- that it remains on the device/browser;
- how to reset or clear it;
- what is never sent to CAF.

### Prohibited storage

Do not store:

- names or contact information;
- diagnoses, symptoms, medications, treatment details, or medical free text;
- policy, member, claim, case, account, or government identifiers;
- copied bills, EOBs, MSNs, notices, plan documents, or clinical instructions;
- employer, offer, salary, wage, benefit, balance, premium, deductible, contribution, tax, or debt free text;
- unrestricted notes;
- sensitive values in URLs, metadata, analytics, or server logs.

Malformed or expired local state must fail closed and offer a clear reset.

## 8. Analytics privacy

The shared journey contract is `src/lib/journeyAnalytics.ts`.

Permitted event names:

- `journey_viewed`
- `journey_started`
- `journey_step_completed`
- `journey_back_selected`
- `journey_exited_unexpectedly`
- `journey_result_reached`
- `journey_result_copied`
- `journey_result_printed`
- `journey_resume_clicked`
- `journey_restarted`
- `journey_handoff_opened`

Permitted properties are limited to:

- fixed journey key;
- fixed surface;
- fixed phase;
- integer step index;
- fixed variant identifier;
- random session-scoped journey ID.

CAF analytics remain disabled until analytics consent is granted. No answer content, selected plan, provider, employer, medication, diagnosis, dollar value, location, age, date, result text, free text, document content, URL query, or local-storage record may be sent.

A new event or property requires a documented purpose, strict allowlist, rejection test, privacy review, and production payload inspection before it supports a business claim.

## 9. Editorial source hierarchy

Use the highest controlling source available:

1. Federal or state statute, regulation, agency, or official program material.
2. Current plan document, Summary Plan Description, Evidence of Coverage, formulary, provider directory, notice, benefit booklet, or employer/insurer document.
3. Official professional or clinical organization guidance within its scope.
4. Peer-reviewed research or authoritative public-health/health-system evidence.
5. High-quality nonpartisan research organizations for synthesis and population context.
6. Reputable secondary reporting for context only, not as the controlling source when primary material exists.
7. Andrew’s de-identified RN observations for practical interpretation, never as proof of a universal rule or outcome.

Time-sensitive content must display published/reviewed dates, review scope, limitations, and a next-review expectation where the existing publication system supports it.

Do not fabricate patient stories, outcomes, testimonials, credentials, usage statistics, partnerships, approvals, or institutional adoption.

## 10. Human authority and language

- Andrew’s verified credentials are **RN, BSN**.
- Verified experience may include bedside, charge, and admissions-discharge-transfer nursing.
- RN insight is used sparingly where it improves interpretation, barriers, responsibility mapping, or real-world action.
- Do not imply physician, pharmacist, attorney, tax, insurance, Medicare, fiduciary, CFP, benefits-administrator, or independent reviewer authority.
- Replace internal product language with human wording on public pages. Terms such as canonical, deterministic, structured pathway, local workspace, and verification pathway belong in methodology or developer documentation unless plain language would be less precise.
- Disclaimers must not overpower the answer. Place specific limits at the decision moment and maintain one broader site boundary where required.

## 11. Route, metadata, and redirect governance

- Preserve high-value and indexed routes whenever practical.
- A public-label change does not require a slug change.
- A route change requires a permanent redirect, canonical update, internal-link update, sitemap update, structured-data update, metadata update, and automated redirect test.
- Canonical URLs must not include search, filter, saved-state, or sensitive parameters.
- Direct-entry and browser-history behavior are release requirements.
- Sitemap, robots, prerender manifests, SEO registry, and runtime routes must agree.
- Deprecated routes remain documented until search traffic and internal links confirm safe retirement.

## 12. Performance budgets

The repository’s automated bundle and performance checks remain controlling. Product changes must also avoid:

- loading a complete secondary workflow in the first viewport when lazy loading or disclosure is appropriate;
- adding large image or animation assets without a measured user benefit;
- duplicate analytics libraries or duplicate events;
- layout shifts from unsized media or late-loading interface elements;
- blocking external scripts before consent;
- mobile sticky-element collisions;
- rendering hidden duplicate product systems.

A release that passes a bundle threshold but creates visibly slow interaction or layout instability does not pass human certification.

## 13. Advertising and monetization boundaries

Advertising must remain clearly labeled and structurally separate from guidance.

Do not place ads:

- inside a medical, discharge, coverage, Medicare, Medicaid, bill, debt, or benefits question sequence;
- between a result and its first required action;
- beside a denial, deadline, emergency, rights, or appeal warning in a way that could imply endorsement;
- inside copyable or printable action plans;
- in a way that resembles an official source, calculator result, recommendation, or CAF next action;
- on pages where advertising materially increases cognitive load or compromises trust.

Affiliate or sponsored relationships require disclosure before the commercial link and must not change the educational answer.

## 14. Tool lifecycle and deprecation

### Build a new tool only when

- a recurring user job is not adequately solved by an existing canonical product;
- fixed inputs can produce a meaningful educational output;
- the output changes the next action;
- authoritative source and update ownership exist;
- privacy, accessibility, analytics, SEO, and support costs are justified;
- the new tool does not duplicate an existing calculator, checklist, guide, or journey.

### Decide not to build when

- an article, checklist, or external official source already solves the need;
- the answer requires unrestricted sensitive data;
- the output would imply personalized medical, legal, tax, coverage, investment, or eligibility advice;
- the experience cannot be kept current;
- usage cannot be measured safely;
- a new brand name or route would add more architecture than user value.

### Deprecate or consolidate when

- two experiences own the same decision;
- a tool no longer has a maintained source or effective-year owner;
- the result does not change the next action;
- traffic and completion evidence show persistent confusion;
- a flagship product fully absorbs the smaller experience.

Deprecation requires an internal-link inventory, replacement destination, redirect/canonical decision, sitemap review, analytics retirement note, and release test.

## 15. Release certification

A production release is certified only after:

- typecheck, lint, unit, integration, browser, accessibility, build, prerender, bundle, SEO, sitemap, robots, structured-data, link, AdSense, and privacy checks pass as applicable;
- the preview deployment is READY;
- representative desktop and mobile routes are manually inspected;
- keyboard and reduced-motion behavior are reviewed;
- browser back/forward, reload, direct entry, save/resume/reset, and malformed state are tested where relevant;
- no unresolved critical review thread remains;
- no serious or critical accessibility defect remains;
- no sensitive analytics payload exists;
- no canonical, redirect, sitemap, metadata, or route regression exists;
- a final connected-product reassessment finds no high-severity coherence problem;
- the PR records screenshots, test evidence, known limitations, and measurement dates.

After merge:

1. Confirm the Vercel production deployment is READY.
2. Confirm the canonical domain serves the merged commit.
3. Re-run critical production journeys.
4. Verify canonical metadata, sitemap, robots, redirects, and structured data.
5. Review runtime and deployment errors.
6. Update Notion and Linear with the PR, merge commit, deployment, validation, limitations, and measurement dates.
7. Fix any meaningful production regression through a focused branch and the same release gates.

## 16. Required reassessment after every material pass

Re-review:

- global navigation;
- homepage hierarchy;
- product naming;
- route ownership;
- internal linking;
- journey continuity;
- visual semantics;
- CTA hierarchy;
- page density;
- mobile behavior;
- accessibility;
- SEO and structured data;
- sitemap, robots, redirects, and canonicals;
- privacy and analytics;
- returning-user behavior;
- advertising boundaries;
- performance;
- tests and documentation.

A locally attractive change that weakens global coherence must be revised or removed.
