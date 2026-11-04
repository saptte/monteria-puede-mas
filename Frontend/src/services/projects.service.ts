import { clone, respond } from "./api-client";
import { PROJECTS } from "@/data/projects.mock";
import type { Project, ProjectStatus, ReportCategoryId } from "@/types";

export interface ProjectFilters {
  categories?: ReportCategoryId[];
  status?: ProjectStatus[];
  barrio?: string;
  query?: string;
}

const matches = (project: Project, filters: ProjectFilters = {}) => {
  const { categories, status, barrio, query } = filters;
  if (categories?.length && !categories.includes(project.category)) return false;
  if (status?.length && !status.includes(project.status)) return false;
  if (barrio && project.barrio !== barrio) return false;
  if (query) {
    const haystack = `${project.title} ${project.barrio} ${project.problem} ${project.action}`.toLowerCase();
    if (!haystack.includes(query.toLowerCase())) return false;
  }
  return true;
};

export const projectsService = {
  async list(filters?: ProjectFilters): Promise<Project[]> {
    return respond(() => clone(PROJECTS.filter((project) => matches(project, filters))));
  },

  async listFeatured(limit = 3): Promise<Project[]> {
    return respond(() => clone(PROJECTS.slice(0, limit)));
  },

  async getById(id: string): Promise<Project | null> {
    return respond(() => {
      const project = PROJECTS.find((item) => item.id === id);
      return project ? clone(project) : null;
    });
  },

  async listFollowed(limit = 4): Promise<Project[]> {
    return respond(() => clone(PROJECTS.slice(2, 2 + limit)));
  },
};
