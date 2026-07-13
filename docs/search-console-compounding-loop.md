# Search Console Compounding Loop

Community Acquired Finance should improve through repeated evidence-led adjustments rather than high-volume publishing. The operating standard is simple: make the existing site more useful, more discoverable, or more likely to complete a real healthcare-finance decision.

## Baseline

Initial Search Console review window: June 13–July 10, 2026.

- 3 clicks
- 486 impressions
- 0.62% CTR
- 50.5 average position
- 63 URLs appearing in Search
- 143 sitemap URLs discovered
- 0 sitemap errors or warnings

Page-level data is the primary decision source when query-level data is privacy-filtered.

## Reporting cadence

Review Search Console every two to four weeks.

Use a longer interval when a recently changed page has not been recrawled or has too little impression volume. Avoid repeatedly changing the same title or article before Google has had enough time to reassess it.

Export each reporting period to Google Sheets without overwriting prior periods. Preserve:

- Reporting start date
- Reporting end date
- Export date
- Search type
- Country or device filters
- Page and query dimensions
- Any privacy-filtering or sampling limitation

Recommended workbook tabs:

1. `Site Summary`
2. `Pages`
3. `Queries`
4. `Devices`
5. `Countries`
6. `Indexing`
7. `Sitemaps`
8. `Change Log`

## Metrics to track

### Search visibility

- Total clicks
- Total impressions
- CTR
- Average position
- URLs receiving impressions
- Queries receiving impressions
- Pages entering positions 1–10
- Pages entering positions 11–20
- Pages leaving positions 1–20

### Page-level movement

For each priority URL, track:

- Current clicks
- Previous-period clicks
- Current impressions
- Previous-period impressions
- Current CTR
- Previous-period CTR
- Current average position
- Previous-period average position
- Date last changed
- Date last crawled when available

### User-completion signals

When analytics volume becomes meaningful, track:

- Article-to-tool click-through rate
- Article-to-related-article click-through rate
- Hub-to-tool click-through rate
- Hub-to-resource click-through rate
- Tool starts
- Tool completions
- Saved, copied, printed, or shared receipts where supported

Do not collect user-entered medical, financial, employer, medication, claim, or household details in analytics.

## Page opportunity categories

### Defend: position 1–10

Objective: preserve relevance and improve CTR or user completion without destabilizing a ranking page.

Actions:

- Verify factual freshness and source quality
- Improve snippet clarity only when evidence supports it
- Strengthen links to the next logical tool or guide
- Avoid URL changes and broad rewrites

### Push: position 11–20

Objective: move a relevant page onto page one.

Actions:

- Tighten the title and first answer around the observed intent
- Add an original comparison, example, checklist, or calculator handoff
- Improve internal links from the relevant hub and adjacent articles
- Verify the page fully answers the query rather than merely mentioning it

### Improve: position 21–50

Objective: strengthen topical depth and intent alignment.

Actions:

- Clarify the primary question
- Remove tangents that dilute the answer
- Add direct answers, examples, tables, and practical next steps
- Build reciprocal links within the topic cluster

### Rebuild: position 51–100 with meaningful impressions

Objective: determine why Google is testing the page but not ranking it competitively.

Actions:

- Compare the page promise with the actual query intent
- Verify the title, H1, summary, and body all answer the same question
- Consolidate overlapping content where necessary
- Add a useful tool, worked example, or decision framework
- Preserve the URL when the intent remains valid

### Monitor: too little data

Objective: avoid false conclusions.

Actions:

- Leave the page stable
- Improve only for clear user-value or factual reasons
- Wait for more impressions or crawl activity

### Consolidate: overlapping intent or thin value

Objective: prevent multiple weak pages from competing for one question.

Actions:

- Choose the strongest canonical page
- Move unique useful material into it
- Redirect obsolete URLs when appropriate
- Update internal links and sitemap output
- Record the consolidation in the change log

## Decision rules

1. Improve existing pages before publishing adjacent articles.
2. Do not change a working URL without a compelling technical or intent-based reason.
3. Do not rewrite a page because of one unusual or privacy-filtered query.
4. Prefer page-level data when query-level data is incomplete.
5. Wait for recrawl and reassessment before repeatedly changing the same page.
6. Preserve citations, authorship, review dates, methodology links, and disclosures.
7. Use one primary search intent per page.
8. Use internal links to complete a user journey, not to inflate link count.
9. Prefer descriptive anchor text over “learn more” or “click here.”
10. Do not create a new calculator when an existing tool can complete the decision.
11. Measure article-to-tool and hub-to-tool movement without recording sensitive inputs.
12. Record every meaningful SEO change.

## Change-log template

