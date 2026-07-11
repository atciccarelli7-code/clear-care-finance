import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const vendorChunk = (id: string) => {
  const normalized = id.replace(/\\/g, "/");
  if (!normalized.includes("/node_modules/")) return undefined;

  if (
    normalized.includes("/node_modules/react/") ||
    normalized.includes("/node_modules/react-dom/") ||
    normalized.includes("/node_modules/react-router/") ||
    normalized.includes("/node_modules/react-router-dom/") ||
    normalized.includes("/node_modules/scheduler/")
  ) {
    return "react-vendor";
  }

  if (
    normalized.includes("/node_modules/@radix-ui/") ||
    normalized.includes("/node_modules/cmdk/") ||
    normalized.includes("/node_modules/vaul/") ||
    normalized.includes("/node_modules/sonner/")
  ) {
    return "ui-vendor";
  }

  if (normalized.includes("/node_modules/recharts/") || normalized.includes("/node_modules/d3-")) {
    return "charts-vendor";
  }

  if (
    normalized.includes("/node_modules/react-hook-form/") ||
    normalized.includes("/node_modules/@hookform/") ||
    normalized.includes("/node_modules/zod/")
  ) {
    return "forms-vendor";
  }

  if (normalized.includes("/node_modules/@tanstack/")) return "query-vendor";
  if (normalized.includes("/node_modules/lucide-react/")) return "icons-vendor";

  if (
    normalized.includes("/node_modules/@vercel/analytics/") ||
    normalized.includes("/node_modules/@vercel/speed-insights/")
  ) {
    return "observability-vendor";
  }

  if (
    normalized.includes("/node_modules/date-fns/") ||
    normalized.includes("/node_modules/embla-carousel-react/") ||
    normalized.includes("/node_modules/react-day-picker/") ||
    normalized.includes("/node_modules/react-resizable-panels/") ||
    normalized.includes("/node_modules/input-otp/") ||
    normalized.includes("/node_modules/next-themes/")
  ) {
    return "utility-vendor";
  }

  return "vendor";
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: vendorChunk,
      },
    },
  },
}));
