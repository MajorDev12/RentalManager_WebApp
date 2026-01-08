import apiClient from "../../api/apiClient";

export const propertyService = {
  getAll() {
    return apiClient.get("properties");
  },

  getById(id) {
    return apiClient.get(`properties/${id}`);
  },

  add(data) {
    return apiClient.post(`property`, data);
  },

  update(id, data) {
    return apiClient.put(`property/${id}`, data);
  },

  archive(id) {
    return apiClient.put(`property/${id}`);
  },

};
