import { isRouteAdEligible } from "@/lib/contentGovernance";

const ADSENSE_CLIENT = "ca-pub-3330626498830044";

export const ADSENSE_SCRIPT_ID = "caf-route-aware-adsense";
export const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;

const PRIOR_AUTHORIZATION_TOOL_PATH = "/tools/prior-authorization-next-step-guide";
const LEGACY_PRIOR_AUTHORIZATION_PATH = "/insurance/prior-authorization-guide";

type AdSenseSyncAction = "blocked" | "loaded" | "present" | "reload";

type SyncAdSenseOptions = {
  documentObject?: Document;
  replaceLocation?: (url: string) => void;
};

declare global {
  interface Window {
    __cafAdSenseRoutingInstalled?: boolean;
  }
}

const normalizePathname = (pathname: string) => {
  const normalized = pathname.replace(/\/+$/, "");
  return normalized || "/";
};

const buildCanonicalPriorAuthorizationUrl = (href: string) => {
  try {
    return new URL(PRIOR_AUTHORIZATION_TOOL_PATH, href).toString();
  } catch {
    return PRIOR_AUTHORIZATION_TOOL_PATH;
  }
};

export const isAdEligiblePath = (pathname: string) => isRouteAdEligible(normalizePathname(pathname));

export const isAdFreePath = (pathname: string) => !isAdEligiblePath(pathname);

export const ensureAdSenseScript = (documentObject: Document = document) => {
  const existing = documentObject.getElementById(ADSENSE_SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) return existing;

  const script = documentObject.createElement("script");
  script.id = ADSENSE_SCRIPT_ID;
  script.async = true;
  script.src = ADSENSE_SCRIPT_SRC;
  script.crossOrigin = "anonymous";
  script.dataset.cafManaged = "true";
  documentObject.head.appendChild(script);
  return script;
};

export const syncAdSenseForPath = (
  pathname: string,
  href: string,
  options: SyncAdSenseOptions = {},
): AdSenseSyncAction => {
  const documentObject = options.documentObject ?? document;
  const existing = documentObject.getElementById(ADSENSE_SCRIPT_ID);
  const replaceLocation = options.replaceLocation ?? ((url: string) => window.location.replace(url));
  const normalizedPath = normalizePathname(pathname);

  if (normalizedPath === LEGACY_PRIOR_AUTHORIZATION_PATH) {
    replaceLocation(buildCanonicalPriorAuthorizationUrl(href));
    return "reload";
  }

  if (isAdFreePath(normalizedPath)) {
    if (!existing) return "blocked";

    // A loaded third-party advertising script cannot be fully unloaded from an SPA.
    // Reload the destination so sensitive and interactive pages start without it.
    replaceLocation(href);
    return "reload";
  }

  if (existing) return "present";
  ensureAdSenseScript(documentObject);
  return "loaded";
};

export const installRouteAwareAdSense = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (window.__cafAdSenseRoutingInstalled) return;

  window.__cafAdSenseRoutingInstalled = true;

  const sync = () => {
    syncAdSenseForPath(window.location.pathname, window.location.href);
  };

  const originalPushState = window.history.pushState.bind(window.history);
  const originalReplaceState = window.history.replaceState.bind(window.history);

  window.history.pushState = (...args: Parameters<History["pushState"]>) => {
    originalPushState(...args);
    sync();
  };

  window.history.replaceState = (...args: Parameters<History["replaceState"]>) => {
    originalReplaceState(...args);
    sync();
  };

  window.addEventListener("popstate", sync);
  sync();
};
