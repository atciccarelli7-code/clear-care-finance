import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppContent, preloadRoute } from "./App";
import { resolveSeoMeta } from "@/lib/seoRegistry";

export const render = async (url: string) => {
  await preloadRoute(url);

  return {
    html: renderToString(
      <StaticRouter location={url}>
        <AppContent includeRuntimeTelemetry={false} />
      </StaticRouter>,
    ),
    meta: resolveSeoMeta(url),
  };
};
