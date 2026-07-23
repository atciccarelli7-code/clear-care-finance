import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu, X } from "lucide-react";

const nav = [
  { to: "/start-here", label: "Start Here" },
  { to: "/tools", label: "Tools" },
  { to: "/build-wealth", label: "Money & Retirement" },
  { to: "/insurance", label: "Benefits & Insurance" },
  { to: "/medicare-care-costs", label: "Medicare & Medicaid" },
  { to: "/articles", label: "Articles" },
];

const secondaryNav = [
  { to: "/products", label: "Products" },
  { to: "/healthcare-workers", label: "Healthcare Workers" },
  { to: "/patients-families", label: "Patients & Caregivers" },
  { to: "/topics", label: "Topic Guides" },
  { to: "/guides", label: "Quick Guides" },
  { to: "/open-enrollment", label: "Open Enrollment" },
  { to: "/student-loans", label: "Student Loans" },
  { to: "/glossary", label: "Glossary" },
  { to: "/about", label: "About" },
];

const isRouteActive = (pathname: string, route: string) => pathname === route || pathname.startsWith(`${route}/`);

const LogoMark = () => (
  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-primary/30 bg-primary text-[0.62rem] font-extrabold tracking-tight text-primary-foreground">
    CAF
    <span aria-hidden="true" className="absolute right-1 top-1 h-2.5 w-2.5 rounded-sm bg-primary-foreground/12">
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-primary-foreground/80" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-primary-foreground/80" />
    </span>
  </span>
);

export const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);
  const secondaryActive = secondaryNav.some((item) => isRouteActive(location.pathname, item.to));

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => firstMobileLinkRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = Array.from(
        mobileMenuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [],
      ).filter((element) => {
        if (element.hasAttribute("hidden") || element.getAttribute("aria-hidden") === "true") return false;
        const style = window.getComputedStyle(element);
        return style.display !== "none" && style.visibility !== "hidden";
      });
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/94 backdrop-blur-xl supports-[backdrop-filter]:bg-background/88">
      <div className="container flex h-16 items-center justify-between gap-3">
        <Link
          to="/"
          className="flex min-w-0 shrink-0 items-center gap-2.5 rounded-lg font-display font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Community Acquired Finance home"
        >
          <LogoMark />
          <span className="hidden whitespace-nowrap text-base md:inline">Community Acquired Finance</span>
          <span className="whitespace-nowrap text-base md:hidden">CAF</span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 2xl:flex" aria-label="Primary navigation">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-2 text-[0.82rem] font-semibold transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  isActive ? "bg-primary-soft/75 text-primary" : "text-muted-foreground hover:bg-muted/55 hover:text-foreground"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={`inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-[0.82rem] font-semibold transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=open]:bg-muted/60 ${
                  secondaryActive ? "bg-primary-soft/75 text-primary" : "text-muted-foreground hover:bg-muted/55 hover:text-foreground"
                }`}
                aria-label="Open additional navigation"
              >
                More <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-xl border-border p-2 shadow-card">
              <DropdownMenuLabel className="px-3 pb-2 pt-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Explore more
              </DropdownMenuLabel>
              {secondaryNav.map((n) => {
                const active = isRouteActive(location.pathname, n.to);
                return (
                  <DropdownMenuItem key={n.to} asChild className="p-0 focus:bg-transparent">
                    <Link
                      to={n.to}
                      aria-current={active ? "page" : undefined}
                      className={`flex w-full rounded-lg px-3 py-2.5 text-sm font-semibold transition-smooth focus-visible:outline-none ${
                        active ? "bg-primary-soft/75 text-primary" : "text-foreground hover:bg-muted/60"
                      }`}
                    >
                      {n.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Button asChild variant="outline" size="sm" className="hidden whitespace-nowrap md:inline-flex">
            <Link to="/newsletter">Monthly email</Link>
          </Button>
          <button
            ref={menuButtonRef}
            className="rounded-lg p-2 transition-smooth hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 2xl:hidden"
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-controls="mobile-menu"
            aria-expanded={open}
            type="button"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-border bg-background animate-fade-in 2xl:hidden">
          <nav
            ref={mobileMenuRef}
            className="container flex max-h-[calc(100vh-4rem)] flex-col gap-1 overflow-y-auto py-4 pb-[calc(1rem_+_env(safe-area-inset-bottom))]"
            aria-label="Mobile navigation"
          >
            {nav.map((n, index) => (
              <NavLink
                ref={index === 0 ? firstMobileLinkRef : undefined}
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-3 text-sm font-semibold transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    isActive ? "bg-primary-soft/75 text-primary" : "text-foreground hover:bg-muted/60"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}

            <div className="my-2 border-t border-border" aria-hidden="true" />
            <div className="px-3 pb-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">More</div>
            {secondaryNav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    isActive ? "bg-primary-soft/75 text-primary" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}

            <Button asChild variant="outline" className="mt-2 md:hidden">
              <Link to="/newsletter" onClick={() => setOpen(false)}>
                Monthly email
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};
