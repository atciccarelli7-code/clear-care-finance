import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const MEASUREMENT_ID = "G-2MR6ZCDJ1W";
const SCRIPT_ID = "ga4-script";
const SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

const ensureGoogleAnalytics = () => {
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

export const GaPageTracker = () => {
  const location = useLocation();
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!initialized.current) {
      ensureGoogleAnalytics();
      initialized.current = true;
    }

    const pagePath = `${location.pathname}${location.search}${location.hash}`;

    window.gtag?.("event", "page_view", {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location.hash, location.pathname, location.search]);

  return null;
};
