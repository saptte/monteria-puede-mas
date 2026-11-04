export const CATEGORY_SLUGS = {
  basuras: "Basuras",
  vias: "Vías y huecos",
  alumbrado: "Alumbrado",
  agua: "Agua y drenaje",
  parques: "Parques",
  movilidad: "Movilidad",
  seguridad: "Convivencia",
  equipamientos: "Equipamientos",
  economia: "Economía",
  ideas: "Ideas",
} as const;

export type CategorySlug = keyof typeof CATEGORY_SLUGS;

export const UI_STATUSES = [
  "recibido",
  "validado",
  "en-revision",
  "asignado",
  "en-ejecucion",
  "resuelto",
] as const;

export type UiStatus = (typeof UI_STATUSES)[number];

const STATUS_TO_UI: Record<string, UiStatus> = {
  RECIBIDO: "recibido",
  VALIDADO: "validado",
  CLASIFICADO: "en-revision",
  EN_REVISION: "en-revision",
  ASIGNADO: "asignado",
  EN_EJECUCION: "en-ejecucion",
  RESUELTO: "resuelto",
};

const UI_TO_STATUS: Record<UiStatus, string> = {
  recibido: "RECIBIDO",
  validado: "VALIDADO",
  "en-revision": "EN_REVISION",
  asignado: "ASIGNADO",
  "en-ejecucion": "EN_EJECUCION",
  resuelto: "RESUELTO",
};

export function statusToUi(status: string): UiStatus {
  return STATUS_TO_UI[status] ?? "recibido";
}

export function statusToDb(status: string): string | null {
  if (status in UI_TO_STATUS) return UI_TO_STATUS[status as UiStatus];
  return null;
}
