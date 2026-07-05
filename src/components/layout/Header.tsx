import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/start-here", label: "Start Here" },
  { to: "/tools", label: "Tools" },
  { to: "/articles", label: "Articles" },
  { to: "/insurance", label: "Insurance" },
  { to: "/healthcare-workers", label: "Healthcare Workers" },
  { to: "/build-wealth", label: "Build Wealth" },
];

const secondaryNav = [
  { to: "/medicare-care-costs", label: "Medicare Cost Hub" },
  { to: "/open-enrollment", label: "Open Enrollment" },
  { to: "/student-loans", label: "Student Loans" },
  { to: "/patients-families", label: "Patients & Caregivers" },
  { to: "/glossary", label: "Glossary" },
  { to: "/about", label: "About" },
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
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between gap-3">
        <Link
          to="/"
          className="flex min-w-0 shrink-0 items-center gap-2.5 rounded-xl font-display font-bold tracking-tight text-foreground"
          aria-label="Community Acquired Finance home"
        >
          <LogoMark />
          <span className="hidden whitespace-nowrap text-base md:inline">Community Acquired Finance</span>
          <span className="whitespace-nowrap text-base md:hidden">Finance</span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex" aria-label="Primary navigation">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-xl px-3 py-2 text-[0.82rem] font-semibold transition-smooth ${
                  isActive ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Button asChild variant="hero" size="sm" className="hidden whitespace-nowrap md:inline-flex">
            <Link to="/newsletter">Newsletter</Link>
          </Button>
          <button
            className="rounded-xl p-2 transition-smooth hover:bg-muted xl:hidden"
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-controls="mobile-menu"
            aria-expanded={open}
            type="button"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-border bg-background shadow-card animate-fade-in xl:hidden">
          <nav className="container flex max-h-[calc(100vh-4rem)] flex-col gap-1 overflow-y-auto py-4" aria-label="Mobile navigation">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-3 text-sm font-semibold transition-smooth ${
                    isActive ? "bg-primary-soft text-primary" : "text-foreground hover:bg-muted"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}

            <div className="my-2 border-t border-border" />
            <div className="px-3 pb-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">More</div>
            {secondaryNav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground"
              >
                {n.label}
              </NavLink>
            ))}

            <Button asChild variant="hero" className="mt-2 md:hidden">
              <Link to="/newsletter">Join newsletter</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};
