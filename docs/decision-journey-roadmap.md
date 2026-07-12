# Decision Journey Improvement Program

This branch establishes the shared infrastructure and first integrated journeys for Community Acquired Finance.

## Implemented in this tranche

- Article and route freshness metadata support
- Visible route-level review information for high-risk pages
- Automated content-freshness build validation
- Canonical decision-journey registry
- Versioned, defensive, local-only decision workspace
- Turning 65 Medicare enrollment pathway
- Medical Bill Case Dashboard integrated into the existing toolkit
- Hospital Discharge Command Center integrated into the existing discharge guide
- Student-loan versus retirement contribution bridge
- Healthcare Career Decision Center
- Audience-first desktop and mobile navigation
- Expanded Patients & Caregivers command page
- Unit tests for Medicare timing, decision-workspace parsing, and student-loan priority logic

## Existing systems reused rather than duplicated

- Benefits Command Center remains the canonical compensation, offer-comparison, and open-enrollment receipt workspace.
- Medical Bill Review Toolkit remains the canonical bill-resolution route.
- Hospital Discharge Coverage Guide remains the canonical discharge route.
- Medicare Advantage and Medigap tools remain the canonical plan-structure comparison routes.

## Follow-on work intentionally not disguised as complete

- Deeper Benefits Election Receipt field-level distinctions
- Automatic transfer of every calculator result into the shared workspace
- State-specific long-term-care Medicaid pathways
- Dedicated childcare-benefit calculator and tax-interaction model
- Full browser-based E2E test suite

These items should be implemented in subsequent PRs after the shared workspace and first pathways are validated in preview.
