# AdSense Hold Content Gap Audit — 2026-06-24

**Status:** Prepared only. Do **not** merge, deploy, or promote to production until Google AdSense review is complete.

**Safe holding branch:** `adsense-hold-content-prep-2026-06-24`

**Production baseline checked:** Vercel production is still tied to `main` at commit `266bac56fabee99bd21447b5d3180d3b61e7f6d1`.

**Preview-only work checked:** PR #17 / `post-adsense-roth-traditional-decision-tool` contains the Roth vs Traditional calculator and remains draft / not merged.

---

## 1. Current live content surface

### Live primary routes

The app currently has routes for:

- `/`
- `/healthcare-workers`
- `/patients-families`
- `/tools`
- `/articles`
- `/articles/:slug`
- `/topics`
- `/topics/:slug`
- `/open-enrollment`
- `/topics/medicare-medicaid` through `/medicare-medicaid` redirect
- `/glossary`
- `/about`
- `/contact`
- `/methodology`
- policy/legal pages

### Live article registry

The live article registry is assembled through `ALL_ARTICLES` from:

- Open enrollment articles
- Healthcare confusion / hospital billing articles
- HSA/FSA article
- January 2027 Medicare/Medicaid policy-change article
- OBBB overtime article
- Backup care article
- Site articles

The app uses the `publishedArticles()` filter, so legacy placeholder bodies like `Paste this article from Notion.` should not appear as live published content.

### Live tools on `/tools`

Current production tools include:

#### Open enrollment

- Open Enrollment Final Checklist
- Open Enrollment True Cost Calculator
- Open Enrollment Paycheck Impact Calculator
- Supplemental Benefits Decision Helper
- HSA vs FSA Decision Helper

#### Hospital bills

- Hospital Bill Review Checklist
- EOB-to-Bill Match Checker
- Financial Assistance Checklist
- Health Insurance Visit Cost Calculator

#### Healthcare worker money

- 403(b) Paycheck Contribution Calculator
- OBBB Overtime Deduction Estimator
- Hospital Cafe Savings Rate Calculator

#### Patients, caregivers, and loans

- Medicare Cost Exposure Tool
- Student Loan Payment Calculator

---

## 2. Content gap comparison

| Content / feature | Current status | Deployment action later |
|---|---:|---|
| Roth vs Traditional Decision Tool | **Not production.** Exists in draft PR #17 / preview branch only. | Keep held until AdSense approval. After approval, review and merge PR #17 if still valid. |
| Medicare/Medicaid visual guide embed | **Not found in repo/live app.** Exists as standalone Webflow-style HTML/CSS upload. | Convert to scoped React/Tailwind component before publishing. Do not paste raw global `<style>` into page. |
| Home Health After the Hospital | **Partially live.** Production has `home-health-after-discharge`; Notion has a stronger reviewed post-AdSense candidate. | Treat as an upgrade / rewrite candidate, not a missing article. |
| Insurance Authorization | **Functionally live.** Production has `prior-authorization-explained`. Notion draft is rough and overlaps. | Do not publish duplicate. Use Notion draft only for tone/personal examples if desired. |
| EOB vs Medical Bill / How to Read an EOB | **Gap / likely broken related link.** `/tools` links EOB checker to `/articles/how-to-read-an-eob`, but exact article should be added. | Highest-priority missing article. Add article with slug `how-to-read-an-eob`. |
| Why Is My Hospital Bill So High? | **Not exact-live.** Related coverage exists through multiple hospital-bill articles, but this SEO question deserves its own plain-English article. | Prepare as later article or merge into billing learning path. |
| What To Do Before Paying a Hospital Bill | **Mostly covered.** Production has financial assistance article and checklist tool. | Could become a broader checklist article later; not urgent. |
| Hospital cafe savings-rate article | **Tool exists; article appears placeholder/filtered if not overridden.** | Prepare full article after AdSense or include in next content batch. |
| Burnout spending / overeating after hard shifts | **Idea / placeholder only.** | Needs careful evidence framing; avoid medical advice. |
| Healthcare worker discount guide | **Idea / placeholder only.** | Needs fresh link verification and no spammy affiliate framing. |

---

## 3. Immediate deployment-ready article candidate

### Recommended fix

Add this article to `src/data/healthcareConfusionArticles.ts` so the existing `/tools#eob-bill-match` related article link points to real content.

Recommended slug: `how-to-read-an-eob`

Recommended position: after `allowed-amount-medical-bills` and before `prior-authorization-explained`, or near the EOB/checklist tool group.

### Code-ready article object

