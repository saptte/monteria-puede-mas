import {
  AlertTriangle,
  Building2,
  Bus,
  CircleDashed,
  Droplets,
  Lightbulb,
  LightbulbOff,
  LineChart,
  TreePine,
  Trash2,
  Users,
} from "lucide-react";
import type { ReportCategory, ReportStatus, StatusMeta } from "@/types";

/** Categorías ciudadanas: color propio, icono propio y conteo real de reportes. */
export const CATEGORIES: ReportCategory[] = [
  {
    id: "basuras",
    label: "Basuras",
    short: "Basuras",
    description: "Residuos, escombros y puntos críticos de aseo.",
    colorClass: "text-cat-basuras",
    iconBgClass: "bg-cat-basuras/12 text-cat-basuras",
    reports: 423,
  },
  {
    id: "vias",
    label: "Vías y huecos",
    short: "Vías y huecos",
    description: "Huecos, andenes, señalización y malla vial.",
    colorClass: "text-cat-vias",
    iconBgClass: "bg-cat-vias/14 text-cat-vias",
    reports: 312,
  },
  {
    id: "alumbrado",
    label: "Alumbrado",
    short: "Alumbrado",
    description: "Luminarias apagadas, vandalizadas o insuficientes.",
    colorClass: "text-cat-alumbrado",
    iconBgClass: "bg-cat-alumbrado/12 text-cat-alumbrado",
    reports: 189,
  },
  {
    id: "agua",
    label: "Agua y drenaje",
    short: "Drenaje e inundaciones",
    description: "Fugas, alcantarillado y zonas de inundación.",
    colorClass: "text-cat-agua",
    iconBgClass: "bg-cat-agua/12 text-cat-agua",
    reports: 164,
  },
  {
    id: "parques",
    label: "Parques y espacio público",
    short: "Parques",
    description: "Zonas verdes, juegos, mobiliario y andenes.",
    colorClass: "text-cat-parques",
    iconBgClass: "bg-cat-parques/12 text-cat-parques",
    reports: 142,
  },
  {
    id: "movilidad",
    label: "Movilidad y transporte",
    short: "Movilidad",
    description: "Tráfico, semáforos, paraderos y ciclorrutas.",
    colorClass: "text-cat-movilidad",
    iconBgClass: "bg-cat-movilidad/14 text-cat-movilidad",
    reports: 118,
  },
  {
    id: "seguridad",
    label: "Convivencia y seguridad",
    short: "Convivencia",
    description: "Puntos críticos, convivencia y prevención.",
    colorClass: "text-cat-seguridad",
    iconBgClass: "bg-cat-seguridad/12 text-cat-seguridad",
    reports: 96,
  },
  {
    id: "equipamientos",
    label: "Equipamientos y servicios",
    short: "Equipamientos",
    description: "Salud, educación, cultura y deporte.",
    colorClass: "text-cat-equipamientos",
    iconBgClass: "bg-cat-equipamientos/12 text-cat-equipamientos",
    reports: 78,
  },
  {
    id: "economia",
    label: "Oportunidades y economía",
    short: "Oportunidades",
    description: "Empleo, emprendimiento y desarrollo local.",
    colorClass: "text-cat-economia",
    iconBgClass: "bg-cat-economia/12 text-cat-economia",
    reports: 64,
  },
  {
    id: "ideas",
    label: "Ideas y propuestas",
    short: "Ideas",
    description: "Propuestas ciudadanas para mejorar Montería.",
    colorClass: "text-cat-ideas",
    iconBgClass: "bg-cat-ideas/18 text-cat-ideas",
    reports: 328,
  },
  {
    id: "otro",
    label: "Otro",
    short: "Otro",
    description: "Situaciones que no encajan en otra categoría.",
    colorClass: "text-cat-otro",
    iconBgClass: "bg-cat-otro/12 text-cat-otro",
    reports: 52,
  },
];

export const CATEGORY_ICONS = {
  basuras: Trash2,
  vias: AlertTriangle,
  alumbrado: LightbulbOff,
  agua: Droplets,
  parques: TreePine,
  movilidad: Bus,
  seguridad: Users,
  equipamientos: Building2,
  economia: LineChart,
  ideas: Lightbulb,
  otro: CircleDashed,
} as const;

export const CATEGORY_MAP: Record<string, ReportCategory> = Object.fromEntries(
  CATEGORIES.map((category) => [category.id, category]),
);

/** Etapas del caso: la misma secuencia que ve el ciudadano en el timeline. */
export const REPORT_STATUSES: StatusMeta[] = [
  {
    id: "recibido",
    label: "Recibido",
    description: "Tu reporte entró a la plataforma y ya hace parte del mapa.",
    colorClass: "text-status-recibido",
    badgeClass: "bg-status-recibido/12 text-status-recibido",
  },
  {
    id: "validado",
    label: "Validado",
    description: "El equipo verificó la información y la ubicación.",
    colorClass: "text-status-validado",
    badgeClass: "bg-status-validado/12 text-status-validado",
  },
  {
    id: "en-revision",
    label: "En revisión",
    description: "Se analiza con la entidad responsable del tema.",
    colorClass: "text-status-revision",
    badgeClass: "bg-status-revision/14 text-status-revision",
  },
  {
    id: "asignado",
    label: "Asignado",
    description: "El caso quedó asignado a un equipo de trabajo.",
    colorClass: "text-status-asignado",
    badgeClass: "bg-status-asignado/12 text-status-asignado",
  },
  {
    id: "en-ejecucion",
    label: "En ejecución",
    description: "La solución está en marcha en el territorio.",
    colorClass: "text-status-ejecucion",
    badgeClass: "bg-status-ejecucion/12 text-status-ejecucion",
  },
  {
    id: "resuelto",
    label: "Resuelto",
    description: "La situación fue atendida y verificada con la comunidad.",
    colorClass: "text-status-resuelto",
    badgeClass: "bg-status-resuelto/12 text-status-resuelto",
  },
];

export const STATUS_MAP: Record<string, StatusMeta> = Object.fromEntries(
  REPORT_STATUSES.map((status) => [status.id, status]),
);

export const STATUS_ORDER: ReportStatus[] = REPORT_STATUSES.map((status) => status.id);
