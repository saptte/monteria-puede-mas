/** Utilidades de formato para toda la plataforma (es-CO). */

export const formatNumber = (value: number) => value.toLocaleString("es-CO");

export const formatDate = (value: string, options?: Intl.DateTimeFormatOptions) =>
  new Date(value).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    ...options,
  });

export const formatShortDate = (value: string) =>
  new Date(value).toLocaleDateString("es-CO", { day: "2-digit", month: "short" });

/** "Hace 2 horas", "Hace 3 días"… para listados ciudadanos. */
export const timeAgo = (value: string) => {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "Hace un momento";
  if (minutes < 60) return `Hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
  const days = Math.round(hours / 24);
  if (days < 30) return `Hace ${days} ${days === 1 ? "día" : "días"}`;
  const months = Math.round(days / 30);
  return `Hace ${months} ${months === 1 ? "mes" : "meses"}`;
};
