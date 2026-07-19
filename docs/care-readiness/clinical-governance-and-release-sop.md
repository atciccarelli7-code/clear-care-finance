# Clinical governance and release SOP

## Source hierarchy

Medication instructions must use current FDA-approved product labeling through DailyMed. FDA, AHRQ, CMS, Section 508, and W3C sources govern sharps, communication, teach-back, written-material, and accessibility requirements as applicable. Secondary sources may support discovery but cannot overrule the controlling source.

## Claim lifecycle

1. Assign a stable claim ID and map it to an exact source location and retrieval/review date.
2. Mark medication, missed-dose, emergency, procedure, monitoring, and injection claims as critical where applicable.
3. Require qualified clinical review; require independent dual review for designated critical claims.
4. Record each disputed or local decision in the clinical decision register. Open critical decisions block patient use.
5. Bind the reviewed claim manifest to every generated artifact and record checksums.
6. Run content, link, accessibility, print, privacy, and workflow simulation checks.
7. Complete patient/caregiver testing and correct every serious failure before release.
8. Obtain named release authorization for one organization, version, language, care setting, and effective period.

## Release states

`draft` → `clinical_review_required` → `institutional_localization_required` → `validation_required` → `approved_for_limited_pilot` → `released` → `retired/ recalled`.

This website implementation must remain at `clinical_review_required`. Automated tests, a successful build, a preview deployment, or a polished handout are not clinical approval.

## Change control and recall

Source monitoring must cover labeling revisions, safety communications, broken links, local contact/workflow changes, and reported user confusion. A critical change suspends the affected branch, identifies every distributed artifact by version/checksum, notifies the institutional owner, and replaces or recalls it under the signed pilot process.
