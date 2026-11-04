import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INITIATIVE_THEME_LABEL, INITIATIVE_TYPE_LABEL } from "@/data/initiatives.mock";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Initiative } from "@/types";

const STATUS_CLASS: Record<Initiative["status"], string> = {
  abierta: "bg-status-ejecucion/10 text-status-ejecucion",
  proxima: "bg-status-revision/15 text-status-revision",
  "en-curso": "bg-primary/10 text-primary",
  finalizada: "bg-status-resuelto/10 text-status-resuelto",
};

const STATUS_LABEL: Record<Initiative["status"], string> = {
  abierta: "Inscripciones abiertas",
  proxima: "Próximamente",
  "en-curso": "En curso",
  finalizada: "Finalizada",
};

interface InitiativeCardProps {
  initiative: Initiative;
  onJoin?: (initiative: Initiative) => void;
  className?: string;
}

/** Card de reto, voluntariado, convocatoria o actividad (Montería Hace). */
export const InitiativeCard = ({ initiative, onJoin, className }: InitiativeCardProps) => (
  <article
    className={cn(
      "group flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-all duration-300 ease-spring hover:-translate-y-1 hover:shadow-card",
      className,
    )}
  >
    <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
      <img
        src={initiative.image}
        alt={initiative.title}
        crossOrigin="anonymous"
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 ease-spring group-hover:scale-105"
      />
      <span
        className={cn(
          "absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide backdrop-blur",
          STATUS_CLASS[initiative.status],
        )}
      >
        {STATUS_LABEL[initiative.status]}
      </span>
      <span className="absolute right-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
        {INITIATIVE_TYPE_LABEL[initiative.type]}
      </span>
    </div>

    <div className="flex flex-1 flex-col gap-3 p-5">
      <Badge variant="sun" className="w-fit">
        {INITIATIVE_THEME_LABEL[initiative.theme]}
      </Badge>
      <h3 className="font-display text-[17px] leading-tight text-primary-deep">
        {initiative.title}
      </h3>
      <p className="line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">
        {initiative.description}
      </p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-semibold text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5 text-primary" aria-hidden />
          {formatDate(initiative.date, { day: undefined, month: "long" })}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden />
          {initiative.place}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-primary" aria-hidden />
          {initiative.participants} inscritos
        </span>
      </div>

      <p className="text-[12px] text-muted-foreground">Organiza: {initiative.organizer}</p>

      <Button
        variant={initiative.status === "finalizada" ? "ghostBrand" : "sun"}
        size="sm"
        className="mt-auto w-full"
        onClick={() => onJoin?.(initiative)}
        disabled={initiative.status === "finalizada"}
      >
        {initiative.status === "finalizada" ? "Ver resultados" : "Quiero participar"}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Button>
    </div>
  </article>
);
