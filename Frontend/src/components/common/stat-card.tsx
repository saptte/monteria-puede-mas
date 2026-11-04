import {
  Building2,
  CheckCircle2,
  Clock3,
  Lightbulb,
  MapPin,
  MessageCircle,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { AnimatedNumber } from "./animated-number";
import { cn } from "@/lib/utils";
import type { Stat } from "@/types";

const STAT_ICONS: Record<Stat["icon"], LucideIcon> = {
  reports: MapPin,
  conversations: MessageCircle,
  ideas: Lightbulb,
  people: Users,
  barrios: Building2,
  response: CheckCircle2,
  time: Clock3,
  growth: TrendingUp,
  localidades: MapPin,
};

interface StatCardProps {
  stat: Stat;
  className?: string;
  size?: "md" | "lg";
  showIcon?: boolean;
}

/** Indicador ciudadano con icono, número animado y descripción. */
export const StatCard = ({ stat, className, size = "md", showIcon = true }: StatCardProps) => {
  const Icon = STAT_ICONS[stat.icon];
  return (
    <div className={cn("flex items-start gap-3", className)}>
      {showIcon ? (
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-tint text-primary">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      ) : null}
      <div className="min-w-0">
        <p
          className={cn(
            "font-display leading-none text-primary-deep",
            size === "lg" ? "text-[32px] sm:text-[40px]" : "text-[26px] sm:text-[30px]",
          )}
        >
          <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
        </p>
        <p className="mt-1 text-[13px] font-bold text-primary">{stat.label}</p>
        <p className="text-[12px] leading-snug text-muted-foreground">{stat.description}</p>
      </div>
    </div>
  );
};
