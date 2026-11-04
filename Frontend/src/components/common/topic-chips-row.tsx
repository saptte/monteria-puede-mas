import { ArrowRight } from "lucide-react";
import { CATEGORY_ICONS, CATEGORY_MAP } from "@/data/categories";
import { cn } from "@/lib/utils";
import type { ReportCategoryId } from "@/types";

interface TopicChipsRowProps {
  topics: { category: ReportCategoryId; reports: number; share: number }[];
  onSelect?: (category: ReportCategoryId) => void;
  onSeeAll?: () => void;
  className?: string;
}

/** Fila "Temas más reportados": chips con icono, cantidad y barra de proporción. */
export const TopicChipsRow = ({ topics, onSelect, onSeeAll, className }: TopicChipsRowProps) => {
  const max = Math.max(...topics.map((topic) => topic.reports), 1);

  return (
    <div className={cn("scrollbar-none flex gap-3 overflow-x-auto pb-1", className)}>
      {topics.map((topic) => {
        const meta = CATEGORY_MAP[topic.category];
        const Icon = CATEGORY_ICONS[topic.category];
        if (!meta || !Icon) return null;

        return (
          <button
            key={topic.category}
            type="button"
            onClick={() => onSelect?.(topic.category)}
            className="group flex min-w-[168px] shrink-0 flex-col gap-2 rounded-2xl border border-border/70 bg-card p-4 text-left shadow-soft transition-all duration-300 ease-spring hover:-translate-y-1 hover:border-primary/25 hover:shadow-card"
          >
            <span className="flex items-center justify-between gap-2">
              <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", meta.iconBgClass)}>
                <Icon className="h-[18px] w-[18px]" aria-hidden />
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" aria-hidden />
            </span>
            <span className="font-display text-[24px] leading-none text-primary-deep">
              {topic.reports}
            </span>
            <span className="text-[12px] font-semibold leading-snug text-foreground/80">
              {meta.label}
            </span>
            <span className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
              <span
                className={cn("block h-full rounded-full", meta.colorClass.replace("text-", "bg-"))}
                style={{ width: `${Math.max(12, Math.round((topic.reports / max) * 100))}%` }}
              />
            </span>
          </button>
        );
      })}

      {onSeeAll ? (
        <button
          type="button"
          onClick={onSeeAll}
          className="flex min-w-[150px] shrink-0 flex-col items-start justify-center gap-1 rounded-2xl border-2 border-primary/20 bg-background p-4 text-left transition-colors duration-300 hover:border-primary hover:bg-tint"
        >
          <span className="text-[15px] font-display leading-tight text-primary-deep">
            Ver todos
            <br />
            los temas
          </span>
          <ArrowRight className="h-4 w-4 text-primary" aria-hidden />
        </button>
      ) : null}
    </div>
  );
};
