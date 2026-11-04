import { CATEGORY_ICONS, CATEGORY_MAP } from "@/data/categories";
import { cn } from "@/lib/utils";
import type { ReportCategoryId } from "@/types";

interface MapLegendProps {
  categories: ReportCategoryId[];
  className?: string;
}

/** Leyenda de colores del mapa, siempre visible para leer los clusters. */
export const MapLegend = ({ categories, className }: MapLegendProps) => (
  <div
    className={cn(
      "flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-border/70 bg-background/95 px-4 py-3 shadow-soft backdrop-blur",
      className,
    )}
    aria-label="Leyenda de categorías del mapa"
  >
    {categories.map((category) => {
      const meta = CATEGORY_MAP[category];
      const Icon = CATEGORY_ICONS[category];
      if (!meta || !Icon) return null;
      return (
        <span key={category} className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-foreground/80">
          <span className={cn("h-2.5 w-2.5 rounded-full", meta.colorClass.replace("text-", "bg-"))} aria-hidden />
          {meta.short}
        </span>
      );
    })}
  </div>
);
