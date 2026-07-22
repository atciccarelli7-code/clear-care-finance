# Heart Failure, Explained vs. Mayo Clinic

**Assessment date:** July 22, 2026  
**CAF route:** `/patients-families/diagnosis-explained/heart-failure`  
**Benchmark:** Mayo Clinic, “Heart failure — Diagnosis and treatment”  
**CAF release status:** Complete source-checked product preview; independent clinical review pending; noindex and ad-free.

## Evaluation question

Did Community Acquired Finance cover the clinically important subjects in the Mayo Clinic reference while making the information easier for an average patient or caregiver to understand, navigate, and act on?

## Executive finding

**Yes for the targeted information architecture and comprehension objective. Not yet for clinical authority.**

CAF covers the major patient-facing domains present in Mayo’s diagnosis-and-treatment resource: diagnosis, tests, ejection fraction, types and classifications, treatment goals, medication classes, procedures and devices, daily management, worsening symptoms, coping barriers, and questions for appointments. It improves the learning experience by separating those subjects into short, labeled units and by explaining the purpose of each test or medication before adding detail.

Mayo remains stronger in institutional authority, named clinical review, and breadth of embedded institutional infrastructure. CAF must not claim to be clinically superior until an independent qualified reviewer completes and records the review.

## Coverage matrix

| Domain | Mayo Clinic approach | CAF approach | Result |
|---|---|---|---|
| Plain-English definition | Definition is distributed across disease pages and diagnosis context. | Begins with a 30-second explanation and a sentence the reader can repeat. Explicitly corrects the misconception that heart failure means the heart has stopped. | CAF is more immediately usable. |
| What the diagnosis does not mean | Important distinctions are present but not consolidated. | A dedicated “what it does not automatically mean” panel addresses stopped-heart assumptions, preserved EF, treatment variation, and improved EF. | CAF is clearer. |
| Types and classifications | Explains EF categories, NYHA functional classes, and ACC/AHA stages in a substantial section. | Uses the current 2026 reduced, preserved, and improved EF framework, explains each in a card, and notes that older resources may use mildly reduced EF or side-based labels. | CAF is simpler and more current; Mayo is broader on formal staging detail. |
| Possible causes | Covered comprehensively across heart-failure cause material. | Groups causes into six memorable categories and explicitly states that the page cannot identify the reader’s cause. | Comparable coverage with a stronger safety boundary in CAF. |
| Tests and diagnosis | Lists blood tests, ECG, chest X-ray, echocardiogram, stress testing, CT, MRI, angiography, biopsy, and other studies, often with paragraph explanations. | Each test has three fixed fields: test name, the question it helps answer, and what the patient needs to know. | CAF is easier to scan and remember. |
| Ejection fraction | Explains EF and uses it in classifications. | Defines EF early and repeatedly warns that the full clinical picture matters more than one number. | CAF better controls overinterpretation. |
| Treatment goals | Treatment appears through medication, procedure, and lifestyle sections. | Starts with five treatment jobs: relieve congestion, reduce workload, protect the heart, treat causes, and preserve function and quality of life. | CAF gives the reader a better organizing model. |
| Diuretics | Correctly uses “water pills” and explains fluid removal, breathing, electrolytes, and monitoring in paragraph form. | Uses a purpose card: common language, examples, the job, why it may be used, monitoring, questions, and a clear no-dose-change boundary. | CAF delivers the same core lesson with lower cognitive load. |
| Major medication classes | Broad and clinically useful list of ACE inhibitors, ARBs, ARNI, beta blockers, MRAs, SGLT2 inhibitors, diuretics, digoxin, vasodilators, ivabradine, vericiguat, anticoagulants, and related drugs. | Covers the same major patient-relevant groups in six collapsible purpose cards, organized by treatment job rather than a continuous drug list. | Comparable core coverage; CAF is more navigable. |
| Medication safety | Tells readers not to stop or change medicines without the care team. | Repeats a class-specific boundary on every medication card and avoids doses, missed-dose rules, or individualized combinations. | CAF makes the boundary more visible. |
| Procedures and devices | Covers coronary treatment, valve procedures, ICD, CRT, VAD, transplant, and palliative care. | Covers the same major categories in compact purpose cards explaining the problem each option is intended to solve. | Comparable patient-facing coverage; Mayo provides greater procedural depth. |
| Daily management | Covers medication adherence, weight, symptom tracking, blood pressure, lifestyle, sodium, activity, smoking, alcohol, sleep, stress, and appointment preparation. | Converts the work into seven operating steps: written medications, consistent weight, symptom pattern, individualized sodium/fluid plan, activity, OTC review, and practical barriers. | CAF is more action-oriented; Mayo contains more lifestyle prose. |
| Worsening symptoms | Warning signs are present across symptom and treatment pages. | Three visually separate levels: call emergency services, contact the team promptly, and continue the stable plan. Every level includes a verification statement. | CAF is substantially easier to act on, pending clinical review. |
| Appointment questions | Provides a preparation section and questions to expect or ask. | Provides ten diagnosis-specific questions and a six-item teach-back check. | CAF is more focused on comprehension and care-plan execution. |
| Cost and access barriers | Limited within the core clinical article. | Explicitly prompts medication cost, pharmacy access, transportation, scale access, food, mobility, depression, and caregiver-capacity discussions. | CAF better connects clinical education to real-world execution. |
| Privacy | Standard website interaction. | Requests no symptoms, test values, medication list, diagnosis history, or free-text health information. | CAF has a clear privacy-minimized product boundary. |
| Source transparency | Extensive Mayo references and institutional review infrastructure. | Displays professional guidelines, AHA patient resources, NHLBI, Mayo as benchmark, review scope, dates, and pending-review status. | Transparent, but not yet equivalent to Mayo’s institutional review authority. |

