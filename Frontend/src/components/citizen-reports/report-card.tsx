import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, MapPin } from "lucide-react";
import { CategoryBadge } from "@/components/common/category-badge";
import { StatusBadge } from "@/components/common/status-badge";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Report } from "@/types";

interface ReportCardProps {
  report: Report;
  variant?: "list" | "grid";
  className?: string;
}

/** Tarjeta de reporte ciudadano: evidencia, tema, barrio y estado. */
export const ReportCard = ({ report, variant = "list", className }: ReportCardProps) => {
  const isList = variant === "list";

  return (
    <Link
      to={`/reportes/${report.id}`}
      className={cn(
        "group flex overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-all duration-300 ease-spring hover:-translate-y-1 hover:border-primary/25 hover:shadow-card",
        isList ? "flex-col gap-4 p-3 sm:flex-row" : "flex-col",
        className,
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-2xl bg-muted",
          isList
            ? "aspect-[16/9] w-full sm:h-[76px] sm:w-[104px] sm:aspect-auto"
            : "aspect-[4/3] w-full",
        )}
      >
        {report.photos[0] ? (
          <img
            src={report.photos[0]}
            alt={report.title}
            crossOrigin="anonymous"
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-spring group-hover:scale-105"
          />
        ) : null}
      </div>

      <div className={cn("min-w-0 flex-1", isList ? "py-1" : "space-y-3 p-4")}>
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={report.category} />
          {isList ? null : <StatusBadge status={report.status} />}
        </div>

        <div className="mt-1.5 space-y-1">
          <h3
            className={cn(
              "font-display leading-tight text-primary-deep",
              isList ? "text-[15px]" : "text-[17px]",
            )}
          >
            {report.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden />
              Barrio {report.barrio}
            </span>
            <span>{timeAgo(report.createdAt)}</span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5 text-primary" aria-hidden />
              {report.comments}
            </span>
          </div>
        </div>

        {isList ? null : (
          <p className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
            {report.description}
          </p>
        )}
      </div>

      <span
        aria-hidden
        className={cn(
          "items-center justify-center text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary sm:flex",
          isList ? "w-8 shrink-0" : "absolute",
        )}
      >
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
};
