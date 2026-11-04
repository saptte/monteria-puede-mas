import type { ActivityItem, CitizenProfile, CitizenSummary } from "@/types";

export const CITIZEN: CitizenProfile = {
  id: "citizen-001",
  firstName: "José",
  lastName: "Martínez",
  email: "jose.martinez@correo.com",
  phone: "+57 300 123 4567",
  since: "2026-03-04",
  barrio: "La Granja",
};

export const CITIZEN_SUMMARY: CitizenSummary = {
  activeReports: 3,
  resolvedReports: 1,
  proposals: 2,
  conversations: 2,
  followedProjects: 4,
  supportsReceived: 24,
};

export const CITIZEN_ACTIVITY: ActivityItem[] = [
  {
    id: "activity-1",
    type: "reporte",
    text: "Tu reporte MPM-2026-001307 cambió de estado a En revisión.",
    date: "2026-09-24T15:20:00.000Z",
    href: "/reportes/MPM-2026-001307",
  },
  {
    id: "activity-2",
    type: "propuesta",
    text: "Tu propuesta “Ciclovía dominical en la Ronda” recibió 24 apoyos nuevos.",
    date: "2026-09-22T11:05:00.000Z",
    href: "/monteria-habla",
  },
  {
    id: "activity-3",
    type: "proyecto",
    text: "Un proyecto que sigues tiene una actualización: Recuperación del parque de La Granja alcanzó el 68%.",
    date: "2026-09-20T09:40:00.000Z",
    href: "/monteria-resuelve",
  },
  {
    id: "activity-4",
    type: "reporte",
    text: "Tu reporte MPM-2026-001289 fue marcado como Resuelto por el equipo responsable.",
    date: "2026-09-14T17:10:00.000Z",
    href: "/reportes/MPM-2026-001289",
  },
  {
    id: "activity-5",
    type: "conversacion",
    text: "Nueva respuesta en la conversación “¿Qué espacios públicos necesita tu barrio?”.",
    date: "2026-09-11T13:25:00.000Z",
    href: "/monteria-habla",
  },
];

export const CITIZEN_PROPOSALS = [
  {
    id: "prop-1",
    title: "Ciclovía dominical en la Ronda del Sinú",
    supports: 128,
    status: "En análisis",
    date: "2026-08-18",
  },
  {
    id: "prop-2",
    title: "Puntos de hidratación en parques del barrio",
    supports: 64,
    status: "Recibida",
    date: "2026-09-02",
  },
];
