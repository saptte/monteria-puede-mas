import { request } from "./api-client";
import type { WallDraft, WallKind, WallPost } from "@/types";

export const wallService = {
  list(kind?: WallKind): Promise<WallPost[]> {
    const query = kind ? `?kind=${kind}` : "";
    return request<WallPost[]>(`/v1/participacion/muro${query}`);
  },

  publish(input: WallDraft): Promise<WallPost> {
    return request<WallPost>("/v1/participacion/muro", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  support(id: string): Promise<WallPost> {
    return request<WallPost>(`/v1/participacion/muro/${id}/apoyo`, { method: "POST" });
  },

  comments(id: string): Promise<WallPost[]> {
    return request<WallPost[]>(`/v1/participacion/muro/${id}/comentarios`);
  },

  comment(id: string, body: string): Promise<WallPost> {
    return request<WallPost>(`/v1/participacion/muro/${id}/comentarios`, {
      method: "POST",
      body: JSON.stringify({ body }),
    });
  },
};
