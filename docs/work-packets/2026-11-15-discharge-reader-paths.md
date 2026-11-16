# Discharge reporting and reader paths

## Decision and evidence

- GitHub main and Vercel production were aligned at `472792b93f08709092f15394627c63adbcfaa679` before this work. Vercel reported READY for `dpl_ZCSGevicPoApybMugrWHJ1z69cGe`. The September founder batch and hospital-side Medicare Advantage article were present on the live domain.
- The October 23 Search Console Web export (last 12 months) recorded 5 clicks on 189 impressions for the waiting-on-insurance article and 3 on 133 for the founder rehab article. These are landing-page rows. Tylenol led the export at 14 on 1,506, but prior work already addressed its high-intent reading path.
- Live sampling covered the homepage, patient hub, chart and home-readiness articles, the three rehab/insurance pieces, and the short-term rehab reference. Three founder articles defaulted to generic library links even though CAF had directly applicable destinations. The legacy rehab reference already routes readers to the founder piece and Medicare coverage information. Its practical intent is distinct enough to retain.
- The live sitemap contained 192 URLs. Sampled pages exposed separate canonical URLs and meaningful HTML. Robots allowed the public and advertising crawlers. The earlier audit and article disposition ledger separate ad placement from indexability. No URL or ad inventory change follows from this evidence.
- The current founder manuscript's capacity, post-acute eligibility, and caregiver-work sections inform the revised reader actions. The transfer timeline is marked hypothetical. The existing articles retain the founder's argument about fragmented authority and the counterpoint that utilization review and facility safety assessment serve legitimate purposes.
- The prior internal record references low-value content. The current exact notice and account decision date were unavailable. Google's published readiness and publisher inventory guidance supports original contributions and usable navigation. It does not identify a specific CAF route as a rejection cause.

## Changes and validation

Four existing articles receive updates, with zero public routes added or withdrawn. The insurance-delay article distinguishes the plan's receipt-to-decision clock from the full hospital-to-facility timeline and gives readers four possible status updates and their next actions. The chart article gives a way to describe a specific bedside observation. The home-readiness article walks through the first evening. The rehab article adds the CMS payment-model waiver and directs readers back to the status questions.

Primary sources include [CMS decision timeframes](https://www.cms.gov/initiatives/burden-reduction/overview/interoperability/frequently-asked-questions/improving-prior-authorization-processes), [standard Medicare Advantage determinations](https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-B/part-422/subpart-M/section-422.568), [Medicare appeals](https://www.medicare.gov/providers-services/claims-appeals-complaints/appeals), [Medicare SNF eligibility](https://www.medicare.gov/coverage/skilled-nursing-facility-care), and [the CMS TEAM waiver](https://www.cms.gov/files/document/mm14098-implementing-transforming-episode-accountability-model-skilled-nursing-facility-3-day-rule.pdf).

| Review perspective | Disposition and evidence |
| --- | --- |
| Orchestration, context, capability, operations and strategy | Pass for the bounded scope. Use exact main and live baseline rather than the checkout's stale branch. Reuse prior inventory, manuscript and Search Console work. |
| Product, healthcare users, architecture, editorial and information architecture | Pass. Differentiate charting, payer status, placement and readiness for home. A submitted referral, a plan decision and a staffed bed remain distinct. |
| Finance, conversion, monetization, analytics and discovery | Warn on absent current AdSense and engagement evidence. Keep the reviewed sensitive inventory and retain canonical URLs. Existing next-step click events provide source and destination without additional collection. |
| Frontend, UX, accessibility and release | Use the existing article sections and link cards. The status updates stack on mobile. Verify the reader path in the two browser profiles and require exact-head CI and preview. |
| Privacy, legal, risk, backend and data | Pass for reviewed sources and hypothetical examples. No case records, accounts, data collection or payment changes are involved. |
| Platform, publishing, red team and process | Keep publication dates and prior full-review dates. The file change is reversible in one revert. Avoid interpreting a selected appeal sample as all denials or an authorization deadline as a discharge promise. |

After release, compare 28 settled days of article-to-article or article-to-tool next-step clicks and Search Console page rows with the prior 28 days if available. Sparse counts do not establish impact. Revisit resubmission once the exact policy notice and production verification are available.
