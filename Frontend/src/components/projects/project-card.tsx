import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressMeter } from "@/components/common/progress-meter";
import { PROJECT_STATUS_LABEL } from "@/data/projects.mock";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

const STATUS_VARIANT: Record<Project["status"], string> = {
  identificado: "bg-status-recibido/10 text-status-recibido",
  "en-planeacion": "bg-status-revision/15 text-status-revision",
  "en-ejecucion": "bg-status-ejecucion/10 text-status-ejecucion",
  resuelto: "bg-status-resuelto/10 text-status-resuelto",
};

interface ProjectCardProps {
  project: Project;
  className?: string;
  onOpen?: () => void;
}

/** Card de proyecto: problema, acción, estado, progreso y participantes. */
export const ProjectCard = ({ project, className, onOpen }: ProjectCardProps) => (
  <article
    className={cn(
      "group flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-all duration-300 ease-spring hover:-translate-y-1 hover:shadow-card",
      className,
    )}
  >
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
      <img
        src={project.image}
        alt={project.title}
        crossOrigin="anonymous"
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 ease-spring group-hover:scale-105"
      />
      <span
        className={cn(
          "absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide backdrop-blur",
          STATUS_VARIANT[project.status],
        )}
      >
        {PROJECT_STATUS_LABEL[project.status]}
      </span>
    </div>

    <div className="flex flex-1 flex-col gap-3 p-5">
      <div className="space-y-1">
        <h3 className="font-display text-[17px] leading-tight text-primary-deep">{project.title}</h3>
        <p className="inline-flex items-center gap-1 text-[12px] font-semibold text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden />
          Barrio {project.barrio} · {project.comuna}
        </p>
      </div>

      <dl className="space-y-2 text-[13px]">
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            Problema identificado
          </dt>
          <dd className="line-clamp-2 text-foreground/80">{project.problem}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            Acción
          </dt>
          <dd className="line-clamp-2 text-foreground/80">{project.action}</dd>
        </div>
      </dl>

      <ProgressMeter
        value={project.progress}
        label="Avance del proyecto"
        showValue
        className="mt-auto pt-1"
      />

      <div className="flex items-center justify-between gap-3 pt-1">
        <Badge variant="tint" className="gap-1.5 normal-case tracking-normal">
          <Users className="h-3.5 w-3.5" aria-hidden />
          {project.participants} ciudadanos
        </Badge>
        <Button variant="ghostBrand" size="sm" onClick={onOpen} asChild={!onOpen}>
          {onOpen ? (
            <>
              Ver proyecto
              <ArrowRight className="h-4 w-4" aria-hidden />
            </>
          ) : (
            <Link to={`/monteria-resuelve#${project.id}`}>
              Ver proyecto
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
        </Button>
      </div>
    </div>
  </article>
);
