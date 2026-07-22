# COPD, Explained — Coverage and Release Audit

**Assessment date:** July 22, 2026  
**CAF route:** `/patients-families/diagnosis-explained/copd`  
**Primary clinical benchmark:** 2026 GOLD Report and Pocket Guide  
**Supporting patient sources:** NHLBI, CDC, and American Lung Association  
**Release status:** Complete source-checked product preview; independent clinical review pending; noindex and ad-free.

## Evaluation question

Does the COPD product cover the patient-facing subjects required for a useful diagnosis explanation while presenting them more clearly than a conventional long article or continuous medication list?

## Executive finding

**Yes for information architecture and patient comprehension. Not yet for final clinical authority.**

The guide covers COPD meaning, common disease patterns, contributing exposures, spirometry and related testing, treatment goals, rescue and maintenance medicines, inhaled corticosteroid combinations, clinician-directed flare-up medicines, selected add-on treatment, pulmonary rehabilitation, inhaler technique, oxygen qualification and safety, daily management, escalation levels, questions, and teach-back.

The page improves usability by keeping one main lesson in each block, explaining the job of a test or treatment before its technical details, separating rescue from maintenance medicines, and isolating oxygen and flare-up safety boundaries. It does not ask the user for symptoms, test values, medication lists, or oxygen readings.

## Coverage matrix

| Domain | Clinical requirement | CAF implementation | Result |
|---|---|---|---|
| Plain-English definition | Explain persistent airflow obstruction and common COPD disease processes. | Opens with a 30-second explanation and a sentence the reader can repeat. | Covered with low cognitive load. |
| What COPD does not mean | Correct smoking-only, oxygen, inhaler, and prognosis assumptions. | Dedicated misconception panel. | Covered. |
| Disease patterns | Explain emphysema, chronic-bronchitis/airway disease, and mixed features without oversimplifying phenotype. | Three pattern cards plus a warning that labels alone do not select treatment. | Covered with appropriate qualification. |
| Contributors | Smoking, secondhand smoke, workplace exposure, pollution, asthma/development, genetics. | Six cause groups and a no-cause-inference boundary. | Covered. |
| Diagnostic confirmation | Spirometry is central; diagnosis uses symptoms, exposures, and test quality. | Spirometry appears first in a test-purpose sequence and is distinguished from imaging. | Covered and emphasized. |
| Supporting testing | Oxygen assessment, imaging, blood gas, alpha-1 testing, exercise assessment. | Each test states the clinical question and what the patient needs to know. | Covered. |
| Treatment organization | Treatment should address symptoms, exacerbations, function, exposure, and advanced disease. | Five treatment-job cards before medicine names. | Covered with purpose-first design. |
| Rescue medicines | Short-acting bronchodilators and written action-plan use. | Separate rescue card with technique, monitoring, questions, and no-dose-setting boundary. | Covered. |
| Maintenance medicines | Long-acting bronchodilators and regular use. | Separate maintenance card explicitly distinguished from rescue treatment. | Covered. |
| Inhaled corticosteroids | Selected use, combination therapy, and relevant risks. | Separate card explains why it is not automatic for every patient and highlights pneumonia, thrush, and technique questions. | Covered. |
| Flare-up treatment | Selected systemic steroids and antibiotics under clinician direction. | Separate card prohibits use of leftover medicine without a current explicit plan. | Covered with strong safety boundary. |
| Selected add-ons | Newer or specialist therapies for selected phenotypes. | Compact selected-add-on card; avoids presenting them as universal therapy. | Covered without dominating the core guide. |
| Inhaler technique | Device technique, ability, affordability, and adherence materially affect delivery. | Five dedicated principles plus teach-back. | Strongly covered. |
| Pulmonary rehabilitation | Supervised exercise, education, breathing strategies, and support. | Prominent nonpharmacologic treatment card and daily-plan integration. | Covered. |
| Oxygen | Use for measured low oxygen; prescription and fire safety control. | Dedicated oxygen panel explicitly says oxygen is not a generic treatment for breathlessness and prohibits changing flow. | Strongly covered. |
| Exacerbation planning | Baseline, worsening, and emergency states need distinct actions. | Three separate action cards: emergency, prompt contact, and stable plan. | Covered, pending clinical review. |
| Questions and teach-back | Confirm understanding, device use, escalation, and barriers. | Eleven care-team questions and six teach-back checks. | Covered. |
| Practical barriers | Cost, transport, electricity, housing, cognition, mood, and caregiver capacity affect execution. | Embedded in daily planning and questions. | Covered. |
| Privacy | Avoid collecting sensitive personal health information. | Static educational product with no symptom entry or health-data capture. | Covered. |

## Where the product differentiates

1. **Spirometry has a purpose, not merely a definition.** The card explains what the test is trying to establish and why effort and interpretation matter.
2. **Rescue and maintenance medicines are visibly separated.** The reader does not have to infer the difference from a long drug list.
3. **Every medication card uses the same fields.** Job, examples, reason for use, monitoring, questions, and boundary remain predictable.
4. **Device technique is treated as clinical education.** It is not buried in a generic reminder paragraph.
5. **Oxygen is handled as a prescription and safety system.** Flow settings, fire risk, supplier contact, and backup planning are explicit.
6. **Action levels are separated.** Emergency signs are not mixed into routine lifestyle content.
7. **Teach-back tests operational understanding.** The reader must be able to identify medicines, demonstrate devices, and describe escalation.
8. **Execution barriers are part of the clinical plan.** Affordability and home logistics are surfaced before they cause treatment failure.

## Remaining release gate

Before indexing or applying a clinically reviewed label, an independent qualified reviewer must verify:

- COPD definition and pattern language
- Spirometry and testing descriptions
- Medication examples and monitoring statements
- Inhaled corticosteroid risk framing
- Oxygen qualification, prescription, and safety language
- Flare-up and emergency escalation language
- Alpha-1 antitrypsin testing language
- Selected add-on therapy framing

Reviewer name, credentials, date, scope, and corrections must be recorded. The route should remain ad-free unless the medical-content monetization policy is separately reconsidered.

## Final judgment

**Product target achieved:** the guide provides broad, current COPD education in a more scannable, purpose-first, action-oriented format than a conventional continuous article.

**Trust target not yet complete:** independent clinical review remains mandatory before the guide can compete on authority rather than usability alone.
