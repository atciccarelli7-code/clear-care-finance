# AdSense Readiness Checklist

Use this before applying for Google AdSense review.

## Content quality

- [ ] No lorem ipsum or placeholder copy is visible on public pages.
- [ ] No broken navigation links.
- [ ] No unfinished pages are exposed publicly.
- [ ] The site has at least 12-20 substantive pages, articles, or tools before applying.
- [ ] Each article or tool page has a clear title.
- [ ] Each article or tool page has a quick answer or short summary.
- [ ] Each article or tool page has a plain-English explanation.
- [ ] Each article or tool page has an example, calculator, or practical tool.
- [ ] Each article or tool page has sources.
- [ ] Each article or tool page has a disclaimer.
- [ ] Each article or tool page has an author and review block.

## Site trust

- [ ] Privacy page exists.
- [ ] Terms page exists.
- [ ] Disclaimer page exists.
- [ ] Editorial policy page exists.
- [ ] Advertising policy page exists.
- [ ] Contact page exists.
- [ ] Footer links to all policy pages are visible sitewide.

## Monetization safety

- [ ] Ads are not enabled until approval.
- [ ] Ad units are not placed inside calculators.
- [ ] Ad units are not placed beside primary buttons or form controls.
- [ ] Ad labels are clear and limited to Advertisement or Sponsored Links.
- [ ] The site does not ask readers to interact with ads.
- [ ] The site does not make get-rich-quick claims.
- [ ] The site does not make unsupported medical claims.
- [ ] Advertising should not be personalized using health status, debt level, medical condition, or other sensitive traits.

## Technical readiness

- [ ] `VITE_GOOGLE_ADSENSE_CLIENT_ID` is only added after the real AdSense publisher ID is available.
- [ ] `public/ads.txt` is updated with the exact authorized seller line from AdSense.
- [ ] Public educational content remains crawlable in `robots.txt`.
- [ ] Sitemap is added or updated once the production domain is final.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Tests pass if a test suite is maintained.
