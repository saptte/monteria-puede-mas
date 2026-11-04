import { lazy } from "react";
import { SiteLayout } from "./layouts/site-layout";
import Home from "./pages/home";

// Rutas con carga diferida: cada página se descarga sólo cuando se visita.
const MonteriaHabla = lazy(() => import("./pages/monteria-habla"));
const MuroPage = lazy(() => import("./pages/muro"));
const MonteriaHace = lazy(() => import("./pages/monteria-hace"));
const MonteriaResuelve = lazy(() => import("./pages/monteria-resuelve"));
const MapPage = lazy(() => import("./pages/map"));
const ReportPage = lazy(() => import("./pages/report"));
const ReportDetailPage = lazy(() => import("./pages/report-detail"));
const MiMonteria = lazy(() => import("./pages/mi-monteria"));
const AboutPage = lazy(() => import("./pages/about"));
const NotFound = lazy(() => import("./pages/NotFound"));

export const routers = [
  {
    path: "/",
    element: <SiteLayout />,
    children: [
      { index: true, name: "home", element: <Home /> },
      { path: "muro", name: "muro", element: <MuroPage /> },
      { path: "monteria-habla", name: "habla", element: <MonteriaHabla /> },
      { path: "monteria-hace", name: "hace", element: <MonteriaHace /> },
      { path: "monteria-resuelve", name: "resuelve", element: <MonteriaResuelve /> },
      { path: "mapa", name: "mapa", element: <MapPage /> },
      { path: "reportar", name: "reportar", element: <ReportPage /> },
      { path: "reportes/:id", name: "detalle-reporte", element: <ReportDetailPage /> },
      { path: "mi-monteria", name: "mi-monteria", element: <MiMonteria /> },
      { path: "sobre-la-plataforma", name: "sobre-la-plataforma", element: <AboutPage /> },
      { path: "*", name: "404", element: <NotFound /> },
    ],
  },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;
