import { useEffect, useRef } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import { LocateFixed, Minus, Plus } from "lucide-react";
import {
  DEFAULT_MAP_LAYER,
  MAP_LAYERS,
  MAP_VIEW,
  getCategoryHex,
  isPointInMonteria,
  locateUser,
} from "@/services/map-provider";
import { cn } from "@/lib/utils";
import type { GeoPoint, Report, ReportCategoryId } from "@/types";

interface MapCanvasProps {
  reports: Report[];
  className?: string;
  onSelect?: (report: Report) => void;
  selectedId?: string;
  layerId?: string;
  mode?: "clusters" | "single";
  interactive?: boolean;
  showControls?: boolean;
  onMapClick?: (point: GeoPoint) => void;
  pickerPoint?: GeoPoint;
  center?: GeoPoint;
  zoom?: number;
}

/** Categoría por marcador: la usa el cluster para elegir su color dominante. */
const markerCategory = new WeakMap<L.Marker, ReportCategoryId>();

const markerIcon = (category: ReportCategoryId, active: boolean) => {
  const hex = getCategoryHex(category);
  const size = active ? 34 : 24;
  return L.divIcon({
    className: "mpm-marker",
    html: `<span class="mpm-pin" style="display:block;width:${size}px;height:${size}px;border-radius:9999px;background:${hex};border:3px solid #fff;box-shadow:0 8px 18px -8px rgba(0,32,64,.6)"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const clusterIcon = (count: number, category: ReportCategoryId) => {
  const hex = getCategoryHex(category);
  const size = count >= 20 ? 58 : count >= 10 ? 50 : 44;
  const halo =
    count >= 10
      ? `<span class="absolute inset-0 rounded-full" style="background:${hex};opacity:.35;animation:pulse-ring 2.6s cubic-bezier(.22,1,.36,1) infinite"></span>`
      : "";
  return L.divIcon({
    className: "mpm-marker",
    html: `<span class="relative flex items-center justify-center" style="width:${size}px;height:${size}px">${halo}<span class="cluster-bubble" style="position:relative;width:${size - 10}px;height:${size - 10}px;background:${hex};font-size:${count >= 10 ? 15 : 14}px">${count}</span></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

/**
 * Mapa interactivo real (Leaflet) con clusters, marcadores por categoría
 * y capa de tiles conmutable. La configuración del proveedor vive en
 * `services/map-provider.ts` para poder migrar a Mapbox sin tocar esta pieza.
 */
export const MapCanvas = ({
  reports,
  className,
  onSelect,
  selectedId,
  layerId,
  mode = "clusters",
  interactive = true,
  showControls = true,
  onMapClick,
  pickerPoint,
  center = MAP_VIEW.center,
  zoom = MAP_VIEW.zoom,
}: MapCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const pickerRef = useRef<L.Marker | null>(null);
  const onSelectRef = useRef(onSelect);
  const onMapClickRef = useRef(onMapClick);

  onSelectRef.current = onSelect;
  onMapClickRef.current = onMapClick;

  // Inicialización del mapa (una sola vez).
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [center.lat, center.lng],
      zoom,
      minZoom: MAP_VIEW.minZoom,
      maxZoom: MAP_VIEW.maxZoom,
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: interactive,
      dragging: interactive,
    });
    mapRef.current = map;

    const layer = MAP_LAYERS.find((item) => item.id === layerId) ?? DEFAULT_MAP_LAYER;
    tileRef.current = L.tileLayer(layer.url, {
      attribution: layer.attribution,
      maxZoom: layer.maxZoom,
      subdomains: layer.subdomains ?? "abc",
    }).addTo(map);

    layerGroupRef.current = L.layerGroup().addTo(map);
    clusterRef.current = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      disableClusteringAtZoom: 15,
      maxClusterRadius: 54,
      iconCreateFunction: (cluster) => {
        const children = cluster.getAllChildMarkers();
        const counts = children.reduce<Record<string, number>>((accumulator, child) => {
          const category = markerCategory.get(child) ?? "otro";
          accumulator[category] = (accumulator[category] ?? 0) + 1;
          return accumulator;
        }, {});
        const dominant = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ??
          "otro") as ReportCategoryId;
        return clusterIcon(cluster.getChildCount(), dominant);
      },
    });
    map.addLayer(clusterRef.current);

    map.on("click", (event: L.LeafletMouseEvent) => {
      onMapClickRef.current?.({ lat: event.latlng.lat, lng: event.latlng.lng });
    });

    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
      clusterRef.current = null;
      layerGroupRef.current = null;
      tileRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cambio de capa base.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const layer = MAP_LAYERS.find((item) => item.id === layerId) ?? DEFAULT_MAP_LAYER;
    if (tileRef.current) map.removeLayer(tileRef.current);
    tileRef.current = L.tileLayer(layer.url, {
      attribution: layer.attribution,
      maxZoom: layer.maxZoom,
      subdomains: layer.subdomains ?? "abc",
    }).addTo(map);
  }, [layerId]);

  // Marcadores y clusters según los reportes visibles.
  useEffect(() => {
    const map = mapRef.current;
    const clusterGroup = clusterRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !clusterGroup || !layerGroup) return;

    clusterGroup.clearLayers();
    layerGroup.clearLayers();

    reports.forEach((report) => {
      const marker = L.marker([report.coords.lat, report.coords.lng], {
        icon: markerIcon(report.category, report.id === selectedId),
        riseOnHover: true,
      });
      markerCategory.set(marker, report.category);
      marker.on("click", () => onSelectRef.current?.(report));
      if (mode === "single" || !interactive) {
        marker.addTo(layerGroup);
      } else {
        clusterGroup.addLayer(marker);
      }
    });
  }, [interactive, mode, reports, selectedId]);

  // Pin del selector de ubicación (wizard).
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!pickerPoint) {
      if (pickerRef.current) {
        map.removeLayer(pickerRef.current);
        pickerRef.current = null;
      }
      return;
    }
    const icon = L.divIcon({
      className: "mpm-marker",
      html: `<span class="mpm-pin" style="display:block;width:30px;height:30px;border-radius:9999px 9999px 9999px 0;transform:rotate(-45deg);background:hsl(358 85% 52%);border:3px solid #fff;box-shadow:0 10px 20px -8px rgba(0,32,64,.6)"></span>`,
      iconSize: [30, 30],
      iconAnchor: [15, 28],
    });
    const target = L.latLng(pickerPoint.lat, pickerPoint.lng);
    if (map.distance(map.getCenter(), target) > 500) {
      map.setView(target, Math.max(map.getZoom(), 15), { animate: true });
    }
    if (pickerRef.current) {
      pickerRef.current.setLatLng(target);
      pickerRef.current.setIcon(icon);
    } else {
      pickerRef.current = L.marker([pickerPoint.lat, pickerPoint.lng], {
        icon,
        draggable: true,
      }).addTo(map);
      pickerRef.current.on("dragend", () => {
        const position = pickerRef.current?.getLatLng();
        if (position) onMapClickRef.current?.({ lat: position.lat, lng: position.lng });
      });
    }
  }, [pickerPoint]);

  const locate = () => {
    void locateUser()
      .then((point) => {
        if (!isPointInMonteria(point)) {
          mapRef.current?.setView([center.lat, center.lng], zoom, { animate: true });
          return;
        }
        mapRef.current?.setView([point.lat, point.lng], 16, { animate: true });
        onMapClickRef.current?.(point);
      })
      .catch(() => {
        mapRef.current?.setView([center.lat, center.lng], zoom, { animate: true });
      });
  };

  return (
    <div className={cn("relative h-full w-full", className)}>
      <div ref={containerRef} className="h-full w-full" role="application" aria-label="Mapa de reportes ciudadanos de Montería" />

      {showControls ? (
        <div className="absolute left-4 top-4 z-[700] flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-background/95 shadow-card backdrop-blur">
          <button
            type="button"
            onClick={() => mapRef.current?.zoomIn()}
            aria-label="Acercar el mapa"
            className="flex h-11 w-11 items-center justify-center text-primary transition-colors hover:bg-tint"
          >
            <Plus className="h-4 w-4" aria-hidden />
          </button>
          <span className="h-px bg-border" aria-hidden />
          <button
            type="button"
            onClick={() => mapRef.current?.zoomOut()}
            aria-label="Alejar el mapa"
            className="flex h-11 w-11 items-center justify-center text-primary transition-colors hover:bg-tint"
          >
            <Minus className="h-4 w-4" aria-hidden />
          </button>
          <span className="h-px bg-border" aria-hidden />
          <button
            type="button"
            onClick={locate}
            aria-label="Centrar en mi ubicación"
            className="flex h-11 w-11 items-center justify-center text-primary transition-colors hover:bg-tint"
          >
            <LocateFixed className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
};
