import apiClient from "../../api/apiClient";

export const unitTypeService = {
  getAll() {
    return apiClient.get("UnitTypes");
  },

  getById(id) {
    return apiClient.get(`UnitTypes/${id}`);
  },

  add(data) {
    return apiClient.post(`UnitType`, data);
  },

  update(id, data) {
    return apiClient.put(`UnitType/${id}`, data);
  },

  archive(id) {
    return apiClient.delete(`UnitType/${id}`);
  },

  byProperty(id) {
    return apiClient.get(`UnitTypes/By-Property/${id}`);
  },

};
