import apiClient from "../../api/apiClient";

export const propertyService = {
  getAll() {
    return apiClient.get("properties");
  },

  getById(id) {
    return apiClient.get(`properties/${id}`);
  },
};
