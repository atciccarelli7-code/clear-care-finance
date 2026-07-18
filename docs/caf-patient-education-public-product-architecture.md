# Hospital & Patient Guide — Public Product Architecture

**Status:** Development-stage public architecture  
**Repository:** Public Community Acquired Finance web application  
**Purpose:** Describe and market the institutional product without publishing deployable clinical content or private operating records.

## Public/private boundary

The public repository may contain:

- product positioning and institutional methodology;
- nonclinical guide anatomy demonstrations;
- fixed-choice, non-identifying pilot scoping;
- flagship topic names and review disciplines;
- implementation and measurement frameworks;
- privacy, clinical, and claims boundaries;
- public-safe TypeScript data contracts and tests;
- lead-generation routes that explicitly prohibit sensitive information.

The public repository must not contain:

- complete institutional patient guides;
- evidence dossiers or claim-level source maps;
- reviewer identities, signatures, credentials, or approval records;
- hospital policies, contacts, local instructions, formularies, or customizations;
- client deliverables, contracts, pricing negotiations, or protected sales material;
- identifiable patient, employee, member, or clinician data;
- clinical source files licensed for restricted use;
- private Notion, Drive, Linear, or repository access details.

The build runs `npm run institutional:boundary-check` to block protected path patterns and private-content markers.

## Public route

`/for-organizations/patient-education-systems`

The route provides:

1. development-stage product status;
2. five-layer product architecture;
3. recognizable guide anatomy;
4. five initial pilot packages: COPD recovery, heart failure, blood thinner safety, home oxygen and nebulizer use, and the first 72 hours after discharge;
5. the coordinated asset package;
6. operational-continuity differentiation;
7. six release gates;
8. a fixed-choice pilot-scoping tool;
9. explicit privacy, clinical, and outcome-claims boundaries;
10. links to organization trust, procurement, FAQ, and contact surfaces.

## Pilot builder data boundary

The pilot builder uses only fixed enum selections:

- broad care setting;
- flagship module;
- pilot scale;
- planning horizon;
- primary evaluation focus.

The browser does not request names, email addresses, organization identifiers, patient details, diagnoses, medications, orders, case narratives, plan information, or free text. The generated brief remains in memory for the active browser tab and can be copied or printed by the user.

Analytics receive only fixed event and action identifiers already allowed by the organization analytics framework. Answer-level values are not transmitted.

## Private operating system

Private product development remains outside this repository and is divided across:

- **Notion:** strategy, guide registry, evidence-dossier records, reviewer workflow, decision logs, and pilot operations;
- **Private source repository:** structured guide content, schemas, automated QA, export tooling, version manifests, and non-PHI fixtures;
- **Controlled Drive:** source PDFs, review copies, editable hospital deliverables, contracts, credentials, and testing records;
- **Linear:** dependencies, development gates, external review, patient testing, pilot preparation, and release control.

## Future technical phases

### Phase 1 — Controlled content delivery

- print-ready PDF;
- accessible tagged PDF;
- responsive HTML;
- structured text and metadata;
- hospital-editable fields;
- controlled image and video assets.

### Phase 2 — Hospital-controlled workflow

- upload into approved patient-education libraries;
- AVS and patient-portal distribution;
- local patient-specific personalization;
- local documentation and assignment;
- version reconciliation and content recall.

### Phase 3 — Interoperable delivery

Only after paid demand, security resources, and stable content operations:

- API delivery;
- FHIR `DocumentReference` packaging;
- SMART on FHIR application review;
- EHR patient-education interfaces;
- content-management connectors;
- enterprise analytics with an approved data flow.

## Security and PHI posture

The initial technical model is deliberately designed so CAF does not receive PHI. Healthcare organizations retain responsibility for patient assignment, personalization, documentation, and clinical response inside their approved environments.

Any future workflow that creates, receives, maintains, or transmits PHI requires a separate architecture, threat model, privacy analysis, security review, contracts, access controls, retention rules, incident response, and business-associate determination before implementation.

## Claims posture

The public product may describe its intended design and pilot measures. It may not claim proven reductions in readmissions, emergency visits, adverse events, calls, cost, length of stay, or other clinical and financial outcomes without a defined method and adequate evidence.

## Release rules

The public architecture may be deployed when:

- all routes pass prerender, sitemap, canonical, structured-data, and inbound-link checks;
- the fixed-choice builder passes unit tests;
- the institutional IP boundary gate passes;
- no development-stage statement implies clinical approval or hospital deployment;
- no public content contains medication-specific dosing rules, device settings, patient-specific thresholds, local emergency policy, or individualized treatment instructions from private modules.

## Pilot status

The public route is a controlled product demonstration. The private repository contains version 0.4 review candidates and print-ready HTML exports for all five packages. Those assets remain blocked from patient use until topic-specific clinical review, health-literacy review, accessibility evaluation, patient/caregiver testing, and institutional localization are complete.
