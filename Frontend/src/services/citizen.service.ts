import { respond } from "./api-client";
import {
  CITIZEN,
  CITIZEN_ACTIVITY,
  CITIZEN_PROPOSALS,
  CITIZEN_SUMMARY,
} from "@/data/citizen.mock";

export const citizenService = {
  async getProfile() {
    return respond(() => CITIZEN);
  },

  async getSummary() {
    return respond(() => CITIZEN_SUMMARY);
  },

  async getActivity() {
    return respond(() => CITIZEN_ACTIVITY);
  },

  async getProposals() {
    return respond(() => CITIZEN_PROPOSALS);
  },
};
