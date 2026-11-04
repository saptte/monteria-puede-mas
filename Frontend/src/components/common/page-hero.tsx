import type { ReactNode } from "react";
import { BrushHighlight } from "./brush-highlight";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  accent?: string;
  description?: ReactNode;
  children?: ReactNode;
  image?: string;
  imageAlt?: string;
  className?: string;
  tone?: "light" | "tint";
}

/**
 * Hero editorial reutilizable: contenido a la izquierda y fotografía
 * integrada con degradado (no un rectángulo plano).
 */
export const PageHero = ({
  eyebrow,
  title,
  accent,
  description,
  children,
  image,
  imageAlt = "Montería",
  className,
  tone = "light",
}: PageHeroProps) => (
  <section
    className={cn(
      "relative overflow-hidden",
      tone === "tint" ? "bg-gradient-tint" : "bg-background",
      className,
    )}
  >
    <div className="container-page relative grid items-center gap-10 py-10 lg:grid-cols-[minmax(0,45%)_minmax(0,55%)] lg:gap-6 lg:py-16">
      <div className="relative z-10 space-y-5">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="text-[34px] leading-[0.98] text-primary-deep sm:text-[46px] lg:text-[54px]">
          {title}
        </h1>
        {accent ? (
          <p className="text-[26px] leading-tight sm:text-[34px]">
            <BrushHighlight>
              <span className="script-accent">{accent}</span>
            </BrushHighlight>
          </p>
        ) : null}
        {description ? (
          <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        ) : null}
        {children ? <div className="flex flex-wrap items-center gap-3">{children}</div> : null}
      </div>

      {image ? (
        <div className="relative lg:-mr-10">
          <div className="relative overflow-hidden rounded-[2rem] shadow-card lg:rounded-l-[3rem] lg:rounded-r-[2rem]">
            <img
              src={image}
              alt={imageAlt}
              crossOrigin="anonymous"
              className="h-[300px] w-full object-cover sm:h-[420px] lg:h-[540px]"
            />
            <div
              aria-hidden
              className="absolute inset-0 hidden lg:block"
              style={{ backgroundImage: "var(--gradient-hero-fade)" }}
            />
          </div>
          <div
            aria-hidden
            className="absolute -bottom-6 -left-6 hidden h-24 w-24 rounded-full bg-accent/25 blur-2xl lg:block"
          />
        </div>
      ) : null}
    </div>
  </section>
);
