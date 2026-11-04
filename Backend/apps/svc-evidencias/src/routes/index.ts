import type { FastifyInstance } from "fastify";
import { notImplemented } from "@mpm/shared";

export function registerRoutes(app: FastifyInstance) {
  app.post("/v1/evidencias/reportes/:reportId", notImplemented("HU-E5-01"));
  app.get("/v1/evidencias/reportes/:reportId", notImplemented("HU-E5-02"));
}
