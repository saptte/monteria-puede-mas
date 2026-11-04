import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ClipboardList, Lightbulb, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/common/page-hero";
import { SectionHeader } from "@/components/common/section-header";
import { Reveal } from "@/components/common/reveal";
import { FilterChip } from "@/components/common/filter-chip";
import { InstitutionalBanner } from "@/components/common/institutional-banner";
import { ProjectCard } from "@/components/projects/project-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProgressMeter } from "@/components/common/progress-meter";
import { ProjectDialog } from "./project-dialog";
import { MEDIA } from "@/data/media";
import { PROJECT_STATUS_LABEL } from "@/data/projects.mock";
import { RESPONSE_BREAKDOWN } from "@/data/stats.mock";
import { useProjects } from "@/hooks/queries/use-content";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Project, ProjectStatus } from "@/types";

const FLOW = [
  {
    title: "Problemas identificados",
    description: "La ciudadanía reporta y prioriza lo que necesita su barrio.",
    icon: Target,
  },
  {
    title: "Acciones",
    description: "Se acuerdan respuestas con la comunidad, aliados y la administración.",
    icon: ClipboardList,
  },
  {
    title: "Proyectos",
    description: "Las acciones se convierten en planes, pilotos y obras con seguimiento.",
    icon: Lightbulb,
  },
  {
    title: "Resultados",
    description: "Cada avance se verifica con la comunidad y se publica en la plataforma.",
    icon: TrendingUp,
  },
];

const STATUS_FILTERS: { id: ProjectStatus | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "identificado", label: PROJECT_STATUS_LABEL.identificado },
  { id: "en-planeacion", label: PROJECT_STATUS_LABEL["en-planeacion"] },
  { id: "en-ejecucion", label: PROJECT_STATUS_LABEL["en-ejecucion"] },
  { id: "resuelto", label: PROJECT_STATUS_LABEL.resuelto },
];

/** Montería Resuelve: de la conversación a la acción. */
const MonteriaResuelve = () => {
  const [status, setStatus] = useState<ProjectStatus | "todos">("todos");
  const [selected, setSelected] = useState<Project | null>(null);
  const { data: projects = [], isLoading } = useProjects(
    status === "todos" ? undefined : { status: [status] },
  );
  const { isAuthenticated, openAuth } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSumate = () => {
    if (isAuthenticated) {
      toast({
        title: "Ya haces parte",
        description: "Te avisaremos de nuevas convocatorias y proyectos en tu barrio.",
      });
      return;
    }
    openAuth("register");
  };

  return (
    <>
      <PageHero
        eyebrow="Montería Resuelve"
        title={
          <>
            De la conversación
            <br />
            a la acción…
          </>
        }
        accent="Una Montería que resuelve."
        description="Pasamos de las ideas a los resultados. Aquí los problemas se convierten en planes, pilotos y soluciones concretas, con la participación de la gente, aliados y la administración."
        image={MEDIA.rondaSinu}
        imageAlt="Ronda del Sinú en Montería"
      >
        <Button variant="sun" size="xl" onClick={() => navigate("#proyectos")}>
          Ver proyectos en acción
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
        <Button variant="outlineBrand" size="xl" onClick={handleSumate}>
          Quiero sumarme
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </PageHero>

      <section className="section-y bg-background" aria-labelledby="flujo-title">
        <div className="container-page space-y-10">
          <Reveal>
            <SectionHeader
              eyebrow="Cómo resolvemos"
              title={<span id="flujo-title">Un camino claro, con resultados visibles</span>}
              description="Cada reporte ciudadano recorre el mismo camino hasta convertirse en una solución verificada."
            />
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {FLOW.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.07} className="h-full">
                <div className="relative flex h-full flex-col gap-3 rounded-3xl border border-border/70 bg-card p-5 shadow-soft">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tint text-primary">
                    <step.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/60">
                    Paso {index + 1}
                  </p>
                  <h3 className="font-display text-[16px] leading-tight text-primary-deep">
                    {step.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                  {index < FLOW.length - 1 ? (
                    <ArrowRight
                      className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-primary/30 lg:block"
                      aria-hidden
                    />
                  ) : null}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="proyectos" className="section-y bg-gradient-tint" aria-labelledby="proyectos-title">
        <div className="container-page space-y-8">
          <Reveal>
            <SectionHeader
              eyebrow="Proyectos en acción"
              title={<span id="proyectos-title">Obras y pilotos con seguimiento ciudadano</span>}
              description="Filtra por estado para ver qué está en ejecución, en planeación o ya resuelto."
            />
          </Reveal>

          <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
            {STATUS_FILTERS.map((filter) => (
              <FilterChip
                key={filter.id}
                active={status === filter.id}
                onClick={() => setStatus(filter.id)}
              >
                {filter.label}
              </FilterChip>
            ))}
          </div>

          {isLoading ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-[420px] w-full" />
              ))}
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <Reveal key={project.id} delay={index * 0.05} className="h-full">
                  <ProjectCard
                    project={project}
                    className="h-full"
                    onOpen={() => setSelected(project)}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-y bg-background" aria-labelledby="resultados-title">
        <div className="container-page grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5">
            <SectionHeader
              eyebrow="Resultados"
              title={<span id="resultados-title">Lo que ya cambió en la ciudad</span>}
              description="Distribución de los reportes ciudadanos según el estado de su gestión en la plataforma."
            />
            <ul className="space-y-4">
              {RESPONSE_BREAKDOWN.map((item) => (
                <li key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-[13.5px] font-semibold">
                    <span className="text-foreground/85">{item.label}</span>
                    <span className="font-display text-primary-deep">{item.value}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-primary/10">
                    <span
                      className={cn("block h-full rounded-full", item.colorClass)}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <Reveal className="h-full">
            <div className="card-soft space-y-5 p-6">
              <h3 className="font-display text-[18px] text-primary-deep">
                Caso destacado: parque de La Granja
              </h3>
              <p className="text-[13.5px] leading-relaxed text-muted-foreground">
                El reporte ciudadano por falta de iluminación se convirtió en un proyecto de
                recuperación integral con 147 ciudadanos participantes.
              </p>
              <ProgressMeter value={68} label="Avance de la obra" showValue />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="rounded-2xl bg-tint/70 p-4">
                  <p className="font-display text-[24px] text-primary-deep">38</p>
                  <p className="text-[12px] text-muted-foreground">reportes vinculados</p>
                </div>
                <div className="rounded-2xl bg-tint/70 p-4">
                  <p className="font-display text-[24px] text-primary-deep">147</p>
                  <p className="text-[12px] text-muted-foreground">ciudadanos participantes</p>
                </div>
              </div>
              <Button variant="outlineBrand" size="lg" className="w-full" onClick={() => setSelected(projects[0] ?? null)}>
                Ver el proyecto completo
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <InstitutionalBanner onPrimary={handleSumate} primaryLabel="Quiero sumarme" />

      <ProjectDialog project={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </>
  );
};

export default MonteriaResuelve;
