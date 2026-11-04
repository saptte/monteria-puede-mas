import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BrushHighlight } from "./brush-highlight";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  accent?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  tone?: "default" | "tint" | "light";
  className?: string;
}

/** Encabezado de sección reutilizable: eyebrow, titular con acento y acción. */
export const SectionHeader = ({
  eyebrow,
  title,
  accent,
  description,
  action,
  align = "left",
  tone = "default",
  className,
}: SectionHeaderProps) => (
  <div
    className={cn(
      "flex flex-col gap-5",
      align === "center" ? "items-center text-center" : "items-start",
      action && "md:flex-row md:items-end md:justify-between md:gap-10",
      className,
    )}
  >
    <div className={cn("max-w-2xl space-y-3", align === "center" && "mx-auto")}>
      {eyebrow ? (
        <p className={cn("eyebrow", tone === "light" && "text-accent")}>{eyebrow}</p>
      ) : null}
      <h2
        className={cn(
          "text-[28px] leading-[1.06] sm:text-[36px] lg:text-[44px]",
          tone === "light" ? "text-background" : "text-primary-deep",
        )}
      >
        {title}
      </h2>
      {accent ? (
        <p className="text-[22px] leading-tight sm:text-[28px]">
          <BrushHighlight>
            <span className="script-accent">{accent}</span>
          </BrushHighlight>
        </p>
      ) : null}
      {description ? (
        <p
          className={cn(
            "text-[15px] leading-relaxed sm:text-base",
            tone === "light" ? "text-background/80" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </div>
);
