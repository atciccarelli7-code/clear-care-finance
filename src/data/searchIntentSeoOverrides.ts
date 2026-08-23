export type SearchIntentSeoOverride = {
  title: string;
  description: string;
};

// Search-intent metadata updates are deliberately narrow. These routes already
// earned meaningful Google Search Console impressions in the 2026-08-23 export,
// so the goal is to make the search result describe the answer more clearly —
// not to create new keyword-targeted pages or expand the index.
const SEARCH_INTENT_SEO_OVERRIDES: Record<string, SearchIntentSeoOverride> = {
  "/hospital-financial-assistance/novant-health-north-carolina": {
    title: "Novant Health Financial Assistance: Income Limits & Application",
    description: "Find Novant Health financial assistance income limits, the official application, phone number, and PO Box 11549 mailing address, plus documents and provider rules.",
  },
  "/hospital-financial-assistance/atrium-health": {
    title: "Atrium Health Financial Assistance: Income Limits & Application",
    description: "Find Atrium Health financial assistance income limits, hardship rules, presumptive screening details, the official application, phone number, and mailing address.",
  },
  "/hospital-financial-assistance/ecu-health": {
    title: "ECU Health Financial Assistance: Income Limits & Application",
    description: "Find ECU Health financial assistance income limits, the official application, phone number, required documents, hardship rules, and provider exclusions.",
  },
  "/hospital-financial-assistance/northwestern-medicine": {
    title: "Northwestern Medicine Financial Assistance & Application",
    description: "Review Northwestern Medicine financial assistance, published income limits, the official application, required documents, contact details, and provider rules.",
  },
  "/hospital-financial-assistance/duke-health": {
    title: "Duke Health Financial Assistance: Income Limits & Application",
    description: "Find Duke Health financial assistance income limits, hardship rules, the official application, required documents, phone numbers, and provider limitations.",
  },
  "/articles/facility-fee-vs-professional-fee": {
    title: "Facility Fee vs. Professional Fee: Why You Got Two Medical Bills",
    description: "Learn the difference between a facility fee and professional fee, why one visit can create two bills, and how to match each charge to your insurance EOB.",
  },
  "/articles/how-hospital-403b-matching-works": {
    title: "Hospital 403(b) Match: Examples, Vesting & Full Match",
    description: "See how common hospital 403(b) match formulas work, how much you may need to contribute for the full match, and what to check about vesting and true-ups.",
  },
};

export const getSearchIntentSeoOverride = (pathname: string) => SEARCH_INTENT_SEO_OVERRIDES[pathname];
