import { cn } from "@/lib/utils";

interface WordmarkProps {
  variant?: "default" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: { top: "text-[15px]", bottom: "text-[11px]", shadow: "1.5px 1.5px 0" },
  md: { top: "text-[22px]", bottom: "text-[15px]", shadow: "2px 2px 0" },
  lg: { top: "text-[30px]", bottom: "text-[20px]", shadow: "3px 3px 0" },
};

/**
 * Logo de Montería Puede Más recreado como wordmark vectorial:
 * MONTERÍA en slab azul con sombra amarilla + PUEDE MÁS en lettering rojo.
 */
export const Wordmark = ({ variant = "default", size = "md", className }: WordmarkProps) => {
  const light = variant === "light";
  const scale = SIZES[size];

  return (
    <span
      className={cn("inline-flex select-none flex-col items-start leading-[0.82]", className)}
      aria-label="Montería Puede Más"
    >
      <span
        className={cn("font-slab tracking-[0.01em]", scale.top, light ? "text-background" : "text-primary")}
        style={{
          textShadow: `${scale.shadow} hsl(var(--accent))`,
        }}
      >
        MONTERÍA
      </span>
      <span
        className={cn(
          "font-script leading-none",
          scale.bottom,
          light ? "text-accent" : "text-signal",
        )}
        style={{ letterSpacing: "0.03em" }}
      >
        PUEDE MÁS
      </span>
    </span>
  );
};

/** Marca compacta para el tab bar móvil y espacios mínimos. */
export const WordmarkMark = ({ className }: { className?: string }) => (
  <span
    className={cn(
      "flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-brand font-display text-[15px] text-primary-foreground shadow-soft",
      className,
    )}
    aria-label="Montería Puede Más"
  >
    M+
  </span>
);
