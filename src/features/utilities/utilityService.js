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

  addReading(data) {
    return apiClient.post(`MeterReading`, data);
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

  getLookupsByPropertyId(id) {
    return apiClient.get(`MeterReadings/properties/${id}/utilities`);
  },

  bulkAddReadings(payload) {
    return apiClient.post("MeterReading/bulk", payload);
  },

  getUtilitySheet(propertyId, utilityId) {
    return apiClient.get(
      `MeterReadings/properties/${propertyId}/utilities/${utilityId}/sheet`,
    );
  },

  getByUnitId(id, isMetered) {
    return apiClient.get(`UtilityBill/By-Unit/${id}`, isMetered);
  },

  getByTenantId(id) {
    return apiClient.get(`UtilityBill/By-TenantId/${id}`);
  },
};