```ts
{
  slug: "how-to-read-an-eob",
  title: "EOB vs Medical Bill: What You Actually Owe",
  category: "Hospital Bills",
  readTime: "6 min read",
  promise: "Learn how to compare an insurance Explanation of Benefits with a provider bill before paying.",
  audience: "Patients, caregivers, and healthcare workers helping someone understand a bill after insurance.",
  summary:
    "An Explanation of Benefits is usually the insurer's claim-processing explanation, not the payment request. A provider bill is the request for payment from the hospital, doctor, lab, ambulance company, or other provider. The safest number to compare is patient responsibility, matched by date of service, provider, service, claim number, and allowed amount. If the EOB and bill disagree, call before paying.",
  body: [
    "Hospital paperwork often arrives in pieces. A patient may get discharge instructions, a hospital bill, an insurance Explanation of Benefits, lab bills, physician bills, and letters that look urgent even when they are not payment requests.",
    "The first step is separating the document that explains insurance processing from the document that asks for money.",
    "This guide is educational. A specific bill can depend on the insurance plan, provider network, claim coding, plan rules, federal protections, state protections, and whether the claim has finished processing."
  ],
  sections: [
    {
      title: "Explanation of Benefits",
      definition:
        "A claim-processing statement from the insurance company showing how a medical claim was handled.",
      keyPoints: [
        "It usually shows what was billed, what the plan allowed, what insurance paid, and what the patient may owe.",
        "It is usually not the bill itself.",
        "It may arrive before or after the provider bill.",
        "It should help you check whether the provider bill matches the insurer's patient-responsibility amount."
      ],
      watchOut: "Do not pay from the EOB alone unless the provider also sent a bill requesting payment."
    },
    {
      title: "Medical bill",
      definition:
        "The payment request from the hospital, physician group, lab, ambulance company, imaging group, or other provider.",
      keyPoints: [
        "It should match the date of service, provider, service, and patient responsibility after insurance processing.",
        "Several bills can come from one hospital visit because different groups may bill separately.",
        "A bill may arrive before insurance finishes processing, which can make the amount look wrong or incomplete."
      ],
      watchOut: "A provider bill that does not match the EOB deserves a phone call before payment."
    },
    {
      title: "Patient responsibility",
      definition:
        "The amount the insurer says the patient may owe after the claim is processed under the plan rules.",
      keyPoints: [
        "This can include deductible, copay, coinsurance, or non-covered amounts.",
        "It should be compared with the amount due on the provider bill.",
        "If the bill asks for more than the EOB patient responsibility, ask why."
      ]
    },
    {
      title: "Allowed amount",
      definition:
        "The plan-recognized amount for a covered service, which may be lower than the provider's original billed charge.",
      keyPoints: [
        "The allowed amount is often the number used to calculate insurance payment and patient cost-sharing.",
        "The billed charge can be much higher than the allowed amount.",
        "For in-network care, the patient usually should not assume they owe the full original billed charge after insurance adjustments."
      ],
      watchOut: "The allowed amount may work differently for out-of-network care or non-covered services."
    },
    {
      title: "What to compare before paying",
      keyPoints: [
        "Patient name.",
        "Date of service.",
        "Provider or facility name.",
        "Claim number if listed.",
        "Service description.",
        "Billed amount.",
        "Allowed amount.",
        "Insurance payment.",
        "Deductible, copay, or coinsurance amount.",
        "Patient responsibility.",
        "Amount due on the provider bill."
      ]
    },
    {
      title: "If the EOB and bill do not match",
      keyPoints: [
        "Do not assume the highest number is what you owe.",
        "Call the provider billing office and ask whether insurance has fully processed the claim.",
        "Call the insurer and ask what your patient responsibility is for that claim.",
        "Ask the provider to re-bill insurance if the claim was denied or processed incorrectly.",
        "Ask whether federal surprise billing protections, financial assistance, or a payment plan may apply."
      ]
    }
  ],
  example: {
    title: "A simple EOB example",
    body:
      "A hospital sends a bill for $2,000. The insurance EOB shows a $2,000 billed charge, a $700 allowed amount, a $300 insurance payment, and a $400 patient responsibility. In this simplified example, the patient should not automatically assume they owe the full $2,000. They should compare the provider bill with the $400 patient-responsibility amount and ask why if the bill does not match."
  },
  relatedCalculator: { label: "EOB-to-Bill Match Checker", href: "/tools#eob-bill-match" },
  commonMistakes: [
    "Treating the EOB as the payment request.",
    "Paying the provider before insurance finishes processing.",
    "Ignoring denied claims.",
    "Matching a bill to the wrong EOB.",
    "Not checking whether the bill belongs to the hospital, physician group, lab, ambulance company, imaging group, anesthesia group, or another provider.",
    "Assuming every surprise bill is automatically protected or automatically illegal."
  ],
  takeaway:
    "An EOB explains how insurance processed a claim. A medical bill asks for payment. Before paying, match the bill to the EOB by date, provider, service, allowed amount, insurance payment, and patient responsibility.",
  sources: [CMS_MEDICAL_BILL_RIGHTS, HEALTHCARE_ALLOWED_AMOUNT, HEALTHCARE_BALANCE_BILLING]
}
```

