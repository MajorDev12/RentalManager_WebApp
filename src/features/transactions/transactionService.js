import apiClient from "../../api/apiClient";

export const transactionService = {
  getAll() {
    return apiClient.get("Transactions");
  },

  getById(id) {
    return apiClient.get(`Transactions/${id}`);
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
