import { lazy, Suspense, useEffect, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import { resolveSiteSeoMeta } from "@/lib/siteSeoMeta";
import { useSeo } from "@/lib/seo";

const loadIndex = () => import("./pages/Index.tsx");
const loadStartHere = () => import("./pages/StartHere.tsx");
const loadHealthcareWorkers = () => import("./pages/HealthcareWorkers.tsx");
const loadBuildWealthHub = () => import("./pages/BuildWealthHub.tsx");
const loadPatientsFamilies = () => import("./pages/PatientsFamilies.tsx");
const loadTools = () => import("./pages/Tools.tsx");
const loadCalc403bPaycheckCalculatorPage = () => import("./pages/Calc403bPaycheckCalculatorPage.tsx");
const loadOutOfPocketMaxEstimatorPage = () => import("./pages/OutOfPocketMaxEstimatorPage.tsx");
const loadOpenEnrollmentTrueCostCalculatorPage = () => import("./pages/OpenEnrollmentTrueCostCalculatorPage.tsx");
const loadEobBillMatchCheckerPage = () => import("./pages/EobBillMatchCheckerPage.tsx");
const loadHospitalDischargeMedicareChecklistPage = () => import("./pages/HospitalDischargeMedicareChecklistPage.tsx");
const loadMedicalBillReviewFlowPage = () => import("./pages/MedicalBillReviewFlowPage.tsx");
const loadHealthcareWorkerBenefitsBlueprintPage = () => import("./pages/HealthcareWorkerBenefitsBlueprintPage.tsx");
const loadEmployerBenefitsActionPlanPage = () => import("./pages/EmployerBenefitsActionPlanPage.tsx");
const loadMedicareMedicaidEligibilityCheckPage = () => import("./pages/MedicareMedicaidEligibilityCheckPage.tsx");
const loadPriorAuthorizationNextStepGuidePage = () => import("./pages/PriorAuthorizationNextStepGuidePage.tsx");
const loadHealthcareWorkerTotalCompensationPage = () => import("./pages/HealthcareWorkerTotalCompensationPage.tsx");
const loadStudentLoans = () => import("./pages/StudentLoans.tsx");
const loadArticles = () => import("./pages/Articles.tsx");
const loadArticlePage = () => import("./pages/ArticlePage.tsx");
const loadTopics = () => import("./pages/Topics.tsx");
const loadTopicPage = () => import("./pages/TopicPage.tsx");
const loadGlossary = () => import("./pages/Glossary.tsx");
const loadNewsletter = () => import("./pages/Newsletter.tsx");
const loadAbout = () => import("./pages/About.tsx");
const loadContact = () => import("./pages/Contact.tsx");
const loadOpenEnrollmentGuide = () => import("./pages/OpenEnrollmentGuide.tsx");
const loadInsuranceBenefitsHub = () => import("./pages/InsuranceBenefitsHub.tsx");
const loadHealthInsurancePlanTypesPage = () => import("./pages/HealthInsurancePlanTypesPage.tsx");
const loadSbcGuidePage = () => import("./pages/SbcGuidePage.tsx");
const loadMedicareCareCostHub = () => import("./pages/MedicareCareCostHub.tsx");
const loadMedicareMedicaidGuideLandingPage = () => import("./pages/MedicareMedicaidGuideLandingPage.tsx");
const loadQuickGuidesLibraryPage = () => import("./pages/QuickGuidesLibraryPage.tsx");
const loadCommercialInsuranceComparisonPage = () => import("./pages/CommercialInsuranceComparisonPage.tsx");
const loadHospitalDischargeCoveragePage = () => import("./pages/HospitalDischargeCoveragePage.tsx");
const loadDischargePrintableChecklistPage = () => import("./pages/DischargePrintableChecklistPage.tsx");
const loadMedicareAdvantageComparisonPage = () => import("./pages/MedicareAdvantageComparisonPage.tsx");
const loadInsuranceDecisionToolsBundle = () => import("./pages/InsuranceDecisionToolsBundle.tsx");
const loadMethodology = () => import("./pages/Methodology.tsx");
const loadPrivacyPolicy = () => import("./pages/PrivacyPolicy.tsx");
const loadTermsOfUse = () => import("./pages/TermsOfUse.tsx");
const loadEditorialPolicy = () => import("./pages/EditorialPolicy.tsx");
const loadDisclosures = () => import("./pages/Disclosures.tsx");
const loadAccessibility = () => import("./pages/Accessibility.tsx");
const loadNotFound = () => import("./pages/NotFound.tsx");

const Index = lazy(loadIndex);
const StartHere = lazy(loadStartHere);
const HealthcareWorkers = lazy(loadHealthcareWorkers);
const BuildWealthHub = lazy(loadBuildWealthHub);
const PatientsFamilies = lazy(loadPatientsFamilies);
const Tools = lazy(loadTools);
const Calc403bPaycheckCalculatorPage = lazy(loadCalc403bPaycheckCalculatorPage);
const OutOfPocketMaxEstimatorPage = lazy(loadOutOfPocketMaxEstimatorPage);
const OpenEnrollmentTrueCostCalculatorPage = lazy(loadOpenEnrollmentTrueCostCalculatorPage);
const EobBillMatchCheckerPage = lazy(loadEobBillMatchCheckerPage);
const HospitalDischargeMedicareChecklistPage = lazy(loadHospitalDischargeMedicareChecklistPage);
const MedicalBillReviewFlowPage = lazy(loadMedicalBillReviewFlowPage);
const HealthcareWorkerBenefitsBlueprintPage = lazy(loadHealthcareWorkerBenefitsBlueprintPage);
const EmployerBenefitsActionPlanPage = lazy(loadEmployerBenefitsActionPlanPage);
const MedicareMedicaidEligibilityCheckPage = lazy(loadMedicareMedicaidEligibilityCheckPage);
const PriorAuthorizationNextStepGuidePage = lazy(loadPriorAuthorizationNextStepGuidePage);
const HealthcareWorkerTotalCompensationPage = lazy(loadHealthcareWorkerTotalCompensationPage);
const StudentLoans = lazy(loadStudentLoans);
const Articles = lazy(loadArticles);
const ArticlePage = lazy(loadArticlePage);
const Topics = lazy(loadTopics);
const TopicPage = lazy(loadTopicPage);
const Glossary = lazy(loadGlossary);
const Newsletter = lazy(loadNewsletter);
const About = lazy(loadAbout);
const Contact = lazy(loadContact);
const OpenEnrollmentGuide = lazy(loadOpenEnrollmentGuide);
const InsuranceBenefitsHub = lazy(loadInsuranceBenefitsHub);
const HealthInsurancePlanTypesPage = lazy(loadHealthInsurancePlanTypesPage);
const SbcGuidePage = lazy(loadSbcGuidePage);
const MedicareCareCostHub = lazy(loadMedicareCareCostHub);
const MedicareMedicaidGuideLandingPage = lazy(loadMedicareMedicaidGuideLandingPage);
const QuickGuidesLibraryPage = lazy(loadQuickGuidesLibraryPage);
const CommercialInsuranceComparisonPage = lazy(loadCommercialInsuranceComparisonPage);
const HospitalDischargeCoveragePage = lazy(loadHospitalDischargeCoveragePage);
const DischargePrintableChecklistPage = lazy(loadDischargePrintableChecklistPage);
const MedicareAdvantageComparisonPage = lazy(loadMedicareAdvantageComparisonPage);
const HealthcareWorkerPaycheckTools = lazy(() => loadInsuranceDecisionToolsBundle().then((module) => ({ default: module.HealthcareWorkerPaycheckTools })));
const InsuranceMarketingRealityPage = lazy(() => loadInsuranceDecisionToolsBundle().then((module) => ({ default: module.InsuranceMarketingRealityPage })));
const MedicalBillReviewToolkit = lazy(() => loadInsuranceDecisionToolsBundle().then((module) => ({ default: module.MedicalBillReviewToolkit })));
const MedicareAdvantagePlanHelper = lazy(() => loadInsuranceDecisionToolsBundle().then((module) => ({ default: module.MedicareAdvantagePlanHelper })));
const MedicareAdvantageVsMedigap = lazy(() => loadInsuranceDecisionToolsBundle().then((module) => ({ default: module.MedicareAdvantageVsMedigap })));
const MedicationCoverageChecklist = lazy(() => loadInsuranceDecisionToolsBundle().then((module) => ({ default: module.MedicationCoverageChecklist })));
const PriorAuthorizationGuide = lazy(() => loadInsuranceDecisionToolsBundle().then((module) => ({ default: module.PriorAuthorizationGuide })));
const Methodology = lazy(loadMethodology);
const PrivacyPolicy = lazy(loadPrivacyPolicy);
const TermsOfUse = lazy(loadTermsOfUse);
const EditorialPolicy = lazy(loadEditorialPolicy);
const Disclosures = lazy(loadDisclosures);
const Accessibility = lazy(loadAccessibility);
const NotFound = lazy(loadNotFound);

const routeLoader = (pathname: string) => {
  if (pathname === "/") return loadIndex;
  if (pathname === "/start-here") return loadStartHere;
  if (pathname === "/healthcare-workers") return loadHealthcareWorkers;
  if (pathname === "/healthcare-workers/paycheck-tools") return loadInsuranceDecisionToolsBundle;
  if (pathname === "/build-wealth") return loadBuildWealthHub;
  if (pathname === "/patients-families") return loadPatientsFamilies;
  if (pathname === "/student-loans") return loadStudentLoans;
  if (pathname === "/tools") return loadTools;
  if (pathname === "/tools/403b-paycheck-calculator") return loadCalc403bPaycheckCalculatorPage;
  if (pathname === "/tools/out-of-pocket-max-estimator") return loadOutOfPocketMaxEstimatorPage;
  if (pathname === "/tools/open-enrollment-true-cost-calculator") return loadOpenEnrollmentTrueCostCalculatorPage;
  if (pathname === "/tools/eob-to-bill-match-checker") return loadEobBillMatchCheckerPage;
  if (pathname === "/tools/hospital-discharge-medicare-checklist") return loadHospitalDischargeMedicareChecklistPage;
  if (pathname === "/tools/medical-bill-review-flow") return loadMedicalBillReviewFlowPage;
  if (pathname === "/tools/healthcare-worker-benefits-blueprint") return loadHealthcareWorkerBenefitsBlueprintPage;
  if (pathname === "/tools/employer-benefits-action-plan") return loadEmployerBenefitsActionPlanPage;
  if (pathname === "/tools/medicare-medicaid-eligibility-check") return loadMedicareMedicaidEligibilityCheckPage;
  if (pathname === "/tools/prior-authorization-next-step-guide") return loadPriorAuthorizationNextStepGuidePage;
  if (pathname === "/tools/healthcare-worker-total-compensation-comparison") return loadHealthcareWorkerTotalCompensationPage;
  if (pathname === "/tools/medicare-advantage-plan-helper") return loadInsuranceDecisionToolsBundle;
  if (pathname === "/articles") return loadArticles;
  if (pathname.startsWith("/articles/")) return loadArticlePage;
  if (pathname === "/topics") return loadTopics;
  if (pathname.startsWith("/topics/")) return loadTopicPage;
  if (pathname === "/open-enrollment") return loadOpenEnrollmentGuide;
  if (pathname === "/insurance") return loadInsuranceBenefitsHub;
  if (pathname === "/insurance/health-insurance-plan-types") return loadHealthInsurancePlanTypesPage;
  if (pathname === "/insurance/how-to-read-an-sbc") return loadSbcGuidePage;
  if (pathname === "/insurance/commercial-insurance-comparison") return loadCommercialInsuranceComparisonPage;
  if (pathname === "/medicare-care-costs") return loadMedicareCareCostHub;
  if (pathname === "/guides") return loadQuickGuidesLibraryPage;
  if (pathname === "/guides/hospital-discharge-medicare") return loadMedicareMedicaidGuideLandingPage;
  if (pathname === "/insurance/medicare-advantage") return loadMedicareAdvantageComparisonPage;
  if (pathname === "/insurance/hospital-discharge-coverage") return loadHospitalDischargeCoveragePage;
  if (pathname === "/insurance/hospital-discharge-coverage/printable") return loadDischargePrintableChecklistPage;
  if (
    pathname === "/insurance/prior-authorization-guide" ||
    pathname === "/insurance/medication-coverage-checklist" ||
    pathname === "/insurance/medical-bill-review-toolkit" ||
    pathname === "/insurance/medicare-advantage-vs-medigap" ||
    pathname === "/insurance/what-medicare-advantage-marketing-may-not-emphasize"
  ) return loadInsuranceDecisionToolsBundle;
  if (pathname === "/glossary") return loadGlossary;
  if (pathname === "/newsletter") return loadNewsletter;
  if (pathname === "/about") return loadAbout;
  if (pathname === "/contact") return loadContact;
  if (pathname === "/methodology") return loadMethodology;
  if (pathname === "/privacy-policy") return loadPrivacyPolicy;
  if (pathname === "/terms-of-use") return loadTermsOfUse;
  if (pathname === "/editorial-policy") return loadEditorialPolicy;
  if (pathname === "/disclosures") return loadDisclosures;
  if (pathname === "/accessibility") return loadAccessibility;
  return loadNotFound;
};

export const preloadRoute = async (url: string) => {
  const pathname = url.split("?")[0].split("#")[0] || "/";
  await routeLoader(pathname)();
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const queryClient = new QueryClient();

const RouteSeo = () => {
  const location = useLocation();
  const meta = useMemo(() => resolveSiteSeoMeta(location.pathname), [location.pathname]);
  useSeo(meta);
  return null;
};

const GoogleAnalyticsPageView = () => {
  const location = useLocation();
  useEffect(() => {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", {
      page_title: document.title,
      page_path: `${location.pathname}${location.search}`,
      page_location: window.location.href,
    });
  }, [location.pathname, location.search]);
  return null;
};

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);
  return null;
};