### Editorial note

This article intentionally avoids claiming that every EOB is final or every mismatch is an error. It tells the reader to verify before paying, which matches the site's practical, non-alarmist tone.

---

## 4. Medicare/Medicaid visual guide conversion notes

The uploaded Medicare/Medicaid visual guide should not be inserted as raw Webflow-style markup. Convert it into a React component before publishing.

Recommended implementation:

- Create `src/components/shared/MedicareMedicaidVisualGuide.tsx`.
- Replace raw CSS variables and global selectors with Tailwind classes or a scoped component stylesheet.
- Do not style `body` from inside the component.
- Use existing design tokens where possible: `bg-background`, `bg-card`, `text-muted-foreground`, `border-border`, `shadow-card`, `rounded-3xl`.
- Keep the visual sections:
  - Medicare Advantage vs Traditional Medicare donut/stat card.
  - Common Medicare cost bars/table.
  - Medicare vs Medicaid comparison cards.
  - What Original Medicare usually does not cover.
  - Dual eligible population bars.
  - Long-term care warning callout.
  - Source list.
- Add component to `/topics/medicare-medicaid` above the Medicare learning path or between overview and learning path.
- Re-check all 2026 Medicare cost numbers before merge because Medicare cost tables can change yearly.
- Re-check KFF/CMS enrollment values before merge if the page is published months later.

Recommended later route placement:

```tsx
<MedicareMedicaidVisualGuide />
<MedicareLearningPath />
```

---

## 5. Content not ready enough for publication yet

These are not deploy-ready articles yet because the Notion backlog has idea-level notes, not full drafts or verified source sets.

### Hospital cafe savings-rate article

Current state:

- Tool exists live: `/tools#cafe`.
- Legacy article placeholder exists in older article data.
- Needs full article body before publishing.

Recommended article direction:

- Non-shaming tone.
- Frame as awareness, not moralizing.
- Connect directly to the Hospital Cafe Savings Rate Calculator.
- Use practical examples: coffee, drink, snack, lunch, night-shift vending machine.
- Use BLS/Federal Reserve household cash-flow context, not guilt.

### Burnout spending and overeating after hard shifts

Current state:

- Idea/placeholder only.
- Needs careful sourcing and wording.

Required guardrails:

- Avoid diagnosing readers.
- Avoid medical or mental health treatment advice.
- Frame as decision fatigue, stress response, sleep loss, convenience defaults, and environment design.
- Include professional help language when someone feels out of control, unsafe, depressed, or unable to function.

### Healthcare worker discount guide

Current state:

- Idea/placeholder only.
- No verified source set.

Required guardrails:

- Verify every discount link shortly before publishing.
- Prefer official discount pages and ID verification providers.
- Avoid spammy affiliate links during initial trust-building.
- Emphasize: only use discounts on things you already planned to buy.

---

## 6. Recommended post-AdSense deployment order

1. Merge/review PR #17 only if Roth calculator still passes build and UX review.
2. Add `how-to-read-an-eob` article because `/tools#eob-bill-match` currently wants a real related article.
3. Convert Medicare/Medicaid visual guide into a scoped React component and add to Medicare/Medicaid topic page.
4. Upgrade Home Health article using the stronger Notion draft, but avoid duplicate slugs.
5. Publish the Hospital Cafe article to support the existing cafe calculator.
6. Build the burnout-spending article only after careful source/wording review.
7. Build healthcare worker discounts last because it requires the most link verification and is easiest to make look spammy.

---

## 7. Do-not-touch list during AdSense review

Do not change production while AdSense is pending:

- Do not merge this branch.
- Do not merge PR #17.
- Do not deploy manually to production.
- Do not add ad units.
- Do not change `ads.txt` unless AdSense specifically requires correction.
- Do not change production domain configuration.
- Do not add thin, placeholder, duplicate, or under-sourced articles.

This file is intentionally documentation-only so the work is ready for later without changing the live site.
