import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { site } from "@/config/site";

type AdSlotProps = {
  slotId?: string;
  placement: "article-after-intro" | "article-end" | "sidebar" | "between-sections";
  className?: string;
  label?: "Advertisement" | "Sponsored Links";
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export const AdSlot = ({ slotId, placement, className, label = "Advertisement" }: AdSlotProps) => {
  const canRenderAd = site.adsenseEnabled && site.adsenseClientId && slotId;

  useEffect(() => {
    if (!canRenderAd) return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ad blockers, browser settings, or account review status should never break page content.
    }
  }, [canRenderAd]);

  if (!canRenderAd) return null;

  return (
    <aside
      className={cn("my-8 rounded-2xl border border-border bg-card/40 p-4", className)}
      data-ad-placement={placement}
      aria-label={label}
    >
      <div className="mb-2 text-center text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      {/*
        Placement rules:
        - Keep ad units outside calculators, forms, navigation, popups, sticky boxes, and primary calls-to-action.
        - Use clear labels only: "Advertisement" or "Sponsored Links".
        - Ads must remain visually separate from educational content and site controls.
      */}
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={site.adsenseClientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
};
