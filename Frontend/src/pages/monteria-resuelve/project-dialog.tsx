import { ArrowRight, CheckCircle2, Lightbulb, Target, Users, Wrench } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressMeter } from "@/components/common/progress-meter";
import { Timeline } from "@/components/common/timeline";
import { ImageGallery } from "@/components/common/image-gallery";
import { PROJECT_STATUS_LABEL } from "@/data/projects.mock";
import { formatDate } from "@/lib/format";
import type { Project } from "@/types";

interface ProjectDialogProps {
  project: Project | null;
  onOpenChange: (open: boolean) => void;
}

/** Detalle del proyecto: problema → acción → avance → resultados. */
export const ProjectDialog = ({ project, onOpenChange }: ProjectDialogProps) => (
  <Dialog open={Boolean(project)} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto rounded-3xl border-border/70 p-0">
      {project ? (
        <>
          <div className="relative h-52 w-full overflow-hidden rounded-t-3xl bg-muted">
            <img
              src={project.image}
              alt={project.title}
              crossOrigin="anonymous"
              className="h-full w-full object-cover"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-primary-deep/80 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5">
              <DialogTitle className="font-display text-[22px] leading-tight text-background">
                {project.title}
              </DialogTitle>
              <DialogDescription className="text-[13px] text-background/85">
                Barrio {project.barrio} · {project.comuna} · {PROJECT_STATUS_LABEL[project.status]}
              </DialogDescription>
            </div>
          </div>

          <div className="space-y-6 p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-tint/70 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  Progreso
                </p>
                <ProgressMeter value={project.progress} showValue className="mt-2" />
              </div>
              <div className="rounded-2xl bg-tint/70 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  Ciudadanos participantes
                </p>
                <p className="mt-1 inline-flex items-center gap-2 font-display text-[22px] text-primary-deep">
                  <Users className="h-4 w-4 text-primary" aria-hidden />
                  {project.participants}
                </p>
              </div>
              <div className="rounded-2xl bg-tint/70 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  Reportes vinculados
                </p>
                <p className="mt-1 font-display text-[22px] text-primary-deep">
                  {project.reportsLinked}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 rounded-2xl border border-border/70 p-4">
                <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-signal">
                  <Target className="h-4 w-4" aria-hidden />
                  Problema identificado
                </p>
                <p className="text-[13.5px] leading-relaxed text-foreground/80">{project.problem}</p>
              </div>
              <div className="space-y-2 rounded-2xl border border-border/70 p-4">
                <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-primary">
                  <Wrench className="h-4 w-4" aria-hidden />
                  Acción en marcha
                </p>
                <p className="text-[13.5px] leading-relaxed text-foreground/80">{project.action}</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 font-display text-[15px] text-primary-deep">
                <Lightbulb className="h-4 w-4 text-accent" aria-hidden />
                Avance del proyecto
              </p>
              <Timeline
                items={project.milestones.map((milestone) => ({
                  label: milestone.label,
                  date: milestone.date,
                  done: milestone.done,
                }))}
              />
            </div>

            <ImageGallery images={project.gallery} title={project.title} />

            <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-tint/60 p-4">
              <p className="text-[12px] font-bold uppercase tracking-wide text-muted-foreground">
                Aliados
              </p>
              {project.allies.map((ally) => (
                <Badge key={ally} variant="tint" className="normal-case tracking-normal">
                  {ally}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-[12.5px] text-muted-foreground">
              <span>Inicio: {formatDate(project.startDate)}</span>
              {project.endDate ? <span>Meta: {formatDate(project.endDate)}</span> : null}
              <span>Inversión: {project.budget}</span>
            </div>

            <Button variant="sun" size="lg" className="w-full" onClick={() => onOpenChange(false)}>
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Seguir este proyecto
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </>
      ) : null}
    </DialogContent>
  </Dialog>
);
