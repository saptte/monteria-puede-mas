import { Timeline } from "@/components/common/timeline";
import { STATUS_MAP } from "@/data/categories";
import type { Report } from "@/types";

/** Línea de tiempo del caso: recibido → validado → en revisión → asignado → en ejecución → resuelto. */
export const ReportTimeline = ({ report }: { report: Report }) => (
  <Timeline
    items={report.timeline.map((entry) => ({
      label: STATUS_MAP[entry.status]?.label ?? entry.status,
      date: entry.date,
      responsible: entry.responsible,
      update: entry.update,
      done: entry.done,
      colorClass: STATUS_MAP[entry.status]?.colorClass.replace("text-", "bg-"),
    }))}
  />
);
