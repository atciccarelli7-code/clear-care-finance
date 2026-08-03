import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
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

const phase3ProductPaths = new Set([
  "/products/healthcare-worker-benefits-decision-system",
  "/products/healthcare-worker-benefits-decision-pack",
]);

const bootstrap = async () => {
  const Application = phase3ProductPaths.has(window.location.pathname)
    ? (await import("./Phase3ProductApp")).default
    : App;

  const application = (
    <AppErrorBoundary>
      <Application />
    </AppErrorBoundary>
  );

  if (container.hasChildNodes()) {
    hydrateRoot(container, application);
  } else {
    createRoot(container).render(application);
  }
};

void bootstrap();
