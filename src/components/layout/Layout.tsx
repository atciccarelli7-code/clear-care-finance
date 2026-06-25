import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const Layout = () => {
  return (
    <div className="min-h-screen flex w-full min-w-0 flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground focus:shadow-card focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1 w-full min-w-0" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
