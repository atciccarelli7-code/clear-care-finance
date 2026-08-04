# Employer Source Legal and Privacy Hardening

## 1. Assignment charter

- **Request:** Review hospital/employer source use for legal compliance and implement the maximum safe corrective scope before expanding source research.
- **User outcome:** Employees can locate and use public employer links without CAF implying affiliation, reproducing hospital documents, exposing search terms in URLs, or treating source discovery as permission for automatic guidance.
- **Risk class:** High for external legal assurance; moderate and reversible for the implemented product safeguards.
- **Non-goals:** Legal opinion, hospital-by-hospital license clearance, insurance-producer advice, ERISA fiduciary services, portal access, document mirroring, or automatic employer-specific recommendations.

## 2. Current-state findings

- Hospital and system names were plain-text identifiers; no logos were used.
- The product already stated that sources were not recommendations and that unreviewed values were not prefilled.
- Public source links were shown from a service-role-only Supabase registry.
- Employer searches used a GET query string, creating avoidable URL/log exposure.
- Source verification and fact review existed, but permitted-use, copyright, trademark, and source-terms review were not represented separately.
- Existing Terms, Privacy, and Disclosures pages already contained broad educational-only, no-affiliation, third-party-link, no-fiduciary, and privacy-minimization boundaries.

## 3. Authoritative external baseline

- U.S. Department of Labor materials identify the SPD, SBC, and controlling plan materials as core participant information; CAF cannot replace the plan administrator or make an official benefits determination.
- The U.S. Copyright Office states that fair use is case-specific; public access is not a blanket right to copy a work.
- FTC guidance requires truthful, non-deceptive representations and clear disclosure of material commercial connections.
- AHRQ identifies the 2023 Compendium as a 639-system research dataset and states that references and links do not imply agency endorsement.
- Vercel documents Web Analytics and Speed Insights as anonymous/cookieless or not tied to an individual, but necessary request and hosting logs still exist; employer query strings were therefore removed from the frontend search path.

## 4. Implemented controls

### Product language

- Changed the surface from a generic national directory to an **independent employer directory**.
- Added a point-of-use no-affiliation statement.
- Added trademark/source-ownership language.
- Added an AHRQ/HHS no-endorsement statement and direct AHRQ 2023 Compendium attribution.
- Renamed source surfaces and CTAs to emphasize external links and manual workspaces.
- Preserved the same source-owner/link-only language inside the attached-source workspace banner.

### Privacy

- Changed directory search from a frontend GET query string to a same-origin POST body.
- Kept GET temporarily for backward compatibility but removed public caching and set private no-store behavior.
- Added visible guidance not to enter credentials, medical information, employee IDs, or confidential information.
- Continued to exclude search terms and employer names from analytics and first-party evidence properties.

### Source-use governance

Added separate fields to research and curated source tables:

- `use_scope`: `link_only`, `metadata_and_facts`, `permissioned_copy`, or `blocked`.
- `rights_review_status`: `not_reviewed`, `linking_reviewed`, `fact_use_reviewed`, `permission_confirmed`, or `blocked`.
- optional terms URL, review timestamp, and review note.

All 116 current discovered sources default to `link_only` and `not_reviewed`. Source verification alone cannot authorize document hosting, reproduction, or automatic fact prefill.

### API and storage

- Public source detail remains restricted to public HTTPS links.
- Sources marked blocked by use scope or rights review are omitted.
- Stored source contexts now reject HTTP, credential-bearing, localhost, local-domain, and non-web URLs.
- Employer catalog and source tables remain forced-RLS, service-role-only tables.
- The search RPC remains executable only by the service role.

## 5. Independent role dispositions

| Role | Status | Finding |
|---|---|---|
| Strategy | PASS | Hardening preserves product utility and future employer coverage. |
| Product | PASS | Point-of-use boundaries are clearer without adding friction to manual entry. |
| Healthcare user | PASS | Controlling plan documents and employee-population verification remain explicit. |
| Content/evidence | PASS | Source verification, rights review, fact review, and recommendation eligibility are now separate. |
| Frontend | PASS pending CI | Search transport and disclosure changes are bounded to the existing route. |
| Backend/data/security | PASS | No new public database access; schema is additive and default-deny. |
| Privacy/legal | WARN | Product safeguards are materially stronger, but external counsel has not reviewed every source owner&apos;s terms or state-specific legal exposure. |
| Accessibility/reliability | PASS pending CI | Existing semantic structure and button/link behavior are preserved. |
| Monetization | PASS | No partner or hospital commercial relationship is implied. |
| Red team | WARN | Future extraction or paid guidance must not bypass the new rights-use gate. |
| Release | PASS pending CI/browser/preview | Migration applied and verified; application release awaits standard gates. |

## 6. Quantified impact

| Measure | Before | After |
|---|---:|---:|
| Systems in baseline | 639 | 639 |
| Discovered source records | 116 | 116 |
| Sources classified link-only | 0 explicitly | 116 |
| Sources approved for document copying | 0 | 0 |
| Sources approved for automatic fact reuse | not represented | 0 |
| Employer searches placed in frontend URL | all directory searches | 0 |
| Hospital logos used | 0 | 0 |
| New public database grants | 0 | 0 |

## 7. Validation and rollback

Required before merge:

- lint and unit tests;
- production build and prerender;
- employer directory Playwright journey;
- mobile/accessibility regression suite;
- Vercel preview READY;
- production API confirms source-use fields and POST search;
- Supabase security advisor and grants rechecked;
- no unresolved review threads.

Rollback is additive and straightforward: revert the UI/API commits while retaining the source-use columns, which are non-destructive and safe to leave in place.

## 8. Unresolved legal work

This implementation is not a legal opinion or a representation that every hospital&apos;s linking terms have been reviewed. Before automatic employer facts or a paid employer-specific recommendation is activated:

1. external counsel should review the no-affiliation, link-only, trademark, ERISA/fiduciary, insurance-producer, and state privacy posture;
2. each source used beyond link-only reference should receive a documented terms/rights review;
3. source-owner objections and takedown requests should be tracked and resolved;
4. any commercial relationship with an employer, insurer, broker, or benefits vendor requires separate disclosure and independence review.

## 9. Highest-value next action

Complete counsel review of the link-only source policy and one fully supported employer pilot before approving any source for `metadata_and_facts` or automatic prefill.
