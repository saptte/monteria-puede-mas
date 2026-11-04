import { useCountUp } from "@/hooks/use-count-up";
import { useInViewOnce } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
}

/** Número con animación count-up al entrar en viewport. */
export const AnimatedNumber = ({
  value,
  suffix,
  prefix,
  className,
  duration = 1600,
}: AnimatedNumberProps) => {
  const { ref, inView } = useInViewOnce<HTMLSpanElement>();
  const animated = useCountUp(value, inView, duration);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {animated.toLocaleString("es-CO")}
      {suffix}
    </span>
  );
};
