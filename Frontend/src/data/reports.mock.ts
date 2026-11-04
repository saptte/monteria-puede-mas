import { BARRIOS, MONTERIA_CENTER } from "./barrios";
import { MEDIA } from "./media";
import { REPORT_STATUSES, STATUS_ORDER } from "./categories";
import type {
  GeoPoint,
  Report,
  ReportCategoryId,
  ReportStatus,
  TimelineEntry,
} from "@/types";

const TITLES: Record<ReportCategoryId, string[]> = {
  basuras: [
    "Basuras acumuladas en la esquina",
    "Escombros abandonados en el andén",
    "Punto crítico de residuos junto al parque",
    "Contenedor sin recolección hace una semana",
  ],
  vias: [
    "Hueco en la vía principal",
    "Andén destruido frente al colegio",
    "Hueco profundo en la calle del mercado",
    "Falta señalización en cruce peligroso",
  ],
  alumbrado: [
    "Parque sin iluminación",
    "Luminaria apagada en toda la cuadra",
    "Poste de luz vandalizado",
    "Alumbrado insuficiente en el callejón",
  ],
  agua: [
    "Inundación recurrente cuando llueve",
    "Alcantarilla tapada y desbordada",
    "Fuga de agua en la vía pública",
    "Canal sin mantenimiento junto a las casas",
  ],
  parques: [
    "Juegos infantiles en mal estado",
    "Zona verde sin mantenimiento",
    "Parque sin bancas ni sombra",
    "Cancha deportiva deteriorada",
  ],
  movilidad: [
    "Semáforo fuera de servicio",
    "Paradero de bus sin techo",
    "Cruce peatonal inseguro",
    "Ciclorruta invadida por vehículos",
  ],
  seguridad: [
    "Punto crítico de inseguridad nocturna",
    "Espacio público ocupado indebidamente",
    "Solicitud de mayor presencia en el sector",
    "Ruido excesivo en zona residencial",
  ],
  equipamientos: [
    "Salón comunal sin servicio de agua",
    "Puesto de salud requiere dotación",
    "Biblioteca comunitaria sin internet",
    "Escenario deportivo cerrado al público",
  ],
  economia: [
    "Propuesta de feria de emprendimiento",
    "Necesidad de apoyo a tenderos del barrio",
    "Solicitud de capacitación laboral",
    "Zona comercial sin condiciones de aseo",
  ],
  ideas: [
    "Idea: ciclovía dominical en el malecón",
    "Propuesta: huertas comunitarias",
    "Idea: murales y cultura en el barrio",
    "Propuesta: parques inclusivos",
  ],
  otro: [
    "Situación por clasificar",
    "Solicitud general de la comunidad",
    "Reporte comunitario adicional",
    "Caso pendiente de categoría",
  ],
};

const DESCRIPTIONS: Record<ReportCategoryId, string> = {
  basuras:
    "Los vecinos del sector han identificado este punto crítico. La acumulación genera malos olores y presencia de vectores, especialmente en las horas de la tarde.",
  vias: "El deterioro de la vía afecta el paso de vehículos, motos y peatones. En época de lluvia la situación empeora y se convierte en un riesgo para quien transita por el sector.",
  alumbrado:
    "La zona queda completamente oscura después de las 6:30 p.m. Los habitantes piden revisar el circuito de alumbrado y recuperar la iluminación del espacio público.",
  agua: "Cada vez que llueve con intensidad el agua se represa y entra a las viviendas del sector. Se requiere limpieza del sistema de drenaje y revisión del canal.",
  parques:
    "El espacio público es el único punto de encuentro de la comunidad, pero el mobiliario y las zonas verdes están deteriorados. Las familias piden recuperarlo.",
  movilidad:
    "El punto presenta congestión y riesgo permanente. Se solicita revisión de la señalización y acompañamiento de tránsito en horas pico.",
  seguridad:
    "La comunidad reporta situaciones recurrentes en el sector. Solicitan acompañamiento institucional y actividades de prevención con jóvenes y familias.",
  equipamientos:
    "El equipamiento atiende a decenas de familias del barrio pero no cuenta con las condiciones mínimas para su funcionamiento. Se solicita intervención.",
  economia:
    "Los emprendedores locales necesitan espacios de comercialización y formación. El barrio tiene potencial productivo sin aprovechar.",
  ideas:
    "La propuesta nace de un grupo de vecinos y busca aprovechar el espacio público como escenario de encuentro, cultura y actividad económica local.",
  otro: "La comunidad reporta esta situación para que sea clasificada y atendida por el equipo de la plataforma.",
};

const PHOTOS: Record<ReportCategoryId, string[]> = {
  basuras: [MEDIA.reporteBasuras, MEDIA.parqueBarrio],
  vias: [MEDIA.reporteHueco, MEDIA.movilidad],
  alumbrado: [MEDIA.reporteAlumbrado, MEDIA.parqueBarrio],
  agua: [MEDIA.reporteAgua, MEDIA.rondaSinu],
  parques: [MEDIA.parqueBarrio, MEDIA.ciudadania],
  movilidad: [MEDIA.movilidad, MEDIA.aerea],
  seguridad: [MEDIA.reporteAlumbrado, MEDIA.ciudadania],
  equipamientos: [MEDIA.ciudadania, MEDIA.parqueBarrio],
  economia: [MEDIA.movilidad, MEDIA.ciudadania],
  ideas: [MEDIA.ciudadania, MEDIA.rondaSinu],
  otro: [MEDIA.aerea, MEDIA.ciudadania],
};

