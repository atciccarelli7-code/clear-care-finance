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
import NotFound from "./pages/NotFound.tsx";
import { Contact, Disclaimer, EditorialPolicy, Privacy, Sources, Terms } from "./pages/PublishingPages.tsx";

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
            {/* Legacy route — Medicare/Medicaid is now a topic */}
            <Route path="/medicare-medicaid" element={<Navigate to="/topics/medicare-medicaid" replace />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/about" element={<About />} />
            <Route path="/sources" element={<Sources />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/editorial-policy" element={<EditorialPolicy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
