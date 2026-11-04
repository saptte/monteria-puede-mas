import { SearchX } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: { label: string; onClick: () => void };
  className?: string;
}

/** Estado vacío: nunca dejar al ciudadano sin salida. */
export const EmptyState = ({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-primary/20 bg-tint/40 px-6 py-12 text-center",
      className,
    )}
  >
    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background text-primary shadow-soft">
      {icon ?? <SearchX className="h-6 w-6" aria-hidden />}
    </span>
    <p className="font-display text-[18px] text-primary-deep">{title}</p>
    {description ? (
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
    ) : null}
    {action ? (
      <Button variant="outlineBrand" size="sm" onClick={action.onClick} className="mt-1">
        {action.label}
      </Button>
    ) : null}
  </div>
);
