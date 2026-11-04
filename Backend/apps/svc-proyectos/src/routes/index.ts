import type { FastifyInstance } from "fastify";
import { notImplemented } from "@mpm/shared";

export function registerRoutes(app: FastifyInstance) {
  app.post("/v1/proyectos", notImplemented("HU-E7-01"));
  app.get("/v1/proyectos", notImplemented("HU-E7-03"));
  app.get("/v1/proyectos/:projectId", notImplemented("HU-E7-02"));
  app.patch("/v1/proyectos/:projectId", notImplemented("HU-E7-03"));
  app.post("/v1/proyectos/:projectId/reportes", notImplemented("HU-E7-02"));
}
