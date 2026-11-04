import type { Barrio, GeoPoint } from "@/types";

/** Centro de Montería (Córdoba, Colombia). */
export const MONTERIA_CENTER: GeoPoint = { lat: 8.748, lng: -75.8814 };

export const MONTERIA_BOUNDS: [[number, number], [number, number]] = [
  [8.69, -75.94],
  [8.82, -75.82],
];

export const MONTERIA_ZOOM = 13;

type BarrioSeed = [string, string, number, number, number];

// name, comuna, lat, lng, reports
const SEEDS: BarrioSeed[] = [
  ["Centro", "Comuna 1", 8.7495, -75.8835, 248],
  ["La Granja", "Comuna 6", 8.7385, -75.8725, 176],
  ["Vallejo", "Comuna 6", 8.7462, -75.8688, 6],
  ["El Recreo", "Comuna 4", 8.7575, -75.8675, 142],
  ["Mocarí", "Comuna 7", 8.7655, -75.8945, 118],
  ["Pasatiempo", "Comuna 5", 8.7425, -75.9015, 103],
  ["La Castellana", "Comuna 4", 8.7625, -75.8615, 96],
  ["Sucre", "Comuna 2", 8.7415, -75.8895, 88],
  ["Mogambo", "Comuna 8", 8.7715, -75.8765, 74],
  ["Cantaclaro", "Comuna 3", 8.7535, -75.8955, 68],
  ["La Julia", "Comuna 6", 8.7335, -75.8795, 61],
  ["Los Garzones", "Comuna 9", 8.7855, -75.8655, 54],
  ["Brisas del Sinú", "Comuna 8", 8.7755, -75.8855, 49],
  ["Los Álamos", "Comuna 5", 8.7475, -75.9075, 44],
  ["Villa Cielo", "Comuna 9", 8.7795, -75.8715, 38],
  ["Nueva Lucía", "Comuna 7", 8.7685, -75.9015, 34],
  ["El Prado", "Comuna 2", 8.7355, -75.8935, 31],
  ["Kennedy", "Comuna 3", 8.7575, -75.9045, 28],
  ["Furatena", "Comuna 6", 8.7295, -75.8705, 24],
  ["Rancho Grande", "Comuna 4", 8.7645, -75.8555, 21],
  ["Sevilla", "Comuna 5", 8.7445, -75.9115, 18],
  ["Urbina", "Comuna 8", 8.7805, -75.8905, 15],
  ["Santa Fe", "Comuna 1", 8.7545, -75.8785, 12],
  ["La Esperanza", "Comuna 9", 8.7885, -75.8605, 9],
  ["El Dorado", "Comuna 7", 8.7725, -75.9085, 7],
];

export const BARRIOS: Barrio[] = SEEDS.map(([name, comuna, lat, lng, reports]) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name,
  comuna,
  coords: { lat, lng },
  reports,
}));

export const BARRIO_NAMES = BARRIOS.map((barrio) => barrio.name);

export const COMUNAS = Array.from(new Set(BARRIOS.map((barrio) => barrio.comuna)));

export const findBarrio = (name: string): Barrio | undefined =>
  BARRIOS.find((barrio) => barrio.name.toLowerCase() === name.toLowerCase());

/** Barrio de la lista más cercano a un punto marcado en el mapa. */
export const nearestBarrio = (point: GeoPoint): Barrio =>
  BARRIOS.reduce((closest, barrio) => {
    const closestDistance = (closest.coords.lat - point.lat) ** 2 + (closest.coords.lng - point.lng) ** 2;
    const distance = (barrio.coords.lat - point.lat) ** 2 + (barrio.coords.lng - point.lng) ** 2;
    return distance < closestDistance ? barrio : closest;
  });
