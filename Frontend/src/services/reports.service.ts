import { ApiError, request } from "./api-client";
import type { Report, ReportDraftInput, ReportFilters, ReportStatus } from "@/types";

const queryOf = (filters: ReportFilters = {}, extra?: Record<string, string>) => {
  const params = new URLSearchParams(extra);
  if (filters.categories?.length) params.set("categories", filters.categories.join(","));
  if (filters.status?.length) params.set("status", filters.status.join(","));
  if (filters.barrio) params.set("barrio", filters.barrio);
  if (filters.query) params.set("q", filters.query);
  const text = params.toString();
  return text ? `?${text}` : "";
};

export const reportsService = {
  async list(filters?: ReportFilters): Promise<Report[]> {
    return request<Report[]>(`/v1/reportes${queryOf(filters)}`);
  },

  async listLatest(limit = 6): Promise<Report[]> {
    return request<Report[]>(`/v1/reportes${queryOf({}, { limit: String(limit) })}`);
  },

  async listMine(): Promise<Report[]> {
    return request<Report[]>("/v1/reportes?mios=true");
  },

  async getById(id: string): Promise<Report | null> {
    try {
      return await request<Report>(`/v1/reportes/${encodeURIComponent(id)}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  },

  async getRelated(id: string): Promise<Report[]> {
    return request<Report[]>(`/v1/reportes/${encodeURIComponent(id)}/relacionados`);
  },

  async countByCategory(): Promise<Record<string, number>> {
    return request<Record<string, number>>("/v1/reportes/conteos/categoria");
  },

  async countsByBarrio(): Promise<Record<string, number>> {
    return request<Record<string, number>>("/v1/reportes/conteos/barrio");
  },

  async countsByStatus(): Promise<Record<ReportStatus, number>> {
    return request<Record<ReportStatus, number>>("/v1/reportes/conteos/estado");
  },

  async create(input: ReportDraftInput): Promise<Report> {
    return request<Report>("/v1/reportes", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  async support(id: string): Promise<Report | null> {
    return request<Report>(`/v1/reportes/${encodeURIComponent(id)}/apoyo`, { method: "POST" });
  },

  async submitFeedback(id: string, useful: boolean): Promise<{ id: string; useful: boolean }> {
    return { id, useful };
  },
};
