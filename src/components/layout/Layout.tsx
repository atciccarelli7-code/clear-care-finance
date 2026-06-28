import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileBottomNav } from "./MobileBottomNav";

export const Layout = () => {
  return (
    <div className="min-h-screen flex w-full min-w-0 flex-col pb-[calc(5rem_+_env(safe-area-inset-bottom))] md:pb-0">
      <Header />
      <main className="flex-1 w-full min-w-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};
