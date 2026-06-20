import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/healthcare-workers", label: "Healthcare Workers" },
  { to: "/patients-families", label: "Patients & Caregivers" },
  { to: "/topics", label: "All topics" },
  { to: "/tools", label: "Calculators" },
  { to: "/articles", label: "Articles" },
  { to: "/glossary", label: "Glossary" },
  { to: "/about", label: "About / Sources" },
];

const LogoMark = () => (
  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary/25 bg-gradient-primary text-[0.62rem] font-extrabold tracking-tight text-primary-foreground shadow-card">
    CAF
    <span aria-hidden="true" className="absolute right-1 top-1 h-2.5 w-2.5 rounded-sm bg-primary-foreground/15">
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-primary-foreground/85" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-primary-foreground/85" />
    </span>
  </span>
);

export const Header = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2.5 font-display font-bold tracking-tight text-foreground"
          onClick={() => setOpen(false)}
        >
          <LogoMark />
          <span className="hidden min-w-0 break-words text-base sm:inline">Community Acquired Finance</span>
          <span className="text-base sm:hidden">CAF</span>
        </Link>

        <nav className="hidden xl:flex items-center gap-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-lg transition-smooth ${
                  isActive ? "text-primary bg-primary-soft" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="hero" size="sm" className="hidden sm:inline-flex">
            <Link to="/tools">Open a calculator</Link>
          </Button>
          <button
            className="xl:hidden p-2 rounded-lg hover:bg-muted transition-smooth"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="xl:hidden border-t border-border bg-background animate-fade-in">
          <nav className="container py-4 flex flex-col gap-1">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-3 text-sm font-medium rounded-lg transition-smooth ${
                    isActive ? "text-primary bg-primary-soft" : "text-foreground hover:bg-muted"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <Button asChild variant="hero" className="mt-2 sm:hidden">
              <Link to="/tools" onClick={() => setOpen(false)}>Open a calculator</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};