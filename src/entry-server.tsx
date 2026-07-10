import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppContent, preloadRoute } from "./App";
import { resolveSeoMeta } from "@/lib/seoRegistry";

const renderAppToString = (url: string) =>
  new Promise<string>((resolve, reject) => {
    let html = "";
    let didPipe = false;

    const { pipe, abort } = renderToPipeableStream(
      <StaticRouter location={url}>
        <AppContent includeRuntimeTelemetry={false} />
      </StaticRouter>,
      {
        onAllReady() {
          didPipe = true;
          const destination = new PassThrough();
          destination.setEncoding("utf8");
          destination.on("data", (chunk) => {
            html += chunk;
          });
          destination.on("end", () => resolve(html));
          destination.on("error", reject);
          pipe(destination);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          if (!didPipe) return;
          abort();
          reject(error);
        },
      },
    );
  });

export const render = async (url: string) => {
  await preloadRoute(url);

  return {
    html: await renderAppToString(url),
    meta: resolveSeoMeta(url),
  };
};
