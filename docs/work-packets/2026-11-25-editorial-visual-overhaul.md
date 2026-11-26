# CAF visual/editorial overhaul — November 25, 2026

## 1. Assignment charter
Implement the founder-requested visual overhaul: professional publication hierarchy and original art for six existing flagship articles. Readers should find a compelling story, understand the reporting, follow the next useful path and discover existing visual explainers. Risk: moderate, reversible presentation/metadata changes. No new articles, tools, commercial activation, clinical scenes or invented firsthand experience.

## 2. Current-state evidence
- Fresh main: d02de4fa7fb473c39f174236c603a236ebd3f253. Vercel production dpl_7r2cSXMDRZq93p2qoeQi96KZkCE4 is READY at same SHA, retrieved directly November 25.
- Live homepage and Tylenol article inspected in rendered desktop/mobile browser before changes. Predominantly text-only story cards and article openings.
- Referenced Visual Overhaul Strategy conversation retrieved in full: six original conceptual covers, restrained publication identity, preserved content/URLs/tools, no sensationalism or generic stock treatment.
- Open PRs #283/#286/#287/#293 inspected; none merged or incorporated. Their work remains separate.
- Current issue #38 permits tested production-safe UX/accessibility/readability/performance/metadata improvements during review. Historical #15 hold concerns a separate Home Health visual. This assignment explicitly authorizes implementation/deployment where available; does not authorize commercial activation. Current owner-only AdSense status remains unverified and no approval is claimed.

## 3. Evidence classification
Repository/deployment/route/build results: DIRECT-CURRENT. Art direction and bounded production request: FOUNDER-CONFIRMATION. Expected readership improvement: INFERENCE. Search, retained readership, newsletter delivery and AdSense approval: UNRESOLVED, not inferred from code.

## 4. Context and decision memory
CAF-D-022/023/024 publication-first and URL-preservation rules retained. D-025's earlier no-redesign experiment is superseded only for this explicit new founder assignment; its audience-evidence caution remains. Existing newer featured reporting remains visible alongside the six covers. All sources/ synced files remain untouched.

## 5. Inherited-decision challenge
| Inherited item | Challenge and disposition | Trigger |
|---|---|---|
| Equal-weight text cards | Current browser inspection supports stronger lead hierarchy; retain newest adjacent stories rather than replace them wholesale. | Reader feedback, second-story behavior |
| Existing 500KiB entry budget | Already nearly full; initial art/metadata implementation exceeded it. Deferred social/JSON-LD updater instead of raising cap. Final 499.88KiB. | Any additional shell code |
| Blanket historical AdSense freeze | Current #38 allows safe tested UX/metadata work; specific founder task governs visual work. No advertising or account status change. | Account-specific restriction or owner correction |
| New illustration assumed useful | Visual interest does not prove distribution or comprehension; treat readership outcome as hypothesis. | Settled 28/90-day cohort evidence |

## 6. Capability plan
GitHub connector + isolated clone for repository/PR; Vercel connector for deployment evidence; built-in image generator for six original raster covers; Pillow only for export resizing/compression/framing; CUA rendered inspection; Vitest, lint, TypeScript, production build and Playwright/axe for validation. No Stripe/Supabase access needed because domains unchanged. No new application dependency or analytics script.

## 7. Role dispositions
Independent review performed by a separate read-only reviewer; all registered perspectives below also examined in the main workstream. These are documented role findings, not claims that 22 independent humans/agents approved the work.

