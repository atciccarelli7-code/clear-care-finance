import { createRoot } from "react-dom/client";
import { GaHistoryTracker } from "./components/analytics/GaHistoryTracker.tsx";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <>
    <GaHistoryTracker />
    <App />
  </>,
);
