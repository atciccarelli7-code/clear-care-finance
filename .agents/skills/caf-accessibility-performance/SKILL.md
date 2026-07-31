---
name: caf-accessibility-performance
description: Review Community Acquired Finance accessibility, responsive usability, performance, browser resilience, and degraded-state behavior. Use for every user-facing change and release.
---

# Accessibility, Performance, and Reliability

## Mandate

Ensure healthcare workers, patients, and caregivers can use the platform across abilities, devices, connections, and stressful environments. Accessibility and performance are functional requirements, not final polish.

## Workflow

1. Identify affected user journeys, components, media, forms, dialogs, tables, charts, and dynamic results.
2. Review semantic structure, headings, landmarks, names, labels, instructions, and reading order.
3. Test keyboard navigation, focus order, focus visibility, skip behavior, dialog trapping, and return focus.
4. Verify screen-reader announcements for validation, dynamic calculations, status changes, and errors.
5. Check contrast, non-color cues, text scaling, reflow, zoom, touch targets, motion, and cognitive load.
6. Provide equivalent text or table access for charts and visual comparisons.
7. Test mobile widths, long content, landscape orientation, and large system text.
8. Measure relevant loading, interaction, layout stability, bundle, and route-performance behavior.
9. Inspect slow-network, blocked-script, failed-request, and unavailable-service states.
10. Run automated accessibility and performance checks, then complete manual journey verification.
11. Identify regressions introduced outside the directly edited component.
12. Record exceptions with user impact and remediation ownership.

## Required output

Return:

- `Status`: `PASS`, `WARN`, `BLOCK`, or `NOT IMPLICATED`
- `Journeys and components tested`
- `Accessibility findings`
- `Responsive findings`
- `Performance findings`
- `Reliability and degraded-state findings`
- `Automated and manual evidence`
- `Required remediation`

## Standards

- Target WCAG 2.2 AA behavior for public and application experiences.
- Dynamic calculator results must be perceivable without relying on color or visual placement.
- Tables and charts require meaningful accessible alternatives.
- Core public education should remain usable when optional analytics, advertising, or external services fail.
- Performance budgets and existing bundle checks must not be weakened without explicit review.
- Error messages must explain what happened and what the user can do next.

## Guardrails

- Do not treat automated scans as full accessibility validation.
- Do not hide content from assistive technology to simplify implementation.
- Do not use canvas-only, hover-only, or color-only communication for consequential information.
- Do not defer mobile validation until after release.
- Do not allow advertising, analytics, or affiliate scripts to block core task completion.
- Do not dismiss a slow or unstable flow because it works on a development machine.

## Completion test

The role passes only when the complete journey is operable by keyboard and assistive technology, remains understandable under zoom and narrow mobile conditions, meets performance expectations, and fails gracefully when optional dependencies are unavailable.
