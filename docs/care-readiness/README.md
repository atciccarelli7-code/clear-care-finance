# Care Readiness system

Care Readiness converts patient education from a content-delivery event into a governed handoff. The first working pilot is Blood Thinner Discharge Readiness at `/for-organizations/patient-education-systems/blood-thinner-readiness`.

The product distinction is structural: the module cannot report readiness merely because content was displayed. It binds education to the exact medicine branch, records teach-back outcomes, makes real-world barriers and ownership visible, and produces a stop-or-go handoff state.

## Current controlled scope

- Six adult medicine branches: apixaban, rivaroxaban, dabigatran capsules, edoxaban, warfarin, and enoxaparin prefilled syringes.
- Three non-interchangeable rivaroxaban missed-dose paths.
- Staff-guided and patient/caregiver views.
- Fixed-choice, tab-only review state with no free text or patient identifiers.
- Derived completion logic, patient-facing print sample, public-safe evidence record, and privacy-minimized analytics.
- Candidate `CAF-PE-ANTICOAG-ADULT-EN-PACKAGE-001-V0.3-RC1` remains `clinical_review_required` and `NOT APPROVED FOR PATIENT USE`.

## Architecture

1. The private canonical package owns clinical claims, sources, decisions, review records, and localization requirements.
2. Typed public-safe data exposes only the medicine branches and proof markers needed to evaluate the workflow.
3. A pure readiness evaluator derives status from required checks; the interface cannot directly set a completion flag.
4. Session storage preserves only fixed-choice synthetic progress for the browser tab.
5. Consent-gated analytics receive workflow IDs, stage IDs, status IDs, and aggregate counts—never medicine selections or answer-level details.
6. The print view excludes staff results and barrier state and keeps all patient and organization fields blank.

See the [workflow contract](workflow-contract.md), [clinical release SOP](clinical-governance-and-release-sop.md), [pilot measurement plan](pilot-measurement-plan.md), [localization checklist](localization-and-implementation-checklist.md), [risk register](risk-register.md), and [Admission Readiness Brief specification](admission-readiness-brief-spec.md).
