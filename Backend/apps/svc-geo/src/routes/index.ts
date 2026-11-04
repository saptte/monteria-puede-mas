import type { FastifyInstance } from "fastify";
import { notImplemented } from "@mpm/shared";

export function registerRoutes(app: FastifyInstance) {
  app.get("/v1/geo/reportes/cercanos", notImplemented("HU-E4-03"));
  app.get("/v1/geo/reportes", notImplemented("HU-E4-02"));
  app.post("/v1/geo/reportes/:reportId/ubicacion", notImplemented("HU-E4-01"));
}
