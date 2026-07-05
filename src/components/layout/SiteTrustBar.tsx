import { Link } from "react-router-dom";
import { BookOpenCheck, ShieldCheck, Stethoscope } from "lucide-react";

const trustItems = [
  { icon: Stethoscope, label: "RN-led", helper: "Healthcare context" },
  { icon: BookOpenCheck, label: "Source-backed", helper: "Methodology linked" },
  { icon: ShieldCheck, label: "Educational only", helper: "No individualized advice" },
];

export const SiteTrustBar = () => (
  <aside className="border-b border-border/70 bg-card/45" aria-label="Site trust standards">
    <div className="container flex min-w-0 flex-col gap-3 py-3 text-xs text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
      <div className="grid min-w-0 gap-2 sm:grid-cols-3 lg:flex lg:items-center lg:gap-4">
        {trustItems.map(({ icon: Icon, label, helper }) => (
          <div key={label} className="flex min-w-0 items-center gap-2 rounded-xl bg-background/70 px-3 py-2 ring-1 ring-border/70">
            <Icon className="h-4 w-4 shrink-0 text-primary" />
            <span className="min-w-0 truncate"><strong className="text-foreground">{label}</strong> · {helper}</span>
          </div>
        ))}
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 font-semibold">
        <Link to="/methodology" className="text-primary underline-offset-4 hover:underline">Sources</Link>
        <Link to="/editorial-policy" className="text-primary underline-offset-4 hover:underline">Editorial policy</Link>
        <Link to="/disclosures" className="text-primary underline-offset-4 hover:underline">Disclosures</Link>
      </div>
    </div>
  </aside>
);

export default SiteTrustBar;
