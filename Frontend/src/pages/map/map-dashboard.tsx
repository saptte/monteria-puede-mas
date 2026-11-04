import { ArrowRight, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/common/reveal";
import { SectionHeader } from "@/components/common/section-header";
import { KpiStrip } from "@/components/common/kpi-strip";
import { TopicChipsRow } from "@/components/common/topic-chips-row";
import { ReportCard } from "@/components/citizen-reports/report-card";
import { Skeleton } from "@/components/ui/skeleton";
import { CATEGORY_ICONS, CATEGORY_MAP } from "@/data/categories";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import type { Report, ReportCategoryId, TopicStat, ZoneStat } from "@/types";
import type { Stat } from "@/types";

interface MapDashboardProps {
  stats: Stat[];
  statsLoading: boolean;
  zones: ZoneStat[];
  topics: TopicStat[];
  weeklyTopics: { category: ReportCategoryId; reports: number; share: number }[];
  latestReports: Report[];
  reportsLoading: boolean;
  onSelectTopic: (category: ReportCategoryId) => void;
  onSeeAllTopics: () => void;
}

/** Indicadores y análisis del mapa: KPIs, temas y detalle por zona. */
export const MapDashboard = ({
  stats,
  statsLoading,
  zones,
  topics,
  weeklyTopics,
  latestReports,
  reportsLoading,
  onSelectTopic,
  onSeeAllTopics,
}: MapDashboardProps) => {
  const maxZone = Math.max(...zones.map((zone) => zone.reports), 1);

  return (
    <section className="section-y bg-background" aria-labelledby="mapa-indicadores">
      <div className="container-page space-y-10">
        <KpiStrip stats={stats} loading={statsLoading} />

        <div className="space-y-5">
          <Reveal>
            <SectionHeader
              eyebrow="Temas más reportados esta semana"
              title={<span id="mapa-indicadores">Lo que la ciudadanía está reportando</span>}
              description="Selecciona un tema para filtrar el mapa al instante."
            />
          </Reveal>
          <TopicChipsRow topics={weeklyTopics} onSelect={onSelectTopic} onSeeAll={onSeeAllTopics} />
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <Reveal className="h-full">
            <article className="card-soft flex h-full flex-col gap-5 p-6">
              <h3 className="font-display text-[17px] text-primary-deep">Zonas con más reportes</h3>
              <ol className="space-y-4">
                {zones.map((zone, index) => (
                  <li key={zone.name} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="w-4 font-display text-[13px] text-primary/60">{index + 1}</span>
                      <span className="flex-1 text-[13.5px] font-semibold text-foreground/85">
                        {zone.name}
                      </span>
                      <span className="font-display text-[15px] text-primary-deep">
                        {zone.reports}
                      </span>
                    </div>
                    <div className="ml-7 h-2 overflow-hidden rounded-full bg-primary/10">
                      <span
                        className={cn("block h-full rounded-full", zone.colorClass)}
                        style={{ width: `${Math.round((zone.reports / maxZone) * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-auto text-[12px] text-muted-foreground">
                Conteo de reportes ciudadanos por barrio y comuna.
              </p>
            </article>
          </Reveal>

          <Reveal delay={0.06} className="h-full">
            <article className="card-soft flex h-full flex-col gap-5 p-6">
              <h3 className="font-display text-[17px] text-primary-deep">Temas más reportados</h3>
              <ul className="space-y-4">
                {topics.map((topic) => {
                  const meta = CATEGORY_MAP[topic.category];
                  const Icon = CATEGORY_ICONS[topic.category];
                  if (!meta || !Icon) return null;
                  return (
                    <li key={topic.category} className="flex items-center gap-3">
                      <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", meta.iconBgClass)}>
                        <Icon className="h-[18px] w-[18px]" aria-hidden />
                      </span>
                      <span className="flex-1 text-[13.5px] font-semibold text-foreground/85">
                        {meta.short}
                      </span>
                      <span className="font-display text-[15px] text-primary-deep">{topic.share}%</span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-auto flex items-center gap-2 text-[12px] text-muted-foreground">
                <BarChart3 className="h-4 w-4 text-primary" aria-hidden />
                Participación del total de reportes del mes.
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.12} className="h-full">
            <article className="card-soft flex h-full flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-[17px] text-primary-deep">Últimos reportes</h3>
                <Link
                  to="/mapa"
                  className="text-[12px] font-bold text-primary underline-offset-2 hover:underline"
                >
                  Ver todos →
                </Link>
              </div>
              {reportsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-[92px] w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {latestReports.slice(0, 3).map((report) => (
                    <ReportCard key={report.id} report={report} />
                  ))}
                </div>
              )}
              <Button asChild variant="outlineBrand" size="sm" className="mt-auto w-full">
                <Link to="/reportar">
                  Reportar un problema
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </article>
          </Reveal>
        </div>

        <p className="text-center text-[12.5px] text-muted-foreground">
          Datos ciudadanos actualizados en tiempo real · {formatNumber(1307)} reportes históricos
          procesados por Montería Puede Más.
        </p>
      </div>
    </section>
  );
};
