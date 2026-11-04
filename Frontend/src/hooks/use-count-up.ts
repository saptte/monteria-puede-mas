import { useEffect, useRef, useState } from "react";

const easeOutCubic = (progress: number) => 1 - Math.pow(1 - progress, 3);

/**
 * Cuenta ascendente para indicadores. Respeta `prefers-reduced-motion`
 * mostrando el valor final de inmediato.
 */
export function useCountUp(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!active) return;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setValue(target);
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(easeOutCubic(progress) * target));
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [active, duration, target]);

  return value;
}
