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
import {
  MOBILE_GROUP_ITEMS,
  MOBILE_PRIORITY_ITEMS,
  PRIMARY_NAVIGATION_ITEMS,
  SERVICE_NAVIGATION_GROUPS,
  type ServiceNavigationItem,
} from "@/data/serviceNavigation";
import {
  recordServiceNavigationOpened,
  recordServiceNavigationSelection,
} from "@/lib/firstPartyEvidence";

const routePath = (route: string) => route.split("#")[0] || "/";

const isRouteActive = (pathname: string, route: string) => {
  const path = routePath(route);
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
};

const isServiceActive = (pathname: string, route: string) => pathname === routePath(route);

const LogoMark = () => (
  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-primary/30 bg-primary text-[0.62rem] font-extrabold tracking-tight text-primary-foreground">
    CAF
    <span aria-hidden="true" className="absolute right-1 top-1 h-2.5 w-2.5 rounded-sm bg-primary-foreground/12">
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-primary-foreground/80" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-primary-foreground/80" />
    </span>
  </span>
);

const ServiceLink = ({
  item,
  pathname,
  surface,
  onNavigate,
}: {
  item: ServiceNavigationItem;
  pathname: string;
  surface: "desktop_header" | "mobile_header";
  onNavigate?: () => void;
}) => {
  const active = isServiceActive(pathname, item.to);

  return (
    <Link
      to={item.to}
      aria-current={active ? "page" : undefined}
      onClick={() => {
        recordServiceNavigationSelection(surface, item.id);
        onNavigate?.();
      }}
      className={`group block rounded-xl border px-3 py-3 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        active
          ? "border-primary/30 bg-primary-soft/80 text-primary"
          : "border-transparent text-foreground hover:border-border hover:bg-muted/45"
      }`}
    >
      {item.audience && (
        <span className="mb-1 block text-[0.62rem] font-bold uppercase tracking-[0.13em] text-muted-foreground">
          {item.audience}
        </span>
      )}
      <span className="block text-sm font-bold leading-snug">{item.label}</span>
      <span className="mt-1 block text-[0.72rem] leading-relaxed text-muted-foreground">
        {item.description}
      </span>
    </Link>
  );
};

