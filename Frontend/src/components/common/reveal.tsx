import type { ReactNode } from "react";
import { useInViewOnce } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

/**
 * Aparición suave de secciones al entrar en viewport.
 * Usa IntersectionObserver + transición CSS (sin librerías de animación)
 * para que la animación no cueste rendimiento en móvil.
 */
export const Reveal = ({ children, delay = 0, y = 22, className }: RevealProps) => {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-spring will-change-[opacity,transform]",
        inView ? "opacity-100" : "opacity-0",
        className,
      )}
      style={{
        transform: inView ? "translateY(0)" : `translateY(${y}px)`,
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
};
