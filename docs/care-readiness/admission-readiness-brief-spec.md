# Admission Readiness Brief specification

## Purpose

The Admission Readiness Brief is the next Care Readiness module after discharge validation. It begins structured education and social-barrier ownership after an admission decision but before the inpatient bed, so patients, families, nurses, physicians, CNAs, pharmacy, and case management share one understandable starting picture.

It is not an admission order, diagnostic tool, disposition prediction, or replacement for case management.

## Trigger and audience

Trigger only after an authorized clinician records the admission decision and an eligible working diagnosis/pathway. Primary audiences are the patient/caregiver and the receiving inpatient team; secondary audiences are ED staff, pharmacy, therapy, social work, case management, and utilization management.

## Patient-facing brief

1. Why the team recommends hospital care, in approved plain language.
2. What is likely to happen before and after reaching the inpatient unit.
3. What medicines, mobility, food/fluid, tests, and safety restrictions the patient should verify with staff.
4. Who is on the care team and how the patient/caregiver can prepare questions.
5. A no-shame early needs check covering communication access, decision support, home entry, mobility, caregiving, medicines, equipment, food, electricity, transport, insurance, and likely post-acute support.
6. A short teach-back: current understanding, immediate plan, and one unresolved concern.

## Staff orchestration layer

Each identified need creates a fixed category, urgency, recommended role, status, owner, due point, action, and backup. High-risk items route immediately; likely placement or complex social needs create an early case-management signal without making an automated placement determination.

## State and completion

`brief_started` → `patient_or_caregiver_oriented` → `needs_screened` → `owners_assigned` → `receiving_team_handoff_confirmed`. Viewing alone never advances state. A critical unmet communication, safety, medication, decision-support, or destination need creates an explicit blocker/escalation.

## Minimum viable pilot

Use one high-volume admission pathway with relatively stable education, one ED, one receiving unit, and a defined case-management route. Start with synthetic and staff simulation. Measure time to case-management signal, time to first owner assignment, duplicated questioning, patient understanding on unit arrival, unresolved-need age, ED boarding workflow burden, and avoidable social-delay days as an exploratory—not causal—outcome.

## Governance requirements

The module needs diagnosis/pathway-specific claim records, qualified review, local admission and escalation workflows, health-literacy and accessibility review, patient/caregiver testing, translation control, privacy/security review, source monitoring, versioned release, and recall. It must not expose unconfirmed diagnoses, make coverage promises, recommend placement, or store narrative social histories in analytics.
