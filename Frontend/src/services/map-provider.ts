import { MONTERIA_BOUNDS, MONTERIA_CENTER, MONTERIA_ZOOM } from "@/data/barrios";
import type { GeoPoint, ReportCategoryId } from "@/types";

/**
 * Configuración del mapa abstraída del proveedor.
 * Hoy se usa Leaflet con tiles abiertos; para migrar a Mapbox basta con añadir
 * una capa con su `url` y token público, sin tocar los componentes del mapa.
 */
export interface MapTileLayer {
  id: string;
  name: string;
  url: string;
  attribution: string;
  maxZoom: number;
  subdomains?: string;
}

export const MAP_LAYERS: MapTileLayer[] = [
  {
    id: "calles",
    name: "Calles",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
    maxZoom: 19,
  },
  {
    id: "claro",
    name: "Claro",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
    maxZoom: 16,
  },
  {
    id: "satelite",
    name: "Satélite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
    maxZoom: 18,
  },
];

export const DEFAULT_MAP_LAYER = MAP_LAYERS[0];

export const MAP_VIEW = {
  center: MONTERIA_CENTER,
  zoom: MONTERIA_ZOOM,
  minZoom: 11,
  maxZoom: 18,
  bounds: MONTERIA_BOUNDS,
};

/** Color hex por categoría: se usa en marcadores y clusters (divIcon). */
export const CATEGORY_HEX: Record<ReportCategoryId, string> = {
  basuras: "#ED1C24",
  vias: "#F5A524",
  alumbrado: "#0057A8",
  agua: "#0EA5C6",
  parques: "#2E9E63",
  movilidad: "#F2740F",
  seguridad: "#7C3AED",
  equipamientos: "#D6408E",
  economia: "#0F9E8E",
  ideas: "#FFC61E",
  otro: "#8A94A6",
};

export const getCategoryHex = (category: ReportCategoryId): string =>
  CATEGORY_HEX[category] ?? CATEGORY_HEX.otro;

export const isPointInMonteria = ({ lat, lng }: GeoPoint): boolean =>
  lat >= MONTERIA_BOUNDS[0][0] &&
  lat <= MONTERIA_BOUNDS[1][0] &&
  lng >= MONTERIA_BOUNDS[0][1] &&
  lng <= MONTERIA_BOUNDS[1][1];

export const MAP_DEFAULT_POINT: GeoPoint = MONTERIA_CENTER;

/** Ubicación del navegador sin GPS de alta precisión, que en computador suele agotar el tiempo. */
export function locateUser(): Promise<GeoPoint> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(Object.assign(new Error("unsupported"), { code: 0 }));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
      (error) => reject(error),
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 5 * 60 * 1000 },
    );
  });
}
