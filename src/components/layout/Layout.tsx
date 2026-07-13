import { lazy, Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { SiteTrustBar } from "./SiteTrustBar";
import { Footer } from "./Footer";
import { MobileBottomNav } from "./MobileBottomNav";
import { PrivacyChoices } from "@/components/shared/PrivacyChoices";
import { RouteFreshness } from "@/components/shared/RouteFreshness";
import { DecisionJourneyDirectory } from "@/components/shared/DecisionJourneyDirectory";
import { SeoCompoundingPathway } from "@/components/growth/SeoCompoundingPathway";
import { getArticleCompoundingPathway, getHubCompoundingPathway } from "@/data/seoCompoundingPathways";
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

const continuityRoutes = new Set(["/", "/start-here", "/tools"]);

export const Layout = () => {
  const location = useLocation();
  const showNavigatorContext = hasNavigatorContextAction(location.pathname);
  const showBenefitsCommandCenterEntry = hasBenefitsCommandCenterEntry(location.pathname);
  const showContinuity = continuityRoutes.has(location.pathname);
  const showJourneyDirectory = location.pathname === "/start-here";
  const hubPathway = getHubCompoundingPathway(location.pathname);
  const articleSlug = location.pathname.startsWith("/articles/") ? location.pathname.slice("/articles/".length) : "";
  const articlePathway = articleSlug ? getArticleCompoundingPathway(articleSlug) : null;

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
      <SiteTrustBar />
      <RouteFreshness />
      <main id="main-content" className="flex-1 w-full min-w-0 outline-none" tabIndex={-1}>
        {showContinuity && (
          <Suspense fallback={null}>
            <ContinueWhereYouLeftOff sourceRoute={location.pathname} />
          </Suspense>
        )}
        <Outlet />
        {articlePathway && (
          <SeoCompoundingPathway
            pathway={articlePathway}
            currentPath={location.pathname}
            surface="article"
          />
        )}
        {hubPathway && (
          <SeoCompoundingPathway
            pathway={hubPathway}
            currentPath={location.pathname}
            surface="hub"
          />
        )}
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
