type AdSlotProps = {
  placement: "after-hero" | "between-sections" | "desktop-sidebar" | "after-results";
  className?: string;
};

const adsEnabled = import.meta.env.VITE_ADSENSE_ENABLED === "true";

export const AdSlot = ({ placement, className = "" }: AdSlotProps) => {
  if (!adsEnabled) return null;

  return (
    <aside className={className} aria-label="Advertisement">
      <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Advertisement · {placement.replace(/-/g, " ")}
      </div>
    </aside>
  );
};

export default AdSlot;
