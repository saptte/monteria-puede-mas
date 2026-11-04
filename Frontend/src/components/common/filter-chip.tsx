import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FilterChipProps {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  count?: number;
}

/** Chip de filtro reutilizable (temáticas, estados, zonas). */
export const FilterChip = ({ active, children, onClick, className, count }: FilterChipProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      "inline-flex min-h-[40px] items-center gap-2 whitespace-nowrap rounded-full border px-4 text-[13px] font-semibold transition-all duration-300 ease-spring",
      active
        ? "border-primary bg-primary text-primary-foreground shadow-soft"
        : "border-border bg-background text-foreground/75 hover:border-primary/40 hover:bg-tint hover:text-primary",
      className,
    )}
  >
    {children}
    {typeof count === "number" ? (
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-[11px] font-bold",
          active ? "bg-background/20 text-background" : "bg-primary/10 text-primary",
        )}
      >
        {count}
      </span>
    ) : null}
  </button>
);
