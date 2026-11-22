# November 22 reader experience release

This release applies the site review to existing destinations. The baseline is GitHub main and Vercel production at 155877b. The independently reviewed Medicare and Medicaid changes hub remains in draft PR #293.

- The chart essay leads with the original opening, moves the system map after the opening, and links to full review details and sources.
- The article library puts search and subject filters first. Title matches lead results. The homepage introduces the feature package sooner, and mobile navigation provides direct article access.
- The multiple-bills guide reconciles two hypothetical claims using CMS's specific EOB and medical-bill guidance. Its contextual next step opens the existing document router. The checker and financial navigator now accurately name and link to the existing local follow-up dashboard.
- The home-health guide distinguishes referral, selection and confirmed visits using the founder's supplied case-management notes. The rehab comparison guide now has a different job from the Medicare coverage explainer, which explains the conditional 100-day maximum, coinsurance and skilled maintenance rules.

Release scope: five of 81 article destinations change substantively, plus the homepage, article library, checker and billing hub. The shared mobile navigation changes sitewide. All 192 canonical URLs and existing ad classifications stay in place. Revert the release commit to roll back the presentation and content changes.

## Reader outcome baseline

Track a fixed cohort of the chart essay, multiple-bills guide, EOB guide, home-health guide and the two rehab guides. Compare the 28 settled days before production with the first 28 settled days after. Record dates, consent coverage, any synthetic traffic exclusions and gaps. Review counts and main paths before drawing conclusions.

| Measure | Existing source | Verified baseline |
| --- | --- | --- |
| Search entries | Search Console page totals, with page queries kept separate | Latest accessible export ended October 21. Property totals were 79 clicks and 12,322 impressions. The three bill pages drew 25 clicks on 2,864 impressions. This is historical context, not the pre-release window. |
| Related reading and toolkit handoffs | Consented next_step_click events, source and destination paths | Ingestion and totals unavailable |
| Useful tool completion | Existing journey result events where implemented | Totals unavailable |
| Newsletter signup and repeat readership | Consented events and aggregate saved-contact data | Totals unavailable. A verified sender and draft broadcast do not establish production delivery. |

Verify the production sender and save → welcome → issue → unsubscribe flow with an authorized test recipient before expanding newsletter placement. Keep subscriber data out of the scoreboard. The existing release and analytics setup is sufficient for this bounded change. No new tracking or personal-data fields are needed.

## Review and release

Editorial review verified the hypothetical arithmetic, original notes, and claim-specific sources. Product, UX, discovery and release reviews prioritized the sampled reader paths and stable URLs. The remaining warnings are limited measurement coverage, protected-preview smoke access, and the separate policy draft's source freshness and preview checks. Revenue, payments, backend permissions and new data collection are outside this release.

Local validation: production build and route checks passed, including the unchanged JavaScript budget. All 34 publication browser checks passed at mobile and desktop widths with external fonts stubbed for the restricted test environment. The focused unit rerun passed. The full Windows sweep encountered a pre-existing line-ending assertion and a Benefits workspace test that passed on rerun. Hosted release checks are tracked in PR #294.
