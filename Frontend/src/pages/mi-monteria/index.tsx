import { Link } from "react-router-dom";
import { LogOut, MapPin, Plus, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { ReportList } from "@/components/citizen-reports/report-list";
import { ProjectCard } from "@/components/projects/project-card";
import { ActivityFeed, CitizenHighlights, ResolvedNotice } from "./citizen-widgets";
import { useAuth } from "@/context/auth-context";
import { useMyReports } from "@/hooks/queries/use-reports";
import {
  useCitizenActivity,
  useCitizenProposals,
  useCitizenSummary,
} from "@/hooks/queries/use-stats";
import { useFollowedProjects } from "@/hooks/queries/use-content";
import { formatDate } from "@/lib/format";

/** Panel del ciudadano: MI MONTERÍA. */
const MiMonteria = () => {
  const { user, isAuthenticated, initializing, openAuth, logout } = useAuth();
  const { data: reports = [], isLoading: reportsLoading } = useMyReports();
  const { data: summary, isLoading: summaryLoading } = useCitizenSummary();
  const { data: activity = [], isLoading: activityLoading } = useCitizenActivity();
  const { data: proposals = [] } = useCitizenProposals();
  const { data: followedProjects = [], isLoading: projectsLoading } = useFollowedProjects(4);

  if (initializing) {
    return (
      <div className="container-page space-y-4 py-12">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-2xl space-y-6">
          <EmptyState
            icon={<UserRound className="h-6 w-6" aria-hidden />}
            title="Inicia sesión para ver tu Montería"
            description="Crea tu cuenta o entra con tu correo para ver tus reportes, propuestas, participaciones y los proyectos que sigues."
            action={{ label: "Iniciar sesión o crear cuenta", onClick: () => openAuth("login") }}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { title: "Tus reportes", description: "Sigue el estado de cada caso." },
              { title: "Tus propuestas", description: "Apoyos y respuestas recibidas." },
              { title: "Tus proyectos", description: "Actualizaciones de lo que sigues." },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-border/70 bg-card p-5 shadow-soft">
                <p className="font-display text-[15px] text-primary-deep">{item.title}</p>
                <p className="text-[12.5px] text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const resolvedReport = reports.find((report) => report.status === "resuelto");

  return (
    <div className="bg-gradient-tint pb-16">
      <div className="container-page py-8">
        <header className="flex flex-col gap-5 rounded-3xl border border-border/70 bg-card p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand font-display text-[20px] text-primary-foreground">
              {user?.firstName.charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="eyebrow">Mi Montería</p>
              <h1 className="text-[26px] leading-tight text-primary-deep sm:text-[32px]">
                Hola, {user?.firstName}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-muted-foreground">
                <span>{user?.email}</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden />
                  {user?.barrio}
                </span>
                <span>En la plataforma desde {formatDate(user?.since ?? "")}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="sun">
              <Link to="/reportar">
                <Plus className="h-4 w-4" aria-hidden />
                Reportar
              </Link>
            </Button>
            <Button variant="outlineBrand" onClick={logout}>
              <LogOut className="h-4 w-4" aria-hidden />
              Cerrar sesión
            </Button>
          </div>
        </header>

        <section className="mt-6" aria-label="Resumen de mi participación">
          {summaryLoading || !summary ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-[190px] w-full" />
              ))}
            </div>
          ) : (
            <CitizenHighlights
              activeReports={summary.activeReports}
              resolvedReports={summary.resolvedReports}
              proposals={summary.proposals}
              conversations={summary.conversations}
              followedProjects={summary.followedProjects}
              supportsReceived={summary.supportsReceived}
            />
          )}
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,66%)_minmax(0,34%)] lg:items-start">
          <div className="space-y-5">
            <Tabs defaultValue="reportes">
              <TabsList className="grid w-full grid-cols-3 rounded-full bg-background p-1 shadow-soft">
                <TabsTrigger
                  value="reportes"
                  className="rounded-full py-2 text-[13px] font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Mis reportes
                </TabsTrigger>
                <TabsTrigger
                  value="propuestas"
                  className="rounded-full py-2 text-[13px] font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Mis propuestas
                </TabsTrigger>
                <TabsTrigger
                  value="actividad"
                  className="rounded-full py-2 text-[13px] font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Actividad
                </TabsTrigger>
              </TabsList>

              <TabsContent value="reportes" className="mt-5 space-y-4">
                {resolvedReport ? <ResolvedNotice caseNumber={resolvedReport.caseNumber} /> : null}
                <ReportList
                  reports={reports}
                  loading={reportsLoading}
                  emptyTitle="Todavía no has reportado nada"
                  emptyDescription="Cuando reportes una situación en tu barrio aparecerá aquí con su número de caso y su seguimiento."
                />
              </TabsContent>

              <TabsContent value="propuestas" className="mt-5">
                {proposals.length ? (
                  <ul className="space-y-3">
                    {proposals.map((proposal) => (
                      <li
                        key={proposal.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-border/70 bg-card p-5 shadow-soft"
                      >
                        <div>
                          <p className="font-display text-[15px] text-primary-deep">
                            {proposal.title}
                          </p>
                          <p className="text-[12.5px] text-muted-foreground">
                            Publicada el {formatDate(proposal.date)} · {proposal.supports} apoyos
                          </p>
                        </div>
                        <Badge variant="tint">{proposal.status}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState
                    title="Aún no tienes propuestas"
                    description="Comparte tu idea en una conversación ciudadana y aparecerá aquí con sus apoyos."
                    action={{ label: "Ir a Montería Habla", onClick: () => undefined }}
                  />
                )}
              </TabsContent>

              <TabsContent value="actividad" className="mt-5">
                {activityLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={index} className="h-[84px] w-full" />
                    ))}
                  </div>
                ) : (
                  <ActivityFeed items={activity} />
                )}
              </TabsContent>
            </Tabs>
          </div>

          <aside className="space-y-5">
            <section className="card-soft space-y-4 p-6" aria-labelledby="proyectos-seguidos">
              <div className="flex items-center justify-between">
                <h2 id="proyectos-seguidos" className="font-display text-[17px] text-primary-deep">
                  Proyectos que sigo
                </h2>
                <Link
                  to="/monteria-resuelve"
                  className="text-[12px] font-bold text-primary hover:underline"
                >
                  Ver todos →
                </Link>
              </div>
              {projectsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <Skeleton key={index} className="h-[120px] w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {followedProjects.slice(0, 2).map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default MiMonteria;
