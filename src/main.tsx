import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import Phase3ProductApp, { BENEFITS_DECISION_OFFER_PATH } from "./Phase3ProductApp";
import "./index.css";
import "./print.css";
import "./print-pagination.css";
import { AppErrorBoundary } from "./components/system/AppErrorBoundary";
import { installFirstPartyEvidenceObserver } from "./lib/firstPartyEvidence";
import { installRouteAwareAdSense } from "./lib/routeAwareAdSense";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Application root element was not found.");
}

installRouteAwareAdSense();
installFirstPartyEvidenceObserver();

const application = (
  <AppErrorBoundary>
    {window.location.pathname === BENEFITS_DECISION_OFFER_PATH ? <Phase3ProductApp /> : <App />}
  </AppErrorBoundary>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, application);
} else {
  createRoot(container).render(application);
}
