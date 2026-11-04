import { STATUS_MAP } from "@/data/categories";
import { cn } from "@/lib/utils";
import type { ReportStatus } from "@/types";

interface StatusBadgeProps {
  status: ReportStatus;
  className?: string;
  withDot?: boolean;
}

/** Estado del caso con el color semántico de su etapa. */
export const StatusBadge = ({ status, className, withDot = true }: StatusBadgeProps) => {
  const meta = STATUS_MAP[status];
  if (!meta) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
        meta.badgeClass,
        className,
      )}
    >
      {withDot ? <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden /> : null}
      {meta.label}
    </span>
  );
};
