# CAF editorial art system

Owner: Andrew Ciccarelli / CAF editorial. Created November 25, 2026 for the six existing flagship articles. All six are original conceptual illustrations generated with the built-in image generation tool under editorial direction; no licensed photography, patient imagery, third-party illustration or real-event representation is used. The public hero caption identifies AI assistance and the conceptual nature of the image. Headline text remains live HTML, never embedded in art.

## Design and delivery

Georgia/Times editorial headlines use local system fonts with no new font downloads. Sans-serif interface and body typography remain. Warm paper (#FAF8F3), ink navy (#112B3C), muted teal and small ochre accents align the artwork. Semantic safety, caution, completion and action tokens remain distinct. Core light neutral/brand tokens are adjusted; existing dark mode overrides remain available.

Canonical artwork registry: `src/data/editorialCovers.ts`. Shared delivery: `EditorialCover.tsx`. Cards use empty alt because the same link already names the article; full article figures use descriptive alt and a visible conceptual-illustration caption. No factual chart is substituted by the art.

Each artwork has 480, 960 and 1440px WebP variants at the original 3:2 ratio, intrinsic dimensions, responsive sizes and lazy loading except lead/article heroes. The entire metaphor is preserved without cropping. Six separate 1200x630 JPEG social previews contain the art inside a paper frame; complete art is preserved. Social metadata and Article image schema are present in server-rendered HTML, then maintained on client navigation. Unrelated routes reset to the established 512px site icon and summary card. The shared social/JSON-LD updater is loaded separately to preserve the existing 500KiB entry limit.

Files: `public/images/editorial/{name}-{480,960,1440}.webp` and `{name}-og.jpg`. The six original selected PNGs are also retained in the local sibling `caf-editorial-originals` folder; source generation references below support later editing. Public derivatives total about 1.48MB across all 24 files, rather than shipping the roughly 15MiB originals. Each page selects one variant per image.

## Prompt set and provenance

Common art direction: original landscape 3:2 conceptual editorial illustration for CAF; restrained cut-paper shapes, fine screenprint texture, warm paper #FAF8F3, navy #112B3C, muted teal #337C80 and small ochre accents. Intelligent calm visual metaphor, generous negative space, legible as a thumbnail. No people, simulated clinical events, distress, money symbols, logos, text, sensationalism, gradients, glossy 3D or generic stock aesthetic.

| Asset | Final subject prompt | Selected generation |
|---|---|---|
| shock-absorber | Hospital resting on a mechanical spring beneath converging pathways carrying unresolved administrative blocks from scattered care buildings. | exec-9209ca56-c330-4b1f-b140-bed953eac907.png |
| family-care | House cutaway with kitchen table, pill organizer, calendar, transport keys and paperwork; task tiles travel from distant hospital through household threshold. Respectful metaphor for invisible work. | exec-b1f0b6b5-61de-40cc-b39f-24d0b2485813.png |
| tylenol | Small unmarked white tablet beneath layered paper billing sheets forming hospital architecture; abstract rules only, no invented prices. | exec-21825a16-a16f-4986-a9de-c24619d1fa21.png |
| nonprofit | Hospital within circulating resource paths branching toward community care and equipment; no halo or implication of free care or universally good conduct. | exec-a75463ca-9eef-446d-8aa1-7b1cdfa170e0.png |
| length-of-stay | Three empty bed bays inside a quiet clock with tick marks, pathway and unaligned gate toward a home; time and interdependent staffed capacity, never patients as inventory. | exec-682952e1-9802-4474-87ce-6718931102ce.png |
| rehab | Four bridge segments carry clinical-review clipboard, coverage paper, empty bed and transport between hospital and rehab; one segment misaligned. Final edit removes all headline lettering and ochre rule, replacing upper area with matching paper texture while preserving the metaphor. | exec-d1dcface-7d6d-4a37-ba28-415c5b435ad4.png |

Generation folder: `01a215bf-9d9a-7831-8ea9-d62bfffb8be5`. Discarded rehab draft `exec-d557a4e0-763f-4278-b35f-18d09aee66c5.png` had embedded lettering and is not shipped.

## Maintenance and measurement

Add a cover only when it strengthens an existing story. Keep provenance, alt, disclosure and derivative sets together. Test image load, canonical/schema/OG parity, 320px reflow, accessible contrast and link destinations before release. Reassess if images fail, layout shifts, loading cost rises or readers misunderstand a metaphor. Measure settled second-story reading, newsletter conversion and visual-explainer use alongside query/device/position-adjusted search CTR; do not claim traffic gains from appearance or build results.
