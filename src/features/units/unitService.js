import apiClient from "../../api/apiClient";

export const unitService = {
  getAll() {
    return apiClient.get("Units");
  },

  getById(id) {
    return apiClient.get(`Units/${id}`);
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
