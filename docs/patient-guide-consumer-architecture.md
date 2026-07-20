# CAF Consumer Hospital & Patient Guide Architecture

Status: active consumer program. Decision date: July 19, 2026.

## Purpose

CAF provides RN-led, plain-English guides for healthcare, hospitalization, insurance, benefits, and recovery at home. The Hospital & Patient Guide helps people organize what to verify, ask, prepare, and assign. It does not replace the treating team or written medical instructions.

## Canonical routes

- `/patients-families/hospital-guide`
- `/articles/safe-hospital-discharge-first-72-hours`
- `/articles/blood-thinner-safety-before-going-home`
- `/articles/copd-recovery-after-hospital`
- `/articles/heart-failure-plan-after-discharge`
- `/articles/new-home-oxygen-nebulizer-guide`

Paused institutional routes redirect into this consumer system and do not belong in the sitemap.

## Shared guide anatomy

- The most important thing.
- What to verify today.
- Questions to ask.
- Patient and caregiver responsibilities.
- Access, refill, equipment, follow-up, and coverage continuity.
- What to do when the plan fails.
- Author, dates, review status, sources, limitations, and related CAF resources.

## Guide finder

Fixed choices only. No names, dates of birth, diagnoses, symptoms, medication or dose fields, hospital/provider names, IDs, records, uploads, or free text. Results are educational navigation, not medical recommendations.

## Withheld public content

No exact medication dosing, product-specific missed-dose rules, oxygen-setting changes, procedure hold or restart timing, universal emergency thresholds, personalized symptom decisions, hospital-localized instructions, private evidence maps, reviewer work product, or editable clinical masters.

## Advertising

High-risk medication, oxygen, emergency, checklist, and interactive surfaces are ad-free by default. No health selection data is passed to advertising systems.

## Release principle

Publish only after public-safe content, authoritative sources, review metadata, privacy, routing, accessibility, and content-boundary checks pass. Publication does not imply independent medical review, hospital approval, or patient-specific suitability.
