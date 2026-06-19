import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Leaf } from "lucide-react";

const nav = [
  { to: "/healthcare-workers", label: "Healthcare Worker Money" },
  { to: "/patients-families", label: "Patient & Caregiver Money" },
  { to: "/topics", label: "All topics" },
  { to: "/tools", label: "Calculators" },
  { to: "/articles", label: "Articles" },
  { to: "/glossary", label: "Glossary" },
  { to: "/about", label: "About" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2.5 font-display font-bold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary border border-primary/20">
            <Leaf className="h-4.5 w-4.5" />
          </span>
          <span className="hidden sm:inline text-base">Community Acquired Finance</span>
          <span className="sm:hidden text-base">CAF</span>
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
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="xl:hidden border-t border-border bg-background animate-fade-in">
          <nav id="mobile-navigation" className="container py-4 flex flex-col gap-1">
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
