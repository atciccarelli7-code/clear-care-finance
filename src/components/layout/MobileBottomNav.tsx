import { NavLink } from "react-router-dom";
import { BookOpen, Calculator, FileText, HeartPulse, type LucideIcon } from "lucide-react";

type MobileNavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

const items: MobileNavItem[] = [
  { to: "/tools", label: "Tools", icon: Calculator },
  { to: "/articles", label: "Articles", icon: FileText },
  { to: "/topics/medicare-medicaid", label: "Medicare", icon: HeartPulse },
  { to: "/glossary", label: "Glossary", icon: BookOpen },
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
          className={({ isActive }) =>
            `flex min-h-14 flex-col items-center justify-center rounded-2xl px-2 py-1.5 text-[0.72rem] font-semibold transition-smooth ${
              isActive ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`
          }
        >
          <Icon className="mb-1 h-4 w-4" aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </div>
  </nav>
);
