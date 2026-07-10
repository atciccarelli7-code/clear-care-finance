const ADSENSE_CLIENT = "ca-pub-3330626498830044";

export const ADSENSE_SCRIPT_ID = "caf-route-aware-adsense";
export const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;

const AD_FREE_PATHS = new Set([
  "/tools/healthcare-worker-benefits-blueprint",
  "/tools/employer-benefits-action-plan",
  "/tools/medicare-medicaid-eligibility-check",
]);

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

export const isAdFreePath = (pathname: string) => AD_FREE_PATHS.has(normalizePathname(pathname));

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

  if (isAdFreePath(pathname)) {
    if (!existing) return "blocked";

    const replaceLocation = options.replaceLocation ?? ((url: string) => window.location.replace(url));
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
