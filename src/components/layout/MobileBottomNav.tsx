import { NavLink } from "react-router-dom";
import { Calculator, Compass, HeartPulse, ShieldCheck, type LucideIcon } from "lucide-react";

type MobileNavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

const items: MobileNavItem[] = [
  { to: "/start-here", label: "Start", icon: Compass },
  { to: "/tools", label: "Tools", icon: Calculator },
  { to: "/insurance", label: "Benefits", icon: ShieldCheck },
  { to: "/medicare-care-costs", label: "Medicare", icon: HeartPulse },
];

export const MobileBottomNav = () => (
  <nav
    className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-card/95 px-2 pt-2 pb-[calc(0.5rem_+_env(safe-area-inset-bottom))] shadow-soft backdrop-blur-xl md:hidden"
    aria-label="Primary mobile navigation"
  >
    <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          aria-label={`Open ${label}`}
          className={({ isActive }) =>
            `flex min-h-14 min-w-0 flex-col items-center justify-center rounded-lg px-1.5 py-1.5 text-[0.7rem] font-semibold transition-smooth ${
              isActive ? "bg-primary-soft/75 text-primary" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`
          }
        >
          <Icon className="mb-1 h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="max-w-full truncate">{label}</span>
        </NavLink>
      ))}
    </div>
  </nav>
);