| Role | Status | Finding / acceptance evidence |
|---|---|---|
| Orchestrator | PASS | Bounded visual assignment; complete reading and utility paths preserved. |
| Context steward | PASS | Current main and Vercel reconciled; old blanket release hold is distinguished from current issue #38 and explicit founder design request. |
| Capability router | PASS | GitHub/Vercel direct evidence, built-in image generation, local build/tests and live browser inspection used; no infrastructure additions. |
| Executive strategy | PASS | Strengthens founder publication packaging without increasing article or tool inventory. |
| Product management | PASS | Homepage to reporting to related reading/utilities and visual-explainer discovery remain complete. |
| Healthcare user research | WARN | No new user interviews. Metaphors avoid distress and simulated clinical events; benefit to comprehension remains a hypothesis. |
| Information architecture | PASS | All 192 canonical URLs and 39 redirects preserved; homepage adds links to existing resources. |
| UX and design system | PASS | Serif editorial headings, paper/navy/teal, restrained story borders and intrinsic image dimensions; interface typography retained. |
| Content and evidence integrity | PASS | No article claims, founder experiences, citations or review dates changed. Six conceptual artworks labeled; provenance recorded. |
| Frontend engineering | WARN | Build/lint pass; app typing retains same 37 baseline errors with shifted Index line positions; no new diagnostic. |
| Systems architecture | PASS | One cover registry and reusable image renderer; one deferred social updater shared with existing metadata setter. No new runtime dependency. |
| Backend, data, and security | NOT IMPLICATED | No API, persistence, authentication, payment, account or database changes; existing utility journey exercised. |
| Platform and DevOps | WARN | Full build exits 0, unchanged budgets pass; preview/CI pending before release. Trailing esbuild shutdown cancellation message follows successful prerender/search, process exit verified 0. |
| SEO and discovery | PASS | 192 sitemap/canonical URLs, 39 redirects, zero search warnings; six article images in server OG/Twitter/schema and client navigation. |
| Monetization and conversion | PASS | Existing monthly signup and supporting utilities preserved. No advertising, affiliates, sponsor or lead-generation changes. |
| Analytics and experimentation | WARN | Existing homepage/navigation events retained; no fresh account-level readership baseline or delivered-event evidence. No causal uplift claimed. |
| Accessibility, performance, and reliability | PASS | Article mobile/desktop axe and 320px reflow pass; shared image derivatives and lazy/eager priorities verified. Final homepage/tool repeat recorded below. |
| Privacy, legal, and user protection | PASS | Original AI-assisted conceptual art disclosed; no photography, real patients, copied illustration, sensitive inputs or new tracking. |
| Publishing and governance | PASS | Provenance/prompts documented in docs/editorial-art.md; existing author, review and source metadata preserved. |
| Quality and release | WARN | Technical checks detailed below; release only after exact-head CI/preview and deployed smoke. Baseline Windows fixture issue is explained rather than hidden. |
| Adversarial red team | WARN | Independent reviewer found no material code blocker; required provenance, final CSS retest, homepage/tool axe and social reset checks addressed. Readership uplift remains unproven. |
| Process improvement | PASS | Reusable cover primitive, asset registry, social navigation regression and CI browser suite reduce future metadata/asset drift. |

## 8. Executive accountability
| Perspective | Role mapping | Disposition |
|---|---|---|
| Strategy | Executive strategy, orchestrator | PASS: strengthens RN-led reporting |
| Operations | Context steward, publishing, platform | WARN: final preview/deployment evidence required |
| Finance | Executive strategy, platform | PASS: no new paid service or dependency; bounded static assets |
| Revenue | Monetization/CRO | PASS: no monetization expansion; newsletter retained |
| Product | Product management, IA | PASS: coherent next story and utility paths |
| Technology | Frontend, systems, backend | WARN: pre-existing app typing debt documented |
| Data/analytics | Analytics | WARN: no causal/user-demand proof |
| Discovery | SEO | PASS: URLs preserved, specific artwork previews |
| Editorial | Evidence integrity, publishing | PASS: no invented claims or attribution |
| Healthcare context | User research | WARN: no new interviews |
| Privacy/legal | Privacy/legal | PASS: disclosure and provenance |
| Accessibility/reliability | Accessibility/performance | PASS: responsive/axe checks |
| Quality/release | Quality, platform | WARN: exact-head hosted checks before merge |
| Adversarial | Independent red team | WARN: performance/representation risks mitigated; business hypothesis remains |
| Process | Process improvement | PASS: reusable art/delivery/regression suite |

## 9. Anti-blindness and opportunity review
Strongest countercase: better art may do nothing for qualified discovery, and can slow pages or distract from trust. Mitigation: six purposeful metaphors, compressed variants, local typography, restrained layout, captions, stable URLs and unchanged sources. Existing monthly signup remains a useful retention action; no new premium, referral or sponsor demand is inferred. Additional tooling and article expansion rejected as outside acceptance criteria. Main measurement gap remains actual second-story reading and delivered newsletter/return behavior.

## 10. Quantified impact
- Canonical/indexable routes: 192/192 before and after (0% inventory change). Redirects: 39/39.
- Six of six requested flagship covers: 0 → 6, all with three responsive derivatives plus one social derivative (24 public assets).
- Homepage featured links: 6 → 9; all previous six retained, three additional already-published flagships surfaced.
- Global light neutral/brand tokens affect 192/192 routes visually; no eligibility or tool logic changes. Article cards acquire editorial treatment wherever reused; only the six selected stories have artwork.
- Ad inventory remains 42 explicitly eligible / 150 ad-free; no commercial policy changes.
- New routes/articles/calculators/accounts/database objects/tracking scripts: 0.
- Public asset derivatives total 1,477,537 bytes; each page requests selected sizes rather than all variants. Main 499.88KiB under unchanged 500KiB cap. No threshold raised.

