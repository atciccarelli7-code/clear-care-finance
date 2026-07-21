import { Link } from "react-router-dom";
import { BookOpenCheck, ShieldCheck, Stethoscope } from "lucide-react";

const trustItems = [
  { icon: Stethoscope, label: "RN-led", helper: "Healthcare context" },
  { icon: BookOpenCheck, label: "Source-backed", helper: "Methodology linked" },
  { icon: ShieldCheck, label: "Educational only", helper: "No individualized advice" },
];

export const SiteTrustBar = () => (
  <aside className="border-b border-border/70 bg-background/65 print:hidden" aria-label="Site trust standards">
    <div className="container flex min-w-0 flex-col gap-2.5 py-3 text-xs text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2">
        {trustItems.map(({ icon: Icon, label, helper }) => (
          <div key={label} className="inline-flex min-w-0 items-center gap-2">
            <Icon className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span className="min-w-0">
              <strong className="font-semibold text-foreground">{label}</strong>
              <span className="hidden sm:inline"> · {helper}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 font-semibold">
        <Link to="/methodology" className="text-primary underline-offset-4 hover:underline">Sources</Link>
        <Link to="/editorial-policy" className="text-primary underline-offset-4 hover:underline">Editorial policy</Link>
        <Link to="/disclosures" className="text-primary underline-offset-4 hover:underline">Disclosures</Link>
      </div>
    </div>
  </aside>
);

export default SiteTrustBar;
