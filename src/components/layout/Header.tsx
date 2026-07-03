import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
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
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-3">
        <Link
          to="/"
          className="flex min-w-0 shrink-0 items-center gap-2.5 font-display font-bold tracking-tight text-foreground"
          onClick={() => setOpen(false)}
          aria-label="Community Acquired Finance home"
        >
          <LogoMark />
          <span className="hidden whitespace-nowrap text-base sm:inline">Community Acquired Finance</span>
          <span className="whitespace-nowrap text-base sm:hidden">Finance</span>
        </Link>

        <nav className="hidden lg:flex min-w-0 flex-1 items-center justify-center gap-0.5" aria-label="Primary navigation">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-2.5 py-2 text-[0.8rem] font-medium transition-smooth ${
                  isActive ? "text-primary bg-primary-soft" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Button asChild variant="hero" size="sm" className="hidden sm:inline-flex whitespace-nowrap">
            <Link to="/newsletter">Newsletter</Link>
          </Button>
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-smooth"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-in">
          <nav className="container py-4 flex flex-col gap-1" aria-label="Mobile navigation">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
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

            <div className="my-2 border-t border-border" />
            <div className="px-3 pb-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">More</div>
            {secondaryNav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm font-medium rounded-lg text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground"
              >
                {n.label}
              </NavLink>
            ))}

            <Button asChild variant="hero" className="mt-2 sm:hidden">
              <Link to="/newsletter" onClick={() => setOpen(false)}>Join newsletter</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};