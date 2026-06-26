import { useEffect } from "react";

const MEASUREMENT_ID = "G-2MR6ZCDJ1W";
const SCRIPT_ID = "ga4-script";
const SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
const LOCATION_CHANGE_EVENT = "app-location-change";

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

const trackPageView = () => {
  window.gtag?.("event", "page_view", {
    page_path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
    page_location: window.location.href,
    page_title: document.title,
  });
};

const loadGoogleAnalytics = () => {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };

  if (!document.getElementById(SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = SCRIPT_SRC;
    document.head.appendChild(script);
  }

  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID, { send_page_view: false });
};

export const GaHistoryTracker = () => {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    loadGoogleAnalytics();

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function pushState(...args) {
      originalPushState.apply(this, args);
      window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT));
    };

    window.history.replaceState = function replaceState(...args) {
      originalReplaceState.apply(this, args);
      window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT));
    };

    window.addEventListener("popstate", trackPageView);
    window.addEventListener(LOCATION_CHANGE_EVENT, trackPageView);

    trackPageView();

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", trackPageView);
      window.removeEventListener(LOCATION_CHANGE_EVENT, trackPageView);
    };
  }, []);

  return null;
};
