import { Link } from "react-router-dom";
import { ArrowRight, MapPin, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrushHighlight } from "@/components/common/brush-highlight";
import { MapCanvas } from "@/components/map/map-canvas";
import { MapLegend } from "@/components/map/map-legend";
import { CATEGORIES } from "@/data/categories";
import { useReports } from "@/hooks/queries/use-reports";
import { formatNumber } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";

/** Bloque destacado del mapa en el home (mismo lenguaje visual del mapa completo). */
export const HomeMapHighlight = () => {
  const { data: reports = [], isLoading } = useReports();
  const topCategories = CATEGORIES.filter((category) =>
    ["basuras", "vias", "alumbrado", "agua", "parques", "movilidad"].includes(category.id),
  ).map((category) => category.id);

  return (
    <section className="section-y bg-gradient-tint" aria-labelledby="mapa-destacado-title">
      <div className="container-page grid gap-8 lg:grid-cols-[minmax(0,34%)_minmax(0,66%)] lg:items-center">
        <div className="space-y-5">
          <p className="eyebrow">El Mapa de Montería</p>
          <h2
            id="mapa-destacado-title"
            className="text-[30px] leading-[1.02] text-primary-deep sm:text-[38px]"
          >
            Lo que vemos.
            <br />
            Lo que vivimos.
          </h2>
          <p className="text-[26px] leading-tight sm:text-[30px]">
            <BrushHighlight>
              <span className="script-accent">Lo que podemos mejorar.</span>
            </BrushHighlight>
          </p>
          <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground">
            Explora los reportes ciudadanos, identifica los principales temas y conoce qué está
            pasando en cada zona de la ciudad.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="sun" size="lg">
              <Link to="/mapa">
                <MapPin className="h-4 w-4" aria-hidden />
                Explorar el mapa de Montería
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="ghostBrand" size="lg">
              <Link to="/sobre-la-plataforma#como-funciona">
                <SlidersHorizontal className="h-4 w-4" aria-hidden />
                Ver cómo funciona
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="relative h-[340px] overflow-hidden rounded-[2rem] border border-border/70 bg-background shadow-card sm:h-[420px]">
            {isLoading ? (
              <Skeleton className="h-full w-full rounded-none" />
            ) : (
              <MapCanvas reports={reports} interactive={false} showControls={false} />
            )}

            <div className="pointer-events-none absolute bottom-4 left-4 rounded-2xl bg-background/95 px-4 py-2.5 shadow-card backdrop-blur">
              <p className="text-[12px] font-bold text-primary-deep">
                {formatNumber(reports.length)} reportes en esta zona
              </p>
            </div>
            <div className="pointer-events-none absolute bottom-4 right-4 rounded-2xl bg-primary px-4 py-2.5 shadow-card">
              <p className="text-[12px] font-bold text-primary-foreground">Ver mapa completo →</p>
            </div>
          </div>

          <MapLegend
            categories={topCategories}
            className="mt-4 w-fit max-w-full"
          />
        </div>
      </div>
    </section>
  );
};
