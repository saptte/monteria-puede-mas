import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layers, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { MapCanvas } from "@/components/map/map-canvas";
import { MapFiltersPanel } from "@/components/map/map-filters-panel";
import { MapLegend } from "@/components/map/map-legend";
import { MapReportCard } from "@/components/map/map-report-card";
import { InstitutionalBanner } from "@/components/common/institutional-banner";
import { MapHeroCopy } from "./map-hero-copy";
import { MapDashboard } from "./map-dashboard";
import { CATEGORY_MAP } from "@/data/categories";
import { MAP_LAYERS } from "@/services/map-provider";
import { useMapFilters } from "@/hooks/use-map-filters";
import { useReports, useLatestReports } from "@/hooks/queries/use-reports";
import { useMapStats, useTopics, useWeeklyTopics, useZones } from "@/hooks/queries/use-stats";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import type { Report, ReportCategoryId } from "@/types";

const LEGEND_CATEGORIES: ReportCategoryId[] = [
  "basuras",
  "vias",
  "alumbrado",
  "agua",
  "parques",
  "movilidad",
  "seguridad",
];

/** El Mapa de Montería: explorar, filtrar y entender la ciudad. */
const MapPage = () => {
  const [searchParams] = useSearchParams();
  const temaParam = searchParams.get("tema") as ReportCategoryId | null;
  const initialCategories =
    temaParam && CATEGORY_MAP[temaParam] ? [temaParam] : [];

  const { data: reports = [], isLoading } = useReports();
  const { data: latestReports = [], isLoading: reportsLoading } = useLatestReports(3);
  const { data: mapStats = [], isLoading: statsLoading } = useMapStats();
  const { data: zones = [] } = useZones();
  const { data: topics = [] } = useTopics();
  const { data: weeklyTopics = [] } = useWeeklyTopics();
  const { isAuthenticated, openAuth } = useAuth();

  const [selected, setSelected] = useState<Report | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [layerId, setLayerId] = useState(MAP_LAYERS[0].id);

  const {
    filters,
    visibleReports,
    countsByCategory,
    activeFilterCount,
    toggleCategory,
    apply,
    clear,
    setBarrio,
    setQuery,
  } = useMapFilters(reports, initialCategories);

  return (
    <>
      <section className="bg-gradient-tint pb-6 pt-8 lg:pb-10" aria-labelledby="mapa-title">
        <div className="container-page grid gap-6 lg:grid-cols-[minmax(0,21%)_minmax(0,58%)_minmax(0,21%)] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <div id="mapa-title">
              <MapHeroCopy totalReports={reports.length || 1307} />
            </div>
          </div>

          <div className="relative order-first lg:order-none">
            <div className="relative h-[420px] overflow-hidden rounded-[2rem] border border-border/70 bg-background shadow-card sm:h-[520px] lg:h-[600px]">
              {isLoading ? (
                <Skeleton className="h-full w-full rounded-none" />
              ) : (
                <MapCanvas
                  reports={visibleReports}
                  selectedId={selected?.id}
                  layerId={layerId}
                  onSelect={setSelected}
                />
              )}

              <div className="absolute right-4 top-4 z-[700] flex items-center gap-1 rounded-2xl border border-border/70 bg-background/95 p-1 shadow-soft backdrop-blur">
                <Layers className="ml-2 h-4 w-4 text-primary" aria-hidden />
                {MAP_LAYERS.map((layer) => (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => setLayerId(layer.id)}
                    aria-pressed={layerId === layer.id}
                    className={cn(
                      "rounded-xl px-3 py-2 text-[11.5px] font-bold transition-colors",
                      layerId === layer.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-tint hover:text-primary",
                    )}
                  >
                    {layer.name}
                  </button>
                ))}
              </div>

              <div className="pointer-events-none absolute bottom-4 left-4 z-[700] rounded-2xl bg-background/95 px-4 py-2.5 shadow-card backdrop-blur">
                <p className="text-[12px] font-bold text-primary-deep">
                  {visibleReports.length} reportes en esta vista
                </p>
              </div>

              <Button
                variant="outlineBrand"
                size="sm"
                className="absolute bottom-4 right-4 z-[700] bg-background/95 backdrop-blur lg:hidden"
                onClick={() => setFiltersOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden />
                Filtrar
                {activeFilterCount ? ` (${activeFilterCount})` : ""}
              </Button>

              {selected ? (
                <div className="absolute bottom-20 left-4 right-4 z-[700] hidden lg:block lg:w-[320px]">
                  <MapReportCard report={selected} onClose={() => setSelected(null)} />
                </div>
              ) : null}
            </div>

            <MapLegend categories={LEGEND_CATEGORIES} className="mt-4 hidden lg:flex" />
          </div>

          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <div className="card-soft flex max-h-[calc(100vh_-_9rem)] flex-col overflow-hidden p-5 pb-16">
              <MapFiltersPanel
                selected={filters.selectedCategories}
                counts={countsByCategory}
                query={filters.query}
                barrio={filters.barrio}
                activeCount={activeFilterCount}
                onToggleCategory={toggleCategory}
                onQueryChange={setQuery}
                onBarrioChange={setBarrio}
                onApply={apply}
                onClear={clear}
              />
            </div>
          </aside>
        </div>
      </section>

      <MapDashboard
        stats={mapStats}
        statsLoading={statsLoading}
        zones={zones}
        topics={topics}
        weeklyTopics={weeklyTopics}
        latestReports={latestReports}
        reportsLoading={reportsLoading}
        onSelectTopic={(category) => {
          toggleCategory(category);
          apply();
        }}
        onSeeAllTopics={() => setFiltersOpen(true)}
      />

      <InstitutionalBanner
        onPrimary={() => (isAuthenticated ? undefined : openAuth("register"))}
        primaryLabel="Quiero ser parte"
      />

      <Drawer open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DrawerContent className="max-h-[88vh] rounded-t-[1.75rem] p-0 lg:hidden">
          <DrawerHeader className="px-5 pb-2 text-left">
            <DrawerTitle className="font-display text-[17px] text-primary-deep">
              Filtrar el mapa
            </DrawerTitle>
          </DrawerHeader>
          <div className="min-h-0 flex-1 overflow-hidden px-5 pb-6">
            <MapFiltersPanel
              variant="sheet"
              selected={filters.selectedCategories}
              counts={countsByCategory}
              query={filters.query}
              barrio={filters.barrio}
              activeCount={activeFilterCount}
              onToggleCategory={toggleCategory}
              onQueryChange={setQuery}
              onBarrioChange={setBarrio}
              onApply={() => {
                apply();
                setFiltersOpen(false);
              }}
              onClear={clear}
            />
          </div>
        </DrawerContent>
      </Drawer>

      {selected ? (
        <Drawer open onOpenChange={(open) => !open && setSelected(null)}>
          <DrawerContent className="rounded-t-[1.75rem] p-0 lg:hidden">
            <DrawerHeader className="sr-only">
              <DrawerTitle>Detalle del reporte</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-6 pt-2">
              <MapReportCard report={selected} onClose={() => setSelected(null)} />
            </div>
          </DrawerContent>
        </Drawer>
      ) : null}
    </>
  );
};

export default MapPage;
