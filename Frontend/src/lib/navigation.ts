import { Home, Map, Megaphone, MessageCircle, UserRound, type LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  short?: string;
}

/** Navegación principal de la plataforma. */
export const NAV_ITEMS: NavItem[] = [
  { label: "Inicio", path: "/", short: "Inicio" },
  { label: "El Muro", path: "/muro", short: "Muro" },
  { label: "Montería Habla", path: "/monteria-habla", short: "Habla" },
  { label: "Montería Hace", path: "/monteria-hace", short: "Hace" },
  { label: "Montería Resuelve", path: "/monteria-resuelve", short: "Resuelve" },
  { label: "El Mapa de Montería", path: "/mapa", short: "Mapa" },
  { label: "Sobre la plataforma", path: "/sobre-la-plataforma", short: "Sobre" },
];

export interface MobileTab {
  label: string;
  path: string;
  icon: LucideIcon;
  highlight?: boolean;
}

/** Navegación inferior móvil: el botón de reportar sobresale. */
export const MOBILE_TABS: MobileTab[] = [
  { label: "Inicio", path: "/", icon: Home },
  { label: "Mapa", path: "/mapa", icon: Map },
  { label: "Reportar", path: "/reportar", icon: Megaphone, highlight: true },
  { label: "Muro", path: "/muro", icon: MessageCircle },
  { label: "Mi cuenta", path: "/mi-monteria", icon: UserRound },
];