## 11. Anomaly gate
More than 20% of a major surface changes through neutral/primary styling. Explicit founder request authorizes this scope. Independent reviewer challenged tool regression risk; representative utility and homepage axe checks added alongside 320px article reflow. No indexable/commercial/usable inventory reduction. Revert commit restores all visual/metadata changes; no migration required.

## 12. Ranking and decision
Six-story illustration series and reusable delivery outrank broad article/image generation; lead-story hierarchy outranks new navigation or calculators; existing explainer links outrank new hub routes. Preserve all reporting, newest stories, tools and source material.

## 13. Integrated design
Georgia editorial headings on publication/story surfaces, existing sans-serif body and interface, warm paper/navy/muted teal; safety semantic colors remain distinct. Full image metaphors remain visible, never cropped to remove important context. Art and social image paths live in one registry. Art is labeled conceptual/AI-assisted. No factual chart is generated from illustration. See docs/editorial-art.md for prompts and provenance.

## 14. Separate validations
Technical: WARN pending hosted checks; local production build exits 0, API typing passes, full lint 0 errors/15 existing warnings, 15 original focused article/SEO tests + 2 art tests pass. App type check: 37 diagnostics identical to untouched main after normalizing only moved Index line numbers. Full unit suite: 771 pass/1 fails; same CRLF-sensitive quarantine migration assertion independently fails on untouched main (11 pass/1 fail in that file). No SQL or assertion weakened. Browser first pass 14/14, expanded final suite results in release amendment below. Build logs include an esbuild teardown cancellation line after successful prerender/search; actual exit code verified 0.

Business: WARN. Strategic fit established by founder request and published content; no measured traffic or revenue improvement claimed. Retention/CTR assessment should use settled query/device/position cohorts after release. No fresh account metrics retrieved.

## 15. Implementation and acceptance
Homepage lead/newer stories/six images; article cover figures; shared article/compact/next-step cards; homepage discovery of existing visual explainers; server and client social/schema parity; intrinsic responsive art; documented provenance. Test navigation, captions, complete image sets, accessibility, 320px reflow, fallback metadata and supporting tool visibility.

## 16. Release gates
Branch/PR required. Exact head CI and READY preview, review comments and deployed route/image/metadata smoke required before merge. User has authorized deployment of validated visual changes. No AdSense approval, delivery metrics or business lift may be claimed from this work. Preview protection must be respected, never disabled for testing.

## 17. Closeout / release amendment
Implementation complete locally. Hosted release evidence and final browser results will be appended here before final reporting. Rollback: normal PR revert or previous READY Vercel production deployment. Owner-only follow-up: assess settled audience behavior; account-specific AdSense status remains unknown.

## 18. Compounding closeout
Created reusable EditorialCover, editorialCovers registry, deferred social metadata updater, image asset/provenance record, asset unit checks and desktop/mobile metadata/loading/accessibility/navigation browser suite wired into Browser certification. Encoded-text corruption caught during rendered review and corrected from original UTF-8 source; future edits must specify encoding explicitly. Context/decision/evidence/work ledgers link this packet. No memory-folder edits.

### Local final certification

Expanded browser suite: 16/16 pass on final built CSS, including homepage axe, all six article figures/social responses, 320px reflow, archive navigation, and article-to-EOB-tool navigation with metadata reset and tool axe. Desktop/mobile rendered inspection completed. Full build process exit 0 verified directly. Full lint: 0 errors, 15 inherited warnings. Independent reviewer: no material code blocker, required follow-ups completed. Hosted CI/preview pending.

### Hosted certification and performance correction

First head 74c3c01: Vercel preview READY (dpl_uJKtBDM23v464qQ3DRiQf4PvyMr3); authenticated HTTP 200 and correct canonical/cover/caption/social metadata for all six articles; all six mobile WebP files return image/webp. Hosted CI and Decision Journey checks pass, including full unit suite on Linux. Hosted publication, editorial artwork, core journeys, 403(b), cost-share, navigation and CTA suites pass. Employer intake passed on retry (one existing flaky result). Performance correctly blocked release: appointment-cost-preparation had 46 requests against 45 budget. Combined deferred social updater with artwork registry, eliminating its separate request without raising any threshold. New head must pass the same gates. Local existing publisher regression: 34/34 pass.

Coalesced local performance: 7/7 mobile budgets pass, including appointment-cost-preparation at 45 requests (original limit45), and homepage at 36 requests. Build entry now499.88KiB. Independent coalescing review PASS, no cycle/SSR/metadata regression. The initial local navigation repeat raced an in-flight article load before Back; regression now waits for visible article/cover before navigating back. No product timing or threshold bypass.