## Where CAF clearly improves the experience

1. **Purpose before detail.** Tests and medicines begin with the question or job, not terminology.
2. **One lesson per block.** Definitions, monitoring, safety, and questions are not buried in the same paragraph.
3. **Progressive disclosure.** Medication cards can be opened individually instead of presenting the entire pharmacology list at once.
4. **Action hierarchy.** Emergency, prompt-contact, and stable states are visually and verbally separated.
5. **Teach-back.** The reader is asked to prove understanding in their own words.
6. **Execution barriers.** Cost, transportation, access, caregiver capacity, and home practicality are part of the clinical education.
7. **Current terminology.** The guide incorporates the June 2026 Second Universal Definition’s reduced, preserved, and improved EF categories.

## Where Mayo remains stronger

1. **Institutional clinical authority and governance.** Mayo’s resource is produced within a large academic clinical organization.
2. **Formal clinical review.** CAF’s independent reviewer is not yet named or recorded.
3. **Depth for uncommon testing and advanced interventions.** Mayo provides more detail for readers seeking a broad reference.
4. **Mature content ecosystem.** Mayo can connect readers to extensive disease, procedure, physician, and appointment infrastructure.

## Release decision

The CAF guide succeeds as a **better comprehension and navigation product**, but it should not yet be presented as a better clinical authority.

Release controls required before search indexing or “clinically reviewed” labeling:

- A qualified independent clinician reviews definitions, type language, medication cards, monitoring statements, and emergency thresholds.
- Reviewer name, credentials, review date, and review scope are recorded.
- Any requested corrections are implemented and regression-tested.
- Mobile, print, keyboard, and screen-reader checks pass.
- The final guide remains ad-free unless the medical-content monetization policy is separately reconsidered.

## Final judgment

**Target achieved:** CAF preserves the clinically important topic coverage while making the guide substantially easier to scan, understand, discuss, and use.

**Remaining gate:** Independent clinical review is required before the product can credibly compete with Mayo on trust rather than only on usability.
