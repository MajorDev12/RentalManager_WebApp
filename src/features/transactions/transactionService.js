import apiClient from "../../api/apiClient";

export const transactionService = {
  getAll() {
    return apiClient.get("Transactions");
  },

  getById(userId) {
    return apiClient.get(`Transactions/${userId}`);
  },

    getByUserId(userId) {
    return apiClient.get(`Transactions/By-User/${userId}`);
  },

  getByTenantId(tenantId) {
    return apiClient.get(`Transactions/By-Tenant/${tenantId}`);
  },

  getTenantBalances(tenantId) {
    return apiClient.get(`Transactions/TenantBalances/${tenantId}`);
  },

  addInvoice(data) {
    return apiClient.post(`Transactions/AddInvoice`, data);
  },

  addPayment(data) {
    return apiClient.post(`Transactions/AddPayment`, data);
  },

  generateRentInvoices(id) {
    return apiClient.post(`Transactions/GenerateRentInvoices/${id}`);
  },

  generateUtilityInvoices(id) {
    return apiClient.post(`Transactions/GenerateUtilityBillInvoices/${id}`);
  },

  unPaidTenants() {
    return apiClient.get(`Transactions/UnpaidTenants`);
  },
  
  update(id, data) {
    return apiClient.put(`Transactions/${id}`, data);
  },

  archive(id) {
    return apiClient.delete(`Transactions/${id}`);
  },

};
