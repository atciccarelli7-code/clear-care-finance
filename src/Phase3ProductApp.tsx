import { useEffect, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Layout } from "@/components/layout/Layout";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import BenefitsDecisionOfferPage from "@/pages/premium/BenefitsDecisionOfferPage";
import { resolveSiteSeoMeta } from "@/lib/siteSeoMeta";
import { useSeo } from "@/lib/seo";

export const BENEFITS_DECISION_OFFER_PATH = "/products/healthcare-worker-benefits-decision-system" as const;

const queryClient = new QueryClient();

const RouteSeo = () => {
  const location = useLocation();
  const meta = useMemo(() => resolveSiteSeoMeta(location.pathname), [location.pathname]);
  useSeo(meta);
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
