import apiClient from "../../api/apiClient";

export const tenantService = {
  getAll() {
    return apiClient.get("Tenants");
  },

  getById(id) {
    return apiClient.get(`Tenants/${id}`);
  },

  add(data) {
    return apiClient.post(`Tenants`, data);
  },

  update(id, data) {
    return apiClient.put(`Tenants/${id}`, data);
  },

  archive(id) {
    return apiClient.delete(`Tenants/${id}`);
  },


  assignUnit(data) {
    return apiClient.post(`Tenants/AssignUnit`, data);
  },

  assignStatus(data) {
    return apiClient.post(`Tenants/AssignStatus`, data);
  },

};
