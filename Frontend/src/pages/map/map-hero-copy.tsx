import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrushHighlight } from "@/components/common/brush-highlight";
import { VideoCta } from "@/components/common/video-cta";
import { formatNumber } from "@/lib/format";

interface MapHeroCopyProps {
  totalReports: number;
}

/** Bloque izquierdo del mapa: titular, indicador y accesos ciudadanos. */
export const MapHeroCopy = ({ totalReports }: MapHeroCopyProps) => (
  <div className="space-y-5">
    <p className="eyebrow">El Mapa de Montería</p>
    <h1 className="text-[30px] leading-[1.02] text-primary-deep sm:text-[36px]">
      Lo que vemos.
      <br />
      Lo que vivimos.
    </h1>
    <p className="text-[24px] leading-tight sm:text-[27px]">
      <BrushHighlight>
        <span className="script-accent">Lo que podemos mejorar.</span>
      </BrushHighlight>
    </p>
    <p className="text-[14.5px] leading-relaxed text-muted-foreground">
      Explora los reportes ciudadanos, identifica los principales temas y conoce qué está pasando en
      cada zona de la ciudad.
    </p>

    <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-soft">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-tint text-primary">
        <MapPin className="h-5 w-5" aria-hidden />
      </span>
      <div>
        <p className="font-display text-[22px] leading-none text-primary-deep">
          {formatNumber(totalReports)}
        </p>
        <p className="text-[12px] font-semibold text-muted-foreground">reportes en el mapa</p>
      </div>
    </div>

    <Button asChild variant="brand" size="lg" className="w-full sm:w-auto">
      <Link to="/reportar">
        <Plus className="h-4 w-4" aria-hidden />
        Reporta en el mapa
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </Button>

    <VideoCta label="¿Cómo usar el mapa?" />
  </div>
);
