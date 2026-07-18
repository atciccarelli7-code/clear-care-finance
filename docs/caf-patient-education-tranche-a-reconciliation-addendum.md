# CAF Patient Education Systems — Tranche A Reconciliation Addendum

**Status:** Binding addendum to the branch reconstruction and merge plan  
**Applies to:** Draft PR #190, AND-20, and reconstruction Tranches A through F  
**Patient-care use:** Prohibited

## Decision

The six-tranche architecture remains the controlling decomposition model. Tranche A, **Public institutional product surface**, does not require a new merge pull request because its controlling artifacts are already present on `main` and match the draft branch by exact Git blob SHA.

Tranche A is therefore fulfilled through reconciliation rather than recreation.

## Evidence

`config/patient-education-reconstruction-reconciliation.json` records:

- the baseline `main` commit;
- the source draft branch and PR;
- eighteen controlling public-surface artifacts;
- the exact Git blob SHA for each artifact;
- a requirement that the local artifact continue to match the recorded `main` blob;
- the rule that any blob drift reopens Tranche A review.

The reconciled surface includes:

- institutional product page;
- fixed-choice Pilot Builder;
- public offering data;
- application routing;
- organization-page entry point;
- SEO metadata;
- browser and accessibility journey specification;
- public planning helper and unit tests;
- capability manifest;
- public package and controlled-preview schemas;
- controlled-preview fixture;
- institutional IP boundary scanner;
- public-contract and capability-manifest validators;
- SEO route utilities and comprehensive-route checks.

## Effect on reconstruction

The original reconstruction sequence is retained as an architecture dependency order:

1. Tranche A — reconciled integrated baseline;
2. Tranche B — structured content and deterministic compilation;
3. Tranche C — quality, localization, organization overlay, and review workflow;
4. Tranche D — release, authority, signing, and tenant isolation;
5. Tranche E — delivery, operations, continuity, and recall;
6. Tranche F — canonical registry, conformance, and CI certification.

Only Tranches B through F require new reconstruction pull requests while the Tranche A blob baseline remains intact.

## Tranche A gates that remain open

Exact file identity does not establish runtime certification. Tranche A must still pass, on the final integrated commit:

- production build;
- browser journeys;
- mobile journeys;
- axe accessibility checks;
- clipboard behavior;
- print intent;
- URL stability;
- console and failed-request checks;
- public-boundary checks;
- regression checks after Tranches B through F merge.

## Drift rule

Any of the following reopens Tranche A as a bounded review unit:

- a recorded artifact no longer matches its Git blob SHA;
- `main` intentionally changes a controlling public-surface artifact;
- a new public Patient Education Systems artifact is introduced;
- route, SEO, privacy-boundary, public-schema, or browser behavior materially changes;
- a security, accessibility, legal, or product review requires modification.

When reopened, Tranche A must be reviewed from the then-current `main`. It must not be restored by force-merging PR #190.

## Claims boundary

It is accurate to say that the eighteen listed Tranche A artifacts match the recorded `main` baseline by exact Git blob SHA.

It is not accurate to infer from that reconciliation that CAF has:

- exact-head certification;
- accessibility conformance;
- clinical approval;
- hospital deployment;
- live integration;
- pilot authorization;
- production readiness;
- demonstrated patient or financial outcomes.

## Completion update

Structural branch reconstruction is complete only when:

- the Tranche A reconciliation check remains green;
- Tranches B through F are reconstructed and merged in dependency order from current `main`;
- one exact integrated commit passes authority, type, unit, build, browser, accessibility, privacy, and conformance certification;
- every intentional PR #190 capability is accounted for;
- PR #190 is closed as superseded rather than merged; and
- private operational requirements remain explicitly separate from public engineering conformance.
