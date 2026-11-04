import { useQuery } from "@tanstack/react-query";
import { projectsService, type ProjectFilters } from "@/services/projects.service";
import {
  conversationsService,
  type ConversationFilters,
} from "@/services/conversations.service";
import {
  initiativesService,
  type InitiativeFilters,
} from "@/services/initiatives.service";

export const useProjects = (filters?: ProjectFilters) =>
  useQuery({
    queryKey: ["projects", "list", filters ?? {}],
    queryFn: () => projectsService.list(filters),
  });

export const useFeaturedProjects = (limit = 3) =>
  useQuery({
    queryKey: ["projects", "featured", limit],
    queryFn: () => projectsService.listFeatured(limit),
  });

export const useProject = (id?: string) =>
  useQuery({
    queryKey: ["projects", "detail", id ?? ""],
    queryFn: () => projectsService.getById(id as string),
    enabled: Boolean(id),
  });

export const useFollowedProjects = (limit = 4) =>
  useQuery({
    queryKey: ["projects", "followed", limit],
    queryFn: () => projectsService.listFollowed(limit),
  });

export const useConversations = (filters?: ConversationFilters) =>
  useQuery({
    queryKey: ["conversations", "list", filters ?? {}],
    queryFn: () => conversationsService.list(filters),
  });

export const useTrendingConversations = (limit = 4) =>
  useQuery({
    queryKey: ["conversations", "trending", limit],
    queryFn: () => conversationsService.listTrending(limit),
  });

export const useInitiatives = (filters?: InitiativeFilters) =>
  useQuery({
    queryKey: ["initiatives", "list", filters ?? {}],
    queryFn: () => initiativesService.list(filters),
  });

export const useOpenInitiatives = (limit = 4) =>
  useQuery({
    queryKey: ["initiatives", "open", limit],
    queryFn: () => initiativesService.listOpen(limit),
  });
