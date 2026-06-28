import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index.tsx";
import HealthcareWorkers from "./pages/HealthcareWorkers.tsx";
import PatientsFamilies from "./pages/PatientsFamilies.tsx";
import Tools from "./pages/Tools.tsx";
import OutOfPocketMaxEstimatorPage from "./pages/OutOfPocketMaxEstimatorPage.tsx";
import Articles from "./pages/Articles.tsx";
import ArticlePage from "./pages/ArticlePage.tsx";
import Topics from "./pages/Topics.tsx";
import TopicPage from "./pages/TopicPage.tsx";
import Glossary from "./pages/Glossary.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import OpenEnrollmentGuide from "./pages/OpenEnrollmentGuide.tsx";
import InsuranceBenefitsHub from "./pages/InsuranceBenefitsHub.tsx";
import MedicareAdvantageComparisonPage from "./pages/MedicareAdvantageComparisonPage.tsx";
import {
  HealthcareWorkerPaycheckTools,
  HospitalDischargeCoverageGuide,
  InsuranceMarketingRealityPage,
  MedicalBillReviewToolkit,
  MedicareAdvantagePlanHelper,
  MedicareAdvantageVsMedigap,
  MedicationCoverageChecklist,
  PriorAuthorizationGuide,
} from "./pages/InsuranceDecisionToolsBundle.tsx";
import Methodology from "./pages/Methodology.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import TermsOfUse from "./pages/TermsOfUse.tsx";
import EditorialPolicy from "./pages/EditorialPolicy.tsx";
import Disclosures from "./pages/Disclosures.tsx";
import Accessibility from "./pages/Accessibility.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/healthcare-workers" element={<HealthcareWorkers />} />
            <Route path="/healthcare-workers/paycheck-tools" element={<HealthcareWorkerPaycheckTools />} />
            <Route path="/patients-families" element={<PatientsFamilies />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/tools/out-of-pocket-max-estimator" element={<OutOfPocketMaxEstimatorPage />} />
            <Route path="/tools/medicare-advantage-plan-helper" element={<MedicareAdvantagePlanHelper />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:slug" element={<ArticlePage />} />
            <Route path="/topics" element={<Topics />} />
            <Route path="/topics/:slug" element={<TopicPage />} />
            <Route path="/open-enrollment" element={<OpenEnrollmentGuide />} />
            <Route path="/insurance" element={<InsuranceBenefitsHub />} />
            <Route path="/insurance/medicare-advantage" element={<MedicareAdvantageComparisonPage />} />
            <Route path="/insurance/prior-authorization-guide" element={<PriorAuthorizationGuide />} />
            <Route path="/insurance/hospital-discharge-coverage" element={<HospitalDischargeCoverageGuide />} />
            <Route path="/insurance/medication-coverage-checklist" element={<MedicationCoverageChecklist />} />
            <Route path="/insurance/medical-bill-review-toolkit" element={<MedicalBillReviewToolkit />} />
            <Route path="/insurance/medicare-advantage-vs-medigap" element={<MedicareAdvantageVsMedigap />} />
            <Route path="/insurance/what-medicare-advantage-marketing-may-not-emphasize" element={<InsuranceMarketingRealityPage />} />
            <Route path="/medicare-medicaid" element={<Navigate to="/topics/medicare-medicaid" replace />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/sources" element={<Navigate to="/methodology" replace />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/editorial-policy" element={<EditorialPolicy />} />
            <Route path="/disclosures" element={<Disclosures />} />
            <Route path="/disclaimer" element={<Navigate to="/disclosures" replace />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
            <Route path="/terms" element={<Navigate to="/terms-of-use" replace />} />
            <Route path="/terms-of-service" element={<Navigate to="/terms-of-use" replace />} />
            <Route path="/editorial" element={<Navigate to="/editorial-policy" replace />} />
            <Route path="/policy" element={<Navigate to="/privacy-policy" replace />} />
            <Route path="/policies" element={<Navigate to="/privacy-policy" replace />} />
            <Route path="/legal" element={<Navigate to="/privacy-policy" replace />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Analytics />
      <SpeedInsights />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
