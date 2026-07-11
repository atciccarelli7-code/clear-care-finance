# CAF Financial Navigator Product Specification

**Product route:** `/start-here`  
**Storage key:** `caf-financial-navigator-v1`  
**Schema version:** `1`  
**Release intent:** Turn Community Acquired Finance from a page library into an accountless decision-support platform.

## Product promise

The CAF Financial Navigator helps a visitor organize the financial decision immediately in front of them. It does not attempt to replace a financial adviser, benefits administrator, insurer, billing office, government agency, clinician, attorney, tax professional, or plan document.

The product:

1. identifies one of four decision pathways;
2. asks only broad choices that materially change the recommendation set;
3. runs deterministic, reviewable rules;
4. returns no more than three Do now actions, four Do next actions, and five Learn later resources;
5. connects to existing Community Acquired Finance tools and guides;
6. saves recommendation IDs and completion state locally;
7. provides copy and browser-print export;
8. exposes no intake answers or saved-plan content to analytics.

## Why `/start-here` remains the canonical route

The former Start Here page already held the correct navigation role and had established inbound links. Replacing it compounds existing discovery signals and avoids creating a competing `/navigator` route. My Plan remains an anchored local workspace inside the same page rather than an empty user-specific search route.

## Product architecture

### 1. Public landing experience

The prerendered page explains:

- the four supported pathways;
- the accountless privacy model;
- deterministic recommendations;
- the difference between educational organization and professional advice;
- the My Plan workspace;
- the connection to existing calculators, checklists, articles, and official-source steps.

### 2. Guided intake

Each pathway contains five or six questions. Questions are rendered one at a time with a visible progress indicator, Back, Change pathway, and explicit Continue controls.

No pathway asks for names, contact information, account identifiers, employer names, provider names, diagnoses, procedure names, exact balances, uploaded documents, or free-form medical details.

### 3. Rule engine

Rules live in `src/lib/financialNavigator.ts` rather than visual components. Recommendation objects contain:

- stable ID;
- pathway;
- priority;
- resource type;
- title;
- reason;
- action label;
- canonical destination;
- optional verification caution;
- fixed analytics ID.

A score map applies the pathway rules. Repeated recommendations are deduplicated by stable ID and keep the highest score. Recommendations are sorted by score within priority and capped to protect usability.

### 4. My Plan

The local plan stores only:

- schema version;
- broad pathway or `mixed`;
- generalized objective label;
- recommendation IDs;
- completed recommendation IDs;
- saved timestamp.

Raw intake answers are intentionally discarded after plan generation.

### 5. Contextual integrations

`NavigatorContextAction` provides route-specific actions after the primary page content. The first integration set includes:

- Medical Bill Review Toolkit;
- Medical Bill Review Flow;
- EOB-to-Bill Match Checker;
- Healthcare Worker Total Compensation Comparison;
- Healthcare Worker Benefits Blueprint;
- Employer Benefits Action Plan;
- Medicare/Medicaid Eligibility Check;
- Build Wealth hub;
- Insurance hub;
- Healthcare Workers hub;
- Patients & Families hub;
- Open Enrollment guide;
- 403(b) Paycheck Calculator.

These integrations use one central route map. They do not duplicate page logic and do not require editing every content route.

## Pathway definitions

## Wealth and financial stability

### Questions

- primary goal;
- broad emergency-savings range;
- major debt category;
- workplace retirement access;
- employer-match status;
- urgency.

### Rule priorities

- Emergency savings below one month elevates a starter reserve.
- High-interest or multiple debt categories elevate the debt/investing tradeoff.
- Student loans route to the dedicated federal/private decision path.
- 403(b) access elevates the paycheck contribution tool.
- A missing, incomplete, or unknown employer match elevates match verification.
- Investing and financial-independence education remain Learn later when stability actions are more urgent.

### Safety limits

The Navigator does not calculate a debt avalanche, recommend securities, set an emergency-fund dollar amount, determine tax treatment, or prescribe a retirement contribution.

## Workplace benefits

### Questions

- decision type;
- enrollment or job-offer timing;
- broad healthcare-use pattern;
- plan preference;
- retirement contribution status;
- urgency.

### Rule priorities

- Active enrollment and near deadlines elevate official deadline verification.
- Health-plan decisions elevate the SBC guide and total annual plan-cost comparison.
- Missing or uncertain retirement matching elevates match verification.
- Job-offer and total-compensation decisions route to the total-compensation comparison.
- Childcare, life/disability, and broad benefits reviews route to the Employer Benefits Action Plan.

### Safety limits

The Navigator does not select a health plan, determine HSA eligibility, calculate official tax savings, or replace the employer portal, Summary Plan Description, SBC, network directory, or drug formulary.

## Healthcare costs and coverage

### Questions

- document received;
- primary problem;
- payer category;
- desired support;
- urgency.

### Rule priorities

- A bill without completed payer processing elevates claim-status confirmation.
- An EOB, Medicare Summary Notice, or mismatch elevates the EOB-to-Bill Match Checker.
- Delayed care, prior authorization, or denial elevates the Prior Authorization Next-Step Guide.
- Collection, payment pressure, or near deadlines elevate the local call and deadline tracker.
- Affordability and self-pay elevate hospital financial-assistance education.
- Medicare, Medicaid, or related notices elevate the dedicated program guidance.
- Hospital discharge issues elevate the discharge checklist.

