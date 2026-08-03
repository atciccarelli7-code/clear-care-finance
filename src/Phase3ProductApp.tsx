import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Layout } from "@/components/layout/Layout";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import BenefitsDecisionOfferPage from "@/pages/premium/BenefitsDecisionOfferPage";
import { useSeo } from "@/lib/seo";
import {
  BENEFITS_DECISION_OFFER_META,
  BENEFITS_DECISION_OFFER_PATH,
} from "@/lib/siteSeoMeta";

export { BENEFITS_DECISION_OFFER_META, BENEFITS_DECISION_OFFER_PATH } from "@/lib/siteSeoMeta";

export const RETIRED_BENEFITS_DECISION_PACK_PATH = "/products/healthcare-worker-benefits-decision-pack" as const;

export const isPhase3ProductPath = (pathname: string) =>
  pathname === BENEFITS_DECISION_OFFER_PATH || pathname === RETIRED_BENEFITS_DECISION_PACK_PATH;

const queryClient = new QueryClient();

const RouteSeo = () => {
  useSeo(BENEFITS_DECISION_OFFER_META);
  return null;
};

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);
  return null;
};

const MainApplicationHandoff = () => {
  const location = useLocation();
  useEffect(() => {
    window.location.assign(`${location.pathname}${location.search}${location.hash}`);
  }, [location.hash, location.pathname, location.search]);
  return (
    <div className="container flex min-h-[45vh] items-center justify-center py-16" role="status" aria-live="polite">
      <span className="text-sm font-semibold text-muted-foreground">Opening the selected CAF resource…</span>
    </div>
  );
};

export const Phase3ProductContent = ({ includeRuntimeTelemetry = true }: { includeRuntimeTelemetry?: boolean }) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouteSeo />
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path={BENEFITS_DECISION_OFFER_PATH} element={<BenefitsDecisionOfferPage />} />
          <Route path={RETIRED_BENEFITS_DECISION_PACK_PATH} element={<Navigate to={BENEFITS_DECISION_OFFER_PATH} replace />} />
          <Route path="*" element={<MainApplicationHandoff />} />
        </Route>
      </Routes>
      {includeRuntimeTelemetry && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
    </TooltipProvider>
  </QueryClientProvider>
);

const Phase3ProductApp = () => (
  <BrowserRouter>
    <Phase3ProductContent />
  </BrowserRouter>
);

export default Phase3ProductApp;
