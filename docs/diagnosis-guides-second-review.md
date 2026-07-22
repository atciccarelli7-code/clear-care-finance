# Diagnosis, Explained — Second Product, Source, and Comparator Review

**Review date:** July 22, 2026  
**Products:** Heart Failure, Explained; COPD, Explained  
**Review stage:** Post-remediation, pre-independent-clinical-review  
**Release decision:** Remain clinical-review previews, noindex, ad-free, and excluded from the sitemap.

## Executive conclusion

The first review correctly identified that the products were differentiated but not yet mature enough to become the template for rapid diagnosis expansion. The remediation pass closed the material source-governance and first-use usability gaps without weakening the education-after-diagnosis boundary.

The two products now operate as a coherent system:

1. A short entry path helps the reader choose diagnosis, medicines, daily management, or escalation.
2. The comprehensive reference remains available below the entry path.
3. A dedicated print surface produces a concise care handout rather than printing the entire long webpage.
4. High-risk claims are governed by a source-to-claim matrix rather than by the mere presence of a reputable source in a bibliography.
5. Professional and regulatory guidance controls clinically consequential claims; Mayo Clinic and similar resources are explicitly used as coverage and usability comparators.

The offering is ready for independent clinical review. It is not ready to be called clinically final or opened to search indexing.

---

## Changes implemented after the first review

### Heart Failure, Explained

- Added a dedicated explanation distinguishing:
  - ejection-fraction type or phenotype;
  - A-to-D stage; and
  - NYHA functional class.
- Added care-team questions and teach-back checks for all three systems.
- Added the 2024 ACC HFrEF Expert Consensus Decision Pathway.
- Added the 2023 ACC HFpEF Expert Consensus Decision Pathway.
- Added the AHA patient-facing Classes and Stages resource.
- Re-anchored warning-sign and weight-change language to AHA patient guidance.
- Explicitly demoted the 2022 NHLBI heart-failure treatment page to supplemental lifestyle and living-with support; it is no longer treated as authority for current pharmacotherapy or HFpEF claims.
- Preserved the four-foundational-class HFrEF explanation without providing sequencing or dosing instructions.
- Added a four-path quick-start layer and a concise print handout.

### COPD, Explained

- Revised alpha-1 antitrypsin deficiency education to prompt at least one test for people diagnosed with COPD, regardless of age or ethnicity.
- Added alpha-1 testing to the care-team questions and teach-back checks.
- Added the 2023 ATS pulmonary-rehabilitation guideline.
- Added the ATS home-oxygen guideline.
- Added the Alpha-1 Foundation/COPD Foundation clinical practice guideline.
- Added FDA regulatory support for ensifentrine.
- Reframed the advanced medication section as “Less-common specialist medicines” rather than a general treatment checklist.
- Preserved the oxygen-flow, inhaler-dose, and flare-up-treatment boundaries.
- Added a four-path quick-start layer and a concise print handout.

### Cross-product governance

- Added `docs/diagnosis-guides-source-claim-matrix.md`.
- Defined three source tiers:
  1. professional or regulatory authority;
  2. federal or specialty patient education; and
  3. external coverage benchmark.
- Added claim-domain ownership, patient-education boundaries, and refresh triggers for both diagnoses.
- Added automated regression tests for the corrected source hierarchy and the clinical boundaries.
- Added route-specific Letter and A4 PDF certification for both concise handouts.

---

## Comparator reassessment

### Compared with Mayo Clinic

Mayo Clinic remains stronger in institutional authority, breadth, and conventional comprehensive coverage. It includes detailed diagnostic testing, treatment lists, procedures, and appointment preparation.

Community Acquired Finance is now stronger in the sequence of comprehension and action:

- the reader chooses the immediate task before entering the full guide;
- tests are organized by the question they answer;
- medicines are organized by purpose, monitoring, questions, and a safety boundary;
- type, stage, and functional class are separated rather than blended;
- daily management and escalation are treated as operating systems;
- teach-back checks expose what remains misunderstood;
- practical barriers are surfaced before they cause plan failure.

Mayo remains a benchmark, not the authority for time-sensitive medication or oxygen claims.

### Compared with WebMD

WebMD has current medically reviewed content and accessible language, but much of the patient journey is distributed across separate pages for diagnosis, stages, medicines, quality of life, and flare-up prevention.

Community Acquired Finance provides a more integrated post-diagnosis path. The reader can move from mental model to medication purpose to home plan to escalation without reconstructing the care journey across several articles.

### Compared with MedlinePlus

MedlinePlus remains the strongest concise official baseline and an appropriate source for basic patient-facing language and navigation to federal resources.

Community Acquired Finance adds the operational layer that MedlinePlus generally does not attempt:

