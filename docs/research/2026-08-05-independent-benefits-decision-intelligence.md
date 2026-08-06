# Independent Benefits Decision Intelligence — Research and Product Doctrine

Verified: August 5, 2026

## Executive conclusion

The employee-benefits software market is moving toward employer-integrated AI platforms that combine plan data, claims data, HRIS connections, enrollment, engagement, and automated action. That direction is useful for large employers, but it leaves a distinct consumer-side opportunity:

> Build an independent, privacy-minimized, source-traceable decision system that works for the employee even when the employer has not purchased a benefits-navigation platform.

Community Acquired Finance should not imitate enterprise benefits administration. Its defensible position is user control, document-aware reasoning, transparent assumptions, visible uncertainty, and a retained decision record that can travel across employers and life events.

## Current market direction

### Employer-integrated personalization

Jellyvision positions ALEX as an employer and broker platform that uses plan information, behavioral science, and claims data to personalize benefits guidance during enrollment and throughout the year. Its newer ALEX Home product combines benefits guidance, content, eligibility, administration, enrollment, and reporting.

Sources:

- https://www.jellyvision.com/benefit-decisions/
- https://www.jellyvision.com/alex-home/
- https://www.jellyvision.com/benefits-administration/

Nayya positions its platform as proactive benefits intelligence integrated with employer systems, HR platforms, workplace tools, and benefits data. Its stated direction goes beyond answering questions toward taking actions such as filing claims or handling appeals.

Source:

- https://www.nayya.com/platform

### Implication for CAF

Competing directly on claims integration, employer census data, enrollment administration, or HR reporting would place CAF against mature enterprise vendors with distribution through employers and brokers.

CAF can instead serve the person who:

- does not have access to one of those platforms;
- wants an independent explanation rather than an employer-sponsored recommendation;
- changes employers and loses access to the prior employer's system;
- wants to coordinate a household across multiple employers;
- does not want claims or health data used for personalization;
- needs a durable verification record rather than a one-time recommendation.

## Privacy and security constraints are strategic, not cosmetic

The U.S. Department of Labor has clarified that its cybersecurity guidance applies to health and welfare plans as well as retirement plans. The guidance emphasizes documented security programs, access controls, third-party review, encryption, data governance, secure development, incident response, and careful service-provider oversight.

Sources:

- https://www.dol.gov/agencies/ebsa/employers-and-advisers/plan-administration-and-compliance/compliance-assistance-releases/2024-01
- https://www.dol.gov/agencies/ebsa/key-topics/retirement-benefits/cybersecurity/best-practices
- https://www.dol.gov/agencies/ebsa/key-topics/retirement-benefits/cybersecurity/tips-for-hiring-a-service-provider-with-strong-security-practices

The Federal Trade Commission separately warns that consumer health applications may handle sensitive information outside traditional HIPAA relationships and stresses accurate privacy representations, data minimization, security, and breach obligations.

Sources:

- https://www.ftc.gov/business-guidance/privacy-security/health-privacy
- https://www.ftc.gov/business-guidance/resources/mobile-health-apps-interactive-tool

### CAF doctrine

CAF should preserve these product constraints:

1. Collect the minimum structured information necessary for the decision.
2. Keep raw employer documents and copied source text local whenever feasible.
3. Never send benefit values, employer names, plan names, medical information, or document text to analytics.
4. Separate public education, browser-local assistance, authenticated workspaces, and payment systems.
5. Make every consequential output traceable to user-entered facts, official sources, assumptions, and unresolved verification work.
6. Avoid opaque confidence scores that imply mathematical certainty without a validated basis.
7. Keep official employer, carrier, administrator, and plan materials controlling.

## Product advantage: the decision trace

Most benefits tools emphasize the answer: which plan appears best, which benefit to elect, or what action to take.

CAF should also preserve the reasoning record:

- What facts drove the conclusion?
- Which official source categories were available?
- Which facts remain missing or unverified?
- Which assumptions were used?
- What changes could reverse the conclusion?
- Was the final review acknowledged?
- What must be confirmed before submission?

The decision trace is not a decorative explanation. It is reusable decision infrastructure for:

- open enrollment;
- healthcare job-offer comparison;
- retirement and employer-match decisions;
- medical-bill review;
- Medicare and Medicaid pathways;
- hospital-to-home financial planning;
- caregiver decisions;
- future employer-specific document interpretation.

## Initial implementation

The first reusable engine is implemented in:

- `src/premium/decisionTrace.ts`

It produces:

- a bounded status: `supported`, `provisional`, or `verification-required`;
- source-readiness counts;
- a source ledger;
- decision drivers;
- explicit assumptions;
- change triggers;
- generated verification items.

It intentionally does not produce a numeric confidence score.

Tests are implemented in:

- `src/test/decisionTrace.test.ts`

## Next product sequence

### 1. Present the trace in the final Benefits Decision Brief

Show a compact, printable section containing:

- current trace status;
- source coverage;
- three to five key decision drivers;
- assumptions;
- facts that could change the decision;
- unresolved verification work.

### 2. Add scenario sensitivity

Allow the user to see whether the medical-plan conclusion changes under low, expected, and high healthcare-use scenarios. Label stable conclusions differently from conclusions that reverse under a plausible scenario.

### 3. Add source provenance without raw-document retention

For each confirmed structured value, preserve:

- source category;
- plan year;
- employee group;
- page or section reference entered by the user;
- confirmation date;
- whether the value was user-entered, locally extracted, or manually verified.

Do not preserve raw source text by default.

### 4. Add longitudinal change intelligence

Help users compare the prior plan year with the current plan year across:

- premiums;
- deductibles;
- out-of-pocket maximums;
- employer HSA or HRA funding;
- network and formulary changes;
- retirement match and vesting;
- disability and life-insurance terms;
- supplemental-benefit pricing.

The output should distinguish a changed value from a newly missing or newly ambiguous value.

### 5. Build household coordination

The system should eventually coordinate multiple employer options without requiring either employer to sponsor CAF. This includes spouse surcharges, contribution restrictions, HSA eligibility interactions, dependent coverage, and split-family strategies while avoiding individualized legal or tax conclusions.

## Growth implication

The market research does not support endless generic content production. It supports a focused public narrative:

> Enterprise benefits platforms work when an employer buys them. CAF is building an independent decision system the worker controls.

That narrative can support:

- product-specific SEO;
- nursing-school and career-coach outreach;
- healthcare-worker financial-wellness partnerships;
- employer-independent open-enrollment education;
- media and newsletter coverage around privacy-first benefits navigation;
- future consumer and institutional offerings built from the same decision-trace architecture.

## Build gate

Future work should proceed only when it strengthens at least one of these durable assets:

- discoverability;
- decision utility;
- trust and evidence quality;
- conversion;
- reusable decision-system infrastructure;
- distribution;
- validated user learning.

Research breadth is an advantage only when it compounds into a coherent system rather than an expanding collection of disconnected pages and features.
