# Site Growth Execution Plan — June 24, 2026

This is a non-production planning artifact. Do not merge or deploy this branch while Google AdSense review is pending.

## Operating rule

Keep production stable until AdSense review is complete. No ad units, new tracking scripts, production redirects, production content swaps, or main-branch deploys from this plan until approval is confirmed and the normal reviewed release path is used.

## Goal

Improve Community Acquired Finance by making the site easier to understand, easier to navigate, more useful through tools, and more discoverable in search without weakening trust.

## Current audit summary

- The app already has strong foundations: Vite, React, TypeScript, React Router, Tailwind, shadcn/ui, calculator components, structured topic/article data, Vercel Analytics, and Speed Insights.
- The core routes already exist for home, healthcare workers, patients/families, tools, articles, topics, glossary, about, contact, methodology, privacy, terms, editorial policy, disclosures, and accessibility.
- The topics model is good: each topic can hold definitions, comparison blocks, fact sheets, calculators, related articles, source lists, and warnings.
- The tools page now has grouped tools and a jump selector, but the next step is deeper task-based tool routing and stronger article-to-tool loops.
- The sitemap currently lists static routes and topic hubs, but it should also include all published article URLs generated from the article data source.
- Article quality is uneven: some articles are strong structured fact sheets, while some legacy records still contain placeholder draft copy in base files even if publication gating prevents them from appearing publicly.
- The strongest next content pillar is Hospital Economics because it differentiates the site from generic personal finance content and connects bedside worker experience with patient billing confusion.

## Priority order

### 1. Information architecture and layout

Build around user intent rather than site inventory.

Primary navigation should stay simple:

- Start here
- Topics
- Tools
- Articles
- Glossary
- About

Homepage sections should answer:

1. I am a healthcare worker.
2. I am a patient or caregiver.
3. I need a calculator/checklist.
4. I am trying to understand a term.
5. I want a short guide.

Each major topic hub should follow the same pattern:

1. First-screen answer.
2. Quick definitions.
3. Visual explainer.
4. Calculator/tool block.
5. Related article cards.
6. Common mistakes.
7. What to do next.
8. Sources.

### 2. Article quantity and quality

Use a cluster strategy, not random articles.

Highest-priority article cluster: Hospital Economics.

Build these first:

1. Why Hospitals Feel Broke Even When Every Bed Is Full
2. What Payer Mix Means in Plain English
3. Why Hospitals Care So Much About Length of Stay
4. Why Your Hospital Bill Is Not What Insurance Actually Pays
5. Facility Fee vs Professional Fee
6. Observation vs Inpatient Status

Article quality standard:

- Quick answer first.
- Plain-English definition cards.
- One healthcare-specific example.
- Common mistakes.
- Related calculator or checklist.
- Sources from official or high-quality nonprofit/research references.
- Clear educational disclaimer.
- No generic filler, no unsupported advice, no clickbait framing.

### 3. Section organization

The section taxonomy should become:

- Health Insurance Basics
- Hospital Bills
- Medicare & Medicaid
- Open Enrollment
- Workplace Benefits
- Retirement for Healthcare Workers
- Healthcare Worker Money Habits
- Hospital Economics
- Glossary

Each section should have a landing page with the same reusable structure. Avoid making articles feel like unrelated blog posts.

### 4. Tool usage improvements

Tools should be treated as the product engine, not a secondary page.

Implement:

- Tool finder by task: "I have a bill," "I am choosing benefits," "I want to adjust 403(b)," "I am helping a parent after discharge," "I am trying to stop shift spending."
- Prominent result card at the top after inputs change.
- Assumptions box for every calculator.
- "What this does not include" box for every calculator.
- Related article links above and below each tool.
- Printable/checklist mode where appropriate.
- Mobile-first tap targets and no horizontal overflow.

Priority tools:

1. Hospital Bill Review Checklist
2. EOB-to-Bill Match Checker
3. Health Insurance Visit Cost Calculator
4. Open Enrollment True Cost Calculator
5. 403(b) Paycheck Contribution Calculator
6. Medicare Cost Exposure Tool
7. Hospital Payment / Payer Mix Visualizer
8. Hard Shift Damage Control Calculator

### 5. Visibility, retention, and return visits

Technical search improvements:

- Generate sitemap entries for all published article URLs.
- Add Article JSON-LD for article pages.
- Add BreadcrumbList JSON-LD for topic and article pages.
- Add author/byline and last-updated fields to the article data model.
- Add internal links between articles, calculators, topics, glossary definitions, and source pages.
- Validate pages in Search Console URL Inspection after deployment.

Retention improvements:

- Add "Start here" paths for healthcare workers and patients/caregivers.
- Add "next best article" and "related tool" blocks at article ends.
- Add printable checklists for hospital bill review, open enrollment, and Medicare discharge planning.
- Add a lightweight "Recently updated" or "New this week" section after content volume justifies it.
- Keep ads conservative after approval; do not place ads inside calculator result cards or between critical instructions.

## Recommended PR sequence after AdSense approval

### PR 1 — Technical discoverability

Low visual risk, high search value.

- Generate complete sitemap from route, topic, and published article data.
- Add article and breadcrumb structured data helpers.
- Add article date/author fields where needed.
- Confirm robots.txt still points to the sitemap.

### PR 2 — Information architecture polish

- Add/adjust Start Here routing.
- Improve homepage paths.
- Make section cards more task-based.
- Add stronger article/tool loops.

### PR 3 — Hospital Economics content pillar

- Add `why-hospitals-feel-broke`.
- Add at least one supporting article or visual explainer.
- Fix Hospital Economics related article links so they point only to implemented content.
- Add source-backed definitions and disclaimers.

### PR 4 — Tool system upgrade

- Add tool finder / task router.
- Standardize assumption boxes, result cards, and exclusion notes.
- Improve print/checklist output for non-calculator tools.

### PR 5 — Retention layer

- Add next-step modules.
- Add updated-content module.
- Add glossary/article/tool crosslinks.

## Definition of done

Run:

- `npm run lint`
- `npm test`
- `npm run build`

Manual route checks:

- `/`
- `/tools`
- `/articles`
- `/topics`
- `/topics/hospital-economics`
- `/topics/medicare-medicaid`
- `/open-enrollment`
- `/glossary`
- `/about`
- `/contact`
- `/privacy-policy`
- `/terms-of-use`
- `/editorial-policy`

Content checks:

- No published placeholder articles.
- No published article with empty sources.
- No broken related article or calculator links.
- No individualized financial, legal, medical, tax, insurance, or Medicaid-planning advice.
- Every article has a clear takeaway, sources, and related next step.

Mobile checks:

- 390px viewport.
- No horizontal overflow.
- Inputs are tappable.
- Result cards are readable.
- Source links wrap correctly.

## Do not do

- Do not deploy during AdSense review.
- Do not add aggressive ad placements.
- Do not add popups or deceptive ad/navigation patterns.
- Do not produce mass filler articles just to increase count.
- Do not remove trust/legal/source pages.
- Do not merge preview branches into main until review is complete and QA passes.
