import { useMemo, useState } from "react";
import { ArrowRight, Handshake, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/common/page-hero";
import { SectionHeader } from "@/components/common/section-header";
import { Reveal } from "@/components/common/reveal";
import { FilterChip } from "@/components/common/filter-chip";
import { SearchBar } from "@/components/common/search-bar";
import { EmptyState } from "@/components/common/empty-state";
import { InstitutionalBanner } from "@/components/common/institutional-banner";
import { InitiativeCard } from "@/components/initiatives/initiative-card";
import { Skeleton } from "@/components/ui/skeleton";
import { MEDIA } from "@/data/media";
import { INITIATIVE_THEME_LABEL, INITIATIVE_TYPE_LABEL } from "@/data/initiatives.mock";
import { useInitiatives } from "@/hooks/queries/use-content";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import type { Initiative, InitiativeTheme, InitiativeType } from "@/types";

const THEME_FILTERS: (InitiativeTheme | "todos")[] = [
  "todos",
  "ambiental",
  "social",
  "cultura",
  "movilidad",
  "emprendimiento",
  "juventud",
];

const TYPE_FILTERS: (InitiativeType | "todos")[] = [
  "todos",
  "reto",
  "voluntariado",
  "convocatoria",
  "actividad",
  "proyecto",
];

/** Montería Hace: retos, voluntariados, convocatorias y actividades. */
const MonteriaHace = () => {
  const [theme, setTheme] = useState<InitiativeTheme | "todos">("todos");
  const [type, setType] = useState<InitiativeType | "todos">("todos");
  const [query, setQuery] = useState("");
  const { isAuthenticated, openAuth } = useAuth();
  const { toast } = useToast();

  const filters = useMemo(
    () => ({
      themes: theme === "todos" ? undefined : [theme],
      types: type === "todos" ? undefined : [type],
      query: query || undefined,
    }),
    [query, theme, type],
  );

  const { data: initiatives = [], isLoading } = useInitiatives(filters);

  const handleJoin = (initiative: Initiative) => {
    if (!isAuthenticated) {
      openAuth("register");
      return;
    }
    toast({
      title: "Inscripción registrada",
      description: `Te enviamos los detalles de “${initiative.title}” al correo de tu cuenta.`,
    });
  };

  const handleSumate = () => {
    if (isAuthenticated) {
      toast({
        title: "Elige una iniciativa",
        description: "Inscríbete en el reto, voluntariado o convocatoria que más te guste.",
      });
      return;
    }
    openAuth("register");
  };

  return (
    <>
      <PageHero
        eyebrow="Montería Hace"
        title={
          <>
            Las buenas ideas
            <br />
            se hacen realidad.
          </>
        }
        accent="Y se hacen con la gente."
        description="Retos ciudadanos, voluntariados, convocatorias y actividades para pasar de la idea a la acción. Súmate a lo que ya está transformando barrios de Montería."
        image={MEDIA.parqueBarrio}
        imageAlt="Parque de barrio recuperado en Montería"
      >
        <Button variant="sun" size="xl" onClick={handleSumate}>
          Quiero sumarme
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
        <Button variant="outlineBrand" size="xl" asChild>
          <a href="#iniciativas">
            Ver iniciativas abiertas
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </Button>
      </PageHero>

      <section className="section-y bg-background" aria-labelledby="iniciativas-title">
        <div className="container-page space-y-8">
          <Reveal>
            <SectionHeader
              eyebrow="Iniciativas ciudadanas"
              title={<span id="iniciativas-title">Formas concretas de participar</span>}
              description="Filtra por temática y tipo de iniciativa para encontrar dónde puedes aportar hoy."
            />
          </Reveal>

          <div className="space-y-4">
            <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
              {THEME_FILTERS.map((filter) => (
                <FilterChip key={filter} active={theme === filter} onClick={() => setTheme(filter)}>
                  {filter === "todos" ? "Todos" : INITIATIVE_THEME_LABEL[filter]}
                </FilterChip>
              ))}
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
                {TYPE_FILTERS.map((filter) => (
                  <FilterChip
                    key={filter}
                    active={type === filter}
                    onClick={() => setType(filter)}
                    className="border-dashed"
                  >
                    {filter === "todos" ? "Todos los tipos" : INITIATIVE_TYPE_LABEL[filter]}
                  </FilterChip>
                ))}
              </div>
              <SearchBar
                value={query}
                onChange={setQuery}
                placeholder="Buscar iniciativa"
                ariaLabel="Buscar iniciativas ciudadanas"
                className="lg:w-80"
              />
            </div>
          </div>

          <div id="iniciativas">
            {isLoading ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-[430px] w-full" />
                ))}
              </div>
            ) : initiatives.length ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {initiatives.map((initiative, index) => (
                  <Reveal key={initiative.id} delay={index * 0.05} className="h-full">
                    <InitiativeCard initiative={initiative} onJoin={handleJoin} className="h-full" />
                  </Reveal>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No hay iniciativas con esos filtros"
                description="Prueba con otra temática o tipo de iniciativa para ver todo lo que está pasando en Montería."
                action={{
                  label: "Limpiar filtros",
                  onClick: () => {
                    setTheme("todos");
                    setType("todos");
                    setQuery("");
                  },
                }}
              />
            )}
          </div>
        </div>
      </section>

      <section className="pb-16 bg-gradient-tint" aria-label="Impacto de la colaboración">
        <div className="container-page grid gap-4 pt-14 md:grid-cols-3">
          {[
            {
              value: "1.842",
              label: "personas participando",
              description: "Vecinos, colectivos, empresas y universidades.",
              icon: Users,
            },
            {
              value: "328",
              label: "ideas convertidas en propuestas",
              description: "Ideas ciudadanas con acompañamiento técnico.",
              icon: Heart,
            },
            {
              value: "48",
              label: "aliados activos",
              description: "Organizaciones que hacen posible cada proyecto.",
              icon: Handshake,
            },
          ].map((item, index) => (
            <Reveal key={item.label} delay={index * 0.06}>
              <div className="flex h-full items-start gap-4 rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-tint text-primary">
                  <item.icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="font-display text-[28px] leading-none text-primary-deep">
                    {item.value}
                  </p>
                  <p className="text-[13px] font-bold text-primary">{item.label}</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <InstitutionalBanner onPrimary={handleSumate} primaryLabel="Quiero hacer parte" />
    </>
  );
};

export default MonteriaHace;
