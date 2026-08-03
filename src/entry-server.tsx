import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppContent, preloadRoute } from "./App";
import {
  BENEFITS_DECISION_OFFER_META,
  Phase3ProductContent,
  isPhase3ProductPath,
} from "./Phase3ProductApp";
import { resolveSiteSeoMeta } from "@/lib/siteSeoMeta";

const pathnameFor = (url: string) => url.split("?")[0].split("#")[0] || "/";

const renderAppToString = (url: string) =>
  new Promise<string>((resolve, reject) => {
    let html = "";
    let didPipe = false;
    const isBenefitsOffer = isPhase3ProductPath(pathnameFor(url));

    const { pipe, abort } = renderToPipeableStream(
      <StaticRouter location={url}>
        {isBenefitsOffer
          ? <Phase3ProductContent includeRuntimeTelemetry={false} />
          : <AppContent includeRuntimeTelemetry={false} />}
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
  const isBenefitsOffer = isPhase3ProductPath(pathnameFor(url));
  if (!isBenefitsOffer) await preloadRoute(url);

  return {
    html: await renderAppToString(url),
    meta: isBenefitsOffer ? BENEFITS_DECISION_OFFER_META : resolveSiteSeoMeta(url),
  };
};