### Safety limits

The Navigator does not determine medical necessity, coverage, coding correctness, legal liability, eligibility, collectibility, appeal rights, or whether a balance is owed.

## Healthcare career

### Questions

- career decision;
- current role category;
- primary priority;
- compensation structure;
- tradeoff tolerance;
- urgency.

### Rule priorities

- Offer, salary/hourly, variable compensation, and total-compensation decisions elevate the comparison tool.
- Overtime-dependent or income-priority decisions elevate the current-role baseline.
- Bedside exit and non-bedside decisions elevate the Healthcare Workers hub.
- Burnout, schedule, remote, physical burden, and predictability elevate explicit quality-of-life scoring.
- Progression and long-term income elevate three-year trajectory review.

### Safety limits

The Navigator does not predict hiring outcomes, guarantee salary growth, assess professional licensure, or replace written offers and benefits documents.

## Privacy architecture

### Data never requested by the Navigator

- name;
- email or phone;
- address or birth date;
- Social Security number;
- bank, retirement, claim, member, medical-record, or account numbers;
- employer, hospital, provider, or insurer names;
- diagnosis, medication, procedure, or free-form health information;
- uploaded bills, EOBs, statements, or plan documents;
- exact income, debt, contribution, premium, or balance values.

### Local persistence

The plan is written only to browser local storage under `caf-financial-navigator-v1`. The loader validates schema version, known recommendation IDs, completion IDs, pathway, objective-label length, and timestamp fallback. Unknown or malformed actions are dropped. An empty or unusable plan returns `null`.

### No account or sync

There is no account creation, cross-device sync, database, server-side plan record, or silent email subscription.

### Clear controls

The user can remove individual actions or clear the complete local plan. Browser storage can also be cleared through normal browser controls.

## Analytics contract

All Navigator analytics remain behind the existing analytics consent decision.

### Fixed events

- `navigator_opened`
- `navigator_path_selected`
- `navigator_step_completed`
- `navigator_back_used`
- `navigator_restarted`
- `navigator_completed`
- `navigator_plan_generated`
- `navigator_recommendation_opened`
- `my_plan_action_completed`
- `my_plan_action_reopened`
- `my_plan_action_removed`
- `my_plan_copied`
- `my_plan_printed`
- `my_plan_cleared`
- `contextual_plan_action_added`

### Fixed parameters

- `pathway_id`
- `step_id`
- `recommendation_id`
- `recommendation_type`
- `priority_group`
- `source_route`
- `destination_path`
- `export_type`
- `completion_bucket`

### Prohibited analytics content

- raw answers;
- answer combinations;
- plan contents;
- completion lists;
- exact amounts;
- dates entered by the user;
- medical or insurance status;
- employment or employer details;
- free text;
- identifiers.

The site-level sanitizer remains a second defensive layer and removes keys associated with answers, results, income, salary, age, state, household, disability, diagnosis, amounts, balances, employers, roles, schedules, overtime, bonuses, and benefits.

## Search and structured-data behavior

- `/start-here` remains canonical and indexable.
- The page must prerender meaningful public product content and pathway descriptions.
- No separate `/my-plan` search route is created.
- The existing SEO registry, sitemap, prerender system, structured-data generation, internal-link checks, and 404 behavior remain authoritative.
- The public title and description position the route as a Financial Navigator without describing it as an adviser or guaranteed financial plan.

## Accessibility contract

- one visible H1;
- logical headings;
- fieldset and legend for each question;
- radio semantics and selected states;
- keyboard-operable controls;
- visible focus states;
- progress exposed with an accessible label;
- no color-only status;
- completion buttons with descriptive labels;
- copy status announced through a polite live region;
- responsive cards without fixed content heights;
- browser-print compatibility.

## Performance contract

- no questionnaire dependency;
- no new state-management library;
- no database client;
- no PDF-generation library;
- browser print for PDF saving;
- route-level lazy loading inherited from `/start-here`;
- central integration component rather than repeated page code;
- existing entry and chunk budgets remain enforced.

## Product measurement window

After release, review a minimum of 14–28 days of consented behavior before expanding the rule set or adding another major product.

### Activation

- Start Here page views;
- pathway selection rate;
- intake completion rate;
- plan-generation rate;
- recommendation click-through.

### Product value

- contextual actions added;
- actions completed;
- plan copy and print rate;
- tool starts after Navigator recommendations;
- official-resource openings where already measured;
- multiple useful resources reached in one session.

### Retention

Use only normal analytics and local product state. Do not fingerprint users. Evaluate repeat Start Here sessions, saved-plan continuation, and additional completed actions where measurement remains consented and privacy-safe.

## Deferred features

- user accounts;
- cross-device synchronization;
- free-text notes;
- server reminders;
- emailed plan contents;
- institutional branding;
- premium tiers;
- generative plan writing;
- document upload or OCR;
- individualized investment, tax, insurance, legal, medical, or benefits recommendations.

These should not be added until the free accountless product demonstrates activation, completion, and return behavior.
