import { lazy, Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { SiteTrustBar } from "./SiteTrustBar";
import { Footer } from "./Footer";
import { MobileBottomNav } from "./MobileBottomNav";
import { PrivacyChoices } from "@/components/shared/PrivacyChoices";
import { RouteFreshness } from "@/components/shared/RouteFreshness";
import { DecisionJourneyDirectory } from "@/components/shared/DecisionJourneyDirectory";
import { hasNavigatorContextAction } from "@/components/navigator/navigatorContextConfig";
import { hasBenefitsCommandCenterEntry } from "@/components/benefits/benefitsCommandCenterEntryConfig";
import { scrollToHashTarget } from "@/lib/routeScroll";

const NavigatorContextAction = lazy(() =>
  import("@/components/navigator/NavigatorContextAction").then((module) => ({ default: module.NavigatorContextAction })),
);
const BenefitsCommandCenterEntry = lazy(() =>
  import("@/components/benefits/BenefitsCommandCenterEntry").then((module) => ({ default: module.BenefitsCommandCenterEntry })),
);
const ContinueWhereYouLeftOff = lazy(() =>
  import("@/components/shared/ContinueWhereYouLeftOff").then((module) => ({ default: module.ContinueWhereYouLeftOff })),
);
const JourneyContinuityBanner = lazy(() =>
  import("@/components/shared/JourneyContinuityBanner").then((module) => ({ default: module.JourneyContinuityBanner })),
);
const RouteSeoCompoundingPathway = lazy(() =>
  import("@/components/growth/SeoCompoundingPathway").then((module) => ({ default: module.RouteSeoCompoundingPathway })),
);

const continuityRoutes = new Set(["/", "/start-here", "/tools"]);
const contextualTrustRoutes = new Set([
  "/",
  "/start-here",
  "/tools",
  "/patients-families/hospital-guide",
  "/about",
]);

export const Layout = () => {
  const location = useLocation();
  const showNavigatorContext = hasNavigatorContextAction(location.pathname);
  const showBenefitsCommandCenterEntry = hasBenefitsCommandCenterEntry(location.pathname);
  const showContinuity = continuityRoutes.has(location.pathname);
  const showJourneyDirectory = location.pathname === "/start-here";
  const showGlobalTrustBar = !contextualTrustRoutes.has(location.pathname);

  useEffect(() => {
    if (!location.hash) return undefined;
    return scrollToHashTarget(location.hash);
  }, [location.hash, location.pathname]);

  return (
    <div className="min-h-screen flex w-full min-w-0 flex-col pb-[calc(5rem_+_env(safe-area-inset-bottom))] md:pb-0">
      <a href="#main-content" className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-hover transition-transform focus:translate-y-0">
        Skip to main content
      </a>
      <Header />
      {showGlobalTrustBar && <SiteTrustBar />}
      <RouteFreshness />
      <main id="main-content" className="flex-1 w-full min-w-0 outline-none" tabIndex={-1}>
        {showContinuity && (
          <Suspense fallback={null}>
            <ContinueWhereYouLeftOff sourceRoute={location.pathname} />
          </Suspense>
        )}
        <Suspense fallback={null}>
          <JourneyContinuityBanner />
        </Suspense>
        <Outlet />
        <Suspense fallback={null}>
          <RouteSeoCompoundingPathway pathname={location.pathname} />
        </Suspense>
        {showJourneyDirectory && <DecisionJourneyDirectory />}
        {showBenefitsCommandCenterEntry && (
          <Suspense fallback={null}>
            <BenefitsCommandCenterEntry />
          </Suspense>
        )}
        {showNavigatorContext && (
          <Suspense fallback={null}>
            <NavigatorContextAction />
          </Suspense>
        )}
      </main>
      <Footer />
      <MobileBottomNav />
      <PrivacyChoices />
    </div>
  );
};
