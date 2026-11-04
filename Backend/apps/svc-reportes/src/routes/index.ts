import type { FastifyInstance } from "fastify";
import { AppError, readToken, requireCiudadano } from "@mpm/shared";
import { createReport, getReport, listReports, supportReport, toReport } from "../store.js";

function filtersOf(query: Record<string, string | undefined>) {
  return {
    categories: query.categories?.split(",").filter(Boolean),
    status: query.status?.split(",").filter(Boolean),
    barrio: query.barrio,
    query: query.q,
    limit: query.limit ? Number(query.limit) : undefined,
  };
}

export function registerRoutes(app: FastifyInstance) {
  app.get("/v1/reportes/conteos/categoria", async () => {
    const rows = await listReports({});
    return rows.reduce<Record<string, number>>((accumulator, row) => {
      const key = row.category ?? "otro";
      accumulator[key] = (accumulator[key] ?? 0) + 1;
      return accumulator;
    }, {});
  });

  app.get("/v1/reportes/conteos/barrio", async () => {
    const rows = await listReports({});
    return rows.reduce<Record<string, number>>((accumulator, row) => {
      const key = row.barrio ?? "Sin barrio";
      accumulator[key] = (accumulator[key] ?? 0) + 1;
      return accumulator;
    }, {});
  });

  app.get("/v1/reportes/conteos/estado", async () => {
    const rows = await listReports({});
    const base: Record<string, number> = {
      recibido: 0,
      validado: 0,
      "en-revision": 0,
      asignado: 0,
      "en-ejecucion": 0,
      resuelto: 0,
    };
    for (const row of rows) {
      const report = toReport(row);
      base[report.status] = (base[report.status] ?? 0) + 1;
    }
    return base;
  });

  app.get("/v1/reportes", async (request) => {
    const query = request.query as Record<string, string | undefined>;
    const token = readToken(request);
    const rows = await listReports({
      ...filtersOf(query),
      citizenId: query.mios === "true" ? requireCiudadano(request).sub : undefined,
    });
    return rows.map((row) => toReport(row, token?.sub));
  });

  app.get("/v1/reportes/:caseNumber/relacionados", async (request) => {
    const { caseNumber } = request.params as { caseNumber: string };
    const current = await getReport(caseNumber);
    if (!current) return [];
    const rows = await listReports({ categories: current.category ? [current.category] : [] });
    return rows
      .filter((row) => row.case_number !== current.case_number)
      .slice(0, 3)
      .map((row) => toReport(row));
  });

  app.get("/v1/reportes/:caseNumber", async (request) => {
    const { caseNumber } = request.params as { caseNumber: string };
    const token = readToken(request);
    const row = await getReport(caseNumber);
    if (!row) throw new AppError(404, "NOT_FOUND", "No encontramos ese reporte.");
    return toReport(row, token?.sub);
  });

  app.post("/v1/reportes", async (request) => {
    const token = requireCiudadano(request);
    const body = request.body as {
      title?: string;
      description?: string;
      category?: string;
      barrio?: string;
      address?: string;
      coords?: { lat?: number; lng?: number };
      consent?: boolean;
    };
    const caseNumber = await createReport(token.sub, {
      title: body.title ?? "",
      description: body.description ?? "",
      category: body.category ?? "",
      barrio: body.barrio ?? "",
      address: body.address ?? "",
      lat: Number(body.coords?.lat ?? 8.75),
      lng: Number(body.coords?.lng ?? -75.88),
      consent: Boolean(body.consent),
    });
    const row = await getReport(caseNumber);
    if (!row) throw new AppError(500, "INTERNAL", "El reporte se guardó, pero no se pudo leer.");
    return toReport(row, token.sub);
  });

  app.post("/v1/reportes/:caseNumber/apoyo", async (request) => {
    const token = requireCiudadano(request);
    const { caseNumber } = request.params as { caseNumber: string };
    const row = await supportReport(caseNumber, token.sub);
    if (!row) throw new AppError(404, "NOT_FOUND", "No encontramos ese reporte.");
    return toReport(row, token.sub);
  });
}