export const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);
  const serviceActive = SERVICE_NAVIGATION_GROUPS.some((group) =>
    group.items.some((item) => isServiceActive(location.pathname, item.to)),
  );

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search, location.hash]);

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
        mobileMenuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])') ?? [],
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

  const openMobileMenu = () => {
    setOpen((current) => {
      const next = !current;
      if (next) recordServiceNavigationOpened("mobile_header");
      return next;
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/94 backdrop-blur-xl supports-[backdrop-filter]:bg-background/88">
      <div className="container flex h-16 items-center justify-between gap-3">
        <Link
          to="/"
          className="flex min-w-0 shrink-0 items-center gap-2.5 rounded-lg font-display font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Community Acquired Finance home"
        >
          <LogoMark />
          <span className="hidden whitespace-nowrap text-base 2xl:inline">Community Acquired Finance</span>
          <span className="whitespace-nowrap text-base 2xl:hidden">CAF</span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 xl:flex" aria-label="Primary navigation">
          {PRIMARY_NAVIGATION_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-2.5 py-2 text-[0.78rem] font-semibold transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  isActive ? "bg-primary-soft/75 text-primary" : "text-muted-foreground hover:bg-muted/55 hover:text-foreground"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <DropdownMenu onOpenChange={(isOpen) => {
            if (isOpen) recordServiceNavigationOpened("desktop_header");
          }}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={`inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-2 text-[0.78rem] font-semibold transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=open]:bg-muted/60 ${
                  serviceActive ? "bg-primary-soft/75 text-primary" : "text-muted-foreground hover:bg-muted/55 hover:text-foreground"
                }`}
                aria-label="Open Explore CAF service navigation"
              >
                Explore CAF <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={10}
              className="w-[min(94vw,70rem)] rounded-2xl border-border p-3 shadow-hover"
            >
              <DropdownMenuLabel className="px-2 pb-3 pt-1">
                <span className="block text-sm font-bold text-foreground">Explore CAF services</span>
                <span className="mt-1 block max-w-2xl text-xs font-normal leading-relaxed text-muted-foreground">
                  Choose the decision or outcome you need. Every destination remains educational and source-backed.
                </span>
              </DropdownMenuLabel>
              <div className="grid grid-cols-2 gap-2 2xl:grid-cols-4">
                {SERVICE_NAVIGATION_GROUPS.map((group) => (
                  <section key={group.id} aria-labelledby={`desktop-service-group-${group.id}`} className="min-w-0 rounded-xl bg-card/45 p-2">
                    <div className="px-2 pb-2 pt-1">
                      <h2 id={`desktop-service-group-${group.id}`} className="text-xs font-extrabold uppercase tracking-[0.12em] text-foreground">
                        {group.label}
                      </h2>
                      <p className="mt-1 text-[0.68rem] leading-relaxed text-muted-foreground">{group.description}</p>
                    </div>
                    <div className="space-y-1">
                      {group.items.map((item) => (
                        <DropdownMenuItem key={item.id} asChild className="p-0 focus:bg-transparent">
                          <ServiceLink item={item} pathname={location.pathname} surface="desktop_header" />
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Button asChild variant="outline" size="sm" className="hidden whitespace-nowrap md:inline-flex">
            <Link to="/newsletter">Monthly email</Link>
          </Button>
          <button
            ref={menuButtonRef}
            className="rounded-lg p-2 transition-smooth hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 xl:hidden"
            onClick={openMobileMenu}
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
        <div id="mobile-menu" className="border-t border-border bg-background animate-fade-in xl:hidden">
          <nav
            ref={mobileMenuRef}
            className="container flex max-h-[calc(100vh-4rem)] flex-col overflow-y-auto py-4 pb-[calc(1rem_+_env(safe-area-inset-bottom))]"
            aria-label="Mobile navigation"
          >
            <div className="grid gap-2 sm:grid-cols-3" aria-label="Priority navigation">
              {MOBILE_PRIORITY_ITEMS.map((item, index) => {
                const active = isServiceActive(location.pathname, item.to);
                return (
                  <Link
                    ref={index === 0 ? firstMobileLinkRef : undefined}
                    key={item.id}
                    to={item.to}
                    aria-current={active ? "page" : undefined}
                    onClick={() => {
                      recordServiceNavigationSelection("mobile_header", item.id);
                      setOpen(false);
                    }}
                    className={`min-h-14 rounded-xl border px-3 py-3 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      active ? "border-primary/30 bg-primary-soft/75 text-primary" : "border-border bg-card/55 text-foreground hover:bg-muted/55"
                    }`}
                  >
                    <span className="block text-sm font-bold">{item.label}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{item.description}</span>
                  </Link>
                );
              })}
            </div>

            <div className="my-4 border-t border-border" aria-hidden="true" />
            <div className="px-1 pb-2">
              <div className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">Explore CAF</div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Open a group to find the decision or outcome you need.</p>
            </div>

            <div className="space-y-2">
              {MOBILE_GROUP_ITEMS.map((group) => {
                const groupActive = group.items.some((item) => isServiceActive(location.pathname, item.to));
                return (
                  <details key={group.id} className="group rounded-xl border border-border bg-card/45" open={groupActive || undefined}>
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-3 py-3 text-sm font-bold text-foreground transition-smooth hover:bg-muted/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                      <span>
                        <span className="block">{group.label}</span>
                        <span className="mt-1 block text-xs font-normal leading-relaxed text-muted-foreground">{group.description}</span>
                      </span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <div className="space-y-1 border-t border-border p-2">
                      {group.items.map((item) => (
                        <ServiceLink
                          key={item.id}
                          item={item}
                          pathname={location.pathname}
                          surface="mobile_header"
                          onNavigate={() => setOpen(false)}
                        />
                      ))}
                    </div>
                  </details>
                );
              })}
            </div>

            <Button asChild variant="outline" className="mt-4 md:hidden">
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
