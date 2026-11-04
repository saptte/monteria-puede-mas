import type { FastifyInstance } from "fastify";
import { notImplemented, readToken, requireCiudadano } from "@mpm/shared";
import { commentPost, listComments, listWall, publishTopic, supportPost } from "../store.js";

export function registerRoutes(app: FastifyInstance) {
  app.get("/v1/participacion/muro", async (request) => {
    const query = request.query as { kind?: string };
    const kind = query.kind?.trim().toLowerCase();
    const allowed = new Set(["tema", "reporte", "apoyo"]);
    return listWall(readToken(request)?.sub, kind && allowed.has(kind) ? kind : undefined);
  });

  app.post("/v1/participacion/muro", async (request) => {
    const token = requireCiudadano(request);
    const body = request.body as {
      title?: string;
      body?: string;
      category?: string;
      barrio?: string;
    };
    return publishTopic(token.sub, {
      title: body.title ?? "",
      body: body.body ?? "",
      category: body.category,
      barrio: body.barrio,
    });
  });

  app.get("/v1/participacion/muro/:id/comentarios", async (request) => {
    const { id } = request.params as { id: string };
    return listComments(id, readToken(request)?.sub);
  });

  app.post("/v1/participacion/muro/:id/comentarios", async (request) => {
    const token = requireCiudadano(request);
    const { id } = request.params as { id: string };
    const body = request.body as { body?: string };
    return commentPost(id, token.sub, body.body ?? "");
  });

  app.post("/v1/participacion/muro/:id/apoyo", async (request) => {
    const token = requireCiudadano(request);
    const { id } = request.params as { id: string };
    return supportPost(id, token.sub);
  });

  app.get("/v1/participacion/me/resumen", notImplemented("HU-E9-03"));
  app.get("/v1/participacion/me", notImplemented("HU-E9-02"));
  app.get("/v1/participacion/reportes/:reportId/conteo", notImplemented("HU-E9-01"));
  app.post("/v1/participacion", notImplemented("HU-E9-01"));
  app.delete("/v1/participacion/:id", notImplemented("HU-E9-02"));
}
