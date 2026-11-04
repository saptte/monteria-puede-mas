import { CATEGORY_ICONS, CATEGORY_MAP } from "@/data/categories";
import { cn } from "@/lib/utils";
import type { ReportCategoryId } from "@/types";

interface CategoryBadgeProps {
  category: ReportCategoryId;
  className?: string;
  withIcon?: boolean;
  size?: "sm" | "md";
}

/** Etiqueta de categoría con el color y el icono propios del tema. */
export const CategoryBadge = ({
  category,
  className,
  withIcon = true,
  size = "sm",
}: CategoryBadgeProps) => {
  const meta = CATEGORY_MAP[category];
  const Icon = CATEGORY_ICONS[category];
  if (!meta || !Icon) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-bold",
        meta.iconBgClass,
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-[13px]",
        className,
      )}
    >
      {withIcon ? <Icon className={cn(size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4")} aria-hidden /> : null}
      {meta.label}
    </span>
  );
};

/** Icono de categoría en caja (usado en filtros, chips y wizard). */
export const CategoryIcon = ({
  category,
  className,
  boxClassName,
}: {
  category: ReportCategoryId;
  className?: string;
  boxClassName?: string;
}) => {
  const meta = CATEGORY_MAP[category];
  const Icon = CATEGORY_ICONS[category];
  if (!meta || !Icon) return null;
  return (
    <span
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
        meta.iconBgClass,
        boxClassName,
      )}
    >
      <Icon className={cn("h-[18px] w-[18px]", className)} aria-hidden />
    </span>
  );
};
