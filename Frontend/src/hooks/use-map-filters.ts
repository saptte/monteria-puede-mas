import { useMemo, useState } from "react";
import type { Report, ReportCategoryId, ReportStatus } from "@/types";

export interface MapFiltersState {
  selectedCategories: ReportCategoryId[];
  appliedCategories: ReportCategoryId[];
  barrio?: string;
  statuses: ReportStatus[];
  query: string;
}

const initialState: MapFiltersState = {
  selectedCategories: [],
  appliedCategories: [],
  barrio: undefined,
  statuses: [],
  query: "",
};

/** Estado de filtros del mapa + reportes visibles y conteos por categoría. */
export function useMapFilters(reports: Report[], initialCategories: ReportCategoryId[] = []) {
  const [filters, setFilters] = useState<MapFiltersState>({
    ...initialState,
    selectedCategories: initialCategories,
    appliedCategories: initialCategories,
  });

  const toggleCategory = (category: ReportCategoryId) => {
    setFilters((current) => ({
      ...current,
      selectedCategories: current.selectedCategories.includes(category)
        ? current.selectedCategories.filter((item) => item !== category)
        : [...current.selectedCategories, category],
    }));
  };

  const toggleStatus = (status: ReportStatus) => {
    setFilters((current) => ({
      ...current,
      statuses: current.statuses.includes(status)
        ? current.statuses.filter((item) => item !== status)
        : [...current.statuses, status],
    }));
  };

  const apply = () =>
    setFilters((current) => ({ ...current, appliedCategories: current.selectedCategories }));

  const clear = () => setFilters(initialState);

  const setBarrio = (barrio?: string) => setFilters((current) => ({ ...current, barrio }));
  const setQuery = (query: string) => setFilters((current) => ({ ...current, query }));

  const visibleReports = useMemo(
    () =>
      reports.filter((report) => {
        if (filters.appliedCategories.length && !filters.appliedCategories.includes(report.category)) {
          return false;
        }
        if (filters.statuses.length && !filters.statuses.includes(report.status)) return false;
        if (filters.barrio && report.barrio !== filters.barrio) return false;
        if (filters.query) {
          const haystack = `${report.title} ${report.barrio} ${report.address} ${report.caseNumber}`.toLowerCase();
          if (!haystack.includes(filters.query.toLowerCase())) return false;
        }
        return true;
      }),
    [filters, reports],
  );

  const countsByCategory = useMemo(
    () =>
      reports.reduce<Record<string, number>>((accumulator, report) => {
        accumulator[report.category] = (accumulator[report.category] ?? 0) + 1;
        return accumulator;
      }, {}),
    [reports],
  );

  const activeFilterCount =
    filters.appliedCategories.length + filters.statuses.length + (filters.barrio ? 1 : 0);

  return {
    filters,
    visibleReports,
    countsByCategory,
    activeFilterCount,
    toggleCategory,
    toggleStatus,
    apply,
    clear,
    setBarrio,
    setQuery,
  };
}
