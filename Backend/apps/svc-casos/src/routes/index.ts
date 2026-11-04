import type { FastifyInstance } from "fastify";
import { notImplemented } from "@mpm/shared";

export function registerRoutes(app: FastifyInstance) {
  app.get("/v1/casos/reportes/:reportId/historial", notImplemented("HU-E6-03"));
  app.post("/v1/casos/:caseId/transiciones", notImplemented("HU-E6-02"));
  app.patch("/v1/casos/:caseId", notImplemented("HU-E6-04"));
}
