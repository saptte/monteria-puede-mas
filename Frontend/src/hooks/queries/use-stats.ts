import { useQuery } from "@tanstack/react-query";
import { statsService } from "@/services/stats.service";
import { citizenService } from "@/services/citizen.service";

export const useKpis = () =>
  useQuery({ queryKey: ["stats", "kpis"], queryFn: () => statsService.getKpis() });

export const useHomeStats = () =>
  useQuery({ queryKey: ["stats", "home"], queryFn: () => statsService.getHomeStats() });

export const useMapStats = () =>
  useQuery({ queryKey: ["stats", "map"], queryFn: () => statsService.getMapStats() });

export const useZones = () =>
  useQuery({ queryKey: ["stats", "zones"], queryFn: () => statsService.getZones() });

export const useTopics = () =>
  useQuery({ queryKey: ["stats", "topics"], queryFn: () => statsService.getTopics() });

export const useWeeklyTopics = () =>
  useQuery({ queryKey: ["stats", "weekly-topics"], queryFn: () => statsService.getWeeklyTopics() });

export const useMonthlySeries = () =>
  useQuery({ queryKey: ["stats", "monthly"], queryFn: () => statsService.getMonthlySeries() });

export const useResponseBreakdown = () =>
  useQuery({
    queryKey: ["stats", "response-breakdown"],
    queryFn: () => statsService.getResponseBreakdown(),
  });

export const useCitizenSummary = () =>
  useQuery({ queryKey: ["citizen", "summary"], queryFn: () => citizenService.getSummary() });

export const useCitizenActivity = () =>
  useQuery({ queryKey: ["citizen", "activity"], queryFn: () => citizenService.getActivity() });

export const useCitizenProposals = () =>
  useQuery({ queryKey: ["citizen", "proposals"], queryFn: () => citizenService.getProposals() });
