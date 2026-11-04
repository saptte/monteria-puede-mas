import { Outlet, useLocation } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { PageSkeleton } from "@/components/common/page-skeleton";

/** Marco común de la plataforma: navbar, contenido y footer. */
export const SiteLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-primary-foreground"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido" className="flex-1 pb-20 lg:pb-0">
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <MobileTabBar />
    </div>
  );
};