- medication-job decoding;
- individualized-plan boundaries;
- teach-back;
- practical access barriers;
- structured questions; and
- a dedicated concise handout derived from the comprehensive guide.

### Compared with Cleveland Clinic

Cleveland Clinic remains useful for conventional patient-language and coverage comparison. Its principal reviewed heart-failure and COPD pages are older than the current specialty guidance used in these products, so they should not lead 2026 treatment claims.

---

## Second-review findings by product

### Heart failure

#### Resolved

- **Classification confusion:** Resolved through separate phenotype, stage, and functional-class cards.
- **Stale treatment source:** Resolved by demoting the 2022 NHLBI treatment page and adding current ACC pathways.
- **Escalation authority:** Resolved by making AHA patient guidance the primary source basis.
- **First-use cognitive burden:** Reduced through the four-path entry layer.
- **Unusable whole-page printing:** Resolved through a dedicated concise handout.

#### Remaining risks

1. **Independent clinical review remains absent.** Medication, monitoring, and emergency wording still require a named qualified reviewer.
2. **HFpEF guidance is time-sensitive.** ACC lists an update to the 2023 HFpEF pathway in its 2026 clinical-policy pipeline. The August 22, 2026 content review must check whether the update has been released and revise claims if needed.
3. **The concise handout is intentionally generic.** It must never be mistaken for a completed patient-specific discharge plan.
4. **Medication cards remain information-dense.** The quick-start layer reduces the initial burden, but real user testing may show that some readers still need an even shorter medication summary.

### COPD

#### Resolved

- **Alpha-1 testing was too narrowly framed:** Resolved with broad one-time testing education.
- **Pulmonary-rehabilitation authority:** Resolved with ATS professional guidance.
- **Oxygen authority:** Resolved with ATS home-oxygen guidance.
- **Newer medicine sourcing:** Improved with GOLD and FDA support.
- **Advanced-treatment prominence:** Reduced by reframing these options as less-common specialist therapies.
- **First-use cognitive burden:** Reduced through the four-path entry layer.
- **Unusable whole-page printing:** Resolved through a dedicated concise handout.

#### Remaining risks

1. **Independent clinical review remains absent.** Inhaler, oxygen, flare-up, and emergency language still requires named qualified review.
2. **GOLD updates annually.** The COPD guide needs a formal yearly refresh even when no obvious page-level change occurs.
3. **Alpha-1 guidance is clinically important but older.** The current recommendation remains widely cited and supported, but the source matrix must trigger review if GOLD, ATS, ERS, or the Alpha-1 Foundation publishes updated guidance.
4. **New specialist medicines can change quickly.** Every named drug requires a regulatory and GOLD refresh whenever indication or safety information changes.

---

## Usability reassessment

### What improved

- The user no longer has to scan an entire long page to find the immediate task.
- The four quick paths use the same mental model across both diagnoses, improving transfer learning.
- The complete guide remains available, so simplification did not remove depth.
- The print action now communicates exactly what it produces: a concise handout.
- The print surfaces preserve the clinical-review warning and patient-specific-plan boundary.

### What still needs real-world testing

Automated browser and accessibility tests cannot determine whether a recently discharged patient can understand and use the material under stress. The next product validation should include observed use by:

- at least one qualified clinical reviewer;
- nurses who regularly provide discharge education;
- patients or caregivers with no clinical background; and
- users with low health literacy, visual limitations, or limited digital comfort.

The testing objective should not be “Did they like it?” It should be whether they can accurately teach back:

1. what the diagnosis means;
2. the job of their own treatment categories;
3. what they monitor;
4. whom they call; and
5. which changes require emergency help.

---

## Validation record

The remediation branch must not merge until all of the following pass:

- lint;
- full unit suite;
- patient-guide public contract;
- medication and clinical-boundary tests;
- publication and AdSense governance;
- production build, bundle budget, and prerender;
- browser and accessibility journeys;
- desktop and mobile visual capture; and
- route-specific Letter and A4 PDF generation for both concise handouts.

Passing these gates establishes technical and governance readiness. It does not replace independent clinical review.

---

## Release decision

**Decision: keep both routes in clinical review.**

The products are now suitable to hand to independent clinical reviewers and representative users. They should remain:

- `noindex, nofollow`;
- excluded from the sitemap;
- ad-free; and
- labeled as clinical-review previews.

No third diagnosis should become a production template until:

1. the two concise handouts pass visual inspection in Letter and A4 formats;
2. an independent clinical-review workflow is operational;
3. reviewer corrections are incorporated; and
4. at least a small observed usability test confirms that patients can navigate the short path and accurately teach back the core plan.

After those gates, the third diagnosis should test a different educational archetype—such as atrial fibrillation or anticoagulation—rather than repeating another chronic cardiopulmonary guide with the same information structure.
