import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/common/reveal";
import { SectionHeader } from "@/components/common/section-header";
import { KpiStrip } from "@/components/common/kpi-strip";
import { TopicChipsRow } from "@/components/common/topic-chips-row";
import { InstitutionalBanner } from "@/components/common/institutional-banner";
import { ReportList } from "@/components/citizen-reports/report-list";
import { ProjectCard } from "@/components/projects/project-card";
import { ConversationCard } from "@/components/conversations/conversation-card";
import { Skeleton } from "@/components/ui/skeleton";
import { HomeHero } from "./home-hero";
import { HomeEcosystem } from "./home-ecosystem";
// El mapa (Leaflet) se carga sólo cuando la sección está por aparecer.
const HomeMapHighlight = lazy(() =>
  import("./home-map-highlight").then((module) => ({ default: module.HomeMapHighlight })),
);
import { useHomeStats, useWeeklyTopics } from "@/hooks/queries/use-stats";
import { useLatestReports } from "@/hooks/queries/use-reports";
import { useFeaturedProjects } from "@/hooks/queries/use-content";
import { useTrendingConversations } from "@/hooks/queries/use-content";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

/** Home de Montería Puede Más: de la escucha a los resultados. */
const Home = () => {
  const { data: stats = [], isLoading: statsLoading } = useHomeStats();
  const { data: weeklyTopics = [] } = useWeeklyTopics();
  const { data: latestReports = [], isLoading: reportsLoading } = useLatestReports(4);
  const { data: projects = [], isLoading: projectsLoading } = useFeaturedProjects(3);
  const { data: conversations = [], isLoading: conversationsLoading } = useTrendingConversations(3);
  const { isAuthenticated, openAuth } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSumate = () => {
    if (isAuthenticated) {
      navigate("/mi-monteria");
      return;
    }
    openAuth("register");
  };

  const handleJoin = (title: string) => {
    toast({
      title: "Te sumamos a la iniciativa",
      description: `Te avisaremos por correo sobre “${title}”.`,
    });
  };

  return (
    <>
      <HomeHero />

      <section className="pb-4" aria-label="Indicadores de la plataforma">
        <div className="container-page">
          <KpiStrip stats={stats} loading={statsLoading} />
        </div>
      </section>

      <section className="section-y bg-background" aria-labelledby="temas-title">
        <div className="container-page space-y-6">
          <Reveal>
            <SectionHeader
              eyebrow="Temas más reportados esta semana"
              title={<span id="temas-title">¿Qué está reportando la ciudadanía?</span>}
              description="Los temas que más aparecen en el mapa de Montería y el peso que tienen dentro de los reportes ciudadanos."
            />
          </Reveal>
          <Reveal delay={0.05}>
            <TopicChipsRow
              topics={weeklyTopics}
              onSelect={(category) => navigate(`/mapa?tema=${category}`)}
              onSeeAll={() => navigate("/mapa")}
            />
          </Reveal>
        </div>
      </section>

      <HomeEcosystem />

      <Suspense
        fallback={
          <div className="section-y bg-gradient-tint">
            <div className="container-page">
              <Skeleton className="h-[420px] w-full rounded-[2rem]" />
            </div>
          </div>
        }
      >
        <HomeMapHighlight />
      </Suspense>

      <section className="section-y bg-background" aria-labelledby="ultimos-title">
        <div className="container-page space-y-8">
          <Reveal>
            <SectionHeader
              eyebrow="Últimos reportes"
              title={<span id="ultimos-title">Lo que acaba de entrar al mapa</span>}
              description="Cada reporte tiene número de caso, responsable y seguimiento público."
              action={
                <Button asChild variant="outlineBrand" size="lg">
                  <Link to="/mapa">
                    Ver todos los reportes
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              }
            />
          </Reveal>
          <ReportList reports={latestReports} loading={reportsLoading} variant="grid" skeletonCount={3} />
        </div>
      </section>

      <section className="section-y bg-gradient-tint" aria-labelledby="proyectos-title">
        <div className="container-page space-y-8">
          <Reveal>
            <SectionHeader
              eyebrow="Montería Resuelve"
              title={<span id="proyectos-title">De la conversación a la acción</span>}
              description="Problemas identificados con la comunidad que hoy son obras, pilotos y soluciones concretas."
              action={
                <Button asChild variant="sun" size="lg">
                  <Link to="/monteria-resuelve">
                    Ver proyectos en acción
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              }
            />
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projectsLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-[420px] animate-pulse rounded-3xl bg-primary/[0.06]" />
                ))
              : projects.map((project, index) => (
                  <Reveal key={project.id} delay={index * 0.08} className="h-full">
                    <ProjectCard project={project} className="h-full" />
                  </Reveal>
                ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-background" aria-labelledby="habla-title">
        <div className="container-page space-y-8">
          <Reveal>
            <SectionHeader
              eyebrow="Montería Habla"
              title={<span id="habla-title">Conversaciones abiertas de la ciudad</span>}
              description="Vecinos, colectivos y aliados conversando sobre lo que necesita Montería."
              action={
                <Button asChild variant="outlineBrand" size="lg">
                  <Link to="/monteria-habla">
                    Entrar a las conversaciones
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              }
            />
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {conversationsLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-[380px] animate-pulse rounded-3xl bg-primary/[0.06]" />
                ))
              : conversations.map((conversation, index) => (
                  <Reveal key={conversation.id} delay={index * 0.08} className="h-full">
                    <ConversationCard
                      conversation={conversation}
                      onParticipate={(item) => handleJoin(item.question)}
                      className="h-full"
                    />
                  </Reveal>
                ))}
          </div>
        </div>
      </section>

      <section className="pb-16" aria-label="Participación ciudadana">
        <div className="container-page">
          <Reveal>
            <div className="flex flex-col items-start gap-4 rounded-3xl border border-border/70 bg-tint/60 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-background text-primary shadow-soft">
                  <TrendingUp className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="font-display text-[17px] text-primary-deep">
                    La participación creció 42% en los últimos 3 meses
                  </p>
                  <p className="text-[13px] text-muted-foreground">
                    Suma tu voz: cada reporte y cada idea quedan en el mapa de Montería.
                  </p>
                </div>
              </div>
              <Button variant="sun" size="lg" onClick={handleSumate}>
                Súmate ahora
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <InstitutionalBanner onPrimary={handleSumate} />
    </>
  );
};

export default Home;
