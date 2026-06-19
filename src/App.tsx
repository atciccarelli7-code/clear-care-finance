import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index.tsx";
import HealthcareWorkers from "./pages/HealthcareWorkers.tsx";
import PatientsFamilies from "./pages/PatientsFamilies.tsx";
import Tools from "./pages/Tools.tsx";
import Articles from "./pages/Articles.tsx";
import ArticlePage from "./pages/ArticlePage.tsx";
import Topics from "./pages/Topics.tsx";
import TopicPage from "./pages/TopicPage.tsx";
import Glossary from "./pages/Glossary.tsx";
import About from "./pages/About.tsx";
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
            <Route path="/patients-families" element={<PatientsFamilies />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:slug" element={<ArticlePage />} />
            <Route path="/topics" element={<Topics />} />
            <Route path="/topics/:slug" element={<TopicPage />} />
            <Route path="/medicare-medicaid" element={<Navigate to="/topics/medicare-medicaid" replace />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/editorial-policy" element={<EditorialPolicy />} />
            <Route path="/disclosures" element={<Disclosures />} />
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;