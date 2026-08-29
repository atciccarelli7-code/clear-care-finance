# CAF Content Engine

Last reviewed: 2026-08-29

## Purpose

Community Acquired Finance is an RN-led healthcare economics, healthcare finance, navigation, and healthcare-system publication supported by useful decision tools. Its scarce input is Andrew Ciccarelli's firsthand ability to notice where clinical work, money, insurance, operations, and family responsibility collide.

The content engine exists so Andrew can continue writing the book naturally while CAF turns only the strongest ideas into durable public assets. It is an editorial workflow, not an automatic publishing system.

## Source repository

Primary founder source: the Google Doc **Hospitals Are a Business — Rough Draft / Idea Dump**.

Rules:

- Treat the manuscript as read-only source material unless Andrew explicitly requests a manuscript edit.
- Preserve raw phrasing, questions, analogies, contradictions, and unfinished thinking. Do not “clean up” the source document as a side effect of web publishing.
- A founder observation is evidence of perspective and a useful question. It is not, by itself, proof of a policy, rate, prevalence, payment rule, or clinical fact.
- Never publish identifiable patient information, confidential employer information, or a distinctive fact pattern. Generalize or use a clearly labeled composite when operational experience is necessary.
- Never publish a new manuscript passage automatically.

## Operating loop

```mermaid
flowchart TD
    A["Founder writing"] --> B["Extract thesis and reader problem"]
    B --> C["Separate observation, claim, and question"]
    C --> D["Research and fact-check"]
    D --> E["Choose the best CAF asset"]
    E --> F["Edit in Andrew's voice"]
    F --> G["Privacy, evidence, and risk review"]
    G --> H["Publish and interlink"]
    H --> I["Monitor Search Console and usefulness"]
    I --> J["Update, expand, merge, or hold"]
```

### 1. Capture without interrupting the book

Review only meaningful new manuscript sections. Record the passage location or a short internal description, the original thesis, the unusual phrase or analogy worth preserving, and the reader problem it could solve. Do not ask Andrew to rewrite the passage for SEO.

### 2. Split the material into evidence classes

For each candidate, create a small claim ledger:

| Element | Treatment |
|---|---|
| Firsthand observation | Preserve as perspective; generalize to protect privacy. |
| Analogy or question | Preserve when it improves understanding and is not misleading. |
| Factual claim | Verify independently with a current authoritative source. |
| Quantitative claim | Record value, year, population, payer, geography, denominator, and limitation. |
| Interpretation | Label through wording; do not disguise judgment as settled fact. |
| Clinical, coverage, legal, or financial conclusion | Use conservative language, controlling sources, and a clear verification boundary. |

### 3. Choose the asset before drafting

Every passage is screened for one or more assets:

- standalone article;
- update or introduction to an existing article;
- explanatory sidebar, FAQ, glossary entry, table, chart, diagram, or decision tree;
- calculator or decision-tool concept;
- downloadable guide or newsletter;
- internal-link opportunity, topic-cluster expansion, or social excerpt;
- product-demand signal to hold for later.

Publish nothing when the idea is generic, redundant, weakly supported, unsafe, too dependent on one anecdote, or unable to answer “why should this exist on CAF?” Prefer an update to the canonical article over a competing URL.

### 4. Research in source order

Prefer controlling or primary sources: CMS, Medicare.gov, Medicaid.gov, HHS and OIG, AHRQ, MedPAC, MACPAC, IRS, DOL, DOJ, GAO, BLS, Census, Federal Reserve, audited statements, Form 990/Schedule H, regulatory filings, state agencies, and peer-reviewed research. KFF, RAND, Commonwealth Fund, and other strong research organizations may add context when their methods and populations are stated.

For every material number, preserve the year, population, payer, measure, and limitation. Do not convert an aggregate margin into a claim about an individual patient, a one-month prior-authorization sample into a universal denial rate, or Original Medicare payment into a rule for every commercial contract.

### 5. Build the article around the reader

A major CAF explainer should normally contain:

1. a clear reader question and non-clickbait headline;
2. a direct answer near the beginning;
3. the founder thesis, analogy, or operational observation where useful;
4. a plain-English system map;
5. evidence, qualifications, and what varies;
6. the patient, hospital, payer, clinician/worker, and family perspectives when relevant;
7. practical questions or document checks;
8. a related CAF article, topic hub, and genuinely relevant tool;
9. author, publish/review dates, review scope, sources, correction route, and disclaimer.