const RouteLoadingFallback = () => (
  <div className="container flex min-h-[45vh] items-center justify-center py-16" role="status" aria-live="polite">
    <span className="text-sm font-semibold text-muted-foreground">Loading page…</span>
  </div>
);

export const AppContent = ({ includeRuntimeTelemetry = true }: { includeRuntimeTelemetry?: boolean }) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouteSeo />
      <GoogleAnalyticsPageView />
      <ScrollToTop />
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/start-here" element={<StartHere />} />
            <Route path="/healthcare-workers" element={<HealthcareWorkers />} />
            <Route path="/build-wealth" element={<BuildWealthHub />} />
            <Route path="/healthcare-workers/paycheck-tools" element={<HealthcareWorkerPaycheckTools />} />
            <Route path="/patients-families" element={<PatientsFamilies />} />
            <Route path="/student-loans" element={<StudentLoans />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/tools/403b-paycheck-calculator" element={<Calc403bPaycheckCalculatorPage />} />
            <Route path="/tools/403b-contribution" element={<Navigate to="/tools/403b-paycheck-calculator" replace />} />
            <Route path="/tools/out-of-pocket-max-estimator" element={<OutOfPocketMaxEstimatorPage />} />
            <Route path="/tools/open-enrollment-true-cost-calculator" element={<OpenEnrollmentTrueCostCalculatorPage />} />
            <Route path="/tools/eob-to-bill-match-checker" element={<EobBillMatchCheckerPage />} />
            <Route path="/tools/hospital-discharge-medicare-checklist" element={<HospitalDischargeMedicareChecklistPage />} />
            <Route path="/tools/medical-bill-review-flow" element={<MedicalBillReviewFlowPage />} />
            <Route path="/tools/healthcare-worker-benefits-blueprint" element={<HealthcareWorkerBenefitsBlueprintPage />} />
            <Route path="/tools/employer-benefits-action-plan" element={<EmployerBenefitsActionPlanPage />} />
            <Route path="/tools/medicare-medicaid-eligibility-check" element={<MedicareMedicaidEligibilityCheckPage />} />
            <Route path="/tools/prior-authorization-next-step-guide" element={<PriorAuthorizationNextStepGuidePage />} />
            <Route path="/tools/healthcare-worker-total-compensation-comparison" element={<HealthcareWorkerTotalCompensationPage />} />
            <Route path="/tools/medicare-advantage-plan-helper" element={<MedicareAdvantagePlanHelper />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:slug" element={<ArticlePage />} />
            <Route path="/topics" element={<Topics />} />
            <Route path="/topics/:slug" element={<TopicPage />} />
            <Route path="/open-enrollment" element={<OpenEnrollmentGuide />} />
            <Route path="/insurance" element={<InsuranceBenefitsHub />} />
            <Route path="/insurance/health-insurance-plan-types" element={<HealthInsurancePlanTypesPage />} />
            <Route path="/insurance/plan-types" element={<Navigate to="/insurance/health-insurance-plan-types" replace />} />
            <Route path="/insurance/how-to-read-an-sbc" element={<SbcGuidePage />} />
            <Route path="/insurance/summary-of-benefits-and-coverage" element={<Navigate to="/insurance/how-to-read-an-sbc" replace />} />
            <Route path="/insurance/commercial-insurance-comparison" element={<CommercialInsuranceComparisonPage />} />
            <Route path="/commercial-insurance-comparison" element={<Navigate to="/insurance/commercial-insurance-comparison" replace />} />
            <Route path="/medicare-care-costs" element={<MedicareCareCostHub />} />
            <Route path="/insurance/medicare-care-costs" element={<Navigate to="/medicare-care-costs" replace />} />
            <Route path="/guides" element={<QuickGuidesLibraryPage />} />
            <Route path="/quick-guides" element={<Navigate to="/guides" replace />} />
            <Route path="/guides/hospital-discharge-medicare" element={<MedicareMedicaidGuideLandingPage />} />
            <Route path="/guides/medicare-medicaid-rehab-long-term-care" element={<Navigate to="/guides/hospital-discharge-medicare" replace />} />
            <Route path="/guides/medicare-medicaid-guide" element={<Navigate to="/guides/hospital-discharge-medicare" replace />} />
            <Route path="/insurance/medicare-advantage" element={<MedicareAdvantageComparisonPage />} />
            <Route path="/insurance/prior-authorization-guide" element={<PriorAuthorizationGuide />} />
            <Route path="/insurance/hospital-discharge-coverage" element={<HospitalDischargeCoveragePage />} />
            <Route path="/insurance/hospital-discharge-coverage/printable" element={<DischargePrintableChecklistPage />} />
            <Route path="/insurance/discharge-coverage" element={<Navigate to="/insurance/hospital-discharge-coverage" replace />} />
            <Route path="/insurance/discharge-checklist" element={<Navigate to="/insurance/hospital-discharge-coverage/printable" replace />} />
            <Route path="/insurance/medication-coverage-checklist" element={<MedicationCoverageChecklist />} />
            <Route path="/insurance/medical-bill-review-toolkit" element={<MedicalBillReviewToolkit />} />
            <Route path="/insurance/medicare-advantage-vs-medigap" element={<MedicareAdvantageVsMedigap />} />
            <Route path="/insurance/what-medicare-advantage-marketing-may-not-emphasize" element={<InsuranceMarketingRealityPage />} />
            <Route path="/medicare-medicaid" element={<Navigate to="/medicare-care-costs" replace />} />
            <Route path="/topics/medicare-care-costs" element={<Navigate to="/medicare-care-costs" replace />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/newsletter" element={<Newsletter />} />
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
      </Suspense>
      {includeRuntimeTelemetry && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
    </TooltipProvider>
  </QueryClientProvider>
);

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
