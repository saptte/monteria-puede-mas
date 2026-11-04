import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Heart,
  MapPin,
  Share2,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { CategoryBadge } from "@/components/common/category-badge";
import { StatusBadge } from "@/components/common/status-badge";
import { ImageGallery } from "@/components/common/image-gallery";
import { ReportTimeline } from "@/components/citizen-reports/report-timeline";
import { ReportCard } from "@/components/citizen-reports/report-card";
import { UsefulnessFeedback } from "@/components/citizen-reports/usefulness-feedback";
import { MapCanvas } from "@/components/map/map-canvas";
import { useRelatedReports, useReport, useSupportReport } from "@/hooks/queries/use-reports";
import { useToast } from "@/hooks/use-toast";
import { formatDate, timeAgo } from "@/lib/format";

/** Detalle del reporte: número de caso, estado, evidencia y timeline. */
const ReportDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: report, isLoading } = useReport(id);
  const { data: related = [] } = useRelatedReports(id);
  const support = useSupportReport();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="container-page space-y-4 py-10">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-14 w-full max-w-2xl" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,64%)_minmax(0,36%)]">
          <Skeleton className="h-[320px] w-full" />
          <Skeleton className="h-[320px] w-full" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container-page py-16">
        <EmptyState
          title="No encontramos este reporte"
          description="El caso puede haber sido retirado o el número de reporte no existe. Vuelve al mapa para explorar los reportes ciudadanos."
          action={{ label: "Volver al mapa", onClick: () => undefined }}
        />
        <div className="mt-6 flex justify-center">
          <Button asChild variant="sun" size="lg">
            <Link to="/mapa">
              Ir al mapa de Montería
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-tint pb-16">
      <div className="container-page py-8">
        <Link
          to="/mapa"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Volver al mapa
        </Link>

        <header className="mt-5 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={report.status} />
            <CategoryBadge category={report.category} />
            <span className="text-[11.5px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Caso {report.caseNumber}
            </span>
          </div>
          <h1 className="max-w-3xl text-[28px] leading-tight text-primary-deep sm:text-[38px]">
            {report.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" aria-hidden />
              Barrio {report.barrio} · {report.comuna} · {report.address}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-4 w-4 text-primary" aria-hidden />
              {timeAgo(report.createdAt)} · {formatDate(report.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UserRound className="h-4 w-4 text-primary" aria-hidden />
              Reporte ciudadano
            </span>
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,64%)_minmax(0,36%)] lg:items-start">
          <div className="space-y-6">
            <ImageGallery images={report.photos} title={report.title} />

            <section className="card-soft space-y-3 p-6" aria-labelledby="descripcion-title">
              <h2 id="descripcion-title" className="font-display text-[17px] text-primary-deep">
                Descripción del reporte
              </h2>
              <p className="text-[14.5px] leading-relaxed text-foreground/80">
                {report.description}
              </p>
            </section>

            <section className="card-soft space-y-3 p-6" aria-labelledby="ubicacion-title">
              <h2 id="ubicacion-title" className="font-display text-[17px] text-primary-deep">
                Ubicación
              </h2>
              <div className="h-[280px] overflow-hidden rounded-2xl border border-border/70">
                <MapCanvas
                  reports={[report]}
                  mode="single"
                  interactive={false}
                  showControls={false}
                  center={report.coords}
                  zoom={16}
                />
              </div>
              <p className="text-[12.5px] text-muted-foreground">
                Coordenadas: {report.coords.lat.toFixed(5)}, {report.coords.lng.toFixed(5)}
              </p>
            </section>

            {report.officialResponse ? (
              <section
                className="card-soft space-y-3 border-l-4 border-l-status-resuelto p-6"
                aria-labelledby="respuesta-title"
              >
                <h2 id="respuesta-title" className="inline-flex items-center gap-2 font-display text-[17px] text-primary-deep">
                  <CheckCircle2 className="h-5 w-5 text-status-resuelto" aria-hidden />
                  Respuesta de Montería Puede Más
                </h2>
                <p className="text-[14.5px] leading-relaxed text-foreground/80">
                  {report.officialResponse}
                </p>
              </section>
            ) : null}

            <UsefulnessFeedback caseNumber={report.caseNumber} />

            {related.length ? (
              <section className="space-y-4" aria-labelledby="relacionados-title">
                <h2 id="relacionados-title" className="font-display text-[17px] text-primary-deep">
                  Reportes relacionados
                </h2>
                <div className="space-y-3">
                  {related.map((item) => (
                    <ReportCard key={item.id} report={item} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className="card-soft space-y-4 p-6">
              <h2 className="font-display text-[17px] text-primary-deep">Ficha del caso</h2>
              <dl className="space-y-3 text-[13.5px]">
                {[
                  { label: "Número de caso", value: report.caseNumber },
                  { label: "Estado", value: <StatusBadge status={report.status} /> },
                  { label: "Tema", value: <CategoryBadge category={report.category} /> },
                  { label: "Barrio", value: report.barrio },
                  { label: "Comuna", value: report.comuna },
                  { label: "Fecha", value: formatDate(report.createdAt) },
                  { label: "Última actualización", value: timeAgo(report.updatedAt) },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-3 border-b border-border/60 pb-2 last:border-none last:pb-0">
                    <dt className="text-[12px] font-bold uppercase tracking-wide text-muted-foreground">
                      {row.label}
                    </dt>
                    <dd className="text-right font-semibold text-foreground/85">{row.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="flex flex-col gap-2">
                <Button
                  variant="sun"
                  onClick={() => {
                    support.mutate(report.id);
                    toast({
                      title: "Apoyaste este reporte",
                      description: `El caso ${report.caseNumber} ahora suma más respaldo ciudadano.`,
                    });
                  }}
                >
                  <Heart className="h-4 w-4" aria-hidden />
                  Apoyar este reporte ({report.supports})
                </Button>
                <Button
                  variant="outlineBrand"
                  onClick={() =>
                    toast({
                      title: "Enlace del reporte copiado",
                      description: "Compártelo con tus vecinos para sumar apoyos.",
                    })
                  }
                >
                  <Share2 className="h-4 w-4" aria-hidden />
                  Compartir
                </Button>
              </div>
            </div>

            <div className="card-soft p-6">
              <h2 className="mb-4 font-display text-[17px] text-primary-deep">
                Seguimiento del caso
              </h2>
              <ReportTimeline report={report} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailPage;