Use the recurring CAF system lens when it adds clarity:

- Who makes the rule?
- Who pays?
- Who carries the risk?
- Who performs the work?
- Who absorbs the consequence when the process fails?

### 6. Protect voice without laundering errors

The target is **Andrew's thinking, professionally edited and rigorously researched**. Preserve memorable phrases and the tension in the original idea. Improve structure, precision, sourcing, context, and reader utility.

When a manuscript claim is wrong or oversimplified:

1. keep the underlying question or insight if it remains useful;
2. record the factual problem internally;
3. research the correct rule or evidence;
4. publish the corrected, qualified version;
5. never imply the raw manuscript was an authoritative source.

### 7. Apply publication gates

Before release, answer yes to each:

- Does the page provide a distinct answer CAF can credibly own?
- Is every material claim supported at the right level?
- Does wording distinguish “generally,” “may,” and “must” accurately?
- Are dates, populations, payer types, and limitations visible where they change meaning?
- Is every example de-identified, generalized, hypothetical, or composite?
- Would the article withstand scrutiny from a patient advocate, physician, nurse, hospital CFO, payer executive, and journalist?
- Does the article lead naturally to another useful resource without becoming a sales funnel?
- Are canonical metadata, Article schema, sitemap membership, sources, review dates, mobile layout, and internal links valid?
- Has the page received an explicit publisher disposition: ad-eligible, ad-free-sensitive, or ad-free-editorial?

### 8. Monitor and revise

Review acquisition at 28 and 90 days when enough data exist. Record sitewide totals from the Search Console Chart or Devices tabs; page and query tables are privacy-filtered and non-additive. Look for relevant non-branded queries, positions 5–20, impressions without clicks, intent mismatch, competing CAF URLs, and article-to-tool behavior.

Do not rewrite a distinctive thesis merely because the first sample is small. Improve title/snippet alignment and internal links first. Merge or redirect only when the pages serve the same reader job and current evidence supports one canonical destination.

## Initial book-to-CAF map

| Manuscript idea | Preserved intellectual material | Public asset | Research correction or expansion |
|---|---|---|---|
| The “$20 Tylenol” and restaurant-without-a-price analogy | The analogy, the separation between bedside care and financial visibility, and the question of what the charge actually represents | `/articles/20-dollar-tylenol-hospital-prices` | Separates gross charge, cash price, negotiated/allowed amount, payer payment, patient responsibility, and hospital cost; limits Medicare MS-DRG claims to applicable inpatient facility payment. |
| Hospitals as businesses and the meaning of nonprofit | The thesis that public expectations and business constraints collide | `/articles/what-nonprofit-hospital-actually-means` | Corrects “nonprofit means no profit”; adds 501(c)(3), Section 501(r), CHNA, financial-assistance, Schedule H, margin, and governance distinctions. |
| Why hospitals care about length of stay and a bed is more than furniture | “A bed is scarce staffed capacity, not furniture” and the patient/hospital tension around discharge | `/articles/why-hospitals-care-about-length-of-stay` | Qualifies national occupancy, payer-contract variation, Medicare IPPS, readmission incentives, ED boarding, and the shortest-safe-stay boundary. |
| “Just send them to rehab” | “A physician order is not a reservation. A referral is not an acceptance. Insurance coverage is not a bed. A bed is not necessarily a staffed bed.” | `/articles/why-just-send-them-to-rehab-is-not-simple` | Separates IRF, SNF, home health, and outpatient therapy; adds Original Medicare rules, MA authorization evidence, facility capability, appeal, network, and logistics gates. |

## Current baseline and ownership

- August 28, 2026 last-six-month Google Web export: **20 clicks and 3,449 impressions** in the sitewide Chart/Devices totals.
- The Pages table totals are not a substitute for sitewide totals; the query table suppresses low-volume data.
- Early metrics are attention and utility signals, not proof of product-market fit or revenue readiness.
- Andrew owns final editorial judgment. AI can extract, research, edit, test, and propose; it cannot invent experience, approve its own unsupported claims, or publish manuscript additions automatically.

## Recurring review output

Each manuscript review should produce a short internal note with:

- sections reviewed and any new additions;
- candidate thesis and reader job;
- best asset type and existing canonical page, if any;
- source and privacy risks;
- publish, update, hold, or reject decision;
- internal links or visual/tool opportunities;
- owner and review trigger.

The default is **hold until editorially justified**, not publish because content exists.
