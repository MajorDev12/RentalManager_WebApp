import apiClient from "../../api/apiClient";

export const utilityService = {
  getAll() {
    return apiClient.get("UtilityBills");
  },

  getFiltered(query) {
    return apiClient.get("UtilityBills", query);
  },

  getLookups() {
    return apiClient.get("Lookups");
  },

  getById(id) {
    return apiClient.get(`UtilityBill/${id}`);
  },

  add(data) {
    return apiClient.post(`UtilityBill`, data);
  },

  update(id, data) {
    return apiClient.patch(`UtilityBill/${id}`, data);
  },

  archive(id) {
    return apiClient.delete(`UtilityBill/${id}`);
  },

  getByPropertyId(id) {
    return apiClient.get(`UtilityBill/By-Property/${id}`);
  },

  getByTenantId(id) {
    return apiClient.get(`UtilityBill/By-TenantId/${id}`);
  },
};
