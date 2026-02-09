import apiClient from "../../api/apiClient";
import { buildQuery } from "../../helpers/builQuery";

export const reportService = {
  getSummary(filter = {}) {
    const query = buildQuery(filter);
    return apiClient.get(
      query ? `Reports/IncomeSummary?${query}` : "Reports/IncomeSummary"
    );
  },

};