| Change date | URL | Opportunity category | Previous title | New title | Evidence | Change made | Expected user benefit | Expected SEO benefit | Validation | Review date |
|---|---|---|---|---|---|---|---|---|---|---|
| YYYY-MM-DD | `/path` | Push / Improve / Rebuild | Previous title | New title | Impressions, position, query cluster | Summary of content, linking, metadata, or tool change | What becomes easier for the user | Expected ranking, CTR, or topical-authority effect | Build, tests, preview, URL inspection | YYYY-MM-DD |

## Current implementation: three highest-value improvements

### 1. Reciprocal topic pathways

**Problem**

High-impression articles existed as useful standalone pages, but the next decision was not consistently connected across the topic cluster.

**Evidence**

Articles generated the largest impression pool while ranking deeply overall. Search Console showed repeated intent around insurance cost sharing, EOBs, hospital billing, spouse coverage, supplemental insurance, and hospital retirement benefits.

**Change**

Add reciprocal, descriptive pathways for:

- Insurance cost sharing to EOB and bill review
- Hospital billing review
- Healthcare-worker retirement
- Household open enrollment

**Expected user benefit**

A reader can move from explanation to estimate, verification, and decision completion without returning to a generic directory.

**Expected SEO benefit**

Clearer topical relationships, stronger internal authority flow, and more descriptive contextual links.

**Files affected**

- `src/data/seoCompoundingPathways.ts`
- `src/components/growth/SeoCompoundingPathway.tsx`
- `src/components/layout/Layout.tsx`

**Validation**

- Every configured URL must resolve through the application route system
- Current-page self-links must be filtered
- Duplicate destinations must be removed
- Article URLs must remain unchanged

### 2. Focused authority modules on eight core hubs

**Problem**

Large hub pages can become directories rather than clear decision starting points.

**Evidence**

Topic and navigation pages ranked better than most individual articles, indicating that Google understands the site hierarchy. Those hubs should transfer relevance and users into the strongest journeys.

**Change**

Add one focused question and four high-value starting resources to:

- `/healthcare-workers`
- `/build-wealth`
- `/insurance`
- `/open-enrollment`
- `/patients-families`
- `/medicare-care-costs`
- `/articles`
- `/tools`

**Expected user benefit**

The next action is visible without forcing users to scan every card or tool.

**Expected SEO benefit**

Stronger contextual links from established collection pages to priority articles and tools.

**Files affected**

- `src/data/seoCompoundingPathways.ts`
- `src/components/growth/SeoCompoundingPathway.tsx`
- `src/components/layout/Layout.tsx`

**Validation**

- Mobile and desktop visual checks
- No duplicate module on non-hub routes
- Four or fewer visible destinations per module
- Descriptive labels and valid internal paths

### 3. Privacy-safe conversion measurement

**Problem**

Search Console can show discovery and ranking, but it cannot show whether a reader moves from an article or hub into a useful calculator or related guide.

**Evidence**

Only a narrow acquisition CTA was previously represented in the privacy-safe growth event registry.

**Change**

Add fixed categorical events:

- `article_to_tool_clicked`
- `article_to_related_article_clicked`
- `hub_to_tool_clicked`
- `hub_to_resource_clicked`

Each event records only fixed identifiers for the entry surface, pathway, destination, and destination type.

**Expected user benefit**

Future improvements can prioritize pathways that actually help users continue and complete decisions.

**Expected SEO benefit**

Indirect. Better engagement evidence guides internal-link and tool investments toward pages that earn useful follow-through.

**Files affected**

- `src/lib/growthAnalytics.ts`
- `src/components/growth/SeoCompoundingPathway.tsx`
- `src/test/growthAnalytics.test.ts`

**Validation**

- Unknown event names remain rejected
- URLs, dates, free text, and sensitive answer-like values remain rejected
- Only fixed lowercase categorical values pass the sanitizer

## Review protocol for changed pages

After a meaningful change:

1. Record the change date and exact URL.
2. Confirm production deployment and canonical URL.
3. Confirm sitemap inclusion.
4. Inspect the URL in Search Console when appropriate.
5. Record the next review date at least two weeks later unless a technical error requires immediate action.
6. Compare page-level impressions, CTR, and position with the prior equivalent period.
7. Keep, refine, or reverse the change based on evidence rather than activity pressure.

## Future improvement queue

Do not implement these until new evidence supports the order.

1. **Page-one push program:** identify the three pages with the most impressions in positions 11–20 and make one focused improvement to each.
2. **CTR testing program:** test title and description changes only on pages with meaningful impressions and stable positions.
3. **Authority acquisition program:** earn relevant citations and links through healthcare-worker organizations, nursing programs, patient-advocacy resources, and benefits educators rather than generic link-building.
