import { useEffect } from "react";
import { site } from "@/config/site";

const ADSENSE_SCRIPT_ID = "caf-google-adsense";

export const AdSenseHead = () => {
  useEffect(() => {
    if (!site.adsenseEnabled || !site.adsenseClientId) return;
    if (document.getElementById(ADSENSE_SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = ADSENSE_SCRIPT_ID;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${site.adsenseClientId}`;
    document.head.appendChild(script);
  }, []);

  return null;
};
