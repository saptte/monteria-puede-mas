import { ReportCard } from "./report-card";
import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Report } from "@/types";

interface ReportListProps {
  reports: Report[];
  loading?: boolean;
  variant?: "list" | "grid";
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  skeletonCount?: number;
}

/** Listado de reportes con estados de carga y vacío. */
export const ReportList = ({
  reports,
  loading = false,
  variant = "list",
  emptyTitle = "Todavía no hay reportes con estos filtros",
  emptyDescription = "Prueba con otra categoría, cambia de barrio o limpia los filtros para ver todos los reportes de Montería.",
  className,
  skeletonCount = 4,
}: ReportListProps) => {
  if (loading) {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Skeleton key={index} className="h-[100px] w-full" />
        ))}
      </div>
    );
  }

  if (!reports.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} className={className} />;
  }

  return (
    <div
      className={cn(
        variant === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3",
        className,
      )}
    >
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} variant={variant} />
      ))}
    </div>
  );
};
