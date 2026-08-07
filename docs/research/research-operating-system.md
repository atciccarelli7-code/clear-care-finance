# CAF Research Operating System

## Objective

Convert raw sources into traceable, dated, confidence-labeled research that can safely inform Community Acquired Finance strategy, content, calculators, product specifications, and implementation.

Research does not become build-ready merely because it has been summarized. It must move through the lifecycle below.

## Source lifecycle

1. **Intake** — source received but not reviewed.
2. **Indexed** — metadata, location, sensitivity, scope, and likely relevance recorded.
3. **Extracted** — material facts, rules, exceptions, limitations, and implications summarized.
4. **Verified** — important claims checked against appropriate controlling or corroborating sources.
5. **Build-ready** — logic, assumptions, edge cases, privacy, accessibility, maintenance, and tests specified.
6. **Superseded** — replaced, expired, or no longer controlling.

## Platform responsibilities

- **Google Drive:** raw PDFs, exports, screenshots, datasets, source snapshots, interviews, and private first-party evidence.
- **Notion:** evidence registry, source studies, synthesis, assumptions, opportunity scoring, and founder decisions.
- **GitHub:** non-sensitive build-ready schemas, source manifests, decision rules, annual values, calculator specifications, ADRs, and tests.
- **Linear:** unresolved research gaps, validation tasks, review work, and implementation gates.

## Evidence classifications

- `verified_primary`
- `verified_secondary`
- `frontline_evidence`
- `inference`
- `hypothesis`
- `superseded`

A document can contain claims with different classifications. Classification applies to each material claim or rule, not automatically to the entire file.

## Required source metadata

Every source record should identify:

- stable ID;
- title and organization;
- source type;
- original location;
- Drive and Notion locations where applicable;
- publication and effective dates;
- jurisdiction;
- completeness and controlling status;
- sensitivity;
- confidence;
- affected products, routes, calculators, or decisions;
- limitations;
- next verification action;
- review cadence.

## Separation rules

- Preserve raw evidence; never overwrite it with a summary.
- Distinguish source-derived facts from founder observation, model inference, and hypotheses.
- Do not generalize employer-specific, state-specific, or plan-year-specific rules without supporting evidence.
- Do not put private employer documents, personal identifiers, health information, or account data in GitHub.
- A source may validate problem complexity without validating willingness to pay.
- Unknowns become explicit research gaps rather than silent assumptions.

## Build-readiness gate

Before implementation, the responsible record must establish:

1. User and decision served.
2. Authoritative sources and effective dates.
3. Rules, thresholds, exceptions, and uncertainty.
4. User or frontline evidence where relevant.
5. Existing CAF assets affected.
6. Inputs, outputs, formulas, and decision logic.
7. Privacy, legal, accessibility, and trust constraints.
8. Maintenance cadence and change-detection sources.
9. Test cases and expected outputs.
10. Status: `ready`, `partially_ready`, or `research_blocked`.

No material build, pricing activation, paywall, navigation reorganization, or product launch should proceed from `partially_ready` or `research_blocked` evidence without an explicit founder exception.