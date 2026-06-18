import apiClient from "../../api/apiClient";

export const propertyService = {
  getAll() {
    return apiClient.get("properties");
  },

  getLookups() {
    return apiClient.get("lookups/properties");
  },

  getFiltered(query) {
    return apiClient.get("properties", query);
  },

  getUnitTypes(propertyId) {
    return apiClient.get(`properties/${propertyId}/unitTypes`);
  },

  getUtilities(propertyId) {
    return apiClient.get(`properties/${propertyId}/utilities`);
  },

  getById(id) {
    return apiClient.get(`properties/${id}`);
  },

  add(data) {
    return apiClient.post(`property`, data);
  },

  update(id, data) {
    return apiClient.patch(`property/${id}`, data);
  },

  archive(id) {
    return apiClient.delete(`property/${id}`);
  },
};
