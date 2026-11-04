import { respond } from "./api-client";
import {
  HOME_STATS,
  KPIS,
  MAP_STATS,
  MONTHLY_SERIES,
  RESPONSE_BREAKDOWN,
  TOPIC_STATS,
  WEEKLY_TOPICS,
  ZONE_STATS,
} from "@/data/stats.mock";

export const statsService = {
  async getKpis() {
    return respond(() => KPIS);
  },

  async getHomeStats() {
    return respond(() => HOME_STATS);
  },

  async getMapStats() {
    return respond(() => MAP_STATS);
  },

  async getZones() {
    return respond(() => ZONE_STATS);
  },

  async getTopics() {
    return respond(() => TOPIC_STATS);
  },

  async getWeeklyTopics() {
    return respond(() => WEEKLY_TOPICS);
  },

  async getMonthlySeries() {
    return respond(() => MONTHLY_SERIES);
  },

  async getResponseBreakdown() {
    return respond(() => RESPONSE_BREAKDOWN);
  },
};
