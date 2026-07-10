import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppContent } from "./App";
import { resolveSeoMeta } from "@/lib/seoRegistry";

export const render = (url: string) => ({
  html: renderToString(
    <StaticRouter location={url}>
      <AppContent includeRuntimeTelemetry={false} />
    </StaticRouter>,
  ),
  meta: resolveSeoMeta(url),
});
