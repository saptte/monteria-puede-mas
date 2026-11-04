import { clone, respond } from "./api-client";
import { INITIATIVES } from "@/data/initiatives.mock";
import type { Initiative, InitiativeTheme, InitiativeType } from "@/types";

export interface InitiativeFilters {
  themes?: InitiativeTheme[];
  types?: InitiativeType[];
  query?: string;
}

const matches = (initiative: Initiative, filters: InitiativeFilters = {}) => {
  const { themes, types, query } = filters;
  if (themes?.length && !themes.includes(initiative.theme)) return false;
  if (types?.length && !types.includes(initiative.type)) return false;
  if (query) {
    const haystack = `${initiative.title} ${initiative.description} ${initiative.place}`.toLowerCase();
    if (!haystack.includes(query.toLowerCase())) return false;
  }
  return true;
};

export const initiativesService = {
  async list(filters?: InitiativeFilters): Promise<Initiative[]> {
    return respond(() => clone(INITIATIVES.filter((initiative) => matches(initiative, filters))));
  },

  async listOpen(limit = 4): Promise<Initiative[]> {
    return respond(() =>
      clone(INITIATIVES.filter((initiative) => initiative.status !== "finalizada").slice(0, limit)),
    );
  },
};
