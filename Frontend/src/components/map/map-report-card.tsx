import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { CategoryBadge } from "@/components/common/category-badge";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Report } from "@/types";

interface MapReportCardProps {
  report: Report;
  onClose?: () => void;
  className?: string;
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });

/** Card flotante de un reporte seleccionado en el mapa. */
export const MapReportCard = ({ report, onClose, className }: MapReportCardProps) => (
  <article
    className={cn(
      "w-full overflow-hidden rounded-3xl border border-border/70 bg-background shadow-elevated",
      className,
    )}
  >
    <div className="relative h-36 w-full overflow-hidden bg-muted">
      {report.photos[0] ? (
        <img
          src={report.photos[0]}
          alt={report.title}
          crossOrigin="anonymous"
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : null}
      <div className="absolute left-3 top-3 flex gap-2">
        <StatusBadge status={report.status} className="bg-background/90 backdrop-blur" />
      </div>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar detalle del reporte"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-primary-deep transition-colors hover:bg-background"
        >
          ×
        </button>
      ) : null}
    </div>

    <div className="space-y-3 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <CategoryBadge category={report.category} />
        <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          {report.caseNumber}
        </span>
      </div>
      <h3 className="font-display text-[16px] leading-tight text-primary-deep">{report.title}</h3>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden />
          {report.barrio} · {report.comuna}
        </span>
        <span>{formatDate(report.createdAt)}</span>
      </div>
      <Button asChild variant="outlineBrand" size="sm" className="w-full">
        <Link to={`/reportes/${report.id}`}>
          Ver reporte
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </Button>
    </div>
  </article>
);
