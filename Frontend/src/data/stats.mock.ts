import { CATEGORIES } from "./categories";
import type { KpiSet, Stat, TopicStat, ZoneStat } from "@/types";

/** Indicadores base de la plataforma (mock alineado con las referencias). */
export const KPIS: KpiSet = {
  conversations: 2481,
  reports: 1307,
  ideas: 328,
  people: 1842,
  barrios: 489,
  localidades: 5,
  responseRate: 73,
  averageDays: 24,
  growth: 42,
};

export const HOME_STATS: Stat[] = [
  {
    id: "conversations",
    label: "Conversaciones",
    value: KPIS.conversations,
    description: "Historias, ideas y experiencias de ciudadanos como tú.",
    icon: "conversations",
  },
  {
    id: "reports",
    label: "Reportes",
    value: KPIS.reports,
    description: "Problemas y oportunidades en toda la ciudad.",
    icon: "reports",
  },
  {
    id: "ideas",
    label: "Ideas",
    value: KPIS.ideas,
    description: "Propuestas para una mejor Montería.",
    icon: "ideas",
  },
  {
    id: "people",
    label: "Personas",
    value: KPIS.people,
    description: "Ya están participando para hacer la diferencia.",
    icon: "people",
  },
];

export const MAP_STATS: Stat[] = [
  {
    id: "reports",
    label: "Reportes ciudadanos",
    value: KPIS.reports,
    description: "En todo Montería",
    icon: "reports",
  },
  {
    id: "localidades",
    label: "Localidades",
    value: KPIS.localidades,
    description: "Urbanas y rurales",
    icon: "localidades",
  },
  {
    id: "barrios",
    label: "Barrios y veredas",
    value: KPIS.barrios,
    description: "Con reportes",
    icon: "barrios",
  },
  {
    id: "response",
    label: "Con respuesta",
    value: KPIS.responseRate,
    suffix: "%",
    description: "De la comunidad o aliados",
    icon: "response",
  },
  {
    id: "time",
    label: "Tiempo promedio",
    value: KPIS.averageDays,
    description: "De primera respuesta",
    icon: "time",
  },
  {
    id: "growth",
    label: "Participación",
    value: KPIS.growth,
    prefix: "+",
    suffix: "%",
    description: "En los últimos 3 meses",
    icon: "growth",
  },
];

export const ZONE_STATS: ZoneStat[] = [
  { name: "Centro", reports: 248, colorClass: "bg-signal" },
  { name: "La Granja", reports: 176, colorClass: "bg-accent" },
  { name: "El Recreo", reports: 142, colorClass: "bg-primary" },
  { name: "Mocarí", reports: 118, colorClass: "bg-cat-parques" },
  { name: "Pasatiempo", reports: 103, colorClass: "bg-cat-seguridad" },
];

const TOPIC_SHARES: Record<string, number> = {
  basuras: 32,
  vias: 24,
  agua: 13,
  parques: 11,
  movilidad: 10,
};

export const TOPIC_STATS: TopicStat[] = CATEGORIES.filter(
  (category) => TOPIC_SHARES[category.id] !== undefined,
).map((category) => ({
  category: category.id,
  reports: category.reports,
  share: TOPIC_SHARES[category.id],
  trend: category.id === "basuras" ? 6 : category.id === "vias" ? 3 : -1,
}));

export const WEEKLY_TOPICS = CATEGORIES.filter((category) =>
  ["basuras", "vias", "alumbrado", "agua", "parques", "movilidad"].includes(category.id),
).map((category) => ({
  category: category.id,
  reports: category.reports,
  share: Math.round((category.reports / 1307) * 100),
}));

export const MONTHLY_SERIES = [
  { month: "Abr", reports: 148, conversations: 210 },
  { month: "May", reports: 196, conversations: 265 },
  { month: "Jun", reports: 232, conversations: 318 },
  { month: "Jul", reports: 268, conversations: 402 },
  { month: "Ago", reports: 311, conversations: 468 },
  { month: "Sep", reports: 342, conversations: 512 },
];

export const RESPONSE_BREAKDOWN = [
  { label: "Resueltos", value: 41, colorClass: "bg-status-resuelto" },
  { label: "En ejecución", value: 32, colorClass: "bg-status-ejecucion" },
  { label: "En revisión", value: 19, colorClass: "bg-status-revision" },
  { label: "Recibidos", value: 8, colorClass: "bg-status-recibido" },
];
