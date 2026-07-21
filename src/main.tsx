import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./print.css";
import "./print-pagination.css";
import { AppErrorBoundary } from "./components/system/AppErrorBoundary";
import { installRouteAwareAdSense } from "./lib/routeAwareAdSense";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Application root element was not found.");
}

installRouteAwareAdSense();

const application = (
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, application);
} else {
  createRoot(container).render(application);
}
