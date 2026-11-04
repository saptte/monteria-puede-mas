/**
 * Modelo de dominio de Montería Puede Más.
 * Estos tipos son el contrato que la capa `/services` expone hoy con datos mock
 * y que mañana consumirá la API real sin cambios en los componentes.
 */

export type ReportCategoryId =
  | "basuras"
  | "vias"
  | "alumbrado"
  | "agua"
  | "parques"
  | "movilidad"
  | "seguridad"
  | "equipamientos"
  | "economia"
  | "ideas"
  | "otro";

export interface ReportCategory {
  id: ReportCategoryId;
  label: string;
  short: string;
  description: string;
  colorClass: string;
  iconBgClass: string;
  reports: number;
}

export type ReportStatus =
  | "recibido"
  | "validado"
  | "en-revision"
  | "asignado"
  | "en-ejecucion"
  | "resuelto";

export interface StatusMeta {
  id: ReportStatus;
  label: string;
  description: string;
  colorClass: string;
  badgeClass: string;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Barrio {
  id: string;
  name: string;
  comuna: string;
  coords: GeoPoint;
  reports: number;
}

export interface TimelineEntry {
  status: ReportStatus;
  date: string;
  responsible: string;
  update: string;
  done: boolean;
}

export interface Report {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  category: ReportCategoryId;
  barrio: string;
  comuna: string;
  address: string;
  coords: GeoPoint;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  photos: string[];
  supports: number;
  comments: number;
  officialResponse?: string;
  timeline: TimelineEntry[];
  isMine?: boolean;
}

export type ProjectStatus =
  | "identificado"
  | "en-planeacion"
  | "en-ejecucion"
  | "resuelto";

export interface Project {
  id: string;
  title: string;
  barrio: string;
  comuna: string;
  category: ReportCategoryId;
  problem: string;
  action: string;
  status: ProjectStatus;
  progress: number;
  participants: number;
  reportsLinked: number;
  budget: string;
  startDate: string;
  endDate?: string;
  image: string;
  gallery: string[];
  allies: string[];
  milestones: { label: string; date: string; done: boolean }[];
}

export type ConversationStatus =
  | "abierta"
  | "en-analisis"
  | "con-resultados"
  | "cerrada";

export interface Conversation {
  id: string;
  question: string;
  summary: string;
  category: ReportCategoryId;
  participants: number;
  comments: number;
  barrios: string[];
  createdAt: string;
  status: ConversationStatus;
  author: string;
  image: string;
  highlights: string[];
}

export type InitiativeType =
  | "reto"
  | "voluntariado"
  | "convocatoria"
  | "actividad"
  | "proyecto";

export type InitiativeTheme =
  | "ambiental"
  | "social"
  | "cultura"
  | "movilidad"
  | "emprendimiento"
  | "juventud";

export interface Initiative {
  id: string;
  title: string;
  description: string;
  type: InitiativeType;
  theme: InitiativeTheme;
  date: string;
  place: string;
  participants: number;
  spots?: number;
  image: string;
  organizer: string;
  status: "abierta" | "proxima" | "en-curso" | "finalizada";
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  description: string;
  icon: "reports" | "conversations" | "ideas" | "people" | "barrios" | "response" | "time" | "growth" | "localidades";
}

export interface ZoneStat {
  name: string;
  reports: number;
  colorClass: string;
}

export interface TopicStat {
  category: ReportCategoryId;
  reports: number;
  share: number;
  trend: number;
}

export interface ActivityItem {
  id: string;
  type: "reporte" | "propuesta" | "proyecto" | "conversacion";
  text: string;
  date: string;
  href?: string;
}

export interface CitizenProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  since: string;
  barrio: string;
}

export interface CitizenSummary {
  activeReports: number;
  resolvedReports: number;
  proposals: number;
  conversations: number;
  followedProjects: number;
  supportsReceived: number;
}

export interface KpiSet {
  conversations: number;
  reports: number;
  ideas: number;
  people: number;
  barrios: number;
  localidades: number;
  responseRate: number;
  averageDays: number;
  growth: number;
}

export interface ReportFilters {
  categories?: ReportCategoryId[];
  barrio?: string;
  status?: ReportStatus[];
  query?: string;
}

export interface ReportDraftInput {
  title: string;
  description: string;
  category: ReportCategoryId;
  barrio: string;
  address: string;
  coords: GeoPoint;
  photos: string[];
  consent: boolean;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export type WallKind = "tema" | "reporte" | "apoyo" | "comentario";

export interface WallPost {
  id: string;
  kind: WallKind;
  title: string;
  body: string;
  category: string | null;
  barrio: string | null;
  author: string;
  createdAt: string;
  supports: number;
  comments: number;
  supportedByMe: boolean;
  mine: boolean;
  reference: string | null;
}

export interface WallDraft {
  title: string;
  body: string;
  category?: string;
  barrio?: string;
}

export interface AiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  chips?: string[];
}
