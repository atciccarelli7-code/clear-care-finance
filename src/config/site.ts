const adsenseClientId = import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT_ID;
const enableAdsenseInDev = import.meta.env.VITE_ENABLE_ADSENSE_IN_DEV === "true";

export const site = {
  siteName: "Community Acquired Finance",
  legalName: "Clear Care Finance / Community Acquired Finance",
  siteUrl: import.meta.env.VITE_SITE_URL || "https://communityacquiredfinance.com",
  authorName: "Andrew Ciccarelli",
  authorCredentials: "RN, BSN",
  authorRole: "Registered Nurse and financial literacy writer",
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || "hello@communityacquiredfinance.com",
  adsenseClientId,
  adsenseEnabled: Boolean(adsenseClientId) && (import.meta.env.PROD || enableAdsenseInDev),
};
