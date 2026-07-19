# Care Readiness workflow contract

## Required inputs

The public review accepts fixed choices only. It must not ask for or store names, dates, doses, diagnoses, contact details, medical record numbers, or free text.

The institutional implementation binds patient-specific values from the approved clinical workflow. Required fields are exact medicine/product, strength, reason, dose, schedule, next dose, duration, prescriber, daytime contact, after-hours contact, pharmacy, and follow-up/monitoring owner. Missing or conflicting values are hard stops.

## State model

`not_started` means no required check has begun. `in_progress` means at least one check has begun and no explicit stop is recorded. `blocked` means teach-back failed or a barrier is marked as an unresolved stop. `demonstrated` means every modeled requirement passed.

`demonstrated` never means clinically approved, safe to discharge in isolation, or authorized for patient use. Institutional clinical judgment and discharge policy control.

## Completion rule

Readiness is derived and cannot be manually asserted. It requires:

1. Exact medication branch selected.
2. Exact regimen selected when the medication has divergent instructions.
3. Staff reconciliation confirmed against the final medication list.
4. Organization-approved bleeding, injury, procedure, daytime, and after-hours plan confirmed.
5. Every teach-back task passed without prompting or passed after re-teaching and recheck.
6. Every identified barrier resolved or retained as open with a safe named backup.

Viewing content, printing, switching views, or reaching the last screen does not satisfy any check.

## Safety branching

- No generic missed-dose instruction may appear before medication binding.
- Rivaroxaban requires one of three exact regimen branches.
- Enoxaparin deliberately provides no generic missed-dose rule.
- Conflicting final documents, multiple anticoagulants, bridge therapy, or uncertain products require clinician/pharmacist reconciliation outside this public review.

## Barrier contract

Each barrier has a fixed ID, plain-language label, recommended role, recommended action, and status. Allowed statuses are `identified`, `resolved`, `open_with_safe_backup`, and `unresolved_stop`. The institutional record must also name the actual owner and deadline in the approved system of record; those values are intentionally absent from the public review.
