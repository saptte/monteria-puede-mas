import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  FileText,
  Handshake,
  Lightbulb,
  MessageCircle,
} from "lucide-react";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ActivityItem } from "@/types";

const ICONS = {
  reporte: FileText,
  propuesta: Lightbulb,
  proyecto: Handshake,
  conversacion: MessageCircle,
} as const;

const TONES = {
  reporte: "bg-tint text-primary",
  propuesta: "bg-accent-soft text-primary-deep",
  proyecto: "bg-status-ejecucion/10 text-status-ejecucion",
  conversacion: "bg-signal/10 text-signal",
} as const;

/** Actividad reciente del ciudadano en la plataforma. */
export const ActivityFeed = ({ items }: { items: ActivityItem[] }) => (
  <ol className="space-y-3">
    {items.map((item) => {
      const Icon = ICONS[item.type];
      return (
        <li
          key={item.id}
          className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-4 transition-colors hover:border-primary/25"
        >
          <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", TONES[item.type])}>
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] leading-relaxed text-foreground/85">{item.text}</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden />
              {timeAgo(item.date)}
            </p>
          </div>
          {item.href ? (
            <Link
              to={item.href}
              className="inline-flex shrink-0 items-center gap-1 text-[12.5px] font-bold text-primary hover:underline"
            >
              Ver
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          ) : null}
        </li>
      );
    })}
  </ol>
);

/** Resumen del ciudadano: reportes activos, resueltos y participaciones. */
export const CitizenHighlights = ({
  activeReports,
  resolvedReports,
  proposals,
  conversations,
  followedProjects,
  supportsReceived,
}: {
  activeReports: number;
  resolvedReports: number;
  proposals: number;
  conversations: number;
  followedProjects: number;
  supportsReceived: number;
}) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {[
      {
        value: activeReports,
        label: "reportes activos",
        detail: `${resolvedReports} resuelto`,
        icon: FileText,
        path: "/mapa",
      },
      {
        value: proposals,
        label: "propuestas publicadas",
        detail: `${supportsReceived} apoyos recibidos`,
        icon: Lightbulb,
        path: "/monteria-habla",
      },
      {
        value: conversations,
        label: "conversaciones",
        detail: "con tu participación",
        icon: MessageCircle,
        path: "/monteria-habla",
      },
      {
        value: followedProjects,
        label: "proyectos que sigues",
        detail: "con actualizaciones",
        icon: Handshake,
        path: "/monteria-resuelve",
      },
    ].map((card) => (
      <Link
        key={card.label}
        to={card.path}
        className="group flex flex-col gap-2 rounded-3xl border border-border/70 bg-card p-5 shadow-soft transition-all duration-300 ease-spring hover:-translate-y-1 hover:border-primary/25 hover:shadow-card"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tint text-primary">
          <card.icon className="h-5 w-5" aria-hidden />
        </span>
        <p className="font-display text-[30px] leading-none text-primary-deep">{card.value}</p>
        <p className="text-[13px] font-bold text-primary">{card.label}</p>
        <p className="text-[12px] text-muted-foreground">{card.detail}</p>
        <span className="mt-1 inline-flex items-center gap-1 text-[12px] font-bold text-primary/70 transition-transform duration-300 group-hover:translate-x-1">
          Ver
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </Link>
    ))}
  </div>
);

/** Mensaje de caso resuelto para el panel ciudadano. */
export const ResolvedNotice = ({ caseNumber }: { caseNumber: string }) => (
  <div className="flex items-start gap-3 rounded-3xl border border-status-resuelto/25 bg-status-resuelto/10 p-5">
    <CheckCircle2 className="mt-0.5 h-5 w-5 text-status-resuelto" aria-hidden />
    <div>
      <p className="font-display text-[15px] text-primary-deep">
        Tu reporte {caseNumber} ya está resuelto
      </p>
      <p className="text-[13px] text-muted-foreground">
        La comunidad verificó el resultado. Puedes ver el detalle y la respuesta institucional.
      </p>
    </div>
  </div>
);
