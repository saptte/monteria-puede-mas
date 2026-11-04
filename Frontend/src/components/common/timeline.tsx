import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineItem {
  label: string;
  date: string;
  responsible?: string;
  update?: string;
  done: boolean;
  colorClass?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/** Línea de tiempo del caso: cada etapa con fecha, responsable y actualización. */
export const Timeline = ({ items, className }: TimelineProps) => (
  <ol className={cn("relative space-y-0", className)}>
    {items.map((item, index) => {
      const isLast = index === items.length - 1;
      return (
        <li key={`${item.label}-${index}`} className="relative flex gap-4 pb-6 last:pb-0">
          {!isLast ? (
            <span
              aria-hidden
              className={cn(
                "absolute left-[15px] top-8 h-full w-0.5 rounded-full",
                item.done ? "bg-primary/25" : "bg-border",
              )}
            />
          ) : null}
          <span
            className={cn(
              "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold",
              item.done
                ? cn("border-transparent text-primary-foreground", item.colorClass ?? "bg-primary")
                : "border-border bg-background text-muted-foreground",
            )}
            aria-hidden
          >
            {item.done ? <Check className="h-4 w-4" strokeWidth={3} /> : index + 1}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p
                className={cn(
                  "text-[13px] font-bold uppercase tracking-wide",
                  item.done ? "text-primary-deep" : "text-muted-foreground",
                )}
              >
                {item.label}
              </p>
              <span className="text-[12px] text-muted-foreground">{formatDate(item.date)}</span>
            </div>
            {item.responsible ? (
              <p className="mt-1 text-[12px] font-semibold text-primary/80">{item.responsible}</p>
            ) : null}
            {item.update ? (
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{item.update}</p>
            ) : null}
          </div>
        </li>
      );
    })}
  </ol>
);
