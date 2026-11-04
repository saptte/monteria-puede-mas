import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "./stat-card";
import { cn } from "@/lib/utils";
import type { Stat } from "@/types";

interface KpiStripProps {
  stats: Stat[];
  loading?: boolean;
  className?: string;
  layout?: "row" | "grid";
}

/**
 * Fila de indicadores en card blanca con separadores.
 * En móvil se desplaza horizontalmente para no romper la lectura.
 */
export const KpiStrip = ({ stats, loading = false, className, layout = "row" }: KpiStripProps) => (
  <div className={cn("card-soft overflow-hidden", className)}>
    {loading ? (
      <div className="flex gap-4 p-6">
        {stats.map((stat) => (
          <Skeleton key={stat.id} className="h-16 flex-1" />
        ))}
      </div>
    ) : (
      <div
        className={cn(
          layout === "row"
            ? "flex flex-col divide-y divide-border/70 md:flex-row md:divide-x md:divide-y-0"
            : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            stat={stat}
            className={cn(layout === "row" && "px-6 py-5 md:flex-1")}
          />
        ))}
      </div>
    )}
  </div>
);
