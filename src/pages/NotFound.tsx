import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Newsletter from "./Newsletter";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/newsletter") return;
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  if (location.pathname === "/newsletter") {
    return <Newsletter />;
  }

  return (
    <section className="container flex min-h-[60vh] items-center justify-center py-16">
      <div className="max-w-xl text-center">
        <div className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">404</div>
        <h1 className="font-display text-4xl font-bold text-balance">That page could not be found.</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          The link may be outdated, or the page may have moved. The rest of the site is still right where you left it.
        </p>
        <Button asChild variant="hero" size="lg" className="mt-8">
          <Link to="/"><ArrowLeft className="h-4 w-4" /> Return home</Link>
        </Button>
      </div>
    </section>
  );
};

export default NotFound;
