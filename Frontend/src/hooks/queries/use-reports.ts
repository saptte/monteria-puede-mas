import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reportsService } from "@/services/reports.service";
import type { ReportDraftInput, ReportFilters } from "@/types";

export const reportKeys = {
  all: ["reports"] as const,
  list: (filters?: ReportFilters) => [...reportKeys.all, "list", filters ?? {}] as const,
  latest: (limit: number) => [...reportKeys.all, "latest", limit] as const,
  detail: (id: string) => [...reportKeys.all, "detail", id] as const,
  related: (id: string) => [...reportKeys.all, "related", id] as const,
  mine: () => [...reportKeys.all, "mine"] as const,
  counts: () => [...reportKeys.all, "counts"] as const,
  statusCounts: () => [...reportKeys.all, "status-counts"] as const,
};

export const useReports = (filters?: ReportFilters) =>
  useQuery({
    queryKey: reportKeys.list(filters),
    queryFn: () => reportsService.list(filters),
  });

export const useLatestReports = (limit = 6) =>
  useQuery({
    queryKey: reportKeys.latest(limit),
    queryFn: () => reportsService.listLatest(limit),
  });

export const useReport = (id?: string) =>
  useQuery({
    queryKey: reportKeys.detail(id ?? ""),
    queryFn: () => reportsService.getById(id as string),
    enabled: Boolean(id),
  });

export const useRelatedReports = (id?: string) =>
  useQuery({
    queryKey: reportKeys.related(id ?? ""),
    queryFn: () => reportsService.getRelated(id as string),
    enabled: Boolean(id),
  });

export const useMyReports = () =>
  useQuery({
    queryKey: reportKeys.mine(),
    queryFn: () => reportsService.listMine(),
  });

export const useReportCounts = () =>
  useQuery({
    queryKey: reportKeys.counts(),
    queryFn: () => reportsService.countByCategory(),
  });

export const useStatusCounts = () =>
  useQuery({
    queryKey: reportKeys.statusCounts(),
    queryFn: () => reportsService.countsByStatus(),
  });

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ReportDraftInput) => reportsService.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reportKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["wall"] });
    },
  });
};

export const useSupportReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reportsService.support(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reportKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["wall"] });
    },
  });
};

export const useReportFeedback = () =>
  useMutation({
    mutationFn: ({ id, useful }: { id: string; useful: boolean }) =>
      reportsService.submitFeedback(id, useful),
  });