const RESPONSIBLES = [
  "Equipo de atención ciudadana",
  "Montería Puede Más",
  "Secretaría de Infraestructura",
  "Servicio de aseo y ambiente",
  "Alumbrado público municipal",
  "Comunidad y aliados del barrio",
];

const UPDATES: Record<ReportStatus, string> = {
  recibido: "Tu reporte entró a la plataforma y quedó ubicado en el mapa de Montería.",
  validado: "Se verificó la información, las fotografías y el punto exacto del reporte.",
  "en-revision": "El caso se analiza con la entidad responsable del tema reportado.",
  asignado: "Se asignó el caso a un equipo de trabajo con fecha de atención.",
  "en-ejecucion": "La solución está en marcha y la comunidad participa en el seguimiento.",
  resuelto: "La situación fue atendida y verificada con líderes del barrio.",
};

/** PRNG determinista: el mock es estable entre renders y recargas. */
const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const STATUS_DISTRIBUTION: ReportStatus[] = [
  "recibido",
  "recibido",
  "validado",
  "validado",
  "en-revision",
  "en-revision",
  "asignado",
  "en-ejecucion",
  "en-ejecucion",
  "resuelto",
];

const daysAgo = (days: number, hourOffset = 0) =>
  new Date(Date.now() - days * 86400000 - hourOffset * 3600000).toISOString();

const buildTimeline = (
  status: ReportStatus,
  createdAt: string,
  rand: () => number,
): TimelineEntry[] => {
  const currentIndex = STATUS_ORDER.indexOf(status);
  const base = new Date(createdAt).getTime();
  return REPORT_STATUSES.map((stage, index) => ({
    status: stage.id,
    date: new Date(base + index * 2.4 * 86400000).toISOString(),
    responsible: RESPONSIBLES[Math.floor(rand() * RESPONSIBLES.length)],
    update: UPDATES[stage.id],
    done: index <= currentIndex,
  }));
};

const CATEGORY_CYCLE: ReportCategoryId[] = [
  "basuras",
  "vias",
  "alumbrado",
  "agua",
  "parques",
  "movilidad",
  "seguridad",
  "equipamientos",
  "economia",
  "ideas",
  "basuras",
  "vias",
];

const buildReports = (): Report[] => {
  const reports: Report[] = [];
  const rand = mulberry32(20260925);
  let caseIndex = 1307;

  BARRIOS.forEach((barrio, barrioIndex) => {
    const perBarrio = barrioIndex < 8 ? 4 : barrioIndex < 16 ? 3 : 2;
    for (let i = 0; i < perBarrio; i += 1) {
      const category = CATEGORY_CYCLE[(barrioIndex + i) % CATEGORY_CYCLE.length];
      const titles = TITLES[category];
      const title = titles[(barrioIndex + i) % titles.length];
      const status = STATUS_DISTRIBUTION[(barrioIndex * 3 + i) % STATUS_DISTRIBUTION.length];
      const ageDays = Math.round(rand() * 58) + 1;
      const createdAt = daysAgo(ageDays, Math.round(rand() * 20));
      const jitter = 0.004;
      const coords: GeoPoint = {
        lat: barrio.coords.lat + (rand() - 0.5) * jitter,
        lng: barrio.coords.lng + (rand() - 0.5) * jitter,
      };
      const caseNumber = `MPM-2026-${String(caseIndex).padStart(6, "0")}`;
      caseIndex -= 1;

      reports.push({
        id: caseNumber,
        caseNumber,
        title,
        description: DESCRIPTIONS[category],
        category,
        barrio: barrio.name,
        comuna: barrio.comuna,
        address: `Calle ${10 + ((barrioIndex * 3 + i) % 60)} # ${4 + (i % 12)}-${20 + ((barrioIndex + i) % 60)}`,
        coords,
        status,
        createdAt,
        updatedAt: daysAgo(Math.max(0, ageDays - Math.round(rand() * 6))),
        photos: PHOTOS[category],
        supports: 4 + Math.round(rand() * 96),
        comments: Math.round(rand() * 18),
        officialResponse:
          status === "resuelto" || status === "en-ejecucion"
            ? `El caso fue atendido por el equipo responsable. En ${barrio.name} se ejecutó la intervención con seguimiento de la comunidad y de los líderes del sector.`
            : undefined,
        timeline: buildTimeline(status, createdAt, rand),
      });
    }
  });

  return reports;
};

export const REPORTS: Report[] = buildReports();

export const MY_REPORT_IDS = REPORTS.slice(0, 4).map((report) => report.id);

export const REPORTS_WITH_OWNER: Report[] = REPORTS.map((report) =>
  MY_REPORT_IDS.includes(report.id) ? { ...report, isMine: true } : report,
);

export const NEXT_CASE_NUMBER = `MPM-2026-${String(1307 + REPORTS.length + 1).padStart(6, "0")}`;

export const DEFAULT_MAP_POINT = MONTERIA_CENTER;
