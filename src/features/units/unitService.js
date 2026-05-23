import apiClient from "../../api/apiClient";

export const unitService = {
  getAll() {
    return apiClient.get("Units");
  },

  getFiltered(query) {
    return apiClient.get("Units/Filtered", query);
  },

  getById(id) {
    return apiClient.get(`Units/${id}`);
  },

  getByPropertyId(propertyId) {
    return apiClient.get(`Units/By-Property/${propertyId}`);
  },

  getVacants() {
    return apiClient.get(`Units/Vacants`);
  },

  add(data) {
    return apiClient.post(`Units`, data);
  },

  update(id, data) {
    return apiClient.put(`Units/${id}`, data);
  },

  archive(id) {
    return apiClient.delete(`Units/${id}`);
  },
};
