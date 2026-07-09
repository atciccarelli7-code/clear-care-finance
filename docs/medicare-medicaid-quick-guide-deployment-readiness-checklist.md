# Quick Guide Deployment Readiness Checklist

Community Acquired Finance  
The Hospital Discharge & Medicare Quick Guide  
Last updated: 2026-07-09 UTC

## Purpose

Use this checklist before deciding whether the Quick Guide can move from PDF candidate to public release.

This checklist is intentionally conservative. Passing the build is not enough.

## Current classification

**Candidate state:** final pre-readiness visual PDF candidate  
**Public release state:** blocked until the checks below pass

## Hard release gates

Do not launch, merge, unlock CTA, add sitemap URLs, or add QR codes unless all of these are true:

- [ ] `npm run guide:quick-content-check` passes.
- [ ] `npm run guide:quick-pdf:draft` generates the artifact.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] Lint is either passing or intentionally advisory and documented.
- [ ] Vercel preview is READY.
- [ ] The generated PDF opens directly.
- [ ] No public PDF path is linked before the public PDF actually exists.
- [ ] Landing CTA remains locked until the final public PDF exists.
- [ ] Sitemap PDF URL is not added until the final public PDF URL returns 200.
- [ ] No QR codes are added until destination map and scan testing pass.

## PDF visual QA

Review the actual generated PDF, not only the code.

- [ ] Cover looks credible, calm, and not cluttered.
- [ ] Cover pathway makes immediate sense: status → payer → approval → documents → next call.
- [ ] Each page can be skimmed in roughly 20 seconds.
- [ ] Each page has a clear purpose before the reader reaches the cards.
- [ ] Progress rail is helpful and not distracting.
- [ ] Three-step cue strip is readable and not cramped.
- [ ] `Remember` ribbon adds clarity rather than visual noise.
- [ ] `Verify` / `Risk if missed` bar is useful and not too dense.
- [ ] Core idea panel is the most visually important content block after the header.
- [ ] Compare sections are easy to understand.
- [ ] Warning sections stand out without feeling alarmist.
- [ ] Ask/script sections are easy to act on.
- [ ] Flow sections read in the correct sequence.
- [ ] Source notes are visible but not dominant.
- [ ] Source map is readable enough for review.
- [ ] No awkward widows, orphaned headings, or split cards.
- [ ] No large blank spaces that make the PDF feel unfinished.

## Mobile and print QA

- [ ] PDF is readable on desktop.
- [ ] PDF is readable on iPhone.
- [ ] PDF is readable on Android if available.
- [ ] Black-and-white print test preserves hierarchy.
- [ ] The guide remains usable without relying on color alone.
- [ ] Cards, ribbons, and verification bars do not split awkwardly across pages.
- [ ] Source map remains legible when printed.

## Content QA

- [ ] The guide still avoids promising coverage.
- [ ] The guide still avoids implying that need alone creates payment.
- [ ] The guide still distinguishes Medicare from Medicaid.
- [ ] The guide still distinguishes Original Medicare from Medicare Advantage.
- [ ] The guide still handles observation/inpatient cautiously.
- [ ] The guide still separates skilled rehab/SNF care from custodial long-term care.
- [ ] Billing language treats EOB/MSN documents as comparison tools, not final legal adjudication.
- [ ] No current-year Medicare dollar amounts are listed unless freshly verified.
- [ ] CMS MOON wording/timing is rechecked before final public release.
- [ ] Source notes and source map remain present.

## Guardrail QA

- [ ] No ads.
- [ ] No affiliate links.
- [ ] No lead forms.
- [ ] No insurer rankings.
- [ ] No plan recommendations.
- [ ] No sales language.
- [ ] No public `/public/drafts/` PDF.
- [ ] No QR codes before scan testing.
- [ ] No sitemap entry before real public URL testing.

## Go / no-go decision

### Ready to move to launch PR only if:

- All hard release gates pass.
- The PDF feels visually superior to the long guide, not just shorter.
- The guide is easy enough for a stressed family member to use quickly.
- The educational/legal guardrails remain intact.
- The final public PDF URL exists and opens directly.

### Not ready if:

- Any visual page feels crowded, generic, or confusing.
- The guide still feels like text placed into boxes rather than a designed handout.
- The PDF cannot be reviewed cleanly on phone and print.
- Any release gate is being assumed instead of verified.
