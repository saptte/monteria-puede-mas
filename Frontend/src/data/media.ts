/**
 * Fotografías de Montería (generadas para la plataforma).
 * Centralizadas para que el día que exista un CMS solo cambie este archivo.
 */
export const MEDIA = {
  catedral: "https://cdn.enter.pro/resources/uid_100528289/monteria-catedral_07019459.png",
  rondaSinu: "https://cdn.enter.pro/resources/uid_100528289/monteria-ronda-sinu_2ca8486d.png",
  ciudadania: "https://cdn.enter.pro/resources/uid_100528289/monteria-ciudadania_3ffb7599.png",
  parqueBarrio: "https://cdn.enter.pro/resources/uid_100528289/monteria-parque-barrio_0a82cd50.png",
  movilidad: "https://cdn.enter.pro/resources/uid_100528289/monteria-movilidad_567b1d38.png",
  aerea: "https://cdn.enter.pro/resources/uid_100528289/monteria-aerea_fb2e6a9d.png",
  reporteBasuras: "https://cdn.enter.pro/resources/uid_100528289/reporte-basuras_081d5183.png",
  reporteHueco: "https://cdn.enter.pro/resources/uid_100528289/reporte-hueco_5001b79e.png",
  reporteAlumbrado: "https://cdn.enter.pro/resources/uid_100528289/reporte-alumbrado_2af2e5db.png",
  reporteAgua: "https://cdn.enter.pro/resources/uid_100528289/reporte-agua_25787a43.png",
  logo: "https://cdn.enter.pro/resources/uid_100528289/66b3b489-d2b7-47.jpeg",
} as const;

export type MediaKey = keyof typeof MEDIA;
