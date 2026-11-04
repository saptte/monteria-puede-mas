import { cn } from "@/lib/utils";

interface ProgressMeterProps {
  value: number;
  className?: string;
  barClassName?: string;
  label?: string;
  showValue?: boolean;
}

/** Barra de progreso fina, animada, con etiqueta accesible. */
export const ProgressMeter = ({
  value,
  className,
  barClassName,
  label,
  showValue = false,
}: ProgressMeterProps) => {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("w-full", className)}>
      {label || showValue ? (
        <div className="mb-1.5 flex items-center justify-between text-[12px] font-semibold">
          <span className="text-foreground/70">{label}</span>
          {showValue ? <span className="text-primary-deep">{safeValue}%</span> : null}
        </div>
      ) : null}
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-primary/10"
        role="progressbar"
        aria-valuenow={safeValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? `Progreso ${safeValue}%`}
      >
        <div
          className={cn("h-full rounded-full bg-gradient-brand transition-[width] duration-700 ease-spring", barClassName)}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
};
