import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { installRouteAwareAdSense } from "./lib/routeAwareAdSense";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Application root element was not found.");
}

installRouteAwareAdSense();

if (container.hasChildNodes()) {
  hydrateRoot(container, <App />);
} else {
  createRoot(container).render(<App />);
}
