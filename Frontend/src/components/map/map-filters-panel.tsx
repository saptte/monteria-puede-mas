import { ArrowRight, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchBar } from "@/components/common/search-bar";
import { CategoryIcon } from "@/components/common/category-badge";
import { CATEGORIES } from "@/data/categories";
import { BARRIO_NAMES } from "@/data/barrios";
import { cn } from "@/lib/utils";
import type { ReportCategoryId } from "@/types";

interface MapFiltersPanelProps {
  selected: ReportCategoryId[];
  counts: Record<string, number>;
  query: string;
  barrio?: string;
  activeCount: number;
  onToggleCategory: (category: ReportCategoryId) => void;
  onQueryChange: (value: string) => void;
  onBarrioChange: (barrio?: string) => void;
  onApply: () => void;
  onClear: () => void;
  className?: string;
  variant?: "panel" | "sheet";
}

/** Panel "Filtrar por tema": categorías con icono, conteo y aplicación. */
export const MapFiltersPanel = ({
  selected,
  counts,
  query,
  barrio,
  activeCount,
  onToggleCategory,
  onQueryChange,
  onBarrioChange,
  onApply,
  onClear,
  className,
  variant = "panel",
}: MapFiltersPanelProps) => (
  <div className={cn("flex h-full min-h-0 flex-1 flex-col gap-4", className)}>
    <div className="flex items-center justify-between gap-2">
      <p className="inline-flex items-center gap-2 font-display text-[15px] text-primary-deep">
        <SlidersHorizontal className="h-4 w-4 text-primary" aria-hidden />
        Filtrar por tema
      </p>
      <button
        type="button"
        onClick={onClear}
        className="text-[12px] font-semibold text-primary underline-offset-2 hover:underline"
      >
        Limpiar filtros
      </button>
    </div>

    <SearchBar
      value={query}
      onChange={onQueryChange}
      placeholder="Barrio, dirección o caso"
      ariaLabel="Buscar reportes en el mapa"
    />

    <div>
      <label htmlFor="map-barrio" className="eyebrow mb-2 block">
        Zona
      </label>
      <select
        id="map-barrio"
        value={barrio ?? ""}
        onChange={(event) => onBarrioChange(event.target.value || undefined)}
        className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-[13px] font-semibold text-foreground transition-colors hover:border-primary/30 focus-visible:border-primary focus-visible:outline-none"
      >
        <option value="">Toda la ciudad</option>
        {BARRIO_NAMES.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>

    <ul className={cn("scrollbar-none min-h-0 flex-1 space-y-1 overflow-y-auto pr-1")}>
      {CATEGORIES.map((category) => {
        const isSelected = selected.includes(category.id);
        return (
          <li key={category.id}>
            <label
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-2.5 transition-colors",
                isSelected
                  ? "border-primary/30 bg-tint"
                  : "border-transparent hover:border-border hover:bg-muted/60",
              )}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggleCategory(category.id)}
                aria-label={`Filtrar por ${category.label}`}
              />
              <CategoryIcon category={category.id} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-bold text-foreground/85">
                  {category.label}
                </span>
                <span className="block text-[11.5px] text-muted-foreground">
                  {(counts[category.id] ?? 0).toLocaleString("es-CO")} reportes
                </span>
              </span>
            </label>
          </li>
        );
      })}
    </ul>

    <div className="space-y-2 border-t border-border/70 pt-3">
      <Button variant="brand" size={variant === "sheet" ? "lg" : "default"} className="w-full" onClick={onApply}>
        Aplicar filtros
        {activeCount ? ` (${activeCount})` : ""}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Button>
      <button
        type="button"
        onClick={onClear}
        className="mx-auto flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground transition-colors hover:text-primary"
      >
        <RotateCcw className="h-3.5 w-3.5" aria-hidden />
        Restablecer el mapa
      </button>
    </div>
  </div>
);
